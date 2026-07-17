"use client";

import { useState, type FormEvent } from "react";
import { createTranslator, type Locale, type MessageKey } from "@/i18n";
import {
  industryPacks,
  industryPackIds,
  type AutomationGoal,
  type IndustryPackId,
  type RiskTier
} from "@/lib/industry-packs";

type Offer = {
  currency: string;
  fractionDigits: number;
  setupMinor: number;
  defaultHourlyCostMinor: number;
};

type Result = {
  leadId: string;
  score: number;
  currentMonthlyHours: number;
  recoverableHours: { low: number; high: number };
  monthlyValueMinor: { low: number; high: number };
  paybackMonths: { fast: number; slow: number } | null;
  currency: string;
  fractionDigits: number;
  riskTier: RiskTier;
  supportedGoal: boolean;
  qualified: boolean;
  disclaimer: string;
};

const packNameKeys = {
  commerce_ops: "pack.commerce.name",
  professional_services: "pack.professional.name",
  appointments: "pack.appointments.name",
  creator_education: "pack.creator.name",
  property_field: "pack.property.name",
  backoffice: "pack.backoffice.name"
} as const satisfies Record<IndustryPackId, MessageKey>;

const goalKeys = {
  reporting: "goal.reporting",
  lead_followup: "goal.lead_followup",
  scheduling: "goal.scheduling",
  content_ops: "goal.content_ops",
  document_ops: "goal.document_ops",
  operations_alerts: "goal.operations_alerts"
} as const satisfies Record<AutomationGoal, MessageKey>;

function formatMoney(amountMinor: number, currency: string, fractionDigits: number, locale: Locale) {
  const amount = amountMinor / 10 ** fractionDigits;
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(fractionDigits)}`;
  }
}

export function LeadForm({ locale, offer }: { locale: Locale; offer: Offer }) {
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [packId, setPackId] = useState<IndustryPackId>("commerce_ops");
  const [goal, setGoal] = useState<AutomationGoal>(industryPacks.commerce_ops.goals[0]);
  const t = createTranslator(locale);
  const hourlyCostDefault = offer.defaultHourlyCostMinor / 10 ** offer.fractionDigits;

  function changePack(nextPackId: IndustryPackId) {
    setPackId(nextPackId);
    setGoal(industryPacks[nextPackId].goals[0]);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const primaryPlatform = String(form.get("primaryPlatform"));
    const hourlyCost = Number(form.get("hourlyCost"));
    const payload = {
      locale,
      brandName: form.get("brandName"),
      email: form.get("email"),
      storeUrl: form.get("storeUrl"),
      industryPack: packId,
      primaryPlatform,
      automationGoal: goal,
      industry: form.get("industry"),
      usesShopify: primaryPlatform === "shopify",
      usesCurrentPlatform: form.get("usesCurrentPlatform") === "on",
      monthlyOrders: form.get("monthlyOrders"),
      teamSize: form.get("teamSize"),
      dailyMinutes: Number(form.get("dailyMinutes")),
      weeklyReportMinutes: Number(form.get("weeklyReportMinutes")),
      hourlyCostMinor: Math.max(0, Math.round(hourlyCost * 10 ** offer.fractionDigits)),
      biggestProblem: form.get("biggestProblem"),
      requestedScope: form.get("requestedScope"),
      implementationTiming: form.get("implementationTiming"),
      privacyConsent: form.get("privacyConsent") === "on",
      marketingConsent: form.get("marketingConsent") === "on",
      companyNote: form.get("companyNote") || ""
    };
    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(t("audit.error"));
      setResult(await response.json());
    } catch {
      setError(t("audit.error"));
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    const riskKey = `risk.${result.riskTier}` as MessageKey;
    return (
      <div className="result-card" aria-live="polite">
        <p className="stamp">{t("audit.success")}</p>
        <p className="result-number">{result.currentMonthlyHours}<small> {t("audit.hoursPerMonth")}</small></p>
        <p>{t("audit.resultExplain")}</p>
        <div className="estimate-grid">
          <div><span>{t("estimate.recoverable")}</span><strong>{result.recoverableHours.low}–{result.recoverableHours.high} h</strong></div>
          <div><span>{t("estimate.value")}</span><strong>{formatMoney(result.monthlyValueMinor.low, result.currency, result.fractionDigits, locale)}–{formatMoney(result.monthlyValueMinor.high, result.currency, result.fractionDigits, locale)}</strong></div>
          <div><span>{t("estimate.payback")}</span><strong>{result.paybackMonths ? `${result.paybackMonths.fast}–${result.paybackMonths.slow} ${t("estimate.months")}` : t("estimate.noPayback")}</strong></div>
          <div><span>{t("estimate.risk")}</span><strong className={`risk-badge ${result.riskTier}`}>{t(riskKey)}</strong></div>
        </div>
        {result.riskTier === "restricted" ? (
          <><h3>{t("audit.notQualified")}</h3><p>{t("estimate.restricted")}</p></>
        ) : result.qualified ? (
          <><h3>{t("audit.qualified")}</h3><p>{t("audit.qualifiedNext")}</p><a className="button primary" href={(process.env.NEXT_PUBLIC_CHECKOUT_URL || "mailto:hello@example.com?subject=Morning%20Operator%20demo").replace("{leadId}", encodeURIComponent(result.leadId))}>{t("audit.book")}</a></>
        ) : (
          <><h3>{t("audit.notQualified")}</h3><p>{t("audit.notQualifiedNext")}</p></>
        )}
        <p className="estimate-disclaimer">{result.disclaimer}</p>
        <p className="utility">{t("audit.caseScore", { id: result.leadId.slice(0, 8), score: result.score })}</p>
      </div>
    );
  }

  return (
    <form className="audit-form" onSubmit={submit}>
      <div className="form-heading"><span className="ledger-index">{t("nav.audit")}</span><h2>{t("audit.title")}</h2></div>
      <div className="blueprint-strip" aria-live="polite">
        <span>ACTIVE BLUEPRINT</span>
        <strong>{t(packNameKeys[packId])}</strong>
        <small>{Math.round(industryPacks[packId].coverage.low * 100)}–{Math.round(industryPacks[packId].coverage.high * 100)}% RANGE</small>
      </div>
      <div className="form-grid">
        <label>{t("audit.brandName")}<input name="brandName" required minLength={2} /></label>
        <label>{t("audit.email")}<input name="email" type="email" required /></label>
        <label className="wide">{t("audit.storeUrl")}<input name="storeUrl" type="url" placeholder="https://example.com" /></label>
        <label>{t("audit.industryPack")}<select name="industryPack" value={packId} onChange={(event) => changePack(event.target.value as IndustryPackId)}>{industryPackIds.map((id) => <option value={id} key={id}>{t(packNameKeys[id])}</option>)}</select></label>
        <label>{t("audit.primaryPlatform")}<select name="primaryPlatform" defaultValue="spreadsheet"><option value="shopify">{t("platform.shopify")}</option><option value="email">{t("platform.email")}</option><option value="spreadsheet">{t("platform.spreadsheet")}</option><option value="calendar">{t("platform.calendar")}</option><option value="crm">{t("platform.crm")}</option><option value="marketplace">{t("platform.marketplace")}</option><option value="website">{t("platform.website")}</option><option value="other">{t("platform.other")}</option></select></label>
        <label>{t("audit.automationGoal")}<select name="automationGoal" value={goal} onChange={(event) => setGoal(event.target.value as AutomationGoal)}>{industryPacks[packId].goals.map((id) => <option value={id} key={id}>{t(goalKeys[id])}</option>)}</select></label>
        <label>{t("audit.industry")}<select name="industry" defaultValue="lifestyle"><option value="food">{t("audit.industry.food")}</option><option value="lifestyle">{t("audit.industry.lifestyle")}</option><option value="fashion">{t("audit.industry.fashion")}</option><option value="professional">{t("audit.industry.professional")}</option><option value="appointments">{t("audit.industry.appointments")}</option><option value="creator">{t("audit.industry.creator")}</option><option value="property">{t("audit.industry.property")}</option><option value="nonprofit">{t("audit.industry.nonprofit")}</option><option value="other">{t("audit.industry.other")}</option><option value="regulated">{t("audit.industry.regulated")}</option></select></label>
        <label>{t("audit.monthlyOrders")}<select name="monthlyOrders" defaultValue="100_500"><option value="under_100">{t("audit.orders.under100")}</option><option value="100_500">{t("audit.orders.100to500")}</option><option value="501_1500">{t("audit.orders.501to1500")}</option><option value="over_1500">{t("audit.orders.over1500")}</option></select></label>
        <label>{t("audit.teamSize")}<select name="teamSize" defaultValue="2_5"><option value="1">{t("audit.team.one")}</option><option value="2_5">{t("audit.team.small")}</option><option value="6_plus">{t("audit.team.large")}</option></select></label>
        <label>{t("audit.hourlyCost")}<input name="hourlyCost" type="number" min="0" step={1 / 10 ** offer.fractionDigits} defaultValue={hourlyCostDefault} required /><span>{offer.currency}</span></label>
        <label>{t("audit.dailyMinutes")}<input name="dailyMinutes" type="number" min="0" max="600" defaultValue="45" required /><span>{t("audit.unit.minutes")}</span></label>
        <label>{t("audit.weeklyMinutes")}<input name="weeklyReportMinutes" type="number" min="0" max="1200" defaultValue="90" required /><span>{t("audit.unit.minutes")}</span></label>
        <label>{t("audit.biggestProblem")}<select name="biggestProblem" defaultValue="data_entry"><option value="overdue">{t("audit.problem.overdue")}</option><option value="refunds">{t("audit.problem.refunds")}</option><option value="low_stock">{t("audit.problem.stock")}</option><option value="scattered_numbers">{t("audit.problem.scattered")}</option><option value="data_entry">{t("audit.problem.dataEntry")}</option><option value="lead_followup">{t("audit.problem.leadFollowup")}</option><option value="scheduling">{t("audit.problem.scheduling")}</option><option value="document_backlog">{t("audit.problem.documents")}</option><option value="content_reuse">{t("audit.problem.contentReuse")}</option></select></label>
        <label>{t("audit.scope")}<select name="requestedScope" defaultValue="draft_and_review"><option value="read_only_report">{t("audit.scope.readOnly")}</option><option value="draft_and_review">{t("audit.scope.draftReview")}</option><option value="multi_platform">{t("audit.scope.multiPlatform")}</option><option value="autonomous_external_action">{t("audit.scope.autonomous")}</option></select></label>
        <label>{t("audit.timing")}<select name="implementationTiming" defaultValue="within_30_days"><option value="within_30_days">{t("audit.timing.30days")}</option><option value="one_to_three_months">{t("audit.timing.1to3months")}</option><option value="researching">{t("audit.timing.researching")}</option></select></label>
        <label className="wide">{t("audit.notes")}<textarea name="companyNote" maxLength={1000} rows={3} placeholder={t("audit.notesPlaceholder")} /></label>
      </div>
      <label className="check"><input name="usesCurrentPlatform" type="checkbox" defaultChecked />{t("audit.currentPlatform")}</label>
      <label className="check"><input name="privacyConsent" type="checkbox" required />{t("audit.privacy")}</label>
      <label className="check"><input name="marketingConsent" type="checkbox" />{t("audit.marketing")}</label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button primary" disabled={loading}>{loading ? t("audit.submitting") : t("audit.submit")}</button>
    </form>
  );
}
