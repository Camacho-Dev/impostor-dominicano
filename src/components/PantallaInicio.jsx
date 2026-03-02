import { useState, useEffect, useRef } from 'react';
import { useNotificaciones } from '../context/NotificacionesContext';
import { useTema } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getApiBase, getApi } from '../utils/stripePremium';
import { registrarSesion } from '../utils/sessionRegistry';
import { usePremium, CATEGORIAS_GRATIS } from '../utils/usePremium';
import { showBanner, removeBanner } from '../services/admob';
import Footer from './Footer';
import TutorialSlides from './TutorialSlides';
import ModalSoporte from './ModalSoporte';

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
  { value: 'videojuegos', label: '🎮 Videojuegos' },
  { value: 'barrios', label: '🏘️ Barrios de RD' },
  { value: 'marcas', label: '🛒 Marcas Dominicanas' },
  { value: 'youtubers', label: '📱 Youtubers Dominicanos' }
];

function PantallaInicio({ estadoJuego, actualizarEstado, setPantalla }) {
  const { showModal, showToast } = useNotificaciones();
  const { tema, setTema } = useTema();
  const { user, loading: authLoading, signInWithGoogle, signOut, tieneAuth } = useAuth();
  const esPremium = usePremium();
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
  const [modalSoporte, setModalSoporte] = useState(null); // 'bug' | 'sugerencia' | null
  const cerrarConfigRef = useRef(0);
  const [esMovil, setEsMovil] = useState(window.innerWidth <= 768);
  const [dropdownCategoriasAbierto, setDropdownCategoriasAbierto] = useState(false);
  const [verificandoActualizacion, setVerificandoActualizacion] = useState(false);

  const handleContactarDesarrollador = () => {
    const mailto = 'mailto:brayanfranciscodc@gmail.com';
    try {
      // En app instalada a veces window.open falla; forzamos navegación directa
      if (window.Capacitor || window.cordova) {
        window.location.href = mailto;
        return;
      }
      if (typeof window.open === 'function') {
        window.open(mailto, '_blank');
      } else {
        window.location.href = mailto;
      }
    } catch (e) {
      showToast('No se pudo abrir el correo. Copia el email: brayanfranciscodc@gmail.com', 'error', 6000);
    }
  };
  
  // Mostrar banner de AdMob al entrar a la pantalla de inicio
  useEffect(() => {
    showBanner();
    return () => { removeBanner(); };
  }, []);

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
          try {
            const { ok, data } = await getApi(`${getApiBase()}/my-ip`);
            ip = ok && data?.ip ? String(data.ip).trim() : '';
          } catch (_) {}
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
        <TutorialSlides onClose={() => setMostrarAyuda(false)} />
      )}

      {/* Modal de soporte (reporte / sugerencia) */}
      {modalSoporte && (
        <ModalSoporte
          tipo={modalSoporte}
          deviceId={deviceId}
          onClose={() => setModalSoporte(null)}
        />
      )}

      {/* Modal de configuración */}
      {mostrarConfiguracion && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            zIndex: 2000
          }}
          onClick={() => { cerrarConfigRef.current = Date.now(); setMostrarConfiguracion(false); }}
        >
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: '24px 24px 0 0',
              width: '100%', maxWidth: 480,
              maxHeight: '92dvh', overflowY: 'auto',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.45)',
              border: '1px solid rgba(255,255,255,0.08)',
              paddingBottom: 'env(safe-area-inset-bottom, 16px)'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4 }}>
              <div style={{ width: 40, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.2)' }} />
            </div>

            {/* Cabecera */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 16px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.2em', fontWeight: '800' }}>Configuración</h2>
                <p style={{ margin: '2px 0 0', fontSize: '0.78em', opacity: 0.5 }}>Ajustes de la app</p>
              </div>
              <button
                type="button" aria-label="Cerrar"
                onClick={e => { e.preventDefault(); e.stopPropagation(); cerrarConfigRef.current = Date.now(); setMostrarConfiguracion(false); }}
                onPointerDown={e => { e.preventDefault(); e.stopPropagation(); cerrarConfigRef.current = Date.now(); setMostrarConfiguracion(false); }}
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)',
                  color: 'var(--color-text)', fontSize: '1.2em',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent'
                }}
              >×</button>
            </div>

            <div style={{ padding: '0 16px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Apariencia */}
              <div>
                <div style={{ fontSize: '0.72em', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.45, marginBottom: 10, paddingLeft: 4 }}>
                  Apariencia
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { valor: 'dark', icono: '🌙', label: 'Oscuro' },
                    { valor: 'light', icono: '☀️', label: 'Claro' }
                  ].map(t => (
                    <button
                      key={t.valor}
                      type="button"
                      onClick={() => setTema(t.valor)}
                      aria-pressed={tema === t.valor}
                      style={{
                        padding: '14px 12px',
                        borderRadius: 14,
                        background: tema === t.valor ? 'rgba(102,126,234,0.2)' : 'rgba(255,255,255,0.04)',
                        border: `1.5px solid ${tema === t.valor ? 'rgba(102,126,234,0.5)' : 'rgba(255,255,255,0.09)'}`,
                        color: tema === t.valor ? '#a78bfa' : 'var(--color-text)',
                        fontSize: '0.92em', fontWeight: '700',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        transition: 'all 0.2s', touchAction: 'manipulation'
                      }}
                    >
                      <span style={{ fontSize: '1.2em' }}>{t.icono}</span> {t.label}
                      {tema === t.valor && <span style={{ marginLeft: 'auto', fontSize: '0.9em' }}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cuenta */}
              {tieneAuth && (
                <div>
                  <div style={{ fontSize: '0.72em', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.45, marginBottom: 10, paddingLeft: 4 }}>
                    Cuenta
                  </div>
                  {authLoading ? (
                    <div style={{ padding: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: 14, opacity: 0.5, fontSize: '0.9em' }}>Cargando…</div>
                  ) : user ? (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 14px', borderRadius: 16,
                      background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)'
                    }}>
                      {user.photoURL
                        ? <img src={user.photoURL} alt="" referrerPolicy="no-referrer" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                        : <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(102,126,234,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3em', flexShrink: 0 }}>👤</div>
                      }
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '700', fontSize: '0.95em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.displayName || 'Usuario'}</div>
                        {user.email && <div style={{ fontSize: '0.78em', opacity: 0.55, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>}
                      </div>
                      <button
                        type="button" onClick={() => signOut()}
                        style={{
                          padding: '8px 12px', borderRadius: 10, flexShrink: 0,
                          background: 'rgba(248,113,113,0.1)', border: '1.5px solid rgba(248,113,113,0.25)',
                          color: '#f87171', fontSize: '0.8em', fontWeight: '700', cursor: 'pointer',
                          touchAction: 'manipulation'
                        }}
                      >Salir</button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={async () => {
                        try { await signInWithGoogle(); setMostrarConfiguracion(false); }
                        catch (e) { showToast(e?.message || 'Error al iniciar sesión', 'error', 6000); }
                      }}
                      style={{
                        width: '100%', padding: '14px 16px', borderRadius: 14,
                        background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.12)',
                        color: 'var(--color-text)', fontSize: '0.95em', fontWeight: '700',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        touchAction: 'manipulation'
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

              {/* Información */}
              <div>
                <div style={{ fontSize: '0.72em', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.45, marginBottom: 10, paddingLeft: 4 }}>
                  Información
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, borderRadius: 16, overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.08)' }}>
                  {[
                    { icon: 'ℹ️', label: 'Acerca de', onClick: () => { const esApp = window.Capacitor || window.cordova; showModal({ title: 'Acerca de', content: (<p style={{ margin: 0, lineHeight: 1.6 }}><strong>Versión:</strong> {import.meta.env.VITE_APP_VERSION || '1.1.0'}<br /><strong>Tipo:</strong> {esApp ? 'App instalada' : 'Navegador'}<br /><br />El Impostor Dominicano — Juego con palabras dominicanas. 🇩🇴<br />© 2026 Brayan Camacho.</p>) }); } },
                    { icon: '🌐', label: 'Idioma', onClick: () => showToast('Cambio de idioma próximamente', 'info') },
                    { icon: '📤', label: 'Compartir app', onClick: async () => { const shareData = { title: 'El Impostor Dominicano', text: '¡Juega El Impostor Dominicano! 🇩🇴', url: window.location.href }; try { if (navigator.share) await navigator.share(shareData); else { await navigator.clipboard.writeText(shareData.url); showToast('Enlace copiado', 'success', 4000); } } catch (err) { if (err.name !== 'AbortError') { try { await navigator.clipboard.writeText(shareData.url); showToast('Enlace copiado', 'success', 4000); } catch (e2) {} } } } },
                  ].map((item, i, arr) => (
                    <button
                      key={item.label} type="button" onClick={item.onClick}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '15px 16px',
                        background: 'rgba(255,255,255,0.04)',
                        border: 'none',
                        borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                        color: 'var(--color-text)', fontSize: '0.92em', fontWeight: '500',
                        cursor: 'pointer', textAlign: 'left', width: '100%',
                        touchAction: 'manipulation'
                      }}
                    >
                      <span style={{ fontSize: '1.2em', width: 24, textAlign: 'center' }}>{item.icon}</span>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      <span style={{ opacity: 0.35, fontSize: '1.1em' }}>›</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Soporte */}
              <div>
                <div style={{ fontSize: '0.72em', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.45, marginBottom: 10, paddingLeft: 4 }}>
                  Soporte
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, borderRadius: 16, overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.08)' }}>
                  {[
                    {
                      icon: '🐛',
                      label: 'Reportar un problema',
                      sub: 'Bug, error o algo que no funciona',
                      onClick: () => { setModalSoporte('bug'); setMostrarConfiguracion(false); }
                    },
                    {
                      icon: '💡',
                      label: 'Sugerir una palabra',
                      sub: 'Propón una palabra dominicana',
                      onClick: () => { setModalSoporte('sugerencia'); setMostrarConfiguracion(false); }
                    },
                    {
                      icon: '⭐',
                      label: 'Calificar la app',
                      sub: 'Déjanos tu opinión en Play Store',
                      onClick: () => {
                        window.open('https://play.google.com/store/apps/details?id=com.impostor.dominicano', '_blank');
                      }
                    },
                    {
                      icon: '💬',
                      label: 'Contactar al desarrollador',
                      sub: 'brayanfranciscodc@gmail.com',
                      onClick: handleContactarDesarrollador
                    },
                  ].map((item, i, arr) => (
                    <button
                      key={item.label} type="button" onClick={item.onClick}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '13px 16px',
                        background: 'rgba(255,255,255,0.04)',
                        border: 'none',
                        borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                        color: 'var(--color-text)', fontSize: '0.92em', fontWeight: '500',
                        cursor: 'pointer', textAlign: 'left', width: '100%',
                        touchAction: 'manipulation'
                      }}
                    >
                      <span style={{ fontSize: '1.2em', width: 24, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
                      <span style={{ flex: 1 }}>
                        <span style={{ display: 'block' }}>{item.label}</span>
                        {item.sub && <span style={{ display: 'block', fontSize: '0.78em', opacity: 0.45, marginTop: 1 }}>{item.sub}</span>}
                      </span>
                      <span style={{ opacity: 0.35, fontSize: '1.1em' }}>›</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Legal */}
              <div>
                <div style={{ fontSize: '0.72em', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.45, marginBottom: 10, paddingLeft: 4 }}>
                  Legal
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, borderRadius: 16, overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.08)' }}>
                  {[
                    { icon: '📄', label: 'Términos de uso', onClick: () => showModal({ title: 'Términos de uso', content: (<p style={{ margin: 0, lineHeight: 1.6 }}>Al usar esta aplicación aceptas los términos y condiciones. Uso para entretenimiento y personal. © 2026 Brayan Camacho.</p>) }) },
                    { icon: '🔒', label: 'Privacidad', onClick: () => showModal({ title: 'Política de privacidad', content: (<p style={{ margin: 0, lineHeight: 1.6 }}>No recopilamos datos personales. Todo se procesa en tu dispositivo. Contacto: <a href="mailto:brayanfranciscodc@gmail.com" style={{ color: 'var(--color-primary)' }}>brayanfranciscodc@gmail.com</a></p>) }) },
                  ].map((item, i, arr) => (
                    <button
                      key={item.label} type="button" onClick={item.onClick}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '15px 16px',
                        background: 'rgba(255,255,255,0.04)',
                        border: 'none',
                        borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                        color: 'var(--color-text)', fontSize: '0.92em', fontWeight: '500',
                        cursor: 'pointer', textAlign: 'left', width: '100%',
                        touchAction: 'manipulation'
                      }}
                    >
                      <span style={{ fontSize: '1.2em', width: 24, textAlign: 'center' }}>{item.icon}</span>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      <span style={{ opacity: 0.35, fontSize: '1.1em' }}>›</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer con ID */}
              <div style={{ textAlign: 'center', paddingTop: 4 }}>
                <div style={{ fontSize: '0.72em', opacity: 0.35, marginBottom: 4, fontFamily: 'monospace' }}>ID: {deviceId}</div>
                <a href="mailto:brayanfranciscodc@gmail.com" style={{ fontSize: '0.75em', opacity: 0.4, color: 'var(--color-text)', textDecoration: 'none' }}>
                  brayanfranciscodc@gmail.com
                </a>
              </div>

              <button
                type="button"
                onClick={() => { cerrarConfigRef.current = Date.now(); setMostrarConfiguracion(false); }}
                style={{
                  width: '100%', padding: '15px', marginTop: 4,
                  background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)',
                  borderRadius: 14, color: 'var(--color-text)', fontSize: '1em', fontWeight: '700',
                  cursor: 'pointer', touchAction: 'manipulation'
                }}
              >
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
        <div className="input-group" data-tour="categorias">
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
                    const bloqueada = !esPremium && !CATEGORIAS_GRATIS.includes(cat.value);
                    return (
                      <div
                        key={cat.value}
                        role="option"
                        aria-selected={estaSeleccionada}
                        onClick={() => {
                          if (bloqueada) { setPantalla('premium'); setDropdownCategoriasAbierto(false); return; }
                          if (esUnica) return;
                          if (estaSeleccionada) {
                            setCategoriasSeleccionadas(prev => prev.filter(c => c !== cat.value));
                          } else {
                            setCategoriasSeleccionadas(prev => [...prev, cat.value]);
                          }
                        }}
                        style={{
                          padding: '12px 16px',
                          cursor: bloqueada ? 'pointer' : esUnica ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          borderBottom: idx < todasLasCategorias.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                          transition: 'background 0.15s',
                          background: bloqueada ? 'transparent' : estaSeleccionada ? 'rgba(102,126,234,0.13)' : 'transparent',
                          opacity: bloqueada ? 0.6 : esUnica ? 0.5 : 1,
                          userSelect: 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (bloqueada) { e.currentTarget.style.background = 'rgba(251,191,36,0.07)'; return; }
                          if (!esUnica) e.currentTarget.style.background = estaSeleccionada ? 'rgba(102,126,234,0.2)' : 'rgba(255,255,255,0.04)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = (!bloqueada && estaSeleccionada) ? 'rgba(102,126,234,0.13)' : 'transparent';
                        }}
                      >
                        {/* Checkbox o candado */}
                        {bloqueada ? (
                          <span style={{
                            width: '20px', height: '20px', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', flexShrink: 0
                          }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                          </span>
                        ) : (
                          <span style={{
                            width: '20px', height: '20px', borderRadius: '6px',
                            border: estaSeleccionada ? '2px solid #667eea' : '2px solid rgba(255,255,255,0.2)',
                            background: estaSeleccionada ? 'linear-gradient(135deg,#667eea,#764ba2)' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, transition: 'all 0.15s'
                          }}>
                            {estaSeleccionada && (
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </span>
                        )}
                        {/* Emoji */}
                        <span style={{ fontSize: '1.5em', lineHeight: 1 }}>{cat.label.split(' ')[0]}</span>
                        {/* Nombre sin emoji */}
                        <span style={{
                          flex: 1, fontSize: '0.97em',
                          fontWeight: estaSeleccionada ? '600' : '400',
                          color: bloqueada ? 'rgba(255,255,255,0.5)' : estaSeleccionada ? '#c4b5fd' : 'rgba(255,255,255,0.85)'
                        }}>
                          {cat.label.split(' ').slice(1).join(' ')}
                        </span>
                        {/* Badge Premium */}
                        {bloqueada && (
                          <span style={{
                            fontSize: '0.7em', fontWeight: '700', color: '#fbbf24',
                            background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)',
                            borderRadius: '10px', padding: '2px 7px', letterSpacing: '0.04em',
                            flexShrink: 0
                          }}>
                            PRO
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Opciones de modo normal: pista e impostores — siempre visibles, deshabilitadas en modo diabólico */}
        <div
          className="input-group"
          data-tour="pista-impostor"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            opacity: modosDiabolicos && !modosAleatorios ? 0.4 : 1,
            transition: 'opacity 0.2s',
            pointerEvents: modosDiabolicos && !modosAleatorios ? 'none' : 'auto'
          }}
        >

          {/* Toggle: Pista al Impostor */}
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

        {/* Toggles de modo */}
        <div
          className="input-group"
          data-tour="modos"
          style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
        >
          {/* Toggle: Modos Aleatorios — requiere Premium */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              if (!esPremium) { setPantalla('premium'); return; }
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
              background: !esPremium ? 'rgba(251,191,36,0.06)' : modosAleatorios ? 'rgba(157,78,221,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1.5px solid ${!esPremium ? 'rgba(251,191,36,0.25)' : modosAleatorios ? 'rgba(157,78,221,0.4)' : 'rgba(255,255,255,0.1)'}`,
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
                {!esPremium ? 'Elige un modo al azar cada partida' : 'Elige un modo al azar cada partida'}
              </div>
            </div>
            {/* Candado o toggle pill */}
            {!esPremium ? (
              <span style={{
                fontSize: '0.72em', fontWeight: '700', color: '#fbbf24',
                background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.35)',
                borderRadius: '10px', padding: '3px 8px', letterSpacing: '0.04em', flexShrink: 0
              }}>👑 PRO</span>
            ) : (
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
            )}
          </div>

          {/* Toggle: Modos Diabólicos — requiere Premium */}
          <div
            role="button"
            tabIndex={modosAleatorios ? -1 : 0}
            onClick={() => {
              if (!esPremium) { setPantalla('premium'); return; }
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
              background: !esPremium ? 'rgba(251,191,36,0.06)' : (modosDiabolicos && !modosAleatorios) ? 'rgba(245,87,108,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1.5px solid ${!esPremium ? 'rgba(251,191,36,0.25)' : (modosDiabolicos && !modosAleatorios) ? 'rgba(245,87,108,0.4)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '14px',
              cursor: (!esPremium || !modosAleatorios) ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              opacity: (esPremium && modosAleatorios) ? 0.45 : 1,
              userSelect: 'none'
            }}
          >
            <span style={{ fontSize: '1.4em', lineHeight: 1 }}>😈</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.95em', fontWeight: '600', color: (modosDiabolicos && !modosAleatorios) ? '#f87171' : 'var(--color-text)', marginBottom: '2px' }}>
                Modos Diabólicos
              </div>
              <div style={{ fontSize: '0.78em', opacity: 0.65, lineHeight: 1.3 }}>
                {!esPremium ? 'Reglas especiales y caóticas' : modosAleatorios ? 'Desactiva "Modos Aleatorios" primero' : 'Activa reglas especiales de juego'}
              </div>
            </div>
            {!esPremium ? (
              <span style={{
                fontSize: '0.72em', fontWeight: '700', color: '#fbbf24',
                background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.35)',
                borderRadius: '10px', padding: '3px 8px', letterSpacing: '0.04em', flexShrink: 0
              }}>👑 PRO</span>
            ) : (
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
            )}
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
          data-tour="boton-empezar"
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
