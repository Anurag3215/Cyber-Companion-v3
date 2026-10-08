# Cyber Companion — Comprehensive STRIDE Threat Model

> **Full Threat Modeling Specification (Phase 2 Baseline)**

---

## 1. System Boundary Diagram

```text
[ UNTRUSTED ZONE: Public Internet / Public Wi-Fi ]
           │
           │ TLS 1.3
           ▼
┌─────────────────────────────────────────────────────────────┐
│ TRUST BOUNDARY 1: Mobile Client Sandbox (Android / iOS)    │
│  - Vision Camera Frame Buffer                               │
│  - WifiManager Telemetry Parser                             │
│  - PackageManager In-Memory Manifest Audit                  │
│  - MMKV AES-256-GCM Secure Storage                          │
└─────────────────────────────────────────────────────────────┘
           │
           │ HTTPS / Zod Validated REST Payloads
           ▼
┌─────────────────────────────────────────────────────────────┐
│ TRUST BOUNDARY 2: Cloud API Gateway (apps/api)              │
│  - Helmet HTTP Response Header Hardening                    │
│  - Strict SSRF / DNS-Rebinding Pre-Flight Guard             │
│  - Pino Redacted Structured Logger (Zero PII)               │
│  - MongoDB Atlas TTL Verdict Cache                          │
└─────────────────────────────────────────────────────────────┘
           │
           │ Outbound Secure REST (API Keys via Environment)
           ▼
┌─────────────────────────────────────────────────────────────┐
│ TRUST BOUNDARY 3: Third-Party Threat Intelligence Providers │
│  - Google Safe Browsing API v4                              │
│  - VirusTotal v3 API                                        │
│  - URLScan.io REST API                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Comprehensive STRIDE Matrix

| Threat Category | Component | Attack Scenario | Severity | Applied Countermeasures |
| :--- | :--- | :--- | :--- | :--- |
| **Spoofing** | Wi-Fi Telemetry | Rogue AP broadcasts known SSID ("Starbucks_Guest") with Open auth. | High | Detect missing encryption, flag disparity against known secure profile, recommend VPN. |
| **Tampering** | QR Scanner | Attacker overlays malicious QR sticker pointing to homoglyph phishing URL. | High | Pre-execution sandbox halts automatic redirection; URL heuristics flag Cyrillic/Greek homoglyphs. |
| **Repudiation** | Audit History | User denies scanning a phishing URL or connecting to an open network. | Low | Local encrypted scan log in MMKV with cryptographic hash verification. |
| **Information Disclosure** | API Gateway | Attacker probes `/v1/threat/inspect` with internal cloud metadata URLs (`http://169.254.169.254/`). | Critical | SSRF Guard middleware resolves DNS, checks against RFC 1918 / link-local / loopback blacklists, and terminates request immediately with 400. |
| **Denial of Service** | Upstream Intel APIs | Adversary floods scanning gateway to exhaust API quotas or trigger rate limits. | Medium | In-memory token bucket rate limiter (100 req / 15 min); 24-hour Mongo TTL verdict cache; fallback to local heuristic engine. |
| **Elevation of Privilege** | Installed Apps | Rogue mobile app requests SMS permissions to steal two-factor authentication tokens. | High | Permission Analyzer cross-references `READ_SMS` + `INTERNET` and flags as Critical Risk with direct uninstall/revoke guidance. |

---

## 3. Residual Risk & Verification Gates

- Regular dependency vulnerability scanning via CodeQL and Semgrep.
- Continuous automated tests validating that SSRF guard correctly blocks `127.0.0.1`, `10.0.0.1`, `169.254.169.254`, and DNS rebinding simulations.
