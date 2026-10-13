import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { complaintApi } from '../services/api';
import MainLayout from '../layouts/MainLayout';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { Timeline } from '../components/Timeline';
import { LoadingSpinner, Alert } from '../components/LoadingSpinner';
import { Search, ShieldCheck, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export const TrackComplaint = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [complaintIdInput, setComplaintIdInput] = useState(initialId);
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const performSearch = async (idToSearch) => {
    if (!idToSearch.trim()) return;
    setError('');
    setLoading(true);
    setSearched(true);

    try {
      const res = await complaintApi.trackPublic(idToSearch.trim());
      setComplaint(res.data.complaint);
    } catch (err) {
      setComplaint(null);
      setError(err.message || `No complaint found with ID '${idToSearch}'`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      performSearch(initialId);
    }
  }, [initialId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ id: complaintIdInput.trim() });
    performSearch(complaintIdInput);
  };

  return (
    <MainLayout>
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
            Public Tracking Portal
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Track Complaint Status
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Check the live investigation progress and resolution remarks using your complaint ID
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                required
                value={complaintIdInput}
                onChange={(e) => setComplaintIdInput(e.target.value)}
                placeholder="Enter Complaint ID (e.g. CMP-20261011-8401)"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono uppercase placeholder:font-sans placeholder:normal-case"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Searching...' : 'Track Status'}
            </button>
          </form>

          {/* Quick Click Samples */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Test Sample IDs:</span>
            {['CMP-20261011-8401', 'CMP-20261011-8402', 'CMP-20261011-8403'].map((sampleId) => (
              <button
                key={sampleId}
                type="button"
                onClick={() => {
                  setComplaintIdInput(sampleId);
                  setSearchParams({ id: sampleId });
                  performSearch(sampleId);
                }}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-600 font-mono text-[11px] border border-slate-200 transition-colors"
              >
                {sampleId}
              </button>
            ))}
          </div>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {loading && <LoadingSpinner text="Querying complaint registry..." />}

        {/* Result Card */}
        {complaint && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
                    {complaint.complaintId}
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                    {complaint.title}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={complaint.priority} />
                  <StatusBadge status={complaint.status} />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
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
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-bold text-[10px]">
                    Assigned Staff
                  </span>
                  <span className="font-semibold text-slate-700 mt-0.5 block">
                    {complaint.assignedTo || 'Under Review'}
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

              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Complaint Description
                </h4>
                <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed font-normal">
                  {complaint.description}
                </p>
              </div>

              {/* Remarks Box */}
              {complaint.adminRemarks && (
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
                    Latest Administrator Remarks:
                  </h4>
                  <p className="text-sm text-blue-800">
                    "{complaint.adminRemarks}"
                  </p>
                </div>
              )}

              {/* Status Timeline */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Audit Trail & Status Progression
                </h4>
                <Timeline
                  history={complaint.statusHistory || []}
                  currentStatus={complaint.status}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TrackComplaint;
