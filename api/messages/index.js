import { requireAdmin } from '../_lib/auth.js';
import { readMessages } from '../_lib/github.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!requireAdmin(req, res)) return;

    const list = await readMessages();
    return res.status(200).json(list);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
