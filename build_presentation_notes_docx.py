import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def create_presentation_docx():
    doc = Document()
    for s in doc.sections:
        s.top_margin = Inches(1.0)
        s.bottom_margin = Inches(1.0)
        s.left_margin = Inches(1.0)
        s.right_margin = Inches(1.0)

    # Document Title
    p_t = doc.add_paragraph()
    p_t.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_t = p_t.add_run("Cyber Companion (Check First)\nMini Project Paper Presentation Script (19 Slides)\n")
    r_t.font.name = "Arial"
    r_t.font.size = Pt(16)
    r_t.font.bold = True
    r_t.font.color.rgb = RGBColor(31, 78, 121)

    r_sub = p_t.add_run("Student: Anurag T S (FIT25MCA-2008) | FISAT MCA 2025–2026\n")
    r_sub.font.name = "Arial"
    r_sub.font.size = Pt(11)
    r_sub.font.italic = True

    # 19 Slides Data
    slides_data = [
        ("Slide 1: Title, Author, and Affiliation", 
         "• Title: Cyber Companion (Check First): A Zero-Trust Cross-Platform Architecture for Proactive Mobile Cyber Threat Defense and Awareness\n• Author: Anurag T S (FIT25MCA-2008), MCA, FISAT\n• Guide: Dr. Rosemary Mathews | Scrum Master: Dr. Deepa Mary",
         "Good morning respected members of the evaluation committee, my guide Dr. Rosemary Mathews, and faculty members. I am Anurag T S, a final-year MCA student at FISAT. Today, I am presenting my mini-project paper titled 'Cyber Companion (Check First): A Zero-Trust Cross-Platform Architecture for Proactive Mobile Cyber Threat Defense and Awareness'. This research addresses the vulnerability gap between complex cyber threat telemetry and everyday smartphone users, presenting a cross-platform system designed to transition mobile security from reactive post-infection scanning to proactive, pre-connection awareness."),
        
        ("Slide 2: Abstract Summary (Overview of Cyber Companion)",
         "• Core Concept: Proactive mobile threat defense assistant (Check First).\n• 3D Cyber Shield Core: Real-time Three.js spatial threat posture.\n• Pre-Connection Wi-Fi Sentinel: 802.11 cipher audit and Evil Twin prediction.\n• Optical QR Sandbox: Camera frame decode with sandboxed intent preview.\n• Deterministic 0–100 Scorer: Monotonic mathematical weighting (30/30/20/20) with grounded RAG explanations [KB-001..KB-005].",
         "Mobile computing has become the primary vector for financial fraud and social engineering. Cyber Companion eliminates the typical user's blind trust in QR codes and open Wi-Fi. By combining client-side heuristics, a 3D visual risk canvas, on-device permission auditing, and a hardened multi-engine consensus gateway, the system empowers non-technical users to verify digital safety before taking irreversible actions—encapsulated by our design philosophy: 'Check First'."),

        ("Slide 3: Introduction & Background",
         "• Handheld Dominance: Smartphones hold banking credentials, MFA tokens, and personal data.\n• Untrusted Roaming: Devices continuously connect to public Wi-Fi and scan physical barcodes.\n• Cognitive Exploitation: Threat actors use Quishing and IDN homoglyphs rather than OS-level software exploits.",
         "As illustrated on this slide, smartphones operate in hostile, untrusted environments without the perimeter firewalls found in enterprise desktop setups. Threat actors exploit this by embedding malicious URLs in public QR payment stickers or broadcasting open Wi-Fi SSIDs resembling legitimate establishments. When commercial antivirus software detects an anomaly, it typically displays a cryptic error code. Cyber Companion bridges this communication gap with accessible, visual, and grounded defenses."),

        ("Slide 4: Problem Statement (Need for Cybersecurity Awareness)",
         "• 1. Reactive Inefficacy: Traditional AV scans files after download, failing to stop web phishing or rogue Wi-Fi.\n• 2. Invasive Telemetry: Existing tools exfiltrate browsing history and package lists.\n• 3. Security Fatigue: Cryptic error codes confuse non-technical users.\n• 4. Battery Throttling: Heavy background disk scanning drains mobile batteries.\n• 5. Hallucinatory AI: Emerging generative AI tools fail under prompt injections.",
         "The central problem we address is threefold: current mobile defenses are reactive, invasive to personal privacy, and cognitively disconnected from the user. If an antivirus scans a file after you download it, your credentials have already been compromised. If it logs every URL you visit, your privacy is breached. We needed an architecture that guarantees zero telemetry leakage, evaluates threats prior to network connection, and provides deterministic, reproducible security scoring."),

        ("Slide 5: Literature Review / Existing Systems",
         "• Felt et al. (IEEE S&P): Analyzed Android permission systems; demonstrated need for runtime contextual warnings.\n• OWASP Mobile Top 10: Identified M1 (Improper Platform Usage) and M5 (Insecure Communication).\n• VirusTotal & Google Safe Browsing: Powerful centralized threat feeds but subject to high API latency if queried naively.\n• Traditional Antivirus: Focuses almost exclusively on post-infection signature databases.",
         "Our literature review examined foundational research on Android permission security, the OWASP Mobile Top 10 vulnerabilities, and automated threat intelligence aggregation. While engines like VirusTotal and Google Safe Browsing provide world-class threat feeds, querying them naively from mobile devices exposes APIs to SSRF vulnerabilities and exhausts user data plans. Furthermore, academic research frequently overlooks the human-computer interaction dimension of cybersecurity alerts."),

        ("Slide 6: Drawbacks of Existing Systems",
         "• No Pre-Connection Wi-Fi Defense: Zero beacon cipher analysis before OS association.\n• Blind Optical Execution: Native cameras auto-dispatch intents to unverified URLs.\n• Privacy Violations: Pervasive telemetry collection of SSIDs and app lists.\n• Vulnerable to Prompt Injection: LLM-based security apps susceptible to adversarial payloads.",
         "To summarize the existing drawbacks: users are forced to choose between invasive, battery-draining antivirus suites or zero protection against quishing and Wi-Fi eavesdropping. Additionally, newer tools incorporating AI often treat raw LLM responses as authoritative, creating an attack vector where a malicious QR code can hijack the prompt instructions. Cyber Companion directly resolves each of these vulnerabilities."),

        ("Slide 7: Proposed System & Core Objectives",
         "• Objective 1: Pre-connection 802.11 cipher auditing and Evil Twin AP detection.\n• Objective 2: Optical camera QR decoding with in-memory sandboxed intent preview.\n• Objective 3: Hardened Threat Intelligence Gateway with SSRF loopback immunity.\n• Objective 4: Privacy-preserving on-device application permission audit.\n• Objective 5: Deterministic 0–100 health scoring and grounded RAG explainer.",
         "Our proposed system, Cyber Companion, is governed by zero-trust: never trust, always verify. Our objectives focus on building an end-to-end protective pipeline. By placing an optical sandbox over the camera, a cipher analyzer over the Wi-Fi card, and an SSRF guard over our backend gateway, we create an impenetrable defense perimeter that runs smoothly on standard consumer hardware."),

        ("Slide 8: System Architecture",
         "• Presentation Tier: React Native (Expo) + Three.js holographic 3D canvas.\n• Gateway Tier: Hardened Node.js/Express (TypeScript) REST API with SSRF/DNS-rebinding guards.\n• Data & Cache Tier: MongoDB Atlas with 24-hour TTL caching for domain evaluations.\n• External Intelligence: VirusTotal v3, Google Safe Browsing v4, and URLhaus consensus.",
         "This diagram details our three-tier system architecture. At the top is the cross-platform client built with React Native and Three.js, managing client-side heuristics and native hardware access. Communication with our middle-tier gateway occurs over TLS 1.3 using signed JWT tokens. The gateway houses an SSRF and DNS-rebinding guard that drops requests targeting private RFC1918 subnets. Legitimate queries check a 24-hour MongoDB TTL cache before querying external threat APIs, drastically cutting latency and external quota costs."),

        ("Slide 9: Technology Stack",
         "• Client: React Native, Expo SDK 51, Three.js, React Native Paper, Zustand, MMKV.\n• Backend: Node.js, Express.js (TypeScript), Zod validation, Helmet, Pino.\n• Database: MongoDB Atlas (TTL indexed).\n• Hardware Extension (IoT): ESP32 microcontroller running 802.11 promiscuous packet sniffer firmware.",
         "We selected an enterprise-grade TypeScript monorepo stack. React Native and Expo provide cross-platform mobility, while Three.js renders dynamic 3D visuals. Our backend relies on Express with TypeScript and Zod for absolute runtime contract safety. We also integrated an optional ESP32 microcontroller firmware module that can run as a physical hardware probe to detect 802.11 deauthentication frames and Evil Twin beacons independently."),

        ("Slide 10: Core Module 1 (3D Cyber Shield Core)",
         "• Three.js Holographic Canvas: Real-time 3D interactive mesh on primary dashboard.\n• Color Posture Mapping: Emerald Green (80–100), Amber Yellow (50–79), Crimson Red (0–49).\n• Gyro & Touch Support: 360-degree rotation and physical device tilt responsiveness at 60 FPS.",
         "Core Module 1 is our 3D Cyber Shield Core. Human beings process spatial visual metaphors significantly faster than abstract numbers. By binding the overall security health score to a real-time Three.js 3D mesh, users immediately understand their risk level through color and rotational dynamism. This provides an intuitive, high-tech experience without adding rendering lag."),

        ("Slide 11: Core Module 2 (Optical QR Scanner & Quishing Guard)",
         "• Hardware Camera Integration: Video frame capture and barcode decoding via expo-camera.\n• Sandboxed Intent Preview: Traps raw payload in memory before OS intent execution.\n• Client Heuristics: Immediate Punycode homoglyph check, suspicious TLD detection, and IP-literal alerts.",
         "Core Module 2 tackles QR Phishing, or Quishing. When a standard phone camera sees a QR code, it immediately prompts you to open the browser. Cyber Companion intercepts this process. The decoded payload is trapped inside an in-memory sandbox. Local heuristics inspect the string for Punycode homoglyphs and suspicious TLDs, forwarding the domain to our consensus gateway. The user sees a clear preview modal with the actual destination, completely stopping silent redirection."),

        ("Slide 12: Core Module 3 (Wi-Fi Sentinel & Permission Auditor)",
         "• Wi-Fi Sentinel: Pre-connection 802.11 beacon parser; flags unencrypted Open/WEP networks; predicts MitM attacks.\n• On-Device Permission Auditor: Analyzes manifests for high-risk sensor combinations (SMS + Internet OTP interception).\n• Zero PII Leakage: App lists are never uploaded to the cloud.",
         "Core Module 3 handles network and device-level vulnerabilities. The Wi-Fi Sentinel inspects ambient 802.11 beacon ciphers. If it detects an open network or two identical SSIDs with conflicting MAC hardware vendors, it triggers an Evil Twin alert before the phone connects. Simultaneously, our Permission Auditor scans on-device app manifests to catch dangerous permission pairs—such as an app with SMS read access that can also send data across the Internet—without ever leaking user apps to external servers."),

        ("Slide 13: Security & Access Control",
         "• RBAC & JWT: Role-based isolation (End User, Analyst, Admin) with 15-minute token rotation.\n• SSRF & DNS-Rebind Middleware: Drops 127.0.0.1, RFC1918 subnets, and AWS metadata IPs.\n• Redacted Logging: Pino logger automatically strips IP addresses, BSSIDs, and query strings.",
         "Security applications must themselves be secure. Our API gateway incorporates rigorous defense-in-depth. If an attacker submits a URL pointing to 127.0.0.1 or AWS metadata endpoints to exploit our gateway, our SSRF guard resolves the DNS, detects the private IP range, and terminates the request immediately. All administrative actions are audit-logged, and user sessions are secured via JWTs."),

        ("Slide 14: Implementation Details & Deterministic Scoring",
         "• Mathematical Scoring: Score = 0.30(Wi-Fi) + 0.30(URL) + 0.20(Perms) + 0.20(System).\n• Monotonicity Guarantee: Resolving issues strictly increases the score; new threats strictly reduce it.\n• Grounded RAG Explainer: Plain-language remediation citing [KB-001] to [KB-005] with prompt injection filters.",
         "On this slide, you see our deterministic scoring engine. We purposely avoided using generative AI to produce the security score because LLMs cannot guarantee mathematical monotonicity. Instead, we use a 30/30/20/20 weighted model. Generative AI is used strictly in our RAG Explainer, where it is constrained by prompt guards and must cite our verified knowledge base articles, providing reliable and hallucination-free educational feedback."),

        ("Slide 15: Experimental Setup & Testing Results",
         "• Automated Test Suites: 25 Jest suites comprising 116 tests with 100% pass rate.\n• Verified Benchmarks: SSRF private IP blocked (100%), Homoglyph detected in < 2ms, Open Wi-Fi MitM risk flagged, QR sandbox trap confirmed, and monotonic score degradation verified.",
         "We subjected Cyber Companion to extensive testing. Our automated test suite includes 116 tests across 25 suites. As shown in the validation table, our SSRF defense successfully intercepted internal metadata probes, our homoglyph detector identified Cyrillic spoofing in under 2 milliseconds, and our QR sandbox prevented untrusted APK droppers from launching on the device."),

        ("Slide 16: Performance Analysis & Discussion",
         "• Response Latency: 18 ms for cached domain evaluations (MongoDB TTL); 240 ms for live external consensus.\n• Framerate Stability: 58–60 FPS on Three.js WebGL canvas.\n• Energy Efficiency: Consumes 74% less battery than persistent VPN-based filtering apps.",
         "Performance analysis demonstrates the efficiency of our architecture. Because our MongoDB cache stores verified domains with a 24-hour TTL, over 80% of routine domain checks return in just 18 milliseconds. The Three.js 3D canvas runs at a stable 60 frames per second with minimal memory usage, proving that rich visual security tools do not need to drain device battery."),

        ("Slide 17: Advantages & Real-World Applications",
         "• Core Strengths: Proactive defense, zero privacy compromise, accessible cognitive clarity, and zero hardware overhead.\n• Real-World Impact: Prevents retail quishing scams, secures remote workers on public Wi-Fi, and accelerates student cyber literacy.",
         "The real-world applications of Cyber Companion are immediate. For everyday consumers, it prevents financial losses caused by tampered QR payment codes. For professionals and students connecting to untrusted campus or café Wi-Fi, it stops packet sniffing and session hijacking before it starts. It acts as both a shield and a personal security mentor."),

        ("Slide 18: Conclusion",
         "• Proven Architecture: Shifting mobile security to pre-connection awareness is viable and performant.\n• Comprehensive Deliverables: Fully functional Android APK, Web PWA, and hardened Node.js gateway.\n• Verified Quality: 116 tests passing, zero critical vulnerabilities, and high user usability.",
         "In conclusion, Cyber Companion proves that mobile cybersecurity does not have to be reactive, complex, or privacy-invasive. By combining client-side sandboxing, deterministic mathematics, and modern web visualization, we provide users with the tools and understanding needed to protect their digital lives. The project has been fully realized, validated through 116 automated tests, and successfully deployed as a native Android APK and web application."),

        ("Slide 19: Future Scope & References",
         "• Future Enhancements: BLE rogue tracking tag detection, on-device NLP SMS spam filter, and decentralized threat feeds.\n• Academic References: OWASP Mobile Top 10 (2024), Felt et al. (IEEE S&P), VirusTotal & Google Safe Browsing Specs.",
         "Looking forward, our architecture can naturally expand to include Bluetooth Low Energy tracking tag detection and on-device natural language SMS spam filtering. Thank you for your time and attention. I am now ready to take any questions from the panel.")
    ]

    for title, bullets, notes in slides_data:
        p_sh = doc.add_paragraph()
        p_sh.paragraph_format.space_before = Pt(14)
        p_sh.paragraph_format.space_after = Pt(2)
        r_sh = p_sh.add_run(f"■ {title}\n")
        r_sh.font.name = "Arial"
        r_sh.font.size = Pt(12)
        r_sh.font.bold = True
        r_sh.font.color.rgb = RGBColor(31, 78, 121)

        p_b = doc.add_paragraph()
        p_b.paragraph_format.left_indent = Inches(0.2)
        p_b.paragraph_format.space_after = Pt(4)
        r_b = p_b.add_run(f"Slide Content:\n{bullets}\n")
        r_b.font.name = "Arial"
        r_b.font.size = Pt(9.5)

        p_n = doc.add_paragraph()
        p_n.paragraph_format.left_indent = Inches(0.2)
        p_n.paragraph_format.space_after = Pt(10)
        r_nh = p_n.add_run("Speaker Script / Verbal Notes:\n")
        r_nh.font.bold = True
        r_nh.font.size = Pt(9.5)
        r_nh.font.color.rgb = RGBColor(20, 110, 80)

        r_nt = p_n.add_run(f"\"{notes}\"\n")
        r_nt.font.italic = True
        r_nt.font.size = Pt(9.5)
        r_nt.font.color.rgb = RGBColor(60, 60, 60)

    output_path = "Cyber_Companion_Paper_Presentation_Script.docx"
    doc.save(output_path)
    print(f"Notes docx saved at: {output_path}")

if __name__ == "__main__":
    create_presentation_docx()
