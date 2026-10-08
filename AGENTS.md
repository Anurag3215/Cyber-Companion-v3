# Section 13: Agent Rules (Cyber Companion v3 Source of Truth)

All coding assistants and human developers working in this repository MUST strictly abide by the following operational constraints:

1. **Branching Model**:
   - **Never commit directly to `main` or `develop`.**
   - Feature development, bug fixes, chore tasks, documentation, and security hardening MUST branch off the latest `develop`.
   - Branch naming format: `<type>/p<phase>-<kebab-description>`
     - Types: `feature`, `update`, `fix`, `chore`, `docs`, `security`, `release`, `hotfix`
     - Example: `feature/p1-repo-bootstrap`, `feature/p3-qr-scanner-decode`, `security/p4-ssrf-guard`
   - Merge strategy: **Squash merges only** into `develop` through GitHub Pull Requests.
   - Deletion: Delete feature branches automatically after successful merge.

2. **Commit Conventions**:
   - Strictly follow [Conventional Commits](https://www.conventionalcommits.org/):
     - `feat(<scope>): <short description>`
     - `fix(<scope>): <short description>`
     - `chore(<scope>): <short description>`
     - `docs(<scope>): <short description>`
     - `security(<scope>): <short description>`
   - Maximum commit header length: 72 characters.
   - Atomic commits: Keep commits small, focused, and testable.

3. **Phase Gates & Approvals**:
   - Work strictly within the active Phase scope.
   - Do NOT jump ahead to future phase implementations before completing current phase exit gates.
   - Cut `release/<version>` branches only from `develop` upon passing all phase exit criteria.
   - Tag releases (`v0.1.0`, `v0.2.0`, `v0.3.0`, `v0.4.0`, `v0.5.0`, `v1.0.0`) on `main` after PR merge, then sync `main` back into `develop`.

4. **Zero-Trust Security & Privacy Principles**:
   - **No Secrets**: Never commit API keys, tokens, credentials, or production connection strings to Git. Use environment variables and `.env.example`.
   - **Zero User PII in Logs/Telemetry**: Never log or transmit user URLs, scanned QR raw text containing sensitive data, Wi-Fi SSIDs/BSSIDs, or full application package lists to external third parties without user consent.
   - **SSRF & Sandbox Guard**: All server-side URL lookups must enforce loopback/link-local/private IP blocking and DNS rebinding protections.
   - **On-Device Scopes**: App permission analysis is strictly on-device. No `QUERY_ALL_PACKAGES` unless strictly justified and isolated.
   - **Pure Deterministic Scoring**: Security scores must be calculated through pure, deterministic functions (0–100 monotonic scale), not generative AI hallucination.
