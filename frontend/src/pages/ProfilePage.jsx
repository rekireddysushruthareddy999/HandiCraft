import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import * as profileService from '../services/profileService.js';

const emptyAddressForm = {
    label: 'Home',
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false,
};

const ProfilePage = () => {
    const { user, updateUserLocal } = useAuth();
    const { wishlist, loading: wishlistLoading, removeFromWishlist } = useWishlist();

    const [profileForm, setProfileForm] = useState({ name: user?.name || '', avatar: user?.avatar || '' });
    const [profileMessage, setProfileMessage] = useState('');
    const [savingProfile, setSavingProfile] = useState(false);

    const [addresses, setAddresses] = useState([]);
    const [addressLoading, setAddressLoading] = useState(false);
    const [addressForm, setAddressForm] = useState(emptyAddressForm);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addressMessage, setAddressMessage] = useState('');

    const loadAddresses = async () => {
        setAddressLoading(true);
        const response = await profileService.fetchAddresses();
        setAddressLoading(false);
        if (response.success) setAddresses(response.data.addresses || []);
    };

    useEffect(() => {
        loadAddresses();
    }, []);

    const handleProfileChange = (e) => setProfileForm({ ...profileForm, [e.target.name]: e.target.value });

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        setProfileMessage('');
        const response = await profileService.updateProfile(profileForm);
        setSavingProfile(false);
        if (response.success) {
            updateUserLocal({ name: response.data.user.name, avatar: response.data.user.avatar });
            setProfileMessage('Profile updated.');
        } else {
            setProfileMessage(response.message);
        }
    };

    const handleAddressChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAddressForm({ ...addressForm, [name]: type === 'checkbox' ? checked : value });
    };

    const startEditAddress = (address) => {
        setEditingAddressId(address._id);
        setAddressForm({
            label: address.label || 'Home',
            fullName: address.fullName || '',
            phone: address.phone || '',
            line1: address.line1 || '',
            line2: address.line2 || '',
            city: address.city || '',
            state: address.state || '',
            postalCode: address.postalCode || '',
            country: address.country || 'India',
            isDefault: !!address.isDefault,
        });
        setShowAddressForm(true);
    };

    const resetAddressForm = () => {
        setAddressForm(emptyAddressForm);
        setEditingAddressId(null);
        setShowAddressForm(false);
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        setAddressMessage('');
        const response = editingAddressId
            ? await profileService.updateAddress(editingAddressId, addressForm)
            : await profileService.addAddress(addressForm);

        if (response.success) {
            setAddresses(response.data.addresses);
            setAddressMessage(editingAddressId ? 'Address updated.' : 'Address added.');
            resetAddressForm();
        } else {
            setAddressMessage(response.message);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        const response = await profileService.deleteAddress(addressId);
        if (response.success) {
            setAddresses(response.data.addresses);
            setAddressMessage('Address removed.');
        } else {
            setAddressMessage(response.message);
        }
    };

    if (!user) return null;

    return (
        <section className="page page--profile">
            <h1>My Profile</h1>

            <div className="profile-grid">
                <div className="admin-card">
                    <h2>Account details</h2>
                    <form onSubmit={handleProfileSubmit} className="form-card">
                        <input name="name" value={profileForm.name} onChange={handleProfileChange} placeholder="Full name" required />
                        <input name="avatar" value={profileForm.avatar} onChange={handleProfileChange} placeholder="Avatar image URL" />
                        <p className="small muted">Email: {user.email}</p>
                        <p className="small muted">Role: {user.role}</p>
                        {profileMessage && <p className="alert" role="status">{profileMessage}</p>}
                        <button className="button button--primary" type="submit" disabled={savingProfile}>
                            {savingProfile ? 'Saving...' : 'Save changes'}
                        </button>
                    </form>
                </div>

                <div className="admin-card">
                    <h2>Delivery addresses</h2>
                    {addressMessage && <p className="alert" role="status">{addressMessage}</p>}
                    {addressLoading ? (
                        <div className="loader" role="status">Loading addresses...</div>
                    ) : addresses.length ? (
                        <div className="address-list">
                            {addresses.map((address) => (
                                <div key={address._id} className="address-card">
                                    <div>
                                        <p>
                                            <strong>{address.label}</strong>{' '}
                                            {address.isDefault && <span className="badge">Default</span>}
                                        </p>
                                        <p>{address.fullName} · {address.phone}</p>
                                        <p className="small">
                                            {address.line1}{address.line2 ? `, ${address.line2}` : ''}, {address.city}, {address.state} {address.postalCode}, {address.country}
                                        </p>
                                    </div>
                                    <div>
                                        <button type="button" className="button button--ghost" onClick={() => startEditAddress(address)}>Edit</button>
                                        <button type="button" className="button button--ghost" onClick={() => handleDeleteAddress(address._id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="muted">No saved addresses yet.</p>
                    )}

                    {showAddressForm ? (
                        <form onSubmit={handleAddressSubmit} className="form-card" style={{ marginTop: 16 }}>
                            <input name="label" value={addressForm.label} onChange={handleAddressChange} placeholder="Label (e.g. Home, Work)" />
                            <input name="fullName" value={addressForm.fullName} onChange={handleAddressChange} placeholder="Recipient full name" required />
                            <input name="phone" value={addressForm.phone} onChange={handleAddressChange} placeholder="Phone number" required />
                            <input name="line1" value={addressForm.line1} onChange={handleAddressChange} placeholder="Address line 1" required />
                            <input name="line2" value={addressForm.line2} onChange={handleAddressChange} placeholder="Address line 2 (optional)" />
                            <input name="city" value={addressForm.city} onChange={handleAddressChange} placeholder="City" required />
                            <input name="state" value={addressForm.state} onChange={handleAddressChange} placeholder="State" required />
                            <input name="postalCode" value={addressForm.postalCode} onChange={handleAddressChange} placeholder="Postal code" required />
                            <input name="country" value={addressForm.country} onChange={handleAddressChange} placeholder="Country" />
                            <label className="checkbox-row">
                                <input type="checkbox" name="isDefault" checked={addressForm.isDefault} onChange={handleAddressChange} />
                                Set as default address
                            </label>
                            <div>
                                <button className="button button--primary" type="submit">{editingAddressId ? 'Update address' : 'Add address'}</button>
                                <button className="button button--ghost" type="button" onClick={resetAddressForm}>Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <button className="button button--primary" type="button" style={{ marginTop: 16 }} onClick={() => setShowAddressForm(true)}>
                            Add new address
                        </button>
                    )}
                </div>
            </div>

            <div className="admin-card" style={{ marginTop: 24 }}>
                <h2>My Wishlist</h2>
                {wishlistLoading ? (
                    <div className="loader" role="status">Loading wishlist...</div>
                ) : wishlist.length ? (
                    <div className="product-grid">
                        {wishlist.map((product) => (
                            <article key={product._id} className="product-card">
                                <Link to={`/product/${product._id}`}>
                                    <img src={product.images?.[0] || 'https://via.placeholder.com/300'} alt={product.name} />
                                </Link>
                                <div className="product-card__body">
                                    <Link to={`/product/${product._id}`}><h3>{product.name}</h3></Link>
                                    <p className="price">₹{Number(product.price || 0).toFixed(0)}</p>
                                    <button type="button" className="button button--ghost" onClick={() => removeFromWishlist(product._id)}>
                                        Remove from wishlist
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className="empty-state">Your wishlist is empty. <Link to="/">Browse products</Link></p>
                )}
            </div>
        </section>
    );
};

export default ProfilePage;