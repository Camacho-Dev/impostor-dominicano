/**
 * Utilidad para pagos premium con Stripe.
 * URL de la API: VITE_STRIPE_API_URL (build) o config.json (runtime) con clave "stripeApiUrl".
 */

let runtimeApiUrl = '';

export function setStripeApiUrl(url) {
  runtimeApiUrl = (url || '').trim();
}

function getApiBase() {
  return runtimeApiUrl || (import.meta.env.VITE_STRIPE_API_URL || '').trim();
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
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { error: data.error || `Error ${res.status}` };
    }
    if (!data.url) {
      return { error: 'No se recibió URL de pago' };
    }
    return { url: data.url };
  } catch (e) {
    return { error: e.message || 'Error de conexión. Comprueba que la API esté desplegada y CORS permita tu origen.' };
  }
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
    const res = await fetch(url);
    const data = await res.json().catch(() => ({}));
    return { valid: Boolean(data.valid), plan: data.plan };
  } catch (e) {
    return { valid: false };
  }
}
