# Configurar modo mantenimiento

Sistema para que puedas mostrar un mensaje de "En mantenimiento" a todos los jugadores, controlado solo por ti.

---

## Opción rápida (automática)

Si tienes un GitHub Token con permiso `gist`:

```powershell
.\configurar-mantenimiento.ps1 -Token "ghp_tu_token_aqui"
```

El script crea el Gist, genera el `.env` y te muestra la URL del panel admin. Después vuelve a compilar (`npm run build`) y desplegar.

---

## Opción manual

### 1. Crear un Gist en GitHub

1. Ve a https://gist.github.com/
2. Crea un nuevo Gist con este contenido exacto:

```json
{
  "activo": false,
  "mensaje": "Estamos mejorando el juego. ¡Vuelve pronto!"
}
```

3. Nombre del archivo: `maintenance.json`
4. Haz clic en "Create public gist"
5. Copia el ID del Gist de la URL (ej: `https://gist.github.com/tu-usuario/abc123def456` → el ID es `abc123def456`)

## 2. Crear un Personal Access Token en GitHub

1. Ve a GitHub → Settings → Developer settings → Personal access tokens
2. Genera un token (classic) con el permiso **gist**
3. Copia el token (solo se muestra una vez)

## 3. Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```
VITE_GIST_ID=tu-id-del-gist-aqui
VITE_ADMIN_KEY=tu-clave-secreta
```

- **VITE_GIST_ID**: El ID del Gist que creaste
- **VITE_ADMIN_KEY**: Una clave secreta que solo tú conozcas (ej: `miClave123`). Será parte de la URL del admin.

## 4. Cómo usar

### Acceder al panel admin (solo tú)

Visita la URL secreta:

```
https://Camacho-Dev.github.io/impostor-dominicano/?admin=tu-clave-secreta
```

O con hash:

```
https://Camacho-Dev.github.io/impostor-dominicano/#admin-tu-clave-secreta
```

(Reemplaza `tu-clave-secreta` por el valor de VITE_ADMIN_KEY)

### Activar mantenimiento

1. Entra al panel admin con la URL secreta
2. Activa el checkbox "Activar modo mantenimiento"
3. Escribe el mensaje que verán los jugadores
4. Pega tu GitHub Token (solo para guardar, no se guarda)
5. Haz clic en "Guardar"

### Desactivar mantenimiento

1. Entra al panel admin
2. Desactiva el checkbox
3. Ingresa tu token y guarda

## Resumen de seguridad

- **Panel admin**: Solo accesible con la URL que incluye tu clave secreta
- **Modificar el mensaje**: Requiere tu GitHub Token (que ingresas cada vez)
- **Los jugadores**: Solo leen el estado, nunca pueden modificarlo
