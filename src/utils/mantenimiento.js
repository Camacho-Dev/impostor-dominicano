// Sistema de mantenimiento - usa GitHub Gist para almacenar el estado
// Solo el admin puede activar/desactivar desde la página secreta

const GIST_ID = import.meta.env.VITE_GIST_ID || '';
const GIST_API = 'https://api.github.com/gists';

/**
 * Obtiene el estado actual de mantenimiento desde GitHub Gist
 * @returns {{ activo: boolean, mensaje: string } | null}
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
    return {
      activo: Boolean(parsed.activo),
      mensaje: String(parsed.mensaje || 'El juego está en mantenimiento. Vuelve pronto.')
    };
  } catch (error) {
    console.warn('Error obteniendo estado de mantenimiento:', error);
    return null;
  }
}

/**
 * Actualiza el estado de mantenimiento (solo admin con token)
 * @param {string} token - GitHub Personal Access Token con permisos gist
 * @param {{ activo: boolean, mensaje: string }} estado
 */
export async function actualizarMantenimiento(token, estado) {
  if (!GIST_ID || !token) {
    throw new Error('Falta configuración (Gist ID o token)');
  }

  const content = JSON.stringify({
    activo: Boolean(estado.activo),
    mensaje: String(estado.mensaje || ''),
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
        'maintenance.json': {
          content
        }
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
 * Verifica si la URL actual es la página de admin (solo tú la conoces)
 */
export function esPaginaAdmin() {
  const adminKey = import.meta.env.VITE_ADMIN_KEY || 'admin-secreto';
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash.replace('#', '').split('?')[0];
  return params.get('admin') === adminKey || hash === `admin-${adminKey}`;
}
