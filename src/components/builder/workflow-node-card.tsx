"use client";

import {
  useCallback,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type FocusEvent
} from "react";
import { motion } from "framer-motion";
import { Handle } from "@/components/builder/workflow-node-handle";
import { useWorkflowStore } from "@/hooks/use-workflow-store";
import type { WorkflowNode } from "@/types/workflow";
import { useTheme } from "@/components/providers/theme-provider";

interface NodeCardProps {
  node: WorkflowNode;
}

export function WorkflowNodeCard({ node }: NodeCardProps) {
  const setSelectedNode = useWorkflowStore((state) => state.setSelectedNode);
  const updateNode = useWorkflowStore((state) => state.updateNode);
  const removeNode = useWorkflowStore((state) => state.removeNode);
  const persistDraft = useWorkflowStore((state) => state.persistDraft);
  const activePreviewPath = useWorkflowStore((state) => state.activePreviewPath);
  const connectSourceId = useWorkflowStore((state) => state.connectSourceId);
  const startConnection = useWorkflowStore((state) => state.startConnection);
  const completeConnection = useWorkflowStore((state) => state.completeConnection);
  const isActive = activePreviewPath.includes(node.id);
  const { theme } = useTheme();

  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setDragging] = useState(false);

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const interactiveTarget = (event.target as HTMLElement | null)?.closest("input, textarea, button");
    if (interactiveTarget) {
      setSelectedNode(node.id);
      return;
    }

    event.preventDefault();
    setSelectedNode(node.id);
    setDragging(true);
    const pointerId = event.pointerId;
    if (typeof card.setPointerCapture === "function") {
      try {
        card.setPointerCapture(pointerId);
      } catch (error) {
        // Pointer capture can fail on some browsers; ignore silently.
      }
    }

    const startX = event.clientX;
    const startY = event.clientY;
    const initialX = node.position.x;
    const initialY = node.position.y;
    const container = card.parentElement as HTMLElement | null;
    const containerWidth = container?.clientWidth ?? Number.POSITIVE_INFINITY;
    const containerHeight = container?.clientHeight ?? Number.POSITIVE_INFINITY;
    const dynamicPadding = Number.isFinite(containerWidth)
      ? Math.max(12, Math.min(28, (containerWidth as number) * 0.05))
      : 16;
    const dynamicVerticalPadding = Number.isFinite(containerHeight)
      ? Math.max(16, Math.min(48, (containerHeight as number) * 0.06))
      : 24;
    const cardWidth = card.offsetWidth;
    const cardHeight = card.offsetHeight;
    const minX = dynamicPadding;
    const minY = dynamicVerticalPadding;
    const maxX = Number.isFinite(containerWidth)
      ? Math.max(minX, (containerWidth as number) - cardWidth - dynamicPadding)
      : Number.POSITIVE_INFINITY;
    const maxY = Number.isFinite(containerHeight)
      ? Math.max(minY, (containerHeight as number) - cardHeight - dynamicVerticalPadding)
      : Number.POSITIVE_INFINITY;
    const clamp = (value: number, min: number, max: number) =>
      Number.isFinite(max) ? Math.min(Math.max(value, min), max) : Math.max(value, min);

    let frame = 0;

    const handleMove = (moveEvent: PointerEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;
        const nextX = clamp(initialX + deltaX, minX, maxX);
        const nextY = clamp(initialY + deltaY, minY, maxY);
        updateNode(
          node.id,
          {
            position: {
              x: nextX,
              y: nextY
            }
          },
          { persist: false }
        );
      });
    };

    const handleUp = () => {
      setDragging(false);
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
      persistDraft();
      if (typeof card.releasePointerCapture === "function" && card.hasPointerCapture?.(pointerId)) {
        try {
          card.releasePointerCapture(pointerId);
        } catch (error) {
          // Ignore pointer capture release failures.
        }
      }
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  }, [node.id, node.position.x, node.position.y, persistDraft, setSelectedNode, updateNode]);

  const handleDelete = useCallback(() => {
    removeNode(node.id);
  }, [node.id, removeNode]);

  const handleConnectClick = useCallback(() => {
    if (connectSourceId) {
      completeConnection(node.id);
    } else {
      startConnection(node.id);
    }
  }, [completeConnection, connectSourceId, node.id, startConnection]);

  const activeRingColor = theme === "light" ? "rgba(79,70,229,0.35)" : "rgba(255,255,255,0.4)";

  return (
    <motion.div
      ref={cardRef}
      initial={false}
      animate={{ scale: isDragging ? 1.02 : 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 520, damping: 40, mass: 0.35 }}
      onPointerDown={handlePointerDown}
      className="group absolute flex w-[9.75rem] cursor-grab select-none touch-none flex-col gap-2 rounded-2xl border border-black/10 bg-white/90 p-3 text-slate-700 shadow-lg transition-colors focus:outline-none dark:border-white/10 dark:bg-white/[0.05] dark:text-white sm:w-[11.5rem] lg:w-64 lg:p-4 sm:touch-auto"
      style={{
        left: node.position.x,
        top: node.position.y,
        boxShadow: isActive ? `0 0 0 2px ${activeRingColor}` : undefined
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.3em] text-slate-500 dark:text-white/50">
          {node.kind}
        </span>
        <button
          type="button"
          onClick={handleDelete}
          className="rounded-full border border-black/10 px-2 py-0.5 text-[10px] text-slate-500 opacity-0 transition group-hover:opacity-100 hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:text-white/50 dark:hover:border-white/40 dark:hover:text-white"
        >
          Delete
        </button>
      </div>
      <input
        aria-label="Node label"
        defaultValue={node.label}
        onBlur={(event: FocusEvent<HTMLInputElement>) =>
          updateNode(node.id, { label: event.target.value })
        }
        className="w-full rounded-xl border border-black/10 bg-white px-2.5 py-1.5 text-xs text-slate-700 shadow-inner outline-none transition-colors focus:border-indigo-300 focus:text-slate-900 touch-auto dark:border-white/10 dark:bg-white/10 dark:text-white/80 dark:focus:border-white/40 dark:focus:text-white lg:text-sm"
      />
      <div className="flex items-center justify-between">
        <Handle side="left" nodeId={node.id} />
        <button
          type="button"
          onClick={handleConnectClick}
          className="rounded-full border border-black/10 px-2.5 py-1 text-[10px] text-slate-600 transition hover:border-indigo-200 hover:text-indigo-700 dark:border-white/10 dark:text-white/70 dark:hover:border-white/40 dark:hover:text-white lg:px-3 lg:text-xs"
        >
          {connectSourceId ? "Connect" : "Link"}
        </button>
        <Handle side="right" nodeId={node.id} />
      </div>
    </motion.div>
  );
}
