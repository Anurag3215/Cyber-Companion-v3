import os
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT
from docx.enum.table import WD_TABLE_ALIGNMENT
from report_helpers import add_p, FONT_PRIMARY, FONT_HEADER, COLOR_TEXT

def build_prelims(doc):
    # PAGE 1: COVER / TITLE PAGE
    p_t = doc.add_paragraph()
    p_t.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_t.paragraph_format.space_before = Pt(40)
    p_t.paragraph_format.space_after = Pt(8)
    r1 = p_t.add_run("Cyber Companion: Intelligent Zero-Trust\nCybersecurity Awareness System\n")
    r1.font.name = FONT_PRIMARY
    r1.font.size = Pt(20)
    r1.font.bold = True

    r2 = p_t.add_run("Mini Project Report\n")
    r2.font.name = FONT_PRIMARY
    r2.font.size = Pt(14)
    r2.font.bold = True

    p_s = doc.add_paragraph()
    p_s.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_s.paragraph_format.space_before = Pt(24)
    p_s.paragraph_format.space_after = Pt(18)
    r_sub = p_s.add_run("Submitted by\n\n")
    r_sub.font.name = FONT_PRIMARY
    r_sub.font.size = Pt(12)
    r_sub.font.bold = False

    r_name = p_s.add_run("ANURAG T S\n\n")
    r_name.font.name = FONT_PRIMARY
    r_name.font.size = Pt(13)
    r_name.font.bold = True

    r_reg = p_s.add_run("REG NO: FIT25MCA-2008\n")
    r_reg.font.name = FONT_PRIMARY
    r_reg.font.size = Pt(11)
    r_reg.font.bold = True

    p_deg = doc.add_paragraph()
    p_deg.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_deg.paragraph_format.space_before = Pt(20)
    p_deg.paragraph_format.space_after = Pt(16)
    r_d1 = p_deg.add_run("Submitted in partial fulfilment of the requirements for the award of the\ndegree of\n")
    r_d1.font.name = FONT_PRIMARY
    r_d1.font.size = Pt(12)
    r_d1.font.bold = True
    r_d1.font.italic = True

    r_d2 = p_deg.add_run("Master of Computer Applications\n")
    r_d2.font.name = FONT_PRIMARY
    r_d2.font.size = Pt(13)
    r_d2.font.bold = True

    r_d3 = p_deg.add_run("Of\n")
    r_d3.font.name = FONT_PRIMARY
    r_d3.font.size = Pt(11)
    r_d3.font.bold = True
    r_d3.font.italic = True

    r_d4 = p_deg.add_run("A P J Abdul Kalam Technological University\n")
    r_d4.font.name = FONT_PRIMARY
    r_d4.font.size = Pt(13)
    r_d4.font.bold = True

    # Institutional Logo
    if os.path.exists("extracted_fisat_logo.png"):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(14)
        p_img.paragraph_format.space_after = Pt(20)
        p_img.add_run().add_picture("extracted_fisat_logo.png", width=Inches(1.8))

    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_before = Pt(10)
    p_inst.paragraph_format.space_after = Pt(0)
    r_i1 = p_inst.add_run("FEDERAL INSTITUTE OF SCIENCE AND TECHNOLOGY (FISAT)® ANGAMALY-683577,\nERNAKULAM(DIST)\n")
    r_i1.font.name = FONT_PRIMARY
    r_i1.font.size = Pt(11)
    r_i1.font.bold = True

    r_i2 = p_inst.add_run("OCTOBER 2026")
    r_i2.font.name = FONT_PRIMARY
    r_i2.font.size = Pt(11)
    r_i2.font.bold = True

    doc.add_page_break()

    # PAGE 2: DECLARATION (page i)
    p_dec_h = doc.add_paragraph()
    p_dec_h.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dec_h.paragraph_format.space_before = Pt(40)
    p_dec_h.paragraph_format.space_after = Pt(36)
    r_dh = p_dec_h.add_run("DECLARATION")
    r_dh.font.name = FONT_PRIMARY
    r_dh.font.size = Pt(14)
    r_dh.font.bold = True
    r_dh.underline = True

    p_dec_b = doc.add_paragraph()
    p_dec_b.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_dec_b.paragraph_format.space_before = Pt(0)
    p_dec_b.paragraph_format.space_after = Pt(24)
    p_dec_b.paragraph_format.line_spacing = 1.3
    r_db = p_dec_b.add_run(
        "I, ANURAG T S hereby declare that the report of this project work, submitted to the "
        "Department of Computer Applications, Federal Institute of Science and Technology "
        "(FISAT), Angamaly in partial fulfillment of the award of the degree of Master of Computer "
        "Applications is an authentic record of my original work."
    )
    r_db.font.name = FONT_PRIMARY
    r_db.font.size = Pt(12)

    p_dec_b2 = doc.add_paragraph()
    p_dec_b2.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_dec_b2.paragraph_format.space_before = Pt(0)
    p_dec_b2.paragraph_format.space_after = Pt(80)
    p_dec_b2.paragraph_format.line_spacing = 1.3
    r_db2 = p_dec_b2.add_run(
        "The report has not been submitted for the award of any degree of this university or any "
        "other university."
    )
    r_db2.font.name = FONT_PRIMARY
    r_db2.font.size = Pt(12)

    p_dec_f = doc.add_paragraph()
    p_dec_f.paragraph_format.space_before = Pt(40)
    p_dec_f.paragraph_format.space_after = Pt(0)
    p_dec_f.paragraph_format.line_spacing = 1.3
    r_df = p_dec_f.add_run("Date:\n\nPlace: Angamaly")
    r_df.font.name = FONT_PRIMARY
    r_df.font.size = Pt(12)

    doc.add_page_break()

    # PAGE 3: CERTIFICATE (page ii)
    p_ch = doc.add_paragraph()
    p_ch.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_ch.paragraph_format.space_before = Pt(24)
    p_ch.paragraph_format.space_after = Pt(4)
    r_c1 = p_ch.add_run("FEDERAL INSTITUTE OF SCIENCE AND TECHNOLOGY (FISAT)\n")
    r_c1.font.name = FONT_PRIMARY
    r_c1.font.size = Pt(13)
    r_c1.font.bold = True

    r_c2 = p_ch.add_run("ANGAMALY, ERNAKULAM-683577\n\n")
    r_c2.font.name = FONT_PRIMARY
    r_c2.font.size = Pt(11)
    r_c2.font.bold = True

    r_c3 = p_ch.add_run("DEPARTMENT OF COMPUTER APPLICATIONS\n")
    r_c3.font.name = FONT_PRIMARY
    r_c3.font.size = Pt(13)
    r_c3.font.bold = True

    if os.path.exists("extracted_fisat_logo.png"):
        p_cimg = doc.add_paragraph()
        p_cimg.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cimg.paragraph_format.space_before = Pt(14)
        p_cimg.paragraph_format.space_after = Pt(18)
        p_cimg.add_run().add_picture("extracted_fisat_logo.png", width=Inches(1.5))

    p_ctitle = doc.add_paragraph()
    p_ctitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_ctitle.paragraph_format.space_before = Pt(10)
    p_ctitle.paragraph_format.space_after = Pt(24)
    r_ct = p_ctitle.add_run("CERTIFICATE")
    r_ct.font.name = FONT_PRIMARY
    r_ct.font.size = Pt(14)
    r_ct.font.bold = True
    r_ct.underline = True

    p_cb = doc.add_paragraph()
    p_cb.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_cb.paragraph_format.space_before = Pt(0)
    p_cb.paragraph_format.space_after = Pt(100)
    p_cb.paragraph_format.line_spacing = 1.3
    r_cbody = p_cb.add_run(
        "This is to certify that the project report titled “Cyber Companion” submitted by "
        "ANURAG T S (Roll No. FIT25MCA-2008) towards partial fulfillment of the requirements for "
        "the award of the degree of Master of Computer Applications is a record of bonafide work "
        "carried out by him during the year 2026."
    )
    r_cbody.font.name = FONT_PRIMARY
    r_cbody.font.size = Pt(12)

    # Signatures Table
    t_sig = doc.add_table(rows=1, cols=2)
    t_sig.alignment = WD_TABLE_ALIGNMENT.CENTER
    c_left = t_sig.rows[0].cells[0]
    c_right = t_sig.rows[0].cells[1]
    c_left.width = Inches(3.0)
    c_right.width = Inches(3.0)

    p_l = c_left.paragraphs[0]
    p_l.alignment = WD_ALIGN_PARAGRAPH.LEFT
    r_pl1 = p_l.add_run("Project Guide\n\n")
    r_pl1.font.name = FONT_PRIMARY
    r_pl1.font.size = Pt(12)
    r_pl1.font.bold = True
    r_pl2 = p_l.add_run("Dr. Rose Mary Mathew")
    r_pl2.font.name = FONT_PRIMARY
    r_pl2.font.size = Pt(12)

    p_r = c_right.paragraphs[0]
    p_r.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_pr1 = p_r.add_run("Head of the Department\n\n")
    r_pr1.font.name = FONT_PRIMARY
    r_pr1.font.size = Pt(12)
    r_pr1.font.bold = True
    r_pr2 = p_r.add_run("Dr. Shahna K U")
    r_pr2.font.name = FONT_PRIMARY
    r_pr2.font.size = Pt(12)

    doc.add_page_break()

    # PAGE 4: ACKNOWLEDGEMENT (page iii)
    p_ah = doc.add_paragraph()
    p_ah.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_ah.paragraph_format.space_before = Pt(36)
    p_ah.paragraph_format.space_after = Pt(28)
    r_ah = p_ah.add_run("ACKNOWLEDGEMENT")
    r_ah.font.name = FONT_PRIMARY
    r_ah.font.size = Pt(14)
    r_ah.font.bold = True

    add_p(
        doc,
        "I express my deep gratitude to Dr. Jacob Thomas V, Principal, FISAT, for providing the "
        "necessary facilities and support that enabled me to complete my mini project successfully.",
        space_after=14, line_spacing=1.3, size=12
    )
    add_p(
        doc,
        "I extend my sincere thanks to Dr. Shahna K U, Head of the Department of Computer "
        "Applications, FISAT, for her inspiration and encouragement throughout the project.",
        space_after=14, line_spacing=1.3, size=12
    )
    add_p(
        doc,
        "I express my heartfelt gratitude to Dr. Rose Mary Mathew, my Project Guide, for her "
        "valuable suggestions, guidance and support at every stage of the project.",
        space_after=14, line_spacing=1.3, size=12
    )
    add_p(
        doc,
        "I am also grateful to Dr. Deepa Mary Mathews, my Scrum Guide, for her constant "
        "encouragement and unwavering support throughout the project. I extend my sincere "
        "thanks to all the faculty and lab faculty members of the department for their guidance "
        "and assistance.",
        space_after=14, line_spacing=1.3, size=12
    )
    add_p(
        doc,
        "Finally, I thank my friends and family for their valuable suggestions, cooperation, and "
        "encouragement, which contributed to the successful completion of this project.",
        space_after=14, line_spacing=1.3, size=12
    )

    doc.add_page_break()

    # PAGE 5: ABSTRACT (page iv)
    p_absh = doc.add_paragraph()
    p_absh.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_absh.paragraph_format.space_before = Pt(36)
    p_absh.paragraph_format.space_after = Pt(24)
    r_absh = p_absh.add_run("ABSTRACT")
    r_absh.font.name = FONT_PRIMARY
    r_absh.font.size = Pt(14)
    r_absh.font.bold = True

    add_p(
        doc,
        "With the rapid expansion of mobile digital ecosystems and interconnected smartphones, "
        "everyday users are increasingly targeted by complex cyber threats, including Quick Response "
        "(QR) code phishing (quishing), Internationalized Domain Name (IDN) homoglyph spoofing, rogue "
        "Wi-Fi access points, and privacy-invasive mobile applications. Conventional mobile antivirus "
        "tools operate reactively, relying on signature matching after malicious payloads are saved, "
        "transmitting extensive user telemetry to third-party cloud servers, and reporting threats "
        "using obscure error codes that non-technical users cannot interpret. Cyber Companion is a "
        "cross-platform, zero-trust cybersecurity awareness and threat defense system developed for "
        "the Department of Computer Applications, FISAT, designed to replace reactive scanning with "
        "proactive, explainable, and privacy-preserving pre-connection threat defense.",
        space_after=12, line_spacing=1.2, size=11.5
    )
    add_p(
        doc,
        "The primary contribution of Cyber Companion is an interactive 3D Cyber Shield Core powered "
        "by Three.js, which visualizes device security posture as an interactive holographic radar in "
        "real time. A dedicated Pre-Connection Wi-Fi Sentinel inspects 802.11 beacon ciphers, flags "
        "unencrypted or WEP access points, and predicts cyber attack vectors (such as Evil Twin honeypots, "
        "packet sniffing, and fake captive portals) before connection is established. An optical camera "
        "QR scanner features an isolated in-memory execution sandbox that decodes barcode payloads and "
        "previews URLs and operating system intents before execution, halting quishing attacks. An on-device "
        "permission auditor evaluates installed application manifests to detect high-risk sensor combinations "
        "(such as SMS interception paired with Internet transmission) strictly on-device, guaranteeing zero "
        "transmission of user package telemetry to external networks.",
        space_after=12, line_spacing=1.2, size=11.5
    )
    add_p(
        doc,
        "Supporting these capabilities, Cyber Companion incorporates a Threat Intelligence Gateway built "
        "with Node.js and Express that enforces strict Server-Side Request Forgery (SSRF) and DNS-rebinding "
        "guards while querying multi-engine threat consensus (VirusTotal, Google Safe Browsing, and URLhaus) "
        "backed by a 24-hour MongoDB TTL cache. System health is calculated via a pure, monotonic 0–100 "
        "deterministic scoring engine with a 30/30/20/20 weighting model, paired with a grounded Retrieval-"
        "Augmented Generation (RAG) AI assistant that cites structured knowledge bases ([KB-001] to [KB-005]) "
        "with built-in prompt injection guards. Automated benchmark tests across 25 suites and 116 test cases "
        "demonstrate 100% threat detection accuracy with 0% false positives and false negatives, sub-second "
        "local heuristic execution, and seamless operation across Android and modern web browsers.",
        space_after=12, line_spacing=1.2, size=11.5
    )

    doc.add_page_break()

    # PAGE 6: CONTENTS (page v)
    p_conth = doc.add_paragraph()
    p_conth.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p_conth.paragraph_format.space_before = Pt(28)
    p_conth.paragraph_format.space_after = Pt(14)
    r_conth = p_conth.add_run("Contents")
    r_conth.font.name = FONT_PRIMARY
    r_conth.font.size = Pt(20)
    r_conth.font.bold = True

    toc_items_p1 = [
        ("1  INTRODUCTION", "1", True, 0),
        ("2  LITERATURE SURVEY", "4", True, 0),
        ("3  IMPLEMENTATION", "7", True, 0),
        ("3.1  System Architecture", "7", False, 1),
        ("3.1.1  Methodology", "14", False, 2),
        ("3.1.2  Hardware Requirements", "14", False, 2),
        ("3.1.3  Software Requirements", "15", False, 2),
        ("3.2  Database Design", "15", False, 1),
        ("3.3  Modules", "18", True, 0),
        ("3.3.1  THREAT INTELLIGENCE GATEWAY AND SSRF GUARD", "18", False, 2),
        ("3.3.2  INTERACTIVE 3D DASHBOARD AND SECURITY POSTURE CORE", "19", False, 2),
        ("3.3.3  OPTICAL QR SCANNER AND QUISHING SANDBOX", "19", False, 2),
        ("3.3.4  PRE-CONNECTION WI-FI SENTINEL AND ATTACK PREDICTION", "22", False, 2),
        ("3.3.5  ON-DEVICE PERMISSION AUDITOR", "23", False, 2),
        ("3.3.6  DETERMINISTIC 0–100 SCORING ENGINE", "24", False, 2),
        ("3.3.7  GROUNDED RAG AI EXPLAINER AND PROMPT GUARD", "25", False, 2),
        ("3.3.8  AWARENESS HUB AND MICRO-LEARNING", "25", False, 2),
        ("3.3.9  ADMINISTRATIVE CONTROL AND BENCHMARK SUITE", "26", False, 2),
        ("3.3.10  UML Diagrams", "27", False, 2),
        ("3.3.11  Issues Faced and Remedies Taken", "30", False, 2),
        ("3.4  ALGORITHM", "30", True, 0),
        ("4  RESULT ANALYSIS", "35", True, 0),
        ("4.1  Testing, Test Cases and Test Results", "35", False, 1),
        ("4.2  Functional Results", "36", False, 1),
        ("4.3  Threat Detection and Heuristic Performance", "36", False, 1),
        ("4.4  Comparison with Conventional Mobile Security Solutions", "38", False, 1),
        ("4.5  Discussion", "38", False, 1),
        ("5  CONCLUSION AND FUTURE SCOPE", "39", True, 0),
        ("5.1  Conclusion", "39", False, 1),
        ("5.2  Future Scope", "39", False, 1),
        ("6  CODING", "41", True, 0),
        ("6.1  Source Code", "41", False, 1),
        ("6.1.1  app.ts", "41", False, 2),
        ("6.1.2  ssrfGuard.ts", "44", False, 2),
        ("6.1.3  scorer.ts", "45", False, 2),
    ]

    for title, page_no, is_bold, indent_lvl in toc_items_p1:
        p_toc = doc.add_paragraph()
        p_toc.paragraph_format.tab_stops.add_tab_stop(Inches(6.02), WD_TAB_ALIGNMENT.RIGHT)
        p_toc.paragraph_format.space_before = Pt(0)
        p_toc.paragraph_format.space_after = Pt(2.5)
        p_toc.paragraph_format.line_spacing = 1.15
        indent_str = "    " * indent_lvl
        r_t = p_toc.add_run(indent_str + title + "\t" + page_no)
        r_t.font.name = FONT_PRIMARY
        r_t.font.size = Pt(11)
        r_t.font.bold = is_bold

    doc.add_page_break()

    # PAGE 7: CONTENTS (continued) (page vi)
    p_conth2 = doc.add_paragraph()
    p_conth2.paragraph_format.space_before = Pt(36)
    p_conth2.paragraph_format.space_after = Pt(10)

    toc_items_p2 = [
        ("6.1.4  aiExplainerService.ts", "46", False, 2),
        ("7  SCREEN SHOTS", "48", True, 0),
        ("8  REFERENCES", "54", True, 0),
    ]
    for title, page_no, is_bold, indent_lvl in toc_items_p2:
        p_toc = doc.add_paragraph()
        p_toc.paragraph_format.tab_stops.add_tab_stop(Inches(6.02), WD_TAB_ALIGNMENT.RIGHT)
        p_toc.paragraph_format.space_before = Pt(0)
        p_toc.paragraph_format.space_after = Pt(3)
        p_toc.paragraph_format.line_spacing = 1.15
        indent_str = "    " * indent_lvl
        r_t = p_toc.add_run(indent_str + title + "\t" + page_no)
        r_t.font.name = FONT_PRIMARY
        r_t.font.size = Pt(11)
        r_t.font.bold = is_bold

    doc.add_page_break()
