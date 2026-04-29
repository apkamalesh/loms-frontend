import React, { useEffect, useState } from 'react';
import { getSubjectsByTeacher, getClassSummary } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ClassSummaryPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [selSubj, setSelSubj]   = useState('');
  const [summary, setSummary]   = useState(null);

  useEffect(() => { if (user) getSubjectsByTeacher(user.id).then(r => setSubjects(r.data)); }, [user]);
  useEffect(() => { if (selSubj) getClassSummary(selSubj).then(r => setSummary(r.data)); }, [selSubj]);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Class Summary</h1>
        <p className="page-subtitle">LO achievement rates per subject</p>
      </div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="form-group" style={{ maxWidth: 340 }}>
          <label className="form-label">Select Subject</label>
          <select className="form-input" value={selSubj} onChange={e => setSelSubj(e.target.value)}>
            <option value="">-- Choose --</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
          </select>
        </div>
      </div>
      {summary && (
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 20 }}>{summary.subjectName} — LO Achievement</div>
          {summary.loResults?.length > 0 ? summary.loResults.map(lo => (
            <div key={lo.loId} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div>
                  <span style={{ fontWeight: 600, color: '#fff', marginRight: 10 }}>{lo.loCode}</span>
                  <span style={{ fontSize: 13, color: 'var(--text2)' }}>{lo.loDescription}</span>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>{lo.achievedCount}/{lo.totalStudents} students</span>
                  <span style={{ fontWeight: 700, fontSize: 15, color: lo.achievementRate >= lo.passPercentage ? '#10b981' : '#ef4444' }}>
                    {lo.achievementRate}%
                  </span>
                </div>
              </div>
              <div style={{ background: 'var(--border)', borderRadius: 6, height: 10, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(lo.achievementRate, 100)}%`, background: lo.achievementRate >= lo.passPercentage ? '#10b981' : '#ef4444', borderRadius: 6, transition: 'width .5s' }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Pass threshold: {lo.passPercentage}%</div>
            </div>
          )) : <div className="empty-state">No data available yet</div>}
        </div>
      )}
    </div>
  );
}
