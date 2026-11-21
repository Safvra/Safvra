# SEO Hand-off Report

Project: {{ project name }}
Date: {{ date }}
Framework and rendering mode: {{ e.g. Next.js App Router, SSG }}

Keep this short and concrete. List facts, not effort.

## 1. Implemented in code

- Metadata: {{ titles, descriptions, canonicals via X helper; config at path }}
- Social cards: {{ OG + Twitter, default image, dynamic images yes/no }}
- Structured data: {{ types per page type, e.g. Organization, WebSite sitewide; Article on /blog/*; Product on /products/* }}
- Semantic structure: {{ one H1, landmarks, breadcrumbs with schema }}
- Images: {{ format pipeline, alt required, LCP priority, width/height }}
- Performance patterns: {{ fonts, defer scripts, reserved space, caching headers }}
- Crawl files: {{ robots.txt, sitemap (generated from X, N URLs), redirects, custom 404 status }}
- AI search: {{ crawler policy implemented, llms.txt yes/no }}
- Links: {{ rel attributes via component, linkable assets built: press kit, data pages, embeds, feeds }}
- Security and trust: {{ HTTPS/HSTS, headers, About/Contact/Privacy linked }}
- i18n / local: {{ hreflang set, NAP source, location pages }} (or N/A)

## 2. Values still needed (TODO(seo))

| File | Placeholder | What is needed | Owner |
|---|---|---|---|
| seo.config.ts | `url` | Production URL | Developer / specialist |
| seo.config.ts | `twitterHandle` | Real handle | Specialist |

(Every `grep -rn "TODO(seo)"` hit must appear here.)

## 3. Decisions needed from the business or specialist

- AI training crawler policy (currently: {{ allow | disallow }})
- Canonical host and trailing-slash policy (currently: {{ example.com, trailing slash }})
- Widget or embed attribution link policy (nofollow or not): {{ if applicable }}
- Pages to noindex beyond the defaults: {{ list }}

## 4. For the SEO specialist (outside the code)

- Verify properties and submit `https://example.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools
- Confirm structured data in the Rich Results Test and Schema Markup Validator for: {{ page URLs }}
- Re-scrape share cards after launch (Facebook Sharing Debugger, LinkedIn Post Inspector)
- Keyword mapping, title and description copy review, content strategy
- Measure Core Web Vitals with real-user data after launch
- Link building, digital PR, citations, and Google Business Profile (if local)
- Check CDN or WAF bot rules do not block search or AI crawlers
- Set the preferred domain at the host if needed (host dashboard task)

## 5. Known limitations or trade-offs

- {{ e.g. client-only routes at /app are noindex by design }}
- {{ e.g. FAQ markup added but Google limits FAQ rich results to certain sites }}

## 6. Verification performed

- Raw HTML checked on: {{ URLs }} (title, description, canonical, OG, JSON-LD, one H1)
- JSON-LD parses: {{ yes }}
- Sitemap URLs return 200 and match canonicals: {{ yes }}
- 404 returns a real 404 status: {{ yes }}
