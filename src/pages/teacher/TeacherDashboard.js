import React, { useEffect, useState } from 'react';
import { getTeacherDashboard } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, ClipboardList, GraduationCap } from 'lucide-react';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [data, setData]   = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      getTeacherDashboard(user.id)
        .then(r => setData(r.data))
        .catch(e => setError(e.response?.data?.message || 'Failed to load dashboard'));
    }
  }, [user]);

  if (error) return <div className="page"><div className="error-box">⚠️ {error}</div></div>;
  if (!data) return <div className="page"><div className="page-header"><h1 className="page-title">Teacher Dashboard</h1><p className="page-subtitle">Welcome back, {user?.name}</p></div><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Teacher Dashboard</h1>
        <p className="page-subtitle">Welcome back, {user?.name}</p>
      </div>

      <div className="stats-grid">
        {[
          { label: 'My Subjects',       value: data.subjectCount ?? 0, icon: BookOpen },
          { label: 'Total Tests',       value: data.testCount ?? 0,    icon: ClipboardList },
          { label: 'Learning Outcomes', value: data.outcomeCount ?? 0, icon: GraduationCap },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="stat-card">
            <div className="stat-label">{label} <Icon size={18} color="#10b981" /></div>
            <div className="stat-value">{value}</div>
          </div>
        ))}
      </div>

      <div className="two-col">
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 16 }}>My Subjects</div>
          {(data.subjects?.length ?? 0) > 0 ? data.subjects.map(s => (
            <div key={s.id} className="list-item">
              <div><div className="list-item-title">{s.name}</div><div className="list-item-sub">Code: {s.code}</div></div>
              <div style={{ display: 'flex', gap: 6 }}>
                <span className="badge badge-green">{s.outcomeCount ?? 0} LOs</span>
                <span className="badge badge-yellow">{s.testCount ?? 0} tests</span>
              </div>
            </div>
          )) : <div className="empty-state">No subjects assigned yet. Contact admin.</div>}
        </div>

        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 16 }}>Recent Tests</div>
          {(data.recentTests?.length ?? 0) > 0 ? data.recentTests.map(t => (
            <div key={t.id} className="list-item">
              <div><div className="list-item-title">{t.name}</div><div className="list-item-sub">{t.subjectName}</div></div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-green">{t.totalMarks} marks</span>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{t.testDate}</div>
              </div>
            </div>
          )) : <div className="empty-state">No tests created yet</div>}
        </div>
      </div>
    </div>
  );
}
