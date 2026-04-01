import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authMe, deleteMessage, fetchMessages, fetchSite, logout, saveSite } from '../lib/api';
import type { SiteData, StatItem, ExperienceCard, TierItem, SocialLinkItem } from '../types/site';
import type { MessageEntry } from '../lib/api';

const SECRET_LOGIN = '/vault-login';

const defaultSite: SiteData = {
  heroTag: '3D Immersion Studio',
  heroTitle: 'Train inside a cinematic 3D gym experience.',
  heroSubtitle:
    'Vision Fitness blends high-performance programming with interactive 3D space. Move through the studio, explore equipment, and preview your training flow before you ever step inside.',
  stats: [
    { label: 'Active Members', value: '540+' },
    { label: 'Elite Coaches', value: '14' },
    { label: 'Classes Weekly', value: '86' },
  ],
  experienceCards: [
    { title: 'Spatial Coaching', copy: 'Coaches map movement patterns in real time for precision feedback.' },
    { title: 'Cinematic Recovery', copy: 'Hydration and recovery bays lit with adaptive mood lighting.' },
    { title: 'Velocity Tracking', copy: 'Live force metrics projected onto 3D equipment overlays.' },
    { title: '24/7 Access', copy: 'Secure entry with full studio telemetry at any hour.' },
  ],
  trainingCards: [
    'Powerlifting vaults with competition calibration.',
    'Dynamic cardio pods with cinematic skyline views.',
    'Precision recovery chamber for nightly resets.',
    'Private coaching pods with focus lighting presets.',
  ],
  tiers: [
    { name: 'Prime Core', price: '12K LKR', desc: 'Open gym access, smart recovery lounge, weekly assessments.' },
    { name: 'Blackout Elite', price: '24K LKR', desc: 'Personal programming, nutrition sync, priority studio time.' },
    { name: 'Apex Foundry', price: '38K LKR', desc: 'Daily coaching, biometric tracking, competition prep.' },
  ],
  ctaTitle: 'Book a cinematic tour of Vision Fitness.',
  ctaCopy: 'Walk through the full 3D space with a coach and preview the training flow tailored for you.',
  footerRights: '© 2026 Vision Fitness. All rights reserved.',
  socialLinks: [
    { label: 'Instagram', url: 'https://instagram.com/visionfitnessdemo' },
    { label: 'Facebook', url: 'https://facebook.com/visionfitnessdemo' },
    { label: 'TikTok', url: '' },
    { label: 'YouTube', url: '' },
  ],
};

type Tab = 'site' | 'messages';

function AdminSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_80px_-60px_rgba(0,0,0,0.85)] sm:p-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl text-white">{title}</h2>
        <p className="mt-2 text-sm text-white/50">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  placeholder = '',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  const sharedClassName =
    'w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-brand/60 focus:ring-4 focus:ring-brand/15';

  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-white/45">{label}</span>
      {multiline ? (
        <textarea
          rows={4}
          className={`${sharedClassName} resize-y`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          className={sharedClassName}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </label>
  );
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('site');
  const [ready, setReady] = useState(false);
  const [siteForm, setSiteForm] = useState<SiteData>(defaultSite);
  const [siteError, setSiteError] = useState('');
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'ok' | 'err'>('idle');
  const [messages, setMessages] = useState<MessageEntry[]>([]);
  const [msgLoading, setMsgLoading] = useState(false);

  useEffect(() => {
    authMe().then((r) => {
      if (!r.admin) {
        navigate(SECRET_LOGIN, { replace: true });
        return;
      }
      setReady(true);
      fetchSite()
        .then((s) => setSiteForm({ ...defaultSite, ...s }))
        .catch(() => setSiteError('Could not load site data.'));
    });
  }, [navigate]);

  async function loadMessages() {
    setMsgLoading(true);
    try {
      setMessages(await fetchMessages());
    } catch {
      setMessages([]);
    } finally {
      setMsgLoading(false);
    }
  }

  useEffect(() => {
    if (!ready || tab !== 'messages') return;
    loadMessages();
  }, [ready, tab]);

  function updateStat(index: number, patch: Partial<StatItem>) {
    setSiteForm((current) => ({
      ...current,
      stats: current.stats.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
  }

  function updateExperienceCard(index: number, patch: Partial<ExperienceCard>) {
    setSiteForm((current) => ({
      ...current,
      experienceCards: current.experienceCards.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      ),
    }));
  }

  function updateTrainingCard(index: number, value: string) {
    setSiteForm((current) => ({
      ...current,
      trainingCards: current.trainingCards.map((item, itemIndex) => (itemIndex === index ? value : item)),
    }));
  }

  function updateTier(index: number, patch: Partial<TierItem>) {
    setSiteForm((current) => ({
      ...current,
      tiers: current.tiers.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
  }

  function updateSocialLink(index: number, patch: Partial<SocialLinkItem>) {
    setSiteForm((current) => ({
      ...current,
      socialLinks: current.socialLinks.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
  }

  async function onSaveSite() {
    setSaveState('idle');
    setSiteError('');
    setSaveState('saving');
    try {
      await saveSite(siteForm);
      setSaveState('ok');
    } catch {
      setSaveState('err');
      setSiteError('Could not save site content.');
    }
  }

  async function onLogout() {
    await logout();
    navigate(SECRET_LOGIN, { replace: true });
  }

  async function onDeleteMessage(id: string) {
    if (!confirm('Delete this message?')) return;
    await deleteMessage(id);
    setMessages((m) => m.filter((x) => x.id !== id));
  }

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center bg-ink text-white/60">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-ink text-white">
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">Vision Fitness</p>
            <p className="font-display text-2xl">Admin</p>
            <p className="mt-1 text-sm text-white/45">Easy editor for site content and client messages.</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10"
          >
            Log out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/5 p-2">
          <button
            type="button"
            onClick={() => setTab('site')}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              tab === 'site' ? 'bg-brand text-white shadow-lg shadow-brand/25' : 'text-white/60 hover:text-white'
            }`}
          >
            Website editor
          </button>
          <button
            type="button"
            onClick={() => setTab('messages')}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              tab === 'messages' ? 'bg-brand text-white shadow-lg shadow-brand/25' : 'text-white/60 hover:text-white'
            }`}
          >
            Client messages
          </button>
        </div>

        {tab === 'site' && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">Simple Editing</p>
                <p className="mt-2 text-sm text-white/55">
                  Update the public website with normal fields instead of JSON.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSiteForm(defaultSite)}
                  className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10"
                >
                  Reset draft
                </button>
                <button
                  type="button"
                  onClick={onSaveSite}
                  disabled={saveState === 'saving'}
                  className="rounded-full bg-gradient-to-r from-brand to-brand-dark px-5 py-2.5 text-sm font-semibold shadow-lg shadow-brand/25 disabled:opacity-60"
                >
                  {saveState === 'saving' ? 'Saving...' : 'Save website'}
                </button>
              </div>
            </div>

            {siteError && <p className="text-sm font-medium text-red-400">{siteError}</p>}
            {saveState === 'ok' && <p className="text-sm font-medium text-emerald-400">Website updated successfully.</p>}
            {saveState === 'err' && <p className="text-sm font-medium text-red-400">Save failed. Please try again.</p>}

            <AdminSection title="Hero Section" description="These fields control the first screen people see.">
              <Field
                label="Tag line"
                value={siteForm.heroTag}
                onChange={(value) => setSiteForm((current) => ({ ...current, heroTag: value }))}
              />
              <Field
                label="Main title"
                value={siteForm.heroTitle}
                onChange={(value) => setSiteForm((current) => ({ ...current, heroTitle: value }))}
                multiline
              />
              <Field
                label="Short description"
                value={siteForm.heroSubtitle}
                onChange={(value) => setSiteForm((current) => ({ ...current, heroSubtitle: value }))}
                multiline
              />
            </AdminSection>

            <AdminSection title="Top Stats" description="Small numbers shown near the top of the homepage.">
              <div className="grid gap-4 lg:grid-cols-3">
                {siteForm.stats.map((stat, index) => (
                  <div key={`${stat.label}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <Field label={`Stat ${index + 1} label`} value={stat.label} onChange={(value) => updateStat(index, { label: value })} />
                    <div className="mt-4">
                      <Field label={`Stat ${index + 1} value`} value={stat.value} onChange={(value) => updateStat(index, { value })} />
                    </div>
                  </div>
                ))}
              </div>
            </AdminSection>

            <AdminSection title="Experience Cards" description="Feature cards shown in the experience section.">
              <div className="grid gap-4 lg:grid-cols-2">
                {siteForm.experienceCards.map((card, index) => (
                  <div key={`${card.title}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <Field
                      label={`Card ${index + 1} title`}
                      value={card.title}
                      onChange={(value) => updateExperienceCard(index, { title: value })}
                    />
                    <div className="mt-4">
                      <Field
                        label={`Card ${index + 1} description`}
                        value={card.copy}
                        onChange={(value) => updateExperienceCard(index, { copy: value })}
                        multiline
                      />
                    </div>
                  </div>
                ))}
              </div>
            </AdminSection>

            <AdminSection title="Training Cards" description="Short blurbs for the training section.">
              <div className="grid gap-4 lg:grid-cols-2">
                {siteForm.trainingCards.map((card, index) => (
                  <div key={`${card}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <Field
                      label={`Training card ${index + 1}`}
                      value={card}
                      onChange={(value) => updateTrainingCard(index, value)}
                      multiline
                    />
                  </div>
                ))}
              </div>
            </AdminSection>

            <AdminSection title="Membership Plans" description="Prices and descriptions for the membership cards.">
              <div className="grid gap-4 lg:grid-cols-3">
                {siteForm.tiers.map((tier, index) => (
                  <div key={`${tier.name}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <Field
                      label={`Plan ${index + 1} name`}
                      value={tier.name}
                      onChange={(value) => updateTier(index, { name: value })}
                    />
                    <div className="mt-4">
                      <Field
                        label={`Plan ${index + 1} price`}
                        value={tier.price}
                        onChange={(value) => updateTier(index, { price: value })}
                      />
                    </div>
                    <div className="mt-4">
                      <Field
                        label={`Plan ${index + 1} description`}
                        value={tier.desc}
                        onChange={(value) => updateTier(index, { desc: value })}
                        multiline
                      />
                    </div>
                  </div>
                ))}
              </div>
            </AdminSection>

            <AdminSection title="Contact Section" description="Final call-to-action block and form intro text.">
              <Field
                label="Contact title"
                value={siteForm.ctaTitle}
                onChange={(value) => setSiteForm((current) => ({ ...current, ctaTitle: value }))}
                multiline
              />
              <Field
                label="Contact description"
                value={siteForm.ctaCopy}
                onChange={(value) => setSiteForm((current) => ({ ...current, ctaCopy: value }))}
                multiline
              />
            </AdminSection>

            <AdminSection title="Footer & Social Links" description="Control the footer rights text and which social links appear on the public website. Leave a URL empty to hide that link.">
              <Field
                label="Footer rights text"
                value={siteForm.footerRights}
                onChange={(value) => setSiteForm((current) => ({ ...current, footerRights: value }))}
              />
              <div className="grid gap-4 lg:grid-cols-2">
                {siteForm.socialLinks.map((item, index) => (
                  <div key={`${item.label}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <Field
                      label={`Social link ${index + 1} label`}
                      value={item.label}
                      onChange={(value) => updateSocialLink(index, { label: value })}
                    />
                    <div className="mt-4">
                      <Field
                        label={`Social link ${index + 1} URL`}
                        value={item.url}
                        onChange={(value) => updateSocialLink(index, { url: value })}
                        placeholder="https://example.com/your-page"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </AdminSection>
          </div>
        )}

        {tab === 'messages' && (
          <div className="mt-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-white/50">Every contact form submission appears here.</p>
              <button
                type="button"
                onClick={loadMessages}
                disabled={msgLoading}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/5"
              >
                {msgLoading ? 'Refreshing...' : 'Refresh messages'}
              </button>
            </div>
            {messages.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] py-16 text-center text-sm text-white/45">
                No messages yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {messages.map((m) => (
                  <li key={m.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-white">{m.name}</p>
                        <a href={`mailto:${m.email}`} className="break-all text-sm text-brand/90 hover:underline">
                          {m.email}
                        </a>
                        <p className="mt-2 text-sm text-white/70">{m.phone}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-wider text-white/35">
                          {new Date(m.at).toLocaleString()}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onDeleteMessage(m.id)}
                        className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-white/70">{m.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
