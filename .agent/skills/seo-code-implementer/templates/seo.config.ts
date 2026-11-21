/**
 * Single source of truth for all site-wide SEO values.
 * The SEO specialist can edit this file without touching components.
 * Every TODO(seo) must be resolved or listed in the hand-off report.
 * Never invent values: leave the TODO marker when unknown.
 */
export const siteConfig = {
  // --- Identity ---
  url: 'https://example.com',            // TODO(seo): production URL, no trailing slash
  name: 'Brand Name',                    // TODO(seo): exact brand name used everywhere
  legalName: '',                         // TODO(seo): legal entity name, if different
  description: 'One or two sentences describing the site.', // TODO(seo): default meta description (120-160 chars)
  titleTemplate: '%s | Brand Name',      // %s is replaced by the page title
  defaultTitle: 'Brand Name: short value statement', // TODO(seo): home page title
  lang: 'en',                            // html lang
  locale: 'en_US',                       // og:locale
  alternateLocales: [] as string[],      // e.g. ['fr_FR'] for og:locale:alternate

  // --- URL policy (must match redirects and sitemap) ---
  trailingSlash: true,                   // choose once and enforce via redirects
  canonicalHost: 'example.com',          // www or apex; redirect the other

  // --- Share images ---
  defaultOgImage: '/og/default.jpg',     // 1200x630 JPG or PNG, absolute URL is built from `url`
  defaultOgImageAlt: 'Brand Name',       // TODO(seo)

  // --- Social profiles (real URLs only; leave empty if none) ---
  twitterHandle: '',                     // TODO(seo): e.g. '@brand'
  social: {
    // linkedin: 'https://www.linkedin.com/company/...',
    // github: 'https://github.com/...',
    // youtube: 'https://www.youtube.com/@...',
  } as Record<string, string>,

  // --- Organization / entity (used in JSON-LD) ---
  organization: {
    logo: '/logo.png',                   // TODO(seo): square-ish, at least 112px, crawlable
    email: '',                           // TODO(seo)
    phone: '',                           // TODO(seo): international format, e.g. +1-555-123-4567
    address: {
      streetAddress: '',                 // TODO(seo)
      addressLocality: '',               // TODO(seo)
      addressRegion: '',                 // TODO(seo)
      postalCode: '',                    // TODO(seo)
      addressCountry: '',                // TODO(seo): ISO 3166-1 alpha-2
    },
  },

  // --- Search engine verification tokens (only if the specialist provides them) ---
  verification: {
    google: '',                          // TODO(seo)
    bing: '',                            // TODO(seo)
  },

  // --- Crawler policy ---
  robots: {
    // TODO(seo): business decision. 'allow' keeps the site available to AI training crawlers.
    aiTrainingCrawlers: 'allow' as 'allow' | 'disallow',
    aiSearchCrawlers: 'allow' as 'allow' | 'disallow', // 'allow' lets AI search products cite the site
  },

  // --- Environment safety ---
  // Only the production host may be indexable. Previews and staging get noindex automatically.
  isProduction: process.env.NODE_ENV === 'production' && process.env.SITE_ENV !== 'staging',
};

/** Build an absolute URL from a path using the canonical site URL. */
export function absoluteUrl(path = '/'): string {
  const base = siteConfig.url.replace(/\/$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (siteConfig.trailingSlash && !clean.includes('.') && !clean.endsWith('/') && !clean.includes('?')) {
    return `${base}${clean}/`;
  }
  return `${base}${clean}`;
}

/** Page title using the template. */
export function pageTitle(title?: string): string {
  if (!title) return siteConfig.defaultTitle;
  return siteConfig.titleTemplate.replace('%s', title);
}

/** JSON-LD safe serializer: prevents closing the script tag from data. */
export function toJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
