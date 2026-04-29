import React, { useEffect, useState } from 'react';
import { getSubjectsByTeacher, getTestsBySubject, getEnrolledStudents, getUsersByRole, enterMarks } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EnterMarksPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [selSubj, setSelSubj]   = useState('');
  const [tests, setTests]       = useState([]);
  const [selTest, setSelTest]   = useState(null);
  const [students, setStudents] = useState([]);
  const [marks, setMarks]       = useState({});

  useEffect(() => { if (user) getSubjectsByTeacher(user.id).then(r => setSubjects(r.data)); }, [user]);
  useEffect(() => { if (selSubj) getTestsBySubject(selSubj).then(r => setTests(r.data)); }, [selSubj]);

  const handleSelectTest = async (test) => {
    if (!test) return;
    setSelTest(test);
    const sids = (await getEnrolledStudents(selSubj)).data;
    const all  = (await getUsersByRole('STUDENT')).data;
    const enrolled = all.filter(s => sids.includes(s.id));
    setStudents(enrolled);
    const init = {};
    enrolled.forEach(s => { test.loMappings?.forEach(m => { init[`${s.id}_${m.learningOutcomeId}`] = ''; }); });
    setMarks(init);
  };

  const handleSave = async () => {
    const entries = [];
    students.forEach(s => {
      selTest.loMappings?.forEach(m => {
        const v = marks[`${s.id}_${m.learningOutcomeId}`];
        if (v !== '' && v !== undefined) entries.push({ studentId: s.id, learningOutcomeId: m.learningOutcomeId, marksObtained: Number(v) });
      });
    });
    try { await enterMarks({ testId: selTest.id, marks: entries }); toast.success('Marks saved!'); }
    catch { toast.error('Error saving marks'); }
  };

  return (
    <div className="page">
      <div className="page-header"><h1 className="page-title">Enter Marks</h1><p className="page-subtitle">Enter per-LO marks for each student</p></div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Subject</label>
            <select className="form-input" value={selSubj} onChange={e => { setSelSubj(e.target.value); setSelTest(null); }}>
              <option value="">-- Select subject --</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Test</label>
            <select className="form-input" value={selTest?.id || ''} onChange={e => handleSelectTest(tests.find(t => t.id === Number(e.target.value)))}>
              <option value="">-- Select test --</option>
              {tests.map(t => <option key={t.id} value={t.id}>{t.name} ({t.testDate})</option>)}
            </select>
          </div>
        </div>
      </div>
      {selTest && students.length > 0 && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{selTest.name} — Marks Entry</div>
            <button className="btn btn-primary" onClick={handleSave}><Save size={15} />Save Marks</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Student</th>{selTest.loMappings?.map(m => <th key={m.id}>{m.loCode} <span style={{ color: 'var(--muted)', fontWeight: 400 }}>/ {m.maxMarks}</span></th>)}</tr></thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td className="bold">{s.name}</td>
                    {selTest.loMappings?.map(m => (
                      <td key={m.id}>
                        <input className="form-input" type="number" min={0} max={m.maxMarks} style={{ width: 80, padding: '6px 10px' }}
                          value={marks[`${s.id}_${m.learningOutcomeId}`] || ''}
                          onChange={e => setMarks(p => ({ ...p, [`${s.id}_${m.learningOutcomeId}`]: e.target.value }))} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {selTest && !students.length && <div className="card"><div className="empty-state">No students enrolled</div></div>}
    </div>
  );
}
