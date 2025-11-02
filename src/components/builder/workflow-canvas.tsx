"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { useWorkflowStore } from "@/hooks/use-workflow-store";
import { WorkflowNodeCard } from "@/components/builder/workflow-node-card";
import { WorkflowEdgeLayer } from "@/components/builder/workflow-edge-layer";
import { useTheme } from "@/components/providers/theme-provider";
import type { Theme } from "@/components/providers/theme-provider";

export const WorkflowCanvas = memo(function WorkflowCanvas() {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const loadFromDraft = useWorkflowStore((state) => state.loadFromDraft);
  const setSelectedNode = useWorkflowStore((state) => state.setSelectedNode);
  const { theme } = useTheme();

  useEffect(() => {
    if (nodes.length || edges.length) {
      return;
    }
    loadFromDraft();
  }, [edges.length, loadFromDraft, nodes.length]);

  const handleCanvasClick = useCallback(() => {
    setSelectedNode(undefined);
  }, [setSelectedNode]);

  const canvasSkin =
    theme === "light"
      ? "border-slate-200/80 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 shadow-xl"
      : "border-white/10 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 shadow-ambient";

  return (
    <div
      className={`relative h-full min-h-[60vh] w-full touch-none overflow-hidden rounded-3xl border transition-colors duration-500 sm:min-h-[70vh] sm:touch-auto md:min-h-[min(900px,80vh)] ${canvasSkin}`}
      onPointerDown={handleCanvasClick}
    >
      <BackdropGrid theme={theme} />
      <WorkflowEdgeLayer theme={theme} nodes={nodes} edges={edges} />
      {nodes.map((node) => (
        <WorkflowNodeCard key={node.id} node={node} />
      ))}
    </div>
  );
});

const GRID_SIZE = 40;

function BackdropGrid({ theme }: { theme: Theme }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || typeof ResizeObserver === "undefined") return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawGrid(context, canvas.width, canvas.height, theme);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    return () => observer.disconnect();
  }, [theme]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_center,_rgba(0,0,0,0.8)_0%,_transparent_70%)]"
    />
  );
}

function drawGrid(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: Theme
) {
  context.clearRect(0, 0, width, height);
  context.strokeStyle = theme === "light" ? "rgba(148,163,184,0.25)" : "rgba(255,255,255,0.05)";
  context.lineWidth = 1;

  const cols = Math.ceil(width / GRID_SIZE);
  const rows = Math.ceil(height / GRID_SIZE);

  for (let col = 0; col <= cols; col += 1) {
    const x = col * GRID_SIZE;
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }

  for (let row = 0; row <= rows; row += 1) {
    const y = row * GRID_SIZE;
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }
}
