import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    getMe,
    updateProfile,
    addAddress,
    deleteAddress,
    toggleWishlist
} from '../controllers/userController.js';

const router = express.Router();

router.get('/me', protect, getMe);
router.put('/update', protect, updateProfile);

router.post('/address', protect, addAddress);
router.delete('/address/:id', protect, deleteAddress);

router.post('/wishlist/:productId', protect, toggleWishlist);

export default router;