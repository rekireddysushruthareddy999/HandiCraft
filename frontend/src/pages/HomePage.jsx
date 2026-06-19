import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
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
        <section className="flex flex-col gap-8">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-2xl rounded-2xl border-l-4 border-primary bg-white p-8 shadow-sm"
            >
                <h1 className="mb-3 text-3xl font-bold sm:text-4xl">Find rural artisans, support handcrafted stories.</h1>
                <p className="max-w-prose text-base text-ink/70">
                    Browse authentic crafts, discover artisan stories, and pay securely with Razorpay.
                </p>
            </motion.div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                    <input
                        aria-label="Search products or artisans"
                        placeholder="Search products or artisans"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-ink/10 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm transition-shadow focus:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                </div>
                <select
                    aria-label="Filter by category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-lg border border-ink/10 bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 sm:w-56"
                >
                    <option value="">All categories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div role="status" className="rounded-2xl border border-dashed border-ink/15 bg-white py-16 text-center text-ink/60">
                    <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-ink/15 border-t-primary" />
                    Loading products...
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.length ? (
                        products.map((product, idx) => (
                            <motion.article
                                key={product._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: Math.min(idx, 6) * 0.04 }}
                                className="group overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition-shadow hover:shadow-lg"
                            >
                                <Link to={`/product/${product._id}`} className="block aspect-[4/3] overflow-hidden">
                                    <img
                                        src={product.images?.[0] || 'https://via.placeholder.com/300'}
                                        alt={product.name}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </Link>
                                <div className="flex flex-col gap-1.5 p-4">
                                    <Link to={`/product/${product._id}`}>
                                        <h3 className="font-display text-base font-semibold leading-snug">{product.name}</h3>
                                    </Link>
                                    <p className="text-sm text-ink/60">{(product.description || '').slice(0, 80)}...</p>
                                    <p className="font-display text-lg font-bold text-primary-dark">₹{Number(product.price || 0).toFixed(0)}</p>
                                    <p className="text-xs text-ink/50">
                                        {product.artisan ? (
                                            <>
                                                By{' '}
                                                <Link to={`/vendor/${product.artisan._id}`} className="font-medium text-primary-dark underline-offset-2 hover:underline">
                                                    {product.artisan.name}
                                                </Link>
                                            </>
                                        ) : (
                                            'Artisan unavailable'
                                        )}
                                    </p>
                                </div>
                            </motion.article>
                        ))
                    ) : (
                        <p className="col-span-full py-8 text-center text-ink/60">{message || 'No products found. Try another search.'}</p>
                    )}
                </div>
            )}
        </section>
    );
};

export default HomePage;