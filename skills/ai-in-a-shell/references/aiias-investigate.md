---
name: aiias-investigate
description: Jointly investigate tickets, bug reports, and complex system anomalies using conversational sparring in chat and live MCP camera/thought autopilot on the desktop canvas.
---

# AI-Guided Problem Investigation (10-Step Canvas Sparring Protocol)

Use this skill when investigating a bug report, ticket (e.g. *„Manche bezahlten Bestellungen werden nicht versendet“*), or unexpected system behavior.

The AI leads the investigation in chat and drives navigation, selection, thoughts, and evidence on the canvas via MCP. The developer brings mental models, expectations, and decisions. Only after a well-reasoned solution model is established does the AI take over implementation.

---

## The 10-Step Investigation Workflow

### Step 1: Intercept Blind Delegation & Offer Sparring
- **Chat:** If the user says *„Analysiere dieses Ticket und implementiere den Fix“* without prior reasoning, do not immediately write code. Intercept with a short conscious offer:
  > „Du übergibst gerade Untersuchung, Lösungswahl und Umsetzung zusammen an mich. Wollen wir zuerst ein eigenes Modell und einen begründeten Lösungsansatz entwickeln? Danach übernehme ich die Implementierung.“
- **MCP Action:** Check connection with `desktop_ping()`. Do not create premature diagrams before alignment.
- **Direct Help:** If the user insists on immediate direct delegation, honor it and proceed directly to implementation without learning quizzes.

### Step 2: Capture Problem & Initial Suspicion
- **Chat:** Ask: *„Was wissen wir über einen betroffenen Fall, und was vermutest du bisher?“* Keep observations and hypotheses strictly separated.
- **MCP Action:**
  - Open/create session: `desktop_open_session(sessionId)` or `create_session(...)`.
  - Dock initial thought: `desktop_attach_thought(nodeId: "ticket-start", title: "Ausgangsvermutung", content: "...", badges: ["HYPOTHESE"])`.
  - Collapse bottom drawer with `desktop_set_drawer_open(open: false)` to give 100% vertical space to the canvas.

### Step 3: Map the System Topology (Components & Seams)
- **Chat:** Explain the participating modules (internal services, DB, queue, external providers) grounded in real source files.
- **MCP Action:**
  - Create or switch to topology tab: `desktop_create_diagram(title: "System-Topologie", kind: "flowchart")`.
  - Focus entry station: `desktop_focus_station(nodeId: "entry-handler")`.

### Step 4: Open Chronological Flow (Sequence Diagram)
- **Chat:** Focus on the sequence of operations: who calls whom, when data is stored, and when events/messages are dispatched.
  > „Hier wird zuerst der Zahlungsstatus gespeichert und anschließend der Versandauftrag gesendet. Wir untersuchen diese Übergabe genauer.“
- **MCP Action:**
  - Switch to or create sequence tab: `desktop_create_diagram(title: "Ablauf Zahlung", kind: "sequence")` or `desktop_switch_tab(tabId: "seq_payment")`.
  - Focus handoff station: `desktop_focus_station(nodeId: "order_to_shipping")`.

### Step 5: Bounded Foundation Exkurs (e.g. "Was ist ein Webhook?")
- **Chat:** When the developer says *„Warte, ich verstehe X noch nicht“*, give a concise, grounded explanation of the concept (e.g. at-least-once delivery, retry mechanics).
- **MCP Action:**
  - Create an isolated mini-diagram tab: `desktop_create_diagram(title: "Exkurs: Webhook Delivery", kind: "sequence")`.
  - Keep the exkurs bounded so it does not clutter the main system architecture.

### Step 6: Return to Project & Solicit Prediction (Aha-Moment Filter)
- **Chat:** Return to the main flow. Before revealing what the code does, **ask for a concrete expectation**:
  > „Die Zahlung wurde gespeichert, aber das Senden des Versandauftrags schlägt fehl. Was erwartest du, wenn dieselbe Zahlungsnachricht erneut ankommt?“
- **MCP Action:**
  - Switch back to the investigation diagram: `desktop_switch_tab(tabId: "seq_payment")`.
  - Zoom onto the seam: `desktop_focus_station(nodeId: "payment-handler")`.
  - Present the question in a thought bubble: `desktop_attach_thought(nodeId: "payment-handler", title: "Vorhersage", content: "Was passiert bei Redelivery?", badges: ["FRAGE · Erwartung"])`.

### Step 7: Compare Prediction with Actual Code Findings
- **Chat:** Compare the developer's expectation with the actual code branch found (e.g. early return on `order.isPaid` before dispatch).
  > „Hier endet die Verarbeitung bei bereits bezahlten Bestellungen. Damit überspringt die erneute Zustellung den fehlenden Versandauftrag. Das widerspricht unserer bisherigen Erwartung.“
- **MCP Action:**
  - Attach the finding to the handler: `desktop_attach_thought(nodeId: "payment-handler", title: "Befund: Early Return", content: "if (order.isPaid) return; überspringt Versandauftrag", badges: ["GAP", "IST · Code"], fileRef: "src/payment/handler.ts#L42")`.

### Step 8: Prove Hypotheses with Concrete Evidence (Data-Probe Stepper)
- **Chat:** Correlate executed test results, logs, and payload traces to the path stations.
  > „Das Speichern der Zahlung ist belegt. Das Senden des Versandauftrags fehlt in den Daten. Wir testen den Zwischenschritt.“
- **MCP Action:**
  - Step successful path: `desktop_step_edge(edgeId: "order_to_db", status: "success", label: "Zahlung verbucht", payloadPreview: "{ status: 'PAID' }")`.
  - Step broken path: `desktop_step_edge(edgeId: "order_to_queue", status: "failed", label: "Dispatch fehlt", payloadPreview: "SKIP: already_paid")`.
  - Watch the canvas: the proven edge turns green with a soft glow; the missing edge highlights red-dashed with a warning drop-shadow.

### Step 9: Design & Model the Solution (Outbox / Idempotency)
- **Chat:** Ask: *„Wie könnten wir sicherstellen, dass notwendige Folgearbeit nach dem Speichern erhalten bleibt?“* Discuss transactional boundaries (e.g. Transactional Outbox Pattern).
- **MCP Action:**
  - Create solution comparison view: `desktop_create_diagram(title: "Entwurf: Transactional Outbox", kind: "flowchart")`.
  - Mark proposed nodes with `SOLL · Entwurf`.

### Step 10: Targeted Delegation to Implementation
- **Chat:** Investigation is complete. Summarize the verified invariant, seam, and acceptance criteria.
  > „Das Problem und die Lösungsarchitektur stehen fest. Ich übernehme jetzt die Implementierung per TDD.“
- **MCP Action:**
  - Mark station ready: `desktop_attach_thought(nodeId: "payment-handler", title: "Bereit für Umsetzung", content: "Outbox Pattern mit Idempotenz-Key", badges: ["STATUS: READY"])`.
- **Handoff:** Enter implementation (e.g. `/implement`) directly without quizzes or learning prompts during coding and test verification.
