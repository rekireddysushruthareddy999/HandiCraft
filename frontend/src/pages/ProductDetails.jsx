import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProduct } from '../services/productService.js';
import { useCart } from '../context/CartContext.jsx';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { addToCart } = useCart();

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
        addToCart({ productId: product._id, name: product.name, price: product.price, image: product.images[0], qty: 1 });
        setMessage('Product added to cart.');
    };

    if (loading) return <div className="loader">Loading product...</div>;
    if (!product) return <div className="empty-state">{message || 'Product not found.'}</div>;

    return (
        <section className="page page--product">
            <div className="product-detail-card">
                <div className="product-detail__images">
                    <img src={product.images[0] || 'https://via.placeholder.com/500'} alt={product.name} />
                </div>
                <div className="product-detail__info">
                    <h1>{product.name}</h1>
                    <p className="price">₹{product.price.toFixed(0)}</p>
                    <p>{product.description}</p>
                    <p className="small">Category: {product.categories.join(', ')}</p>
                    <p className="small">Sold by: {product.artisan.name}</p>
                    <button className="button button--primary" onClick={handleAddToCart}>Add to Cart</button>
                    {message && <p className="alert">{message}</p>}
                </div>
            </div>
        </section>
    );
};

export default ProductDetails;
