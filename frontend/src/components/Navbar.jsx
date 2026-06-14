import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();

    return (
        <header className="navbar">
            <div className="navbar__brand">
                <NavLink to="/">Artisan Marketplace</NavLink>
            </div>
            <nav className="navbar__links">
                <NavLink to="/">Home</NavLink>
                {user ? (
                    <>
                        {user.role === 'vendor' && <NavLink to="/vendor/manage">Manage Products</NavLink>}
                        <NavLink to="/orders">Orders</NavLink>
                        {user.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
                        <button type="button" className="button button--ghost" onClick={logout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <NavLink to="/auth">Sign in</NavLink>
                )}
                <NavLink to="/cart">Cart ({cartCount})</NavLink>
            </nav>
        </header>
    );
};

export default Navbar;
