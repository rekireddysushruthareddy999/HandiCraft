import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('artisanUser'));

const cartKey = user
    ? `artisanCart_${user.id}`
    : 'artisanCart_guest';

    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
        setCartItems(savedCart);
    }, [cartKey]);

    useEffect(() => {
        localStorage.setItem(cartKey, JSON.stringify(cartItems));
    }, [cartItems, cartKey]);

    const addToCart = (item) => {
        setCartItems((prev) => {
            const existing = prev.find(
                (cartItem) => cartItem.productId === item.productId
            );

            if (existing) {
                return prev.map((cartItem) =>
                    cartItem.productId === item.productId
                        ? { ...cartItem, qty: cartItem.qty + item.qty }
                        : cartItem
                );
            }

            return [...prev, item];
        });
    };

    const updateQty = (productId, qty) => {
        setCartItems((prev) =>
            prev
                .map((item) =>
                    item.productId === productId
                        ? { ...item, qty }
                        : item
                )
                .filter((item) => item.qty > 0)
        );
    };

    const removeFromCart = (productId) => {
        setCartItems((prev) =>
            prev.filter((item) => item.productId !== productId)
        );
    };

    const clearCart = () => setCartItems([]);

    const cartCount = cartItems.reduce(
        (acc, item) => acc + item.qty,
        0
    );

    const cartTotal = cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                updateQty,
                removeFromCart,
                clearCart,
                cartCount,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);