import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token = req.headers.authorization?.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null;
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized, no token', data: {} });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.type !== 'access') return res.status(401).json({ success: false, message: 'Token invalid or expired', data: {} });
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) return res.status(401).json({ success: false, message: 'User not found', data: {} });
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Token invalid or expired', data: {} });
    }
};

export const authorizeRoles = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'Forbidden: insufficient permissions', data: {} });
    }
    next();
};