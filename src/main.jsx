import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NotificacionesProvider } from './context/NotificacionesContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { initAdMob } from './services/admob';
import { initLogger } from './utils/logger';
import './index.css';

// Aplicar tema guardado antes del primer render para evitar parpadeo
try {
  const temaGuardado = localStorage.getItem('temaApp');
  if (temaGuardado === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }
} catch (e) {}

// Logger global para capturar errores/caídas en tiempo real
try {
  initLogger();
} catch {}

// Sistema de verificación de actualización para Capacitor
if (window.Capacitor || window.cordova) {
  // Prevenir redirección al navegador
  window.addEventListener('beforeunload', (e) => {
    if (window.location.href.includes('github.io') && !window.location.href.includes('impostor-dominicano')) {
      e.preventDefault();
      return false;
    }
  });
  
  // Obtener versión del servidor haciendo una petición al index.html con no-cache
  const getServerBuildId = async () => {
    try {
      // En GitHub Pages, el `dist/index.html` cambia con el build (hash en el script).
      const url = window.location.origin + window.location.pathname + '?v=' + Date.now();
      const response = await fetch(url, { method: 'GET', cache: 'no-store' });
      const text = await response.text();

      // Ejemplo en dist: /impostor-dominicano/assets/index-BKT9rkgT.js
      const match = text.match(/\/assets\/index-([a-zA-Z0-9_-]+)\.js/);
      return match?.[1] || null;
    } catch (e) {
      return null;
    }
  };
  
  // Verificar y aplicar actualizaciones automáticamente (MÁS AGRESIVO)
  const checkAndApplyUpdates = async () => {
    const current = localStorage.getItem('appVersion') || '';
    const server = await getServerBuildId();
    if (!server) return;

    // Si hay una nueva build, recargar SIN borrar almacenamiento
    if (current !== server) {
      const lastPantalla = localStorage.getItem('lastPantalla') || '';
      const enPartida = ['juego', 'revelar-impostor', 'quien-empieza'].includes(lastPantalla);

      // No recargar mientras juegas: posponer hasta volver a pantalla segura
      if (enPartida) {
        localStorage.setItem('updatePending', server);
        return;
      }

      localStorage.setItem('appVersion', server);
      window.location.reload();
    }
  };
  
  // En APK retrasar la primera verificación para no interferir con getRedirectResult (login con Google)
  const delayPrimeraVerificacion = (window.Capacitor?.isNativePlatform?.() || window.cordova) ? 3500 : 100;
  setTimeout(checkAndApplyUpdates, delayPrimeraVerificacion);
  
  // Verificar cada 5 minutos (evita estresar el WebView)
  setInterval(checkAndApplyUpdates, 300000);
  
  // Al volver al primer plano: solo verificar versión, no limpiar todo (evitar borrar sesión Firebase)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      setTimeout(() => checkAndApplyUpdates(), 1000);
    }
  });
  
  window.addEventListener('focus', () => {
    setTimeout(() => checkAndApplyUpdates(), 1000);
  });
}

// Inicializar AdMob en app nativa (Capacitor no usa deviceready, usa window load)
if (window.Capacitor?.isNativePlatform?.()) {
  // Capacitor está listo cuando el DOM carga — esperar un tick para asegurar plugins listos
  window.addEventListener('load', () => {
    setTimeout(() => initAdMob(), 500);
  }, { once: true });
  // Fallback por si load ya ocurrió
  setTimeout(() => initAdMob(), 1500);
}

// Registrar Service Worker solo en web (no en Capacitor) para PWA
if (!(window.Capacitor || window.cordova) && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    import('virtual:pwa-register').then(({ register }) => {
      register({ immediate: true });
    }).catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <ErrorBoundary>
          <AuthProvider>
            <NotificacionesProvider>
              <App />
            </NotificacionesProvider>
          </AuthProvider>
        </ErrorBoundary>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);

