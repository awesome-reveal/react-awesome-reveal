@AGENTS.md

Use the `adding-framework-adapters` skill to start a new framework package, and the `releasing-packages` skill to release.

When you add or change docs, skills or rules (READMEs, `AGENTS.md`, `CLAUDE.md`, `.claude/rules`, `.claude/skills` and `packages/*/skills`):

1. Audit them with the `claude-api` skill (`/claude-api prompt-audit <files>`).
2. Validate each claim against the current docs of the tool or library that it is about. Use Context7 or the official docs, and the installed source when the docs do not answer.
