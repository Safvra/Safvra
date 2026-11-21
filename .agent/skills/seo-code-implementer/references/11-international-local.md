# 11. International and Local SEO (code side)

## Part A. Multi-language and multi-region sites

### URL structure

Choose one and use it consistently (the business and specialist decide; default to subdirectories):

| Structure | Example | Notes |
|---|---|---|
| Subdirectories (default) | `example.com/fr/` | Easiest to maintain; inherits domain strength |
| Subdomains | `fr.example.com` | More setup; treated as separate sites |
| ccTLDs | `example.fr` | Strong geo signal; most costly to operate |

Do not use URL parameters (`?lang=fr`) or cookies alone to switch language; each language version needs its own crawlable URL.

### hreflang

Tells search engines which version targets which language or region.

```html
<link rel="alternate" hreflang="en" href="https://example.com/en/pricing/">
<link rel="alternate" hreflang="fr" href="https://example.com/fr/tarifs/">
<link rel="alternate" hreflang="pt-BR" href="https://example.com/pt-br/precos/">
<link rel="alternate" hreflang="x-default" href="https://example.com/en/pricing/">
```

Rules:
- **Self-referencing**: every page lists itself in its own set.
- **Reciprocal**: if page A lists B, B must list A. Missing return links invalidate the pair.
- Codes: ISO 639-1 language (`en`), optionally ISO 3166-1 alpha-2 region (`en-GB`, `pt-BR`). Use hyphens. Language-only is usually enough. Do not use country alone (`gb`).
- **Absolute URLs**, using the canonical form of each page (same host, protocol, trailing slash).
- `x-default` for the language selector or fallback version.
- Each page's hreflang set must be complete and consistent across all versions. Build it from one translation map in code (a function `alternatesFor(route)`) so it cannot drift.
- Only list versions that exist and return 200. Do not list redirected or noindexed URLs.
- Three implementation methods: HTML `<head>` links, HTTP `Link` headers (non-HTML), or XML sitemap `xhtml:link` entries. Use one method consistently per site. For large sites, sitemap annotations keep HTML lighter.
- Each language version has its own **self-canonical**. Do not canonical translations to the original language.
- `<html lang>` matches the page language; `og:locale` and `og:locale:alternate` set accordingly.

### Behavior rules

- **Do not auto-redirect** users by IP address or `Accept-Language`; crawlers (which mostly crawl from US IPs) will never see other versions. Show a dismissible banner suggesting the better version instead, and remember the choice.
- Provide a visible language switcher with real `<a href>` links to the equivalent page in each language (not only to the home page).
- Translate everything that matters: title, description, headings, alt text, schema text, URL slugs (where used), OG tags, and error pages. Avoid machine translation shipped without review (specialist and translators decide).
- Do not mix languages on one page except for names and quotes.
- Localize formats: dates, numbers, currency, units, addresses. Use `Intl` APIs.
- Right-to-left languages: `dir="rtl"` and logical CSS properties.
- Region-specific pricing: price and `priceCurrency` in Product schema must match the displayed local currency.
- Sitemaps: list all language versions, with alternates when using the sitemap method.

### Framework support

Use built-in i18n routing: Next.js (route segments with `[locale]` and `alternates.languages` in metadata), Astro (`i18n` config), Nuxt (`@nuxtjs/i18n`, with SEO helpers), SvelteKit (a `[lang]` param plus a reroute or paraglide), Angular i18n builds, WordPress (WPML or Polylang; ensure hreflang is emitted exactly once).

## Part B. Local business sites

### NAP consistency

Name, Address, Phone must be **identical** everywhere on the site and in schema: header or footer, Contact page, location pages, JSON-LD. Render them as **text** (not images), with the address in `<address>` and the phone as `<a href="tel:+15551234567">`. Take values from one config object so they cannot diverge.

### LocalBusiness schema

Use the most specific subtype (`Restaurant`, `Dentist`, `LegalService`, `HomeAndConstructionBusiness`, `Store`, `AutoRepair`, and so on). Template in `../templates/jsonld.md`.

Include: `name`, `image`, `url`, `telephone`, `address` (full `PostalAddress`), `geo` (accurate latitude and longitude), `openingHoursSpecification` (match visible hours, include holidays if shown), `priceRange`, `areaServed`, `sameAs`, `hasMap`. Add `aggregateRating` only from real, visible reviews and only per Google's review guidelines (self-serving review markup for your own business on your own pages is not eligible for review rich results; the specialist should know).

### Location pages

- One page per physical location or service area, each with **unique content** (local details, photos, directions, parking, team, local FAQs), its own title, description, H1, canonical, and schema.
- Do not generate dozens of near-identical "service in [city]" doorway pages. Programmatic pages need genuine unique value per page; otherwise do not create them.
- A locations index page links to each location page; each location links back and to related services.
- Embed a map (lazy-loaded iframe with a `title`, or a static map image with a link) and offer directions links. Keep layout stable.
- Click-to-call (`tel:`), `mailto:`, and click-for-directions links for mobile users.
- Opening hours as real text, kept in sync with schema (render both from one data source).

### Service area businesses

If there is no storefront, do not publish a fake address. Use `areaServed` and clear service-area text. Never invent addresses; use `TODO(seo)` and flag it.

### Hand-off to the specialist

Google Business Profile setup and optimization, citations and directory listings, review requests and responses, and local link building are off-site tasks. Provide in the report: the canonical NAP data used in code, the location page URLs, and schema types implemented.

## Anti-patterns

- hreflang with missing return links, wrong codes (`en-UK`), relative URLs, or pointing to redirected URLs
- Canonical of every translation pointing to the English page
- IP-based forced redirects
- Language switcher that only goes to the home page of each language
- Different phone numbers or address formats in footer, contact page, and schema
- Fake or virtual-office addresses in markup
- Hundreds of thin, city-swapped doorway pages
