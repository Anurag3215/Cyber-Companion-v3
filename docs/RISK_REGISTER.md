# Cyber Companion — Security & Technical Risk Register

This document tracks system risks, vulnerability vectors, severity levels, and concrete mitigation controls.

---

| Risk ID | Threat Vector / Risk | Likelihood | Impact | Severity | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RSK-01** | **Server-Side Request Forgery (SSRF)** via URL Scanning engine fetching destination URLs | Medium | High | **High** | Implement strict SSRF guard: resolve DNS before fetching, reject private RFC1918 IPs (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), loopback (`127.0.0.1`), link-local (`169.254.169.254`), and enforce maximum 3 redirects. |
| **RSK-02** | **Threat Intel API Quota Exhaustion** during traffic spikes | High | Medium | **Medium** | Multi-tier architecture: Local deterministic heuristics run first. Gateway implements in-memory / MongoDB TTL caching (24h cache) and graceful degraded heuristics scoring if upstream APIs 429. |
| **RSK-03** | **User PII Leakage** in backend telemetry or crash reporting | Low | Critical | **High** | Zero PII policy: raw URLs with query parameters stripped before logging, Wi-Fi SSIDs hashed or discarded after evaluation, installed app package lists strictly kept in on-device volatile memory. |
| **RSK-04** | **QR Code Execution (Qishing)** leading to malicious app downloads or malicious intents | High | High | **High** | Mandatory pre-execution sandbox: App never auto-navigates. Extracted payload is classified and subjected to threat evaluation, presenting confirmation dialog before any external intent is launched. |
| **RSK-05** | **Man-in-the-Middle (MitM) Attacks** on untrusted Wi-Fi | High | High | **High** | Real-time SSID and encryption verification; TLS certificate pinning on Mobile-to-Gateway API endpoints; warning banners for unencrypted / captive portal networks. |
| **RSK-06** | **False Positives** on newly registered legitimate domains | Medium | Low | **Low** | Clear risk confidence score (e.g. 85% confidence); multi-source consensus merging between VirusTotal, Safe Browsing, and local heuristics; provide user feedback button to report inaccuracies. |
| **RSK-07** | **Excessive App Permissions in Client** violating Play Store policies | Low | High | **Medium** | Minimize client manifest permissions. Avoid `QUERY_ALL_PACKAGES` unless strictly isolated under custom build flavors with clear user disclosure. |
