import { isValidPassword, setAdminCookie } from '../_lib/auth.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body || {};
  if (!isValidPassword(password)) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  setAdminCookie(res);
  return res.status(200).json({ ok: true });
}
