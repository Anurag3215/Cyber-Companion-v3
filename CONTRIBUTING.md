# Contributing to Cyber Companion

Thank you for contributing to Cyber Companion! To ensure enterprise-grade code quality and zero-trust security, all contributors must strictly adhere to our branching, commit, and pull request guidelines.

---

## 1. Branching Workflow

- **Never commit directly to `main` or `develop`.**
- All development must branch off the latest `develop`:
  ```bash
  git checkout develop
  git pull origin develop
  git checkout -b <type>/p<phase>-<kebab-description>
  ```
- Allowed Branch Types:
  - `feature/`: New capabilities (e.g. `feature/p3-qr-scanner-decode`)
  - `update/`: Enhancements to existing features
  - `fix/`: Bug fixes
  - `chore/`: Tooling, CI, dependencies
  - `docs/`: Documentation and architecture
  - `security/`: Vulnerability mitigations and hardening
  - `release/`: Release preparation branches cut from `develop`
  - `hotfix/`: Production hotfixes cut from `main`

---

## 2. Commit Message Conventions

We enforce [Conventional Commits](https://www.conventionalcommits.org/) via `commitlint`:
- Format: `<type>(<scope>): <short description>`
- Header Length: Maximum 72 characters.
- Example: `feat(url): add punycode lookalike detection`
- Example: `security(api): enforce SSRF loopback IP blocking`

---

## 3. Pull Request Checklist

Every PR must be opened against `develop` using the repository PR template:
1. Automated CI status checks (`lint-typecheck-test` and `branch-name`) must pass.
2. No secrets or API credentials committed.
3. No PII (raw URLs with credentials, Wi-Fi SSIDs/BSSIDs, full app package lists) logged or transmitted.
4. Input validation handled via Zod schemas.
5. All merges into `develop` use **Squash Merges** only.
