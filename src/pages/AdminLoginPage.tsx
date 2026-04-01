import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authMe, login } from '../lib/api';

const SECRET_ADMIN_HOME = '/vault';

export function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    authMe().then((r) => {
      if (r.admin) navigate(SECRET_ADMIN_HOME, { replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await login(password);
      navigate(SECRET_ADMIN_HOME, { replace: true });
    } catch {
      setErr('Invalid password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_-60px_rgba(0,0,0,0.8)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">Private Access</p>
          <h1 className="mt-4 font-display text-3xl">Admin Login</h1>
          <p className="mt-2 text-sm text-white/55">Enter your password to manage the site and messages.</p>
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <input
              type="password"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-brand/60 focus:ring-4 focus:ring-brand/20"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {err && <p className="text-sm font-medium text-red-400">{err}</p>}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full rounded-full bg-gradient-to-r from-brand to-brand-dark py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
