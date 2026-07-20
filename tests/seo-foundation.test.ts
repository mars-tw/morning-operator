import { afterEach, describe, expect, it } from "vitest";

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { localeMetadata, supportedLocales } from "@/i18n";
import { absoluteSiteUrl, getPublicSiteUrl } from "@/lib/site-url";

const previousSiteUrl = process.env.AUTOPILOT_BASE_URL;

afterEach(() => {
  if (previousSiteUrl === undefined) delete process.env.AUTOPILOT_BASE_URL;
  else process.env.AUTOPILOT_BASE_URL = previousSiteUrl;
});

describe("SEO foundation routes", () => {
  it("accepts only a clean public HTTP origin", () => {
    expect(getPublicSiteUrl("https://example.test").href).toBe("https://example.test/");
    expect(absoluteSiteUrl("/zh-TW", "https://example.test")).toBe("https://example.test/zh-TW");
    expect(() => getPublicSiteUrl("ftp://example.test")).toThrow(/http or https/);
    expect(() => getPublicSiteUrl("https://user:pass@example.test")).toThrow(/without credentials/);
    expect(() => getPublicSiteUrl("https://example.test/subpath")).toThrow(/without a path/);
  });

  it("keeps API routes out of crawling and publishes the absolute sitemap", () => {
    process.env.AUTOPILOT_BASE_URL = "https://example.test";
    expect(robots()).toMatchObject({
      rules: { userAgent: "*", allow: "/", disallow: ["/api"] },
      sitemap: "https://example.test/sitemap.xml",
      host: "https://example.test"
    });
  });

  it("publishes only four public locale URLs with reciprocal alternates and x-default", () => {
    process.env.AUTOPILOT_BASE_URL = "https://example.test";
    const entries = sitemap();
    expect(entries).toHaveLength(4);
    expect(entries.map((entry) => entry.url)).toEqual(supportedLocales.map((locale) => `https://example.test/${locale}`));
    const expectedLanguages = Object.fromEntries([
      ...supportedLocales.map((locale) => [localeMetadata[locale].htmlLang, `https://example.test/${locale}`]),
      ["x-default", "https://example.test/en"]
    ]);
    for (const entry of entries) {
      expect(entry.alternates?.languages).toEqual(expectedLanguages);
      expect(entry.url).not.toMatch(/admin|api|checkout/);
    }
  });
});
