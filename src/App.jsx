import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import PantallaEntrada from './components/PantallaEntrada';
import OverlayMantenimiento from './components/OverlayMantenimiento';
import AdminMantenimiento from './components/AdminMantenimiento';
import Tutorial from './components/Tutorial';
import LoadingScreen from './components/LoadingScreen';
import { TUTORIAL_KEY } from './components/Tutorial';
import { obtenerEstadoMantenimiento, esPaginaAdmin } from './utils/mantenimiento';
import { verificarSesionPago, cargarConfigPagos } from './utils/stripePremium';
import { useAuth } from './context/AuthContext';

const PantallaInicio = lazy(() => import('./components/PantallaInicio'));
const PantallaJugadores = lazy(() => import('./components/PantallaJugadores'));
const PantallaJuego = lazy(() => import('./components/PantallaJuego'));
const PantallaRevelarImpostor = lazy(() => import('./components/PantallaRevelarImpostor'));
const PantallaAdivinanza = lazy(() => import('./components/PantallaAdivinanza'));
const PantallaResultados = lazy(() => import('./components/PantallaResultados'));
const PantallaPremium = lazy(() => import('./components/PantallaPremium'));
const PantallaQuienEmpieza = lazy(() => import('./components/PantallaQuienEmpieza'));

function App() {
  const { redirecting } = useAuth();
  const [mostrarEntrada, setMostrarEntrada] = useState(true);
  const [mostrarTutorial, setMostrarTutorial] = useState(false);
  const [mantenimiento, setMantenimiento] = useState(null);
  const [mantenimientoCargando, setMantenimientoCargando] = useState(true);
  const [mostrarAdmin, setMostrarAdmin] = useState(false);

  // Verificar si estamos en la página admin (solo tú la conoces)
  useEffect(() => {
    setMostrarAdmin(esPaginaAdmin());
  }, []);

  // Cargar config.json para URL de API de pagos (permite pagos sin recompilar)
  const [, setConfigCargado] = useState(false);
  useEffect(() => {
    cargarConfigPagos().then(() => setConfigCargado(true));
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

  // Verificar mantenimiento al cargar y cada 15 segundos (aparece aunque estén jugando)
  const primeraVerificacionRef = useRef(true);
  useEffect(() => {
    const verificar = async () => {
      try {
        const estado = await obtenerEstadoMantenimiento();
        if (estado !== null) {
          setMantenimiento(estado);
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
    modoAdivinanza: false,
    modoAcusacion: false,
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
    try {
      if (!localStorage.getItem(TUTORIAL_KEY)) {
        setMostrarTutorial(true);
      }
    } catch (e) {
      console.warn('No se pudo verificar tutorial:', e);
    }
  };

  // Página admin: solo visible con la URL secreta
  if (mostrarAdmin) {
    return <AdminMantenimiento />;
  }

  // Overlay de mantenimiento: todos lo ven cuando está activo
  if (mantenimiento?.activo) {
    return <OverlayMantenimiento mensaje={mantenimiento.mensaje} />;
  }

  return (
    <div className="app" role="main" aria-label="El Impostor Dominicano" style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
      {/* Overlay cuando se redirige a Google para iniciar sesión */}
      {redirecting && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 15, 30, 0.98)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            color: 'var(--color-text)',
            gap: '16px',
            padding: '20px'
          }}
        >
          <div style={{ fontSize: '1.2em', textAlign: 'center' }}>Redirigiendo a Google…</div>
          <div style={{ opacity: 0.8, fontSize: '0.9em' }}>Si no se abre la ventana, revisa si el navegador bloqueó la redirección.</div>
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
          {/* Tutorial guiado (solo primera vez al descargar/abrir el juego) */}
          {mostrarTutorial && (
            <Tutorial onCompletar={() => setMostrarTutorial(false)} />
          )}
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
      {pantalla === 'adivinanza' && (
        <PantallaAdivinanza 
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

