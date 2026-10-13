import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintApi, notificationApi } from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import { StatCard } from '../components/StatCard';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { LoadingSpinner, Alert } from '../components/LoadingSpinner';
import {
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  Bell,
  Eye,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const UserDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [compRes, notifRes] = await Promise.all([
          complaintApi.getMyComplaints({ limit: 100 }),
          notificationApi.getNotifications()
        ]);
        setComplaints(compRes.data.complaints || []);
        setNotifications((notifRes.data.notifications || []).slice(0, 5));
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'Pending').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;

  const recentComplaints = complaints.slice(0, 5);

  return (
    <DashboardLayout
      title={`Welcome back, ${user?.name?.split(' ')[0] || 'User'}!`}
      subtitle="Track your submitted complaints and check latest administrative updates"
      actions={
        <Link
          to="/submit-complaint"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Submit New Complaint
        </Link>
      }
    >
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {loading ? (
        <LoadingSpinner text="Loading your dashboard..." />
      ) : (
        <div className="space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Total Complaints"
              value={total}
              icon={FileText}
              color="indigo"
              subtitle="All registered grievances"
            />
            <StatCard
              title="Pending Review"
              value={pending}
              icon={Clock}
              color="amber"
              subtitle="Awaiting admin action"
            />
            <StatCard
              title="In Progress"
              value={inProgress}
              icon={RefreshCw}
              color="blue"
              subtitle="Currently being investigated"
            />
            <StatCard
              title="Resolved"
              value={resolved}
              icon={CheckCircle2}
              color="emerald"
              subtitle="Successfully settled"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Complaints Table (2 Cols) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Recent Complaints
                  </h3>
                  <p className="text-xs text-slate-500">Your latest filed issues</p>
                </div>
                <Link
                  to="/my-complaints"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  View All ({total}) <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentComplaints.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-700">No complaints filed yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Have an issue with college facilities, academics, or IT? Submit your first complaint.
                  </p>
                  <Link
                    to="/submit-complaint"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Submit Complaint
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                      <tr>
                        <th className="px-5 py-3">Complaint ID</th>
                        <th className="px-5 py-3">Title & Category</th>
                        <th className="px-5 py-3">Priority</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentComplaints.map((item) => (
                        <tr key={item._id || item.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-5 py-3.5 font-mono text-xs font-bold text-blue-600 whitespace-nowrap">
                            <Link to={`/complaint/${item.complaintId}`}>
                              {item.complaintId}
                            </Link>
                          </td>
                          <td className="px-5 py-3.5 max-w-xs">
                            <Link
                              to={`/complaint/${item.complaintId}`}
                              className="font-bold text-slate-800 hover:text-blue-600 line-clamp-1 text-sm block"
                            >
                              {item.title}
                            </Link>
                            <span className="text-[11px] text-slate-500 block truncate">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <PriorityBadge priority={item.priority} />
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <StatusBadge status={item.status} />
                          </td>
                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            <Link
                              to={`/complaint/${item.complaintId}`}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg inline-flex"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Notifications Panel (1 Col) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Recent Notifications
                  </h3>
                </div>
                <Link
                  to="/notifications"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  View All
                </Link>
              </div>

              {notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No notifications yet. You'll be notified when your complaints are updated.
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div
                      key={n._id || n.id}
                      className={`p-3 rounded-xl border text-xs transition-colors ${
                        !n.isRead
                          ? 'bg-blue-50/60 border-blue-200 text-slate-800'
                          : 'bg-slate-50 border-slate-100 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">{n.title}</span>
                        <span className="text-[10px] text-slate-400">
                          {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <p className="line-clamp-2 leading-relaxed">{n.message}</p>
                      {n.complaintId && (
                        <Link
                          to={`/complaint/${n.complaintId}`}
                          className="mt-1.5 inline-block font-mono text-[10px] font-bold text-blue-600 hover:underline"
                        >
                          View #{n.complaintId} →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UserDashboard;
