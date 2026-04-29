import React, { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser, approveUser } from '../../services/api';
import { Plus, Pencil, Trash2, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY={name:'',email:'',password:'',role:'STUDENT',approved:false};
const roleColor={ADMIN:'badge-red',TEACHER:'badge-blue',STUDENT:'badge-green'};
export default function UsersPage(){
  const [items,setItems]=useState([]);const [modal,setModal]=useState(false);const [form,setForm]=useState(EMPTY);const [editing,setEditing]=useState(null);
  const load=()=>getUsers().then(r=>setItems(r.data));
  useEffect(()=>{load();},[]);
  const openCreate=()=>{setForm(EMPTY);setEditing(null);setModal(true);};
  const openEdit=(u)=>{setForm({name:u.name,email:u.email,password:'',role:u.role,approved:u.approved});setEditing(u.id);setModal(true);};
  const handleSave=async()=>{try{if(editing)await updateUser(editing,form);else await createUser(form);toast.success('Saved');setModal(false);load();}catch(e){toast.error(e.response?.data?.message||'Error');}};
  const handleDelete=async(id)=>{if(!window.confirm('Delete user?'))return;try{await deleteUser(id);toast.success('Deleted');load();}catch{toast.error('Cannot delete');}};
  const handleApprove=async(id,name)=>{try{await approveUser(id);toast.success(`${name} approved`);load();}catch{toast.error('Failed');}};
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  return(
    <div className="page">
      <div className="page-header-row"><div><h1 className="page-title">Users</h1><p className="page-subtitle">Manage all system users</p></div><button className="btn btn-primary" onClick={openCreate}><Plus size={16}/>Add User</button></div>
      <div className="card"><div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Logins</th><th>Last Login</th><th>Actions</th></tr></thead><tbody>
        {items.map(u=>(
          <tr key={u.id}><td className="bold">{u.name}</td><td>{u.email}</td>
          <td><span className={`badge ${roleColor[u.role]}`}>{u.role}</span></td>
          <td>{u.approved?<span className="badge badge-green">Active</span>:<span className="badge badge-yellow">Pending</span>}</td>
          <td style={{textAlign:'center'}}>{u.loginCount||0}</td>
          <td style={{fontSize:12}}>{u.lastLogin?new Date(u.lastLogin).toLocaleDateString('en-IN'):'Never'}</td>
          <td><div style={{display:'flex',gap:6}}>
            {!u.approved&&<button className="btn btn-success btn-sm" onClick={()=>handleApprove(u.id,u.name)}><UserCheck size={13}/></button>}
            <button className="btn btn-secondary btn-sm" onClick={()=>openEdit(u)}><Pencil size={13}/></button>
            <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(u.id)}><Trash2 size={13}/></button>
          </div></td></tr>
        ))}{!items.length&&<tr><td colSpan={7} className="empty-state">No users</td></tr>}
      </tbody></table></div></div>
      {modal&&<div className="modal-overlay" onClick={()=>setModal(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-title">{editing?'Edit':'Add'} User</div>
        <div className="form-stack">
          <div className="form-group"><label className="form-label">Name *</label><input className="form-input" value={form.name} onChange={e=>f('name',e.target.value)} placeholder="Full name"/></div>
          <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" value={form.email} onChange={e=>f('email',e.target.value)} placeholder="user@loms.edu"/></div>
          <div className="form-group"><label className="form-label">{editing?'New Password (blank to keep)':'Password *'}</label><input className="form-input" type="password" value={form.password} onChange={e=>f('password',e.target.value)} placeholder="Password"/></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Role *</label><select className="form-input" value={form.role} onChange={e=>f('role',e.target.value)}>{['ADMIN','TEACHER','STUDENT'].map(r=><option key={r} value={r}>{r}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Status</label><select className="form-input" value={form.approved} onChange={e=>f('approved',e.target.value==='true')}><option value="true">Approved</option><option value="false">Pending</option></select></div>
          </div>
        </div>
        <div className="modal-actions"><button className="btn btn-secondary" onClick={()=>setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleSave}>Save</button></div>
      </div></div>}
    </div>
  );
}
