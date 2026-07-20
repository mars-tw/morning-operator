import type { MetadataRoute } from "next";

import { absoluteSiteUrl, getPublicSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api"]
    },
    sitemap: absoluteSiteUrl("/sitemap.xml"),
    host: getPublicSiteUrl().origin
  };
}
