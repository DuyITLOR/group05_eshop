---
name: ai-audit-logger
description: Record every AI interaction into the mandatory AI Audit Report after an AI session. Use whenever the student chats with an AI tool while doing HW02. Appends a structured entry (tool, date/time, prompt, output, human review) to ai-audit/ai-audit-report.md.
---

# AI Audit Logger Skill

The homework **requires** a complete log of every AI interaction (section 9). A missing
audit report = 0 points. This skill automates capturing that log so nothing is forgotten.

## When to use
- After any AI session (prompt + response) related to HW02.
- Whenever the student says "log this", "ghi audit", or finishes a chat turn worth recording.

## What to capture per interaction
1. **AI tool** — name + model (e.g. `Claude Code (Opus 4.8)`, `ChatGPT`).
2. **Date & time** — use the real timestamp; if only the date is known, record the date.
3. **Your prompt** — the student's prompt, verbatim (in a code block).
4. **The AI output** — the response, full or faithfully summarized.
5. **Human review** — what the student checked/corrected (the student fills this in).

## Procedure
1. Open `ai-audit/ai-audit-report.md`.
2. Find the highest existing `Interaction #N`; the new one is `#N+1`.
3. Insert the new entry **immediately above** the `<!-- NEW_INTERACTION_MARKER -->` line,
   using this exact template:

   ```markdown
   ### Interaction #<N>
   - **AI tool:** <tool + model>
   - **Date & time:** <YYYY-MM-DD HH:MM>
   - **Your prompt:**
     ```
     <verbatim prompt>
     ```
   - **AI output (summary):** <faithful summary or full text>
   - **Human review:** <what the student verified/changed>
   ```
4. Keep the declaration line `"I use AI tools for the following tasks."` at the top.
5. Commit with an English message, e.g. `docs: add AI audit log (interaction #<N>)`.

## Rules
- Never invent prompts or outputs — copy faithfully (anti-cheat: prompts must be the
  student's own and must never be shared between students).
- Do not fabricate precise times; record the date if the time is unknown.
- Leave the **Human review** line for the student when their own judgment is needed.

## Related
- Pairs with the **AI Critique** (200–300 words) in `ai-audit/ai-critique.md`.
