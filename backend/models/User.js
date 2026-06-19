import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: { type: Boolean, default: false }
}, { _id: true });

const vendorProfileSchema = new mongoose.Schema({
    businessName: String,
    village: String,
    craftType: String,
    story: String,
    images: [{ type: String }],
    kycDocs: [{ type: String }],
    kycStatus: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected'],
        default: 'Pending'
    }
}, { _id: false });

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true, select: false },

        role: {
            type: String,
            enum: ['user', 'vendor', 'admin'],
            default: 'user'
        },

        avatar: { type: String, default: '' },
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            }
        ],

        addresses: [addressSchema],

        vendorProfile: vendorProfileSchema,

        refreshToken: { type: String }
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