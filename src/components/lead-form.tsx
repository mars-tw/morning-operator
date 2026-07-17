"use client";

import { useState, type FormEvent } from "react";
import { createTranslator, type Locale } from "@/i18n";

type Result = {
  leadId: string;
  score: number;
  estimatedMonthlyHours: number;
  qualified: boolean;
};

export function LeadForm({ locale }: { locale: Locale }) {
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const t = createTranslator(locale);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = {
      locale,
      brandName: form.get("brandName"),
      email: form.get("email"),
      storeUrl: form.get("storeUrl"),
      industry: form.get("industry"),
      usesShopify: form.get("usesShopify") === "on",
      monthlyOrders: form.get("monthlyOrders"),
      teamSize: form.get("teamSize"),
      dailyMinutes: Number(form.get("dailyMinutes")),
      weeklyReportMinutes: Number(form.get("weeklyReportMinutes")),
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
    return (
      <div className="result-card" aria-live="polite">
        <p className="stamp">{t("audit.success")}</p>
        <p className="result-number">{result.estimatedMonthlyHours}<small> {t("audit.hoursPerMonth")}</small></p>
        <p>{t("audit.resultExplain")}</p>
        {result.qualified ? (
          <><h3>{t("audit.qualified")}</h3><p>{t("audit.qualifiedNext")}</p><a className="button primary" href={process.env.NEXT_PUBLIC_CHECKOUT_URL || "mailto:hello@example.com?subject=Morning%20Operator%20demo"}>{t("audit.book")}</a></>
        ) : (
          <><h3>{t("audit.notQualified")}</h3><p>{t("audit.notQualifiedNext")}</p></>
        )}
        <p className="utility">{t("audit.caseScore", { id: result.leadId.slice(0, 8), score: result.score })}</p>
      </div>
    );
  }

  return (
    <form className="audit-form" onSubmit={submit}>
      <div className="form-heading"><span className="ledger-index">{t("nav.audit")}</span><h2>{t("audit.title")}</h2></div>
      <div className="form-grid">
        <label>{t("audit.brandName")}<input name="brandName" required minLength={2} /></label>
        <label>{t("audit.email")}<input name="email" type="email" required /></label>
        <label className="wide">{t("audit.storeUrl")}<input name="storeUrl" type="url" placeholder="https://your-store.com" required /></label>
        <label>{t("audit.industry")}<select name="industry" defaultValue="lifestyle"><option value="food">{t("audit.industry.food")}</option><option value="lifestyle">{t("audit.industry.lifestyle")}</option><option value="fashion">{t("audit.industry.fashion")}</option><option value="other">{t("audit.industry.other")}</option><option value="regulated">{t("audit.industry.regulated")}</option></select></label>
        <label>{t("audit.monthlyOrders")}<select name="monthlyOrders" defaultValue="100_500"><option value="under_100">{t("audit.orders.under100")}</option><option value="100_500">{t("audit.orders.100to500")}</option><option value="501_1500">{t("audit.orders.501to1500")}</option><option value="over_1500">{t("audit.orders.over1500")}</option></select></label>
        <label>{t("audit.teamSize")}<select name="teamSize" defaultValue="2_5"><option value="1">{t("audit.team.one")}</option><option value="2_5">{t("audit.team.small")}</option><option value="6_plus">{t("audit.team.large")}</option></select></label>
        <label>{t("audit.dailyMinutes")}<input name="dailyMinutes" type="number" min="0" max="600" defaultValue="45" required /><span>{t("audit.unit.minutes")}</span></label>
        <label>{t("audit.weeklyMinutes")}<input name="weeklyReportMinutes" type="number" min="0" max="1200" defaultValue="90" required /><span>{t("audit.unit.minutes")}</span></label>
        <label>{t("audit.biggestProblem")}<select name="biggestProblem" defaultValue="scattered_numbers"><option value="overdue">{t("audit.problem.overdue")}</option><option value="refunds">{t("audit.problem.refunds")}</option><option value="low_stock">{t("audit.problem.stock")}</option><option value="scattered_numbers">{t("audit.problem.scattered")}</option></select></label>
        <label>{t("audit.scope")}<select name="requestedScope" defaultValue="read_only_report"><option value="read_only_report">{t("audit.scope.readOnly")}</option><option value="write_back">{t("audit.scope.writeBack")}</option><option value="multi_platform">{t("audit.scope.multiPlatform")}</option></select></label>
        <label>{t("audit.timing")}<select name="implementationTiming" defaultValue="within_30_days"><option value="within_30_days">{t("audit.timing.30days")}</option><option value="one_to_three_months">{t("audit.timing.1to3months")}</option><option value="researching">{t("audit.timing.researching")}</option></select></label>
        <label className="wide">{t("audit.notes")}<textarea name="companyNote" maxLength={1000} rows={3} placeholder={t("audit.notesPlaceholder")} /></label>
      </div>
      <label className="check"><input name="usesShopify" type="checkbox" defaultChecked />{t("audit.shopify")}</label>
      <label className="check"><input name="privacyConsent" type="checkbox" required />{t("audit.privacy")}</label>
      <label className="check"><input name="marketingConsent" type="checkbox" />{t("audit.marketing")}</label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button primary" disabled={loading}>{loading ? t("audit.submitting") : t("audit.submit")}</button>
    </form>
  );
}
