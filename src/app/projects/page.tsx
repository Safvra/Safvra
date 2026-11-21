import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";
import ProjectsPageClient from "@/components/projects/ProjectsPageClient";
import ContactFooterSection from "@/components/shared/ContactFooterSection";
import { siteConfig, toJsonLd } from "@/seo.config";
import { PROJECTS_DATA } from "@/data/projectsData";

export const metadata: Metadata = {
  title: "Portfolio & Selected Works | Safvra Concepts Abu Dhabi",
  description:
    "Explore Safvra Concepts' portfolio of bespoke residential estates, luxury penthouses, corporate headquarters, and high-jewelry retail fit-outs in the UAE.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Portfolio & Selected Works | Safvra Concepts Abu Dhabi",
    description:
      "A curated portfolio of completed architectural fit-out and joinery projects across Abu Dhabi and Dubai.",
    url: `${siteConfig.url}/projects`,
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Safvra Concepts Selected Works",
      },
    ],
  },
};

const projectsJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${siteConfig.url}/projects#collection`,
      url: `${siteConfig.url}/projects`,
      name: "Portfolio & Selected Works | Safvra Concepts",
      description:
        "Architectural portfolio of luxury residential, commercial, and retail fit-out projects.",
      isPartOf: {
        "@id": `${siteConfig.url}/#website`,
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteConfig.url}/projects#breadcrumbs`,
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
          name: "Projects",
          item: `${siteConfig.url}/projects`,
        },
      ],
    },
    {
      "@type": "ItemList",
      "@id": `${siteConfig.url}/projects#itemlist`,
      itemListElement: PROJECTS_DATA.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
        description: project.subtitle,
      })),
    },
  ],
};

export default function ProjectsPage() {
  return (
    <main className="relative min-h-dvh w-full bg-white text-[#121212]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(projectsJsonLd) }}
      />
      <Navbar />
      <ProjectsPageClient />
      <ContactFooterSection />
    </main>
  );
}
