# 05. Images and Media

Images drive Largest Contentful Paint, layout stability, image search traffic, and share previews. Apply every rule here to every image you add.

## The standard content image

```html
<picture>
  <source type="image/avif" srcset="/img/hero-480.avif 480w, /img/hero-960.avif 960w, /img/hero-1600.avif 1600w" sizes="(min-width: 1024px) 960px, 100vw">
  <source type="image/webp" srcset="/img/hero-480.webp 480w, /img/hero-960.webp 960w, /img/hero-1600.webp 1600w" sizes="(min-width: 1024px) 960px, 100vw">
  <img src="/img/hero-960.jpg"
       srcset="/img/hero-480.jpg 480w, /img/hero-960.jpg 960w, /img/hero-1600.jpg 1600w"
       sizes="(min-width: 1024px) 960px, 100vw"
       width="1600" height="900"
       alt="Barista pouring latte art into a white cup"
       decoding="async">
</picture>
```

If a framework image component exists (`next/image`, `astro:assets`, `@nuxt/image`, `@sveltejs/enhanced-img`), use it; it generates formats, sizes, and dimensions for you.

## Alt text rules

- Describe the image's content and purpose in context, concisely (typically under about 125 characters). Say what a person who cannot see it needs to know.
- Do not start with "image of" or "picture of". Do not stuff keywords. A relevant keyword used naturally is fine.
- **Decorative images** (pure ornament, redundant with adjacent text) get `alt=""` and no `title`. Never omit the attribute entirely.
- Functional images (icon buttons, linked images) describe the action or destination: `alt="Download the report (PDF)"`.
- Charts and infographics: short alt plus the full information as real text or a table nearby.
- Logos: `alt="Brand"` (not "Brand logo" when it is in a link home, use the destination meaning).
- Never reuse the same alt text for many different images, and never leave a file name as alt.
- For generated or CMS-driven images, require an alt field in the data model and fail the build or show a warning when it is empty.

## Formats

| Content | Preferred format |
|---|---|
| Photos | AVIF, then WebP, then JPEG fallback |
| Graphics with flat color, logos, icons | SVG (inline or `<img>`), minified |
| Transparent photos or UI | WebP or AVIF with PNG fallback |
| Animations | MP4 or WebM video (muted, looped, playsinline) instead of GIF |
| Share images (OG) | JPEG or PNG (best scraper compatibility) |

Compression targets: tune quality (AVIF about 50-60, WebP about 75-80, JPEG about 75-80 with progressive encoding). Strip metadata. Do not ship images larger than they are displayed (account for 2x density at most).

## Dimensions and layout shift

- Always set `width` and `height` attributes (the intrinsic size) so the browser reserves space, together with CSS `max-width: 100%; height: auto;`. Or set CSS `aspect-ratio`.
- Reserve space for images loaded later (carousels, embeds, user content).
- Do not resize with CSS from a huge source; serve the right size via `srcset`.

## Loading priority

- **LCP image (usually the hero)**: no `loading="lazy"`; add `fetchpriority="high"`; consider `<link rel="preload" as="image" ...>` (with `imagesrcset` and `imagesizes` for responsive images). Never lazy-load it.
- **Below the fold**: `loading="lazy"` and `decoding="async"`.
- Do not lazy-load images that are visible without scrolling (header logo, first card row).
- Do not use JavaScript-only lazy loaders that hide the real `src` from crawlers. Use native `loading="lazy"`. If a library is unavoidable, include a `<noscript>` fallback and keep `src` or `srcset` in the markup.

## Indexable images

- Use `<img>` or `<picture>` for images you want in image search. CSS `background-image` is generally not indexed as page content. Use backgrounds only for decoration.
- Descriptive file names: `espresso-machine-cleaning.jpg`, not `IMG_4021.jpg`. Lowercase, hyphens.
- Place images near relevant text; wrap with `<figure>` and add `<figcaption>` when a caption helps.
- Stable, crawlable URLs (not blocked by robots.txt, not behind auth). Avoid unique-per-request URLs.
- Optionally add images to the XML sitemap using the image extension (`<image:image><image:loc>`). Modern guidance only requires `image:loc`.
- Use `ImageObject` in schema for key images (logo, product, article lead image).

## Icons, favicon, and manifest

- `favicon.ico` (48x48 multiples), `icon.svg`, `apple-touch-icon.png` (180x180), manifest icons 192x192 and 512x512 (plus maskable). See `01-meta-and-head.md`.
- Inline small SVG icons; use `aria-hidden="true"` for decorative icons, and visible text or `aria-label` for meaning.

## Video and embeds

- Self-hosted video: `<video controls preload="metadata" poster="...">` with `width` and `height`; provide captions (`<track kind="captions">`) and a transcript for important content. Autoplay only if muted, short, and non-essential.
- Add `VideoObject` JSON-LD for videos that are the page's main content, and include the video in a video sitemap if the specialist requests it.
- Third-party embeds (YouTube, maps): `loading="lazy"` on the iframe, explicit width and height (or aspect-ratio container), and consider a click-to-load "facade" (poster image plus play button) to protect INP and LCP. For YouTube use the privacy-enhanced domain where appropriate.
- iframes must have a `title` attribute.

## Responsive art direction

Use `<picture>` with `media` on `<source>` when a different crop is needed on mobile, not just a different size.

## Build-time automation (recommended)

- Generate multiple widths and formats at build time (framework image pipeline, `sharp`, or CDN image transformation).
- Add a lint or build check that fails on `<img>` without `alt`, `width`, or `height`.
- Serve images from a CDN with long-lived immutable caching (`Cache-Control: public, max-age=31536000, immutable`) for hashed file names.

## Anti-patterns

- Missing or filename alt text; same alt everywhere; keyword-stuffed alt
- `loading="lazy"` on the hero image
- Full-size 4000 px photos scaled down in CSS
- Meaningful content images as CSS backgrounds
- Images without `width` and `height` (causes layout shift)
- Autoplaying GIFs; heavy carousels above the fold
- Hotlinking images from third-party sites
- Blocking `/images/` in robots.txt
