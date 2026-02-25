import { createContext, useContext, useState, useEffect } from 'react';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, browserLocalPersistence, setPersistence, browserPopupRedirectResolver } from 'firebase/auth';
import { getAuthInstance, GoogleAuthProvider, tieneConfigFirebase, initFirebaseFromConfig } from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseReady, setFirebaseReady] = useState(tieneConfigFirebase());
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

  // Suscribirse al estado de auth cuando Firebase esté listo
  useEffect(() => {
    let unsub;
    try {
      const auth = getAuthInstance();
      if (!auth) return;
      unsub = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setLoading(false);
      });
    } catch (e) {
      console.warn('AuthContext: error al configurar auth', e);
      setLoading(false);
    }
    return () => {
      try { if (typeof unsub === 'function') unsub(); } catch (_) {}
    };
  }, [firebaseReady]);

  const signInWithGoogle = async () => {
    const auth = getAuthInstance();
    if (!auth) {
      throw new Error('Firebase no está configurado. Añade .env o public/config.json con las claves de Firebase.');
    }
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await setPersistence(auth, browserLocalPersistence);
      // Siempre usar signInWithPopup (funciona en web y en Capacitor via Chrome Custom Tabs).
      // signInWithRedirect NO funciona en WebViews de Android (ERR_CONNECTION_RESET).
      await signInWithPopup(auth, provider, browserPopupRedirectResolver);
    } catch (e) {
      const code = e?.code || '';
      // Si el popup fue cerrado por el usuario, ignorar silenciosamente
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return;
      }
      throw e;
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
    redirecting: false,
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
