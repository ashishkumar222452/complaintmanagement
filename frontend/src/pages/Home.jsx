import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  Layers,
  Sparkles,
  BarChart,
  UserCheck
} from 'lucide-react';

export const Home = () => {
  const [trackId, setTrackId] = useState('');
  const navigate = useNavigate();

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackId.trim()) {
      navigate(`/track?id=${encodeURIComponent(trackId.trim())}`);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 text-white py-20 lg:py-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                Next-Gen Academic Grievance Management
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Online Complaint <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-indigo-200">
                  Management System
                </span>
              </h1>

              <p className="text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                A centralized, secure portal for students, staff, and faculty to submit grievances, monitor investigation progress in real time, and receive verified resolutions.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/submit-complaint"
                  className="px-6 py-3.5 rounded-xl font-bold bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  File a Complaint
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3.5 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all"
                >
                  User Sign In
                </Link>
                <Link
                  to="/admin/login"
                  className="px-5 py-3.5 rounded-xl font-bold text-sky-200 hover:text-white transition-all flex items-center gap-1.5 text-sm"
                >
                  Admin Portal <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg">
                <div>
                  <h4 className="text-2xl font-black text-white">100%</h4>
                  <p className="text-xs text-slate-400">Audit Transparency</p>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white">Instant</h4>
                  <p className="text-xs text-slate-400">Complaint ID</p>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-white">24/7</h4>
                  <p className="text-xs text-slate-400">Live Status Tracking</p>
                </div>
              </div>
            </div>

            {/* Right Card: Instant Complaint Tracker */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-900 border border-slate-100">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
                      Quick Status Tracker
                    </h3>
                    <p className="text-xs text-slate-500">
                      Check resolution progress without logging in
                    </p>
                  </div>
                </div>

                <form onSubmit={handleTrackSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Enter Unique Complaint ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={trackId}
                        onChange={(e) => setTrackId(e.target.value)}
                        placeholder="e.g. CMP-20261011-8401"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm uppercase placeholder:font-sans placeholder:normal-case shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Search className="w-4 h-4" />
                    Track Complaint Status
                  </button>
                </form>

                <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <p className="text-xs font-semibold text-slate-600 mb-2">
                    💡 Sample IDs to Test Instant Tracking:
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setTrackId('CMP-20261011-8401')}
                      className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 rounded border border-slate-200 transition-colors"
                    >
                      CMP-20261011-8401
                    </button>
                    <button
                      type="button"
                      onClick={() => setTrackId('CMP-20261011-8402')}
                      className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-600 rounded border border-slate-200 transition-colors"
                    >
                      CMP-20261011-8402
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
            Transparent Workflow
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3 sm:text-4xl">
            How The Complaint System Works
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            From filing to final resolution, every action is logged with verified timestamps and administrative notes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 font-extrabold text-lg flex items-center justify-center mb-4">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Register & Submit</h3>
            <p className="text-sm text-slate-600">
              User logs in and fills out complaint category, priority, description, and optional photo evidence.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 font-extrabold text-lg flex items-center justify-center mb-4">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Unique ID Generated</h3>
            <p className="text-sm text-slate-600">
              System assigns a unique tracking identifier (CMP-YYYYMMDD-XXXX) and alerts the college administrator.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-lg flex items-center justify-center mb-4">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Admin Review & Assign</h3>
            <p className="text-sm text-slate-600">
              Administrator reviews details, updates status to 'In Progress', and assigns responsible department staff.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 font-extrabold text-lg flex items-center justify-center mb-4">
              04
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Resolution & Notification</h3>
            <p className="text-sm text-slate-600">
              Grievance is resolved with formal remarks. The user receives real-time notification on their dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="bg-slate-100/70 py-16 sm:py-24 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Key Features Designed for College Needs
            </h2>
            <p className="text-slate-600 mt-2">
              Built with industry-standard security and responsive UI patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="p-3 w-fit rounded-lg bg-blue-100 text-blue-700 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Secure JWT Authentication
              </h3>
              <p className="text-sm text-slate-600">
                Passwords hashed with bcrypt. Endpoints protected with role-based JWT authorization for users and admins.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="p-3 w-fit rounded-lg bg-purple-100 text-purple-700 mb-4">
                <BarChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Centralized Admin Dashboard
              </h3>
              <p className="text-sm text-slate-600">
                Visual charts, category filtering, search, remarks logging, and status controls for efficient administration.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="p-3 w-fit rounded-lg bg-emerald-100 text-emerald-700 mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Complete Audit Trail
              </h3>
              <p className="text-sm text-slate-600">
                Every status transition logs timestamps and administrator notes, eliminating ambiguity and lost complaints.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Quick Start Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Ready for Academic Project Demonstration?
            </h3>
            <p className="text-blue-100 text-sm max-w-xl">
              Log in with preloaded test credentials to review live complaints, test status transitions, or create fresh complaints.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl font-bold bg-white text-blue-700 hover:bg-blue-50 transition-colors shadow"
            >
              Test as User
            </Link>
            <Link
              to="/admin/login"
              className="px-6 py-3 rounded-xl font-bold bg-slate-900/40 hover:bg-slate-900/60 border border-white/20 text-white transition-colors"
            >
              Test as Admin
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
