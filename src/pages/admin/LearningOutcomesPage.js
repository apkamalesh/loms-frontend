import React, { useEffect, useState } from 'react';
import { getLearningOutcomes, getSubjects, createLearningOutcome, updateLearningOutcome, deleteLearningOutcome } from '../../services/api';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY={subjectId:'',code:'',description:'',passPercentage:60};
export default function LearningOutcomesPage(){
  const [items,setItems]=useState([]);const [subjects,setSubjects]=useState([]);
  const [modal,setModal]=useState(false);const [form,setForm]=useState(EMPTY);const [editing,setEditing]=useState(null);
  const load=()=>getLearningOutcomes().then(r=>setItems(r.data));
  useEffect(()=>{load();getSubjects().then(r=>setSubjects(r.data));},[]);
  const openCreate=()=>{setForm(EMPTY);setEditing(null);setModal(true);};
  const openEdit=(lo)=>{setForm({subjectId:lo.subjectId,code:lo.code,description:lo.description,passPercentage:lo.passPercentage});setEditing(lo.id);setModal(true);};
  const handleSave=async()=>{
    const p={...form,subjectId:Number(form.subjectId),passPercentage:Number(form.passPercentage)};
    try{if(editing)await updateLearningOutcome(editing,p);else await createLearningOutcome(p);toast.success('Saved');setModal(false);load();}
    catch(e){toast.error(e.response?.data?.message||'Error');}
  };
  const handleDelete=async(id)=>{if(!window.confirm('Delete?'))return;try{await deleteLearningOutcome(id);toast.success('Deleted');load();}catch{toast.error('Cannot delete');}};
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  return(
    <div className="page">
      <div className="page-header-row"><div><h1 className="page-title">Learning Outcomes</h1><p className="page-subtitle">Define measurable outcomes per subject</p></div><button className="btn btn-primary" onClick={openCreate}><Plus size={16}/>Add Outcome</button></div>
      <div className="card"><div className="table-wrap"><table><thead><tr><th>Code</th><th>Description</th><th>Subject</th><th>Pass %</th><th>Actions</th></tr></thead><tbody>
        {items.map(lo=>(
          <tr key={lo.id}><td><span className="badge badge-green">{lo.code}</span></td><td className="bold">{lo.description}</td>
          <td>{lo.subjectName} <span style={{color:'var(--muted)',fontSize:12}}>({lo.subjectCode})</span></td>
          <td><span className="badge badge-yellow">{lo.passPercentage}%</span></td>
          <td><div style={{display:'flex',gap:8}}><button className="btn btn-secondary btn-sm" onClick={()=>openEdit(lo)}><Pencil size={13}/></button><button className="btn btn-danger btn-sm" onClick={()=>handleDelete(lo.id)}><Trash2 size={13}/></button></div></td></tr>
        ))}{!items.length&&<tr><td colSpan={5} className="empty-state">No learning outcomes</td></tr>}
      </tbody></table></div></div>
      {modal&&<div className="modal-overlay" onClick={()=>setModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-title">{editing?'Edit':'Add'} Learning Outcome</div>
        <div className="form-stack">
          <div className="form-group"><label className="form-label">Subject *</label><select className="form-input" value={form.subjectId} onChange={e=>f('subjectId',e.target.value)}><option value="">Select subject</option>{subjects.map(s=><option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}</select></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Code *</label><input className="form-input" value={form.code} onChange={e=>f('code',e.target.value)} placeholder="LO1"/></div>
            <div className="form-group"><label className="form-label">Pass % *</label><input className="form-input" type="number" min={0} max={100} value={form.passPercentage} onChange={e=>f('passPercentage',e.target.value)}/></div>
          </div>
          <div className="form-group"><label className="form-label">Description *</label><textarea className="form-input" value={form.description} onChange={e=>f('description',e.target.value)} rows={3}/></div>
        </div>
        <div className="modal-actions"><button className="btn btn-secondary" onClick={()=>setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>Save</button></div>
      </div></div>}
    </div>
  );
}
