import React, { useEffect, useState } from 'react';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../../services/api';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY = { name:'', code:'', description:'' };
export default function DepartmentsPage() {
  const [items,setItems]=useState([]);const [modal,setModal]=useState(false);const [form,setForm]=useState(EMPTY);const [editing,setEditing]=useState(null);
  const load=()=>getDepartments().then(r=>setItems(r.data));
  useEffect(()=>{load();},[]);
  const openCreate=()=>{setForm(EMPTY);setEditing(null);setModal(true);};
  const openEdit=(d)=>{setForm({name:d.name,code:d.code,description:d.description||''});setEditing(d.id);setModal(true);};
  const handleSave=async()=>{
    try{if(editing)await updateDepartment(editing,form);else await createDepartment(form);toast.success('Saved');setModal(false);load();}
    catch(e){toast.error(e.response?.data?.message||'Error');}
  };
  const handleDelete=async(id)=>{if(!window.confirm('Delete?'))return;try{await deleteDepartment(id);toast.success('Deleted');load();}catch{toast.error('Cannot delete');}};
  return (
    <div className="page">
      <div className="page-header-row"><div><h1 className="page-title">Departments</h1><p className="page-subtitle">Manage academic departments</p></div><button className="btn btn-primary" onClick={openCreate}><Plus size={16}/>Add Department</button></div>
      <div className="card"><div className="table-wrap"><table><thead><tr><th>Name</th><th>Code</th><th>Description</th><th>Subjects</th><th>Actions</th></tr></thead><tbody>
        {items.map(d=>(
          <tr key={d.id}><td className="bold">{d.name}</td><td><span className="badge badge-gray">{d.code}</span></td><td>{d.description||'—'}</td><td><span className="badge badge-green">{d.subjectCount}</span></td>
          <td><div style={{display:'flex',gap:8}}><button className="btn btn-secondary btn-sm" onClick={()=>openEdit(d)}><Pencil size={13}/></button><button className="btn btn-danger btn-sm" onClick={()=>handleDelete(d.id)}><Trash2 size={13}/></button></div></td></tr>
        ))}{!items.length&&<tr><td colSpan={5} className="empty-state">No departments</td></tr>}
      </tbody></table></div></div>
      {modal&&<div className="modal-overlay" onClick={()=>setModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-title">{editing?'Edit':'Add'} Department</div>
        <div className="form-stack">
          <div className="form-group"><label className="form-label">Name *</label><input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Computer Science"/></div>
          <div className="form-group"><label className="form-label">Code *</label><input className="form-input" value={form.code} onChange={e=>setForm({...form,code:e.target.value})} placeholder="e.g. CS"/></div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3}/></div>
        </div>
        <div className="modal-actions"><button className="btn btn-secondary" onClick={()=>setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>Save</button></div>
      </div></div>}
    </div>
  );
}
