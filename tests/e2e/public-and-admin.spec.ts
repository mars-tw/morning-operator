import { test, expect, type Page } from "@playwright/test";

async function drainWorkers(page: Page) {
  const response = await page.evaluate(async () => {
    const result = await fetch("/api/admin/worker/drain", { method: "POST" });
    return { ok: result.ok, status: result.status, body: await result.text() };
  });
  expect(response.ok, `worker drain ${response.status}: ${response.body}`).toBe(true);
}

test("root negotiates English and every public locale is addressable", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
  const expectations = { en: "Morning Operator", "zh-TW": "早安店長", ja: "おはよう店長", es: "Gerente de la Mañana" };
  for (const [locale, brand] of Object.entries(expectations)) {
    await page.goto(`/${locale}`);
    await expect(page.locator("main")).toHaveAttribute("lang", /.+/);
    await expect(page.getByRole("link", { name: brand, exact: true })).toBeVisible();
    await expect(page.getByText(/demo|示範|デモ/i).first()).toBeVisible();
  }
});

test("website launch planner is localized and routes dynamic work to Workers", async ({ page }) => {
  const headings = {
    en: "Build the sales page first. Choose infrastructure second.",
    "zh-TW": "先把銷售頁做好，再選最小可用的主機。",
    ja: "まず販売ページを作り、次に最小限の基盤を選びます。",
    es: "Primero crea la página de ventas. Después elige la infraestructura mínima."
  };
  for (const [locale, heading] of Object.entries(headings)) {
    await page.goto(`/${locale}`);
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  }

  await page.goto("/en");
  await page.getByLabel("Booking or server-backed site").check();
  await expect(page.locator(".route-ticket")).toContainText("Cloudflare Workers");
  await page.getByRole("link", { name: "Request this website" }).click();
  await expect(page.locator('select[name="automationGoal"]')).toHaveValue("website_launch");
  await expect(page.locator('select[name="siteType"]')).toHaveValue("service_booking");
  await expect(page.locator('select[name="deploymentTarget"]')).toHaveValue("cloudflare_workers");
});

test("language switcher keeps the public page keyboard-addressable", async ({ page }) => {
  await page.goto("/en");
  await page.getByRole("link", { name: "日本語", exact: true }).click();
  await expect(page).toHaveURL(/\/ja$/);
  await expect(page.getByRole("heading", { name: "反復業務を測り、安全な部分を自動化。" })).toBeVisible();
});

test("localized public intake returns a concrete result", async ({ page }) => {
  await page.goto("/en");
  await page.getByRole("link", { name: "Start the free 3-minute audit" }).click();
  await page.locator('input[name="brandName"]').fill("Browser Test Store");
  await page.locator('input[name="email"]').fill("browser@example.com");
  await page.locator('input[name="storeUrl"]').fill("https://browser.example.com");
  await page.locator('input[name="privacyConsent"]').check();
  await page.getByRole("button", { name: "Calculate my estimate" }).click();
  await expect(page.getByText("Audit complete")).toBeVisible();
  await expect(page.getByText("Next, review the anonymized demo before granting any read-only access.")).toBeVisible();
  await expect(page.getByText("Potentially reducible range")).toBeVisible();
  await expect(page.locator(".estimate-grid")).toContainText("Setup payback after monthly fee");
});

test("industry blueprints are visible and restricted work cannot enter automatic checkout", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator(".pack-card")).toHaveCount(6);
  await page.getByRole("link", { name: "Start the free 3-minute audit" }).click();
  await page.locator('input[name="brandName"]').fill("Restricted Browser Test");
  await page.locator('input[name="email"]').fill("restricted@example.com");
  await page.locator('select[name="industry"]').selectOption("regulated");
  await page.locator('select[name="requestedScope"]').selectOption("autonomous_external_action");
  await page.locator('input[name="privacyConsent"]').check();
  await page.getByRole("button", { name: "Calculate my estimate" }).click();
  await expect(page.getByText("Restricted automation")).toBeVisible();
  await expect(page.getByText("This request needs specialist review and cannot enter the automatic build path.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Book a 20-minute fit call" })).toHaveCount(0);
});

test("localized page has no horizontal overflow on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/es");
  const sizes = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport + 1);
  await expect(page.getByRole("heading", { name: "Mide el trabajo repetitivo. Automatiza las partes seguras." })).toBeVisible();
});

test("owner can sign in to the operations dashboard", async ({ page }) => {
  await page.goto("/admin/login");
  await page.locator('input[name="password"]').fill(process.env.ADMIN_PASSWORD!);
  await page.getByRole("button", { name: "進入總部" }).click();
  await expect(page.getByRole("heading", { name: "今天要處理什麼" })).toBeVisible();
});

test("owner approval gates payment, build, QA, and delivery", async ({ page }) => {
  test.slow();
  const brand = `批准流程 ${Date.now()}`;
  const intake = await page.request.post("/api/intake", { data: {
    locale: "en", brandName: brand, email: `approval-${Date.now()}@example.com`, storeUrl: "https://approval.example.com",
    industry: "lifestyle", usesShopify: true, monthlyOrders: "100_500", teamSize: "2_5",
    dailyMinutes: 45, weeklyReportMinutes: 90, biggestProblem: "scattered_numbers",
    requestedScope: "read_only_report", implementationTiming: "within_30_days",
    privacyConsent: true, marketingConsent: false, companyNote: "browser approval fixture"
  } });
  expect(intake.ok()).toBe(true);

  await page.goto("/admin/login");
  await page.locator('input[name="password"]').fill(process.env.ADMIN_PASSWORD!);
  await page.getByRole("button", { name: "進入總部" }).click();
  const leadRow = page.locator("tbody tr").filter({ hasText: brand }).first();
  await leadRow.getByRole("button", { name: "模擬付款" }).click();
  await drainWorkers(page);
  await page.goto("/admin");

  for (let index = 0; index < 4; index += 1) {
    const scopeCard = page.locator(".approval-card").filter({ hasText: brand }).first();
    await expect(scopeCard).toBeVisible();
    await scopeCard.getByRole("button", { name: "批准並繼續" }).click();
  }
  await drainWorkers(page);
  await page.goto("/admin");

  const deploymentCard = page.locator(".approval-card").filter({ hasText: brand });
  await deploymentCard.getByRole("button", { name: "批准並繼續" }).click();
  await expect(page.locator("tbody tr").filter({ hasText: brand }).getByText("已交付")).toBeVisible();
});
