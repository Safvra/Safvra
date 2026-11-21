# Pre-Delivery SEO Checklist

Run this before reporting any web task as done. Mark each item PASS, FAIL (fix it), or N/A (state why). Check the **raw HTML response** (`curl`, view-source), not only the browser DOM.

## A. Every indexable page

- [ ] `<html lang="...">` set to the correct language code
- [ ] `<meta charset="utf-8">` is first in `<head>`; viewport meta present (`width=device-width, initial-scale=1`), zoom not disabled
- [ ] `<title>` unique, about 50-60 characters, primary topic first, brand last
- [ ] Meta description unique, about 120-160 characters, written for humans, matches the page
- [ ] Canonical: absolute URL, self-referencing, correct protocol, host and trailing-slash style
- [ ] Robots directives correct (default: none needed; add `max-image-preview:large`; `noindex` only where intended)
- [ ] Exactly one `<h1>`, matches the page topic, heading levels do not skip
- [ ] Open Graph: `og:title`, `og:description`, `og:image` (absolute https), `og:url`, `og:type`, `og:site_name`, `og:locale`
- [ ] Twitter/X: `twitter:card` (`summary_large_image`), image alt text
- [ ] JSON-LD present for the page type, parses as valid JSON, matches visible content
- [ ] Main content is in the server-sent HTML (not injected only by client JS)
- [ ] Page is linked from at least one other crawlable page (nav, breadcrumb, related links); not orphaned
- [ ] Internal links are `<a href>` with descriptive anchor text

## B. Non-indexable pages

- [ ] Search, cart, checkout, thank-you, login, dashboard, filtered duplicates have `noindex`
- [ ] Those URLs are excluded from the sitemap
- [ ] `noindex` pages are NOT blocked in robots.txt (crawler must be able to see the tag)
- [ ] 404 page returns a real HTTP 404 status; removed content returns 404 or 410, not a redirect to home

## C. Images and media

- [ ] Every `<img>` has `alt` (descriptive) or `alt=""` (decorative only)
- [ ] Every `<img>` has `width` and `height` (or CSS `aspect-ratio`) so no layout shift
- [ ] Modern formats (AVIF/WebP) with fallback; responsive `srcset` and `sizes` on content images
- [ ] Below-the-fold images use `loading="lazy"`; the LCP image does NOT, and has `fetchpriority="high"`
- [ ] Meaningful images are `<img>`, not CSS backgrounds
- [ ] File names are descriptive, lowercase, hyphenated
- [ ] Favicon set, apple-touch-icon, and web manifest icons present
- [ ] Videos: poster image, no autoplay-with-sound, iframes lazy-loaded, VideoObject schema where relevant

## D. Performance (Core Web Vitals patterns)

- [ ] Fonts: `font-display` set, critical font preloaded, subsetted, fallback metrics adjusted
- [ ] Scripts: non-critical JS `defer` or `async`; third-party scripts loaded late; no large render-blocking CSS or JS
- [ ] Space reserved for embeds, ads, banners, and images (no layout shift)
- [ ] Hashed static assets have long-lived immutable cache headers; HTML is revalidated
- [ ] Compression (Brotli or gzip) enabled on text assets
- [ ] No heavy synchronous work in click and input handlers (INP)

## E. Site-wide files and rules

- [ ] `robots.txt` at site root; includes `Sitemap:` line; does not block CSS, JS, or images
- [ ] XML sitemap generated from real routes; contains only canonical, 200, indexable URLs; accurate `lastmod`; under 50,000 URLs and 50 MB per file (else sitemap index)
- [ ] One canonical host (www or non-www), HTTPS enforced, trailing-slash rule consistent, lowercase URLs
- [ ] 301/308 redirects for any moved or renamed URL; no redirect chains or loops
- [ ] Pagination: each page is a crawlable URL with a self-canonical (not canonical to page 1)
- [ ] hreflang correct (self-referencing, reciprocal, `x-default`) if multi-language or multi-region
- [ ] AI-crawler policy in robots.txt reflects the business decision; flagged in the hand-off report
- [ ] `llms.txt` added only if requested or approved (optional)

## F. Links and trust

- [ ] Paid links use `rel="sponsored"`; user-generated links use `rel="ugc"`; untrusted outbound uses `rel="nofollow"`
- [ ] External links with `target="_blank"` include `rel="noopener"`
- [ ] About, Contact, Privacy, and Terms pages exist and are linked in the footer
- [ ] Articles show author, published date and updated date (`<time datetime>`), matching Article schema
- [ ] Security headers set (HSTS, `X-Content-Type-Options`, `Referrer-Policy`, CSP where feasible); no mixed content
- [ ] No intrusive interstitials or full-page popups blocking content on load

## G. Honesty and hand-off

- [ ] No invented ratings, reviews, prices, addresses, phones, or dates anywhere in markup
- [ ] `grep -rn "TODO(seo)"` results are all listed in the hand-off report
- [ ] No hidden text, keyword stuffing, cloaking, or doorway pages
- [ ] Hand-off report written (`templates/seo-handoff-report.md`): what was done in code, what values are missing, what the SEO specialist must do outside the code

## Quick commands

```bash
# Head essentials in rendered HTML
curl -s URL | grep -iE '<title|name="description"|rel="canonical"|name="robots"|og:|twitter:|<h1|hreflang'

# Count H1s (should be 1)
curl -s URL | grep -oi '<h1' | wc -l

# Images missing alt
curl -s URL | grep -oiE '<img[^>]*>' | grep -vi 'alt='

# Extract and validate JSON-LD
curl -s URL | python3 -c "import sys,re,json; [json.loads(m) for m in re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>', sys.stdin.read(), re.S)]; print('JSON-LD OK')"

# Status codes and redirects
curl -sI URL | head -n 5
curl -sIL http://example.com | grep -iE 'HTTP/|location'

# Leftover placeholders
grep -rn "TODO(seo)" . --include='*.{ts,tsx,js,jsx,astro,vue,svelte,html,md,php}' 2>/dev/null
```
