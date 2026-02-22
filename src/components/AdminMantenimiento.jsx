import { useState, useEffect } from 'react';
import { obtenerEstadoMantenimiento, actualizarMantenimiento } from '../utils/mantenimiento';

const TOKEN_KEY = 'impostor_admin_token';

function AdminMantenimiento() {
  const [activo, setActivo] = useState(false);
  const [mensaje, setMensaje] = useState('Estamos mejorando el juego. ¡Vuelve pronto!');
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [mostrarToken, setMostrarToken] = useState(false);
  const [tokenTemporal, setTokenTemporal] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [exitoTimeout, setExitoTimeout] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      const estado = await obtenerEstadoMantenimiento();
      if (estado) {
        setActivo(estado.activo);
        setMensaje(estado.mensaje || '');
      }
      setCargando(false);
    };
    cargar();
  }, []);

  const guardar = async (nuevoActivo, nuevoMensaje, tokenAUsar) => {
    const t = tokenAUsar ?? token;
    if (!t?.trim()) {
      setMostrarToken(true);
      setError('Ingresa tu token una vez para poder activar/desactivar.');
      return false;
    }
    setError('');
    setGuardando(true);
    try {
      await actualizarMantenimiento(t.trim(), { activo: nuevoActivo, mensaje: nuevoMensaje });
      localStorage.setItem(TOKEN_KEY, t.trim());
      setToken(t.trim());
      setTokenTemporal('');
      setMostrarToken(false);
      setActivo(nuevoActivo);
      setMensaje(nuevoMensaje);
      setExito(nuevoActivo ? 'Activado. Todos verán el mensaje.' : 'Desactivado.');
      if (exitoTimeout) clearTimeout(exitoTimeout);
      setExitoTimeout(setTimeout(() => setExito(''), 3000));
      return true;
    } catch (err) {
      setError(err.message || 'Error al guardar. ¿Token válido?');
      if (err.message?.includes('401') || err.message?.includes('Bad credentials')) {
        localStorage.removeItem(TOKEN_KEY);
        setToken('');
      }
      return false;
    } finally {
      setGuardando(false);
    }
  };

  const necesitaToken = !token?.trim() || mostrarToken;

  const handleSwitch = async () => {
    const nuevoActivo = !activo;
    const tokenAUsar = (necesitaToken && tokenTemporal.trim()) ? tokenTemporal : token;
    await guardar(nuevoActivo, mensaje, tokenAUsar || undefined);
  };

  const handleGuardarMensaje = async (e) => {
    e?.preventDefault?.();
    const tokenAUsar = (necesitaToken && tokenTemporal.trim()) ? tokenTemporal : token;
    await guardar(activo, mensaje, tokenAUsar || undefined);
  };

  if (cargando) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff'
      }}>
        Cargando...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)',
      padding: '30px 20px',
      color: '#fff'
    }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '8px' }}>🔐 Panel Admin</h1>
        <p style={{ textAlign: 'center', opacity: 0.9, marginBottom: '28px', fontSize: '0.95em' }}>
          Activa o desactiva el mantenimiento con un solo clic
        </p>

        {/* Switch grande */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '2px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <span style={{ fontSize: '1.1em', fontWeight: '600' }}>
              {activo ? '🟢 Mantenimiento ACTIVO' : '⚪ Mantenimiento desactivado'}
            </span>
            <div
              onClick={() => !guardando && handleSwitch()}
              style={{
                width: '64px',
                height: '34px',
                borderRadius: '17px',
                background: activo ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' : 'rgba(255,255,255,0.3)',
                cursor: guardando ? 'not-allowed' : 'pointer',
                position: 'relative',
                transition: 'background 0.2s',
                flexShrink: 0
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#fff',
                position: 'absolute',
                top: '3px',
                left: activo ? '33px' : '3px',
                transition: 'left 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }} />
            </div>
          </div>
        </div>

        {/* Mensaje */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            Mensaje para los jugadores:
          </label>
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe el mensaje que verán todos..."
            rows={3}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: '2px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: '1em',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
          <button
            type="button"
            onClick={handleGuardarMensaje}
            disabled={guardando}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '0.95em',
              cursor: guardando ? 'not-allowed' : 'pointer'
            }}
          >
            {guardando ? 'Guardando...' : 'Guardar mensaje'}
          </button>
        </div>

        {/* Token: solo si no está guardado o quieren cambiarlo */}
        {necesitaToken && (
          <div style={{
            marginBottom: '20px',
            padding: '16px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.15)'
          }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '0.95em' }}>
              Token de GitHub (solo la primera vez):
            </label>
            <input
              type="password"
              value={tokenTemporal || token}
              onChange={(e) => { setTokenTemporal(e.target.value); setError(''); }}
              placeholder="ghp_... o github_pat_..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '2px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '0.95em',
                boxSizing: 'border-box'
              }}
            />
            <p style={{ fontSize: '0.8em', opacity: 0.8, marginTop: '8px' }}>
              Se guardará en tu navegador para no pedirlo de nuevo.
            </p>
            {token && (
              <button
                type="button"
                onClick={() => setMostrarToken(false)}
                style={{
                  marginTop: '8px',
                  background: 'none',
                  border: 'none',
                  color: '#a78bfa',
                  fontSize: '0.85em',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        )}

        {token && !mostrarToken && (
          <p style={{ fontSize: '0.85em', opacity: 0.7, marginBottom: '16px' }}>
            ✓ Token guardado. <button
              type="button"
              onClick={() => setMostrarToken(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#a78bfa',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0
              }}
            >
              Cambiar token
            </button>
          </p>
        )}

        {error && (
          <div style={{
            padding: '12px',
            background: 'rgba(220, 38, 38, 0.3)',
            borderRadius: '10px',
            marginBottom: '15px',
            border: '1px solid #dc2626'
          }}>
            ❌ {error}
          </div>
        )}

        {exito && (
          <div style={{
            padding: '12px',
            background: 'rgba(34, 197, 94, 0.3)',
            borderRadius: '10px',
            marginBottom: '15px',
            border: '1px solid #22c55e'
          }}>
            ✅ {exito}
          </div>
        )}

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85em', opacity: 0.7 }}>
          <a href={import.meta.env.BASE_URL || '/'} style={{ color: '#a78bfa' }}>
            ← Volver al juego
          </a>
        </p>
      </div>
    </div>
  );
}

export default AdminMantenimiento;
