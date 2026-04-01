# Vision Fitness Gym

Cinematic 3D marketing site with a private admin panel and GitHub-backed JSON storage for Vercel deployment.

## Local development

Install dependencies:

```bash
npm install
```

Run the local Vite app and Express API:

```bash
npm run dev
```

- Public site: [http://127.0.0.1:5173](http://127.0.0.1:5173)
- API: [http://127.0.0.1:3002](http://127.0.0.1:3002)

### Local admin

- Login: `http://127.0.0.1:5173/vault-login`
- Dashboard: `http://127.0.0.1:5173/vault`
- Default password: **`vision2026`**

## Vercel live admin setup

The live Vercel deployment uses serverless API routes in `api/` and stores `data/site.json` plus `data/messages.json` directly in your GitHub repo through the GitHub Contents API.

### 1. Make the GitHub repo private

Your messages are stored in `data/messages.json`, so the repository should be private before you use the live admin.

### 2. Create a GitHub token

Create a fine-grained Personal Access Token in GitHub with repository access to this repo and permission to read/write repository contents.

### 3. Add Vercel environment variables

In your Vercel project, open `Settings -> Environment Variables` and add:

- `ADMIN_PASSWORD`
- `SESSION_SECRET`
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH`
- `GITHUB_TOKEN`
- `GITHUB_SITE_PATH`
- `GITHUB_MESSAGES_PATH`

Use `.env.example` as the template.

Example values:

```bash
ADMIN_PASSWORD=vision2026
SESSION_SECRET=replace-with-a-long-random-secret
GITHUB_OWNER=Aureonv1
GITHUB_REPO=Initial-Vision-Fitness-site
GITHUB_BRANCH=main
GITHUB_TOKEN=github_pat_your_token_here
GITHUB_SITE_PATH=data/site.json
GITHUB_MESSAGES_PATH=data/messages.json
```

### 4. Redeploy

After adding the environment variables, redeploy the Vercel project.

### 5. Open the secret admin routes

- Public site: `https://your-site.vercel.app/`
- Admin login: `https://your-site.vercel.app/vault-login`
- Admin dashboard: `https://your-site.vercel.app/vault`

## Production notes

- The public site and admin routes now work on Vercel without Supabase.
- The source of truth is still JSON, but it is stored in GitHub rather than Vercel's temporary filesystem.
- This is best for low-write admin workflows, not high-volume apps.

## Stack

- **Vite + React + TypeScript + Tailwind**
- **React Router**
- **Three.js** via **@react-three/fiber** and **@react-three/drei**
- **Vercel Serverless Functions**
- **GitHub Contents API** for live JSON storage
