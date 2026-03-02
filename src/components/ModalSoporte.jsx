import { useState } from 'react';
import { getFirestoreInstance, tieneConfigFirebase } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const TIPOS = {
  bug: {
    icon: '🐛',
    titulo: 'Reportar un problema',
    subtitulo: 'Cuéntanos qué pasó y lo corregimos',
    color: '#f87171',
    colorBg: 'rgba(248,113,113,0.12)',
    colorBorder: 'rgba(248,113,113,0.3)',
    campos: [
      { id: 'descripcion', label: '¿Qué pasó?', placeholder: 'Ej: La app se cerró sola cuando intenté ver mi palabra...', tipo: 'textarea', required: true },
      { id: 'pasos', label: '¿Cómo ocurrió? (opcional)', placeholder: 'Ej: Tenía 4 jugadores, modo diabólico, y al presionar la tarjeta...', tipo: 'textarea', required: false },
    ],
    coleccion: 'reportes',
    exitoMsg: '¡Gracias! Tu reporte fue enviado. Lo revisaremos pronto. 🙏',
  },
  sugerencia: {
    icon: '💡',
    titulo: 'Sugerir una palabra',
    subtitulo: 'Propón palabras dominicanas para el juego',
    color: '#fbbf24',
    colorBg: 'rgba(251,191,36,0.12)',
    colorBorder: 'rgba(251,191,36,0.3)',
    campos: [
      { id: 'palabra', label: '¿Cuál es la palabra?', placeholder: 'Ej: Sancocho, Güira, La Romana...', tipo: 'input', required: true },
      { id: 'categoria', label: 'Categoría', placeholder: 'Ej: Comida, Lugares, Música...', tipo: 'input', required: false },
      { id: 'descripcion', label: '¿Por qué debería estar? (opcional)', placeholder: 'Ej: Es una palabra muy típica dominicana que todos conocen...', tipo: 'textarea', required: false },
    ],
    coleccion: 'sugerencias',
    exitoMsg: '¡Genial! Tu sugerencia fue enviada. Si es buena, la agregamos. 🇩🇴',
  },
};

function ModalSoporte({ tipo = 'bug', onClose, deviceId }) {
  const config = TIPOS[tipo];
  const [valores, setValores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState('');

  const handleEnviar = async (e) => {
    e.preventDefault();
    setError('');

    // Validar campos requeridos
    for (const campo of config.campos) {
      if (campo.required && !valores[campo.id]?.trim()) {
        setError(`Por favor completa el campo "${campo.label.replace(' *', '')}"`);
        return;
      }
    }

    setEnviando(true);
    try {
      const datos = {
        tipo,
        ...valores,
        deviceId: deviceId || 'desconocido',
        version: import.meta.env.VITE_APP_VERSION || '1.1.0',
        plataforma: window.Capacitor?.isNativePlatform?.() ? 'android' : 'web',
        userAgent: navigator.userAgent.slice(0, 200),
        fecha: serverTimestamp(),
        leido: false,
      };

      if (tieneConfigFirebase()) {
        const db = getFirestoreInstance();
        if (db) {
          await addDoc(collection(db, config.coleccion), datos);
          setExito(true);
          return;
        }
      }

      // Fallback: si no hay Firebase, intentar por email
      const subject = encodeURIComponent(
        tipo === 'bug'
          ? 'Reporte de problema - El Impostor Dominicano'
          : 'Sugerencia de palabra - El Impostor Dominicano'
      );
      const body = encodeURIComponent(
        Object.entries(valores)
          .map(([k, v]) => `${k}:\n${v}`)
          .join('\n\n') +
        `\n\nApp: ${datos.version} | ${datos.plataforma}`
      );
      window.open(`mailto:brayanfranciscodc@gmail.com?subject=${subject}&body=${body}`, '_blank');
      setExito(true);
    } catch (err) {
      console.error('Error enviando soporte:', err);
      setError('No se pudo enviar. Intenta de nuevo o escríbenos a brayanfranciscodc@gmail.com');
    } finally {
      setEnviando(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 12,
    background: 'rgba(255,255,255,0.06)',
    border: '1.5px solid rgba(255,255,255,0.12)',
    color: 'var(--color-text)',
    fontSize: '0.95em',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    resize: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        zIndex: 3000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: '24px 24px 0 0',
          width: '100%', maxWidth: 480,
          maxHeight: '92dvh', overflowY: 'auto',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: 'env(safe-area-inset-bottom, 20px)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12 }}>
          <div style={{ width: 40, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.2)' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12, flexShrink: 0,
              background: config.colorBg, border: `1.5px solid ${config.colorBorder}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3em'
            }}>
              {config.icon}
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '1.05em' }}>{config.titulo}</div>
              <div style={{ fontSize: '0.75em', opacity: 0.5, marginTop: 1 }}>{config.subtitulo}</div>
            </div>
          </div>
          <button
            type="button" onClick={onClose}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)',
              color: 'var(--color-text)', fontSize: '1.1em',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              touchAction: 'manipulation',
            }}
          >×</button>
        </div>

        <div style={{ padding: '8px 20px 20px' }}>
          {exito ? (
            /* Pantalla de éxito */
            <div style={{ textAlign: 'center', padding: '28px 16px' }}>
              <div style={{ fontSize: '3.5em', marginBottom: 14 }}>✅</div>
              <div style={{ fontWeight: '800', fontSize: '1.15em', marginBottom: 10 }}>¡Enviado!</div>
              <div style={{ opacity: 0.65, lineHeight: 1.6, fontSize: '0.95em', marginBottom: 28 }}>
                {config.exitoMsg}
              </div>
              <button
                type="button" onClick={onClose}
                style={{
                  width: '100%', padding: '15px',
                  background: config.colorBg,
                  border: `1.5px solid ${config.colorBorder}`,
                  borderRadius: 14, color: config.color,
                  fontSize: '1em', fontWeight: '700', cursor: 'pointer',
                  touchAction: 'manipulation',
                }}
              >
                Cerrar
              </button>
            </div>
          ) : (
            /* Formulario */
            <form onSubmit={handleEnviar} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {config.campos.map(campo => (
                <div key={campo.id}>
                  <label style={{ display: 'block', fontSize: '0.82em', fontWeight: '700', opacity: 0.6, marginBottom: 6, letterSpacing: '0.03em' }}>
                    {campo.label}{campo.required && <span style={{ color: config.color }}> *</span>}
                  </label>
                  {campo.tipo === 'textarea' ? (
                    <textarea
                      rows={3}
                      placeholder={campo.placeholder}
                      value={valores[campo.id] || ''}
                      onChange={e => setValores(v => ({ ...v, [campo.id]: e.target.value }))}
                      style={{ ...inputStyle }}
                      onFocus={e => { e.target.style.borderColor = config.color; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder={campo.placeholder}
                      value={valores[campo.id] || ''}
                      onChange={e => setValores(v => ({ ...v, [campo.id]: e.target.value }))}
                      style={{ ...inputStyle }}
                      onFocus={e => { e.target.style.borderColor = config.color; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                    />
                  )}
                </div>
              ))}

              {error && (
                <div style={{
                  background: 'rgba(248,113,113,0.12)',
                  border: '1.5px solid rgba(248,113,113,0.3)',
                  borderRadius: 12, padding: '10px 14px',
                  color: '#f87171', fontSize: '0.85em', fontWeight: '500'
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={enviando}
                style={{
                  width: '100%', padding: '16px',
                  background: enviando ? 'rgba(255,255,255,0.05)' : config.colorBg,
                  border: `1.5px solid ${enviando ? 'rgba(255,255,255,0.1)' : config.colorBorder}`,
                  borderRadius: 14, color: enviando ? 'rgba(255,255,255,0.4)' : config.color,
                  fontSize: '1em', fontWeight: '700',
                  cursor: enviando ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s', touchAction: 'manipulation',
                  marginTop: 4,
                }}
              >
                {enviando ? '⏳ Enviando...' : `${config.icon} Enviar`}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.75em', opacity: 0.35, margin: 0 }}>
                Tu reporte es anónimo y solo lo verá el desarrollador
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalSoporte;
