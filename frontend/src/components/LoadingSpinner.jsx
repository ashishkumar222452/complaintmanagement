import React from 'react';

export const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="mt-3 text-sm text-slate-500 font-medium animate-pulse">{text}</p>
    </div>
  );
};

export const Alert = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  const styles = {
    error: 'bg-rose-50 text-rose-800 border-rose-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200'
  };

  return (
    <div
      className={`p-4 rounded-lg border text-sm font-medium flex items-center justify-between mb-4 ${
        styles[type] || styles.error
      }`}
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-3 text-current opacity-70 hover:opacity-100 font-bold"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default LoadingSpinner;
