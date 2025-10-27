import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { TraversalMode, WorkflowEdge, WorkflowNode } from "@/types/workflow";

interface WorkflowPayload {
  name?: string;
  description?: string;
  traversalMode?: TraversalMode;
  nodes?: WorkflowNode[];
  edges?: WorkflowEdge[];
}

export async function GET(_: Request, context: { params: { id: string } }) {
  const workflow = await prisma.workflow.findUnique({
    where: { id: context.params.id },
    include: { nodes: true, edges: true }
  });
  if (!workflow) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ workflow });
}

export async function PUT(request: Request, context: { params: { id: string } }) {
  const body = (await request.json()) as WorkflowPayload;

  const updated = await prisma.workflow.update({
    where: { id: context.params.id },
    data: {
      name: body.name,
      description: body.description,
      traversal: body.traversalMode ? mapTraversal(body.traversalMode) : undefined,
      nodes: body.nodes
        ? {
            deleteMany: {},
            create: body.nodes.map((node) => ({
              label: node.label,
              kind: mapNodeKind(node.kind),
              positionX: node.position.x,
              positionY: node.position.y
            }))
          }
        : undefined,
      edges: body.edges
        ? {
            deleteMany: {},
            create: body.edges.map((edge) => ({
              sourceId: edge.sourceId,
              targetId: edge.targetId
            }))
          }
        : undefined
    }
  });

  return NextResponse.json({ workflow: updated });
}

export async function DELETE(_: Request, context: { params: { id: string } }) {
  await prisma.workflow.delete({ where: { id: context.params.id } });
  return NextResponse.json({ status: "deleted" });
}

function mapTraversal(mode: TraversalMode) {
  return mode === "bfs" ? "BFS" : "DFS";
}

function mapNodeKind(kind: WorkflowNode["kind"]) {
  switch (kind) {
    case "trigger":
      return "TRIGGER";
    case "logic":
      return "LOGIC";
    default:
      return "ACTION";
  }
}
