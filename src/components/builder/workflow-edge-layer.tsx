"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { WorkflowEdge, WorkflowNode } from "@/types/workflow";
import { useWorkflowStore } from "@/hooks/use-workflow-store";
import type { Theme } from "@/components/providers/theme-provider";

interface EdgeLayerProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  theme: Theme;
}

export function WorkflowEdgeLayer({ nodes, edges, theme }: EdgeLayerProps) {
  const activePreviewPath = useWorkflowStore((state) => state.activePreviewPath);
  const activeEdges = useMemo(() => buildActiveSet(activePreviewPath), [activePreviewPath]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, WorkflowNode>();
    for (const node of nodes) {
      map.set(node.id, node);
    }
    return map;
  }, [nodes]);

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full">
      <defs>
        <motion.linearGradient id="edge-gradient" gradientUnits="userSpaceOnUse">
          <stop
            offset="0%"
            stopColor={theme === "light" ? "rgba(79,70,229,0.5)" : "rgba(255,255,255,0.4)"}
          />
          <stop
            offset="100%"
            stopColor={theme === "light" ? "rgba(79,70,229,0.2)" : "rgba(255,255,255,0.1)"}
          />
        </motion.linearGradient>
      </defs>
      {edges.map((edge) => {
        const source = nodeMap.get(edge.sourceId);
        const target = nodeMap.get(edge.targetId);
        if (!source || !target) return null;
        const path = buildCurve(source.position, target.position);
        const isActive = activeEdges.has(edge.sourceId + edge.targetId);
        return (
          <motion.path
            key={edge.id}
            d={path}
            stroke="url(#edge-gradient)"
            strokeWidth={isActive ? 4 : 2}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6 }}
            className={
              theme === "light"
                ? "drop-shadow-[0_0_10px_rgba(79,70,229,0.25)]"
                : "drop-shadow-[0_0_8px_rgba(255,255,255,0.12)]"
            }
          />
        );
      })}
    </svg>
  );
}

const CARD_WIDTH = 256;
const HORIZONTAL_OFFSET = 12;
const VERTICAL_PADDING = 32;

function buildCurve(
  source: WorkflowNode["position"],
  target: WorkflowNode["position"]
) {
  const sourceX = source.x + CARD_WIDTH - HORIZONTAL_OFFSET;
  const sourceY = source.y + VERTICAL_PADDING;
  const targetX = target.x + HORIZONTAL_OFFSET;
  const targetY = target.y + VERTICAL_PADDING;
  const controlOffset = Math.max(Math.abs(targetX - sourceX) * 0.4, 60);
  const control1X = sourceX + controlOffset;
  const control1Y = sourceY;
  const control2X = targetX - controlOffset;
  const control2Y = targetY;
  return `M ${sourceX} ${sourceY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${targetX} ${targetY}`;
}

function buildActiveSet(path: string[]) {
  const set = new Set<string>();
  for (let index = 0; index < path.length - 1; index += 1) {
    set.add(path[index] + path[index + 1]);
  }
  return set;
}
