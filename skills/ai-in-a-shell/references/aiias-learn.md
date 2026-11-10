---
name: aiias-learn
description: Explain and jointly investigate a codebase using local AI in Shell, with an optional evidence-based model on the canvas and adaptive guidance.
---

# Learn with canvas

When explaining current facts against a desired or proposed canvas state, follow the shared [Ist/Soll comparison-axis reference](comparison-axis.md).

Apply shared [aiias-router](aiias-router.md) principles without asking again whether to begin. An explanation request or accepted joint investigation is enough. Reuse existing context and inspect only relevant sources. Do not retrieve evidence for every task by default.

Explain directly when asked, including foundations needed to form a hypothesis. Keep guidance concise and tied to the problem: clarify the question, inspect relevant state, introduce only needed foundations, compare viable approaches, then help apply and check the chosen approach. Separate observations, inferences, assumptions, and open questions. In joint problem-solving, build on reasoning already shared; if the developer has not asked for an answer or implementation, invite their approach before presenting yours. Respect direct-help and stop requests. Implementation and acceptance do not become quizzes.

## Problem investigation

For structured ticket and bug investigation, use the current flexible, evidence-grounded [Investigate guidance](aiias-investigate.md). It preserves the shared [one-canvas default](one-canvas.md); canvas use remains optional.

## Selective code investigation

Start with the working question and its likely entrypoint. Follow the actual call, data, and configuration path through relevant callers, types, tests, errors, and branches. Read only enough surrounding code to understand meaningful filtering, transformation, decisions, state changes, and external boundaries. Keep the scan scoped to the question; reading test source is not evidence of an executed run. Cite source function and project-relative file/line; include version or local-modification context when available.

Choose canvas granularity around meaningful boundaries: a filter, transform, decision, state transition, or external call may deserve its own component. Collapse routine plumbing. Keep decisive conditions visible. For more depth on the same working question, stay in the existing canvas; use a linked detail tab only for a separate question or at the user's request. A component can cover multiple functions when that best explains one boundary. Do not invent pseudocode as if it were executed.

Extract parameters from their actual definitions, defaults, overrides, and effective runtime values when observable. Mark effective values unknown when they cannot be established. Choose attributes for explanatory value: stable IDs for tracking, useful inputs and outputs, relevant transformations, order, filters, limits, and errors. Do not copy every field or imply that a configured value was effective without evidence.

Describe runtime behavior only from evidence with known provenance, such as an existing captured trace, log, or an authorized feasible local run. Reading a test establishes an expectation, not an observed run; an actually executed test may provide observations scoped to its fixtures and instrumented boundaries. For a run or captured trace, record its identity, input, config, code/data origin, and snapshots at relevant boundaries, including what was not observed. Distinguish fixtures from real sources; disclose partial or redacted output and failures. A changed parameter is a proposal until separately run; replay cannot change earlier observations. Do not add instrumentation or perform external, costly, or mutating operations beyond the user's existing authorization. If a needed observation requires additional execution permission, identify that gap before running it. If runtime evidence is unavailable, show an honest partial model and mark unobserved behavior. Current canvas support is textual notes, function badges, and linked tabs; do not invent a native trace inspector, timeline, or data-node schema. This skill does not implement runtime capture or a new persistence contract.

For a retrieval path such as `Retrieval → Reranking → Context → Answer`, if an actual boundary observation contains candidates A/B/C and not D, a larger downstream limit cannot introduce D on that path because D was absent upstream. That observation alone does not explain why D was absent; do not invent a cause. Treat this as an evidence-reading example, not a runtime result unless those candidates were actually observed.

## Canvas

For a canvas, follow the shared [one-canvas guidance](one-canvas.md) and the [canvas components reference](canvas-components.md). Keep evidence provenance and existing content intact. The canvas is optional; direct answers and text-only requests remain text.

Resolve the active canvas before every canvas read or edit using `active_canvas.py` alongside this skill: `python3 <skill-directory>/helpers/active_canvas.py --root <project-directory>`. Treat the actual discovered skill directory and project directory as shell arguments, not literal placeholders. The JSON output contains `path` and `token`: read and edit only that path and retain the token for this operation. With no marker, use the legacy `.ai-in-a-shell/canvas.json`, including its existing first-edit creation behavior. A present `.ai-in-a-shell/active-canvas.json` must be a version 1 object selecting `legacy` or a lowercase UUID v4; the explicitly selected canvas must already exist. A malformed marker, invalid identifier, inaccessible selection, or missing explicitly selected file is an error: explain it and stop, never fall back to another canvas.

Immediately before writing, rerun the same resolver with `--expect-token <previous-token>` and the same project root. On any error or changed selection, abort the write and report it. Re-read and compare the current canvas file against the content used for the proposed update; abort on detected external changes. These checks detect observed selection/file changes and do not guarantee conflict-free collaboration. Never derive a filesystem path from unvalidated marker text or create the marker yourself.

Preserve valid existing content, unknown fields, and unrelated document content. Write valid JSON atomically; desktop uses last-write-wins. If the document is invalid or cannot be updated safely, explain the issue instead of replacing it. Do not generate screenshots, images, or image exports unless Johannes expressly requests them for the current task; respect text-only requests.

## Learning support and evidence

Keep learning support small and adaptive: a brief prediction, explanation, or check can help make a relevant concept concrete, but is optional and should fit the user's request. Do not impose quizzes, infer a knowledge gap from silence, or claim proven learning from one interaction. Supplied hints are not independent work. Give specific feedback against relevant evidence, and respect direct help. A later related case may explore transfer; one success does not prove general mastery.

System artifacts and private learning evidence are distinct. A canvas is a system artifact, not proof of learning. After a suitable concrete learning interaction, use [aiias-evidence](aiias-evidence.md) only to prepare a proposed private record; save it only after explicit confirmation.
