import express from 'express';
import { body } from 'express-validator';
import {
    getAllUsers,
    getAllVendors,
    getAllOrders,
    updateVendorStatus,
} from '../controllers/adminController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorizeRoles('admin'));
router.get('/users', getAllUsers);
router.get('/vendors', getAllVendors);
router.get('/orders', getAllOrders);
router.put(
    '/vendors/:vendorId/status',
    [body('kycStatus').isIn(['Pending', 'Verified', 'Rejected']).withMessage('Invalid KYC status')],
    updateVendorStatus
);

export default router;
