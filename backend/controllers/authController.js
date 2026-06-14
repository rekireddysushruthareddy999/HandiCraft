import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createTokenPair } from '../utils/tokenUtils.js';

const generateToken = (payload, secret, expiresIn) => jwt.sign(payload, secret, { expiresIn });

export const registerUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg, data: {} });

        const { name, email, password, role, businessName, village, craftType, story } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ success: false, message: 'Email already registered', data: {} });

        const user = new User({ name, email, password, role: role || 'user' });
        if (role === 'vendor') {
            user.vendorProfile = {
                businessName,
                village,
                craftType,
                story,
                kycStatus: 'Pending',
            };
        }

        await user.save();
        const tokens = await createTokenPair(user);
        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.status(201).json({ success: true, message: 'Registration successful', data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, tokens } });
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg, data: {} });

        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password', data: {} });
        }

        const tokens = await createTokenPair(user);
        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.json({ success: true, message: 'Login successful', data: { user: { id: user._id, name: user.name, email: user.email, role: user.role, vendorProfile: user.vendorProfile }, tokens } });
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token is required', data: {} });

        const user = await User.findOne({ refreshToken });
        if (!user) return res.status(401).json({ success: false, message: 'Invalid refresh token', data: {} });

        jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
            if (err || decoded.id !== user._id.toString()) {
                return res.status(401).json({ success: false, message: 'Refresh token invalid', data: {} });
            }
            const tokens = await createTokenPair(user);
            user.refreshToken = tokens.refreshToken;
            await user.save();
            res.json({ success: true, message: 'Token refreshed', data: { tokens } });
        });
    } catch (error) {
        next(error);
    }
};

export const logoutUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.refreshToken = null;
            await user.save();
        }
        res.json({ success: true, message: 'Logout successful', data: {} });
    } catch (error) {
        next(error);
    }
};

export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password -refreshToken');
        if (!user) return res.status(404).json({ success: false, message: 'User not found', data: {} });
        res.json({ success: true, message: 'Profile loaded', data: { user } });
    } catch (error) {
        next(error);
    }
};

export const submitVendorKyc = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found', data: {} });
        if (user.role !== 'vendor') return res.status(403).json({ success: false, message: 'Only vendors can submit KYC', data: {} });

        const files = Array.isArray(req.files) ? req.files.map((file) => `/uploads/${file.filename}`) : [];
        if (files.length > 0) {
            user.vendorProfile.kycDocs = [...(user.vendorProfile.kycDocs || []), ...files];
            user.vendorProfile.kycStatus = 'Pending';
            await user.save();
        }

        res.json({ success: true, message: 'KYC documents uploaded', data: { vendorProfile: user.vendorProfile } });
    } catch (error) {
        next(error);
    }
};
