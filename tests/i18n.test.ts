import { describe, expect, it } from "vitest";
import {
  createTranslator,
  defaultLocale,
  detectBrowserLocale,
  isLocale,
  localeMetadata,
  messages,
  parseAcceptLanguage,
  resolveAcceptLanguage,
  resolveLocale,
  supportedLocales,
  translate
} from "@/i18n";

describe("internationalization", () => {
  it("publishes the supported locale catalog and metadata", () => {
    expect(supportedLocales).toEqual(["en", "zh-TW", "ja", "es"]);
    expect(defaultLocale).toBe("en");
    expect(localeMetadata["zh-TW"].htmlLang).toBe("zh-Hant-TW");
    expect(isLocale("ja")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });

  it("normalizes browser locale variants", () => {
    expect(resolveLocale(["fr-FR", "es-MX"])).toBe("es");
    expect(resolveLocale("en_US")).toBe("en");
    expect(resolveLocale("ja-JP")).toBe("ja");
    expect(resolveLocale("zh-Hant-HK")).toBe("zh-TW");
    expect(resolveLocale("fr-FR")).toBe("en");
  });

  it("respects Accept-Language quality weights and excludes q=0", () => {
    const header = "fr-FR;q=1, en-US;q=0.6, es-MX;q=0.9, ja;q=0";
    expect(parseAcceptLanguage(header)).toEqual(["fr-FR", "es-MX", "en-US"]);
    expect(resolveAcceptLanguage(header)).toBe("es");
  });

  it("uses supplied browser preferences and has an SSR-safe fallback", () => {
    expect(detectBrowserLocale(["de-DE", "ja-JP"])).toBe("ja");
    expect(detectBrowserLocale([], "en")).toBe("en");
  });

  it("keeps every dictionary aligned with the source keys", () => {
    const sourceKeys = Object.keys(messages.en).sort();
    for (const locale of supportedLocales) {
      expect(Object.keys(messages[locale]).sort()).toEqual(sourceKeys);
      expect(Object.values(messages[locale]).every(Boolean)).toBe(true);
    }
  });

  it("translates known keys and falls back for unsupported locales", () => {
    expect(translate("ja", "nav.audit")).toBe("無料診断");
    expect(translate("es-MX", "common.retry")).toBe("Reintentar");
    expect(translate("fr", "brand.name")).toBe("Morning Operator");
  });

  it("interpolates typed translations without dropping missing placeholders", () => {
    const t = createTranslator("en-GB");
    expect(t("greeting.named", { name: "Ada" })).toBe("Good morning, Ada.");
    expect(t("greeting.named")).toBe("Good morning, {name}.");
  });
});
