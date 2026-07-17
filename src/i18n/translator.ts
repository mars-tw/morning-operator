import { defaultLocale, matchLocale, type Locale } from "./locales";
import { messages, type MessageKey } from "./messages";

export type TranslationValues = Record<string, string | number>;
export type Translate = (key: MessageKey, values?: TranslationValues) => string;

function interpolate(template: string, values?: TranslationValues): string {
  if (!values) return template;

  return template.replace(/\{([A-Za-z][A-Za-z0-9_]*)\}/g, (placeholder, name: string) => {
    const value = values[name];
    return value === undefined ? placeholder : String(value);
  });
}

export function translate(
  locale: Locale | string | null | undefined,
  key: MessageKey,
  values?: TranslationValues
): string {
  const resolvedLocale = matchLocale(locale) ?? defaultLocale;
  const template = messages[resolvedLocale]?.[key] ?? messages[defaultLocale][key] ?? key;
  return interpolate(template, values);
}

export function createTranslator(locale: Locale | string | null | undefined): Translate {
  return (key, values) => translate(locale, key, values);
}
