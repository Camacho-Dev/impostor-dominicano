/**
 * Crea una sesión de Stripe Checkout para el plan premium elegido.
 * POST /api/create-checkout-session
 * Body: { "plan": "anual" | "semanal" }
 *
 * Requiere en Vercel: STRIPE_SECRET_KEY, STRIPE_PRICE_ANUAL, STRIPE_PRICE_SEMANAL, APP_URL
 */
const Stripe = require('stripe');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
}

function send500(res, message) {
  return res.status(500).json({ error: message });
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const plan = req.body?.plan;
  if (plan !== 'anual' && plan !== 'semanal') {
    return res.status(400).json({ error: 'Plan inválido. Usa "anual" o "semanal".' });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  const priceAnual = process.env.STRIPE_PRICE_ANUAL?.trim();
  const priceSemanal = process.env.STRIPE_PRICE_SEMANAL?.trim();
  const appUrl = (process.env.APP_URL || 'https://Camacho-Dev.github.io/impostor-dominicano').trim();

  if (!secretKey) {
    return send500(res, 'Falta STRIPE_SECRET_KEY en Vercel (Settings → Environment Variables).');
  }
  if (plan === 'anual' && !priceAnual) {
    return send500(res, 'Falta STRIPE_PRICE_ANUAL en Vercel. Crea el precio en Stripe Dashboard y añade el ID (price_xxx).');
  }
  if (plan === 'semanal' && !priceSemanal) {
    return send500(res, 'Falta STRIPE_PRICE_SEMANAL en Vercel. Crea el precio en Stripe Dashboard y añade el ID (price_xxx).');
  }

  const priceId = plan === 'anual' ? priceAnual : priceSemanal;

  try {
    const stripe = new Stripe(secretKey);
    const baseUrl = appUrl.replace(/\/$/, '');
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}?premium=cancel`,
      metadata: { plan }
    });

    if (!session?.url) {
      return send500(res, 'Stripe no devolvió URL de pago.');
    }
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe create-checkout-session error:', err);
    const msg = err.message || err.type || 'Error al crear la sesión de pago';
    return send500(res, msg);
  }
}
