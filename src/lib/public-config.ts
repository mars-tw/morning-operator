import { defaultLocale, isLocale, type Locale } from "@/i18n";

export function getConfiguredDefaultLocale(): Locale {
  const value = process.env.NEXT_PUBLIC_DEFAULT_LOCALE;
  return isLocale(value) ? value : defaultLocale;
}

function configuredCurrency(): string {
  const value = (process.env.NEXT_PUBLIC_OFFER_CURRENCY || "USD").trim().toUpperCase();
  return /^[A-Z]{3}$/.test(value) ? value : "USD";
}

function configuredMinor(name: string, fallback: number): number {
  const value = Number(process.env[name]);
  return Number.isSafeInteger(value) && value > 0 ? value : fallback;
}

export function currencyFractionDigits(currency: string): number {
  try {
    return new Intl.NumberFormat("en", { style: "currency", currency }).resolvedOptions().maximumFractionDigits ?? 2;
  } catch {
    return 2;
  }
}

export function formatMinorMoney(amountMinor: number, currency: string, locale: Locale | string): string {
  const digits = currencyFractionDigits(currency);
  const amount = amountMinor / 10 ** digits;
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(digits)}`;
  }
}

export function getPublicOffer(locale: Locale) {
  const currency = configuredCurrency();
  const setupMinor = configuredMinor("NEXT_PUBLIC_OFFER_SETUP_MINOR", 65_000);
  const monthlyMinor = configuredMinor("NEXT_PUBLIC_OFFER_MONTHLY_MINOR", 6_500);
  const defaultHourlyCostMinor = configuredMinor("NEXT_PUBLIC_DEFAULT_HOURLY_COST_MINOR", 2_500);
  return {
    currency,
    setupMinor,
    monthlyMinor,
    defaultHourlyCostMinor,
    fractionDigits: currencyFractionDigits(currency),
    setup: formatMinorMoney(setupMinor, currency, locale),
    monthly: formatMinorMoney(monthlyMinor, currency, locale),
    sampleSales: formatMinorMoney(setupMinor * 4, currency, locale),
    sampleRefunds: formatMinorMoney(Math.round(setupMinor / 6), currency, locale)
  };
}
