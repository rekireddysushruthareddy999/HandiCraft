import api from './api.js';

export const fetchAdminVendors = async () => {
    try {
        const response = await api.get('/admin/vendors');
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message, data: {} };
    }
};

export const fetchAdminOrders = async () => {
    try {
        const response = await api.get('/admin/orders');
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message, data: {} };
    }
};

export const updateVendorStatus = async (vendorId, kycStatus) => {
    try {
        const response = await api.put(`/admin/vendors/${vendorId}/status`, { kycStatus });
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message, data: {} };
    }
};
