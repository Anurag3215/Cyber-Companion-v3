# Cyber Companion — User Stories & Acceptance Criteria

Structured user stories categorized across all 6 core functional modules.

---

### Module 1: Wi-Fi Risk Analyzer
- **US-1.1**: As a user connected to a cafe Wi-Fi network, I want to know if the network is open/unencrypted so that I can avoid transmitting sensitive personal credentials.
  - *Acceptance Criteria*:
    - App identifies Wi-Fi security type (Open, WEP, WPA2, WPA3).
    - If Open/WEP, displays High Risk alert banner with "Why is this dangerous?" context.
    - Recommends using a VPN or disconnecting immediately.
- **US-1.2**: As an iOS or Web user with restricted Wi-Fi telemetry access, I want a guided network safety checklist so that I can evaluate connection risk manually.
  - *Acceptance Criteria*:
    - Fallback card clearly explains OS security sandbox limitations without technical errors.
    - Offers 3-point interactive safety checklist (captive portal warning, HTTPS check, public sharing toggle).

---

### Module 2: URL Scanner
- **US-2.1**: As a user who received an SMS with a shortened link, I want to scan the URL before opening it so that I do not fall victim to credential harvesting or phishing.
  - *Acceptance Criteria*:
    - Accepts pasted URL or detected clipboard URL with user consent.
    - Evaluates URL via local heuristics (Punycode homoglyphs, numeric IP hosts, shorteners, high-risk TLDs).
    - Queries Threat Intel Gateway and returns clear verdict: Safe, Suspicious, or Malicious.
- **US-2.2**: As a user examining a flagged URL, I want plain-language reasons why it is dangerous so that I can learn what red flags to spot in the future.
  - *Acceptance Criteria*:
    - Shows bullet points (e.g. "Contains Cyrillic lookalike letters mimicking PayPal", "Host is an unregistered IP address").

---

### Module 3: QR Code Scanner
- **US-3.1**: As a user scanning a QR code at a public venue, I want the app to decode the payload and evaluate safety before redirecting me to a browser.
  - *Acceptance Criteria*:
    - Decodes QR payload via camera or image picker.
    - Classifies payload type: URL, Wi-Fi config, vCard, Text, Deep Link.
    - If URL, automatically passes to URL scanner sandbox before triggering any intent.
- **US-3.2**: As a user on a device without camera permissions or in an emulator, I want a manual text input fallback.
  - *Acceptance Criteria*:
    - "Paste QR Data / URL" input field available directly on the scan screen.

---

### Module 4: App Permission Analyzer
- **US-4.1**: As an Android smartphone user, I want an audit of installed applications requesting sensitive permissions so that I can revoke excessive access.
  - *Acceptance Criteria*:
    - Enumerates installed user apps and audits Camera, Microphone, SMS, Contacts, Location permissions.
    - Flags dangerous combinations (e.g. SMS + Internet access, Location + Contacts).
    - Links directly to Android System App Settings for one-tap permission revocation.
- **US-4.2**: As a privacy-conscious user, I want assurance that my application inventory is never uploaded to the cloud.
  - *Acceptance Criteria*:
    - Analysis executes 100% on-device in client memory; zero package metadata sent over the network.

---

### Module 5: Security Health Score
- **US-5.1**: As a non-technical user, I want a single holistic security score from 0 to 100 on my dashboard so that I can understand my security posture at a glance.
  - *Acceptance Criteria*:
    - Deterministic weighted formula: Network (30%), URL Safety (30%), Permissions (20%), Device Baseline (20%).
    - Color-coded visual gauge: Red (0–49, Critical), Orange (50–69, At Risk), Yellow (70–84, Moderate), Green (85–100, Secure).
- **US-5.2**: As a user with a low security score, I want actionable top 3 recommendations with expected point gains so that I can take corrective action.
  - *Acceptance Criteria*:
    - Returns prioritized fixes (e.g., "Disconnect from unencrypted Wi-Fi (+15 pts)", "Revoke SMS permission from Flashlight app (+10 pts)").

---

### Module 6: Cyber Awareness Hub
- **US-6.1**: As a daily smartphone user, I want concise, readable security tips so that I can develop safe digital habits over time.
  - *Acceptance Criteria*:
    - Daily tip is $\le 60$ words and written at a 6th-grade reading level.
    - Offline cache allows viewing tips without active internet connectivity.
- **US-6.2**: As a user, I want customizable notification preferences so that security reminders do not interrupt my sleep or focus hours.
  - *Acceptance Criteria*:
    - Quiet hours toggle (e.g., 22:00 – 08:00).
    - Per-category alert toggles (Wi-Fi, URL, Permission changes).
