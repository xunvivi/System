// ErrorAlert.jsx
import React from 'react';

const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex justify-between items-center">
      <span>{message}</span>
      <button onClick={onClose} className="text-red-500 hover:text-red-700">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default ErrorAlert;