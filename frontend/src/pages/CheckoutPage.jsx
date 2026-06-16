import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { createOrder, verifyPayment } from '../services/orderService.js';

const CheckoutPage = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const orderPayload = useMemo(
        () => ({
            items: cartItems.map((item) => ({
                product: item.productId,
                name: item.name,
                qty: item.qty,
                price: item.price,
                image: item.image,
            })),
            totalAmount: cartTotal,
        }),
        [cartItems, cartTotal]
    );

    const loadRazorpayScript = () => new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

    const handleCheckout = async () => {
        setLoading(true);
        setMessage('Creating payment order...');
        const response = await createOrder(orderPayload);
        if (!response.success) {
            setLoading(false);
            setMessage(response.message);
            return;
        }

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
            setLoading(false);
            setMessage('Unable to load payment gateway.');
            return;
        }

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: response.data.amount,
            currency: response.data.currency,
            order_id: response.data.orderId,
            name: 'Artisan Handicraft',
            description: 'Purchase handcrafted goods',
            handler: async (paymentResult) => {
                const verifyResponse = await verifyPayment(paymentResult);
                setLoading(false);
                if (verifyResponse.success) {
                    clearCart();
                    navigate('/orders');
                } else {
                    setMessage(verifyResponse.message);
                }
            },
            theme: { color: '#c08552' },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    if (!cartItems.length) return <div className="empty-state">Your cart is empty.</div>;

    return (
        <section className="page page--checkout">
            <div className="checkout-card">
                <h2>Checkout</h2>
                <div className="checkout-summary">
                    {cartItems.map((item) => (
                        <div key={item.productId} className="checkout-item">
                            <span>{item.name} x {item.qty}</span>
                            <strong>₹{(item.price * item.qty).toFixed(0)}</strong>
                        </div>
                    ))}
                </div>
                <p className="price">Grand total: ₹{cartTotal.toFixed(0)}</p>
                <button className="button button--primary" disabled={loading} onClick={handleCheckout}>{loading ? 'Processing...' : 'Pay with Razorpay'}</button>
                {message && <p className="alert" role="status">{message}</p>}
            </div>
        </section>
    );
};

export default CheckoutPage;
