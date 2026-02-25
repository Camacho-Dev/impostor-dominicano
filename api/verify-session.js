/**
 * Verifica que un checkout de Stripe se haya pagado y devuelve el plan.
 * GET /api/verify-session?session_id=cs_xxx
 *
 * Requiere en Vercel: STRIPE_SECRET_KEY
 */
function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const sessionId = req.query.session_id;
  if (!sessionId) {
    return res.status(400).json({ error: 'Falta session_id' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Falta STRIPE_SECRET_KEY' });
  }

  try {
    const Stripe = require('stripe');
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription']
    });

    // Suscripción activa o trial = acceso válido
    const subStatus = session.subscription?.status;
    const valid = session.status === 'complete' ||
      subStatus === 'active' ||
      subStatus === 'trialing';

    if (!valid) {
      return res.status(200).json({ valid: false });
    }

    const plan = session.metadata?.plan || 'anual';
    return res.status(200).json({ valid: true, plan });
  } catch (err) {
    console.error('Stripe verify-session error:', err);
    return res.status(400).json({ valid: false, error: err.message });
  }
}
