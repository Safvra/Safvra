#!/usr/bin/env node
/**
 * Build-time sitemap generator (no dependencies). Works for any static or SSR project.
 *
 * Usage:   node sitemap-generator.mjs routes.json public/sitemap.xml
 * Input:   routes.json = [{ "path": "/", "lastmod": "2026-04-10" }, { "path": "/blog/my-post/", "lastmod": "2026-03-01", "alternates": { "fr": "/fr/blog/mon-article/" } }]
 * Env:     SITE_URL=https://example.com   (canonical origin, no trailing slash)
 *
 * Rules enforced:
 *  - Only include canonical, indexable, 200 URLs in routes.json (exclude noindex, redirects, 404s).
 *  - lastmod must be the real last content change. Omit it when unknown (do not use build time).
 *  - Splits into a sitemap index when over 50,000 URLs per file.
 *  - Optional hreflang alternates via `alternates` (include a self-reference automatically).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, basename, join } from 'node:path';

const [, , routesFile = 'routes.json', outFile = 'public/sitemap.xml'] = process.argv;
const SITE_URL = (process.env.SITE_URL || '').replace(/\/$/, '');
const TRAILING_SLASH = process.env.TRAILING_SLASH !== 'false';
const MAX_URLS = 50000;

if (!SITE_URL) {
  console.error('Set SITE_URL, e.g. SITE_URL=https://example.com');
  process.exit(1);
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

function abs(path) {
  let p = path.startsWith('http') ? new URL(path).pathname : path;
  if (!p.startsWith('/')) p = '/' + p;
  if (TRAILING_SLASH && !p.endsWith('/') && !/\.[a-z0-9]+$/i.test(p)) p += '/';
  if (!TRAILING_SLASH && p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return SITE_URL + p;
}

const routes = JSON.parse(readFileSync(routesFile, 'utf8'));
const seen = new Set();
const entries = [];
for (const r of routes) {
  const loc = abs(r.path);
  if (seen.has(loc)) continue; // dedupe
  seen.add(loc);
  entries.push({ ...r, loc });
}

function urlXml(e) {
  let x = `  <url>\n    <loc>${esc(e.loc)}</loc>\n`;
  if (e.lastmod) x += `    <lastmod>${esc(e.lastmod)}</lastmod>\n`;
  if (e.alternates) {
    const set = { ...e.alternates };
    for (const [lang, p] of Object.entries(set)) {
      x += `    <xhtml:link rel="alternate" hreflang="${esc(lang)}" href="${esc(abs(p))}"/>\n`;
    }
  }
  return x + '  </url>\n';
}

const header = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';
const footer = '</urlset>\n';

mkdirSync(dirname(outFile), { recursive: true });

if (entries.length <= MAX_URLS) {
  writeFileSync(outFile, header + entries.map(urlXml).join('') + footer);
  console.log(`Wrote ${entries.length} URLs to ${outFile}`);
} else {
  const dir = dirname(outFile);
  const base = basename(outFile, '.xml');
  const files = [];
  for (let i = 0; i < entries.length; i += MAX_URLS) {
    const name = `${base}-${files.length + 1}.xml`;
    writeFileSync(join(dir, name), header + entries.slice(i, i + MAX_URLS).map(urlXml).join('') + footer);
    files.push(name);
  }
  const index = '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    files.map((f) => `  <sitemap>\n    <loc>${esc(SITE_URL + '/' + f)}</loc>\n  </sitemap>\n`).join('') + '</sitemapindex>\n';
  writeFileSync(outFile, index);
  console.log(`Wrote index ${outFile} and ${files.length} child sitemaps (${entries.length} URLs)`);
}
