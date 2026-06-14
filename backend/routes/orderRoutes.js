import express from 'express';
import { body } from 'express-validator';
import {
    createOrder,
    verifyOrder,
    getUserOrders,
    getVendorOrders,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
    '/create',
    protect,
    [body('items').isArray({ min: 1 }).withMessage('Cart items are required'), body('totalAmount').isFloat({ gt: 0 }).withMessage('Total amount is required')],
    createOrder
);
router.post('/verify', protect, verifyOrder);
router.get('/user', protect, getUserOrders);
router.get('/vendor', protect, getVendorOrders);

export default router;
