import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { BookOpen, Menu, X } from 'lucide-react';
import {
  LayoutDashboard, Building2, GraduationCap,
  Users, UserCheck, Activity, ClipboardList, PenLine, BarChart2
} from 'lucide-react';
import { getPendingUsers } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function Layout({ links, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  // Close sidebar on resize to desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth > 768) setSidebarOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <div className="layout">
      {/* Mobile top bar */}
      <div className="topbar">
        <div className="topbar-brand">
          <div className="topbar-brand-icon">
            <BookOpen size={18} color="#0a0a0a" />
          </div>
          <div>
            <div className="topbar-brand-title">LOMS</div>
            <div className="topbar-brand-sub">Learning Outcomes</div>
          </div>
        </div>
        <button className="topbar-menu-btn" onClick={() => setSidebarOpen(o => !o)}>
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <Sidebar
        links={links}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export function AdminLayout() {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    getPendingUsers()
      .then(r => setPendingCount(r.data?.length ?? 0))
      .catch(() => setPendingCount(0));
  }, []);

  const links = [
    { to: '/admin/dashboard',         icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/departments',        icon: Building2,       label: 'Departments' },
    { to: '/admin/subjects',           icon: BookOpen,        label: 'Subjects' },
    { to: '/admin/learning-outcomes',  icon: GraduationCap,   label: 'Learning Outcomes' },
    { to: '/admin/users',              icon: Users,           label: 'Users' },
    { to: '/admin/pending-users',      icon: UserCheck,       label: 'Pending Approvals', badge: pendingCount },
    { to: '/admin/login-logs',         icon: Activity,        label: 'Visitor Logs' },
  ];

  return <Layout links={links} />;
}

export function TeacherLayout() {
  const links = [
    { to: '/teacher/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/teacher/tests',         icon: ClipboardList,   label: 'Tests' },
    { to: '/teacher/enter-marks',   icon: PenLine,         label: 'Enter Marks' },
    { to: '/teacher/class-summary', icon: BarChart2,       label: 'Class Summary' },
  ];
  return <Layout links={links} />;
}

export function StudentLayout() {
  const links = [
    { to: '/student/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/my-results', icon: ClipboardList,   label: 'My Results' },
  ];
  return <Layout links={links} />;
}

export default AdminLayout;
