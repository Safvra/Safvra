import type { MetadataRoute } from "next";
import { siteConfig } from "@/seo.config";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Safvra",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#E2E1DF",
    theme_color: "#121212",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
