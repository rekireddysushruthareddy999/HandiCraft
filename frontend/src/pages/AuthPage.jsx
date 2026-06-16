import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const AuthPage = () => {
    const [mode, setMode] = useState('login');
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user', businessName: '', village: '', craftType: '', story: '' });
    const [message, setMessage] = useState('');
    const { login, register, loading } = useAuth();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        if (mode === 'login') {
            const result = await login({ email: form.email, password: form.password });
            if (!result.success) setMessage(result.message);
        } else {
            const result = await register(form);
            if (!result.success) setMessage(result.message);
        }
    };

    return (
        <section className="page page--auth">
            <div className="auth-card">
                <div className="tabs">
                    <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Login</button>
                    <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Register</button>
                </div>
                <form onSubmit={handleSubmit} className="form-card">
                    {mode === 'register' && (
                        <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" required />
                    )}
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
                    <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" required />
                    {mode === 'register' && (
                        <>
                            <select name="role" value={form.role} onChange={handleChange}>
                                <option value="user">Buyer</option>
                                <option value="vendor">Vendor / Artisan</option>
                            </select>
                            {form.role === 'vendor' && (
                                <>
                                    <input name="businessName" value={form.businessName} onChange={handleChange} placeholder="Artisan business name" />
                                    <input name="village" value={form.village} onChange={handleChange} placeholder="Village / Region" />
                                    <input name="craftType" value={form.craftType} onChange={handleChange} placeholder="Craft type" />
                                    <textarea name="story" value={form.story} onChange={handleChange} placeholder="One-line artisan story" rows="4" />
                                </>
                            )}
                        </>
                    )}
                    {message && <p className="alert" role="alert">{message}</p>}
                    <button className="button button--primary" type="submit" disabled={loading}>{loading ? 'Saving...' : mode === 'login' ? 'Login' : 'Register'}</button>
                </form>
            </div>
        </section>
    );
};

export default AuthPage;
