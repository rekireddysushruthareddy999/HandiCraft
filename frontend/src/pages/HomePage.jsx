import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../services/productService.js';

const categories = ['Textiles', 'Pottery', 'Woodwork', 'Jewelry', 'Home Decor'];

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            const response = await fetchProducts({ search, category });
            setLoading(false);
            if (response.success) setProducts(response.data.products);
            else setMessage(response.message);
        };
        loadProducts();
    }, [search, category]);

    return (
        <section className="page page--hero">
            <div className="hero-card">
                <h1>Find rural artisans, support handcrafted stories.</h1>
                <p>Browse authentic crafts, discover artisan stories, and pay securely with Razorpay.</p>
            </div>
            <div className="search-panel">
                <input placeholder="Search products or artisans" value={search} onChange={(e) => setSearch(e.target.value)} />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All categories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            {loading ? (
                <div className="loader">Loading products...</div>
            ) : (
                <div className="product-grid">
                    {products.length ? (
                        products.map((product) => (
                            <article key={product._id} className="product-card">
                                <img src={product.images[0] || 'https://via.placeholder.com/300'} alt={product.name} />
                                <div className="product-card__body">
                                    <Link to={`/product/${product._id}`}><h3>{product.name}</h3></Link>
                                    <p className="muted">{product.description.slice(0, 80)}...</p>
                                    <p className="price">₹{product.price.toFixed(0)}</p>
                                    <p className="small">By <Link to={`/vendor/${product.artisan._id}`}>{product.artisan.name}</Link></p>
                                </div>
                            </article>
                        ))
                    ) : (
                        <p>{message || 'No products found. Try another search.'}</p>
                    )}
                </div>
            )}
        </section>
    );
};

export default HomePage;
