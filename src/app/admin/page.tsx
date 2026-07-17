import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/admin-auth";
import { getDashboardData } from "@/lib/repository";
import { formatMinorMoney, getPublicOffer } from "@/lib/public-config";

export const dynamic = "force-dynamic";

const labels: Record<string, string> = {
  paid: "已付款", spec_draft: "規格草稿", spec_approval: "規格待批",
  build_queued: "排隊建置", building: "AI 建置中", qa_failed: "QA 失敗",
  qa_passed: "QA 通過", deploy_approval: "部署待批", delivered: "已交付",
  pending: "排隊", running: "執行中", retry: "等待重試", succeeded: "完成", dead: "人工處理"
};

function operatorClock(timeZone: string): string {
  try {
    return `${new Date().toLocaleString("zh-TW", { timeZone })} · ${timeZone}`;
  } catch {
    return `${new Date().toLocaleString("zh-TW", { timeZone: "UTC" })} · UTC`;
  }
}

export default async function AdminPage() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!verifyAdminSession(token)) redirect("/admin/login");
  const data = getDashboardData();
  const operatorTimeZone = process.env.OPERATOR_TIME_ZONE || "UTC";
  const offer = getPublicOffer("zh-TW");
  const revenue = data.revenueByCurrency.length
    ? data.revenueByCurrency.map((item) => formatMinorMoney(item.amount_minor, item.currency, "zh-TW")).join(" · ")
    : "—";
  const metrics = [
    ["累計收款", revenue], ["全部名單", data.metrics.leads], ["合格名單", data.metrics.qualified],
    ["進行專案", data.metrics.projects], ["等待批准", data.metrics.pending_approvals], ["人工處理", data.metrics.dead_jobs]
  ];

  return <main className="admin-shell">
    <nav className="admin-nav"><a className="wordmark" href="/admin">早安店長｜營運總部</a><form method="post" action="/api/admin/logout"><button>安全登出</button></form></nav>
    <div className="admin-content">
      <header className="admin-heading"><div><p className="eyebrow">只看錢、決策、例外</p><h1>今天要處理什麼</h1></div><p className="utility">{operatorClock(operatorTimeZone)}</p></header>
      <section className="metric-grid">{metrics.map(([label, value], index) => <article className={`metric-card ${index >= 4 && Number(value) > 0 ? "alert" : ""}`} key={String(label)}><span>{label}</span><strong>{value}</strong></article>)}</section>

      <section className="admin-section"><h2>需要你批准</h2>
        {data.approvals.length ? <div className="approval-list">{data.approvals.map((approval) => {
          const item = approval as { id: string; project_name: string; kind: string; summary: string; created_at: string };
          const approvalLabel = item.kind === "specification"
            ? "鎖定交付規格"
            : item.kind === "deployment"
              ? "批准正式交付"
              : `核准流程邊界｜${item.kind.replace("pack:", "")}`;
          return <article className="approval-card" key={item.id}><p className="eyebrow">{approvalLabel}</p><h3>{item.project_name}</h3><pre>{item.summary}</pre><p className="utility">建立於 {item.created_at}</p><div className="approval-actions">
            <form method="post" action={`/api/admin/approvals/${item.id}`}><input type="hidden" name="decision" value="approved" /><input type="hidden" name="note" value="負責人於營運總部批准" /><button className="button primary">批准並繼續</button></form>
            <form method="post" action={`/api/admin/approvals/${item.id}`}><input type="hidden" name="decision" value="rejected" /><input type="hidden" name="note" value="負責人退回修改" /><button className="button danger">退回修改</button></form>
          </div></article>;
        })}</div> : <p className="empty-state">目前沒有需要批准的事項。系統會繼續處理已授權工作。</p>}
      </section>

      <section className="admin-section"><h2>名單與收款</h2><div className="data-scroll"><table className="data-table"><thead><tr><th>品牌</th><th>語系</th><th>分數</th><th>估算工時</th><th>狀態</th><th>本機驗收</th></tr></thead><tbody>{data.leads.map((lead) => <tr key={lead.id}><td><strong>{lead.brand_name}</strong><br/><small>{lead.email}</small></td><td>{lead.locale}</td><td>{lead.score}/100</td><td>{lead.estimated_monthly_hours} h/月</td><td><span className="pill">{lead.status}</span></td><td>{lead.status !== "customer" ? <form className="inline-form" method="post" action="/api/webhooks/payments/mock"><input type="hidden" name="leadId" value={lead.id}/><input type="hidden" name="currency" value={offer.currency}/><input name="amountMinor" type="number" defaultValue={offer.setupMinor} min="1"/><button>模擬付款</button></form> : "已付款"}</td></tr>)}</tbody></table></div></section>

      <section className="admin-section"><h2>專案</h2><div className="data-scroll"><table className="data-table"><thead><tr><th>專案</th><th>狀態</th><th>建立時間</th><th>產物</th></tr></thead><tbody>{data.projects.map((project) => { const item = project as { id: string; name: string; state: string; created_at: string; build_artifact_path?: string }; return <tr key={item.id}><td>{item.name}<br/><small>{item.id.slice(0,8)}</small></td><td><span className="pill">{labels[item.state] || item.state}</span></td><td>{item.created_at}</td><td>{item.build_artifact_path || "—"}</td></tr>; })}</tbody></table></div></section>

      <section className="admin-section"><h2>自動工作</h2><div className="data-scroll"><table className="data-table"><thead><tr><th>工作</th><th>狀態</th><th>嘗試</th><th>最後錯誤</th></tr></thead><tbody>{data.jobs.map((job) => <tr key={job.id}><td>{job.type}<br/><small>{job.id.slice(0,8)}</small></td><td><span className={`pill ${job.status}`}>{labels[job.status] || job.status}</span></td><td>{job.attempts}/{job.max_attempts}</td><td>{job.last_error || "—"}</td></tr>)}</tbody></table></div></section>
    </div>
  </main>;
}
