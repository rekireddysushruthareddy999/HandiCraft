import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        items: [orderItemSchema],
        totalAmount: { type: Number, required: true },
        deliveryAddress: {
            label: { type: String },
            fullName: { type: String },
            phone: { type: String },
            line1: { type: String },
            line2: { type: String },
            city: { type: String },
            state: { type: String },
            postalCode: { type: String },
            country: { type: String },
        },
        paymentMethod: { type: String, default: 'Razorpay' },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Paid', 'Failed'],
            default: 'Pending',
        },
        razorpayOrderId: { type: String },
        razorpayPaymentId: { type: String },
        razorpaySignature: { type: String },
        status: {
            type: String,
            enum: ['Pending', 'Paid', 'Failed'],
            default: 'Pending',
        },
        artisan: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;