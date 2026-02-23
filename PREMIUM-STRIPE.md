# Pagos reales Premium con Stripe

Para activar pagos reales (tarjeta) en la pantalla Premium necesitas:

## 1. Cuenta Stripe

1. Crea una cuenta en [stripe.com](https://stripe.com).
2. En el Dashboard, activa el modo **Live** cuando vayas a cobrar de verdad (antes puedes usar **Test** con tarjetas de prueba como `4242 4242 4242 4242`).

## 2. Productos y precios en Stripe

1. En Stripe: **Productos** → **Añadir producto**.
2. Crea dos productos:
   - **Premium Anual**: precio único $19.99 USD.
   - **Premium Semanal**: precio único $4.99 USD.
3. Al guardar, Stripe genera un **Price ID** por cada uno (tipo `price_xxxxx`). Copia ambos:
   - Price ID del plan anual.
   - Price ID del plan semanal.

## 3. Desplegar la API (Vercel)

La carpeta `api/` contiene dos funciones que hablan con Stripe:

- `create-checkout-session`: crea la sesión de pago y devuelve la URL de Stripe Checkout.
- `verify-session`: comprueba que el pago se completó y devuelve el plan.

**Opción A – Mismo proyecto en Vercel (recomendado)**

1. Sube el repo a [Vercel](https://vercel.com) (conectar GitHub y desplegar).
2. En el proyecto de Vercel → **Settings** → **Environment Variables** añade:

| Variable | Valor | Uso |
|----------|--------|-----|
| `STRIPE_SECRET_KEY` | `sk_live_xxx` (o `sk_test_xxx`) | Clave secreta de Stripe |
| `STRIPE_PRICE_ANUAL` | `price_xxxxx` | Price ID del plan anual |
| `STRIPE_PRICE_SEMANAL` | `price_xxxxx` | Price ID del plan semanal |
| `APP_URL` | URL de tu app (ej. `https://tu-app.vercel.app` o `https://Camacho-Dev.github.io/impostor-dominicano`) | URL donde Stripe redirige tras el pago |

3. Redespliega para que tome las variables.

**Opción B – Front en GitHub Pages y API en Vercel**

1. Crea un proyecto en Vercel solo con la carpeta `api/` (o un repo que contenga solo esas funciones).
2. Configura las mismas variables que arriba. `APP_URL` debe ser la URL de tu front (GitHub Pages).
3. En el front, define la URL base de la API (ver paso 4).

## 4. Configurar el frontend

Para que la app use la API de pagos:

1. En el **build** del frontend (Vite), define la URL base de la API. Por ejemplo en Vercel (mismo proyecto):

   - **Settings** → **Environment Variables**:
   - Nombre: `VITE_STRIPE_API_URL`
   - Valor: `https://tu-dominio.vercel.app/api` (la misma URL del deploy, con `/api` al final).

   Si la API está en otro dominio, pon esa URL (ej. `https://api-tu-proyecto.vercel.app/api`).

2. Vuelve a hacer **build** y a desplegar el front para que se inyecte `VITE_STRIPE_API_URL`.

Si **no** defines `VITE_STRIPE_API_URL`, la app sigue en **modo demo** (activar premium sin pago real).

## 5. Flujo de pago

1. El usuario elige plan **Anual** o **Semanal** y pulsa **Pagar con tarjeta**.
2. La app llama a `create-checkout-session` y redirige a Stripe Checkout.
3. El usuario paga en Stripe (tarjeta).
4. Stripe redirige a `APP_URL?session_id=cs_xxx`.
5. La app llama a `verify-session` con ese `session_id`; si el pago es válido, guarda premium en `localStorage` y limpia la URL.

## 6. Restaurar compras

El botón “Restaurar compras” en la pantalla Premium aún no está ligado a Stripe. Para soportarlo bien haría falta:

- Identificar al usuario (email o cuenta) en el checkout (Stripe permite enviar `customer_email` o `client_reference_id`).
- Guardar en tu base de datos qué usuario tiene qué plan (y hasta cuándo).
- Que “Restaurar compras” consulte tu backend con el email o ID del usuario y, si tiene compra válida, devolver que está premium (y opcionalmente devolver un token que el front guarde en `localStorage`).

Si quieres, el siguiente paso puede ser diseñar ese flujo (backend mínimo + cómo llamarlo desde el front).
