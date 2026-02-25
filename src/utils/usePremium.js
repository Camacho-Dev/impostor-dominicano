/**
 * Hook y utilidades para verificar el estado premium del usuario.
 * El premium se guarda en localStorage como 'premiumActivo' = 'true'.
 */
import { useState, useEffect } from 'react';

export function esPremiumActivo() {
  try {
    return localStorage.getItem('premiumActivo') === 'true';
  } catch {
    return false;
  }
}

export function usePremium() {
  const [esPremium, setEsPremium] = useState(esPremiumActivo);

  useEffect(() => {
    // Re-verificar cuando el storage cambia (ej: al activar premium en PantallaPremium)
    const handleStorage = () => setEsPremium(esPremiumActivo());
    window.addEventListener('storage', handleStorage);
    // También escuchar evento custom para cambios en la misma pestaña
    window.addEventListener('premiumChange', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('premiumChange', handleStorage);
    };
  }, []);

  return esPremium;
}

/** Categorías gratuitas (las primeras básicas) */
export const CATEGORIAS_GRATIS = ['comida', 'historia', 'lugares'];

/** Dispara el evento de cambio de premium para actualizar la UI en la misma pestaña */
export function notificarCambioPremium() {
  window.dispatchEvent(new Event('premiumChange'));
}
