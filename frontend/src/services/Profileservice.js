import api from './api.js';
 
export const updateProfile = async (data) => {
    try {
        const response = await api.put('/profile', data);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message, data: {} };
    }
};
 
export const fetchAddresses = async () => {
    try {
        const response = await api.get('/profile/addresses');
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message, data: {} };
    }
};
 
export const addAddress = async (data) => {
    try {
        const response = await api.post('/profile/addresses', data);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message, data: {} };
    }
};
 
export const updateAddress = async (addressId, data) => {
    try {
        const response = await api.put(`/profile/addresses/${addressId}`, data);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message, data: {} };
    }
};
 
export const deleteAddress = async (addressId) => {
    try {
        const response = await api.delete(`/profile/addresses/${addressId}`);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message, data: {} };
    }
};
 
export const fetchWishlist = async () => {
    try {
        const response = await api.get('/profile/wishlist');
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message, data: {} };
    }
};
 
export const addToWishlist = async (productId) => {
    try {
        const response = await api.post(`/profile/wishlist/${productId}`);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message, data: {} };
    }
};
 
export const removeFromWishlist = async (productId) => {
    try {
        const response = await api.delete(`/profile/wishlist/${productId}`);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message, data: {} };
    }
};
 