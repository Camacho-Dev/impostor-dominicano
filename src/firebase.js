/**
 * Firebase: se inicializa con variables de entorno (Vite) o con config desde config.json.
 * Env: VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID
 * O en public/config.json: firebaseApiKey, firebaseAuthDomain, firebaseProjectId, firebaseAppId
 */
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const envConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app = null;
let auth = null;
let db = null;
let configLoaded = false;

if (envConfig.apiKey && envConfig.authDomain && envConfig.projectId && envConfig.appId) {
  app = initializeApp(envConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  configLoaded = true;
}

/** Inicializa Firebase con un objeto de config (ej. desde config.json). */
export function initFirebaseFromConfig(c) {
  if (app) return;
  const key = c.firebaseApiKey || c.apiKey;
  const domain = c.firebaseAuthDomain || c.authDomain;
  const project = c.firebaseProjectId || c.projectId;
  const appId = c.firebaseAppId || c.appId;
  if (!key || !domain || !project || !appId) return;
  app = initializeApp({ apiKey: key, authDomain: domain, projectId: project, appId });
  auth = getAuth(app);
  db = getFirestore(app);
  configLoaded = true;
}

export function getAuthInstance() {
  return auth;
}

export function getFirestoreInstance() {
  return db;
}

export const tieneConfigFirebase = () => configLoaded;

export { auth, GoogleAuthProvider };
