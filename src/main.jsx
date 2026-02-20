import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Sistema automático de limpieza de cache y actualización para Capacitor
if (window.Capacitor || window.cordova) {
  // Prevenir redirección al navegador
  window.addEventListener('beforeunload', (e) => {
    if (window.location.href.includes('github.io') && !window.location.href.includes('impostor-dominicano')) {
      e.preventDefault();
      return false;
    }
  });
  
  // Función para limpiar TODOS los caches y datos
  const clearAllCachesAndData = async () => {
    try {
      // 1. Desregistrar todos los service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(reg => reg.unregister()));
      }
      
      // 2. Eliminar todos los caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      // 3. Limpiar IndexedDB
      if ('indexedDB' in window) {
        try {
          const databases = await indexedDB.databases();
          await Promise.all(databases.map(db => {
            return new Promise((resolve, reject) => {
              const deleteReq = indexedDB.deleteDatabase(db.name);
              deleteReq.onsuccess = () => resolve();
              deleteReq.onerror = () => reject(deleteReq.error);
            });
          }));
        } catch (e) {
          console.log('Error limpiando IndexedDB:', e);
        }
      }
      
      // 4. Limpiar sessionStorage
      sessionStorage.clear();
      
      console.log('✅ Cache y datos limpiados completamente');
      return true;
    } catch (error) {
      console.error('Error limpiando cache:', error);
      return false;
    }
  };
  
  // Verificar y aplicar actualizaciones automáticamente
  const checkAndApplyUpdates = async () => {
    const currentVersion = localStorage.getItem('appVersion') || '0';
    const serverVersion = import.meta.env.VITE_APP_VERSION || '1.1.3';
    
    // Si hay una nueva versión, limpiar TODO y recargar
    if (currentVersion !== serverVersion) {
      console.log(`🔄 Nueva versión detectada: ${currentVersion} -> ${serverVersion}`);
      
      // Guardar datos importantes antes de limpiar
      const importantData = {
        deviceId: localStorage.getItem('deviceId'),
        nombresJugadores: localStorage.getItem('nombresJugadores')
      };
      
      // Limpiar TODO
      await clearAllCachesAndData();
      
      // Restaurar datos importantes
      localStorage.clear();
      if (importantData.deviceId) localStorage.setItem('deviceId', importantData.deviceId);
      if (importantData.nombresJugadores) localStorage.setItem('nombresJugadores', importantData.nombresJugadores);
      localStorage.setItem('appVersion', serverVersion);
      
      // Forzar recarga sin cache
      setTimeout(() => {
        window.location.href = window.location.href.split('?')[0] + '?v=' + Date.now();
      }, 500);
    } else {
      // Guardar versión actual
      localStorage.setItem('appVersion', serverVersion);
    }
  };
  
  // Limpiar cache al iniciar (siempre)
  clearAllCachesAndData();
  
  // Verificar actualizaciones inmediatamente
  setTimeout(checkAndApplyUpdates, 500);
  
  // Verificar cada 20 segundos
  setInterval(checkAndApplyUpdates, 20000);
  
  // También verificar cuando la app vuelve al primer plano
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      setTimeout(checkAndApplyUpdates, 1000);
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

