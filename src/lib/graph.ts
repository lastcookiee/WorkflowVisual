import type { TraversalMode, WorkflowEdge, WorkflowNode } from "@/types/workflow";

export interface TraversalResult {
  path: string[];
  visited: string[];
}

export function traverseGraph(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  startId: string,
  mode: TraversalMode
): string[] {
  const adjacency = buildAdjacency(edges);
  const visited = new Set<string>();
  const order: string[] = [];

  if (!adjacency.has(startId) && !nodes.some((n) => n.id === startId)) {
    return order;
  }

  if (mode === "bfs") {
    bfs(startId, adjacency, visited, order);
  } else {
    dfs(startId, adjacency, visited, order);
  }
  return order;
}

function buildAdjacency(edges: WorkflowEdge[]): Map<string, string[]> {
  const adjacency = new Map<string, string[]>();
  for (const edge of edges) {
    const list = adjacency.get(edge.sourceId) || [];
    list.push(edge.targetId);
    adjacency.set(edge.sourceId, list);
    if (!adjacency.has(edge.targetId)) {
      adjacency.set(edge.targetId, []);
    }
  }
  return adjacency;
}

function bfs(
  start: string,
  adjacency: Map<string, string[]>,
  visited: Set<string>,
  order: string[]
) {
  const queue: string[] = [start];
  visited.add(start);
  while (queue.length) {
    const node = queue.shift()!;
    order.push(node);
    const neighbors = adjacency.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}

function dfs(
  start: string,
  adjacency: Map<string, string[]>,
  visited: Set<string>,
  order: string[]
) {
  const stack: string[] = [start];
  while (stack.length) {
    const node = stack.pop()!;
    if (visited.has(node)) {
      continue;
    }
    visited.add(node);
    order.push(node);
    const neighbors = adjacency.get(node) || [];
    for (let index = neighbors.length - 1; index >= 0; index -= 1) {
      const neighbor = neighbors[index];
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
      }
    }
  }
}
