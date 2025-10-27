"use client";

import { motion } from "framer-motion";
import { useWorkflowStore } from "@/hooks/use-workflow-store";

interface HandleProps {
  side: "left" | "right";
  nodeId: string;
}

export function Handle({ side, nodeId }: HandleProps) {
  const setSelectedNode = useWorkflowStore((state) => state.setSelectedNode);

  const handleClick = () => {
    setSelectedNode(nodeId);
  };

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.92 }}
      onClick={handleClick}
      className="relative h-5 w-5 rounded-full border border-black/10 bg-white/70 text-transparent transition hover:border-indigo-200 dark:border-white/10 dark:bg-white/10 dark:hover:border-white/40"
      aria-label={`${side} handle`}
    >
      <span className="absolute inset-1 rounded-full bg-indigo-200/60 transition dark:bg-white/30" />
    </motion.button>
  );
}
