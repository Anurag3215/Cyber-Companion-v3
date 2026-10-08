# Cyber Companion — Initial Threat Model (v0)

This threat model outlines initial trust boundaries, assets, and attacker vectors across the mobile client and backend threat intelligence gateway.

---

## 1. System Assets & Trust Boundaries

```text
[ Non-Technical User Device (Untrusted Host Environment) ]
   ├── Apps/Mobile Client (Local Trust Zone)
   │     ├── Telemetry Collector (Wi-Fi, QR, Manifest)
   │     └── Local Heuristics & Storage
   │
[ NETWORK (Public Wi-Fi / Cellular Internet) ]
   │
   ▼ TLS 1.3
[ Backend Threat Intel Gateway (Controlled Cloud Zone) ]
   ├── Express REST API + Helmet + SSRF Guard
   ├── Threat Intel Adapters (VirusTotal, Safe Browsing)
   └── Mongo TTL Verdict Cache
```

---

## 2. STRIDE Vector Analysis (Initial v0)

| Category | Vector | Risk Assessment | Mitigation |
| :--- | :--- | :--- | :--- |
| **Spoofing** | Attacker creates rogue Wi-Fi hotspot with cloned SSID ("Evil Twin") | High | Highlight lack of 802.11w Protected Management Frames, warn if encryption differs from known profile, suggest VPN. |
| **Tampering** | Attacker modifies QR code sticker in public restaurant to point to phishing domain | High | Sandbox decoded destination URL, evaluate heuristics (punycode, shorteners), require user confirmation before navigation. |
| **Repudiation** | User denies visiting malicious link | Low | Maintain local on-device scan history timestamped in encrypted MMKV storage. |
| **Information Disclosure** | Leakage of user browsing habits via threat intelligence API lookups | High | Strip sensitive URL query params (`token`, `auth`, `id`) before upstream API query; hash URL paths. |
| **Denial of Service** | Upstream threat intel provider rate limit exhaustion | Medium | Local heuristic engine acts as primary filter; 24-hour Mongo/Memory TTL cache for verified safe domains. |
| **Elevation of Privilege** | Malicious mobile application abuses excessive permissions to extract SMS OTPs | High | Flag app permission combos: SMS + Background Network in Permission Analyzer; direct user to Android Settings to revoke. |
