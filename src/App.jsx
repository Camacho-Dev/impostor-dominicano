import { useState, useEffect } from 'react';
import PantallaEntrada from './components/PantallaEntrada';
import PantallaInicio from './components/PantallaInicio';
import OverlayMantenimiento from './components/OverlayMantenimiento';
import AdminMantenimiento from './components/AdminMantenimiento';
import { obtenerEstadoMantenimiento, esPaginaAdmin } from './utils/mantenimiento';
import PantallaJugadores from './components/PantallaJugadores';
import PantallaJuego from './components/PantallaJuego';
import PantallaRevelarImpostor from './components/PantallaRevelarImpostor';
import PantallaAdivinanza from './components/PantallaAdivinanza';
import PantallaResultados from './components/PantallaResultados';
import PantallaPremium from './components/PantallaPremium';
import PantallaQuienEmpieza from './components/PantallaQuienEmpieza';

function App() {
  const [mostrarEntrada, setMostrarEntrada] = useState(true);
  const [mantenimiento, setMantenimiento] = useState(null);
  const [mostrarAdmin, setMostrarAdmin] = useState(false);

  // Verificar si estamos en la página admin (solo tú la conoces)
  useEffect(() => {
    setMostrarAdmin(esPaginaAdmin());
  }, []);

  // Verificar estado de mantenimiento al cargar y cada 60 segundos
  // Solo se actualiza con respuestas válidas: el mantenimiento NO se quita por errores de red
  useEffect(() => {
    const verificar = async () => {
      const estado = await obtenerEstadoMantenimiento();
      if (estado !== null) {
        setMantenimiento(estado);
      }
    };
    verificar();
    const interval = setInterval(verificar, 60000);
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
    votos: {},
    jugadoresListos: [],
    jugadorInicia: null,
    modoVotacion: false,
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
    <div className="app" style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
      {mostrarEntrada ? (
        <PantallaEntrada onEntrar={handleEntrar} />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default App;

