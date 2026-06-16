import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchVendorProfile } from '../services/productService.js';

const VendorProfile = () => {
    const { id } = useParams();
    const [vendorData, setVendorData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const loadVendor = async () => {
            setLoading(true);
            const response = await fetchVendorProfile(id);
            setLoading(false);
            if (response.success) setVendorData(response.data);
            else setMessage(response.message);
        };
        loadVendor();
    }, [id]);

    if (loading) return <div className="loader" role="status">Loading artisan...</div>;
    if (!vendorData) return <div className="empty-state">{message || 'Artisan not found.'}</div>;

    const { vendor, products } = vendorData;
    const profile = vendor.vendorProfile || {};

    return (
        <section className="page page--vendor">
            <div className="vendor-card">
                <h1>{vendor.name}</h1>
                <p className="muted">{profile.businessName || 'Handicraft artisan'}</p>
                <p>{profile.story || 'A passionate artisan crafting unique products.'}</p>
                <div className="vendor-meta">
                    <span><strong>Village:</strong> {profile.village || 'N/A'}</span>
                    <span><strong>Craft:</strong> {profile.craftType || 'N/A'}</span>
                    <span><strong>KYC:</strong> {profile.kycStatus || 'Pending'}</span>
                </div>
                <div className="gallery-grid">
                    {profile.images?.length ? profile.images.map((img, idx) => <img key={idx} src={img} alt={`Gallery ${idx + 1}`} />) : <div className="gallery-empty">No gallery images yet.</div>}
                </div>
            </div>
            <div className="vendor-products">
                <h2>Products by {vendor.name}</h2>
                <div className="product-grid">
                    {products.length ? products.map((product) => (
                        <article key={product._id} className="product-card">
                            <img src={product.images[0] || 'https://via.placeholder.com/300'} alt={product.name} />
                            <div className="product-card__body">
                                <h3>{product.name}</h3>
                                <p>{product.description.slice(0, 70)}...</p>
                                <p className="price">₹{product.price.toFixed(0)}</p>
                            </div>
                        </article>
                    )) : <p>No products available from this artisan yet.</p>}
                </div>
            </div>
        </section>
    );
};

export default VendorProfile;
