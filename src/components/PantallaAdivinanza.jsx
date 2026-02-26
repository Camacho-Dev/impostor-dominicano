import { useState } from 'react';
import { useNotificaciones } from '../context/NotificacionesContext';
import Footer from './Footer';

function PantallaAdivinanza({ estadoJuego, actualizarEstado, setPantalla }) {
  const { showToast } = useNotificaciones();
  const [adivinanza, setAdivinanza] = useState('');
  const [error, setError] = useState('');

  const normalizarTexto = (texto) =>
    texto.trim().toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const handleConfirmar = () => {
    const adivinanzaLower = normalizarTexto(adivinanza);
    if (!adivinanzaLower) {
      setError('Escribe una palabra para adivinar');
      showToast('Escribe una palabra para adivinar', 'info');
      return;
    }
    setError('');
    const palabraCorrecta = normalizarTexto(estadoJuego.palabraSecreta);
    
    let mensaje = '';
    let ganador = null;

    if (adivinanzaLower === palabraCorrecta) {
      mensaje = `¡El impostor ${estadoJuego.jugadores[estadoJuego.impostor]} adivinó la palabra! 🎯`;
      ganador = estadoJuego.jugadores[estadoJuego.impostor];
    } else {
      mensaje = `¡El impostor falló al adivinar! ❌`;
    }

    actualizarEstado({ 
      mensajeResultado: mensaje,
      ganador
    });

    setPantalla('revelar-impostor');
  };

  return (
    <div className="pantalla activa" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <button
          onClick={() => setPantalla('juego')}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '10px',
            color: 'var(--color-text)',
            padding: '8px 14px',
            cursor: 'pointer',
            fontSize: '0.9em',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
          aria-label="Cancelar y volver al juego"
        >
          ← Cancelar
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ fontWeight: '700', fontSize: '1em', color: 'var(--color-text)', opacity: 0.9 }}>
            Adivinar Palabra
          </span>
        </div>
        <div style={{ width: '90px' }} />
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        maxWidth: '500px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Icon & title */}
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, rgba(245,87,108,0.3) 0%, rgba(245,87,108,0.1) 100%)',
          border: '2px solid rgba(245,87,108,0.5)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2em',
          marginBottom: '20px'
        }}>
          🎯
        </div>

        <h2 style={{
          fontSize: '1.6em',
          fontWeight: '800',
          color: 'var(--color-text)',
          marginBottom: '8px',
          textAlign: 'center'
        }}>
          ¡Última oportunidad!
        </h2>
        <p style={{
          fontSize: '1em',
          opacity: 0.75,
          marginBottom: '32px',
          textAlign: 'center',
          lineHeight: '1.5'
        }}>
          El impostor puede salvar el juego.<br />
          ¿Cuál crees que es la palabra secreta?
        </p>

        {/* Input card */}
        <div style={{
          width: '100%',
          background: 'rgba(255,255,255,0.06)',
          border: error ? '2px solid rgba(245,87,108,0.6)' : '2px solid rgba(255,255,255,0.12)',
          borderRadius: '16px',
          padding: '4px',
          marginBottom: '12px',
          transition: 'border-color 0.2s'
        }}>
          <input
            type="text"
            value={adivinanza}
            onChange={(e) => {
              setAdivinanza(e.target.value);
              if (error) setError('');
            }}
            placeholder="Escribe la palabra aquí..."
            autoComplete="off"
            aria-label="Escribe la palabra secreta que crees que es"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'adivinanza-error' : undefined}
            onKeyDown={(e) => e.key === 'Enter' && handleConfirmar()}
            style={{
              width: '100%',
              padding: '16px 20px',
              fontSize: '1.2em',
              fontWeight: '600',
              borderRadius: '14px',
              border: 'none',
              background: 'transparent',
              color: 'var(--color-text)',
              outline: 'none',
              boxSizing: 'border-box',
              textAlign: 'center',
              letterSpacing: '0.05em'
            }}
          />
        </div>

        {error && (
          <p
            id="adivinanza-error"
            role="alert"
            style={{
              color: '#f5576c',
              fontSize: '0.9em',
              marginBottom: '16px',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>⚠️</span> {error}
          </p>
        )}

        {/* Confirm button */}
        <button
          onClick={handleConfirmar}
          aria-label="Confirmar adivinanza"
          style={{
            width: '100%',
            padding: '18px 24px',
            background: 'linear-gradient(135deg, #f5576c 0%, #e03e50 100%)',
            border: 'none',
            borderRadius: '14px',
            color: '#fff',
            fontSize: '1.1em',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 20px rgba(245,87,108,0.4)',
            letterSpacing: '0.03em'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(245,87,108,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(245,87,108,0.4)';
          }}
        >
          🎯 Confirmar Adivinanza
        </button>

        <p style={{
          marginTop: '16px',
          fontSize: '0.9em',
          opacity: 0.65,
          textAlign: 'center',
          lineHeight: '1.4'
        }}>
          Si adivinas correctamente, el impostor gana el juego
        </p>

        <button
          type="button"
          onClick={() => setPantalla('quien-empieza')}
          style={{
            marginTop: '12px',
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text)',
            fontSize: '0.9em',
            cursor: 'pointer',
            opacity: 0.55,
            padding: '10px 20px',
            minHeight: '44px',
            transition: 'opacity 0.2s',
            textDecoration: 'underline',
            textDecorationColor: 'rgba(255,255,255,0.3)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.55'; }}
        >
          Cancelar sin adivinar
        </button>
      </div>

      <Footer />
    </div>
  );
}

export default PantallaAdivinanza;
