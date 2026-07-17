export const siteTypes = [
  "none",
  "sales_landing",
  "campaign",
  "catalog",
  "service_booking"
] as const;

export type SiteType = (typeof siteTypes)[number];
export type SiteRuntime = "static" | "dynamic";

export const deploymentProviderIds = [
  "source_only",
  "cloudflare_pages",
  "cloudflare_workers",
  "firebase_hosting",
  "gcp_cloud_run",
  "github_pages"
] as const;

export type DeploymentProviderId = (typeof deploymentProviderIds)[number];
export type DeploymentCompatibility = "recommended" | "compatible" | "not_recommended" | "prohibited";

export type DeploymentProvider = {
  id: DeploymentProviderId;
  supports: readonly SiteRuntime[];
  commercialSalesSite: boolean;
  billingAccountRequired: boolean;
  registration: "none" | "simple" | "billing_required";
  freeAllowance: string;
  officialDocumentation: string;
  verifiedOn: "2026-07-17";
};

export const deploymentProviders = {
  source_only: {
    id: "source_only",
    supports: ["static", "dynamic"],
    commercialSalesSite: true,
    billingAccountRequired: false,
    registration: "none",
    freeAllowance: "Source bundle and Git repository workflow; hosting is not included.",
    officialDocumentation: "https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories",
    verifiedOn: "2026-07-17"
  },
  cloudflare_pages: {
    id: "cloudflare_pages",
    supports: ["static"],
    commercialSalesSite: true,
    billingAccountRequired: false,
    registration: "simple",
    freeAllowance: "Free plan: 500 builds/month, 100 projects/account, 20,000 files/site.",
    officialDocumentation: "https://developers.cloudflare.com/pages/platform/limits/",
    verifiedOn: "2026-07-17"
  },
  cloudflare_workers: {
    id: "cloudflare_workers",
    supports: ["static", "dynamic"],
    commercialSalesSite: true,
    billingAccountRequired: false,
    registration: "simple",
    freeAllowance: "Free plan: 100,000 Worker requests/day with runtime limits.",
    officialDocumentation: "https://developers.cloudflare.com/workers/platform/limits/",
    verifiedOn: "2026-07-17"
  },
  firebase_hosting: {
    id: "firebase_hosting",
    supports: ["static"],
    commercialSalesSite: true,
    billingAccountRequired: false,
    registration: "simple",
    freeAllowance: "Spark plan: 10 GB storage and 360 MB/day data transfer; no payment method required.",
    officialDocumentation: "https://firebase.google.com/pricing",
    verifiedOn: "2026-07-17"
  },
  gcp_cloud_run: {
    id: "gcp_cloud_run",
    supports: ["static", "dynamic"],
    commercialSalesSite: true,
    billingAccountRequired: true,
    registration: "billing_required",
    freeAllowance: "Request-based free tier includes 2 million requests/month plus CPU and RAM allowances.",
    officialDocumentation: "https://cloud.google.com/run/pricing",
    verifiedOn: "2026-07-17"
  },
  github_pages: {
    id: "github_pages",
    supports: ["static"],
    commercialSalesSite: false,
    billingAccountRequired: false,
    registration: "simple",
    freeAllowance: "Static project documentation only; GitHub disallows Pages as free hosting for online businesses and e-commerce.",
    officialDocumentation: "https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits",
    verifiedOn: "2026-07-17"
  }
} as const satisfies Record<DeploymentProviderId, DeploymentProvider>;

export function isSiteType(value: unknown): value is SiteType {
  return typeof value === "string" && siteTypes.includes(value as SiteType);
}

export function isDeploymentProviderId(value: unknown): value is DeploymentProviderId {
  return typeof value === "string" && deploymentProviderIds.includes(value as DeploymentProviderId);
}

export function getSiteRuntime(siteType: SiteType): SiteRuntime {
  return siteType === "service_booking" ? "dynamic" : "static";
}

export function getDeploymentCompatibility(
  siteType: SiteType,
  providerId: DeploymentProviderId
): DeploymentCompatibility {
  if (siteType === "none") return providerId === "source_only" ? "compatible" : "not_recommended";
  const provider = deploymentProviders[providerId];
  if (!provider.commercialSalesSite) return "prohibited";
  const runtime = getSiteRuntime(siteType);
  if (!(provider.supports as readonly SiteRuntime[]).includes(runtime)) return "not_recommended";
  if (providerId === recommendSiteDeployment(siteType)) return "recommended";
  return "compatible";
}

export function recommendSiteDeployment(siteType: SiteType): DeploymentProviderId {
  if (siteType === "none") return "source_only";
  return getSiteRuntime(siteType) === "dynamic" ? "cloudflare_workers" : "cloudflare_pages";
}

export function isDeploymentChoiceAllowed(siteType: SiteType, providerId: DeploymentProviderId): boolean {
  return ["recommended", "compatible"].includes(getDeploymentCompatibility(siteType, providerId));
}

export function validateDeploymentProviderRegistry(): string[] {
  const errors: string[] = [];
  for (const id of deploymentProviderIds) {
    const provider = deploymentProviders[id];
    if (provider.id !== id) errors.push(`${id}: id mismatch`);
    if (!provider.supports.length) errors.push(`${id}: no supported runtime`);
    if (!provider.freeAllowance.trim()) errors.push(`${id}: missing free allowance`);
    if (!provider.officialDocumentation.startsWith("https://")) errors.push(`${id}: invalid documentation URL`);
  }
  return errors;
}
