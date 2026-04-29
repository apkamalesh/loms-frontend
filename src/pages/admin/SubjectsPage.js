import React, { useEffect, useState } from 'react';
import { getSubjects, getDepartments, getUsersByRole, createSubject, updateSubject, deleteSubject } from '../../services/api';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY={name:'',code:'',departmentId:'',teacherId:'',description:''};
export default function SubjectsPage(){
  const [items,setItems]=useState([]);const [depts,setDepts]=useState([]);const [teachers,setTeachers]=useState([]);
  const [modal,setModal]=useState(false);const [form,setForm]=useState(EMPTY);const [editing,setEditing]=useState(null);
  const load=()=>getSubjects().then(r=>setItems(r.data));
  useEffect(()=>{load();getDepartments().then(r=>setDepts(r.data));getUsersByRole('TEACHER').then(r=>setTeachers(r.data));},[]);
  const openCreate=()=>{setForm(EMPTY);setEditing(null);setModal(true);};
  const openEdit=(s)=>{setForm({name:s.name,code:s.code,departmentId:s.departmentId,teacherId:s.teacherId||'',description:s.description||''});setEditing(s.id);setModal(true);};
  const handleSave=async()=>{
    const p={...form,departmentId:Number(form.departmentId),teacherId:form.teacherId?Number(form.teacherId):null};
    try{if(editing)await updateSubject(editing,p);else await createSubject(p);toast.success('Saved');setModal(false);load();}
    catch(e){toast.error(e.response?.data?.message||'Error');}
  };
  const handleDelete=async(id)=>{if(!window.confirm('Delete?'))return;try{await deleteSubject(id);toast.success('Deleted');load();}catch{toast.error('Cannot delete');}};
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  return(
    <div className="page">
      <div className="page-header-row"><div><h1 className="page-title">Subjects</h1><p className="page-subtitle">Manage subjects and assign teachers</p></div><button className="btn btn-primary" onClick={openCreate}><Plus size={16}/>Add Subject</button></div>
      <div className="card"><div className="table-wrap"><table><thead><tr><th>Name</th><th>Code</th><th>Department</th><th>Teacher</th><th>LOs</th><th>Tests</th><th>Actions</th></tr></thead><tbody>
        {items.map(s=>(
          <tr key={s.id}><td className="bold">{s.name}</td><td><span className="badge badge-gray">{s.code}</span></td><td>{s.departmentName}</td>
          <td>{s.teacherName||<span style={{color:'var(--muted)'}}>Unassigned</span>}</td>
          <td><span className="badge badge-green">{s.outcomeCount}</span></td><td><span className="badge badge-yellow">{s.testCount}</span></td>
          <td><div style={{display:'flex',gap:8}}><button className="btn btn-secondary btn-sm" onClick={()=>openEdit(s)}><Pencil size={13}/></button><button className="btn btn-danger btn-sm" onClick={()=>handleDelete(s.id)}><Trash2 size={13}/></button></div></td></tr>
        ))}{!items.length&&<tr><td colSpan={7} className="empty-state">No subjects</td></tr>}
      </tbody></table></div></div>
      {modal&&<div className="modal-overlay" onClick={()=>setModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-title">{editing?'Edit':'Add'} Subject</div>
        <div className="form-stack">
          <div className="form-row">
            <div className="form-group"><label className="form-label">Name *</label><input className="form-input" value={form.name} onChange={e=>f('name',e.target.value)} placeholder="Subject name"/></div>
            <div className="form-group"><label className="form-label">Code *</label><input className="form-input" value={form.code} onChange={e=>f('code',e.target.value)} placeholder="CS201"/></div>
          </div>
          <div className="form-group"><label className="form-label">Department *</label><select className="form-input" value={form.departmentId} onChange={e=>f('departmentId',e.target.value)}><option value="">Select department</option>{depts.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Teacher</label><select className="form-input" value={form.teacherId} onChange={e=>f('teacherId',e.target.value)}><option value="">Unassigned</option>{teachers.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" value={form.description} onChange={e=>f('description',e.target.value)} rows={2}/></div>
        </div>
        <div className="modal-actions"><button className="btn btn-secondary" onClick={()=>setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>Save</button></div>
      </div></div>}
    </div>
  );
}
