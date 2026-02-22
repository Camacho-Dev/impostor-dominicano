import { useEffect, useState } from 'react';

function OverlayMantenimiento({ mensaje }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(165deg, #0c0c14 0%, #1a1a2e 35%, #16213e 70%, #1e3c72 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '24px',
        minHeight: '100dvh',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease'
      }}
    >
      {/* Líneas de fondo decorativas */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '-20%',
            width: '60%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.15), transparent)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '-10%',
            width: '50%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(118, 75, 162, 0.12), transparent)'
          }}
        />
      </div>

      <div
        style={{
          maxWidth: '420px',
          width: '100%',
          textAlign: 'center',
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
          transitionDelay: '0.1s'
        }}
      >
        {/* Icono con efecto sutil */}
        <div
          style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 28px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}
        >
          <span style={{ fontSize: '2.4em' }}>⚙️</span>
        </div>

        {/* Badge */}
        <div
          style={{
            display: 'inline-block',
            padding: '6px 14px',
            background: 'rgba(251, 191, 36, 0.12)',
            border: '1px solid rgba(251, 191, 36, 0.25)',
            borderRadius: '20px',
            fontSize: '0.75em',
            fontWeight: '600',
            letterSpacing: '0.08em',
            color: '#fbbf24',
            marginBottom: '24px',
            textTransform: 'uppercase'
          }}
        >
          Mantenimiento programado
        </div>

        <h1
          style={{
            color: '#fff',
            fontSize: 'clamp(1.5em, 5vw, 2em)',
            fontWeight: '700',
            letterSpacing: '-0.02em',
            marginBottom: '16px',
            lineHeight: 1.2
          }}
        >
          Estamos mejorando tu experiencia
        </h1>

        <p
          style={{
            color: 'rgba(255, 255, 255, 0.85)',
            fontSize: '1.05em',
            lineHeight: 1.7,
            marginBottom: '32px',
            fontWeight: 400
          }}
        >
          {mensaje || 'Estamos realizando actualizaciones para ofrecerte un mejor juego. Volveremos pronto.'}
        </p>

        {/* Barra de progreso decorativa */}
        <div
          style={{
            width: '100%',
            height: '3px',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '3px',
            overflow: 'hidden',
            marginBottom: '28px'
          }}
        >
          <div
            style={{
              height: '100%',
              width: '40%',
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
              borderRadius: '3px',
              animation: 'mantenimiento-progress 2s ease-in-out infinite'
            }}
          />
        </div>

        <p
          style={{
            fontSize: '0.9em',
            color: 'rgba(255, 255, 255, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            flexWrap: 'wrap'
          }}
        >
          <span>🇩🇴</span>
          <span>El Impostor Dominicano • Gracias por tu paciencia</span>
        </p>
      </div>
    </div>
  );
}

export default OverlayMantenimiento;
