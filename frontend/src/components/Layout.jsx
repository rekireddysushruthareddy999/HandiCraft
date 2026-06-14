import Navbar from './Navbar.jsx';

const Layout = ({ children }) => {
    return (
        <div className="app-shell">
            <Navbar />
            <main className="content">{children}</main>
            <footer className="footer">© 2026 Artisan Handicraft Marketplace</footer>
        </div>
    );
};

export default Layout;
