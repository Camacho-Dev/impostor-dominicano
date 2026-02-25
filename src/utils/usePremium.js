/**
 * Hook y utilidades para verificar el estado premium del usuario.
 * El premium se guarda en localStorage como 'premiumActivo' = 'true'.
 */
import { useState, useEffect } from 'react';

export function esPremiumActivo() {
  return true; // MODO PRUEBA: premium activo para todos
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

/** Categorías gratuitas — vacío = todas desbloqueadas temporalmente para pruebas */
export const CATEGORIAS_GRATIS = [];

/** Dispara el evento de cambio de premium para actualizar la UI en la misma pestaña */
export function notificarCambioPremium() {
  window.dispatchEvent(new Event('premiumChange'));
}
