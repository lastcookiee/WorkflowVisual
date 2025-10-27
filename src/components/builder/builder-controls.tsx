"use client";

import { useMemo, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { useWorkflowStore } from "@/hooks/use-workflow-store";
import type { TraversalMode } from "@/types/workflow";
import { persistWorkflow } from "@/app/builder/actions";

const nodeKinds: { label: string; kind: "trigger" | "action" | "logic" }[] = [
  { label: "Trigger", kind: "trigger" },
  { label: "Action", kind: "action" },
  { label: "Logic", kind: "logic" }
];

const traversalModes: { label: string; value: TraversalMode }[] = [
  { label: "Breadth-First", value: "bfs" },
  { label: "Depth-First", value: "dfs" }
];

export function BuilderControls() {
  const addNode = useWorkflowStore((state) => state.addNode);
  const reset = useWorkflowStore((state) => state.reset);
  const setTraversalMode = useWorkflowStore((state) => state.setTraversalMode);
  const traversalMode = useWorkflowStore((state) => state.traversalMode);
  const runTraversal = useWorkflowStore((state) => state.runTraversal);
  const setPreviewing = useWorkflowStore((state) => state.setPreviewing);
  const previewPath = useWorkflowStore((state) => state.previewPath);
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const persistDraft = useWorkflowStore((state) => state.persistDraft);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const stats = useMemo(() => ({
    totalNodes: previewPath.length,
    lastRun: previewPath.at(-1)
  }), [previewPath]);

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-black/10 bg-white/80 px-6 py-4 text-sm text-slate-600 shadow-lg backdrop-blur-md transition-colors dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:shadow-ambient">
      <div className="flex flex-wrap items-center gap-2">
        {nodeKinds.map((item) => (
          <motion.button
            key={item.kind}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => addNode(item.kind)}
            className="rounded-full border border-black/10 bg-white/80 px-4 py-2 text-xs uppercase tracking-wide text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/70 dark:hover:border-white/40 dark:hover:text-white"
          >
            Add {item.label}
          </motion.button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        {traversalModes.map((mode) => {
          const active = traversalMode === mode.value;
          return (
            <motion.button
              key={mode.value}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setTraversalMode(mode.value)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-wide transition ${
                active
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-white/70 dark:bg-white/10 dark:text-white"
                  : "border-black/10 bg-white/70 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/60"
              }`}
            >
              {mode.label}
            </motion.button>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            setPreviewing(true);
            const path = runTraversal();
            if (path.length === 0) {
              setPreviewing(false);
            }
          }}
          className="rounded-full border border-indigo-300 bg-indigo-600 px-6 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-md transition hover:bg-indigo-500 dark:border-indigo-400 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400"
        >
          Run Workflow
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          onClick={reset}
          className="rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-wide text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:text-white/60 dark:hover:border-white/40 dark:hover:text-white"
        >
          Reset
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          disabled={isPending}
          onClick={() => {
            const name = window.prompt("Workflow name", "Untitled Flow");
            if (!name) {
              return;
            }
            persistDraft();
            startTransition(async () => {
              try {
                await persistWorkflow({
                  name,
                  traversalMode,
                  nodes,
                  edges
                });
                setStatusMessage("Workflow saved");
                setTimeout(() => setStatusMessage(null), 2500);
              } catch (error) {
                console.error(error);
                setStatusMessage("Save failed");
              }
            });
          }}
          className="rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-wide text-slate-700 transition hover:border-slate-300 hover:text-slate-900 disabled:opacity-60 dark:border-white/20 dark:text-white dark:hover:border-white/60"
        >
          {isPending ? "Saving…" : "Save"}
        </motion.button>
      </div>
      <div className="ml-auto flex items-center gap-3 text-xs text-slate-500 dark:text-white/50">
        <span>{stats.totalNodes ? `${stats.totalNodes} nodes` : "No run yet"}</span>
        {stats.lastRun && <span>Last: {stats.lastRun}</span>}
        {statusMessage && <span className="text-slate-600 dark:text-white/60">{statusMessage}</span>}
      </div>
    </div>
  );
}
