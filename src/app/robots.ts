import type { MetadataRoute } from "next";
import { siteConfig } from "@/seo.config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const isProduction = siteConfig.isProduction;

  if (!isProduction) {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: "/",
        },
      ],
    };
  }

  // Production crawlers policy
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/admin/",
        ],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "PerplexityBot",
          "Applebot-Extended",
        ],
        allow: siteConfig.robots.aiSearchCrawlers === "allow" ? "/" : undefined,
        disallow: siteConfig.robots.aiSearchCrawlers === "disallow" ? "/" : undefined,
      },
      {
        userAgent: [
          "CCBot",
          "Google-Extended",
          "cohere-ai",
        ],
        allow: siteConfig.robots.aiTrainingCrawlers === "allow" ? "/" : undefined,
        disallow: siteConfig.robots.aiTrainingCrawlers === "disallow" ? "/" : undefined,
      },
    ],
    sitemap: `${siteConfig.url.replace(/\/$/, '')}/sitemap.xml`,
  };
}
