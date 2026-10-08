# Privacy Policy & Data Architecture

Cyber Companion is built upon privacy-by-design principles. We empower users to make secure digital decisions without harvesting their personal data.

---

## 1. Zero-Telemetry PII Principles

- **URLs**: When evaluating URLs against cloud threat intelligence, query strings and credentials are sanitized locally before submission.
- **Wi-Fi Metadata**: SSIDs and BSSIDs are analyzed purely on-device to determine encryption posture (WPA2/WPA3/Open) and are never sent to external third parties.
- **App Permissions**: Installed application inventories and permission audits run 100% locally in on-device volatile memory. No package names, install timestamps, or permission manifests leave the device.
- **QR Codes**: Scanned QR payloads are held in client-side memory during sandbox verification and are never persisted to external cloud databases.

---

## 2. On-Device Storage

All cached verdicts, security tip bookmarks, and security scores are stored in encrypted on-device storage (MMKV / Keystore / Keychain). Users can wipe all local application data at any time via Settings > Privacy > Clear Data.
