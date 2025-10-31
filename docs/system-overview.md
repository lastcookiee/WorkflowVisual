# WorkflowVisual System Overview

## High-Level Architecture

```
+-----------------------+      +-------------------+
|  Next.js App (App Dir)|      |  Prisma Client    |
|  • Builder UI         |<---->|  • Database ORM   |
|  • Saved Workflows    |      |                   |
+-----------+-----------+      +---------+---------+
        |                             |
        | fetch/save workflows        |
        v                             v
+-----------------------+      +-------------------+
| API Routes            |      | PostgreSQL        |
| • /api/workflows      |----->| • workflow table  |
| • /api/workflows/[id] |<-----| • node table      |
+-----------+-----------+      | • edge table      |
        ^                  +-------------------+
        |
        | server actions
        v
+-----------------------+
| Server Actions        |
| • persistWorkflow()   |
| • loadWorkflow()      |
+-----------------------+
```

The project is a visual workflow builder. Users design graph-based automations in the browser using Next.js 14 (app router, React 18). Workflow graphs are stored in PostgreSQL via Prisma. There is no runtime automation engine yet; the builder previews traversal order client-side.

## Interaction Flow

1. **Builder Page (`src/app/builder/page.tsx`)**

- Hydrates node/edge state from localStorage or `workflow` query param (`fetch /api/workflows/:id`).
- Renders builder controls, the canvas, and the preview timeline.

2. **State Management (`src/hooks/use-workflow-store.ts`)**

- Zustand store keeps nodes, edges, traversal mode, and preview status.
- `runTraversal()` chooses BFS or DFS and calls `traverseGraph()` to simulate execution.
- `persistDraft()` saves the current graph to `localStorage`.

3. **Traversal Logic (`src/lib/graph.ts`)**

- Builds adjacency map from edges, then performs BFS or DFS starting at a trigger node (or first node available).
- Returns ordered IDs (`previewPath`) for animation.

4. **Builder Controls (`src/components/builder/builder-controls.tsx`)**

- Add/delete nodes, change traversal mode, run preview, reset state.
- `Save` button calls server action `persistWorkflow()` (see below).

5. **Canvas + Nodes**

- `WorkflowCanvas` renders all nodes and edges.
- `WorkflowNodeCard` handles dragging, editing labels, and connection handles.
- `WorkflowEdgeLayer` draws SVG curves between node positions.
- Components subscribe to `activePreviewPath` to highlight nodes/edges while preview runs.

6. **Preview Timeline (`src/components/builder/preview-timeline.tsx`)**

- Shows progression of `previewPath` over time; updates store so canvas and controls stay in sync.

7. **Server Action (`src/app/builder/actions.ts`)**

- `persistWorkflow(payload)` sets a cookie and calls `saveWorkflow()` in `src/lib/workflow-client.ts`.

8. **Workflow Client (`src/lib/workflow-client.ts`)**

- Uses Prisma to create or update workflow records.
- Maps node kinds and traversal modes to enums defined in `prisma/schema.prisma`.
- Calls `revalidatePath('/workflows')` so list page shows latest changes.

9. **API Routes**

- `src/app/api/workflows/route.ts`: list + create workflows (REST endpoints).
- `src/app/api/workflows/[id]/route.ts`: fetch, update, delete a single workflow.

10. **Saved Workflows Page (`src/app/workflows/page.tsx` using `WorkflowList`)**

- Server component fetches recent workflows with Prisma and renders cards.
- Each card links back to the builder with a `workflow` query param to hydrate state.

11. **Docs & Supporting Files**

- `docs/implementation-plan.md`: project plan.
- `README.md`: setup instructions, tech stack summary.

## File-by-File Map

- `src/app/layout.tsx`: root layout, theme provider.
- `src/app/page.tsx`: landing page describing product.
- `src/app/builder/page.tsx`: main builder surface (described above).
- `src/app/docs/page.tsx`: documentation hub (explains usage in-app).
- `src/app/profile/page.tsx`, `templates/page.tsx`: placeholder pages for future features.
- `src/app/api/workflows/*.ts`: RESTful API for workflows.
- `src/app/builder/actions.ts`: server actions for saving workflows.
- `src/components/navigation/top-nav.tsx`: top navigation bar.
- `src/components/providers/theme-provider.tsx`: light/dark theme context.
- `src/components/ui/*`: small UI helpers (cursor glow, theme toggle).
- `src/components/builder/*`: all builder-specific UI pieces.
- `src/components/workflows/workflow-list.tsx`: renders saved workflows grid.
- `src/hooks/use-workflow-store.ts`: Zustand store with traversal helpers.
- `src/lib/prisma.ts`: Prisma client singleton.
- `src/lib/graph.ts`: BFS/DFS graph traversal utilities.
- `src/lib/workflow-client.ts`: Prisma persistence helpers.
- `src/types/workflow.ts`: shared TypeScript types for nodes/edges.
- `tests/graph.test.ts`: unit tests for traversal logic using Vitest.

## Data Model (Prisma)

```
Workflow (id, name, description, traversal, ownerId, createdAt, updatedAt)
├── Node (id, label, kind, positionX, positionY, workflowId)
└── Edge (id, sourceId, targetId, workflowId)
```

`TraversalMode` enum supports `BFS` or `DFS`. Nodes support `TRIGGER`, `ACTION`, `LOGIC` kinds.

## Client → Server Flow (Saving a Workflow)

```
BuilderControls.Save button
  └─ calls persistWorkflow(payload) [server action]
     └─ saveWorkflow(payload) [lib/workflow-client.ts]
         ├─ Prisma workflow.create/update
         └─ revalidatePath("/workflows")
```

## Client → Server Flow (Loading a Workflow)

```
BuilderPageContent useEffect() with ?workflow=<id>
  └─ fetch(/api/workflows/<id>)
     └─ API route uses Prisma to get workflow + related nodes/edges
        └─ JSON returned to client
  └─ hydrate(nodes, edges) in Zustand store
```

## Running the Project

1. Create `.env` with `DATABASE_URL` pointing to your Postgres instance.
2. `npm install`
3. `npm run prisma:migrate`
4. `npm run dev`
5. Visit `http://localhost:3000/builder` to design workflows.

Or run `run-workflow.bat` for an automated setup + dev server.

## Future Enhancements

- Execution engine to perform real actions based on saved graphs.
- Branch metadata on edges to support conditional flows.
- Role-based access and user accounts (schema includes `User` placeholder).
- Audit trail of workflow runs.
- Integration marketplace/adapters for external services.
