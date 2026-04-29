import React, { useEffect, useState } from 'react';
import { getPendingUsers, approveUser, deleteUser } from '../../services/api';
import { UserCheck, Trash2, GraduationCap, BookOpenCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PendingUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getPendingUsers().then(r => { setUsers(r.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleApprove = async (id, name) => {
    try {
      await approveUser(id);
      toast.success(`${name} approved successfully`);
      load();
    } catch { toast.error('Failed to approve'); }
  };

  const handleReject = async (id, name) => {
    if (!window.confirm(`Reject and delete ${name}'s account?`)) return;
    try {
      await deleteUser(id);
      toast.success(`${name}'s account rejected`);
      load();
    } catch { toast.error('Failed to reject'); }
  };

  const roleIcon = (role) => role === 'TEACHER'
    ? <BookOpenCheck size={14} style={{ marginRight: 4 }} />
    : <GraduationCap size={14} style={{ marginRight: 4 }} />;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Pending Approvals</h1>
        <p className="page-subtitle">Review and approve new student / teacher registrations</p>
      </div>

      {loading ? <div className="spinner" /> : (
        <div className="card">
          {users.length === 0 ? (
            <div className="empty-state">
              <UserCheck size={40} style={{ margin: '0 auto 12px', color: '#10b981' }} />
              <div>No pending approvals — you're all caught up!</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Role</th><th>Registered</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td className="bold">{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'TEACHER' ? 'badge-blue' : 'badge-green'}`}>
                          {roleIcon(u.role)}{u.role}
                        </span>
                      </td>
                      <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn btn-success btn-sm" onClick={() => handleApprove(u.id, u.name)}>
                            <UserCheck size={13} /> Approve
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleReject(u.id, u.name)}>
                            <Trash2 size={13} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
