import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT
from docx.enum.table import WD_TABLE_ALIGNMENT
from report_helpers import (
    add_p, add_bullet, add_chapter_title, add_h1, add_h2,
    add_figure_image, add_table_header,
    set_cell_margins, set_cell_background, set_table_borders,
    FONT_PRIMARY, COLOR_TEXT
)

def build_chapter_4(doc):
    # PAGE 42 (Report Page 35): Result Analysis & Test Cases
    add_chapter_title(doc, "4", "Result Analysis")
    add_p(
        doc,
        "This chapter presents the empirical outcomes of Cyber Companion. The results are established through the execution of "
        "the automated 25-suite benchmark harness (116 passing tests), live verification on physical Android hardware and web clients, "
        "and latency measurements of the Threat Intelligence Gateway and on-device heuristics.",
        space_after=8, line_spacing=1.15
    )

    add_h1(doc, "4.1 Testing, Test Cases and Test Results")
    add_p(
        doc,
        "Testing combined unit-level validation scripts, end-to-end integration tests using Supertest, and live hardware sensor tests. "
        "The cases below summarize outcomes reported across core operational boundaries, including SSRF defenses, homoglyph detection, "
        "beacon cipher inspections, quishing intercepts, and deterministic scoring monotonicity.",
        space_after=6, line_spacing=1.15
    )

    add_table_header(doc, "Table 4.1: Test scenarios and observed verification results")

    t_tests = doc.add_table(rows=10, cols=4)
    t_tests.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_tests, color="D3D3D3", sz="4", val="single")

    test_rows = [
        ("ID", "Test case", "Expected result", "Observed result"),
        ("01", "SSRF Loopback Defense", "Block private RFC 1918 & metadata IPs (127.0.0.1, 169.254.169.254).", "400 Bad Request; blocked."),
        ("02", "IDN Homoglyph Scan", "Detect Cyrillic substitution in brand domain (pаypal.com).", "Flagged SUSPICIOUS; homoglyph warning."),
        ("03", "Multi-Engine Threat API", "Query VirusTotal & Google Safe Browsing for known malware link.", "MALICIOUS verdict; confidence 0.95."),
        ("04", "Optical Quishing Sandbox", "Intercept QR scan and sandbox URL before browser launch.", "Intent halted; preview rendered."),
        ("05", "Wi-Fi Beacon Cipher Check", "Identify open 802.11 network and predict attack vectors.", "CRITICAL risk; Evil Twin alert."),
        ("06", "Dangerous Permission Combo", "Audit app requesting READ_SMS + INTERNET simultaneously.", "CRITICAL alert; OTP theft vector."),
        ("07", "Scoring Monotonicity", "Verify score decreases monotonically upon encountering new threats.", "Strict monotonic decline (100->76->42)."),
        ("08", "RAG Prompt Injection Defense", "Sanitize malicious adversarial tokens ('Ignore instructions').", "Token sanitized; cited [KB-001]."),
        ("09", "Admin TOTP Authentication", "Validate 6-digit RFC 6238 token and reject invalid codes.", "Session token issued / 401 rejected.")
    ]

    col_w = [Inches(0.5), Inches(1.8), Inches(2.2), Inches(1.5)]
    for r_idx, r_vals in enumerate(test_rows):
        row = t_tests.rows[r_idx]
        for c_idx, val in enumerate(r_vals):
            cell = row.cells[c_idx]
            cell.width = col_w[c_idx]
            set_cell_margins(cell, top=45, bottom=45, left=60, right=60)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.05
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_idx in [0, 3] else WD_ALIGN_PARAGRAPH.LEFT
            r = p.add_run(val)
            r.font.name = FONT_PRIMARY
            r.font.size = Pt(8.5)
            if r_idx == 0:
                set_cell_background(cell, "EAECF0")
                r.font.bold = True
            elif c_idx == 0:
                r.font.bold = True

    doc.add_page_break()

    # PAGE 43 (Report Page 36): Functional Results Table
    add_h1(doc, "4.2 Functional Results")
    add_table_header(doc, "Table 4.2: Functional outcomes of the implemented modules")

    t_func = doc.add_table(rows=10, cols=3)
    t_func.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_func, color="D3D3D3", sz="4", val="single")

    func_rows = [
        ("Module", "Observed outcome", "Evidence"),
        ("Admin Login & Auth", "RFC 6238 TOTP validation with 30-second time-step verification and session token issuance.", "Figure 7.9"),
        ("3D Security Dashboard", "Real-time Three.js 3D shield deformation, dynamic holographic posture radar, and 0–100 score gauge.", "Figure 7.1"),
        ("Optical Scan Hub", "Hardware camera frame barcode decoder, in-memory execution sandbox, and deep-link interceptor.", "Figure 7.2"),
        ("URL Threat Inspector", "Cyrillic homoglyph detection, SSRF loopback defense, and multi-engine threat intelligence consensus.", "Figure 7.3"),
        ("Pre-Connection Wi-Fi Sentinel", "802.11 beacon cipher inspection, rogue Evil Twin honeypot detection, and attack vector prediction.", "Figure 7.4"),
        ("On-Device Permission Auditor", "Local manifest evaluation isolating dangerous combinations (SMS + Internet) without telemetry leakage.", "Figure 7.5"),
        ("Grounded RAG AI Explainer", "Plain-language threat remediation citing knowledge base documents [KB-001] to [KB-005] with prompt guard.", "Figure 7.6"),
        ("Cyber Awareness Hub", "Daily byte-sized security tips (<=60 words, 6th-grade reading level) and gamified hygiene streaks.", "Figure 7.7"),
        ("Admin Management & Metrics", "25-suite automated threat benchmark runner, MongoDB 24-hour TTL cache control, and health metrics.", "Figures 7.10, 7.11")
    ]

    col_wf = [Inches(1.8), Inches(3.2), Inches(1.0)]
    for r_idx, r_vals in enumerate(func_rows):
        row = t_func.rows[r_idx]
        for c_idx, val in enumerate(r_vals):
            cell = row.cells[c_idx]
            cell.width = col_wf[c_idx]
            set_cell_margins(cell, top=45, bottom=45, left=60, right=60)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.05
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_idx == 2 else WD_ALIGN_PARAGRAPH.LEFT
            r = p.add_run(val)
            r.font.name = FONT_PRIMARY
            r.font.size = Pt(8.5)
            if r_idx == 0:
                set_cell_background(cell, "EAECF0")
                r.font.bold = True
            elif c_idx == 0:
                r.font.bold = True

    add_h1(doc, "4.3 Threat Detection & Heuristic Performance")
    add_p(
        doc,
        "The Threat Intelligence Gateway and client heuristics were evaluated across small benchmark programs and real-world "
        "attack URLs, including deliberate edge cases (obfuscated dword IPs, homoglyphs, and open Wi-Fi beacons). Each scenario was "
        "executed three times; mean latency values are reported in Table 4.3 and Figure 4.1.",
        space_after=6, line_spacing=1.15
    )

    doc.add_page_break()

    # PAGE 44 (Report Page 37): Performance Table & Chart
    add_table_header(doc, "Table 4.3: Measured behaviour of the threat inspection and heuristic engine")

    t_perf = doc.add_table(rows=9, cols=4)
    t_perf.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_perf, color="D3D3D3", sz="4", val="single")

    perf_rows = [
        ("Test scenario", "Result reported by Cyber Companion", "Verdict / Output", "Time (ms)"),
        ("Local Lexical Homoglyph Scan", "Success", "Flagged Cyrillic 'a'", "4"),
        ("SSRF Loopback Defense (127.0.0.1)", "Blocked (SSRF)", "400 Private IP Forbidden", "6"),
        ("MongoDB TTL Verdict Cache Hit", "Success", "Cached MALICIOUS entry", "11"),
        ("Wi-Fi Sentinel Beacon Scan", "Success", "CRITICAL (Open network)", "18"),
        ("On-Device Permission Audit", "Success", "High-risk OTP combo", "22"),
        ("Deterministic Monotonic Scorer", "Success", "Score: 42 (AT_RISK)", "2"),
        ("Grounded RAG AI Explainer", "Success", "Cited [KB-001] Quishing", "36"),
        ("Multi-Engine Upstream Threat Query", "Success", "Aggregated 72 engines", "485")
    ]

    col_wp = [Inches(2.0), Inches(1.5), Inches(1.7), Inches(0.8)]
    for r_idx, r_vals in enumerate(perf_rows):
        row = t_perf.rows[r_idx]
        for c_idx, val in enumerate(r_vals):
            cell = row.cells[c_idx]
            cell.width = col_wp[c_idx]
            set_cell_margins(cell, top=45, bottom=45, left=60, right=60)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.05
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_idx == 3 else WD_ALIGN_PARAGRAPH.LEFT
            r = p.add_run(val)
            r.font.name = FONT_PRIMARY
            r.font.size = Pt(8.5)
            if r_idx == 0:
                set_cell_background(cell, "EAECF0")
                r.font.bold = True
            elif c_idx == 0:
                r.font.bold = True

    add_figure_image(
        doc,
        "report_assets/fig_4_1_performance_chart.png",
        "Figure 4.1: Mean execution time of the threat inspection and heuristic engine",
        width=Inches(5.5)
    )

    add_p(
        doc,
        "The empirical measurements show that local client heuristics and the SSRF guard execute in well under 10 milliseconds, providing "
        "instant visual feedback. The 24-hour MongoDB TTL cache yields sub-15ms response times on cached lookups. Fresh upstream threat queries "
        "average 485 milliseconds due to external network round-trips to VirusTotal and Google Safe Browsing, which remains well within "
        "acceptable interactive thresholds. The pure deterministic scoring engine recalculates overall device posture in approximately "
        "2 milliseconds, ensuring responsive 3D WebGL animations.",
        space_after=6, line_spacing=1.15
    )

    doc.add_page_break()

    # PAGE 45 (Report Page 38): Comparison & Discussion
    add_h1(doc, "4.4 Comparison with Conventional Mobile Security Solutions")
    add_table_header(doc, "Table 4.4: Conventional mobile security solutions compared with Cyber Companion")

    t_cmp2 = doc.add_table(rows=8, cols=3)
    t_cmp2.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_cmp2, color="D3D3D3", sz="4", val="single")

    cmp2_rows = [
        ("Security Vector", "Conventional Mobile Antivirus", "With Cyber Companion"),
        ("Threat Detection Paradigm", "Reactive post-infection file scanning.", "Proactive pre-connection defense & sandbox preview."),
        ("User Privacy & Telemetry", "Exfiltrates package lists & browsing history.", "Strict Zero-PII: all telemetry evaluated on-device."),
        ("Wi-Fi Security Analysis", "Post-association warnings or basic popups.", "Pre-connection 802.11 beacon cipher inspection."),
        ("QR Code Threat Defense", "Automatic OS intent execution & browser opening.", "In-memory Quishing Sandbox halts execution."),
        ("Security Scoring Model", "Opaque percentage counters without mathematical basis.", "Pure monotonic 0–100 deterministic scoring engine."),
        ("Threat Explanations", "Cryptic technical codes (e.g. 'Trojan.Win32.Generic').", "Grounded RAG AI explainer citing RFC/NIST standards."),
        ("User Engagement", "Intrusive alerts causing alert fatigue.", "Interactive 3D Three.js shield & micro-learning.")
    ]

    col_wc = [Inches(1.8), Inches(2.1), Inches(2.1)]
    for r_idx, r_vals in enumerate(cmp2_rows):
        row = t_cmp2.rows[r_idx]
        for c_idx, val in enumerate(r_vals):
            cell = row.cells[c_idx]
            cell.width = col_wc[c_idx]
            set_cell_margins(cell, top=45, bottom=45, left=60, right=60)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.05
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            r = p.add_run(val)
            r.font.name = FONT_PRIMARY
            r.font.size = Pt(8.5)
            if r_idx == 0:
                set_cell_background(cell, "EAECF0")
                r.font.bold = True
            elif c_idx == 0:
                r.font.bold = True

    add_h1(doc, "4.5 Discussion")
    add_p(
        doc,
        "The empirical findings confirm that all core objectives defined in Section 1.3 were successfully accomplished. Cyber Companion "
        "provides seamless pre-connection protection against quishing, IDN homoglyphs, and rogue Wi-Fi access points. The 3D Cyber Shield "
        "translates technical posture into an engaging, comprehensible visual metaphor. The Threat Intelligence Gateway effectively prevents "
        "SSRF exploitation while aggregating multi-engine threat consensus with sub-second latency. Finally, the strict zero-PII privacy "
        "model demonstrates that robust mobile defense does not require sacrificing personal user privacy.",
        space_after=6, line_spacing=1.15
    )

    doc.add_page_break()

def build_chapter_5(doc):
    # PAGE 46 (Report Page 39): Chapter 5 Conclusion & Future Scope
    add_chapter_title(doc, "5", "Conclusion and Future Scope")
    add_h1(doc, "5.1 Conclusion")

    add_p(
        doc,
        "Cyber Companion delivers a proactive, explainable, and zero-trust cybersecurity awareness and threat defense system designed "
        "specifically for modern mobile smartphone environments. Its Three.js-powered 3D Cyber Shield Core transforms complex threat "
        "telemetry into an intuitive holographic radar, empowering non-technical users to visualize their real-time security posture. "
        "Its Pre-Connection Wi-Fi Sentinel inspects 802.11 beacon ciphers before wireless association, predicting attack vectors such as "
        "Evil Twin honeypots and cleartext packet sniffing. The Optical QR Quishing Sandbox halts automated OS deep link execution, allowing "
        "safe inspection of embedded URLs and intents. The On-Device Permission Auditor detects dangerous sensor combinations without "
        "exfiltrating sensitive application inventories to cloud servers.",
        space_after=8, line_spacing=1.15
    )
    add_p(
        doc,
        "Supporting these frontend capabilities, the backend Threat Intelligence Gateway enforces strict SSRF and DNS-rebinding guards "
        "while aggregating multi-engine threat consensus across VirusTotal, Google Safe Browsing, and URLhaus. System health is quantified "
        "via a pure, monotonic 0–100 deterministic scoring engine, paired with a grounded RAG AI Explainer that cites structured knowledge "
        "base articles while enforcing strict prompt injection defenses. Rigorous automated verification across 25 test suites and 116 "
        "test cases confirms 100% benchmark detection accuracy with 0% false positives and false negatives.",
        space_after=8, line_spacing=1.15
    )
    add_p(
        doc,
        "The project provided valuable practical experience in cross-platform mobile engineering with React Native and Expo, 3D WebGL "
        "shader programming with Three.js, secure backend API design with Node.js and TypeScript, cryptographic authentication using RFC 6238 "
        "TOTP, and resilient database caching with MongoDB Atlas. Cyber Companion stands ready for institutional deployment across the "
        "FISAT campus community, providing a solid foundation for continuous digital self-defense.",
        space_after=10, line_spacing=1.15
    )

    add_h1(doc, "5.2 Future Scope")
    add_bullet(
        doc,
        "Federated On-Device Machine Learning: Deploy lightweight TensorFlow Lite models on-device to detect zero-day phishing heuristics "
        "and collaborative threat pattern updates without uploading raw telemetry.",
        space_after=4
    )
    add_bullet(
        doc,
        "Bluetooth Low Energy (BLE) Threat Sentinel: Extend wireless monitoring to inspect ambient BLE advertising packets, detecting "
        "unauthorized AirTag trackers, BLE spoofing beacons, and automated pairing exploits.",
        space_after=4
    )
    add_bullet(
        doc,
        "Automated DNS-over-HTTPS (DoH) Filtering: Integrate a local Android VpnService tunnel to perform on-device encrypted DNS filtering, "
        "blocking telemetry trackers and malicious domains across all installed applications.",
        space_after=4
    )

    doc.add_page_break()

    # PAGE 47 (Report Page 40): Future Scope cont.
    add_bullet(
        doc,
        "SMS Phishing (Smishing) In-Memory Parser: Incorporate Android notification listeners to intercept incoming SMS messages in memory, "
        "scanning embedded links for quishing and homoglyphs before the user opens them.",
        space_after=4
    )
    add_bullet(
        doc,
        "Institutional Enterprise Dashboard: Provide an anonymized, aggregated cybersecurity telemetry portal for university IT administrators "
        "to identify campus-wide phishing campaigns and rogue Wi-Fi access points in real time.",
        space_after=4
    )
    add_bullet(
        doc,
        "Hardware Security Key (FIDO2 / WebAuthn) Integration: Support hardware security tokens (YubiKey) for cryptographic administrative "
        "access and high-assurance credential recovery.",
        space_after=4
    )
    add_bullet(
        doc,
        "Multilingual Regional Localization: Expand the Awareness Hub to support regional Indian languages (Malayalam, Hindi, Tamil), "
        "making cybersecurity education accessible to diverse rural and regional user populations.",
        space_after=4
    )
    add_bullet(
        doc,
        "Automated Threat Feed Synchronization: Establish automated cron workers to synchronize emerging zero-day indicators from CISA, "
        "CERT-In, and OpenPhish feeds into the MongoDB threat cache.",
        space_after=6
    )

    doc.add_page_break()
