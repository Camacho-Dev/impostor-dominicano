import { useEffect, useState } from 'react';
import { useNotificaciones } from '../context/NotificacionesContext';
import Footer from './Footer';

function PantallaQuienEmpieza({ estadoJuego, actualizarEstado, setPantalla }) {
  const { showConfirm } = useNotificaciones();
  const [mostrarRevelacion, setMostrarRevelacion] = useState(false);

  useEffect(() => {
    if (!estadoJuego.jugadorInicia) {
      const jugadorAleatorio = estadoJuego.jugadores[Math.floor(Math.random() * estadoJuego.jugadores.length)];
      actualizarEstado({ jugadorInicia: jugadorAleatorio });
    }
  }, [estadoJuego.jugadorInicia, estadoJuego.jugadores, actualizarEstado]);

  useEffect(() => {
    if (estadoJuego.jugadorInicia) {
      const t = setTimeout(() => setMostrarRevelacion(true), 300);
      return () => clearTimeout(t);
    }
  }, [estadoJuego.jugadorInicia]);

  const indiceJugadorInicia = estadoJuego.jugadores.indexOf(estadoJuego.jugadorInicia);
  let esImpostor = false;
  if (estadoJuego.impostores && estadoJuego.impostores.length > 0) {
    esImpostor = estadoJuego.impostores.includes(indiceJugadorInicia);
  } else if (estadoJuego.impostor !== null) {
    esImpostor = indiceJugadorInicia === estadoJuego.impostor;
  }
  const mostrarBotonAdivinar = esImpostor && estadoJuego.modoDiabolico !== 'palabra-fantasma';

  const handleNuevoJuego = () => {
    showConfirm({
      message: '¿Estás seguro que quieres cerrar el juego? Los nombres de los jugadores se borrarán.',
      confirmText: 'Sí, cerrar',
      cancelText: 'Cancelar',
      onConfirm: () => {
        actualizarEstado({
          jugadores: [],
          numJugadores: 3,
          categorias: ['comida'],
          jugadorActual: 0,
          impostor: null,
          palabraSecreta: '',
          pistas: [],
          jugadoresListos: [],
          jugadorInicia: null,
          modoAdivinanza: false,
          mensajeResultado: '',
          ganador: null,
          pistaImpostor: null,
          pistasImpostores: {},
          jugadorConPalabra: null,
          palabrasJugadores: {},
          impostores: [],
          modosDiabolicos: false,
          modoDiabolicoSeleccionado: null,
          modosAleatorios: false,
          numImpostores: 1,
          jugadoresQueVieronPalabra: []
        });
        setPantalla('inicio');
      }
    });
  };

  return (
    <div className="pantalla activa" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px 24px',
        maxWidth: '500px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>

        {/* Icon */}
        <div style={{
          width: '72px',
          height: '72px',
          background: 'linear-gradient(135deg, rgba(76,222,128,0.3) 0%, rgba(76,222,128,0.1) 100%)',
          border: '2px solid rgba(76,222,128,0.5)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8em',
          marginBottom: '20px'
        }}>
          🎮
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: '1.7em',
          fontWeight: '800',
          textAlign: 'center',
          marginBottom: '8px',
          color: 'var(--color-text)'
        }}>
          ¡El juego ha comenzado!
        </h2>
        <p style={{
          fontSize: '1em',
          opacity: 0.7,
          textAlign: 'center',
          marginBottom: '32px',
          lineHeight: '1.5'
        }}>
          Hora de hablar y atrapar al Impostor
        </p>

        {/* Starting player card */}
        {estadoJuego.jugadorInicia && (
          <div style={{
            width: '100%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '28px 24px',
            textAlign: 'center',
            marginBottom: '28px'
          }}>
            <p style={{
              fontSize: '0.9em',
              fontWeight: '600',
              opacity: 0.6,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '16px'
            }}>
              Empieza la conversación
            </p>

            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
              color: '#000',
              padding: '14px 32px',
              borderRadius: '14px',
              fontSize: '1.7em',
              fontWeight: '900',
              opacity: mostrarRevelacion ? 1 : 0,
              transform: mostrarRevelacion ? 'scale(1)' : 'scale(0.8)',
              transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: mostrarRevelacion ? '0 0 30px rgba(74,222,128,0.4)' : 'none',
              letterSpacing: '-0.02em',
              marginBottom: '16px'
            }}>
              {estadoJuego.jugadorInicia}
            </div>

            <p style={{
              fontSize: '0.95em',
              opacity: 0.7,
              marginTop: '4px',
              lineHeight: '1.4'
            }}>
              Describe la palabra sin decirla directamente
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          <button
            onClick={() => setPantalla('revelar-impostor')}
            aria-label="Revelar impostor y palabra secreta"
            style={{
              width: '100%',
              padding: '18px 24px',
              background: 'linear-gradient(135deg, #f5576c 0%, #e03e50 100%)',
              border: 'none',
              borderRadius: '14px',
              color: '#fff',
              fontSize: '1.05em',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 20px rgba(245,87,108,0.4)'
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
            🎭 Revelar Impostor y Palabra
          </button>

          {mostrarBotonAdivinar && (
            <button
              onClick={() => setPantalla('adivinanza')}
              aria-label="Adivinar la palabra secreta"
              style={{
                width: '100%',
                padding: '16px 24px',
                background: 'linear-gradient(135deg, rgba(251,191,36,0.25) 0%, rgba(251,191,36,0.1) 100%)',
                border: '2px solid rgba(251,191,36,0.5)',
                borderRadius: '14px',
                color: '#fbbf24',
                fontSize: '1em',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(251,191,36,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(251,191,36,0.25) 0%, rgba(251,191,36,0.1) 100%)'; }}
            >
              🎯 Adivinar Palabra (Impostor)
            </button>
          )}
        </div>

        {/* Terminar juego */}
        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          width: '100%'
        }}>
          <button
            onClick={handleNuevoJuego}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px',
              color: 'var(--color-text)',
              fontSize: '0.95em',
              fontWeight: '500',
              cursor: 'pointer',
              opacity: 0.75,
              padding: '14px 16px',
              minHeight: '48px',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            aria-label="Cerrar juego y volver al inicio"
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.75'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
          >
            🏠 Terminar juego
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PantallaQuienEmpieza;
