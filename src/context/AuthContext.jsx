import { createContext, useContext, useState, useEffect } from 'react';
import { signInWithPopup, signInWithRedirect, getRedirectResult, signOut as firebaseSignOut, onAuthStateChanged, browserLocalPersistence, setPersistence, browserPopupRedirectResolver } from 'firebase/auth';
import { getAuthInstance, GoogleAuthProvider, tieneConfigFirebase, initFirebaseFromConfig } from '../firebase';

const AuthContext = createContext(null);

/** Solo true en app nativa (Capacitor/Cordova). En navegador móvil intentamos popup primero para que se pueda elegir cuenta. */
function esAppNativaWebView() {
  if (typeof window === 'undefined') return false;
  return !!(window.Capacitor?.isNativePlatform?.() || window.cordova);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(tieneConfigFirebase());
  const [redirecting, setRedirecting] = useState(false);

  // Cargar Firebase desde config.json si no hay env
  useEffect(() => {
    if (tieneConfigFirebase()) {
      setLoading(false);
      return;
    }
    const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const paths = [
      `${base}/config.json`,
      '/config.json',
      ...(origin ? [`${origin}${base}/config.json`, `${origin}/config.json`] : [])
    ];
    let cancelled = false;
    (async () => {
      for (const path of paths) {
        try {
          const res = await fetch(path, { cache: 'no-store' });
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
    const auth = getAuthInstance();
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    // Completar inicio de sesión tras redirección de Google (hay que llamarlo al cargar la página)
    getRedirectResult(auth)
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
    return () => unsub();
  }, [firebaseReady]);

  // Si tras 6 s sigue "redirecting", la redirección pudo fallar (ej. bloqueada)
  useEffect(() => {
    if (!redirecting) return;
    const t = setTimeout(() => setRedirecting(false), 6000);
    return () => clearTimeout(t);
  }, [redirecting]);

  const signInWithGoogle = async () => {
    const auth = getAuthInstance();
    if (!auth) {
      throw new Error('Firebase no está configurado. Añade .env o public/config.json con las claves de Firebase.');
    }
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    setRedirecting(true);
    try {
      // Persistencia local para que el redirect guarde la sesión al volver
      await setPersistence(auth, browserLocalPersistence);
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
      setRedirecting(false);
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
