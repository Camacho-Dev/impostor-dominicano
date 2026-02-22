import { useState, useEffect } from 'react';
import { useNotificaciones } from '../context/NotificacionesContext';

const BASE_URL = import.meta.env.BASE_URL || '/';

function PantallaPremium({ estadoJuego, actualizarEstado, setPantalla }) {
  const { showModal, showToast } = useNotificaciones();
  const [esMovil, setEsMovil] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setEsMovil(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const linkStyle = {
    color: '#a78bfa',
    textDecoration: 'none'
  };

  return (
    <div className="pantalla activa" style={{
      background: 'linear-gradient(165deg, #0f0f1e 0%, #1a1a2e 40%, #16213e 100%)',
      minHeight: '100vh',
      padding: esMovil ? '20px' : '40px',
      overflowY: 'auto'
    }}>
      <button
        onClick={() => setPantalla('inicio')}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          color: '#fff',
          fontSize: '1.5em',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s',
          zIndex: 1000
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
        }}
      >
        ×
      </button>

      <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            fontSize: esMovil ? '1.8em' : '2.5em',
            marginBottom: '15px',
            color: '#fff',
            fontWeight: 'bold',
            lineHeight: '1.2'
          }}>
            👑 Desbloquea el Acceso Premium
          </h1>
          <p style={{ fontSize: '1.1em', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
            Accede a todas las categorías, funciones y modos de juego
          </p>
        </div>

        <div style={{
          background: 'rgba(251, 191, 36, 0.15)',
          border: '2px solid rgba(251, 191, 36, 0.4)',
          borderRadius: '12px',
          padding: '15px 20px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.9em', color: '#fcd34d', margin: 0, fontWeight: '600' }}>
            ⚠️ Modo Demo: Sin pagos reales. Funcionalidad premium disponible localmente.
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
              borderRadius: '8px 8px 0 0',
              padding: '12px 20px',
              textAlign: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '1em'
            }}>
              93% DE DESCUENTO
            </div>
            <div style={{
              border: '3px solid rgba(132, 204, 22, 0.6)',
              borderTop: 'none',
              borderRadius: '0 0 15px 15px',
              padding: '25px',
              background: 'rgba(132, 204, 22, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#fff', marginBottom: '10px' }}>Anual</div>
                <div style={{ fontSize: '1em', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>12 meses</div>
                <div style={{ fontSize: '1.3em', fontWeight: 'bold', color: '#fff' }}>$19.99</div>
              </div>
              <div style={{ textAlign: 'right', paddingLeft: '20px', borderLeft: '2px solid rgba(255,255,255,0.2)' }}>
                <div style={{ fontSize: '0.9em', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>Solo</div>
                <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#84cc16' }}>$0.39</div>
                <div style={{ fontSize: '0.9em', color: 'rgba(255,255,255,0.8)' }}>/semana</div>
              </div>
            </div>
          </div>

          <div style={{
            border: '2px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '15px',
            padding: '25px',
            background: 'rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#fff', marginBottom: '10px' }}>Semanal</div>
              <div style={{ fontSize: '1em', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>1 semana</div>
              <div style={{ fontSize: '1.3em', fontWeight: 'bold', color: '#fff' }}>$4.99</div>
            </div>
            <div style={{ textAlign: 'right', paddingLeft: '20px', borderLeft: '2px solid rgba(255,255,255,0.15)' }}>
              <div style={{ fontSize: '0.9em', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>Total</div>
              <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: 'rgba(255,255,255,0.9)' }}>$4.99</div>
              <div style={{ fontSize: '0.9em', color: 'rgba(255,255,255,0.7)' }}>/semana</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.setItem('premiumActivo', 'true');
            localStorage.setItem('premiumFecha', new Date().toISOString());
            showModal({
              title: '¡Acceso Premium activado!',
              content: (
                <p>
                  (Modo demo - sin pagos reales)
                  <br /><br />
                  Todas las funciones premium están ahora disponibles.
                </p>
              ),
              onClose: () => setPantalla('inicio')
            });
          }}
          style={{
            width: '100%',
            padding: '20px 24px',
            background: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
            border: 'none',
            borderRadius: '15px',
            color: '#000',
            fontSize: '1.3em',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 4px 15px rgba(132, 204, 22, 0.4)',
            marginBottom: '30px'
          }}
        >
          Continuar
        </button>

        <div style={{
          textAlign: 'center',
          fontSize: '0.9em',
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          paddingBottom: '20px'
        }}>
          <a
            href={`${BASE_URL}terminos-servicio.html`}
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Términos de uso
          </a>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
          <a
            href={`${BASE_URL}politica-privacidad.html`}
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            Política de privacidad
          </a>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
          <button
            onClick={() => showToast('Restaurar compras próximamente', 'info')}
            style={{
              background: 'none',
              border: 'none',
              color: '#a78bfa',
              cursor: 'pointer',
              padding: 0,
              fontSize: 'inherit'
            }}
          >
            Restaurar compras
          </button>
        </div>

        <div style={{
          marginTop: '30px',
          textAlign: 'center',
          fontSize: '0.8em',
          color: 'rgba(255,255,255,0.5)',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <p>© 2026 Brayan Camacho. Todos los derechos reservados.</p>
          <p style={{ marginTop: '5px' }}>Creado por: <strong>Brayan Camacho</strong></p>
        </div>
      </div>
    </div>
  );
}

export default PantallaPremium;
