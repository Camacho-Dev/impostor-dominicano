import { useState, useEffect } from 'react';
import { useNotificaciones } from '../context/NotificacionesContext';
import { obtenerPalabraAleatoria, generarPistaImpostor, generarPistasImpostores } from '../palabras-dominicanas';

function PantallaJugadores({ estadoJuego, actualizarEstado, setPantalla }) {
  const { showToast } = useNotificaciones();
  // Cargar nombres desde localStorage o usar los del estado
  const [nombresJugadores, setNombresJugadores] = useState(() => {
    // Primero intentar cargar desde localStorage
    const jugadoresGuardados = localStorage.getItem('jugadoresNombres');
    if (jugadoresGuardados) {
      try {
        const nombres = JSON.parse(jugadoresGuardados);
        if (Array.isArray(nombres) && nombres.length > 0) {
          return nombres;
        }
      } catch (e) {
        console.error('Error al cargar jugadores desde localStorage:', e);
      }
    }
    
    // Si hay jugadores en el estado, usarlos
    if (estadoJuego.jugadores && estadoJuego.jugadores.length > 0) {
      return estadoJuego.jugadores;
    }
    
    // Si no hay nada, crear nombres por defecto
    return Array(estadoJuego.numJugadores || 3).fill('').map((_, i) => `Jugador ${i + 1}`);
  });
  
  // Guardar en localStorage cada vez que cambien los nombres
  useEffect(() => {
    if (nombresJugadores && nombresJugadores.length > 0) {
      localStorage.setItem('jugadoresNombres', JSON.stringify(nombresJugadores));
    }
  }, [nombresJugadores]);
  const [jugadorArrastrando, setJugadorArrastrando] = useState(null);
  const [jugadorSobre, setJugadorSobre] = useState(null);
  const [numImpostores, setNumImpostores] = useState(estadoJuego.numImpostores || 1);
  const [jugadorAgregado, setJugadorAgregado] = useState(null);
  const [jugadorEliminado, setJugadorEliminado] = useState(null);
  
  // Calcular máximo de impostores basado en el número actual de jugadores
  const maxImpostores = Math.max(1, Math.floor(nombresJugadores.length / 2));

  const handleNombreChange = (index, nombre) => {
    const nuevosNombres = [...nombresJugadores];
    nuevosNombres[index] = nombre;
    setNombresJugadores(nuevosNombres);
  };

  const handleAgregarJugador = () => {
    const nuevoJugador = `Jugador ${nombresJugadores.length + 1}`;
    setNombresJugadores([...nombresJugadores, nuevoJugador]);
    setJugadorAgregado(nombresJugadores.length);
    
    // Ajustar numImpostores si es necesario cuando se agrega un jugador
    const nuevoMax = Math.max(1, Math.floor((nombresJugadores.length + 1) / 2));
    if (numImpostores > nuevoMax) {
      setNumImpostores(nuevoMax);
    }
    
    // Limpiar animación después de 600ms
    setTimeout(() => {
      setJugadorAgregado(null);
    }, 600);
  };

  const handleEliminarJugador = (index) => {
    if (nombresJugadores.length > 2) {
      setJugadorEliminado(index);
      
      // Esperar un poco para la animación antes de eliminar
      setTimeout(() => {
        const nuevosNombres = nombresJugadores.filter((_, i) => i !== index);
        setNombresJugadores(nuevosNombres);
        setJugadorEliminado(null);
        
        // Ajustar numImpostores si es necesario cuando se elimina un jugador
        const nuevoMax = Math.max(1, Math.floor((nuevosNombres.length) / 2));
        if (numImpostores > nuevoMax) {
          setNumImpostores(nuevoMax);
        }
      }, 300);
    } else {
      showToast('Debe haber al menos 2 jugadores', 'info');
    }
  };

  const handleDragStart = (index) => {
    setJugadorArrastrando(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setJugadorSobre(index);
  };

  const handleDragLeave = () => {
    setJugadorSobre(null);
  };

  const handleDrop = (e, indexDestino) => {
    e.preventDefault();
    if (jugadorArrastrando === null || jugadorArrastrando === indexDestino) {
      setJugadorArrastrando(null);
      setJugadorSobre(null);
      return;
    }

    const nuevosNombres = [...nombresJugadores];
    const [jugadorMovido] = nuevosNombres.splice(jugadorArrastrando, 1);
    nuevosNombres.splice(indexDestino, 0, jugadorMovido);
    
    setNombresJugadores(nuevosNombres);
    setJugadorArrastrando(null);
    setJugadorSobre(null);
  };

  const handleTouchStart = (e, index) => {
    setJugadorArrastrando(index);
  };

  const handleTouchMove = (e, index) => {
    if (jugadorArrastrando === null) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const jugadorItem = element?.closest('.jugador-item');
    
    if (jugadorItem) {
      const indexDestino = parseInt(jugadorItem.dataset.index);
      if (indexDestino !== jugadorArrastrando) {
        setJugadorSobre(indexDestino);
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (jugadorArrastrando === null) return;
    
    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const jugadorItem = element?.closest('.jugador-item');
    
    if (jugadorItem) {
      const indexDestino = parseInt(jugadorItem.dataset.index);
      if (jugadorArrastrando !== indexDestino && indexDestino !== undefined) {
        const nuevosNombres = [...nombresJugadores];
        const [jugadorMovido] = nuevosNombres.splice(jugadorArrastrando, 1);
        nuevosNombres.splice(indexDestino, 0, jugadorMovido);
        setNombresJugadores(nuevosNombres);
      }
    }
    
    setJugadorArrastrando(null);
    setJugadorSobre(null);
  };

  const handleContinuar = () => {
    const jugadores = nombresJugadores.map((nombre, i) => 
      nombre.trim() || `Jugador ${i + 1}`
    );

    // Guardar los nombres en localStorage antes de iniciar
    localStorage.setItem('jugadoresNombres', JSON.stringify(jugadores));

    iniciarRonda(jugadores);
  };

  const iniciarRonda = (jugadores) => {
    const palabraSecreta = obtenerPalabraAleatoria(estadoJuego.categorias || ['comida']);
    
    let impostor = null;
    let pistaImpostor = null;
    let pistasImpostores = {};
    let modoDiabolico = estadoJuego.modosDiabolicos && estadoJuego.modoDiabolicoSeleccionado;
    let jugadorConPalabra = null;
    let palabrasJugadores = {}; // Para modos con múltiples palabras
    let impostores = []; // Para múltiples impostores
    
    if (modoDiabolico === 'todos-impostores') {
      // Modo: Todos impostores menos uno (aleatorio)
      jugadorConPalabra = Math.floor(Math.random() * jugadores.length);
      const cantidadImpostores = jugadores.length - 1;
      const pistas = generarPistasImpostores(palabraSecreta, cantidadImpostores);
      
      let indicePista = 0;
      for (let i = 0; i < jugadores.length; i++) {
        if (i !== jugadorConPalabra) {
          pistasImpostores[i] = pistas[indicePista];
          indicePista++;
        }
      }
    } else if (modoDiabolico === 'todos-impostores-total') {
      // Modo: Todos impostores, nadie tiene la palabra real
      const pistas = generarPistasImpostores(palabraSecreta, jugadores.length);
      for (let i = 0; i < jugadores.length; i++) {
        pistasImpostores[i] = pistas[i];
      }
    } else if (modoDiabolico === 'dos-palabras') {
      // Modo: Dos palabras secretas
      const palabra1 = obtenerPalabraAleatoria(estadoJuego.categorias || ['comida']);
      const palabra2 = obtenerPalabraAleatoria(estadoJuego.categorias || ['comida']);
      
      // Dividir jugadores en dos grupos
      const mitad = Math.floor(jugadores.length / 2);
      for (let i = 0; i < jugadores.length; i++) {
        if (i < mitad) {
          palabrasJugadores[i] = palabra1;
        } else {
          palabrasJugadores[i] = palabra2;
        }
      }
    } else if (modoDiabolico === 'palabras-falsas') {
      // Modo: Todos tienen palabras diferentes, solo una es "correcta"
      const palabraCorrecta = palabraSecreta;
      const indiceCorrecto = Math.floor(Math.random() * jugadores.length);
      
      for (let i = 0; i < jugadores.length; i++) {
        if (i === indiceCorrecto) {
          palabrasJugadores[i] = palabraCorrecta;
        } else {
          palabrasJugadores[i] = obtenerPalabraAleatoria(estadoJuego.categorias || ['comida']);
        }
      }
      jugadorConPalabra = indiceCorrecto;
    } else if (modoDiabolico === 'multiples-impostores') {
      // Modo: Múltiples impostores (30-50% de los jugadores)
      const cantidadImpostores = Math.max(2, Math.floor(jugadores.length * (0.3 + Math.random() * 0.2)));
      const indices = Array.from({ length: jugadores.length }, (_, i) => i);
      
      // Seleccionar impostores aleatorios
      for (let i = 0; i < cantidadImpostores; i++) {
        const randomIndex = Math.floor(Math.random() * indices.length);
        impostores.push(indices.splice(randomIndex, 1)[0]);
      }
      
      const pistas = generarPistasImpostores(palabraSecreta, cantidadImpostores);
      impostores.forEach((indice, i) => {
        pistasImpostores[indice] = pistas[i];
      });
    } else if (modoDiabolico === 'sin-pistas') {
      // Modo: Sin pistas - impostores no reciben pistas
      impostor = Math.floor(Math.random() * jugadores.length);
      // No se genera pista para el impostor
    } else if (modoDiabolico === 'pistas-mezcladas') {
      // Modo: Algunos tienen la palabra real con pistas reales, otros son impostores con pistas falsas
      const cantidadImpostores = Math.max(1, Math.floor(jugadores.length / 2));
      const indices = Array.from({ length: jugadores.length }, (_, i) => i);
      
      // Seleccionar impostores aleatorios
      for (let i = 0; i < cantidadImpostores; i++) {
        const randomIndex = Math.floor(Math.random() * indices.length);
        impostores.push(indices.splice(randomIndex, 1)[0]);
      }
      
      // Los impostores reciben pistas falsas (de otra palabra)
      impostores.forEach((indice) => {
        const palabraFalsa = obtenerPalabraAleatoria(estadoJuego.categorias || ['comida']);
        pistasImpostores[indice] = generarPistaImpostor(palabraFalsa);
      });
      
      // Los jugadores normales reciben pistas reales (pero no las necesitan porque ven la palabra)
      // No asignamos pistas a los normales, solo a los impostores
      impostor = impostores[0]; // Para compatibilidad
    } else if (modoDiabolico === 'palabra-compartida') {
      // Modo: Todos tienen la misma palabra, pero algunos creen ser impostores
      const cantidadFalsosImpostores = Math.floor(jugadores.length / 3);
      const indicesFalsos = [];
      const indices = Array.from({ length: jugadores.length }, (_, i) => i);
      
      for (let i = 0; i < cantidadFalsosImpostores; i++) {
        const randomIndex = Math.floor(Math.random() * indices.length);
        indicesFalsos.push(indices.splice(randomIndex, 1)[0]);
      }
      
      // Los que creen ser impostores reciben pistas
      const pistas = generarPistasImpostores(palabraSecreta, cantidadFalsosImpostores);
      indicesFalsos.forEach((indice, i) => {
        pistasImpostores[indice] = pistas[i];
      });
    } else {
      // Modo normal: uno o más impostores según configuración
      const cantidadImpostores = numImpostores || 1;
      const maxImpostores = Math.max(1, Math.floor(jugadores.length / 2));
      const numImpostoresFinal = Math.min(cantidadImpostores, maxImpostores);
      
      if (numImpostoresFinal === 1) {
        // Un solo impostor (comportamiento original)
        impostor = Math.floor(Math.random() * jugadores.length);
        pistaImpostor = generarPistaImpostor(palabraSecreta);
      } else {
        // Múltiples impostores en modo normal
        const indicesJugadores = Array.from({ length: jugadores.length }, (_, i) => i);
        impostores = indicesJugadores.sort(() => Math.random() - 0.5).slice(0, numImpostoresFinal);
        const pistas = generarPistasImpostores(palabraSecreta, numImpostoresFinal);
        impostores.forEach((idx, i) => {
          pistasImpostores[idx] = pistas[i];
        });
        // El impostor "principal" para la revelación será el primero
        impostor = impostores[0];
      }
    }

    actualizarEstado({
      jugadores,
      jugadorActual: 0,
      impostor,
      palabraSecreta,
      pistaImpostor,
      pistasImpostores,
      modoDiabolico,
      jugadorConPalabra,
      palabrasJugadores,
      impostores,
      numImpostores: modoDiabolico === null ? numImpostores : 1, // Solo usar numImpostores en modo normal
      pistas: [],
      votos: {},
      jugadoresListos: [],
      jugadorInicia: null,
      modoVotacion: false,
      modoAdivinanza: false,
      modoAcusacion: false,
      jugadoresQueVieronPalabra: []
    });
    
    setPantalla('juego');
  };

  return (
    <div className="pantalla activa">
      <h2 style={{ marginBottom: '16px' }}>Configuración de Jugadores</h2>
      
      {/* Contador de jugadores */}
      <div style={{
        textAlign: 'center',
        marginBottom: '18px',
        padding: '8px 14px',
        background: 'rgba(102, 126, 234, 0.1)',
        border: '1px solid rgba(102, 126, 234, 0.2)',
        borderRadius: '10px',
        display: 'inline-block',
        width: '100%',
        boxSizing: 'border-box',
        boxShadow: '0 1px 4px rgba(102, 126, 234, 0.12)'
      }}>
        <span style={{ 
          fontSize: '0.9em', 
          fontWeight: '400',
          color: '#fff'
        }}>
          👥 {nombresJugadores.length} {nombresJugadores.length === 1 ? 'Jugador' : 'Jugadores'}
        </span>
      </div>
      
      {/* Contenedor con scroll solo para la lista de jugadores */}
      <div style={{ 
        maxHeight: 'calc(100vh - 400px)',
        minHeight: '200px',
        overflowY: 'auto',
        overflowX: 'hidden',
        marginBottom: '15px',
        paddingRight: '10px',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'thin',
        scrollBehavior: 'smooth'
      }}
      onTouchStart={(e) => {
        // Permitir scroll normal en el contenedor
        e.stopPropagation();
      }}
      onTouchMove={(e) => {
        // Permitir scroll normal en el contenedor
        e.stopPropagation();
      }}
      >
        <div className="lista-jugadores" style={{ marginBottom: '10px' }}>
          {nombresJugadores.map((nombre, index) => (
          <div 
            key={index} 
            className="jugador-item" 
            data-index={index}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            style={{
              animation: jugadorAgregado === index 
                ? 'slideInFromRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
                : jugadorEliminado === index
                  ? 'fadeOutScale 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                  : 'none',
              display: 'flex', 
              gap: '10px', 
              alignItems: 'center',
              opacity: jugadorArrastrando === index ? 0.7 : 1,
              backgroundColor: jugadorSobre === index ? 'rgba(76, 222, 128, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              border: jugadorSobre === index ? '1.5px dashed rgba(76, 222, 128, 0.6)' : '1.5px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '8px',
              transition: 'transform 0.2s ease, opacity 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              transform: jugadorArrastrando === index ? 'translate3d(0, 0, 0) scale(1.03) rotate(1deg)' : 'translate3d(0, 0, 0) scale(1)',
              boxShadow: jugadorArrastrando === index 
                ? '0 4px 12px rgba(0, 0, 0, 0.3), 0 0 8px rgba(102, 126, 234, 0.3)' 
                : jugadorSobre === index 
                  ? '0 2px 8px rgba(76, 222, 128, 0.25)' 
                  : '0 1px 4px rgba(0, 0, 0, 0.15)',
              zIndex: jugadorArrastrando === index ? 10 : 1,
              willChange: jugadorArrastrando === index ? 'transform' : 'auto'
            }}
          >
            <div 
              style={{ 
                fontSize: '1.5em', 
                cursor: jugadorArrastrando === index ? 'grabbing' : 'grab',
                color: jugadorArrastrando === index ? 'rgba(102, 126, 234, 1)' : 'rgba(255, 255, 255, 0.6)',
                padding: '0 10px',
                touchAction: 'none',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                transition: 'all 0.2s',
                transform: jugadorArrastrando === index ? 'scale(1.2)' : 'scale(1)',
                filter: jugadorArrastrando === index ? 'drop-shadow(0 0 8px rgba(102, 126, 234, 0.8))' : 'none'
              }}
              draggable
              onDragStart={() => handleDragStart(index)}
              onTouchStart={(e) => {
                e.stopPropagation();
                handleTouchStart(e, index);
              }}
              onTouchMove={(e) => {
                e.stopPropagation();
                handleTouchMove(e, index);
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                handleTouchEnd(e);
              }}
              title="Arrastra para reordenar"
            >
              ☰
            </div>
            <input
              type="text"
              value={nombre}
              onChange={(e) => handleNombreChange(index, e.target.value)}
              placeholder={`Jugador ${index + 1}`}
              style={{ flex: 1 }}
              onFocus={(e) => e.target.select()}
            />
            {nombresJugadores.length > 2 && (
              <button
                onClick={() => handleEliminarJugador(index)}
                style={{
                  background: 'rgba(239, 68, 68, 0.3)',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '35px',
                  height: '35px',
                  cursor: 'pointer',
                  fontSize: '1.2em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                  touchAction: 'manipulation'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(239, 68, 68, 0.5)';
                  e.target.style.transform = 'scale(1.15)';
                  e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(239, 68, 68, 0.3)';
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
                onTouchStart={(e) => {
                  e.target.style.background = 'rgba(239, 68, 68, 0.5)';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onTouchEnd={(e) => {
                  e.target.style.background = 'rgba(239, 68, 68, 0.3)';
                  e.target.style.transform = 'scale(1)';
                }}
                title="Eliminar jugador"
              >
                ×
              </button>
            )}
          </div>
          ))}
        </div>
      </div>
      
      {/* Botón de agregar jugador - siempre visible */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={handleAgregarJugador}
          style={{
            background: 'rgba(76, 222, 128, 0.3)',
            border: '2px solid rgba(76, 222, 128, 0.5)',
            color: '#fff',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            fontSize: '2em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            fontWeight: 'bold',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            touchAction: 'manipulation',
            boxShadow: '0 4px 12px rgba(76, 222, 128, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(76, 222, 128, 0.5)';
            e.target.style.transform = 'scale(1.15) rotate(90deg)';
            e.target.style.boxShadow = '0 6px 20px rgba(76, 222, 128, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(76, 222, 128, 0.3)';
            e.target.style.transform = 'scale(1) rotate(0deg)';
            e.target.style.boxShadow = '0 4px 12px rgba(76, 222, 128, 0.3)';
          }}
          onTouchStart={(e) => {
            e.target.style.background = 'rgba(76, 222, 128, 0.5)';
            e.target.style.transform = 'scale(1.1)';
          }}
          onTouchEnd={(e) => {
            e.target.style.background = 'rgba(76, 222, 128, 0.3)';
            e.target.style.transform = 'scale(1)';
          }}
          title="Agregar jugador"
        >
          +
        </button>
      </div>
      
      {/* Selector de número de impostores (solo en modo normal) */}
      {!estadoJuego.modosDiabolicos && !estadoJuego.modosAleatorios && (
        <div className="input-group" style={{ marginTop: '25px', marginBottom: '20px' }}>
          <label htmlFor="num-impostores-jugadores" style={{ 
            marginBottom: '12px', 
            display: 'block', 
            fontSize: '1.1em', 
            fontWeight: '600' 
          }}>
            🎭 Número de Impostores:
          </label>
          <div className="custom-select-wrapper" style={{ position: 'relative' }}>
            <select
              id="num-impostores-jugadores"
              value={Math.min(numImpostores, maxImpostores)}
              onChange={(e) => {
                const nuevoValor = parseInt(e.target.value);
                setNumImpostores(nuevoValor);
              }}
              style={{
                width: '100%',
                padding: '15px 40px 15px 15px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '1.1em',
                fontWeight: '500',
                cursor: 'pointer',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                outline: 'none',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(102, 126, 234, 0.6)';
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
              }}
            >
              {Array.from({ length: maxImpostores }, (_, i) => i + 1).map(num => (
                <option 
                  key={num} 
                  value={num}
                  style={{ background: '#1e3c72', color: '#fff' }}
                >
                  {num} {num === 1 ? 'Impostor' : 'Impostores'}
                </option>
              ))}
            </select>
            <span style={{
              position: 'absolute',
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              fontSize: '1.2em',
              color: 'rgba(255, 255, 255, 0.7)',
              zIndex: 1
            }}>▼</span>
          </div>
          <p style={{ 
            fontSize: '0.85em', 
            opacity: 0.8, 
            marginTop: '8px', 
            fontStyle: 'italic',
            textAlign: 'center'
          }}>
            Máximo: {maxImpostores} impostor{maxImpostores !== 1 ? 'es' : ''} (basado en {nombresJugadores.length} jugador{nombresJugadores.length !== 1 ? 'es' : ''})
          </p>
        </div>
      )}
      
      <button className="btn btn-primary" onClick={handleContinuar}>
        Continuar
      </button>
      <button 
        className="btn btn-secondary" 
        onClick={() => {
          // Guardar los nombres actuales antes de volver
          actualizarEstado({
            jugadores: nombresJugadores.map(n => n.trim() || `Jugador ${nombresJugadores.indexOf(n) + 1}`),
            numJugadores: nombresJugadores.length
          });
          setPantalla('inicio');
        }}
        style={{ marginTop: '20px' }}
      >
        Volver
      </button>
      
      <div style={{ 
        marginTop: '30px', 
        textAlign: 'center', 
        fontSize: '0.8em', 
        opacity: 0.7,
        color: 'rgba(255, 255, 255, 0.6)'
      }}>
        <p>© 2026 Brayan Camacho. Todos los derechos reservados.</p>
        <p style={{ marginTop: '5px', fontSize: '0.9em' }}>Creado por: <strong>Brayan Camacho</strong></p>
      </div>
    </div>
  );
}

export default PantallaJugadores;

