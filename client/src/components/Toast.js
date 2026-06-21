import { useEffect } from 'react';

export default function Toast({ msg, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
      background: '#1e293b', color: '#fff', padding: '12px 20px',
      borderRadius: 10, fontSize: 14, fontWeight: 500,
      boxShadow: '0 8px 32px #0004', fontFamily: "'Inter',sans-serif",
    }}>
      {msg}
    </div>
  );
}
