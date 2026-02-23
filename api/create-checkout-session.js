/**
 * Crea una sesión de Stripe Checkout para el plan premium elegido.
 * POST /api/create-checkout-session
 * Body: { "plan": "anual" | "semanal" }
 *
 * Requiere en Vercel: STRIPE_SECRET_KEY, STRIPE_PRICE_ANUAL, STRIPE_PRICE_SEMANAL, APP_URL
 */
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const APP_URL = process.env.APP_URL || 'https://Camacho-Dev.github.io/impostor-dominicano';
const PRICE_ANUAL = process.env.STRIPE_PRICE_ANUAL;
const PRICE_SEMANAL = process.env.STRIPE_PRICE_SEMANAL;

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
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

  const priceId = plan === 'anual' ? PRICE_ANUAL : PRICE_SEMANAL;
  if (!priceId) {
    return res.status(500).json({
      error: plan === 'anual' ? 'Falta STRIPE_PRICE_ANUAL' : 'Falta STRIPE_PRICE_SEMANAL'
    });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Falta STRIPE_SECRET_KEY' });
  }

  try {
    const baseUrl = APP_URL.replace(/\/$/, '');
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${baseUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}?premium=cancel`,
      metadata: { plan }
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe create-checkout-session error:', err);
    return res.status(500).json({ error: err.message || 'Error al crear la sesión de pago' });
  }
}
