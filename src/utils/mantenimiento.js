// Sistema de mantenimiento - usa GitHub Gist para almacenar el estado
// Solo el admin puede activar/desactivar y bloquear IDs/IPs desde la página secreta

const GIST_ID = import.meta.env.VITE_GIST_ID || '';
const GIST_API = 'https://api.github.com/gists';

/**
 * Precios por defecto (fallback si el Gist no tiene precios configurados)
 */
export const PRECIOS_DEFAULT = {
  anual: { precio: 19.99, precioSemana: 0.39, oferta: '93% DE DESCUENTO' },
  semanal: { precio: 4.99, precioSemana: 4.99, oferta: null }
};

/**
 * Obtiene el estado completo del Gist (mantenimiento + precios)
 * @returns {{ activo, mensaje, blockedIds, blockedIps, precios } | null}
 */
export async function obtenerEstadoMantenimiento() {
  if (!GIST_ID) return null;

  try {
    const response = await fetch(`${GIST_API}/${GIST_ID}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
      cache: 'no-store'
    });

    if (!response.ok) return null;

    const data = await response.json();
    const file = data.files?.['maintenance.json'] || data.files?.[Object.keys(data.files || {})[0]];

    if (!file?.content) return null;

    const parsed = JSON.parse(file.content);
    const blockedIds = Array.isArray(parsed.blockedIds) ? parsed.blockedIds : [];
    const blockedIps = Array.isArray(parsed.blockedIps) ? parsed.blockedIps : [];

    const precios = parsed.precios || {};

    return {
      activo: Boolean(parsed.activo),
      mensaje: String(parsed.mensaje || 'El juego está en mantenimiento. Vuelve pronto.'),
      blockedIds: blockedIds.filter(Boolean).map(String),
      blockedIps: blockedIps.filter(Boolean).map(String),
      precios: {
        anual: {
          precio: Number(precios.anual?.precio ?? PRECIOS_DEFAULT.anual.precio),
          precioSemana: Number(precios.anual?.precioSemana ?? PRECIOS_DEFAULT.anual.precioSemana),
          oferta: precios.anual?.oferta !== undefined ? (precios.anual.oferta || null) : PRECIOS_DEFAULT.anual.oferta
        },
        semanal: {
          precio: Number(precios.semanal?.precio ?? PRECIOS_DEFAULT.semanal.precio),
          precioSemana: Number(precios.semanal?.precioSemana ?? PRECIOS_DEFAULT.semanal.precioSemana),
          oferta: precios.semanal?.oferta !== undefined ? (precios.semanal.oferta || null) : PRECIOS_DEFAULT.semanal.oferta
        }
      }
    };
  } catch (_) {
    return null;
  }
}

/**
 * Solo obtiene los precios (sin autenticación, para PantallaPremium)
 */
export async function obtenerPrecios() {
  const estado = await obtenerEstadoMantenimiento();
  return estado?.precios ?? PRECIOS_DEFAULT;
}

/**
 * Lee el contenido actual del Gist y devuelve el objeto completo (para no perder bloqueados al actualizar)
 * @private
 */
async function leerGistCompleto(token) {
  const res = await fetch(`${GIST_API}/${GIST_ID}`, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    },
    cache: 'no-store'
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Error ${res.status}`);
  }
  const data = await res.json();
  const file = data.files?.['maintenance.json'];
  if (!file?.content) return { activo: false, mensaje: '', blockedIds: [], blockedIps: [], precios: PRECIOS_DEFAULT };
  const parsed = JSON.parse(file.content);
  return {
    activo: Boolean(parsed.activo),
    mensaje: String(parsed.mensaje || ''),
    blockedIds: Array.isArray(parsed.blockedIds) ? parsed.blockedIds.filter(Boolean).map(String) : [],
    blockedIps: Array.isArray(parsed.blockedIps) ? parsed.blockedIps.filter(Boolean).map(String) : [],
    precios: parsed.precios || PRECIOS_DEFAULT
  };
}

/**
 * Escribe el contenido completo al Gist
 * @private
 */
async function escribirGist(token, payload) {
  const content = JSON.stringify({
    activo: payload.activo,
    mensaje: payload.mensaje,
    blockedIds: payload.blockedIds,
    blockedIps: payload.blockedIps,
    precios: payload.precios || PRECIOS_DEFAULT,
    actualizado: Date.now()
  }, null, 2);

  const response = await fetch(`${GIST_API}/${GIST_ID}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      files: {
        'maintenance.json': { content }
      }
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Error ${response.status}: ${response.statusText}`);
  }
  return true;
}

/**
 * Actualiza el estado de mantenimiento (solo admin con token). Preserva blockedIds y blockedIps.
 * @param {string} token - GitHub Personal Access Token con permisos gist
 * @param {{ activo: boolean, mensaje: string }} estado
 */
export async function actualizarMantenimiento(token, estado) {
  if (!GIST_ID || !token) {
    throw new Error('Falta configuración (Gist ID o token)');
  }
  const actual = await leerGistCompleto(token);
  return escribirGist(token, {
    activo: Boolean(estado.activo),
    mensaje: String(estado.mensaje || ''),
    blockedIds: actual.blockedIds,
    blockedIps: actual.blockedIps,
    precios: actual.precios
  });
}

/**
 * Actualiza las listas de bloqueados (solo desde la página admin con token).
 * @param {string} token - GitHub Personal Access Token
 * @param {{ deviceIds: string[], ips: string[] }} listas - listas completas (reemplazan las actuales)
 */
export async function actualizarBloqueados(token, listas) {
  if (!GIST_ID || !token) {
    throw new Error('Falta configuración (Gist ID o token)');
  }
  const actual = await leerGistCompleto(token);
  const deviceIds = Array.isArray(listas.deviceIds) ? listas.deviceIds.filter(Boolean).map(String) : actual.blockedIds;
  const ips = Array.isArray(listas.ips) ? listas.ips.filter(Boolean).map(String) : actual.blockedIps;
  return escribirGist(token, {
    activo: actual.activo,
    mensaje: actual.mensaje,
    blockedIds: deviceIds,
    blockedIps: ips,
    precios: actual.precios
  });
}

/**
 * Actualiza los precios de los planes premium desde el panel admin.
 * @param {string} token - GitHub Personal Access Token
 * @param {{ anual: { precio, precioSemana, oferta }, semanal: { precio, precioSemana, oferta } }} precios
 */
export async function actualizarPrecios(token, precios) {
  if (!GIST_ID || !token) {
    throw new Error('Falta configuración (Gist ID o token)');
  }
  const actual = await leerGistCompleto(token);
  return escribirGist(token, {
    activo: actual.activo,
    mensaje: actual.mensaje,
    blockedIds: actual.blockedIds,
    blockedIps: actual.blockedIps,
    precios: {
      anual: {
        precio: Number(precios.anual.precio) || PRECIOS_DEFAULT.anual.precio,
        precioSemana: Number(precios.anual.precioSemana) || PRECIOS_DEFAULT.anual.precioSemana,
        oferta: precios.anual.oferta?.trim() || null
      },
      semanal: {
        precio: Number(precios.semanal.precio) || PRECIOS_DEFAULT.semanal.precio,
        precioSemana: Number(precios.semanal.precioSemana) || PRECIOS_DEFAULT.semanal.precioSemana,
        oferta: precios.semanal.oferta?.trim() || null
      }
    }
  });
}

/**
 * Verifica si la URL actual es la página de admin (solo tú la conoces)
 */
export function esPaginaAdmin() {
  const adminKey = import.meta.env.VITE_ADMIN_KEY || 'admin-secreto';
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash.replace('#', '').split('?')[0];
  return params.get('admin') === adminKey || hash === `admin-${adminKey}`;
}
