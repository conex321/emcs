---
name: update-project-notes
description: Use at the end of any session and after any material change (new feature, architecture shift, non-trivial bugfix, production deploy, schema migration, or failure-then-resolution). Also use on explicit requests like "update notes", "save project notes", "update project memory", or "log this session". Merges the session's work into `/Users/matthews/EMCS/Project_notes_folder/PROJECT_NOTES.md` by integrating into existing sections — never blind-appends.
---

# Update Project Notes

Use this skill at the end of any session that changes code, architecture, deployment state, production verification status, or operating assumptions. Also use it immediately when the user explicitly asks to "update notes", "update project notes", "write project memory", or similar.

## Purpose
Maintain `/Users/matthews/EMCS/Project_notes_folder/PROJECT_NOTES.md` as shared, agent-agnostic memory for both Claude and Codex.

## When to trigger
- End of session, if anything material changed
- After any new feature, nontrivial bugfix, migration, deployment, or production verification
- After any architecture or process decision
- On explicit user request to update project memory or notes

## Required behavior
1. Read the current `/Users/matthews/EMCS/Project_notes_folder/PROJECT_NOTES.md`.
2. Merge new information into the correct existing sections.
3. If the file is missing, create it with the required project-notes structure.
4. Update the top metadata fields:
   - `Last updated`
   - `Last agent`
   - `Session summary`
5. Keep the file agent-agnostic:
   - plain Markdown only
   - no tool-specific syntax
   - no first-person phrasing
   - exact commands, versions, and absolute paths where useful
6. Never blindly append a new block to the bottom. Integrate the new state into:
   - `Current State`
   - `Architecture & Key Decisions`
   - `File & Directory Map`
   - `Accomplishments Log`
   - `Failures & Resolutions`
   - `Open Questions / Next Steps`
   - `Context for the Next Agent`

## Update checklist
- Remove or revise stale statements that are no longer true.
- Call out what is live in production versus only local or only repo-side.
- Record cleanup status for any disposable test data created during verification.
- Note unreleased local patches separately from deployed production state.
- Preserve high-signal history; compress repetition instead of duplicating it.

## Output
After updating the notes, output a short confirmation that lists which sections were modified.
