import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/lead-form";
import {
  createTranslator,
  isLocale,
  localeMetadata,
  supportedLocales,
  type Locale,
  type MessageKey
} from "@/i18n";
import { industryPackIds, industryPacks, type IndustryPackId } from "@/lib/industry-packs";
import { getPublicOffer } from "@/lib/public-config";

type PageProps = { params: Promise<{ locale: string }> };

const packMessageKeys = {
  commerce_ops: { name: "pack.commerce.name", description: "pack.commerce.description" },
  professional_services: { name: "pack.professional.name", description: "pack.professional.description" },
  appointments: { name: "pack.appointments.name", description: "pack.appointments.description" },
  creator_education: { name: "pack.creator.name", description: "pack.creator.description" },
  property_field: { name: "pack.property.name", description: "pack.property.description" },
  backoffice: { name: "pack.backoffice.name", description: "pack.backoffice.description" }
} as const satisfies Record<IndustryPackId, { name: MessageKey; description: MessageKey }>;

function validLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  return value;
}

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = validLocale((await params).locale);
  const t = createTranslator(locale);
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(supportedLocales.map((candidate) => [candidate, `/${candidate}`]))
    }
  };
}

export default async function LocalizedHomePage({ params }: PageProps) {
  const locale = validLocale((await params).locale);
  const t = createTranslator(locale);
  const offer = getPublicOffer(locale);
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
  const reportRows = [
    [t("report.sales"), "84", "+12.4%"],
    [t("report.pending"), "7", "REVIEW"],
    [t("report.stock"), "4.6 h", "RANGE"],
    [t("report.refunds"), "98.7%", "OK"]
  ];

  return (
    <main lang={localeMetadata[locale].htmlLang} dir={localeMetadata[locale].direction}>
      {demoMode && <div className="demo-banner" role="status">{t("demo.banner")}</div>}
      <nav className="site-nav" aria-label="Primary navigation">
        <a className="wordmark" href={`/${locale}#top`}>{t("brand.name")}</a>
        <div className="nav-links">
          <a href="#industries">{t("nav.industries")}</a>
          <a href="#offer">{t("nav.offer")}</a>
          <a href="#audit">{t("nav.audit")}</a>
          <a href="/admin">{t("nav.admin")}</a>
        </div>
        <div className="locale-switcher" aria-label={t("language.label")}>
          {supportedLocales.map((candidate) => (
            <a
              aria-current={candidate === locale ? "page" : undefined}
              href={`/${candidate}`}
              hrefLang={candidate}
              key={candidate}
              lang={localeMetadata[candidate].htmlLang}
            >
              {candidate === "zh-TW" ? "繁中" : candidate === "ja" ? "日本語" : candidate.toUpperCase()}
            </a>
          ))}
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">{t("hero.eyebrow")}</p>
          <h1>{t("hero.title")}</h1>
          <p className="hero-lede">{t("hero.description")}</p>
          <div className="hero-actions">
            <a className="button primary" href="#audit">{t("hero.primaryCta")}</a>
            <a className="text-link" href="#report">{t("hero.secondaryCta")} →</a>
          </div>
          <p className="microcopy">{t("hero.disclaimer")}</p>
        </div>
        <div className="report-sheet" id="report" aria-label={t("report.title")}>
          <div className="sheet-head"><div><span>{t("report.title")}</span><strong>2026 / 07 / 17</strong></div><b>09:00</b></div>
          <p className="sheet-greeting">{t("report.greeting")}</p>
          <div className="report-table">
            {reportRows.map(([label, value, signal]) => <div className="report-row" key={label}><span>{label}</span><strong>{value}</strong><small>{signal}</small></div>)}
          </div>
          <div className="red-stamp">{t("report.sample")}</div>
        </div>
      </section>

      <section className="conveyor" aria-label="Automation workflow">
        <div><span>{t("workflow.connect")}</span><i>READ ONLY</i></div><b>→</b>
        <div><span>{t("workflow.analyze")}</span><i>ANONYMIZED</i></div><b>→</b>
        <div><span>{t("workflow.review")}</span><i>APPROVAL</i></div><b>→</b>
        <div><span>{t("workflow.deliver")}</span><i>EMAIL</i></div>
      </section>

      <section className="pack-section" id="industries">
        <div className="section-intro">
          <p className="eyebrow">{t("pack.eyebrow")}</p>
          <h2>{t("pack.title")}</h2>
          <p>{t("pack.description")}</p>
        </div>
        <div className="pack-grid">
          {industryPackIds.map((packId, index) => {
            const pack = industryPacks[packId];
            const copy = packMessageKeys[packId];
            return (
              <a className="pack-card" href="#audit" key={packId}>
                <span className="pack-index">BP-{String(index + 1).padStart(2, "0")}</span>
                <span className={`risk-badge ${pack.riskTier}`}>{t(`risk.${pack.riskTier}`)}</span>
                <h3>{t(copy.name)}</h3>
                <p>{t(copy.description)}</p>
                <small>{Math.round(pack.coverage.low * 100)}–{Math.round(pack.coverage.high * 100)}% RANGE</small>
              </a>
            );
          })}
        </div>
      </section>

      <section className="offer" id="offer">
        <div className="section-intro"><p className="eyebrow">{t("offer.eyebrow")}</p><h2>{t("offer.title")}</h2></div>
        <div className="offer-grid">
          <article className="offer-main">
            <div className="price"><span>{t("offer.setup")}</span><strong>{offer.setup}</strong><small>{t("offer.delivery")}</small></div>
            <ul>
              <li>{t("offer.readOnly")}</li><li>{t("offer.history")}</li><li>{t("offer.report")}</li>
              <li>{t("offer.channel")}</li><li>{t("offer.support")}</li>
            </ul>
            <p><strong>{offer.monthly}</strong> / {t("offer.monthly").toLocaleLowerCase(locale)}</p>
          </article>
          <aside className="boundary"><h3>{t("offer.boundaryTitle")}</h3><p>{t("offer.boundary")}</p><h3>{t("offer.humanTitle")}</h3><p>{t("offer.humanBody")}</p></aside>
        </div>
      </section>

      <section className="fit-section"><div><p className="eyebrow">{t("fit.eyebrow")}</p><h2>{t("fit.title")}</h2></div><div className="fit-list"><p><b>01</b>{t("fit.one")}</p><p><b>02</b>{t("fit.two")}</p><p><b>03</b>{t("fit.three")}</p></div></section>

      <section className="audit-section" id="audit">
        <LeadForm
          locale={locale}
          offer={{
            currency: offer.currency,
            fractionDigits: offer.fractionDigits,
            setupMinor: offer.setupMinor,
            defaultHourlyCostMinor: offer.defaultHourlyCostMinor
          }}
        />
      </section>

      <section className="faq"><div className="section-intro"><p className="eyebrow">{t("faq.eyebrow")}</p><h2>{t("faq.title")}</h2></div><div className="faq-grid">
        <details><summary>{t("faq.writeQuestion")}</summary><p>{t("faq.writeAnswer")}</p></details>
        <details><summary>{t("faq.aiQuestion")}</summary><p>{t("faq.aiAnswer")}</p></details>
        <details><summary>{t("faq.selfHostQuestion")}</summary><p>{t("faq.selfHostAnswer")}</p></details>
        <details><summary>{t("faq.guaranteeQuestion")}</summary><p>{t("faq.guaranteeAnswer")}</p></details>
      </div></section>

      <footer><div className="wordmark">{t("brand.name")}</div><p>{t("footer.tagline")}</p><p className="utility">{t("footer.opensource")} {t("footer.disclaimer")}</p></footer>
    </main>
  );
}
