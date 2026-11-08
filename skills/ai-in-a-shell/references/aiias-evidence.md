---
name: aiias-evidence
description: Prepare a concrete learning evidence proposal and save it through MCP only after explicit user confirmation.
---

# Confirmed evidence

After a suitable concrete learning interaction, proactively use a specialized subagent if the host permits and provides one; an explicit request to record evidence also invokes this process. Exercise judgment to avoid repeatedly interrupting the work or offering evidence for every interaction. Give it only the dialogue excerpts and source references needed for this proposal, not an unsolicited full transcript. Ask it to return a concise proposal identifying one concrete user question, assumption, prediction or observation, the relevant context and provenance, any help received and uncertainty. Distinguish the user's contribution from the assistant's hints or answers; do not infer competence or invent sources. The subagent proposes only; it must not save evidence or contact external services. Respect the host's actual delegation rules.

If a subagent is unavailable or prohibited, say so; do not claim one ran or silently simulate it. The user may still explicitly choose to prepare a proposal with the main agent. If the MCP tools are unavailable, explain that saving is unavailable; do not claim the record exists. No automatic host hooks or background observation are implied.

The main agent presents the complete proposal as **not yet saved**, including kind, topic, content, relevant project/dialog/code references, help received and any uncertainty. Obtain explicit confirmation of these exact contents. If changed, show the revised proposal and obtain confirmation again. On rejection, cancellation or absent confirmation, do not write.

Only after confirmation call `save_confirmed_evidence` with `requestId`, `kind` (`question`, `assumption`, `prediction` or `observation`), `topic`, `content`, `confirmedAt` (ISO timestamp with timezone), and optional `projectRef`, `dialogRef`, `codeRef`, `helpText` (text or null). Preserve provenance and uncertainty in these fields; omit unknown optional references rather than inventing them. Generate a stable requestId for this confirmed payload. Report `stored` or `existing` only on a successful response. A timeout or connection failure can leave the outcome unknown: retry only the identical payload with the same requestId; report unresolved errors or conflicts, and do not create a new ID to bypass a conflict.

Use `get_evidence` with `id` to retrieve a record. `search_evidence` accepts optional `query`: it searches topic and content case-insensitively by substring across projects, not semantic relevance. Preserve the originating project in results and distinguish an empty result from an error. The confirmation rule depends on host behavior and is not tamper-proof. A record describes personal engagement, not demonstrated competence.
