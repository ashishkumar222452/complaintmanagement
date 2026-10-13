import React from 'react';
import { CheckCircle2, Clock, RefreshCw, XCircle, User, Shield } from 'lucide-react';

export const Timeline = ({ history = [], currentStatus = 'Pending' }) => {
  const getIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'In Progress':
        return <RefreshCw className="w-4 h-4 text-blue-600" />;
      case 'Resolved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 border-amber-300 text-amber-800';
      case 'In Progress':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'Resolved':
        return 'bg-emerald-100 border-emerald-300 text-emerald-800';
      case 'Rejected':
        return 'bg-rose-100 border-rose-300 text-rose-800';
      default:
        return 'bg-slate-100 border-slate-300 text-slate-800';
    }
  };

  if (!history || history.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-slate-500">
        No status history recorded yet.
      </div>
    );
  }

  return (
    <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 py-2">
      {history.map((item, index) => {
        const isLatest = index === history.length - 1;
        const formattedDate = item.changedAt
          ? new Date(item.changedAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          : 'Date recorded';

        return (
          <div key={item._id || index} className="relative pl-6">
            {/* Timeline node icon */}
            <div
              className={`absolute -left-[17px] top-0.5 w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white shadow-sm ${
                isLatest ? 'ring-4 ring-blue-50 border-blue-500' : 'border-slate-300'
              }`}
            >
              {getIcon(item.status)}
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <span
                  className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {formattedDate}
                </span>
              </div>

              {item.remarks && (
                <p className="text-sm text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-100 mt-2 font-normal">
                  <span className="font-semibold text-slate-900 block text-xs uppercase tracking-wider mb-1">
                    Remarks:
                  </span>
                  "{item.remarks}"
                </p>
              )}

              <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span>Action by: <strong className="text-slate-700">{item.changedByName || 'Administrator'}</strong></span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
