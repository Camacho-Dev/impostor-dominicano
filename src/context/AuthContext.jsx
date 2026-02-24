import { createContext, useContext, useState, useEffect } from 'react';
import { signInWithPopup, signInWithRedirect, getRedirectResult, signOut as firebaseSignOut, onAuthStateChanged, browserPopupRedirectResolver } from 'firebase/auth';
import { getAuthInstance, GoogleAuthProvider, tieneConfigFirebase, initFirebaseFromConfig } from '../firebase';

const AuthContext = createContext(null);

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
    const paths = [`${base}/config.json`, '/config.json'];
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
    // Si volvemos de una redirección de Google, completar el inicio de sesión (sin romper si falla)
    const t = setTimeout(() => {
      getRedirectResult(auth)
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    }, 100);
    return () => {
      clearTimeout(t);
      unsub();
    };
  }, [firebaseReady]);

  // Si tras 6 s sigue "redirecting", la redirección pudo fallar (ej. bloqueada)
  useEffect(() => {
    if (!redirecting) return;
    const t = setTimeout(() => setRedirecting(false), 6000);
    return () => clearTimeout(t);
  }, [redirecting]);

  const signInWithGoogle = async () => {
    const auth = getAuthInstance();
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    setRedirecting(true);
    try {
      // Primero intentar popup (muestra la selección de cuenta); si falla, usar redirect
      await signInWithPopup(auth, provider, browserPopupRedirectResolver);
    } catch (e) {
      const code = e?.code || '';
      const msg = String(e?.message || '');
      const useRedirect = code === 'auth/popup-blocked' || code === 'auth/cancelled-popup-request' || msg.includes('invalid') || msg.includes('blocked');
      if (useRedirect) {
        try {
          await signInWithRedirect(auth, provider);
        } catch (e2) {
          setRedirecting(false);
          throw e2;
        }
      } else {
        setRedirecting(false);
        throw e;
      }
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
