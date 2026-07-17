import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { encoding: "utf8" })
  .split(/\r?\n/).filter(Boolean);
const patterns = [
  /sk-[A-Za-z0-9_-]{20,}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /(?:api[_-]?key|access[_-]?token|client[_-]?secret)\s*[:=]\s*["'][^"']{12,}["']/i
];
const findings: string[] = [];
for (const file of files) {
  const fullPath = path.resolve(process.cwd(), file);
  if (!fs.statSync(fullPath).isFile() || fs.statSync(fullPath).size > 1_000_000) continue;
  const content = fs.readFileSync(fullPath, "utf8");
  for (const pattern of patterns) if (pattern.test(content)) findings.push(`${file}: ${pattern.source}`);
}
if (findings.length) throw new Error(`Potential secrets found:\n${findings.join("\n")}`);
process.stdout.write(`Scanned ${files.length} files; no high-confidence secrets found.\n`);
