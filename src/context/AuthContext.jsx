import { createContext, useContext, useState, useEffect } from 'react';
import { signInWithPopup, signInWithRedirect, getRedirectResult, signOut as firebaseSignOut, onAuthStateChanged, browserLocalPersistence, setPersistence, browserPopupRedirectResolver } from 'firebase/auth';
import { getAuthInstance, GoogleAuthProvider, tieneConfigFirebase, initFirebaseFromConfig } from '../firebase';

const AuthContext = createContext(null);

/** True en app nativa (APK). En la APK intentamos popup primero; si falla (bloqueado), usamos redirect. */
function esAppNativaWebView() {
  if (typeof window === 'undefined') return false;
  return !!(window.Capacitor?.isNativePlatform?.() || window.cordova);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(tieneConfigFirebase());
  const [redirecting, setRedirecting] = useState(false);

  // Cargar Firebase desde config.json si no hay env (APK carga desde URL remota; asegurar paths absolutos)
  useEffect(() => {
    if (tieneConfigFirebase()) {
      setLoading(false);
      return;
    }
    const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pathBase = base && base !== '/' ? base : '';
    const paths = [
      `${pathBase}/config.json`,
      '/config.json',
      ...(origin ? [`${origin}${pathBase}/config.json`, `${origin}/config.json`] : [])
    ];
    let cancelled = false;
    (async () => {
      for (const path of paths) {
        try {
          const url = path.startsWith('http') ? path : (origin ? origin + path : path);
          const res = await fetch(url, { cache: 'no-store' });
          if (!res.ok) continue;
          const data = await res.json().catch(() => ({}));
          if (data.firebaseApiKey && data.firebaseAuthDomain && data.firebaseProjectId && data.firebaseAppId) {
            initFirebaseFromConfig(data);
            if (!cancelled) setFirebaseReady(true);
            break;
          }
        } catch (_) {}
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  // Suscribirse al estado de auth cuando Firebase esté listo + detectar resultado de redirect
  useEffect(() => {
    let unsub;
    let removeAppListener;
    try {
      const auth = getAuthInstance();
      if (!auth) return;
      unsub = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setLoading(false);
      });
      function applyRedirectResult() {
        getRedirectResult(auth)
          .then(() => setLoading(false))
          .catch(() => setLoading(false));
      }
      applyRedirectResult();
      // En APK, al volver a la app (p. ej. tras redirect) volver a comprobar resultado
      if (window.Capacitor?.Plugins?.App) {
        removeAppListener = window.Capacitor.Plugins.App.addListener('appStateChange', ({ isActive }) => {
          if (isActive) applyRedirectResult();
        });
      } else if (esAppNativaWebView()) {
        const onVisibilityChange = () => {
          if (document.visibilityState === 'visible') applyRedirectResult();
        };
        document.addEventListener('visibilitychange', onVisibilityChange);
        removeAppListener = () => document.removeEventListener('visibilitychange', onVisibilityChange);
      }
    } catch (e) {
      console.warn('AuthContext: error al configurar auth', e);
      setLoading(false);
    }
    return () => {
      try {
        if (typeof unsub === 'function') unsub();
        if (typeof removeAppListener === 'function') removeAppListener();
      } catch (_) {}
    };
  }, [firebaseReady]);

  // Si tras 6 s sigue "redirecting", la redirección pudo fallar (ej. bloqueada)
  useEffect(() => {
    if (!redirecting) return;
    const t = setTimeout(() => setRedirecting(false), 6000);
    return () => clearTimeout(t);
  }, [redirecting]);

  const signInWithGoogle = async () => {
    // Mostrar overlay de inmediato para evitar pantalla en blanco (sobre todo en APK)
    setRedirecting(true);
    // Dar tiempo a que React pinte el overlay antes de hacer el redirect
    await new Promise(r => { requestAnimationFrame(() => setTimeout(r, 50)); });
    const auth = getAuthInstance();
    if (!auth) {
      setRedirecting(false);
      throw new Error('Firebase no está configurado. Añade .env o public/config.json con las claves de Firebase.');
    }
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await setPersistence(auth, browserLocalPersistence);
      // En APK/WebView el popup suele dejar la pantalla en blanco; usar solo redirect
      if (esAppNativaWebView()) {
        await signInWithRedirect(auth, provider);
        return;
      }
      try {
        await signInWithPopup(auth, provider, browserPopupRedirectResolver);
      } catch (e) {
        const code = e?.code || '';
        const msg = String(e?.message || '');
        const useRedirect = code === 'auth/popup-blocked' || code === 'auth/cancelled-popup-request' || code === 'auth/popup-closed-by-user' || msg.includes('invalid') || msg.includes('blocked');
        if (useRedirect) {
          await signInWithRedirect(auth, provider);
        } else {
          setRedirecting(false);
          throw e;
        }
      }
    } catch (e) {
      setRedirecting(false);
      throw e;
    } finally {
      if (!esAppNativaWebView()) setRedirecting(false);
    }
  };

  const signOut = async () => {
    const auth = getAuthInstance();
    if (!auth) return;
    await firebaseSignOut(auth);
  };

  const value = {
    user,
    loading,
    redirecting,
    signInWithGoogle,
    signOut,
    tieneAuth: tieneConfigFirebase() || firebaseReady,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx ?? {
    user: null,
    loading: false,
    redirecting: false,
    signInWithGoogle: async () => {},
    signOut: async () => {},
    tieneAuth: false,
  };
}
