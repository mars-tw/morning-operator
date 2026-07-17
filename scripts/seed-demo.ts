import { getDb } from "../src/lib/db";
import { createLead } from "../src/lib/repository";

if ((getDb().prepare("SELECT COUNT(*) AS count FROM leads").get() as { count: number }).count === 0) {
  const leads = [
    { brandName: "島嶼日常商店", email: "owner@example.com", storeUrl: "https://island-demo.example", industry: "lifestyle" as const, monthlyOrders: "100_500" as const, teamSize: "2_5" as const, dailyMinutes: 45, weeklyReportMinutes: 90, biggestProblem: "scattered_numbers" as const, implementationTiming: "within_30_days" as const },
    { brandName: "山路食品", email: "ops@example.com", storeUrl: "https://mountain-demo.example", industry: "food" as const, monthlyOrders: "501_1500" as const, teamSize: "2_5" as const, dailyMinutes: 80, weeklyReportMinutes: 120, biggestProblem: "overdue" as const, implementationTiming: "within_30_days" as const },
    { brandName: "剛起步選物", email: "hello@example.com", storeUrl: "https://starter-demo.example", industry: "lifestyle" as const, monthlyOrders: "under_100" as const, teamSize: "1" as const, dailyMinutes: 10, weeklyReportMinutes: 20, biggestProblem: "low_stock" as const, implementationTiming: "researching" as const }
  ];
  for (const lead of leads) createLead({
    ...lead,
    locale: "zh-TW",
    industryPack: "commerce_ops",
    primaryPlatform: "shopify",
    automationGoal: "operations_alerts",
    usesShopify: true,
    usesCurrentPlatform: true,
    requestedScope: "read_only_report",
    hourlyCostMinor: 2_500,
    privacyConsent: true,
    marketingConsent: false,
    companyNote: "匿名示範資料"
  });
  process.stdout.write(`Seeded ${leads.length} demo leads.\n`);
} else {
  process.stdout.write("Demo data already exists; no rows added.\n");
}
