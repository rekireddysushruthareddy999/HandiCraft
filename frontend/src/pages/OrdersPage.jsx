import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchOrders, fetchVendorOrders } from '../services/orderService.js';

const OrdersPage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const loadOrders = async () => {
            setLoading(true);
            const response = user?.role === 'vendor' ? await fetchVendorOrders() : await fetchOrders();
            setLoading(false);
            if (response.success) setOrders(response.data.orders);
            else setMessage(response.message);
        };
        if (user) loadOrders();
    }, [user]);

    if (loading) return <div className="loader" role="status">Loading orders...</div>;
    if (!orders.length) return <div className="empty-state">{message || 'No orders yet.'}</div>;

    return (
        <section className="page page--orders">
            <h1>{user?.role === 'vendor' ? 'Vendor Dashboard' : 'Your orders'}</h1>
            <div className="order-list">
                {orders.map((order) => (
                    <div key={order._id} className="order-card">
                        <div>
                            <p><strong>Order ID:</strong> {order._id}</p>
                            <p><strong>Status:</strong> {order.status}</p>
                            <p><strong>Total:</strong> ₹{Number(order.totalAmount || 0).toFixed(0)}</p>
                        </div>
                        <div>
                            <p><strong>Payment:</strong> {order.paymentStatus}</p>
                            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default OrdersPage;