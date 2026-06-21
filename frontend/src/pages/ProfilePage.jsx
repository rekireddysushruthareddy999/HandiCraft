import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api.js';

// FETCH USER
const fetchUser = async () => {
    const res = await api.get('/users/me');
    return res.data.data.user;
};

const ProfilePage = () => {
    const queryClient = useQueryClient();
    const [tab, setTab] = useState('profile');

    const { data: user, isLoading } = useQuery({
        queryKey: ['me'],
        queryFn: fetchUser
    });

    const [form, setForm] = useState({ name: '' });

    const [address, setAddress] = useState({
        name: '',
        phone: '',
        city: '',
        state: '',
        pincode: ''
    });

    // INIT FORM WHEN USER LOADS
    if (user && form.name === '') {
        setForm({ name: user.name });
    }

    // UPDATE PROFILE
    const updateProfile = async () => {
        await api.put('/users/update', form);
        queryClient.invalidateQueries(['me']);
    };

    // ADD ADDRESS
    const addAddress = async () => {
        await api.post('/users/address', address);
        setAddress({ name: '', phone: '', city: '', state: '', pincode: '' });
        queryClient.invalidateQueries(['me']);
    };

    // DELETE ADDRESS
    const deleteAddress = async (id) => {
        await api.delete(`/users/address/${id}`);
        queryClient.invalidateQueries(['me']);
    };

    // SET DEFAULT ADDRESS
    const setDefault = async (id) => {
        await api.put(`/users/address/default/${id}`);
        queryClient.invalidateQueries(['me']);
    };

    // AVATAR UPLOAD (optimistic refresh)
    const uploadAvatar = async (file) => {
        const formData = new FormData();
        formData.append('avatar', file);

        await api.post('/users/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        queryClient.invalidateQueries(['me']);
    };

    if (isLoading) {
        return <div className="page">Loading profile...</div>;
    }

    return (
        <div className="page profile-v3">

            {/* HEADER */}
            <div className="profile-header">

                <img
                    src={user.avatar || "https://via.placeholder.com/120"}
                    className="avatar"
                />

                <div>
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                    <span className="badge">{user.role}</span>
                </div>

                <input
                    type="file"
                    onChange={(e) => uploadAvatar(e.target.files[0])}
                />
            </div>

            {/* TABS */}
            <div className="tabs">
                <button onClick={() => setTab('profile')}>Profile</button>
                <button onClick={() => setTab('addresses')}>Addresses</button>
                <button onClick={() => setTab('orders')}>Orders</button>
            </div>

            {/* PROFILE TAB */}
            {tab === 'profile' && (
                <div className="card">
                    <h3>Edit Profile</h3>

                    <input
                        value={form.name}
                        onChange={(e) => setForm({ name: e.target.value })}
                    />

                    <button onClick={updateProfile}>
                        Save
                    </button>
                </div>
            )}

            {/* ADDRESS TAB */}
            {tab === 'addresses' && (
                <div className="card">

                    <h3>Add Address</h3>

                    {Object.keys(address).map((key) => (
                        <input
                            key={key}
                            placeholder={key}
                            value={address[key]}
                            onChange={(e) =>
                                setAddress({ ...address, [key]: e.target.value })
                            }
                        />
                    ))}

                    <button onClick={addAddress}>Add</button>

                    <hr />

                    <h3>Saved Addresses</h3>

                    {user.addresses?.map((a) => (
                        <div key={a._id} className="card-mini">

                            <p>
                                <b>{a.name}</b> {a.isDefault && "⭐"}
                            </p>

                            <p>{a.city}, {a.state}</p>

                            <button onClick={() => setDefault(a._id)}>
                                Set Default
                            </button>

                            <button onClick={() => deleteAddress(a._id)}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* ORDERS TAB */}
            {tab === 'orders' && (
                <div className="card">

                    <h3>Orders</h3>

                    {user.orders?.length === 0 && <p>No orders yet</p>}

                    {user.orders?.map((o) => (
                        <div key={o._id} className="order-timeline">

                            <p><b>Order:</b> {o._id}</p>
                            <p><b>Status:</b> {o.status}</p>
                            <p><b>Total:</b> ₹{o.totalPrice}</p>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
};

export default ProfilePage;