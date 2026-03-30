/**
 * Hook y utilidades para verificar el estado premium del usuario.
 * El premium se guarda en localStorage como 'premiumActivo' = 'true'.
 *
 * MODO_TODO_GRATIS: temporal; si es true, todas las categorías y modos
 * cuentan como desbloqueados sin verificar localStorage (para volver a
 * cobrar, poner en false).
 */
import { useState, useEffect } from 'react';

/** @type {boolean} */
export const MODO_TODO_GRATIS = true;

export function esPremiumActivo() {
  if (MODO_TODO_GRATIS) return true;
  try {
    return window.localStorage?.getItem('premiumActivo') === 'true';
  } catch {
    return false;
  }
}

export function usePremium() {
  const [esPremium, setEsPremium] = useState(esPremiumActivo);

  useEffect(() => {
    const handleStorage = () => setEsPremium(esPremiumActivo());
    window.addEventListener('storage', handleStorage);
    window.addEventListener('premiumChange', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('premiumChange', handleStorage);
    };
  }, []);

  return esPremium;
}

/** Categorías gratuitas: se desbloquean sin premium */
// Mantener al menos una categoría gratis para que los no-premium puedan jugar.
export const CATEGORIAS_GRATIS = ['comida'];

/** Dispara el evento de cambio de premium para actualizar la UI en la misma pestaña */
export function notificarCambioPremium() {
  window.dispatchEvent(new Event('premiumChange'));
}
