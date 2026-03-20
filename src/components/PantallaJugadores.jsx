import { useState, useEffect, useRef } from 'react';
import { useNotificaciones } from '../context/NotificacionesContext';
import { obtenerPalabraAleatoria, generarPistaImpostor, generarPistasImpostores } from '../palabras-dominicanas';
import { vibrateLight } from '../utils/vibration';
import EstadoVacio from './ui/EstadoVacio';
import AyudaContextual from './AyudaContextual';
import Footer from './Footer';

function PantallaJugadores({ estadoJuego, actualizarEstado, setPantalla }) {
  const { showToast } = useNotificaciones();
  // Cargar nombres desde localStorage o usar los del estado
  const [nombresJugadores, setNombresJugadores] = useState(() => {
    const MIN_JUGADORES = 3;

    // Primero intentar cargar desde localStorage
    const jugadoresGuardados = localStorage.getItem('jugadoresNombres');
    if (jugadoresGuardados) {
      try {
        const nombres = JSON.parse(jugadoresGuardados);
        if (Array.isArray(nombres) && nombres.length > 0) {
          // Completar hasta el mínimo si hacen falta jugadores
          if (nombres.length < MIN_JUGADORES) {
            const extras = Array(MIN_JUGADORES - nombres.length)
              .fill('')
              .map((_, i) => `Jugador ${nombres.length + i + 1}`);
            return [...nombres, ...extras];
          }
          return nombres;
        }
      } catch (e) {
        console.error('Error al cargar jugadores desde localStorage:', e);
      }
    }
    
    // Si hay jugadores en el estado, usarlos (completando hasta el mínimo)
    if (estadoJuego.jugadores && estadoJuego.jugadores.length > 0) {
      const jugadores = estadoJuego.jugadores;
      if (jugadores.length < MIN_JUGADORES) {
        const extras = Array(MIN_JUGADORES - jugadores.length)
          .fill('')
          .map((_, i) => `Jugador ${jugadores.length + i + 1}`);
        return [...jugadores, ...extras];
      }
      return jugadores;
    }
    
    // Si no hay nada, crear 3 jugadores por defecto
    return Array(MIN_JUGADORES).fill('').map((_, i) => `Jugador ${i + 1}`);
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
  const listaRef = useRef(null);
  const inputsRef = useRef([]);

  // Scroll automático + foco en el input cuando se agrega un jugador
  useEffect(() => {
    if (jugadorAgregado !== null && listaRef.current) {
      listaRef.current.scrollTop = listaRef.current.scrollHeight;
      // Foco en el input del nuevo jugador y seleccionar el texto para reemplazarlo fácil
      const input = inputsRef.current[jugadorAgregado];
      if (input) {
        setTimeout(() => {
          input.focus();
          input.select();
        }, 50);
      }
    }
  }, [jugadorAgregado]);
  
  // Calcular máximo de impostores basado en el número actual de jugadores
  // Regla: 1 impostor por cada 3 jugadores
  const maxImpostores = Math.max(1, Math.floor(nombresJugadores.length / 3));

  const handleNombreChange = (index, nombre) => {
    const nuevosNombres = [...nombresJugadores];
    nuevosNombres[index] = nombre;
    setNombresJugadores(nuevosNombres);
  };

  const eliminarClickRef = useRef(null);
  const handleEliminarClick = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    if (eliminarClickRef.current === index) return;
    eliminarClickRef.current = index;
    setTimeout(() => { eliminarClickRef.current = null; }, 400);
    handleEliminarJugador(index);
  };

  const handleAgregarJugador = () => {
    const nuevoJugador = '';
    setNombresJugadores([...nombresJugadores, nuevoJugador]);
    setJugadorAgregado(nombresJugadores.length);
    
    // Ajustar numImpostores si es necesario cuando se agrega un jugador
    // Regla: 1 impostor por cada 3 jugadores
    const nuevoMax = Math.max(1, Math.floor((nombresJugadores.length + 1) / 3));
    if (numImpostores > nuevoMax) {
      setNumImpostores(nuevoMax);
    }
    
    // Limpiar animación después de 600ms
    setTimeout(() => {
      setJugadorAgregado(null);
    }, 600);
  };

  const handleEliminarJugador = (index) => {
    if (nombresJugadores.length > 3) {
      vibrateLight();
      setJugadorEliminado(index);
      
      // Esperar un poco para la animación antes de eliminar
      setTimeout(() => {
        const nuevosNombres = nombresJugadores.filter((_, i) => i !== index);
        setNombresJugadores(nuevosNombres);
        setJugadorEliminado(null);
        
        // Ajustar numImpostores si es necesario cuando se elimina un jugador
        // Regla: 1 impostor por cada 3 jugadores
        const nuevoMax = Math.max(1, Math.floor((nuevosNombres.length) / 3));
        if (numImpostores > nuevoMax) {
          setNumImpostores(nuevoMax);
        }
      }, 300);
    } else {
      showToast('Debe haber al menos 3 jugadores', 'info');
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
    if (e.target.closest('[data-no-drag]')) return;
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
    } else if (modoDiabolico === 'sin-pistas') {
      // Modo: Sin pistas - impostores no reciben pistas
      impostor = Math.floor(Math.random() * jugadores.length);
      // No se genera pista para el impostor
    } else if (modoDiabolico === 'pistas-mezcladas') {
      // Modo: Algunos tienen la palabra real, otros son impostores con pistas falsas
      // IMPORTANTE: Solo los impostores reciben pistas. Los normales tienen la palabra.
      // Regla: 1 impostor por cada 3 jugadores
      const cantidadImpostores = Math.max(1, Math.floor(jugadores.length / 3));
      const indices = Array.from({ length: jugadores.length }, (_, i) => i);
      
      // Seleccionar impostores aleatorios
      for (let i = 0; i < cantidadImpostores; i++) {
        const randomIndex = Math.floor(Math.random() * indices.length);
        impostores.push(indices.splice(randomIndex, 1)[0]);
      }
      
      // SOLO los impostores reciben pistas falsas (de otra palabra)
      // Los jugadores normales NO reciben pistas porque tienen la palabra
      impostores.forEach((indice) => {
        const palabraFalsa = obtenerPalabraAleatoria(estadoJuego.categorias || ['comida']);
        pistasImpostores[indice] = generarPistaImpostor(palabraFalsa);
      });
      
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
    } else if (modoDiabolico === 'rotacion-palabras') {
      // Modo: Las palabras rotan entre jugadores - cada uno tiene una palabra diferente que cambia
      // Cada jugador tiene una palabra aleatoria diferente
      for (let i = 0; i < jugadores.length; i++) {
        palabrasJugadores[i] = obtenerPalabraAleatoria(estadoJuego.categorias || ['comida']);
      }
      // Nadie es impostor realmente, pero todos creen tener la palabra correcta
      esImpostor = false;
      jugadorConPalabra = Math.floor(Math.random() * jugadores.length);
    } else if (modoDiabolico === 'palabra-fantasma') {
      // Modo: Una palabra FANTASMA que no existe aparece en algunas tarjetas
      // Algunos jugadores creen tener una palabra que NO existe
      const palabraFantasma = 'PALABRA FANTASMA'; // Palabra que no existe
      const cantidadConFantasma = Math.max(1, Math.floor(jugadores.length / 3));
      const indices = Array.from({ length: jugadores.length }, (_, i) => i);
      const indicesFantasma = [];
      
      // Seleccionar jugadores que creen tener la palabra fantasma
      for (let i = 0; i < cantidadConFantasma; i++) {
        const randomIndex = Math.floor(Math.random() * indices.length);
        indicesFantasma.push(indices.splice(randomIndex, 1)[0]);
      }
      
      // Los que tienen la palabra fantasma reciben pistas de una palabra aleatoria
      indicesFantasma.forEach((indice) => {
        const palabraAleatoria = obtenerPalabraAleatoria(estadoJuego.categorias || ['comida']);
        palabrasJugadores[indice] = palabraFantasma; // Marcar como fantasma
        pistasImpostores[indice] = generarPistaImpostor(palabraAleatoria);
      });
      
      // Los demás tienen la palabra real
      for (let i = 0; i < jugadores.length; i++) {
        if (!indicesFantasma.includes(i)) {
          palabrasJugadores[i] = palabraSecreta;
        }
      }
      impostor = indicesFantasma[0] || 0;
    } else if (modoDiabolico === 'modo-espejo') {
      // Modo: Las palabras se alternan entre jugadores (intercaladas)
      // Ejemplo: Jugador 1 = café, Jugador 2 = otra, Jugador 3 = café, Jugador 4 = otra...
      const palabra1 = obtenerPalabraAleatoria(estadoJuego.categorias || ['comida']);
      let palabra2 = obtenerPalabraAleatoria(estadoJuego.categorias || ['comida']);
      // Asegurar que sean diferentes
      while (palabra2 === palabra1) {
        palabra2 = obtenerPalabraAleatoria(estadoJuego.categorias || ['comida']);
      }
      
      // Alternar palabras: índice par = palabra1, índice impar = palabra2
      for (let i = 0; i < jugadores.length; i++) {
        palabrasJugadores[i] = i % 2 === 0 ? palabra1 : palabra2;
      }
      // Nadie es impostor, pero tienen palabras diferentes intercaladas
      esImpostor = false;
    } else {
      // Modo normal: uno o más impostores según configuración — todos con la MISMA pista (una palabra)
      // Regla: 1 impostor por cada 3 jugadores
      const cantidadImpostores = numImpostores || 1;
      const maxImpostores = Math.max(1, Math.floor(jugadores.length / 3));
      const numImpostoresFinal = Math.min(cantidadImpostores, maxImpostores);
      const mostrarPistaImpostor = estadoJuego.mostrarPistaImpostor !== false;
      
      if (numImpostoresFinal === 1) {
        // Un solo impostor (comportamiento original)
        impostor = Math.floor(Math.random() * jugadores.length);
        pistaImpostor = mostrarPistaImpostor ? generarPistaImpostor(palabraSecreta) : null;
      } else {
        // Múltiples impostores en modo normal: misma pista (una palabra) para todos
        const indicesJugadores = Array.from({ length: jugadores.length }, (_, i) => i);
        impostores = indicesJugadores.sort(() => Math.random() - 0.5).slice(0, numImpostoresFinal);
        const unaPista = mostrarPistaImpostor ? generarPistaImpostor(palabraSecreta) : null;
        impostores.forEach((idx) => {
          if (unaPista) pistasImpostores[idx] = unaPista;
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
      jugadoresQueVieronPalabra: []
    });
    
    setPantalla('juego');
  };

  const etiquetasCategorias = {
    comida: '🍽️ Comida', historia: '📚 Historia', lugares: '🗺️ Lugares',
    personajes: '⭐ Personajes', artistas: '🎨 Artistas', musica: '🎵 Música',
    deportes: '⚾ Deportes', festividades: '🎉 Festividades', tradiciones: '🎭 Tradiciones',
    anime: '🎌 Anime', videojuegos: '🎮 Videojuegos', barrios: '🏘️ Barrios',
    marcas: '🛒 Marcas', youtubers: '📱 Youtubers'
  };

  const nombresModosdiabolicos = {
    'todos-impostores': '😈 Todos Impostores Menos Uno',
    'dos-palabras': '⚔️ Dos Palabras Secretas',
    'sin-pistas': '🚫 Sin Pistas',
    'pistas-mezcladas': '🎲 Pistas Mezcladas',
    'palabra-compartida': '🤝 Palabra Compartida',
    'rotacion-palabras': '🌀 Rotación de Palabras',
    'palabra-fantasma': '👻 Palabra Fantasma',
    'modo-espejo': '🪞 Modo Espejo',
  };

  const categoriasActivas = (estadoJuego.categorias || ['comida']);
  const numImpostoresMostrar = Math.min(numImpostores, maxImpostores);

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
        <AyudaContextual translationKey="helpJugadores" />
      </div>

      {/* Lista de jugadores con scroll */}
      <div
        ref={listaRef}
        style={{
          maxHeight: 'calc(100dvh - 400px)',
          minHeight: '120px',
          overflowY: 'auto',
          overflowX: 'hidden',
          marginBottom: '10px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin',
          scrollBehavior: 'smooth'
        }}
        onTouchStart={e => e.stopPropagation()}
        onTouchMove={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '4px' }}>
          {nombresJugadores.length === 0 ? (
            <EstadoVacio
              icono="👥"
              titulo="No hay jugadores"
              mensaje="Necesitas al menos 3 jugadores para jugar."
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
                padding: '12px 14px',
                background: jugadorSobre === index
                  ? 'rgba(102,126,234,0.14)'
                  : jugadorArrastrando === index
                    ? 'rgba(102,126,234,0.1)'
                    : 'rgba(255,255,255,0.05)',
                border: `1.5px solid ${jugadorSobre === index ? 'rgba(102,126,234,0.5)' : 'rgba(255,255,255,0.1)'}`,
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
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg,rgba(102,126,234,0.35),rgba(118,75,162,0.35))',
                color: '#a78bfa',
                fontSize: '0.8em',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '1.5px solid rgba(102,126,234,0.3)'
              }}>
                {index + 1}
              </span>

              {/* Input nombre — tap target grande; permitir vacío para borrar */}
              <input
                type="text"
                ref={el => inputsRef.current[index] = el}
                value={nombre}
                onChange={e => handleNombreChange(index, e.target.value)}
                onKeyDown={e => e.stopPropagation()}
                placeholder={`Jugador ${index + 1}`}
                aria-label={`Nombre del jugador ${index + 1}`}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--color-text)',
                  fontSize: '1em',
                  fontWeight: '600',
                  padding: '4px 0',
                  minWidth: 0,
                  caretColor: '#a78bfa'
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
                  color: 'rgba(255,255,255,0.25)',
                  touchAction: 'none',
                  padding: '6px',
                  display: 'flex',
                  flexShrink: 0,
                  transition: 'color 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/>
                  <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
                  <circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
                </svg>
              </div>

              {/* Botón eliminar — evita que el arrastre capture el toque */}
              {nombresJugadores.length > 3 && (
                <button
                  type="button"
                  aria-label={`Eliminar ${nombre.trim() || `Jugador ${index + 1}`}`}
                  onClick={e => handleEliminarClick(e, index)}
                  onTouchEnd={e => { e.stopPropagation(); if (e.cancelable) e.preventDefault(); handleEliminarClick(e, index); }}
                  data-no-drag
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(248,113,113,0.45)',
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'color 0.15s, background 0.15s',
                    touchAction: 'manipulation'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(248,113,113,0.45)'; e.currentTarget.style.background = 'transparent'; }}
                  onTouchStart={e => { e.stopPropagation(); e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.12)'; }}
                  title="Eliminar jugador"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
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
          padding: '13px',
          marginBottom: '14px',
          background: 'rgba(74,222,128,0.07)',
          border: '1.5px dashed rgba(74,222,128,0.35)',
          borderRadius: '14px',
          color: '#4ade80',
          fontSize: '0.92em',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'background 0.2s, border-color 0.2s',
          touchAction: 'manipulation'
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(74,222,128,0.14)'; e.currentTarget.style.borderColor = 'rgba(74,222,128,0.55)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(74,222,128,0.07)'; e.currentTarget.style.borderColor = 'rgba(74,222,128,0.35)'; }}
        onTouchStart={e => { e.currentTarget.style.background = 'rgba(74,222,128,0.14)'; }}
        onTouchEnd={e => { e.currentTarget.style.background = 'rgba(74,222,128,0.07)'; }}
        title="Agregar jugador"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Agregar jugador
      </button>

      {/* Selector de impostores — visible siempre salvo en modo diabólico puro */}
      {!(estadoJuego.modosDiabolicos && !estadoJuego.modosAleatorios) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '14px 16px',
          background: 'rgba(255,255,255,0.04)',
          border: '1.5px solid rgba(255,255,255,0.1)',
          borderRadius: '14px',
          marginBottom: '12px'
        }}>
          <span style={{ fontSize: '1.4em', lineHeight: 1 }}>🎭</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.95em', fontWeight: '600', color: 'var(--color-text)', marginBottom: '2px' }}>
              Impostores
            </div>
            <div style={{ fontSize: '0.78em', opacity: 0.6, lineHeight: 1.3 }}>
              {estadoJuego.modosAleatorios
                ? 'Solo aplica si sale modo normal'
                : `${numImpostoresMostrar} de ${nombresJugadores.length} jugadores`}
            </div>
          </div>
          {/* Botones más grandes para dedos */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => setNumImpostores(v => Math.max(1, v - 1))}
              disabled={numImpostores <= 1}
              style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: numImpostores <= 1 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)',
                border: '1.5px solid rgba(255,255,255,0.15)',
                color: 'var(--color-text)', fontSize: '1.4em', fontWeight: '700',
                cursor: numImpostores <= 1 ? 'not-allowed' : 'pointer',
                opacity: numImpostores <= 1 ? 0.3 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s', touchAction: 'manipulation'
              }}
              aria-label="Reducir impostores"
            >−</button>
            <span style={{
              minWidth: '36px', textAlign: 'center',
              fontSize: '1.3em', fontWeight: '800', color: 'var(--color-text)'
            }}>
              {numImpostoresMostrar}
            </span>
            <button
              type="button"
              onClick={() => setNumImpostores(v => Math.min(v + 1, maxImpostores))}
              disabled={numImpostores >= maxImpostores}
              style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: numImpostores >= maxImpostores ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)',
                border: '1.5px solid rgba(255,255,255,0.15)',
                color: 'var(--color-text)', fontSize: '1.4em', fontWeight: '700',
                cursor: numImpostores >= maxImpostores ? 'not-allowed' : 'pointer',
                opacity: numImpostores >= maxImpostores ? 0.3 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s', touchAction: 'manipulation'
              }}
              aria-label="Aumentar impostores"
            >+</button>
          </div>
        </div>
      )}

      {/* Resumen de la partida antes de continuar */}
      <div style={{
        padding: '12px 14px',
        background: 'rgba(255,255,255,0.03)',
        border: '1.5px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        marginBottom: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {/* Categorías activas */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <span style={{ fontSize: '0.8em', opacity: 0.5, paddingTop: '2px', flexShrink: 0 }}>📂</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {categoriasActivas.map(cat => (
              <span key={cat} style={{
                fontSize: '0.72em', fontWeight: '600',
                background: 'rgba(102,126,234,0.15)',
                color: '#a78bfa',
                border: '1px solid rgba(102,126,234,0.25)',
                borderRadius: '8px',
                padding: '2px 8px'
              }}>
                {etiquetasCategorias[cat] || cat}
              </span>
            ))}
          </div>
        </div>

        {/* Modo activo */}
        {(estadoJuego.modosDiabolicos || estadoJuego.modosAleatorios) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8em', opacity: 0.5, flexShrink: 0 }}>⚙️</span>
            <span style={{
              fontSize: '0.78em', fontWeight: '700',
              color: estadoJuego.modosDiabolicos ? '#f87171' : '#c084fc'
            }}>
              {estadoJuego.modosAleatorios
                ? '🎲 Modo Aleatorio'
                : (nombresModosdiabolicos[estadoJuego.modoDiabolicoSeleccionado] || '😈 Modo Diabólico')}
            </span>
          </div>
        )}
      </div>

      {/* Botón continuar */}
      <button
        className="btn btn-primary"
        onClick={handleContinuar}
        style={{ width: '100%', padding: '16px', fontSize: '1.05em', fontWeight: '700', borderRadius: '16px', letterSpacing: '0.03em' }}
      >
        ¡Empezar! 🎮
      </button>

      <Footer />
    </div>
  );
}

export default PantallaJugadores;

