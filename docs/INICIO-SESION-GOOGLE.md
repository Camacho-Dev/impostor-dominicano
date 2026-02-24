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

## 3. Dominios autorizados (Firebase)

En **Firebase Console** → **Authentication** → **Configuración** (Settings) → **Dominios autorizados**, añade:

- `localhost`
- Tu dominio de producción, ej. `camacho-dev.github.io`

## 4. Google Cloud Console (importante: evita pantalla en blanco)

Firebase usa un cliente OAuth de Google Cloud. Si **no** configuras esto, al pulsar "Iniciar sesión con Google" puede quedarse la pantalla en blanco y no verse la selección de cuenta.

1. Entra en [Google Cloud Console](https://console.cloud.google.com/).
2. Arriba, selecciona el proyecto **impostor-dominiciano** (el mismo que en Firebase).
3. Menú ☰ → **APIs y servicios** → **Credenciales**.
4. En **Credenciales de cliente OAuth 2.0**, abre el cliente de tipo **Aplicación web** (lo crea Firebase al activar Google).
5. En **Orígenes JavaScript autorizados** añade exactamente (uno por línea):
   - `http://localhost`
   - `http://localhost:3000`
   - `http://localhost:5173`
   - `https://camacho-dev.github.io`
6. En **URI de redirección autorizados** debe estar (Firebase lo suele añadir):
   - `https://impostor-dominicano.firebaseapp.com/__/auth/handler`
   Si no está, añádelo.
7. Guarda los cambios y espera unos minutos. Prueba de nuevo en la app.

## 5. Uso en la app

- En **Configuración** (⚙️) aparece la sección **Cuenta** con el botón **Iniciar sesión con Google**.
- Tras iniciar sesión se muestran foto, nombre y **Cerrar sesión**.
- En la pantalla principal, si hay sesión, se muestra **Iniciado como [nombre]** (al tocarlo se abre Configuración).

Si no configuras las variables, la funcionalidad de cuenta no se muestra y la app sigue funcionando con normalidad.
