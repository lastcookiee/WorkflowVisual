"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useWorkflowStore } from "@/hooks/use-workflow-store";
import type { WorkflowNode } from "@/types/workflow";

const PREVIEW_INTERVAL = 900;

export function PreviewTimeline() {
  const previewPath = useWorkflowStore((state) => state.previewPath);
  const nodes = useWorkflowStore((state) => state.nodes);
  const isPreviewing = useWorkflowStore((state) => state.isPreviewing);
  const setPreviewing = useWorkflowStore((state) => state.setPreviewing);
  const setActivePreview = useWorkflowStore((state) => state.setActivePreview);

  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    if (!isPreviewing || previewPath.length === 0) {
      return;
    }
    setStep(0);
    const interval = window.setInterval(() => {
  setStep((current: number) => {
        const next = current + 1;
        if (next >= previewPath.length) {
          window.clearInterval(interval);
          setPreviewing(false);
          return current;
        }
        return next;
      });
    }, PREVIEW_INTERVAL);

    return () => window.clearInterval(interval);
  }, [isPreviewing, previewPath.length, setPreviewing]);

  useEffect(() => {
    if (previewPath.length === 0) {
      return;
    }
    setActivePreview(previewPath.slice(0, step + 1));
  }, [previewPath, setActivePreview, step]);

  const trail = useMemo(() => {
  const map = new Map(previewPath.map((id: string, index: number) => [id, index]));
  return nodes.map((node: WorkflowNode) => map.get(node.id) ?? -1);
  }, [nodes, previewPath]);

  if (!previewPath.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white/80 p-4 text-xs text-slate-600 shadow-lg transition-colors dark:border-white/10 dark:bg-white/[0.02] dark:text-white/60 dark:shadow-ambient">
      <div className="mb-3 flex items-center justify-between">
        <span className="uppercase tracking-[0.3em] text-slate-500 dark:text-white/50">Preview path</span>
        <span>
          Step {Math.min(step + 1, previewPath.length)} / {previewPath.length}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
  {previewPath.map((id: string, index: number) => (
          <motion.span
            key={id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wide transition-colors ${
              index <= step
                ? "border-indigo-300 bg-indigo-100 text-indigo-700 dark:border-white/60 dark:bg-white/10 dark:text-white"
                : "border-black/10 bg-white/70 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-white/50"
            }`}
          >
            {id.slice(0, 6)}
          </motion.span>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
  {nodes.map((node: WorkflowNode, index: number) => (
          <motion.div
            key={node.id}
            className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-wide transition-colors ${
              trail[index] !== -1
                ? "bg-indigo-100 text-indigo-700 dark:bg-white/10 dark:text-white"
                : "bg-white/70 text-slate-400 dark:bg-white/5 dark:text-white/40"
            }`}
          >
            {node.label}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
