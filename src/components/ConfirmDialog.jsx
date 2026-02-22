function ConfirmDialog({ message, confirmText = 'Confirmar', cancelText = 'Cancelar', onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px'
      }}
      onClick={(e) => e.target === e.currentTarget && onCancel?.()}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #1a1a2e 100%)',
          borderRadius: '20px',
          maxWidth: '400px',
          width: '100%',
          padding: '32px 28px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5)',
          animation: 'modalEntrada 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p
          style={{
            margin: '0 0 28px',
            color: 'rgba(255, 255, 255, 0.95)',
            fontSize: '1.1em',
            lineHeight: 1.6
          }}
        >
          {message}
        </p>
        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column-reverse' }}>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '14px 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '1em',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '14px 20px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '1em',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
