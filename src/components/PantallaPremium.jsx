import { useState, useEffect } from 'react';
import { useNotificaciones } from '../context/NotificacionesContext';
import Footer from './Footer';
import { tienePagosReales, crearSesionPago } from '../utils/stripePremium';
import { notificarCambioPremium } from '../utils/usePremium';

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

const FEATURES = [
  { icon: '🗂️', text: 'Todas las categorías desbloqueadas' },
  { icon: '😈', text: 'Modos Diabólicos exclusivos' },
  { icon: '🎲', text: 'Modos Aleatorios avanzados' },
  { icon: '♾️', text: 'Partidas ilimitadas' },
  { icon: '🚫', text: 'Sin anuncios' },
];

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
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'none',
    fontSize: '0.85em'
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

    localStorage.setItem('premiumActivo', 'true');
    localStorage.setItem('premiumPlan', plan.id);
    localStorage.setItem('premiumFecha', new Date().toISOString());
    notificarCambioPremium();
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
    <div
      className="pantalla activa pantalla-premium"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        flexShrink: 0
      }}>
        <button
          type="button"
          aria-label="Cerrar"
          onClick={() => setPantalla('inicio')}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '10px',
            color: 'var(--color-text)',
            padding: '8px 14px',
            cursor: 'pointer',
            fontSize: '0.9em',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
        >
          ← Volver
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ fontWeight: '700', fontSize: '1em', color: 'var(--color-text)', opacity: 0.9 }}>
            Premium
          </span>
        </div>
        <div style={{ width: '80px' }} />
      </div>

      <div style={{
        flex: 1,
        maxWidth: '560px',
        margin: '0 auto',
        padding: esMovil ? '24px 20px 32px' : '40px 24px 40px',
        width: '100%',
        boxSizing: 'border-box'
      }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            background: 'linear-gradient(135deg, rgba(132,204,22,0.3) 0%, rgba(132,204,22,0.1) 100%)',
            border: '2px solid rgba(132,204,22,0.5)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8em',
            margin: '0 auto 16px'
          }}>
            👑
          </div>
          <h1 style={{
            fontSize: esMovil ? '1.7em' : '2.2em',
            fontWeight: '900',
            color: 'var(--color-text)',
            marginBottom: '8px',
            lineHeight: '1.2'
          }}>
            Desbloquea Premium
          </h1>
          <p style={{ fontSize: '1em', color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: '1.5' }}>
            Accede a todas las categorías, funciones y modos de juego
          </p>
        </div>

        {/* Feature list */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px'
        }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9em',
              color: 'var(--color-text)',
              opacity: 0.85
            }}>
              <span style={{ fontSize: '1.1em', flexShrink: 0 }}>{f.icon}</span>
              <span style={{ lineHeight: '1.3' }}>{f.text}</span>
            </div>
          ))}
        </div>

        {/* Plan selector */}
        <div style={{ marginBottom: '20px' }}>
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
                  marginBottom: '12px',
                  padding: 0,
                  border: seleccionado ? '2px solid #84cc16' : '2px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  background: plan.destacado
                    ? (seleccionado ? 'rgba(132,204,22,0.2)' : 'rgba(132,204,22,0.08)')
                    : (seleccionado ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)'),
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  boxShadow: seleccionado ? '0 0 0 3px rgba(132,204,22,0.2)' : 'none',
                  overflow: 'hidden'
                }}
              >
                {plan.descuento && (
                  <div style={{
                    background: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
                    padding: '7px 20px',
                    textAlign: 'center',
                    color: '#fff',
                    fontWeight: '800',
                    fontSize: '0.78em',
                    letterSpacing: '0.06em'
                  }}>
                    ⚡ {plan.descuento}
                  </div>
                )}
                <div style={{
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: seleccionado ? 'none' : '2px solid rgba(255,255,255,0.3)',
                        background: seleccionado ? '#84cc16' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: '0.7em',
                        color: '#000',
                        fontWeight: '900'
                      }}>
                        {seleccionado ? '✓' : ''}
                      </div>
                      <span style={{ fontWeight: '700', fontSize: '1.05em', color: 'var(--color-text)' }}>
                        {plan.nombre}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85em', color: 'rgba(255,255,255,0.5)', paddingLeft: '28px' }}>
                      {plan.duracion}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5em', fontWeight: '900', color: plan.destacado ? '#84cc16' : 'var(--color-text)', lineHeight: '1' }}>
                      ${plan.precioSemana.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.8em', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>
                      /semana
                    </div>
                    <div style={{ fontSize: '0.85em', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                      ${plan.precio.toFixed(2)} total
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA button */}
        <div style={{ marginBottom: '16px' }}>
          {pagando && (
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <div className="loading-spinner" style={{ width: 28, height: 28, borderWidth: 3, margin: '0 auto' }} aria-hidden />
            </div>
          )}
          <button
            type="button"
            onClick={handleContinuar}
            disabled={pagando}
            style={{
              width: '100%',
              padding: '20px 24px',
              background: pagando
                ? 'rgba(132,204,22,0.5)'
                : 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
              border: 'none',
              borderRadius: '16px',
              color: '#000',
              fontSize: '1.15em',
              fontWeight: '800',
              cursor: pagando ? 'wait' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 20px rgba(132,204,22,0.35)',
              letterSpacing: '0.02em'
            }}
            onMouseEnter={(e) => {
              if (!pagando) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(132,204,22,0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(132,204,22,0.35)';
            }}
          >
            {pagando ? (
              <>
                <span className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2, marginRight: 10, display: 'inline-block', verticalAlign: 'middle' }} aria-hidden />
                Redirigiendo al pago...
              </>
            ) : tienePagosReales()
              ? `💳 Pagar – Plan ${planSeleccionado === 'anual' ? 'Anual' : 'Semanal'}`
              : `👑 Continuar con Plan ${planSeleccionado === 'anual' ? 'Anual' : 'Semanal'}`
            }
          </button>
        </div>

        {/* Legal links */}
        <div style={{
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          paddingBottom: '8px'
        }}>
          <a href={`${BASE_URL}terminos-servicio.html`} target="_blank" rel="noopener noreferrer" style={linkStyle}>
            Términos de uso
          </a>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8em' }}>•</span>
          <a href={`${BASE_URL}politica-privacidad.html`} target="_blank" rel="noopener noreferrer" style={linkStyle}>
            Privacidad
          </a>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8em' }}>•</span>
          <button
            onClick={() => showToast('Restaurar compras próximamente', 'info')}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              padding: 0,
              fontSize: '0.85em'
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
