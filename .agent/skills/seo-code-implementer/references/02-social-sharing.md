# 02. Social Sharing (Open Graph and Twitter/X Cards)

Share cards decide how a link looks when pasted into Slack, WhatsApp, LinkedIn, Facebook, X, Discord, iMessage, and many AI chat interfaces. A good card gets more clicks and more links. They are a core part of making pages linkable.

## Minimum Open Graph set

```html
<meta property="og:type" content="website">
<meta property="og:site_name" content="Brand">
<meta property="og:title" content="Page title (can be shorter than the SEO title)">
<meta property="og:description" content="One or two sentences.">
<meta property="og:url" content="https://example.com/page/">
<meta property="og:image" content="https://example.com/og/page.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Describe what the image shows">
<meta property="og:locale" content="en_US">
```

- `og:url` must equal the canonical URL.
- `og:image` must be an **absolute https URL**, publicly reachable (no auth, not blocked in robots.txt), and a JPG or PNG (WebP support varies across scrapers, so prefer JPG or PNG for share images).
- Image size: 1200 x 630 (1.91:1). Keep under 5-8 MB, ideally under 300 KB. Keep key content in the central safe area; platforms crop differently.
- `og:type`: `website` for home and general pages, `article` for posts, `product` for products (use `og:type` values from the Open Graph spec).
- `og:locale` uses `language_TERRITORY` (`en_US`, `fr_FR`). For translations add `og:locale:alternate`.

## Article extras

```html
<meta property="og:type" content="article">
<meta property="article:published_time" content="2026-03-01T09:00:00+00:00">
<meta property="article:modified_time" content="2026-04-10T12:30:00+00:00">
<meta property="article:author" content="https://example.com/authors/jane-doe/">
<meta property="article:section" content="Guides">
<meta property="article:tag" content="topic">
```

Dates in ISO 8601 with timezone. They must match the visible dates and the Article JSON-LD.

## Twitter/X cards

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@brandhandle">
<meta name="twitter:creator" content="@authorhandle">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="https://example.com/og/page.jpg">
<meta name="twitter:image:alt" content="...">
```

- X falls back to the Open Graph tags if Twitter tags are missing, so the only tag really required is `twitter:card`. Keep the rest for clarity and control.
- Only include `twitter:site` and `twitter:creator` when real handles are in config. Do not invent handles.

## Share images per page

Priority order for `og:image`:
1. A page-specific image (hero, product photo, author-designed card)
2. A generated card built from the title (dynamic OG image route; see below)
3. The site default from `seo.config`

Never leave a page with no image; the site default is the floor.

Dynamic generation options:
- Next.js: `opengraph-image.tsx` with `ImageResponse` (file convention) or `generateMetadata` with `openGraph.images`
- Astro: build-time generation with `satori` + `sharp`, or a pre-rendered endpoint
- Nuxt: `nuxt-og-image` module
- SvelteKit: a `+server.ts` endpoint that renders with `satori`
- Anything else: pre-generate PNG cards at build time in a script

Keep generated text legible at thumbnail size (large type, high contrast, short title, brand mark).

## Other platform tags (optional)

```html
<meta name="theme-color" content="#0f172a">
<meta name="application-name" content="Brand">
<meta name="apple-mobile-web-app-title" content="Brand">
<meta property="fb:app_id" content="...">   <!-- only if provided -->
<link rel="me" href="https://mastodon.example/@brand"> <!-- only if provided -->
```

## Share affordances in the UI (linkability)

Add simple, accessible sharing so people can pass the page around:
- A "Copy link" button using `navigator.clipboard.writeText(canonicalUrl)`
- A Web Share API button where supported: `navigator.share({ title, url })`, with a copy-link fallback
- Share links as plain `<a>` URLs (no tracking scripts needed); use `rel="noopener noreferrer"` and `target="_blank"`

Always share the **canonical** URL, not a URL with tracking or session parameters.

## Testing

Social platforms cache cards. After changes, the SEO specialist re-scrapes with the platform debuggers (Facebook Sharing Debugger, LinkedIn Post Inspector). In code, verify the tags exist in the raw HTML and the image URL returns 200 with `Content-Type: image/*`.
