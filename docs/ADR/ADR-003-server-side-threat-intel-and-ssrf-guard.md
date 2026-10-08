# ADR-003: Server-Side Threat Intel & SSRF Guardrails

## Context
External threat intelligence providers (VirusTotal, Google Safe Browsing, URLScan.io) require paid or quota-limited API keys. Embedding keys in client applications exposes them to reverse engineering and key theft. Additionally, performing server-side domain lookups or page fetching risks Server-Side Request Forgery (SSRF).

## Decision
1. Isolate all external threat intelligence integrations within `apps/api`.
2. Implement strict SSRF guard middleware before any upstream network request:
   - Perform DNS resolution prior to fetching.
   - Prohibit loopback (`127.0.0.0/8`, `::1`), private RFC1918 subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), and cloud link-local metadata endpoints (`169.254.169.254`).
   - Limit HTTP redirects to a maximum of 3.
3. Cache verified verdicts for 24 hours to conserve API quotas.

## Consequences
- Eliminates credential leakage from mobile APK / IPA bundles.
- Protects internal infrastructure against SSRF and intranet pivoting.
- Reduces upstream API latency and costs via caching.
