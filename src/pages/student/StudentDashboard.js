import React, { useEffect, useState } from 'react';
import { getStudentDashboard, getStudentResults } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, GraduationCap, CheckCircle, BarChart2 } from 'lucide-react';

export default function StudentDashboard() {
  const { user }  = useAuth();
  const [data, setData]       = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (user?.id) {
      getStudentDashboard(user.id)
        .then(r => setData(r.data))
        .catch(e => setError(e.response?.data?.message || 'Failed to load dashboard'));
      getStudentResults(user.id)
        .then(r => setResults(r.data || []))
        .catch(() => setResults([]));
    }
  }, [user]);

  if (error) return <div className="page"><div className="error-box">⚠️ {error}</div></div>;
  if (!data) return <div className="page"><div className="page-header"><h1 className="page-title">Student Dashboard</h1><p className="page-subtitle">Welcome back, {user?.name}</p></div><div className="spinner" /></div>;

  const totalLOs       = results.reduce((s, r) => s + (r.loResults?.length ?? 0), 0);
  const achievedLOs    = results.reduce((s, r) => s + (r.loResults?.filter(l => l.achieved).length ?? 0), 0);
  const passedSubjects = results.filter(r => r.passed).length;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Student Dashboard</h1>
        <p className="page-subtitle">Welcome back, {user?.name}</p>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Enrolled Subjects',  value: data.subjectCount ?? 0,                          icon: BookOpen },
          { label: 'Learning Outcomes',  value: totalLOs,                                          icon: GraduationCap },
          { label: 'Outcomes Achieved',  value: achievedLOs,                                       icon: CheckCircle, green: true },
          { label: 'Subjects Passed',    value: `${passedSubjects}/${data.subjectCount ?? 0}`,     icon: BarChart2,   green: true },
        ].map(({ label, value, icon: Icon, green }) => (
          <div key={label} className="stat-card">
            <div className="stat-label">{label} <Icon size={18} color="#10b981" /></div>
            <div className={`stat-value ${green ? 'green' : ''}`}>{value}</div>
          </div>
        ))}
      </div>

      {results.length > 0 ? (
        <div className="two-col">
          {results.map(sr => (
            <div key={sr.subjectId} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{sr.subjectName}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{sr.subjectCode}</div>
                </div>
                <span className={`badge ${sr.passed ? 'badge-green' : 'badge-red'}`}>
                  {sr.passed ? '✓ Pass' : '✗ Fail'}
                </span>
              </div>
              {sr.loResults?.map(lo => (
                <div key={lo.loId} className="lo-item">
                  <div style={{ fontSize: 18 }}>{lo.achieved ? '✅' : '❌'}</div>
                  <div className="lo-info">
                    <div className="lo-code">{lo.loCode}</div>
                    <div className="lo-desc">{lo.loDescription}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 600, color: lo.achieved ? '#10b981' : '#ef4444', fontSize: 14 }}>{lo.percentage}%</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{lo.totalObtained}/{lo.totalMax}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            No results yet. Your teacher has not entered marks yet.
          </div>
        </div>
      )}
    </div>
  );
}
