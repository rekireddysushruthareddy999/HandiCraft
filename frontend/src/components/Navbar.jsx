import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const linkClass = ({ isActive }) => (isActive ? 'active' : '');

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();

    return (
        <header className="navbar">
            <div className="navbar__brand">
                <NavLink to="/">Artisan Marketplace</NavLink>
            </div>
            <nav className="navbar__links">
                <NavLink to="/" className={linkClass} end>Home</NavLink>
                {user ? (
                    <>
                        {user.role === 'vendor' && <NavLink to="/vendor/manage" className={linkClass}>Manage Products</NavLink>}
                        <NavLink to="/orders" className={linkClass}>Orders</NavLink>
                        {user.role === 'admin' && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
                        <button type="button" className="button button--ghost" onClick={logout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <NavLink to="/auth" className={linkClass}>Sign in</NavLink>
                )}
                <NavLink to="/cart" className={linkClass}>Cart ({cartCount})</NavLink>
                <NavLink to="/profile">Profile</NavLink>
<NavLink to="/help">Help</NavLink>
            </nav>
        </header>
    );
};

export default Navbar;
