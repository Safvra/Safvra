# 10. Security, Trust, and Page-Experience Hygiene

Secure, trustworthy, non-intrusive pages protect users and support search performance. HTTPS is a lightweight ranking signal; the rest protects trust, rendering, and safe browsing status.

## HTTPS everywhere

- Serve the entire site over HTTPS; redirect all HTTP to HTTPS with a single 301/308 hop.
- Valid certificate, auto-renewal, modern TLS.
- **HSTS**: `Strict-Transport-Security: max-age=31536000; includeSubDomains` (add `preload` only after confirming every subdomain supports HTTPS and the owner wants preload-list submission).
- **No mixed content**: all images, scripts, styles, fonts, iframes, and API calls use `https://` or protocol-relative-safe absolute paths. Add `upgrade-insecure-requests` in the CSP while migrating.
- Canonical, sitemap, hreflang, schema, and OG URLs all use `https://`.

## Security headers

Set at the server, CDN, or framework config (see `../templates/server-config.md`):

| Header | Recommended value |
|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | disable unneeded features, e.g. `camera=(), microphone=(), geolocation=()` |
| `Content-Security-Policy` | start restrictive and tune: `default-src 'self'; img-src 'self' data: https:; script-src 'self' 'nonce-...'; ...` |
| `X-Frame-Options` or CSP `frame-ancestors` | `SAMEORIGIN` / `frame-ancestors 'self'` |
| `Cross-Origin-Opener-Policy` | `same-origin` where compatible |

Caveats for SEO compatibility:
- A strict CSP can break JSON-LD only if inline scripts are blocked and no nonce is used. Add the nonce to the JSON-LD script tag, or use hashes.
- Do not set `X-Robots-Tag: noindex` globally by mistake. Only on staging or specific file types.
- Never serve bots different security or content behavior than users (cloaking).
- Do not block Googlebot, Bingbot, or legitimate AI crawlers with bot-protection rules unless intended; mention WAF rules in the hand-off.

## Trust pages and signals (build and link them)

Create, or confirm exist, and link from the footer on every page:
- **About** (who is behind the site, mission, history, team)
- **Contact** (email, phone, address as visible text; a form is not a substitute)
- **Privacy Policy** and **Terms of Service**
- **Cookie policy / preferences** where required
- **Editorial policy, authorship, and corrections** for content sites
- **Returns, shipping, and refund policy** for stores (and `hasMerchantReturnPolicy` in Product offers where accurate)
- **Reviews and testimonials** only if real and attributable
- **Security contact** at `/.well-known/security.txt` (RFC 9116):
  ```
  Contact: mailto:security@example.com
  Expires: 2027-12-31T23:59:00.000Z
  Preferred-Languages: en
  Canonical: https://example.com/.well-known/security.txt
  ```
  Use a real contact (`TODO(seo)` if unknown) and update `Expires`.

Include business identity details (legal name, address, registration) in the footer and `Organization` schema where applicable and accurate.

## Intrusive interstitials and popups

Pages where an intrusive interstitial covers the main content right after arrival from search can be devalued, and they harm UX and CLS.
- Do not show full-screen or content-blocking popups on landing. Use small banners or inline prompts, or delay and trigger on intent.
- Cookie consent banners: small, non-blocking where the law allows; reserve space or overlay without shifting layout; legally required consent walls are an exception but keep them compact.
- Age verification and login walls where legally required are acceptable; keep indexable content accessible to crawlers according to Google's paywalled content guidance.

## Paywalls and gated content

- For subscription content that should be indexed, use `isAccessibleForFree: false` with `hasPart` and a CSS selector in `Article` schema so it is not mistaken for cloaking:
  ```json
  "isAccessibleForFree": false,
  "hasPart": { "@type": "WebPageElement", "isAccessibleForFree": false, "cssSelector": ".paywalled" }
  ```
- Provide enough visible content for crawlers and users to judge the page.

## User-generated content safety

- Moderate and sanitize comments, reviews, and profiles. Escape output. Rewrite links with `rel="ugc nofollow"` (see `08`).
- Rate-limit and add spam protection (honeypot, CAPTCHA only on submission forms) so spam cannot flood the site with outbound links.
- Noindex low-quality or new user-generated pages until moderated.

## Safe Browsing and hacked-site hygiene

- Keep dependencies updated; remove unused scripts and plugins.
- Subresource Integrity (`integrity` and `crossorigin`) for third-party scripts from CDNs.
- Do not load unvetted third-party scripts; they can inject spam links and hidden content.
- Log and review outbound link patterns in templates.

## Privacy and compliance (code-level)

- Load analytics and marketing scripts only after consent where required by law; do not let consent logic block rendering of primary content.
- Do not expose personal data in URLs or meta tags.

## Anti-patterns

- Mixed content warnings; HTTP canonicals
- Missing About, Contact, or Privacy pages on a site that asks for personal data or money
- Full-screen newsletter popup on first load
- Global `noindex` header left over from staging
- Overly aggressive bot blocking that also blocks search and AI crawlers
- Third-party script tags with no integrity or vetting
