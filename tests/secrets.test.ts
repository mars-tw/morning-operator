import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { hasSecretConfiguration, readSecret } from "@/lib/secrets";

const directories: string[] = [];

afterEach(() => {
  for (const directory of directories.splice(0)) fs.rmSync(directory, { recursive: true, force: true });
});

describe("secret loading", () => {
  it("supports a direct secret without returning it from readiness checks", () => {
    const environment = { PAYMENT_SECRET: "direct-secret" };
    expect(hasSecretConfiguration("PAYMENT_SECRET", environment)).toBe(true);
    expect(readSecret("PAYMENT_SECRET", environment)).toBe("direct-secret");
  });

  it("supports Docker-style secret files", () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "autopilot-secret-"));
    directories.push(directory);
    const secretPath = path.join(directory, "provider_secret");
    fs.writeFileSync(secretPath, "file-secret\n", { encoding: "utf8", mode: 0o600 });
    const environment = { PAYMENT_SECRET_FILE: secretPath };
    expect(hasSecretConfiguration("PAYMENT_SECRET", environment)).toBe(true);
    expect(readSecret("PAYMENT_SECRET", environment)).toBe("file-secret");
  });
});
