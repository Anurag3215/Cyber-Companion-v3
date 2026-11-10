import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def add_header_footer(doc, title_text):
    for s_idx, section in enumerate(doc.sections):
        # We can configure header and footer
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run(title_text)
        hrun.font.name = "Times New Roman"
        hrun.font.size = Pt(8.5)
        hrun.font.italic = True
        hrun.font.color.rgb = RGBColor(120, 120, 120)

        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.LEFT
        frun1 = fp.add_run("Department of Computer Applications, FISAT")
        frun1.font.name = "Times New Roman"
        frun1.font.size = Pt(8.5)
        frun1.font.italic = True
        frun1.font.color.rgb = RGBColor(120, 120, 120)

def create_report():
    doc = Document()
    
    # Page Setup
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.25)
        section.right_margin = Inches(1.0)

    # PAGE 1: TITLE PAGE
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(36)
    p_title.paragraph_format.space_after = Pt(12)
    
    r_t1 = p_title.add_run("Cyber Companion (Check First)\n")
    r_t1.font.name = "Times New Roman"
    r_t1.font.size = Pt(18)
    r_t1.font.bold = True
    
    r_t2 = p_title.add_run("Mini Project Report\n\n")
    r_t2.font.name = "Times New Roman"
    r_t2.font.size = Pt(14)
    r_t2.font.bold = True

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(18)
    p_sub.paragraph_format.space_after = Pt(18)
    
    r_s1 = p_sub.add_run("Submitted by\n")
    r_s1.font.name = "Times New Roman"
    r_s1.font.size = Pt(12)
    r_s1.font.italic = True
    
    r_s2 = p_sub.add_run("Anurag T S\n")
    r_s2.font.name = "Times New Roman"
    r_s2.font.size = Pt(14)
    r_s2.font.bold = True

    p_ful = doc.add_paragraph()
    p_ful.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_ful.paragraph_format.space_before = Pt(24)
    p_ful.paragraph_format.space_after = Pt(40)
    
    r_f1 = p_ful.add_run("Submitted in partial fulfillment of the requirements for the award of the degree of\n")
    r_f1.font.name = "Times New Roman"
    r_f1.font.size = Pt(12)
    r_f1.font.italic = True
    
    r_f2 = p_ful.add_run("Master of Computer Applications\n")
    r_f2.font.name = "Times New Roman"
    r_f2.font.size = Pt(13)
    r_f2.font.bold = True
    
    r_f3 = p_ful.add_run("of\n")
    r_f3.font.name = "Times New Roman"
    r_f3.font.size = Pt(11)
    r_f3.font.italic = True
    
    r_f4 = p_ful.add_run("A P J Abdul Kalam Technological University\n")
    r_f4.font.name = "Times New Roman"
    r_f4.font.size = Pt(13)
    r_f4.font.bold = True

    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_before = Pt(48)
    p_inst.paragraph_format.space_after = Pt(0)
    
    r_i1 = p_inst.add_run("FEDERAL INSTITUTE OF SCIENCE AND TECHNOLOGY (FISAT)\n")
    r_i1.font.name = "Times New Roman"
    r_i1.font.size = Pt(13)
    r_i1.font.bold = True
    
    r_i2 = p_inst.add_run("ANGAMALY-683577, ERNAKULAM (DIST)\nOCTOBER 2026\n")
    r_i2.font.name = "Times New Roman"
    r_i2.font.size = Pt(11)
    r_i2.font.bold = True

    doc.add_page_break()

    # PAGE 2: DECLARATION
    p_dec_h = doc.add_paragraph()
    p_dec_h.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dec_h.paragraph_format.space_before = Pt(36)
    p_dec_h.paragraph_format.space_after = Pt(28)
    r_dh = p_dec_h.add_run("DECLARATION")
    r_dh.font.name = "Times New Roman"
    r_dh.font.size = Pt(14)
    r_dh.font.bold = True
    r_dh.underline = True

    p_dec_body = doc.add_paragraph()
    p_dec_body.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_dec_body.paragraph_format.line_spacing = 1.5
    p_dec_body.paragraph_format.space_after = Pt(14)
    r_db1 = p_dec_body.add_run(
        "I, Anurag T S hereby declare that the report of this project work, submitted to the Department of "
        "Computer Applications, Federal Institute of Science and Technology (FISAT), Angamaly in partial "
        "fulfillment of the award of the degree of Master of Computer Applications is an authentic record "
        "of my original work. The report has not been submitted for the award of any degree of this "
        "university or any other university."
    )
    r_db1.font.name = "Times New Roman"
    r_db1.font.size = Pt(12)

    p_dec_foot = doc.add_paragraph()
    p_dec_foot.paragraph_format.space_before = Pt(64)
    r_df = p_dec_foot.add_run("Date:\nPlace: Angamaly")
    r_df.font.name = "Times New Roman"
    r_df.font.size = Pt(12)

    p_dec_sign = doc.add_paragraph()
    p_dec_sign.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_ds = p_dec_sign.add_run("Anurag T S\nFIT25MCA-2008")
    r_ds.font.name = "Times New Roman"
    r_ds.font.size = Pt(12)
    r_ds.font.bold = True

    doc.add_page_break()

    # PAGE 3: CERTIFICATE
    p_cert_head = doc.add_paragraph()
    p_cert_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cert_head.paragraph_format.space_before = Pt(18)
    p_cert_head.paragraph_format.space_after = Pt(4)
    r_ch1 = p_cert_head.add_run("FEDERAL INSTITUTE OF SCIENCE AND TECHNOLOGY (FISAT)\n")
    r_ch1.font.name = "Times New Roman"
    r_ch1.font.size = Pt(13)
    r_ch1.font.bold = True

    r_ch2 = p_cert_head.add_run("ANGAMALY, ERNAKULAM-683577\nDEPARTMENT OF COMPUTER APPLICATIONS\n\n")
    r_ch2.font.name = "Times New Roman"
    r_ch2.font.size = Pt(11)
    r_ch2.font.bold = True

    r_ch3 = p_cert_head.add_run("CERTIFICATE")
    r_ch3.font.name = "Times New Roman"
    r_ch3.font.size = Pt(14)
    r_ch3.font.bold = True
    r_ch3.underline = True

    p_cert_body = doc.add_paragraph()
    p_cert_body.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_cert_body.paragraph_format.line_spacing = 1.5
    p_cert_body.paragraph_format.space_before = Pt(28)
    p_cert_body.paragraph_format.space_after = Pt(48)
    r_cb = p_cert_body.add_run(
        "This is to certify that the project report titled “Cyber Companion (Check First)” submitted by "
        "Anurag T S towards partial fulfillment of the requirements for the award of the degree of Master "
        "of Computer Applications is a record of bonafide work carried out by him during the year 2026."
    )
    r_cb.font.name = "Times New Roman"
    r_cb.font.size = Pt(12)

    # Signatures Table
    t_sig = doc.add_table(rows=1, cols=2)
    t_sig.alignment = WD_TABLE_ALIGNMENT.CENTER
    p_left = t_sig.rows[0].cells[0].paragraphs[0]
    p_left.paragraph_format.space_before = Pt(40)
    r_pl = p_left.add_run("Dr. Rosemary Mathews\nProject Guide")
    r_pl.font.name = "Times New Roman"
    r_pl.font.size = Pt(12)
    r_pl.font.bold = True

    p_right = t_sig.rows[0].cells[1].paragraphs[0]
    p_right.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_right.paragraph_format.space_before = Pt(40)
    r_pr = p_right.add_run("Dr. Shahna K U\nHead of the Department")
    r_pr.font.name = "Times New Roman"
    r_pr.font.size = Pt(12)
    r_pr.font.bold = True

    doc.add_page_break()

    # PAGE 4: ACKNOWLEDGEMENT
    p_ack_h = doc.add_paragraph()
    p_ack_h.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_ack_h.paragraph_format.space_before = Pt(24)
    p_ack_h.paragraph_format.space_after = Pt(20)
    r_ah = p_ack_h.add_run("ACKNOWLEDGEMENT")
    r_ah.font.name = "Times New Roman"
    r_ah.font.size = Pt(14)
    r_ah.font.bold = True
    r_ah.underline = True

    ack_texts = [
        "I express my deep gratitude to Dr. Jacob Thomas V, Principal, FISAT, for providing the necessary facilities and support that enabled me to complete my mini project successfully.",
        "I extend my sincere thanks to Dr. Shahna K U, Head of the Department of Computer Applications, FISAT, for her inspiration and encouragement throughout the project.",
        "I express my heartfelt gratitude to Dr. Rosemary Mathews, my Project Guide, and Dr. Deepa Mary, my Scrum Master, for their valuable suggestions, guidance, and support at every stage of the project.",
        "I am also grateful to Dr. Deepa Mary Mathews, Project Coordinator, for her constant encouragement and unwavering support throughout the project. I extend my sincere thanks to all the faculty and lab faculty members of the department for their guidance and assistance.",
        "Finally, I thank my parents and friends for their valuable suggestions, cooperation, and encouragement, which contributed to the successful completion of this project."
    ]

    for at in ack_texts:
        p_at = doc.add_paragraph()
        p_at.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p_at.paragraph_format.line_spacing = 1.35
        p_at.paragraph_format.space_after = Pt(8)
        r = p_at.add_run(at)
        r.font.name = "Times New Roman"
        r.font.size = Pt(12)

    p_ack_sign = doc.add_paragraph()
    p_ack_sign.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p_ack_sign.paragraph_format.space_before = Pt(28)
    r_as = p_ack_sign.add_run("Anurag T S\nFIT25MCA-2008")
    r_as.font.name = "Times New Roman"
    r_as.font.size = Pt(12)
    r_as.font.bold = True

    doc.add_page_break()

    # PAGE 5: ABSTRACT
    p_abs_h = doc.add_paragraph()
    p_abs_h.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_abs_h.paragraph_format.space_before = Pt(36)
    p_abs_h.paragraph_format.space_after = Pt(24)
    r_abh = p_abs_h.add_run("ABSTRACT")
    r_abh.font.name = "Times New Roman"
    r_abh.font.size = Pt(14)
    r_abh.font.bold = True
    r_abh.underline = True

    p_abs_body = doc.add_paragraph()
    p_abs_body.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_abs_body.paragraph_format.line_spacing = 1.5
    p_abs_body.paragraph_format.space_after = Pt(14)
    r_ab_text = p_abs_body.add_run(
        "With the explosive proliferation of smartphones and interconnected mobile services, everyday users are "
        "increasingly exposed to sophisticated cyber threats including QR phishing (quishing), deceptive homoglyph "
        "domains, rogue Wi-Fi access points, and privacy-intrusive mobile applications. Conventional mobile security "
        "solutions often operate reactively, relying on heavy post-infection antivirus signatures, transmitting invasive "
        "telemetry to cloud servers, and conveying technical alerts in cryptic security jargon that non-technical users "
        "struggle to interpret. To overcome these limitations, this project presents Cyber Companion (Check First), a "
        "cross-platform proactive cybersecurity awareness and threat defense assistant designed for Android and web environments.\n\n"
        "Built upon a modern zero-trust architecture using React Native, Expo, Three.js, Node.js (Express with TypeScript), "
        "and MongoDB Atlas, Cyber Companion introduces a shift from reactive detection to pre-connection awareness. The system "
        "incorporates a real-time 3D interactive Cyber Shield Core that dynamically visualizes the device's security posture. "
        "A dedicated Wi-Fi Sentinel conducts pre-connection 802.11 beacon cipher inspections to identify rogue Evil Twin "
        "honeypots, while an optical hardware QR scanner provides an isolated in-memory sandbox to intercept malicious deep links "
        "and credentials-harvesting portals before operating system execution. The backend Threat Intelligence Gateway enforces "
        "Server-Side Request Forgery (SSRF) and DNS-rebinding guards while evaluating domains via multi-engine consensus "
        "(VirusTotal, Google Safe Browsing). An on-device permission auditor identifies high-risk sensor combinations "
        "(e.g., SMS read access coupled with network transmission) without exfiltrating user package lists. Health ratings "
        "are computed via a pure, monotonic 0–100 deterministic scoring engine, paired with a grounded Retrieval-Augmented "
        "Generation (RAG) AI assistant citing structured knowledge bases ([KB-001] to [KB-005]) to provide transparent, plain-language "
        "remediation. The resulting system establishes an accessible, privacy-preserving defense layer that measurably elevates "
        "user security posture without compromising device performance."
    )
    r_ab_text.font.name = "Times New Roman"
    r_ab_text.font.size = Pt(12)

    doc.add_page_break()

    # PAGE 6: TABLE OF CONTENTS
    p_toc_h = doc.add_paragraph()
    p_toc_h.paragraph_format.space_before = Pt(20)
    p_toc_h.paragraph_format.space_after = Pt(16)
    r_th = p_toc_h.add_run("Contents")
    r_th.font.name = "Times New Roman"
    r_th.font.size = Pt(18)
    r_th.font.bold = True

    toc_items = [
        ("1   INTRODUCTION", "8"),
        ("    1.1   Background and Problem Statement", "8"),
        ("    1.2   Need for Cybersecurity Threat Awareness", "9"),
        ("    1.3   Objectives of Cyber Companion", "9"),
        ("    1.4   Proposed Features and Key Capabilities", "10"),
        ("    1.5   Organization of the Report", "10"),
        ("2   LITERATURE SURVEY", "11"),
        ("    2.1   Study of Mobile Phishing and Quishing Vectors", "11"),
        ("    2.2   Analysis of Public 802.11 Wi-Fi Vulnerabilities", "11"),
        ("    2.3   Review of Threat Intelligence Frameworks & Heuristics", "12"),
        ("    2.4   Summary of Gaps in Existing Mobile Security Solutions", "12"),
        ("3   IMPLEMENTATION", "13"),
        ("    3.1   System Architecture", "13"),
        ("    3.2   Dataset and Threat Knowledge Base", "14"),
        ("    3.3   Modules", "14"),
        ("          3.3.1   3D Interactive Cyber Shield Core", "14"),
        ("          3.3.2   Pre-Connection Wi-Fi Sentinel", "15"),
        ("          3.3.3   Optical Camera QR Scanner & Sandboxed Preview", "15"),
        ("          3.3.4   URL Threat Inspector & SSRF Guard", "16"),
        ("          3.3.5   On-Device Permission Auditor", "16"),
        ("          3.3.6   Deterministic Scoring Engine", "17"),
        ("          3.3.7   Grounded RAG AI Explainer", "17"),
        ("          3.3.8   Deployment and Cloud Infrastructure", "18"),
        ("    3.4   Algorithms", "18"),
        ("          3.4.1   Deterministic Health Scoring Algorithm", "18"),
        ("          3.4.2   Homoglyph and SSRF Mitigation Algorithm", "19"),
        ("4   RESULT ANALYSIS", "20"),
        ("    4.1   Threat Detection Accuracy and Benchmarking", "20"),
        ("    4.2   System Latency and 3D Frame-Rate Performance", "21"),
        ("    4.3   Comparative Feature Matrix", "21"),
        ("5   CONCLUSION AND FUTURE SCOPE", "22"),
        ("    5.1   Conclusion", "22"),
        ("    5.2   Future Scope", "22"),
        ("6   CODING", "23"),
        ("    6.1   Source Code", "23"),
        ("          6.1.1   gateway.controller.ts", "23"),
        ("          6.1.2   wifiSentinel.service.ts", "27"),
        ("          6.1.3   deterministicScorer.ts", "30"),
        ("7   SCREEN SHOTS", "32"),
        ("8   REFERENCES", "36")
    ]

    for item, page_no in toc_items:
        p_row = doc.add_paragraph()
        p_row.paragraph_format.line_spacing = 1.15
        p_row.paragraph_format.space_before = Pt(1)
        p_row.paragraph_format.space_after = Pt(2)
        
        # Determine bold for top-level headers
        is_top = not item.startswith(" ")
        r_item = p_row.add_run(item)
        r_item.font.name = "Times New Roman"
        r_item.font.size = Pt(11)
        r_item.font.bold = is_top

        # Dot leader simulation or tab
        dots_count = max(2, 75 - len(item) - len(page_no))
        r_dots = p_row.add_run(" " + "." * dots_count + " ")
        r_dots.font.name = "Times New Roman"
        r_dots.font.size = Pt(10)
        r_dots.font.color.rgb = RGBColor(140, 140, 140)

        r_pg = p_row.add_run(page_no)
        r_pg.font.name = "Times New Roman"
        r_pg.font.size = Pt(11)
        r_pg.font.bold = is_top

    doc.add_page_break()

    # PAGE 7: CHAPTER 1 TITLE
    p_c1_title = doc.add_paragraph()
    p_c1_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_c1_title.paragraph_format.space_before = Pt(120)
    p_c1_title.paragraph_format.space_after = Pt(12)
    r_ch1 = p_c1_title.add_run("Chapter 1\n\nIntroduction")
    r_ch1.font.name = "Times New Roman"
    r_ch1.font.size = Pt(22)
    r_ch1.font.bold = True

    doc.add_page_break()

    # CHAPTER 1 BODY (PAGES 8-10)
    # 1.1 Background and Problem Statement
    p_h1 = doc.add_paragraph()
    p_h1.paragraph_format.space_before = Pt(18)
    p_h1.paragraph_format.space_after = Pt(6)
    p_h1.paragraph_format.keep_with_next = True
    r_h1 = p_h1.add_run("1.1 Background and Problem Statement")
    r_h1.font.name = "Times New Roman"
    r_h1.font.size = Pt(14)
    r_h1.font.bold = True

    p_b1 = doc.add_paragraph()
    p_b1.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_b1.paragraph_format.line_spacing = 1.5
    p_b1.paragraph_format.space_after = Pt(10)
    r_b1 = p_b1.add_run(
        "Over the past decade, the rapid adoption of mobile computing devices has fundamentally restructured personal "
        "communication, e-commerce, digital banking, and enterprise productivity. Smartphones running modern operating systems "
        "have evolved from simple voice-and-text terminals into primary compute centers holding sensitive personal identification, "
        "financial credentials, cryptographic tokens, and private correspondence. However, this ubiquity has also transformed "
        "mobile platforms into high-value targets for cyber adversaries. Unlike traditional desktop computing environments where "
        "users typically operate behind dedicated corporate firewalls and intrusion prevention systems, mobile devices are "
        "regularly exposed to untrusted external environments—including public Wi-Fi hotspots, unsolicited SMS communication, "
        "and physical barcodes in retail and public spaces."
    )
    r_b1.font.name = "Times New Roman"
    r_b1.font.size = Pt(12)

    p_b2 = doc.add_paragraph()
    p_b2.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_b2.paragraph_format.line_spacing = 1.5
    p_b2.paragraph_format.space_after = Pt(10)
    r_b2 = p_b2.add_run(
        "Modern threat actors have pivoted towards exploiting human cognitive vulnerabilities rather than relying solely on "
        "complex software exploits. Deceptive social engineering vectors such as Quishing (Quick Response code phishing), "
        "Internationalized Domain Name (IDN) homoglyph spoofing, rogue Evil Twin Wi-Fi access points, and sensor-invasive mobile "
        "malware are becoming increasingly prevalent. In particular, the physical-to-digital bridge created by QR codes conceals "
        "the destination Uniform Resource Locator (URL) from human inspection, allowing attackers to route unsuspecting users "
        "to fraudulent credential harvesting portals or automated APK payload droppers before the user can evaluate the threat."
    )
    r_b2.font.name = "Times New Roman"
    r_b2.font.size = Pt(12)

    # 1.2 Need for Cybersecurity Threat Awareness
    p_h2 = doc.add_paragraph()
    p_h2.paragraph_format.space_before = Pt(16)
    p_h2.paragraph_format.space_after = Pt(6)
    p_h2.paragraph_format.keep_with_next = True
    r_h2 = p_h2.add_run("1.2 Need for Cybersecurity Threat Awareness")
    r_h2.font.name = "Times New Roman"
    r_h2.font.size = Pt(14)
    r_h2.font.bold = True

    p_b3 = doc.add_paragraph()
    p_b3.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_b3.paragraph_format.line_spacing = 1.5
    p_b3.paragraph_format.space_after = Pt(10)
    r_b3 = p_b3.add_run(
        "Existing mobile security applications suffer from critical architectural and pedagogical shortcomings. Traditional "
        "antivirus products follow a reactive paradigm: they focus on scanning the device's persistent storage for known static "
        "malware signatures after a file has already been downloaded. This approach fails to protect users against dynamic network "
        "interceptions, ephemeral web phishing portals, or social engineering attacks that do not deposit conventional binaries on the device.\n\n"
        "Furthermore, commercial security utilities often impose substantial computational overhead, draining battery life through "
        "continuous background telemetry while frequently collecting and exfiltrating users' browsing histories and package lists to "
        "third-party advertising aggregators under the guise of threat telemetry. Crucially, when an existing tool does detect a risk, "
        "it typically reports technical error codes (e.g., 'Certificate CN mismatch' or 'Heuristic.Trojan.Dropper.Gen') without explaining "
        "what the threat means, why it is dangerous, or what specific remediation steps the user should undertake. This communication "
        "chasm leaves non-technical users bewildered and susceptible to repeated attacks. There is an urgent need for an intelligent, "
        "privacy-first cybersecurity assistant that emphasizes proactive awareness, pre-connection evaluation, and plain-language education."
    )
    r_b3.font.name = "Times New Roman"
    r_b3.font.size = Pt(12)

    # 1.3 Objectives of Cyber Companion
    p_h3 = doc.add_paragraph()
    p_h3.paragraph_format.space_before = Pt(16)
    p_h3.paragraph_format.space_after = Pt(6)
    p_h3.paragraph_format.keep_with_next = True
    r_h3 = p_h3.add_run("1.3 Objectives of Cyber Companion")
    r_h3.font.name = "Times New Roman"
    r_h3.font.size = Pt(14)
    r_h3.font.bold = True

    p_b4 = doc.add_paragraph()
    p_b4.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_b4.paragraph_format.line_spacing = 1.5
    p_b4.paragraph_format.space_after = Pt(10)
    r_b4 = p_b4.add_run(
        "The primary goal of Cyber Companion (Check First) is to develop an intelligent, zero-trust cybersecurity awareness "
        "and assistant system that empowers everyday users to proactively inspect potential cyber threats across mobile and web platforms. "
        "The specific research and engineering objectives are as follows:\n\n"
        "1. To shift digital security from reactive post-infection scanning to proactive pre-connection inspection across multiple attack surfaces.\n"
        "2. To engineer a Pre-Connection Wi-Fi Sentinel that parses 802.11 beacon frames and assesses cipher security (WPA2/WPA3 vs. Open/WEP) and Evil Twin probabilities before the device establishes a network handshake.\n"
        "3. To build a hardware-accelerated Optical QR Scanner equipped with an isolated in-memory preview sandbox to prevent automated browser navigation to phishing or malicious intent endpoints.\n"
        "4. To deploy a hardened Threat Intelligence Gateway incorporating Server-Side Request Forgery (SSRF) and DNS-rebinding protection while performing multi-engine consensus evaluations (VirusTotal, Google Safe Browsing).\n"
        "5. To design an on-device permission auditor that identifies hazardous permission combinations (such as SMS read access paired with Internet transmission) strictly locally, preserving complete user privacy.\n"
        "6. To compute a pure, deterministic 0–100 security health score governed by monotonic mathematical functions rather than unpredictable generative models.\n"
        "7. To implement a grounded Retrieval-Augmented Generation (RAG) educational explainer that translates complex threat telemetry into structured, plain-language guidance citing verified internal knowledge articles."
    )
    r_b4.font.name = "Times New Roman"
    r_b4.font.size = Pt(12)

    # 1.4 Proposed Features and Key Capabilities
    p_h4 = doc.add_paragraph()
    p_h4.paragraph_format.space_before = Pt(16)
    p_h4.paragraph_format.space_after = Pt(6)
    p_h4.paragraph_format.keep_with_next = True
    r_h4 = p_h4.add_run("1.4 Proposed Features and Key Capabilities")
    r_h4.font.name = "Times New Roman"
    r_h4.font.size = Pt(14)
    r_h4.font.bold = True

    p_b5 = doc.add_paragraph()
    p_b5.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_b5.paragraph_format.line_spacing = 1.5
    p_b5.paragraph_format.space_after = Pt(10)
    r_b5 = p_b5.add_run(
        "The Cyber Companion architecture is divided into high-cohesion, decoupled modules designed to address distinct attack vectors:\n\n"
        "• 3D Interactive Cyber Shield Core: A WebGL/Three.js-powered 3D holographic shield situated on the primary dashboard that dynamically changes visual state (color, rotation velocity, pulse frequency) in response to real-time security events.\n"
        "• Wi-Fi Sentinel: Analyzes nearby wireless access points, flags rogue networks, evaluates encryption ciphers, and calculates Man-in-the-Middle (MitM) risk indexes prior to connection.\n"
        "• Optical QR & Barcode Scanner: Intercepts camera video frames via expo-camera, decodes QR payloads, isolates deep links within a virtual sandbox, and presents an intent preview before allowing execution.\n"
        "• URL Threat Inspector: Executes heuristic checks on web URLs, flagging Punycode homoglyphs (e.g., Cyrillic 'а' replacing Latin 'a'), brand impersonation keywords, and private RFC1918 loopback addresses.\n"
        "• On-Device Permission Auditor: Inspects installed application manifests for predatory permission clusters, highlighting apps capable of background SMS interception and banking credential exfiltration.\n"
        "• Deterministic Health Scoring: Aggregates security telemetry across Wi-Fi (30%), URL inspection (30%), permission profile (20%), and system state (20%) into a transparent 0–100 metric with prioritized remediation tasks.\n"
        "• Grounded RAG AI Explainer: An interactive awareness assistant powered by a curated, cited knowledge base ([KB-001] to [KB-005]) protected by prompt-injection filters and full offline availability."
    )
    r_b5.font.name = "Times New Roman"
    r_b5.font.size = Pt(12)

    # 1.5 Organization of the Report
    p_h5 = doc.add_paragraph()
    p_h5.paragraph_format.space_before = Pt(16)
    p_h5.paragraph_format.space_after = Pt(6)
    p_h5.paragraph_format.keep_with_next = True
    r_h5 = p_h5.add_run("1.5 Organization of the Report")
    r_h5.font.name = "Times New Roman"
    r_h5.font.size = Pt(14)
    r_h5.font.bold = True

    p_b6 = doc.add_paragraph()
    p_b6.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_b6.paragraph_format.line_spacing = 1.5
    p_b6.paragraph_format.space_after = Pt(10)
    r_b6 = p_b6.add_run(
        "The remainder of this report is organized as follows:\n\n"
        "• Chapter 2 (Literature Survey) reviews recent academic literature on mobile malware, Quishing attack methodologies, wireless beacon vulnerabilities, and current threat intelligence consolidation techniques.\n"
        "• Chapter 3 (Implementation) details the comprehensive system architecture, data models, core microservices, on-device detection mechanisms, and mathematical scoring algorithms.\n"
        "• Chapter 4 (Result Analysis) presents empirical performance benchmarks, test case outcomes, detection accuracy metrics, and WebGL rendering stability.\n"
        "• Chapter 5 (Conclusion and Future Scope) summarizes the completed research contributions, discusses existing limitations, and outlines future enhancements including BLE tracking detection and on-device SMS spam classification.\n"
        "• Chapter 6, 7, and 8 provide the core source code implementations, application screenshots, and academic references."
    )
    r_b6.font.name = "Times New Roman"
    r_b6.font.size = Pt(12)

    # Add header/footer to all sections
    add_header_footer(doc, "Cyber Companion (Check First)")

    output_path = "Cyber_Companion_Mini_Project_Report_Anurag_TS.docx"
    doc.save(output_path)
    print(f"Report DOCX created successfully at: {output_path}")

if __name__ == "__main__":
    create_report()
