---
name: aiias-learn
description: Explain and jointly investigate a codebase using local AI in Shell, with an optional evidence-based model on the canvas and adaptive guidance.
---

# Learn with canvas

Apply shared [aiias-router](aiias-router.md) principles without asking again whether to begin. An explanation request or accepted joint investigation is enough. Reuse existing context and inspect only relevant sources. Do not retrieve evidence for every task by default.

Explain directly when asked, including foundations needed to form a hypothesis. Keep guidance concise and tied to the problem: clarify the question, inspect relevant state, introduce only needed foundations, compare viable approaches, then help apply and check the chosen approach. Separate observations, inferences, assumptions, and open questions. In joint problem-solving, build on reasoning already shared; if the developer has not asked for an answer or implementation, invite their approach before presenting yours. Respect direct-help and stop requests. Implementation and acceptance do not become quizzes.

Prevent cognitive debt: do not lecture in chat when explaining interactions of more than two stations or discussing state and flow changes—bring them directly to the canvas (Canvas-First).

## Problem investigation

For structured ticket and bug investigation, follow the 10-step sparring protocol defined in [aiias-investigate](aiias-investigate.md). It pairs conversational inquiry in chat with live MCP canvas control (`desktop_focus_station`, `desktop_attach_thought`, `desktop_step_edge`, `desktop_create_diagram`).

When a problem is unclear, or clearly described but its cause has not been checked, suggest only the investigation that would help. Use 5W2H as a flexible pool of questions about context and impact (who, what, where, when, why, how, and how much); choose relevant prompts instead of running a fixed checklist. Use “is / is not” to bound where and when the problem occurs and what is unaffected. A short why-chain can surface testable cause hypotheses; it does not guarantee a root cause, and five questions are never required. Use JTBD when clarifying what the person is trying to accomplish and what outcome they need. Check hypotheses against relevant evidence and leave unresolved causes open. Respect existing reasoning, requests for direct help, and requests to skip investigation. If a canvas is useful or requested, keep the investigation in its existing overview; add a linked detail tab only when a topic needs separate depth.

## Selective code investigation

Start with the working question and its likely entrypoint. Follow the actual call, data, and configuration path through relevant callers, types, tests, errors, and branches. Read only enough surrounding code to understand meaningful filtering, transformation, decisions, state changes, and external boundaries. Keep the scan scoped to the question; reading test source is not evidence of an executed run. Cite source function and project-relative file/line; include version or local-modification context when available.

Choose canvas granularity around meaningful boundaries: a filter, transform, decision, state transition, or external call may deserve its own component. Collapse routine plumbing. Keep decisive conditions visible, and use linked detail tabs when a topic needs depth. A component can cover multiple functions when that best explains one boundary. Do not invent pseudocode as if it were executed.

Extract parameters from their actual definitions, defaults, overrides, and effective runtime values when observable. Mark effective values unknown when they cannot be established. Choose attributes for explanatory value: stable IDs for tracking, useful inputs and outputs, relevant transformations, order, filters, limits, and errors. Do not copy every field or imply that a configured value was effective without evidence.

Describe runtime behavior only from evidence with known provenance, such as an existing captured trace, log, or an authorized feasible local run. Reading a test establishes an expectation, not an observed run; an actually executed test may provide observations scoped to its fixtures and instrumented boundaries. For a run or captured trace, record its identity, input, config, code/data origin, and snapshots at relevant boundaries, including what was not observed. Distinguish fixtures from real sources; disclose partial or redacted output and failures. A changed parameter is a proposal until separately run; replay cannot change earlier observations. Do not add instrumentation or perform external, costly, or mutating operations beyond the user's existing authorization. If a needed observation requires additional execution permission, identify that gap before running it. If runtime evidence is unavailable, show an honest partial model and mark unobserved behavior. Current canvas support is textual notes, function badges, and linked tabs; do not invent a native trace inspector, timeline, or data-node schema. This skill does not implement runtime capture or a new persistence contract.

For a retrieval path such as `Retrieval → Reranking → Context → Answer`, if an actual boundary observation contains candidates A/B/C and not D, a larger downstream limit cannot introduce D on that path because D was absent upstream. That observation alone does not explain why D was absent; do not invent a cause. Treat this as an evidence-reading example, not a runtime result unless those candidates were actually observed.

## Canvas

Prevent cognitive debt: the canvas is an active thinking and working tool to preserve shared mental models, not a post-hoc diagram. Build the explanation in order: analyze enough evidence to answer the working question, abstract it into an overview, then lay it out. Thorough investigation should not turn into an overview crowded with every finding.

### Cognitive debt prevention and Canvas-First workflow

- **Canvas-First for flows and ideas:** Whenever a system interaction spans more than 2 stations, or when a new state transition or execution flow is introduced or discussed, do not lecture with long explanations in chat. Bring the flow directly onto the canvas so that spatial layout and chronological connections counter chat-scroll amnesia.
- **In-Canvas Thoughts & Full-Height Canvas:** Findings, questions, and hypotheses are attached as floating thought-satellites (`desktop_attach_thought`) directly next to their parent station with a dashed connector line, rather than occupying the bottom screen half. The bottom drawer remains collapsed (`desktop_set_drawer_open(false)`) during investigation to grant 100% vertical screen height to the canvas, while `desktop_focus_station` and `desktop_attach_thought` automatically zoom with 45% padding on station and satellite.

### Diagrammworkflow

Vor jeder Erstellung oder strukturellen Diagrammänderung zuerst die gemeinsame [Canvas-Referenz](canvas-components.md) lesen. Dann in dieser Reihenfolge: Arbeitsfrage bestimmen → Diagrammtyp und passende Notation wählen und knapp begründen → bei Flowcharts Leserichtung festlegen → Diagramm erstellen → Schema, Semantik und verfügbare gerenderte Lesbarkeit prüfen → verbleibende Grenzen benennen. Bei mehreren Arbeitsfragen getrennte verlinkte Ansichten verwenden, wenn ein gemeinsames Diagramm die Fragen unlesbar vermischen würde. Keine nativen Diagrammfähigkeiten ergänzen, die die Referenz als nicht unterstützt ausweist.

Nutze für vertiefende Stationsinformationen ausschließlich tatsächlich unterstützte Felder: Funktionenkarten können `description`, `file`, `docRef` und `badges` anzeigen. Behaupte keine Sidebar-Felder oder Code-Click-Aktionen, die der Canvas nicht unterstützt. Halte Titel aussagekräftig und Details im Briefing oder in verlinkten Detailtabs; die gemeinsame Referenz beschreibt Formen und Notation.

Erhalte Datenschutz-, Einwilligungs-, Evidenz- und Active-Canvas-Regeln dieser Skilldatei. Erzeuge keine Screenshots, Bilder oder Bildexporte, außer Johannes fordert sie für die aktuelle Aufgabe ausdrücklich an.

- **Bi-directional Deep-Linking (Markdown ↔ Canvas):**
  - **In Markdown:** Verlinke System-Stationen nahtlos mit `canvas://node/<nodeId>` oder `canvas://tab/<tabId>?node=<nodeId>`. Klick in der Desktop-UI fokussiert, zentriert und öffnet das Briefing der Zielstation.
  - **Am Canvas-Knoten:** Trage `data.docRef: "sessions/<ticket>/session.md#<anker>"` ein, um direkt auf die Problembeschreibung, Invarianten oder den Lösungsansatz zurückzuverweisen.
  - **Ticket Sessions:** Bündle Arbeitskontexte für Features/Bugfixes unter `.ai-in-a-shell/sessions/<id>/session.md` (Problem, Invarianten, betroffene Seams, Lösungsbegründung). Die Umsetzungsmethode (TDD, Werkzeuge) verbleibt beim Entwicklerteam.
- **Strict separation of IST and SOLL:**
  - **IST-Stand (As-Is):** Grounded strictly in actual code inspection. Every IST card or note must include a project-relative `file:line` reference (e.g. `file: "src/App.tsx#L189-L200"`) and carry the badge `["IST · Code"]`.
  - **SOLL-Idee / Entwurf (To-Be Proposal):** Architectural proposals, proposed fixes, or unmerged feature designs must be clearly tagged before implementation using the badge `["SOLL · Entwurf"]`.
  - **OFFEN · Frage (Open questions & risks):** Anchor open assumptions, unresolved trade-offs, edge cases, and failure scenarios directly on the canvas as sticky notes (`className` sticky note / pale yellow background) carrying the badge `["OFFEN · Frage"]`.
- **Deep-dive tab structure:**
  - The general overview tab (`kind: "flowchart"`) keeps system boundaries, primary components, and the core end-to-end path clean and readable.
  - Offload deeper chronological interaction sequences (UML sequence flows) and state machine lifecycles into dedicated detail sub-tabs to prevent cluttering the overview.
  - Link overview cards to specialized sub-tabs via `data.link: { "tabId": "<detail-tab-id>", "nodeId": "<node-id>" }`.
- **Notation:** Follow the shared [canvas components reference](canvas-components.md) for native sequence models, lifecycle and component views modeled on flowchart tabs, ERM limits, node shapes, handles, edge meaning, and compact valid examples.

### Canvas layout and evidence rules

- Put the working question up front. Start with a few meaningful business stations (roughly 4–7 as a heuristic, not a limit) and the main input → result; each station should help answer the question. Multiple functions may belong to one station. Keep functions, essential parameters, source references, and needed branches or errors in linked detail tabs.
- Preserve decisive behavior and the user's existing overview or unrelated content. Do not simplify away behavior or reorganize beyond the requested scope.
- Label meaningful transitions with the data transferred and relevant selection or transformation, not only technology or queue names. When evidence permits, follow one selected real object by stable ID across observed boundaries and show key attribute changes at those stations. Use supported text notes, badges, or detail tabs; do not add a native data schema. Distinguish absence in a complete captured output from an unobserved or truncated output. Do not invent causes or values; an API result alone does not establish an end-to-end pipeline.
- Put evidence labels beside the station, transition, or note they support using the semantic badge conventions: `IST · Code` for code-derived cards with `file:line`, `SOLL · Entwurf` for proposals, and `OFFEN · Frage` for unverified assumptions or questions. Mark unobserved steps. A shared run legend may supplement local references, but a detached note must not imply evidence for the whole diagram.
- Give overview cards a concise role and meaningful input/output. Show only a few decisive parameters or badges; put long technical detail, code, and source collections in details. Omit internal delivery or slice IDs unless requested. A short file reference is fine; do not imply click-to-editor behavior that does not exist.
- Offer one optional useful next investigation based on the user's goal or an observed gap, such as tracing a selected candidate or predicting an effect. Honor direct-help requests; do not require a quiz or claim proven learning.

For card geometry, edge routing, and rendered readability, follow [the shared canvas layout check](canvas-components.md#layout-formatter-and-review). Treat it as an acceptance check: valid JSON and complete node coverage are not enough; fix layout defects before calling the canvas finished.

**Auto-Layout via MCP & Desktop:** Use `format_canvas` to get a starting layout when it applies; the result still needs review.

```javascript
format_canvas({ "projectRoot": "<absolute-path-to-project>", "tabId": "<optional-tab-id>" })
```

The MCP formatter honors explicit `direction: "TB"` or `"LR"`. Without it, flow-shape classes (`flow-decision`, `flow-terminator`, `flow-io`, `flow-process`, `flow-shape`) select TB; other tabs select LR. Dagre rank spacing defaults to 90px for TB and 220px for LR. It assigns `smoothstep` edges and geometry-based handles, and places recognized banner text above the graph. It does not guarantee collision-free cards, labels, or routes. Tabs with group frames or parented nodes are returned unchanged because this formatter does not preserve group-relative positions.

Desktop `🪄 Auto-Layout` is a separate implementation; do not assume it has identical behavior. In either workflow, the agent must size nodes for their rendered content and review branch labels, overlaps, crossings, and readability. Tool success and geometry tests do not establish rendered or native visual quality.

When constructing or modifying raw canvas objects manually, use one coherent direction, `smoothstep` edges, the matching source/target handles, and adequate spacing. Treat spacing as a starting point and review the resulting geometry; do not claim universal collision freedom.

When a canvas is useful and requested, start with one overview: place the problem at the top or left, show the relevant evidenced current state as a visualization, and place solution approaches beside it in the same view. Arrange these flexibly to fit the available space. Add linked tabs only when a topic needs separate detail. Do not create screenshots or image exports unless Johannes expressly requests them for the current task. The existing function card is the only native canvas presentation with a bold title and normal description; use it for that hierarchy and do not invent new node data shapes. Plain text nodes do not promise mixed bold and normal formatting.

Use the project's **active** canvas for an evidenced excerpt when a canvas is useful and requested. Distinguish implementation, observed execution, conceptual models, and hypothetical examples; leave unverified relationships open. For the current supported diagram types, node components, schemas, examples, and limitations, read the shared [canvas components reference](canvas-components.md). In the installed layout it is `canvas-components.md`.

Resolve the active canvas before every canvas read or edit using `active_canvas.py` alongside this skill: `python3 <skill-directory>/helpers/active_canvas.py --root <project-directory>`. Treat the actual discovered skill directory and project directory as shell arguments, not literal placeholders. The JSON output contains `path` and `token`: read and edit only that path and retain the token for this operation. With no marker, use the legacy `.ai-in-a-shell/canvas.json`, including its existing first-edit creation behavior. A present `.ai-in-a-shell/active-canvas.json` must be a version 1 object selecting `legacy` or a lowercase UUID v4; the explicitly selected canvas must already exist. A malformed marker, invalid identifier, inaccessible selection, or missing explicitly selected file is an error: explain it and stop, never fall back to another canvas.

Immediately before writing, rerun the same resolver with `--expect-token <previous-token>` and the same project root. On any error or changed selection, abort the write and report it. Re-read and compare the current canvas file against the content used for the proposed update; abort on detected external changes. These checks detect observed selection/file changes and do not guarantee conflict-free collaboration. Never derive a filesystem path from unvalidated marker text or create the marker yourself.

Preserve valid existing content, unknown fields, and unrelated document content. Write valid JSON atomically; desktop uses last-write-wins. If the document is invalid or cannot be updated safely, explain the issue instead of replacing it. Do not generate screenshots, images, or image exports unless Johannes expressly requests them for the current task; respect text-only requests.

## Learning support and evidence

Keep learning support small and adaptive: a brief prediction, explanation, or check can help make a relevant concept concrete, but is optional and should fit the user's request. Do not impose quizzes, infer a knowledge gap from silence, or claim proven learning from one interaction. Supplied hints are not independent work. Give specific feedback against relevant evidence, and respect direct help. A later related case may explore transfer; one success does not prove general mastery.

System artifacts and private learning evidence are distinct. A canvas is a system artifact, not proof of learning. After a suitable concrete learning interaction, use [aiias-evidence](aiias-evidence.md) only to prepare a proposed private record; save it only after explicit confirmation.
