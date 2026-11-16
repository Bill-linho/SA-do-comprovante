import React from 'react';

export default function Notice({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="notice notice-toast" role="status" aria-live="polite" onClick={onClose}>
      <span>{message}</span>
      <button type="button" className="notice-close" aria-label="Fechar notificação" onClick={onClose}>×</button>
    </div>
  );
}
