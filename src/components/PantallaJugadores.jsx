import { useState, useEffect } from 'react';
import { useNotificaciones } from '../context/NotificacionesContext';
import { obtenerPalabraAleatoria, generarPistaImpostor, generarPistasImpostores } from '../palabras-dominicanas';
import EstadoVacio from './ui/EstadoVacio';
import Footer from './Footer';

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
    showToast('✓ Orden actualizado', 'success', 1500);
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
      const indexDestino = parseInt(jugadorItem.dataset.index, 10);
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
    let reordeno = false;
    
    if (jugadorItem) {
      const indexDestino = parseInt(jugadorItem.dataset.index, 10);
      if (jugadorArrastrando !== indexDestino && !Number.isNaN(indexDestino)) {
        const nuevosNombres = [...nombresJugadores];
        const [jugadorMovido] = nuevosNombres.splice(jugadorArrastrando, 1);
        nuevosNombres.splice(indexDestino, 0, jugadorMovido);
        setNombresJugadores(nuevosNombres);
        reordeno = true;
      }
    }
    
    setJugadorArrastrando(null);
    setJugadorSobre(null);
    if (reordeno) showToast('✓ Orden actualizado', 'success', 1500);
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
      // Modo normal: uno o más impostores según configuración — todos con la MISMA pista (una palabra)
      const cantidadImpostores = numImpostores || 1;
      const maxImpostores = Math.max(1, Math.floor(jugadores.length / 2));
      const numImpostoresFinal = Math.min(cantidadImpostores, maxImpostores);
      
      if (numImpostoresFinal === 1) {
        // Un solo impostor (comportamiento original)
        impostor = Math.floor(Math.random() * jugadores.length);
        pistaImpostor = generarPistaImpostor(palabraSecreta);
      } else {
        // Múltiples impostores en modo normal: misma pista (una palabra) para todos
        const indicesJugadores = Array.from({ length: jugadores.length }, (_, i) => i);
        impostores = indicesJugadores.sort(() => Math.random() - 0.5).slice(0, numImpostoresFinal);
        const unaPista = generarPistaImpostor(palabraSecreta);
        impostores.forEach((idx) => {
          pistasImpostores[idx] = unaPista;
        });
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
      jugadoresListos: [],
      jugadorInicia: null,
      modoAdivinanza: false,
      jugadoresQueVieronPalabra: []
    });
    
    setPantalla('juego');
  };

  return (
    <div className="pantalla activa">

      {/* Cabecera */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button
          onClick={() => {
            actualizarEstado({
              jugadores: nombresJugadores.map((n, i) => n.trim() || `Jugador ${i + 1}`),
              numJugadores: nombresJugadores.length
            });
            setPantalla('inicio');
          }}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1.5px solid rgba(255,255,255,0.12)',
            borderRadius: '10px',
            padding: '8px 14px',
            color: 'var(--color-text)',
            fontSize: '0.85em',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Volver
        </button>

        <div style={{ textAlign: 'center', flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: '1.05em', fontWeight: '700', letterSpacing: '-0.2px' }}>
            Jugadores
          </h2>
        </div>

        {/* Badge contador */}
        <span style={{
          background: 'linear-gradient(135deg,#667eea,#764ba2)',
          color: '#fff',
          borderRadius: '20px',
          padding: '4px 12px',
          fontSize: '0.82em',
          fontWeight: '700',
          minWidth: '44px',
          textAlign: 'center'
        }}>
          {nombresJugadores.length}
        </span>
      </div>

      {/* Lista de jugadores con scroll */}
      <div
        style={{
          maxHeight: 'calc(100dvh - 380px)',
          minHeight: '160px',
          overflowY: 'auto',
          overflowX: 'hidden',
          marginBottom: '12px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin',
          scrollBehavior: 'smooth'
        }}
        onTouchStart={e => e.stopPropagation()}
        onTouchMove={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {nombresJugadores.length === 0 ? (
            <EstadoVacio
              icono="👥"
              titulo="No hay jugadores"
              mensaje="Necesitas al menos 2 jugadores para jugar."
              accion={
                <button className="btn btn-primary" onClick={handleAgregarJugador} style={{ marginTop: '12px' }}>
                  Agregar jugador
                </button>
              }
            />
          ) : nombresJugadores.map((nombre, index) => (
            <div
              key={index}
              className="jugador-item"
              data-index={index}
              onDragOver={e => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={e => handleDrop(e, index)}
              style={{
                animation: jugadorAgregado === index
                  ? 'slideInFromRight 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
                  : jugadorEliminado === index
                    ? 'fadeOutScale 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                    : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                background: jugadorSobre === index
                  ? 'rgba(102,126,234,0.14)'
                  : jugadorArrastrando === index
                    ? 'rgba(102,126,234,0.1)'
                    : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${jugadorSobre === index ? 'rgba(102,126,234,0.5)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '14px',
                transition: 'background 0.15s, border-color 0.15s, transform 0.15s, box-shadow 0.15s',
                opacity: jugadorArrastrando === index ? 0.65 : 1,
                transform: jugadorArrastrando === index ? 'scale(1.02)' : 'scale(1)',
                boxShadow: jugadorArrastrando === index ? '0 6px 20px rgba(0,0,0,0.3)' : 'none',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                zIndex: jugadorArrastrando === index ? 10 : 1
              }}
            >
              {/* Número */}
              <span style={{
                width: '26px',
                height: '26px',
                borderRadius: '8px',
                background: 'rgba(102,126,234,0.2)',
                color: '#a78bfa',
                fontSize: '0.78em',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {index + 1}
              </span>

              {/* Input nombre */}
              <input
                type="text"
                value={nombre}
                onChange={e => handleNombreChange(index, e.target.value)}
                placeholder={`Jugador ${index + 1}`}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--color-text)',
                  fontSize: '0.97em',
                  fontWeight: '500',
                  padding: '0',
                  minWidth: 0
                }}
              />

              {/* Handle de arrastre */}
              <div
                draggable
                onDragStart={() => handleDragStart(index)}
                onTouchStart={e => { e.stopPropagation(); handleTouchStart(e, index); }}
                onTouchMove={e => { e.stopPropagation(); handleTouchMove(e, index); }}
                onTouchEnd={e => { e.stopPropagation(); handleTouchEnd(e); }}
                title="Arrastrar para reordenar"
                style={{
                  cursor: jugadorArrastrando === index ? 'grabbing' : 'grab',
                  color: 'rgba(255,255,255,0.3)',
                  touchAction: 'none',
                  padding: '4px',
                  display: 'flex',
                  flexShrink: 0,
                  transition: 'color 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/>
                  <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
                  <circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
                </svg>
              </div>

              {/* Botón eliminar */}
              {nombresJugadores.length > 2 && (
                <button
                  type="button"
                  aria-label={`Eliminar ${nombre.trim() || `Jugador ${index + 1}`}`}
                  onClick={() => handleEliminarJugador(index)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(248,113,113,0.5)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'color 0.15s, background 0.15s',
                    touchAction: 'manipulation'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(248,113,113,0.5)'; e.currentTarget.style.background = 'transparent'; }}
                  onTouchStart={e => { e.currentTarget.style.color = '#f87171'; }}
                  onTouchEnd={e => { e.currentTarget.style.color = 'rgba(248,113,113,0.5)'; }}
                  title="Eliminar jugador"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Botón agregar jugador */}
      <button
        onClick={handleAgregarJugador}
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '18px',
          background: 'rgba(74,222,128,0.08)',
          border: '1.5px dashed rgba(74,222,128,0.35)',
          borderRadius: '14px',
          color: '#4ade80',
          fontSize: '0.9em',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'background 0.2s, border-color 0.2s',
          touchAction: 'manipulation'
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(74,222,128,0.15)'; e.currentTarget.style.borderColor = 'rgba(74,222,128,0.55)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(74,222,128,0.08)'; e.currentTarget.style.borderColor = 'rgba(74,222,128,0.35)'; }}
        onTouchStart={e => e.currentTarget.style.background = 'rgba(74,222,128,0.15)'}
        onTouchEnd={e => e.currentTarget.style.background = 'rgba(74,222,128,0.08)'}
        title="Agregar jugador"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Agregar jugador
      </button>

      {/* Selector de impostores (solo modo normal) */}
      {!estadoJuego.modosDiabolicos && !estadoJuego.modosAleatorios && (
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="num-impostores-jugadores" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
            fontSize: '0.92em',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            opacity: 0.85
          }}>
            <span>🎭 Impostores</span>
            <span style={{ fontSize: '0.75em', textTransform: 'none', opacity: 0.6, fontWeight: '400', letterSpacing: 0 }}>
              máx. {maxImpostores} de {nombresJugadores.length} jugadores
            </span>
          </label>
          <select
            id="num-impostores-jugadores"
            value={Math.min(numImpostores, maxImpostores)}
            onChange={e => setNumImpostores(parseInt(e.target.value, 10))}
            style={{
              width: '100%',
              padding: '13px 40px 13px 16px',
              border: '1.5px solid rgba(255,255,255,0.15)',
              borderRadius: '14px',
              background: 'rgba(255,255,255,0.06)',
              color: 'var(--color-text)',
              fontSize: '0.97em',
              fontWeight: '500',
              cursor: 'pointer',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none',
              outline: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23aaa' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 14px center',
              backgroundSize: '14px',
              transition: 'border-color 0.2s'
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(102,126,234,0.55)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
          >
            {Array.from({ length: maxImpostores }, (_, i) => i + 1).map(num => (
              <option key={num} value={num} style={{ background: '#1a1a2e' }}>
                {num} {num === 1 ? 'Impostor' : 'Impostores'}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Modo activo (informativo) */}
      {(estadoJuego.modosDiabolicos || estadoJuego.modosAleatorios) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '11px 14px',
          background: estadoJuego.modosDiabolicos ? 'rgba(245,87,108,0.1)' : 'rgba(157,78,221,0.1)',
          border: `1.5px solid ${estadoJuego.modosDiabolicos ? 'rgba(245,87,108,0.3)' : 'rgba(157,78,221,0.3)'}`,
          borderRadius: '12px',
          marginBottom: '20px',
          fontSize: '0.85em',
          color: estadoJuego.modosDiabolicos ? '#f87171' : '#c084fc'
        }}>
          <span style={{ fontSize: '1.2em' }}>{estadoJuego.modosDiabolicos ? '😈' : '🎲'}</span>
          <span><strong>{estadoJuego.modosDiabolicos ? 'Modo Diabólico' : 'Modo Aleatorio'}</strong> activado</span>
        </div>
      )}

      {/* Botón continuar */}
      <button
        className="btn btn-primary"
        onClick={handleContinuar}
        style={{ width: '100%', padding: '16px', fontSize: '1.05em', fontWeight: '700', borderRadius: '16px', letterSpacing: '0.03em' }}
      >
        Continuar 🎮
      </button>

      <Footer />
    </div>
  );
}

export default PantallaJugadores;

