**Contract Intelligence Platform — How It Works**

A user uploads a contract. The platform runs it through four stages:

**Stage 1 — Intake & Classification**
The system parses the document, identifies the contract domain (rent, employment, loan, etc.), detects the governing jurisdiction from the governing law clause, and asks the user which party they are. PII is stripped before anything touches the LLM. The user confirms the classification before proceeding — this is both a UX checkpoint and a liability shift.

**Stage 2 — AI Analysis**
The cleaned contract goes to the LLM pipeline. Each clause is segmented and scored across four dimensions: clarity, deviation from public standard, obligation asymmetry, and financial exposure. Complex clauses are rewritten in plain language, shown inline on the PDF. Red flag clauses (unilateral amendment rights, unlimited indemnification, etc.) are surfaced immediately. An obligation map shows what *you* must do vs what *they* must do. A financial exposure calculator pulls every number from the contract and shows total liability over the contract term.

**Stage 3 — Comparison View**
Each flagged clause is shown alongside a spectrum of what exists in public domain contracts — aggressive, balanced, and user-protective versions. The platform never says "change this to X." It shows what the market looks like. The user draws their own conclusion. Clauses are priority-ranked so the user knows which three to focus on if they negotiate.

**Stage 4 — Human Layer**
The user can book a 15–30 minute consultation with a domain-matched advocate (employment contract → labour law specialist), or choose the async option where a lawyer sends written comments within 24 hours at a lower price point. After negotiation, the user re-uploads the revised contract and the platform shows exactly what improved.

That's the full loop — document in, clarity out, lawyer on demand if needed.