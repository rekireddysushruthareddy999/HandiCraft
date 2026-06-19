import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchVendorProfile, createProduct, deleteProduct } from '../services/productService.js';

const VendorProducts = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({ name: '', description: '', price: '', categories: '', stock: '', images: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadVendor = async () => {
            setLoading(true);
            const response = await fetchVendorProfile(user.id);
            setLoading(false);
            if (response.success) {
                setProfile(response.data.vendor);
                setProducts(response.data.products || []);
            } else {
                setMessage(response.message);
            }
        };
        if (user?.id) loadVendor();
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setMessage('Creating product...');
        const payload = {
            ...form,
            price: Number(form.price),
            stock: Number(form.stock),
            categories: form.categories,
            images: form.images.split(',').map((item) => item.trim()).filter(Boolean),
        };
        const response = await createProduct(payload);
        if (response.success) {
            setProducts((prev) => [response.data.product, ...prev]);
            setForm({ name: '', description: '', price: '', categories: '', stock: '', images: '' });
            setMessage('Product added successfully.');
        } else {
            setMessage(response.message);
        }
    };

    const handleDelete = async (productId) => {
        const response = await deleteProduct(productId);
        if (response.success) {
            setProducts((prev) => prev.filter((product) => product._id !== productId));
            setMessage('Product removed.');
        } else {
            setMessage(response.message);
        }
    };

    return (
        <section className="page page--vendor-manage">
            <div className="vendor-card">
                <h1>Manage your products</h1>
                <p className="muted">{profile?.vendorProfile?.businessName || 'Vendor portal'}</p>
                <p>Use this page to add new products and remove outdated listings.</p>
            </div>

            <div className="product-form-card">
                <h2>Add a new product</h2>
                <form onSubmit={handleCreate} className="form-card">
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Product name" required />
                    <textarea name="description" value={form.description} onChange={handleChange} placeholder="Product description" rows="4" required />
                    <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" required />
                    <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stock quantity" required />
                    <input name="categories" value={form.categories} onChange={handleChange} placeholder="Categories (comma separated)" required />
                    <input name="images" value={form.images} onChange={handleChange} placeholder="Image URLs (comma separated)" required />
                    {message && <p className="alert" role="status">{message}</p>}
                    <button className="button button--primary" type="submit">Create Product</button>
                </form>
            </div>

            <div className="vendor-products">
                <h2>Your products</h2>
                {loading ? (
                    <div className="loader" role="status">Loading your products...</div>
                ) : products.length ? (
                    <div className="product-grid">
                        {products.map((product) => (
                            <article key={product._id} className="product-card">
                                <img src={product.images?.[0] || 'https://via.placeholder.com/300'} alt={product.name} />
                                <div className="product-card__body">
                                    <h3>{product.name}</h3>
                                    <p className="muted">{(product.categories || []).join(', ')}</p>
                                    <p className="price">₹{Number(product.price || 0).toFixed(0)}</p>
                                    <button className="button button--ghost" type="button" onClick={() => handleDelete(product._id)}>Remove product</button>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className="empty-state">No products yet. Add your first product above.</p>
                )}
            </div>
        </section>
    );
};

export default VendorProducts;