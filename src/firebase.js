/**
 * Firebase: solo se inicializa si hay configuración.
 * Variables de entorno (Vite): VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN,
 * VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID
 */
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const tieneConfig = config.apiKey && config.authDomain && config.projectId && config.appId;

let app = null;
let auth = null;

if (tieneConfig) {
  app = initializeApp(config);
  auth = getAuth(app);
}

const tieneConfigFirebase = () => Boolean(tieneConfig);

export { auth, GoogleAuthProvider, tieneConfigFirebase };
