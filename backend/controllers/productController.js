import { validationResult } from 'express-validator';
import Product from '../models/Product.js';
import User from '../models/User.js';

export const getProducts = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 12;
        const keyword = req.query.search ? { name: { $regex: req.query.search, $options: 'i' } } : {};
        const categoryFilter = req.query.category ? { categories: req.query.category } : {};
        const artisanFilter = req.query.artisan ? { artisan: req.query.artisan } : {};
        const priceFilter = {};
        if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
        if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
        const priceQuery = Object.keys(priceFilter).length ? { price: priceFilter } : {};

        const count = await Product.countDocuments({ ...keyword, ...categoryFilter, ...artisanFilter, ...priceQuery });
        const products = await Product.find({ ...keyword, ...categoryFilter, ...artisanFilter, ...priceQuery })
            .populate('artisan', 'name vendorProfile craftType')
            .skip(limit * (page - 1))
            .limit(limit)
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            message: 'Products fetched',
            data: { products, page, pages: Math.ceil(count / limit), count },
        });
    } catch (error) {
        next(error);
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('artisan', 'name vendorProfile craftType');
        if (!product) return res.status(404).json({ success: false, message: 'Product not found', data: {} });
        res.json({ success: true, message: 'Product details loaded', data: { product } });
    } catch (error) {
        next(error);
    }
};

export const getVendorProfile = async (req, res, next) => {
    try {
        const vendor = await User.findById(req.params.vendorId).select('-password -refreshToken');
        if (!vendor || vendor.role !== 'vendor') return res.status(404).json({ success: false, message: 'Vendor not found', data: {} });
        const products = await Product.find({ artisan: vendor._id }).sort({ createdAt: -1 });
        res.json({ success: true, message: 'Vendor profile loaded', data: { vendor, products } });
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg, data: {} });

        const { name, description, price, categories, stock, images } = req.body;
        const imageArray = typeof images === 'string' ? [images] : images || [];

        const product = new Product({
            name,
            description,
            price,
            categories: typeof categories === 'string' ? categories.split(',').map((item) => item.trim()) : categories || [],
            stock,
            images: imageArray,
            artisan: req.user.id,
        });

        await product.save();
        res.status(201).json({ success: true, message: 'Product created', data: { product } });
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg, data: {} });

        const { name, description, price, categories, stock, images } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found', data: {} });
        if (product.artisan.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to update this product', data: {} });
        }

        product.name = name;
        product.description = description;
        product.price = price;
        product.categories = typeof categories === 'string' ? categories.split(',').map((item) => item.trim()) : categories || [];
        product.stock = stock;
        product.images = typeof images === 'string' ? [images] : images || product.images;

        await product.save();
        res.json({ success: true, message: 'Product updated', data: { product } });
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found', data: {} });
        if (product.artisan.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this product', data: {} });
        }

        await product.deleteOne();
        res.json({ success: true, message: 'Product deleted', data: {} });
    } catch (error) {
        next(error);
    }
};
