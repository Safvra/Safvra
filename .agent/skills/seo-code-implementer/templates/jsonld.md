# JSON-LD Snippets

Copy-ready, valid JSON. Replace every value with real data from the page or `seo.config`. Remove any property you do not have real data for; never invent ratings, reviews, prices, addresses, or dates. Where a value is unknown, use `TODO(seo): ...` in code review, but never ship the marker in published markup (resolve it or remove the property).

Wrap each block as: `<script type="application/ld+json"> ... </script>` and serialize with `<` escaped as `<` when generated from data.

## 1. Site-wide graph (global layout): Organization + WebSite

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://example.com/#organization",
      "name": "Brand Name",
      "url": "https://example.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://example.com/logo.png",
        "width": 512,
        "height": 512
      },
      "sameAs": [
        "https://www.linkedin.com/company/example",
        "https://github.com/example"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "support@example.com",
        "availableLanguage": ["English"]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://example.com/#website",
      "url": "https://example.com/",
      "name": "Brand Name",
      "publisher": { "@id": "https://example.com/#organization" },
      "inLanguage": "en"
    }
  ]
}
```

## 2. Generic page: WebPage + BreadcrumbList

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://example.com/services/seo/#webpage",
      "url": "https://example.com/services/seo/",
      "name": "SEO Services",
      "description": "Short description matching the visible page.",
      "isPartOf": { "@id": "https://example.com/#website" },
      "inLanguage": "en",
      "breadcrumb": { "@id": "https://example.com/services/seo/#breadcrumb" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://example.com/services/seo/#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://example.com/services/" },
        { "@type": "ListItem", "position": 3, "name": "SEO Services" }
      ]
    }
  ]
}
```

## 3. Blog post: Article + Person + BreadcrumbList

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://example.com/blog/my-post/#article",
      "headline": "Post title exactly as shown on the page",
      "description": "Short summary matching the visible excerpt.",
      "image": [
        "https://example.com/img/my-post-1200x675.jpg"
      ],
      "datePublished": "2026-03-01T09:00:00+00:00",
      "dateModified": "2026-04-10T12:30:00+00:00",
      "author": { "@id": "https://example.com/authors/jane-doe/#person" },
      "publisher": { "@id": "https://example.com/#organization" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": "https://example.com/blog/my-post/" },
      "inLanguage": "en"
    },
    {
      "@type": "Person",
      "@id": "https://example.com/authors/jane-doe/#person",
      "name": "Jane Doe",
      "url": "https://example.com/authors/jane-doe/",
      "jobTitle": "Senior Editor",
      "sameAs": ["https://www.linkedin.com/in/janedoe"]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://example.com/blog/" },
        { "@type": "ListItem", "position": 3, "name": "Post title" }
      ]
    }
  ]
}
```

## 4. Product + Offer (ratings only if real and visible)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://example.com/products/widget/#product",
  "name": "Widget Pro",
  "image": [
    "https://example.com/img/widget-pro-1200.jpg"
  ],
  "description": "Description matching the visible product text.",
  "sku": "WIDGET-PRO-001",
  "brand": { "@type": "Brand", "name": "Brand Name" },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/products/widget/",
    "priceCurrency": "USD",
    "price": "49.00",
    "priceValidUntil": "2027-12-31",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "seller": { "@id": "https://example.com/#organization" }
  }
}
```

Add only when genuine reviews are displayed on the same page (values must match what is shown):

```json
{
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.6",
    "reviewCount": "128"
  }
}
```

## 5. LocalBusiness (use the most specific subtype)

```json
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": "https://example.com/locations/downtown/#localbusiness",
  "name": "Brand Name Downtown",
  "url": "https://example.com/locations/downtown/",
  "image": "https://example.com/img/downtown-storefront.jpg",
  "telephone": "+1-555-123-4567",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "Springfield",
    "addressRegion": "IL",
    "postalCode": "62701",
    "addressCountry": "US"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 39.7817, "longitude": -89.6501 },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    }
  ],
  "sameAs": ["https://www.facebook.com/example"],
  "parentOrganization": { "@id": "https://example.com/#organization" }
}
```

## 6. SoftwareApplication (SaaS or app landing page)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "App Name",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "description": "Short description matching the visible page.",
  "url": "https://example.com/",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

## 7. Service

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Service Name",
  "serviceType": "Service category",
  "description": "Short description matching the visible page.",
  "provider": { "@id": "https://example.com/#organization" },
  "areaServed": { "@type": "Country", "name": "United States" },
  "url": "https://example.com/services/service-name/"
}
```

## 8. FAQPage (only when Q&A is visible on the page; rich result support is limited)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text exactly as shown?",
      "acceptedAnswer": { "@type": "Answer", "text": "Answer text exactly as shown." }
    }
  ]
}
```

## 9. VideoObject

```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Video title",
  "description": "What the video shows.",
  "thumbnailUrl": ["https://example.com/img/video-thumb-1280.jpg"],
  "uploadDate": "2026-03-01T09:00:00+00:00",
  "duration": "PT4M30S",
  "contentUrl": "https://example.com/video/demo.mp4",
  "embedUrl": "https://example.com/embed/demo"
}
```

## 10. Collection page with ItemList (category or listing)

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Category Name",
  "url": "https://example.com/category/",
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "url": "https://example.com/products/one/" },
      { "@type": "ListItem", "position": 2, "url": "https://example.com/products/two/" }
    ]
  }
}
```

## 11. Event

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Event name",
  "startDate": "2026-09-15T18:00:00+01:00",
  "endDate": "2026-09-15T21:00:00+01:00",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "eventStatus": "https://schema.org/EventScheduled",
  "location": {
    "@type": "Place",
    "name": "Venue name",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1 Venue Way",
      "addressLocality": "City",
      "addressCountry": "GB"
    }
  },
  "organizer": { "@id": "https://example.com/#organization" },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/events/event-name/",
    "price": "25",
    "priceCurrency": "GBP",
    "availability": "https://schema.org/InStock"
  }
}
```

## 12. Dataset (data and research pages, a linkable asset)

```json
{
  "@context": "https://schema.org",
  "@type": "Dataset",
  "name": "Dataset name",
  "description": "What the dataset contains and how it was collected.",
  "url": "https://example.com/data/dataset-name/",
  "creator": { "@id": "https://example.com/#organization" },
  "license": "https://creativecommons.org/licenses/by/4.0/",
  "distribution": {
    "@type": "DataDownload",
    "encodingFormat": "text/csv",
    "contentUrl": "https://example.com/data/dataset-name.csv"
  }
}
```

## 13. Paywalled article additions (merge into the Article object)

```json
{
  "isAccessibleForFree": false,
  "hasPart": {
    "@type": "WebPageElement",
    "isAccessibleForFree": false,
    "cssSelector": ".paywalled"
  }
}
```

## Property reminders

- Absolute URLs, ISO 8601 dates with timezone, full Schema.org URLs for enumerations (`https://schema.org/InStock`).
- Names, prices, dates, and text must equal what is visible.
- One `@id` per entity; reference it elsewhere with `{ "@id": "..." }`.
- Omit empty properties rather than leaving blanks.
