import React, { useEffect, useState } from 'react';
import { getSubjectsByTeacher, getLOsBySubject, getTestsBySubject, createTest, deleteTest } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TestsPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [selSubj, setSelSubj]   = useState('');
  const [tests, setTests]       = useState([]);
  const [los, setLos]           = useState([]);
  const [modal, setModal]       = useState(false);
  const [form, setForm]         = useState({ name: '', totalMarks: '', testDate: '', loMappings: [] });

  useEffect(() => { if (user) getSubjectsByTeacher(user.id).then(r => setSubjects(r.data)); }, [user]);
  useEffect(() => {
    if (selSubj) {
      getTestsBySubject(selSubj).then(r => setTests(r.data));
      getLOsBySubject(selSubj).then(r => {
        setLos(r.data);
        setForm(f => ({ ...f, loMappings: r.data.map(lo => ({ learningOutcomeId: lo.id, maxMarks: '' })) }));
      });
    }
  }, [selSubj]);

  const handleSave = async () => {
    const p = { subjectId: Number(selSubj), name: form.name, totalMarks: Number(form.totalMarks), testDate: form.testDate,
      loMappings: form.loMappings.filter(m => m.maxMarks).map(m => ({ ...m, maxMarks: Number(m.maxMarks) })) };
    try { await createTest(p); toast.success('Test created'); setModal(false); getTestsBySubject(selSubj).then(r => setTests(r.data)); }
    catch { toast.error('Error creating test'); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete test?')) return;
    try { await deleteTest(id); toast.success('Deleted'); getTestsBySubject(selSubj).then(r => setTests(r.data)); }
    catch { toast.error('Cannot delete'); }
  };
  const updateLo = (idx, val) => { const u = [...form.loMappings]; u[idx].maxMarks = val; setForm(f => ({ ...f, loMappings: u })); };

  return (
    <div className="page">
      <div className="page-header-row">
        <div><h1 className="page-title">Tests</h1><p className="page-subtitle">Manage tests and LO mappings</p></div>
        {selSubj && <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={16} />Add Test</button>}
      </div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="form-group" style={{ maxWidth: 340 }}>
          <label className="form-label">Select Subject</label>
          <select className="form-input" value={selSubj} onChange={e => setSelSubj(e.target.value)}>
            <option value="">-- Choose a subject --</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
          </select>
        </div>
      </div>
      {selSubj && (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead><tr><th>Test Name</th><th>Total Marks</th><th>Date</th><th>LO Mappings</th><th>Actions</th></tr></thead>
              <tbody>
                {tests.map(t => (
                  <tr key={t.id}>
                    <td className="bold">{t.name}</td>
                    <td><span className="badge badge-green">{t.totalMarks}</span></td>
                    <td>{t.testDate}</td>
                    <td>{t.loMappings?.map(m => <span key={m.id} className="badge badge-gray" style={{ marginRight: 4 }}>{m.loCode}:{m.maxMarks}</span>)}</td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}><Trash2 size={13} /></button></td>
                  </tr>
                ))}
                {!tests.length && <tr><td colSpan={5} className="empty-state">No tests yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Create Test</div>
            <div className="form-stack">
              <div className="form-group"><label className="form-label">Test Name *</label><input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Mid-Term Exam" /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Total Marks *</label><input className="form-input" type="number" value={form.totalMarks} onChange={e => setForm(f => ({ ...f, totalMarks: e.target.value }))} /></div>
                <div className="form-group"><label className="form-label">Date *</label><input className="form-input" type="date" value={form.testDate} onChange={e => setForm(f => ({ ...f, testDate: e.target.value }))} /></div>
              </div>
              {los.length > 0 && (
                <div>
                  <label className="form-label" style={{ marginBottom: 8, display: 'block' }}>LO Marks Distribution</label>
                  {los.map((lo, idx) => (
                    <div key={lo.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: 'var(--text2)', flex: 1 }}>{lo.code}: {lo.description}</span>
                      <input className="form-input" type="number" style={{ width: 90 }} placeholder="Max marks"
                        value={form.loMappings[idx]?.maxMarks || ''} onChange={e => updateLo(idx, e.target.value)} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Create Test</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
