"use client";

import { useMemo, useState } from "react";
import { createTranslator, type Locale, type MessageKey } from "@/i18n";
import {
  deploymentProviderIds,
  deploymentProviders,
  getDeploymentCompatibility,
  getSiteRuntime,
  recommendSiteDeployment,
  type DeploymentProviderId,
  type SiteType
} from "@/lib/site-deployment";

const selectableSiteTypes = ["sales_landing", "campaign", "catalog", "service_booking"] as const;

const providerNameKeys = {
  source_only: "site.provider.source_only.name",
  cloudflare_pages: "site.provider.cloudflare_pages.name",
  cloudflare_workers: "site.provider.cloudflare_workers.name",
  firebase_hosting: "site.provider.firebase_hosting.name",
  gcp_cloud_run: "site.provider.gcp_cloud_run.name",
  github_pages: "site.provider.github_pages.name"
} as const satisfies Record<DeploymentProviderId, MessageKey>;

const providerSummaryKeys = {
  source_only: "site.provider.source_only.summary",
  cloudflare_pages: "site.provider.cloudflare_pages.summary",
  cloudflare_workers: "site.provider.cloudflare_workers.summary",
  firebase_hosting: "site.provider.firebase_hosting.summary",
  gcp_cloud_run: "site.provider.gcp_cloud_run.summary",
  github_pages: "site.provider.github_pages.summary"
} as const satisfies Record<DeploymentProviderId, MessageKey>;

const siteTypeKeys = {
  sales_landing: "site.type.sales_landing",
  campaign: "site.type.campaign",
  catalog: "site.type.catalog",
  service_booking: "site.type.service_booking"
} as const satisfies Record<(typeof selectableSiteTypes)[number], MessageKey>;

export function SiteLaunchPlanner({ locale }: { locale: Locale }) {
  const [siteType, setSiteType] = useState<Exclude<SiteType, "none">>("sales_landing");
  const t = createTranslator(locale);
  const recommended = useMemo(() => recommendSiteDeployment(siteType), [siteType]);
  const runtime = getSiteRuntime(siteType);

  function requestWebsite() {
    window.dispatchEvent(new CustomEvent("morning-operator:site-selected", {
      detail: { siteType, deploymentTarget: recommended }
    }));
  }

  return (
    <section className="launch-studio" id="site-launch" aria-labelledby="site-launch-title">
      <div className="section-intro launch-intro">
        <p className="eyebrow">{t("site.eyebrow")}</p>
        <h2 id="site-launch-title">{t("site.title")}</h2>
        <p>{t("site.description")}</p>
      </div>

      <div className="launch-router">
        <fieldset className="site-type-selector">
          <legend>{t("site.chooseType")}</legend>
          {selectableSiteTypes.map((type) => (
            <label key={type}>
              <input
                checked={siteType === type}
                name="launch-site-type"
                onChange={() => setSiteType(type)}
                type="radio"
                value={type}
              />
              <span>{t(siteTypeKeys[type])}</span>
            </label>
          ))}
        </fieldset>

        <div className="route-ticket" aria-live="polite">
          <span>{t("site.recommended")}</span>
          <strong>{t(providerNameKeys[recommended])}</strong>
          <small>{t(`site.runtime.${runtime}`)} · {t("site.freeSnapshot")}</small>
        </div>
      </div>

      <div className="hosting-grid">
        {deploymentProviderIds.map((providerId) => {
          const provider = deploymentProviders[providerId];
          const compatibility = getDeploymentCompatibility(siteType, providerId);
          return (
            <article className={`hosting-card ${compatibility}`} key={providerId}>
              <div className="hosting-card-head">
                <span className="host-light" aria-hidden="true" />
                <span>{t(`site.compatibility.${compatibility}`)}</span>
              </div>
              <h3>{t(providerNameKeys[providerId])}</h3>
              <p>{t(providerSummaryKeys[providerId])}</p>
              <a
                aria-label={`${t("site.official")}: ${t(providerNameKeys[providerId])} — ${t("site.newTab")}`}
                href={provider.officialDocumentation}
                rel="noreferrer"
                target="_blank"
              >{t("site.official")} ↗</a>
            </article>
          );
        })}
      </div>

      <div className="github-role">
        <p>{t("site.githubRole")}</p>
        <a className="button primary" href="#audit" onClick={requestWebsite}>{t("site.cta")}</a>
      </div>
    </section>
  );
}
