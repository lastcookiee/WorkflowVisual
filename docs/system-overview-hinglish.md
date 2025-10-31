# WorkflowVisual System Overview (Hinglish)

## Project Summary

- Ye ek **visual workflow builder** hai jahan browser mein drag-drop se automation flow charts bana sakte ho.
- Frontend Next.js 14 (App Router + React 18) par hai, styling TailwindCSS + Framer Motion se aati hai.
- State management ke liye **Zustand** use hota hai taaki sab components ek hi global store share karein.
- Prisma ORM ke through PostgreSQL database mein workflows persist kiye jaate hain. Abhi koi real automation engine nahi hai—`Run Workflow` sirf preview animates karta hai.

## End-to-End Flow (Step by Step)

1. **Builder Page open hoti hai** (`src/app/builder/page.tsx`). Page localStorage ya query param (`?workflow=<id>`) se nodes/edges fetch kar leta hai.
2. **Zustand store hydrate hota hai** (`src/hooks/use-workflow-store.ts`). Store state = nodes, edges, traversal mode (`bfs`/`dfs`), selected node, preview info.
3. **User nodes add karta hai**. `BuilderControls` ke buttons `addNode()` ko call karte hain jo store mein naya node push karte hain.
4. **Node linking**. `WorkflowNodeCard` pe "Link" dabao → `startConnection()` / `completeConnection()` edges array update karte hain.
5. **Run Workflow press karte hi** `runTraversal()` execute hota hai:
   - Current traversal mode dekhta hai.
   - `traverseGraph()` (`src/lib/graph.ts`) ko nodes + edges + start node (trigger ya first node) pass karta hai.
   - `traverseGraph()` BFS ya DFS run karke ordered node IDs return karta hai → store `previewPath` update hota hai.
   - `PreviewTimeline` + canvas isi path ko animate karte hain.
6. **Save dabate hi** `persistWorkflow()` server action (`src/app/builder/actions.ts`) call hota hai.
   - `persistWorkflow()` payload bhejta hai (JS object with `name`, `traversalMode`, `nodes[]`, `edges[]`).
   - Backend pe `saveWorkflow()` (`src/lib/workflow-client.ts`) Prisma ko call karta hai, jo `Workflow`, `Node`, `Edge` tables update/create karta hai.
   - `revalidatePath('/workflows')` se listing page refresh hota hai.
7. **Saved Workflows Page** (`src/app/workflows/page.tsx`) Prisma se latest workflows fetch karke cards render karta hai. Card link `workflow=<id>` query se builder ko hydrate kara deta hai.

## Architecture Diagram

```
+------------------------+       +------------------+
| Next.js UI (app dir)   |       | Prisma Client    |
|  • Builder page        |<----->|  • DB Access     |
|  • Workflows listing   |       |                  |
+-----------+------------+       +---------+--------+
            |                              |
            | fetch/save workflows         |
            v                              v
+------------------------+       +------------------+
| API Routes             |       | PostgreSQL DB    |
|  /api/workflows        |<----->|  Workflow table  |
|  /api/workflows/[id]   |       |  Node table      |
+-----------+------------+       |  Edge table      |
            ^                     +------------------+
            |
            | server action
            v
+------------------------+
| persistWorkflow()      |
+------------------------+
```

## Terms Explained

- **Node**: Canvas pe rectangle card. DB `Node` table mein `label`, `kind`, `positionX`, `positionY`, `workflowId` store hota hai. Kind values `TRIGGER`, `ACTION`, `LOGIC`.
- **Edge**: Do nodes ka connection. DB `Edge` table `sourceId` (start node), `targetId` (end node) store karti hai. Traversal adjacency isi se banti hai.
- **Traversal Mode**:
  - **BFS** (`bfs()` in `src/lib/graph.ts`): queue based, layer-by-layer order deta hai.
  - **DFS** (`dfs()` in same file): stack based, depth-first path follow karta hai.
- **Payload**: Jo data server action / API ko bhej rahe ho (structured object). Save ke waqt `SavePayload` type use hota hai.
- **Zustand methods**: `addNode`, `removeNode`, `updateNode`, `runTraversal`, `persistDraft`, `hydrate`, etc.

## Important Files Quick Map

- `src/app/layout.tsx`: Global layout + ThemeProvider.
- `src/app/page.tsx`: Landing page / marketing.
- `src/app/builder/page.tsx`: Builder UI with Suspense + data fetch.
- `src/components/builder/builder-controls.tsx`: Buttons (add, run, save) + server action call.
- `src/components/builder/workflow-canvas.tsx`: Nodes + edges render, background grid.
- `src/components/builder/workflow-node-card.tsx`: Dragging, label edit, link handles.
- `src/components/builder/workflow-edge-layer.tsx`: SVG bezier edges + active highlight.
- `src/components/builder/preview-timeline.tsx`: Animated badge timeline.
- `src/hooks/use-workflow-store.ts`: Central state + traversal logic.
- `src/lib/graph.ts`: BFS/DFS helpers.
- `src/lib/workflow-client.ts`: Prisma CRUD.
- `src/app/api/workflows/*.ts`: REST routes for list/create/update/delete.
- `prisma/schema.prisma`: Data model.
- `tests/graph.test.ts`: Vitest spec verifying traversal order.

## Data Model (ASCII)

```
Workflow (id, name, description, traversal, ownerId, createdAt, updatedAt)
├── Node (id, label, kind, positionX, positionY, workflowId)
└── Edge (id, sourceId, targetId, workflowId)
```

## Request / Response Flow

### Save Workflow

```
UI (Save button)
  ↓
persistWorkflow(payload)
  ↓
saveWorkflow() via Prisma
  ↓
DB tables update (Workflow + Node + Edge)
```

### Load Workflow

```
UI opens /builder?workflow=abc123
  ↓
fetch('/api/workflows/abc123')
  ↓
API route Prisma se data lata hai
  ↓
Zustand.hydrate(nodes, edges)
  ↓
Canvas same graph render karta hai
```

## Running Project

1. `.env` me `DATABASE_URL` set karo (example: `postgresql://postgres:password@localhost:5432/workflow_visual?schema=public`).
2. `run-workflow.bat` execute karo (dependencies, prisma migrate/generate, dev server).
3. Browser `http://localhost:3000/builder` pe workflows banao.

Manual alternative:

- `npm install`
- `npm run prisma:migrate`
- `npm run dev`

## Future Ideas

- Background worker jo real API calls execute kare (Slack/email integrations).
- Edges pe condition metadata (IF/ELSE branching).
- Workflow run history + monitoring dashboard.
- Auth/multi-tenant sharing.
- Secrets & integration marketplace.
