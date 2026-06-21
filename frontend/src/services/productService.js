import api from './api.js';

export const fetchProducts = async (params) => {
    try {
        const response = await api.get('/products', { params });
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message, data: {} };
    }
};

export const fetchProduct = async (id) => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message, data: {} };
    }
};

export const fetchVendorProfile = async (vendorId) => {
    try {
        const response = await api.get(`/products/vendor/${vendorId}`);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message, data: {} };
    }
};

export const createProduct = async (data) => {
    try {
        const response = await api.post('/products', data);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message, data: {} };
    }
};

export const deleteProduct = async (productId) => {
    try {
        const response = await api.delete(`/products/${productId}`);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message, data: {} };
    }
};