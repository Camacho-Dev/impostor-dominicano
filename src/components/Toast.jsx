import { useEffect, useState } from 'react';

function Toast({ message, type = 'info', onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const colors = {
    success: { bg: 'rgba(34, 197, 94, 0.2)', border: 'rgba(34, 197, 94, 0.5)', icon: '✓' },
    error: { bg: 'rgba(239, 68, 68, 0.2)', border: 'rgba(239, 68, 68, 0.5)', icon: '!' },
    info: { bg: 'rgba(102, 126, 234, 0.2)', border: 'rgba(102, 126, 234, 0.5)', icon: 'ℹ' }
  };

  const c = colors[type] || colors.info;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? 0 : 20}px)`,
        background: c.bg,
        border: `2px solid ${c.border}`,
        borderRadius: '14px',
        padding: '16px 24px',
        color: '#fff',
        fontSize: '1em',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 10001,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        transition: 'transform 0.3s ease',
        maxWidth: 'calc(100% - 48px)'
      }}
    >
      <span
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: c.border,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.9em',
          flexShrink: 0
        }}
      >
        {c.icon}
      </span>
      <span>{message}</span>
    </div>
  );
}

export default Toast;
