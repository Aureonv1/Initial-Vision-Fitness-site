# Vision Fitness Gym

Cinematic 3D marketing site built with React Three Fiber, a contact form, and a private admin panel.

## Development

Install dependencies:

```bash
npm install
```

Run API + Vite together:

```bash
npm run dev
```

- Public site: [http://127.0.0.1:5173](http://127.0.0.1:5173)
- API: [http://127.0.0.1:3002](http://127.0.0.1:3002)

### Admin (secret)

- Login: `http://127.0.0.1:5173/vault-login`
- Dashboard: `http://127.0.0.1:5173/vault`
- Default password: **`vision2026`** (override with `ADMIN_PASSWORD`)
- Site content: `data/site.json`
- Messages: `data/messages.json`

### Production build

```bash
npm run build
```

Use your static hosting of choice to deploy the `dist/` output. For production API hosting, run `node server/index.js`.

## Stack

- **Vite + React + TypeScript + Tailwind**
- **Three.js** via **@react-three/fiber** and **@react-three/drei** (studio lighting, shadows, presentation controls)
- **No backend required**
