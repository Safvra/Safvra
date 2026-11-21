# 08. Links and Backlink Readiness (code side only)

**Be honest about the limit.** A backlink is a link on someone else's site. Code cannot create legitimate ones. Outreach, digital PR, partnerships, guest content, and citations are the SEO specialist's work.

What the codebase **can** do:
1. Make pages worth linking to and easy to link to.
2. Make shared links look good and carry the right URL.
3. Provide opt-in embeddable assets that carry an attribution link.
4. Mark outbound links correctly so the site stays within search engine policies.
5. **Protect the link equity already earned** (redirects, canonicals, no broken URLs).
6. Give the specialist machine-readable entity data (`sameAs`, Organization).

Never build link schemes: no hidden links, no auto-generated link blocks to other sites, no comment spam tools, no private-network footers, no keyword-stuffed "powered by" links, no reciprocal-link farms, and no paid links without `rel="sponsored"`.

## Link attributes (outbound)

| Link type | Attribute |
|---|---|
| Normal editorial link to a trusted resource | none (a normal followed link) |
| Paid, sponsored, advertising, affiliate | `rel="sponsored"` (can combine: `rel="sponsored noopener"`) |
| User-generated content (comments, forum posts, profile links) | `rel="ugc"` |
| Untrusted or you cannot vouch for the destination | `rel="nofollow"` |
| Any link with `target="_blank"` | add `rel="noopener"` (modern browsers imply it, but keep it explicit) |

Notes:
- Combine tokens as needed: `rel="ugc nofollow noopener"`.
- Do not add `noreferrer` to normal outbound links unless there is a privacy reason; it hides your site as a referrer to the destination, which removes the signal that helps them notice and credit you.
- Sanitize user-generated HTML so users cannot inject links without `rel="ugc nofollow"`. Implement this in the sanitizer (for example an allowlist plus automatic rel rewrite), not in each template.
- Affiliate and advertising links: automate `rel="sponsored"` through a link component so it cannot be forgotten. Add a visible disclosure near them.
- Do not mass-add `nofollow` to your own internal links ("PageRank sculpting"); it does not help.

## Descriptive anchors

- Anchor text should describe the destination. Avoid "click here", "read more", "this page". For repeated "Read more" patterns on cards, make the card heading the link, or add visually hidden text (`<span class="sr-only">about {title}</span>`).
- Vary anchors naturally. Never programmatically stuff exact-match keywords.

## Make pages linkable (permanent, clean, shareable)

- **Permanent URLs**: stable, human-readable, no session or tracking parameters. Never change them without a 301 redirect.
- **Canonical everywhere**, so every inbound link consolidates to one URL.
- **Great share cards** (`02-social-sharing.md`): when someone pastes the link, it should look credible.
- **Fragment anchors**: stable `id`s on headings so people can link to a specific section.
- **Easy citation**: add a "Cite this" or "Permalink" block on research, statistics, guides, and data pages with the canonical URL and a ready-to-copy citation. Provide a "Copy link" button.
- **Public, crawlable data and tools** are the most linked assets: calculators, templates, original statistics pages, datasets (with `Dataset` schema and a downloadable CSV), glossaries, free tools, open documentation. Build these as real pages with clean URLs, not behind a login or heavy JS.
- **Press and media kit page** (`/press/` or `/media/`): logos (SVG and PNG), brand colors, founder bios and headshots, boilerplate description, fact sheet, contact. Make assets downloadable at stable URLs. Journalists link to what is easy to find and use.
- **Author and expert pages** (`/authors/jane-doe/`) so quoted people have a linkable profile.
- **Resource and "about" pages** with clear, quotable descriptions of what the organization is and does.
- **RSS and Atom feeds** for blogs and updates (`<link rel="alternate" type="application/rss+xml">`).
- **Accessible and fast pages** are cited more; keep them crawlable (no login walls on shareable content).

## Embeddable widgets, badges, and infographics (opt-in)

If the business wants them (confirm with the specialist), build:
- A "Share this infographic / chart / badge" block with a copy-paste embed snippet.
- The snippet includes a **single plain attribution link** to the source page, with the brand name or page title as anchor text (not a keyword-rich anchor).
- Google's link-spam guidance treats widely distributed widget or embed links with optimized anchor text as manipulative. To stay safe, use brand-name anchor text, and let the specialist decide whether to add `rel="nofollow"` on the attribution link for mass-distributed widgets.
- Host embeds on stable, versioned URLs; keep them lightweight and accessible.

Example embed block:
```html
<label for="embed">Embed this chart</label>
<textarea id="embed" readonly rows="4">&lt;a href="https://example.com/research/state-of-x/"&gt;&lt;img src="https://example.com/img/state-of-x.png" alt="Chart: state of X in 2026" width="800" height="450"&gt;&lt;/a&gt;
&lt;p&gt;Source: &lt;a href="https://example.com/"&gt;Example Brand&lt;/a&gt;&lt;/p&gt;</textarea>
```

## Entity and identity links

- `sameAs` in Organization and Person schema: real, verified profile URLs only (LinkedIn, GitHub, X, YouTube, Crunchbase, Wikipedia or Wikidata when they genuinely exist). Do not invent profiles.
- Footer and "About" link to the official profiles with `rel="me"` where the platform supports verification (for example Mastodon). Only include profiles that exist.
- Keep the brand name, logo, and description consistent across the site and schema so mentions are attributed correctly.

## Protect existing link equity

- Maintain a redirect map; every renamed or removed URL gets a 301 to the closest equivalent (see `07-crawl-index-files.md`).
- Custom 404 that helps visitors recover, and a broken-link check in CI (a crawler or link-checker script over the built site) so internal links never 404.
- Avoid creating duplicate URLs (parameters, trailing-slash variants, uppercase, `index.html`) that split inbound links; canonical plus redirects consolidate them.
- Handle HTTP to HTTPS and `www` consolidation by redirect.
- Fix internal links to point at final URLs, not at redirecting ones.
- Do not delete pages that have inbound links without redirecting; hand a list of high-value URLs to the specialist if known.
- Preserve media URLs (images, PDFs) that others hotlink or cite, or redirect them.

## Outbound link hygiene

- Link to authoritative sources when it genuinely helps the reader (research, standards, original data). Visible, descriptive anchors.
- Use a link-check script in CI to find dead outbound links and flag them.
- Do not hide outbound links, and do not use JavaScript click-redirect wrappers for normal links.

## What to put in the hand-off report for the SEO specialist

- List of linkable assets created (press kit, data pages, tools, embeds, feeds) with URLs
- Canonical host and redirect rules implemented
- Any `sameAs` entries that are still `TODO(seo)`
- Decisions needed: widget attribution `nofollow` policy, which pages to promote for outreach
