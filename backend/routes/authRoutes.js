import express from 'express';
import { body } from 'express-validator';
import {
    registerUser,
    loginUser,
    refreshToken,
    logoutUser,
    getProfile,
    submitVendorKyc,
} from '../controllers/authController.js';
import uploadMiddleware from '../middleware/uploadMiddleware.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
    '/register',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    registerUser
);
router.post(
    '/login',
    [body('email').isEmail().withMessage('Valid email is required'), body('password').notEmpty().withMessage('Password is required')],
    loginUser
);
router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logoutUser);
router.get('/profile', protect, getProfile);
router.put('/vendor-kyc', protect, authorizeRoles('vendor'), uploadMiddleware, submitVendorKyc);

export default router;