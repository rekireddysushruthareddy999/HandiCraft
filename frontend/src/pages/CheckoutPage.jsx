import { useMemo, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { createOrder, verifyPayment } from '../services/orderService.js';
import { fetchAddresses } from '../services/profileService.js';

const CheckoutPage = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [addresses, setAddresses] = useState([]);
    const [addressesLoading, setAddressesLoading] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState('');

    useEffect(() => {
        const loadAddresses = async () => {
            setAddressesLoading(true);
            const response = await fetchAddresses();
            setAddressesLoading(false);
            if (response.success) {
                const loaded = response.data.addresses || [];
                setAddresses(loaded);
                const def = loaded.find((a) => a.isDefault) || loaded[0];
                if (def) setSelectedAddressId(def._id);
            }
        };
        loadAddresses();
    }, []);

    const selectedAddress = addresses.find((a) => a._id === selectedAddressId) || null;

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
            deliveryAddress: selectedAddress
                ? {
                    label: selectedAddress.label,
                    fullName: selectedAddress.fullName,
                    phone: selectedAddress.phone,
                    line1: selectedAddress.line1,
                    line2: selectedAddress.line2,
                    city: selectedAddress.city,
                    state: selectedAddress.state,
                    postalCode: selectedAddress.postalCode,
                    country: selectedAddress.country,
                }
                : undefined,
        }),
        [cartItems, cartTotal, selectedAddress]
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
        if (!selectedAddress) {
            setMessage('Please select a delivery address before paying.');
            return;
        }
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

                <div className="checkout-section">
                    <h3>Delivery address</h3>
                    {addressesLoading ? (
                        <div className="loader" role="status">Loading addresses...</div>
                    ) : addresses.length ? (
                        <div className="address-picker">
                            {addresses.map((address) => (
                                <label
                                    key={address._id}
                                    className={`address-option${selectedAddressId === address._id ? ' address-option--selected' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="deliveryAddress"
                                        value={address._id}
                                        checked={selectedAddressId === address._id}
                                        onChange={() => setSelectedAddressId(address._id)}
                                    />
                                    <div>
                                        <p><strong>{address.label}</strong>{address.isDefault && <span className="badge" style={{ marginLeft: 6 }}>Default</span>}</p>
                                        <p>{address.fullName} · {address.phone}</p>
                                        <p className="small">{address.line1}{address.line2 ? `, ${address.line2}` : ''}, {address.city}, {address.state} {address.postalCode}, {address.country}</p>
                                    </div>
                                </label>
                            ))}
                            <Link to="/profile" className="button button--ghost" style={{ display: 'inline-block', marginTop: 8 }}>
                                + Add new address
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <p className="muted">You have no saved addresses.</p>
                            <Link to="/profile" className="button button--primary" style={{ display: 'inline-block', marginTop: 8 }}>
                                Add a delivery address
                            </Link>
                        </div>
                    )}
                </div>

                <div className="checkout-section">
                    <h3>Order summary</h3>
                    <div className="checkout-summary">
                        {cartItems.map((item) => (
                            <div key={item.productId} className="checkout-item">
                                <span>{item.name} x {item.qty}</span>
                                <strong>₹{(item.price * item.qty).toFixed(0)}</strong>
                            </div>
                        ))}
                    </div>
                    <p className="price">Grand total: ₹{cartTotal.toFixed(0)}</p>
                </div>

                <button
                    className="button button--primary"
                    disabled={loading || !selectedAddress}
                    onClick={handleCheckout}
                >
                    {loading ? 'Processing...' : 'Pay with Razorpay'}
                </button>
                {message && <p className="alert" role="status">{message}</p>}
            </div>
        </section>
    );
};

export default CheckoutPage;