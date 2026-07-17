export const supportedLocales = ["en", "zh-TW", "ja", "es"] as const;

export type Locale = (typeof supportedLocales)[number];

export const defaultLocale: Locale = "en";

export type LocaleMetadata = {
  label: string;
  nativeLabel: string;
  htmlLang: string;
  direction: "ltr" | "rtl";
};

export const localeMetadata: Record<Locale, LocaleMetadata> = {
  en: {
    label: "English",
    nativeLabel: "English",
    htmlLang: "en",
    direction: "ltr"
  },
  "zh-TW": {
    label: "Traditional Chinese",
    nativeLabel: "繁體中文",
    htmlLang: "zh-Hant-TW",
    direction: "ltr"
  },
  ja: {
    label: "Japanese",
    nativeLabel: "日本語",
    htmlLang: "ja",
    direction: "ltr"
  },
  es: {
    label: "Spanish",
    nativeLabel: "Español",
    htmlLang: "es",
    direction: "ltr"
  }
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && supportedLocales.includes(value as Locale);
}

/**
 * Maps a BCP 47-ish language tag to a supported locale. Region variants such
 * as en-US, ja-JP and es-MX intentionally collapse into their base locale.
 */
export function matchLocale(value: unknown): Locale | null {
  if (typeof value !== "string") return null;

  const normalized = value.trim().replaceAll("_", "-").toLowerCase();
  if (!normalized || normalized === "*") return null;

  if (normalized === "zh-tw") return "zh-TW";
  if (normalized === "en" || normalized.startsWith("en-")) return "en";
  if (normalized === "ja" || normalized.startsWith("ja-")) return "ja";
  if (normalized === "es" || normalized.startsWith("es-")) return "es";

  // Traditional Chinese is the only Chinese catalog currently shipped. Map
  // all Chinese variants to it instead of showing a partially translated UI.
  if (normalized === "zh" || normalized.startsWith("zh-")) return "zh-TW";

  return null;
}

export function resolveLocale(
  candidates: string | readonly string[] | null | undefined,
  fallback: Locale = defaultLocale
): Locale {
  const values = typeof candidates === "string" ? [candidates] : candidates ?? [];

  for (const candidate of values) {
    const matched = matchLocale(candidate);
    if (matched) return matched;
  }

  return fallback;
}

/** Parses an HTTP Accept-Language header in descending preference order. */
export function parseAcceptLanguage(header: string | null | undefined): string[] {
  if (!header) return [];

  return header
    .split(",")
    .map((part, index) => {
      const [tag = "", ...parameters] = part.trim().split(";");
      const qualityParameter = parameters.find((parameter) =>
        parameter.trim().toLowerCase().startsWith("q=")
      );
      const parsedQuality = qualityParameter
        ? Number.parseFloat(qualityParameter.split("=")[1] ?? "")
        : 1;
      const quality = Number.isFinite(parsedQuality)
        ? Math.min(1, Math.max(0, parsedQuality))
        : 0;

      return { tag: tag.trim(), quality, index };
    })
    .filter(({ tag, quality }) => Boolean(tag) && tag !== "*" && quality > 0)
    .sort((left, right) => right.quality - left.quality || left.index - right.index)
    .map(({ tag }) => tag);
}

export function resolveAcceptLanguage(
  header: string | null | undefined,
  fallback: Locale = defaultLocale
): Locale {
  return resolveLocale(parseAcceptLanguage(header), fallback);
}

/**
 * Resolves navigator.languages. Supplying the array makes the function easy to
 * use during SSR and deterministic in tests.
 */
export function detectBrowserLocale(
  languages?: readonly string[],
  fallback: Locale = defaultLocale
): Locale {
  if (languages) return resolveLocale(languages, fallback);

  if (typeof navigator === "undefined") return fallback;
  const browserLanguages = navigator.languages?.length
    ? navigator.languages
    : navigator.language
      ? [navigator.language]
      : [];

  return resolveLocale(browserLanguages, fallback);
}
