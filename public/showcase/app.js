"use strict";

const localeIds = ["en", "zh-TW", "ja", "es"];
const projectIds = ["web-studio", "appointment", "creator-kit", "groupbuy-board"];

const uiCopy = {
  en: {
    "access.skip": "Skip to projects",
    "preview.badge": "OPEN-SOURCE PREVIEW",
    "preview.notice": "Synthetic data only. No payment, booking, message, account, or personal data is created here.",
    "hero.kicker": "A project sample wall for people who build",
    "hero.title": "Study the plan.\nTouch the prototype.\nRemix the source.",
    "hero.description": "Four small, fixed-scope concepts plus a core SEO growth lab show what can be previewed before anyone connects a domain, customer record, payment provider, or production system.",
    "hero.primary": "Explore four plans",
    "hero.source": "View source on GitHub",
    "hero.ruleOneLabel": "Data",
    "hero.ruleOne": "Synthetic only",
    "hero.ruleTwoLabel": "Actions",
    "hero.ruleTwo": "Local simulation",
    "hero.ruleThreeLabel": "License",
    "projects.kicker": "Four viable starting points",
    "projects.title": "Choose a project card",
    "projects.description": "Each card has one audience, one job, a bounded deliverable, a free preview path, and clear human gates.",
    "workbench.kicker": "Live sample bench",
    "workbench.title": "A prototype beside its operating plan",
    "workbench.key": "Local simulation — no external action",
    "workbench.status": "PREVIEW",
    "workbench.disclaimer": "This interaction changes only the pixels on this page. Nothing is submitted, saved, booked, purchased, or sent.",
    "plan.version": "VERSION 1",
    "plan.kicker": "Execution blueprint",
    "plan.audience": "Audience",
    "plan.job": "Single job",
    "plan.host": "Free preview host",
    "plan.duration": "Prototype window",
    "plan.coverage": "Automation scenario",
    "plan.deliverables": "Fixed deliverables",
    "plan.gates": "Human gates",
    "plan.scenario": "Monetization scenario",
    "plan.noGuarantee": "Scenario only; income, demand, savings, and success are not guaranteed.",
    "plan.download": "Download this non-PII brief",
    "hosting.kicker": "Free-first publication routes",
    "hosting.title": "Use the preview host for the right job",
    "hosting.description": "This gallery uses GitHub Pages as a code-project showcase. A real business site needs a host whose terms and runtime match the work.",
    "hosting.current": "THIS SHOWCASE",
    "hosting.static": "COMMERCIAL STATIC",
    "hosting.dynamic": "REVIEWED DYNAMIC",
    "hosting.github": "Good for an open-source project showcase with no data collection or transactions. Not for running an online business, e-commerce, or SaaS.",
    "hosting.cloudflare": "A practical free-first route for a reviewed commercial landing page or catalog that uses hosted checkout and no front-end secrets.",
    "hosting.workers": "Use when server-side validation or a small API is required. Secrets, writes, retries, and production deployment still need review.",
    "hosting.official": "Official limits",
    "remix.kicker": "From sample to owned project",
    "remix.title": "Fork the source, replace the synthetic copy, then review every production boundary.",
    "remix.one": "Choose one fixed job and one measurable outcome.",
    "remix.two": "Keep the first preview static and free of personal data.",
    "remix.three": "Add providers only after privacy, payment, and deployment review.",
    "footer.line": "Open source under Apache-2.0. Built as an educational project showcase.",
    "footer.source": "Source and documentation",
    "seo.kicker": "Core service / SEO foundation",
    "seo.title": "Route expertise into useful search pages.",
    "seo.description": "Choose three non-personal categories. The lab returns a synthetic route from search intent to a 90-day measurement experiment.",
    "seo.stamp": "SCENARIO · NOT A SITE AUDIT",
    "seo.business": "Business pattern",
    "seo.goal": "Search goal",
    "seo.market": "Market scope",
    "seo.privacy": "No URL, account, analytics, email, or customer record is requested, fetched, or stored.",
    "seo.intentTitle": "Search intent",
    "seo.mapTitle": "Page map",
    "seo.technicalTitle": "Technical checks",
    "seo.experimentTitle": "Measurement experiment",
    "seo.boundaryTitle": "Human gate",
    "seo.boundary": "The owner verifies expertise, claims, rights, structured data, and every production publication. No ranking, traffic, lead, or revenue outcome is guaranteed.",
    "seo.official": "Read Google Search Central guidance"
  },
  "zh-TW": {
    "access.skip": "跳到專案範例",
    "preview.badge": "開源預覽",
    "preview.notice": "僅使用合成資料；不會建立付款、預約、訊息、帳號或個人資料。",
    "hero.kicker": "給實作者的專案樣品牆",
    "hero.title": "先看計畫。\n再玩原型。\n最後改成自己的。",
    "hero.description": "四個小型固定範圍概念，加上一個主力 SEO 成長實驗室，讓任何人都能在連接網域、客戶紀錄、金流或正式系統以前免費評估。",
    "hero.primary": "查看四種計畫",
    "hero.source": "在 GitHub 查看原始碼",
    "hero.ruleOneLabel": "資料",
    "hero.ruleOne": "僅合成資料",
    "hero.ruleTwoLabel": "動作",
    "hero.ruleTwo": "只在本頁模擬",
    "hero.ruleThreeLabel": "授權",
    "projects.kicker": "四個可行起點",
    "projects.title": "選一張專案卡",
    "projects.description": "每張卡只有一種受眾、一項工作、固定交付物、免費預覽路線及清楚的人工作業閘門。",
    "workbench.kicker": "互動樣品工作台",
    "workbench.title": "原型與營運計畫並排檢查",
    "workbench.key": "本機模擬，不執行外部動作",
    "workbench.status": "預覽",
    "workbench.disclaimer": "互動只改變這一頁的畫面；不會送出、儲存、預約、購買或寄送任何內容。",
    "plan.version": "版本 1",
    "plan.kicker": "執行藍圖",
    "plan.audience": "受眾",
    "plan.job": "單一任務",
    "plan.host": "免費預覽主機",
    "plan.duration": "原型時程",
    "plan.coverage": "自動化情境",
    "plan.deliverables": "固定交付物",
    "plan.gates": "人工閘門",
    "plan.scenario": "變現情境",
    "plan.noGuarantee": "僅為情境；不保證收入、需求、節省或成功。",
    "plan.download": "下載不含個資的專案簡報",
    "hosting.kicker": "免費優先發布路線",
    "hosting.title": "用對預覽主機，才不會用錯服務",
    "hosting.description": "本展示把 GitHub Pages 用於程式專案作品集。真正商業網站仍須選擇條款與 runtime 都適合的主機。",
    "hosting.current": "本展示使用",
    "hosting.static": "商業靜態網站",
    "hosting.dynamic": "經審查的動態網站",
    "hosting.github": "適合不收資料、不做交易的開源專案展示；不可拿來經營線上商業、電商或 SaaS。",
    "hosting.cloudflare": "適合經審查的商業落地頁或型錄；付款導向受信任的託管結帳，前端不得放秘密。",
    "hosting.workers": "需要伺服器驗證或小型 API 時使用；秘密、寫入、重試與正式部署仍須審查。",
    "hosting.official": "官方限制",
    "remix.kicker": "從樣品變成自己的專案",
    "remix.title": "Fork 原始碼、替換合成文案，再逐項審查正式環境邊界。",
    "remix.one": "只選一項固定工作與一個可衡量結果。",
    "remix.two": "第一版維持靜態，完全不放個人資料。",
    "remix.three": "完成隱私、金流與部署審查後才加入供應商。",
    "footer.line": "採 Apache-2.0 開源授權，作為教育用途的專案展示。",
    "footer.source": "原始碼與文件",
    "seo.kicker": "主力服務／SEO 基礎工程",
    "seo.title": "把專業導向真正有用的搜尋頁面。",
    "seo.description": "只選三種非個人分類；實驗室會產生從搜尋意圖到 90 天量測實驗的合成路線。",
    "seo.stamp": "僅為情境 · 不是實站健檢",
    "seo.business": "業務型態",
    "seo.goal": "搜尋目標",
    "seo.market": "市場範圍",
    "seo.privacy": "不要求、不抓取也不儲存網址、帳號、分析資料、Email 或客戶紀錄。",
    "seo.intentTitle": "搜尋意圖",
    "seo.mapTitle": "頁面地圖",
    "seo.technicalTitle": "技術檢查",
    "seo.experimentTitle": "量測實驗",
    "seo.boundaryTitle": "人工閘門",
    "seo.boundary": "負責人核對專業、主張、權利、結構化資料與每次正式發佈；不保證排名、流量、商機或收入。",
    "seo.official": "閱讀 Google Search Central 指南"
  },
  ja: {
    "access.skip": "プロジェクトへ移動",
    "preview.badge": "オープンソース・プレビュー",
    "preview.notice": "合成データのみ。決済、予約、メッセージ、アカウント、個人データは作成されません。",
    "hero.kicker": "つくる人のためのプロジェクト見本棚",
    "hero.title": "計画を読む。\n試作品に触れる。\nソースを自分用に変える。",
    "hero.description": "4つの小さな固定スコープ案と主力SEO成長ラボを、ドメイン、顧客記録、決済、本番システム接続前に無料評価できます。",
    "hero.primary": "4つの計画を見る",
    "hero.source": "GitHubでソースを見る",
    "hero.ruleOneLabel": "データ",
    "hero.ruleOne": "合成データのみ",
    "hero.ruleTwoLabel": "操作",
    "hero.ruleTwo": "ページ内シミュレーション",
    "hero.ruleThreeLabel": "ライセンス",
    "projects.kicker": "実行可能な4つの出発点",
    "projects.title": "プロジェクトカードを選ぶ",
    "projects.description": "各カードは対象者、1つの仕事、固定成果物、無料プレビュー経路、人の承認点を明示します。",
    "workbench.kicker": "インタラクティブ見本台",
    "workbench.title": "試作品と運用計画を並べて確認",
    "workbench.key": "ローカルシミュレーション — 外部操作なし",
    "workbench.status": "プレビュー",
    "workbench.disclaimer": "操作はこのページの表示だけを変えます。送信、保存、予約、購入、配信は行いません。",
    "plan.version": "バージョン 1",
    "plan.kicker": "実行設計図",
    "plan.audience": "対象者",
    "plan.job": "1つの仕事",
    "plan.host": "無料プレビュー先",
    "plan.duration": "試作期間",
    "plan.coverage": "自動化シナリオ",
    "plan.deliverables": "固定成果物",
    "plan.gates": "人の承認点",
    "plan.scenario": "収益化シナリオ",
    "plan.noGuarantee": "シナリオにすぎず、収入、需要、節約、成功を保証しません。",
    "plan.download": "個人情報なしの概要をダウンロード",
    "hosting.kicker": "無料優先の公開経路",
    "hosting.title": "目的に合うプレビューホストを選ぶ",
    "hosting.description": "このギャラリーはGitHub Pagesをコード作品展示に使用します。実際の事業サイトには、規約と実行環境が合うホストが必要です。",
    "hosting.current": "この展示",
    "hosting.static": "商用静的サイト",
    "hosting.dynamic": "審査済み動的サイト",
    "hosting.github": "データ収集や取引のないOSS作品展示向け。オンライン事業、EC、SaaSの運営には使えません。",
    "hosting.cloudflare": "審査済みの商用ランディングページやカタログ向け。決済はホスト型を使い、フロントに秘密を置きません。",
    "hosting.workers": "サーバー検証や小さなAPIが必要な場合に使用。秘密、書き込み、再試行、本番公開は引き続き審査対象です。",
    "hosting.official": "公式制限",
    "remix.kicker": "見本から所有プロジェクトへ",
    "remix.title": "ソースをForkし、合成文言を置き換え、本番境界をすべて確認します。",
    "remix.one": "1つの固定ジョブと1つの測定可能な結果を選ぶ。",
    "remix.two": "最初のプレビューは静的で個人情報なしに保つ。",
    "remix.three": "プライバシー、決済、公開審査後にだけ事業者を追加する。",
    "footer.line": "Apache-2.0で公開された教育用プロジェクト展示です。",
    "footer.source": "ソースと文書",
    "seo.kicker": "主力サービス／SEO基盤",
    "seo.title": "専門知識を役立つ検索ページへ導く。",
    "seo.description": "個人情報を含まない3分類を選ぶと、検索意図から90日測定実験までの合成経路を返します。",
    "seo.stamp": "シナリオ · 実サイト監査ではありません",
    "seo.business": "事業パターン",
    "seo.goal": "検索目標",
    "seo.market": "市場範囲",
    "seo.privacy": "URL、アカウント、分析、メール、顧客記録を要求、取得、保存しません。",
    "seo.intentTitle": "検索意図",
    "seo.mapTitle": "ページマップ",
    "seo.technicalTitle": "技術チェック",
    "seo.experimentTitle": "測定実験",
    "seo.boundaryTitle": "人の承認",
    "seo.boundary": "責任者が専門性、主張、権利、構造化データ、本番公開を確認します。順位、流入、商談、収益は保証しません。",
    "seo.official": "Google Search Central ガイドを読む"
  },
  es: {
    "access.skip": "Ir a los proyectos",
    "preview.badge": "VISTA PREVIA ABIERTA",
    "preview.notice": "Solo datos sintéticos. No se crea ningún pago, reserva, mensaje, cuenta ni dato personal.",
    "hero.kicker": "Un muro de muestras para quienes construyen",
    "hero.title": "Estudia el plan.\nPrueba el prototipo.\nAdapta el código.",
    "hero.description": "Cuatro conceptos de alcance fijo y un laboratorio SEO principal permiten evaluar antes de conectar dominio, clientes, pagos o producción.",
    "hero.primary": "Explorar cuatro planes",
    "hero.source": "Ver código en GitHub",
    "hero.ruleOneLabel": "Datos",
    "hero.ruleOne": "Solo sintéticos",
    "hero.ruleTwoLabel": "Acciones",
    "hero.ruleTwo": "Simulación local",
    "hero.ruleThreeLabel": "Licencia",
    "projects.kicker": "Cuatro puntos de partida viables",
    "projects.title": "Elige una tarjeta de proyecto",
    "projects.description": "Cada tarjeta define público, un trabajo, entregables limitados, una ruta gratuita y controles humanos.",
    "workbench.kicker": "Mesa de muestras interactiva",
    "workbench.title": "Un prototipo junto a su plan operativo",
    "workbench.key": "Simulación local — sin acción externa",
    "workbench.status": "VISTA PREVIA",
    "workbench.disclaimer": "La interacción solo cambia esta página. Nada se envía, guarda, reserva, compra ni comunica.",
    "plan.version": "VERSIÓN 1",
    "plan.kicker": "Plano de ejecución",
    "plan.audience": "Público",
    "plan.job": "Trabajo único",
    "plan.host": "Host gratuito de prueba",
    "plan.duration": "Ventana de prototipo",
    "plan.coverage": "Escenario de automatización",
    "plan.deliverables": "Entregables fijos",
    "plan.gates": "Controles humanos",
    "plan.scenario": "Escenario de monetización",
    "plan.noGuarantee": "Es solo un escenario; no garantiza ingresos, demanda, ahorro ni éxito.",
    "plan.download": "Descargar resumen sin datos personales",
    "hosting.kicker": "Rutas de publicación gratuitas",
    "hosting.title": "Usa el host adecuado para cada prueba",
    "hosting.description": "Esta galería usa GitHub Pages como muestra de código. Un sitio comercial real necesita condiciones y runtime adecuados.",
    "hosting.current": "ESTA MUESTRA",
    "hosting.static": "ESTÁTICO COMERCIAL",
    "hosting.dynamic": "DINÁMICO REVISADO",
    "hosting.github": "Útil para mostrar un proyecto abierto sin datos ni transacciones. No sirve para operar un negocio, comercio o SaaS.",
    "hosting.cloudflare": "Ruta práctica para una landing o catálogo comercial revisado, con checkout alojado y sin secretos en el navegador.",
    "hosting.workers": "Para validación de servidor o una API pequeña. Secretos, escrituras, reintentos y producción siguen requiriendo revisión.",
    "hosting.official": "Límites oficiales",
    "remix.kicker": "De muestra a proyecto propio",
    "remix.title": "Haz fork, reemplaza el contenido sintético y revisa cada límite de producción.",
    "remix.one": "Elige un trabajo fijo y un resultado medible.",
    "remix.two": "Mantén la primera prueba estática y sin datos personales.",
    "remix.three": "Añade proveedores solo tras revisar privacidad, pagos y despliegue.",
    "footer.line": "Código abierto Apache-2.0. Muestra educativa de proyectos.",
    "footer.source": "Código y documentación",
    "seo.kicker": "Servicio principal / Base SEO",
    "seo.title": "Dirige la experiencia hacia páginas de búsqueda útiles.",
    "seo.description": "Elige tres categorías no personales. El laboratorio crea una ruta sintética desde la intención hasta un experimento de 90 días.",
    "seo.stamp": "ESCENARIO · NO ES AUDITORÍA DEL SITIO",
    "seo.business": "Patrón de negocio",
    "seo.goal": "Objetivo de búsqueda",
    "seo.market": "Alcance del mercado",
    "seo.privacy": "No se solicita, obtiene ni guarda URL, cuenta, analítica, email ni registro de clientes.",
    "seo.intentTitle": "Intención de búsqueda",
    "seo.mapTitle": "Mapa de páginas",
    "seo.technicalTitle": "Controles técnicos",
    "seo.experimentTitle": "Experimento de medición",
    "seo.boundaryTitle": "Control humano",
    "seo.boundary": "El responsable verifica experiencia, afirmaciones, derechos, datos estructurados y cada publicación. No se garantiza posición, tráfico, oportunidades ni ingresos.",
    "seo.official": "Leer la guía de Google Search Central"
  }
};

const seoScenarios = {
  en: {
    compose: "Use {business} within {market}.",
    businesses: [
      { label: "Local service", map: "Home → one service page → evidence or process → contact path." },
      { label: "Appointment service", map: "Home → service detail → approved availability explanation → booking path." },
      { label: "Product catalog", map: "Home → category → useful product detail → delivery and support information." },
      { label: "Knowledge product", map: "Home → topic hub → original guide or lesson → product or enrollment path." }
    ],
    goals: [
      { label: "Brand discovery", intent: "Discovery, identity, proof, and trust questions.", experiment: "Days 1–30 establish branded and non-branded baselines; days 31–60 publish bounded improvements; days 61–90 compare qualified discovery clicks." },
      { label: "Service inquiry", intent: "Problem, comparison, process, fit, and contact questions.", experiment: "Baseline inquiry paths first; publish up to three priority improvements; compare qualified clicks and owner-approved inquiry events." },
      { label: "Product exploration", intent: "Category, use-case, comparison, specification, and delivery questions.", experiment: "Baseline category visibility; repair one useful product route; compare indexed pages, qualified product clicks, and approved actions." },
      { label: "Educational discovery", intent: "How, why, example, method, and next-step questions.", experiment: "Baseline topic visibility; publish original expert material; compare impressions, qualified reading clicks, and approved next steps." }
    ],
    markets: [
      { label: "One city", technical: "Crawlable HTML, descriptive title and H1, canonical, internal links, sitemap, and factual local-business data only when visible." },
      { label: "One region", technical: "One canonical route per useful intent, clear regional context, internal links, sitemap, and no near-duplicate location doorway pages." },
      { label: "Multiple regions", technical: "Distinct useful regional pages only, stable canonicals, crawlable links, sitemap coverage, and duplicate-content review." },
      { label: "Multiple languages", technical: "Separate locale URLs, self-canonicals, reciprocal hreflang with x-default, crawlable links, and human-reviewed translation." }
    ]
  },
  "zh-TW": {
    compose: "以「{business}」服務「{market}」。",
    businesses: [
      { label: "在地服務", map: "首頁 → 單一服務頁 → 證據或流程 → 聯絡路徑。" },
      { label: "預約服務", map: "首頁 → 服務細節 → 已核准空檔說明 → 預約路徑。" },
      { label: "商品型錄", map: "首頁 → 分類 → 有用商品細節 → 配送與支援資訊。" },
      { label: "知識產品", map: "首頁 → 主題中心 → 原創指南或課程 → 產品或報名路徑。" }
    ],
    goals: [
      { label: "品牌發現", intent: "品牌探索、身分、證據與信任問題。", experiment: "第 1–30 天建立品牌與非品牌基準；31–60 天發布有限改善；61–90 天比較合格探索點擊。" },
      { label: "服務詢問", intent: "問題、比較、流程、適配與聯絡問題。", experiment: "先建立詢問路徑基準；最多改善三個優先頁面；比較合格點擊與負責人核准的詢問事件。" },
      { label: "商品探索", intent: "分類、用途、比較、規格與配送問題。", experiment: "先建立分類能見度基準；修復一條有用商品路線；比較索引頁、合格商品點擊與已核准行動。" },
      { label: "教育內容", intent: "怎麼做、為什麼、範例、方法與下一步問題。", experiment: "先建立主題能見度基準；發布原創專業內容；比較曝光、合格閱讀點擊與已核准下一步。" }
    ],
    markets: [
      { label: "單一城市", technical: "可爬取 HTML、描述性 title 與 H1、canonical、內部連結、sitemap；只有畫面可見時才標記真實在地商家資料。" },
      { label: "單一區域", technical: "每個有用意圖一條標準路線、清楚區域脈絡、內部連結與 sitemap；不建立相似地區入口頁。" },
      { label: "多個區域", technical: "只建立內容確實不同的區域頁、穩定 canonical、可爬取連結、sitemap 覆蓋與重複內容檢查。" },
      { label: "多種語言", technical: "分開語系網址、自我 canonical、互相對應 hreflang 與 x-default、可爬取連結及人工審稿翻譯。" }
    ]
  },
  ja: {
    compose: "{market}で{business}を扱います。",
    businesses: [
      { label: "地域サービス", map: "ホーム → 1つのサービス → 証拠または手順 → 問い合わせ経路。" },
      { label: "予約サービス", map: "ホーム → サービス詳細 → 承認済み空き状況説明 → 予約経路。" },
      { label: "商品カタログ", map: "ホーム → カテゴリ → 有用な商品詳細 → 配送・支援情報。" },
      { label: "知識商品", map: "ホーム → トピックハブ → 独自ガイドまたは講座 → 商品・申込経路。" }
    ],
    goals: [
      { label: "ブランド発見", intent: "発見、身元、証拠、信頼に関する質問。", experiment: "1–30日でブランド／非ブランド基準、31–60日で限定改善、61–90日で適格な発見クリックを比較します。" },
      { label: "サービス相談", intent: "課題、比較、手順、適合、問い合わせに関する質問。", experiment: "相談経路の基準を作り、優先3ページまで改善し、適格クリックと承認済み相談行動を比較します。" },
      { label: "商品探索", intent: "カテゴリ、用途、比較、仕様、配送に関する質問。", experiment: "カテゴリ表示基準を作り、1つの商品経路を修正し、索引ページ、適格商品クリック、承認済み行動を比較します。" },
      { label: "教育コンテンツ", intent: "方法、理由、例、手法、次の行動に関する質問。", experiment: "トピック基準を作り、独自の専門内容を公開し、表示、適格閲覧クリック、承認済み次行動を比較します。" }
    ],
    markets: [
      { label: "1つの都市", technical: "クロール可能HTML、説明的title/H1、canonical、内部リンク、sitemap、画面に見える事実だけの地域事業データ。" },
      { label: "1つの地域", technical: "有用な意図ごとに1つの正規経路、明確な地域文脈、内部リンク、sitemap、重複した地域誘導ページなし。" },
      { label: "複数地域", technical: "実質的に異なる地域ページだけ、安定canonical、クロール可能リンク、sitemap網羅、重複内容確認。" },
      { label: "複数言語", technical: "言語別URL、自己canonical、相互hreflangとx-default、クロール可能リンク、人が確認した翻訳。" }
    ]
  },
  es: {
    compose: "Usa {business} dentro de {market}.",
    businesses: [
      { label: "Servicio local", map: "Inicio → un servicio → pruebas o proceso → vía de contacto." },
      { label: "Servicio con citas", map: "Inicio → detalle del servicio → disponibilidad aprobada → vía de reserva." },
      { label: "Catálogo de productos", map: "Inicio → categoría → detalle útil → información de entrega y soporte." },
      { label: "Producto de conocimiento", map: "Inicio → centro temático → guía o lección original → producto o inscripción." }
    ],
    goals: [
      { label: "Descubrimiento de marca", intent: "Preguntas de descubrimiento, identidad, prueba y confianza.", experiment: "Días 1–30: base de marca y no marca; 31–60: mejoras limitadas; 61–90: comparar clics cualificados de descubrimiento." },
      { label: "Consulta de servicio", intent: "Preguntas de problema, comparación, proceso, encaje y contacto.", experiment: "Primero crea la base de consultas; mejora hasta tres páginas prioritarias; compara clics y consultas aprobadas." },
      { label: "Exploración de producto", intent: "Preguntas de categoría, uso, comparación, especificación y entrega.", experiment: "Crea la base de categorías; repara una ruta útil; compara páginas indexadas, clics cualificados y acciones aprobadas." },
      { label: "Descubrimiento educativo", intent: "Preguntas de cómo, por qué, ejemplo, método y siguiente paso.", experiment: "Crea la base temática; publica experiencia original; compara impresiones, lectura cualificada y siguientes pasos aprobados." }
    ],
    markets: [
      { label: "Una ciudad", technical: "HTML rastreable, title y H1 descriptivos, canonical, enlaces, sitemap y datos locales factuales solo si son visibles." },
      { label: "Una región", technical: "Una ruta canónica por intención útil, contexto regional claro, enlaces, sitemap y sin páginas puerta casi duplicadas." },
      { label: "Varias regiones", technical: "Solo páginas regionales realmente distintas, canonical estable, enlaces rastreables, sitemap y revisión de duplicados." },
      { label: "Varios idiomas", technical: "URL separadas, canonical propio, hreflang recíproco con x-default, enlaces rastreables y traducción revisada por personas." }
    ]
  }
};

const projects = {
  en: {
    "web-studio": {
      code: "PX-01", title: "Web design studio", summary: "A one-page design and development offer that proves visual direction before a client connects real content.", fit: "BEST FIRST BUILD · 2–4 DAYS", audience: "Independent professionals and small local teams", job: "Turn one offer into a clear, responsive landing-page prototype", host: "GitHub Pages for this educational sample; Cloudflare Pages for a reviewed commercial site", duration: "2–4 working days", coverage: "40–60% of repetitive layout, QA, and handoff tasks", deliverables: ["One responsive page and a compact visual system", "Synthetic copy for one offer and one call to action", "Accessibility, mobile, link, and deployment checklist"], gates: ["Owner approves claims, prices, media rights, and final copy", "Real forms, analytics, checkout, and domains require separate review"], scenario: "Charge a fixed design-and-build fee, then offer optional maintenance after the client accepts the prototype.", demo: { nav: "FIELDNOTE / STUDIO", eyebrow: "A SMALL WEB PRACTICE", title: "One useful page, designed with a point of view.", body: "A synthetic landing-page direction for specialists who need clarity before complexity.", mark: "FN", controls: ["Editorial", "Crisp", "Bold"] }
    },
    appointment: {
      code: "PX-02", title: "Appointment microsite", summary: "A calm service page that demonstrates availability and booking states without collecting a name or creating a reservation.", fit: "SERVICE PREVIEW · 3–5 DAYS", audience: "Tutors, coaches, studios, and appointment-led services", job: "Explain one session and simulate choosing an available time", host: "GitHub Pages for this non-booking sample; Workers or another reviewed backend for real reservations", duration: "3–5 working days", coverage: "30–50% of page, schedule display, and reminder preparation", deliverables: ["Service explanation and synthetic weekly availability", "Accessible time-slot selection with clear mock state", "Server validation and idempotent booking specification"], gates: ["Owner approves availability, cancellation rules, and message templates", "Authentication, personal data, reminders, and real booking require backend review"], scenario: "Sell a fixed setup for one service and one calendar, followed by optional support after a measured pilot.", demo: { eyebrow: "ONE-TO-ONE PRACTICE", title: "Stillwater sessions", body: "A quiet 45-minute planning session. Choose a sample slot to inspect the state change.", choose: "Sample availability", selected: "Demo hold only — no reservation or personal data was created.", modes: ["This week", "Next week"], slots: ["Tue 10:00", "Tue 14:30", "Thu 09:00", "Fri 16:00"] }
    },
    "creator-kit": {
      code: "PX-03", title: "Creator product page", summary: "A structured digital-product preview that makes the curriculum tangible without a checkout, countdown, or invented testimonial.", fit: "CONTENT PREVIEW · 2–4 DAYS", audience: "Educators, writers, and independent creators", job: "Present one paid learning product and let visitors inspect its modules", host: "GitHub Pages for this educational sample; Cloudflare Pages plus hosted checkout for a reviewed commercial launch", duration: "2–4 working days", coverage: "35–55% of page assembly, content structure, and QA", deliverables: ["One product story with a synthetic cover system", "Expandable three-module curriculum preview", "Hosted-checkout, email consent, and launch checklist"], gates: ["Creator approves teaching claims, rights, price, and refund wording", "Real checkout, subscriber collection, and campaigns require provider review"], scenario: "Offer a fixed launch-page package, then optional campaign assets after content and buyer evidence are reviewed.", demo: { nav: "POCKET WORKSHOP / 001", cover: "MAKE\nSMALL\nSYSTEMS", title: "A compact operating workshop", body: "Three practical lessons for turning a repeated task into a documented routine.", choose: "Inspect the curriculum", modes: ["Core edition", "Team edition"], modules: [["01 · Notice the repeat", "Map the trigger, input, decision, and outcome."], ["02 · Draw the boundary", "Separate reversible automation from owner approval."], ["03 · Test the handoff", "Measure the result and document the exception path."]] }
    },
    "groupbuy-board": {
      code: "PX-04", title: "Group-buy operations board", summary: "A synthetic, aggregate order board that demonstrates triage without exposing buyers, addresses, costs, or real payment state.", fit: "OPERATIONS PREVIEW · 4–7 DAYS", audience: "Community sellers and small commerce operators", job: "Turn aggregate order status into one reviewable exception queue", host: "GitHub Pages for this read-only sample; reviewed Workers and private storage for real operations", duration: "4–7 working days", coverage: "35–55% of aggregation, status display, and exception triage", deliverables: ["Aggregate stock and order-status board", "Ready, review, and hold filters using synthetic rows", "Identity, payment signature, idempotency, and privacy specification"], gates: ["Owner reconciles ambiguous payment and fulfillment states", "Buyer PII, order writes, outbound messages, and refunds stay private and approved"], scenario: "Run a fixed read-only pilot, then price integration and maintenance only if measured operator value justifies it.", demo: { eyebrow: "SYNTHETIC ORDER PULSE", title: "Common Table", body: "Aggregate rows only. No buyer identity, address, payment token, or unit cost is shown.", count: "4 sample batches", modes: ["All", "Ready", "Review", "Hold"], rows: [["Citrus box", "18 / 24", "ready"], ["Pantry set", "11 / 12", "review"], ["Tea pair", "20 / 20", "ready"], ["Weekend bake", "8 / 16", "hold"]] }
    }
  },
  "zh-TW": {
    "web-studio": {
      code: "PX-01", title: "網頁設計工作室", summary: "用單頁設計與開發方案先證明視覺方向，再讓客戶接上真實內容。", fit: "最佳入門案 · 2–4 天", audience: "獨立專業者與小型在地團隊", job: "把一項服務整理成清楚、響應式的落地頁原型", host: "本教育展示用 GitHub Pages；經審查的商業站用 Cloudflare Pages", duration: "2–4 個工作天", coverage: "重複排版、QA 與交接工作的 40–60% 情境", deliverables: ["一頁響應式網站與精簡視覺系統", "一項服務及單一行動呼籲的合成文案", "無障礙、手機、連結與部署檢查表"], gates: ["負責人核准主張、價格、素材權利與最終文案", "真實表單、分析、結帳與網域須另行審查"], scenario: "以固定價格交付設計與開發，客戶接受原型後再提供選配維護。", demo: { nav: "FIELDNOTE / STUDIO", eyebrow: "小型網頁實作室", title: "只做一個有用的頁面，也要有明確觀點。", body: "給專業服務者的合成落地頁方向：先把事情說清楚，再增加複雜度。", mark: "FN", controls: ["編輯感", "精準感", "大膽色彩"] }
    },
    appointment: {
      code: "PX-02", title: "預約服務微網站", summary: "展示服務與空檔狀態，但不收姓名，也不建立真實預約。", fit: "服務預覽 · 3–5 天", audience: "家教、教練、工作室與預約型服務", job: "說明一項服務並模擬選擇可用時段", host: "本非預約展示用 GitHub Pages；真實預約使用 Workers 或其他經審查後端", duration: "3–5 個工作天", coverage: "頁面、時段顯示與提醒準備工作的 30–50% 情境", deliverables: ["服務說明與合成週間時段", "有明確 Mock 狀態的無障礙時段選擇", "伺服器驗證與冪等預約規格"], gates: ["負責人核准空檔、取消規則與訊息範本", "身分、個資、提醒與真實預約須經後端審查"], scenario: "以一項服務及一份行事曆收取固定設定費，完成實測後再提供支援。", demo: { eyebrow: "一對一服務", title: "Stillwater Sessions", body: "安靜的 45 分鐘規劃會談。選擇範例時段，查看畫面狀態。", choose: "範例空檔", selected: "僅 Demo 暫留；沒有建立預約或個人資料。", modes: ["本週", "下週"], slots: ["週二 10:00", "週二 14:30", "週四 09:00", "週五 16:00"] }
    },
    "creator-kit": {
      code: "PX-03", title: "創作者產品頁", summary: "具體呈現數位產品課綱，不加入結帳、假倒數或虛構見證。", fit: "內容預覽 · 2–4 天", audience: "教育者、作者與獨立創作者", job: "呈現一項付費學習產品，讓訪客檢視內容模組", host: "本教育展示用 GitHub Pages；經審查商業發布用 Cloudflare Pages 與託管結帳", duration: "2–4 個工作天", coverage: "頁面組裝、內容結構與 QA 的 35–55% 情境", deliverables: ["一項產品故事與合成封面系統", "可展開的三模組課綱預覽", "託管結帳、Email 同意與發布檢查表"], gates: ["創作者核准教學主張、權利、價格與退款文字", "真實結帳、訂閱名單與行銷活動須審查供應商"], scenario: "先交付固定範圍的產品發布頁，內容及買方證據確認後再提供活動素材。", demo: { nav: "POCKET WORKSHOP / 001", cover: "打造\n小型\n系統", title: "精簡營運工作坊", body: "三堂實用小課，把重複工作變成可以交接與驗證的流程。", choose: "檢視課綱", modes: ["核心版", "團隊版"], modules: [["01 · 找出重複", "畫出觸發、輸入、判斷與結果。"], ["02 · 畫清邊界", "把可逆自動化與負責人核准分開。"], ["03 · 測試交接", "衡量結果並記錄例外處理路徑。"]] }
    },
    "groupbuy-board": {
      code: "PX-04", title: "團購營運看板", summary: "使用合成且彙總的訂單狀態示範分流，不公開買家、地址、成本或真實付款。", fit: "營運預覽 · 4–7 天", audience: "社群賣家與小型商務營運者", job: "把彙總訂單狀態整理成一個可審查例外佇列", host: "本唯讀展示用 GitHub Pages；真實營運用經審查 Workers 與私有儲存", duration: "4–7 個工作天", coverage: "彙總、狀態顯示與例外分流的 35–55% 情境", deliverables: ["彙總庫存與訂單狀態看板", "以合成資料顯示可處理、待審查與暫停篩選", "身分、金流簽章、冪等與隱私規格"], gates: ["負責人核對不明付款及出貨狀態", "買家個資、訂單寫入、外送訊息與退款保持私有並須核准"], scenario: "先執行固定範圍的唯讀試點；只有量測到營運價值後才評估整合與維護費。", demo: { eyebrow: "合成訂單脈動", title: "Common Table", body: "只顯示彙總列；不顯示買家身分、地址、付款 token 或單位成本。", count: "4 批範例", modes: ["全部", "可處理", "待審查", "暫停"], rows: [["柑橘箱", "18 / 24", "ready"], ["常備組", "11 / 12", "review"], ["雙茶組", "20 / 20", "ready"], ["週末烘焙", "8 / 16", "hold"]] }
    }
  },
  ja: {
    "web-studio": {
      code: "PX-01", title: "ウェブデザイン・スタジオ", summary: "実データを接続する前に、1ページの設計と開発で視覚方針を証明します。", fit: "最初の制作向け · 2〜4日", audience: "個人専門家と小規模な地域チーム", job: "1つの提供内容を明快なレスポンシブLP試作にする", host: "教育展示はGitHub Pages、審査済み商用サイトはCloudflare Pages", duration: "2〜4営業日", coverage: "反復レイアウト、QA、引継ぎの40〜60%シナリオ", deliverables: ["レスポンシブ1ページと小さな視覚システム", "1オファー・1行動の合成コピー", "アクセシビリティ、モバイル、リンク、公開チェック"], gates: ["責任者が主張、価格、素材権利、最終文言を承認", "実フォーム、分析、決済、ドメインは別途審査"], scenario: "固定の設計・開発費を設定し、試作受入れ後に任意の保守を提案します。", demo: { nav: "FIELDNOTE / STUDIO", eyebrow: "小さなウェブ制作室", title: "役立つ1ページを、明確な視点で。", body: "複雑さの前に明快さを必要とする専門家向けの合成LP案です。", mark: "FN", controls: ["編集的", "精密", "大胆"] }
    },
    appointment: {
      code: "PX-02", title: "予約マイクロサイト", summary: "氏名を集めず予約も作らず、サービスと空き枠状態を示します。", fit: "サービス試作 · 3〜5日", audience: "講師、コーチ、スタジオ、予約型サービス", job: "1つのセッションを説明し空き時間選択を模擬する", host: "非予約サンプルはGitHub Pages、実予約はWorkers等の審査済みバックエンド", duration: "3〜5営業日", coverage: "ページ、予定表示、通知準備の30〜50%シナリオ", deliverables: ["サービス説明と合成週間枠", "Mock状態が明確なアクセシブル時間選択", "サーバー検証と冪等予約仕様"], gates: ["責任者が空き枠、取消規則、メッセージを承認", "認証、個人データ、通知、実予約はバックエンド審査"], scenario: "1サービス・1カレンダーの固定設定費とし、実測後に支援を選択提供します。", demo: { eyebrow: "1対1の実践", title: "Stillwater Sessions", body: "静かな45分の計画セッション。サンプル枠を選んで状態変化を確認します。", choose: "サンプル空き枠", selected: "デモ保留のみ。予約も個人データも作成されていません。", modes: ["今週", "来週"], slots: ["火 10:00", "火 14:30", "木 09:00", "金 16:00"] }
    },
    "creator-kit": {
      code: "PX-03", title: "クリエイター商品ページ", summary: "決済、偽カウントダウン、架空レビューなしで教材構成を具体化します。", fit: "内容試作 · 2〜4日", audience: "教育者、著者、独立クリエイター", job: "1つの有料学習商品とモジュールを見せる", host: "教育サンプルはGitHub Pages、審査済み商用公開はCloudflare Pagesとホスト型決済", duration: "2〜4営業日", coverage: "ページ組立、内容構造、QAの35〜55%シナリオ", deliverables: ["1つの商品物語と合成カバー", "展開可能な3モジュールのプレビュー", "ホスト型決済、同意、公開チェック"], gates: ["制作者が教育主張、権利、価格、返金文言を承認", "実決済、購読者収集、キャンペーンは事業者審査"], scenario: "固定範囲の公開ページを提供し、内容と買い手証拠の確認後に任意素材を提案します。", demo: { nav: "POCKET WORKSHOP / 001", cover: "小さな\n仕組みを\nつくる", title: "コンパクト運用ワークショップ", body: "反復作業を記録可能な手順に変える3つの実践レッスン。", choose: "カリキュラムを見る", modes: ["コア版", "チーム版"], modules: [["01 · 反復を見つける", "トリガー、入力、判断、結果を描く。"], ["02 · 境界を描く", "可逆自動化と責任者承認を分ける。"], ["03 · 引継ぎを試す", "結果を測り例外経路を記録する。"]] }
    },
    "groupbuy-board": {
      code: "PX-04", title: "共同購入運用ボード", summary: "買い手、住所、原価、実決済を出さず、合成集計状態で仕分けを示します。", fit: "運用試作 · 4〜7日", audience: "コミュニティ販売者と小規模EC運営者", job: "集計注文状態を審査可能な例外キューにする", host: "読取専用サンプルはGitHub Pages、実運用は審査済みWorkersと私有保存", duration: "4〜7営業日", coverage: "集計、状態表示、例外仕分けの35〜55%シナリオ", deliverables: ["在庫と注文状態の集計ボード", "合成行の準備、審査、保留フィルター", "本人性、決済署名、冪等性、プライバシー仕様"], gates: ["責任者が曖昧な決済と発送状態を照合", "買い手個人情報、注文書込、外部通知、返金は私有・承認制"], scenario: "固定の読取専用試験を行い、運用価値が測定できた場合のみ統合・保守を見積もります。", demo: { eyebrow: "合成注文パルス", title: "Common Table", body: "集計行のみ。買い手、住所、決済token、単位原価は表示しません。", count: "4つのサンプル", modes: ["すべて", "準備", "審査", "保留"], rows: [["柑橘ボックス", "18 / 24", "ready"], ["パントリーセット", "11 / 12", "review"], ["お茶ペア", "20 / 20", "ready"], ["週末ベイク", "8 / 16", "hold"]] }
    }
  },
  es: {
    "web-studio": {
      code: "PX-01", title: "Estudio de diseño web", summary: "Una oferta de diseño y desarrollo de una página que valida la dirección visual antes de conectar contenido real.", fit: "MEJOR PRIMER PROYECTO · 2–4 DÍAS", audience: "Profesionales independientes y pequeños equipos locales", job: "Convertir una oferta en un prototipo responsive y claro", host: "GitHub Pages para esta muestra educativa; Cloudflare Pages para un sitio comercial revisado", duration: "2–4 días laborables", coverage: "40–60% del trabajo repetitivo de maquetación, QA y entrega", deliverables: ["Una página responsive y un sistema visual compacto", "Texto sintético para una oferta y una acción", "Lista de accesibilidad, móvil, enlaces y despliegue"], gates: ["El responsable aprueba afirmaciones, precios, derechos y texto final", "Formularios, analítica, checkout y dominio requieren otra revisión"], scenario: "Cobrar una tarifa fija de diseño y desarrollo y ofrecer mantenimiento opcional tras aceptar el prototipo.", demo: { nav: "FIELDNOTE / STUDIO", eyebrow: "UN PEQUEÑO ESTUDIO WEB", title: "Una página útil, diseñada con criterio.", body: "Dirección sintética para especialistas que necesitan claridad antes de complejidad.", mark: "FN", controls: ["Editorial", "Preciso", "Audaz"] }
    },
    appointment: {
      code: "PX-02", title: "Micrositio de citas", summary: "Expone servicio y disponibilidad sin recopilar un nombre ni crear una reserva.", fit: "PRUEBA DE SERVICIO · 3–5 DÍAS", audience: "Tutores, coaches, estudios y servicios con cita", job: "Explicar una sesión y simular la elección de una hora", host: "GitHub Pages para la muestra sin reservas; Workers u otro backend revisado para reservas reales", duration: "3–5 días laborables", coverage: "30–50% de página, horario y preparación de recordatorios", deliverables: ["Servicio y disponibilidad semanal sintética", "Selección accesible con estado mock explícito", "Especificación de validación e idempotencia"], gates: ["El responsable aprueba horarios, cancelación y mensajes", "Identidad, datos, recordatorios y reserva real requieren revisión de backend"], scenario: "Vender una configuración fija de un servicio y calendario, con soporte opcional después de un piloto medido.", demo: { eyebrow: "PRÁCTICA INDIVIDUAL", title: "Stillwater Sessions", body: "Una sesión tranquila de planificación de 45 minutos. Elige una hora de muestra.", choose: "Disponibilidad de muestra", selected: "Solo retención de demo: no se creó reserva ni dato personal.", modes: ["Esta semana", "Próxima semana"], slots: ["Mar 10:00", "Mar 14:30", "Jue 09:00", "Vie 16:00"] }
    },
    "creator-kit": {
      code: "PX-03", title: "Página de producto creador", summary: "Hace tangible un producto digital sin checkout, cuenta atrás falsa ni testimonio inventado.", fit: "PRUEBA DE CONTENIDO · 2–4 DÍAS", audience: "Educadores, autores y creadores independientes", job: "Presentar un producto formativo y permitir inspeccionar sus módulos", host: "GitHub Pages para esta muestra; Cloudflare Pages y checkout alojado para un lanzamiento revisado", duration: "2–4 días laborables", coverage: "35–55% de montaje, estructura y QA", deliverables: ["Historia de producto y portada sintética", "Vista expandible de tres módulos", "Lista de checkout alojado, consentimiento y lanzamiento"], gates: ["El creador aprueba promesas, derechos, precio y reembolsos", "Checkout real, suscriptores y campañas requieren revisión"], scenario: "Ofrecer una página de lanzamiento fija y activos opcionales tras revisar contenido y evidencia de compradores.", demo: { nav: "POCKET WORKSHOP / 001", cover: "CREA\nSISTEMAS\nPEQUEÑOS", title: "Un taller operativo compacto", body: "Tres lecciones para convertir una tarea repetida en una rutina documentada.", choose: "Explorar el temario", modes: ["Edición base", "Edición equipo"], modules: [["01 · Detecta la repetición", "Mapea disparador, entrada, decisión y resultado."], ["02 · Dibuja el límite", "Separa automatización reversible y aprobación."], ["03 · Prueba la entrega", "Mide el resultado y documenta excepciones."]] }
    },
    "groupbuy-board": {
      code: "PX-04", title: "Tablero de compra grupal", summary: "Demuestra triaje con estados agregados y sintéticos, sin compradores, direcciones, costes ni pagos reales.", fit: "PRUEBA OPERATIVA · 4–7 DÍAS", audience: "Vendedores comunitarios y pequeños comercios", job: "Convertir estados agregados en una cola revisable", host: "GitHub Pages para la muestra de lectura; Workers revisado y almacenamiento privado para operación real", duration: "4–7 días laborables", coverage: "35–55% de agregación, estado y triaje", deliverables: ["Tablero agregado de stock y pedidos", "Filtros listo, revisión y espera con filas sintéticas", "Especificación de identidad, firma, idempotencia y privacidad"], gates: ["El responsable concilia pagos y envíos ambiguos", "Datos del comprador, escrituras, mensajes y reembolsos siguen privados y aprobados"], scenario: "Ejecutar un piloto fijo y de solo lectura; cotizar integración y mantenimiento si el valor medido lo justifica.", demo: { eyebrow: "PULSO SINTÉTICO", title: "Common Table", body: "Solo filas agregadas. No se muestra identidad, dirección, token de pago ni coste unitario.", count: "4 lotes de muestra", modes: ["Todos", "Listo", "Revisión", "Espera"], rows: [["Caja cítrica", "18 / 24", "ready"], ["Set despensa", "11 / 12", "review"], ["Dúo de té", "20 / 20", "ready"], ["Horneado semanal", "8 / 16", "hold"]] }
    }
  }
};

const state = {
  locale: "en",
  projectId: "web-studio",
  mode: 0,
  selectedSlot: null,
  openModule: 0,
  boardFilter: "all",
  seo: { business: 0, goal: 0, market: 0 }
};

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function replaceText(node, text) {
  node.replaceChildren();
  const lines = text.split("\n");
  lines.forEach((line, index) => {
    if (index > 0) node.append(document.createElement("br"));
    node.append(document.createTextNode(line));
  });
}

function currentProject() {
  return projects[state.locale][state.projectId];
}

function setLocale(locale) {
  if (!localeIds.includes(locale)) return;
  state.locale = locale;
  document.documentElement.lang = locale;
  document.title = `${locale === "zh-TW" ? "早安店長" : "Morning Operator"} — Open Project and SEO Growth Lab`;
  document.querySelectorAll("[data-locale]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.locale === locale));
  });
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const value = uiCopy[locale][node.dataset.i18n];
    if (value !== undefined) replaceText(node, value);
  });
  renderProjects();
  renderSelectedProject();
  renderSeoLab();
}

function formatScenario(template, values) {
  return template.replace(/\{([a-z]+)\}/g, (_, key) => values[key] ?? "");
}

function renderSeoChoices(containerSelector, options, selectedIndex, key) {
  const container = document.querySelector(containerSelector);
  const buttons = options.map((option, index) => {
    const button = element("button", "", option.label);
    button.type = "button";
    button.setAttribute("aria-pressed", String(index === selectedIndex));
    button.addEventListener("click", () => {
      state.seo[key] = index;
      renderSeoLab();
    });
    return button;
  });
  container.replaceChildren(...buttons);
}

function renderSeoLab() {
  const scenario = seoScenarios[state.locale];
  const business = scenario.businesses[state.seo.business];
  const goal = scenario.goals[state.seo.goal];
  const market = scenario.markets[state.seo.market];

  renderSeoChoices("#seo-business-options", scenario.businesses, state.seo.business, "business");
  renderSeoChoices("#seo-goal-options", scenario.goals, state.seo.goal, "goal");
  renderSeoChoices("#seo-market-options", scenario.markets, state.seo.market, "market");

  const scope = formatScenario(scenario.compose, { business: business.label, market: market.label });
  document.querySelector("#seo-intent-output").textContent = `${goal.intent} ${scope}`;
  document.querySelector("#seo-map-output").textContent = business.map;
  document.querySelector("#seo-technical-output").textContent = market.technical;
  document.querySelector("#seo-experiment-output").textContent = goal.experiment;
}

function setProject(projectId) {
  if (!projectIds.includes(projectId)) return;
  state.projectId = projectId;
  state.mode = 0;
  state.selectedSlot = null;
  state.openModule = 0;
  state.boardFilter = "all";
  renderProjects();
  renderSelectedProject();
}

function renderProjects() {
  const container = document.querySelector("#project-tabs");
  const fragment = document.createDocumentFragment();
  projectIds.forEach((projectId) => {
    const project = projects[state.locale][projectId];
    const button = element("button", "project-tab");
    button.type = "button";
    button.dataset.plan = projectId;
    button.setAttribute("aria-pressed", String(state.projectId === projectId));
    button.append(element("span", "tab-index", project.code));
    button.append(element("h3", "", project.title));
    button.append(element("p", "", project.summary));
    button.append(element("span", "tab-fit", project.fit));
    button.addEventListener("click", () => setProject(projectId));
    fragment.append(button);
  });
  container.replaceChildren(fragment);
}

function fillList(selector, items) {
  const list = document.querySelector(selector);
  list.replaceChildren(...items.map((item) => element("li", "", item)));
}

function renderSelectedProject() {
  const project = currentProject();
  document.querySelector("#demo-code").textContent = project.code;
  document.querySelector("#demo-title").textContent = project.title;
  document.querySelector("#plan-code").textContent = project.code;
  document.querySelector("#plan-title").textContent = project.title;
  document.querySelector("#plan-summary").textContent = project.summary;
  document.querySelector("#plan-audience").textContent = project.audience;
  document.querySelector("#plan-job").textContent = project.job;
  document.querySelector("#plan-host").textContent = project.host;
  document.querySelector("#plan-duration").textContent = project.duration;
  document.querySelector("#plan-coverage").textContent = project.coverage;
  document.querySelector("#plan-scenario").textContent = project.scenario;
  fillList("#plan-deliverables", project.deliverables);
  fillList("#plan-gates", project.gates);
  renderDemo();
}

function controlButton(label, active, handler) {
  const button = element("button", "", label);
  button.type = "button";
  button.setAttribute("aria-pressed", String(active));
  button.addEventListener("click", handler);
  return button;
}

function renderModeControls(labels) {
  const controls = document.querySelector("#demo-controls");
  controls.replaceChildren(...labels.map((label, index) => controlButton(label, state.mode === index, () => {
    state.mode = index;
    renderDemo();
  })));
}

function renderDemo() {
  const project = currentProject();
  if (state.projectId === "web-studio") renderWebDemo(project);
  if (state.projectId === "appointment") renderBookingDemo(project);
  if (state.projectId === "creator-kit") renderCreatorDemo(project);
  if (state.projectId === "groupbuy-board") renderGroupbuyDemo(project);
}

function renderWebDemo(project) {
  renderModeControls(project.demo.controls);
  const stage = document.querySelector("#demo-stage");
  const styles = ["editorial", "crisp", "bold"];
  const site = element("section", `sample-site ${styles[state.mode]}`);
  const nav = element("div", "sample-nav");
  nav.append(element("strong", "", project.demo.nav), element("span", "", "OPEN / SAMPLE"));
  const hero = element("div", "sample-hero");
  const copy = element("div", "");
  copy.append(element("p", "kicker", project.demo.eyebrow), element("h4", "", project.demo.title), element("p", "", project.demo.body));
  const swatch = element("div", "sample-swatch", project.demo.mark);
  hero.append(copy, swatch);
  site.append(nav, hero);
  stage.replaceChildren(site);
}

function renderBookingDemo(project) {
  renderModeControls(project.demo.modes);
  const stage = document.querySelector("#demo-stage");
  const sample = element("section", "sample-booking");
  const intro = element("div", "booking-intro");
  intro.append(element("p", "kicker", project.demo.eyebrow), element("h4", "", project.demo.title), element("p", "", project.demo.body));
  const slots = element("div", "booking-slots");
  slots.append(element("h5", "", project.demo.choose));
  const grid = element("div", "slot-grid");
  project.demo.slots.forEach((label, index) => {
    const shiftedLabel = state.mode === 0 ? label : label.replace(/(\d{1,2}):(\d{2})/, (_, hour, minute) => `${String((Number(hour) + 1) % 24).padStart(2, "0")}:${minute}`);
    const button = element("button", "slot-button", shiftedLabel);
    button.type = "button";
    button.setAttribute("aria-pressed", String(state.selectedSlot === index));
    button.addEventListener("click", () => {
      state.selectedSlot = index;
      renderBookingDemo(project);
    });
    grid.append(button);
  });
  slots.append(grid);
  if (state.selectedSlot !== null) slots.append(element("p", "selection-note", project.demo.selected));
  sample.append(intro, slots);
  stage.replaceChildren(sample);
}

function renderCreatorDemo(project) {
  renderModeControls(project.demo.modes);
  const stage = document.querySelector("#demo-stage");
  const sample = element("section", "sample-course");
  const nav = element("div", "sample-nav");
  nav.append(element("strong", "", project.demo.nav), element("span", "", project.demo.modes[state.mode]));
  const grid = element("div", "course-grid");
  const cover = element("div", "course-cover");
  replaceText(cover, project.demo.cover);
  const modules = element("div", "course-modules");
  modules.append(element("p", "kicker", project.demo.title), element("p", "", project.demo.body), element("h5", "", project.demo.choose));
  project.demo.modules.forEach(([title, detail], index) => {
    const button = element("button", "module-button", `${state.openModule === index ? "−" : "+"} ${title}`);
    button.type = "button";
    button.setAttribute("aria-expanded", String(state.openModule === index));
    button.addEventListener("click", () => {
      state.openModule = index;
      renderCreatorDemo(project);
    });
    modules.append(button);
    if (state.openModule === index) modules.append(element("p", "module-detail", detail));
  });
  grid.append(cover, modules);
  sample.append(nav, grid);
  stage.replaceChildren(sample);
}

function renderGroupbuyDemo(project) {
  const filterIds = ["all", "ready", "review", "hold"];
  const controls = document.querySelector("#demo-controls");
  controls.replaceChildren(...project.demo.modes.map((label, index) => controlButton(label, state.boardFilter === filterIds[index], () => {
    state.boardFilter = filterIds[index];
    renderGroupbuyDemo(project);
  })));
  const stage = document.querySelector("#demo-stage");
  const sample = element("section", "sample-board");
  const head = element("div", "board-head");
  const heading = element("div", "");
  heading.append(element("p", "kicker", project.demo.eyebrow), element("h4", "", project.demo.title), element("p", "", project.demo.body));
  head.append(heading, element("strong", "board-count", project.demo.count));
  const table = element("div", "board-table");
  table.append(element("h5", "", project.demo.modes[filterIds.indexOf(state.boardFilter)]));
  const visibleRows = project.demo.rows.filter((row) => state.boardFilter === "all" || row[2] === state.boardFilter);
  visibleRows.forEach(([name, count, status]) => {
    const row = element("div", "board-row");
    row.append(element("strong", "", name), element("span", "", count), element("span", `status-pill ${status}`, status));
    table.append(row);
  });
  sample.append(head, table);
  stage.replaceChildren(sample);
}

function downloadBrief() {
  const project = currentProject();
  const brief = {
    schema: "morning-operator/open-preview-brief/v1",
    locale: state.locale,
    projectId: state.projectId,
    title: project.title,
    audience: project.audience,
    singleJob: project.job,
    freePreviewHost: project.host,
    prototypeWindow: project.duration,
    automationScenario: project.coverage,
    deliverables: project.deliverables,
    humanGates: project.gates,
    monetizationScenario: project.scenario,
    disclaimer: uiCopy[state.locale]["plan.noGuarantee"],
    containsPersonalData: false,
    triggersExternalAction: false
  };
  const blob = new Blob([JSON.stringify(brief, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${state.projectId}-preview-brief.json`;
  link.click();
  URL.revokeObjectURL(url);
}

document.querySelectorAll("[data-locale]").forEach((button) => {
  button.addEventListener("click", () => setLocale(button.dataset.locale));
});
document.querySelector("#download-brief").addEventListener("click", downloadBrief);

setLocale("en");
