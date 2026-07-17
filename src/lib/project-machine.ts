import type { ProjectState } from "./contracts";

const transitions: Record<ProjectState, readonly ProjectState[]> = {
  paid: ["spec_draft"],
  spec_draft: ["spec_approval"],
  spec_approval: ["spec_draft", "build_queued"],
  build_queued: ["building"],
  building: ["qa_failed", "qa_passed"],
  qa_failed: ["build_queued"],
  qa_passed: ["deploy_approval"],
  deploy_approval: ["qa_passed", "delivered"],
  delivered: []
};

export function assertProjectTransition(from: ProjectState, to: ProjectState): void {
  if (!transitions[from]?.includes(to)) {
    throw new Error(`Invalid project transition: ${from} -> ${to}`);
  }
}

