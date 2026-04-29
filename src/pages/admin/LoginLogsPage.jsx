import React, { useEffect, useState } from 'react';
import { getLoginLogs } from '../../services/api';
import { Activity, RefreshCw } from 'lucide-react';

const roleColor = { ADMIN: 'badge-red', TEACHER: 'badge-blue', STUDENT: 'badge-green' };

export default function LoginLogsPage() {
  const [logs, setLogs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const load = () => {
    setLoading(true);
    getLoginLogs().then(r => { setLogs(r.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtered = filter === 'ALL' ? logs : logs.filter(l => l.role === filter);

  const fmt = (dt) => dt ? new Date(dt).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
  }) : '—';

  const truncateUA = (ua) => {
    if (!ua) return '—';
    const m = ua.match(/(Chrome|Firefox|Safari|Edge|Opera)[\/\s][\d.]+/);
    return m ? m[0] : ua.substring(0, 30) + '...';
  };

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Visitor Logs</h1>
          <p className="page-subtitle">All login activity stored in database</p>
        </div>
        <button className="btn btn-secondary" onClick={load}><RefreshCw size={15} /> Refresh</button>
      </div>

      {/* Summary cards */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          { label: 'Total Logins', value: logs.length, color: '#fff' },
          { label: 'Admin Logins',   value: logs.filter(l => l.role === 'ADMIN').length,   color: '#ef4444' },
          { label: 'Teacher Logins', value: logs.filter(l => l.role === 'TEACHER').length, color: '#60a5fa' },
          { label: 'Student Logins', value: logs.filter(l => l.role === 'STUDENT').length, color: '#10b981' },
        ].map(({ label, value, color }) => (
          <div key={label} className="stat-card">
            <div className="stat-label" style={{ marginBottom: 8 }}><Activity size={14} />{label}</div>
            <div className="stat-value" style={{ fontSize: 28, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="tabs" style={{ marginBottom: 16 }}>
        {['ALL','ADMIN','TEACHER','STUDENT'].map(r => (
          <button key={r} className={`tab ${filter === r ? 'active' : ''}`} onClick={() => setFilter(r)}>{r}</button>
        ))}
      </div>

      <div className="card">
        {loading ? <div className="spinner" /> : (
          filtered.length === 0 ? <div className="empty-state">No login records found</div> : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Login Time</th><th>IP Address</th><th>Browser</th></tr>
                </thead>
                <tbody>
                  {filtered.map((log, idx) => (
                    <tr key={log.id}>
                      <td style={{ color: 'var(--muted)', fontSize: 12 }}>{idx + 1}</td>
                      <td className="bold">{log.name}</td>
                      <td>{log.email}</td>
                      <td><span className={`badge ${roleColor[log.role] || 'badge-gray'}`}>{log.role}</span></td>
                      <td style={{ whiteSpace: 'nowrap' }}>{fmt(log.loginTime)}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{log.ipAddress || '—'}</td>
                      <td style={{ fontSize: 12, color: 'var(--text2)' }}>{truncateUA(log.userAgent)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}
