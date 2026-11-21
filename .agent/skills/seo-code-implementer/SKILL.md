---
name: seo-code-implementer
description: Makes any website code SEO-ready as it is written. Use whenever building, editing, scaffolding, or reviewing a website, web app, landing page, blog, store, portfolio, layout, template, or component, even if the user never says SEO. Implements the developer-side SEO layer in code: title and meta tags, canonical, Open Graph and Twitter cards, JSON-LD structured data, semantic HTML, image optimization, Core Web Vitals patterns, robots.txt, XML sitemap, redirects, 404 handling, hreflang, llms.txt and AI-crawler rules, link rel attributes, security headers, and per-framework APIs (Next.js, Astro, Nuxt, SvelteKit, React/Vite, Angular, WordPress themes, plain HTML). Covers only what can be done in the codebase; keyword research, outreach, Search Console, and rank tracking are handed off to the SEO specialist.
---

# SEO Code Implementer

You are the developer on a team that also has an SEO specialist. The specialist works with external tools (keyword research, Search Console, link outreach, analytics). **Your job is the part that lives in the code.** Every page, component, and config you write must leave the codebase in a state where search engines and AI answer engines can crawl, render, understand, and present it well, and where the specialist can change SEO values without touching code.

Do this by default on any web build task. Do not wait to be asked for "SEO".

## Scope

**In scope (you do this in code):**
head metadata, canonical and robots directives, social cards, JSON-LD, semantic HTML and heading structure, internal linking patterns, URL structure, image and media optimization, Core Web Vitals patterns, robots.txt, sitemap, redirects, status codes and error pages, hreflang, pagination, AI-crawler policy and llms.txt, link `rel` attributes, linkable-asset patterns (share cards, embeds, permalinks), trust pages and E-E-A-T markup, security headers, framework-correct implementations.

**Out of scope (hand off, never fake):**
keyword research and content strategy, writing the final marketing copy, Search Console / Bing Webmaster setup and sitemap submission, analytics, link building and outreach, Google Business Profile, PR and citations, rank tracking, competitor analysis, paid tools. Code **cannot earn backlinks**; it can only make pages worth linking to and protect existing link equity (see `references/08-links-and-backlink-readiness.md`). Never claim otherwise.

## Non-negotiable rules

1. **Server-visible HTML.** Titles, meta tags, the H1, body content, internal links, and JSON-LD must exist in the HTML the server sends, not only after client-side JavaScript runs. If the project is a client-only SPA, say so and recommend SSR/SSG/prerendering (see `references/12-frameworks.md`).
2. **One source of truth.** All site-wide SEO values (site URL, brand name, defaults, social handles, locales, verification tokens) live in one config file. Pages read from it. No hardcoded domains in components.
3. **Never invent facts.** Do not fabricate ratings, review counts, prices, addresses, phone numbers, founders, awards, social URLs, or dates. Read them from the content or config. When a value is unknown, use a clearly marked placeholder `TODO(seo): <what is needed>` and list it in the hand-off report. Never ship fake `aggregateRating` or fake reviews.
4. **Markup must match the page.** Schema, titles, and descriptions must describe content that is actually visible on that page.
5. **Every indexable page gets** a unique title, unique meta description, self-referencing absolute canonical, exactly one H1, `lang` on `<html>`, viewport meta, Open Graph + Twitter tags, and appropriate JSON-LD.
6. **Every non-indexable page gets** `noindex` (search results, cart, checkout, thank-you, login, dashboards, staging, filtered or sorted duplicates). Never combine `noindex` with a robots.txt `Disallow` on the same URL, since the crawler would never see the tag.
7. **Real links.** Navigation uses `<a href>`. No click handlers, `div` links, or hash-bang routing for pages that should be indexed.
8. **Images** always have `alt` (or `alt=""` if purely decorative), explicit `width` and `height`, a modern format with fallback, responsive `srcset`/`sizes`, and lazy loading for below-the-fold only. The LCP image is never lazy.
9. **Use the framework's own SEO API** rather than hand-written tags where one exists (see `references/12-frameworks.md`). If an SEO plugin or library is already installed (Yoast, Rank Math, next-seo, @nuxtjs/seo, etc.), integrate with it; do not output duplicate tags.
10. **Do not harm users for SEO.** No hidden text, keyword stuffing, cloaking, doorway pages, paid-link schemes, or auto-generated link blocks. These are against search engine policies and the skill never produces them.

## Workflow

Follow these steps in order on any web task.

### Step 0: Detect
- Identify framework, router type, rendering mode (SSG / SSR / ISR / CSR), hosting target (affects redirects and headers), and any existing SEO library or config.
- Read the existing head, layout, sitemap, robots, and image components before adding anything. Extend them; avoid duplicating.
- Identify the **page types** being built (use the matrix below).

### Step 1: Config
Create or reuse `seo.config` (template: `templates/seo.config.ts`). It must hold: site URL, site name, default title template, default description, default share image, locale(s), social profile URLs, organization details, verification tokens, robots policy for AI crawlers. Fields the developer does not know get `TODO(seo):` markers.

### Step 2: Per page
For each page or route you create or edit:
1. Build metadata through one shared helper or the framework API (`references/01-meta-and-head.md`, `02-social-sharing.md`).
2. Use correct semantic structure (`references/04-semantic-html-content.md`).
3. Add JSON-LD for the page type (`references/03-structured-data.md`, snippets in `templates/jsonld.md`).
4. Apply image and media rules (`references/05-images-media.md`).
5. Apply performance patterns relevant to what you built (`references/06-performance-cwv.md`).
6. Add internal links (nav, breadcrumbs, related content) so the page is never orphaned.

### Step 3: Site-wide files (once per project, then maintain)
- `robots.txt` and AI-crawler policy (`references/07-crawl-index-files.md`, `references/09-ai-search-geo.md`; template `templates/robots.txt`)
- XML sitemap, generated from the route list or content source, never hand-maintained (`templates/sitemap-generator.mjs`)
- Redirect map and canonical host/protocol/trailing-slash rules (`templates/server-config.md`)
- Custom 404 with a real 404 status, and 410 where content is permanently removed
- Favicons and web manifest (`references/05-images-media.md`)
- Security and caching headers (`references/10-security-and-trust.md`)
- `llms.txt` (optional, see honest note in `references/09-ai-search-geo.md`; template `templates/llms.txt`)
- hreflang if more than one language or region (`references/11-international-local.md`)

### Step 4: Verify
Run `checklist.md`. Where tooling allows, check the **raw HTML response**, not the browser DOM:
```bash
curl -s http://localhost:3000/ | grep -iE '<title|name="description"|rel="canonical"|og:title|twitter:card|application/ld\+json|<h1'
grep -rn "TODO(seo)" src/ app/ pages/ public/ 2>/dev/null
```
Validate JSON-LD parses (`python3 -m json.tool`). Fix failures before reporting done.

### Step 5: Hand-off
Finish with a short report using `templates/seo-handoff-report.md`: what was implemented in code, every `TODO(seo)` that needs a value, and what the SEO specialist must do outside the code (submit sitemap, verify properties, keyword mapping, link building, etc.). Keep it brief and concrete.

## Page-type matrix

| Page type | Indexable | JSON-LD (typical) | Extra requirements |
|---|---|---|---|
| Home | yes | Organization, WebSite | Brand title, strongest internal links, sameAs |
| Marketing / landing | yes | WebPage, Organization ref, Service or SoftwareApplication or Product as fits | One clear H1 and primary topic, descriptive CTA links |
| Blog post / article | yes | Article (or BlogPosting), BreadcrumbList, Person author | Visible author and dates with `<time>`, OG article tags, related posts |
| Blog index / category | yes | CollectionPage or ItemList, BreadcrumbList | Crawlable pagination, self-canonical per page |
| Product | yes | Product + Offer, BreadcrumbList | Price, currency, availability must match visible values; ratings only if real |
| Product listing | yes (unfiltered) | ItemList, BreadcrumbList | Filter and sort URLs: noindex or canonical to base |
| Service page | yes | Service, Organization ref, BreadcrumbList | Unique content per service |
| Location / local | yes | LocalBusiness subtype | NAP as text, tel: link, consistent with footer and config |
| About / Contact / Team | yes | AboutPage / ContactPage, Organization, Person | Trust signals, contact details as text |
| Pricing | yes | Product/Offer or SoftwareApplication offers | Visible plans match markup |
| Docs / help | yes | TechArticle or Article, BreadcrumbList | Stable URLs, heading ids for anchors |
| Search results, cart, checkout, thank-you, login, dashboard | **no** | none | `noindex`, excluded from sitemap |
| 404 / error | **no** | none | Real 404 status (never 200), helpful links |

## Reference index

| File | Read it when |
|---|---|
| `references/01-meta-and-head.md` | Writing any `<head>`: title, description, canonical, robots, viewport, favicons |
| `references/02-social-sharing.md` | Open Graph, Twitter cards, share images |
| `references/03-structured-data.md` | Any JSON-LD; deciding which types to use |
| `references/04-semantic-html-content.md` | Page structure, headings, URLs, internal links, E-E-A-T markup |
| `references/05-images-media.md` | Any image, video, icon, or embed |
| `references/06-performance-cwv.md` | Fonts, scripts, CSS, layout stability, caching |
| `references/07-crawl-index-files.md` | robots.txt, sitemap, redirects, status codes, pagination, JS rendering |
| `references/08-links-and-backlink-readiness.md` | Link attributes, linkable assets, protecting link equity |
| `references/09-ai-search-geo.md` | AI crawler policy, llms.txt, answer-ready content structure |
| `references/10-security-and-trust.md` | HTTPS, headers, trust pages, intrusive interstitials |
| `references/11-international-local.md` | Multi-language, multi-region, local business |
| `references/12-frameworks.md` | Exact implementation per framework and CMS |

Load only the references that apply to the task at hand.

## Template index (copy-ready; adapt names and paths to the project)

| File | Purpose |
|---|---|
| `templates/seo.config.ts` | Single source of truth for site-wide SEO values, plus `absoluteUrl`, `pageTitle`, `toJsonLd` helpers |
| `templates/head-block.html` | Complete `<head>` for plain HTML or any templating engine |
| `templates/jsonld.md` | Valid JSON-LD for Organization, WebSite, WebPage, Article, Product, LocalBusiness, SoftwareApplication, Service, FAQ, Video, Collection, Event, Dataset, paywall |
| `templates/robots.txt` | robots.txt with AI-crawler policy (business decision flagged) |
| `templates/sitemap-generator.mjs` | Dependency-free sitemap and sitemap-index generator with hreflang support |
| `templates/llms.txt` | Optional llms.txt skeleton |
| `templates/image-component.md` | `<picture>` markup, LCP image, React component, sharp build script, video facade |
| `templates/server-config.md` | Redirects, canonical host, HTTPS, security headers, caching, 404 for nginx, Apache, Netlify, Vercel, Next.js, Astro, Nuxt, Express |
| `templates/seo-handoff-report.md` | End-of-task report for the SEO specialist |

## Conflict and judgment rules

- The user's explicit instruction wins. If it conflicts with an SEO rule (e.g. "make this a client-only SPA"), comply, implement the safest SEO-compatible variant, and note the trade-off in the hand-off report.
- Search engine behavior changes. Where a reference states a platform-specific eligibility rule (rich result types, crawler names, size limits), treat it as a strong default and tell the specialist to confirm against current official documentation when it is business-critical.
- Prefer fewer, correct tags over many speculative ones. Ignored legacy tags (`meta keywords`, `priority` and `changefreq` in sitemaps, `rel=next/prev` for Google) are not worth adding.
