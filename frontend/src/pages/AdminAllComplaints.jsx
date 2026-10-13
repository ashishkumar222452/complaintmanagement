import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintApi, categoryApi } from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { LoadingSpinner, Alert } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Layers,
  FileText,
  AlertTriangle,
  CheckCircle,
  Download
} from 'lucide-react';

export const AdminAllComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Status Modal
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('In Progress');
  const [remarks, setRemarks] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [updating, setUpdating] = useState(false);

  // Delete Modal
  const [complaintToDelete, setComplaintToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const params = { limit: 200 };
      if (statusFilter !== 'All') params.status = statusFilter;
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (priorityFilter !== 'All') params.priority = priorityFilter;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await complaintApi.getAllAdmin(params);
      setComplaints(res.data.complaints || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    categoryApi
      .getAllAdmin()
      .then((res) => setCategories(res.data.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchComplaints();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [statusFilter, categoryFilter, priorityFilter, searchTerm]);

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
      await fetchComplaints();
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!complaintToDelete) return;
    setDeleting(true);
    try {
      await complaintApi.deleteAdmin(
        complaintToDelete._id || complaintToDelete.id || complaintToDelete.complaintId
      );
      setComplaintToDelete(null);
      await fetchComplaints();
    } catch (err) {
      setError(err.message || 'Failed to delete complaint');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout
      title="All Grievances Management"
      subtitle="Complete database of student & staff submitted complaints with administrative controls"
    >
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ID, title, student..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-purple-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-purple-500"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c._id || c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-purple-500"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Total matching records: <strong>{complaints.length}</strong>
          </span>
          {(statusFilter !== 'All' || categoryFilter !== 'All' || priorityFilter !== 'All' || searchTerm) && (
            <button
              onClick={() => {
                setStatusFilter('All');
                setCategoryFilter('All');
                setPriorityFilter('All');
                setSearchTerm('');
              }}
              className="text-purple-600 hover:underline font-bold"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Loading complaint registry..." />
        ) : complaints.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-700">No complaints found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No complaint records matched your criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3.5">ID</th>
                  <th className="px-5 py-3.5">Complainant</th>
                  <th className="px-5 py-3.5">Subject & Category</th>
                  <th className="px-5 py-3.5">Date Filed</th>
                  <th className="px-5 py-3.5">Priority</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Assigned Staff</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((item) => (
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
                      <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">
                        {item.user?.email || item.userEmail || ''}
                      </span>
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <Link
                        to={`/complaint/${item.complaintId}`}
                        className="font-bold text-slate-800 hover:text-purple-700 line-clamp-1 block"
                      >
                        {item.title}
                      </Link>
                      <span className="text-xs text-slate-500 block truncate">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <PriorityBadge priority={item.priority} />
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600 whitespace-nowrap">
                      {item.assignedTo || 'Unassigned'}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => handleOpenUpdate(item)}
                        className="px-2.5 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-bold inline-flex items-center gap-1"
                        title="Update Status"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        to={`/complaint/${item.complaintId}`}
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg inline-flex"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setComplaintToDelete(item)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg inline-flex"
                        title="Delete Complaint"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Update Modal */}
      {selectedComplaint && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedComplaint(null)}
          title={`Update Status: #${selectedComplaint.complaintId}`}
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
                  Assign Staff
                </label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="e.g. Facilities Desk"
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
                placeholder="Document your review notes, findings, or resolution details..."
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

      {/* Delete Confirmation Modal */}
      {complaintToDelete && (
        <Modal
          isOpen={true}
          onClose={() => setComplaintToDelete(null)}
          title="Confirm Deletion"
        >
          <div className="space-y-4">
            <div className="p-3 bg-rose-50 text-rose-800 rounded-xl flex items-start gap-3 border border-rose-200 text-sm">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600" />
              <div>
                <p className="font-bold">Are you sure you want to permanently delete this complaint?</p>
                <p className="text-xs mt-1 text-rose-700">
                  Complaint #{complaintToDelete.complaintId}: "{complaintToDelete.title}". This action cannot be reversed.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setComplaintToDelete(null)}
                className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default AdminAllComplaints;
