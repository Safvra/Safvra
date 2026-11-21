/**
 * Single source of truth for all site-wide SEO values.
 * Managed according to the seo-code-implementer skill.
 * Every TODO(seo) must be resolved or listed in the hand-off report.
 */
export const siteConfig = {
  // --- Identity ---
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://safvraconcepts.com', // TODO(seo): verify production domain
  name: 'Safvra Concepts',
  legalName: 'Safvra Concepts Interior Fit-Out & General Maintenance',
  tagline: 'Crafting Spaces. Building Visions.',
  description:
    'Premier interior fit-out, custom carpentry, kitchen installation, and turnkey maintenance studio based in Abu Dhabi, operating across the United Arab Emirates.',
  titleTemplate: '%s | Safvra Concepts',
  defaultTitle: 'Safvra Concepts — Interior Fit-Out & General Maintenance in Abu Dhabi, UAE',
  lang: 'en',
  locale: 'en_AE',
  alternateLocales: ['ar_AE'] as string[],

  // --- URL policy (must match redirects and sitemap) ---
  trailingSlash: false,
  canonicalHost: 'safvraconcepts.com',

  // --- Share images ---
  defaultOgImage: '/landing/herobg.png',
  defaultOgImageAlt: 'Safvra Concepts Interior Fit-Out & Architecture',

  // --- Social profiles (real URLs verified from official business pages) ---
  twitterHandle: '', // TODO(seo): add official Twitter/X handle if created
  social: {
    instagram: 'https://www.instagram.com/safvra_concepts/',
    facebook: 'https://www.facebook.com/safvraconcepts',
    whatsapp: 'https://api.whatsapp.com/send?phone=971568025017',
  } as Record<string, string>,

  // --- Organization / Local Business details (used in JSON-LD) ---
  organization: {
    logo: '/landing/cards-imgs/image-1.png', // TODO(seo): provide dedicated square 512x512 logo
    email: 'contact@safvraconcepts.com',
    secondaryEmail: 'info@safvraconcepts.com',
    phone: '+971-56-802-5017',
    secondaryPhone: '+971-50-148-8983',
    priceRange: '$$$',
    address: {
      streetAddress: 'Abu Dhabi Business Hub', // TODO(seo): provide exact street/building address if applicable
      addressLocality: 'Abu Dhabi',
      addressRegion: 'Abu Dhabi',
      postalCode: '00000', // UAE standard postal placeholder
      addressCountry: 'AE',
    },
    geo: {
      latitude: 24.4539, // Abu Dhabi coordinates
      longitude: 54.3773,
    },
    areaServed: [
      'Abu Dhabi',
      'Dubai',
      'Sharjah',
      'United Arab Emirates',
    ],
    openingHours: [
      'Mo-Sa 08:00-18:00',
    ],
  },

  // --- Search engine verification tokens (provide via environment variables or direct config) ---
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '', // TODO(seo): add Google Search Console token
    bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '', // TODO(seo): add Bing Webmaster token
  },

  // --- Crawler policy ---
  robots: {
    aiTrainingCrawlers: 'allow' as 'allow' | 'disallow',
    aiSearchCrawlers: 'allow' as 'allow' | 'disallow',
  },

  // --- Environment safety ---
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

/** JSON-LD safe serializer: prevents closing the script tag from unescaped data. */
export function toJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
