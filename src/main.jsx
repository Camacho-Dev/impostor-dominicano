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

// Sistema automático AGRESIVO de limpieza de cache y actualización para Capacitor
if (window.Capacitor || window.cordova) {
  // Prevenir redirección al navegador
  window.addEventListener('beforeunload', (e) => {
    if (window.location.href.includes('github.io') && !window.location.href.includes('impostor-dominicano')) {
      e.preventDefault();
      return false;
    }
  });
  
  // Función AGRESIVA para limpiar TODOS los caches y datos
  const clearAllCachesAndData = async () => {
    try {
      console.log('🧹 Iniciando limpieza completa de cache...');
      
      // 1. Desregistrar todos los service workers
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (let registration of registrations) {
            await registration.unregister();
            console.log('✅ Service worker desregistrado');
          }
        } catch (e) {
          console.log('Error desregistrando service workers:', e);
        }
      }
      
      // 2. Eliminar TODOS los caches (múltiples intentos)
      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys();
          console.log(`🗑️ Eliminando ${cacheNames.length} caches...`);
          for (let name of cacheNames) {
            try {
              await caches.delete(name);
              console.log(`✅ Cache eliminado: ${name}`);
            } catch (e) {
              console.log(`Error eliminando cache ${name}:`, e);
            }
          }
          // Intentar de nuevo después de un momento
          setTimeout(async () => {
            const remainingCaches = await caches.keys();
            for (let name of remainingCaches) {
              await caches.delete(name);
            }
          }, 1000);
        } catch (e) {
          console.log('Error eliminando caches:', e);
        }
      }
      
      // 3. Limpiar IndexedDB EXCEPTO Firebase Auth (evitar pantalla blanca al volver del login en APK)
      if ('indexedDB' in window) {
        try {
          const databases = await indexedDB.databases();
          const firebaseDbPrefixes = ['firebase', 'firebaseLocalStorage', 'fcm'];
          for (let db of databases) {
            const isFirebase = firebaseDbPrefixes.some(p => (db.name || '').toLowerCase().startsWith(p));
            if (isFirebase) continue;
            await new Promise((resolve, reject) => {
              const deleteReq = indexedDB.deleteDatabase(db.name);
              deleteReq.onsuccess = () => resolve();
              deleteReq.onerror = () => reject(deleteReq.error);
              deleteReq.onblocked = () => {
                console.log(`IndexedDB ${db.name} bloqueado, reintentando...`);
                setTimeout(() => resolve(), 100);
              };
            });
          }
        } catch (e) {
          console.log('Error limpiando IndexedDB:', e);
        }
      }
      
      // 4. Limpiar sessionStorage
      try {
        sessionStorage.clear();
        console.log('✅ sessionStorage limpiado');
      } catch (e) {
        console.log('Error limpiando sessionStorage:', e);
      }
      
      // 5. Limpiar cache del navegador (forzar no-cache en todas las peticiones)
      if (window.fetch) {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
          const [url, options = {}] = args;
          options.cache = 'no-store';
          options.headers = options.headers || {};
          options.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
          options.headers['Pragma'] = 'no-cache';
          options.headers['Expires'] = '0';
          return originalFetch(url, options);
        };
      }
      
      // 6. Intentar limpiar cache del WebView de Android usando Capacitor
      if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.WebView) {
        try {
          // Intentar limpiar cache del WebView
          const webView = window.Capacitor.getPlatform() === 'android' ? window : null;
          if (webView && webView.clearCache) {
            webView.clearCache(true);
          }
        } catch (e) {
          console.log('No se pudo limpiar cache del WebView:', e);
        }
      }
      
      // 7. Forzar recarga de recursos con timestamp
      const links = document.querySelectorAll('link[rel="stylesheet"], script[src]');
      links.forEach(link => {
        if (link.href || link.src) {
          const url = new URL(link.href || link.src, window.location.href);
          url.searchParams.set('_t', Date.now());
          if (link.href) link.href = url.href;
          if (link.src) link.src = url.href;
        }
      });
      
      console.log('✅ Limpieza completa de cache finalizada');
      return true;
    } catch (error) {
      console.error('❌ Error limpiando cache:', error);
      return false;
    }
  };
  
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

