import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { resolveAcceptLanguage } from "@/i18n";
import { getConfiguredDefaultLocale } from "@/lib/public-config";

export const dynamic = "force-dynamic";

export default async function LocaleEntryPage() {
  const acceptLanguage = (await headers()).get("accept-language");
  redirect(`/${resolveAcceptLanguage(acceptLanguage, getConfiguredDefaultLocale())}`);
}
