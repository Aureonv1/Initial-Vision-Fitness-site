import { readSiteData, saveSiteData } from './_lib/github.js';
import { requireAdmin } from './_lib/auth.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const site = await readSiteData({});
      return res.status(200).json(site);
    }

    if (req.method === 'PUT') {
      if (!requireAdmin(req, res)) return;
      await saveSiteData(req.body || {});
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
