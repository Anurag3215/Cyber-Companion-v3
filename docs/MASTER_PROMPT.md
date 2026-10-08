# Cyber Companion — Master Specification & Architectural Truth

This document serves as the project's definitive source of truth across all phases of development.

---

## Section 0: Project Identity & Executive Overview
Cyber Companion is a lightweight, non-intrusive mobile and web application designed to operate as a personalized digital security assistant. Unlike traditional mobile antivirus products that rely on reactive malware signature scanning and automated file deletion, Cyber Companion is architected around **prevention**, **contextual threat intelligence**, and **user education**.
- **Platform Targets**: Cross-Platform (Android, iOS & Web).
- **Core Category**: Proactive Cyber Awareness & Threat Intel.
- **Primary Objective**: Bridge the critical gap between complex technical threat data and the everyday non-technical user by translating raw telemetry (URL risk vectors, network encryption status, application permissions) into actionable insights written in plain language.

---

## Section 1: Problem Statement & Key Purpose
1. **Connecting to Untrusted Public Wi-Fi**: Open networks in public venues frequently expose users to Man-in-the-Middle (MitM) attacks and data interception.
2. **Scanning QR Codes without Verification**: Quick Response (QR) code spoofing ("Qishing") redirects users to phishing pages or automated malicious payloads.
3. **Interacting with Unverified Links**: Smishing (SMS phishing) and social engineering links trick users into divulging credentials.
4. **Over-Permissioning Applications**: Installing mobile apps without auditing excessive permission requests (e.g., SMS, Microphone, Contacts) risks privacy leakage.

**Project Purpose**: Lower human-error-induced cyber breaches on mobile devices, elevate baseline digital hygiene across user demographics, and convert passive smartphone users into security-aware digital citizens.

---

## Section 2: Technical Architecture & Monorepo Structure
```text
cyber-companion-v3/
├── apps/
│   ├── mobile/             # React Native (Android, iOS) + React Native Web
│   └── api/                # Node.js + Express.js REST Threat Intel Gateway
├── packages/
│   ├── shared-types/       # Shared TypeScript types & Zod contracts
│   └── scoring-core/       # Deterministic security score calculation engine
├── docs/                   # Architectural specs, ADRs, Threat Models, Branching
└── scripts/                # Git lifecycle automation and release scripts
```
- **Mobile Client**: React Native + TypeScript, React Native Web, React Native Paper (Material UI), React Navigation, Zustand / Redux Toolkit, Axios, React Native Vision Camera, Vision Camera Code Scanner, NetInfo, MMKV / AsyncStorage.
- **Backend & Data**: Node.js + Express.js REST API, MongoDB Atlas, VirusTotal API, Google Safe Browsing API, URLScan.io API, Firebase Cloud Messaging (FCM).
- **DevOps**: Jest, React Native Testing Library, GitHub Actions CI, ESLint, Prettier, commitlint.

---

## Section 3: Module 1 — Wi-Fi Risk Analyzer
- Inspects public Wi-Fi parameters including SSID broadcast, security/encryption protocol type (WPA2, WPA3, Open/WEP), and signal profiles.
- Flags insecure networks (unencrypted open networks, captive portals, captive sniffing vectors).
- Provides clear fallback messages on platforms where Wi-Fi telemetry is restricted (e.g., iOS current-network manual checklist, Web checklist).

---

## Section 4: Module 2 — URL Scanner
- Evaluates user-input or link-captured Web URLs against cloud threat intelligence engines.
- **Heuristics Engine**: IDN/punycode homograph detection, IP address as hostname, known URL shortener expansion, suspicious high-risk TLDs, HTTP vs HTTPS warnings, `@` symbol in authority component.
- **Threat Intel Adapters**: Safe Browsing API, VirusTotal API, URLhaus, OpenPhish, optional URLScan.io with strict timeouts, caching, and fallback to heuristics on quota exhaustion.

---

## Section 5: Module 3 — QR Scanner
- Decodes QR matrices using Vision Camera / Barcode scanning or gallery image upload.
- Extracts embedded target endpoints and classifies payload type (URL, Wi-Fi config, vCard, Plain Text, App Deep Link).
- Conducts automated pre-execution threat analysis prior to browser redirection.
- Manual paste fallback for non-camera environments.

---

## Section 6: Module 4 — Permission Analyzer
- Audits installed applications for risky or excessive access permissions (Camera, Microphone, SMS, Contacts, Location).
- Flags high-risk permission combinations (e.g., SMS + Internet = OTP stealer risk).
- All audits execute strictly on-device; no package lists or user data are sent to external cloud servers.

---

## Section 7: Module 5 — Security Scoring Engine
- Aggregates device configurations, network safety, and app permissions into a standardized, easy-to-understand holistic metric on a **0–100 scale**.
- Pure deterministic calculation with versioned formula (`scoreVersion: 1`).
- Factor Weights: Network Safety (30%), URL/Browsing Habits (30%), Permission Posture (20%), Device Baseline (20%).
- Monotonic guarantees: fixing an issue never lowers the score.
- Plain-language explainability: returns top 3 fixes with points gained.

---

## Section 8: Module 6 — Cyber Awareness & Notification Engine
- Daily micro-learning security tips (<= 60 words, 6th-grade reading level).
- Contextual "Why was this dangerous?" cards derived from scan results.
- Notification Engine: Quiet hours support, per-category alert toggles, privacy-preserving notification delivery.
- Light gamification: streaks and badges without dark patterns.

---

## Section 9: Security, Privacy & SSRF Guardrails
- **SSRF Protection**: Private IP ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), loopback (`127.0.0.0/8`, `::1`), link-local (`169.254.0.0/16`), and DNS rebinding blocked on server-side fetching.
- **Zero Secrets**: No API keys bundled in client code.
- **No PII**: No sensitive personal data logged or transmitted.

---

## Section 10: Lifecycle Roadmap & Phase Gates
- **Phase 1**: Requirement Analysis + Repo Foundation (`v0.1.0`)
- **Phase 2**: System Design + UX (`v0.1.0`)
- **Phase 3**: Core Development (`v0.2.0`)
- **Phase 4**: Threat Intelligence Integration (`v0.3.0`)
- **Phase 5**: Security Scoring Engine (`v0.4.0`)
- **Phase 6**: Cyber Awareness + Notifications (`v0.5.0`)
- **Phase 7**: Testing, QA, Hardening & Release (`v1.0.0`)
- **Phase 8**: Admin Console (optional)
- **Phase 9**: AI Explainer RAG (optional)

---

## Section 11: Testing & Quality Assurance
- Unit testing with Jest (scoring-core >= 90% coverage).
- Contract testing for all REST endpoints with Zod schemas.
- E2E testing flows (Playwright for Web, Maestro for mobile).
- False-positive / false-negative calibration suites for URL classification.

---

## Section 12: Admin Console & AI Explainer (Optional Phases 8 & 9)
- Phase 8 Admin Console: RBAC (admin/editor/viewer), TOTP MFA, anonymized telemetry metrics, strict CSP.
- Phase 9 AI Explainer: RAG with curated knowledge base, fixed system prompts, strict schema validation, prompt injection regression test suite. Verdict never depends on LLM.

---

## Section 13: Agent Rules (Git Branching & Operational Workflow)
1. Never commit directly to `main` or `develop`.
2. All work branches off `develop`: `<type>/p<phase>-<kebab-description>`.
3. Small, atomic Conventional Commits (`feat(...)`, `fix(...)`, `chore(...)`, `docs(...)`, `security(...)`).
4. PRs into `develop` with mandatory CI checks and squash merge only.
5. Release branches `release/<version>` cut from `develop`, merged to `main`, tagged, then synced back to `develop`.
6. Zero secrets, zero PII, strict SSRF guardrails.

---

## Section 14: CI/CD & Automation Specifications
- GitHub Actions CI runs on all PRs to `develop` and `main`.
- Jobs: `lint-typecheck-test` (npm ci, lint, typecheck, test) and `branch-name` (enforces `<type>/p<phase>-<description>`).
- Dependabot configured for weekly npm and GitHub Actions updates.
