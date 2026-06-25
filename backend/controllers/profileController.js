import { validationResult } from 'express-validator';
import User from '../models/User.js';
import Product from '../models/Product.js';

export const updateProfile = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg, data: {} });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found', data: {} });

        const { name, avatar } = req.body;
        if (name !== undefined) user.name = name;
        if (avatar !== undefined) user.avatar = avatar;

        await user.save();
        const safeUser = await User.findById(user._id).select('-password -refreshToken');
        res.json({ success: true, message: 'Profile updated', data: { user: safeUser } });
    } catch (error) {
        next(error);
    }
};

// ---------- Addresses ----------

export const getAddresses = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('addresses');
        res.json({ success: true, message: 'Addresses loaded', data: { addresses: user.addresses || [] } });
    } catch (error) {
        next(error);
    }
};

export const addAddress = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg, data: {} });

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found', data: {} });

        const { label, fullName, phone, line1, line2, city, state, postalCode, country, isDefault } = req.body;
        const newAddress = { label, fullName, phone, line1, line2, city, state, postalCode, country, isDefault: !!isDefault };

        if (newAddress.isDefault || user.addresses.length === 0) {
            user.addresses.forEach((addr) => { addr.isDefault = false; });
            newAddress.isDefault = true;
        }

        user.addresses.push(newAddress);
        await user.save();
        res.status(201).json({ success: true, message: 'Address added', data: { addresses: user.addresses } });
    } catch (error) {
        next(error);
    }
};

export const updateAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found', data: {} });

        const address = user.addresses.id(req.params.addressId);
        if (!address) return res.status(404).json({ success: false, message: 'Address not found', data: {} });

        const { label, fullName, phone, line1, line2, city, state, postalCode, country, isDefault } = req.body;
        if (label !== undefined) address.label = label;
        if (fullName !== undefined) address.fullName = fullName;
        if (phone !== undefined) address.phone = phone;
        if (line1 !== undefined) address.line1 = line1;
        if (line2 !== undefined) address.line2 = line2;
        if (city !== undefined) address.city = city;
        if (state !== undefined) address.state = state;
        if (postalCode !== undefined) address.postalCode = postalCode;
        if (country !== undefined) address.country = country;

        if (isDefault) {
            user.addresses.forEach((addr) => { addr.isDefault = addr._id.equals(address._id); });
        }

        await user.save();
        res.json({ success: true, message: 'Address updated', data: { addresses: user.addresses } });
    } catch (error) {
        next(error);
    }
};

export const deleteAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found', data: {} });

        const address = user.addresses.id(req.params.addressId);
        if (!address) return res.status(404).json({ success: false, message: 'Address not found', data: {} });

        const wasDefault = address.isDefault;
        address.deleteOne();

        if (wasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();
        res.json({ success: true, message: 'Address removed', data: { addresses: user.addresses } });
    } catch (error) {
        next(error);
    }
};

// ---------- Wishlist ----------

export const getWishlist = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'wishlist',
            populate: { path: 'artisan', select: 'name vendorProfile' },
        });
        res.json({ success: true, message: 'Wishlist loaded', data: { wishlist: user.wishlist || [] } });
    } catch (error) {
        next(error);
    }
};

export const addToWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found', data: {} });

        const user = await User.findById(req.user.id);
        if (!user.wishlist.some((id) => id.toString() === productId)) {
            user.wishlist.push(productId);
            await user.save();
        }

        res.json({ success: true, message: 'Added to wishlist', data: { wishlist: user.wishlist } });
    } catch (error) {
        next(error);
    }
};

export const removeFromWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.user.id);
        user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
        await user.save();
        res.json({ success: true, message: 'Removed from wishlist', data: { wishlist: user.wishlist } });
    } catch (error) {
        next(error);
    }
};