/**
 * GET /api/my-ip - Devuelve la IP del cliente (para comprobar bloqueos desde el panel admin).
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
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' });

  const ip = (req.headers['x-forwarded-for'] || '')
    .split(',')[0]
    .trim() ||
    String(req.headers['x-real-ip'] || '') ||
    '';
  return res.status(200).json({ ip });
};
