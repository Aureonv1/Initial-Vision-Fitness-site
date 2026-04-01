import { isAdminRequest } from '../_lib/auth.js';

export default function handler(_req, res) {
  return res.status(200).json({ admin: isAdminRequest(_req) });
}
