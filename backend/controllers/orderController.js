import { validationResult } from 'express-validator';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg, data: {} });

        const { items, totalAmount, deliveryAddress } = req.body;
        const orderAmount = Math.round(totalAmount * 100);

        const razorpayOrder = await razorpayInstance.orders.create({ amount: orderAmount, currency: 'INR', receipt: `order_${Date.now()}` });
        if (!razorpayOrder) return res.status(500).json({ success: false, message: 'Unable to create payment order', data: {} });

        const firstProduct = items[0]?.product ? await Product.findById(items[0].product).select('artisan') : null;

        const order = new Order({
            user: req.user.id,
            items,
            totalAmount,
            deliveryAddress,
            razorpayOrderId: razorpayOrder.id,
            status: 'Pending',
            paymentStatus: 'Pending',
            artisan: firstProduct?.artisan,
        });
        await order.save();

        res.json({ success: true, message: 'Order created', data: { orderId: razorpayOrder.id, amount: orderAmount, currency: 'INR' } });
    } catch (error) {
        next(error);
    }
};

export const verifyOrder = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const order = await Order.findOne({ razorpayOrderId: razorpay_order_id, user: req.user.id });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found', data: {} });

        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            order.status = 'Failed';
            order.paymentStatus = 'Failed';
            await order.save();
            return res.status(400).json({ success: false, message: 'Payment verification failed', data: {} });
        }

        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        order.status = 'Paid';
        order.paymentStatus = 'Paid';
        await order.save();

        res.json({ success: true, message: 'Payment verified', data: { order } });
    } catch (error) {
        next(error);
    }
};

export const getUserOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json({ success: true, message: 'User orders loaded', data: { orders } });
    } catch (error) {
        next(error);
    }
};

export const getVendorOrders = async (req, res, next) => {
    try {
        const products = await Product.find({ artisan: req.user.id }).select('_id');
        const productIds = products.map((product) => product._id);
        const orders = await Order.find({ 'items.product': { $in: productIds } }).sort({ createdAt: -1 });
        res.json({ success: true, message: 'Vendor orders loaded', data: { orders } });
    } catch (error) {
        next(error);
    }
};