function OverlayMantenimiento({ mensaje }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '30px',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '40px 30px',
          maxWidth: '400px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div style={{ fontSize: '4em', marginBottom: '20px' }}>🔧</div>
        <h1
          style={{
            color: '#fff',
            fontSize: '1.8em',
            marginBottom: '15px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          En Mantenimiento
        </h1>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.95)',
            fontSize: '1.1em',
            lineHeight: 1.6
          }}
        >
          {mensaje || 'Estamos mejorando el juego. ¡Vuelve pronto!'}
        </p>
        <p
          style={{
            marginTop: '25px',
            fontSize: '0.9em',
            color: 'rgba(255, 255, 255, 0.7)'
          }}
        >
          Gracias por tu paciencia 🇩🇴
        </p>
      </div>
    </div>
  );
}

export default OverlayMantenimiento;
