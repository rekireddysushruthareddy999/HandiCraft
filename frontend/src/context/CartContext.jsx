import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => JSON.parse(localStorage.getItem('artisanCart')) || []);

    useEffect(() => {
        localStorage.setItem('artisanCart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item) => {
        setCartItems((prev) => {
            const existing = prev.find((cartItem) => cartItem.productId === item.productId);
            if (existing) {
                return prev.map((cartItem) => (cartItem.productId === item.productId ? { ...cartItem, qty: cartItem.qty + item.qty } : cartItem));
            }
            return [...prev, item];
        });
    };

    const updateQty = (productId, qty) => {
        setCartItems((prev) => prev.map((item) => (item.productId === productId ? { ...item, qty } : item)).filter((item) => item.qty > 0));
    };

    const removeFromCart = (productId) => {
        setCartItems((prev) => prev.filter((item) => item.productId !== productId));
    };

    const clearCart = () => setCartItems([]);
    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQty, removeFromCart, clearCart, cartCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
