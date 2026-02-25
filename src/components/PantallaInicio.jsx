import { useState, useEffect, useRef } from 'react';
import { useNotificaciones } from '../context/NotificacionesContext';
import { useTema } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getApiBase } from '../utils/stripePremium';
import { registrarSesion } from '../utils/sessionRegistry';
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
  const { user, loading: authLoading, signInWithGoogle, signOut, tieneAuth } = useAuth();
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState(
    estadoJuego.categorias || ['comida']
  );
  // Los modos NO se activan automáticamente, deben ser seleccionados manualmente
  const [modosDiabolicos, setModosDiabolicos] = useState(false);
  const [modoDiabolicoSeleccionado, setModoDiabolicoSeleccionado] = useState(null);
  const [modosAleatorios, setModosAleatorios] = useState(false);
  const [pistaAlImpostor, setPistaAlImpostor] = useState(estadoJuego.mostrarPistaImpostor !== false);
  const [mostrarAyuda, setMostrarAyuda] = useState(false);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const cerrarConfigRef = useRef(0);
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

  // Registrar sesión en Firestore al estar en inicio (para que el admin vea este dispositivo)
  useEffect(() => {
    if (!deviceId) return;
    let cancelled = false;
    (async () => {
      try {
        let ip = '';
        if (getApiBase()) {
          const res = await fetch(`${getApiBase()}/my-ip`, { cache: 'no-store' });
          const data = await res.json().catch(() => ({}));
          ip = data?.ip ? String(data.ip).trim() : '';
        }
        if (!cancelled) await registrarSesion(deviceId, ip);
      } catch (_) {}
    })();
    return () => { cancelled = true; };
  }, [deviceId]);
  
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
      mostrarPistaImpostor: modoFinal === null ? pistaAlImpostor : true
    });
    
    setPantalla('jugadores');
  };

  return (
    <div className="pantalla activa" style={{ position: 'relative' }}>
      {/* Barra de cabecera con botones a los lados */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        minHeight: '44px',
        gap: '8px'
      }}>
        <button
          onClick={() => setMostrarAyuda(true)}
          style={{
            background: 'rgba(102, 126, 234, 0.15)',
            border: '1.5px solid rgba(102, 126, 234, 0.4)',
            borderRadius: '12px',
            padding: '0',
            width: '44px',
            height: '44px',
            minWidth: '44px',
            color: 'var(--color-text)',
            fontSize: '1.3em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            flexShrink: 0
          }}
          onMouseEnter={(e) => { if (window.innerWidth > 768) e.currentTarget.style.background = 'rgba(102,126,234,0.28)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(102,126,234,0.15)'; }}
          title="¿Cómo se juega?"
          aria-label="Abrir ayuda y cómo se juega"
        >
          ❓
        </button>

        <button
          onClick={() => {
            if (Date.now() - cerrarConfigRef.current < 400) return;
            setMostrarConfiguracion(true);
          }}
          style={{
            background: 'rgba(255, 165, 0, 0.12)',
            border: '1.5px solid rgba(255, 165, 0, 0.35)',
            borderRadius: '12px',
            padding: '0',
            width: '44px',
            height: '44px',
            minWidth: '44px',
            color: 'var(--color-text)',
            fontSize: '1.3em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            flexShrink: 0
          }}
          onMouseEnter={(e) => { if (window.innerWidth > 768) e.currentTarget.style.background = 'rgba(255,165,0,0.25)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,165,0,0.12)'; }}
          title="Configuración"
          aria-label="Abrir configuración"
        >
          ⚙️
        </button>
      </div>

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
              type="button"
              aria-label="Cerrar"
              onClick={() => setMostrarAyuda(false)}
              onPointerDown={(e) => { e.preventDefault(); setMostrarAyuda(false); }}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                minWidth: 44,
                minHeight: 44,
                width: 44,
                height: 44,
                color: 'var(--color-text)',
                fontSize: '1.5em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
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
            background: 'rgba(15, 15, 30, 0.88)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: esMovil ? 0 : 24,
            overflowY: 'auto'
          }}
          onClick={() => setMostrarConfiguracion(false)}
        >
          <div
            className="config-modal-inner"
            style={{
              background: 'var(--color-surface)',
              borderRadius: esMovil ? 0 : 24,
              width: '100%',
              maxWidth: 420,
              maxHeight: esMovil ? '100%' : '88vh',
              overflowY: 'auto',
              boxShadow: esMovil ? 'none' : '0 32px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)',
              position: 'relative',
              border: '1px solid var(--color-surface-border)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="config-modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 className="config-modal-title">Configuración</h2>
              <button
                type="button"
                aria-label="Cerrar"
                className="config-modal-close"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  cerrarConfigRef.current = Date.now();
                  setMostrarConfiguracion(false);
                }}
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  cerrarConfigRef.current = Date.now();
                  setMostrarConfiguracion(false);
                }}
                style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
              >
                ×
              </button>
            </div>

            <div className="config-modal-body">
              <div style={{ marginBottom: 28 }}>
                <div className="config-section-title">Apariencia</div>
                <div className="config-theme-pills">
                  <button
                    type="button"
                    onClick={() => setTema('dark')}
                    aria-pressed={tema === 'dark'}
                    aria-label="Tema oscuro"
                  >
                    🌙 Oscuro
                  </button>
                  <button
                    type="button"
                    onClick={() => setTema('light')}
                    aria-pressed={tema === 'light'}
                    aria-label="Tema claro"
                  >
                    ☀️ Claro
                  </button>
                </div>
              </div>

              {tieneAuth && (
                <div style={{ marginBottom: 28 }}>
                  <div className="config-section-title">Cuenta</div>
                  {authLoading ? (
                    <div style={{ padding: 20, background: 'var(--color-border)', borderRadius: 14, color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Cargando…</div>
                  ) : user ? (
                    <div className="config-account-card">
                      {user.photoURL && <img src={user.photoURL} alt="" referrerPolicy="no-referrer" />}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="config-account-name">{user.displayName || 'Usuario'}</div>
                        {user.email && <div className="config-account-email">{user.email}</div>}
                      </div>
                      <button type="button" className="config-signout" onClick={() => signOut()}>
                        Cerrar sesión
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="config-google-btn"
                      onClick={async () => {
                        try {
                          await signInWithGoogle();
                          setMostrarConfiguracion(false);
                        } catch (e) {
                          const msg = e?.message || e?.code || 'Error al iniciar sesión';
                          showToast(msg, 'error', 6000);
                        }
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Iniciar sesión con Google
                    </button>
                  )}
                </div>
              )}

              <div style={{ marginBottom: 28 }}>
                <div className="config-section-title">Información</div>
                <button type="button" className="config-row" onClick={() => { const esApp = window.Capacitor || window.cordova; const esOnline = window.location.href.includes('github.io'); showModal({ title: 'Acerca de', content: (<p style={{ margin: 0, lineHeight: 1.6 }}><strong>Versión:</strong> {import.meta.env.VITE_APP_VERSION || '1.1.0'}<br /><strong>Tipo:</strong> {esApp ? 'App instalada' : 'Navegador'}<br /><strong>Conexión:</strong> {esOnline ? 'Online' : 'Local'}<br /><br />El Impostor Dominicano — Juego con palabras dominicanas.<br />© 2026 Brayan Camacho.</p>) }); }}>
                  <span className="config-row-icon">ℹ️</span><span>Acerca de</span><span className="config-row-chevron">›</span>
                </button>
                <button type="button" className="config-row" onClick={() => showToast('Cambio de idioma próximamente', 'info')}>
                  <span className="config-row-icon">🌐</span><span>Idioma</span><span className="config-row-chevron">›</span>
                </button>
                <button type="button" className="config-row" onClick={async () => { const shareData = { title: 'El Impostor Dominicano', text: '¡Juega El Impostor Dominicano con palabras dominicanas! 🇩🇴', url: window.location.href }; try { if (navigator.share) await navigator.share(shareData); else { await navigator.clipboard.writeText(shareData.url); showToast('Enlace copiado', 'success', 4000); } } catch (err) { if (err.name !== 'AbortError') { try { await navigator.clipboard.writeText(shareData.url); showToast('Enlace copiado', 'success', 4000); } catch (e2) { showModal({ title: 'Compartir', content: <p>Comparte: {shareData.url}</p> }); } } } }}>
                  <span className="config-row-icon">📤</span><span>Compartir</span><span className="config-row-chevron">›</span>
                </button>
              </div>

              <div style={{ marginBottom: 28 }}>
                <div className="config-section-title">Legal</div>
                <button type="button" className="config-row" onClick={() => showModal({ title: 'Términos de uso', content: (<p style={{ margin: 0, lineHeight: 1.6 }}>Al usar esta aplicación aceptas los términos y condiciones. Uso para entretenimiento y personal. © 2026 Brayan Camacho.</p>) })}>
                  <span className="config-row-icon">📄</span><span>Términos de uso</span><span className="config-row-chevron">›</span>
                </button>
                <button type="button" className="config-row" onClick={() => showModal({ title: 'Política de privacidad', content: (<p style={{ margin: 0, lineHeight: 1.6 }}>No recopilamos datos personales. Todo se procesa en tu dispositivo. Contacto: <a href="mailto:brayanfranciscodc@gmail.com" style={{ color: 'var(--color-primary)' }}>brayanfranciscodc@gmail.com</a></p>) })}>
                  <span className="config-row-icon">🔒</span><span>Privacidad</span><span className="config-row-chevron">›</span>
                </button>
              </div>

              <div className="config-footer">
                <div className="config-footer-id">ID: {deviceId}</div>
                <a href="mailto:brayanfranciscodc@gmail.com">brayanfranciscodc@gmail.com</a>
              </div>

              <button type="button" className="config-done-btn" onClick={() => setMostrarConfiguracion(false)}>
                Listo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        {/* Título principal */}
        <h1 style={{
          fontSize: 'clamp(1.55em, 5vw, 2.1em)',
          fontWeight: '700',
          color: 'var(--color-text)',
          letterSpacing: '-0.5px',
          margin: '0 0 4px',
          lineHeight: 1.2
        }}>
          🇩🇴 El Impostor Dominicano
        </h1>

        {/* Tagline */}
        <p style={{
          fontSize: 'clamp(0.82em, 2.5vw, 0.95em)',
          fontWeight: '500',
          color: '#a78bfa',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          margin: '0 0 12px'
        }}>
          Lo' Menore' y Su Lío
        </p>

        {/* Badge versión */}
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          background: 'rgba(74,222,128,0.1)',
          border: '1px solid rgba(74,222,128,0.2)',
          borderRadius: '20px',
          color: '#4ade80',
          fontSize: '0.75em',
          fontWeight: '500'
        }}>
          v{import.meta.env.VITE_APP_VERSION || '1.1.0'}
          {verificandoActualizacion && (window.Capacitor || window.cordova) && (
            <span style={{ opacity: 0.7, fontSize: '1.1em', animation: 'spin 1s linear infinite' }}>⟳</span>
          )}
        </span>

        {/* Chip de usuario logueado */}
        {tieneAuth && user && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => { if (Date.now() - cerrarConfigRef.current < 400) return; setMostrarConfiguracion(true); }}
            onKeyDown={(e) => { if (e.key === 'Enter') setMostrarConfiguracion(true); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '12px',
              padding: '6px 14px 6px 6px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '24px',
              fontSize: '0.82em',
              color: 'var(--color-text)',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            title="Ver configuración de cuenta"
          >
            {user.photoURL
              ? <img src={user.photoURL} alt="" referrerPolicy="no-referrer" style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }} />
              : <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(102,126,234,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9em' }}>👤</span>
            }
            <span style={{ opacity: 0.85 }}>{user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'Usuario'}</span>
          </div>
        )}
      </div>
      
      <div className="configuracion">
        <div className="input-group">
          <label htmlFor="categorias-select" style={{ 
            marginBottom: '10px', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.92em', 
            fontWeight: '600',
            color: 'var(--color-text)',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            opacity: 0.85
          }}>
            <span>🎯 Categorías</span>
            <span style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff',
              borderRadius: '20px',
              padding: '2px 10px',
              fontSize: '0.9em',
              fontWeight: '700',
              letterSpacing: '0',
              textTransform: 'none'
            }}>
              {categoriasSeleccionadas.length} / {todasLasCategorias.length}
            </span>
          </label>
          
          {/* Dropdown profesional de categorías */}
          <div className="dropdown-categorias-container" style={{ position: 'relative', width: '100%' }}>
            {/* Botón disparador */}
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={dropdownCategoriasAbierto}
              onClick={() => setDropdownCategoriasAbierto(!dropdownCategoriasAbierto)}
              style={{
                width: '100%',
                padding: '0 16px',
                minHeight: '52px',
                border: `1.5px solid ${dropdownCategoriasAbierto ? 'rgba(102,126,234,0.7)' : 'rgba(255,255,255,0.15)'}`,
                borderRadius: '14px',
                background: dropdownCategoriasAbierto
                  ? 'rgba(102,126,234,0.12)'
                  : 'rgba(255,255,255,0.06)',
                color: 'var(--color-text)',
                fontSize: '0.97em',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                boxShadow: dropdownCategoriasAbierto
                  ? '0 0 0 3px rgba(102,126,234,0.18)'
                  : 'none',
              }}
            >
              {/* Chips de categorías o placeholder */}
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, overflow: 'hidden', flexWrap: 'nowrap' }}>
                {categoriasSeleccionadas.length === 0 ? (
                  <span style={{ opacity: 0.5, fontStyle: 'italic' }}>Selecciona categorías…</span>
                ) : categoriasSeleccionadas.length <= 3 ? (
                  categoriasSeleccionadas.map(val => {
                    const cat = todasLasCategorias.find(c => c.value === val);
                    return cat ? (
                      <span key={val} style={{
                        background: 'rgba(102,126,234,0.22)',
                        border: '1px solid rgba(102,126,234,0.4)',
                        borderRadius: '20px',
                        padding: '3px 10px',
                        fontSize: '0.88em',
                        fontWeight: '600',
                        color: '#c4b5fd',
                        whiteSpace: 'nowrap'
                      }}>
                        {cat.label}
                      </span>
                    ) : null;
                  })
                ) : (
                  <>
                    {categoriasSeleccionadas.slice(0, 2).map(val => {
                      const cat = todasLasCategorias.find(c => c.value === val);
                      return cat ? (
                        <span key={val} style={{
                          background: 'rgba(102,126,234,0.22)',
                          border: '1px solid rgba(102,126,234,0.4)',
                          borderRadius: '20px',
                          padding: '3px 10px',
                          fontSize: '0.88em',
                          fontWeight: '600',
                          color: '#c4b5fd',
                          whiteSpace: 'nowrap'
                        }}>
                          {cat.label}
                        </span>
                      ) : null;
                    })}
                    <span style={{
                      background: 'rgba(118,75,162,0.25)',
                      border: '1px solid rgba(118,75,162,0.45)',
                      borderRadius: '20px',
                      padding: '3px 10px',
                      fontSize: '0.88em',
                      fontWeight: '700',
                      color: '#a78bfa',
                      whiteSpace: 'nowrap'
                    }}>
                      +{categoriasSeleccionadas.length - 2} más
                    </span>
                  </>
                )}
              </span>
              {/* Chevron */}
              <svg
                width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{
                  flexShrink: 0,
                  opacity: 0.6,
                  transform: dropdownCategoriasAbierto ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s ease'
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Menú desplegable */}
            {dropdownCategoriasAbierto && (
              <div
                role="listbox"
                aria-multiselectable="true"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  right: 0,
                  background: '#1c1c32',
                  border: '1.5px solid rgba(102,126,234,0.35)',
                  borderRadius: '14px',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.55)',
                  zIndex: 1000,
                  overflow: 'hidden',
                  animation: 'fadeIn 0.15s ease-out'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Acciones rápidas */}
                <div style={{
                  display: 'flex',
                  gap: '0',
                  borderBottom: '1px solid rgba(255,255,255,0.07)'
                }}>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); seleccionarTodas(); }}
                    style={{
                      flex: 1,
                      padding: '11px 8px',
                      background: 'transparent',
                      border: 'none',
                      borderRight: '1px solid rgba(255,255,255,0.07)',
                      color: '#4ade80',
                      fontSize: '0.82em',
                      fontWeight: '700',
                      cursor: 'pointer',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(76,222,128,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    ✓ Seleccionar todas
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); deseleccionarTodas(); }}
                    style={{
                      flex: 1,
                      padding: '11px 8px',
                      background: 'transparent',
                      border: 'none',
                      color: '#f87171',
                      fontSize: '0.82em',
                      fontWeight: '700',
                      cursor: 'pointer',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    ✗ Limpiar
                  </button>
                </div>

                {/* Lista de categorías */}
                <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                  {todasLasCategorias.map((cat, idx) => {
                    const estaSeleccionada = categoriasSeleccionadas.includes(cat.value);
                    const esUnica = estaSeleccionada && categoriasSeleccionadas.length === 1;
                    return (
                      <div
                        key={cat.value}
                        role="option"
                        aria-selected={estaSeleccionada}
                        onClick={() => {
                          if (esUnica) return;
                          if (estaSeleccionada) {
                            setCategoriasSeleccionadas(prev => prev.filter(c => c !== cat.value));
                          } else {
                            setCategoriasSeleccionadas(prev => [...prev, cat.value]);
                          }
                        }}
                        style={{
                          padding: '12px 16px',
                          cursor: esUnica ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          borderBottom: idx < todasLasCategorias.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                          transition: 'background 0.15s',
                          background: estaSeleccionada ? 'rgba(102,126,234,0.13)' : 'transparent',
                          opacity: esUnica ? 0.5 : 1,
                          userSelect: 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (!esUnica) e.currentTarget.style.background = estaSeleccionada ? 'rgba(102,126,234,0.2)' : 'rgba(255,255,255,0.04)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = estaSeleccionada ? 'rgba(102,126,234,0.13)' : 'transparent';
                        }}
                      >
                        {/* Checkbox visual */}
                        <span style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '6px',
                          border: estaSeleccionada ? '2px solid #667eea' : '2px solid rgba(255,255,255,0.2)',
                          background: estaSeleccionada ? 'linear-gradient(135deg,#667eea,#764ba2)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'all 0.15s'
                        }}>
                          {estaSeleccionada && (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </span>
                        {/* Emoji */}
                        <span style={{ fontSize: '1.5em', lineHeight: 1 }}>{cat.label.split(' ')[0]}</span>
                        {/* Nombre sin emoji */}
                        <span style={{
                          flex: 1,
                          fontSize: '0.97em',
                          fontWeight: estaSeleccionada ? '600' : '400',
                          color: estaSeleccionada ? '#c4b5fd' : 'rgba(255,255,255,0.85)'
                        }}>
                          {cat.label.split(' ').slice(1).join(' ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Toggle: Pista al Impostor (solo modo normal) */}
        {!modosDiabolicos && !modosAleatorios && (
          <div className="input-group">
            <div
              role="button"
              tabIndex={0}
              onClick={() => setPistaAlImpostor(v => !v)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setPistaAlImpostor(v => !v); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 16px',
                background: pistaAlImpostor ? 'rgba(76,222,128,0.1)' : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${pistaAlImpostor ? 'rgba(76,222,128,0.35)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                userSelect: 'none'
              }}
            >
              <span style={{ fontSize: '1.4em', lineHeight: 1 }}>💡</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.95em', fontWeight: '600', color: pistaAlImpostor ? '#4ade80' : 'var(--color-text)', marginBottom: '2px' }}>
                  Pista al Impostor
                </div>
                <div style={{ fontSize: '0.78em', opacity: 0.65, lineHeight: 1.3 }}>
                  {pistaAlImpostor ? 'El impostor recibe una pista de la palabra' : 'El impostor juega sin ninguna pista'}
                </div>
              </div>
              {/* Toggle pill */}
              <div style={{
                width: '46px', height: '26px', borderRadius: '13px',
                background: pistaAlImpostor ? 'linear-gradient(135deg,#4ade80,#22c55e)' : 'rgba(255,255,255,0.15)',
                position: 'relative', transition: 'background 0.25s', flexShrink: 0,
                border: `1.5px solid ${pistaAlImpostor ? '#4ade80' : 'rgba(255,255,255,0.2)'}`
              }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: '2px',
                  left: pistaAlImpostor ? '22px' : '2px',
                  transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
                }} />
              </div>
            </div>
          </div>
        )}

        {/* Toggles de modo */}
        <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Toggle: Modos Aleatorios */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              if (!modosAleatorios) {
                setModosAleatorios(true);
                setModosDiabolicos(false);
                setModoDiabolicoSeleccionado(null);
              } else {
                setModosAleatorios(false);
              }
            }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 16px',
              background: modosAleatorios ? 'rgba(157,78,221,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1.5px solid ${modosAleatorios ? 'rgba(157,78,221,0.4)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              userSelect: 'none'
            }}
          >
            <span style={{ fontSize: '1.4em', lineHeight: 1 }}>🎲</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.95em', fontWeight: '600', color: modosAleatorios ? '#c084fc' : 'var(--color-text)', marginBottom: '2px' }}>
                Modos Aleatorios
              </div>
              <div style={{ fontSize: '0.78em', opacity: 0.65, lineHeight: 1.3 }}>
                Elige un modo al azar cada partida
              </div>
            </div>
            {/* Toggle pill */}
            <div style={{
              width: '46px', height: '26px', borderRadius: '13px',
              background: modosAleatorios ? 'linear-gradient(135deg,#9d4edd,#7b2cbf)' : 'rgba(255,255,255,0.15)',
              position: 'relative', transition: 'background 0.25s', flexShrink: 0,
              border: `1.5px solid ${modosAleatorios ? '#9d4edd' : 'rgba(255,255,255,0.2)'}`
            }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
                position: 'absolute', top: '2px',
                left: modosAleatorios ? '22px' : '2px',
                transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
              }} />
            </div>
          </div>

          {/* Toggle: Modos Diabólicos */}
          <div
            role="button"
            tabIndex={modosAleatorios ? -1 : 0}
            onClick={() => {
              if (modosAleatorios) return;
              if (modosDiabolicos) {
                setModosDiabolicos(false);
                setModoDiabolicoSeleccionado(null);
              } else {
                setModosDiabolicos(true);
              }
            }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 16px',
              background: (modosDiabolicos && !modosAleatorios) ? 'rgba(245,87,108,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1.5px solid ${(modosDiabolicos && !modosAleatorios) ? 'rgba(245,87,108,0.4)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '14px',
              cursor: modosAleatorios ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: modosAleatorios ? 0.45 : 1,
              userSelect: 'none'
            }}
          >
            <span style={{ fontSize: '1.4em', lineHeight: 1 }}>😈</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.95em', fontWeight: '600', color: (modosDiabolicos && !modosAleatorios) ? '#f87171' : 'var(--color-text)', marginBottom: '2px' }}>
                Modos Diabólicos
              </div>
              <div style={{ fontSize: '0.78em', opacity: 0.65, lineHeight: 1.3 }}>
                {modosAleatorios ? 'Desactiva "Modos Aleatorios" primero' : 'Activa reglas especiales de juego'}
              </div>
            </div>
            <div style={{
              width: '46px', height: '26px', borderRadius: '13px',
              background: (modosDiabolicos && !modosAleatorios) ? 'linear-gradient(135deg,#f5576c,#d32f2f)' : 'rgba(255,255,255,0.15)',
              position: 'relative', transition: 'background 0.25s', flexShrink: 0,
              border: `1.5px solid ${(modosDiabolicos && !modosAleatorios) ? '#f5576c' : 'rgba(255,255,255,0.2)'}`
            }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
                position: 'absolute', top: '2px',
                left: (modosDiabolicos && !modosAleatorios) ? '22px' : '2px',
                transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
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
        
        {/* Botón principal de inicio */}
        <button
          className="btn btn-primary"
          onClick={handleIniciar}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '1.05em',
            fontWeight: '700',
            letterSpacing: '0.04em',
            borderRadius: '16px'
          }}
        >
          ¡Empezar Juego! 🎮
        </button>

        {/* Acceso Premium secundario */}
        <button
          onClick={() => setPantalla('premium')}
          style={{
            width: '100%',
            padding: '11px',
            marginTop: '10px',
            background: 'rgba(251,191,36,0.08)',
            border: '1.5px solid rgba(251,191,36,0.3)',
            borderRadius: '14px',
            color: '#fbbf24',
            fontSize: '0.88em',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '7px',
            transition: 'background 0.2s, border-color 0.2s',
            letterSpacing: '0.02em'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(251,191,36,0.16)'; e.currentTarget.style.borderColor = 'rgba(251,191,36,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(251,191,36,0.08)'; e.currentTarget.style.borderColor = 'rgba(251,191,36,0.3)'; }}
          title="Acceso Premium"
          aria-label="Ir a acceso Premium"
        >
          <span>👑</span> Desbloquear Premium
        </button>
        
        <Footer />
      </div>
    </div>
  );
}

export default PantallaInicio;
