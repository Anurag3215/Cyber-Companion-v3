# Cyber Companion (v3)

> **An Intelligent, Non-Intrusive Cybersecurity Awareness & Protection System**  
> Cross-Platform Mobile (Android, iOS) & Web Client with Decoupled Cloud Threat Intelligence Gateway.

---

## 1. Project Overview

**Cyber Companion** is designed to bridge the gap between complex cyber threat telemetry and everyday smartphone users. Unlike reactive antivirus tools, Cyber Companion focuses on:
- **Proactive Threat Detection**: Intercepts phishing URLs, malicious QR codes ("Qishing"), insecure public Wi-Fi networks, and over-permissioned applications before engagement.
- **Contextual Plain-Language Insights**: Explains *why* an action or network is dangerous without cryptic jargon.
- **Holistic Security Scoring**: Aggregates device configurations, network safety, and permissions into a 0–100 Security Score.
- **Micro-Learning Awareness**: Delivers bite-sized, actionable cybersecurity tips (60 words or less).

---

## 2. Core Functional Modules

| Module | Technical Vector | Description |
| :--- | :--- | :--- |
| **Wi-Fi Risk Analyzer** | SSID, WPA2/WPA3/Open, Signal | Inspects public Wi-Fi encryption and flags open/unencrypted or rogue networks. |
| **URL Scanner** | Heuristics + Cloud Threat Intel | Evaluates web links against VirusTotal, Google Safe Browsing, and URLScan.io. |
| **QR Code Scanner** | Vision Camera + Sandboxing | Decodes QR payloads and inspects destination URLs before opening them. |
| **Permission Analyzer** | Android Package Manager | Audits installed applications for risky or excessive permission combos. |
| **Security Scoring Engine**| Deterministic Multi-Factor | Generates a 0–100 health score with top 3 actionable recommendations. |
| **Cyber Awareness Hub** | Localized JSON KB + Push | Delivers daily security tips and contextual threat breakdowns. |

---

## 3. Monorepo Architecture

```text
cyber-companion-v3/
├── apps/
│   ├── mobile/             # React Native (Android & iOS) + Web Client
│   └── api/                # Node.js + Express Threat Intelligence Gateway
├── packages/
│   ├── shared-types/       # Shared TypeScript contracts and schemas (Zod)
│   └── scoring-core/       # Deterministic scoring algorithm and calibration tests
├── docs/                   # Architecture, Threat Model, ADRs, and Specifications
└── scripts/                # Git workflow, CI/CD, and phase automation scripts
```

---

## 4. Branching & Contribution Model

This repository adheres to strict Git branching and version control rules:
- `main`: Production-ready, tagged releases only (`v0.1.0`, `v0.2.0`, etc.).
- `develop`: Central integration branch. All features merge into `develop` via squash PRs.
- Feature branches: `<type>/p<phase>-<kebab-description>` (e.g., `feature/p3-qr-scanner-decode`).
- Conventional Commits: Enforced by `commitlint`.

For full branching guidelines, refer to [`docs/BRANCHING.md`](docs/BRANCHING.md).
