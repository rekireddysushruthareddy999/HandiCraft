import express from 'express';
import { body } from 'express-validator';
import {
    updateProfile,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
} from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.put('/', [body('name').optional().notEmpty().withMessage('Name cannot be empty')], updateProfile);

router.get('/addresses', getAddresses);
router.post(
    '/addresses',
    [
        body('fullName').notEmpty().withMessage('Full name is required'),
        body('phone').notEmpty().withMessage('Phone number is required'),
        body('line1').notEmpty().withMessage('Address line 1 is required'),
        body('city').notEmpty().withMessage('City is required'),
        body('state').notEmpty().withMessage('State is required'),
        body('postalCode').notEmpty().withMessage('Postal code is required'),
    ],
    addAddress
);
router.put('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);

router.get('/wishlist', getWishlist);
router.post('/wishlist/:productId', addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);

export default router;