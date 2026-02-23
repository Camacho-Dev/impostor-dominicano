import { useState, useEffect } from 'react';
import { useNotificaciones } from '../context/NotificacionesContext';
import { useTema } from '../context/ThemeContext';
import Footer from './Footer';

const todasLasCategorias = [
  { value: 'comida', label: '🍽️ Comida Dominicana' },
  { value: 'historia', label: '📚 Historia Dominicana' },
  { value: 'lugares', label: '🗺️ Lugares de RD' },
  { value: 'personajes', label: '⭐ Personajes Dominicanos' },
  { value: 'artistas', label: '🎨 Artistas Dominicanos' },
  { value: 'musica', label: '🎵 Música Dominicana' },
  { value: 'deportes', label: '⚾ Deportes Dominicanos' },
  { value: 'festividades', label: '🎉 Festividades' },
  { value: 'tradiciones', label: '🎭 Tradiciones' },
  { value: 'anime', label: '🎌 Anime' },
  { value: 'videojuegos', label: '🎮 Videojuegos' }
];

function PantallaInicio({ estadoJuego, actualizarEstado, setPantalla }) {
  const { showModal, showToast } = useNotificaciones();
  const { tema, setTema } = useTema();
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState(
    estadoJuego.categorias || ['comida']
  );
  // Los modos NO se activan automáticamente, deben ser seleccionados manualmente
  const [modosDiabolicos, setModosDiabolicos] = useState(false);
  const [modoDiabolicoSeleccionado, setModoDiabolicoSeleccionado] = useState(null);
  const [modosAleatorios, setModosAleatorios] = useState(false);
  const [numImpostores, setNumImpostores] = useState(estadoJuego.numImpostores || 1);
  const [mostrarAyuda, setMostrarAyuda] = useState(false);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [esMovil, setEsMovil] = useState(window.innerWidth <= 768);
  const [dropdownCategoriasAbierto, setDropdownCategoriasAbierto] = useState(false);
  const [verificandoActualizacion, setVerificandoActualizacion] = useState(false);
  
  // Verificar actualizaciones cuando se monta el componente (solo en app instalada)
  useEffect(() => {
    if (window.Capacitor || window.cordova) {
      const checkVersion = async () => {
        setVerificandoActualizacion(true);
        try {
          // Intentar cargar el index.html desde el servidor para verificar versión
          const response = await fetch('https://Camacho-Dev.github.io/impostor-dominicano/index.html?t=' + Date.now(), {
            cache: 'no-store',
            method: 'HEAD'
          });
          
          // Si hay cambios, forzar recarga
          const currentVersion = localStorage.getItem('appVersion') || '0';
          const serverVersion = import.meta.env.VITE_APP_VERSION || '1.1.1';
          
          if (currentVersion !== serverVersion) {
            // Limpiar cache
            if ('caches' in window) {
              const cacheNames = await caches.keys();
              await Promise.all(cacheNames.map(name => caches.delete(name)));
            }
            
            // Guardar nueva versión y recargar
            localStorage.setItem('appVersion', serverVersion);
            window.location.reload(true);
          }
        } catch (error) {
          console.log('Error checking for updates:', error);
        } finally {
          setVerificandoActualizacion(false);
        }
      };
      
      // Verificar cada 30 segundos
      const interval = setInterval(checkVersion, 30000);
      checkVersion(); // Verificar inmediatamente
      
      return () => clearInterval(interval);
    }
  }, []);
  
  // Detectar si es móvil
  useEffect(() => {
    const handleResize = () => {
      setEsMovil(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownCategoriasAbierto && !event.target.closest('.dropdown-categorias-container')) {
        setDropdownCategoriasAbierto(false);
      }
    };
    if (dropdownCategoriasAbierto) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [dropdownCategoriasAbierto]);
  
  // Generar Device ID único (se guarda en localStorage para persistir)
  const [deviceId, setDeviceId] = useState(() => {
    let id = localStorage.getItem('deviceId');
    if (!id) {
      id = 'DEV-' + Math.random().toString(36).substr(2, 9).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
      localStorage.setItem('deviceId', id);
    }
    return id;
  });
  
  // Calcular máximo de impostores (máximo la mitad de jugadores, mínimo 1)
  // Usamos un valor por defecto razonable, se validará cuando se configuren los jugadores
  const maxImpostores = Math.max(1, Math.floor((estadoJuego.numJugadores || 3) / 2));

  // toggleCategoria ya no se usa, pero lo mantenemos por si acaso
  const toggleCategoria = (categoria) => {
    setCategoriasSeleccionadas(prev => {
      if (prev.includes(categoria)) {
        // Si solo queda una, no permitir deseleccionarla
        if (prev.length === 1) return prev;
        return prev.filter(c => c !== categoria);
      } else {
        return [...prev, categoria];
      }
    });
  };

  const seleccionarTodas = () => {
    setCategoriasSeleccionadas(todasLasCategorias.map(c => c.value));
  };

  const deseleccionarTodas = () => {
    setCategoriasSeleccionadas(['comida']); // Mantener al menos una
  };

  const handleIniciar = () => {
    if (categoriasSeleccionadas.length === 0) {
      showToast('Selecciona al menos una categoría', 'info');
      return;
    }

    if (modosDiabolicos && !modosAleatorios && !modoDiabolicoSeleccionado) {
      showToast('Selecciona un modo diabólico para continuar', 'info');
      return;
    }

    // Si modos aleatorios está activo, seleccionar un modo aleatorio (o ninguno)
    let modoFinal = null;
    if (modosAleatorios) {
      const todosLosModos = [
        'todos-impostores',
        'todos-impostores-total',
        'dos-palabras',
        'palabras-falsas',
        'multiples-impostores',
        'sin-pistas',
        'pistas-mezcladas',
        'palabra-compartida',
        null // Modo normal también es una opción
      ];
      // 60% de probabilidad de modo normal, 40% de algún modo diabólico
      if (Math.random() < 0.6) {
        modoFinal = null; // Modo normal
      } else {
        // Seleccionar un modo diabólico aleatorio (excluyendo null)
        const modosDiabolicosDisponibles = todosLosModos.filter(m => m !== null);
        modoFinal = modosDiabolicosDisponibles[Math.floor(Math.random() * modosDiabolicosDisponibles.length)];
      }
    } else if (modosDiabolicos) {
      modoFinal = modoDiabolicoSeleccionado;
    }
    
    actualizarEstado({
      categorias: categoriasSeleccionadas,
      modosDiabolicos: modosAleatorios || modosDiabolicos,
      modoDiabolicoSeleccionado: modoFinal,
      modosAleatorios,
      numImpostores: modoFinal === null ? numImpostores : 1 // Solo usar numImpostores en modo normal
    });
    
    setPantalla('jugadores');
  };

  return (
    <div className="pantalla activa" style={{ position: 'relative' }}>
      {/* Botón de ayuda - Esquina superior izquierda */}
      <button
        onClick={() => setMostrarAyuda(true)}
        style={{
          position: 'absolute',
          top: '15px',
          left: '15px',
          background: 'rgba(102, 126, 234, 0.3)',
          border: '2px solid rgba(102, 126, 234, 0.6)',
          borderRadius: '50%',
          width: '45px',
          height: '45px',
          color: 'var(--color-text)',
          fontSize: '1.8em',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          transition: 'all 0.3s',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          fontWeight: 'bold'
        }}
        onMouseEnter={(e) => {
          if (window.innerWidth > 768) {
            e.target.style.background = 'rgba(102, 126, 234, 0.5)';
            e.target.style.transform = 'scale(1.1)';
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(102, 126, 234, 0.3)';
          e.target.style.transform = 'scale(1)';
        }}
        onTouchStart={(e) => {
          e.target.style.background = 'rgba(102, 126, 234, 0.5)';
        }}
        onTouchEnd={(e) => {
          e.target.style.background = 'rgba(102, 126, 234, 0.3)';
        }}
        title="¿Cómo se juega?"
        aria-label="Abrir ayuda y cómo se juega"
      >
        ?
      </button>

      {/* Botón de configuración - Esquina superior derecha */}
      <button
        onClick={() => setMostrarConfiguracion(true)}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'rgba(255, 165, 0, 0.3)',
          border: '2px solid rgba(255, 165, 0, 0.6)',
          borderRadius: '50%',
          width: '45px',
          height: '45px',
          color: 'var(--color-text)',
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
            e.target.style.background = 'rgba(255, 165, 0, 0.5)';
            e.target.style.transform = 'scale(1.1) rotate(90deg)';
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255, 165, 0, 0.3)';
          e.target.style.transform = 'scale(1) rotate(0deg)';
        }}
        onTouchStart={(e) => {
          e.target.style.background = 'rgba(255, 165, 0, 0.5)';
        }}
        onTouchEnd={(e) => {
          e.target.style.background = 'rgba(255, 165, 0, 0.3)';
        }}
        title="Configuración"
        aria-label="Abrir configuración"
      >
        ⚙️
      </button>

      {/* Modal de ayuda */}
      {mostrarAyuda && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px',
            overflowY: 'auto'
          }}
          onClick={() => setMostrarAyuda(false)}
        >
          <div 
            style={{
              background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)',
              borderRadius: '20px',
              padding: '30px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de cerrar */}
            <button
              onClick={() => setMostrarAyuda(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                color: 'var(--color-text)',
                fontSize: '1.5em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s'
              }}
            >
              ×
            </button>

            <h2 style={{ 
              fontSize: '1.8em', 
              marginBottom: '20px', 
              color: 'var(--color-text)',
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
            }}>
              📖 ¿Cómo se juega?
            </h2>

            <div style={{ color: 'var(--color-text)', lineHeight: '1.8', fontSize: '1em' }}>
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.3em', marginBottom: '10px', color: '#4ade80' }}>
                  🎯 Objetivo del Juego
                </h3>
                <p>
                  Encuentra al impostor o, si eres el impostor, adivina la palabra secreta sin que te descubran.
                </p>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.3em', marginBottom: '10px', color: '#4ade80' }}>
                  📋 Pasos del Juego
                </h3>
                <ol style={{ paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Configuración:</strong> Selecciona las categorías y configura los jugadores.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Ver tu palabra/identidad:</strong> Cada jugador presiona y mantiene presionada su tarjeta para ver su palabra secreta o si es el impostor.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Confirmar:</strong> Después de ver tu tarjeta, confirma que la viste.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Discusión:</strong> Todos los jugadores discuten y dan pistas sobre la palabra secreta.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Revelar:</strong> Cuando estén listos, revelan quién creen que es el impostor.
                  </li>
                </ol>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.3em', marginBottom: '10px', color: '#4ade80' }}>
                  🎭 Roles
                </h3>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Jugadores Normales:</strong>
                  <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                    <li>Ven la palabra secreta</li>
                    <li>Deben dar pistas sin decir la palabra directamente</li>
                    <li>Deben encontrar al impostor</li>
                  </ul>
                </div>
                <div>
                  <strong>Impostor:</strong>
                  <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                    <li>NO ve la palabra secreta</li>
                    <li>Recibe una pista generada automáticamente</li>
                    <li>Debe adivinar la palabra o evitar ser descubierto</li>
                  </ul>
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <h3 style={{ fontSize: '1.3em', marginBottom: '10px', color: '#4ade80' }}>
                  💡 Consejos
                </h3>
                <ul style={{ paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px' }}>Las pistas deben ser relacionadas pero no obvias</li>
                  <li style={{ marginBottom: '8px' }}>Observa las reacciones de los demás jugadores</li>
                  <li style={{ marginBottom: '8px' }}>El impostor debe ser sutil para no ser descubierto</li>
                  <li style={{ marginBottom: '8px' }}>Puedes usar flechas del teclado o deslizar para cambiar de jugador</li>
                </ul>
              </div>

              <div style={{ 
                background: 'rgba(76, 222, 128, 0.2)', 
                padding: '15px', 
                borderRadius: '10px',
                border: '2px solid rgba(76, 222, 128, 0.4)'
              }}>
                <p style={{ margin: 0, fontSize: '0.95em', fontStyle: 'italic' }}>
                  💬 <strong>Tip:</strong> Mantén presionada la tarjeta para ver tu palabra o identidad. Suelta para ocultarla y que otros no la vean.
                </p>
              </div>
            </div>

            <button
              onClick={() => setMostrarAyuda(false)}
              style={{
                marginTop: '25px',
                width: '100%',
                padding: '15px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                color: 'var(--color-text)',
                fontSize: '1em',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }}
            >
              Entendido ✓
            </button>
          </div>
        </div>
      )}

      {/* Modal de configuración */}
      {mostrarConfiguracion && (
        <div 
          className="config-modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'stretch',
            zIndex: 2000,
            padding: esMovil ? '0' : '20px',
            overflowY: 'auto'
          }}
          onClick={() => setMostrarConfiguracion(false)}
        >
          <div 
            className="config-modal-inner"
            style={{
              background: esMovil ? 'transparent' : 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)',
              borderRadius: esMovil ? '0' : '20px',
              padding: esMovil ? '20px' : '30px',
              maxWidth: esMovil ? '100%' : '500px',
              width: '100%',
              height: esMovil ? '100%' : 'auto',
              maxHeight: esMovil ? '100%' : '90vh',
              overflowY: 'auto',
              boxShadow: esMovil ? 'none' : '0 8px 32px rgba(0, 0, 0, 0.5)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de cerrar */}
            <button
              onClick={() => setMostrarConfiguracion(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                color: 'var(--color-text)',
                fontSize: '1.5em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s'
              }}
            >
              ×
            </button>

            <h2 style={{ 
              fontSize: '1.8em', 
              marginBottom: '25px', 
              color: 'var(--color-text)',
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
            }}>
              ⚙️ Configuración
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {/* Tema claro / oscuro */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.95em', color: 'var(--color-text)', fontWeight: '600' }}>Apariencia</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setTema('dark')}
                    aria-pressed={tema === 'dark'}
                    aria-label="Usar tema oscuro"
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      background: tema === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                      border: '2px solid ' + (tema === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.3)'),
                      borderRadius: '12px',
                      color: 'var(--color-text)',
                      fontSize: '1em',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    🌙 Oscuro
                  </button>
                  <button
                    type="button"
                    onClick={() => setTema('light')}
                    aria-pressed={tema === 'light'}
                    aria-label="Usar tema claro"
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      background: tema === 'light' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                      border: '2px solid ' + (tema === 'light' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.3)'),
                      borderRadius: '12px',
                      color: 'var(--color-text)',
                      fontSize: '1em',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    ☀️ Claro
                  </button>
                </div>
              </div>

              {/* Acerca de / Info técnica */}
              <button
                onClick={() => {
                  const esApp = window.Capacitor || window.cordova;
                  const esOnline = window.location.href.includes('github.io');
                  showModal({
                    title: 'ℹ️ Acerca de',
                    content: (
                      <p>
                        <strong>Versión:</strong> {import.meta.env.VITE_APP_VERSION || '1.1.0'}<br />
                        <strong>Tipo:</strong> {esApp ? 'App instalada' : 'Navegador'}<br />
                        <strong>Conexión:</strong> {esOnline ? 'Online' : 'Local'}<br /><br />
                        El Impostor Dominicano — Juego con palabras dominicanas.<br />
                        © 2026 Brayan Camacho.
                      </p>
                    )
                  });
                }}
                style={{
                  padding: '15px 20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  color: 'var(--color-text)',
                  fontSize: '1em',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <span style={{ fontSize: '1.5em' }}>ℹ️</span>
                <span>Acerca de</span>
              </button>

              {/* Cambiar idioma */}
              <button
                onClick={() => {
                  showToast('Función de cambio de idioma próximamente', 'info');
                }}
                style={{
                  padding: '15px 20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  color: 'var(--color-text)',
                  fontSize: '1em',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                <span style={{ fontSize: '1.5em' }}>🌐</span>
                <span>Cambiar Idioma</span>
              </button>

              {/* Compartir con amigos */}
              <button
                onClick={async () => {
                  const shareData = {
                    title: 'El Impostor Dominicano',
                    text: '¡Juega El Impostor Dominicano con palabras dominicanas! 🇩🇴',
                    url: window.location.href
                  };
                  
                  try {
                    if (navigator.share) {
                      await navigator.share(shareData);
                    } else {
                      // Fallback: copiar al portapapeles
                      await navigator.clipboard.writeText(shareData.url);
                      showToast('✓ ¡Enlace copiado! Compártelo con tus amigos.', 'success', 4000);
                    }
                  } catch (error) {
                    // Si el usuario cancela, no hacer nada
                    if (error.name !== 'AbortError') {
                      // Fallback: copiar al portapapeles
                      try {
                        await navigator.clipboard.writeText(shareData.url);
                        showToast('✓ ¡Enlace copiado! Compártelo con tus amigos.', 'success', 4000);
                      } catch (err) {
                        showModal({
                          title: 'Compartir',
                          content: <p>Comparte este enlace: {shareData.url}</p>
                        });
                      }
                    }
                  }
                }}
                style={{
                  padding: '15px 20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  color: 'var(--color-text)',
                  fontSize: '1em',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                <span style={{ fontSize: '1.5em' }}>📤</span>
                <span>Compartir con Amigos</span>
              </button>

              {/* Términos de uso */}
              <button
                onClick={() => {
                  showModal({
                    title: '📄 Términos de Uso',
                    content: (
                      <p>
                        Al usar esta aplicación, aceptas los términos y condiciones de uso. El juego es para entretenimiento y uso personal. Todos los derechos reservados.
                        <br /><br />© 2026 Brayan Camacho. Todos los derechos reservados.
                      </p>
                    )
                  });
                }}
                style={{
                  padding: '15px 20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  color: 'var(--color-text)',
                  fontSize: '1em',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                <span style={{ fontSize: '1.5em' }}>📄</span>
                <span>Términos de Uso</span>
              </button>

              {/* Privacidad */}
              <button
                onClick={() => {
                  showModal({
                    title: '🔒 Política de Privacidad',
                    content: (
                      <p>
                        Esta aplicación no recopila ni almacena información personal de los usuarios. Todos los datos del juego se procesan localmente en tu dispositivo. No se comparte información con terceros.
                        <br /><br />Para más información, contacta a: <a href="mailto:brayanfranciscodc@gmail.com" style={{ color: '#a78bfa' }}>brayanfranciscodc@gmail.com</a>
                      </p>
                    )
                  });
                }}
                style={{
                  padding: '15px 20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  color: 'var(--color-text)',
                  fontSize: '1em',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                <span style={{ fontSize: '1.5em' }}>🔒</span>
                <span>Privacidad</span>
              </button>
            </div>

            {/* Device ID y correo */}
            <div style={{ 
              marginTop: '30px', 
              paddingTop: '20px', 
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: '0.7em', 
                color: '#999', 
                marginBottom: '8px',
                wordBreak: 'break-all'
              }}>
                Device ID: {deviceId}
              </div>
              <div style={{ 
                fontSize: '0.75em', 
                color: '#999'
              }}>
                <a 
                  href="mailto:brayanfranciscodc@gmail.com"
                  style={{ 
                    color: '#999', 
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#fff';
                    e.target.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#999';
                    e.target.style.textDecoration = 'none';
                  }}
                >
                  brayanfranciscodc@gmail.com
                </a>
              </div>
            </div>

            <button
              onClick={() => setMostrarConfiguracion(false)}
              style={{
                marginTop: '25px',
                width: '100%',
                padding: '15px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                color: 'var(--color-text)',
                fontSize: '1em',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className="logo">
        <h1>🇩🇴 El Impostor Dominicano</h1>
        {/* Indicador de versión - siempre visible */}
        <div style={{
          marginTop: '8px',
          marginBottom: '16px',
          padding: '8px 14px',
          background: 'rgba(74, 222, 128, 0.12)',
          border: '1px solid rgba(74, 222, 128, 0.25)',
          borderRadius: '10px',
          color: '#4ade80',
          fontSize: '0.8em',
          fontWeight: '400',
          letterSpacing: '0.3px',
          display: 'inline-block',
          boxShadow: '0 1px 6px rgba(74, 222, 128, 0.15)',
          minWidth: '180px',
          textAlign: 'center'
        }}>
          v{import.meta.env.VITE_APP_VERSION || '1.1.0'} • {window.Capacitor || window.cordova ? 'App instalada' : 'Navegador'}
          {verificandoActualizacion && (window.Capacitor || window.cordova) && (
            <span style={{ marginLeft: '8px', opacity: 0.8 }} title="Buscando actualizaciones...">⟳</span>
          )}
        </div>
        <h2>
          LO' MENORE' Y SU LIO
        </h2>
        <p className="subtitle" style={{ 
          color: '#ffd700',
          fontWeight: '400',
          fontSize: '0.9em',
          marginTop: '8px',
          opacity: 0.9
        }}>✨ ¡Encuentra al impostor o sé el mejor troll! ✨</p>
      </div>
      
      <div className="configuracion">
        <div className="input-group">
          <label htmlFor="categorias-select" style={{ 
            marginBottom: '8px', 
            display: 'block', 
            fontSize: '0.95em', 
            fontWeight: '500',
            color: 'var(--color-text)'
          }}>
            🎯 Selecciona Categorías (puedes elegir varias):
          </label>
          
          {/* Dropdown personalizado de categorías */}
          <div className="dropdown-categorias-container" style={{ position: 'relative', width: '100%', marginBottom: '12px' }}>
            <button
              type="button"
              onClick={() => setDropdownCategoriasAbierto(!dropdownCategoriasAbierto)}
              style={{
                width: '100%',
                padding: '16px 20px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--color-text)',
                fontSize: '1.1em',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                /* backdrop-filter removido para mejor rendimiento */
                boxShadow: dropdownCategoriasAbierto 
                  ? '0 8px 24px rgba(102, 126, 234, 0.3)' 
                  : '0 4px 12px rgba(0, 0, 0, 0.15)',
                borderColor: dropdownCategoriasAbierto 
                  ? 'rgba(102, 126, 234, 0.6)' 
                  : 'rgba(255, 255, 255, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (window.innerWidth > 768) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.borderColor = 'rgba(102, 126, 234, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!dropdownCategoriasAbierto) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }
              }}
            >
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                flex: 1,
                overflow: 'hidden'
              }}>
                {categoriasSeleccionadas.length === 0 ? (
                  <span style={{ opacity: 0.7 }}>Selecciona categorías...</span>
                ) : categoriasSeleccionadas.length === 1 ? (
                  <span>
                    {todasLasCategorias.find(c => c.value === categoriasSeleccionadas[0])?.label || '1 categoría'}
                  </span>
                ) : (
                  <span>
                    {categoriasSeleccionadas.length} categorías seleccionadas
                  </span>
                )}
              </span>
              <span style={{ 
                fontSize: '1.2em',
                transform: dropdownCategoriasAbierto ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }}>
                ▼
              </span>
            </button>

            {/* Menú desplegable */}
            {dropdownCategoriasAbierto && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '8px',
                  background: 'rgba(30, 30, 50, 0.98)',
                  /* backdrop-filter removido para mejor rendimiento */
                  border: '2px solid rgba(102, 126, 234, 0.4)',
                  borderRadius: '12px',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(102, 126, 234, 0.2)',
                  zIndex: 1000,
                  maxHeight: '400px',
                  overflowY: 'auto',
                  animation: 'fadeIn 0.2s ease-in'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {todasLasCategorias.map(cat => {
                  const estaSeleccionada = categoriasSeleccionadas.includes(cat.value);
                  const iconos = {
                    'comida': '🍽️',
                    'historia': '📚',
                    'lugares': '🗺️',
                    'personajes': '⭐',
                    'artistas': '🎨',
                    'musica': '🎵',
                    'deportes': '⚾',
                    'festividades': '🎉',
                    'tradiciones': '🎭'
                  };
                  return (
                    <div
                      key={cat.value}
                      onClick={() => {
                        if (estaSeleccionada) {
                          if (categoriasSeleccionadas.length === 1) return;
                          setCategoriasSeleccionadas(prev => prev.filter(c => c !== cat.value));
                        } else {
                          setCategoriasSeleccionadas(prev => [...prev, cat.value]);
                        }
                      }}
                      style={{
                        padding: '16px 20px',
                        cursor: categoriasSeleccionadas.length === 1 && estaSeleccionada ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.2s ease',
                        background: estaSeleccionada 
                          ? 'linear-gradient(90deg, rgba(102, 126, 234, 0.2) 0%, transparent 100%)' 
                          : 'transparent',
                        opacity: categoriasSeleccionadas.length === 1 && estaSeleccionada ? 0.6 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (window.innerWidth > 768 && !(categoriasSeleccionadas.length === 1 && estaSeleccionada)) {
                          e.currentTarget.style.background = 'linear-gradient(90deg, rgba(102, 126, 234, 0.15) 0%, transparent 100%)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = estaSeleccionada 
                          ? 'linear-gradient(90deg, rgba(102, 126, 234, 0.2) 0%, transparent 100%)' 
                          : 'transparent';
                      }}
                    >
                      <span style={{ 
                        fontSize: '1.8em',
                        minWidth: '40px',
                        textAlign: 'center'
                      }}>
                        {iconos[cat.value] || '📌'}
                      </span>
                      <span style={{ 
                        flex: 1,
                        fontSize: '1em',
                        fontWeight: estaSeleccionada ? '600' : '400',
                        color: estaSeleccionada ? '#a78bfa' : '#fff'
                      }}>
                        {cat.label}
                      </span>
                      {estaSeleccionada && (
                        <span style={{ 
                          fontSize: '1.3em',
                          color: '#4ade80',
                          fontWeight: 'bold'
                        }}>
                          ✓
                        </span>
                      )}
                    </div>
                  );
                })}
                
                {/* Botones de acción rápida */}
                <div style={{
                  padding: '12px',
                  borderTop: '2px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  gap: '8px'
                }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      seleccionarTodas();
                    }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: 'linear-gradient(135deg, rgba(76, 222, 128, 0.2) 0%, rgba(34, 197, 94, 0.2) 100%)',
                      border: '1px solid rgba(76, 222, 128, 0.4)',
                      borderRadius: '8px',
                      color: '#4ade80',
                      fontSize: '0.9em',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, rgba(76, 222, 128, 0.3) 0%, rgba(34, 197, 94, 0.3) 100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, rgba(76, 222, 128, 0.2) 0%, rgba(34, 197, 94, 0.2) 100%)';
                    }}
                  >
                    ✓ Todas
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deseleccionarTodas();
                    }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: 'linear-gradient(135deg, rgba(245, 87, 108, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)',
                      border: '1px solid rgba(245, 87, 108, 0.4)',
                      borderRadius: '8px',
                      color: '#f5576c',
                      fontSize: '0.9em',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, rgba(245, 87, 108, 0.3) 0%, rgba(220, 38, 38, 0.3) 100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, rgba(245, 87, 108, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)';
                    }}
                  >
                    ✗ Ninguna
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Resumen de categorías seleccionadas */}
          <div style={{ 
            fontSize: '0.95em', 
            marginTop: '12px',
            padding: '14px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
            borderRadius: '10px',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            textAlign: 'center',
            fontWeight: '500',
            color: 'var(--color-text)'
          }}>
            <span style={{ color: '#a78bfa', marginRight: '6px' }}>📊</span>
            <strong style={{ color: '#667eea' }}>{categoriasSeleccionadas.length}</strong>
            <span style={{ marginLeft: '4px' }}>categoría{categoriasSeleccionadas.length !== 1 ? 's' : ''} seleccionada{categoriasSeleccionadas.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Selector de número de impostores (solo en modo normal o cuando modos aleatorios está activo) */}
        {(!modosDiabolicos || modosAleatorios) && (
          <div className="input-group">
            <label htmlFor="num-impostores" style={{ marginBottom: '10px', display: 'block', fontSize: '1.1em', fontWeight: '600' }}>
              🎭 Número de Impostores {modosAleatorios ? '(se aplica solo si sale Modo Normal)' : '(Modo Normal)'}:
            </label>
            <select
              id="num-impostores"
              value={Math.min(numImpostores, maxImpostores)}
              onChange={(e) => {
                const nuevoValor = parseInt(e.target.value, 10);
                setNumImpostores(nuevoValor);
              }}
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--color-text)',
                fontSize: '1.1em',
                fontWeight: '500',
                cursor: 'pointer',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fff' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 15px center',
                backgroundSize: '12px',
                paddingRight: '40px'
              }}
            >
              {Array.from({ length: maxImpostores }, (_, i) => i + 1).map(num => (
                <option 
                  key={num} 
                  value={num}
                  style={{ background: '#1e3c72', color: 'var(--color-text)' }}
                >
                  {num} {num === 1 ? 'Impostor' : 'Impostores'}
                </option>
              ))}
            </select>
            <p style={{ fontSize: '0.85em', opacity: 0.8, marginTop: '8px', fontStyle: 'italic' }}>
              {modosAleatorios 
                ? 'Se aplicará solo si el modo aleatorio selecciona Modo Normal. Si selecciona un modo diabólico, se usará 1 impostor.'
                : `Máximo: ${maxImpostores} impostores (basado en número de jugadores)`
              }
            </p>
          </div>
        )}

        <div className="input-group">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            cursor: 'pointer',
            padding: '15px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s',
            marginBottom: '15px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <span style={{ fontSize: '1.5em' }}>🎲</span>
              <div>
                <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#9d4edd', marginBottom: '5px' }}>
                  MODOS ALEATORIOS
                </div>
                <div style={{ fontSize: '0.85em', opacity: 0.8 }}>
                  Selecciona un modo diabólico al azar (o modo normal) cada vez que inicies
                </div>
              </div>
            </div>
            <div 
              onClick={(e) => {
                e.stopPropagation();
                if (!modosAleatorios) {
                  setModosAleatorios(true);
                  setModosDiabolicos(false);
                  setModoDiabolicoSeleccionado(null);
                } else {
                  setModosAleatorios(false);
                }
              }}
              style={{
                width: '60px',
                height: '30px',
                borderRadius: '15px',
                background: modosAleatorios ? 'linear-gradient(135deg, #9d4edd 0%, #7b2cbf 100%)' : 'rgba(255, 255, 255, 0.2)',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: '2px solid',
                borderColor: modosAleatorios ? '#9d4edd' : 'rgba(255, 255, 255, 0.3)',
                flexShrink: 0
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: '1px',
                left: modosAleatorios ? '31px' : '1px',
                transition: 'all 0.3s',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
              }} />
            </div>
          </div>
        </div>

        <div className="input-group">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            cursor: modosAleatorios ? 'not-allowed' : 'pointer',
            padding: '15px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s',
            opacity: modosAleatorios ? 0.5 : 1,
            marginBottom: '15px'
          }}
          onMouseEnter={(e) => {
            if (!modosAleatorios) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <span style={{ fontSize: '1.5em' }}>😈</span>
              <div>
                <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#f5576c' }}>
                  MODOS DIABÓLICOS
                </div>
                <div style={{ fontSize: '0.85em', opacity: 0.8 }}>
                  {modosAleatorios 
                    ? 'Desactiva "Modos Aleatorios" para seleccionar un modo manualmente'
                    : 'Desactiva "Modos Aleatorios" para seleccionar un modo manualmente'}
                </div>
              </div>
            </div>
            <div 
              onClick={(e) => {
                e.stopPropagation();
                if (!modosAleatorios) {
                  if (modosDiabolicos) {
                    setModosDiabolicos(false);
                    setModoDiabolicoSeleccionado(null);
                  } else {
                    setModosDiabolicos(true);
                    setModosAleatorios(false);
                  }
                }
              }}
              style={{
                width: '60px',
                height: '30px',
                borderRadius: '15px',
                background: (modosDiabolicos && !modosAleatorios) ? 'linear-gradient(135deg, #f5576c 0%, #d32f2f 100%)' : 'rgba(255, 255, 255, 0.2)',
                position: 'relative',
                cursor: modosAleatorios ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                border: '2px solid',
                borderColor: (modosDiabolicos && !modosAleatorios) ? '#f5576c' : 'rgba(255, 255, 255, 0.3)',
                flexShrink: 0,
                opacity: modosAleatorios ? 0.5 : 1
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: '1px',
                left: (modosDiabolicos && !modosAleatorios) ? '31px' : '1px',
                transition: 'all 0.3s',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
              }} />
            </div>
          </div>
        </div>

        {modosDiabolicos && (
          <div className="input-group" style={{ 
            background: 'rgba(245, 87, 108, 0.1)', 
            padding: '20px', 
            borderRadius: '12px',
            border: '2px solid rgba(245, 87, 108, 0.3)',
            marginTop: '15px'
          }}>
            <label style={{ 
              marginBottom: '20px', 
              display: 'block', 
              fontSize: '1.2em',
              fontWeight: 'bold',
              color: '#f5576c'
            }}>
              Selecciona un Modo Diabólico:
            </label>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '12px',
              maxHeight: '500px',
              overflowY: 'auto',
              paddingRight: '5px'
            }}>
              <button
                type="button"
                title="¿Qué hace? Un jugador tiene la palabra secreta, los demás son impostores con pistas falsas. Solo uno puede ganar."
                onClick={() => setModoDiabolicoSeleccionado('todos-impostores')}
                style={{ 
                  textAlign: 'left',
                  padding: '18px',
                  background: modoDiabolicoSeleccionado === 'todos-impostores' 
                    ? 'linear-gradient(135deg, rgba(245, 87, 108, 0.3) 0%, rgba(245, 87, 108, 0.2) 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: `2px solid ${modoDiabolicoSeleccionado === 'todos-impostores' ? '#f5576c' : 'rgba(255, 255, 255, 0.2)'}`,
                  borderRadius: '12px',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (modoDiabolicoSeleccionado !== 'todos-impostores') {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (modoDiabolicoSeleccionado !== 'todos-impostores') {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.1em', fontWeight: 'bold' }}>😈 Todos Impostores Menos Uno</span>
                  {modoDiabolicoSeleccionado === 'todos-impostores' && <span style={{ fontSize: '1.2em' }}>✓</span>}
                </div>
                <div style={{ fontSize: '0.9em', opacity: 0.85, lineHeight: '1.4' }}>
                  Un jugador tiene la palabra, todos los demás son impostores con pistas diferentes
                </div>
              </button>

              <button
                type="button"
                title="¿Qué hace? Todos son impostores. Nadie tiene la palabra real. ¡Caos total!"
                onClick={() => setModoDiabolicoSeleccionado('todos-impostores-total')}
                style={{ 
                  textAlign: 'left',
                  padding: '18px',
                  background: modoDiabolicoSeleccionado === 'todos-impostores-total' 
                    ? 'linear-gradient(135deg, rgba(245, 87, 108, 0.3) 0%, rgba(245, 87, 108, 0.2) 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: `2px solid ${modoDiabolicoSeleccionado === 'todos-impostores-total' ? '#f5576c' : 'rgba(255, 255, 255, 0.2)'}`,
                  borderRadius: '12px',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (modoDiabolicoSeleccionado !== 'todos-impostores-total') {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (modoDiabolicoSeleccionado !== 'todos-impostores-total') {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.1em', fontWeight: 'bold' }}>🔥 Todos Impostores</span>
                  {modoDiabolicoSeleccionado === 'todos-impostores-total' && <span style={{ fontSize: '1.2em' }}>✓</span>}
                </div>
                <div style={{ fontSize: '0.9em', opacity: 0.85, lineHeight: '1.4' }}>
                  Todos son impostores, nadie tiene la palabra real. ¡Caos total!
                </div>
              </button>

              <button
                type="button"
                title="¿Qué hace? Dos grupos tienen palabras diferentes. ¡Nadie sabe que hay dos palabras secretas!"
                onClick={() => setModoDiabolicoSeleccionado('dos-palabras')}
                style={{ 
                  textAlign: 'left',
                  padding: '18px',
                  background: modoDiabolicoSeleccionado === 'dos-palabras' 
                    ? 'linear-gradient(135deg, rgba(245, 87, 108, 0.3) 0%, rgba(245, 87, 108, 0.2) 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: `2px solid ${modoDiabolicoSeleccionado === 'dos-palabras' ? '#f5576c' : 'rgba(255, 255, 255, 0.2)'}`,
                  borderRadius: '12px',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (modoDiabolicoSeleccionado !== 'dos-palabras') {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (modoDiabolicoSeleccionado !== 'dos-palabras') {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.1em', fontWeight: 'bold' }}>⚔️ Dos Palabras Secretas</span>
                  {modoDiabolicoSeleccionado === 'dos-palabras' && <span style={{ fontSize: '1.2em' }}>✓</span>}
                </div>
                <div style={{ fontSize: '0.9em', opacity: 0.85, lineHeight: '1.4' }}>
                  Dos grupos con palabras diferentes. ¡Nadie sabe que hay dos palabras!
                </div>
              </button>

              <button
                type="button"
                title="¿Qué hace? Cada uno tiene una palabra diferente. Solo una es la correcta. ¡Descubre cuál!"
                onClick={() => setModoDiabolicoSeleccionado('palabras-falsas')}
                style={{ 
                  textAlign: 'left',
                  padding: '18px',
                  background: modoDiabolicoSeleccionado === 'palabras-falsas' 
                    ? 'linear-gradient(135deg, rgba(245, 87, 108, 0.3) 0%, rgba(245, 87, 108, 0.2) 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: `2px solid ${modoDiabolicoSeleccionado === 'palabras-falsas' ? '#f5576c' : 'rgba(255, 255, 255, 0.2)'}`,
                  borderRadius: '12px',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (modoDiabolicoSeleccionado !== 'palabras-falsas') {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (modoDiabolicoSeleccionado !== 'palabras-falsas') {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.1em', fontWeight: 'bold' }}>🎭 Palabras Falsas</span>
                  {modoDiabolicoSeleccionado === 'palabras-falsas' && <span style={{ fontSize: '1.2em' }}>✓</span>}
                </div>
                <div style={{ fontSize: '0.9em', opacity: 0.85, lineHeight: '1.4' }}>
                  Todos tienen palabras diferentes, solo una es la "correcta"
                </div>
              </button>

              <button
                type="button"
                title="¿Qué hace? Varios impostores (30-50% del grupo) con pistas diferentes. ¡Más difícil de descubrir!"
                onClick={() => setModoDiabolicoSeleccionado('multiples-impostores')}
                style={{ 
                  textAlign: 'left',
                  padding: '18px',
                  background: modoDiabolicoSeleccionado === 'multiples-impostores' 
                    ? 'linear-gradient(135deg, rgba(245, 87, 108, 0.3) 0%, rgba(245, 87, 108, 0.2) 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: `2px solid ${modoDiabolicoSeleccionado === 'multiples-impostores' ? '#f5576c' : 'rgba(255, 255, 255, 0.2)'}`,
                  borderRadius: '12px',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (modoDiabolicoSeleccionado !== 'multiples-impostores') {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (modoDiabolicoSeleccionado !== 'multiples-impostores') {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.1em', fontWeight: 'bold' }}>👥 Múltiples Impostores</span>
                  {modoDiabolicoSeleccionado === 'multiples-impostores' && <span style={{ fontSize: '1.2em' }}>✓</span>}
                </div>
                <div style={{ fontSize: '0.9em', opacity: 0.85, lineHeight: '1.4' }}>
                  Varios impostores (no todos) con pistas diferentes
                </div>
              </button>

              <button
                type="button"
                title="¿Qué hace? El impostor no recibe ninguna pista. Solo sabe que es el impostor. ¡Mucho más difícil!"
                onClick={() => setModoDiabolicoSeleccionado('sin-pistas')}
                style={{ 
                  textAlign: 'left',
                  padding: '18px',
                  background: modoDiabolicoSeleccionado === 'sin-pistas' 
                    ? 'linear-gradient(135deg, rgba(245, 87, 108, 0.3) 0%, rgba(245, 87, 108, 0.2) 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: `2px solid ${modoDiabolicoSeleccionado === 'sin-pistas' ? '#f5576c' : 'rgba(255, 255, 255, 0.2)'}`,
                  borderRadius: '12px',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (modoDiabolicoSeleccionado !== 'sin-pistas') {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (modoDiabolicoSeleccionado !== 'sin-pistas') {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.1em', fontWeight: 'bold' }}>🚫 Sin Pistas</span>
                  {modoDiabolicoSeleccionado === 'sin-pistas' && <span style={{ fontSize: '1.2em' }}>✓</span>}
                </div>
                <div style={{ fontSize: '0.9em', opacity: 0.85, lineHeight: '1.4' }}>
                  Los impostores no reciben pistas, solo saben que son impostores
                </div>
              </button>

              <button
                type="button"
                title="¿Qué hace? Algunos tienen la palabra real, otros son impostores con pistas falsas. ¡Confusión total!"
                onClick={() => setModoDiabolicoSeleccionado('pistas-mezcladas')}
                style={{ 
                  textAlign: 'left',
                  padding: '18px',
                  background: modoDiabolicoSeleccionado === 'pistas-mezcladas' 
                    ? 'linear-gradient(135deg, rgba(245, 87, 108, 0.3) 0%, rgba(245, 87, 108, 0.2) 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: `2px solid ${modoDiabolicoSeleccionado === 'pistas-mezcladas' ? '#f5576c' : 'rgba(255, 255, 255, 0.2)'}`,
                  borderRadius: '12px',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (modoDiabolicoSeleccionado !== 'pistas-mezcladas') {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (modoDiabolicoSeleccionado !== 'pistas-mezcladas') {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.1em', fontWeight: 'bold' }}>🎲 Pistas Mezcladas</span>
                  {modoDiabolicoSeleccionado === 'pistas-mezcladas' && <span style={{ fontSize: '1.2em' }}>✓</span>}
                </div>
                <div style={{ fontSize: '0.9em', opacity: 0.85, lineHeight: '1.4' }}>
                  Algunos tienen la palabra real, otros son impostores con pistas falsas. ¡Confusión total!
                </div>
              </button>

              <button
                type="button"
                title="¿Qué hace? Todos tienen la misma palabra, pero algunos creen ser impostores. ¡Psicología pura!"
                onClick={() => setModoDiabolicoSeleccionado('palabra-compartida')}
                style={{ 
                  textAlign: 'left',
                  padding: '18px',
                  background: modoDiabolicoSeleccionado === 'palabra-compartida' 
                    ? 'linear-gradient(135deg, rgba(245, 87, 108, 0.3) 0%, rgba(245, 87, 108, 0.2) 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: `2px solid ${modoDiabolicoSeleccionado === 'palabra-compartida' ? '#f5576c' : 'rgba(255, 255, 255, 0.2)'}`,
                  borderRadius: '12px',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (modoDiabolicoSeleccionado !== 'palabra-compartida') {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (modoDiabolicoSeleccionado !== 'palabra-compartida') {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.1em', fontWeight: 'bold' }}>🤝 Palabra Compartida</span>
                  {modoDiabolicoSeleccionado === 'palabra-compartida' && <span style={{ fontSize: '1.2em' }}>✓</span>}
                </div>
                <div style={{ fontSize: '0.9em', opacity: 0.85, lineHeight: '1.4' }}>
                  Todos tienen la misma palabra, pero algunos creen ser impostores
                </div>
              </button>
            </div>
          </div>
        )}
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '15px',
          width: '100%'
        }}>
          <button 
            onClick={() => setPantalla('premium')}
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              border: '3px solid #000',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(251, 191, 36, 0.5)',
              transition: 'all 0.3s',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              if (window.innerWidth > 768) {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.boxShadow = '0 6px 20px rgba(251, 191, 36, 0.7)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 15px rgba(251, 191, 36, 0.5)';
            }}
            onTouchStart={(e) => {
              e.target.style.transform = 'scale(0.95)';
            }}
            onTouchEnd={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
            title="Acceso Premium"
            aria-label="Ir a acceso Premium"
          >
            <span style={{ fontSize: '2em' }}>👑</span>
          </button>
          
          <button 
            className="btn btn-primary" 
            onClick={handleIniciar}
            style={{ flex: 1 }}
          >
            ¡Empezar Juego!
          </button>
        </div>
        
        <Footer />
      </div>
    </div>
  );
}

export default PantallaInicio;
