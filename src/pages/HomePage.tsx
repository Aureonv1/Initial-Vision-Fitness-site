import { useEffect, useState } from 'react';
import { CinematicGymScene } from '../components/CinematicGymScene';
import { fetchSite, submitContact } from '../lib/api';
import type { SiteData } from '../types/site';

const fallback: SiteData = {
  heroTag: 'Performance Architecture',
  heroTitle: 'A luxury strength club built as a living 3D experience.',
  heroSubtitle:
    'Vision Fitness blends premium coaching, disciplined design, and immersive motion so every scroll feels like stepping deeper into the gym itself.',
  stats: [
    { label: 'Active Members', value: '540+' },
    { label: 'Elite Coaches', value: '14' },
    { label: 'Classes Weekly', value: '86' },
  ],
  experienceCards: [
    { title: 'Spatial Coaching', copy: 'Coaches map movement patterns in real time for sharper feedback and better lifts.' },
    { title: 'Recovery Ritual', copy: 'The recovery flow is designed as carefully as the training floor itself.' },
    { title: 'Velocity Tracking', copy: 'Every rep, tempo, and effort zone is translated into visual performance cues.' },
    { title: 'Private Access', copy: 'A members-first environment with controlled access and elevated service.' },
  ],
  trainingCards: [
    'Competition-grade power zones with calibrated setups.',
    'Conditioning lanes designed for speed, aggression, and precision.',
    'Recovery spaces that lower noise and restore focus instantly.',
    'Private coaching suites for tailored performance programming.',
  ],
  tiers: [
    { name: 'Prime Core', price: '12K LKR', desc: 'Foundational membership with full gym access and performance tracking.' },
    { name: 'Blackout Elite', price: '24K LKR', desc: 'Advanced coaching, recovery planning, and elevated studio access.' },
    { name: 'Apex Foundry', price: '38K LKR', desc: 'Full-service transformation with private guidance and athlete support.' },
  ],
  ctaTitle: 'Start your Vision Fitness entry.',
  ctaCopy: 'Leave your details and we will walk you through the best membership, coaching track, and first-visit plan.',
  footerRights: '© 2026 Vision Fitness. All rights reserved.',
  socialLinks: [
    { label: 'Instagram', url: 'https://instagram.com/visionfitnessdemo' },
    { label: 'Facebook', url: 'https://facebook.com/visionfitnessdemo' },
    { label: 'TikTok', url: '' },
    { label: 'YouTube', url: '' },
  ],
};

const showcasePillars = [
  {
    index: '01',
    title: 'Scroll Through The Space',
    copy: 'The page now behaves like a guided walk through the club, with sticky visual moments and layered motion instead of disconnected blocks.',
  },
  {
    index: '02',
    title: 'Luxury Editorial Layout',
    copy: 'Typography, spacing, and contrast are tuned to feel premium first, then technical second, which gives the brand more confidence.',
  },
  {
    index: '03',
    title: 'Responsive By Default',
    copy: 'Each section collapses into cleaner mobile stacks so the site still feels custom on smaller screens instead of compressed.',
  },
];

function SocialIcon({ label }: { label: string }) {
  const normalized = label.trim().toLowerCase();
  const iconClassName = 'h-[18px] w-[18px]';

  if (normalized.includes('instagram')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName} aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (normalized.includes('facebook')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={iconClassName} aria-hidden="true">
        <path d="M13.4 21v-7.3h2.5l.4-3h-2.9V8.8c0-.9.3-1.5 1.5-1.5H16V4.6c-.5-.1-1.4-.2-2.4-.2-2.4 0-4 1.5-4 4.2v2.1H7v3h2.2V21h4.2Z" />
      </svg>
    );
  }

  if (normalized.includes('tiktok')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={iconClassName} aria-hidden="true">
        <path d="M14.8 4c.4 1.3 1.2 2.4 2.4 3.1.8.5 1.7.8 2.8.9v3.2a9 9 0 0 1-3.6-.8v5.5a5.9 5.9 0 1 1-5.1-5.9v3.3a2.7 2.7 0 1 0 1.9 2.6V4h1.6Z" />
      </svg>
    );
  }

  if (normalized.includes('youtube')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={iconClassName} aria-hidden="true">
        <path d="M21.6 8.4a2.9 2.9 0 0 0-2-2c-1.8-.5-7.6-.5-7.6-.5s-5.8 0-7.6.5a2.9 2.9 0 0 0-2 2A30.5 30.5 0 0 0 2 12a30.5 30.5 0 0 0 .4 3.6 2.9 2.9 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.9 2.9 0 0 0 2-2A30.5 30.5 0 0 0 22 12a30.5 30.5 0 0 0-.4-3.6ZM10 15.5v-7l6 3.5-6 3.5Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={iconClassName} aria-hidden="true">
      <path d="M10 14a5 5 0 0 1 0-7l1.5-1.5a5 5 0 0 1 7 7L17 14" />
      <path d="M14 10a5 5 0 0 1 0 7L12.5 18.5a5 5 0 0 1-7-7L7 10" />
    </svg>
  );
}

export function HomePage() {
  const [site, setSite] = useState<SiteData>(fallback);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [isLoaded, setIsLoaded] = useState(false);
  const socialLinks = Array.isArray(site.socialLinks) ? site.socialLinks : [];

  useEffect(() => {
    fetchSite()
      .then((data) => setSite({ ...fallback, ...data }))
      .catch(() => setSite(fallback));
  }, []);

  useEffect(() => {
    let rafId = 0;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        document.documentElement.style.setProperty('--scroll-y', `${progress}`);
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const reveal = () => {
      window.setTimeout(() => setIsLoaded(true), 500);
    };

    if (document.readyState === 'complete') {
      reveal();
      return;
    }

    window.addEventListener('load', reveal, { once: true });
    return () => window.removeEventListener('load', reveal);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      await submitContact(form);
      setForm({ name: '', email: '', phone: '', message: '' });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="min-h-screen bg-ink text-white">
      <div className={`site-loader ${isLoaded ? 'site-loader-hidden' : ''}`}>
        <div className="site-loader-mark">
          <span>V</span>
          <span>F</span>
        </div>
        <div className="site-loader-line">
          <span />
        </div>
        <p className="site-loader-copy">Building the Vision Fitness experience</p>
      </div>

      <div className="page-orb page-orb-a" />
      <div className="page-orb page-orb-b" />
      <div className="page-grid" />

      <header className="relative z-20">
        <nav className="shell-wide mx-auto flex flex-wrap items-start justify-between gap-3 px-4 py-4 sm:items-center sm:gap-4 sm:px-6 sm:py-5 lg:px-8">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/10 font-display text-lg tracking-wide text-white sm:h-11 sm:w-11 sm:text-xl">
              VF
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-xl tracking-[0.06em] text-white sm:text-2xl sm:tracking-[0.08em]">Vision Fitness</p>
              <p className="text-[9px] uppercase tracking-[0.28em] text-white/45 sm:text-[11px] sm:tracking-[0.34em]">Colombo Strength Club</p>
            </div>
          </div>
          <div className="hidden items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55 md:flex">
            <a href="#experience" className="transition hover:text-white">Experience</a>
            <a href="#story" className="transition hover:text-white">Story</a>
            <a href="#membership" className="transition hover:text-white">Membership</a>
            <a href="#contact" className="transition hover:text-white">Contact</a>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        <section className="shell-wide mx-auto grid gap-6 px-4 pb-14 pt-3 sm:px-6 sm:pb-20 sm:pt-4 md:gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-12 lg:px-8 lg:pb-24">
          <div className="hero-copy reveal-once space-y-5 sm:space-y-7">
            <div className="inline-flex max-w-full items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-white/70 backdrop-blur-xl sm:px-4 sm:text-[11px] sm:tracking-[0.32em]">
              <span className="h-2 w-2 rounded-full bg-[#ff5a36]" />
              {site.heroTag}
            </div>
            <h1 className="font-display text-[clamp(2rem,9vw,6.8rem)] leading-[0.92] tracking-[0.015em] text-white">
              {site.heroTitle}
            </h1>
            <p className="max-w-xl text-[clamp(0.92rem,2.6vw,1rem)] leading-6 sm:leading-7 text-white/65">
              {site.heroSubtitle}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#membership"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#ff5a36] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-[#ff734f] sm:px-7 sm:text-[11px] sm:tracking-[0.28em]"
              >
                Explore Membership
              </a>
              <a
                href="#experience"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/12 bg-white/5 px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/85 backdrop-blur-xl transition hover:bg-white/10 sm:px-7 sm:text-[11px] sm:tracking-[0.28em]"
              >
                Enter The Space
              </a>
            </div>
            <div className="mobile-chip-row">
              <div className="mobile-chip">3D Motion</div>
              <div className="mobile-chip">Private Coaching</div>
              <div className="mobile-chip">Modern Recovery</div>
              <div className="mobile-chip">Premium Access</div>
            </div>
            <div className="stats-grid grid gap-3 min-[380px]:grid-cols-2 sm:grid-cols-3">
              {site.stats.slice(0, 3).map((item, idx) => (
                <div key={item.label} className={`reveal-once delay-${(idx + 1) * 100} stat-panel`}>
                  <p className="font-display text-[1.85rem] tracking-[0.06em] text-white sm:text-3xl sm:tracking-[0.08em]">{item.value}</p>
                  <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-white/45 sm:text-[10px] sm:tracking-[0.28em]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-once delay-200 hero-stage scroll-tilt">
            <div className="hero-stage-frame">
              <CinematicGymScene enableControls={false} />
            </div>
            <div className="hero-stage-caption">
              <p className="text-[9px] uppercase tracking-[0.24em] text-white/40 sm:text-[10px] sm:tracking-[0.32em]">Cinematic Environment</p>
              <p className="mt-2 max-w-sm text-[0.92rem] leading-6 text-white/65 sm:text-sm">
                A simplified, more believable environment keeps the scene premium while cutting the heavy demo-like feel and improving overall smoothness.
              </p>
            </div>
          </div>
        </section>

        <section id="experience" className="shell-wide mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="section-header">
            <p className="section-kicker">Spatial Narrative</p>
            <h2 className="section-title">A scroll-first 3D layout that feels designed, not assembled.</h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="glass-block reveal-once">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">Why It Feels Better</p>
              <p className="mt-5 text-base leading-8 text-white/68">
                The old UI was fighting itself. This version reduces the noise, builds clearer hierarchy, and lets the 3D moments lead the story instead of decorating it.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {site.experienceCards.map((card, idx) => (
                <article key={card.title} className={`glass-block reveal-once delay-${(idx + 1) * 100}`}>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#ff8a68]">{card.title}</p>
                  <p className="mt-4 text-sm leading-7 text-white/68">{card.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="story" className="shell-wide mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="story-layout">
            <div className="story-stack">
              {showcasePillars.map((item, idx) => (
                <article key={item.index} className={`story-card reveal-once delay-${(idx + 1) * 100}`}>
                  <p className="story-index">{item.index}</p>
                  <h3 className="story-title">{item.title}</h3>
                  <p className="story-copy">{item.copy}</p>
                </article>
              ))}
            </div>

            <div className="story-stage">
              <div className="story-stage-sticky">
                <div className="story-stage-shell scroll-depth-1">
                  <div className="story-visual-card">
                    <div className="story-visual-grid" />
                    <div className="story-visual-orb story-visual-orb-a" />
                    <div className="story-visual-orb story-visual-orb-b" />
                    <div className="story-visual-frame">
                      <div className="story-visual-bar" />
                      <div className="story-visual-plate story-visual-plate-left" />
                      <div className="story-visual-plate story-visual-plate-right" />
                      <div className="story-visual-panel story-visual-panel-back" />
                      <div className="story-visual-panel story-visual-panel-front" />
                    </div>
                  </div>
                </div>
                <div className="story-floating-card scroll-depth-2">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Lightweight Motion</p>
                  <p className="mt-3 text-sm leading-6 text-white/68">
                    The story section now uses layered depth and motion-driven art direction instead of a second heavy canvas, so the page feels faster and more deliberate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden py-8 sm:py-12 lg:py-16">
          <div className="kinetic-band kinetic-band-light">
            <div className="kinetic-track">
              <span>PRIVATE COACHING</span>
              <span>STRENGTH CULTURE</span>
              <span>ARCHITECTURAL 3D</span>
              <span>PRIVATE COACHING</span>
              <span>STRENGTH CULTURE</span>
              <span>ARCHITECTURAL 3D</span>
            </div>
          </div>
          <div className="kinetic-band kinetic-band-dark">
            <div className="kinetic-track kinetic-track-slow">
              <span>VISION FITNESS</span>
              <span>HIGH PERFORMANCE</span>
              <span>DESIGNED TO MOVE</span>
              <span>VISION FITNESS</span>
              <span>HIGH PERFORMANCE</span>
              <span>DESIGNED TO MOVE</span>
            </div>
          </div>
        </section>

        <section className="shell-wide mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="section-header">
            <p className="section-kicker">Training World</p>
            <h2 className="section-title">The gym is organized like a collection of premium environments.</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {site.trainingCards.map((copy, idx) => (
              <article key={copy} className={`training-card reveal-once delay-${(idx + 1) * 100}`}>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Zone {idx + 1}</p>
                <p className="mt-5 text-base leading-7 text-white/74">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="membership" className="shell-wide mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="membership-shell">
            <div className="section-header section-header-tight">
              <p className="section-kicker">Membership Architecture</p>
              <h2 className="section-title">Three entry points, one elevated standard.</h2>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {site.tiers.map((tier, idx) => (
                <article key={tier.name} className={`tier-card reveal-once delay-${(idx + 1) * 100}`}>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/45">{tier.name}</p>
                  <p className="mt-4 font-display text-4xl tracking-[0.06em] text-white">{tier.price}</p>
                  <p className="mt-5 text-sm leading-7 text-white/68">{tier.desc}</p>
                  <button
                    type="button"
                    className="mt-8 inline-flex rounded-full border border-white/12 bg-white/8 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/88 transition hover:bg-white/14"
                  >
                    Request Access
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="shell-wide mx-auto px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-28">
          <div className="contact-shell">
            <div className="contact-copy">
              <p className="section-kicker">Private Entry</p>
              <h2 className="section-title">{site.ctaTitle}</h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/68">{site.ctaCopy}</p>
            </div>

            <form className="contact-form" onSubmit={onSubmit}>
              <input
                type="text"
                placeholder="Full name"
                className="contact-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email address"
                className="contact-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="Phone number"
                className="contact-input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
              <textarea
                rows={5}
                placeholder="Tell us what kind of training experience you want."
                className="contact-input resize-none"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                className="contact-submit"
              >
                {status === 'sending' ? 'Sending Request' : 'Request A Callback'}
              </button>
              {status === 'sent' && <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">Message sent successfully</p>}
              {status === 'error' && <p className="text-xs uppercase tracking-[0.24em] text-red-300">Message failed to send</p>}
            </form>
          </div>
        </section>

        <footer className="shell-wide mx-auto px-4 pb-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-5 text-sm text-white/50 sm:px-6">
            <div className="footer-meta flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="footer-rights">{site.footerRights}</p>
              <p className="footer-credit text-white/60">
                Developed and Designed by{' '}
                <a
                  href="https://www.onyxrns.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white transition hover:text-[#ff8a68]"
                >
                  ONYX
                </a>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {socialLinks
                .filter((item) => item.url.trim())
                .map((item) => (
                  <a
                    key={item.label}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/80 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                    aria-label={item.label}
                    title={item.label}
                  >
                    <SocialIcon label={item.label} />
                  </a>
                ))}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

