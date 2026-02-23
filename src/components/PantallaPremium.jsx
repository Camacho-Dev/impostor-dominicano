import { useState, useEffect } from 'react';
import { useNotificaciones } from '../context/NotificacionesContext';
import Footer from './Footer';
import { tienePagosReales, crearSesionPago } from '../utils/stripePremium';

const BASE_URL = import.meta.env.BASE_URL || '/';

const PLAN_ANUAL = {
  id: 'anual',
  nombre: 'Anual',
  duracion: '12 meses',
  precio: 19.99,
  precioSemana: 0.39,
  descuento: '93% DE DESCUENTO',
  destacado: true
};

const PLAN_SEMANAL = {
  id: 'semanal',
  nombre: 'Semanal',
  duracion: '1 semana',
  precio: 4.99,
  precioSemana: 4.99,
  descuento: null,
  destacado: false
};

function PantallaPremium({ estadoJuego, actualizarEstado, setPantalla }) {
  const { showModal, showToast } = useNotificaciones();
  const [esMovil, setEsMovil] = useState(window.innerWidth <= 768);
  const [planSeleccionado, setPlanSeleccionado] = useState('anual');
  const [pagando, setPagando] = useState(false);

  useEffect(() => {
    const handleResize = () => setEsMovil(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const linkStyle = {
    color: '#a78bfa',
    textDecoration: 'none'
  };

  const handleContinuar = async () => {
    const plan = planSeleccionado === 'anual' ? PLAN_ANUAL : PLAN_SEMANAL;

    if (tienePagosReales()) {
      setPagando(true);
      try {
        const result = await crearSesionPago(plan.id);
        if (result.error) {
          showToast(result.error, 'error', 6000);
          return;
        }
        window.location.href = result.url;
        return;
      } catch (e) {
        showToast(e.message || 'Error al iniciar el pago', 'error');
      } finally {
        setPagando(false);
      }
    }

    // Modo demo: activar sin pago real
    localStorage.setItem('premiumActivo', 'true');
    localStorage.setItem('premiumPlan', plan.id);
    localStorage.setItem('premiumFecha', new Date().toISOString());
    showModal({
      title: '¡Acceso Premium activado!',
      content: (
        <p>
          Plan <strong>{plan.nombre}</strong>: ${plan.precio.toFixed(2)}.
          <br /><br />
          Todas las funciones premium están disponibles.
        </p>
      ),
      onClose: () => setPantalla('inicio')
    });
  };

  return (
    <div className="pantalla activa pantalla-premium" style={{
      minHeight: '100vh',
      padding: esMovil ? '20px' : '40px',
      overflowY: 'auto'
    }}>
      <button
        type="button"
        aria-label="Cerrar"
        onClick={() => setPantalla('inicio')}
        style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
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
          zIndex: 1000
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
        }}
      >
        ×
      </button>

      <div style={{ maxWidth: '600px', margin: '0 auto', paddingTop: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            fontSize: esMovil ? '1.8em' : '2.5em',
            marginBottom: '15px',
            color: 'var(--color-text)',
            fontWeight: 'bold',
            lineHeight: '1.2'
          }}>
            👑 Desbloquea el Acceso Premium
          </h1>
          <p style={{ fontSize: '1.1em', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
            Accede a todas las categorías, funciones y modos de juego
          </p>
        </div>

        <div style={{ marginBottom: '40px' }}>
          {[PLAN_ANUAL, PLAN_SEMANAL].map((plan) => {
            const seleccionado = planSeleccionado === plan.id;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setPlanSeleccionado(plan.id)}
                aria-pressed={seleccionado}
                aria-label={`Seleccionar plan ${plan.nombre}, ${plan.precio} dólares`}
                style={{
                  width: '100%',
                  marginBottom: '20px',
                  padding: 0,
                  border: seleccionado ? '3px solid #84cc16' : '2px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '15px',
                  background: plan.destacado
                    ? (seleccionado ? 'rgba(132, 204, 22, 0.25)' : 'rgba(132, 204, 22, 0.15)')
                    : (seleccionado ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.05)'),
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  boxShadow: seleccionado ? '0 0 0 2px rgba(132, 204, 22, 0.4)' : 'none'
                }}
              >
                {plan.descuento && (
                  <div style={{
                    background: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
                    borderRadius: '12px 12px 0 0',
                    padding: '10px 20px',
                    textAlign: 'center',
                    color: 'var(--color-text)',
                    fontWeight: 'bold',
                    fontSize: '0.9em'
                  }}>
                    {plan.descuento}
                  </div>
                )}
                <div style={{
                  padding: '25px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '15px'
                }}>
                  <div style={{ flex: '1 1 200px' }}>
                    <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: 'var(--color-text)', marginBottom: '8px' }}>
                      {plan.nombre}
                      {seleccionado && <span style={{ marginLeft: '8px', fontSize: '0.6em' }}>✓</span>}
                    </div>
                    <div style={{ fontSize: '1em', color: 'var(--color-text-muted)', marginBottom: '8px' }}>{plan.duracion}</div>
                    <div style={{ fontSize: '1.3em', fontWeight: 'bold', color: 'var(--color-text)' }}>${plan.precio.toFixed(2)}</div>
                  </div>
                  <div style={{ textAlign: 'right', paddingLeft: '20px', borderLeft: '2px solid rgba(255,255,255,0.2)' }}>
                    <div style={{ fontSize: '0.9em', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                      {plan.destacado ? 'Solo' : 'Total'}
                    </div>
                    <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: plan.destacado ? '#84cc16' : 'var(--color-text)' }}>
                      ${plan.precioSemana.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.9em', color: 'var(--color-text-muted)' }}>/semana</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleContinuar}
          disabled={pagando}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '20px 24px',
            background: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
            border: 'none',
            borderRadius: '15px',
            color: '#000',
            fontSize: '1.3em',
            fontWeight: 'bold',
            cursor: pagando ? 'wait' : 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 4px 15px rgba(132, 204, 22, 0.4)',
            marginBottom: '30px',
            opacity: pagando ? 0.8 : 1
          }}
        >
          {pagando ? (
            <>
              <span className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2, marginRight: 10, display: 'inline-block', verticalAlign: 'middle' }} aria-hidden />
              Redirigiendo a pago...
            </>
          ) : tienePagosReales() ? `Pagar con tarjeta – ${planSeleccionado === 'anual' ? 'Anual' : 'Semanal'}` : `Continuar con ${planSeleccionado === 'anual' ? 'Anual' : 'Semanal'}`}
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

        <Footer className="footer-premium" />
      </div>
    </div>
  );
}

export default PantallaPremium;
