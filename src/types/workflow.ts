export type NodeKind = "trigger" | "action" | "logic";

export interface WorkflowNode {
  id: string;
  label: string;
  kind: NodeKind;
  position: {
    x: number;
    y: number;
  };
}

export interface WorkflowEdge {
  id: string;
  sourceId: string;
  targetId: string;
}

export interface WorkflowSnapshot {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: Date;
  updatedAt: Date;
}

export type TraversalMode = "bfs" | "dfs";
