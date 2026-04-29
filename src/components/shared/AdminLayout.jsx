import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import {
  LayoutDashboard, Building2, BookOpen, GraduationCap,
  Users, UserCheck, Activity, ClipboardList, PenLine, BarChart2
} from 'lucide-react';
import { getPendingUsers } from '../../services/api';

export function AdminLayout() {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    getPendingUsers()
      .then(r => setPendingCount(r.data?.length ?? 0))
      .catch(() => setPendingCount(0));
  }, []);

  const links = [
    { to: '/admin/dashboard',        icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/departments',       icon: Building2,       label: 'Departments' },
    { to: '/admin/subjects',          icon: BookOpen,        label: 'Subjects' },
    { to: '/admin/learning-outcomes', icon: GraduationCap,   label: 'Learning Outcomes' },
    { to: '/admin/users',             icon: Users,           label: 'Users' },
    { to: '/admin/pending-users',     icon: UserCheck,       label: 'Pending Approvals', badge: pendingCount },
    { to: '/admin/login-logs',        icon: Activity,        label: 'Visitor Logs' },
  ];

  return (
    <div className="layout">
      <Sidebar links={links} />
      <main className="main-content"><Outlet /></main>
    </div>
  );
}

export function TeacherLayout() {
  const links = [
    { to: '/teacher/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/teacher/tests',         icon: ClipboardList,   label: 'Tests' },
    { to: '/teacher/enter-marks',   icon: PenLine,         label: 'Enter Marks' },
    { to: '/teacher/class-summary', icon: BarChart2,       label: 'Class Summary' },
  ];
  return (
    <div className="layout">
      <Sidebar links={links} />
      <main className="main-content"><Outlet /></main>
    </div>
  );
}

export function StudentLayout() {
  const links = [
    { to: '/student/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/my-results', icon: ClipboardList,   label: 'My Results' },
  ];
  return (
    <div className="layout">
      <Sidebar links={links} />
      <main className="main-content"><Outlet /></main>
    </div>
  );
}

export default AdminLayout;
