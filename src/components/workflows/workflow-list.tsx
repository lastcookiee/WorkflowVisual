import { cache } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";

const getWorkflows = cache(async () => {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  const workflows = await prisma.workflow.findMany({
    include: {
      nodes: true,
      edges: true
    },
    orderBy: { updatedAt: "desc" },
    take: 12
  });
  return workflows;
});

export async function WorkflowList() {
  const workflows = await getWorkflows();

  if (!workflows.length) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white/80 p-10 text-center text-slate-600 shadow-lg transition-colors dark:border-white/10 dark:bg-white/[0.02] dark:text-white/60 dark:shadow-ambient">
        No workflows saved yet. Create one in the builder to sync it here.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {workflows.map((workflow: Awaited<ReturnType<typeof getWorkflows>>[number]) => (
        <article
          key={workflow.id}
          className="rounded-3xl border border-black/10 bg-white/80 p-6 text-slate-700 shadow-lg transition-colors dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:shadow-ambient"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{workflow.name}</h2>
            <span className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-white/40">
              {workflow.traversal}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-white/60">
            {workflow.description ?? "Workflow synced from visual builder."}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-white/40">
            <span>
              {workflow.nodes.length} nodes · {workflow.edges.length} edges
            </span>
            <span>{formatDistanceToNow(workflow.updatedAt, { addSuffix: true })}</span>
          </div>
          <Link
            href={`/builder?workflow=${workflow.id}`}
            className="mt-4 inline-flex items-center text-xs uppercase tracking-[0.3em] text-indigo-600 transition hover:text-indigo-500 dark:text-white/60 dark:hover:text-white"
          >
            Open in builder
          </Link>
        </article>
      ))}
    </div>
  );
}
