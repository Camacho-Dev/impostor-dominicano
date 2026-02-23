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
        className="confirm-dialog-inner"
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
            color: 'var(--color-text)',
            fontSize: '1.1em',
            lineHeight: 1.6
          }}
        >
          {message}
        </p>
        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column-reverse' }}>
          <button
            onClick={onConfirm}
            className="btn btn-primary"
            style={{
              flex: 1,
              padding: '14px 20px',
              border: 'none',
              borderRadius: '12px',
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
              background: 'var(--btn-secondary-bg, rgba(255, 255, 255, 0.1))',
              border: '2px solid var(--color-border)',
              borderRadius: '12px',
              color: 'var(--color-text)',
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
