import crypto from 'crypto';
import { readMessages, saveMessages } from './_lib/github.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, phone, message } = req.body || {};
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const list = await readMessages();
    list.unshift({
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      message,
      at: new Date().toISOString(),
    });
    await saveMessages(list);

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
