# Image Component Templates

Use the framework's image component when one exists (`next/image`, `astro:assets`, `@nuxt/image`, `@sveltejs/enhanced-img`, `NgOptimizedImage`). Use these templates for plain HTML or when building your own component.

## Plain HTML: content image

```html
<picture>
  <source type="image/avif"
          srcset="/img/example-480.avif 480w, /img/example-960.avif 960w, /img/example-1600.avif 1600w"
          sizes="(min-width: 1024px) 960px, 100vw">
  <source type="image/webp"
          srcset="/img/example-480.webp 480w, /img/example-960.webp 960w, /img/example-1600.webp 1600w"
          sizes="(min-width: 1024px) 960px, 100vw">
  <img src="/img/example-960.jpg"
       srcset="/img/example-480.jpg 480w, /img/example-960.jpg 960w, /img/example-1600.jpg 1600w"
       sizes="(min-width: 1024px) 960px, 100vw"
       width="1600" height="900"
       alt="Describe what the image shows in context"
       loading="lazy" decoding="async">
</picture>
```

## Plain HTML: LCP (hero) image

```html
<!-- in <head>, only for the hero -->
<link rel="preload" as="image" href="/img/hero-1600.avif" type="image/avif"
      imagesrcset="/img/hero-480.avif 480w, /img/hero-960.avif 960w, /img/hero-1600.avif 1600w"
      imagesizes="100vw" fetchpriority="high">

<!-- in the body: NOT lazy -->
<img src="/img/hero-1600.jpg" width="1600" height="900"
     alt="Descriptive alt text" fetchpriority="high" decoding="async">
```

## Plain HTML: decorative image

```html
<img src="/img/divider.svg" alt="" width="1200" height="40" loading="lazy">
```

## Figure with caption

```html
<figure>
  <img src="/img/chart-960.jpg" width="960" height="540" alt="Line chart: monthly users doubled from January to June" loading="lazy" decoding="async">
  <figcaption>Monthly active users, January to June 2026.</figcaption>
</figure>
```

## React component (framework-agnostic, enforces the rules)

```tsx
type Props = {
  src: string;                 // base path without size/format suffix, e.g. "/img/hero"
  alt: string;                 // REQUIRED. Use "" only when decorative.
  width: number;               // intrinsic width
  height: number;              // intrinsic height
  widths?: number[];           // generated widths
  sizes?: string;
  priority?: boolean;          // true ONLY for the LCP image
  className?: string;
};

export function Img({ src, alt, width, height, widths = [480, 960, 1600], sizes = '100vw', priority = false, className }: Props) {
  const set = (ext: string) => widths.map((w) => `${src}-${w}.${ext} ${w}w`).join(', ');
  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={`${src}-${widths[Math.floor(widths.length / 2)]}.jpg`}
        srcSet={set('jpg')}
        sizes={sizes}
        width={width}
        height={height}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...(priority ? { fetchPriority: 'high' as const } : {})}
      />
    </picture>
  );
}
```

## Build-time image generation (Node + sharp)

```js
// scripts/images.mjs  (npm i -D sharp)
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
import { join, parse } from 'node:path';

const srcDir = 'src/images';
const outDir = 'public/img';
const widths = [480, 960, 1600];

for (const file of readdirSync(srcDir).filter((f) => /\.(jpe?g|png)$/i.test(f))) {
  const { name } = parse(file);
  for (const w of widths) {
    const img = sharp(join(srcDir, file)).resize({ width: w, withoutEnlargement: true });
    await img.clone().avif({ quality: 55 }).toFile(join(outDir, `${name}-${w}.avif`));
    await img.clone().webp({ quality: 78 }).toFile(join(outDir, `${name}-${w}.webp`));
    await img.clone().jpeg({ quality: 78, progressive: true }).toFile(join(outDir, `${name}-${w}.jpg`));
  }
}
```

## Lint: fail the build on bad images (simple check)

```bash
# Finds <img> tags with no alt attribute in source files
grep -rnE "<img(?![^>]*\balt=)" src --include='*.{html,jsx,tsx,astro,vue,svelte}' -P
# Finds <img> without width/height
grep -rnE "<img(?![^>]*\bwidth=)" src --include='*.{html,jsx,tsx,astro,vue,svelte}' -P
```

## Lazy YouTube embed (facade, protects LCP and INP)

```html
<div class="video-facade" style="aspect-ratio:16/9">
  <a href="https://www.youtube.com/watch?v=VIDEO_ID" data-video-id="VIDEO_ID" aria-label="Play video: Video title">
    <img src="/img/video-thumb-960.jpg" width="960" height="540" alt="Video title: thumbnail" loading="lazy">
  </a>
</div>
<script type="module">
  document.querySelectorAll('.video-facade a').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${a.dataset.videoId}?autoplay=1`;
      iframe.title = a.getAttribute('aria-label');
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.style.cssText = 'width:100%;height:100%;border:0';
      a.parentElement.replaceChildren(iframe);
    });
  });
</script>
```
The link keeps a real `href` to the video page (crawlable and usable without JS).
