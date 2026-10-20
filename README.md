# Cyber Companion (v3)

[![Release](https://img.shields.io/badge/release-v1.1.0-blue.svg)](https://github.com/Anurag3215/Cyber-Companion-v3/releases/tag/v1.1.0)
[![Tests](https://img.shields.io/badge/tests-25%20passed%20%7C%20116%20tests-brightgreen.svg)]()
[![Benchmark](https://img.shields.io/badge/accuracy-100%25%20(FP%200%25%20%7C%20FN%200%25)-success.svg)]()
[![License](https://img.shields.io/badge/license-MIT-green.svg)]()

> **An Intelligent, Zero-Trust Cybersecurity Awareness & Protection System**  
> Cross-Platform Mobile (Android, iOS) & Progressive Web Application (PWA) with Decoupled Threat Intelligence Gateway, Three.js 3D Interactive Core, and Curated RAG AI Explainer.

---

## 1. Project Overview

**Cyber Companion** bridges the critical gap between complex cyber threat telemetry and everyday smartphone users. Unlike reactive antivirus utilities that rely on post-infection file scanning and confusing technical error codes, Cyber Companion provides proactive digital self-defense:
- **3D Interactive Perimeter**: Three.js-powered animated Cyber Shield Core and 360° holographic radar visualizing your real-time security posture.
- **Pre-Connection Wi-Fi Sentinel**: Evaluates 802.11 beacon ciphers, MAC/OUI profiles, and predicts cyber crime attack vectors (Evil Twin honeypots, packet sniffing, fake captive portals) *before* you connect.
- **Optical Camera QR Scanner**: Decodes barcodes via hardware camera frames with an automated sandbox URL and intent preview to stop Quishing.
- **Link & SSRF Guard**: Flags Punycode IDN homoglyphs, brand spoofing, and private RFC1918 loopback addresses.
- **On-Device Permission Auditor**: Analyzes apps for high-risk sensor combinations (SMS + Internet OTP interception) strictly on-device.
- **Deterministic 0–100 Security Score**: Pure mathematical score ($30/30/20/20$ weighting model) with monotonicity guarantees.
- **Grounded RAG AI Explainer**: Plain-language explanations citing structured knowledge bases (`[KB-001]` to `[KB-005]`), protected by Prompt Injection Guards with full offline fallback.

---

## 2. Quick Start for Evaluators & Reviewers

### Prerequisites
- Node.js (v20+ LTS)
- npm (v10+)

### Clone & Install
```bash
git clone https://github.com/Anurag3215/Cyber-Companion-v3.git
cd Cyber-Companion-v3
npm ci
```

### Run Automated Tests (25 Suites, 116 Tests)
```bash
npm test
```

### Launch the Application
In separate terminal tabs:

**Tab 1 — Start Threat Intelligence Gateway (Port 5000):**
```bash
npm run start:api
# Health Check: curl http://localhost:5000/v1/health
```

**Tab 2 — Launch Mobile App (Web Browser Preview):**
```bash
npm --workspace=@cyber-companion/mobile run web
```

**Optional — Run on Physical Mobile Device (Expo Go):**
```bash
# Android
npm --workspace=@cyber-companion/mobile run android

# iOS
npm --workspace=@cyber-companion/mobile run ios

# Free Zero-Token Cloudflare Tunnel for Remote Mobile Testing
npm --workspace=@cyber-companion/mobile run tunnel:free
```

---

## 3. Core Functional Modules

| Module | Technical Implementation | Security Capabilities |
| :--- | :--- | :--- |
| **3D Cyber Shield Core** | Three.js + React Native Web | Holographic perimeter radar, 3D tilt cards, real-time score visualization. |
| **Wi-Fi Sentinel** | 802.11 Beacon Frame Parser | Pre-connection cipher audit, rogue OUI hardware detection, MitM crime predictor. |
| **Optical QR Scanner** | `expo-camera` Barcode Scanner | Live camera preview, torch toggle, camera flip, sandboxed URL preview. |
| **URL Threat Inspector**| Heuristics + Threat Intel API | Punycode IDN homoglyphs, brand spoofing, SSRF RFC1918 private IP defense. |
| **Permission Auditor** | On-Device Manifest Auditor | Flags SMS + Internet OTP theft and background surveillance sensors. |
| **Deterministic Scorer**| Pure Mathematical Function | Monotonic 0–100 health metric with top 3 actionable remediation steps. |
| **RAG AI Explainer** | Grounded Knowledge Base | Structured citations (`[KB-001]`–`[KB-005]`), plain-language threat guides, offline fallback. |

---

## 4. Monorepo Architecture

```text
cyber-companion-v3/
├── apps/
│   ├── mobile/             # React Native (Android & iOS) + Web Client
│   │   ├── src/components/ # Three.js 3D Cores, Radars, Modals & Design System
│   │   ├── src/screens/    # Dashboard, Scan Hub, History, Awareness, Profile
│   │   ├── src/services/   # ApiClient, Wi-Fi Sentinel, QR Classifier, Notifications
│   │   └── eas.json        # Expo Application Services APK / AAB / IPA profiles
│   └── api/                # Hardened Express.js REST Threat Intelligence Gateway
│       ├── src/middleware/ # SSRF Guard, Prompt Injection Guard, Rate Limiter
│       └── src/services/   # Multi-Engine Consensus, Heuristics, RAG Explainer
├── packages/
│   ├── shared-types/       # Shared TypeScript contracts and Zod schemas
│   └── scoring-core/       # Deterministic scoring algorithm and calibration tests
├── docs/                   # Architecture, Threat Model, ADRs, and Specifications
└── scripts/                # Git workflow, CI/CD, and release scripts
```

---

## 5. Submission & Presentation Deliverables

- **Final Submission Report**: [`docs/FINAL_SUBMISSION_REPORT.md`](docs/FINAL_SUBMISSION_REPORT.md)
- **Live Presentation & Viva Guide**: [`docs/PROJECT_PRESENTATION_SCRIPT.md`](docs/PROJECT_PRESENTATION_SCRIPT.md)
- **Heuristics Benchmark Report (100% Accuracy)**: [`docs/BENCHMARK_REPORT.md`](docs/BENCHMARK_REPORT.md)
- **Architecture Specification & Threat Model**: [`ARCHITECTURE.md`](ARCHITECTURE.md) | [`docs/THREAT_MODEL.md`](docs/THREAT_MODEL.md)
- **App Store & Google Play Metadata**: [`docs/APP_STORE_METADATA.md`](docs/APP_STORE_METADATA.md)
- **User Operations Manual**: [`docs/USER_MANUAL.md`](docs/USER_MANUAL.md)

---

## 6. License & Ethics

Distributed under the MIT License. Built with strict Zero-PII principles.
