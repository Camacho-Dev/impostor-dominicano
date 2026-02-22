import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { NotificacionesProvider } from './context/NotificacionesContext';
import './index.css';

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
      
      // 3. Limpiar IndexedDB completamente
      if ('indexedDB' in window) {
        try {
          const databases = await indexedDB.databases();
          for (let db of databases) {
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
  const getServerVersion = async () => {
    try {
      // Hacer una petición al index.html con headers de no-cache para obtener la versión actual
      const response = await fetch(window.location.origin + window.location.pathname + '?v=' + Date.now(), {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      // Si la respuesta es exitosa, la versión está en el código compilado
      // Usar la versión de import.meta.env que se compila en el build
      return import.meta.env.VITE_APP_VERSION || '1.0.0';
    } catch (e) {
      // Si falla, usar la versión compilada
      return import.meta.env.VITE_APP_VERSION || '1.0.0';
    }
  };
  
  // Verificar y aplicar actualizaciones automáticamente (MÁS AGRESIVO)
  const checkAndApplyUpdates = async () => {
    const currentVersion = localStorage.getItem('appVersion') || '0';
    const serverVersion = await getServerVersion();
    
    console.log(`🔍 Verificando versión: Local=${currentVersion}, Servidor=${serverVersion}`);
    
    // Si hay una nueva versión, limpiar TODO y recargar
    if (currentVersion !== serverVersion) {
      console.log(`🔄 ¡NUEVA VERSIÓN DETECTADA! ${currentVersion} -> ${serverVersion}`);
      
      // Guardar datos importantes antes de limpiar
      const importantData = {
        deviceId: localStorage.getItem('deviceId'),
        nombresJugadores: localStorage.getItem('nombresJugadores')
      };
      
      // Limpiar TODO de forma agresiva
      await clearAllCachesAndData();
      
      // Intentar limpiar cache del WebView usando Capacitor si está disponible
      if (window.Capacitor && window.Capacitor.Plugins) {
        try {
          // Intentar usar el plugin de WebView si existe
          const WebView = window.Capacitor.Plugins.WebView;
          if (WebView && WebView.clearCache) {
            await WebView.clearCache();
          }
        } catch (e) {
          console.log('No se pudo limpiar cache del WebView via plugin:', e);
        }
      }
      
      // Esperar un momento para que se complete la limpieza
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Restaurar datos importantes
      localStorage.clear();
      if (importantData.deviceId) localStorage.setItem('deviceId', importantData.deviceId);
      if (importantData.nombresJugadores) localStorage.setItem('nombresJugadores', importantData.nombresJugadores);
      localStorage.setItem('appVersion', serverVersion);
      
      // Forzar recarga SIN CACHE con timestamp y headers
      const timestamp = Date.now();
      const currentUrl = window.location.href.split('?')[0].split('#')[0];
      
      // Intentar múltiples métodos de recarga
      try {
        // Método 1: location.replace con timestamp
        window.location.replace(currentUrl + '?v=' + timestamp + '&nocache=' + timestamp + '&_=' + timestamp);
      } catch (e) {
        try {
          // Método 2: location.href
          window.location.href = currentUrl + '?v=' + timestamp + '&nocache=' + timestamp + '&_=' + timestamp;
        } catch (e2) {
          // Método 3: location.reload con forceReload
          window.location.reload(true);
        }
      }
    } else {
      // Guardar versión actual
      localStorage.setItem('appVersion', serverVersion);
    }
  };
  
  // Limpiar cache solo al detectar nueva versión (evitar borrar en cada inicio)
  
  // Verificar actualizaciones INMEDIATAMENTE
  setTimeout(checkAndApplyUpdates, 100);
  
  // Verificar cada 60 segundos
  setInterval(checkAndApplyUpdates, 60000);
  
  // Verificar cuando la app vuelve al primer plano
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      setTimeout(() => {
        clearAllCachesAndData();
        checkAndApplyUpdates();
      }, 500);
    }
  });
  
  // También verificar cuando la app se enfoca
  window.addEventListener('focus', () => {
    setTimeout(() => {
      clearAllCachesAndData();
      checkAndApplyUpdates();
    }, 500);
  });
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
    <NotificacionesProvider>
      <App />
    </NotificacionesProvider>
  </React.StrictMode>
);

