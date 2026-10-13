import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintApi } from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { Timeline } from '../components/Timeline';
import { LoadingSpinner, Alert } from '../components/LoadingSpinner';
import { Modal } from '../components/Modal';
import {
  ArrowLeft,
  Calendar,
  Layers,
  Copy,
  Check,
  User,
  Shield,
  FileText,
  Maximize2,
  Edit,
  Trash2,
  Clock
} from 'lucide-react';

export const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  // Admin status update state
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('In Progress');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      const res = await complaintApi.getDetails(id);
      setComplaint(res.data.complaint);
      setNewStatus(res.data.complaint.status);
      setAdminRemarks(res.data.complaint.adminRemarks || '');
      setAssignedTo(res.data.complaint.assignedTo || 'Unassigned');
    } catch (err) {
      setError(err.message || 'Failed to fetch complaint details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const handleCopyId = () => {
    if (complaint?.complaintId) {
      navigator.clipboard.writeText(complaint.complaintId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await complaintApi.updateStatusAdmin(complaint._id || complaint.id || complaint.complaintId, {
        status: newStatus,
        remarks: adminRemarks.trim(),
        assignedTo: assignedTo.trim()
      });
      setStatusModalOpen(false);
      await fetchComplaint();
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Back Nav */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          {isAdmin && (
            <button
              onClick={() => setStatusModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              <Edit className="w-3.5 h-3.5" /> Update Status / Remarks
            </button>
          )}
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {loading ? (
          <LoadingSpinner text="Loading complaint details..." />
        ) : !complaint ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-800">Complaint Not Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              The requested complaint record does not exist or you lack permission.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                    {complaint.complaintId}
                  </span>
                  <button
                    onClick={handleCopyId}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    title="Copy ID"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <PriorityBadge priority={complaint.priority} />
                  <StatusBadge status={complaint.status} />
                </div>
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 leading-snug">
                {complaint.title}
              </h2>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block uppercase font-bold text-[10px]">
                    Category
                  </span>
                  <span className="font-semibold text-slate-700 mt-0.5 block">
                    {complaint.category}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-bold text-[10px]">
                    Filed Date
                  </span>
                  <span className="font-semibold text-slate-700 mt-0.5 block">
                    {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-bold text-[10px]">
                    Assigned Staff
                  </span>
                  <span className="font-semibold text-slate-700 mt-0.5 block">
                    {complaint.assignedTo || 'Unassigned'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-bold text-[10px]">
                    Resolution Date
                  </span>
                  <span className="font-semibold text-slate-700 mt-0.5 block">
                    {complaint.resolutionDate
                      ? new Date(complaint.resolutionDate).toLocaleDateString()
                      : 'Pending'}
                  </span>
                </div>
              </div>

              {/* User details if admin */}
              {isAdmin && complaint.user && (
                <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50 p-3 rounded-xl flex flex-wrap items-center gap-4 text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-600" /> Complainant Info:
                  </span>
                  <span>
                    Name: <strong>{complaint.user.name}</strong>
                  </span>
                  <span>
                    Email: <strong>{complaint.user.email}</strong>
                  </span>
                  {complaint.user.phone && (
                    <span>
                      Phone: <strong>{complaint.user.phone}</strong>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Description & Image Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Full Description
              </h3>
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-100 font-normal">
                {complaint.description}
              </p>

              {complaint.imageUrl && (
                <div className="pt-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Attached Photo Evidence
                  </h4>
                  <div className="relative inline-block border border-slate-200 rounded-xl overflow-hidden group">
                    <img
                      src={complaint.imageUrl}
                      alt="Complaint attachment"
                      className="max-h-60 rounded-xl object-contain cursor-pointer"
                      onClick={() => setImageModalOpen(true)}
                    />
                    <button
                      type="button"
                      onClick={() => setImageModalOpen(true)}
                      className="absolute bottom-2 right-2 p-1.5 bg-slate-900/70 text-white rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                    >
                      <Maximize2 className="w-3.5 h-3.5" /> Enlarge
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Status History & Audit Timeline Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Status Audit History & Remarks
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  {complaint.statusHistory?.length || 0} event(s) recorded
                </span>
              </div>

              <Timeline
                history={complaint.statusHistory || []}
                currentStatus={complaint.status}
              />
            </div>
          </div>
        )}
      </div>

      {/* Image Zoom Modal */}
      {imageModalOpen && complaint?.imageUrl && (
        <Modal
          isOpen={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          title="Attached Photo Evidence"
          maxWidth="max-w-3xl"
        >
          <div className="text-center">
            <img
              src={complaint.imageUrl}
              alt="Enlarged complaint evidence"
              className="max-h-[75vh] mx-auto rounded-lg object-contain"
            />
          </div>
        </Modal>
      )}

      {/* Admin Status Update Modal */}
      {statusModalOpen && (
        <Modal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          title={`Update Complaint #${complaint?.complaintId}`}
        >
          <form onSubmit={handleUpdateStatusSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Complaint Status *
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
                Assign Staff / Department
              </label>
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="e.g. Facilities Management, Network Team"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Administrator Remarks / Resolution Notes *
              </label>
              <textarea
                rows={4}
                required
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
                placeholder="Explain the inspection findings, actions undertaken, or reason for resolution/rejection..."
                className="w-full p-3 rounded-xl border border-slate-300 text-sm"
              ></textarea>
              <span className="text-[11px] text-slate-400 mt-1 block">
                These remarks will be visible to the student complainant and logged in history.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStatusModalOpen(false)}
                className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-sm disabled:opacity-50"
              >
                {updating ? 'Saving Changes...' : 'Save & Notify User'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default ComplaintDetails;
