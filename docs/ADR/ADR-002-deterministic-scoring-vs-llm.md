# ADR-002: Deterministic Scoring vs Generative AI

## Context
A core value proposition of Cyber Companion is presenting a trustworthy 0–100 Security Health Score. If this score is generated or influenced by Large Language Models (LLMs), it introduces non-determinism, hallucinations, vulnerability to prompt injection, and lack of reproducible auditability.

## Decision
Enforce a 100% pure, deterministic mathematical scoring formula in `packages/scoring-core`:
- Weighting: Network Safety (30%), URL Safety (30%), App Permissions (20%), Device Baseline (20%).
- Guaranteed mathematical bounds: $[0, 100]$.
- Guaranteed monotonic behavior: Mitigating any vulnerability strictly increases or preserves the score.
- Plain-language explanations are generated via deterministic template lookups, not runtime generative text models.

## Consequences
- Guaranteed auditability and mathematical predictability.
- Offline execution without cloud latency or API cost.
- Complete immunity to prompt injection and jailbreaking.
