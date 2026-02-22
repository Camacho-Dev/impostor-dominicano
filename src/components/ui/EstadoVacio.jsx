function EstadoVacio({ icono, titulo, mensaje, accion }) {
  return (
    <div
      className="estado-vacio"
      role="status"
      aria-live="polite"
      style={{
        textAlign: 'center',
        padding: '32px 24px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: '1px dashed rgba(255, 255, 255, 0.15)',
        margin: '24px 0'
      }}
    >
      <div style={{ fontSize: '3em', marginBottom: '16px', opacity: 0.7 }}>
        {icono || '📋'}
      </div>
      <h3 style={{
        fontSize: '1.2em',
        fontWeight: '600',
        color: '#fff',
        marginBottom: '8px'
      }}>
        {titulo}
      </h3>
      <p style={{
        fontSize: '0.95em',
        color: 'rgba(255, 255, 255, 0.75)',
        marginBottom: accion ? '20px' : 0,
        lineHeight: 1.5
      }}>
        {mensaje}
      </p>
      {accion && (
        <div style={{ marginTop: '16px' }}>
          {accion}
        </div>
      )}
    </div>
  );
}

export default EstadoVacio;
