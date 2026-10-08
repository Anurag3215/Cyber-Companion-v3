# Changelog

All notable changes to the Cyber Companion project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-09
### Added
- **E2E Integration Suite**: Comprehensive end-to-end integration test runner validating end-to-end user flows, API Gateway, scoring core, and threat defense.
- **API Pentest & Abuse Hardening**: Hardened SSRF guard against DWord integer, Hex IP, and IPv6-mapped bypass vectors. Validated protection against non-HTTP schemes, null bytes, and oversized payloads.
- **Mobile Client Hardening**: SPKI certificate pinning for API endpoints, anti-tamper heuristics (root/jailbreak/emulator detection), and production log suppression.
- **Heuristics Ground-Truth Benchmark**: 60-sample benchmark dataset achieving FPR = 0.0% (< 1%) and FNR = 0.0% (< 5%) with 100% accuracy.
- **Release Documentation**: Finalized Privacy Policy, App Store / Google Play metadata, User Manual, and Threat Disclaimer.

---

## [0.5.0] - 2026-10-09
### Added
- **Contextual Threat Cards**: "Why was this dangerous?" educational cards breaking down threat dynamics upon dangerous scan verdicts.
- **Daily Cyber Tips Engine**: Versioned awareness tips feed with 60-word micro-learning lessons and offline cache.
- **Notification Manager**: Category toggles, quiet hours scheduler (22:00 to 08:00), and high-severity threat alert bypass.
- **Gamification & Badges**: Ethical daily streak tracking with pause capabilities, milestone achievement unlocks, and weekly summaries.

---

## [0.4.0] - 2026-10-09
### Added
- **Scoring Core Engine**: Pure mathematical, deterministic security score function ($30/30/20/20$ weighting model).
- **Explainability Engine**: Plain-language reasoning generator providing top 3 actionable remediation steps.
- **Score UI**: Animated circular gauge and score history sparkline components.
- **Calibration Suite**: Randomized property tests verifying 0–100 monotonicity across 100 permutations.

---

## [0.3.0] - 2026-10-09
### Added
- **Threat Intelligence Gateway**: Express + TypeScript API gateway with zero-PII structured logger and rate limiting.
- **Heuristics Engine**: Punycode IDN homoglyph detector, suspicious TLD analyzer, IP host detector, and authority spoofing filters.
- **Multi-Engine Consensus**: Weighted verdict merger combining heuristics with VirusTotal, Google Safe Browsing, and URLhaus.
- **SSRF Defense**: RFC 1918 private subnet, loopback, and cloud metadata blocking.

---

## [0.2.0] - 2026-10-09
### Added
- **Cross-Platform Mobile Shell**: React Native/Web navigation shell with light/dark theme toggle and 3-screen onboarding.
- **QR & Barcode Scanner**: Camera-based and gallery-upload QR decoder with manual input fallback.
- **Wi-Fi Telemetry Service**: WPA3/WPA2/WEP/Open network analyzer and rogue AP detection.
- **Permission Auditor**: On-device application permission risk scorer (Camera, Location, Microphone, SMS).
- **Storage Layer**: Dual-mode MMKV and LocalStorage adapter.

---

## [0.1.0] - 2026-10-09
### Added
- **Repository Scaffold**: Monorepo workspaces (`apps/api`, `apps/mobile`, `packages/shared-types`, `packages/scoring-core`).
- **Design System**: Tokens, components (`RiskBadge`, `ScoreGauge`, `ActionCard`, `TipCard`, `PermissionRow`, `ScanResultSheet`).
- **OpenAPI 3.0 Specification**: Full API schemas for all `/v1` endpoints.
- **Architecture & Threat Model**: STRIDE threat matrix, data flow diagrams, and ADRs 001–005.
- **Governance**: Personas, User Stories, Platform Limits, Risk Register, Contributing guidelines, and CI/CD security workflows.
