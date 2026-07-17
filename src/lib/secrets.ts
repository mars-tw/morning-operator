import fs from "node:fs";

type Environment = Readonly<Record<string, string | undefined>>;

export function readSecret(name: string, environment: Environment = process.env): string {
  const direct = environment[name]?.trim();
  if (direct) return direct;
  const secretFile = environment[`${name}_FILE`]?.trim();
  if (!secretFile) return "";
  const stat = fs.statSync(secretFile);
  if (!stat.isFile() || stat.size > 16 * 1024) throw new Error(`Invalid secret file for ${name}`);
  return fs.readFileSync(secretFile, "utf8").trim();
}

export function hasSecretConfiguration(name: string, environment: Environment = process.env): boolean {
  return Boolean(environment[name]?.trim() || environment[`${name}_FILE`]?.trim());
}
