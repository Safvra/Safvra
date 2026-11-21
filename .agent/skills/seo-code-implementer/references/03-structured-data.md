# 03. Structured Data (JSON-LD)

Use **JSON-LD** (Google's recommended format) in a `<script type="application/ld+json">` block. Copy-ready snippets are in `../templates/jsonld.md`.

## Core principles

1. **Describe what is on the page.** Every property value must be visible to the user on that page (or be accurate metadata about it). Marking up hidden or fictional content violates Google's structured data guidelines and risks a manual action.
2. **Never fabricate.** No invented `aggregateRating`, `review`, `offers`, `price`, `author`, or dates. If you do not have the data, omit the property. Required properties missing means no rich result, but wrong data is worse.
3. **Keep it consistent.** Names, URLs, logos, dates, and prices in markup must match the visible page and the rest of the site (same Organization name everywhere).
4. **Validity is not eligibility.** Valid Schema.org markup still may not trigger a rich result. Google's rich result eligibility is narrower than the Schema.org vocabulary.
5. **Server-render it.** The JSON-LD must be in the initial HTML.

## Rich result landscape: verify before promising

Google has narrowed or retired several rich result types over time (for example FAQ rich results are limited to well-known authoritative government and health sites, HowTo rich results were removed, and the sitelinks search box was removed). Schema.org markup for these can still help machines understand a page, but do not promise a visual result. Because eligibility changes, tell the SEO specialist to confirm current support in Google's "Search Gallery" documentation for any business-critical type. Do not remove accurate markup on that basis alone.

## Use `@graph` and `@id` to connect entities

Define entities once and reference them by `@id` instead of repeating them:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": "https://example.com/#organization", "name": "Brand", "url": "https://example.com/" },
    { "@type": "WebSite", "@id": "https://example.com/#website", "url": "https://example.com/", "name": "Brand", "publisher": { "@id": "https://example.com/#organization" } },
    { "@type": "WebPage", "@id": "https://example.com/about/#webpage", "url": "https://example.com/about/", "isPartOf": { "@id": "https://example.com/#website" } }
  ]
}
```

Site-wide entities (Organization, WebSite) go in the global layout; page-specific entities (Article, Product, BreadcrumbList) go on their pages and reference the global ones by `@id`.

## Which type for which page

| Page | Types |
|---|---|
| Home | Organization (or LocalBusiness), WebSite |
| Any page | WebPage (or a subtype such as AboutPage, ContactPage, CollectionPage, ProfilePage), BreadcrumbList |
| Blog post | Article or BlogPosting or NewsArticle, Person (author), BreadcrumbList |
| Product | Product with Offer (or AggregateOffer), optional AggregateRating and Review only if real, BreadcrumbList |
| Category listing | CollectionPage + ItemList |
| Software / SaaS | SoftwareApplication or WebApplication or MobileApplication |
| Service | Service with provider referencing the Organization |
| Local business | LocalBusiness or a specific subtype (Restaurant, Dentist, Store, ...) |
| Person profile | Person with `sameAs` |
| Video | VideoObject (also embedded on the page) |
| Event | Event with location, startDate, offers |
| Job posting | JobPosting (all required fields, remove when expired) |
| Recipe | Recipe |
| Course | Course |
| Dataset, Book, Movie, etc. | Use the specific type only when the page is genuinely about it |

## Required and recommended properties (essentials)

**Organization**: `name`, `url`, `logo` (ImageObject or URL, crawlable, square-ish and at least 112 px), `sameAs` (real profile URLs), `contactPoint` (only real contact data), optional `foundingDate`, `address`.

**WebSite**: `name`, `url`, optionally `alternateName`. (Sitelinks search box markup is no longer used by Google; do not add `SearchAction` expecting a visual result.)

**Article / BlogPosting**: `headline` (under about 110 characters), `image` (one or more, 1200 px wide recommended), `datePublished`, `dateModified`, `author` (Person with `name` and `url`), `publisher` (Organization by `@id`), `mainEntityOfPage`. Dates ISO 8601 with timezone.

**Product**: `name`, `image`, `description`, `sku`, `brand`, `offers` (`price`, `priceCurrency`, `availability` as a Schema.org URL, `url`, `priceValidUntil` when relevant, optionally `hasMerchantReturnPolicy` and `shippingDetails`). Add `aggregateRating` / `review` only from genuine, visible reviews.

**BreadcrumbList**: ordered `ListItem` entries with `position`, `name`, `item` (absolute URL). The last item may omit `item`. The trail must match the visible breadcrumb.

**LocalBusiness**: `name`, `image`, `address` (PostalAddress), `telephone`, `url`, `geo`, `openingHoursSpecification`, `priceRange`, `sameAs`. Match the footer and contact page text exactly (NAP consistency).

**SoftwareApplication**: `name`, `applicationCategory`, `operatingSystem`, `offers` (price, even `0`). Ratings only if real.

**VideoObject**: `name`, `description`, `thumbnailUrl`, `uploadDate`, `contentUrl` or `embedUrl`, `duration`.

**FAQPage**: only when the page visibly shows the questions and answers. Do not add FAQ markup to pad a page, and do not expect a rich result for most sites.

## Implementation rules

- **Escape output.** When JSON-LD is built from data and injected into HTML, serialize with `JSON.stringify` and replace `<` with `<` so user-supplied text can never close the script tag:
  ```js
  const jsonLd = JSON.stringify(data).replace(/</g, '\\u003c');
  ```
- **Build from the same data as the page.** Generate JSON-LD from the same object that renders the visible content, so they cannot drift apart.
- **One graph per page** is cleaner than many separate script blocks, but multiple blocks are valid.
- **Absolute URLs** for `url`, `@id`, `image`, `logo`, and `item`.
- **Dates**: `2026-03-01` or full ISO 8601 with offset. Do not use locale-formatted dates.
- **Enumerations** use full Schema.org URLs: `https://schema.org/InStock`.
- **Omit empty values.** Do not output `"image": ""` or `"price": null`.
- **CSP**: with a strict Content Security Policy, JSON-LD (a non-executing data block) is generally fine, but if your policy restricts inline scripts, add a nonce to the tag.

## Component pattern

```tsx
// Generic, framework-agnostic idea: one helper that takes an object and returns the tag.
export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
```

In Astro: `<script type="application/ld+json" set:html={json} />`. In Vue/Nuxt: `useHead({ script: [{ type: 'application/ld+json', innerHTML: json }] })`. In plain HTML, write the block by hand or generate it at build time.

## Validation

- Locally: confirm the block parses (`python3 -m json.tool`), required properties exist, and values match the page.
- The SEO specialist can run Google's Rich Results Test and the Schema Markup Validator. Note in the hand-off report which pages carry which types so they can test them.

## Anti-patterns

- Same Organization or Product JSON-LD pasted on every page
- Ratings or review counts that are not shown on the page
- Price in markup differs from the visible price
- Markup for content not on the page (hidden FAQ, hidden reviews)
- Unescaped user content inside the script tag
- Dozens of speculative types on one page
- Relative URLs, missing `@context`, or trailing commas (invalid JSON)
