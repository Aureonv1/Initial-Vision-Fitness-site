import express from 'express';
import session from 'express-session';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const DATA_DIR = path.resolve(__dirname, '..', 'data');
const SITE_FILE = path.join(DATA_DIR, 'site.json');
const MSG_FILE = path.join(DATA_DIR, 'messages.json');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'vision2026';
const SESSION_SECRET = process.env.SESSION_SECRET || 'vision-fitness-secret';

app.use(cors({ origin: 'http://127.0.0.1:5173', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax' },
  })
);

function requireAdmin(req, res, next) {
  if (req.session && req.session.admin) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

async function readJson(file, fallback) {
  try {
    const raw = await fs.readFile(file, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

async function writeJson(file, data) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

app.get('/api/site', async (_req, res) => {
  const site = await readJson(SITE_FILE, {});
  res.json(site);
});

app.put('/api/site', requireAdmin, async (req, res) => {
  await writeJson(SITE_FILE, req.body || {});
  res.json({ ok: true });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body || {};
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const list = await readJson(MSG_FILE, []);
  list.unshift({
    id: crypto.randomUUID(),
    name,
    email,
    phone,
    message,
    at: new Date().toISOString(),
  });
  await writeJson(MSG_FILE, list);
  res.json({ ok: true });
});

app.get('/api/messages', requireAdmin, async (_req, res) => {
  const list = await readJson(MSG_FILE, []);
  res.json(list);
});

app.delete('/api/messages/:id', requireAdmin, async (req, res) => {
  const list = await readJson(MSG_FILE, []);
  const filtered = list.filter((m) => m.id !== req.params.id);
  await writeJson(MSG_FILE, filtered);
  res.json({ ok: true });
});

app.post('/api/auth/login', (req, res) => {
  const { password } = req.body || {};
  if (password === ADMIN_PASSWORD) {
    req.session.admin = true;
    return res.json({ ok: true });
  }
  res.status(401).json({ error: 'Invalid password' });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({ admin: Boolean(req.session && req.session.admin) });
});

const distDir = path.resolve(__dirname, '..', 'dist');
app.use(express.static(distDir));
app.get('*', (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

const port = Number(process.env.PORT) || 3002;
app.listen(port, () => {
  console.log(`API server running on http://127.0.0.1:${port}`);
});
