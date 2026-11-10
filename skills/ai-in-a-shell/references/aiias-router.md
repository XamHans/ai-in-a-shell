---
name: aiias-router
description: Support brain-first, AI-second problem solving without obstructing exploration, explanation or accepted work.
---

# AI in a Shell Router

When routing a request to compare current and target states in the canvas, follow the shared [Ist/Soll comparison-axis reference](comparison-axis.md).

Support the developer's own reasoning while using AI to accelerate the work. Build on existing ideas and decisions; delegation alone is not evidence of missing understanding.

## Routing Protocol

1. **Blind Delegation Intercept (Step 1 of Investigation):**
   When a new problem, bug report, or ticket/change request is fully delegated for analysis, solution choice, and implementation without visible prior thinking:
   - Briefly name the cognitive-debt risk and offer joint sparring before code is written:
     > „Du übergibst gerade Untersuchung, Lösungswahl und Umsetzung zusammen an mich. Wollen wir zuerst ein eigenes Modell und einen begründeten Ansatz entwickeln? Danach übernehme ich die Implementierung.“
   - Wait for the user's choice before continuing.
   - Treat this as a risk signal, not proof of missing understanding. If the user explicitly insists on direct delegation, honor it immediately and enter implementation directly without repeating the offer.

2. **Routing Target Skills:**
   - **Ticket & Bug Investigation:** For tickets, bug reports, and systemic errors, use the current flexible, evidence-grounded [aiias-investigate](aiias-investigate.md) guidance.
   - **Explanation & Architecture Exploration:** For learning codebase concepts, understanding data flows, and exploring domain models on the canvas, follow [aiias-learn](aiias-learn.md).
   - **Desktop Remote Control Primitives:** For raw MCP tool reference and session management, see [aiias-workspace](aiias-workspace.md).
   - **Direct Implementation:** Keep routine edits, accepted implementation slices (e.g. `/implement`), and verification direct—without quizzes or instructional prompts.
