import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const vendorProfileSchema = new mongoose.Schema({
    businessName: { type: String },
    village: { type: String },
    craftType: { type: String },
    story: { type: String },
    images: [{ type: String }],
    kycDocs: [{ type: String }],
    kycStatus: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected'],
        default: 'Pending',
    },
});

const addressSchema = new mongoose.Schema({
    label: { type: String, default: 'Home' },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'India' },
    isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ['user', 'vendor', 'admin'],
            default: 'user',
        },
        avatar: { type: String },
        vendorProfile: vendorProfileSchema,
        addresses: [addressSchema],
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
        refreshToken: { type: String },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;