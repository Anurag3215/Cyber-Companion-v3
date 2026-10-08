# Cyber Companion Privacy Policy

**Effective Date:** October 9, 2026  
**Version:** 1.0.0 (Production Release)

Cyber Companion v3 ("we", "our", or "the app") is engineered from the ground up on **Zero-Trust and Zero-PII principles**. This privacy policy explains how data is handled when you use the Cyber Companion mobile application and API Gateway.

---

## 1. Core Principles
- **No Personal Identifiable Information (PII)**: We do not collect, request, or store your name, email, phone number, device IMEI, MAC address, or advertising identifiers.
- **On-Device Scopes**: Application permission auditing is performed entirely on your device. Your list of installed applications never leaves your device.
- **No Password or Payload Storage**: Wi-Fi network passwords and scanned QR code contents containing personal data are never uploaded to our servers or stored permanently.
- **Pure Deterministic Scoring**: Your security score is calculated locally and deterministically. No third-party profiling or generative AI hallucinations are involved.

---

## 2. Information Handled by the App
### A. Scanned QR Codes and URLs
- When you scan a QR code or submit a link for safety verification, the URL is transmitted via encrypted TLS 1.3 to our API Gateway to check threat reputation against heuristics and security databases (e.g. Google Safe Browsing, VirusTotal).
- Target URLs are checked in memory and results are temporarily cached for 24 hours under a cryptographic hash key. We do not link scanned URLs to any user identity or device token.

### B. Wi-Fi Security Diagnostics
- Wi-Fi analysis checks the security standard (WPA3, WPA2, WEP, Open) and whether captive portals exist.
- Wi-Fi SSIDs/BSSIDs are evaluated locally. They are never transmitted to third parties or logged in cleartext.

### C. App Permissions
- Evaluates risk levels of installed apps (e.g., Camera, Microphone, SMS, Location access).
- Processing is performed on-device. No data is sent to external servers.

### D. Awareness & Gamification
- Reading streaks, unlocked achievements, and daily cyber tips read are stored locally on your device via encrypted storage (MMKV / Keychain).
- Streak tracking includes an ethical pause toggle without penalties or guilt mechanisms.

---

## 3. Privacy-Minimal Analytics
- If telemetry is enabled, the app only records coarse aggregate counts (e.g., number of tips read, number of threats safely deflected).
- No unique device IDs or cross-app tracking cookies are used.

---

## 4. Third-Party Intelligence Providers
- To protect you against newly emerging phishing domains, the backend API Gateway may query threat reputation feeds using truncated domain hashes or API adapters.
- These providers receive only the domain being evaluated, never user identity or client metadata.

---

## 5. Contact & Open Source Verification
The Cyber Companion codebase is transparent and audited for open-source verification:  
Repository: [https://github.com/Anurag3215/Cyber-Companion-v3](https://github.com/Anurag3215/Cyber-Companion-v3)
