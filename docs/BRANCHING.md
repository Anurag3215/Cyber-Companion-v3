# Branching & Version Control

```
main     ── v0.1.0 ───── v0.2.0 ───── v0.3.0 ... v1.0.0    (tagged, always releasable)
              ▲             ▲
         release/v0.1.0  release/v0.2.0                     (stabilise a phase)
develop  ── integration of every phase ─────────────────
  ▲  ▲  ▲
  │  │  └─ fix/pN-*      bug fixes
  │  └──── update/pN-*   improvements to existing features
  └─────── feature/pN-*  new work
  (also chore/*, docs/*, security/*; hotfix/* branches from main)
```

Naming: `<type>/p<phase>-<kebab-description>` e.g. `feature/p3-qr-scanner-decode`

## Per-phase loop
1. `scripts/new-phase.sh N feature <name>` → work → Conventional Commits.
2. Push, PR → `develop`, squash-merge once CI + review pass (branch auto-deletes).
3. Repeat feature / update / fix branches until the phase exit criteria pass.
4. `scripts/finish-phase.sh N` → `release/vX.Y.0` → PR → `main` → annotated tag → PR `main` → `develop`.

| Phase | Tag |
|---|---|
| 1–2 | v0.1.0 |
| 3 | v0.2.0 |
| 4 | v0.3.0 |
| 5 | v0.4.0 |
| 6 | v0.5.0 |
| 7 | v1.0.0 |
| 8–9 (optional) | none until you decide |

Commits: `feat(url): add homograph detection` · `fix(qr): handle empty payload` · `security(api): block private IP ranges`

Rules: no direct commits to `main`/`develop`; squash merges only; no force-push; no secrets ever.
