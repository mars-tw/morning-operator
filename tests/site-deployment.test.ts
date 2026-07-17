import { describe, expect, it } from "vitest";
import {
  deploymentProviderIds,
  deploymentProviders,
  getDeploymentCompatibility,
  getSiteRuntime,
  isDeploymentChoiceAllowed,
  recommendSiteDeployment,
  validateDeploymentProviderRegistry
} from "@/lib/site-deployment";

describe("free-first website deployment registry", () => {
  it("keeps every provider complete, documented, and reviewable", () => {
    expect(validateDeploymentProviderRegistry()).toEqual([]);
    expect(Object.keys(deploymentProviders)).toEqual([...deploymentProviderIds]);
    expect(deploymentProviders.cloudflare_pages.verifiedOn).toBe("2026-07-17");
  });

  it("routes static commercial sites to Cloudflare Pages", () => {
    expect(getSiteRuntime("sales_landing")).toBe("static");
    expect(recommendSiteDeployment("sales_landing")).toBe("cloudflare_pages");
    expect(getDeploymentCompatibility("catalog", "firebase_hosting")).toBe("compatible");
  });

  it("routes server-backed sites to Workers while keeping Cloud Run available", () => {
    expect(getSiteRuntime("service_booking")).toBe("dynamic");
    expect(recommendSiteDeployment("service_booking")).toBe("cloudflare_workers");
    expect(isDeploymentChoiceAllowed("service_booking", "gcp_cloud_run")).toBe(true);
    expect(isDeploymentChoiceAllowed("service_booking", "cloudflare_pages")).toBe(false);
  });

  it("never offers GitHub Pages as commercial sales hosting", () => {
    expect(getDeploymentCompatibility("sales_landing", "github_pages")).toBe("prohibited");
    expect(isDeploymentChoiceAllowed("sales_landing", "github_pages")).toBe(false);
    expect(deploymentProviders.github_pages.commercialSalesSite).toBe(false);
  });
});
