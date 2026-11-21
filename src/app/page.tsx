import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/home/Hero";
import AboutSection from "@/components/home/AboutSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import ServicesSection from "@/components/home/ServicesSection";
import StatsSection from "@/components/home/StatsSection";
import StatementSection from "@/components/home/StatementSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ContactFooterSection from "@/components/shared/ContactFooterSection";
import { siteConfig, toJsonLd } from "@/seo.config";

export const metadata: Metadata = {
  title: siteConfig.defaultTitle,
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: siteConfig.defaultOgImageAlt,
      },
    ],
    type: "website",
  },
};

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/#webpage`,
      url: siteConfig.url,
      name: siteConfig.defaultTitle,
      description: siteConfig.description,
      about: {
        "@id": `${siteConfig.url}/#localbusiness`,
      },
      isPartOf: {
        "@id": `${siteConfig.url}/#website`,
      },
    },
  ],
};

export default function Home() {
  return (
    <main className="relative min-h-dvh w-full bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(homeJsonLd) }}
      />
      <Navbar />
      <Hero />
      <AboutSection />
      <ServicesSection />
      <StatsSection />
      <ProjectsSection />
      <TestimonialsSection />
      <StatementSection />
      <ContactFooterSection />
    </main>
  );
}
