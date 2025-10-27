import { describe, expect, it } from "vitest";
import { traverseGraph } from "@/lib/graph";
import type { WorkflowEdge, WorkflowNode } from "@/types/workflow";

describe("traverseGraph", () => {
  const nodes: WorkflowNode[] = [
    { id: "a", label: "A", kind: "trigger", position: { x: 0, y: 0 } },
    { id: "b", label: "B", kind: "action", position: { x: 0, y: 0 } },
    { id: "c", label: "C", kind: "action", position: { x: 0, y: 0 } },
    { id: "d", label: "D", kind: "logic", position: { x: 0, y: 0 } }
  ];

  const edges: WorkflowEdge[] = [
    { id: "ab", sourceId: "a", targetId: "b" },
    { id: "ac", sourceId: "a", targetId: "c" },
    { id: "cd", sourceId: "c", targetId: "d" }
  ];

  it("performs breadth-first traversal", () => {
    const path = traverseGraph(nodes, edges, "a", "bfs");
    expect(path).toEqual(["a", "b", "c", "d"]);
  });

  it("performs depth-first traversal", () => {
    const path = traverseGraph(nodes, edges, "a", "dfs");
    expect(path).toEqual(["a", "c", "d", "b"]);
  });

  it("handles missing start node", () => {
    const path = traverseGraph(nodes, edges, "missing", "dfs");
    expect(path).toEqual([]);
  });
});
