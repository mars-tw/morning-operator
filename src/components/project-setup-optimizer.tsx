"use client";

import { useMemo, useState, type CSSProperties } from "react";

import type { Locale } from "@/i18n";
import type { ProjectReadinessAssessment, ProjectReadinessInput } from "@/lib/project-readiness";
import {
  projectRecipeIds,
  projectRecipes,
  type ProjectRecipeId
} from "@/lib/project-recipes";

type WorkflowProof = "mock" | "working" | "end_to_end";
type DataProof = "unverified" | "protected";
type OperationProof = "missing" | "idempotent" | "resilient";
type PaymentProof = "none" | "mock" | "verified";
type VerificationProof = "none" | "tests" | "full";
type DeploymentProof = "local" | "demo" | "production";
type MarketProof = "idea" | "interest" | "paid" | "repeatable";

type OptimizerState = {
  workflow: WorkflowProof;
  data: DataProof;
  operations: OperationProof;
  payment: PaymentProof;
  verification: VerificationProof;
  deployment: DeploymentProof;
  market: MarketProof;
};

type PreviewResult = {
  mode: "preview";
  recipe: {
    id: ProjectRecipeId;
    version: number;
    industryPackId: string;
    setupSteps: string[];
    verificationChecks: string[];
    requiredApprovals: string[];
    prohibitedActions: string[];
  };
  assessment: ProjectReadinessAssessment;
  disclaimer: string;
};

const initialState: OptimizerState = {
  workflow: "mock",
  data: "unverified",
  operations: "missing",
  payment: "none",
  verification: "none",
  deployment: "local",
  market: "idea"
};

const copy = {
  en: {
    nav: "Project setup",
    eyebrow: "Project commissioning desk",
    title: "Configure the project. Prove it can operate.",
    description: "Start from a reviewed recipe, record only evidence you can demonstrate, then fix blockers in priority order. This preview never stores customer records or triggers an external action.",
    choose: "1 / Choose a project recipe",
    evidence: "2 / Record current evidence",
    evidenceHelp: "Choose what is demonstrably true today—not what is planned.",
    workflow: "Core workflow",
    workflowOptions: ["Mock or screens only", "Partly working", "End-to-end verified"],
    data: "Data protection",
    dataOptions: ["Not verified", "Authenticated and isolated"],
    operations: "Writes and retries",
    operationOptions: ["No proof", "Idempotent", "Retry + dead-letter verified"],
    payment: "Payment evidence",
    paymentOptions: ["No payment in this scope", "Clearly labeled mock", "Signed provider events"],
    verification: "Automated verification",
    verificationOptions: ["None", "Tests run locally", "Typecheck, tests, build and CI"],
    deployment: "Deployment proof",
    deploymentOptions: ["Local only", "Public demo", "Production verified"],
    market: "Buyer evidence",
    marketOptions: ["Idea only", "Buyer interest", "One paid pilot", "Repeatable paid delivery"],
    evaluate: "Run readiness check",
    evaluating: "Checking evidence…",
    apply: "Use this recipe in the free audit",
    preview: "PREVIEW ONLY",
    previewNotice: "No payment, deployment, message, or external change occurs here.",
    plan: "Commissioning plan",
    planSteps: ["Approve the minimum input and privacy boundary.", "Configure one fixed workflow and its free-first deployment path.", "Pass the recipe verification checks with synthetic data.", "Record every required approval before production delivery."],
    checks: "verification checks",
    approvals: "required approvals",
    blocks: "prohibited actions",
    assignment: "Assignment execution",
    commercial: "Commercial delivery",
    marketScore: "Market scenario",
    monetization: "Monetization readiness",
    priorities: "Improvement queue",
    noFindings: "No current finding at this priority.",
    disclaimer: "Scores are evidence-based scenarios. They do not guarantee income, savings, demand, or commercial success.",
    error: "The evidence could not be evaluated. Review the selections and try again.",
    verdicts: ["Not ready", "Assignment ready", "Conditional pilot", "Commercial pilot ready", "Commercial go"],
    recipes: [
      ["Group-buy operations", "Validated orders, verified payments, private fulfillment records."],
      ["Authorized IT monitoring", "Scoped health checks, evidence reports, bounded alerts."],
      ["SEO foundation sprint", "One approved domain, up to 20 URLs, three priority pages, and no ranking promises."],
      ["Manufacturing exception watch", "Read-only imports, explainable thresholds, planner review."],
      ["Community event desk", "Registration queues, approvals, idempotent notifications."],
      ["Private household records", "Single-tenant records and owner-reviewed categorization only."]
    ]
  },
  "zh-TW": {
    nav: "專案設定",
    eyebrow: "專案啟動台",
    title: "先把專案設定清楚，再證明它真的能營運。",
    description: "從已稽核的配方開始，只勾選現在能提出證據的項目，再依優先順序排除阻擋。本預覽不保存客戶紀錄，也不觸發任何外部動作。",
    choose: "1 / 選擇專案配方",
    evidence: "2 / 填寫目前證據",
    evidenceHelp: "請選今天已能證明的狀態，不是未來打算完成的狀態。",
    workflow: "核心流程",
    workflowOptions: ["只有 Mock 或畫面", "部分可運作", "端到端已驗證"],
    data: "資料保護",
    dataOptions: ["尚未驗證", "已驗證登入與隔離"],
    operations: "寫入與重試",
    operationOptions: ["沒有證據", "已做冪等", "重試與死信皆驗證"],
    payment: "金流證據",
    paymentOptions: ["本範圍不收款", "清楚標示為 Mock", "供應商簽章已驗證"],
    verification: "自動驗證",
    verificationOptions: ["沒有", "本機測試通過", "型別、測試、建置與 CI 完整"],
    deployment: "部署證據",
    deploymentOptions: ["只有本機", "公開 Demo", "正式環境已驗證"],
    market: "買方證據",
    marketOptions: ["只有想法", "已有買方興趣", "完成一次付費試行", "可重複付費交付"],
    evaluate: "執行就緒度檢查",
    evaluating: "正在檢查證據…",
    apply: "把這個配方帶入免費健檢",
    preview: "僅供預覽",
    previewNotice: "這裡不會付款、部署、寄信或修改外部系統。",
    plan: "啟動計畫",
    planSteps: ["核准最小輸入與隱私邊界。", "設定一個固定流程與免費優先部署路徑。", "使用合成資料通過配方驗證。", "正式交付前留下所有必要核准紀錄。"],
    checks: "項驗證",
    approvals: "項必要核准",
    blocks: "項禁止動作",
    assignment: "作業執行率",
    commercial: "商用交付率",
    marketScore: "商機情境",
    monetization: "變現就緒度",
    priorities: "改善佇列",
    noFindings: "這個優先級目前沒有問題。",
    disclaimer: "分數是依證據推估的情境，不保證收入、節省、需求或商業成功。",
    error: "無法評估目前證據，請檢查選項後再試一次。",
    verdicts: ["尚未就緒", "作業可執行", "可條件式試行", "商用試行就緒", "可進入商用"],
    recipes: [
      ["團購營運", "驗證訂單、簽章金流與私密出貨紀錄。"],
      ["授權 IT 監控", "限定範圍的健檢、證據報告與受控告警。"],
      ["SEO 基礎改善衝刺", "一個已核准網域、最多 20 個網址、三個優先頁面，且不保證排名。"],
      ["製造異常看板", "唯讀匯入、可解釋門檻與人員覆核。"],
      ["社群活動櫃台", "報名佇列、核准與冪等通知。"],
      ["私人家計紀錄", "只限單一家庭與屋主覆核的分類。"]
    ]
  },
  ja: {
    nav: "プロジェクト設定",
    eyebrow: "プロジェクト立ち上げデスク",
    title: "設定を固め、運用できることを証明する。",
    description: "レビュー済みレシピを選び、今証明できる事実だけを記録し、優先順に阻害要因を解消します。このプレビューは顧客記録を保存せず、外部操作も行いません。",
    choose: "1 / プロジェクトレシピを選択",
    evidence: "2 / 現在の証拠を記録",
    evidenceHelp: "予定ではなく、今日実証できる状態を選んでください。",
    workflow: "中核ワークフロー",
    workflowOptions: ["Mock または画面のみ", "一部動作", "エンドツーエンド検証済み"],
    data: "データ保護",
    dataOptions: ["未検証", "認証と分離を検証済み"],
    operations: "書き込みと再試行",
    operationOptions: ["証拠なし", "冪等性あり", "再試行とデッドレター検証済み"],
    payment: "決済の証拠",
    paymentOptions: ["対象外", "Mock と明記", "署名済み事業者イベント"],
    verification: "自動検証",
    verificationOptions: ["なし", "ローカルテスト", "型、テスト、ビルド、CI 完了"],
    deployment: "公開の証拠",
    deploymentOptions: ["ローカルのみ", "公開デモ", "本番検証済み"],
    market: "購入者の証拠",
    marketOptions: ["アイデアのみ", "購入意向あり", "有料試行 1 件", "反復可能な有料提供"],
    evaluate: "準備度を確認",
    evaluating: "証拠を確認中…",
    apply: "このレシピを無料診断に適用",
    preview: "プレビューのみ",
    previewNotice: "決済、公開、送信、外部システム変更は行いません。",
    plan: "立ち上げ計画",
    planSteps: ["最小入力とプライバシー境界を承認する。", "固定範囲のフローと無料優先の公開経路を設定する。", "合成データで検証項目を通過する。", "本番提供前に必要な承認を記録する。"],
    checks: "件の検証",
    approvals: "件の承認",
    blocks: "件の禁止操作",
    assignment: "課題実行率",
    commercial: "商用提供率",
    marketScore: "市場シナリオ",
    monetization: "収益化準備度",
    priorities: "改善キュー",
    noFindings: "この優先度の問題はありません。",
    disclaimer: "スコアは証拠に基づくシナリオであり、収益、節約、需要、成功を保証しません。",
    error: "証拠を評価できませんでした。選択内容を確認してください。",
    verdicts: ["未準備", "課題として実行可能", "条件付き試行", "商用試行可能", "商用開始可能"],
    recipes: [
      ["共同購入運用", "検証済み注文、署名決済、非公開の出荷記録。"],
      ["認可済み IT 監視", "範囲限定チェック、証拠レポート、制御された通知。"],
      ["SEO基盤改善スプリント", "承認済み1ドメイン、最大20 URL、優先3ページ。順位は保証しません。"],
      ["製造例外ウォッチ", "読み取り専用取込、説明可能な閾値、人の確認。"],
      ["コミュニティ受付", "登録キュー、承認、冪等な通知。"],
      ["個人家計記録", "単一家計と所有者確認の分類のみ。"]
    ]
  },
  es: {
    nav: "Configurar proyecto",
    eyebrow: "Mesa de puesta en marcha",
    title: "Configura el proyecto. Demuestra que puede operar.",
    description: "Empieza con una receta revisada, registra solo pruebas demostrables y elimina bloqueos por prioridad. La vista previa no guarda registros de clientes ni ejecuta acciones externas.",
    choose: "1 / Elige una receta",
    evidence: "2 / Registra la evidencia actual",
    evidenceHelp: "Elige lo que puedes demostrar hoy, no lo que planeas hacer.",
    workflow: "Flujo principal",
    workflowOptions: ["Solo Mock o pantallas", "Funciona parcialmente", "Verificado de extremo a extremo"],
    data: "Protección de datos",
    dataOptions: ["Sin verificar", "Autenticación y aislamiento verificados"],
    operations: "Escrituras y reintentos",
    operationOptions: ["Sin evidencia", "Idempotente", "Reintento y cola fallida verificados"],
    payment: "Evidencia de pago",
    paymentOptions: ["Sin pagos en este alcance", "Mock claramente indicado", "Eventos firmados del proveedor"],
    verification: "Verificación automática",
    verificationOptions: ["Ninguna", "Pruebas locales", "Tipos, pruebas, compilación y CI"],
    deployment: "Evidencia de despliegue",
    deploymentOptions: ["Solo local", "Demo pública", "Producción verificada"],
    market: "Evidencia del comprador",
    marketOptions: ["Solo idea", "Interés de compradores", "Un piloto pagado", "Entrega pagada repetible"],
    evaluate: "Comprobar preparación",
    evaluating: "Comprobando evidencia…",
    apply: "Usar esta receta en el diagnóstico",
    preview: "SOLO VISTA PREVIA",
    previewNotice: "Aquí no se paga, publica, envía ni modifica ningún sistema externo.",
    plan: "Plan de puesta en marcha",
    planSteps: ["Aprueba la entrada mínima y el límite de privacidad.", "Configura un flujo fijo y una ruta de despliegue gratuita.", "Supera las verificaciones con datos sintéticos.", "Registra todas las aprobaciones antes de producción."],
    checks: "verificaciones",
    approvals: "aprobaciones necesarias",
    blocks: "acciones prohibidas",
    assignment: "Ejecución de la tarea",
    commercial: "Entrega comercial",
    marketScore: "Escenario de mercado",
    monetization: "Preparación para monetizar",
    priorities: "Cola de mejoras",
    noFindings: "No hay hallazgos con esta prioridad.",
    disclaimer: "Las puntuaciones son escenarios basados en evidencia; no garantizan ingresos, ahorro, demanda ni éxito.",
    error: "No se pudo evaluar la evidencia. Revisa las selecciones e inténtalo de nuevo.",
    verdicts: ["No preparado", "Tarea ejecutable", "Piloto condicionado", "Piloto comercial listo", "Apto para uso comercial"],
    recipes: [
      ["Operaciones de compra grupal", "Pedidos validados, pagos verificados y datos privados de entrega."],
      ["Monitoreo IT autorizado", "Revisiones acotadas, informes probatorios y alertas controladas."],
      ["Sprint de base SEO", "Un dominio aprobado, hasta 20 URL, tres páginas prioritarias y sin promesas de posición."],
      ["Alertas de fabricación", "Importación de solo lectura, umbrales explicables y revisión humana."],
      ["Mesa de eventos comunitarios", "Colas de registro, aprobaciones y avisos idempotentes."],
      ["Registros privados del hogar", "Solo un hogar y clasificación revisada por su propietario."]
    ]
  }
} as const;

const recipeWrites: Record<ProjectRecipeId, boolean> = {
  "commerce-groupbuy": true,
  "professional-it-monitoring": true,
  "professional-seo-foundation": false,
  "backoffice-manufacturing-watch": false,
  "appointments-community-events": true,
  "household-finance-private": true
};

function buildEvidence(recipeId: ProjectRecipeId, state: OptimizerState): ProjectReadinessInput {
  const hasWrites = recipeWrites[recipeId];
  const hasRetryableOperations = hasWrites;
  const paymentMode = state.payment === "verified" ? "live" : state.payment === "mock" ? "mock" : "none";
  const needsIdempotency = hasWrites || hasRetryableOperations || paymentMode === "live";
  const marketDemandEvidence = state.market === "idea" ? "none" : state.market === "interest" ? "observed" : "verified";
  const revenueEvidence = state.market === "paid" ? "paid_once" : state.market === "repeatable" ? "repeatable_paid" : state.market === "interest" ? "interest" : "none";

  return {
    demoAccess: state.deployment === "local" ? "local" : "public",
    coreWorkflowEvidence: state.workflow === "mock" ? "mocked" : state.workflow === "working" ? "partial" : "end_to_end",
    persistence: state.data === "protected" ? "durable" : state.workflow === "mock" ? "none" : "browser_only",
    tenancyModel: "single_tenant",
    tenantIsolation: "not_applicable",
    authRbac: state.data === "protected" ? "verified" : "absent",
    hasExternalWrites: hasWrites,
    hasRetryableOperations,
    idempotency: needsIdempotency ? (state.operations === "missing" ? "absent" : state.operations === "idempotent" ? "partial" : "verified") : "not_applicable",
    paymentMode,
    paymentSignature: paymentMode === "live" ? "verified" : paymentMode === "mock" ? "mock_only" : "not_applicable",
    retryDeadLetter: hasRetryableOperations ? (state.operations === "resilient" ? "retry_and_dead_letter" : state.operations === "idempotent" ? "retry_only" : "absent") : "not_applicable",
    ciTests: state.verification === "none" ? "none" : state.verification === "tests" ? "tests_only" : "ci_full",
    deployment: state.deployment === "local" ? "local" : state.deployment === "demo" ? "public_demo" : "production",
    piiExposure: state.data === "protected" ? "none" : "potential",
    mockOnly: state.workflow === "mock",
    mockPresentedAsReal: false,
    documentation: state.verification === "full" ? "verified" : state.verification === "tests" ? "observed" : "claimed",
    openSourceLicense: true,
    revenueEvidence,
    marketDemandEvidence,
    problemSeverity: "high",
    buyerClarity: state.market === "idea" ? "broad" : "specific",
    pricingEvidence: state.market === "repeatable" ? "verified" : state.market === "paid" ? "observed" : state.market === "interest" ? "claimed" : "none"
  };
}

const verdictOrder = ["not_ready", "assignment_ready", "conditional_pilot", "commercial_pilot_ready", "commercial_go"] as const;

export function ProjectSetupOptimizer({ locale }: { locale: Locale }) {
  const [recipeId, setRecipeId] = useState<ProjectRecipeId>("professional-seo-foundation");
  const [state, setState] = useState<OptimizerState>(initialState);
  const [result, setResult] = useState<PreviewResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const c = copy[locale];
  const recipe = projectRecipes[recipeId];
  const recipeIndex = projectRecipeIds.indexOf(recipeId);
  const recipeLabel = c.recipes[recipeIndex];
  const counts = useMemo(() => ({
    checks: recipe.verificationChecks.length,
    approvals: recipe.requiredApprovals.length,
    blocks: recipe.prohibitedActions.length
  }), [recipe]);

  function update<K extends keyof OptimizerState>(key: K, value: OptimizerState[K]) {
    setState((current) => ({ ...current, [key]: value }));
    setResult(null);
    setError("");
  }

  async function evaluate() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/project-readiness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId, evidence: buildEvidence(recipeId, state) })
      });
      if (!response.ok) throw new Error("readiness request failed");
      setResult(await response.json() as PreviewResult);
    } catch {
      setError(c.error);
    } finally {
      setLoading(false);
    }
  }

  function applyRecipe() {
    window.dispatchEvent(new CustomEvent("morning-operator:recipe-selected", {
      detail: { recipeId: recipe.id, packId: recipe.industryPackId, goal: recipe.goals[0] }
    }));
  }

  const verdictIndex = result ? verdictOrder.indexOf(result.assessment.verdict) : 0;

  return (
    <section className="project-optimizer" id="project-setup" aria-labelledby="project-setup-title">
      <div className="section-intro optimizer-intro">
        <p className="eyebrow">{c.eyebrow}</p>
        <h2 id="project-setup-title">{c.title}</h2>
        <p>{c.description}</p>
      </div>

      <div className="commissioning-board">
        <div className="recipe-rail">
          <h3>{c.choose}</h3>
          {projectRecipeIds.map((id, index) => (
            <button
              aria-pressed={recipeId === id}
              className="recipe-tab"
              key={id}
              onClick={() => { setRecipeId(id); setResult(null); setError(""); }}
              type="button"
            >
              <span>RCP-{String(index + 1).padStart(2, "0")}</span>
              <strong>{c.recipes[index][0]}</strong>
              <small>{c.recipes[index][1]}</small>
            </button>
          ))}
        </div>

        <div className="proof-console">
          <div className="proof-heading">
            <div><h3>{c.evidence}</h3><p>{c.evidenceHelp}</p></div>
            <span className="preview-seal">{c.preview}</span>
          </div>
          <div className="proof-grid">
            <label>{c.workflow}<select value={state.workflow} onChange={(event) => update("workflow", event.target.value as WorkflowProof)}><option value="mock">{c.workflowOptions[0]}</option><option value="working">{c.workflowOptions[1]}</option><option value="end_to_end">{c.workflowOptions[2]}</option></select></label>
            <label>{c.data}<select value={state.data} onChange={(event) => update("data", event.target.value as DataProof)}><option value="unverified">{c.dataOptions[0]}</option><option value="protected">{c.dataOptions[1]}</option></select></label>
            <label>{c.operations}<select value={state.operations} onChange={(event) => update("operations", event.target.value as OperationProof)}><option value="missing">{c.operationOptions[0]}</option><option value="idempotent">{c.operationOptions[1]}</option><option value="resilient">{c.operationOptions[2]}</option></select></label>
            <label>{c.payment}<select value={state.payment} onChange={(event) => update("payment", event.target.value as PaymentProof)}><option value="none">{c.paymentOptions[0]}</option><option value="mock">{c.paymentOptions[1]}</option><option value="verified">{c.paymentOptions[2]}</option></select></label>
            <label>{c.verification}<select value={state.verification} onChange={(event) => update("verification", event.target.value as VerificationProof)}><option value="none">{c.verificationOptions[0]}</option><option value="tests">{c.verificationOptions[1]}</option><option value="full">{c.verificationOptions[2]}</option></select></label>
            <label>{c.deployment}<select value={state.deployment} onChange={(event) => update("deployment", event.target.value as DeploymentProof)}><option value="local">{c.deploymentOptions[0]}</option><option value="demo">{c.deploymentOptions[1]}</option><option value="production">{c.deploymentOptions[2]}</option></select></label>
            <label className="wide">{c.market}<select value={state.market} onChange={(event) => update("market", event.target.value as MarketProof)}><option value="idea">{c.marketOptions[0]}</option><option value="interest">{c.marketOptions[1]}</option><option value="paid">{c.marketOptions[2]}</option><option value="repeatable">{c.marketOptions[3]}</option></select></label>
          </div>
          <p className="preview-notice">{c.previewNotice}</p>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button primary" disabled={loading} onClick={evaluate} type="button">{loading ? c.evaluating : c.evaluate}</button>
        </div>
      </div>

      <div className="commissioning-plan" aria-live="polite">
        <div className="plan-copy">
          <span className="ledger-index">{recipeLabel[0]} / v{recipe.version}</span>
          <h3>{c.plan}</h3>
          <ol>{c.planSteps.map((step) => <li key={step}>{step}</li>)}</ol>
        </div>
        <div className="recipe-counters">
          <span><strong>{counts.checks}</strong>{c.checks}</span>
          <span><strong>{counts.approvals}</strong>{c.approvals}</span>
          <span><strong>{counts.blocks}</strong>{c.blocks}</span>
        </div>
      </div>

      {result && (
        <div className="readiness-result">
          <div className="readiness-head">
            <div><span>{c.preview}</span><h3>{c.verdicts[verdictIndex]}</h3></div>
            <a className="button primary" href="#audit" onClick={applyRecipe}>{c.apply}</a>
          </div>
          <div className="readiness-scores">
            <Score label={c.assignment} value={result.assessment.assignmentExecutionPercent} suffix="%" />
            <Score label={c.commercial} value={result.assessment.commercialDeliveryPercent} suffix="%" />
            <Score label={c.marketScore} value={result.assessment.marketPotentialScore} suffix="/10" />
            <Score label={c.monetization} value={result.assessment.monetizationReadinessScore} suffix="/10" />
          </div>
          <div className="priority-board">
            <h4>{c.priorities}</h4>
            {(["P0", "P1", "P2"] as const).map((priority) => (
              <section className={`priority-column ${priority.toLowerCase()}`} key={priority}>
                <strong>{priority}</strong>
                {result.assessment.findings[priority].length
                  ? result.assessment.findings[priority].map((finding) => <div key={finding.code}><code>{finding.code}</code><p>{finding.recommendation}</p></div>)
                  : <p>{c.noFindings}</p>}
              </section>
            ))}
          </div>
          <p className="readiness-disclaimer">{c.disclaimer}</p>
        </div>
      )}
    </section>
  );
}

function Score({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  return <div><span>{label}</span><strong>{value}<small>{suffix}</small></strong><i style={{ "--score": `${Math.min(100, suffix === "%" ? value : value * 10)}%` } as CSSProperties} /></div>;
}
