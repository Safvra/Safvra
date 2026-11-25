# Safvra Concepts — Official Website

> **Crafting Spaces. Building Visions.**  
> Bespoke Interior Fit-Out & General Maintenance in Abu Dhabi, United Arab Emirates.

[![Next.js](https://img.shields.io/badge/Next.js-16.4.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare_Pages-F38020?style=flat-square&logo=cloudflare)](https://pages.cloudflare.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

---

## 🌟 Overview

The official digital presence for **Safvra Concepts**, an elite interior fit-out, carpentry, and architectural maintenance studio based in Abu Dhabi, UAE. 

The website is engineered using **Next.js 16 (App Router)** and **React 19** with native static export (`output: 'export'`), tailor-made for high-performance edge delivery on **Cloudflare Pages** and **Cloudflare Workers**.

---

## 🚀 Key Features & Pages

- **Home (`/`)**: High-impact editorial hero section, dynamic services showcase, statistics milestone strip, featured project highlights, verified client testimonials, brand statement, and interactive consultation footer.
- **About (`/about`)**: Studio narrative, leadership philosophy, craft-driven design ethos, and interactive "Why Choose Us" core capabilities.
- **Services (`/services`)**: Interactive service index with full-screen overlay drawers and deep-dive technical workflows.
- **Service Pages (`/services/[slug]`)**: 11 dedicated, search-optimized dynamic routes pre-rendered statically:
  - Commercial Fit-Out
  - Residential Fit-Out
  - Retail Fit-Out
  - Design & Build Turnkey
  - Modular Kitchen Installation
  - Solid & Engineered Wood Flooring
  - Custom Door Installation & Joinery
  - Bespoke Wardrobes & Storage
  - Luxury Vanity Installation
  - Gypsum Ceiling & Architectural Lighting
  - Comprehensive General Maintenance & MEP
- **Projects Portfolio (`/projects`)**: Categorized project gallery (Residential, Commercial, Turnkey, Joinery) with sleek case study modal inspections.
- **Contact & Consultations (`/contact`)**: 2×2 contact directory, direct WhatsApp instant chat, dual phone lines, inquiry form, and FAQ accordion.
- **Custom 404 (`/_not-found`)**: Minimalist branded error page matching the studio aesthetic.

---

## 📐 Search Engine Optimization & Edge Standards

- **Single Source of Truth**: Centralized SEO and brand configuration located in `src/seo.config.ts`.
- **Structured Data (Schema.org)**: Complete JSON-LD markup for `LocalBusiness`, `Organization`, and `WebSite` targeting Abu Dhabi and UAE local queries.
- **Search Engine Discovery**: Auto-generated static `/sitemap.xml` and `/robots.txt` honoring canonical URLs and crawl directives.
- **Edge Security Headers**: Pre-configured in `public/_headers` (HSTS, Content-Type-Options: `nosniff`, Referrer-Policy, Frame Options `SAMEORIGIN`, Permissions-Policy).
- **Web App Manifest**: Complete PWA-ready metadata via `src/app/manifest.ts`.

---

## 📁 Project Structure

```text
Safvara-website/
├── public/
│   ├── _headers            # Cloudflare edge security and cache headers
│   ├── _redirects          # Cloudflare routing and 301 redirect rules
│   └── landing/            # High-resolution architectural photography & assets
├── src/
│   ├── app/
│   │   ├── about/          # Studio about page
│   │   ├── contact/        # Contact directory & inquiry form
│   │   ├── projects/       # Portfolio gallery & case studies
│   │   ├── services/       # Services overview & dynamic [slug] detail pages
│   │   ├── globals.css     # Tailwind v4 configuration & design tokens
│   │   ├── layout.tsx      # Root layout with JSON-LD, fonts & global shell
│   │   ├── manifest.ts     # Web App Manifest (force-static)
│   │   ├── not-found.tsx   # Custom 404 handler
│   │   ├── page.tsx        # Homepage
│   │   ├── robots.ts       # Robots.txt crawler configuration (force-static)
│   │   └── sitemap.ts      # XML Sitemap index (force-static)
│   ├── components/
│   │   ├── about/          # About page section components
│   │   ├── contact/        # Contact hero, form & FAQ components
│   │   ├── home/           # Homepage modular sections
│   │   ├── projects/       # Gallery, filters, process strip & case study modal
│   │   ├── services/       # Service detail view & overlay interactions
│   │   └── shared/         # Universal Navbar and ContactFooterSection
│   ├── data/
│   │   ├── projectsData.ts # Portfolio items and case study metadata
│   │   └── servicesData.ts # Service specifications, features & FAQs
│   └── seo.config.ts       # Site-wide SEO constants and brand parameters
├── next.config.ts          # Static export (output: 'export') & Turbopack settings
├── package.json            # Scripts & project dependencies
├── tsconfig.json           # TypeScript configuration
└── wrangler.jsonc          # Cloudflare Workers Static Assets deployment config
```

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: `v20.x` or later (LTS recommended)
- **Package Manager**: `npm`, `pnpm`, or `bun`

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd Safvara-website
npm install
```

### Development Server

Start the local Next.js development server with Turbopack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Build & Static Export

Generate a fully static production build:

```bash
npm run build
```

This compiles all 22 static pages, images, and route handlers into the `./out` directory.

---

## ☁️ Cloudflare Deployment

This project is configured for seamless deployment to **Cloudflare Pages** or **Cloudflare Workers (Static Assets)** without Node.js runtime dependencies.

### Option A: Cloudflare Dashboard (Git-Connected Pages)

1. Connect your repository to **Cloudflare Pages**.
2. Set the build settings:
   - **Framework Preset**: `Next.js (Static HTML Export)` or `None`
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `out`
   - **Node.js Version**: `20` or higher (under *Settings > Environment Variables* add `NODE_VERSION=20`)
3. Click **Save and Deploy**.

### Option B: Deploy via Wrangler CLI

Deploy directly to Cloudflare Pages:

```bash
npm run pages:deploy
# or: npx wrangler pages deploy out --project-name=safvara-website
```

Deploy as a Cloudflare Worker using `wrangler.jsonc`:

```bash
npm run deploy
```

---

## 📞 Studio Details & Contacts

- **Business Name**: Safvra Concepts Interior Fit-Out & General Maintenance
- **Headquarters**: Abu Dhabi, United Arab Emirates
- **Primary Line & WhatsApp**: [+971 56 802 5017](https://api.whatsapp.com/send?phone=971568025017)
- **Secondary Line**: [+971 50 148 8983](tel:+971501488983)
- **General Inquiries**: [contact@safvraconcepts.com](mailto:contact@safvraconcepts.com)
- **Instagram**: [@safvra_concepts](https://www.instagram.com/safvra_concepts/)
- **Facebook**: [Safvra Concepts](https://www.facebook.com/safvraconcepts)

---

## 📄 License

Private & Proprietary © **Safvra Concepts**. All rights reserved.
