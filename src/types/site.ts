export type StatItem = { label: string; value: string };
export type ExperienceCard = { title: string; copy: string };
export type TierItem = { name: string; price: string; desc: string };
export type SocialLinkItem = { label: string; url: string };

export type SiteData = {
  heroTag: string;
  heroTitle: string;
  heroSubtitle: string;
  stats: StatItem[];
  experienceCards: ExperienceCard[];
  trainingCards: string[];
  tiers: TierItem[];
  ctaTitle: string;
  ctaCopy: string;
  footerRights: string;
  socialLinks: SocialLinkItem[];
};
