export default function AdminLoginPage() {
  return <main className="login-shell"><form className="login-card" method="post" action="/api/admin/login"><p className="eyebrow">負責人專用</p><h1>營運總部</h1><p>收入、批准與例外都在這裡；沒有你的批准，系統不會正式部署。</p><label>管理密碼<input type="password" name="password" autoComplete="current-password" required autoFocus /></label><button className="button primary">進入總部</button></form></main>;
}

