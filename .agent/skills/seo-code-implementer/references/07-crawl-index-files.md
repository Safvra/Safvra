# 07. Crawl and Index Files and Rules

Controls how search engines discover, fetch, render, and index the site: robots.txt, sitemap, redirects, status codes, pagination, JavaScript rendering, and optional instant-indexing pings.

## robots.txt

Served at `https://example.com/robots.txt` (site root, one per host and protocol, UTF-8 plain text, 200 status).

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /cart/
Disallow: /checkout/
Disallow: /search
Disallow: /*?sort=
Disallow: /*?filter=

Sitemap: https://example.com/sitemap.xml
```

Rules:
- `robots.txt` controls **crawling**, not indexing. A blocked URL can still be indexed if linked elsewhere (without content). To keep a page out of results use `noindex` (and allow crawling so the tag can be seen), or password protection.
- **Never block** CSS, JavaScript, images, or fonts that the page needs to render. Do not block `/_next/static/`, `/assets/`, etc.
- Include the absolute `Sitemap:` URL(s).
- Block only real low-value paths: APIs, admin, cart, checkout, internal search, infinite parameter combinations.
- Staging and preview: disallow everything **and** send `noindex` (`Disallow: /` alone is not enough).
- Patterns: `*` wildcard, `$` end anchor. Rules are case-sensitive. The most specific matching rule wins.
- AI crawler rules are covered in `09-ai-search-geo.md`.
- Generate it from config where possible (framework route files: `app/robots.ts` in Next.js, endpoints in Astro/SvelteKit) so the sitemap URL tracks the site URL and environment.

## XML sitemap

Template and generator: `../templates/sitemap-generator.mjs`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/blog/my-post/</loc>
    <lastmod>2026-04-10</lastmod>
  </url>
</urlset>
```

Rules:
- Generate automatically from the route list or content source at build time (or on demand). Never maintain by hand.
- Include only **canonical, indexable, 200-status** URLs. Exclude redirects, 404s, `noindex` pages, parameterized duplicates, and pages blocked by robots.txt.
- URLs must be absolute, on the canonical host and protocol, matching the canonical tags exactly (same trailing-slash style).
- `<lastmod>`: use the real last significant content change (W3C date or datetime). Do not set it to "now" on every build; Google ignores sitemaps with unreliable lastmod. `<priority>` and `<changefreq>` are ignored by Google; omit them.
- Limits: 50,000 URLs and 50 MB uncompressed per file. Beyond that, use a **sitemap index** (`sitemap_index.xml`) pointing to child sitemaps (split by section: pages, posts, products).
- Multi-language: add `<xhtml:link rel="alternate" hreflang="..." href="...">` entries per URL (see `11`), or use hreflang in the HTML head, not both inconsistently.
- Images and video: optional extension namespaces for image and video sitemaps.
- Reference it from robots.txt. The specialist submits it in Search Console and Bing Webmaster Tools (not a code task).
- News sites: a separate News sitemap only for recent articles, if the specialist requests it.

## Redirects

Template with per-host syntax: `../templates/server-config.md`.

- **301** (or **308**) for permanent moves; **302** (or **307**) for temporary ones. Permanent redirects pass signals to the new URL.
- Server-side HTTP redirects only. Do not use meta refresh or JavaScript redirects for permanent moves.
- Canonicalize at the edge: `http` to `https`; `www` to apex (or reverse); trailing-slash rule; lowercase. Each in **one hop**, not a chain.
- No chains (A to B to C) and no loops. Redirect old URLs straight to the final destination.
- Redirect to the **most relevant** equivalent page, not blanket to the home page. If nothing is relevant, return 404 or 410.
- Keep a version-controlled redirect map (`redirects.json` or host config). When any slug, route, or folder is renamed in code, add a redirect in the same change.
- Preserve redirects permanently (at least a year; indefinitely for pages with backlinks).
- After a domain or URL migration: redirect map complete, canonical and sitemap updated, internal links updated to the new URLs (do not rely on redirects internally).

## HTTP status codes

| Situation | Status |
|---|---|
| Normal page | 200 |
| Permanent move | 301 / 308 |
| Temporary move | 302 / 307 |
| Not found | **404** (with a helpful custom page) |
| Permanently removed | **410** (faster deindexing) |
| Temporarily unavailable / maintenance | **503** with `Retry-After` |
| Server error | 500 (monitor, fix) |

- **Soft 404s**: never return 200 for a "not found" or empty page. Frameworks that catch all routes must set the 404 status (`notFound()` in Next.js, `Astro.response.status = 404`, `error(404)` in SvelteKit, `createError({ statusCode: 404 })` in Nuxt).
- Empty category or search pages: return 404 or `noindex`, not an empty 200 page indexed.
- Custom 404 page: branded, includes search, links to the home page and key sections, no redirect to the home page.
- Do not use 200 for error states and do not serve different content to bots (cloaking).

## Pagination, filters, and parameters

- Paginated listings: crawlable `<a href>` links per page, self-referencing canonical, unique title with page number.
- Faceted navigation and sorting: do not let every combination be crawlable. Options: keep filter state in non-crawlable controls (POST or client state with no links), `noindex, follow` on filtered views, canonical to the unfiltered list, or disallow specific parameters in robots.txt. Choose one deliberately.
- Tracking parameters (`utm_*`, `fbclid`, `gclid`) must never be in canonicals, sitemaps, or internal links.
- Session IDs must never appear in URLs.

## JavaScript rendering and crawlability

Search engines can render JavaScript but it is slower and less reliable, and **many AI crawlers do not run JavaScript at all**. Therefore:
- Prefer SSG or SSR for all indexable content.
- Title, meta, canonical, H1, body text, internal links, and JSON-LD must be present in the initial HTML.
- Do not require user interaction (click, scroll, hover) to reveal indexable content.
- Do not use `#` or `#!` routes for real pages; use the History API with real URLs and server responses for each.
- Do not block JS, CSS, or API endpoints that the rendering needs.
- For client-only SPAs: add prerendering or migrate to an SSR-capable framework (see `12-frameworks.md`).
- Dynamic rendering (serving bots a different pre-rendered version) is a workaround, not a recommendation; do not add it unless instructed.

## X-Robots-Tag and non-HTML

Use the header for PDFs, images, and feeds that should not be indexed:
```
X-Robots-Tag: noindex
```
Also use `Link: <https://example.com/doc/>; rel="canonical"` to give a PDF a canonical HTML page.

## Instant indexing pings (optional, code side)

IndexNow lets participating engines (Bing, Yandex, Naver, Seznam and others; not Google) learn about new or changed URLs immediately.
1. The SEO specialist or developer generates a key; host it at `https://example.com/<key>.txt` containing the key.
2. After deploy, send changed URLs:
   ```bash
   curl -X POST https://api.indexnow.org/IndexNow \
     -H "Content-Type: application/json" \
     -d '{"host":"example.com","key":"KEY","keyLocation":"https://example.com/KEY.txt","urlList":["https://example.com/new-page/"]}'
   ```
3. Only ping genuinely new, updated, or deleted URLs, never the whole site on every deploy. Add this to CI only when the specialist asks for it.
4. Google uses sitemaps and normal crawling; its Indexing API is limited to specific content types (job postings and live-stream videos) and is not a general tool.

## Link headers and discovery helpers

- `Link: <https://example.com/page/>; rel="canonical"` header for non-HTML.
- `Link` preload headers (or 103 Early Hints) can speed critical resources where supported.
- `/.well-known/security.txt` (see `10`), `humans.txt` optional, `ads.txt` only if the business runs ads.

## Anti-patterns

- Blocking CSS or JS in robots.txt; blocking the whole site by accident (`Disallow: /` shipped from staging)
- Sitemap listing redirected, 404, noindex, or parameterized URLs
- Sitemap `lastmod` rewritten to the build time
- Redirect chains; blanket redirect of every old URL to the home page
- 200 status on error pages
- Content only available after client-side fetch
- Canonical, sitemap, and internal links disagreeing on trailing slash or host
