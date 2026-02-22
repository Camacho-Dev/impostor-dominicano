import { useState, useEffect } from 'react';
import { obtenerEstadoMantenimiento, actualizarMantenimiento } from '../utils/mantenimiento';

function AdminMantenimiento() {
  const [activo, setActivo] = useState(false);
  const [mensaje, setMensaje] = useState('Estamos mejorando el juego. ¡Vuelve pronto!');
  const [token, setToken] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

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

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!token.trim()) {
      setError('Necesitas tu GitHub Token para guardar');
      return;
    }
    setError('');
    setExito('');
    setGuardando(true);
    try {
      await actualizarMantenimiento(token.trim(), { activo, mensaje });
      setExito(activo ? 'Mantenimiento ACTIVADO. Todos verán el mensaje.' : 'Mantenimiento desactivado.');
    } catch (err) {
      setError(err.message || 'Error al guardar');
    } finally {
      setGuardando(false);
    }
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
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>🔐 Panel Admin</h1>
        <p style={{ textAlign: 'center', opacity: 0.9, marginBottom: '30px', fontSize: '0.95em' }}>
          Activa el mantenimiento para que todos los jugadores vean tu mensaje
        </p>

        <form onSubmit={handleGuardar}>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: '15px' }}>
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
                style={{ width: '24px', height: '24px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '1.2em', fontWeight: '600' }}>
                Activar modo mantenimiento
              </span>
            </label>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Mensaje para los jugadores:
            </label>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escribe el mensaje que verán todos..."
              rows={4}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '12px',
                border: '2px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '1em',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              GitHub Token (solo para guardar):
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => { setToken(e.target.value); setError(''); }}
              placeholder="ghp_xxxxxxxxxxxx"
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '12px',
                border: '2px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '1em',
                boxSizing: 'border-box'
              }}
            />
            <p style={{ fontSize: '0.85em', opacity: 0.8, marginTop: '8px' }}>
              Crea un token en GitHub → Settings → Developer settings → Personal access tokens (con permiso <code>gist</code>)
            </p>
          </div>

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

          <button
            type="submit"
            disabled={guardando}
            style={{
              width: '100%',
              padding: '18px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '1.1em',
              fontWeight: '600',
              cursor: guardando ? 'not-allowed' : 'pointer',
              opacity: guardando ? 0.7 : 1
            }}
          >
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </form>

        <p style={{ marginTop: '30px', textAlign: 'center', fontSize: '0.85em', opacity: 0.7 }}>
          <a href={import.meta.env.BASE_URL || '/'} style={{ color: '#a78bfa' }}>
            ← Volver al juego
          </a>
        </p>
      </div>
    </div>
  );
}

export default AdminMantenimiento;
