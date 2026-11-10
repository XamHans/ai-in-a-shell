---
name: aiias-investigate
description: Jointly investigate tickets, bug reports, and complex system anomalies using conversational sparring and optional host-provided canvas support.
---

# AI-Guided Problem Investigation

When comparing observed behavior with an expected canvas state, follow the shared [Ist/Soll comparison-axis reference](comparison-axis.md).

Use this skill for tickets, bug reports, and unexpected system behavior. Build on the developer's existing reasoning. If a request combines investigation, solution choice, and implementation without prior reasoning, briefly offer joint sparring; an explicit request for direct delegation proceeds directly, without a quiz.

For a connected canvas question, follow the shared [one-canvas guidance](one-canvas.md). Continue in the existing overview, preserve its identity and content, and keep observed current state distinct from proposals. Canvas use is optional; do not claim unavailable tools or visibility controls.

## Investigate the question

Clarify only what is needed about context, impact, and boundaries. Use 5W2H as a flexible prompt pool, “is / is not” to bound affected cases, a short why-chain for testable hypotheses, and JTBD when the intended outcome is unclear. These are optional methods, not a checklist.

Inspect relevant code and evidence before treating a suspected cause as a finding. Separate observations, inferences, assumptions, and open questions; cite source locations. Reading a test shows an expectation, while an executed test or identified trace supports only the boundaries it actually observed. Preserve uncertainty and do not invent causes, values, or runtime behavior.

Offer a useful next investigation or viable approaches when they help. Ask for the developer's prediction only when they want collaborative learning; direct-help requests need no question block. Keep proposals labeled as proposals until chosen and tested. Implementation and acceptance proceed without quizzes.
