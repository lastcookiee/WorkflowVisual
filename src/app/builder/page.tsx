"use client";

import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { WorkflowCanvas } from "@/components/builder/workflow-canvas";
import { BuilderControls } from "@/components/builder/builder-controls";
import { PreviewTimeline } from "@/components/builder/preview-timeline";
import { SettingsPanel } from "@/components/builder/settings-panel";
import { useWorkflowStore } from "@/hooks/use-workflow-store";

export default function BuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="px-6 pt-12 text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-white/50">
          Loading builder…
        </div>
      }
    >
      <BuilderPageContent />
    </Suspense>
  );
}

function BuilderPageContent() {
  const loadFromDraft = useWorkflowStore((state) => state.loadFromDraft);
  const hydrate = useWorkflowStore((state) => state.hydrate);
  const params = useSearchParams();
  const [loadingWorkflow, setLoadingWorkflow] = useState(false);

  useEffect(() => {
    loadFromDraft();
  }, [loadFromDraft]);

  useEffect(() => {
    const workflowId = params.get("workflow");
    if (!workflowId) {
      return;
    }
    setLoadingWorkflow(true);
    fetch(`/api/workflows/${workflowId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data?.workflow) {
          hydrate(data.workflow.nodes, data.workflow.edges);
        }
      })
      .finally(() => setLoadingWorkflow(false));
  }, [hydrate, params]);

  return (
    <section className="relative flex min-h-screen w-full flex-col gap-6 px-6 pb-16 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col gap-3"
      >
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
          Visual Workflow Studio
        </h1>
        <p className="max-w-3xl text-sm text-slate-600 dark:text-white/60">
          Drag nodes, connect edges, and preview traversal in a live canvas. The workspace now lives edge-to-edge so
          you can stay immersed while you build.
        </p>
      </motion.div>
      <BuilderControls />
      <div className="relative flex flex-1 flex-col gap-6">
        {loadingWorkflow && (
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-white/40">
            Loading workflow…
          </span>
        )}
        <WorkflowCanvas />
      </div>
      <PreviewTimeline />
    </section>
  );
}
