# Server Config Templates: Redirects, Headers, Caching, 404

Pick the block that matches the hosting target. Replace `example.com`. Choose **one** canonical host (apex or www) and one trailing-slash policy, then enforce them everywhere: redirects, canonical tags, sitemap, internal links.

## Canonical host + HTTPS (single hop)

### nginx
```nginx
# http -> https canonical host in ONE redirect
server {
  listen 80;
  server_name example.com www.example.com;
  return 301 https://example.com$request_uri;
}
server {
  listen 443 ssl http2;
  server_name www.example.com;
  # ssl_certificate ...
  return 301 https://example.com$request_uri;
}
server {
  listen 443 ssl http2;
  server_name example.com;
  # ssl_certificate ...

  # Security headers
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
  add_header X-Frame-Options "SAMEORIGIN" always;

  # Compression
  brotli on;  # if module present
  gzip on;
  gzip_types text/css application/javascript application/json image/svg+xml application/xml;

  # Hashed static assets: cache for a year
  location ~* \.(?:css|js|woff2|avif|webp|png|jpg|jpeg|svg|ico)$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
  }
  # HTML: always revalidate
  location / {
    add_header Cache-Control "public, max-age=0, must-revalidate";
    try_files $uri $uri/ =404;
  }

  # Specific permanent redirects (add each renamed or removed URL)
  location = /old-page/ { return 301 /new-page/; }

  # Strip trailing slash variants or enforce them (pick ONE). Example enforce trailing slash:
  # rewrite ^([^.]*[^/])$ $1/ permanent;

  error_page 404 /404.html;  # must return a real 404 status
}
```

### Apache (.htaccess)
```apache
RewriteEngine On

# https + canonical host in one hop
RewriteCond %{HTTPS} off [OR]
RewriteCond %{HTTP_HOST} ^www\.example\.com$ [NC]
RewriteRule ^ https://example.com%{REQUEST_URI} [L,R=301]

# Specific permanent redirects
Redirect 301 /old-page/ /new-page/

# Headers
<IfModule mod_headers.c>
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set X-Frame-Options "SAMEORIGIN"
</IfModule>

# Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/avif "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

ErrorDocument 404 /404.html
```

### Netlify / Cloudflare Pages (`_redirects` and `_headers`)
```
# _redirects  (order matters; first match wins)
http://example.com/*      https://example.com/:splat  301!
http://www.example.com/*  https://example.com/:splat  301!
https://www.example.com/* https://example.com/:splat  301!
/old-page/                /new-page/                  301
/old-blog/*               /blog/:splat                301
```
```
# _headers
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Frame-Options: SAMEORIGIN

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

### Vercel (`vercel.json`)
```json
{
  "cleanUrls": true,
  "trailingSlash": true,
  "redirects": [
    { "source": "/old-page", "destination": "/new-page/", "permanent": true },
    { "source": "/old-blog/:slug", "destination": "/blog/:slug/", "permanent": true }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
```
Vercel redirects to HTTPS automatically; set the primary domain in project settings so the non-primary host redirects to it (a dashboard task, hand off to the specialist or developer).

### Next.js (`next.config.js`)
```js
module.exports = {
  trailingSlash: true,
  images: { formats: ['image/avif', 'image/webp'] },
  async redirects() {
    return [
      { source: '/old-page', destination: '/new-page/', permanent: true },
      { source: '/old-blog/:slug', destination: '/blog/:slug/', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};
```

### Astro (static redirects, `astro.config.mjs`)
```js
export default {
  site: 'https://example.com',
  trailingSlash: 'always',
  redirects: {
    '/old-page': { status: 301, destination: '/new-page/' },
  },
};
```

### Nuxt (`nuxt.config.ts`)
```ts
export default defineNuxtConfig({
  routeRules: {
    '/old-page': { redirect: { to: '/new-page/', statusCode: 301 } },
    '/assets/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
  },
});
```

### Express (Node)
```js
import helmet from 'helmet';
import compression from 'compression';
app.use(helmet());          // sensible security headers
app.use(compression());
app.use((req, res, next) => {  // canonical host + https
  const host = req.headers.host;
  if (req.protocol !== 'https' || host.startsWith('www.')) {
    return res.redirect(301, `https://example.com${req.originalUrl}`);
  }
  next();
});
app.use('/assets', express.static('public/assets', { maxAge: '1y', immutable: true }));
// 404 LAST: must set the status
app.use((req, res) => res.status(404).sendFile('/path/to/404.html'));
```

## Redirect map discipline

Keep `redirects.json` in version control and generate host config from it:
```json
[
  { "from": "/old-page/", "to": "/new-page/", "status": 301 },
  { "from": "/blog/2024/old-title/", "to": "/blog/new-title/", "status": 301 }
]
```
Rules: one hop to the final URL, no chains or loops, redirect to the closest equivalent (not blanket to home), return 404 or 410 when no equivalent exists, and add a redirect in the same change whenever a slug or route is renamed.

## Custom 404 requirements

- Real **404 status** (never 200). Test: `curl -sI https://example.com/definitely-missing | head -n 1`
- Branded page with search, links to home and top sections, no auto-redirect.
- `noindex` meta is optional; the 404 status is what matters.
- Use 410 for content removed on purpose and permanently.

## Maintenance mode

Return `503 Service Unavailable` with `Retry-After: 3600` while the site is down for maintenance; do not return 200 or redirect to a maintenance page with a 200.

## Staging and preview protection

Send `X-Robots-Tag: noindex, nofollow` on every response from non-production hosts, plus `Disallow: /` in their robots.txt, and ideally password protection:
```nginx
# staging server block
add_header X-Robots-Tag "noindex, nofollow" always;
```
