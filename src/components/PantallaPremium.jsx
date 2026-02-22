import { useState, useEffect } from 'react';
import { useNotificaciones } from '../context/NotificacionesContext';

function PantallaPremium({ estadoJuego, actualizarEstado, setPantalla }) {
  const { showModal, showToast } = useNotificaciones();
  const [esMovil, setEsMovil] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => {
      setEsMovil(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="pantalla activa" style={{ 
      background: '#fff',
      minHeight: '100vh',
      padding: esMovil ? '20px' : '40px',
      overflowY: 'auto'
    }}>
      {/* Botón de cerrar */}
      <button
        onClick={() => setPantalla('inicio')}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'rgba(0, 0, 0, 0.1)',
          border: '2px solid rgba(0, 0, 0, 0.2)',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          color: '#000',
          fontSize: '1.5em',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s',
          zIndex: 1000
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(0, 0, 0, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(0, 0, 0, 0.1)';
        }}
      >
        ×
      </button>

      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        paddingTop: '20px'
      }}>
        {/* Título Principal */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: esMovil ? '1.8em' : '2.5em', 
            marginBottom: '15px', 
            color: '#000',
            fontWeight: 'bold',
            lineHeight: '1.2'
          }}>
            Desbloquea el Acceso Premium
          </h1>
          <p style={{ 
            fontSize: '1.1em', 
            color: '#666',
            margin: 0
          }}>
            Accede a todas las categorías, funciones y modos de juego
          </p>
        </div>
        
        {/* Nota sobre demo */}
        <div style={{
          background: 'rgba(251, 191, 36, 0.15)',
          border: '2px solid rgba(251, 191, 36, 0.4)',
          borderRadius: '12px',
          padding: '15px 20px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <p style={{ 
            fontSize: '0.9em', 
            color: '#92400e',
            margin: 0,
            fontWeight: '600'
          }}>
            ⚠️ Modo Demo: Sin pagos reales. Funcionalidad premium disponible localmente.
          </p>
        </div>

        {/* Opciones de suscripción */}
        <div style={{ marginBottom: '40px' }}>
          {/* Opción Anual */}
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
              borderRadius: '8px 8px 0 0',
              padding: '12px 20px',
              textAlign: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '1em',
              letterSpacing: '0.5px'
            }}>
              93% DE DESCUENTO
            </div>
            <div style={{
              border: '3px solid #84cc16',
              borderTop: 'none',
              borderRadius: '0 0 15px 15px',
              padding: '25px',
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 12px rgba(132, 204, 22, 0.2)'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#000', marginBottom: '10px' }}>
                  Anual
                </div>
                <div style={{ fontSize: '1em', color: '#666', marginBottom: '8px' }}>
                  12 meses
                </div>
                <div style={{ fontSize: '1.3em', fontWeight: 'bold', color: '#000' }}>
                  $19.99
                </div>
              </div>
              <div style={{ 
                textAlign: 'right',
                paddingLeft: '20px',
                borderLeft: '2px solid rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ fontSize: '0.9em', color: '#666', marginBottom: '8px' }}>
                  Solo
                </div>
                <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#84cc16' }}>
                  $0.39
                </div>
                <div style={{ fontSize: '0.9em', color: '#666' }}>
                  /semana
                </div>
              </div>
            </div>
          </div>

          {/* Opción Semanal */}
          <div style={{
            border: '2px solid #e5e7eb',
            borderRadius: '15px',
            padding: '25px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#000', marginBottom: '10px' }}>
                Semanal
              </div>
              <div style={{ fontSize: '1em', color: '#666', marginBottom: '8px' }}>
                1 semana
              </div>
              <div style={{ fontSize: '1.3em', fontWeight: 'bold', color: '#000' }}>
                $4.99
              </div>
            </div>
            <div style={{ 
              textAlign: 'right',
              paddingLeft: '20px',
              borderLeft: '2px solid rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '0.9em', color: '#666', marginBottom: '8px' }}>
                Total
              </div>
              <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#666' }}>
                $4.99
              </div>
              <div style={{ fontSize: '0.9em', color: '#666' }}>
                /semana
              </div>
            </div>
          </div>
        </div>

        {/* Botón Continuar */}
        <button
          onClick={() => {
            // Simular activación premium (solo para demo, sin backend)
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
            marginBottom: '30px',
            letterSpacing: '0.5px'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(132, 204, 22, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(132, 204, 22, 0.4)';
          }}
        >
          Continuar
        </button>

        {/* Enlaces del footer */}
        <div style={{ 
          textAlign: 'center', 
          fontSize: '0.85em', 
          color: '#999',
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          paddingBottom: '20px'
        }}>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              showToast('Términos de uso próximamente', 'info');
            }}
            style={{ color: '#999', textDecoration: 'none' }}
            onMouseEnter={(e) => {
              e.target.style.color = '#666';
              e.target.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#999';
              e.target.style.textDecoration = 'none';
            }}
          >
            Términos de uso
          </a>
          <span>|</span>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              showToast('Política de privacidad próximamente', 'info');
            }}
            style={{ color: '#999', textDecoration: 'none' }}
            onMouseEnter={(e) => {
              e.target.style.color = '#666';
              e.target.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#999';
              e.target.style.textDecoration = 'none';
            }}
          >
            Política de privacidad
          </a>
          <span>|</span>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              showToast('Restaurar compras próximamente', 'info');
            }}
            style={{ color: '#999', textDecoration: 'none' }}
            onMouseEnter={(e) => {
              e.target.style.color = '#666';
              e.target.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#999';
              e.target.style.textDecoration = 'none';
            }}
          >
            Restaurar compras
          </a>
        </div>

        {/* Copyright */}
        <div style={{ 
          marginTop: '30px', 
          textAlign: 'center', 
          fontSize: '0.8em', 
          opacity: 0.7,
          color: '#999',
          paddingTop: '20px',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)'
        }}>
          <p>© 2026 Brayan Camacho. Todos los derechos reservados.</p>
          <p style={{ marginTop: '5px', fontSize: '0.9em' }}>Creado por: <strong>Brayan Camacho</strong></p>
        </div>
      </div>
    </div>
  );
}

export default PantallaPremium;




