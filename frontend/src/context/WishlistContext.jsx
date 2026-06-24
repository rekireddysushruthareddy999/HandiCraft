import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext.jsx';
import * as profileService from '../services/profileService.js';
 
const WishlistContext = createContext();
 
export const WishlistProvider = ({ children }) => {
    const { token } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);
 
    const loadWishlist = useCallback(async () => {
        if (!token) {
            setWishlist([]);
            return;
        }
        setLoading(true);
        const response = await profileService.fetchWishlist();
        setLoading(false);
        if (response.success) setWishlist(response.data.wishlist || []);
    }, [token]);
 
    useEffect(() => {
        loadWishlist();
    }, [loadWishlist]);
 
    const isWishlisted = (productId) => wishlist.some((item) => item._id === productId);
 
    const addToWishlist = async (productId) => {
        const response = await profileService.addToWishlist(productId);
        if (response.success) await loadWishlist();
        return response;
    };
 
    const removeFromWishlist = async (productId) => {
        const response = await profileService.removeFromWishlist(productId);
        if (response.success) setWishlist((prev) => prev.filter((item) => item._id !== productId));
        return response;
    };
 
    const toggleWishlist = async (productId) => {
        if (isWishlisted(productId)) return removeFromWishlist(productId);
        return addToWishlist(productId);
    };
 
    return (
        <WishlistContext.Provider
            value={{ wishlist, loading, isWishlisted, addToWishlist, removeFromWishlist, toggleWishlist, refreshWishlist: loadWishlist }}
        >
            {children}
        </WishlistContext.Provider>
    );
};
 
export const useWishlist = () => useContext(WishlistContext);