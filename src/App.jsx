import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import PantallaEntrada from './components/PantallaEntrada';
import OverlayMantenimiento from './components/OverlayMantenimiento';
import AdminMantenimiento from './components/AdminMantenimiento';
import LoadingScreen from './components/LoadingScreen';
import OfflineBanner from './components/OfflineBanner';
import AsistenteMenores from './components/AsistenteMenores';
import { obtenerEstadoMantenimiento, esPaginaAdmin } from './utils/mantenimiento';
import { verificarSesionPago, cargarConfigPagos, getApiBase, getApi } from './utils/stripePremium';
import { registrarSesion } from './utils/sessionRegistry';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';

const PantallaInicio = lazy(() => import('./components/PantallaInicio'));
const PantallaJugadores = lazy(() => import('./components/PantallaJugadores'));
const PantallaJuego = lazy(() => import('./components/PantallaJuego'));
const PantallaRevelarImpostor = lazy(() => import('./components/PantallaRevelarImpostor'));
const PantallaResultados = lazy(() => import('./components/PantallaResultados'));
const PantallaPremium = lazy(() => import('./components/PantallaPremium'));
const PantallaQuienEmpieza = lazy(() => import('./components/PantallaQuienEmpieza'));

function App() {
  const { redirecting } = useAuth();
  const { t } = useLanguage();
  const [mostrarEntrada, setMostrarEntrada] = useState(true);
  const [mantenimiento, setMantenimiento] = useState(null);
  const [mantenimientoCargando, setMantenimientoCargando] = useState(true);
  const [mostrarAdmin, setMostrarAdmin] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);

  // En app nativa (Android/iOS): ocultar barra de estado para pantalla completa
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.hide().catch(() => {});
    }
  }, []);

  // Verificar si estamos en la página admin (solo tú la conoces)
  useEffect(() => {
    const check = () => setMostrarAdmin(esPaginaAdmin());
    check();
    window.addEventListener('popstate', check);
    const t = setTimeout(check, 100);
    return () => {
      window.removeEventListener('popstate', check);
      clearTimeout(t);
    };
  }, []);

  // Cargar config.json para URL de API de pagos (permite pagos sin recompilar)
  useEffect(() => {
    cargarConfigPagos();
  }, []);

  // Si volvemos de Stripe con session_id, verificar pago y activar premium
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (!sessionId) return;

    (async () => {
      const { valid, plan } = await verificarSesionPago(sessionId);
      if (valid && plan) {
        localStorage.setItem('premiumActivo', 'true');
        localStorage.setItem('premiumPlan', plan);
        localStorage.setItem('premiumFecha', new Date().toISOString());
      }
      // Quitar session_id y premium=cancel de la URL sin recargar
      params.delete('session_id');
      params.delete('premium');
      const clean = params.toString() ? `?${params.toString()}` : window.location.pathname + window.location.hash;
      window.history.replaceState({}, '', clean);
    })();
  }, []);

  // Verificar mantenimiento y lista de bloqueados al cargar y cada 15 segundos
  const primeraVerificacionRef = useRef(true);
  useEffect(() => {
    const verificar = async () => {
      try {
        const estado = await obtenerEstadoMantenimiento();
        if (estado !== null) {
          setMantenimiento(estado);
          // Comprobar si este dispositivo o IP está bloqueado (solo si no estamos en la página admin)
          let bloqueadoPorId = false;
          if (estado.blockedIds?.length) {
            try {
              const deviceId = localStorage.getItem('deviceId');
              bloqueadoPorId = Boolean(deviceId && estado.blockedIds.includes(deviceId));
            } catch (_) {}
          }
          if (bloqueadoPorId) {
            setBloqueado(true);
          } else if (estado.blockedIps?.length && getApiBase()) {
            try {
              const { ok, data } = await getApi(`${getApiBase()}/my-ip`);
              const ip = ok && data?.ip ? String(data.ip).trim() : '';
              setBloqueado(Boolean(ip && estado.blockedIps.includes(ip)));
            } catch (_) {
              setBloqueado(false);
            }
          } else {
            setBloqueado(false);
          }
        }
      } catch (e) {
        console.warn('Error verificando mantenimiento:', e);
      } finally {
        if (primeraVerificacionRef.current) {
          primeraVerificacionRef.current = false;
          setMantenimientoCargando(false);
        }
      }
    };
    verificar();
    const interval = setInterval(verificar, 15000);
    return () => clearInterval(interval);
  }, []);

  // Registrar sesión (deviceId + IP) en Firestore para que el admin vea dispositivos activos (solo si no es admin ni bloqueado)
  useEffect(() => {
    if (mostrarAdmin || bloqueado) return;
    const registrar = async () => {
      try {
        const deviceId = localStorage.getItem('deviceId');
        if (!deviceId) return;
        let ip = '';
        if (getApiBase()) {
          try {
            const { ok, data } = await getApi(`${getApiBase()}/my-ip`);
            ip = ok && data?.ip ? String(data.ip).trim() : '';
          } catch (_) {}
        }
        await registrarSesion(deviceId, ip);
      } catch (_) {}
    };
    const t1 = setTimeout(registrar, 1500);
    const interval = setInterval(registrar, 25000);
    return () => {
      clearTimeout(t1);
      clearInterval(interval);
    };
  }, [mostrarAdmin, bloqueado]);
  
  // Deshabilitar selección de texto y menú contextual
  useEffect(() => {
    // Prevenir menú contextual (clic derecho y mantener presionado)
    const preventContextMenu = (e) => {
      // Solo prevenir en elementos que no sean inputs
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') {
        e.preventDefault();
        return false;
      }
    };

    // Prevenir selección de texto
    const preventSelection = (e) => {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') {
        if (window.getSelection) {
          window.getSelection().removeAllRanges();
        }
      }
    };

    // Prevenir drag de imágenes y otros elementos
    const preventDrag = (e) => {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('selectstart', preventSelection);
    document.addEventListener('dragstart', preventDrag);
    document.addEventListener('touchstart', preventSelection, { passive: false });

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('selectstart', preventSelection);
      document.removeEventListener('dragstart', preventDrag);
      document.removeEventListener('touchstart', preventSelection);
    };
  }, []);
  const [pantalla, setPantalla] = useState('inicio');
  const [estadoJuego, setEstadoJuego] = useState({
    jugadores: [],
    numJugadores: 3,
    categorias: ['comida'],
    jugadorActual: 0,
    impostor: null,
    palabraSecreta: '',
    pistas: [],
    jugadoresListos: [],
    jugadorInicia: null,
    modosDiabolicos: false,
    modoDiabolicoSeleccionado: null,
    modosAleatorios: false,
    pistasImpostores: {},
    jugadorConPalabra: null,
    palabrasJugadores: {},
    impostores: [],
    numImpostores: 1
  });

  const actualizarEstado = (nuevoEstado) => {
    setEstadoJuego(prev => ({ ...prev, ...nuevoEstado }));
  };

  const handleEntrar = () => {
    setMostrarEntrada(false);
  };

  // Página admin: solo visible con la URL secreta (no se aplica bloqueo por ID/IP aquí)
  if (mostrarAdmin) {
    return <AdminMantenimiento />;
  }

  // Pantalla de bloqueo: dispositivo o IP bloqueada desde el panel admin
  if (bloqueado) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(135deg, #1a0a0a 0%, #2d1515 50%, #1a0a0a 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          color: '#fff',
          textAlign: 'center'
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>🚫</div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 12 }}>Acceso restringido</h1>
        <p style={{ opacity: 0.9, maxWidth: 320 }}>
          Este dispositivo ha sido bloqueado. Si crees que es un error, contacta al administrador.
        </p>
      </div>
    );
  }

  // Overlay de mantenimiento: todos lo ven cuando está activo
  if (mantenimiento?.activo) {
    return <OverlayMantenimiento mensaje={mantenimiento.mensaje} />;
  }

  return (
    <div className="app" role="main" aria-label="El Impostor Dominicano" style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
      <OfflineBanner />
      {!mostrarEntrada && <AsistenteMenores />}
      {/* Overlay cuando se redirige a Google para iniciar sesión */}
      {redirecting && (
        <div
          role="alert"
          aria-live="polite"
          style={{
            position: 'fixed',
            inset: 0,
            background: '#1a1a2e',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            color: '#fff',
            gap: '16px',
            padding: '20px',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <div style={{ fontSize: '1.2em', textAlign: 'center', fontWeight: 600 }}>{t('redirGoogle')}</div>
          <div style={{ opacity: 0.85, fontSize: '0.9em', textAlign: 'center' }}>{t('redirGoogleDesc')}</div>
        </div>
      )}
      {/* Barra de verificación de mantenimiento (solo visible durante la primera carga) */}
      {mantenimientoCargando && (
        <div
          role="status"
          aria-live="polite"
          aria-label="Verificando conexión"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.5))',
            zIndex: 99998,
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              height: '100%',
              width: '40%',
              background: 'linear-gradient(90deg, #667eea, #764ba2)',
              animation: 'mantenimiento-progress 1.5s ease-in-out infinite'
            }}
          />
        </div>
      )}
      {mostrarEntrada ? (
        <PantallaEntrada onEntrar={handleEntrar} />
      ) : (
        <>
        <Suspense fallback={<LoadingScreen />}>
          <div key={pantalla} className="pantalla-transicion" style={{ width: '100%' }}>
          {pantalla === 'inicio' && (
        <PantallaInicio 
          estadoJuego={estadoJuego}
          actualizarEstado={actualizarEstado}
          setPantalla={setPantalla}
        />
      )}
      {pantalla === 'jugadores' && (
        <PantallaJugadores 
          estadoJuego={estadoJuego}
          actualizarEstado={actualizarEstado}
          setPantalla={setPantalla}
        />
      )}
      {pantalla === 'juego' && (
        <PantallaJuego 
          estadoJuego={estadoJuego}
          actualizarEstado={actualizarEstado}
          setPantalla={setPantalla}
        />
      )}
      {pantalla === 'revelar-impostor' && (
        <PantallaRevelarImpostor 
          estadoJuego={estadoJuego}
          actualizarEstado={actualizarEstado}
          setPantalla={setPantalla}
        />
      )}
      {pantalla === 'resultados' && (
        <PantallaResultados 
          estadoJuego={estadoJuego}
          actualizarEstado={actualizarEstado}
          setPantalla={setPantalla}
        />
      )}
      {pantalla === 'quien-empieza' && (
        <PantallaQuienEmpieza 
          estadoJuego={estadoJuego}
          actualizarEstado={actualizarEstado}
          setPantalla={setPantalla}
        />
      )}
          {pantalla === 'premium' && (
            <PantallaPremium 
              estadoJuego={estadoJuego}
              actualizarEstado={actualizarEstado}
              setPantalla={setPantalla}
            />
          )}
          </div>
        </Suspense>
        </>
      )}
    </div>
  );
}

export default App;

