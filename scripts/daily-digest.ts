import { enqueueJob } from "../src/lib/repository";

const jobId = enqueueJob("send_digest", null, { date: new Date().toISOString().slice(0, 10) }, 2);
process.stdout.write(`${jobId}\n`);
