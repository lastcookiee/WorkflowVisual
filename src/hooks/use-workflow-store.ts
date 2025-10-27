"use client";

import { create, type StateCreator } from "zustand";
import type { TraversalMode, WorkflowEdge, WorkflowNode } from "@/types/workflow";
import { traverseGraph } from "@/lib/graph";

const LOCAL_STORAGE_KEY = "workflow-draft";

interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId?: string;
  connectSourceId?: string;
  traversalMode: TraversalMode;
  previewPath: string[];
  activePreviewPath: string[];
  isPreviewing: boolean;
  loadFromDraft: () => void;
  persistDraft: () => void;
  addNode: (kind?: WorkflowNode["kind"]) => string;
  updateNode: (
    id: string,
    updates: Partial<Omit<WorkflowNode, "id">>,
    options?: { persist?: boolean }
  ) => void;
  removeNode: (id: string) => void;
  startConnection: (nodeId: string) => void;
  completeConnection: (targetId: string) => void;
  removeEdge: (edgeId: string) => void;
  setSelectedNode: (id?: string) => void;
  setTraversalMode: (mode: TraversalMode) => void;
  runTraversal: () => string[];
  setActivePreview: (path: string[]) => void;
  setPreviewing: (previewing: boolean) => void;
  reset: () => void;
  hydrate: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => void;
}

const workflowStore: StateCreator<WorkflowState, [], [], WorkflowState> = (set, get) => ({
  nodes: [],
  edges: [],
  traversalMode: "bfs",
  previewPath: [],
  activePreviewPath: [],
  isPreviewing: false,
  loadFromDraft: () => {
    if (typeof window === "undefined") {
      return;
    }
    const draft = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!draft) {
      return;
    }
    try {
      const parsed = JSON.parse(draft) as { nodes: WorkflowNode[]; edges: WorkflowEdge[] };
      set({ nodes: parsed.nodes, edges: parsed.edges, previewPath: [], activePreviewPath: [] });
    } catch (error) {
      console.warn("Failed to parse workflow draft", error);
    }
  },
  persistDraft: () => {
    if (typeof window === "undefined") {
      return;
    }
    const state = get();
    window.localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ nodes: state.nodes, edges: state.edges })
    );
  },
  addNode: (kind: WorkflowNode["kind"] = "action") => {
    const id = createId();
    const newNode: WorkflowNode = {
      id,
      label: `${kind.charAt(0).toUpperCase() + kind.slice(1)} Node`,
      kind,
      position: {
        x: Math.random() * 400 + 120,
        y: Math.random() * 220 + 120
      }
    };
    set((state) => ({ nodes: [...state.nodes, newNode], selectedNodeId: id }));
    get().persistDraft();
    return id;
  },
  updateNode: (id, updates, options) => {
    set((state) => ({
      nodes: state.nodes.map((node) => (node.id === id ? { ...node, ...updates } : node))
    }));
    if (options?.persist !== false) {
      get().persistDraft();
    }
  },
  removeNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter((edge) => edge.sourceId !== id && edge.targetId !== id),
      selectedNodeId: state.selectedNodeId === id ? undefined : state.selectedNodeId
    }));
    get().persistDraft();
  },
  startConnection: (nodeId) => {
    set({ connectSourceId: nodeId });
  },
  completeConnection: (targetId) => {
    const { connectSourceId, edges } = get();
    if (!connectSourceId || connectSourceId === targetId) {
      set({ connectSourceId: undefined });
      return;
    }
    const duplicate = edges.some(
      (edge) => edge.sourceId === connectSourceId && edge.targetId === targetId
    );
    if (duplicate) {
      set({ connectSourceId: undefined });
      return;
    }
    const edge: WorkflowEdge = {
      id: `edge-${connectSourceId}-${targetId}-${Date.now()}`,
      sourceId: connectSourceId,
      targetId: targetId
    };
    set((state) => ({
      edges: [...state.edges, edge],
      connectSourceId: undefined
    }));
    get().persistDraft();
  },
  removeEdge: (edgeId) => {
    set((state) => ({ edges: state.edges.filter((edge) => edge.id !== edgeId) }));
    get().persistDraft();
  },
  setSelectedNode: (id) => set({ selectedNodeId: id }),
  setTraversalMode: (mode) => set({ traversalMode: mode }),
  runTraversal: () => {
    const { nodes, edges, traversalMode } = get();
    const startNode = nodes.find((node) => node.kind === "trigger") ?? nodes[0];
    if (!startNode) {
      return [];
    }
    const path = traverseGraph(nodes, edges, startNode.id, traversalMode);
    set({ previewPath: path, activePreviewPath: path.length ? [path[0]] : [] });
    return path;
  },
  setActivePreview: (path) => set({ activePreviewPath: path }),
  setPreviewing: (previewing) => set({ isPreviewing: previewing }),
  reset: () => {
    set({ nodes: [], edges: [], previewPath: [], activePreviewPath: [], selectedNodeId: undefined });
    get().persistDraft();
  },
  hydrate: (nodes, edges) => {
    set({ nodes, edges, activePreviewPath: [], previewPath: [] });
    get().persistDraft();
  }
});

export const useWorkflowStore = create<WorkflowState>(workflowStore);

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}
