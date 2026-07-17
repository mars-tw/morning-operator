import { drainJobs } from "../src/lib/automation";

drainJobs().then((count) => process.stdout.write(`${count}\n`)).catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
