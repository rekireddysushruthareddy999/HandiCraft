import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
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
        <div className="page">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="hero-card"
            >
                <h1>Find rural artisans, support handcrafted stories.</h1>
                <p>Browse authentic crafts, discover artisan stories, and pay securely with Razorpay.</p>
            </motion.div>

            <div className="search-panel">
                <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
                    <Search
                        size={18}
                        style={{
                            position: 'absolute',
                            left: 12,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--sage)',
                            pointerEvents: 'none',
                        }}
                    />
                    <input
                        aria-label="Search products or artisans"
                        placeholder="Search products or artisans"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ paddingLeft: 38 }}
                    />
                </div>
                <select
                    aria-label="Filter by category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">All categories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div role="status" className="loader">
                    Loading products...
                </div>
            ) : (
                <div className="product-grid">
                    {products.length ? (
                        products.map((product, idx) => (
                            <motion.article
                                key={product._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: Math.min(idx, 6) * 0.04 }}
                                className="product-card"
                            >
                                <Link to={`/product/${product._id}`}>
                                    <img
                                        src={product.images?.[0] || 'https://via.placeholder.com/300'}
                                        alt={product.name}
                                    />
                                </Link>
                                <div className="product-card__body">
                                    <Link to={`/product/${product._id}`}>
                                        <h3>{product.name}</h3>
                                    </Link>
                                    <p className="price">₹{Number(product.price || 0).toFixed(0)}</p>
                                    <p className="small">
                                        {product.artisan ? (
                                            <>By <Link to={`/vendor/${product.artisan._id}`}>{product.artisan.name}</Link></>
                                        ) : (
                                            'Artisan unavailable'
                                        )}
                                    </p>

                                    <Link
                                        to={`/product/${product._id}`}
                                        className="button button--primary"
                                        style={{
                                            marginTop: 8,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 6,
                                            textAlign: 'center',
                                        }}
                                    >
                                        View details
                                        <ArrowRight size={15} />
                                    </Link>
                                </div>
                            </motion.article>
                        ))
                    ) : (
                        <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                            <h2>No products found</h2>
                            <p>{message || 'Try another search or category.'}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HomePage;