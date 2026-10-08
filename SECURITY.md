# Security Policy

## 1. Supported Versions

| Version | Supported |
| :--- | :--- |
| `v1.0.x` | :white_check_mark: |
| `v0.x.x` | :white_check_mark: (Active development) |

---

## 2. Reporting a Vulnerability

If you discover a security vulnerability within Cyber Companion, please do NOT file a public issue. Instead, report it privately to:
- **Email**: `security@cybercompanion.local` or via private GitHub Security Advisory.
- **Response SLA**: Initial triage within 24 hours, patch candidate within 72 hours.

---

## 3. Zero-Trust Security Guarantees

1. **Zero Client Secrets**:
   - Upstream API keys (VirusTotal, Google Safe Browsing, URLScan.io) are strictly housed on the backend Threat Intel Gateway (`apps/api`).
   - Mobile and Web bundles never contain API keys or privileged service tokens.
2. **SSRF Guardrails**:
   - Server-side domain and URL resolution blocks loopback (`127.0.0.0/8`, `::1`), private RFC1918 subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), and AWS/GCP/Azure link-local metadata endpoints (`169.254.169.254`).
3. **Deterministic Scoring**:
   - Security Scores (0–100) are computed via pure, deterministic functions without AI hallucination.
