# Canvas components and diagram conventions

Shared reference for Synapse desktop canvas authors. Paths below are relative to a Synapse checkout. The persisted contract is defined in `ai-in-a-shell/desktop/src/model.ts`; preserve unknown fields and existing content when editing.

## Choose by the question

- **Flowchart (`kind: "flowchart"`)**: Which actions occur, in what order, and where do decisions branch? Use for workflows, pipelines, and control/data paths.
- **Sequence (`kind: "sequence"`)**: Which participants exchange which messages, in what modeled order? Use the native sequence model for ordered interactions. It has no native `par`/`alt` fragments, timing measurement, or concurrency proof. An interleaving is an explicitly modeled scenario, not evidence that events ran concurrently or were observed.
- **Lifecycle**: Which discrete states can one object occupy, and what transitions it? Model on a flowchart tab with state labels and transition labels; there is no native state kind.
- **Component view**: Which static components and interfaces connect? Model on a flowchart tab using function cards and groups where helpful; this is not an execution flow. Label edges as dependency, call, or data relationships. They describe component relationships, not activity/control flow.
- **Conceptual ERM (`kind: "erm"`)**: Which concepts/entities relate? It uses ordinary nodes and edges, with no enforced entity, relationship, or cardinality semantics. State cardinalities in labels only when they are part of the intended conceptual model.

Keep the working question visible. Mark hypothetical models as proposals/scenarios, code-derived claims with source references, and runtime observations only when supported by identified evidence. Do not imply a conceptual diagram is an observed trace.

## Flowchart notation and reading direction

Use one dominant direction, usually top-to-bottom (TB) or left-to-right (LR), selected to fit the question and canvas. State the chosen direction before creating or substantially editing a flowchart. Keep the main path visually dominant; put secondary branches beside it and meaningful feedback loops on explicit return paths outside the spine. Arrows point from cause/action to next step. Label edges with the transferred item, condition, result, or action when that clarifies meaning.

Use existing default nodes with these optional classes for conventional shapes: `flow-terminator` for start/end, `flow-io` for external input/output, `flow-process` for an action/transformation, and `flow-decision` for a decision. A decision has no dedicated yes/no ports: give it at least two distinct, condition-labeled outgoing edges. A merge reunites paths; it is not a decision. Model activities with action verbs and lifecycle states with stable state labels (often nouns or uppercase identifiers). Use concise, meaningful titles; there is no rigid word ceiling. Put detail in supported descriptions or linked detail tabs.

For lifecycle transitions, use `event [guard] / action` when those parts apply (for example `timeout [expired] / refresh`). The state node names the condition of the object; the transition edge names the triggering event, optional guard, and action. Keep lifecycle edges separate from workflow activity paths; an explicit transition back to an earlier state is valid when it represents a real modeled transition.

A solid arrow can express the primary modeled path. Dashed styling is diagram-specific: native sequence `kind: "response"` is rendered dashed; on ordinary flowchart edges, dashed styling may mark an explicitly explained secondary/error path. Dashed does not universally mean response or error. Optional colors and styling should have a local legend when meaning is not self-evident.

## Supported model and handles

A document has `schemaVersion: 1`, `id`, `title`, and tabs. Tabs have `id`, `title`, `kind`, `nodes`, and `edges`; native sequence tabs also require a `sequence` model. Nodes require `id`, `type`, finite `position.x`/`position.y`, and `data.label`. Ordinary edges require `id`, `source`, and `target`; optional `label`, `sourceHandle`, `targetHandle`, and renderer-supported fields may be used.

- **Default / decision node:** `type: "default"`; `data.label` renders its title. Add `className: "flow-decision"` for a decision diamond. No dedicated decision branch handles exist.
- **Function card:** still `type: "default"`, with `data.cardType: "function"`. `data.label` is the title; optional `description`, `file`, and `badges: string[]` are supported. The file is a displayed reference, not an open-file action. Supported handles are `top`, `bottom`, `top-source`, `bottom-target`, `left-target`, `left-source`, `right-source`, `right-target`.
- **Text / note:** a transparent default node (commonly `className: "flow-text"`) can label a region. A default node with supported style fields can serve as a sticky note. Neither is a new data type; do not assume arbitrary rich text.
- **Shapes:** `className: "flow-shape"` with dimensions supports rectangle/oval rendering; no separate persisted shape field exists.
- **Group:** `type: "group"`, `id`, `position`, `data.label`, and positive `style.width`/`style.height`. Put frame before children; children use `parentId` and positions relative to the frame. Groups cannot nest. A formatter may leave grouped tabs unchanged.
- **Linked detail:** `data.link: { "tabId": "existing-tab-id", "nodeId": "optional-existing-node-id" }` navigates within the canvas; it does not assert data or execution relationships.

For LR function-card flow, pair `right-source` → `left-target`; for a right-to-left return use `left-source` → `right-target`. For TB flow, pair `bottom` → `top`; for a bottom-to-top return use `top-source` → `bottom-target`. These are the supported directional handles; do not invent others. Ordinary nodes may use renderer defaults. `markerEnd: { "type": "arrowclosed" }` makes direction explicit.

## Native sequence model

A sequence tab stores `nodes: []`, `edges: []`, and `sequence: { participants, messages, notes? }`. Participants have `id` and `label`; messages have `id`, `from`, `to`, `label`, optional `kind: "message" | "response"`; notes have `id`, `participant`, `label`, optional `after` message ID. References must resolve to existing IDs. Messages are shown in model order. `response` uses dashed rendering; other meanings need explicit explanation. Optional positions are supported by the sequence view, but omit them for default layout. This model records a designed ordering; it does not establish runtime provenance, simultaneity, elapsed time, or causality.

Use a response arrow only for an actual modeled reply. An absent or late reply is not a response message: show the missing response or timeout as a note attached to the relevant participant after the known request/message. Show passive waiting the same way, as a participant note after the message that begins the wait. Add a notification/call message only when that event is explicitly part of the modeled scenario. Keep message and note labels short enough to render in the available sequence view; preserve nuance in supported notes instead of relying on zoom to cure clipping. The supported fields are the participant/message/note labels and optional `kind`/`after`/positions described above; do not invent richer note text, fragment, or timeout fields.

## Compact valid examples

Flowchart decision with explicitly labeled branches, vertical default handles:

```json
{
  "id": "flow-example", "title": "Validate input", "kind": "flowchart",
  "nodes": [
    { "id": "check", "type": "default", "className": "flow-decision", "position": { "x": 0, "y": 0 }, "data": { "label": "Input valid?" } },
    { "id": "accept", "type": "default", "position": { "x": -180, "y": 180 }, "data": { "label": "Continue" } },
    { "id": "reject", "type": "default", "position": { "x": 180, "y": 180 }, "data": { "label": "Return error" } }
  ],
  "edges": [
    { "id": "yes", "source": "check", "target": "accept", "sourceHandle": "bottom", "targetHandle": "top", "label": "yes", "markerEnd": { "type": "arrowclosed" } },
    { "id": "no", "source": "check", "target": "reject", "sourceHandle": "bottom", "targetHandle": "top", "label": "no", "markerEnd": { "type": "arrowclosed" } }
  ]
}
```

Horizontal component seam with function-card handles and a group child:

```json
{
  "id": "components-example", "title": "Request boundary", "kind": "flowchart",
  "nodes": [
    { "id": "client", "type": "default", "position": { "x": 0, "y": 0 }, "data": { "label": "Client", "cardType": "function", "description": "Sends request" } },
    { "id": "service-group", "type": "group", "position": { "x": 360, "y": 0 }, "style": { "width": 320, "height": 200 }, "data": { "label": "Service" } },
    { "id": "handler", "type": "default", "parentId": "service-group", "position": { "x": 24, "y": 48 }, "data": { "label": "Handler", "cardType": "function", "file": "src/handler.ts" } }
  ],
  "edges": [
    { "id": "call", "source": "client", "target": "handler", "sourceHandle": "right-source", "targetHandle": "left-target", "label": "request", "markerEnd": { "type": "arrowclosed" } }
  ]
}
```

Native ordered sequence with a response and note:

```json
{
  "id": "sequence-example", "title": "Request response", "kind": "sequence", "nodes": [], "edges": [],
  "sequence": {
    "participants": [{ "id": "client", "label": "Client" }, { "id": "api", "label": "API" }],
    "messages": [
      { "id": "request", "from": "client", "to": "api", "label": "Request" },
      { "id": "reply", "from": "api", "to": "client", "label": "Response", "kind": "response" }
    ],
    "notes": [{ "id": "note", "participant": "api", "label": "Scenario ordering; not a runtime trace", "after": "request" }]
  }
}
```

Lifecycle modeled on a flowchart tab. State labels and transition labels distinguish states from event/guard/action:

```json
{
  "id": "lifecycle-example", "title": "Token lifecycle", "kind": "flowchart",
  "nodes": [
    { "id": "uninitialized", "type": "default", "position": { "x": 0, "y": 0 }, "data": { "label": "UNINITIALIZED" } },
    { "id": "active", "type": "default", "position": { "x": 220, "y": 0 }, "data": { "label": "ACTIVE" } },
    { "id": "expiring", "type": "default", "position": { "x": 440, "y": 0 }, "data": { "label": "EXPIRING" } },
    { "id": "expired", "type": "default", "position": { "x": 660, "y": 0 }, "data": { "label": "EXPIRED" } }
  ],
  "edges": [
    { "id": "initialize", "source": "uninitialized", "target": "active", "label": "issued / activate", "markerEnd": { "type": "arrowclosed" } },
    { "id": "near-expiry", "source": "active", "target": "expiring", "label": "clock [near expiry] / warn", "markerEnd": { "type": "arrowclosed" } },
    { "id": "expire", "source": "expiring", "target": "expired", "label": "timeout [expired] / revoke", "markerEnd": { "type": "arrowclosed" } },
    { "id": "refresh", "source": "expiring", "target": "active", "label": "refresh [valid] / renew", "markerEnd": { "type": "arrowclosed" } }
  ]
}
```

Conceptual ERM with visible cardinality labels. These are explanatory labels; the canvas does not validate them:

```json
{
  "id": "erm-example", "title": "Account and projects", "kind": "erm",
  "nodes": [
    { "id": "account", "type": "default", "position": { "x": 0, "y": 0 }, "data": { "label": "Account" } },
    { "id": "project", "type": "default", "position": { "x": 320, "y": 0 }, "data": { "label": "Project" } }
  ],
  "edges": [
    { "id": "owns", "source": "account", "target": "project", "label": "owns: 1 to 0..*", "markerEnd": { "type": "arrowclosed" } }
  ]
}
```

## Layout, formatter, and review

The MCP `format_canvas` honors explicit `direction: "TB"` or `"LR"`. Without one, flow-shape classes select TB; other tabs select LR. Dagre rank spacing defaults to 90px for TB and 220px for LR. Function cards without explicit dimensions use 260×130px. The formatter sets `smoothstep` edges, selects geometry-based handles, and positions recognized banners; it does not guarantee collision-free cards, labels, or routes. Tabs with group frames or parented nodes are returned unchanged. Desktop `🪄 Auto-Layout` is a separate implementation; do not assume identical behavior.

Treat formatter output as a starting layout. Size nodes for rendered content and review overlaps, crossings, branch labels, arrow direction, and readability when rendered inspection is available. Do not claim collision freedom from spacing heuristics or geometry checks. If rendered inspection is unavailable, say so. Keep optional styling legible and explain non-obvious conventions with a nearby legend. Simplify an overview and link detail tabs when needed instead of relying on extreme zoom.

## Source pointers

- `ai-in-a-shell/desktop/src/model.ts` — persisted types and validation.
- `ai-in-a-shell/desktop/src/App.tsx` — rendering, controls, cards, and links.
- `ai-in-a-shell/desktop/src/canvasGroups.ts` — group behavior.
- `ai-in-a-shell/desktop/src/canvasShapes.ts` and `canvasText.ts` — supported shapes and text.
- `ai-in-a-shell/desktop/src/canvasAutoLayout.ts` — desktop formatter.
- `ai-in-a-shell/plugin/mcp/src/canvasLayout.js` — MCP `format_canvas` adapter.
- `ai-in-a-shell/desktop/src/SequenceView.tsx` and `sequenceLayout.ts` — sequence rendering and layout.
