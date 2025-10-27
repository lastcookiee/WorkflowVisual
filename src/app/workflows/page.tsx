import { Suspense } from "react";
import { WorkflowList } from "@/components/workflows/workflow-list";

export default function WorkflowsPage() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 pb-20 pt-12">
      <div className="flex items-center justify-between">
        <div className="space-y-2 text-slate-700 transition-colors dark:text-white">
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Workflows</h1>
          <p className="text-sm text-slate-600 dark:text-white/60">
            Manage saved workflows, clone templates, and relaunch execution previews.
          </p>
        </div>
      </div>
      <Suspense fallback={<span className="text-slate-500 dark:text-white/50">Loading workflows…</span>}>
        <WorkflowList />
      </Suspense>
    </section>
  );
}
