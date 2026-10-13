import React from 'react';
import { ShieldCheck, Heart, Github, Award, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                OCMS Portal
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Online Complaint Management System designed for college academic project demonstration. Transparent grievance tracking with end-to-end resolution audit.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Systems Operational (v1.0.0)
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home Portal
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-white transition-colors">
                  Track Complaint Status
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  User Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-white transition-colors text-purple-400">
                  Administrator Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Complaint Categories
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• IT & Campus Wi-Fi Network</li>
              <li>• Academic & Examinations</li>
              <li>• Hostel & Living Facilities</li>
              <li>• Library & Digital Resources</li>
              <li>• Maintenance & Electrical</li>
              <li>• Canteen & Food Safety</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Project Specification
            </h4>
            <div className="text-xs text-slate-400 space-y-2 bg-slate-800/50 p-3.5 rounded-lg border border-slate-700/60">
              <p>
                <strong className="text-slate-200">Tech Stack:</strong> React 18, Node.js, Express, MongoDB, Tailwind CSS
              </p>
              <p>
                <strong className="text-slate-200">Security:</strong> JWT Auth, Bcrypt Hashing, Role-Based Access Control
              </p>
              <p className="text-blue-400 font-medium">
                Academic Project Submission 2026
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Online Complaint Management System. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for Academic Evaluation & Viva Demonstration
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
