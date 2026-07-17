import { hasSecretConfiguration } from "@/lib/secrets";

export type PaymentProviderId = "mock" | "lemon_squeezy" | "ecpay" | "newebpay" | "tappay" | "line_pay";
export type PaymentIntegrationState = "development_only" | "implemented" | "documented_only";

export type PaymentProviderDefinition = {
  id: PaymentProviderId;
  name: string;
  market: "local" | "global" | "taiwan";
  state: PaymentIntegrationState;
  requiredEnvironment: readonly string[];
  confirmationRule: string;
  officialDocumentation: string;
};

export const paymentProviders = [
  {
    id: "mock",
    name: "開發用模擬付款",
    market: "local",
    state: "development_only",
    requiredEnvironment: ["ADMIN_SESSION_SECRET"],
    confirmationRule: "僅限非正式環境且必須有管理員登入",
    officialDocumentation: "/docs/payment-webhooks.md"
  },
  {
    id: "lemon_squeezy",
    name: "Lemon Squeezy",
    market: "global",
    state: "implemented",
    requiredEnvironment: ["NEXT_PUBLIC_CHECKOUT_URL", "LEMON_SQUEEZY_WEBHOOK_SECRET"],
    confirmationRule: "原始 request body 的 HMAC SHA-256 簽章與固定報價完全相符",
    officialDocumentation: "https://docs.lemonsqueezy.com/help/webhooks"
  },
  {
    id: "ecpay",
    name: "綠界 ECPay AIO",
    market: "taiwan",
    state: "implemented",
    requiredEnvironment: ["AUTOPILOT_BASE_URL", "NEXT_PUBLIC_CHECKOUT_URL", "ECPAY_ENVIRONMENT", "ECPAY_MERCHANT_ID", "ECPAY_HASH_KEY", "ECPAY_HASH_IV"],
    confirmationRule: "CheckMacValue、MerchantID、RtnCode、金額、幣別與本機 lead 對應全部相符",
    officialDocumentation: "https://developers.ecpay.com.tw/2864/"
  },
  {
    id: "newebpay",
    name: "藍新 NewebPay MPG",
    market: "taiwan",
    state: "documented_only",
    requiredEnvironment: [],
    confirmationRule: "TradeSha 驗證、TradeInfo 解密、商戶訂單對應與交易反查完成後才能入帳",
    officialDocumentation: "https://cwww.newebpay.com/website/Page/content/download_api"
  },
  {
    id: "tappay",
    name: "TapPay",
    market: "taiwan",
    state: "documented_only",
    requiredEnvironment: [],
    confirmationRule: "後端通知後以 Record API 反查 rec_trade_id，不信任前端 redirect",
    officialDocumentation: "https://docs.tappaysdk.com/tutorial/zh/back.html"
  },
  {
    id: "line_pay",
    name: "LINE Pay Taiwan",
    market: "taiwan",
    state: "documented_only",
    requiredEnvironment: [],
    confirmationRule: "reserve 後由伺服器 confirm，returnCode、訂單、金額與幣別相符才入帳",
    officialDocumentation: "https://pay.line.me/tw/developers/apis/onlineApis"
  }
] as const satisfies readonly PaymentProviderDefinition[];

export function getPaymentProviderStatuses(
  environment: Readonly<Record<string, string | undefined>> = process.env
) {
  const secretKeys = new Set(["LEMON_SQUEEZY_WEBHOOK_SECRET", "ECPAY_MERCHANT_ID", "ECPAY_HASH_KEY", "ECPAY_HASH_IV"]);
  return paymentProviders.map((provider) => {
    const configured = provider.state === "documented_only"
      ? false
      : provider.id === "mock"
        ? environment.NODE_ENV !== "production"
        : provider.requiredEnvironment.every((key) => secretKeys.has(key)
          ? hasSecretConfiguration(key, environment)
          : Boolean(environment[key]?.trim()));
    return { ...provider, configured };
  });
}
