/**
 * Utilidad para pagos premium con Stripe.
 * URL de la API: VITE_STRIPE_API_URL (build) o config.json (runtime) con clave "stripeApiUrl".
 * En app móvil (Capacitor): si config no carga, se usa esta URL por defecto.
 */
const API_PAGOS_DEFAULT = 'https://impostor-dominicano.vercel.app/api';

let runtimeApiUrl = '';

export function setStripeApiUrl(url) {
  runtimeApiUrl = (url || '').trim();
}

function getApiBase() {
  return (
    runtimeApiUrl ||
    (import.meta.env.VITE_STRIPE_API_URL || '').trim() ||
    (typeof window !== 'undefined' && (window.Capacitor || window.cordova) ? API_PAGOS_DEFAULT : '')
  );
}

export const tienePagosReales = () => Boolean(getApiBase());

/**
 * Carga la URL de la API desde config.json (en la raíz del sitio).
 * Prueba base/config.json y /config.json por si el deploy sirve public en la raíz.
 */
export async function cargarConfigPagos() {
  if (getApiBase()) return;
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const paths = [`${base}/config.json`, '/config.json', `${window.location.origin}${base}/config.json`];
  for (const path of paths) {
    try {
      const res = await fetch(path, { cache: 'no-store' });
      if (!res.ok) continue;
      const data = await res.json().catch(() => ({}));
      if (data.stripeApiUrl) {
        setStripeApiUrl(data.stripeApiUrl);
        return;
      }
    } catch (_) {
      continue;
    }
  }
  // En app móvil (Capacitor/Cordova), si config.json no cargó, usar API por defecto
  if (typeof window !== 'undefined' && (window.Capacitor || window.cordova)) {
    setStripeApiUrl(API_PAGOS_DEFAULT);
  }
}

/**
 * Detecta si la app corre en Capacitor (nativo) para usar HTTP nativo y evitar "Failed to fetch" en WebView.
 */
function esAppNativa() {
  return typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();
}

/**
 * POST a la API: usa CapacitorHttp en app instalada (evita CORS/WebView) o fetch en navegador.
 */
async function postApi(url, body) {
  if (esAppNativa()) {
    const { CapacitorHttp } = await import('@capacitor/core');
    const res = await CapacitorHttp.post({
      url,
      headers: { 'Content-Type': 'application/json' },
      data: body
    });
    let data = res.data;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (_) {
        data = {};
      }
    }
    if (data == null) data = {};
    return { ok: res.status >= 200 && res.status < 300, status: res.status, data };
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

/**
 * Crea una sesión de checkout y devuelve la URL a la que redirigir.
 * @param {'anual'|'semanal'} plan
 * @returns {Promise<{ url: string } | { error: string }>}
 */
export async function crearSesionPago(plan) {
  const apiBase = getApiBase();
  if (!apiBase) {
    return { error: 'No está configurada la API de pagos. Añade public/config.json con "stripeApiUrl" o define VITE_STRIPE_API_URL al construir.' };
  }
  const url = `${apiBase.replace(/\/$/, '')}/create-checkout-session`;
  try {
    const { ok, status, data } = await postApi(url, { plan });
    if (!ok) {
      return { error: data?.error || `Error ${status}` };
    }
    if (!data?.url) {
      return { error: 'No se recibió URL de pago' };
    }
    return { url: data.url };
  } catch (e) {
    const msg = e.message || 'Error de conexión';
    const hint = msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network')
      ? ' Comprueba la URL en config.json (stripeApiUrl), que la API esté desplegada en Vercel y tu conexión.'
      : '';
    return { error: msg + hint };
  }
}

/**
 * GET a la API: usa CapacitorHttp en app nativa o fetch en navegador.
 */
async function getApi(url) {
  if (esAppNativa()) {
    const { CapacitorHttp } = await import('@capacitor/core');
    const res = await CapacitorHttp.get({ url });
    let data = res.data;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (_) {
        data = {};
      }
    }
    if (data == null) data = {};
    return { ok: res.status >= 200 && res.status < 300, data };
  }
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

/**
 * Verifica que una sesión de Stripe esté pagada y devuelve el plan.
 * @param {string} sessionId
 * @returns {Promise<{ valid: boolean, plan?: string }>}
 */
export async function verificarSesionPago(sessionId) {
  const apiBase = getApiBase();
  if (!apiBase || !sessionId) {
    return { valid: false };
  }
  const url = `${apiBase.replace(/\/$/, '')}/verify-session?session_id=${encodeURIComponent(sessionId)}`;
  try {
    const { ok, data } = await getApi(url);
    if (!ok) return { valid: false };
    return { valid: Boolean(data.valid), plan: data.plan };
  } catch (e) {
    return { valid: false };
  }
}
