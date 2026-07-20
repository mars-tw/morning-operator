import type { MetadataRoute } from "next";

import { localeMetadata, supportedLocales } from "@/i18n";
import { absoluteSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const languageAlternates = Object.fromEntries([
    ...supportedLocales.map((locale) => [localeMetadata[locale].htmlLang, absoluteSiteUrl(`/${locale}`)]),
    ["x-default", absoluteSiteUrl("/en")]
  ]);

  return supportedLocales.map((locale) => ({
    url: absoluteSiteUrl(`/${locale}`),
    changeFrequency: "weekly",
    priority: locale === "en" ? 1 : 0.9,
    alternates: { languages: languageAlternates }
  }));
}
