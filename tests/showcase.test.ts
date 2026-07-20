import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const showcaseRoot = path.resolve(process.cwd(), "public/showcase");
const read = (file: string) => fs.readFileSync(path.join(showcaseRoot, file), "utf8");

describe("open project preview gallery", () => {
  it("ships a standalone relative-asset site with four locales and four projects", () => {
    const html = read("index.html");
    const script = read("app.js");
    expect(html).toContain('href="./styles.css"');
    expect(html).toContain('src="./app.js"');
    for (const locale of ["en", "zh-TW", "ja", "es"]) expect(script).toContain(`"${locale}"`);
    for (const project of ["web-studio", "appointment", "creator-kit", "groupbuy-board"]) {
      expect(script).toContain(`"${project}"`);
    }
  });

  it("has no collection surface, network client, persistence, or unsafe HTML sink", () => {
    const source = `${read("index.html")}\n${read("app.js")}`;
    expect(source).not.toMatch(/<\s*(?:form|input|textarea|select)\b/i);
    expect(source).not.toMatch(/\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon)\b/);
    expect(source).not.toMatch(/\b(?:localStorage|sessionStorage|indexedDB|document\.cookie)\b/);
    expect(source).not.toMatch(/\b(?:innerHTML|outerHTML|insertAdjacentHTML)\b/);
  });

  it("keeps the synthetic preview and accessibility boundaries visible", () => {
    const html = read("index.html");
    const css = read("styles.css");
    expect(html).toContain("Synthetic data only");
    expect(html).toContain("Nothing is submitted, saved, booked, purchased, or sent");
    expect(css).toContain(":focus-visible");
    expect(css).toContain("prefers-reduced-motion");
    expect(css).toContain("@media (max-width: 720px)");
  });

  it("publishes only the static showcase directory with official Pages actions", () => {
    const workflow = fs.readFileSync(path.resolve(process.cwd(), ".github/workflows/pages.yml"), "utf8");
    expect(workflow).toContain("actions/configure-pages@v5");
    expect(workflow).toContain("actions/upload-pages-artifact@v4");
    expect(workflow).toContain("actions/deploy-pages@v4");
    expect(workflow).toContain("path: public/showcase");
    expect(workflow).toContain("pages: write");
    expect(workflow).toContain("id-token: write");
  });
});
