/**
 * Registro de sesiones en Firestore para que el admin vea dispositivos activos y pueda bloquearlos.
 * Colección: "sessions". Document ID = deviceId (sanitizado). Campos: deviceId, ip, lastSeen.
 *
 * En Firebase Console: activa Firestore y en Reglas permite leer/escribir la colección "sessions"
 * (ej. allow read, write: if true; para esa colección).
 */
import { getFirestoreInstance, tieneConfigFirebase } from '../firebase';
import { doc, setDoc, collection, getDocs, limit, serverTimestamp } from 'firebase/firestore';

const COLLECTION = 'sessions';

function sanitizeDocId(deviceId) {
  if (!deviceId || typeof deviceId !== 'string') return '';
  return deviceId.replace(/[/.]/g, '_').slice(0, 150);
}

/**
 * Registra o actualiza la sesión del dispositivo (deviceId + IP) en Firestore.
 * Llamar al cargar la app o al empezar a jugar.
 * @param {string} deviceId - ID del dispositivo (localStorage)
 * @param {string} [ip] - IP del cliente (opcional, se puede obtener de /api/my-ip)
 */
export async function registrarSesion(deviceId, ip = '') {
  if (!tieneConfigFirebase()) return;
  const db = getFirestoreInstance();
  if (!db) return;
  const id = sanitizeDocId(deviceId);
  if (!id) return;
  try {
    await setDoc(doc(db, COLLECTION, id), {
      deviceId: String(deviceId).slice(0, 200),
      ip: String(ip).trim().slice(0, 50),
      lastSeen: serverTimestamp()
    }, { merge: true });
  } catch (e) {
    console.warn('Error registrando sesión:', e);
  }
}

/**
 * Actualiza diagnósticos (últimos errores/warnings) para que el admin
 * pueda ver qué está fallando en tiempo real.
 *
 * No se deben mandar logs completos; solo un resumen pequeño.
 * @param {string} deviceId
 * @param {object} diagnostico
 */
export async function actualizarDiagnosticoSesion(deviceId, diagnostico = {}) {
  if (!tieneConfigFirebase()) return;
  const db = getFirestoreInstance();
  if (!db) return;
  const id = sanitizeDocId(deviceId);
  if (!id) return;
  try {
    await setDoc(doc(db, COLLECTION, id), {
      diagnostics: diagnostico,
      lastDiagnosticsAt: serverTimestamp()
    }, { merge: true });
  } catch (e) {
    // Silencioso para no romper el juego
    console.warn('Error actualizando diagnóstico:', e);
  }
}

/**
 * Obtiene la lista de sesiones recientes (dispositivos que han estado jugando).
 * Para el panel admin.
 * @returns {Promise<Array<{ id: string, deviceId: string, ip: string, lastSeen: any }>>}
 */
export async function listarSesionesRecientes() {
  if (!tieneConfigFirebase()) return [];
  const db = getFirestoreInstance();
  if (!db) return [];
  try {
    const ref = collection(db, COLLECTION);
    const snap = await getDocs(ref);
    const list = snap.docs.map(docSnap => {
      const d = docSnap.data();
      const lastSeen = d.lastSeen;
      return {
        id: docSnap.id,
        deviceId: d.deviceId || docSnap.id,
        ip: d.ip || '',
        lastSeen,
        diagnostics: d.diagnostics || null,
        lastDiagnosticsAt: d.lastDiagnosticsAt
      };
    });
    list.sort((a, b) => {
      const ta = a.lastSeen?.toMillis?.() ?? a.lastSeen?.seconds ?? 0;
      const tb = b.lastSeen?.toMillis?.() ?? b.lastSeen?.seconds ?? 0;
      return tb - ta;
    });
    return list.slice(0, 100);
  } catch (e) {
    console.warn('Error listando sesiones:', e);
    return [];
  }
}
