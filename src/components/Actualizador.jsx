import { useState, useEffect } from 'react';
import { useNotificaciones } from '../context/NotificacionesContext';
import { verificarActualizacion, descargarActualizacion, obtenerVersionActual } from '../utils/actualizador';

function Actualizador({ onActualizacionCompleta }) {
  const { showToast } = useNotificaciones();
  const [mostrarActualizacion, setMostrarActualizacion] = useState(false);
  const [actualizando, setActualizando] = useState(false);
  const [infoActualizacion, setInfoActualizacion] = useState(null);

  useEffect(() => {
    // Verificar actualización al cargar
    const verificar = async () => {
      const resultado = await verificarActualizacion();
      if (resultado.hayActualizacion) {
        setInfoActualizacion(resultado);
        setMostrarActualizacion(true);
      }
    };

    // Verificar después de 2 segundos para no interrumpir la carga inicial
    const timer = setTimeout(verificar, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleActualizar = async () => {
    setActualizando(true);
    try {
      const resultado = await descargarActualizacion(infoActualizacion.url);
      if (resultado.exito) {
        // Recargar la app para aplicar la actualización
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        showToast('Error al actualizar: ' + resultado.error, 'error');
        setActualizando(false);
      }
    } catch (error) {
      showToast('Error al actualizar: ' + error.message, 'error');
      setActualizando(false);
    }
  };

  const handleOmitir = () => {
    setMostrarActualizacion(false);
    // Guardar que se omitió esta versión
    localStorage.setItem('versionOmitida', infoActualizacion.versionNueva);
  };

  if (!mostrarActualizacion || !infoActualizacion) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px'
      }}
    >
      <div
        style={{
          backgroundColor: '#1e3c72',
          borderRadius: '15px',
          padding: '30px',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
          border: '2px solid #2a4a7a',
          textAlign: 'center'
        }}
      >
        <div style={{ fontSize: '3em', marginBottom: '15px' }}>🔄</div>
        <h2 style={{ color: 'var(--color-text)', marginBottom: '15px', fontSize: '1.5em' }}>
          Actualización Disponible
        </h2>
        <p style={{ color: '#ccc', marginBottom: '10px', fontSize: '0.95em' }}>
          Versión actual: <strong>{infoActualizacion.versionActual}</strong>
        </p>
        <p style={{ color: '#ccc', marginBottom: '25px', fontSize: '0.95em' }}>
          Nueva versión: <strong style={{ color: '#4CAF50' }}>{infoActualizacion.versionNueva}</strong>
        </p>
        <p style={{ color: 'var(--color-text)', marginBottom: '25px', fontSize: '0.9em', lineHeight: '1.5' }}>
          Hay una nueva versión disponible con mejoras y correcciones.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={handleActualizar}
            disabled={actualizando}
            style={{
              backgroundColor: actualizando ? '#666' : '#4CAF50',
              color: 'var(--color-text)',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1em',
              fontWeight: '600',
              cursor: actualizando ? 'not-allowed' : 'pointer',
              flex: 1,
              transition: 'all 0.3s ease'
            }}
          >
            {actualizando ? 'Actualizando...' : 'Actualizar Ahora'}
          </button>
          <button
            onClick={handleOmitir}
            disabled={actualizando}
            style={{
              backgroundColor: 'transparent',
              color: '#ccc',
              border: '2px solid #666',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1em',
              fontWeight: '600',
              cursor: actualizando ? 'not-allowed' : 'pointer',
              flex: 1,
              transition: 'all 0.3s ease'
            }}
          >
            Más Tarde
          </button>
        </div>
      </div>
    </div>
  );
}

export default Actualizador;



