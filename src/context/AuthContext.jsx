import { createContext, useContext, useState, useEffect } from 'react';
import { signInWithPopup, signInWithRedirect, getRedirectResult, signOut as firebaseSignOut, onAuthStateChanged, browserPopupRedirectResolver } from 'firebase/auth';
import { getAuthInstance, GoogleAuthProvider, tieneConfigFirebase, initFirebaseFromConfig } from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(tieneConfigFirebase());

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
    // Si volvemos de una redirección de Google, obtener el resultado
    getRedirectResult(auth).catch(() => {});
    return () => unsub();
  }, [firebaseReady]);

  const signInWithGoogle = async () => {
    const auth = getAuthInstance();
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider, browserPopupRedirectResolver);
    } catch (err) {
      const code = err?.code || '';
      const msg = err?.message || '';
      if (code === 'auth/popup-blocked' || code === 'auth/cancelled-popup-request' || msg.includes('invalid') || msg.includes('blocked')) {
        try {
          await signInWithRedirect(auth, provider);
        } catch (e) {
          throw err;
        }
      } else {
        throw err;
      }
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
    signInWithGoogle: async () => {},
    signOut: async () => {},
    tieneAuth: false,
  };
}
