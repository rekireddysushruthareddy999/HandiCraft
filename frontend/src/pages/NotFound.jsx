import { Link } from 'react-router-dom';

const NotFound = () => (
    <section className="page page--notfound">
        <div className="empty-state">
            <h2>Page not found</h2>
            <p>We couldn't find that page.</p>
            <Link to="/">Return home</Link>
        </div>
    </section>
);

export default NotFound;