// In-memory signup store. Resets on cold start — swap for a persistent
// store (Vercel KV, Postgres, Supabase, etc.) before relying on this in
// production.
let signups = [];

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    return res.status(200).json({ count: signups.length });
  }

  if (req.method === 'POST') {
    const { name, email } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const alreadyJoined = signups.some(
      (s) => s.email.toLowerCase() === String(email).toLowerCase()
    );
    if (alreadyJoined) {
      const position = signups.findIndex(
        (s) => s.email.toLowerCase() === String(email).toLowerCase()
      ) + 1;
      return res.status(200).json({ position });
    }

    signups.push({ name, email, joinedAt: new Date().toISOString() });
    const position = signups.length;

    return res.status(200).json({ position });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
};
