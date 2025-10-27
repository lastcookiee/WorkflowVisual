"use server";

import { cookies } from "next/headers";
import { saveWorkflow } from "@/lib/workflow-client";
import type { TraversalMode, WorkflowEdge, WorkflowNode } from "@/types/workflow";

interface SavePayload {
  id?: string;
  name: string;
  description?: string;
  traversalMode: TraversalMode;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export async function persistWorkflow(payload: SavePayload) {
  const jar = cookies();
  jar.set("workflow-last-saved", new Date().toISOString(), {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax"
  });
  await saveWorkflow(payload);
}
