import { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../services/authService.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('artisanUser')) || null);
    const [token, setToken] = useState(() => localStorage.getItem('artisanToken') || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem('artisanUser', JSON.stringify(user));
    }, [user]);

    useEffect(() => {
        if (token) localStorage.setItem('artisanToken', token);
        else localStorage.removeItem('artisanToken');
    }, [token]);

    const login = async (credentials) => {
        setLoading(true);
        const response = await authService.login(credentials);
        setLoading(false);
        if (response.success) {
            setUser(response.data.user);
            setToken(response.data.tokens.accessToken);
        }
        return response;
    };

    const register = async (payload) => {
        setLoading(true);
        const response = await authService.register(payload);
        setLoading(false);
        if (response.success) {
            setUser(response.data.user);
            setToken(response.data.tokens.accessToken);
        }
        return response;
    };

    const logout = async () => {
        await authService.logout(token);
        setUser(null);
        setToken('');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
