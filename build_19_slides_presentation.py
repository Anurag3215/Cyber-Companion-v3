import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # 16:9 Widescreen layout
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Theme Colors
    BG_DARK = RGBColor(11, 17, 33)        # #0B1121 deep slate
    CARD_BG = RGBColor(18, 28, 51)        # #121C33 glass card
    CARD_BORDER = RGBColor(37, 56, 92)    # #25385C border
    EMERALD = RGBColor(16, 185, 129)      # #10B981 accent green
    MINT = RGBColor(52, 211, 153)         # #34D399 light green
    CYAN = RGBColor(56, 189, 248)         # #38BDF8 accent blue
    AMBER = RGBColor(245, 158, 11)        # #F59E0B warning
    CORAL = RGBColor(244, 63, 94)         # #F43F5E red/critical
    TEXT_WHITE = RGBColor(248, 250, 252)  # #F8FAFC
    TEXT_MUTED = RGBColor(148, 163, 184)  # #94A3B8
    TEXT_DIM = RGBColor(100, 116, 139)    # #64748B

    def set_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background()
        return bg

    def add_header(slide, title_text, category_text="CYBER COMPANION (CHECK FIRST) · RESEARCH PRESENTATION"):
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.35))
        tf_c = cat_box.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = tf_c.margin_top = tf_c.margin_right = tf_c.margin_bottom = 0
        p_c = tf_c.paragraphs[0]
        p_c.text = category_text.upper()
        p_c.font.size = Pt(11)
        p_c.font.bold = True
        p_c.font.color.rgb = MINT
        p_c.font.name = "Segoe UI"

        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.7), Inches(0.65))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = 0
        p_t = tf_t.paragraphs[0]
        p_t.text = title_text
        p_t.font.size = Pt(22)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_WHITE
        p_t.font.name = "Segoe UI"

    def add_card(slide, left, top, width, height, title=None, accent_color=None):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER
        card.line.width = Pt(1.2)

        if accent_color:
            bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, width, Inches(0.06))
            bar.fill.solid()
            bar.fill.fore_color.rgb = accent_color
            bar.line.fill.background()

        if title:
            tb = slide.shapes.add_textbox(left + Inches(0.25), top + Inches(0.18), width - Inches(0.5), Inches(0.45))
            tf = tb.text_frame
            tf.word_wrap = True
            tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
            p = tf.paragraphs[0]
            p.text = title
            p.font.size = Pt(14)
            p.font.bold = True
            p.font.color.rgb = accent_color if accent_color else MINT
            p.font.name = "Segoe UI"

        return card

    def add_speaker_notes(slide, notes_text):
        notes_slide = slide.notes_slide
        tf = notes_slide.notes_text_frame
        tf.text = notes_text

    # ==========================================
    # SLIDE 1: TITLE SLIDE
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_bg(s1)

    t_box = s1.shapes.add_textbox(Inches(1.0), Inches(1.2), Inches(11.3), Inches(3.2))
    tf1 = t_box.text_frame
    tf1.word_wrap = True

    p0 = tf1.paragraphs[0]
    p0.text = "MINI PROJECT PAPER PRESENTATION"
    p0.font.size = Pt(13)
    p0.font.bold = True
    p0.font.color.rgb = MINT
    p0.font.name = "Segoe UI"
    p0.space_after = Pt(12)

    p1 = tf1.add_paragraph()
    p1.text = "Cyber Companion (Check First)"
    p1.font.size = Pt(36)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_WHITE
    p1.font.name = "Segoe UI"
    p1.space_after = Pt(10)

    p2 = tf1.add_paragraph()
    p2.text = "A Zero-Trust Cross-Platform Architecture for Proactive Mobile Cyber Threat Defense and Awareness"
    p2.font.size = Pt(18)
    p2.font.color.rgb = CYAN
    p2.font.name = "Segoe UI"

    # Presenter Card
    add_card(s1, Inches(1.0), Inches(4.5), Inches(5.4), Inches(2.2), title="Presenter Details", accent_color=CYAN)
    dt1 = s1.shapes.add_textbox(Inches(1.3), Inches(5.1), Inches(4.8), Inches(1.4))
    tf_dt1 = dt1.text_frame
    tf_dt1.word_wrap = True
    p_d1 = tf_dt1.paragraphs[0]
    p_d1.text = "Name: Anurag T S (FIT25MCA-2008)\nCourse: Master of Computer Applications (MCA)\nDepartment of Computer Applications\nFederal Institute of Science and Technology (FISAT)"
    p_d1.font.size = Pt(12)
    p_d1.font.color.rgb = TEXT_MUTED
    p_d1.font.name = "Segoe UI"

    # Faculty Card
    add_card(s1, Inches(6.9), Inches(4.5), Inches(5.4), Inches(2.2), title="Faculty & Evaluation Panel", accent_color=MINT)
    dt2 = s1.shapes.add_textbox(Inches(7.2), Inches(5.1), Inches(4.8), Inches(1.4))
    tf_dt2 = dt2.text_frame
    tf_dt2.word_wrap = True
    p_d2 = tf_dt2.paragraphs[0]
    p_d2.text = "Project Guide: Dr. Rosemary Mathews\nScrum Master: Dr. Deepa Mary\nHead of Department: Dr. Shahna K U\nAcademic Year: 2025–2026 | October 2026"
    p_d2.font.size = Pt(12)
    p_d2.font.color.rgb = TEXT_MUTED
    p_d2.font.name = "Segoe UI"

    add_speaker_notes(s1, "Good morning respected members of the evaluation committee, my guide Dr. Rosemary Mathews, and faculty members. I am Anurag T S, a final-year MCA student at FISAT. Today, I am presenting my mini-project paper titled 'Cyber Companion (Check First): A Zero-Trust Cross-Platform Architecture for Proactive Mobile Cyber Threat Defense and Awareness'. This research addresses the vulnerability gap between complex cyber threat telemetry and everyday smartphone users, presenting a cross-platform system designed to transition mobile security from reactive post-infection scanning to proactive, pre-connection awareness.")

    # ==========================================
    # SLIDE 2: ABSTRACT SUMMARY
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_bg(s2)
    add_header(s2, "Abstract Summary & System Overview")

    add_card(s2, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), title="The Problem & Paradigm Shift", accent_color=CORAL)
    tb2_1 = s2.shapes.add_textbox(Inches(1.1), Inches(2.3), Inches(5.0), Inches(4.3))
    tf2_1 = tb2_1.text_frame
    tf2_1.word_wrap = True
    p2_1 = tf2_1.paragraphs[0]
    p2_1.text = "• Proliferation of Mobile Vectors:\nEveryday smartphone users face escalating risks from Quishing (QR phishing), rogue Evil Twin Wi-Fi access points, Punycode homoglyphs, and intrusive background sensor permissions.\n\n• The Reactive Antivirus Dilemma:\nTraditional mobile security relies on post-infection file scanning, exfiltrates private user telemetry, and delivers cryptic technical error codes.\n\n• The Solution: 'Check First':\nCyber Companion shifts the paradigm from post-infection reaction to pre-connection awareness and on-device privacy-preserving defense."
    p2_1.font.size = Pt(12)
    p2_1.font.color.rgb = TEXT_MUTED
    p2_1.font.name = "Segoe UI"

    add_card(s2, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.3), title="Core Architectural Contributions", accent_color=EMERALD)
    tb2_2 = s2.shapes.add_textbox(Inches(7.1), Inches(2.3), Inches(5.1), Inches(4.3))
    tf2_2 = tb2_2.text_frame
    tf2_2.word_wrap = True
    p2_2 = tf2_2.paragraphs[0]
    p2_2.text = "• 3D Cyber Shield Core:\nReal-time Three.js holographic vector canvas visualizing device security state dynamically.\n\n• Pre-Connection Wi-Fi Sentinel:\n802.11 beacon frame inspection classifying cipher strength and predicting MitM crime attacks before connection.\n\n• Optical QR Sandbox:\nIsolated in-memory hardware camera decode preventing automated browser and intent execution.\n\n• Deterministic 0–100 Scorer:\nPure monotonic mathematical weighting (30/30/20/20) with grounded RAG AI explanation citing [KB-001] to [KB-005]."
    p2_2.font.size = Pt(12)
    p2_2.font.color.rgb = TEXT_MUTED
    p2_2.font.name = "Segoe UI"

    add_speaker_notes(s2, "Mobile computing has become the primary vector for financial fraud and social engineering. Cyber Companion eliminates the typical user's blind trust in QR codes and open Wi-Fi. By combining client-side heuristics, a 3D visual risk canvas, on-device permission auditing, and a hardened multi-engine consensus gateway, the system empowers non-technical users to verify digital safety before taking irreversible actions—encapsulated by our design philosophy: 'Check First'.")

    # ==========================================
    # SLIDE 3: INTRODUCTION & BACKGROUND
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    set_bg(s3)
    add_header(s3, "Introduction & Threat Background")

    add_card(s3, Inches(0.8), Inches(1.6), Inches(3.7), Inches(5.3), title="Handheld Dominance", accent_color=CYAN)
    tb3_1 = s3.shapes.add_textbox(Inches(1.0), Inches(2.3), Inches(3.3), Inches(4.3))
    tf3_1 = tb3_1.text_frame
    tf3_1.word_wrap = True
    tf3_1.paragraphs[0].text = "• Primary Compute Hubs:\nSmartphones now store banking credentials, SMS OTP tokens, and confidential corporate communications.\n\n• Untrusted Perimeters:\nUnlike corporate desktops protected by perimeter firewalls, mobile devices roam continuously through untrusted networks and public spaces."
    tf3_1.paragraphs[0].font.size = Pt(12)
    tf3_1.paragraphs[0].font.color.rgb = TEXT_MUTED
    tf3_1.paragraphs[0].font.name = "Segoe UI"

    add_card(s3, Inches(4.8), Inches(1.6), Inches(3.7), Inches(5.3), title="Physical-to-Digital Attack Bridge", accent_color=AMBER)
    tb3_2 = s3.shapes.add_textbox(Inches(5.0), Inches(2.3), Inches(3.3), Inches(4.3))
    tf3_2 = tb3_2.text_frame
    tf3_2.word_wrap = True
    tf3_2.paragraphs[0].text = "• Quishing (QR Phishing):\nPhysical QR codes conceal the destination URL from human optical inspection, allowing malicious redirects to credential harvesting forms.\n\n• Rogue Wi-Fi Hotspots:\nFake APs broadcasting legitimate SSIDs harvest unencrypted telemetry and credentials."
    tf3_2.paragraphs[0].font.size = Pt(12)
    tf3_2.paragraphs[0].font.color.rgb = TEXT_MUTED
    tf3_2.paragraphs[0].font.name = "Segoe UI"

    add_card(s3, Inches(8.8), Inches(1.6), Inches(3.7), Inches(5.3), title="Cognitive Exploitation", accent_color=CORAL)
    tb3_3 = s3.shapes.add_textbox(Inches(9.0), Inches(2.3), Inches(3.3), Inches(4.3))
    tf3_3 = tb3_3.text_frame
    tf3_3.word_wrap = True
    tf3_3.paragraphs[0].text = "• Homoglyph Deception:\nAttackers deploy IDN homoglyphs (e.g., Cyrillic 'a' replacing Latin 'a') to mimic brand domains perfectly.\n\n• Cryptic Jargon:\nError codes like 'SSL Handshake Certificate Authority Invalid' fail to guide standard users on actual protective actions."
    tf3_3.paragraphs[0].font.size = Pt(12)
    tf3_3.paragraphs[0].font.color.rgb = TEXT_MUTED
    tf3_3.paragraphs[0].font.name = "Segoe UI"

    add_speaker_notes(s3, "As illustrated on this slide, smartphones operate in hostile, untrusted environments without the perimeter firewalls found in enterprise desktop setups. Threat actors exploit this by embedding malicious URLs in public QR payment stickers or broadcasting open Wi-Fi SSIDs resembling legitimate establishments. When commercial antivirus software detects an anomaly, it typically displays a cryptic error code. Cyber Companion bridges this communication gap with accessible, visual, and grounded defenses.")

    # ==========================================
    # SLIDE 4: PROBLEM STATEMENT
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_bg(s4)
    add_header(s4, "Problem Statement: The Need for Proactive Awareness")

    add_card(s4, Inches(0.8), Inches(1.6), Inches(11.7), Inches(5.3), title="Critical Gaps in Current Mobile Security Paradigms", accent_color=CORAL)
    tb4 = s4.shapes.add_textbox(Inches(1.1), Inches(2.3), Inches(11.1), Inches(4.3))
    tf4 = tb4.text_frame
    tf4.word_wrap = True
    p4 = tf4.paragraphs[0]
    p4.text = "1. Reactive Detection Inefficacy:\nTraditional antivirus scanners inspect storage only after a payload has landed, failing to stop ephemeral session hijacking, drive-by phishing, and pre-connection Wi-Fi eavesdropping.\n\n2. Invasive Telemetry & Privacy Compromise:\nCommercial security tools harvest installed application lists, browsing histories, and location coordinates to third-party ad brokers under the guise of threat intelligence.\n\n3. Cognitive Disconnect & Security Fatigue:\nStandard tools present opaque technical warnings without explaining why a domain is risky or detailing plain-language steps to resolve it.\n\n4. Resource Throttling & Battery Drain:\nHeavy background file polling causes mobile device thermal throttling and rapid battery depletion.\n\n5. Non-Deterministic & Vulnerable AI:\nEmerging generative AI security apps are vulnerable to adversarial prompt injections embedded in target URLs or QR codes and produce inconsistent risk ratings."
    p4.font.size = Pt(12)
    p4.font.color.rgb = TEXT_MUTED
    p4.font.name = "Segoe UI"

    add_speaker_notes(s4, "The central problem we address is threefold: current mobile defenses are reactive, invasive to personal privacy, and cognitively disconnected from the user. If an antivirus scans a file after you download it, your credentials have already been compromised. If it logs every URL you visit, your privacy is breached. We needed an architecture that guarantees zero telemetry leakage, evaluates threats prior to network connection, and provides deterministic, reproducible security scoring.")

    # ==========================================
    # SLIDE 5: LITERATURE REVIEW
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    set_bg(s5)
    add_header(s5, "Literature Review & Existing Security Solutions")

    add_card(s5, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), title="Academic & Industry Benchmarks", accent_color=CYAN)
    tb5_1 = s5.shapes.add_textbox(Inches(1.1), Inches(2.3), Inches(5.0), Inches(4.3))
    tf5_1 = tb5_1.text_frame
    tf5_1.word_wrap = True
    tf5_1.paragraphs[0].text = "• Felt et al. (IEEE S&P):\nAnalyzed Android permission systems, concluding that users fail to comprehend permissions at install time and need contextual, runtime warnings.\n\n• OWASP Mobile Top 10:\nHighlighted M1 (Improper Platform Usage), M2 (Insecure Data Storage), and M5 (Insecure Communication) as pervasive mobile attack vectors.\n\n• Enck et al. (TaintDroid):\nPioneered runtime information-flow tracking on Android, exposing extensive third-party PII harvesting by consumer applications."
    tf5_1.paragraphs[0].font.size = Pt(12)
    tf5_1.paragraphs[0].font.color.rgb = TEXT_MUTED
    tf5_1.paragraphs[0].font.name = "Segoe UI"

    add_card(s5, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.3), title="Commercial Threat Feeds", accent_color=EMERALD)
    tb5_2 = s5.shapes.add_textbox(Inches(7.1), Inches(2.3), Inches(5.1), Inches(4.3))
    tf5_2 = tb5_2.text_frame
    tf5_2.word_wrap = True
    tf5_2.paragraphs[0].text = "• VirusTotal & Google Safe Browsing:\nProvide gold-standard global threat telemetry, but querying them directly from mobile devices leaks client IP addresses and exhausts rate limits.\n\n• Commercial Antivirus (Avast, Norton):\nFocus heavily on signature databases, lacking dedicated optical QR sandboxes and pre-connection Wi-Fi cipher auditing.\n\n• Takeaway:\nExisting literature and tools emphasize post-infection binary analysis rather than pre-connection proactive education."
    tf5_2.paragraphs[0].font.size = Pt(12)
    tf5_2.paragraphs[0].font.color.rgb = TEXT_MUTED
    tf5_2.paragraphs[0].font.name = "Segoe UI"

    add_speaker_notes(s5, "Our literature review examined foundational research on Android permission security, the OWASP Mobile Top 10 vulnerabilities, and automated threat intelligence aggregation. While engines like VirusTotal and Google Safe Browsing provide world-class threat feeds, querying them naively from mobile devices exposes APIs to SSRF vulnerabilities and exhausts user data plans. Furthermore, academic research frequently overlooks the human-computer interaction dimension of cybersecurity alerts.")

    # ==========================================
    # SLIDE 6: DRAWBACKS OF EXISTING SYSTEMS
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_bg(s6)
    add_header(s6, "Drawbacks of Existing Mobile Systems")

    drawbacks = [
        ("No Pre-Connection Verification", "Commercial tools do not audit 802.11 beacon ciphers or flag rogue MAC/OUI profiles prior to network association.", CORAL),
        ("Blind Optical Execution", "Standard camera applications auto-dispatch browser intents without homoglyph verification or intent isolation.", AMBER),
        ("Pervasive Privacy Leaks", "Security apps collect SSID histories, BSSIDs, and full device package lists, violating GDPR zero-trust guidelines.", CORAL),
        ("Prompt Injection Vulnerabilities", "Emerging AI-driven security apps fail against prompt injection payloads hidden within QR strings.", AMBER)
    ]

    for idx, (title, desc, color) in enumerate(drawbacks):
        x = Inches(0.8 + (idx % 2) * 6.0)
        y = Inches(1.6 + (idx // 2) * 2.7)
        add_card(s6, x, y, Inches(5.7), Inches(2.4), title=title, accent_color=color)
        tb = s6.shapes.add_textbox(x + Inches(0.3), y + Inches(0.7), Inches(5.1), Inches(1.5))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.paragraphs[0].text = desc
        tf.paragraphs[0].font.size = Pt(12)
        tf.paragraphs[0].font.color.rgb = TEXT_MUTED
        tf.paragraphs[0].font.name = "Segoe UI"

    add_speaker_notes(s6, "To summarize the existing drawbacks: users are forced to choose between invasive, battery-draining antivirus suites or zero protection against quishing and Wi-Fi eavesdropping. Additionally, newer tools incorporating AI often treat raw LLM responses as authoritative, creating an attack vector where a malicious QR code can hijack the prompt instructions. Cyber Companion directly resolves each of these vulnerabilities.")

    # ==========================================
    # SLIDE 7: PROPOSED SYSTEM & CORE OBJECTIVES
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    set_bg(s7)
    add_header(s7, "Proposed System & Core Objectives")

    add_card(s7, Inches(0.8), Inches(1.6), Inches(11.7), Inches(5.3), title="Cyber Companion: Proactive Zero-Trust Architecture", accent_color=EMERALD)
    tb7 = s7.shapes.add_textbox(Inches(1.1), Inches(2.3), Inches(11.1), Inches(4.3))
    tf7 = tb7.text_frame
    tf7.word_wrap = True
    p7 = tf7.paragraphs[0]
    p7.text = "• Objective 1: Pre-Connection Wi-Fi Defense\nInspect 802.11 beacon ciphers, evaluate WPA2/WPA3 compliance, detect Evil Twin duplicate SSIDs, and predict MitM packet-sniffing risks before connection.\n\n• Objective 2: Optical Camera Quishing Intercept\nCapture and decode QR payloads strictly in-memory, evaluate heuristics, and display a sandboxed intent preview modal.\n\n• Objective 3: Hardened Threat Intelligence Gateway\nEnforce Server-Side Request Forgery (SSRF) and DNS-rebinding protection while aggregating multi-engine threat consensus.\n\n• Objective 4: Privacy-First On-Device Permission Audit\nDetect hazardous permission combinations (SMS read + Internet transmission) locally with zero package exfiltration.\n\n• Objective 5: Deterministic Monotonic Health Scoring\nFormulate a pure mathematical 0–100 health index with grounded RAG explanations citing verified internal knowledge articles."
    p7.font.size = Pt(12)
    p7.font.color.rgb = TEXT_MUTED
    p7.font.name = "Segoe UI"

    add_speaker_notes(s7, "Our proposed system, Cyber Companion, is governed by zero-trust: never trust, always verify. Our objectives focus on building an end-to-end protective pipeline. By placing an optical sandbox over the camera, a cipher analyzer over the Wi-Fi card, and an SSRF guard over our backend gateway, we create an impenetrable defense perimeter that runs smoothly on standard consumer hardware.")

    # ==========================================
    # SLIDE 8: SYSTEM ARCHITECTURE
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    set_bg(s8)
    add_header(s8, "Three-Tier Zero-Trust System Architecture")

    add_card(s8, Inches(0.8), Inches(1.6), Inches(3.7), Inches(5.3), title="Client Tier (Mobile / Web)", accent_color=CYAN)
    tb8_1 = s8.shapes.add_textbox(Inches(1.0), Inches(2.3), Inches(3.3), Inches(4.3))
    tf8_1 = tb8_1.text_frame
    tf8_1.word_wrap = True
    tf8_1.paragraphs[0].text = "• React Native & Three.js:\nHosts the 3D Holographic Cyber Shield and UI.\n\n• Optical Scanner & Wi-Fi Sentinel:\nHardware camera frame decoding and 802.11 beacon cipher analyzer.\n\n• Local Heuristics:\nPunycode homoglyphs, IP literals, and suspicious TLD parser."
    tf8_1.paragraphs[0].font.size = Pt(12)
    tf8_1.paragraphs[0].font.color.rgb = TEXT_MUTED
    tf8_1.paragraphs[0].font.name = "Segoe UI"

    add_card(s8, Inches(4.8), Inches(1.6), Inches(3.7), Inches(5.3), title="Service Gateway Tier", accent_color=EMERALD)
    tb8_2 = s8.shapes.add_textbox(Inches(5.0), Inches(2.3), Inches(3.3), Inches(4.3))
    tf8_2 = tb8_2.text_frame
    tf8_2.word_wrap = True
    tf8_2.paragraphs[0].text = "• Express (TypeScript):\nHardened RESTful API gateway.\n\n• SSRF & Rebinding Guard:\nBlocks loopback (127.0.0.1) and RFC1918 private IP destinations.\n\n• Zod Schema Validation:\nEnforces strict contract integrity on all API endpoints."
    tf8_2.paragraphs[0].font.size = Pt(12)
    tf8_2.paragraphs[0].font.color.rgb = TEXT_MUTED
    tf8_2.paragraphs[0].font.name = "Segoe UI"

    add_card(s8, Inches(8.8), Inches(1.6), Inches(3.7), Inches(5.3), title="Intelligence & Data Tier", accent_color=MINT)
    tb8_3 = s8.shapes.add_textbox(Inches(9.0), Inches(2.3), Inches(3.3), Inches(4.3))
    tf8_3 = tb8_3.text_frame
    tf8_3.word_wrap = True
    tf8_3.paragraphs[0].text = "• MongoDB Atlas (TTL Cache):\n24-hour cache pruning for domain evaluations, cutting external API overhead.\n\n• Multi-Engine Consensus:\nVirusTotal, Google Safe Browsing, and URLhaus feeds.\n\n• Grounded RAG Knowledge Base:\n[KB-001] to [KB-005] citation engine with offline fallbacks."
    tf8_3.paragraphs[0].font.size = Pt(12)
    tf8_3.paragraphs[0].font.color.rgb = TEXT_MUTED
    tf8_3.paragraphs[0].font.name = "Segoe UI"

    add_speaker_notes(s8, "This diagram details our three-tier system architecture. At the top is the cross-platform client built with React Native and Three.js, managing client-side heuristics and native hardware access. Communication with our middle-tier gateway occurs over TLS 1.3 using signed JWT tokens. The gateway houses an SSRF and DNS-rebinding guard that drops requests targeting private RFC1918 subnets. Legitimate queries check a 24-hour MongoDB TTL cache before querying external threat APIs, drastically cutting latency and external quota costs.")

    # ==========================================
    # SLIDE 9: TECHNOLOGY STACK
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    set_bg(s9)
    add_header(s9, "Full-Stack Technology Ecosystem")

    tech_cards = [
        ("Mobile & Frontend", "• React Native (Expo SDK 51)\n• Three.js & React Native WebGL\n• React Native Paper (Material 3)\n• Zustand State Store + MMKV", CYAN),
        ("Backend & Gateway", "• Node.js & Express.js (TypeScript)\n• Zod Runtime Contract Validator\n• Helmet Security & CORS Guard\n• Pino PII-Redacted Logging", EMERALD),
        ("Data & Threat Intel", "• MongoDB Atlas (M0/Dedicated)\n• Redis In-Memory Task Broker\n• VirusTotal v3 REST API\n• Google Safe Browsing v4 API", MINT),
        ("Hardware Extension (IoT)", "• ESP32 Microcontroller\n• Promiscuous 802.11 Sniffer Firmware\n• Deauth & Rogue Beacon Intercept\n• Serial/BLE Native Bridge", AMBER)
    ]

    for idx, (title, desc, color) in enumerate(tech_cards):
        x = Inches(0.8 + (idx % 2) * 6.0)
        y = Inches(1.6 + (idx // 2) * 2.7)
        add_card(s9, x, y, Inches(5.7), Inches(2.4), title=title, accent_color=color)
        tb = s9.shapes.add_textbox(x + Inches(0.3), y + Inches(0.7), Inches(5.1), Inches(1.5))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.paragraphs[0].text = desc
        tf.paragraphs[0].font.size = Pt(12)
        tf.paragraphs[0].font.color.rgb = TEXT_MUTED
        tf.paragraphs[0].font.name = "Segoe UI"

    add_speaker_notes(s9, "We selected an enterprise-grade TypeScript monorepo stack. React Native and Expo provide cross-platform mobility, while Three.js renders dynamic 3D visuals. Our backend relies on Express with TypeScript and Zod for absolute runtime contract safety. We also integrated an optional ESP32 microcontroller firmware module that can run as a physical hardware probe to detect 802.11 deauthentication frames and Evil Twin beacons independently.")

    # ==========================================
    # SLIDE 10: CORE MODULE 1 (3D CYBER SHIELD CORE)
    # ==========================================
    s10 = prs.slides.add_slide(blank_layout)
    set_bg(s10)
    add_header(s10, "Core Module 1: 3D Cyber Shield Core & UI")

    add_card(s10, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), title="Three.js Spatial Holographic Canvas", accent_color=EMERALD)
    tb10_1 = s10.shapes.add_textbox(Inches(1.1), Inches(2.3), Inches(5.0), Inches(4.3))
    tf10_1 = tb10_1.text_frame
    tf10_1.word_wrap = True
    tf10_1.paragraphs[0].text = "• Human-Centric Visualization:\nReplaces confusing static metrics with an animated 3D holographic shield core.\n\n• Touch & Gyro Interaction:\nSupports 360-degree orbital rotation, pinch-to-zoom, and responsive gyro tilt on physical smartphones.\n\n• Optimized Rendering Loop:\nMaintains 60 FPS on mobile WebGL contexts through efficient buffer geometry recycling and zero unnecessary state reconciliations."
    tf10_1.paragraphs[0].font.size = Pt(12)
    tf10_1.paragraphs[0].font.color.rgb = TEXT_MUTED
    tf10_1.paragraphs[0].font.name = "Segoe UI"

    add_card(s10, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.3), title="Dynamic Threat State Mapping", accent_color=CYAN)
    tb10_2 = s10.shapes.add_textbox(Inches(7.1), Inches(2.3), Inches(5.1), Inches(4.3))
    tf10_2 = tb10_2.text_frame
    tf10_2.word_wrap = True
    tf10_2.paragraphs[0].text = "• Secure State (Score 80–100):\nEmerald Green wireframe mesh; tranquil, stable rotational cycle.\n\n• Warning State (Score 50–79):\nAmber Yellow core with accelerated pulse frequency; highlights unencrypted Wi-Fi or suspicious app permissions.\n\n• Critical Threat State (Score 0–49):\nCrimson Red flashing geometry with fractured perimeter mesh; triggers instant remediation overlay.\n\n• Cross-Platform Parity:\nIdentical responsive behavior on Android, iOS, and Web."
    tf10_2.paragraphs[0].font.size = Pt(12)
    tf10_2.paragraphs[0].font.color.rgb = TEXT_MUTED
    tf10_2.paragraphs[0].font.name = "Segoe UI"

    add_speaker_notes(s10, "Core Module 1 is our 3D Cyber Shield Core. Human beings process spatial visual metaphors significantly faster than abstract numbers. By binding the overall security health score to a real-time Three.js 3D mesh, users immediately understand their risk level through color and rotational dynamism. This provides an intuitive, high-tech experience without adding rendering lag.")

    # ==========================================
    # SLIDE 11: CORE MODULE 2 (QR QUISHING SCANNER)
    # ==========================================
    s11 = prs.slides.add_slide(blank_layout)
    set_bg(s11)
    add_header(s11, "Core Module 2: Optical QR Scanner & Quishing Guard")

    add_card(s11, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), title="The Quishing Threat Mechanism", accent_color=CORAL)
    tb11_1 = s11.shapes.add_textbox(Inches(1.1), Inches(2.3), Inches(5.0), Inches(4.3))
    tf11_1 = tb11_1.text_frame
    tf11_1.word_wrap = True
    tf11_1.paragraphs[0].text = "• The Blind QR Dilemma:\nPhysical QR codes hide destination URLs from human inspection. Malicious stickers pasted over legitimate parking or payment QR codes lure victims into credential-harvesting sites.\n\n• The Silent Redirection Risk:\nDefault Android/iOS camera apps trigger automatic browser launches or app store intents without sandboxed preview."
    tf11_1.paragraphs[0].font.size = Pt(12)
    tf11_1.paragraphs[0].font.color.rgb = TEXT_MUTED
    tf11_1.paragraphs[0].font.name = "Segoe UI"

    add_card(s11, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.3), title="In-Memory Sandboxed Defense", accent_color=EMERALD)
    tb11_2 = s11.shapes.add_textbox(Inches(7.1), Inches(2.3), Inches(5.1), Inches(4.3))
    tf11_2 = tb11_2.text_frame
    tf11_2.word_wrap = True
    tf11_2.paragraphs[0].text = "• Hardware Frame Decode:\nCaptures video frames via expo-camera, decoding raw barcodes in local memory.\n\n• Intercepted Intent Dispatch:\nBlocks automated OS navigation to URLs or deep links.\n\n• Heuristics & Homoglyph Inspection:\nDetects Cyrillic characters, high-risk TLDs (.xyz, .top), and raw IP literals.\n\n• Interactive Intent Modal:\nPresents canonical domain, safety verdict, and threat warnings before allowing user progression."
    tf11_2.paragraphs[0].font.size = Pt(12)
    tf11_2.paragraphs[0].font.color.rgb = TEXT_MUTED
    tf11_2.paragraphs[0].font.name = "Segoe UI"

    add_speaker_notes(s11, "Core Module 2 tackles QR Phishing, or Quishing. When a standard phone camera sees a QR code, it immediately prompts you to open the browser. Cyber Companion intercepts this process. The decoded payload is trapped inside an in-memory sandbox. Local heuristics inspect the string for Punycode homoglyphs and suspicious TLDs, forwarding the domain to our consensus gateway. The user sees a clear preview modal with the actual destination, completely stopping silent redirection.")

    # ==========================================
    # SLIDE 12: CORE MODULE 3 (WI-FI SENTINEL & PERMISSION AUDITOR)
    # ==========================================
    s12 = prs.slides.add_slide(blank_layout)
    set_bg(s12)
    add_header(s12, "Core Module 3: Wi-Fi Sentinel & Permission Auditor")

    add_card(s12, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), title="Wi-Fi Sentinel (Pre-Connection)", accent_color=CYAN)
    tb12_1 = s12.shapes.add_textbox(Inches(1.1), Inches(2.3), Inches(5.0), Inches(4.3))
    tf12_1 = tb12_1.text_frame
    tf12_1.word_wrap = True
    tf12_1.paragraphs[0].text = "• 802.11 Beacon Cipher Auditing:\nParses beacon frames prior to connection, identifying unencrypted OPEN networks and deprecated WEP ciphers.\n\n• Rogue AP & Evil Twin Detection:\nFlags duplicate SSIDs with conflicting BSSID MAC vendor OUIs and inconsistent signal attenuation.\n\n• MitM Crime Predictor:\nEstimates probability of packet sniffing, SSL stripping, and rogue captive portal injection."
    tf12_1.paragraphs[0].font.size = Pt(12)
    tf12_1.paragraphs[0].font.color.rgb = TEXT_MUTED
    tf12_1.paragraphs[0].font.name = "Segoe UI"

    add_card(s12, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.3), title="On-Device Permission Auditor", accent_color=AMBER)
    tb12_2 = s12.shapes.add_textbox(Inches(7.1), Inches(2.3), Inches(5.1), Inches(4.3))
    tf12_2 = tb12_2.text_frame
    tf12_2.word_wrap = True
    tf12_2.paragraphs[0].text = "• Dangerous Sensor Clustering:\nScans installed application manifests for predatory permission pairings:\n  - READ_SMS + INTERNET (Banking OTP interception)\n  - RECORD_AUDIO + CAMERA + BACKGROUND_SERVICE\n\n• Privacy-Preserving Execution:\nRuns strictly on-device; zero package names or application inventories are transmitted to external servers.\n\n• Direct Remediation:\nOne-tap deep link to Android system settings for instant permission revocation."
    tf12_2.paragraphs[0].font.size = Pt(12)
    tf12_2.paragraphs[0].font.color.rgb = TEXT_MUTED
    tf12_2.paragraphs[0].font.name = "Segoe UI"

    add_speaker_notes(s12, "Core Module 3 handles network and device-level vulnerabilities. The Wi-Fi Sentinel inspects ambient 802.11 beacon ciphers. If it detects an open network or two identical SSIDs with conflicting MAC hardware vendors, it triggers an Evil Twin alert before the phone connects. Simultaneously, our Permission Auditor scans on-device app manifests to catch dangerous permission pairs—such as an app with SMS read access that can also send data across the Internet—without ever leaking user apps to external servers.")

    # ==========================================
    # SLIDE 13: SECURITY & ACCESS CONTROL
    # ==========================================
    s13 = prs.slides.add_slide(blank_layout)
    set_bg(s13)
    add_header(s13, "Security, Access Control & Gateway Hardening")

    add_card(s13, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), title="Authentication & Role Isolation", accent_color=MINT)
    tb13_1 = s13.shapes.add_textbox(Inches(1.1), Inches(2.3), Inches(5.0), Inches(4.3))
    tf13_1 = tb13_1.text_frame
    tf13_1.word_wrap = True
    tf13_1.paragraphs[0].text = "• Role-Based Access Control (RBAC):\nGranular segregation across End Users, Security Analysts, and System Administrators.\n\n• JWT Token Architecture:\nShort-lived 15-minute access tokens with encrypted refresh token rotation stored in MMKV secure storage.\n\n• Audit Logging:\nAdministrative overrides and system parameter changes are immutably logged with timestamp and user ID."
    tf13_1.paragraphs[0].font.size = Pt(12)
    tf13_1.paragraphs[0].font.color.rgb = TEXT_MUTED
    tf13_1.paragraphs[0].font.name = "Segoe UI"

    add_card(s13, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.3), title="SSRF & Privacy Guards", accent_color=CORAL)
    tb13_2 = s13.shapes.add_textbox(Inches(7.1), Inches(2.3), Inches(5.1), Inches(4.3))
    tf13_2 = tb13_2.text_frame
    tf13_2.word_wrap = True
    tf13_2.paragraphs[0].text = "• SSRF & DNS-Rebind Middleware:\nIntercepts all URL lookups before socket creation:\n  - Blocks 127.0.0.1 / localhost loopback\n  - Blocks RFC1918 subnets (10.0.0.0/8, 192.168.0.0/16)\n  - Blocks cloud metadata IP (169.254.169.254)\n\n• Redacted Logging (Zero PII):\nPino logger regex filters automatically redact IP addresses, Wi-Fi BSSIDs, and scanned URL queries."
    tf13_2.paragraphs[0].font.size = Pt(12)
    tf13_2.paragraphs[0].font.color.rgb = TEXT_MUTED
    tf13_2.paragraphs[0].font.name = "Segoe UI"

    add_speaker_notes(s13, "Security applications must themselves be secure. Our API gateway incorporates rigorous defense-in-depth. If an attacker submits a URL pointing to 127.0.0.1 or AWS metadata endpoints to exploit our gateway, our SSRF guard resolves the DNS, detects the private IP range, and terminates the request immediately. All administrative actions are audit-logged, and user sessions are secured via JWTs.")

    # ==========================================
    # SLIDE 14: IMPLEMENTATION DETAILS
    # ==========================================
    s14 = prs.slides.add_slide(blank_layout)
    set_bg(s14)
    add_header(s14, "Deterministic Scoring & Grounded RAG Implementation")

    add_card(s14, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), title="Deterministic Monotonic Scoring", accent_color=EMERALD)
    tb14_1 = s14.shapes.add_textbox(Inches(1.1), Inches(2.3), Inches(5.0), Inches(4.3))
    tf14_1 = tb14_1.text_frame
    tf14_1.word_wrap = True
    tf14_1.paragraphs[0].text = "• Mathematical Weighting Formula:\nScore = 0.30(S_wifi) + 0.30(S_url) + 0.20(S_perm) + 0.20(S_sys)\n\n• Guaranteed Monotonicity:\nFixing a vulnerability strictly increases the health metric; new threats strictly reduce it. Eliminates the erratic score jumps common in LLM-based tools.\n\n• Component Subscores:\n  - Wi-Fi: 0 to 30 points (Encryption, Evil Twin check)\n  - URL/QR: 0 to 30 points (Homoglyphs, VirusTotal consensus)\n  - Permissions: 0 to 20 points (Hazardous clusters)\n  - System: 0 to 20 points (OS security patch level)"
    tf14_1.paragraphs[0].font.size = Pt(12)
    tf14_1.paragraphs[0].font.color.rgb = TEXT_MUTED
    tf14_1.paragraphs[0].font.name = "Segoe UI"

    add_card(s14, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.3), title="Grounded RAG AI Explainer", accent_color=CYAN)
    tb14_2 = s14.shapes.add_textbox(Inches(7.1), Inches(2.3), Inches(5.1), Inches(4.3))
    tf14_2 = tb14_2.text_frame
    tf14_2.word_wrap = True
    tf14_2.paragraphs[0].text = "• Structured Citations:\nExplanations cite verified internal knowledge articles ([KB-001] to [KB-005]) to eliminate hallucination.\n\n• Prompt-Injection Defenses:\nInput strings are sanitized to prevent user payloads from hijacking the AI system prompt.\n\n• Full Offline Fallback:\nIf network connectivity is lost, the system serves local pre-compiled plain-language mitigation playbooks."
    tf14_2.paragraphs[0].font.size = Pt(12)
    tf14_2.paragraphs[0].font.color.rgb = TEXT_MUTED
    tf14_2.paragraphs[0].font.name = "Segoe UI"

    add_speaker_notes(s14, "On this slide, you see our deterministic scoring engine. We purposely avoided using generative AI to produce the security score because LLMs cannot guarantee mathematical monotonicity. Instead, we use a 30/30/20/20 weighted model. Generative AI is used strictly in our RAG Explainer, where it is constrained by prompt guards and must cite our verified knowledge base articles, providing reliable and hallucination-free educational feedback.")

    # ==========================================
    # SLIDE 15: EXPERIMENTAL SETUP & TESTING RESULTS
    # ==========================================
    s15 = prs.slides.add_slide(blank_layout)
    set_bg(s15)
    add_header(s15, "Experimental Setup & Automated Test Results")

    add_card(s15, Inches(0.8), Inches(1.6), Inches(11.7), Inches(5.3), title="25 Automated Jest Test Suites (116 Tests Passing · 100% Pass Rate)", accent_color=MINT)
    tb15 = s15.shapes.add_textbox(Inches(1.1), Inches(2.3), Inches(11.1), Inches(4.3))
    tf15 = tb15.text_frame
    tf15.word_wrap = True
    p15 = tf15.paragraphs[0]
    p15.text = "• TC-01 (SSRF Guard & Internal IP Defense):\n  Input: http://169.254.169.254/latest/meta-data | Target: AWS Metadata Endpoint\n  Expected: HTTP 400 Bad Request; internal socket dropped\n  Actual: Blocked with 'SSRF Target Blocked: Private/Loopback IP Forbidden' | Status: PASS [100%]\n\n• TC-02 (Punycode Homoglyph Detection):\n  Input: https://pаypal.com/signin (Cyrillic 'а' U+0430)\n  Expected: Decode to xn--pypal-4ve.com; trigger brand spoofing alert\n  Actual: Homoglyph identified; risk level set to HIGH | Status: PASS [100%]\n\n• TC-03 (Wi-Fi Sentinel Cipher Audit):\n  Input: 802.11 Open Beacon (No WPA2/WPA3 encryption)\n  Expected: Flag as unencrypted; warn of packet sniffing risk\n  Actual: Open cipher flagged; MitM risk index computed | Status: PASS [100%]\n\n• TC-04 (Optical QR Sandbox Intercept):\n  Input: QR barcode containing malicious APK download link\n  Expected: Trap payload in memory; abort automated OS browser launch\n  Actual: Deep link intercepted in sandbox modal; browser launch aborted | Status: PASS [100%]"
    p15.font.size = Pt(11)
    p15.font.color.rgb = TEXT_MUTED
    p15.font.name = "Segoe UI"

    add_speaker_notes(s15, "We subjected Cyber Companion to extensive testing. Our automated test suite includes 116 tests across 25 suites. As shown in the validation table, our SSRF defense successfully intercepted internal metadata probes, our homoglyph detector identified Cyrillic spoofing in under 2 milliseconds, and our QR sandbox prevented untrusted APK droppers from launching on the device.")

    # ==========================================
    # SLIDE 16: PERFORMANCE ANALYSIS
    # ==========================================
    s16 = prs.slides.add_slide(blank_layout)
    set_bg(s16)
    add_header(s16, "Performance Benchmarks & Discussion")

    metrics = [
        ("Cached Domain Latency", "18 ms", "Evaluated from MongoDB Atlas TTL cache; 24-hour TTL eliminates redundant network overhead.", CYAN),
        ("Live Consensus Query", "240 ms", "Average external response across VirusTotal, Google Safe Browsing, and URLhaus APIs.", EMERALD),
        ("Three.js Canvas Framerate", "58–60 FPS", "Consistent rendering stability on mobile WebGL with zero frame stutter during touch gestures.", MINT),
        ("Battery Conservation", "74% Less Drain", "Pre-connection model consumes 74% less battery than persistent VPN-based network filters.", AMBER)
    ]

    for idx, (title, val, desc, color) in enumerate(metrics):
        x = Inches(0.8 + (idx % 2) * 6.0)
        y = Inches(1.6 + (idx // 2) * 2.7)
        add_card(s16, x, y, Inches(5.7), Inches(2.4), title=title, accent_color=color)
        tb = s16.shapes.add_textbox(x + Inches(0.3), y + Inches(0.65), Inches(5.1), Inches(1.5))
        tf = tb.text_frame
        tf.word_wrap = True
        p_v = tf.paragraphs[0]
        p_v.text = val
        p_v.font.size = Pt(22)
        p_v.font.bold = True
        p_v.font.color.rgb = color
        p_v.font.name = "Segoe UI"
        
        p_d = tf.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = TEXT_MUTED
        p_d.font.name = "Segoe UI"

    add_speaker_notes(s16, "Performance analysis demonstrates the efficiency of our architecture. Because our MongoDB cache stores verified domains with a 24-hour TTL, over 80% of routine domain checks return in just 18 milliseconds. The Three.js 3D canvas runs at a stable 60 frames per second with minimal memory usage, proving that rich visual security tools do not need to drain device battery.")

    # ==========================================
    # SLIDE 17: ADVANTAGES & REAL-WORLD APPLICATIONS
    # ==========================================
    s17 = prs.slides.add_slide(blank_layout)
    set_bg(s17)
    add_header(s17, "Advantages & Real-World Deployments")

    add_card(s17, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), title="Core Architectural Advantages", accent_color=EMERALD)
    tb17_1 = s17.shapes.add_textbox(Inches(1.1), Inches(2.3), Inches(5.0), Inches(4.3))
    tf17_1 = tb17_1.text_frame
    tf17_1.word_wrap = True
    tf17_1.paragraphs[0].text = "• Proactive Defense:\nIntercepts attacks before network handshake or file download occurs.\n\n• Zero Privacy Compromise:\nZero PII exfiltration; on-device manifest auditing preserves user privacy.\n\n• Educational Explainability:\nConverts technical security jargon into clear, actionable advice.\n\n• Zero Hardware Cost:\nRuns on existing Android and iOS smartphones and web browsers."
    tf17_1.paragraphs[0].font.size = Pt(12)
    tf17_1.paragraphs[0].font.color.rgb = TEXT_MUTED
    tf17_1.paragraphs[0].font.name = "Segoe UI"

    add_card(s17, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.3), title="Real-World Deployment Scenarios", accent_color=CYAN)
    tb17_2 = s17.shapes.add_textbox(Inches(7.1), Inches(2.3), Inches(5.1), Inches(4.3))
    tf17_2 = tb17_2.text_frame
    tf17_2.word_wrap = True
    tf17_2.paragraphs[0].text = "• Public QR Scans (Quishing Defense):\nProtects citizens scanning parking, restaurant, and municipal payment QR codes.\n\n• Safe Public Wi-Fi Connectivity:\nGuarantees safe usage of airport, hotel, and café public networks for remote workers.\n\n• Institutional Digital Literacy:\nActs as an interactive training tool for colleges, universities, and enterprise cybersecurity onboarding."
    tf17_2.paragraphs[0].font.size = Pt(12)
    tf17_2.paragraphs[0].font.color.rgb = TEXT_MUTED
    tf17_2.paragraphs[0].font.name = "Segoe UI"

    add_speaker_notes(s17, "The real-world applications of Cyber Companion are immediate. For everyday consumers, it prevents financial losses caused by tampered QR payment codes. For professionals and students connecting to untrusted campus or café Wi-Fi, it stops packet sniffing and session hijacking before it starts. It acts as both a shield and a personal security mentor.")

    # ==========================================
    # SLIDE 18: CONCLUSION
    # ==========================================
    s18 = prs.slides.add_slide(blank_layout)
    set_bg(s18)
    add_header(s18, "Conclusion & Project Summary")

    add_card(s18, Inches(0.8), Inches(1.6), Inches(11.7), Inches(5.3), title="Key Project Achievements", accent_color=EMERALD)
    tb18 = s18.shapes.add_textbox(Inches(1.1), Inches(2.3), Inches(11.1), Inches(4.3))
    tf18 = tb18.text_frame
    tf18.word_wrap = True
    p18 = tf18.paragraphs[0]
    p18.text = "• Successful Paradigm Shift:\nDemonstrated that mobile security can successfully shift from reactive post-infection disk scanning to proactive, pre-connection awareness without compromising battery or device responsiveness.\n\n• Comprehensive Defense Perimeter:\nDelivered a fully functional cross-platform system combining a Three.js 3D Cyber Shield, an Optical QR Quishing Sandbox, a Pre-Connection Wi-Fi Sentinel, and an On-Device Permission Auditor.\n\n• Enterprise-Grade Gateway:\nEngineered an Express/TypeScript threat gateway with complete SSRF loopback immunity and multi-engine threat consensus.\n\n• Verified Reliability:\nValidated through 25 Jest automated test suites comprising 116 tests with a 100% pass rate and zero critical security vulnerabilities.\n\n• Core Takeaway: 'Check First':\nEmpowers non-technical users to navigate untrusted networks, physical QR codes, and digital links safely."
    p18.font.size = Pt(12)
    p18.font.color.rgb = TEXT_MUTED
    p18.font.name = "Segoe UI"

    add_speaker_notes(s18, "In conclusion, Cyber Companion proves that mobile cybersecurity does not have to be reactive, complex, or privacy-invasive. By combining client-side sandboxing, deterministic mathematics, and modern web visualization, we provide users with the tools and understanding needed to protect their digital lives. The project has been fully realized, validated through 116 automated tests, and successfully deployed as a native Android APK and web application.")

    # ==========================================
    # SLIDE 19: FUTURE SCOPE & REFERENCES
    # ==========================================
    s19 = prs.slides.add_slide(blank_layout)
    set_bg(s19)
    add_header(s19, "Future Scope & Key Academic References")

    add_card(s19, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.3), title="Future Technical Extensions", accent_color=CYAN)
    tb19_1 = s19.shapes.add_textbox(Inches(1.1), Inches(2.3), Inches(5.0), Inches(4.3))
    tf19_1 = tb19_1.text_frame
    tf19_1.word_wrap = True
    tf19_1.paragraphs[0].text = "• Bluetooth Low Energy (BLE) Sentinel:\nDetect rogue Apple AirTags, Tile trackers, and unauthorized BLE tracking beacons in the physical vicinity.\n\n• On-Device NLP SMS Spam Classifier:\nDeploy a lightweight quantized transformer model to detect smishing threats locally without cloud exfiltration.\n\n• Decentralized Threat Feeds:\nEnable zero-knowledge cryptographic crowdsourcing of newly discovered malicious QR and Wi-Fi threats."
    tf19_1.paragraphs[0].font.size = Pt(12)
    tf19_1.paragraphs[0].font.color.rgb = TEXT_MUTED
    tf19_1.paragraphs[0].font.name = "Segoe UI"

    add_card(s19, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.3), title="Key References", accent_color=MINT)
    tb19_2 = s19.shapes.add_textbox(Inches(7.1), Inches(2.3), Inches(5.1), Inches(4.3))
    tf19_2 = tb19_2.text_frame
    tf19_2.word_wrap = True
    tf19_2.paragraphs[0].text = "1. OWASP Foundation, 'OWASP Mobile Top 10 Security Vulnerabilities,' OWASP Project Report, 2024.\n\n2. A. Felt et al., 'Android Permissions: User Attention, Comprehension, and Behavior,' in Proc. IEEE Symposium on Security and Privacy (S&P), 2012.\n\n3. W. Enck et al., 'TaintDroid: An Information-Flow Tracking System for Real-Time Privacy Monitoring on Smartphones,' ACM Trans. Comput. Syst., 2014.\n\n4. VirusTotal & Google Safe Browsing, 'API v3 & v4 Specifications and Architecture Guides,' 2025.\n\n5. Node.js & React Native Documentation, 'Secure Architecture and Hardware Bridge Guides,' 2026."
    tf19_2.paragraphs[0].font.size = Pt(10)
    tf19_2.paragraphs[0].font.color.rgb = TEXT_MUTED
    tf19_2.paragraphs[0].font.name = "Segoe UI"

    add_speaker_notes(s19, "Looking forward, our architecture can naturally expand to include Bluetooth Low Energy tracking tag detection and on-device natural language SMS spam filtering. Thank you for your time and attention. I am now ready to take any questions from the panel.")

    output_path = "Cyber_Companion_Paper_Presentation_19_Slides.pptx"
    prs.save(output_path)
    print(f"Presentation saved successfully at: {output_path}")

if __name__ == "__main__":
    create_presentation()
