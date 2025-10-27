import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { TraversalMode, WorkflowEdge, WorkflowNode } from "@/types/workflow";

interface WorkflowPayload {
  name: string;
  description?: string;
  traversalMode: TraversalMode;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export async function GET() {
  const workflows = await prisma.workflow.findMany({
    include: { nodes: true, edges: true },
    orderBy: { updatedAt: "desc" },
    take: 20
  });
  return NextResponse.json({ workflows });
}

export async function POST(request: Request) {
  const body = (await request.json()) as WorkflowPayload;

  const workflow = await prisma.workflow.create({
    data: {
      name: body.name,
      description: body.description,
      traversal: body.traversalMode === "bfs" ? "BFS" : "DFS",
      nodes: {
        create: body.nodes.map((node) => ({
          label: node.label,
          kind: mapNodeKind(node.kind),
          positionX: node.position.x,
          positionY: node.position.y
        }))
      },
      edges: {
        create: body.edges.map((edge) => ({
          sourceId: edge.sourceId,
          targetId: edge.targetId
        }))
      }
    }
  });

  return NextResponse.json({ workflow }, { status: 201 });
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
