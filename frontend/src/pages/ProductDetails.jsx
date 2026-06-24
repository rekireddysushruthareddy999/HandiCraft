import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProduct } from '../services/productService.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { addToCart } = useCart();
    const { user } = useAuth();
    const { isWishlisted, toggleWishlist } = useWishlist();

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            const response = await fetchProduct(id);
            setLoading(false);
            if (response.success) setProduct(response.data.product);
            else setMessage(response.message);
        };
        loadProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart({ productId: product._id, name: product.name, price: product.price, image: product.images?.[0], qty: 1 });
        setMessage('Product added to cart.');
    };

    const handleWishlistToggle = async () => {
        if (!user) {
            navigate('/auth');
            return;
        }
        await toggleWishlist(product._id);
    };

    if (loading) return <div className="loader" role="status">Loading product...</div>;
    if (!product) return <div className="empty-state">{message || 'Product not found.'}</div>;

    return (
        <section className="page page--product">
            <div className="product-detail-card">
                <div className="product-detail__images">
                    <img src={product.images?.[0] || 'https://via.placeholder.com/500'} alt={product.name} />
                </div>
                <div className="product-detail__info">
                    <h1>{product.name}</h1>
                    <p className="price">₹{Number(product.price || 0).toFixed(0)}</p>
                    <p>{product.description}</p>
                    <p className="small">Category: {(product.categories || []).join(', ') || 'N/A'}</p>
                    <p className="small">Sold by: {product.artisan?.name || 'Unknown artisan'}</p>
                    <div className="product-detail__actions">
                        <button className="button button--primary" onClick={handleAddToCart}>Add to Cart</button>
                        <button
                            type="button"
                            className="button button--ghost"
                            onClick={handleWishlistToggle}
                            aria-pressed={isWishlisted(product._id)}
                        >
                            {isWishlisted(product._id) ? '♥ In Wishlist' : '♡ Add to Wishlist'}
                        </button>
                    </div>
                    {message && <p className="alert" role="status">{message}</p>}
                </div>
            </div>
        </section>
    );
};

export default ProductDetails;