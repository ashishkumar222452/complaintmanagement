import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

export const NotFound = () => {
  return (
    <MainLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <span className="text-7xl font-black text-blue-600 tracking-tighter">404</span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-sm">
          The page or complaint record you are looking for does not exist or has been moved.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <Home className="w-4 h-4" /> Return to Home
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
