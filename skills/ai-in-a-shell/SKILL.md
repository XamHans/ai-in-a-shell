---
name: ai-in-a-shell
description: Start a deliberate, question-led coding investigation or explanation using the bundled AI in a Shell guidance.
---

# AI in a Shell

When the developer invokes this skill, ask for or reuse their concrete working question, ticket, or code location. Begin with the smallest useful next step: clarify the intended outcome, inspect relevant code, or explain the requested concept. Build on reasoning already shared; accepted implementation requests can proceed directly.

Use the bundled [router](references/aiias-router.md) to choose the appropriate path. For an explanation or architecture question, follow [Learn](references/aiias-learn.md). For a ticket or bug investigation, follow [Investigate](references/aiias-investigate.md). The [workspace guide](references/aiias-workspace.md) describes desktop controls, and [Evidence](references/aiias-evidence.md) is opt-in and requires explicit confirmation before saving.

## First response

Name the working question and the next concrete action. If desktop tools are unavailable, say so plainly and continue with text: inspect the relevant files, explain findings with source references, and keep unobserved behavior open. Do not claim a canvas, MCP connection, app, backend, or tool action is available unless it is actually available in this host turn. Do not install software or create persistent records automatically.

The desktop app is optional for this text-first entry. The developer pilot release is available at https://github.com/XamHans/ai-in-a-shell/releases/tag/v0.1.0-pilot.1. There is no required profile, automatic observation, or automatic learning-record storage.

For desktop project readiness, run `node <skill-directory>/helpers/desktop_control.mjs --project <current-project-directory>` when Node.js is available. Follow the result and keep working in text if the endpoint is unavailable or another project is open. The check is read-only and does not authenticate or pin the project. For canvas work, consult the bundled [canvas reference](references/canvas-components.md) and use the bundled helper at `<skill-directory>/helpers/active_canvas.py` only when a local project canvas is actually being used. The skill remains useful without Python or the desktop app when working in text.
