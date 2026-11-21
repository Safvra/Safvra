# 12. Framework and Platform Implementations

Use each framework's own SEO API so tags are rendered on the server, deduplicated, and typed. APIs evolve; if the project's version differs from what is shown, follow that version's official documentation but keep the same outcomes (rules in `01`-`11`).

First, detect rendering mode. SEO-critical content must be in the server-sent HTML:
- Good: static generation, server rendering, prerendering, islands with server HTML
- Risky: client-only SPA (Vite or Create React App with no prerender)

---

## Next.js (App Router)

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import { siteConfig } from '@/seo.config';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  alternates: { canonical: '/' },
  openGraph: { siteName: siteConfig.name, type: 'website', locale: siteConfig.locale, images: [siteConfig.defaultOgImage] },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true, googleBot: { 'max-image-preview': 'large', 'max-snippet': -1 } },
};
```

```tsx
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;            // params is a Promise in recent versions
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.seoTitle ?? post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}/` },
    openGraph: { type: 'article', publishedTime: post.date, modifiedTime: post.updated, images: [post.image] },
  };
}
```

- Sitemap: `app/sitemap.ts` returning `MetadataRoute.Sitemap`; robots: `app/robots.ts`; manifest: `app/manifest.ts`.
- OG images: `opengraph-image.tsx` using `ImageResponse`, or static `opengraph-image.png` next to the route.
- JSON-LD: render `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />` inside the page component.
- Images: `next/image` with `width`/`height` or `fill` plus `sizes`; `priority` (or `fetchPriority="high"`) only on the LCP image; configure `images.formats: ['image/avif', 'image/webp']`.
- Fonts: `next/font` (self-hosted, preloaded, metric-adjusted).
- Redirects/headers: `redirects()` and `headers()` in `next.config`; `trailingSlash` set deliberately; `notFound()` returns a real 404.
- Use SSG/ISR (`generateStaticParams`, `revalidate`) for content pages.
- Pages Router: `next/head` for tags, `next-sitemap` for sitemap and robots, `getStaticProps`/`getServerSideProps` for data.

## Astro

```astro
---
// src/layouts/Base.astro
import { siteConfig } from '../seo.config';
const { title, description, image = siteConfig.defaultOgImage, noindex = false, type = 'website' } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site).toString();
const ogImage = new URL(image, Astro.site).toString();
---
<html lang={siteConfig.lang}>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  {noindex && <meta name="robots" content="noindex, nofollow" />}
  <meta property="og:type" content={type} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content={ogImage} />
  <meta name="twitter:card" content="summary_large_image" />
  <slot name="head" />
</head>
<body><slot /></body>
</html>
```

- Set `site` in `astro.config.mjs` (required for canonical URLs and the sitemap). Set `trailingSlash` and `build.format` deliberately.
- Sitemap: `@astrojs/sitemap` integration (configure `filter` to exclude noindex pages and `lastmod` if available). RSS: `@astrojs/rss`.
- Images: `astro:assets` `<Image />` and `<Picture />` (formats, widths, dimensions inferred). JSON-LD: `<script type="application/ld+json" set:html={JSON.stringify(data).replace(/</g, '\\u003c')} />`.
- Redirects: `redirects` in config (static) or host config. 404: `src/pages/404.astro`.
- Islands (`client:*`) keep JS minimal; prefer `client:visible` or `client:idle`.

## Nuxt (Vue)

```vue
<script setup lang="ts">
const route = useRoute();
const { siteUrl, siteName } = useRuntimeConfig().public;
useSeoMeta({
  title: 'Page title',
  description: 'Page description',
  ogTitle: 'Page title',
  ogDescription: 'Page description',
  ogImage: `${siteUrl}/og/default.jpg`,
  ogUrl: `${siteUrl}${route.path}`,
  twitterCard: 'summary_large_image',
});
useHead({
  htmlAttrs: { lang: 'en' },
  link: [{ rel: 'canonical', href: `${siteUrl}${route.path}` }],
  script: [{ type: 'application/ld+json', innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage' }).replace(/</g, '\\u003c') }],
});
</script>
```

- Prefer the official modules for the full set: `@nuxtjs/seo` (sitemap, robots, schema.org, og-image, link-checker, SEO utils), `@nuxt/image` (`<NuxtImg>`, `<NuxtPicture>` with `format`, `sizes`, `loading`, `fetchpriority`), `@nuxtjs/i18n`.
- Rendering: SSR or `nuxt generate`; use `routeRules` for per-route prerender, caching, and redirects (`'/old': { redirect: { to: '/new', statusCode: 301 } }`). `noindex` per route via `routeRules` headers or `useSeoMeta({ robots: 'noindex' })`.
- 404: `throw createError({ statusCode: 404 })` in pages and `error.vue` for the custom page.

## SvelteKit

```svelte
<!-- +page.svelte -->
<script>
  import { siteConfig } from '$lib/seo.config';
  export let data;
  $: canonical = new URL(data.path, siteConfig.url).toString();
</script>
<svelte:head>
  <title>{data.title} | {siteConfig.name}</title>
  <meta name="description" content={data.description} />
  <link rel="canonical" href={canonical} />
  <meta property="og:title" content={data.title} />
  <meta property="og:url" content={canonical} />
  {@html `<script type="application/ld+json">${JSON.stringify(data.jsonLd).replace(/</g, '\\u003c')}</script>`}
</svelte:head>
```

- Use `export const prerender = true` for static pages; SSR otherwise. Set `trailingSlash` in `+layout.ts`.
- Sitemap and robots: `src/routes/sitemap.xml/+server.ts` and `robots.txt/+server.ts` returning `new Response(xml, { headers: { 'Content-Type': 'application/xml' } })`.
- Images: `@sveltejs/enhanced-img` (`<enhanced:img>`). 404: `error(404, 'Not found')` from `@sveltejs/kit`.
- Redirects: `redirect(301, '/new')` in load functions or hooks; host config for static redirects.

## React SPA (Vite or CRA) and React Router / Remix

- **Client-only SPA is the weakest SEO setup.** Tags set by `react-helmet-async` after hydration may not be seen by crawlers that skip JS. Options in order of preference: migrate to an SSR/SSG framework (Next.js, Astro with React islands, Remix or React Router framework mode); or add build-time prerendering (`vite-react-ssg`, `vite-plugin-ssr`/Vike, `react-snap`) for all indexable routes.
- At minimum, put a correct default `<title>`, description, canonical, OG tags, and `<noscript>` content in `index.html` so the base shell is sane, and add per-route tags via prerender.
- React Router / Remix: use the route `meta` export (and `links` export) for tags; loaders for data; return real 404 responses (`throw new Response(null, { status: 404 })`).
- Use `react-helmet-async` (SSR-compatible) only with server rendering.
- Navigation: `<Link to>` renders real `<a href>`; do not use `navigate()` in click handlers for ordinary navigation.

## Angular

- Use Angular SSR (`@angular/ssr`) with prerendering. Set tags with the `Title` and `Meta` services and a `Renderer2`/`DOCUMENT` approach for canonical and JSON-LD, in a route resolver or a central `SeoService` driven by route `data`.
- Use `NgOptimizedImage` (`ngSrc`, `priority`, `width`/`height`) for images. Route redirects in the router config and host.

## Vue SPA (non-Nuxt)

Same advice as React SPA: add SSR (`vite-ssg`, or move to Nuxt) and use `@unhead/vue` for head management.

## Plain HTML / static sites

- Create a **single head partial** (build step, templating engine, or include) so metadata is generated per page from front matter or a JSON data file rather than copy-pasted. Static generators: Eleventy (`eleventy-plugin-seo` patterns or layouts), Hugo (`{{ partial "head.html" . }}` with `.Permalink`, `.Params`, `.Site`), Jekyll (`jekyll-seo-tag`, `jekyll-sitemap`).
- Generate sitemap and robots with a script (`../templates/sitemap-generator.mjs`) in the build.
- Redirects: `_redirects` (Netlify, Cloudflare Pages), `vercel.json`, `.htaccess` (Apache), nginx config. Templates in `../templates/server-config.md`.
- Add `404.html` and ensure the host serves it with a 404 status.

## WordPress themes and plugins

- If **Yoast SEO, Rank Math, SEOPress, or All in One SEO** is active, let it own titles, meta, canonical, schema, and sitemaps. Do not output duplicates; integrate via its filters.
- Without a plugin, theme code should:
  - `add_theme_support( 'title-tag' );` and never hardcode `<title>` in `header.php`.
  - Output description, canonical (WordPress core emits a canonical for singular views), OG, and JSON-LD from a function hooked to `wp_head`, escaping with `esc_attr`, `esc_url`, and `wp_json_encode` (use `JSON_UNESCAPED_SLASHES | JSON_HEX_TAG`).
  - Use `wp_get_attachment_image()` / `the_post_thumbnail()` so `srcset`, `sizes`, `width`, `height`, and `loading` attributes are generated; require alt text.
  - Use `wp_robots` filter (WP 5.7+) for robots directives; noindex search results and thin archives; core sitemap at `/wp-sitemap.xml` can be customized or extended.
  - Use `wp_nav_menu`, `the_breadcrumb`-style functions with schema, and semantic templates (`<main>`, `<article>`).
  - Enqueue scripts with `strategy => 'defer'` via `wp_enqueue_script`. Avoid render-blocking plugins' assets on pages that do not need them.
  - Register `rel="ugc nofollow"` for comment links (core does by default) and sanitize.
- Headless WordPress: use the front-end framework section above and pull Yoast's REST/GraphQL head data if Yoast is used.

## Server-rendered backends (Django, Laravel, Rails, Express, etc.)

| Stack | Pieces |
|---|---|
| Django | `django.contrib.sitemaps`, template blocks `{% block title %}`/`{% block meta %}`, `django-meta` or custom context processor, `SECURE_*` settings for HTTPS and HSTS |
| Laravel | `spatie/laravel-sitemap`, Blade layouts with `@yield`/`@stack`, `artesaos/seotools` optional, middleware for headers and redirects |
| Rails | `sitemap_generator` gem, `content_for :title`/`:head`, `meta-tags` gem, `force_ssl`, `config/routes.rb` redirects (`301`) |
| Express/Node | EJS/Pug/Handlebars layout with a head partial; `compression`; `helmet` for headers; `express-sitemap-xml` or custom route |
| ASP.NET | Razor layouts with `@section Head`, `Microsoft.AspNetCore.HttpsPolicy`, sitemap middleware |

Common pattern: a base layout with overridable blocks for title, description, canonical, robots, OG, and JSON-LD, with defaults from config and required overrides enforced by a test.

## Shopify, Webflow, Wix, Squarespace, and other hosted builders

Code-level control is limited to templates or custom code areas:
- Shopify (Liquid): edit `theme.liquid` and sections for title and meta via `{{ page_title }}` and `{{ page_description }}`, `canonical_url`, JSON-LD for Product using `product` objects (avoid duplicating the theme's built-in structured data), image `srcset` via `image_url` filters and `loading` attributes, `robots.txt.liquid` for crawler rules, URL redirects in admin (hand off to the specialist).
- Webflow, Wix, Squarespace: use per-page SEO settings and custom-code injection for JSON-LD; provide copy-paste snippets and tell the specialist which settings to fill.

## Cross-framework checklist of equivalents

| Need | Look for |
|---|---|
| Title and meta from data | Metadata API / head composable / layout props |
| Canonical absolute URL | `metadataBase` / `Astro.site` / `siteUrl` config |
| Sitemap | Built-in route file, official integration, or generator script |
| robots.txt | Route file or static file generated per environment |
| Images | Official image component; never raw unoptimized `<img>` for content |
| 404 status | Framework `notFound` / `error(404)` / `createError` |
| Redirects | Framework config or host config, permanent code |
| i18n | Official i18n routing plus one alternates helper |
| JSON-LD | Small escaping helper; server-rendered |

## Verification per framework

Build and run the production output (not only the dev server), then check raw HTML:
```bash
npm run build && npm run start   # or preview
curl -s http://localhost:3000/ | grep -iE '<title|name="description"|rel="canonical"|og:title|application/ld\+json|<h1'
```
Dev servers can differ from production (client-only rendering, missing prerender). Always verify the built output.
