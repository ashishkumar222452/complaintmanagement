import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, ShieldAlert, Sparkles } from 'lucide-react';
import { Alert } from '../components/LoadingSpinner';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, 'admin');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Administrator login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@example.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div className="max-w-md w-full space-y-8 bg-slate-800 p-8 sm:p-10 rounded-2xl shadow-2xl border border-slate-700">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 border border-purple-500/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-purple-400 bg-purple-950/80 px-2.5 py-1 rounded-full border border-purple-800">
            Staff & Authority Only
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight mt-2">
            Administrator Portal
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Centralized Grievance Investigation & Resolution Console
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Demo Admin Auto Fill */}
        <div className="bg-purple-950/40 border border-purple-800/60 rounded-xl p-3.5 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-purple-200 block">Default Admin Account:</span>
            <span className="text-purple-300 font-mono">admin@example.com | admin123</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow-sm transition-colors"
          >
            Auto Fill
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm shadow-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Enter Admin Console'}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-700/60 text-center text-xs">
          <Link to="/login" className="text-slate-400 hover:text-white transition-colors">
            ← Switch to Student / User Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
