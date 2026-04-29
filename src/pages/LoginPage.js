import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome, ${user.name}!`);
      if (user.role === 'ADMIN')        navigate('/admin/dashboard');
      else if (user.role === 'TEACHER') navigate('/teacher/dashboard');
      else                              navigate('/student/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-logo">
        <div className="auth-logo-icon"><BookOpen size={28} color="#0a0a0a" /></div>
        <div>
          <div className="auth-logo-title">LOMS</div>
          <div className="auth-logo-sub">Learning Outcomes Monitoring System</div>
        </div>
      </div>

      <div className="auth-card">
        <h2 className="auth-title">Sign In</h2>
        <p className="auth-subtitle">Enter your credentials to access the system</p>

        {error && <div className="error-box">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="form-stack">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="Enter your email"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Enter your password"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="btn btn-primary" type="submit"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 4 }}
            disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider" />
        <div className="auth-switch">
          New user?{' '}
          <Link to="/signup" style={{ color: 'var(--accent)', fontWeight: 500 }}>
            Sign Up here
          </Link>
        </div>

        <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--hover)', borderRadius: 8 }}>
          <div style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500, marginBottom: 4 }}>Admin Direct Access</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}></div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
            Students &amp; Teachers must sign up and await admin approval before logging in.
          </div>
        </div>
      </div>
    </div>
  );
}
