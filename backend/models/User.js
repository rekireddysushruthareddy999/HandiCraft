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
        wishlist: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
],

addresses: [
    {
        name: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        pincode: String,
        isDefault: { type: Boolean, default: false }
    }
],

avatar: { type: String }
    },
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
