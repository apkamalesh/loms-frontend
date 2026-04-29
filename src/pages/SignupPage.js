import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/api';
import { BookOpen, GraduationCap, BookOpenCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirmPassword: '', role: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const ROLES = [
    { value: 'STUDENT', label: 'Student',    icon: GraduationCap,  desc: 'View learning outcomes & results' },
    { value: 'TEACHER', label: 'Teacher',    icon: BookOpenCheck,  desc: 'Manage tests & enter student marks' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.role)                               { setError('Please select your role'); return; }
    if (form.password !== form.confirmPassword)   { setError('Passwords do not match'); return; }
    if (form.password.length < 6)                 { setError('Password must be at least 6 characters'); return; }
    if (!form.name.trim())                        { setError('Please enter your full name'); return; }

    setLoading(true);
    try {
      const res = await signup({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
      });
      setSuccess(res.data.message || 'Registration submitted!');
      toast.success('Registration submitted!');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  if (success) return (
    <div className="auth-page">
      <div className="auth-logo">
        <div className="auth-logo-icon"><BookOpen size={28} color="#0a0a0a" /></div>
        <div><div className="auth-logo-title">LOMS</div><div className="auth-logo-sub">Learning Outcomes Monitoring System</div></div>
      </div>
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <h2 className="auth-title" style={{ marginBottom: 12 }}>Registration Submitted!</h2>
        <div className="info-box" style={{ textAlign: 'left', marginBottom: 16 }}>
          {success}
        </div>
        <div style={{ background: 'var(--hover)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, textAlign: 'left' }}>
          <div style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500, marginBottom: 4 }}>What happens next?</div>
          <ul style={{ fontSize: 13, color: 'var(--muted)', paddingLeft: 16, lineHeight: 2 }}>
            <li>Admin reviews your registration</li>
            <li>Once approved, you can login</li>
            <li>You'll have access to your dashboard</li>
          </ul>
        </div>
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
          onClick={() => navigate('/login')}>
          Go to Login
        </button>
      </div>
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-logo">
        <div className="auth-logo-icon"><BookOpen size={28} color="#0a0a0a" /></div>
        <div><div className="auth-logo-title">LOMS</div><div className="auth-logo-sub">Learning Outcomes Monitoring System</div></div>
      </div>

      <div className="auth-card" style={{ maxWidth: 520 }}>
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Sign up to get started with LOMS</p>

        {error && <div className="error-box">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="form-stack">

          {/* Role selection */}
          <div className="form-group">
            <label className="form-label">I am a *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {ROLES.map(({ value, label, icon: Icon, desc }) => (
                <button key={value} type="button" onClick={() => f('role', value)}
                  style={{
                    padding: '16px 12px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                    background: form.role === value ? 'var(--accent-l)' : 'var(--hover)',
                    border: `2px solid ${form.role === value ? 'var(--accent)' : 'var(--border)'}`,
                    transition: 'all 0.2s',
                  }}>
                  <Icon size={22} color={form.role === value ? '#10b981' : '#71717a'} style={{ marginBottom: 8, display: 'block' }} />
                  <div style={{ fontWeight: 600, fontSize: 15, color: form.role === value ? 'var(--accent)' : 'var(--text)', marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.4 }}>{desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="form-input" value={form.name}
              onChange={e => f('name', e.target.value)} placeholder="Enter your full name" required />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input className="form-input" type="email" value={form.email}
              onChange={e => f('email', e.target.value)} placeholder="your@email.com" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input className="form-input" type="password" value={form.password}
                onChange={e => f('password', e.target.value)} placeholder="Min 6 characters" required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input className="form-input" type="password" value={form.confirmPassword}
                onChange={e => f('confirmPassword', e.target.value)} placeholder="Repeat password" required />
            </div>
          </div>

          <div className="warn-box" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
            ⏳ After signup, an admin must approve your account before you can login.
          </div>

          <button className="btn btn-primary" type="submit"
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
            disabled={loading || !form.role}>
            {loading ? 'Submitting...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-divider" />
        <div className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}
