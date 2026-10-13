import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  User,
  Bell,
  BarChart3,
  Layers,
  Settings,
  ShieldAlert
} from 'lucide-react';

export const Sidebar = () => {
  const { isAdmin, user } = useAuth();

  const userLinks = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/submit-complaint', label: 'File Complaint', icon: PlusCircle },
    { to: '/my-complaints', label: 'My Complaints', icon: FileText },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/profile', label: 'My Profile', icon: User }
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { to: '/admin/complaints', label: 'Manage Complaints', icon: FileText },
    { to: '/admin/categories', label: 'Manage Categories', icon: Layers },
    { to: '/admin/reports', label: 'Analytics & Reports', icon: BarChart3 },
    { to: '/profile', label: 'Admin Profile', icon: User }
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col flex-shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Role Banner */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${
              isAdmin ? 'bg-purple-600 shadow-purple-600/20' : 'bg-blue-600 shadow-blue-600/20'
            }`}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-slate-900 truncate">{user?.name}</h4>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            <span
              className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                isAdmin
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}
            >
              {isAdmin ? 'Administrator' : 'Student / User'}
            </span>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="p-3 space-y-1 flex-1">
        <p className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Navigation Menu
        </p>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/dashboard' || link.to === '/admin/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? isAdmin
                      ? 'bg-purple-50 text-purple-700 shadow-sm border border-purple-100'
                      : 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 ${
                      isActive
                        ? isAdmin
                          ? 'text-purple-600'
                          : 'text-blue-600'
                        : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{link.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Info */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/60">
        <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-500 shadow-sm">
          <p className="font-semibold text-slate-700 mb-1">⚡ Quick Help</p>
          <p className="text-[11px] leading-relaxed text-slate-500">
            For urgent college issues, mark complaints with <span className="font-semibold text-rose-600">Urgent</span> priority.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
