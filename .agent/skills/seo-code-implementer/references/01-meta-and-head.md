# 01. Meta and Head

Everything that belongs in `<head>`, in a sensible order. All of it must be in the server-sent HTML.

## Recommended order

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Primary Topic | Brand</title>
  <meta name="description" content="...">
  <link rel="canonical" href="https://example.com/page/">
  <meta name="robots" content="max-image-preview:large">
  <!-- hreflang alternates -->
  <!-- Open Graph / Twitter (see 02) -->
  <!-- icons and manifest -->
  <!-- preconnect / preload (see 06) -->
  <!-- stylesheets -->
  <!-- JSON-LD (see 03) -->
</head>
```

Charset first (it must appear within the first 1024 bytes). Put `title`, `description`, and `canonical` early so they are never pushed out of view of crawlers by large inline blocks.

## Title

- Length: aim for about 50-60 characters (roughly 580 px). Longer titles are truncated in results; Google also rewrites titles it considers poor, so write a good one.
- Pattern: `Primary Topic or Keyword | Brand`. Home page: `Brand: short value statement`.
- Unique per page. Never reuse one title across pages. Never leave the framework default ("Create Next App", "Vite App", "Document", "Untitled").
- Describe the page, do not stuff keywords. Match the visible H1's topic (they need not be identical).
- Build titles from a template in config (`%s | Brand`) so the brand suffix is consistent.

## Meta description

- About 120-160 characters. It is not a ranking factor, but it shapes the snippet and click-through. Google may substitute its own text.
- Unique per page, accurate, action-oriented. Include the page's real topic and a reason to click.
- Never duplicate across pages. If a page has no good description, generate from the first meaningful paragraph rather than reusing a global default.
- Do not add `meta keywords` (ignored by major engines).

## Canonical

```html
<link rel="canonical" href="https://example.com/blog/my-post/">
```

- Absolute URL with protocol and host. Exactly one per page, inside `<head>`.
- Self-referencing on every indexable page.
- Must match the sitemap URL, the internal-link URL, and the redirect target form exactly (same host, same trailing-slash style, lowercase, no tracking parameters).
- Strip query parameters (utm, session, sort, filter) from the canonical unless the parameter changes the content meaningfully.
- Never canonical to a URL that is `noindex`, redirected, or 404.
- Paginated pages: canonical to themselves, not to page 1.
- Build it from config: `new URL(path, SITE_URL).toString()`. Never from `window.location` on the client.

## Robots meta

- Default for indexable pages: omit, or `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">`. `max-image-preview:large` allows large previews in Discover and results.
- `noindex` for: internal search results, cart, checkout, order confirmation, login, account areas, thin tag or archive pages, filtered or sorted duplicates, staging and preview environments, print or duplicate views.
- `noindex, follow` keeps link discovery. `nofollow` on the whole page is rarely right.
- Staging safety: when `NODE_ENV !== 'production'` or the host is not the production host, emit `noindex, nofollow` and add `X-Robots-Tag: noindex` at the server. Prevents accidental indexing of preview deployments.
- For non-HTML files (PDF, images) use the `X-Robots-Tag` HTTP header.
- Snippet controls when needed: `nosnippet`, `max-snippet:N`, and `data-nosnippet` attribute on specific elements.

## Language and viewport

- `<html lang="en">` using a valid BCP 47 code (`en`, `en-GB`, `pt-BR`). Set it per page for multi-language sites. Add `dir="rtl"` for right-to-left languages.
- Viewport: `width=device-width, initial-scale=1`. Do not set `maximum-scale=1` or `user-scalable=no` (accessibility and mobile usability).

## Icons and manifest

```html
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png"> <!-- 180x180 -->
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#ffffff">
```

- Google shows a favicon in results: the file should be a square, a multiple of 48 px, and crawlable (not blocked in robots.txt). Keep the favicon URL stable.
- `manifest.webmanifest` with `name`, `short_name`, `start_url`, `display`, `background_color`, `theme_color`, and 192 px and 512 px PNG icons (add a maskable icon).

## Search engine verification

Only add verification tags if the SEO specialist supplies tokens. Store tokens in config, emit them conditionally:

```html
<meta name="google-site-verification" content="TOKEN">
<meta name="msvalidate.01" content="TOKEN">
```

Do not invent tokens. If the specialist verifies by DNS or file upload instead, nothing is needed in code.

## Alternates and feeds

```html
<link rel="alternate" type="application/rss+xml" title="Blog feed" href="/rss.xml">
<link rel="alternate" hreflang="fr" href="https://example.com/fr/">
```

For blogs and news, ship an RSS or Atom feed with full absolute URLs. It aids discovery and is a natural linkable asset. hreflang details are in `11-international-local.md`.

## Titles and descriptions for dynamic routes

For routes generated from data (blog posts, products, locations), the title and description must come from the record's fields with a fallback chain: `seoTitle` field, then `title`, then template. Add a build-time check that fails or warns when a generated title or description is empty, duplicated, or over length.

## Anti-patterns

- One global title and description for every page
- Canonical pointing to the home page from every page
- `<title>` set by client-side JavaScript after load
- Multiple `<title>`, multiple canonicals, or multiple robots metas (often caused by layout plus page both injecting)
- Meta refresh or JavaScript redirects instead of HTTP redirects
- Leaving framework default titles or lorem ipsum descriptions
