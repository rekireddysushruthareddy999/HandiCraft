import { validationResult } from 'express-validator';
import User from '../models/User.js';
import Order from '../models/Order.js';

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password -refreshToken');
        res.json({ success: true, message: 'All users loaded', data: { users } });
    } catch (error) {
        next(error);
    }
};

export const getAllVendors = async (req, res, next) => {
    try {
        const vendors = await User.find({ role: 'vendor' }).select('-password -refreshToken');
        res.json({ success: true, message: 'Vendors loaded', data: { vendors } });
    } catch (error) {
        next(error);
    }
};

export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json({ success: true, message: 'Orders loaded', data: { orders } });
    } catch (error) {
        next(error);
    }
};

export const updateVendorStatus = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg, data: {} });

        const { vendorId } = req.params;
        const { kycStatus } = req.body;
        const vendor = await User.findById(vendorId);
        if (!vendor || vendor.role !== 'vendor') return res.status(404).json({ success: false, message: 'Vendor not found', data: {} });

        vendor.vendorProfile.kycStatus = kycStatus;
        await vendor.save();
        res.json({ success: true, message: `Vendor status updated to ${kycStatus}`, data: { vendor } });
    } catch (error) {
        next(error);
    }
};
