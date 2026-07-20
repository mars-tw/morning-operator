import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd(), "public/showcase");
const requiredFiles = ["index.html", "styles.css", "app.js", "404.html", "icon.svg", "sitemap.xml", ".nojekyll"];
const requiredLocales = ["en", "zh-TW", "ja", "es"];
const requiredProjects = ["web-studio", "appointment", "creator-kit", "groupbuy-board"];
const failures = [];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`missing ${file}`);
}

if (!failures.length) {
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
  const script = fs.readFileSync(path.join(root, "app.js"), "utf8");
  const notFound = fs.readFileSync(path.join(root, "404.html"), "utf8");
  const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  const combined = `${html}\n${script}`;

  const prohibited = [
    ["form collection", /<\s*(?:form|input|textarea|select)\b/i],
    ["network request", /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon)\b/],
    ["browser persistence", /\b(?:localStorage|sessionStorage|indexedDB|document\.cookie)\b/],
    ["unsafe HTML sink", /\b(?:innerHTML|outerHTML|insertAdjacentHTML)\b/],
    ["remote runtime asset", /<script\b[^>]+src=["']https?:\/\/|<link\b(?=[^>]*rel=["'](?:stylesheet|preload|modulepreload)["'])[^>]+href=["']https?:\/\//i],
    ["sensitive input", /type=["'](?:password|email|tel|payment)["']/i]
  ];

  for (const [label, pattern] of prohibited) {
    if (pattern.test(combined)) failures.push(`prohibited ${label}`);
  }

  if (!html.includes('href="./styles.css"') || !html.includes('src="./app.js"')) {
    failures.push("assets must use relative URLs");
  }
  if (!html.includes("Synthetic data only") || !html.includes("No payment")) {
    failures.push("missing prominent synthetic-data disclaimer");
  }
  if (!html.includes('id="seo-growth-lab"') || !script.includes("seoScenarios") || !script.includes("renderSeoLab")) {
    failures.push("missing dedicated SEO growth lab");
  }
  for (const output of ["seo-intent-output", "seo-map-output", "seo-technical-output", "seo-experiment-output"]) {
    if (!html.includes(`id="${output}"`)) failures.push(`missing SEO output ${output}`);
  }
  if (!html.includes('rel="canonical" href="https://mars-tw.github.io/morning-operator/"')) {
    failures.push("missing absolute showcase canonical");
  }
  if (!html.includes('property="og:title"') || !html.includes('name="twitter:card"')) {
    failures.push("missing social metadata");
  }
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!jsonLdMatch) {
    failures.push("missing JSON-LD");
  } else {
    try {
      const structuredData = JSON.parse(jsonLdMatch[1]);
      if (structuredData["@type"] !== "CollectionPage") failures.push("unexpected JSON-LD page type");
      if (JSON.stringify(structuredData).match(/"@type"\s*:\s*"(?:AggregateRating|Review)"|guaranteed revenue/i)) failures.push("misleading JSON-LD");
    } catch {
      failures.push("invalid JSON-LD");
    }
  }
  if (!notFound.includes('content="noindex,follow"')) failures.push("404 page must be noindex");
  const sitemapLocation = sitemap.match(/<loc>([^<]+)<\/loc>/)?.[1];
  if (sitemapLocation !== "https://mars-tw.github.io/morning-operator/") failures.push("sitemap must use the canonical URL");
  if (!css.includes(":focus-visible") || !css.includes("prefers-reduced-motion")) {
    failures.push("missing focus or reduced-motion support");
  }
  for (const locale of requiredLocales) {
    if (!script.includes(`"${locale}"`)) failures.push(`missing locale ${locale}`);
  }
  for (const project of requiredProjects) {
    if (!script.includes(`"${project}"`)) failures.push(`missing project ${project}`);
  }
}

if (failures.length) {
  process.stderr.write(`Showcase verification failed:\n${failures.map((failure) => `- ${failure}`).join("\n")}\n`);
  process.exit(1);
}

process.stdout.write(`Verified ${requiredFiles.length} static files, ${requiredLocales.length} locales, and ${requiredProjects.length} project previews.\n`);
