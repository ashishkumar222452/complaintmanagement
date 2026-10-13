import React, { useState, useEffect } from 'react';
import { complaintApi } from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import { LoadingSpinner, Alert } from '../components/LoadingSpinner';
import {
  BarChart3,
  Printer,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  TrendingUp,
  Award,
  Calendar
} from 'lucide-react';

export const AdminReports = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
    byCategory: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await complaintApi.getStatsAdmin();
        setStats(res.data.stats || {});
      } catch (err) {
        setError(err.message || 'Failed to fetch statistical reports');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const resolutionRate =
    stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;
  const pendingRate =
    stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0;
  const inProgressRate =
    stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0;

  return (
    <DashboardLayout
      title="Grievance Analytics & Reports"
      subtitle="Comprehensive statistical breakdown, KPIs, and printable academic summary"
      actions={
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
        >
          <Printer className="w-4 h-4" /> Print / Export Report
        </button>
      }
    >
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {loading ? (
        <LoadingSpinner text="Compiling statistical metrics..." />
      ) : (
        <div className="space-y-8 print:p-0">
          {/* Executive Summary Card */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
              <div>
                <span className="text-xs uppercase font-bold text-blue-300 tracking-widest block mb-1">
                  Executive KPI Overview
                </span>
                <h2 className="text-2xl sm:text-3xl font-black">
                  Annual Grievance Redressal Audit
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Online Complaint Management System (Academic Year 2026)
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Report Generated:</span>
                <span className="text-sm font-mono font-bold text-slate-200">
                  {new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                <p className="text-xs text-blue-200 font-semibold uppercase">
                  Total Complaints
                </p>
                <h3 className="text-3xl font-black text-white mt-1">
                  {stats.total}
                </h3>
                <span className="text-[10px] text-slate-300">100% Registry Log</span>
              </div>

              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                <p className="text-xs text-emerald-200 font-semibold uppercase">
                  Resolution Rate
                </p>
                <h3 className="text-3xl font-black text-emerald-300 mt-1">
                  {resolutionRate}%
                </h3>
                <span className="text-[10px] text-slate-300">Target Benchmark: &gt;80%</span>
              </div>

              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                <p className="text-xs text-amber-200 font-semibold uppercase">
                  Pending Backlog
                </p>
                <h3 className="text-3xl font-black text-amber-300 mt-1">
                  {stats.pending}
                </h3>
                <span className="text-[10px] text-slate-300">
                  {pendingRate}% of overall total
                </span>
              </div>

              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                <p className="text-xs text-sky-200 font-semibold uppercase">
                  Under Active Work
                </p>
                <h3 className="text-3xl font-black text-sky-300 mt-1">
                  {stats.inProgress}
                </h3>
                <span className="text-[10px] text-slate-300">
                  {inProgressRate}% in progress
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Category Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                Departmental Grievance Distribution Matrix
              </h3>
              <span className="text-xs text-slate-400">
                {stats.byCategory.length} Active Departments
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3">Category / Department</th>
                    <th className="px-4 py-3">Grievance Count</th>
                    <th className="px-4 py-3">Share of Total</th>
                    <th className="px-4 py-3">Distribution Bar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {stats.byCategory.map((cat, idx) => {
                    const share =
                      stats.total > 0 ? Math.round((cat.count / stats.total) * 100) : 0;
                    return (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3.5 font-bold text-slate-800">
                          {cat.category}
                        </td>
                        <td className="px-4 py-3.5 font-mono font-bold text-blue-600">
                          {cat.count}
                        </td>
                        <td className="px-4 py-3.5 text-slate-500 font-semibold">
                          {share}%
                        </td>
                        <td className="px-4 py-3.5 w-60">
                          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-indigo-600 h-2.5 rounded-full"
                              style={{ width: `${share}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Academic Presentation Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm">
              College Academic Project Assessment Notes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">🔐 Data Confidentiality</p>
                <p>
                  Passwords hashed with industry-standard bcrypt algorithm (cost 10). JWT tokens carry expiry and are checked on every protected API call.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">📜 Complete Audit Trail</p>
                <p>
                  Every complaint tracks a full timeline of status transitions, timestamps, administrator IDs, and resolution remarks.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">🚀 Zero-Downtime Design</p>
                <p>
                  Robust database engine with automatic fallback ensures live demonstrations run smoothly regardless of external MongoDB services.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminReports;
