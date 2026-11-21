# 06. Performance and Core Web Vitals

Page experience is part of how pages are evaluated, and speed strongly affects users. The Core Web Vitals (measured at the 75th percentile of real users) are:

| Metric | Good | What it measures |
|---|---|---|
| LCP (Largest Contentful Paint) | 2.5 s or less | Loading: when the main content appears |
| INP (Interaction to Next Paint) | 200 ms or less | Responsiveness to taps, clicks, and keys |
| CLS (Cumulative Layout Shift) | 0.1 or less | Visual stability |

Thresholds are Google's published targets; field data is measured by the SEO specialist with real-user tools. In code, you apply the patterns below.

## LCP: make the main content arrive fast

1. **Server-render** or pre-render the HTML so the LCP element is in the first response.
2. **Prioritize the LCP resource**: `fetchpriority="high"` on the hero `<img>`, no lazy loading, and `<link rel="preload" as="image" href="..." fetchpriority="high">` when it is discovered late (CSS backgrounds, JS-rendered).
3. **Fast server response**: cache HTML at the edge (SSG/ISR/CDN), compress (Brotli), use HTTP/2 or HTTP/3, avoid redirect chains.
4. **Cut render-blocking resources**: inline critical CSS, load the rest asynchronously, keep stylesheet count low, `defer` scripts.
5. **Right-size images** (see `05-images-media.md`). The hero is often the biggest win.
6. **Preconnect** to critical third-party origins used early (font host, image CDN):
   ```html
   <link rel="preconnect" href="https://cdn.example.com" crossorigin>
   ```
   Limit to a few origins. Use `dns-prefetch` for lower-priority ones.

## CLS: keep the layout still

- `width` and `height` (or `aspect-ratio`) on all images, video, iframes, and embeds.
- Reserve space for ads, banners, cookie notices, and dynamically injected content with `min-height` or fixed containers. Insert new content below existing content, not above, unless triggered by user action.
- **Fonts**: use `font-display: swap` or `optional`, and match fallback metrics with `size-adjust`, `ascent-override`, `descent-override` (frameworks like `next/font` do this automatically).
- Animate with `transform` and `opacity`, not properties that change layout (`top`, `height`, `margin`).
- Avoid injecting banners or promos above the fold after load.
- Skeleton screens must match the final dimensions.

## INP: stay responsive

- Break up long tasks (over 50 ms): split work, use `requestIdleCallback`, `scheduler.postTask` / `scheduler.yield()` where available, or `setTimeout` chunking.
- Keep event handlers light; do heavy work off the main thread (Web Workers) or after the interaction paints.
- Avoid large synchronous re-renders: memoize, virtualize long lists, debounce input handlers.
- Limit third-party scripts; they are a leading cause of poor INP.
- Hydrate selectively: islands architecture, partial hydration, or server components keep the amount of client JS small.
- Do not attach expensive listeners to `scroll` or `mousemove` without throttling; use passive listeners.

## Fonts

```html
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
```
```css
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-var.woff2") format("woff2");
  font-display: swap;
  font-weight: 100 900;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153; /* subset */
}
```
- Self-host WOFF2, subset to needed glyphs, limit families and weights, use a variable font where it reduces files.
- Preload only the one or two fonts used above the fold.

## JavaScript

- Ship less: code-split by route, tree-shake, remove unused dependencies, avoid huge client-side libraries for simple tasks.
- `<script defer>` for your own scripts; `async` for independent third-party scripts; avoid synchronous scripts in `<head>`.
- Load analytics, chat widgets, and tag managers after the page is interactive (on idle or on interaction).
- Use `type="module"` and modern builds; avoid shipping legacy transpilation to modern browsers.
- Do not require JavaScript to display primary content or navigation (also an SEO crawlability rule).

## CSS

- Inline only the critical above-the-fold CSS; keep the rest in cacheable, minified files.
- Remove unused CSS (purge in Tailwind or equivalent), avoid `@import` chains.
- Prefer CSS over JS for layout and animation.

## Caching and delivery

| Resource | Cache-Control |
|---|---|
| Hashed static assets (JS, CSS, fonts, images with hash in name) | `public, max-age=31536000, immutable` |
| HTML | `public, max-age=0, must-revalidate` (or short s-maxage with CDN revalidation) |
| Images without hashes | `public, max-age=86400` and a versioning plan |
| API responses | by data freshness; `stale-while-revalidate` where safe |

- Enable Brotli (or gzip) for HTML, CSS, JS, SVG, JSON.
- Use a CDN and HTTP/2 or HTTP/3. Use `ETag` or `Last-Modified` for conditional requests.
- Back/forward cache: avoid `unload` handlers and `Cache-Control: no-store` on normal pages so the browser can restore pages instantly.

## Resource hints (use sparingly)

- `preload` for things needed immediately (LCP image, critical font).
- `preconnect` for critical third-party origins.
- `prefetch` for likely next pages (framework link prefetching handles this).
- The `<link rel="modulepreload">` for critical module chunks.
- Over-preloading hurts; every hint competes for bandwidth.

## Mobile first

- Design and test for a mid-range phone on a slow connection. Responsive layout with fluid grids; tap targets at least about 48 px; readable base font size (16 px or more).
- No horizontal scroll at narrow widths.

## Build-time budgets (recommended)

Set simple budgets and fail or warn when exceeded, for example: initial JS under about 170 KB compressed for content pages, hero image under about 200 KB, total page weight under about 1.5 MB. Tune per project; the point is to have a guardrail.

## Anti-patterns

- Client-rendered above-the-fold content with a large JS bundle
- Hero image lazy-loaded or loaded via JS
- Web fonts with `font-display: block` and no preload
- Third-party tag soup loaded in `<head>` synchronously
- Layout jumping from late banners, ads, or font swaps
- Autoplay hero video loading before the poster
- Giant unminified bundles, no compression, no caching headers
