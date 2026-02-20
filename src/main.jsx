import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Deshabilitar service worker en Capacitor para evitar ERR_CONNECTION_REFUSED
if (window.Capacitor || window.cordova) {
  // Estamos en una app móvil, desregistrar cualquier service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        registration.unregister();
      }
    });
  }
  
  // Limpiar cache cuando se detecta que estamos en Capacitor
  if ('caches' in window) {
    caches.keys().then(function(names) {
      for (let name of names) {
        caches.delete(name);
      }
    });
  }
  
  // Forzar recarga si hay una nueva versión disponible
  const checkForUpdates = () => {
    const currentVersion = localStorage.getItem('appVersion') || '0';
    const serverVersion = import.meta.env.VITE_APP_VERSION || '1.1.1';
    
    if (currentVersion !== serverVersion) {
      // Limpiar todo el cache
      if ('caches' in window) {
        caches.keys().then(function(names) {
          for (let name of names) {
            caches.delete(name);
          }
        });
      }
      // Limpiar localStorage excepto datos importantes
      const deviceId = localStorage.getItem('deviceId');
      const nombresJugadores = localStorage.getItem('nombresJugadores');
      localStorage.clear();
      if (deviceId) localStorage.setItem('deviceId', deviceId);
      if (nombresJugadores) localStorage.setItem('nombresJugadores', nombresJugadores);
      
      // Guardar nueva versión
      localStorage.setItem('appVersion', serverVersion);
      
      // Recargar la página
      window.location.reload(true);
    } else {
      localStorage.setItem('appVersion', serverVersion);
    }
  };
  
  // Verificar actualizaciones después de un delay
  setTimeout(checkForUpdates, 1000);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

