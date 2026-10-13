import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationApi } from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import { LoadingSpinner, Alert } from '../components/LoadingSpinner';
import { Bell, CheckCheck, FileText, ArrowRight } from 'lucide-react';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationApi.getNotifications();
      setNotifications(res.data.notifications || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      setError(err.message || 'Failed to mark all as read');
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationApi.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id || n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      // silent
    }
  };

  return (
    <DashboardLayout
      title="Notifications & Alerts"
      subtitle="Stay updated with all status changes on your lodged complaints"
      actions={
        notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-blue-600" /> Mark All as Read
          </button>
        )
      }
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {loading ? (
          <LoadingSpinner text="Fetching your notifications..." />
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800">No Notifications</h4>
            <p className="text-xs text-slate-500">
              You will receive real-time updates here whenever an administrator reviews or updates your complaints.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {notifications.map((n) => (
              <div
                key={n._id || n.id}
                onClick={() => !n.isRead && handleMarkRead(n._id || n.id)}
                className={`p-5 transition-colors flex items-start justify-between gap-4 ${
                  !n.isRead ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'hover:bg-slate-50/80'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 animate-ping"></span>
                    )}
                    <h4 className="font-bold text-sm text-slate-900">{n.title}</h4>
                    <span className="text-[11px] text-slate-400">
                      {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-4">
                    {n.message}
                  </p>
                  {n.complaintId && (
                    <div className="pl-4 pt-1">
                      <Link
                        to={`/complaint/${n.complaintId}`}
                        className="inline-flex items-center gap-1 font-mono text-xs font-bold text-blue-600 hover:underline"
                      >
                        Inspect #{n.complaintId} <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
