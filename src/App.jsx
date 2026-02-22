import { useState, useEffect, lazy, Suspense } from 'react';
import PantallaEntrada from './components/PantallaEntrada';
import OverlayMantenimiento from './components/OverlayMantenimiento';
import AdminMantenimiento from './components/AdminMantenimiento';
import { obtenerEstadoMantenimiento, esPaginaAdmin } from './utils/mantenimiento';

const PantallaInicio = lazy(() => import('./components/PantallaInicio'));
const PantallaJugadores = lazy(() => import('./components/PantallaJugadores'));
const PantallaJuego = lazy(() => import('./components/PantallaJuego'));
const PantallaRevelarImpostor = lazy(() => import('./components/PantallaRevelarImpostor'));
const PantallaAdivinanza = lazy(() => import('./components/PantallaAdivinanza'));
const PantallaResultados = lazy(() => import('./components/PantallaResultados'));
const PantallaPremium = lazy(() => import('./components/PantallaPremium'));
const PantallaQuienEmpieza = lazy(() => import('./components/PantallaQuienEmpieza'));

function App() {
  const [mostrarEntrada, setMostrarEntrada] = useState(true);
  const [mantenimiento, setMantenimiento] = useState(null);
  const [mostrarAdmin, setMostrarAdmin] = useState(false);

  // Verificar si estamos en la página admin (solo tú la conoces)
  useEffect(() => {
    setMostrarAdmin(esPaginaAdmin());
  }, []);

  // Verificar mantenimiento al cargar y cada 15 segundos (aparece aunque estén jugando)
  // Solo se actualiza con respuestas válidas: el mantenimiento NO se quita por errores de red
  useEffect(() => {
    const verificar = async () => {
      const estado = await obtenerEstadoMantenimiento();
      if (estado !== null) {
        setMantenimiento(estado);
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
      {mostrarEntrada ? (
        <PantallaEntrada onEntrar={handleEntrar} />
      ) : (
        <Suspense fallback={
          <div className="pantalla activa" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2em', marginBottom: '16px', animation: 'fadeIn 0.5s ease' }}>🇩🇴</div>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>Cargando...</p>
            </div>
          </div>
        }>
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
        </Suspense>
      )}
    </div>
  );
}

export default App;

