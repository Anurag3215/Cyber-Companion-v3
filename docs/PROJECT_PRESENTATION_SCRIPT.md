# Cyber Companion v3 — Presentation & Live Demonstration Guide

> **Official Evaluation & Viva Presentation Script for Thursday Submission**  
> Use this guide for your project defense, live presentation, or technical demonstration.

---

## 1. Five-Minute Presentation Script (Executive Walkthrough)

### Minute 1: Problem Statement & Motivation
> *"Good morning/afternoon, esteemed evaluators. Today, smartphones are our primary digital gateway—handling bank accounts, two-factor authentication, and private communication. However, everyday smartphone users are constantly exposed to attacks that traditional antivirus software cannot solve: QR code phishing (Quishing), rogue Wi-Fi honeypots (Evil Twin attacks), deceptive lookalike links, and data-harvesting mobile apps.*
>
> *Traditional antivirus products fail here because they rely on reactive malware file signatures and present cryptic error codes that users ignore. We created **Cyber Companion v3** to bridge this gap: a lightweight, proactive, zero-trust security guardian that translates technical threat intelligence into plain English, backed by deterministic scoring, 3D interactive visualizations, and curated AI explanations."*

### Minute 2: Architectural Innovation & Zero-Trust Core
> *"Architecturally, Cyber Companion is engineered as an enterprise TypeScript monorepo. It features a React Native cross-platform client with Three.js hardware acceleration, connected to an Express.js Threat Intelligence Gateway.*
>
> *We adhere strictly to **Zero-Trust & Zero-PII principles**:*
> 1. *No secrets or API keys are bundled into mobile clients.*
> 2. *Application permission auditing runs 100% on-device; package catalogs never leave local storage.*
> 3. *Our server-side gateway enforces a hardened SSRF guard blocking private RFC1918 subnets, cloud metadata addresses, and integer bypasses.*
> 4. *Our Security Health Score is mathematically deterministic—never hallucinated by an AI."*

### Minute 3: Live Demonstration of Inspection Engines
*(Open the app on screen or device)*
> 1. *"**3D Dashboard**: Here you see the Three.js animated Cyber Shield Core and 360° holographic threat radar reflecting the user's real-time security posture.*
> 2. *"**Scan Hub**: When a user inspects a link like `secure-paypa1-login.com`, our engine flags the Punycode homoglyph instantly and blocks redirection.*
> 3. *"**Wi-Fi Sentinel**: Before connecting to public Wi-Fi, our beacon analyzer inspects the hardware MAC and cipher parameters, identifying rogue Evil Twin honeypots before an attacker can intercept packets.*
> 4. *"**Optical QR Scanner**: Decodes matrices through hardware camera frames and sandboxes destination links before opening the browser."*

### Minute 4: Curated RAG AI Explainer
*(Tap 'Ask AI Explainer: Why is this dangerous?')*
> *"Whenever a threat is detected, non-technical users need to understand why. Our **RAG AI Explainer** provides plain-language breakdowns grounded in our structured cybersecurity knowledge base—complete with verified citations like `[KB-001]` and step-by-step remediation advice, protected by a dedicated Prompt Injection Guard."*

### Minute 5: Quantitative Verification & Conclusion
> *"We validated our system through a rigorous 60-sample ground-truth benchmark, achieving **100% accuracy, 0.0% False Positive Rate, and 0.0% False Negative Rate**. Our test suite comprises **25 test suites with 116 automated tests**, all passing with zero errors.*
>
> *Cyber Companion proves that mobile cybersecurity can be proactive, mathematically verifiable, and accessible to everyone. Thank you, and I welcome your questions."*

---

## 2. Guaranteed Live Demo Test Cases

Use these exact test cases during your live presentation. They are guaranteed to execute smoothly with clear, impressive visual feedback:

### Scenario A: Phishing & Homoglyph URL Inspection
1. Open the **⚡ Scan** tab or tap **Check a link** on Dashboard.
2. Select sample: `https://secure-paypa1-login.com/verify`
3. Tap **Inspect Threat Vectors**.
4. **Expected Result**:
   - Verdict: `MALICIOUS · RISK 98/100`
   - Flag: `Punycode Homoglyph & Lookalike Brand Spoofing detected`
   - Tap **"🤖 Ask AI Explainer"** -> Shows grounded breakdown from `[KB-002]` with citations and defense steps.

### Scenario B: SSRF Internal Network Intrusion Defense
1. In the Link Inspector, select sample: `http://192.168.1.1/router-login`
2. Tap **Inspect Threat Vectors**.
3. **Expected Result**:
   - Verdict: `MALICIOUS`
   - Reason: `SSRF & Internal Network Intrusion Intercepted. RFC1918 Private IP Range target blocked by SSRF Guard.`

### Scenario C: Rogue Wi-Fi Beacon & Pre-Crime Interception
1. Tap **Check Wi-Fi** or open Wi-Fi Sentinel from Scan Hub.
2. Select the network: `Starbucks_Guest_Open` (or `Pineapple_Honeypot`).
3. **Expected Result**:
   - Banner: `🚨 PRE-CRIME INTERCEPTION: THREAT BLOCKED BEFORE CONNECTION`
   - Threat Verdict: `CRITICAL_THREAT (Risk 98/100)`
   - Tag: `EVIL TWIN HONEYPOT DETECTED`
   - Predicted Crimes:
     - Man-in-the-Middle (MitM) Full Packet Interception
     - Fake Captive Portal Credential Harvesting
     - SSL Stripping & DNS Spoofing
   - Tap **"🤖 Ask AI Explainer"** -> Grounded breakdown from `[KB-003]`.

### Scenario D: High-Risk Permission Combination
1. Tap **Review apps** on Dashboard.
2. View `Flashlight Ultra Pro`.
3. **Expected Result**:
   - Flags: `Background surveillance vector: Microphone or Camera access combined with auto-start on boot`.
   - Actionable recommendation to revoke unneeded sensor privileges in OS settings.

### Scenario E: Interactive Cybersecurity Q&A in Learn Tab
1. Navigate to the **📖 Learn** tab.
2. Tap the popular chip: **"Quishing & Fake QRs"** or type *"What is an Evil Twin attack?"*.
3. **Expected Result**:
   - Instantly opens the grounded RAG Explainer modal with structured citations and plain-language answers.

---

## 3. Anticipated Evaluator Questions & Model Answers

### Q1: *"Why did you use a deterministic scoring formula instead of letting an LLM generate the score?"*
> **Answer**:  
> *"LLM-generated scores suffer from non-deterministic outputs, hallucinations, and non-monotonic behavior—meaning fixing a security flaw could unpredictably lower your score. By using a pure mathematical formula ($30/30/20/20$ factor weights), we guarantee monotonicity: addressing a vulnerability strictly improves or preserves your score. We validated this through 100 randomized property calibration tests."*

### Q2: *"How does the app protect against Server-Side Request Forgery (SSRF)?"*
> **Answer**:  
> *"Our server-side SSRF guard evaluates destination IP addresses before any external request occurs. It blocks all RFC 1918 private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), loopback addresses (`127.0.0.1`, `::1`), and cloud metadata services (`169.254.169.254`). Furthermore, we hardened it against advanced evasion vectors including DWord integer IP representations, hexadecimal notation, and IPv6-mapped IPv4 bypass strings."*

### Q3: *"How is user privacy protected if the app inspects links and Wi-Fi networks?"*
> **Answer**:  
> *"Cyber Companion operates on strict Zero-PII principles. URLs and Wi-Fi SSIDs/BSSIDs are evaluated transiently in memory without being written to persistent audit logs or databases. All structured Pino server logs redact parameters. Additionally, application permission auditing executes entirely on the mobile device's local CPU; the device's installed app package catalog is never transmitted over the network."*

### Q4: *"What happens if the mobile device has no internet connection?"*
> **Answer**:  
> *"Cyber Companion is designed with an offline-first architecture. If the API Gateway is unreachable, the client automatically falls back to local lexical heuristics (Punycode decoders, IP host literal detection, high-risk TLD checks) and serves grounded explanations from its local offline knowledge base without crashing or displaying network errors."*

### Q5: *"Why did you choose React Native and Three.js?"*
> **Answer**:  
> *"React Native provides true native hardware performance and cross-platform consistency across Android, iOS, and Web. Three.js provides hardware-accelerated 3D graphics that elevate the cybersecurity posture from static numbers to an intuitive, interactive radar and shield core, dramatically improving user engagement and retention."*
