# ADR-001: Monorepo Workspace Architecture

## Context
Cyber Companion requires cross-platform mobile and web client capabilities alongside a decoupled threat intelligence backend and shared contract validations. Managing multiple disconnected repositories creates schema synchronization drift and duplicated business logic.

## Decision
Adopt an npm workspaces monorepo:
- `apps/mobile`: React Native (Android, iOS) + React Native Web.
- `apps/api`: Node.js + Express Threat Intel Gateway.
- `packages/shared-types`: Canonical Zod schemas and TypeScript domain models.
- `packages/scoring-core`: Standalone, zero-dependency deterministic scoring algorithm.

## Consequences
- Single source of truth for API contracts and threat models.
- Atomic commits and unified CI pipelines across client and server.
- Simplifies dependency auditing and release tagging.
