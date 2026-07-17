import { runOneJob } from "../src/lib/automation";

const once = process.argv.includes("--once");

async function main() {
  do {
    const processed = await runOneJob();
    if (once) return;
    if (!processed) await new Promise((resolve) => setTimeout(resolve, 2000));
  } while (true);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});

