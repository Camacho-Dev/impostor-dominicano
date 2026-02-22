import { useEffect, useState } from 'react';

function OverlayMantenimiento({ mensaje }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(175deg, #080810 0%, #0d0d18 20%, #12122a 45%, #1a1a3e 75%, #1e2d50 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '32px 24px',
        minHeight: '100dvh',
        overflow: 'hidden',
        fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}
    >
      {/* Patrón de fondo sutil */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(118, 75, 162, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(30, 61, 114, 0.1) 0%, transparent 70%)
          `,
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none'
        }}
      />

      {/* Tarjeta principal */}
      <div
        style={{
          position: 'relative',
          maxWidth: '480px',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '48px 40px',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.05) inset',
          textAlign: 'center',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.98)',
          transition: 'opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
        }}
      >
        {/* Icono SVG */}
        <div
          style={{
            width: '72px',
            height: '72px',
            margin: '0 auto 32px',
            color: 'rgba(255, 255, 255, 0.9)',
            animation: 'mantenimiento-spin 8s linear infinite'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" strokeWidth="1.5"/>
          </svg>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.2)',
            borderRadius: '100px',
            fontSize: '0.7em',
            fontWeight: '600',
            letterSpacing: '0.12em',
            color: '#fcd34d',
            marginBottom: '28px',
            textTransform: 'uppercase'
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#fbbf24',
              animation: 'mantenimiento-pulse 1.5s ease-in-out infinite'
            }}
          />
          Mantenimiento en curso
        </div>

        <h1
          style={{
            color: '#fff',
            fontSize: 'clamp(1.6em, 4.5vw, 2em)',
            fontWeight: '600',
            letterSpacing: '-0.03em',
            marginBottom: '16px',
            lineHeight: 1.25
          }}
        >
          Mejorando tu experiencia
        </h1>

        <p
          style={{
            color: 'rgba(255, 255, 255, 0.75)',
            fontSize: '1.05em',
            lineHeight: 1.75,
            marginBottom: '36px',
            fontWeight: 400,
            maxWidth: '380px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        >
          {mensaje || 'Estamos realizando actualizaciones para ofrecerte la mejor experiencia de juego. Volveremos en breve.'}
        </p>

        {/* Loader elegante */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '36px'
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                animation: `mantenimiento-bounce 1.4s ease-in-out ${i * 0.16}s infinite both`
              }}
            />
          ))}
        </div>

        <div
          style={{
            paddingTop: '28px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)'
          }}
        >
          <p
            style={{
              fontSize: '0.85em',
              color: 'rgba(255, 255, 255, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap'
            }}
          >
            <span style={{ fontSize: '1.1em' }}>🇩🇴</span>
            <span>El Impostor Dominicano</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>Gracias por tu paciencia</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default OverlayMantenimiento;
