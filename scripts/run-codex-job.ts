import { markBuildStarted } from "../src/lib/repository";
import { runApprovedCodexJob } from "../src/lib/codex-runner";

const [jobId, projectId] = process.argv.slice(2);
if (!jobId || !projectId) {
  throw new Error("Usage: pnpm tsx scripts/run-codex-job.ts <job-id> <project-id>");
}

markBuildStarted(projectId);
runApprovedCodexJob(jobId, projectId)
  .then((result) => process.stdout.write(`${JSON.stringify(result, null, 2)}\n`))
  .catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
    process.exitCode = 1;
  });

