import { requireAdmin } from '../_lib/auth.js';
import { readMessages, saveMessages } from '../_lib/github.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'DELETE') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!requireAdmin(req, res)) return;

    const { id } = req.query;
    const list = await readMessages();
    const filtered = list.filter((item) => item.id !== id);
    await saveMessages(filtered);

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
