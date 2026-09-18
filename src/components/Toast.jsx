import React from 'react';
import './Toast.css';

const Toast = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="toast-floating-banner">
      <span>{message}</span>
      <button className="toast-close-btn" onClick={onClose}>✕</button>
    </div>
  );
};

export default Toast;
