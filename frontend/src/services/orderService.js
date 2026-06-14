import api from './api.js';

export const createOrder = async (payload) => {
    try {
        const response = await api.post('/orders/create', payload);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message, data: {} };
    }
};

export const verifyPayment = async (payload) => {
    try {
        const response = await api.post('/orders/verify', payload);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message, data: {} };
    }
};

export const fetchOrders = async () => {
    try {
        const response = await api.get('/orders/user');
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message, data: {} };
    }
};

export const fetchVendorOrders = async () => {
    try {
        const response = await api.get('/orders/vendor');
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message, data: {} };
    }
};
