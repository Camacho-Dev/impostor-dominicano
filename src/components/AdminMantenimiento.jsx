import { useState, useEffect } from 'react';
import {
  obtenerEstadoMantenimiento,
  actualizarMantenimiento,
  actualizarBloqueados,
  actualizarPrecios,
  PRECIOS_DEFAULT
} from '../utils/mantenimiento';
import { listarSesionesRecientes } from '../utils/sessionRegistry';

const TOKEN_KEY = 'impostor_admin_token';

// ─── Detección de escritorio ───────────────────────────────────────────────
function esEscritorio() {
  const ua = navigator.userAgent || '';
  const esMovilUA = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const anchoGrande = window.innerWidth >= 768;
  return !esMovilUA && anchoGrande;
}

// ─── Pantalla de bloqueo para móvil ───────────────────────────────────────
function BloqueadoEnMovil() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      color: '#fff',
      textAlign: 'center',
      gap: '16px'
    }}>
      <div style={{ fontSize: '4em' }}>🖥️</div>
      <h1 style={{ fontSize: '1.5em', fontWeight: '800', margin: 0 }}>
        Panel de administración
      </h1>
      <p style={{ fontSize: '1em', opacity: 0.75, maxWidth: '320px', lineHeight: '1.6', margin: 0 }}>
        Este panel solo está disponible desde un ordenador. Ábrelo en tu PC o Mac para acceder.
      </p>
      <a
        href={import.meta.env.BASE_URL || '/'}
        style={{
          marginTop: '8px',
          padding: '12px 28px',
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '12px',
          color: '#fff',
          textDecoration: 'none',
          fontSize: '0.95em',
          fontWeight: '600'
        }}
      >
        ← Volver al juego
      </a>
    </div>
  );
}

// ─── Componente de sección card ─────────────────────────────────────────────
function Card({ children, style }) {
  return (
    <div style={{
      background: 'rgba(0,0,0,0.25)',
      borderRadius: '14px',
      border: '1px solid rgba(255,255,255,0.2)',
      padding: '20px',
      marginBottom: '24px',
      ...style
    }}>
      {children}
    </div>
  );
}

// ─── Campo numérico con label ───────────────────────────────────────────────
function CampoNumero({ label, value, onChange, prefix = '$', step = '0.01', min = '0' }) {
  return (
    <div style={{ flex: 1 }}>
      <label style={{ display: 'block', fontSize: '0.8em', opacity: 0.75, marginBottom: '6px', fontWeight: '600' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
          opacity: 0.6, fontSize: '0.9em', pointerEvents: 'none'
        }}>{prefix}</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          step={step}
          min={min}
          style={{
            width: '100%',
            padding: '10px 10px 10px 22px',
            borderRadius: '10px',
            border: '2px solid rgba(255,255,255,0.25)',
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            fontSize: '1em',
            fontWeight: '700',
            boxSizing: 'border-box'
          }}
        />
      </div>
    </div>
  );
}

// ─── Sección de precio de un plan ──────────────────────────────────────────
function SeccionPlan({ titulo, emoji, plan, onChange, guardando }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.12)',
      padding: '16px',
      marginBottom: '16px'
    }}>
      <div style={{ fontWeight: '700', fontSize: '1em', marginBottom: '14px' }}>
        {emoji} {titulo}
      </div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <CampoNumero
          label="Precio total"
          value={plan.precio}
          onChange={(v) => onChange({ ...plan, precio: v })}
        />
        <CampoNumero
          label="Precio / semana (muestra)"
          value={plan.precioSemana}
          onChange={(v) => onChange({ ...plan, precioSemana: v })}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.8em', opacity: 0.75, marginBottom: '6px', fontWeight: '600' }}>
          Texto de oferta (opcional) — ej: 93% DE DESCUENTO
        </label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="text"
            value={plan.oferta || ''}
            onChange={(e) => onChange({ ...plan, oferta: e.target.value })}
            placeholder="Deja vacío para no mostrar oferta"
            maxLength={60}
            disabled={guardando}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: '10px',
              border: '2px solid rgba(255,255,255,0.25)',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: '0.9em',
              boxSizing: 'border-box'
            }}
          />
          {plan.oferta && (
            <button
              type="button"
              onClick={() => onChange({ ...plan, oferta: '' })}
              title="Quitar oferta"
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(220,38,38,0.5)',
                background: 'rgba(220,38,38,0.2)',
                color: '#fca5a5',
                cursor: 'pointer',
                fontSize: '0.85em',
                flexShrink: 0
              }}
            >
              ✕ Quitar
            </button>
          )}
        </div>
        {plan.oferta && (
          <div style={{
            marginTop: '8px',
            display: 'inline-block',
            background: 'linear-gradient(135deg, #84cc16, #65a30d)',
            color: '#fff',
            fontSize: '0.75em',
            fontWeight: '800',
            padding: '4px 12px',
            borderRadius: '6px',
            letterSpacing: '0.05em'
          }}>
            ⚡ {plan.oferta}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Componente principal ───────────────────────────────────────────────────
function AdminMantenimiento() {
  const [esPC, setEsPC] = useState(() => esEscritorio());

  useEffect(() => {
    const handleResize = () => setEsPC(esEscritorio());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!esPC) return <BloqueadoEnMovil />;

  return <AdminContent />;
}

function AdminContent() {
  // ── Mantenimiento ──
  const [activo, setActivo] = useState(false);
  const [mensaje, setMensaje] = useState('Estamos mejorando el juego. ¡Vuelve pronto!');

  // ── Token ──
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [mostrarToken, setMostrarToken] = useState(false);
  const [tokenTemporal, setTokenTemporal] = useState('');

  // ── Feedback ──
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [exitoTimeout, setExitoTimeout] = useState(null);

  // ── Bloqueos ──
  const [blockedIds, setBlockedIds] = useState([]);
  const [blockedIps, setBlockedIps] = useState([]);
  const [nuevoBloqueo, setNuevoBloqueo] = useState('');
  const [tipoBloqueo, setTipoBloqueo] = useState('id');
  const [guardandoBloqueados, setGuardandoBloqueados] = useState(false);

  // ── Sesiones ──
  const [sesiones, setSesiones] = useState([]);
  const [sesionesCargando, setSesionesCargando] = useState(false);

  // ── Precios ──
  const [planAnual, setPlanAnual] = useState({ ...PRECIOS_DEFAULT.anual });
  const [planSemanal, setPlanSemanal] = useState({ ...PRECIOS_DEFAULT.semanal });
  const [guardandoPrecios, setGuardandoPrecios] = useState(false);

  // ── Tab activo ──
  const [tab, setTab] = useState('mantenimiento'); // 'mantenimiento' | 'precios' | 'bloqueos'

  // ─── Carga inicial ────────────────────────────────────────────────────────
  useEffect(() => {
    const cargar = async () => {
      const estado = await obtenerEstadoMantenimiento();
      if (estado) {
        setActivo(estado.activo);
        setMensaje(estado.mensaje || '');
        setBlockedIds(estado.blockedIds || []);
        setBlockedIps(estado.blockedIps || []);
        if (estado.precios) {
          setPlanAnual({ ...PRECIOS_DEFAULT.anual, ...estado.precios.anual });
          setPlanSemanal({ ...PRECIOS_DEFAULT.semanal, ...estado.precios.semanal });
        }
      }
      setCargando(false);
      try {
        setSesionesCargando(true);
        const lista = await listarSesionesRecientes();
        setSesiones(lista);
      } catch (_) {
        setSesiones([]);
      } finally {
        setSesionesCargando(false);
      }
    };
    cargar();
  }, []);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const mostrarExito = (msg) => {
    setExito(msg);
    if (exitoTimeout) clearTimeout(exitoTimeout);
    setExitoTimeout(setTimeout(() => setExito(''), 3500));
  };

  const tokenActivo = token?.trim() || (mostrarToken ? tokenTemporal.trim() : '');
  const necesitaToken = !token?.trim() || mostrarToken;
  const getToken = () => (necesitaToken && tokenTemporal.trim()) ? tokenTemporal : token;

  const guardarToken = (t) => {
    localStorage.setItem(TOKEN_KEY, t.trim());
    setToken(t.trim());
    setTokenTemporal('');
    setMostrarToken(false);
  };

  // ─── Mantenimiento ────────────────────────────────────────────────────────
  const guardarMantenimiento = async (nuevoActivo, nuevoMensaje, tokenAUsar) => {
    const t = tokenAUsar ?? getToken();
    if (!t?.trim()) { setMostrarToken(true); setError('Ingresa tu token primero.'); return false; }
    setError(''); setGuardando(true);
    try {
      await actualizarMantenimiento(t.trim(), { activo: nuevoActivo, mensaje: nuevoMensaje });
      guardarToken(t.trim());
      setActivo(nuevoActivo);
      setMensaje(nuevoMensaje);
      mostrarExito(nuevoActivo ? '✅ Mantenimiento ACTIVADO. Todos verán el mensaje.' : '✅ Mantenimiento desactivado.');
      return true;
    } catch (err) {
      setError(err.message || 'Error al guardar. ¿Token válido?');
      if (err.message?.includes('401') || err.message?.includes('Bad credentials')) {
        localStorage.removeItem(TOKEN_KEY); setToken('');
      }
      return false;
    } finally { setGuardando(false); }
  };

  const handleSwitch = () => {
    const t = getToken();
    guardarMantenimiento(!activo, mensaje, t || undefined);
  };

  const handleGuardarMensaje = (e) => {
    e?.preventDefault?.();
    guardarMantenimiento(activo, mensaje, getToken() || undefined);
  };

  // ─── Precios ──────────────────────────────────────────────────────────────
  const handleGuardarPrecios = async () => {
    const t = getToken();
    if (!t?.trim()) { setMostrarToken(true); setError('Ingresa tu token primero.'); return; }
    setError(''); setGuardandoPrecios(true);
    try {
      await actualizarPrecios(t.trim(), {
        anual: {
          precio: parseFloat(planAnual.precio) || PRECIOS_DEFAULT.anual.precio,
          precioSemana: parseFloat(planAnual.precioSemana) || PRECIOS_DEFAULT.anual.precioSemana,
          oferta: planAnual.oferta?.trim() || null
        },
        semanal: {
          precio: parseFloat(planSemanal.precio) || PRECIOS_DEFAULT.semanal.precio,
          precioSemana: parseFloat(planSemanal.precioSemana) || PRECIOS_DEFAULT.semanal.precioSemana,
          oferta: planSemanal.oferta?.trim() || null
        }
      });
      guardarToken(t.trim());
      mostrarExito('✅ Precios actualizados. Los usuarios verán los nuevos precios al refrescar.');
    } catch (err) {
      setError(err.message || 'Error al guardar precios.');
      if (err.message?.includes('401') || err.message?.includes('Bad credentials')) {
        localStorage.removeItem(TOKEN_KEY); setToken('');
      }
    } finally { setGuardandoPrecios(false); }
  };

  const resetearPrecios = () => {
    setPlanAnual({ ...PRECIOS_DEFAULT.anual });
    setPlanSemanal({ ...PRECIOS_DEFAULT.semanal });
  };

  // ─── Bloqueos ─────────────────────────────────────────────────────────────
  const t = tokenActivo;

  const handleAgregarBloqueo = async () => {
    const valor = nuevoBloqueo.trim();
    if (!valor) return;
    if (!t) { setMostrarToken(true); setError('Ingresa tu token para poder bloquear.'); return; }
    setError(''); setGuardandoBloqueados(true);
    try {
      if (tipoBloqueo === 'id') {
        if (blockedIds.includes(valor)) { mostrarExito('Ese ID ya está bloqueado.'); setNuevoBloqueo(''); return; }
        await actualizarBloqueados(t, { deviceIds: [...blockedIds, valor], ips: blockedIps });
        setBlockedIds(prev => [...prev, valor]);
      } else {
        if (blockedIps.includes(valor)) { mostrarExito('Esa IP ya está bloqueada.'); setNuevoBloqueo(''); return; }
        await actualizarBloqueados(t, { deviceIds: blockedIds, ips: [...blockedIps, valor] });
        setBlockedIps(prev => [...prev, valor]);
      }
      setNuevoBloqueo('');
      mostrarExito('✅ Añadido a la lista de bloqueados.');
    } catch (err) {
      setError(err.message || 'Error al guardar bloqueo.');
    } finally { setGuardandoBloqueados(false); }
  };

  const handleQuitarBloqueo = async (tipo, valor) => {
    if (!t?.trim()) { setMostrarToken(true); return; }
    setError(''); setGuardandoBloqueados(true);
    try {
      if (tipo === 'id') {
        await actualizarBloqueados(t, { deviceIds: blockedIds.filter(x => x !== valor), ips: blockedIps });
        setBlockedIds(prev => prev.filter(x => x !== valor));
      } else {
        await actualizarBloqueados(t, { deviceIds: blockedIds, ips: blockedIps.filter(x => x !== valor) });
        setBlockedIps(prev => prev.filter(x => x !== valor));
      }
      mostrarExito('✅ Desbloqueado.');
    } catch (err) {
      setError(err.message || 'Error al desbloquear.');
    } finally { setGuardandoBloqueados(false); }
  };

  const cargarSesiones = async () => {
    setSesionesCargando(true);
    try { const lista = await listarSesionesRecientes(); setSesiones(lista); } catch (_) { setSesiones([]); }
    finally { setSesionesCargando(false); }
  };

  const bloquearDesdeSesion = async (deviceId, ip) => {
    if (!t?.trim()) { setMostrarToken(true); return; }
    setError(''); setGuardandoBloqueados(true);
    try {
      const nuevosIds = deviceId && !blockedIds.includes(deviceId) ? [...blockedIds, deviceId] : blockedIds;
      const nuevasIps = ip && !blockedIps.includes(ip) ? [...blockedIps, ip] : blockedIps;
      if (nuevosIds.length > blockedIds.length || nuevasIps.length > blockedIps.length) {
        await actualizarBloqueados(t, { deviceIds: nuevosIds, ips: nuevasIps });
        if (deviceId && !blockedIds.includes(deviceId)) setBlockedIds(prev => [...prev, deviceId]);
        if (ip && !blockedIps.includes(ip)) setBlockedIps(prev => [...prev, ip]);
        mostrarExito('✅ Bloqueado. Ese dispositivo ya no podrá jugar.');
      }
    } catch (err) {
      setError(err.message || 'Error al bloquear.');
    } finally { setGuardandoBloqueados(false); }
  };

  // ─── UI ───────────────────────────────────────────────────────────────────
  const tabStyle = (id) => ({
    padding: '10px 22px',
    borderRadius: '10px',
    border: tab === id ? '2px solid rgba(167,139,250,0.8)' : '2px solid rgba(255,255,255,0.15)',
    background: tab === id ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.06)',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: tab === id ? '700' : '500',
    fontSize: '0.9em',
    transition: 'all 0.2s'
  });

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '2px solid rgba(255,255,255,0.25)',
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: '0.95em',
    boxSizing: 'border-box'
  };

  const btnPrimary = (disabled) => ({
    padding: '11px 22px',
    background: disabled ? 'rgba(167,139,250,0.3)' : 'linear-gradient(135deg, #a78bfa, #7c3aed)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontWeight: '700',
    fontSize: '0.95em',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s'
  });

  if (cargando) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e3c72, #2a5298, #7e22ce)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.1em' }}>
        Cargando panel...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)',
      color: '#fff'
    }}>
      {/* Header fijo */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(15,15,40,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.4em' }}>🔐</span>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.1em' }}>Panel Admin</div>
            <div style={{ fontSize: '0.75em', opacity: 0.6 }}>El Impostor Dominicano</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Estado mantenimiento rápido */}
          <div
            onClick={() => !guardando && handleSwitch()}
            title={activo ? 'Click para desactivar mantenimiento' : 'Click para activar mantenimiento'}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px',
              borderRadius: '20px',
              background: activo ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.1)',
              border: activo ? '1px solid rgba(34,197,94,0.5)' : '1px solid rgba(255,255,255,0.2)',
              cursor: guardando ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              fontSize: '0.85em', fontWeight: '600', userSelect: 'none'
            }}
          >
            <div style={{
              width: '28px', height: '16px', borderRadius: '8px',
              background: activo ? '#22c55e' : 'rgba(255,255,255,0.3)',
              position: 'relative', transition: 'background 0.2s', flexShrink: 0
            }}>
              <div style={{
                width: '12px', height: '12px', borderRadius: '50%', background: '#fff',
                position: 'absolute', top: '2px', left: activo ? '14px' : '2px',
                transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
              }} />
            </div>
            {activo ? '🟢 Mantenimiento ON' : '⚪ Mantenimiento OFF'}
          </div>
          <a href={import.meta.env.BASE_URL || '/'} style={{ color: '#a78bfa', fontSize: '0.85em', textDecoration: 'none', opacity: 0.8 }}>
            ← Juego
          </a>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <button type="button" style={tabStyle('mantenimiento')} onClick={() => setTab('mantenimiento')}>
            🔧 Mantenimiento
          </button>
          <button type="button" style={tabStyle('precios')} onClick={() => setTab('precios')}>
            💰 Precios Premium
          </button>
          <button type="button" style={tabStyle('bloqueos')} onClick={() => setTab('bloqueos')}>
            🚫 Bloqueos {(blockedIds.length + blockedIps.length) > 0 && `(${blockedIds.length + blockedIps.length})`}
          </button>
        </div>

        {/* ── Feedback global ── */}
        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(220,38,38,0.25)', borderRadius: '10px', border: '1px solid rgba(220,38,38,0.5)', marginBottom: '20px' }}>
            ❌ {error}
          </div>
        )}
        {exito && (
          <div style={{ padding: '12px 16px', background: 'rgba(34,197,94,0.25)', borderRadius: '10px', border: '1px solid rgba(34,197,94,0.5)', marginBottom: '20px' }}>
            {exito}
          </div>
        )}

        {/* ── Token (siempre visible si falta) ── */}
        {necesitaToken && (
          <Card style={{ border: '1px solid rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.08)' }}>
            <div style={{ fontWeight: '700', marginBottom: '10px' }}>🔑 Token de GitHub</div>
            <input
              type="password"
              value={tokenTemporal || token}
              onChange={(e) => { setTokenTemporal(e.target.value); setError(''); }}
              placeholder="ghp_... o github_pat_..."
              style={inputStyle}
            />
            <p style={{ fontSize: '0.8em', opacity: 0.7, marginTop: '8px', marginBottom: 0 }}>
              Se guardará en este navegador. Necesitas permisos sobre el Gist.
            </p>
            {token && (
              <button type="button" onClick={() => setMostrarToken(false)}
                style={{ marginTop: '10px', background: 'none', border: 'none', color: '#a78bfa', cursor: 'pointer', textDecoration: 'underline', padding: 0, fontSize: '0.85em' }}>
                Cancelar
              </button>
            )}
          </Card>
        )}

        {token && !mostrarToken && (
          <p style={{ fontSize: '0.82em', opacity: 0.6, marginBottom: '20px' }}>
            ✓ Token guardado.{' '}
            <button type="button" onClick={() => setMostrarToken(true)}
              style={{ background: 'none', border: 'none', color: '#a78bfa', cursor: 'pointer', textDecoration: 'underline', padding: 0, fontSize: '1em' }}>
              Cambiar
            </button>
          </p>
        )}

        {/* ═══════════════ TAB: MANTENIMIENTO ═══════════════ */}
        {tab === 'mantenimiento' && (
          <>
            <Card>
              <h2 style={{ margin: '0 0 16px', fontSize: '1.05em' }}>⚙️ Estado del juego</h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '1em' }}>
                    {activo ? '🟢 Mantenimiento ACTIVO' : '⚪ Mantenimiento desactivado'}
                  </div>
                  <div style={{ fontSize: '0.82em', opacity: 0.65, marginTop: '4px' }}>
                    {activo ? 'Los usuarios ven el mensaje de mantenimiento.' : 'El juego está disponible para todos.'}
                  </div>
                </div>
                <button type="button" onClick={handleSwitch} disabled={guardando}
                  style={{
                    padding: '12px 28px',
                    background: activo ? 'rgba(220,38,38,0.4)' : 'linear-gradient(135deg, #22c55e, #16a34a)',
                    border: 'none', borderRadius: '12px', color: '#fff',
                    fontWeight: '700', fontSize: '1em', cursor: guardando ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s', flexShrink: 0
                  }}>
                  {guardando ? 'Guardando...' : activo ? '⏹ Desactivar' : '▶ Activar'}
                </button>
              </div>
            </Card>

            <Card>
              <h2 style={{ margin: '0 0 12px', fontSize: '1.05em' }}>💬 Mensaje para los jugadores</h2>
              <p style={{ fontSize: '0.85em', opacity: 0.7, marginBottom: '12px', marginTop: 0 }}>
                Este mensaje se muestra cuando el mantenimiento está activo.
              </p>
              <textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Escribe el mensaje que verán todos..."
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
              <button type="button" onClick={handleGuardarMensaje} disabled={guardando}
                style={{ ...btnPrimary(guardando), marginTop: '12px' }}>
                {guardando ? 'Guardando...' : '💾 Guardar mensaje'}
              </button>
            </Card>
          </>
        )}

        {/* ═══════════════ TAB: PRECIOS ═══════════════ */}
        {tab === 'precios' && (
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ margin: 0, fontSize: '1.05em' }}>💰 Precios de los planes Premium</h2>
              <button type="button" onClick={resetearPrecios}
                style={{
                  padding: '8px 16px', background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px',
                  color: '#fff', cursor: 'pointer', fontSize: '0.82em'
                }}>
                ↩ Restaurar por defecto
              </button>
            </div>
            <p style={{ fontSize: '0.85em', opacity: 0.7, marginBottom: '20px', marginTop: '4px' }}>
              Los precios se guardan en tu Gist y los usuarios los ven en tiempo real. El campo "oferta" muestra un banner encima del plan (ej: <em>93% DE DESCUENTO</em>). Déjalo vacío para no mostrar ninguna oferta.
            </p>

            <SeccionPlan
              titulo="Plan Anual"
              emoji="⭐"
              plan={planAnual}
              onChange={setPlanAnual}
              guardando={guardandoPrecios}
            />

            <SeccionPlan
              titulo="Plan Semanal"
              emoji="📅"
              plan={planSemanal}
              onChange={setPlanSemanal}
              guardando={guardandoPrecios}
            />

            {/* Preview */}
            <div style={{
              background: 'rgba(255,255,255,0.05)', borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)', padding: '16px', marginBottom: '20px'
            }}>
              <div style={{ fontSize: '0.8em', opacity: 0.65, marginBottom: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Vista previa para el usuario
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[
                  { ...planAnual, nombre: 'Anual', duracion: '12 meses', destacado: true },
                  { ...planSemanal, nombre: 'Semanal', duracion: '1 semana', destacado: false }
                ].map((p) => (
                  <div key={p.nombre} style={{
                    flex: '1', minWidth: '180px',
                    border: `2px solid ${p.destacado ? '#84cc16' : 'rgba(255,255,255,0.15)'}`,
                    borderRadius: '12px', overflow: 'hidden',
                    background: p.destacado ? 'rgba(132,204,22,0.1)' : 'rgba(255,255,255,0.04)'
                  }}>
                    {p.oferta && (
                      <div style={{
                        background: 'linear-gradient(135deg, #84cc16, #65a30d)',
                        padding: '5px', textAlign: 'center',
                        color: '#fff', fontWeight: '800', fontSize: '0.7em', letterSpacing: '0.05em'
                      }}>
                        ⚡ {p.oferta}
                      </div>
                    )}
                    <div style={{ padding: '12px' }}>
                      <div style={{ fontWeight: '700', marginBottom: '2px' }}>{p.nombre}</div>
                      <div style={{ fontSize: '0.75em', opacity: 0.6, marginBottom: '8px' }}>{p.duracion}</div>
                      <div style={{ fontSize: '1.4em', fontWeight: '900', color: p.destacado ? '#84cc16' : '#fff', lineHeight: 1 }}>
                        ${Number(p.precioSemana).toFixed(2)}
                      </div>
                      <div style={{ fontSize: '0.7em', opacity: 0.5 }}>/semana</div>
                      <div style={{ fontSize: '0.8em', opacity: 0.7, marginTop: '4px' }}>${Number(p.precio).toFixed(2)} total</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button type="button" onClick={handleGuardarPrecios} disabled={guardandoPrecios}
              style={{ ...btnPrimary(guardandoPrecios), width: '100%', padding: '14px' }}>
              {guardandoPrecios ? 'Guardando...' : '💾 Guardar precios'}
            </button>
          </Card>
        )}

        {/* ═══════════════ TAB: BLOQUEOS ═══════════════ */}
        {tab === 'bloqueos' && (
          <>
            {/* Dispositivos activos */}
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                <h2 style={{ margin: 0, fontSize: '1.05em' }}>📱 Dispositivos activos</h2>
                <button type="button" onClick={cargarSesiones} disabled={sesionesCargando}
                  style={{ padding: '8px 16px', fontSize: '0.85em', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '8px', color: '#fff', cursor: sesionesCargando ? 'not-allowed' : 'pointer' }}>
                  {sesionesCargando ? 'Cargando...' : '🔄 Actualizar'}
                </button>
              </div>
              <p style={{ fontSize: '0.85em', opacity: 0.75, marginBottom: '14px', marginTop: 0 }}>
                Dispositivos que han abierto el juego. Bloquea uno y no podrá volver a jugar.
              </p>
              {sesiones.length === 0 && !sesionesCargando && (
                <p style={{ fontSize: '0.9em', opacity: 0.7 }}>No hay sesiones recientes o Firestore no está configurado.</p>
              )}
              {sesiones.length > 0 && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85em' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                        <th style={{ textAlign: 'left', padding: '8px 6px' }}>ID dispositivo</th>
                        <th style={{ textAlign: 'left', padding: '8px 6px' }}>IP</th>
                        <th style={{ textAlign: 'left', padding: '8px 6px' }}>Última vez</th>
                        <th style={{ textAlign: 'left', padding: '8px 6px' }}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sesiones.map((s) => {
                        const ts = s.lastSeen?.toDate?.() || (s.lastSeen?.seconds ? new Date(s.lastSeen.seconds * 1000) : null);
                        const fechaStr = ts ? ts.toLocaleString('es-DO', { dateStyle: 'short', timeStyle: 'short' }) : '—';
                        const yaBloqueadoId = blockedIds.includes(s.deviceId);
                        const yaBloqueadoIp = s.ip && blockedIps.includes(s.ip);
                        const bloqueado = yaBloqueadoId && (!s.ip || yaBloqueadoIp);
                        return (
                          <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <td style={{ padding: '8px 6px' }}>
                              <code style={{ fontSize: '0.8em', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>{s.deviceId}</code>
                            </td>
                            <td style={{ padding: '8px 6px' }}>{s.ip || '—'}</td>
                            <td style={{ padding: '8px 6px', opacity: 0.8 }}>{fechaStr}</td>
                            <td style={{ padding: '8px 6px' }}>
                              <button type="button"
                                onClick={() => bloquearDesdeSesion(s.deviceId, s.ip)}
                                disabled={guardandoBloqueados || bloqueado}
                                style={{
                                  padding: '5px 12px', fontSize: '0.8em',
                                  background: bloqueado ? 'rgba(100,100,100,0.4)' : 'rgba(220,38,38,0.5)',
                                  border: `1px solid ${bloqueado ? 'rgba(255,255,255,0.15)' : 'rgba(220,38,38,0.7)'}`,
                                  borderRadius: '6px', color: '#fff',
                                  cursor: guardandoBloqueados ? 'not-allowed' : 'pointer'
                                }}>
                                {bloqueado ? 'Bloqueado' : 'Bloquear'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>

            {/* Agregar bloqueo manual */}
            <Card>
              <h2 style={{ margin: '0 0 12px', fontSize: '1.05em' }}>🚫 Bloquear / desbloquear</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
                <select
                  value={tipoBloqueo}
                  onChange={(e) => setTipoBloqueo(e.target.value)}
                  style={{ ...inputStyle, width: 'auto', padding: '10px 12px' }}>
                  <option value="id">ID de dispositivo</option>
                  <option value="ip">IP</option>
                </select>
                <input
                  type="text" value={nuevoBloqueo}
                  onChange={(e) => setNuevoBloqueo(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAgregarBloqueo()}
                  placeholder={tipoBloqueo === 'id' ? 'Ej: DEV-abc123...' : 'Ej: 192.168.1.1'}
                  style={{ ...inputStyle, flex: 1, minWidth: '180px', padding: '10px 14px' }}
                />
                <button type="button" onClick={handleAgregarBloqueo}
                  disabled={guardandoBloqueados || !nuevoBloqueo.trim()}
                  style={{
                    padding: '10px 20px', background: 'rgba(220,38,38,0.5)',
                    border: '1px solid rgba(220,38,38,0.7)', borderRadius: '10px',
                    color: '#fff', fontWeight: '700', cursor: guardandoBloqueados ? 'not-allowed' : 'pointer'
                  }}>
                  {guardandoBloqueados ? 'Guardando...' : 'Bloquear'}
                </button>
              </div>

              {(blockedIds.length > 0 || blockedIps.length > 0) && (
                <div>
                  {blockedIds.length > 0 && (
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ fontSize: '0.85em', fontWeight: '700', marginBottom: '8px', opacity: 0.85 }}>
                        IDs bloqueados ({blockedIds.length})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {blockedIds.map((id) => (
                          <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '8px 12px', flexWrap: 'wrap' }}>
                            <code style={{ fontSize: '0.82em', flex: 1, wordBreak: 'break-all' }}>{id}</code>
                            <button type="button" onClick={() => handleQuitarBloqueo('id', id)} disabled={guardandoBloqueados}
                              style={{ padding: '4px 12px', fontSize: '0.8em', background: 'rgba(34,197,94,0.3)', border: '1px solid rgba(34,197,94,0.5)', borderRadius: '6px', color: '#fff', cursor: 'pointer', flexShrink: 0 }}>
                              Desbloquear
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {blockedIps.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.85em', fontWeight: '700', marginBottom: '8px', opacity: 0.85 }}>
                        IPs bloqueadas ({blockedIps.length})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {blockedIps.map((ip) => (
                          <div key={ip} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '8px 12px', flexWrap: 'wrap' }}>
                            <code style={{ fontSize: '0.82em', flex: 1 }}>{ip}</code>
                            <button type="button" onClick={() => handleQuitarBloqueo('ip', ip)} disabled={guardandoBloqueados}
                              style={{ padding: '4px 12px', fontSize: '0.8em', background: 'rgba(34,197,94,0.3)', border: '1px solid rgba(34,197,94,0.5)', borderRadius: '6px', color: '#fff', cursor: 'pointer', flexShrink: 0 }}>
                              Desbloquear
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminMantenimiento;
