import api from './api.js';

export const login = async (data) => {
    try {
        const response = await api.post('/auth/login', data);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message, data: {} };
    }
};

export const register = async (data) => {
    try {
        const response = await api.post('/auth/register', data);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message, data: {} };
    }
};

export const logout = async (token) => {
    try {
        const response = await api.post(
            '/auth/logout',
            {},
            token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
        );
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || error.message, data: {} };
    }
};