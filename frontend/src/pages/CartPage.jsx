import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const CartPage = () => {
    const { cartItems, updateQty, removeFromCart, cartTotal } = useCart();
    const navigate = useNavigate();

    if (!cartItems.length) {
        return (
            <section className="page page--cart">
                <div className="empty-state">
                    <h2>Your cart is empty.</h2>
                    <Link to="/">Browse products</Link>
                </div>
            </section>
        );
    }

    return (
        <section className="page page--cart">
            <div className="cart-grid">
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <div key={item.productId} className="cart-item">
                            <img src={item.image || 'https://via.placeholder.com/140'} alt={item.name} />
                            <div>
                                <h3>{item.name}</h3>
                                <p className="price">₹{item.price.toFixed(0)}</p>
                                <div className="cart-controls">
                                    <button type="button" aria-label={`Decrease quantity of ${item.name}`} onClick={() => updateQty(item.productId, Math.max(1, item.qty - 1))}>-</button>
                                    <span>{item.qty}</span>
                                    <button type="button" aria-label={`Increase quantity of ${item.name}`} onClick={() => updateQty(item.productId, item.qty + 1)}>+</button>
                                </div>
                                <button type="button" className="button button--ghost" onClick={() => removeFromCart(item.productId)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
                <aside className="cart-summary">
                    <h2>Order Summary</h2>
                    <p>Total items: {cartItems.length}</p>
                    <p className="price">Total: ₹{cartTotal.toFixed(0)}</p>
                    <button className="button button--primary" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
                </aside>
            </div>
        </section>
    );
};

export default CartPage;