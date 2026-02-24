# Inicio de sesión con Google (Firebase)

La app usa **Firebase Authentication** con el proveedor de Google. Si no configuras Firebase, la sección "Cuenta" no se muestra.

## 1. Crear proyecto en Firebase

1. Entra en [Firebase Console](https://console.firebase.google.com/).
2. Crea un proyecto (o usa uno existente).
3. En **Build → Authentication**, activa **Authentication**.
4. En la pestaña **Sign-in method**, habilita **Google** (y opcionalmente añade tu dominio de producción en "Dominios autorizados").
5. En **Project settings** (engranaje) → **Your apps**, añade una app **Web** (</>). Copia los valores de `apiKey`, `authDomain`, `projectId`, `appId`.

## 2. Variables de entorno (Vite)

Crea un archivo **`.env`** en la raíz del proyecto (junto a `package.json`) con:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_APP_ID=tu_app_id
```

Sustituye por los valores que te dio Firebase. No subas `.env` a Git (debe estar en `.gitignore`).

## 3. Dominios autorizados

En Firebase Console → **Authentication → Sign-in method → Google → Dominios autorizados**, añade:

- `localhost` (ya suele venir).
- Tu dominio de producción, por ejemplo: `tudominio.github.io` o `tudominio.com`.

## 4. Uso en la app

- En **Configuración** (⚙️) aparece la sección **Cuenta** con el botón **Iniciar sesión con Google**.
- Tras iniciar sesión se muestran foto, nombre y **Cerrar sesión**.
- En la pantalla principal, si hay sesión, se muestra **Iniciado como [nombre]** (al tocarlo se abre Configuración).

Si no configuras las variables, la funcionalidad de cuenta no se muestra y la app sigue funcionando con normalidad.
