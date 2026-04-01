import crypto from 'crypto';

const COOKIE_NAME = 'vf_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function getSessionSecret() {
  return process.env.SESSION_SECRET || 'vision-fitness-secret';
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || 'vision2026';
}

function toBase64Url(value) {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function fromBase64Url(value) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function signPayload(payload) {
  return crypto.createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
}

function makeCookie(value, maxAge) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function parseCookies(req) {
  const header = req.headers.cookie || '';
  return header.split(';').reduce((acc, chunk) => {
    const [key, ...rest] = chunk.trim().split('=');
    if (!key) return acc;
    acc[key] = rest.join('=');
    return acc;
  }, {});
}

export function setAdminCookie(res) {
  const payload = JSON.stringify({
    admin: true,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  });
  const encoded = toBase64Url(payload);
  const signature = signPayload(encoded);
  res.setHeader('Set-Cookie', makeCookie(`${encoded}.${signature}`, SESSION_TTL_SECONDS));
}

export function clearAdminCookie(res) {
  res.setHeader('Set-Cookie', makeCookie('', 0));
}

export function isAdminRequest(req) {
  const cookies = parseCookies(req);
  const token = cookies[COOKIE_NAME];
  if (!token) return false;

  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return false;
  if (signPayload(encoded) !== signature) return false;

  try {
    const payload = JSON.parse(fromBase64Url(encoded));
    return Boolean(payload.admin && payload.exp && payload.exp > Math.floor(Date.now() / 1000));
  } catch {
    return false;
  }
}

export function requireAdmin(req, res) {
  if (isAdminRequest(req)) return true;
  res.status(401).json({ error: 'Unauthorized' });
  return false;
}

export function isValidPassword(password) {
  return password === getAdminPassword();
}
