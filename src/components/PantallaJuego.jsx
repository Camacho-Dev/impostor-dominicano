import { useState, useEffect } from 'react';

function PantallaJuego({ estadoJuego, actualizarEstado, setPantalla }) {
  const nombreJugador = estadoJuego.jugadores[estadoJuego.jugadorActual];
  const yaConfirmo = estadoJuego.jugadoresListos?.includes(nombreJugador) || false;
  const todosListos = estadoJuego.jugadoresListos?.length === estadoJuego.jugadores?.length;
  const [tarjetaVolteada, setTarjetaVolteada] = useState(false);
  const [tarjetaFueVolteada, setTarjetaFueVolteada] = useState(false);
  const [tarjetaPresionada, setTarjetaPresionada] = useState(false);
  const [cambioJugador, setCambioJugador] = useState(false);
  
  // Determinar si es impostor según el modo
  let esImpostor = false;
  let pistaActual = null;
  let palabraMostrar = estadoJuego.palabraSecreta;
  
  if (estadoJuego.modoDiabolico === 'todos-impostores') {
    const jugadorConPalabra = estadoJuego.jugadorConPalabra !== undefined ? estadoJuego.jugadorConPalabra : 0;
    esImpostor = estadoJuego.jugadorActual !== jugadorConPalabra;
    if (esImpostor) {
      pistaActual = estadoJuego.pistasImpostores?.[estadoJuego.jugadorActual] || "Analiza las pistas de los demás para descubrir la palabra secreta.";
    }
  } else if (estadoJuego.modoDiabolico === 'todos-impostores-total') {
    // Todos son impostores
    esImpostor = true;
    pistaActual = estadoJuego.pistasImpostores?.[estadoJuego.jugadorActual] || "Analiza las pistas de los demás para descubrir la palabra secreta.";
  } else if (estadoJuego.modoDiabolico === 'dos-palabras') {
    // Cada jugador tiene su palabra según el grupo
    palabraMostrar = estadoJuego.palabrasJugadores?.[estadoJuego.jugadorActual] || estadoJuego.palabraSecreta;
    esImpostor = false; // Todos tienen palabras, pero diferentes
  } else if (estadoJuego.modoDiabolico === 'palabras-falsas') {
    // Cada jugador tiene una palabra diferente
    palabraMostrar = estadoJuego.palabrasJugadores?.[estadoJuego.jugadorActual] || estadoJuego.palabraSecreta;
    esImpostor = false; // Todos creen tener la palabra correcta
  } else if (estadoJuego.modoDiabolico === 'multiples-impostores') {
    // Varios impostores
    esImpostor = estadoJuego.impostores?.includes(estadoJuego.jugadorActual) || false;
    if (esImpostor) {
      pistaActual = estadoJuego.pistasImpostores?.[estadoJuego.jugadorActual] || "Analiza las pistas de los demás para descubrir la palabra secreta.";
    }
  } else if (estadoJuego.modoDiabolico === 'sin-pistas') {
    // Impostor sin pistas
    esImpostor = estadoJuego.jugadorActual === estadoJuego.impostor;
    if (esImpostor) {
      pistaActual = "No tienes pistas. Solo sabes que eres el impostor. ¡Buena suerte!";
    }
  } else if (estadoJuego.modoDiabolico === 'pistas-mezcladas') {
    // Algunos tienen la palabra real, otros son impostores con pistas falsas
    esImpostor = estadoJuego.impostores?.includes(estadoJuego.jugadorActual) || false;
    if (esImpostor) {
      pistaActual = estadoJuego.pistasImpostores?.[estadoJuego.jugadorActual] || "Analiza las pistas de los demás para descubrir la palabra secreta.";
    }
    // Los normales ven la palabra, no necesitan pista
  } else if (estadoJuego.modoDiabolico === 'palabra-compartida') {
    // Todos tienen la misma palabra, pero algunos creen ser impostores
    const creeSerImpostor = estadoJuego.pistasImpostores?.[estadoJuego.jugadorActual] !== undefined;
    if (creeSerImpostor) {
      esImpostor = true; // Cree ser impostor
      pistaActual = estadoJuego.pistasImpostores?.[estadoJuego.jugadorActual] || "Analiza las pistas de los demás.";
    } else {
      esImpostor = false; // Tiene la palabra
    }
  } else {
    // Modo normal (puede tener uno o más impostores)
    if (estadoJuego.impostores && estadoJuego.impostores.length > 0) {
      // Múltiples impostores en modo normal
      esImpostor = estadoJuego.impostores.includes(estadoJuego.jugadorActual);
      if (esImpostor) {
        pistaActual = estadoJuego.pistasImpostores?.[estadoJuego.jugadorActual] || "Analiza las pistas de los demás para descubrir la palabra secreta.";
      }
    } else {
      // Un solo impostor (comportamiento original)
      esImpostor = estadoJuego.jugadorActual === estadoJuego.impostor;
      if (esImpostor) {
        pistaActual = estadoJuego.pistaImpostor || "Analiza las pistas de los demás para descubrir la palabra secreta.";
      }
    }
  }

  // Resetear tarjeta cuando cambia el jugador y agregar animación
  useEffect(() => {
    setTarjetaVolteada(false);
    setTarjetaFueVolteada(false);
    setTarjetaPresionada(false);
    setCambioJugador(true);
    
    // Limpiar animación después de 500ms
    const timer = setTimeout(() => {
      setCambioJugador(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [estadoJuego.jugadorActual]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight') {
        const siguiente = (estadoJuego.jugadorActual + 1) % estadoJuego.jugadores.length;
        actualizarEstado({ jugadorActual: siguiente });
      } else if (e.key === 'ArrowLeft') {
        const anterior = (estadoJuego.jugadorActual - 1 + estadoJuego.jugadores.length) % estadoJuego.jugadores.length;
        actualizarEstado({ jugadorActual: anterior });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [estadoJuego.jugadorActual, estadoJuego.jugadores.length, actualizarEstado]);

  const handleConfirmarListo = () => {
    if (yaConfirmo) {
      return;
    }

    const nuevosListos = [...(estadoJuego.jugadoresListos || []), nombreJugador];
    const todosConfirmaron = nuevosListos.length >= estadoJuego.jugadores.length;
    
    // Si todos confirmaron, seleccionar quién empieza automáticamente
    let jugadorInicia = estadoJuego.jugadorInicia;
    if (todosConfirmaron && !jugadorInicia) {
      jugadorInicia = estadoJuego.jugadores[Math.floor(Math.random() * estadoJuego.jugadores.length)];
    }
    
    // Actualizar estado con los jugadores listos
    actualizarEstado({ 
      jugadoresListos: nuevosListos,
      jugadorInicia: jugadorInicia || estadoJuego.jugadorInicia
    });

    // Si todos confirmaron, no avanzar (ya se mostrará quién empieza y el botón de Revelar Impostor)
    // Si no todos han confirmado, avanzar al siguiente jugador que no haya confirmado inmediatamente
    if (!todosConfirmaron) {
      // Buscar el siguiente jugador que no haya confirmado
      let siguienteJugador = (estadoJuego.jugadorActual + 1) % estadoJuego.jugadores.length;
      let intentos = 0;
      
      // Buscar un jugador que no haya confirmado
      while (nuevosListos.includes(estadoJuego.jugadores[siguienteJugador]) && intentos < estadoJuego.jugadores.length) {
        siguienteJugador = (siguienteJugador + 1) % estadoJuego.jugadores.length;
        intentos++;
      }
      
      actualizarEstado({ jugadorActual: siguienteJugador });
    }
  };

  const handleCerrarJuego = () => {
    if (window.confirm('¿Estás seguro que quieres cerrar el juego? Los nombres de los jugadores se borrarán.')) {
      // Solo borrar jugadores si se sale del juego completamente
      actualizarEstado({
        jugadores: [],
        numJugadores: 3,
        categorias: ['comida'],
        jugadorActual: 0,
        impostor: null,
        palabraSecreta: '',
        pistas: [],
        votos: {},
        jugadoresListos: [],
        jugadorInicia: null,
        modoVotacion: false,
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
        numImpostores: 1
      });
      setPantalla('inicio');
    }
  };

  return (
    <div className="pantalla activa" style={{ position: 'relative' }}>
      {/* Botón de cerrar */}
      <button
        onClick={handleCerrarJuego}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'rgba(245, 87, 108, 0.3)',
          border: '2px solid rgba(245, 87, 108, 0.6)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          color: '#fff',
          fontSize: '1.5em',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          transition: 'all 0.3s',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent'
        }}
        onMouseEnter={(e) => {
          if (window.innerWidth > 768) {
            e.target.style.background = 'rgba(245, 87, 108, 0.5)';
            e.target.style.transform = 'scale(1.1)';
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(245, 87, 108, 0.3)';
          e.target.style.transform = 'scale(1)';
        }}
        onTouchStart={(e) => {
          e.target.style.background = 'rgba(245, 87, 108, 0.5)';
        }}
        onTouchEnd={(e) => {
          e.target.style.background = 'rgba(245, 87, 108, 0.3)';
        }}
        title="Cerrar juego"
      >
        ×
      </button>

      <div className="contenido-juego">
        {!todosListos && (
          <div 
            className="indicador-jugador-actual"
            style={{
              animation: cambioJugador ? 'slideInFromLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
              transform: cambioJugador ? 'translateX(0)' : 'none'
            }}
          >
            <div style={{ 
              fontSize: '1.2em',
              fontWeight: '600'
            }}>
              Turno de: <span style={{ 
                color: '#4ade80',
                animation: cambioJugador ? 'pulse 0.5s ease-in-out' : 'none'
              }}>{nombreJugador}</span>
            </div>
            <div style={{ fontSize: '0.8em', marginTop: '10px', opacity: 0.8 }}>
              (Desliza o usa → para cambiar de jugador)
            </div>
          </div>
        )}

        {!todosListos && (esImpostor ? (
          <div className="vista-jugador">
            <div className="palabra-secreta">
              <p style={{ marginBottom: '20px', fontSize: '1.1em' }}>Tu identidad es:</p>
              
              {/* Indicador de estado (solo aparece después de ver la carta) */}
              {tarjetaFueVolteada && !tarjetaVolteada && (
                <div style={{ 
                  textAlign: 'center', 
                  marginBottom: '15px',
                  padding: '12px 18px',
                  background: 'rgba(76, 222, 128, 0.15)',
                  borderRadius: '12px',
                  border: '1.5px solid rgba(76, 222, 128, 0.3)',
                  boxShadow: '0 2px 8px rgba(76, 222, 128, 0.2)'
                }}>
                  <span style={{ 
                    fontSize: '1.1em', 
                    color: '#4ade80', 
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '1.2em' }}>✓</span> Ya viste tu identidad
                  </span>
                </div>
              )}
              
              {/* Tarjeta volteable para impostor */}
              <div className="flip-card-wrapper">
              <div 
                className={`flip-card impostor-card ${tarjetaVolteada ? 'flipped' : ''} ${tarjetaPresionada ? 'pressed' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setTarjetaPresionada(true);
                  setTarjetaVolteada(true);
                  if (!tarjetaFueVolteada) {
                    setTarjetaFueVolteada(true);
                  }
                }}
                onMouseUp={(e) => {
                  e.preventDefault();
                  // Primero quitar pressed, luego flipped con un pequeño delay para transición suave
                  setTarjetaPresionada(false);
                  setTimeout(() => {
                    setTarjetaVolteada(false);
                  }, 50);
                }}
                onMouseLeave={(e) => {
                  e.preventDefault();
                  // Primero quitar pressed, luego flipped con un pequeño delay para transición suave
                  setTarjetaPresionada(false);
                  setTimeout(() => {
                    setTarjetaVolteada(false);
                  }, 50);
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  setTarjetaPresionada(true);
                  setTarjetaVolteada(true);
                  if (!tarjetaFueVolteada) {
                    setTarjetaFueVolteada(true);
                  }
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  // Primero quitar pressed, luego flipped con un pequeño delay para transición suave
                  setTarjetaPresionada(false);
                  setTimeout(() => {
                    setTarjetaVolteada(false);
                  }, 50);
                }}
                style={{ 
                  cursor: 'pointer',
                  userSelect: 'none', 
                  WebkitUserSelect: 'none',
                  touchAction: 'manipulation'
                }}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front impostor-front">
                    <div className="tarjeta-cubierta">
                      <div className="jugador-numero">{nombreJugador.toUpperCase()}</div>
                      <p className="instruccion-texto">No digas la palabra a los demás jugadores.</p>
                      <div className="icono-mano">👆</div>
                      <p className="texto-presionar">MANTÉN PRESIONADO<br/>PARA REVELAR</p>
                    </div>
                  </div>
                  <div className="flip-card-back impostor-back">
                    <div className="tarjeta-palabra">
                      <div className="palabra-impostor">🎭 IMPOSTOR</div>
                      {tarjetaFueVolteada && (
                        <div className="checkmark-indicator">
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              </div>
              
              {pistaActual && tarjetaVolteada && (
                <div className="pista-impostor-box" style={{ marginTop: '20px' }}>
                  <p className="pista-impostor-label">💡 Pista generada:</p>
                  <div className="pista-impostor-texto">
                    {pistaActual}
                  </div>
                </div>
              )}
              
              <p className="instruccion" style={{ marginTop: '15px' }}>
                {tarjetaFueVolteada 
                  ? 'Mantén presionada la tarjeta para ver tu identidad. Suelta para ocultarla.'
                  : 'Mantén presionada la tarjeta para revelar tu identidad.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="vista-jugador">
            <div className="palabra-secreta">
              <p style={{ marginBottom: '20px', fontSize: '1.1em' }}>Tu palabra secreta es:</p>
              
              {/* Indicador de estado (solo aparece después de ver la carta) */}
              {tarjetaFueVolteada && !tarjetaVolteada && (
                <div style={{ 
                  textAlign: 'center', 
                  marginBottom: '15px',
                  padding: '12px 18px',
                  background: 'rgba(76, 222, 128, 0.15)',
                  borderRadius: '12px',
                  border: '1.5px solid rgba(76, 222, 128, 0.3)',
                  boxShadow: '0 2px 8px rgba(76, 222, 128, 0.2)'
                }}>
                  <span style={{ 
                    fontSize: '1.1em', 
                    color: '#4ade80', 
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '1.2em' }}>✓</span> Ya viste tu palabra
                  </span>
                </div>
              )}
              
              {/* Tarjeta volteable */}
              <div className="flip-card-wrapper">
              <div 
                className={`flip-card ${tarjetaVolteada ? 'flipped' : ''} ${tarjetaPresionada ? 'pressed' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setTarjetaPresionada(true);
                  setTarjetaVolteada(true);
                  if (!tarjetaFueVolteada) {
                    setTarjetaFueVolteada(true);
                  }
                }}
                onMouseUp={(e) => {
                  e.preventDefault();
                  // Primero quitar pressed, luego flipped con un pequeño delay para transición suave
                  setTarjetaPresionada(false);
                  setTimeout(() => {
                    setTarjetaVolteada(false);
                  }, 50);
                }}
                onMouseLeave={(e) => {
                  e.preventDefault();
                  // Primero quitar pressed, luego flipped con un pequeño delay para transición suave
                  setTarjetaPresionada(false);
                  setTimeout(() => {
                    setTarjetaVolteada(false);
                  }, 50);
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  setTarjetaPresionada(true);
                  setTarjetaVolteada(true);
                  if (!tarjetaFueVolteada) {
                    setTarjetaFueVolteada(true);
                  }
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  // Primero quitar pressed, luego flipped con un pequeño delay para transición suave
                  setTarjetaPresionada(false);
                  setTimeout(() => {
                    setTarjetaVolteada(false);
                  }, 50);
                }}
                style={{ 
                  cursor: 'pointer',
                  userSelect: 'none', 
                  WebkitUserSelect: 'none',
                  touchAction: 'manipulation'
                }}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="tarjeta-cubierta">
                      <div className="jugador-numero">{nombreJugador.toUpperCase()}</div>
                      <p className="instruccion-texto">No digas la palabra a los demás jugadores.</p>
                      <div className="icono-mano">👆</div>
                      <p className="texto-presionar">MANTÉN PRESIONADO<br/>PARA REVELAR</p>
                    </div>
                  </div>
                  <div className="flip-card-back">
                    <div className="tarjeta-palabra">
                      <div className="palabra-revelada">{palabraMostrar}</div>
                      {tarjetaFueVolteada && (
                        <div className="checkmark-indicator">
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              </div>
              
              {estadoJuego.modoDiabolico === 'pistas-mezcladas' && tarjetaVolteada && (
                <div className="pista-automatica-info" style={{ background: 'rgba(76, 222, 128, 0.2)', borderColor: 'rgba(76, 222, 128, 0.4)', marginTop: '15px' }}>
                  <p style={{ fontSize: '0.9em' }}>
                    💡 Tu pista: {pistaActual}
                  </p>
                </div>
              )}
              <p className="instruccion">
                {tarjetaFueVolteada 
                  ? 'Mantén presionada la tarjeta para ver tu palabra. Suelta para ocultarla.'
                  : 'Mantén presionada la tarjeta para revelar tu palabra secreta.'}
              </p>
            </div>
          </div>
        ))}

        {!todosListos && !yaConfirmo && tarjetaFueVolteada && (
          <div className="acciones-juego" style={{ marginTop: '30px' }}>
            <button
              className="btn btn-primary"
              onClick={handleConfirmarListo}
              style={{ width: '100%', fontSize: '0.95em', padding: '12px 18px' }}
            >
              ✓ Confirmar que vi mi palabra
            </button>
          </div>
        )}

        {!todosListos && yaConfirmo && (
          <div className="acciones-juego" style={{ marginTop: '30px' }}>
            <div className="pista-automatica-info" style={{ background: 'rgba(76, 222, 128, 0.2)', borderColor: 'rgba(76, 222, 128, 0.4)' }}>
              <p>✓ Ya confirmaste. Esperando a que los demás jugadores confirmen...</p>
              <p style={{ fontSize: '0.9em', marginTop: '5px', opacity: 0.8 }}>
                {estadoJuego.jugadoresListos?.length || 0} de {estadoJuego.jugadores?.length || 0} jugadores listos
              </p>
            </div>
          </div>
        )}

        {todosListos && (
          <div style={{ marginTop: '40px' }}>
            {/* Mensaje de inicio del juego */}
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '30px',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h2 style={{ 
                fontSize: '1.8em', 
                fontWeight: 'bold', 
                marginBottom: '15px',
                color: '#fff',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
              }}>
                ¡El juego ha comenzado!
              </h2>
              <p style={{ 
                fontSize: '1.1em', 
                opacity: 0.9,
                marginBottom: '20px'
              }}>
                Hora de hablar y atrapar al Impostor.
              </p>
              
              {/* Jugador que empieza */}
              {estadoJuego.jugadorInicia && (
                <div style={{ 
                  marginTop: '20px',
                  padding: '15px',
                  background: 'rgba(76, 222, 128, 0.3)',
                  borderRadius: '10px',
                  border: '2px solid rgba(76, 222, 128, 0.5)'
                }}>
                  <p style={{ fontSize: '1.1em', marginBottom: '10px', opacity: 0.9 }}>
                    <strong style={{ 
                      background: '#4ade80', 
                      color: '#000',
                      padding: '8px 15px',
                      borderRadius: '8px',
                      fontSize: '1.2em',
                      fontWeight: 'bold'
                    }}>
                      {estadoJuego.jugadorInicia}
                    </strong>
                    {' '}¡empieza la conversación!
                  </p>
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="acciones-juego" style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <button
                className="btn btn-danger"
                onClick={() => setPantalla('revelar-impostor')}
                style={{ 
                  width: '100%', 
                  fontSize: '0.95em', 
                  padding: '12px 18px',
                  fontWeight: '600'
                }}
              >
                🎭 Revelar Impostor y Palabra
              </button>
              
              {esImpostor && estadoJuego.modoDiabolico !== 'todos-impostores-total' && (
                <button
                  className="btn btn-success"
                  onClick={() => setPantalla('adivinanza')}
                  style={{ 
                    width: '100%', 
                    fontSize: '0.95em', 
                    padding: '12px 18px',
                    marginTop: '0'
                  }}
                >
                  🎯 Adivinar Palabra
                </button>
              )}
            </div>

            {/* Enlace para nuevo juego */}
            <div style={{ 
              textAlign: 'center', 
              marginTop: '30px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <button
                onClick={handleCerrarJuego}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1em',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  opacity: 0.8,
                  padding: '10px',
                  transition: 'opacity 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.8'}
              >
                Nuevo juego
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div style={{ 
        marginTop: '30px', 
        textAlign: 'center', 
        fontSize: '0.8em', 
        opacity: 0.7,
        color: 'rgba(255, 255, 255, 0.6)',
        paddingBottom: '20px'
      }}>
        <p>© 2026 Brayan Camacho. Todos los derechos reservados.</p>
        <p style={{ marginTop: '5px', fontSize: '0.9em' }}>Creado por: <strong>Brayan Camacho</strong></p>
      </div>
    </div>
  );
}

export default PantallaJuego;

