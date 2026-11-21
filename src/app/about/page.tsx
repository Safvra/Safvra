import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";
import AboutHeroSection from "@/components/about/AboutHeroSection";
import FoundersSection from "@/components/about/FoundersSection";
import AboutStorySection from "@/components/about/AboutStorySection";
import StatsSection from "@/components/home/StatsSection";
import WhyWorkWithUsSection from "@/components/about/WhyWorkWithUsSection";
import ContactFooterSection from "@/components/shared/ContactFooterSection";
import { siteConfig, toJsonLd } from "@/seo.config";

export const metadata: Metadata = {
  title: "About Us & The Studio | Safvra Concepts Abu Dhabi",
  description:
    "Learn about Safvra Concepts, our founding architects, turnkey fit-out philosophy, and commitment to architectural precision and craftsmanship across the UAE.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us & The Studio | Safvra Concepts Abu Dhabi",
    description:
      "Crafting spaces with patience and clarity. Learn about Safvra Concepts' architectural philosophy and leadership team.",
    url: `${siteConfig.url}/about`,
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Safvra Concepts Architectural Studio",
      },
    ],
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${siteConfig.url}/about#aboutpage`,
      url: `${siteConfig.url}/about`,
      name: "About Us & The Studio | Safvra Concepts",
      description:
        "Learn about Safvra Concepts, our founding architects, turnkey fit-out philosophy, and commitment to architectural precision across the UAE.",
      isPartOf: {
        "@id": `${siteConfig.url}/#website`,
      },
      about: {
        "@id": `${siteConfig.url}/#organization`,
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteConfig.url}/about#breadcrumbs`,
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
          name: "About Us",
          item: `${siteConfig.url}/about`,
        },
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <main className="relative min-h-dvh w-full bg-[#F8F8F6] text-[#121212]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(aboutJsonLd) }}
      />
      <Navbar />
      <AboutHeroSection />
      <FoundersSection />
      <AboutStorySection />
      <StatsSection />
      <WhyWorkWithUsSection />
      <ContactFooterSection />
    </main>
  );
}
