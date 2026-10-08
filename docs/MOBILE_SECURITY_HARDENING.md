# Mobile Security Hardening Guide (Cyber Companion v3)

This document outlines the security architecture and defensive controls implemented across the Cyber Companion mobile client (Android and iOS).

---

## 1. Zero-Trust Storage & Secret Segregation
- **No In-App Secrets**: API keys (VirusTotal, Google Safe Browsing, etc.) are strictly isolated on the backend API Gateway. The mobile client holds zero third-party credentials.
- **Encrypted MMKV**: On-device telemetry scores, cached tips, and local preferences use encrypted MMKV storage backed by Android KeyStore (AES-256-GCM) and iOS Keychain.
- **Zero Raw PII**: Scanned QR contents, Wi-Fi passwords, and visited URLs are never persisted to long-term client storage or transmitted in debug logs.

---

## 2. Certificate Pinning & Transport Layer Security
- **Strict HTTPS / TLS 1.3**: All communication with the Cyber Companion API Gateway enforces TLS 1.3.
- **SPKI Fingerprint Pinning**: Public Key SubjectPublicKeyInfo (SPKI) pinning is enforced for production endpoints (`api.cybercompanion.internal`).
- **Backup Pins**: Every pinned endpoint maintains primary and backup certificate pins to prevent service disruption during certificate rotation cycles.
- **Android Network Security Config**:
  ```xml
  <network-security-config>
      <domain-config cleartextTrafficPermitted="false">
          <domain includeSubdomains="true">api.cybercompanion.internal</domain>
          <pin-set expiration="2027-01-01">
              <pin digest="SHA-256">WoiWRyIOVNa9ihaKkdOdHZAZFYGEBU0b516M2qGEq9A=</pin>
              <pin digest="SHA-256">r/m5WBGo8+/5GunSpmxDHFFDK199WNxTmzhLS85060=</pin>
          </pin-set>
      </domain-config>
  </network-security-config>
  ```
- **iOS App Transport Security (ATS)**: Plaintext HTTP traffic is disabled globally via `NSAppTransportSecurity` in `Info.plist`.

---

## 3. Anti-Tamper & Environment Verification
- **Root & Jailbreak Detection**:
  - Verification of binary paths (`/system/bin/su`, `/system/xbin/su`, Cydia substrate, test-keys build signatures).
  - Emulation detection (QEMU hardware signatures, Genymotion markers).
- **Production Logging Suppression**:
  - `console.log`, `console.info`, and `console.debug` are neutralized in production release bundles via `suppressProductionLogs()`, preventing data leakage to ADB logcat.

---

## 4. Binary Hardening & Code Obfuscation
- **ProGuard / R8 Rules (Android)**:
  - Enabled minification, code shrinking, and identifier obfuscation in `build.gradle`.
  - Sensitive security and scoring models are shielded from reverse engineering.
- **Bitcode & Symbol Stripping (iOS)**:
  - Strip debug symbols and enable LLVM bitcode optimizations.
