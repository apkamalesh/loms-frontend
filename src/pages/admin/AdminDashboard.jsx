import React, { useEffect, useState } from 'react';
import { getAdminDashboard } from '../../services/api';
import { Building2, BookOpen, GraduationCap, Users, Activity, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [data, setData]   = useState(null);
  const [error, setError] = useState('');
  const navigate          = useNavigate();

  useEffect(() => {
    getAdminDashboard()
      .then(r => setData(r.data))
      .catch(e => setError(e.response?.data?.message || 'Failed to load dashboard. Check backend is running.'));
  }, []);

  if (error) return (
    <div className="page">
      <div className="page-header"><h1 className="page-title">Admin Dashboard</h1></div>
      <div className="error-box">⚠️ {error}</div>
    </div>
  );

  if (!data) return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Overview of the Learning Outcomes Monitoring System</p>
      </div>
      <div className="spinner" />
    </div>
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Overview of the Learning Outcomes Monitoring System</p>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Departments',       value: data.departmentCount ?? 0, icon: Building2 },
          { label: 'Subjects',          value: data.subjectCount ?? 0,    icon: BookOpen },
          { label: 'Learning Outcomes', value: data.outcomeCount ?? 0,    icon: GraduationCap },
          { label: 'Teachers',          value: data.teacherCount ?? 0,    icon: Users },
          { label: 'Students',          value: data.studentCount ?? 0,    icon: Users },
          { label: 'Total Logins',      value: data.totalLogins ?? 0,     icon: Activity },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="stat-card">
            <div className="stat-label">{label} <Icon size={18} color="#10b981" /></div>
            <div className="stat-value">{value}</div>
          </div>
        ))}
      </div>

      {(data.pendingCount ?? 0) > 0 && (
        <div className="warn-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span>⏳ <strong>{data.pendingCount}</strong> user(s) waiting for approval</span>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin/pending-users')}>
            <UserCheck size={14} /> Review Now
          </button>
        </div>
      )}

      <div className="two-col">
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 16 }}>Recent Departments</div>
          {(data.recentDepartments?.length ?? 0) > 0 ? data.recentDepartments.map(d => (
            <div key={d.id} className="list-item">
              <div><div className="list-item-title">{d.name}</div><div className="list-item-sub">Code: {d.code}</div></div>
              <span className="badge badge-green">{d.subjectCount ?? 0} subjects</span>
            </div>
          )) : <div className="empty-state">No departments yet. Add one!</div>}
        </div>

        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 16 }}>Recent Subjects</div>
          {(data.recentSubjects?.length ?? 0) > 0 ? data.recentSubjects.map(s => (
            <div key={s.id} className="list-item">
              <div><div className="list-item-title">{s.name}</div><div className="list-item-sub">{s.code} · {s.departmentName}</div></div>
              <span className="badge badge-green">{s.outcomeCount ?? 0} LOs</span>
            </div>
          )) : <div className="empty-state">No subjects yet. Add one!</div>}
        </div>
      </div>
    </div>
  );
}
