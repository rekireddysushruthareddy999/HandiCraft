import { useEffect, useState } from 'react';
import api from '../services/api.js';

const ProfilePage = () => {
    const [user, setUser] = useState(null);

    const [address, setAddress] = useState({
        name: '',
        phone: '',
        city: '',
        pincode: ''
    });

    const addAddress = async () => {
        await api.post('/users/address', address);
    };

    useEffect(() => {
        const load = async () => {
            const res = await api.get('/users/me');
            if (res.data.success) setUser(res.data.data.user);
        };
        load();
    }, []);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="page">
            <h1>My Profile</h1>

            <img
                src={user.avatar || "https://via.placeholder.com/120"}
                width="120"
                alt="profile"
            />

            <h2>{user.name}</h2>
            <p>{user.email}</p>

            <h3>Addresses</h3>
            {user.addresses?.map((a) => (
                <div key={a._id}>
                    {a.name} - {a.city} - {a.pincode}
                </div>
            ))}

            <h3>Wishlist</h3>
            {user.wishlist?.map((p) => (
                <div key={p._id}>{p.name}</div>
            ))}
        </div>
    );
};

export default ProfilePage;