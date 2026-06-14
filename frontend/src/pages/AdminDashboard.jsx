import { useEffect, useState } from 'react';
import { fetchAdminVendors, fetchAdminOrders, updateVendorStatus } from '../services/adminService.js';

const AdminDashboard = () => {
    const [vendors, setVendors] = useState([]);
    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const loadAdminData = async () => {
            const vendorResponse = await fetchAdminVendors();
            const orderResponse = await fetchAdminOrders();
            if (vendorResponse.success) setVendors(vendorResponse.data.vendors);
            if (orderResponse.success) setOrders(orderResponse.data.orders);
        };
        loadAdminData();
    }, []);

    const handleStatusChange = async (vendorId, status) => {
        const response = await updateVendorStatus(vendorId, status);
        if (response.success) {
            setVendors((current) => current.map((vendor) => (vendor._id === vendorId ? response.data.vendor : vendor)));
            setMessage('Vendor status updated.');
        } else {
            setMessage(response.message);
        }
    };

    return (
        <section className="page page--admin">
            <h1>Admin Panel</h1>
            {message && <p className="alert">{message}</p>}
            <div className="admin-grid">
                <div className="admin-card">
                    <h2>Vendor KYC Requests</h2>
                    {vendors.length ? vendors.map((vendor) => (
                        <div key={vendor._id} className="admin-row">
                            <span>{vendor.name}</span>
                            <span>{vendor.vendorProfile?.kycStatus || 'Pending'}</span>
                            <div>
                                <button className="button button--ghost" onClick={() => handleStatusChange(vendor._id, 'Verified')}>Approve</button>
                                <button className="button button--ghost" onClick={() => handleStatusChange(vendor._id, 'Rejected')}>Reject</button>
                            </div>
                        </div>
                    )) : <p>No vendors available.</p>}
                </div>
                <div className="admin-card">
                    <h2>Recent orders</h2>
                    {orders.length ? orders.slice(0, 6).map((order) => (
                        <div key={order._id} className="order-card">
                            <p>{order._id}</p>
                            <p>{order.status}</p>
                            <p>₹{order.totalAmount.toFixed(0)}</p>
                        </div>
                    )) : <p>No orders yet.</p>}
                </div>
            </div>
        </section>
    );
};

export default AdminDashboard;
