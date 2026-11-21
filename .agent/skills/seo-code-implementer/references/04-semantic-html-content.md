# 04. Semantic HTML, Content Structure, URLs, and Internal Linking

Search engines and AI systems read structure. Good structure also improves accessibility, which overlaps heavily with SEO.

## Page skeleton

```html
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header>
    <a href="/" aria-label="Brand home"><!-- logo --></a>
    <nav aria-label="Primary"> ... </nav>
  </header>
  <main id="main">
    <nav aria-label="Breadcrumb"> ... </nav>
    <article>
      <h1>One clear page topic</h1>
      <p>Opening paragraph answers the main question directly.</p>
      <section aria-labelledby="s1"><h2 id="s1">Subtopic</h2> ... </section>
    </article>
    <aside aria-label="Related"> ... </aside>
  </main>
  <footer> ... </footer>
</body>
```

- Use landmark elements (`header`, `nav`, `main`, `article`, `section`, `aside`, `footer`). One `<main>` per page.
- Use buttons for actions and anchors for navigation. Never `<div onClick>` for navigation.

## Headings

- **Exactly one `<h1>`** per page, stating the page topic. The logo is not an H1 on inner pages.
- Logical hierarchy: H1, then H2 sections, then H3 inside H2. Do not skip levels and do not choose heading levels for visual size. Style with CSS.
- Headings should describe the section's content in natural language. Where it fits the content, phrase some headings as the question a reader would ask (helps both search snippets and AI answers).
- Add stable `id` attributes to H2 and H3 so sections can be linked and may appear as "jump to" links in results.
- Do not put headings in images; do not hide headings with `display:none` for keyword reasons.

## Content in HTML

- Real text in HTML, never text baked into images (if you must use an image of text, put the same text in the alt and elsewhere on the page).
- Use `<ul>`/`<ol>` for lists, `<table>` with `<th scope>` and `<caption>` for tabular data, `<dl>` for definitions, `<blockquote>` + `<cite>` for quotes, `<time datetime="...">` for dates, `<address>` for contact info, `<figure>`/`<figcaption>` for images with captions.
- Collapsed content (accordions, tabs) is acceptable if the text is present in the DOM at load time. Content that only loads after a click, scroll, or API call may not be indexed. Use `<details><summary>` where it fits.
- Infinite scroll and "load more": also provide real paginated URLs (see `07-crawl-index-files.md`).
- Avoid thin pages: if a template generates pages with almost no unique content, either enrich them or `noindex` them.

## URL structure

- Lowercase, hyphen-separated words, short and descriptive: `/guides/image-optimization/`
- No underscores, spaces, uppercase, session IDs, or file extensions like `.php` where avoidable.
- Stable permalinks: never change a URL without a 301 redirect from the old one.
- Hierarchy reflects site structure (`/category/product-name/`), but keep depth shallow (aim for important pages within three clicks of home).
- One canonical form: choose trailing slash or not, `www` or not, and enforce it by redirect and in every generated link, sitemap entry, and canonical tag.
- Parameters: use for sorting and tracking only; do not let parameters create endless crawlable duplicates (canonical to the clean URL, or `noindex`).
- Do not include dates in URLs unless the content is intrinsically dated; it makes updates look stale and breaks permalinks when republished.
- Use path segments, not fragment (`#`) routing, for distinct pages.

## Internal linking

Internal links distribute discovery and relevance. Build them into templates:

- **Global navigation** to the main sections; **footer links** to key utility pages (About, Contact, Privacy, Terms) and top categories.
- **Breadcrumbs** on every page below the home level, as a visible `<nav aria-label="Breadcrumb"><ol>` list, with matching `BreadcrumbList` JSON-LD. Mark the current page with `aria-current="page"`.
- **Contextual links** inside body content to related pages, using descriptive anchor text (`image optimization guide`, not `click here` or `read more`).
- **Related content blocks** on posts and products (related posts, "more in this category", "you may also like"), chosen by a real relationship (shared category or tag), limited to a sensible number.
- **Hub and spoke**: pillar pages link to detailed pages and each detailed page links back to its pillar.
- **No orphans**: every indexable page must be reachable by at least one crawlable link. When generating pages programmatically, include them in the sitemap and in at least one listing page.
- Links are `<a href="/path/">` with real URLs. Same-site links should be relative or use the canonical host; keep format consistent with canonicals.
- Keep a sensible number of links per page. Avoid link blocks with hundreds of near-identical links.
- A link whose only text is an image needs `alt` text describing the destination.
- `aria-label` on icon-only links.

## Pagination and listings

- Each page in a series has its own URL (`/blog/page/2/`), a self-referencing canonical, a unique title (`Blog, Page 2 | Brand`), and plain crawlable previous/next/numbered links.
- Do not canonical all pages to page 1. Google no longer uses `rel="prev/next"`, so it is optional.
- Provide a "view all" only if it loads fast.

## E-E-A-T signals you can build in code

Experience, expertise, authoritativeness, and trustworthiness are judged on content and reputation (the specialist's domain), but code can make the signals visible and machine-readable:

- **Author byline** on every article, linking to an author page with bio, credentials, and `sameAs` links; mark up with `Person` schema, referenced from `Article.author`.
- **Published and updated dates**, visible, in `<time datetime>`, matching `datePublished` and `dateModified`. Update `dateModified` only on real content changes.
- **Reviewer or fact-check credit** where the topic is health, finance, or legal (a "reviewed by" element with schema `reviewedBy`).
- **Sources and citations**: render references as real outbound links, in a visible "Sources" list.
- **About, Contact, Editorial policy, Privacy, Terms** pages linked from the footer; contact details as real text.
- **Organization identity**: consistent name, logo, address, and phone in header, footer, About, and schema.
- **Reviews** shown only if real, with a visible source and date, never auto-generated.
- **Transparency**: clearly label sponsored content and affiliate links (`rel="sponsored"`).

## Forms, interactivity, and UX signals

- Labels for every input; `autocomplete` attributes; visible focus states.
- No intrusive popups or interstitials covering main content on load (see `10-security-and-trust.md`).
- Make tap targets large enough on mobile; text readable without zoom.
- Keep the layout stable (see `06-performance-cwv.md`).

## Accessibility overlap checklist

`lang` attribute, sufficient color contrast, alt text, labelled controls, keyboard navigation, skip link, semantic landmarks, `aria-current` for current page, no reliance on color alone. These improve usability and often improve crawlability.

## Anti-patterns

- Multiple H1s or none; H1 used for the logo
- Headings chosen for font size
- `div` soup with no landmarks
- Navigation built from `onClick` handlers
- Key content only inside images, canvas, or iframes
- Hash-fragment routes for real pages
- Breadcrumbs without matching schema, or schema without a visible breadcrumb
- "Click here" anchor text; stuffing anchors with repeated exact-match keywords
