export default function LoadingScreen() {
  return (
    <div
      className="pantalla activa pantalla-carga"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        gap: '20px'
      }}
    >
      <div className="loading-spinner" aria-hidden="true" />
      <p style={{ color: 'var(--color-text-muted)', fontSize: '1em' }}>
        Cargando...
      </p>
    </div>
  );
}
