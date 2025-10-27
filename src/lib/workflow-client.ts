"use server";

import { revalidatePath } from "next/cache";
import { NodeKind as PrismaNodeKind, TraversalMode as PrismaTraversalMode } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { TraversalMode, WorkflowEdge, WorkflowNode } from "@/types/workflow";

interface PersistPayload {
  id?: string;
  name: string;
  description?: string;
  traversalMode: TraversalMode;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export async function saveWorkflow(payload: PersistPayload) {
  if (payload.id) {
    await prisma.workflow.update({
      where: { id: payload.id },
      data: buildWorkflowUpdate(payload)
    });
  } else {
    await prisma.workflow.create({
      data: buildWorkflowCreate(payload)
    });
  }
  revalidatePath("/workflows");
}

export async function loadWorkflow(id: string) {
  const workflow = await prisma.workflow.findUnique({
    where: { id },
    include: { nodes: true, edges: true }
  });
  if (!workflow) {
    throw new Error("Workflow not found");
  }
  return {
    id: workflow.id,
    name: workflow.name,
    description: workflow.description ?? "",
    traversalMode: workflow.traversal === "BFS" ? "bfs" : "dfs",
  nodes: workflow.nodes.map((node: (typeof workflow.nodes)[number]) => ({
      id: node.id,
      label: node.label,
      kind: node.kind.toLowerCase() as WorkflowNode["kind"],
      position: { x: node.positionX, y: node.positionY }
    })),
  edges: workflow.edges.map((edge: (typeof workflow.edges)[number]) => ({
      id: edge.id,
      sourceId: edge.sourceId,
      targetId: edge.targetId
    }))
  } satisfies PersistPayload & { id: string };
}

function buildWorkflowCreate(payload: PersistPayload) {
  return {
    name: payload.name,
    description: payload.description,
  traversal: mapTraversal(payload.traversalMode),
    nodes: {
      create: payload.nodes.map((node) => ({
        label: node.label,
  kind: mapNodeKind(node.kind),
        positionX: node.position.x,
        positionY: node.position.y
      }))
    },
    edges: {
      create: payload.edges.map((edge) => ({
        sourceId: edge.sourceId,
        targetId: edge.targetId
      }))
    }
  };
}

function buildWorkflowUpdate(payload: PersistPayload) {
  return {
    name: payload.name,
    description: payload.description,
  traversal: mapTraversal(payload.traversalMode),
    nodes: {
      deleteMany: {},
      create: payload.nodes.map((node) => ({
        label: node.label,
        kind: mapNodeKind(node.kind),
        positionX: node.position.x,
        positionY: node.position.y
      }))
    },
    edges: {
      deleteMany: {},
      create: payload.edges.map((edge) => ({
        sourceId: edge.sourceId,
        targetId: edge.targetId
      }))
    }
  };
}

function mapTraversal(mode: TraversalMode): PrismaTraversalMode {
  return mode === "bfs" ? PrismaTraversalMode.BFS : PrismaTraversalMode.DFS;
}

function mapNodeKind(kind: WorkflowNode["kind"]): PrismaNodeKind {
  switch (kind) {
    case "trigger":
      return PrismaNodeKind.TRIGGER;
    case "logic":
      return PrismaNodeKind.LOGIC;
    default:
      return PrismaNodeKind.ACTION;
  }
}
