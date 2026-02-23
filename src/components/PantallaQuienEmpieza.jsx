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

  return (
    <div className="pantalla activa">
      <div style={{ 
        textAlign: 'center', 
        padding: '40px 20px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2 style={{ 
          fontSize: '1.8em', 
          fontWeight: '600', 
          marginBottom: '30px',
          color: 'var(--color-text)'
        }}>
          🎮 ¡El juego ha comenzado!
        </h2>
        
        <div style={{ 
          marginBottom: '40px',
          padding: '30px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          border: '2px solid rgba(255, 255, 255, 0.2)'
        }}>
          <p style={{ 
            fontSize: '1.1em', 
            opacity: 0.9,
            marginBottom: '25px',
            color: 'var(--color-text)'
          }}>
            Hora de hablar y atrapar al Impostor.
          </p>
          
          {/* Jugador que empieza */}
          {estadoJuego.jugadorInicia && (
            <div style={{ 
              marginTop: '20px',
              padding: '20px',
              background: 'rgba(76, 222, 128, 0.3)',
              borderRadius: '12px',
              border: '2px solid rgba(76, 222, 128, 0.5)'
            }}>
              <p style={{ 
                fontSize: '1.2em', 
                marginBottom: '15px', 
                opacity: 0.9,
                color: 'var(--color-text)'
              }}>
                El jugador que empieza es:
              </p>
              <div style={{ 
                background: '#4ade80', 
                color: '#000',
                padding: '15px 25px',
                borderRadius: '10px',
                fontSize: '1.5em',
                fontWeight: 'bold',
                display: 'inline-block',
                opacity: mostrarRevelacion ? 1 : 0,
                transform: mostrarRevelacion ? 'scale(1)' : 'scale(0.8)',
                transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: mostrarRevelacion ? '0 0 30px rgba(74, 222, 128, 0.5)' : 'none'
              }}>
                {estadoJuego.jugadorInicia}
              </div>
              <p style={{ 
                fontSize: '1.1em', 
                marginTop: '15px',
                opacity: 0.9,
                color: 'var(--color-text)'
              }}>
                ¡Empieza la conversación!
              </p>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="acciones-juego" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button
            className="btn btn-danger"
            onClick={() => setPantalla('revelar-impostor')}
            aria-label="Revelar impostor y palabra secreta"
            style={{ 
              width: '100%', 
              fontSize: '0.95em', 
              padding: '12px 18px',
              fontWeight: '600'
            }}
          >
            🎭 Revelar Impostor y Palabra
          </button>
          
          {(() => {
            // Verificar si el jugador que empieza es impostor
            const indiceJugadorInicia = estadoJuego.jugadores.indexOf(estadoJuego.jugadorInicia);
            let esImpostor = false;
            
            if (estadoJuego.impostores && estadoJuego.impostores.length > 0) {
              // Múltiples impostores
              esImpostor = estadoJuego.impostores.includes(indiceJugadorInicia);
            } else if (estadoJuego.impostor !== null) {
              // Un solo impostor
              esImpostor = indiceJugadorInicia === estadoJuego.impostor;
            }
            
            return esImpostor && estadoJuego.modoDiabolico !== 'todos-impostores-total' ? (
              <button
                className="btn btn-success"
                onClick={() => setPantalla('adivinanza')}
                aria-label="Adivinar la palabra secreta"
                style={{ 
                  width: '100%', 
                  fontSize: '0.95em', 
                  padding: '12px 18px',
                  marginTop: '0'
                }}
              >
                🎯 Adivinar Palabra
              </button>
            ) : null;
          })()}
        </div>

        {/* Enlace para nuevo juego */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <button
            onClick={() => {
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
                    modoAcusacion: false,
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
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text)',
              fontSize: '1em',
              textDecoration: 'underline',
              cursor: 'pointer',
              opacity: 0.8,
              padding: '10px',
              transition: 'opacity 0.3s'
            }}
            aria-label="Cerrar juego y volver al inicio"
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.8'; }}
          >
            Nuevo juego
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PantallaQuienEmpieza;

