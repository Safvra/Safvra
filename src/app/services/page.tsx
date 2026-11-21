import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";
import ServicesPageHero from "@/components/services/ServicesPageHero";
import ServicesOverlaySection from "@/components/services/ServicesOverlaySection";
import ContactFooterSection from "@/components/shared/ContactFooterSection";
import { siteConfig, toJsonLd } from "@/seo.config";
import { SERVICES_DATA } from "@/data/servicesData";

export const metadata: Metadata = {
  title: "Interior Fit-Out & Joinery Services | Safvra Concepts Abu Dhabi",
  description:
    "Explore our comprehensive turnkey fit-out services: commercial offices, residential villas, retail boutiques, custom kitchens, wood flooring, and building maintenance.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Interior Fit-Out & Joinery Services | Safvra Concepts Abu Dhabi",
    description:
      "Explore Safvra Concepts' full spectrum of commercial, residential, retail, and turnkey joinery services in the UAE.",
    url: `${siteConfig.url}/services`,
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Safvra Concepts Fit-Out Services",
      },
    ],
  },
};

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${siteConfig.url}/services#collection`,
      url: `${siteConfig.url}/services`,
      name: "Interior Fit-Out & Joinery Services | Safvra Concepts",
      description:
        "Comprehensive architectural and turnkey fit-out specialties across Abu Dhabi and the UAE.",
      isPartOf: {
        "@id": `${siteConfig.url}/#website`,
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteConfig.url}/services#breadcrumbs`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteConfig.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Services",
          item: `${siteConfig.url}/services`,
        },
      ],
    },
    {
      "@type": "ItemList",
      "@id": `${siteConfig.url}/services#itemlist`,
      itemListElement: SERVICES_DATA.map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: service.title,
        url: `${siteConfig.url}/services/${service.slug}`,
        description: service.shortSubtitle,
      })),
    },
  ],
};

export default function ServicesPage() {
  return (
    <main className="relative min-h-dvh w-full bg-white text-[#111111]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(servicesJsonLd) }}
      />
      <Navbar />
      <ServicesPageHero />
      <ServicesOverlaySection />
      <ContactFooterSection />
    </main>
  );
}
