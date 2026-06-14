import express from 'express';
import { body } from 'express-validator';
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProductById,
    getVendorProfile,
} from '../controllers/productController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/vendor/:vendorId', getVendorProfile);
router.get('/:id', getProductById);
router.post(
    '/',
    protect,
    authorizeRoles('vendor'),
    [
        body('name').notEmpty().withMessage('Product name is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than zero'),
        body('stock').isInt({ gt: -1 }).withMessage('Stock must be a non-negative integer'),
    ],
    createProduct
);
router.put(
    '/:id',
    protect,
    authorizeRoles('vendor'),
    [
        body('name').notEmpty().withMessage('Product name is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than zero'),
        body('stock').isInt({ gt: -1 }).withMessage('Stock must be a non-negative integer'),
    ],
    updateProduct
);
router.delete('/:id', protect, authorizeRoles('vendor', 'admin'), deleteProduct);

export default router;
