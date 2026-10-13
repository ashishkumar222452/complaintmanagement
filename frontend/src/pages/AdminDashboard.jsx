import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintApi } from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import { StatCard } from '../components/StatCard';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { LoadingSpinner, Alert } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';
import {
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Eye,
  Edit,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Layers,
  ShieldCheck
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
    byCategory: []
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Status update modal state
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('In Progress');
  const [remarks, setRemarks] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, complaintsRes] = await Promise.all([
        complaintApi.getStatsAdmin(),
        complaintApi.getAllAdmin({ limit: 6 })
      ]);
      setStats(statsRes.data.stats || {});
      setRecentComplaints(complaintsRes.data.complaints || []);
    } catch (err) {
      setError(err.message || 'Failed to load administrator dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenUpdate = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setRemarks(complaint.adminRemarks || '');
    setAssignedTo(complaint.assignedTo || 'Unassigned');
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setUpdating(true);

    try {
      await complaintApi.updateStatusAdmin(
        selectedComplaint._id || selectedComplaint.id || selectedComplaint.complaintId,
        {
          status: newStatus,
          remarks: remarks.trim(),
          assignedTo: assignedTo.trim()
        }
      );
      setSelectedComplaint(null);
      await fetchData();
    } catch (err) {
      setError(err.message || 'Failed to update complaint status');
    } finally {
      setUpdating(false);
    }
  };

  const resolutionRate =
    stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  return (
    <DashboardLayout
      title="Administrator Operations Console"
      subtitle="Overview of campus grievances, status distributions, and recent submissions"
      actions={
        <Link
          to="/admin/complaints"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5" /> All Complaints ({stats.total})
        </Link>
      }
    >
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {loading ? (
        <LoadingSpinner text="Gathering administrative metrics..." />
      ) : (
        <div className="space-y-8">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              title="Total Filed"
              value={stats.total}
              icon={FileText}
              color="indigo"
              subtitle="All grievances"
            />
            <StatCard
              title="Pending"
              value={stats.pending}
              icon={Clock}
              color="amber"
              subtitle="Needs review"
            />
            <StatCard
              title="In Progress"
              value={stats.inProgress}
              icon={RefreshCw}
              color="blue"
              subtitle="Being resolved"
            />
            <StatCard
              title="Resolved"
              value={stats.resolved}
              icon={CheckCircle2}
              color="emerald"
              subtitle={`${resolutionRate}% success rate`}
            />
            <StatCard
              title="Rejected"
              value={stats.rejected}
              icon={XCircle}
              color="rose"
              subtitle="Closed / Invalid"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart 1: Status Distribution */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Complaints by Status Distribution
                  </h3>
                </div>
                <span className="text-xs font-bold text-emerald-600">
                  {resolutionRate}% Resolved
                </span>
              </div>

              {/* Progress Bar Breakdown */}
              <div className="space-y-4 py-2">
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                  <div
                    style={{
                      width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%`
                    }}
                    className="bg-amber-500 h-full transition-all duration-500"
                    title={`Pending: ${stats.pending}`}
                  ></div>
                  <div
                    style={{
                      width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%`
                    }}
                    className="bg-blue-500 h-full transition-all duration-500"
                    title={`In Progress: ${stats.inProgress}`}
                  ></div>
                  <div
                    style={{
                      width: `${stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0}%`
                    }}
                    className="bg-emerald-500 h-full transition-all duration-500"
                    title={`Resolved: ${stats.resolved}`}
                  ></div>
                  <div
                    style={{
                      width: `${stats.total > 0 ? (stats.rejected / stats.total) * 100 : 0}%`
                    }}
                    className="bg-rose-500 h-full transition-all duration-500"
                    title={`Rejected: ${stats.rejected}`}
                  ></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                    <span className="text-slate-500 block text-[11px]">Pending</span>
                    <strong className="text-amber-800 text-base">{stats.pending}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100">
                    <span className="text-slate-500 block text-[11px]">In Progress</span>
                    <strong className="text-blue-800 text-base">{stats.inProgress}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                    <span className="text-slate-500 block text-[11px]">Resolved</span>
                    <strong className="text-emerald-800 text-base">{stats.resolved}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100">
                    <span className="text-slate-500 block text-[11px]">Rejected</span>
                    <strong className="text-rose-800 text-base">{stats.rejected}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart 2: Category Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Grievance Volume by Category
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  {stats.byCategory.length} Categories
                </span>
              </div>

              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {stats.byCategory.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No data</p>
                ) : (
                  stats.byCategory.map((cat, idx) => {
                    const percentage =
                      stats.total > 0 ? Math.round((cat.count / stats.total) * 100) : 0;
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700 truncate max-w-[200px]">
                            {cat.category}
                          </span>
                          <span className="text-slate-500 font-bold">
                            {cat.count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Recent Complaints Awaiting Attention */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Latest Submitted Complaints
                </h3>
                <p className="text-xs text-slate-500">
                  Review grievances, assign staff, and post resolution notes
                </p>
              </div>
              <Link
                to="/admin/complaints"
                className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                Manage All Complaints <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3.5">ID</th>
                    <th className="px-5 py-3.5">Complainant</th>
                    <th className="px-5 py-3.5">Subject & Category</th>
                    <th className="px-5 py-3.5">Priority</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentComplaints.map((item) => (
                    <tr key={item._id || item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs font-bold text-purple-700 whitespace-nowrap">
                        <Link to={`/complaint/${item.complaintId}`}>
                          {item.complaintId}
                        </Link>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-900 text-xs block">
                          {item.user?.name || item.userName || 'Student'}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {item.user?.email || item.userEmail || ''}
                        </span>
                      </td>
                      <td className="px-5 py-4 max-w-xs">
                        <Link
                          to={`/complaint/${item.complaintId}`}
                          className="font-bold text-slate-800 hover:text-purple-700 line-clamp-1 block text-sm"
                        >
                          {item.title}
                        </Link>
                        <span className="text-xs text-slate-500 block truncate">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <PriorityBadge priority={item.priority} />
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap space-x-1">
                        <button
                          onClick={() => handleOpenUpdate(item)}
                          className="px-2.5 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" /> Update
                        </button>
                        <Link
                          to={`/complaint/${item.complaintId}`}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg inline-flex"
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
          </div>
        </div>
      )}

      {/* Admin Quick Status Update Modal */}
      {selectedComplaint && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedComplaint(null)}
          title={`Update Complaint #${selectedComplaint.complaintId}`}
        >
          <form onSubmit={handleSaveStatus} className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">Subject:</p>
              <p className="text-sm font-bold text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {selectedComplaint.title}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Assign Staff / Dept
                </label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="e.g. Electrical Team"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Resolution Notes / Remarks *
              </label>
              <textarea
                rows={4}
                required
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="State the findings, actions taken, or reason for resolution/rejection..."
                className="w-full p-3 rounded-xl border border-slate-300 text-sm"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm disabled:opacity-50"
              >
                {updating ? 'Saving...' : 'Update & Notify'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
