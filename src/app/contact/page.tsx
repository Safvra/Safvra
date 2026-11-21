import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";
import ContactPageHero from "@/components/contact/ContactPageHero";
import ContactFaqSection from "@/components/contact/ContactFaqSection";
import ContactFooterSection from "@/components/shared/ContactFooterSection";
import { siteConfig, toJsonLd } from "@/seo.config";

export const metadata: Metadata = {
  title: "Contact Us & Project Consultation | Safvra Concepts Abu Dhabi",
  description:
    "Get in touch with Safvra Concepts in Abu Dhabi, UAE for bespoke interior fit-out, carpentry, kitchen installation, and maintenance inquiries. Call +971 56 802 5017.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us & Project Consultation | Safvra Concepts Abu Dhabi",
    description:
      "Get in touch with Safvra Concepts in Abu Dhabi, UAE for turnkey architectural fit-out and general maintenance consultations.",
    url: `${siteConfig.url}/contact`,
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Contact Safvra Concepts Abu Dhabi",
      },
    ],
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": `${siteConfig.url}/contact#contactpage`,
      url: `${siteConfig.url}/contact`,
      name: "Contact Us | Safvra Concepts",
      description:
        "Get in touch with Safvra Concepts for turnkey interior fit-out and maintenance inquiries in Abu Dhabi, UAE.",
      isPartOf: {
        "@id": `${siteConfig.url}/#website`,
      },
      mainEntity: {
        "@id": `${siteConfig.url}/#localbusiness`,
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteConfig.url}/contact#breadcrumbs`,
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
          name: "Contact",
          item: `${siteConfig.url}/contact`,
        },
      ],
    },
  ],
};

export default function ContactPage() {
  return (
    <main className="relative min-h-dvh w-full bg-white text-[#111111]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(contactJsonLd) }}
      />
      <Navbar />
      <ContactPageHero />
      <ContactFaqSection />
      <ContactFooterSection />
    </main>
  );
}
