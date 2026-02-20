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
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

