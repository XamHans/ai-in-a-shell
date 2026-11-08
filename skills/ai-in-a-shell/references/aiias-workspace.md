---
name: aiias-workspace
description: Create, list, and read persistent Markdown sessions in the currently opened project, and remotely control the desktop app via MCP.
---

# Project workspace sessions and desktop remote control

Use these tools after the user asks you to create or inspect a persistent project session:

- `create_session(requestId, title, initialMarkdown)` creates the session and its initial Markdown artifact.
- `list_sessions()` lists sessions in the project opened by the desktop.
- `read_artifact(sessionId, artifactId)` reads an artifact using IDs returned by the tools.

The server is bound at process start to the desktop's canonical `AI_IN_A_SHELL_PROJECT_ROOT`. The root is not a tool argument; never try another root or use direct file access as a fallback.

For a create whose result is uncertain, retry with the identical `requestId`, title, and Markdown. Reusing a request ID with changed content is a conflict. Keep and reuse the returned session and artifact IDs when listing and reading.

## Desktop Remote Control Tools (TCP Port 4143)

The MCP server exposes tools to interactively control the running AI in a Shell desktop application via its TCP control server (`127.0.0.1:4143`):

### 1. Navigation & Viewport Autopilot
- `desktop_ping()` checks if the desktop app is running and accepting control commands.
- `desktop_get_current_project()` queries the currently opened project directory in the desktop app. Always inspect this before performing project-sensitive actions.
- `desktop_open_project(path, force?)` opens a project by path in the desktop app.
  > [!IMPORTANT]
  > **Project Isolation & Safety Guard:** If another project is currently active, `desktop_open_project` rejects the call unless `force: true` is explicitly provided. Agents must NEVER switch away from the user's active project unprompted. If a project switch is necessary, check `desktop_get_current_project()` first and ask the user for confirmation before passing `force: true`.
- `desktop_open_session(sessionId)` switches to an existing session in the desktop app.
- `desktop_switch_tab(tabId)` switches to a specific tab on the desktop canvas.
- `desktop_focus_station(nodeId, tabId?, openBriefing?)` focuses a canvas station, switches tabs, and smoothly zooms the viewport (`fitView` with 45% padding) onto the station and its attached thought satellite.

### 2. In-Canvas Thought Deck & Drawer Control
- `desktop_attach_thought(nodeId, title, content?, badges?, fileRef?)` dynamically creates or docks a floating thought-satellite node next to a station. If the station already has a satellite, appends the thought to its multi-thought deck. Automatically collapses the bottom drawer so the canvas retains 100% vertical height.
- `desktop_switch_thought(nodeId, thoughtIndex)` cycles the active thought in the station's thought deck.
- `desktop_set_drawer_open(open)` explicitly opens or closes the bottom briefing drawer.

### 3. Edge Evidence, Data-Probes & Function Kernel
- `desktop_set_node_probe(nodeId, input, operation?, output, dropped?, status?)` creates or updates an in-canvas Data-Probe Satellit directly above the parent node (`top-source` ➔ `bottom-target`). Displays input payload, operation/filter, output snippet, and highlighted dropped elements (e.g. `Chunk D [FILTERED]`). Automatically centers node and probe satellite with smooth `fitView`.
- `desktop_set_node_function(nodeId, pseudoCode, signature?, language?, highlightedLines?, fileRef?, proposedPatch?)` attaches or updates the function capsule and Decision Kernel directly inside a station node. Renders the function signature, numbered code lines with highlighted error/decision branches, optional proposed fix diff, and clickable source file reference.
- `desktop_step_edge(edgeId, status?, label?, payloadPreview?)` animates a data packet along an edge:
  - `status: "success"` (green solid, soft glow): proves verified data transition.
  - `status: "failed"` (red dashed, warning drop-shadow): highlights an observed break, missing dispatch, or unhandled error.
  - `status: "pending"` (blue dashed, animated flow): shows in-progress data traversal.
  - Automatically centers source and target nodes with smooth `fitView`.

### 4. Dynamic Diagram, Layer Visibility & Tab Projection
- `desktop_set_active_layers(layers)` switches active canvas information layers (`"topology"`, `"data"`, `"logic"`, `"thinking"`). Toggles payload gates, function kernels, and thought satellites reactively.
- `desktop_create_diagram(title, kind, template?, tabId?, sessionId?)` creates a new diagram tab on-demand:
  - `kind: "flowchart"`: component topologies, state transitions, or micro-flows.
  - `kind: "sequence"`: chronological lifecycles, webhook retries, or RPC calls.
  - `kind: "erm"`: data relationships and entity boundaries.
  - Immediately switches to the created tab and exposes it in the editor workbench tabs.

### 5. Collaborative Storyline Recording & Guided Walkthroughs (UD11/UD12)
- `desktop_create_storyline(title, steps[], description?, storylineId?, tabId?)` creates and persists a guided storyline walkthrough on the canvas:
  - Each step defines: `title`, `narrative` (Markdown explanation), optional `targetNodeId`, `targetEdgeId`, `activeLayers` (`['topology' | 'data' | 'logic' | 'thinking']`), `highlightedLines`, and `activeThoughtIndex`.
  - Automatically selects and activates the newly created storyline for playback.
- `desktop_play_storyline(storylineId?, stepIndex?, tabId?)` activates and begins playback of a storyline at step 0 (or a specified step index).
- `desktop_step_storyline(direction)` steps through the active storyline:
  - `direction: "next"` advances to the next step.
  - `direction: "prev"` returns to the previous step.
  - `direction: <number>` jumps directly to a specific 0-based step index.
  - At each step transition, the player engine automatically morphs the active layers (`activeLayers`), zooms the viewport onto the target node via smooth autopilot (`fitView` with 45% padding), and focuses associated thought satellites or code highlights.

If the desktop application is not running or unreachable, these tools return an informative error message ("Desktop app is not reachable on 127.0.0.1:4143").
