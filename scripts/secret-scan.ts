import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { encoding: "utf8" })
  .split(/\r?\n/).filter(Boolean);
const forbiddenPaths = [
  { name: "environment file", pattern: /(^|\/)\.env(?:\.|$)/i, allow: /(^|\/)\.env\.example$/i },
  { name: "private key or keystore", pattern: /\.(?:pem|key|p12|pfx|jks|keystore)$/i },
  { name: "database file", pattern: /\.(?:db|db-wal|db-shm|sqlite|sqlite3)$/i }
] as const;

const signatures = [
  { name: "OpenAI-style API key", pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/ },
  { name: "private key", pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: "GitHub token", pattern: /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/ },
  { name: "AWS access key", pattern: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/ },
  { name: "Google API key", pattern: /\bAIza[0-9A-Za-z_-]{35}\b/ },
  { name: "Slack token", pattern: /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/ },
  { name: "Stripe live key", pattern: /\b(?:sk|rk)_live_[A-Za-z0-9]{16,}\b/ },
  { name: "SendGrid API key", pattern: /\bSG\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,}\b/ },
  { name: "credential-bearing database URL", pattern: /\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?):\/\/[^\s:@/]+:[^\s@/]+@/i },
  { name: "hard-coded authorization header", pattern: /authorization\s*[:=]\s*["']Bearer\s+[A-Za-z0-9._~+/-]{16,}["']/i },
  { name: "generic hard-coded credential", pattern: /(?:api[_-]?key|access[_-]?token|client[_-]?secret)\s*[:=]\s*["'][^"']{12,}["']/i }
] as const;
const findings: string[] = [];
for (const file of files) {
  const normalized = file.replaceAll("\\", "/");
  for (const rule of forbiddenPaths) {
    if (rule.pattern.test(normalized) && !("allow" in rule && rule.allow.test(normalized))) {
      findings.push(`${file}: forbidden ${rule.name}`);
    }
  }
  const fullPath = path.resolve(process.cwd(), file);
  if (!fs.statSync(fullPath).isFile() || fs.statSync(fullPath).size > 1_000_000) continue;
  const content = fs.readFileSync(fullPath, "utf8");
  for (const signature of signatures) {
    if (signature.pattern.test(content)) findings.push(`${file}: possible ${signature.name}`);
  }
}
if (findings.length) throw new Error(`Potential secrets found:\n${findings.join("\n")}`);
process.stdout.write(`Scanned ${files.length} files; no high-confidence secrets found.\n`);
