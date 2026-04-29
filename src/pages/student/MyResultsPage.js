import React, { useEffect, useState } from 'react';
import { getStudentResults } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function MyResultsPage() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      getStudentResults(user.id)
        .then(r => setResults(r.data || []))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) return <div className="page"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">My Results</h1>
        <p className="page-subtitle">Detailed learning outcome results per subject</p>
      </div>

      {results.length === 0 ? (
        <div className="card"><div className="empty-state">No results available yet.</div></div>
      ) : results.map(sr => (
        <div key={sr.subjectId} className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>{sr.subjectName}</h3>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>{sr.subjectCode}</span>
            </div>
            <span className={`badge ${sr.passed ? 'badge-green' : 'badge-red'}`} style={{ fontSize: 14, padding: '5px 14px' }}>
              {sr.passed ? '✓ Pass' : '✗ Fail'}
            </span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>LO</th><th>Description</th><th>Marks</th><th>Percentage</th><th>Threshold</th><th>Status</th></tr>
              </thead>
              <tbody>
                {sr.loResults?.map(lo => (
                  <tr key={lo.loId}>
                    <td><span className="badge badge-gray">{lo.loCode}</span></td>
                    <td className="bold">{lo.loDescription}</td>
                    <td>{lo.totalObtained}/{lo.totalMax}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="progress-wrap">
                          <div className={`progress-fill ${lo.achieved ? '' : 'red'}`} style={{ width: `${Math.min(lo.percentage, 100)}%` }} />
                        </div>
                        <span style={{ fontWeight: 600, color: lo.achieved ? '#10b981' : '#ef4444' }}>{lo.percentage}%</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--muted)' }}>{lo.passPercentage}%</td>
                    <td>
                      <span className={`badge ${lo.achieved ? 'badge-green' : 'badge-red'}`}>
                        {lo.achieved ? 'Achieved' : 'Not Achieved'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
