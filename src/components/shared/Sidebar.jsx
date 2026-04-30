import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, LogOut, X } from 'lucide-react';

export default function Sidebar({ links, isOpen, setIsOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 24px', borderBottom: '1px solid #1e1e1e', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, background: '#10b981', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={20} color="#0a0a0a" />
            </div>
            <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>LOMS</div>
            <div style={{ fontSize: 11, color: '#71717a' }}>Learning Outcomes</div>
            </div>
        </div>
        <button className="mobile-close" onClick={() => setIsOpen(false)}>
            <X size={20} />
        </button>
      </div>

      <nav style={{ flex: 1, padding: '0 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {links.map(({ to, icon: Icon, label, badge }) => (
          <NavLink 
            key={to} 
            to={to} 
            onClick={() => setIsOpen(false)} // Close menu when clicking a link on mobile
            style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
                textDecoration: 'none', transition: 'all 0.15s',
                background: isActive ? '#1e1e1e' : 'transparent',
                color: isActive ? '#fff' : '#a1a1aa',
          })}>
            <Icon size={18} />
            <span style={{ flex: 1 }}>{label}</span>
            {badge > 0 && (
              <span style={{ background: '#f59e0b', color: '#0a0a0a', borderRadius: 10, fontSize: 11, fontWeight: 700, padding: '1px 7px' }}>
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div style={{ borderTop: '1px solid #1e1e1e', padding: '16px 20px 0', marginTop: 12 }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{user?.name}</div>
          <div style={{ fontSize: 12, color: '#71717a' }}>{user?.role?.charAt(0) + user?.role?.slice(1).toLowerCase()}</div>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: '#71717a', fontSize: 14, cursor: 'pointer', padding: '6px 0' }}>
          <LogOut size={16} /><span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}