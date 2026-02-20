import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Deshabilitar service worker en Capacitor para evitar ERR_CONNECTION_REFUSED
if (window.Capacitor || window.cordova) {
  // Prevenir redirección al navegador
  window.addEventListener('beforeunload', (e) => {
    // No permitir navegación fuera de la app
    if (window.location.href.includes('github.io') && !window.location.href.includes('impostor-dominicano')) {
      e.preventDefault();
      return false;
    }
  });
  
  // Estamos en una app móvil, desregistrar cualquier service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        registration.unregister();
      }
    });
  }
  
  // Limpiar TODOS los caches al iniciar
  const clearAllCaches = async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        console.log('✅ Todos los caches limpiados');
      } catch (error) {
        console.error('Error limpiando caches:', error);
      }
    }
  };
  
  // Limpiar cache inmediatamente
  clearAllCaches();
  
  // Forzar recarga si hay una nueva versión disponible
  const checkForUpdates = async () => {
    const currentVersion = localStorage.getItem('appVersion') || '0';
    const serverVersion = import.meta.env.VITE_APP_VERSION || '1.1.2';
    
    if (currentVersion !== serverVersion) {
      console.log(`🔄 Nueva versión detectada: ${currentVersion} -> ${serverVersion}`);
      
      // Limpiar TODOS los caches
      await clearAllCaches();
      
      // Limpiar localStorage excepto datos importantes
      const deviceId = localStorage.getItem('deviceId');
      const nombresJugadores = localStorage.getItem('nombresJugadores');
      localStorage.clear();
      if (deviceId) localStorage.setItem('deviceId', deviceId);
      if (nombresJugadores) localStorage.setItem('nombresJugadores', nombresJugadores);
      
      // Guardar nueva versión
      localStorage.setItem('appVersion', serverVersion);
      
      // Forzar recarga sin cache
      window.location.reload(true);
    } else {
      localStorage.setItem('appVersion', serverVersion);
    }
  };
  
  // Verificar actualizaciones después de un delay
  setTimeout(checkForUpdates, 1000);
  
  // Verificar cada 30 segundos
  setInterval(checkForUpdates, 30000);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

