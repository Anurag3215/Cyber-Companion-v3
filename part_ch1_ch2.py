import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT
from docx.enum.table import WD_TABLE_ALIGNMENT
from report_helpers import (
    add_p, add_bullet, add_chapter_title, add_h1, add_h2, add_table_header,
    set_cell_margins, set_cell_background, set_table_borders,
    FONT_PRIMARY, COLOR_TEXT
)

def build_chapter_1(doc):
    # PAGE 8 (Report Page 1): Chapter 1 Introduction
    add_chapter_title(doc, "1", "Introduction")
    add_h1(doc, "1.1 Background")

    add_p(
        doc,
        "Mobile smartphones have evolved into the primary computing and transactional gateway for modern "
        "society, mediating banking, identity verification, cloud services, and interpersonal communications. "
        "However, this widespread ubiquity has made mobile operating systems the primary target for advanced "
        "social engineering, credential harvesting, network interception, and permission abuse. In typical "
        "mobile usage environments, users encounter a diverse array of deceptive attack vectors: malicious Quick "
        "Response (QR) codes posted on physical infrastructure (quishing), deceptive Internationalized Domain "
        "Name (IDN) homoglyphs designed to visually mimic legitimate brands, rogue Wi-Fi access points configured "
        "as Evil Twin honeypots, and intrusive applications that surreptitiously request dangerous sensor "
        "combinations. In many settings, mobile users operate without any proactive security defense, relying "
        "merely on native browser warnings or operating system prompts that appear only after a compromise is initiated.",
        space_after=8, line_spacing=1.15
    )
    add_p(
        doc,
        "Cyber Companion is an intelligent, zero-trust cybersecurity awareness and threat defense system "
        "built for everyday smartphone users. It brings proactive threat detection, interactive visual education, "
        "and explainable security onto a unified cross-platform mobile and web architecture. Its distinguishing "
        "feature is a Three.js-powered 3D Cyber Shield Core that renders an intuitive holographic visualization of "
        "device defense posture, combined with a Pre-Connection Wi-Fi Sentinel, an Optical QR Quishing Sandbox, "
        "an on-device permission auditor, and a grounded Retrieval-Augmented Generation (RAG) AI assistant that "
        "delivers plain-language explanations without leaking sensitive user telemetry.",
        space_after=10, line_spacing=1.15
    )

    add_h1(doc, "1.2 Problem Statement")
    add_p(
        doc,
        "The current landscape of mobile security software and user threat awareness exhibits several critical "
        "systemic deficiencies:",
        space_after=6, line_spacing=1.15
    )
    add_bullet(
        doc,
        "Users lack pre-connection visibility into 802.11 Wi-Fi beacon ciphers, exposing devices to open-air packet "
        "sniffing, Evil Twin honeypots, and credential interception before any warning is issued.",
        space_after=4
    )
    add_bullet(
        doc,
        "Optical barcodes and QR codes bypass traditional lexical browser URL inspection, enabling malicious actors "
        "to trigger deceptive operating system intents and automated deep links prior to security analysis.",
        space_after=4
    )
    add_bullet(
        doc,
        "Visual deception via Cyrillic and Greek IDN homoglyphs easily defeats casual visual inspection, misleading "
        "users into surrendering banking credentials and multi-factor authentication tokens.",
        space_after=4
    )
    add_bullet(
        doc,
        "Third-party applications exploit dangerous permission combinations (such as SMS reading paired with full "
        "Internet access for OTP exfiltration) without transparent user notification.",
        space_after=4
    )
    add_bullet(
        doc,
        "Existing mobile antivirus tools rely on invasive cloud telemetry, exfiltrating full user package lists "
        "and browsing histories, while presenting diagnostic results in indecipherable technical jargon.",
        space_after=4
    )

    doc.add_page_break()

    # PAGE 9 (Report Page 2): Objectives & Scope
    add_bullet(
        doc,
        "Security status is commonly represented through abstract percentage counters or pass/fail flags that "
        "lack mathematical monotonicity and actionable, step-by-step remediation advice.",
        space_after=6
    )
    add_p(
        doc,
        "A single, privacy-preserving, and mathematically deterministic cybersecurity assistant that operates "
        "proactively from an ordinary smartphone is therefore essential.",
        space_after=10, line_spacing=1.15
    )

    add_h1(doc, "1.3 Objectives")
    add_bullet(
        doc,
        "To provide proactive, pre-connection mobile threat defense with zero transmission of sensitive user "
        "telemetry, adhering to strict zero-trust principles.",
        space_after=4
    )
    add_bullet(
        doc,
        "To construct a real-time, interactive 3D Cyber Shield Core using Three.js and WebGL that dynamically reflects "
        "device security health through geometry distortion and chromatic shifts.",
        space_after=4
    )
    add_bullet(
        doc,
        "To build an optical camera QR scanner paired with an in-memory execution sandbox that intercepts and "
        "previews deceptive intents before browser or system launch.",
        space_after=4
    )
    add_bullet(
        doc,
        "To evaluate 802.11 beacon ciphers and predict cyber attack vectors (Evil Twins, captive portals, sniffing) "
        "prior to wireless association.",
        space_after=4
    )
    add_bullet(
        doc,
        "To analyze application manifests on-device to isolate dangerous sensor combinations without transmitting "
        "package lists to external networks.",
        space_after=4
    )
    add_bullet(
        doc,
        "To deploy a Threat Intelligence Gateway enforcing SSRF and DNS-rebinding guards while aggregating multi-engine "
        "consensus (VirusTotal, Google Safe Browsing, URLhaus).",
        space_after=4
    )
    add_bullet(
        doc,
        "To calculate overall device security health using a pure, monotonic 0–100 deterministic scoring function "
        "with provable mathematical bounds.",
        space_after=4
    )
    add_bullet(
        doc,
        "To deliver a grounded RAG AI Explainer referencing structured cybersecurity knowledge bases with strict "
        "prompt injection defenses to provide plain-language guidance.",
        space_after=8
    )

    add_h1(doc, "1.4 Scope of the Project")
    add_p(
        doc,
        "Cyber Companion encompasses a decoupled cross-platform architecture comprising a React Native / Expo "
        "client application (supporting standalone Android APK deployment, iOS, and Progressive Web Applications) "
        "and a high-performance Node.js / Express Threat Intelligence Gateway backend. The system integrates "
        "hardware camera sensors, Wi-Fi radio managers, on-device package managers, and external threat feeds. "
        "The project enforces a strict zero-PII privacy policy: no user URLs, scanned QR strings, Wi-Fi SSIDs/BSSIDs, "
        "or application package inventories are logged or exfiltrated without explicit user intent. The backend "
        "exposes versioned RESTful endpoints protected by rate limiters, Zod validation contracts, and RFC 6238 TOTP "
        "authentication for administrative telemetry.",
        space_after=8, line_spacing=1.15
    )

    doc.add_page_break()

    # PAGE 10 (Report Page 3): Technology Stack & Scrum
    add_h1(doc, "1.5 Technology Stack")
    add_table_header(doc, "Table 1.1: Technologies used in Cyber Companion")

    t_tech = doc.add_table(rows=9, cols=2)
    t_tech.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_tech, color="D3D3D3", sz="4", val="single")

    tech_data = [
        ("Layer", "Technology and purpose"),
        ("Client / Mobile", "React Native 0.74 with Expo SDK 51 for cross-platform Android, iOS, and Web deployment; React Native Paper UI; Zustand for deterministic client state management; TypeScript."),
        ("3D Visualization", "Three.js with Expo GL / WebGL rendering interactive 3D shield geometry, vertex displacement shaders, and dynamic 360° holographic posture radar."),
        ("API Gateway", "Node.js (v20+ LTS) with Express 4.19; TypeScript 5.4; Zod for strict contract request validation; Pino for structured JSON logging with automated PII redaction."),
        ("Database & Cache", "MongoDB Atlas accessed asynchronously via Mongoose ODM; 24-hour Time-To-Live (TTL) indexing on threat verdict hashes; high-speed in-memory LRU cache fallback."),
        ("Security Guardrails", "Server-Side Request Forgery (SSRF) and DNS-rebinding guard; Helmet HTTP security headers; Express rate limiting; Prompt Injection Guard with token filtering."),
        ("Threat Intelligence", "Upstream REST API adapters: VirusTotal API (v3), Google Safe Browsing API (v4), URLhaus malware feeds, and local lexical homoglyph heuristics engine."),
        ("Scoring & Logic", "Pure deterministic mathematical weighting engine (30% Wi-Fi, 30% Threat, 20% Permissions, 20% Baseline) with strict monotonicity guarantees."),
        ("Testing & Verification", "Jest test runner, Supertest for REST API pentesting, React Native Testing Library, 25 test suites, 116 automated verification test cases.")
    ]

    for row_idx, (col1, col2) in enumerate(tech_data):
        row = t_tech.rows[row_idx]
        c1, c2 = row.cells[0], row.cells[1]
        c1.width, c2.width = Inches(1.8), Inches(4.2)
        set_cell_margins(c1, top=60, bottom=60, left=100, right=100)
        set_cell_margins(c2, top=60, bottom=60, left=100, right=100)
        p1 = c1.paragraphs[0]
        p2 = c2.paragraphs[0]
        p1.paragraph_format.space_before = Pt(0)
        p1.paragraph_format.space_after = Pt(0)
        p1.paragraph_format.line_spacing = 1.05
        p2.paragraph_format.space_before = Pt(0)
        p2.paragraph_format.space_after = Pt(0)
        p2.paragraph_format.line_spacing = 1.05

        r_c1 = p1.add_run(col1)
        r_c2 = p2.add_run(col2)
        r_c1.font.name = FONT_PRIMARY
        r_c2.font.name = FONT_PRIMARY
        r_c1.font.size = Pt(9)
        r_c2.font.size = Pt(9)

        if row_idx == 0:
            set_cell_background(c1, "EAECF0")
            set_cell_background(c2, "EAECF0")
            r_c1.font.bold = True
            r_c2.font.bold = True
        else:
            r_c1.font.bold = True

    add_h1(doc, "1.6 Development Approach")
    add_p(
        doc,
        "The project was engineered incrementally following the Agile Scrum framework [7]. Development was "
        "structured across structured sprint iterations: establishing the Threat Intelligence Gateway core and "
        "SSRF guards first, developing the React Native client and Three.js 3D visualization second, integrating "
        "the Wi-Fi Sentinel and Optical QR Quishing Sandbox third, and finalizing the on-device permission auditor, "
        "deterministic scoring engine, and grounded RAG AI Explainer. Sprint reviews and backlog artifacts are "
        "tracked separately in the project Scrum Book.",
        space_after=8, line_spacing=1.15
    )

    add_h1(doc, "1.7 Organisation of the Report")
    add_p(
        doc,
        "Chapter 2 reviews related literature and existing security solutions. Chapter 3 describes the implementation, "
        "architecture, database models, functional modules, and key algorithms. Chapter 4 presents experimental results "
        "and benchmark performance. Chapter 5 concludes the report and identifies future scope. Chapter 6 provides "
        "genuine source code listings, Chapter 7 presents interface screenshots, and Chapter 8 provides academic references.",
        space_after=6, line_spacing=1.15
    )

    doc.add_page_break()

def build_chapter_2(doc):
    # PAGE 11 (Report Page 4): Literature Survey
    add_chapter_title(doc, "2", "Literature Survey")
    add_h1(doc, "2.1 Mobile Cybersecurity and Proactive Threat Awareness")

    add_p(
        doc,
        "Mobile cybersecurity has transitioned over the past decade from simple binary malware detection to combating "
        "complex behavioral and deceptive attacks. Douce et al. and modern cyber researchers have demonstrated that "
        "traditional signature-based antivirus scanners are ill-suited for mobile operating systems, where process "
        "sandboxing restricts full filesystem scanning and zero-day social engineering vectors bypass file signatures [2]. "
        "Recent empirical surveys by Ihantola et al. emphasize three imperative requirements for modern digital self-defense: "
        "safe execution of untrusted input strings, immediate plain-language feedback for non-technical users, and defense "
        "workflows tailored to real-world behavioral threat models [1].",
        space_after=8, line_spacing=1.15
    )
    add_p(
        doc,
        "In particular, the emergence of Quishing (QR code phishing) exploits the physical-to-digital bridge: users scan "
        "stickers in parking lots, restaurants, and retail spaces that encode obfuscated URLs or deep links. Without pre-execution "
        "sandboxing, mobile operating systems automatically trigger browser intent handlers, leaving users vulnerable to "
        "credential harvesting. Similarly, Internationalized Domain Name (IDN) homoglyph spoofing substitutes visually identical "
        "Cyrillic or Greek glyphs for ASCII characters (e.g., Cyrillic 'а' in 'pаypal.com'), defeating human visual scrutiny. "
        "Cyber Companion directly incorporates these insights, deploying in-memory URL sandboxing and lexical homoglyph "
        "heuristics before network requests are dispatched.",
        space_after=10, line_spacing=1.15
    )

    add_h1(doc, "2.2 Existing Platforms")
    add_p(
        doc,
        "Several categories of security utilities exist in the modern mobile ecosystem:",
        space_after=6, line_spacing=1.15
    )
    add_bullet(
        doc,
        "Commercial Mobile Antivirus: Applications such as Norton, Avast, and Lookout primarily conduct post-installation "
        "package scanning and file signature analysis. However, they frequently transmit extensive device telemetry and "
        "package inventories to third-party cloud infrastructure, compromising user privacy.",
        space_after=4
    )
    add_bullet(
        doc,
        "Cloud-Based Threat Intelligence Portals: General-purpose platforms such as VirusTotal, URLScan.io, and Google Safe "
        "Browsing provide high-accuracy malware and phishing detection via web interfaces. However, they are not designed "
        "for mobile hardware integration, lack Wi-Fi beacon inspection, and output raw JSON reports unsuited for non-technical users.",
        space_after=4
    )
    add_bullet(
        doc,
        "Operating System Permission Managers: Android and iOS incorporate granular permission dialogues, yet they fail to alert "
        "users to dangerous cross-sensor combinations (such as SMS reading paired with Internet access), nor do they provide "
        "contextual explanations regarding why an app might be over-privileged.",
        space_after=4
    )
    add_bullet(
        doc,
        "Heuristic Wi-Fi Warning Tools: Basic Wi-Fi scanners alert users only after association occurs, leaving the device "
        "exposed during the critical DHCP handshake and initial broadcast period.",
        space_after=4
    )

    doc.add_page_break()

    # PAGE 12 (Report Page 5): Table 2.1 & Technologies Reviewed
    add_table_header(doc, "Table 2.1: Typical capabilities of existing tool categories compared with Cyber Companion")

    t_comp = doc.add_table(rows=9, cols=6)
    t_comp.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_comp, color="D3D3D3", sz="4", val="single")

    comp_data = [
        ("Capability", "Mobile Antivirus", "Cloud Threat Intel", "OS Settings", "Wi-Fi Scanners", "Cyber Companion"),
        ("Pre-Connection Wi-Fi Sentinel", "No", "No", "No", "Limited", "Yes"),
        ("In-Memory Quishing Sandbox", "No", "Limited", "No", "No", "Yes"),
        ("IDN Homoglyph Guard", "Limited", "Yes", "No", "No", "Yes"),
        ("On-Device Permission Auditor", "Yes", "No", "Basic", "No", "Yes"),
        ("Pure Deterministic 0-100 Score", "No", "No", "No", "No", "Yes"),
        ("Grounded RAG AI Explainer", "No", "No", "No", "No", "Yes"),
        ("3D Holographic Posture Core", "No", "No", "No", "No", "Yes"),
        ("Zero PII Exfiltration Policy", "No", "Limited", "Yes", "Limited", "Yes"),
    ]

    col_widths = [Inches(1.8), Inches(0.8), Inches(0.85), Inches(0.75), Inches(0.8), Inches(1.0)]
    for row_idx, row_values in enumerate(comp_data):
        row = t_comp.rows[row_idx]
        for col_idx, val in enumerate(row_values):
            cell = row.cells[col_idx]
            cell.width = col_widths[col_idx]
            set_cell_margins(cell, top=50, bottom=50, left=60, right=60)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.05
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT if col_idx == 0 else WD_ALIGN_PARAGRAPH.CENTER
            r = p.add_run(val)
            r.font.name = FONT_PRIMARY
            r.font.size = Pt(8.5)
            if row_idx == 0:
                set_cell_background(cell, "EAECF0")
                r.font.bold = True
            elif col_idx == 5:
                r.font.bold = True

    p_note = doc.add_paragraph()
    p_note.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_note.paragraph_format.space_before = Pt(2)
    p_note.paragraph_format.space_after = Pt(8)
    r_n = p_note.add_run("The table is a qualitative summary of what each category typically offers; individual implementations differ.")
    r_n.font.name = FONT_PRIMARY
    r_n.font.size = Pt(8.5)
    r_n.font.italic = True

    add_h1(doc, "2.3 Technologies and Standards Reviewed")
    add_bullet(
        doc,
        "REST Architecture [5]: The backend exposes stateless, versioned HTTP endpoints under /v1 to decouple the React "
        "Native client from server-side threat analysis services.",
        bold_prefix="REST Architecture [5]: ",
        space_after=3
    )
    add_bullet(
        doc,
        "RFC 6238 TOTP Standard [6]: Time-Based One-Time Password algorithm utilizing HMAC-SHA1 to provide cryptographic "
        "two-factor authentication for administrative operations.",
        bold_prefix="RFC 6238 TOTP Standard [6]: ",
        space_after=3
    )
    add_bullet(
        doc,
        "RFC 1918 & SSRF Prevention [3]: Internet standards defining private IPv4 address allocations (10.0.0.0/8, 172.16.0.0/12, "
        "192.168.0.0/16, 127.0.0.0/8), enforced to prevent server-side request forgery.",
        bold_prefix="RFC 1918 & SSRF Prevention [3]: ",
        space_after=3
    )
    add_bullet(
        doc,
        "Unicode Technical Report #36 [11]: Security considerations for Internationalized Domain Names (IDNs), providing the "
        "algorithmic baseline for homoglyph substitution and Punycode decoding.",
        bold_prefix="Unicode Technical Report #36 [11]: ",
        space_after=3
    )
    add_bullet(
        doc,
        "OWASP Mobile Top 10 (2024) [12]: Industry security benchmark identifying critical mobile vulnerabilities, guiding "
        "on-device permission analysis and secure credential storage.",
        bold_prefix="OWASP Mobile Top 10 (2024) [12]: ",
        space_after=3
    )

    doc.add_page_break()

    # PAGE 13 (Report Page 6): Technologies Reviewed (cont.) & Summary
    add_bullet(
        doc,
        "VirusTotal REST API v3 [13]: Upstream threat intelligence endpoint providing multi-engine antivirus consensus across "
        "more than 70 security vendor scanners.",
        bold_prefix="VirusTotal REST API v3 [13]: ",
        space_after=4
    )
    add_bullet(
        doc,
        "Google Safe Browsing v4 [17]: High-throughput threat lookup API used to verify URLs against suspected malware and "
        "social engineering blacklists.",
        bold_prefix="Google Safe Browsing v4 [17]: ",
        space_after=4
    )
    add_bullet(
        doc,
        "Three.js & WebGL 2.0 [14]: Low-level 3D graphics library executing dynamic vertex and fragment shaders on mobile GPU "
        "hardware without native compilation overhead.",
        bold_prefix="Three.js & WebGL 2.0 [14]: ",
        space_after=4
    )
    add_bullet(
        doc,
        "Retrieval-Augmented Generation (RAG) [15]: Information retrieval paradigm that extracts relevant knowledge documents "
        "to ground language model responses in verified facts.",
        bold_prefix="Retrieval-Augmented Generation (RAG) [15]: ",
        space_after=4
    )
    add_bullet(
        doc,
        "Zod Schema Validation [16]: TypeScript-first data modeling library providing strict runtime validation and type inference "
        "for external API payloads.",
        bold_prefix="Zod Schema Validation [16]: ",
        space_after=6
    )

    add_h1(doc, "2.4 Summary")
    add_p(
        doc,
        "The literature and existing security solutions demonstrate that while the individual components of mobile protection "
        "— threat intelligence feeds, permission managers, Wi-Fi analyzers, and barcode scanners — are technologically mature, "
        "they are invariably siloed into disparate commercial utilities. Moreover, existing solutions rely heavily on invasive cloud "
        "telemetry and communicate risks through incomprehensible technical terminology.",
        space_after=8, line_spacing=1.15
    )
    add_p(
        doc,
        "Cyber Companion synthesizes these capabilities into a cohesive, zero-trust mobile defense platform. By uniting an in-memory "
        "Quishing sandbox, pre-connection Wi-Fi beacon inspection, on-device permission auditing, a pure deterministic 0–100 scoring "
        "engine, and a grounded RAG AI Explainer, Cyber Companion empowers non-technical smartphone users to make informed, proactive "
        "security decisions without compromising privacy.",
        space_after=6, line_spacing=1.15
    )

    doc.add_page_break()
