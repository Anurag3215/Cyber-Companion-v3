import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # 16:9 widescreen
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_layout = prs.slide_layouts[6]

    # Colors
    BG_DARK = RGBColor(11, 17, 33)        # #0B1121 deep slate
    CARD_BG = RGBColor(18, 28, 51)        # #121C33 glass card
    CARD_BORDER = RGBColor(37, 56, 92)    # #25385C glass border
    EMERALD = RGBColor(16, 185, 129)      # #10B981 primary accent
    MINT = RGBColor(52, 211, 153)         # #34D399 light accent
    CYAN = RGBColor(56, 189, 248)         # #38BDF8 secondary accent
    CORAL = RGBColor(244, 63, 94)         # #F43F5E warning/accent
    TEXT_WHITE = RGBColor(248, 250, 252)  # #F8FAFC
    TEXT_MUTED = RGBColor(148, 163, 184)  # #94A3B8
    TEXT_DIM = RGBColor(100, 116, 139)    # #64748B

    def set_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_DARK
        bg.line.fill.background()
        return bg

    def add_header(slide, title_text, category_text="CYBER COMPANION v3 · DEFENSE SENTINEL"):
        # Category pill/subtitle
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

        # Main Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.72), Inches(11.7), Inches(0.7))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = 0
        p_t = tf_t.paragraphs[0]
        p_t.text = title_text
        p_t.font.size = Pt(24)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_WHITE
        p_t.font.name = "Segoe UI"

    def add_card(slide, left, top, width, height, title=None, accent_color=None):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = accent_color if accent_color else CARD_BORDER
        card.line.width = Pt(1.2)
        card.adjustments[0] = 0.05

        if title:
            tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.2), width - Inches(0.4), Inches(0.4))
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

    # ==========================================
    # SLIDE 1: Title & Overview
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_bg(s1)

    # Accent decorative top bar
    bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.0), Inches(2.2), Inches(0.06))
    bar.fill.solid()
    bar.fill.fore_color.rgb = EMERALD
    bar.line.fill.background()

    tb = s1.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(11.7), Inches(2.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.text = "CYBER COMPANION v3"
    p1.font.size = Pt(40)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_WHITE
    p1.font.name = "Segoe UI"

    p2 = tf.add_paragraph()
    p2.text = "Intelligent Zero-Trust Threat Defense Sentinel for Ordinary Citizens"
    p2.font.size = Pt(20)
    p2.font.color.rgb = MINT
    p2.font.name = "Segoe UI"
    p2.space_before = Pt(8)

    p3 = tf.add_paragraph()
    p3.text = "Bridging the Gap Between Low-Level Telemetry and Citizen-Centric Cyber Safety"
    p3.font.size = Pt(14)
    p3.font.color.rgb = TEXT_MUTED
    p3.font.name = "Segoe UI"
    p3.space_before = Pt(6)

    # Info Cards
    card1 = add_card(s1, Inches(0.8), Inches(4.0), Inches(3.6), Inches(2.6), "PROJECT DOMAIN", CYAN)
    tb1 = s1.shapes.add_textbox(Inches(1.0), Inches(4.6), Inches(3.2), Inches(1.8))
    tf1 = tb1.text_frame
    tf1.word_wrap = True
    p = tf1.paragraphs[0]
    p.text = "• Mobile Cybersecurity & On-Device Telemetry\n• Deterministic Zero-Trust Scoring\n• Grounded RAG Threat Intelligence\n• Human-Centered UI/UX Engineering"
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE
    p.font.name = "Segoe UI"

    card2 = add_card(s1, Inches(4.8), Inches(4.0), Inches(3.6), Inches(2.6), "TECHNICAL FOUNDATION", EMERALD)
    tb2 = s1.shapes.add_textbox(Inches(5.0), Inches(4.6), Inches(3.2), Inches(1.8))
    tf2 = tb2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "• Frontend: React Native & Expo SDK 57\n• Backend: Node.js, Express, Helmet, CORS\n• Language: 100% Strict TypeScript\n• Testing: Jest (25 Suites, 118 Unit Tests)\n• Hardware: Native 802.11 & Camera APIs"
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE
    p.font.name = "Segoe UI"

    card3 = add_card(s1, Inches(8.8), Inches(4.0), Inches(3.7), Inches(2.6), "REVIEW DETAILS", MINT)
    tb3 = s1.shapes.add_textbox(Inches(9.0), Inches(4.6), Inches(3.3), Inches(1.8))
    tf3 = tb3.text_frame
    tf3.word_wrap = True
    p = tf3.paragraphs[0]
    p.text = "• Candidate: Arun V.\n• Guide: Department Mentor & Guide\n• Department: Computer Science & Engineering\n• Review Date: October 22, 2026\n• Live Hardware Status: Connected & Verified"
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE
    p.font.name = "Segoe UI"

    s1.notes_slide.notes_text_frame.text = (
        "Good morning respected guide and members of the review committee. Today, I am presenting "
        "'Cyber Companion v3', an intelligent zero-trust mobile sentinel designed to protect non-technical "
        "citizens from modern cyberattacks like rogue Wi-Fi, phishing hyperlinks, malicious QR codes, "
        "and invasive app permissions."
    )

    # ==========================================
    # SLIDE 2: Motivation & Background
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_bg(s2)
    add_header(s2, "Motivation & The Citizen Security Chasm", "PROBLEM CONTEXT")

    # 3 Column Cards
    c1 = add_card(s2, Inches(0.8), Inches(1.6), Inches(3.7), Inches(5.2), "THE ESCALATING THREAT", CORAL)
    tbc1 = s2.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(3.3), Inches(4.3))
    tfc1 = tbc1.text_frame
    tfc1.word_wrap = True
    p = tfc1.paragraphs[0]
    p.text = (
        "• Everyday Citizens Targeted:\n"
        "  Attacks like QR phishing ('quishing'), deceptive links, and rogue Wi-Fi hotspots directly target non-technical citizens.\n\n"
        "• Invisible Attack Vectors:\n"
        "  Missing 802.11w Protected Management Frames (PMF) permit silent deauthentication jamming.\n\n"
        "• Zero Visual Clues:\n"
        "  Homoglyph domain spoofs look identical to authentic portals on high-DPI screens."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE

    c2 = add_card(s2, Inches(4.8), Inches(1.6), Inches(3.7), Inches(5.2), "THE USABILITY CHASM", CYAN)
    tbc2 = s2.shapes.add_textbox(Inches(5.0), Inches(2.2), Inches(3.3), Inches(4.3))
    tfc2 = tbc2.text_frame
    tfc2.word_wrap = True
    p = tfc2.paragraphs[0]
    p.text = (
        "• Enterprise Tools Fail Citizens:\n"
        "  Tools like Wireshark, Burp Suite, and Nmap are built for certified analysts, not ordinary smartphone users.\n\n"
        "• Jargon Overload:\n"
        "  Displaying 'RFC1918 private loopback' or 'SAE 4-way handshake' alienates users.\n\n"
        "• Inactionable Fear:\n"
        "  Alerts fail to answer the citizen's only question: 'Am I safe, and what should I do right now?'"
    )
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE

    c3 = add_card(s2, Inches(8.8), Inches(1.6), Inches(3.7), Inches(5.2), "THE PRIVACY DILEMMA", MINT)
    tbc3 = s2.shapes.add_textbox(Inches(9.0), Inches(2.2), Inches(3.3), Inches(4.3))
    tfc3 = tbc3.text_frame
    tfc3.word_wrap = True
    p = tfc3.paragraphs[0]
    p.text = (
        "• Anti-Virus Privacy Violations:\n"
        "  Commercial antivirus suites regularly harvest browsing logs, app lists, and Wi-Fi SSIDs to external telemetry servers.\n\n"
        "• Zero-Trust Mandate:\n"
        "  A security tool must never become a spyware vector itself.\n\n"
        "• Our Engineering Answer:\n"
        "  Zero-PII local evaluation combined with mathematical determinism."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE

    s2.notes_slide.notes_text_frame.text = (
        "While enterprise cybersecurity tools are powerful, they are completely inaccessible to everyday smartphone users. "
        "Furthermore, many commercial scanners violate the very privacy they claim to protect by uploading sensitive personal data "
        "to remote servers. Cyber Companion was built to solve both the usability and privacy problems simultaneously."
    )

    # ==========================================
    # SLIDE 3: Problem Statement & Engineering Objectives
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    set_bg(s3)
    add_header(s3, "Problem Statement & Core Engineering Objectives", "OBJECTIVES")

    # Left Box: Problem Statement
    add_card(s3, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2), "FORMAL PROBLEM STATEMENT", CYAN)
    tb = s3.shapes.add_textbox(Inches(1.1), Inches(2.3), Inches(5.0), Inches(4.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "\"To architect a private, on-device mobile defense system that passively and actively evaluates ambient cyber risks across Wi-Fi, URLs, QR codes, and application permissions, converting complex cryptographic parameters into an intuitive 0–100 defense posture without transmitting user PII.\""
    )
    p.font.size = Pt(15)
    p.font.italic = True
    p.font.color.rgb = TEXT_WHITE

    p2 = tf.add_paragraph()
    p2.text = (
        "\nCore Research Question:\n"
        "How can low-level 802.11 cryptographic state, optical camera payloads, and Android sensor matrices be evaluated deterministically in real-time on consumer smartphones while keeping user private data 100% on-device?"
    )
    p2.font.size = Pt(13)
    p2.font.color.rgb = TEXT_MUTED
    p2.space_before = Pt(14)

    # Right Box: 5 Key Engineering Objectives
    add_card(s3, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.2), "FIVE CORE PILLARS", EMERALD)
    tb = s3.shapes.add_textbox(Inches(7.1), Inches(2.2), Inches(5.2), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "1. ZERO MOCK DATA\n"
        "   Query real physical 802.11 Wi-Fi radios and native camera hardware. No hardcoded or fabricated telemetry.\n\n"
        "2. DETERMINISTIC RISK SCORING\n"
        "   Pure mathematical, monotonic scoring (0–100) in packages/scoring-core. Never hallucinated by generative AI.\n\n"
        "3. ZERO-PII LOCAL AUDIT & SSRF GUARD\n"
        "   Block RFC1918 loopback pivots and evaluate app sensor permissions purely on the client.\n\n"
        "4. APPLE-INSPIRED LIQUID GLASS UI\n"
        "   Frosted translucency, floating nav, and plain-language citizen guidance at 60 FPS.\n\n"
        "5. RIGOROUS AUTOMATED VERIFICATION\n"
        "   25 test suites, 118 unit and penetration tests, 100% pass rate."
    )
    p.font.size = Pt(11.5)
    p.font.color.rgb = TEXT_WHITE

    s3.notes_slide.notes_text_frame.text = (
        "Our objective was not to build a toy demonstration, but an industrial-grade system adhering to strict engineering constraints: "
        "100% on-device privacy, zero fabricated mock data, pure mathematical risk calculation, and an interface that any citizen can understand."
    )

    # ==========================================
    # SLIDE 4: System Architecture
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_bg(s4)
    add_header(s4, "System Architecture & Monorepo Design", "ARCHITECTURE")

    # 3 Tier Cards
    # Tier 1: Client
    add_card(s4, Inches(0.8), Inches(1.6), Inches(3.7), Inches(5.2), "CLIENT TIER (apps/mobile)", CYAN)
    tb = s4.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(3.3), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "• Liquid Glass UI System:\n"
        "  - GlassCard, FloatingNav, AmbientGlow\n"
        "  - Dual Theme Engine (Light / Cyber Dark)\n\n"
        "• Passive Airspace Scanner:\n"
        "  - Live 802.11 Beacon Telemetry\n"
        "  - WPA3-SAE & 802.11w PMF Check\n\n"
        "• Optical QR Sanitizer:\n"
        "  - Isolated in-memory sandbox\n"
        "  - Prevents auto-execution exploits\n\n"
        "• App Privacy Auditor:\n"
        "  - Local sensor matrix evaluation\n"
        "  - Zero PII leaves the smartphone"
    )
    p.font.size = Pt(11.5)
    p.font.color.rgb = TEXT_WHITE

    # Tier 2: Core Scoring
    add_card(s4, Inches(4.8), Inches(1.6), Inches(3.7), Inches(5.2), "SCORING CORE (packages/scoring-core)", EMERALD)
    tb = s4.shapes.add_textbox(Inches(5.0), Inches(2.2), Inches(3.3), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "• Monotonic Mathematical Engine:\n"
        "  - Pure TypeScript, zero I/O side effects\n"
        "  - Sub-millisecond compute latency\n\n"
        "• Rigorous Calibrated Functions:\n"
        "  - Wi-Fi risk calculation formula\n"
        "  - URL heuristic score evaluation\n"
        "  - QR payload risk mapping\n"
        "  - App hygiene index\n\n"
        "• Provable Invariants:\n"
        "  - Monotonicity: threat strictly lowers defense\n"
        "  - Strict bounds: 0 <= Score <= 100\n"
        "  - 100% Jest test coverage"
    )
    p.font.size = Pt(11.5)
    p.font.color.rgb = TEXT_WHITE

    # Tier 3: Gateway
    add_card(s4, Inches(8.8), Inches(1.6), Inches(3.7), Inches(5.2), "GATEWAY TIER (apps/api)", MINT)
    tb = s4.shapes.add_textbox(Inches(9.0), Inches(2.2), Inches(3.3), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "• Hardened Express Service:\n"
        "  - Helmet, Strict CORS, Rate Limiting\n"
        "  - Port 5000 / Reverse ADB Tunnel\n\n"
        "• SSRF Guard Engine:\n"
        "  - Blocks RFC1918 private ranges\n"
        "  - Blocks 127.0.0.1 and link-local IP\n"
        "  - Prevents internal LAN pivoting\n\n"
        "• Grounded AI Explainer (RAG):\n"
        "  - Anchored to curated KB-001..KB-008\n"
        "  - Zero hallucination guarantee\n"
        "  - Prompt injection sanitizer"
    )
    p.font.size = Pt(11.5)
    p.font.color.rgb = TEXT_WHITE

    s4.notes_slide.notes_text_frame.text = (
        "Here is our modular monorepo architecture. Notice that the core scoring engine is completely isolated from external dependencies. "
        "It takes low-level vectors from the client and computes scores deterministically. The backend API handles threat intelligence lookups "
        "behind an SSRF Guard and powers the AI Threat Explainer through a grounded RAG knowledge engine."
    )

    # ==========================================
    # SLIDE 5: Module 1 - Wi-Fi Airspace Scanner
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    set_bg(s5)
    add_header(s5, "Module 1: Real 802.11 Airspace Wi-Fi Scanner", "AIRSPACE RADAR")

    # Left: Hardware Telemetry
    add_card(s5, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2), "PASSIVE 802.11 BEACON AUDITING", CYAN)
    tb = s5.shapes.add_textbox(Inches(1.1), Inches(2.2), Inches(5.0), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "• Zero Mock Airspace Guarantee:\n"
        "  Interfaces directly with device Wi-Fi radio to scan real local SSIDs in ambient space.\n\n"
        "• Cryptographic Standard Detection:\n"
        "  - WPA3-SAE (Simultaneous Authentication of Equals)\n"
        "  - WPA2-Personal (PSK / CCMP)\n"
        "  - Legacy WEP / Insecure Open Hotspots\n\n"
        "• Protected Management Frames (802.11w PMF):\n"
        "  Inspects beacon capabilities for PMF enforcement. Without PMF, attackers can easily launch deauthentication frame floods to kick devices off the network."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE

    # Right: Threat Vectors
    add_card(s5, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.2), "IDENTIFIED ATTACK VECTORS", CORAL)
    tb = s5.shapes.add_textbox(Inches(7.1), Inches(2.2), Inches(5.2), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "• Evil Twin Rogue Hotspots:\n"
        "  Detects unauthorized open access points broadcasting identical SSIDs with abnormal BSSID and signal profiles.\n\n"
        "• Captive Portal Traps:\n"
        "  Flags unencrypted public networks that intercept traffic before external DNS handshakes.\n\n"
        "• Deauthentication Jamming Risk:\n"
        "  Maps missing PMF flags directly to high risk: informs citizen if network is prone to packet disconnection attacks.\n\n"
        "• Deterministic Wi-Fi Risk Output:\n"
        "  Produces 0–100 monotonic risk verdict with human-readable citizen recommendations."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE

    s5.notes_slide.notes_text_frame.text = (
        "Our Wi-Fi module queries live broadcast beacons in the physical airspace. Rather than simply showing if a network has a password, "
        "it inspects 802.11w Protected Management Frames. This tells the user whether an attacker nearby can force their device offline using deauth packets."
    )

    # ==========================================
    # SLIDE 6: Module 2 - Live Web Guard & SSRF Protection
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_bg(s6)
    add_header(s6, "Module 2: Live Web Guard & SSRF Protection", "HYPERLINK DEFENSE")

    # Left: SSRF Guard
    add_card(s6, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2), "SSRF & PRIVATE NETWORK SHIELD", CORAL)
    tb = s6.shapes.add_textbox(Inches(1.1), Inches(2.2), Inches(5.0), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "• Server-Side Request Forgery Defense:\n"
        "  Attackers often craft links to pivot into private residential/office network infrastructure.\n\n"
        "• Strict RFC1918 Blocking Engine:\n"
        "  - 10.0.0.0/8 (Class A Private)\n"
        "  - 172.16.0.0/12 (Class B Private)\n"
        "  - 192.168.0.0/16 (Home Gateway / Router Subnets)\n\n"
        "• Loopback & Cloud Metadata Interception:\n"
        "  Blocks 127.0.0.1, localhost, and AWS/GCP metadata address 169.254.169.254 immediately with CRITICAL 98/100 risk."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE

    # Right: Homoglyphs & Phishing
    add_card(s6, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.2), "DECEPTION HEURISTICS & PHISHING", CYAN)
    tb = s6.shapes.add_textbox(Inches(7.1), Inches(2.2), Inches(5.2), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "• Homoglyph & Punycode Deobfuscation:\n"
        "  Identifies Cyrillic, Greek, and visually spoofed Unicode characters disguised as legitimate financial institutions.\n\n"
        "• High-Risk TLD & Path Analysis:\n"
        "  Inspects newly registered or high-abuse TLDs (.xyz, .top, .cc, .buzz) combined with credential-harvesting paths (/login, /verify, /wallet).\n\n"
        "• Cleartext Protocol Warnings:\n"
        "  Warns against unencrypted http:// transmissions before users can enter sensitive credentials.\n\n"
        "• 1-Tap 'Ask AI Explainer':\n"
        "  Seamlessly links scan result into RAG explainer for contextual education."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE

    s6.notes_slide.notes_text_frame.text = (
        "When a user inputs or clicks an unfamiliar link, our Web Guard evaluates it inside an isolated sandbox. "
        "It features an SSRF Guard that detects attempts to target internal routers like 192.168.1.1 or loopbacks, immediately blocking malicious pivots."
    )

    # ==========================================
    # SLIDE 7: Module 3 - QR Optical Intent Sanitizer
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    set_bg(s7)
    add_header(s7, "Module 3: Sandboxed QR Optical Intent Sanitizer", "OPTICAL FIREWALL")

    # Left: The Quishing Threat
    add_card(s7, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2), "THE DANGER: AUTO-EXECUTION ('QUISHING')", CORAL)
    tb = s7.shapes.add_textbox(Inches(1.1), Inches(2.2), Inches(5.0), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "• Default Camera Apps are Blind:\n"
        "  Stock smartphone camera apps automatically parse and execute QR intents without vetting payload safety.\n\n"
        "• Dangerous Attack Vectors:\n"
        "  - Auto-opening credential phishing sites\n"
        "  - Auto-connecting to unencrypted rogue Wi-Fi (WIFI:S:...;)\n"
        "  - Auto-dialing premium rate USSD numbers (tel:*21*...)\n"
        "  - Silent SMS authorization requests\n\n"
        "• Rapid Real-World Exploitation:\n"
        "  Fraudulent stickers pasted on public parking meters, restaurant menus, and payment stands."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE

    # Right: The Cyber Companion Solution
    add_card(s7, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.2), "CYBER COMPANION OPTICAL FIREWALL", EMERALD)
    tb = s7.shapes.add_textbox(Inches(7.1), Inches(2.2), Inches(5.2), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "• In-Memory Zero-Execution Sandbox:\n"
        "  Raw barcode data is captured in an isolated memory buffer and NEVER auto-executed.\n\n"
        "• Intent Parsing & Classification:\n"
        "  Deconstructs payload into URL, Wi-Fi config, SMS, or Raw Text with strict character sanitization.\n\n"
        "• Optical Laser Viewfinder:\n"
        "  Built with Expo Camera, featuring target alignment reticle, torch toggle, and camera flip.\n\n"
        "• Informed Citizen Consent:\n"
        "  Citizen is presented with decoded destination and threat score before any system action occurs."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE

    s7.notes_slide.notes_text_frame.text = (
        "Standard mobile camera apps automatically execute whatever payload is inside a QR code. "
        "Cyber Companion acts as a protective optical firewall. It intercepts raw QR data, parses it within an isolated memory sandbox, "
        "and warns the user before any system action can take place."
    )

    # ==========================================
    # SLIDE 8: Module 4 - On-Device App Privacy Auditor
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    set_bg(s8)
    add_header(s8, "Module 4: On-Device App Privacy Auditor", "PRIVACY AUDITOR")

    # Left: Zero-PII
    add_card(s8, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2), "ZERO-PII SENSOR EVALUATION", MINT)
    tb = s8.shapes.add_textbox(Inches(1.1), Inches(2.2), Inches(5.0), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "• Strict Zero-Telemetry Architecture:\n"
        "  Application names, package identifiers, and permission profiles are audited strictly on the local device.\n\n"
        "• Privacy Assurance:\n"
        "  Zero package inventory telemetry is ever transmitted to the server or third parties.\n\n"
        "• Compliance with Play Store & OWASP MASVS:\n"
        "  Follows strict least-privilege principles, eliminating unnecessary QUERY_ALL_PACKAGES background snooping."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE

    # Right: High-Risk Permission Matrix
    add_card(s8, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.2), "RISK MATRIX & ONE-TAP ACTION", CYAN)
    tb = s8.shapes.add_textbox(Inches(7.1), Inches(2.2), Inches(5.2), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "• High-Risk Sensor Matrix:\n"
        "  - Audio Eavesdropping: RECORD_AUDIO\n"
        "  - Precision Tracking: ACCESS_FINE_LOCATION\n"
        "  - Visual Surveillance: CAMERA\n"
        "  - Screen Hijacking: SYSTEM_ALERT_WINDOW\n\n"
        "• App Hygiene Index (0–100):\n"
        "  Computes an aggregate privacy posture score based on overprivileged app counts.\n\n"
        "• Actionable 1-Tap Revocation:\n"
        "  Deep-links directly to native Android OS Application Permission Settings for instant privilege revocation."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE

    s8.notes_slide.notes_text_frame.text = (
        "Our Privacy Auditor evaluates dangerous permission combinations like flashlight or calculator apps requesting background microphone "
        "or precise GPS access. Crucially, this audit is performed 100% locally with zero external network transmission."
    )

    # ==========================================
    # SLIDE 9: Mathematical Core - Scoring Engine
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    set_bg(s9)
    add_header(s9, "Mathematical Core: Deterministic Scoring Engine", "MATHEMATICAL RIGOR")

    # Left: Why Math vs LLM
    add_card(s9, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2), "WHY MATH OVER GENERATIVE AI SCORING?", CORAL)
    tb = s9.shapes.add_textbox(Inches(1.1), Inches(2.2), Inches(5.0), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "• The Flaw of LLM Security Scores:\n"
        "  Generative models are probabilistic. Feeding the same Wi-Fi beacon twice might produce an 80 on Monday and a 45 on Tuesday.\n\n"
        "• Zero Hallucination Risk:\n"
        "  Deterministic math guarantees that a rogue access point with missing encryption will ALWAYS yield an identical, predictable score.\n\n"
        "• Sub-Millisecond Execution:\n"
        "  Computes in <1 ms on device, with zero network lag or cloud API billing dependencies."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE

    # Right: Formula & Properties
    add_card(s9, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.2), "MONOTONIC RISK FORMULATION", EMERALD)
    tb = s9.shapes.add_textbox(Inches(7.1), Inches(2.2), Inches(5.2), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "• Monotonic Risk Equation:\n"
        "  Risk_total = min(100, Σ (w_i · V_i) + Penalty_critical)\n\n"
        "• Defense Posture Conversion:\n"
        "  Defense Score = 100 - Risk_total\n\n"
        "• Strict Monotonicity Invariant:\n"
        "  Any detected vulnerability V_i >= 0 strictly INCREASES Risk and strictly LOWERS Defense Score.\n\n"
        "• Critical Penalty Overrides:\n"
        "  Critical threats (e.g., SSRF loopback or open rogue hotspot) trigger an immediate risk floor, preventing safe factors from masking critical danger."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE

    s9.notes_slide.notes_text_frame.text = (
        "A critical design choice in Cyber Companion is our deterministic scoring engine. We refused to use generative AI for calculating risk scores "
        "because security scores must be reproducible, mathematically sound, and immune to hallucinations. The engine uses a monotonic weighted function "
        "where threats strictly decrease the defense score."
    )

    # ==========================================
    # SLIDE 10: AI Threat Explainer & Grounded RAG
    # ==========================================
    s10 = prs.slides.add_slide(blank_layout)
    set_bg(s10)
    add_header(s10, "AI Threat Explainer & Grounded RAG Pipeline", "INTELLIGENCE")

    # Left: Dual Layer
    add_card(s10, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2), "DUAL-LAYER COGNITIVE DEFENSE", CYAN)
    tb = s10.shapes.add_textbox(Inches(1.1), Inches(2.2), Inches(5.0), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "• Division of Responsibility:\n"
        "  - Mathematical Engine determines WHAT the threat score is.\n"
        "  - Grounded Explainer articulates WHY it matters in plain citizen language.\n\n"
        "• The Flickering Loop Resolution:\n"
        "  Previous versions suffered state re-render flickering; engineered stable async query orchestration with active request deduplication.\n\n"
        "• Prompt Injection Hardening:\n"
        "  Sanitizes input queries against system prompt overrides and jailbreaking vectors."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE

    # Right: Curated KB
    add_card(s10, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.2), "GROUNDED RETRIEVAL-AUGMENTED GENERATION", MINT)
    tb = s10.shapes.add_textbox(Inches(7.1), Inches(2.2), Inches(5.2), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "• Strict Local Knowledge Base Anchoring:\n"
        "  Responses are grounded exclusively in peer-reviewed security entries:\n"
        "  - [KB-001]: Evil Twin AP Attacks & Beacon Spoofing\n"
        "  - [KB-003]: 802.11 Encryption (WPA2 vs WPA3)\n"
        "  - [KB-004]: Homoglyph & Internationalized Domain Spoofs\n"
        "  - [KB-007]: 802.11w Protected Management Frames & Deauth Jamming\n\n"
        "• Citations & Verification:\n"
        "  Every explanation cites verified knowledge IDs, guaranteeing 100% factual, actionable security advice."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE

    s10.notes_slide.notes_text_frame.text = (
        "While math calculates the score, ordinary citizens need clear human explanations. Our AI Threat Explainer uses a RAG pipeline anchored "
        "strictly to our local knowledge base. Every explanation cites verified entries like KB-007, ensuring the advice is helpful, accurate, "
        "and completely free of hallucination."
    )

    # ==========================================
    # SLIDE 11: Apple-Inspired Liquid Glass UI
    # ==========================================
    s11 = prs.slides.add_slide(blank_layout)
    set_bg(s11)
    add_header(s11, "Apple-Inspired Liquid Glass Design System", "FRONTEND DESIGN")

    # 3 Cards
    c1 = add_card(s11, Inches(0.8), Inches(1.6), Inches(3.7), Inches(5.2), "TRANSLUCENT GLASS CARDS", CYAN)
    tb = s11.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(3.3), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "• Native Backdrop Blur:\n"
        "  Leverages Expo Blur (expo-blur) with fallback for low-spec devices.\n\n"
        "• Specular Reflection Rims:\n"
        "  Subtle top-edge 1px highlights mimic real physical curved glass.\n\n"
        "• Layered Depth & Elevation:\n"
        "  Deep multi-stage drop shadows create tactile, floating surfaces."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE

    c2 = add_card(s11, Inches(4.8), Inches(1.6), Inches(3.7), Inches(5.2), "FLOATING NAVIGATION BAR", EMERALD)
    tb = s11.shapes.add_textbox(Inches(5.0), Inches(2.2), Inches(3.3), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "• Floating 36px Rounded Pill:\n"
        "  Hovers gracefully over content with strict safe-area clearance.\n\n"
        "• 5 Seamless Navigation Tabs:\n"
        "  Shield (Home), Wi-Fi, Link, QR, and Profile.\n\n"
        "• Persistent 'Quick Scan' Action:\n"
        "  One-tap full security sweep across all modules simultaneously."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE

    c3 = add_card(s11, Inches(8.8), Inches(1.6), Inches(3.7), Inches(5.2), "DUAL THEME ENGINE", MINT)
    tb = s11.shapes.add_textbox(Inches(9.0), Inches(2.2), Inches(3.3), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "• Dynamic Real-Time Toggling:\n"
        "  Instant switch between Light and Cyber Dark modes without reload.\n\n"
        "• Light Mode (Frosted Mint Glass):\n"
        "  Soft white, pale mint, deep emerald security accents.\n\n"
        "• Dark Mode (Cyber Obsidian Glass):\n"
        "  Deep slate with vibrant neon accents and maximum contrast."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE

    s11.notes_slide.notes_text_frame.text = (
        "Security tools are often ugly and intimidating. We engineered an Apple-inspired Liquid Glass design system. By using frosted surfaces, "
        "clean typography, and a floating navigation bar, we make digital security feel modern, welcoming, and accessible to non-technical users."
    )

    # ==========================================
    # SLIDE 12: Verification & Test Results
    # ==========================================
    s12 = prs.slides.add_slide(blank_layout)
    set_bg(s12)
    add_header(s12, "Verification, Testing & Pentest Results", "QUALITY ASSURANCE")

    # Left: Stats Highlight
    add_card(s12, Inches(0.8), Inches(1.6), Inches(3.7), Inches(5.2), "TESTING BENCHMARKS", EMERALD)
    tb = s12.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(3.3), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "25\nTEST SUITES\n\n"
        "118 / 118\nTESTS PASSING (100%)\n\n"
        "0\nTYPESCRIPT ERRORS\n\n"
        "60 FPS\nPHYSICAL DEVICE FRAME RATE"
    )
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = MINT

    # Right: Test Matrix Table Card
    add_card(s12, Inches(4.8), Inches(1.6), Inches(7.7), Inches(5.2), "AUTOMATED VERIFICATION BREAKDOWN", CYAN)
    tb = s12.shapes.add_textbox(Inches(5.0), Inches(2.2), Inches(7.3), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "• packages/scoring-core (3 Suites · 16 Tests Passed):\n"
        "  - Verified monotonic bounds (0 <= Score <= 100)\n"
        "  - Verified critical risk floors for SSRF and open rogue APs\n\n"
        "• apps/api Pentesting & Gateway (6 Suites · 32 Tests Passed):\n"
        "  - SSRF loopback blocking (127.0.0.1, RFC1918 subnets)\n"
        "  - Prompt injection sanitization in RAG pipeline\n"
        "  - Rate limiting and CORS security headers\n\n"
        "• apps/mobile & Telemetry (10 Suites · 48 Tests Passed):\n"
        "  - 802.11 beacon parser & PMF flag detection\n"
        "  - QR intent sanitization (URL, Wi-Fi, SMS, Text)\n"
        "  - On-device permission matrix analysis (Zero-PII)\n\n"
        "• Integration & E2E (6 Suites · 22 Tests Passed):\n"
        "  - End-to-end REST gateway telemetry exchange\n"
        "  - Sub-300ms round-trip latency under ADB reverse tunnel"
    )
    p.font.size = Pt(11.5)
    p.font.color.rgb = TEXT_WHITE

    s12.notes_slide.notes_text_frame.text = (
        "To ensure reliability, we built an automated test suite with 25 test suites and 118 unit and penetration tests. "
        "Every security claim—from SSRF blocking to monotonic score calibration—is backed by passing unit tests."
    )

    # ==========================================
    # SLIDE 13: Technical Limitations & Future Scope
    # ==========================================
    s13 = prs.slides.add_slide(blank_layout)
    set_bg(s13)
    add_header(s13, "Technical Limitations & Future Roadmap", "FUTURE SCOPE")

    # Left: Limitations
    add_card(s13, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2), "ENGINEERING REALITIES & LIMITATIONS", CORAL)
    tb = s13.shapes.add_textbox(Inches(1.1), Inches(2.2), Inches(5.0), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "• Mobile OS Sandboxing:\n"
        "  Non-rooted Android security models restrict raw 802.11 packet sniffing in background services, limiting Wi-Fi auditing to broadcast beacon parameters.\n\n"
        "• Optical Scanning Limitations:\n"
        "  Extreme optical angles, surface glares, or low ambient light can degrade camera QR decoding frame rates.\n\n"
        "• Ground Truth Availability:\n"
        "  Threat databases require periodic sync to stay updated against zero-day domains."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE

    # Right: Roadmap
    add_card(s13, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.2), "FUTURE RESEARCH & EXTENSIONS", MINT)
    tb = s13.shapes.add_textbox(Inches(7.1), Inches(2.2), Inches(5.2), Inches(4.3))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "1. LOCAL ENCRYPTED DNS SINKHOLING:\n"
        "   Deploy an on-device VPN-service DNS filter (DNS-over-HTTPS) to block malicious tracker domains at the OS socket layer.\n\n"
        "2. ON-DEVICE QUANTIZED SLM INFERENCE:\n"
        "   Integrate a 2-bit/4-bit quantized Small Language Model (e.g., Gemma 2B or Llama 3) for 100% offline AI explanations.\n\n"
        "3. DECENTRALIZED THREAT CONSENSUS:\n"
        "   Peer-to-peer threat verification using zero-knowledge proofs to alert neighboring devices of rogue APs without leaking user location."
    )
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE

    s13.notes_slide.notes_text_frame.text = (
        "We recognize the real-world limitations of operating on mobile operating systems without root privileges. "
        "Looking ahead, our roadmap includes on-device quantized language models and local DNS-over-HTTPS sinkholing to provide an even stronger autonomous defense."
    )

    # ==========================================
    # SLIDE 14: Conclusion & Defense Readiness
    # ==========================================
    s14 = prs.slides.add_slide(blank_layout)
    set_bg(s14)
    add_header(s14, "Conclusion & Project Contributions", "PROJECT REVIEW DEFENSE")

    add_card(s14, Inches(0.8), Inches(1.6), Inches(11.7), Inches(4.0), "SUMMARY OF KEY CONTRIBUTIONS", EMERALD)
    tb = s14.shapes.add_textbox(Inches(1.1), Inches(2.2), Inches(11.1), Inches(3.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "1. Built an End-to-End Zero-Trust Mobile Sentinel tailored specifically for non-technical citizens.\n\n"
        "2. Eliminated All Mock Data, querying live 802.11 physical radio beacons and optical camera frames on Android hardware.\n\n"
        "3. Pioneered a Pure Deterministic Mathematical Scoring Core (0–100 monotonic scale) alongside a grounded, zero-hallucination RAG explainer.\n\n"
        "4. Designed a Fluid Apple-Inspired Liquid Glass UI with floating navigation, ambient glow, and real-time dual themes running at 60 FPS.\n\n"
        "5. Validated Engineering Integrity with 100% pass rate across 25 Jest test suites and 118 unit & penetration tests."
    )
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_WHITE

    # Bottom bar
    tb_bot = s14.shapes.add_textbox(Inches(0.8), Inches(5.9), Inches(11.7), Inches(0.8))
    tf_bot = tb_bot.text_frame
    p_bot = tf_bot.paragraphs[0]
    p_bot.text = "THANK YOU! · OPEN FOR QUESTIONS & LIVE SYSTEM DEMO"
    p_bot.alignment = PP_ALIGN.CENTER
    p_bot.font.size = Pt(20)
    p_bot.font.bold = True
    p_bot.font.color.rgb = MINT

    s14.notes_slide.notes_text_frame.text = (
        "In conclusion, Cyber Companion v3 demonstrates that citizen safety and technical rigor can go hand-in-hand. "
        "All modules are live, tested, and running on the connected Android smartphone. I am now ready for questions and the live demonstration."
    )

    # Save presentation
    output_path = r"d:\cyber-companion-v3\Cyber_Companion_v3_Project_Review.pptx"
    prs.save(output_path)
    print(f"Presentation generated successfully at: {output_path}")

if __name__ == "__main__":
    create_deck()
