import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import ContactFooterSection from "@/components/shared/ContactFooterSection";
import ServiceDetailView from "@/components/services/ServiceDetailView";
import { SERVICES_DATA, getServiceBySlug } from "@/data/servicesData";
import { siteConfig, toJsonLd } from "@/seo.config";

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return SERVICES_DATA.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found | Safvra Concepts",
      robots: { index: false, follow: false },
    };
  }

  const pageTitle = `${service.title} in Abu Dhabi & UAE | Safvra Concepts`;
  const pageDescription = `${service.statementText} Turnkey delivery model: ${service.deliveryModel}. Warranty: ${service.warranty}. Inquire today.`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: `/services/${slug}`,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `${siteConfig.url}/services/${slug}`,
      images: [
        {
          url: service.heroImage.startsWith("http")
            ? service.heroImage
            : `${siteConfig.url}${service.heroImage}`,
          alt: `${service.title} — Safvra Concepts`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [
        service.heroImage.startsWith("http")
          ? service.heroImage
          : `${siteConfig.url}${service.heroImage}`,
      ],
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const currentIndex = SERVICES_DATA.findIndex((s) => s.slug === slug);
  const totalCount = SERVICES_DATA.length;
  const prevIndex = (currentIndex - 1 + totalCount) % totalCount;
  const nextIndex = (currentIndex + 1) % totalCount;

  const prevService = SERVICES_DATA[prevIndex];
  const nextService = SERVICES_DATA[nextIndex];

  // Rich JSON-LD Structured Data: Service + Breadcrumbs + FAQPage
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${siteConfig.url}/services/${service.slug}#service`,
        name: service.title,
        description: service.statementText,
        serviceType: service.category,
        provider: {
          "@id": `${siteConfig.url}/#organization`,
        },
        areaServed: siteConfig.organization.areaServed.map((area) => ({
          "@type": "AdministrativeArea",
          name: area,
        })),
        termsOfService: service.warranty,
        image: service.heroImage.startsWith("http")
          ? service.heroImage
          : `${siteConfig.url}${service.heroImage}`,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteConfig.url}/services/${service.slug}#breadcrumbs`,
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
          {
            "@type": "ListItem",
            position: 3,
            name: service.title,
            item: `${siteConfig.url}/services/${service.slug}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${siteConfig.url}/services/${service.slug}#faq`,
        mainEntity: service.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <main className="relative min-h-dvh w-full bg-white text-[#111111]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(serviceJsonLd) }}
      />
      <Navbar />
      <ServiceDetailView
        service={service}
        prevService={prevService}
        nextService={nextService}
        totalCount={totalCount}
      />
      <ContactFooterSection />
    </main>
  );
}
