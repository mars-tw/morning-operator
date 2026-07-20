const developmentSiteUrl = "http://localhost:3000";

export function getPublicSiteUrl(value = process.env.AUTOPILOT_BASE_URL): URL {
  if (!value) return new URL(developmentSiteUrl);

  const candidate = new URL(value);
  if (!["http:", "https:"].includes(candidate.protocol)) {
    throw new Error("AUTOPILOT_BASE_URL must use http or https");
  }
  if (candidate.username || candidate.password || candidate.search || candidate.hash) {
    throw new Error("AUTOPILOT_BASE_URL must be a public origin without credentials, query, or hash");
  }
  if (candidate.pathname !== "/") {
    throw new Error("AUTOPILOT_BASE_URL must be an origin without a path");
  }

  return new URL(candidate.origin);
}

export function absoluteSiteUrl(pathname: string, value?: string): string {
  return new URL(pathname, getPublicSiteUrl(value)).href;
}
