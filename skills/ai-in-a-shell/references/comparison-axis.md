# Ist/Soll comparison axis

Use this when the user asks to compare current facts or evidence with a target, proposal, or expected state in the active canvas.

- Read the actual canvas state with `desktop_get_comparison_state` before describing existing assignments or visibility. `ist` is a user label, not execution evidence.
- Assign or clear node and edge labels with `desktop_set_comparison_state`. Send the current `canvasId` and `tabId`, IDs in `nodeIds` and `edgeIds`, and one shared `comparisonState`: `ist`, `soll`, or `shared` (`shared` clears the label). Preserve existing Ist content and source references when adding Soll content. After a successful write, read state again; after an uncertain timeout, read actual state before reporting or retrying.
- Change only the axis visibility with `desktop_set_comparison_view`, using the current `canvasId`, `tabId`, and boolean `showIst` / `showSoll` values.
- Treat only a flat `status: "ok"` reply as success. Preserve `status: "error"`; never infer success from a sent request or socket acceptance. If these tools are missing, say this runtime does not support the comparison axis and continue in text.
- Use MCP only for comparison assignments and axis visibility. Preserve the existing code-grounded Learn/one-canvas path for canvas content and sources; do not edit Canvas JSON or use another writer for comparison assignments or view state.

Keep observed current facts, proposals, and execution evidence distinct. This axis adds no evidence, source, or run record by itself.
