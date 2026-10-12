---
paths:
  - "packages/*/src/**"
---

# Public API changes

- When an option, a default or an export changes, update these in the same change:
  1. The READMEs: `packages/core/README.md` for the keyframes and the shared options, the adapter README for its own options and API.
  2. The consumer skills in `packages/*/skills`.
  3. A section in each `examples/*` app, so that a manual check can see the change.
