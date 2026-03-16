/**
 * Vibración háptica: usa navigator.vibrate (Android WebView/Cordova)
 * o Capacitor Haptics si está disponible. Sin dependencias extra.
 */

const VIBRATION_LIGHT = 10;
const VIBRATION_MEDIUM = 20;
const VIBRATION_SUCCESS = [10, 50, 10];

function vibrate(pattern = VIBRATION_LIGHT) {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;
  try {
    navigator.vibrate(pattern);
  } catch (_) {}
}

/** Vibración corta (al tocar tarjeta, cambiar jugador) */
export function vibrateLight() {
  vibrate(VIBRATION_LIGHT);
}

/** Vibración media (al votar, acusar) */
export function vibrateMedium() {
  vibrate(VIBRATION_MEDIUM);
}

/** Patrón de éxito (al revelar impostor, ganar) */
export function vibrateSuccess() {
  vibrate(VIBRATION_SUCCESS);
}

export default { vibrateLight, vibrateMedium, vibrateSuccess };
