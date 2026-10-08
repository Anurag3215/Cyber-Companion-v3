# Cyber Companion v3 — User Manual & Operations Guide

Welcome to **Cyber Companion v3**, your personal mobile security guardian. This manual explains how to use each feature, understand your security score, and take corrective actions when threats are intercepted.

---

## 1. Quick Start & Onboarding
1. **Initial Launch**:
   - The app introduces the 3 Core Pillars: **Threat Inspection**, **Wi-Fi Diagnostics**, and **Permission Auditing**.
   - Review and accept the Zero-PII Privacy Pledge.
2. **Permissions Setup**:
   - Camera access is requested only when opening the QR scanner for the first time.
   - You can deny camera access and manually paste URLs into the scan input if preferred.

---

## 2. Navigating the Security Dashboard
The Dashboard displays your real-time **Cyber Security Score (0–100)**:
- **90–100 (EXCELLENT)**: Device and network settings adhere to industry best practices.
- **75–89 (GOOD)**: Strong protection with minor optimization opportunities.
- **50–74 (MODERATE)**: Multiple security risks present (e.g. outdated Wi-Fi security or high app permissions).
- **0–49 (CRITICAL)**: Urgent threat active (e.g. connected to an untrusted open Wi-Fi network or malicious QR code scanned).

### Understanding the Score Breakdown
- **Network Security (30% weight)**: Reflects whether your current connection uses modern encryption (WPA3/WPA2) versus unencrypted open Wi-Fi.
- **App Permissions (30% weight)**: Measures risks from background location, camera, audio, or SMS access granted to third-party apps.
- **Threat Defense (20% weight)**: Tracks recent URL and QR code inspections.
- **Awareness (20% weight)**: Encourages engagement with daily cybersecurity tips and best-practice recommendations.

---

## 3. Threat Scanning (QR & Links)
1. Tap the **Scan Hub** tab.
2. Aim your camera at any QR code, or paste a link into the input field.
3. The app evaluates the URL against:
   - Internationalized domain name (IDN) and punycode lookalike spoofing.
   - Suspicious top-level domains frequently abused by phishing kits.
   - IP host literals and disguised authority credentials (`@`).
   - Multi-engine reputation databases (Google Safe Browsing, VirusTotal).
4. If a threat is found:
   - The app blocks immediate navigation.
   - A **"Why was this dangerous?"** contextual card is displayed explaining the attack mechanics.

---

## 4. Wi-Fi Security Diagnostics
1. Tap **Wi-Fi Audit** from the Dashboard or Scan Hub.
2. The app assesses the connected network:
   - **OPEN / UNENCRYPTED**: High risk of eavesdropping or man-in-the-middle attacks. Always enable a trusted VPN before entering credentials on public Wi-Fi.
   - **WEP / WPA (TKIP)**: Deprecated protocols vulnerable to key-cracking.
   - **WPA2-AES / WPA3**: Secure, recommended encryption standard.

---

## 5. Daily Tips & Ethical Streaks
1. Access the **Awareness** tab to read today's 60-word micro-learning tip.
2. Each tip provides a single actionable habit (e.g. Passkeys, Multi-Factor Authentication, spotting urgent phishing cues).
3. **Ethical Streaks**:
   - You can pause your daily streak at any time without resetting or receiving guilt notifications.
   - Complete milestones to unlock security achievements.
