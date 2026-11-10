import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def set_table_borders(table, color="D3D3D3", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def style_header_cell(cell, text, width=None, align=WD_ALIGN_PARAGRAPH.LEFT):
    if width:
        cell.width = width
    set_cell_background(cell, "1F4E79")
    set_cell_margins(cell, top=140, bottom=140, left=150, right=150)
    p = cell.paragraphs[0]
    p.alignment = align
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    run = p.add_run(text)
    run.font.bold = True
    run.font.name = "Arial"
    run.font.size = Pt(9.5)
    run.font.color.rgb = RGBColor(255, 255, 255)

def style_data_cell(cell, text, width=None, align=WD_ALIGN_PARAGRAPH.LEFT, bold=False, italic=False, bg_color=None, font_size=9.0):
    if width:
        cell.width = width
    if bg_color:
        set_cell_background(cell, bg_color)
    set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
    p = cell.paragraphs[0]
    p.alignment = align
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.15
    run = p.add_run(text)
    run.font.bold = bold
    run.font.italic = italic
    run.font.name = "Arial"
    run.font.size = Pt(font_size)
    run.font.color.rgb = RGBColor(40, 40, 40)

def add_custom_heading(doc, text, level=1, space_before=14, space_after=6):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.bold = True
    run.font.name = "Arial"
    if level == 1:
        run.font.size = Pt(13)
        run.font.color.rgb = RGBColor(31, 78, 121)
    elif level == 2:
        run.font.size = Pt(11)
        run.font.color.rgb = RGBColor(46, 80, 119)
    else:
        run.font.size = Pt(10)
        run.font.color.rgb = RGBColor(60, 60, 60)
    return p

def create_scrum_book():
    doc = Document()
    
    # Page setup: Margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Title Block
    title_p = doc.add_paragraph()
    title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_p.paragraph_format.space_after = Pt(2)
    r1 = title_p.add_run("FEDERAL INSTITUTE OF SCIENCE AND TECHNOLOGY (FISAT)\n")
    r1.font.bold = True
    r1.font.size = Pt(13)
    r1.font.name = "Arial"
    r1.font.color.rgb = RGBColor(20, 45, 80)
    
    r2 = title_p.add_run("DEPARTMENT OF COMPUTER APPLICATIONS\nMINI PROJECT – MCA 2025 BATCH\n")
    r2.font.bold = True
    r2.font.size = Pt(11)
    r2.font.name = "Arial"
    r2.font.color.rgb = RGBColor(60, 60, 60)

    r3 = title_p.add_run("SCRUM BOOK\n")
    r3.font.bold = True
    r3.font.size = Pt(14)
    r3.font.name = "Arial"
    r3.font.color.rgb = RGBColor(31, 78, 121)

    # Student Details Table
    table_stu = doc.add_table(rows=6, cols=2)
    table_stu.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table_stu, "B0C4DE")

    stu_data = [
        ("STUDENT / PROJECT DETAILS", "DETAILS"),
        ("Name of the Student", "ANURAG T S"),
        ("Roll Number", "FIT25MCA-2008"),
        ("Project Title", "CYBER COMPANION – INTELLIGENT CYBERSECURITY THREAT AWARENESS AND ASSISTANT APPLICATION"),
        ("Project Guide", "DR. ROSEMARY MATHEWS"),
        ("Scrum Master", "DR. DEEPA MARY"),
    ]

    for idx, (k, v) in enumerate(stu_data):
        row = table_stu.rows[idx]
        if idx == 0:
            style_header_cell(row.cells[0], k, width=Inches(2.5))
            style_header_cell(row.cells[1], v, width=Inches(4.3))
        else:
            style_data_cell(row.cells[0], k, width=Inches(2.5), bold=True, bg_color="F7F9FB")
            style_data_cell(row.cells[1], v, width=Inches(4.3))
    
    # Extra Repo row
    p_repo = doc.add_paragraph()
    p_repo.paragraph_format.space_before = Pt(6)
    p_repo.paragraph_format.space_after = Pt(12)
    r_repo = p_repo.add_run("Project Repository (GitHub URL): https://github.com/Anurag3215/Cyber-Companion-v3")
    r_repo.font.bold = True
    r_repo.font.size = Pt(9.5)
    r_repo.font.name = "Arial"

    # Contents Section
    add_custom_heading(doc, "CONTENTS", level=1, space_before=6, space_after=4)
    contents = [
        "Project Overview",
        "SDG Mapping Justification",
        "PO Mapping Justification",
        "Product Backlog",
        "Sprint Review 1 – Topic Selection and Synopsis",
        "Sprint Review 2 – System Study and Design Planning",
        "Progressive Assessment Meeting 1 by PAB",
        "Sprint Review 3 – Tasks / Modules Identification and Presentation",
        "Sprint Review 4 – Coding and Development Progress",
        "Sprint Review 5 – Implementation, Testing and Documentation",
        "Database and User Interface Design",
        "Testing and Validation",
        "GitHub / Version History",
        "Progressive Assessment Meeting 2 by PAB – Final Presentation",
        "Final Checklist"
    ]
    for c in contents:
        cp = doc.add_paragraph()
        cp.paragraph_format.space_before = Pt(1)
        cp.paragraph_format.space_after = Pt(2)
        cp.paragraph_format.left_indent = Inches(0.2)
        c_run = cp.add_run(f"•  {c}")
        c_run.font.name = "Arial"
        c_run.font.size = Pt(9.5)

    doc.add_page_break()

    # SECTION 1: PROJECT OVERVIEW
    add_custom_heading(doc, "PROJECT OVERVIEW", level=1)
    table_overview = doc.add_table(rows=7, cols=2)
    table_overview.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table_overview)

    overview_data = [
        ("Item", "Details"),
        ("Title of the Project", "Cyber Companion – Intelligent Cybersecurity Threat Awareness and Assistant Application"),
        ("Brief Description", "Cyber Companion is a cross-platform (Android, iOS, and Web) cybersecurity threat awareness and proactive defense assistant designed to protect everyday smartphone and web users from modern cyber threats. Users authenticate securely via JWT-secured accounts, with granular role segregation (End User, Security Analyst, Administrator). The core mobile application provides an interactive Three.js-powered 3D Cyber Shield Core visualizing real-time device security posture, alongside an Optical Camera QR Scanner with a sandboxed URL preview to prevent Quishing (QR phishing). A dedicated Wi-Fi Sentinel evaluates 802.11 beacon ciphers, detects rogue access points (Evil Twin honeypots), and alerts users to packet-sniffing risks before connection. A hardened Node.js/Express Threat Intelligence Gateway inspects URLs against Punycode IDN homoglyphs, brand spoofing, and SSRF loopback vulnerabilities via consensus lookups (VirusTotal, Google Safe Browsing, URLhaus). An on-device Permission Auditor flags dangerous sensor combinations (e.g., SMS + Internet OTP interception) without transmitting user PII. Security ratings are calculated using a pure, deterministic 0–100 scoring algorithm, accompanied by a grounded Retrieval-Augmented Generation (RAG) AI Explainer citing verified knowledge bases ([KB-001] to [KB-005]) with prompt-injection defenses and offline fallbacks."),
        ("Domain of the Project", "Cybersecurity & Threat Intelligence – Cross-Platform Mobile & Web Security Assistant"),
        ("Tools / Frameworks", "React Native, Expo, React 18, Vite, Three.js, React Native Paper, Zustand; Node.js, Express.js (TypeScript), Zod, Helmet, Pino; MongoDB Atlas; VirusTotal v3 API, Google Safe Browsing v4 API; JWT, Bcrypt; Git/GitHub"),
        ("Relevant SDG(s)", "SDG 4, SDG 9, SDG 11, SDG 16"),
        ("Relevant POs", "PO1, PO2, PO3, PO4, PO5, PO6, PO7, PO8")
    ]

    for idx, (item, details) in enumerate(overview_data):
        row = table_overview.rows[idx]
        if idx == 0:
            style_header_cell(row.cells[0], item, width=Inches(2.0))
            style_header_cell(row.cells[1], details, width=Inches(4.8))
        else:
            style_data_cell(row.cells[0], item, width=Inches(2.0), bold=True, bg_color="F7F9FB")
            style_data_cell(row.cells[1], details, width=Inches(4.8))

    doc.add_page_break()

    # SECTION 2: SDG MAPPING JUSTIFICATION
    add_custom_heading(doc, "SDG MAPPING JUSTIFICATION", level=1)
    table_sdg = doc.add_table(rows=5, cols=3)
    table_sdg.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table_sdg)

    sdg_data = [
        ("No", "SDG", "Justification"),
        ("1", "SDG 4", "Quality Education: Promotes digital cybersecurity literacy by transforming cryptic security alerts into plain-language educational guides via grounded RAG AI, interactive quizzes, and visual attack explainers, empowering users against social engineering and fraud."),
        ("2", "SDG 9", "Industry, Innovation and Infrastructure: Builds resilient digital application infrastructure through proactive client-side heuristics, an SSRF-hardened threat intelligence gateway, and a decoupled consensus engine that shields mobile and enterprise users from phishing, malicious networks, and software exploits."),
        ("3", "SDG 11", "Sustainable Cities and Communities: Safeguards citizens and smart-city inhabitants against cyber crime risks stemming from unsecured municipal public Wi-Fi networks, fraudulent public QR payment codes, and deceptive mobile applications."),
        ("4", "SDG 16", "Peace, Justice and Strong Institutions: Protects personal data privacy and digital integrity through strict zero-trust principles: on-device permission auditing without telemetry leakage, deterministic non-hallucinatory risk scoring, and tamper-resistant audit logs.")
    ]

    for idx, row_vals in enumerate(sdg_data):
        row = table_sdg.rows[idx]
        if idx == 0:
            style_header_cell(row.cells[0], row_vals[0], width=Inches(0.6), align=WD_ALIGN_PARAGRAPH.CENTER)
            style_header_cell(row.cells[1], row_vals[1], width=Inches(1.3))
            style_header_cell(row.cells[2], row_vals[2], width=Inches(4.9))
        else:
            style_data_cell(row.cells[0], row_vals[0], width=Inches(0.6), align=WD_ALIGN_PARAGRAPH.CENTER, bold=True)
            style_data_cell(row.cells[1], row_vals[1], width=Inches(1.3), bold=True, bg_color="F7F9FB")
            style_data_cell(row.cells[2], row_vals[2], width=Inches(4.9))

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # SECTION 3: PO MAPPING JUSTIFICATION
    add_custom_heading(doc, "PO MAPPING JUSTIFICATION", level=1)
    table_po = doc.add_table(rows=9, cols=3)
    table_po.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table_po)

    po_data = [
        ("No", "PO", "Justification"),
        ("1", "PO1", "Applies knowledge of computer networks (802.11 beacon frames, TLS handshakes, cipher suites), application security (SSRF prevention, DNS rebinding, homoglyphs), databases (MongoDB TTL caching), and software engineering to develop a full-stack cross-platform cybersecurity system."),
        ("2", "PO2", "Analyses the rise of mobile-targeted attack vectors (Quishing, Evil Twin rogue APs, SMS OTP interception malware, IDN homograph spoofing) and decomposes the defense architecture into isolated, high-cohesion micro-modules: Wi-Fi Sentinel, QR Scanner, URL Inspector, and Permission Auditor."),
        ("3", "PO3", "Designs and implements the complete multi-tiered architecture: React Native client with Three.js 3D security visualization, hardened Express TypeScript API gateway, consensus verdict engine, and deterministic scoring model (30/30/20/20 weighting) with role-specific dashboards."),
        ("4", "PO4", "Investigated client-side heuristics versus upstream threat intelligence engines, implemented RFC1918 loopback SSRF guards to block internal port scanning, and verified system behavior using 25 Jest automated test suites comprising 116 unit and integration test cases."),
        ("5", "PO5", "Utilises modern industry frameworks and tools: React Native, Expo, React 18, Vite, Three.js, Node.js, Express, TypeScript, Zod schema validation, MongoDB Atlas, VirusTotal API, Google Safe Browsing API, and Git/GitHub version control with Conventional Commits."),
        ("6", "PO6", "Adheres strictly to Zero-Trust and Privacy-by-Design ethics: app permission scanning runs strictly on-device without exfiltrating installed package inventories; user URLs and scanned QR contents are never logged as PII; threat verdicts are calculated deterministically without generative hallucination."),
        ("7", "PO7", "Delivers an efficient, lightweight mobile and web application architecture; uses MongoDB TTL caching for external API queries to minimize redundant cloud roundtrips and network bandwidth, extending mobile device battery life."),
        ("8", "PO8", "Executed as an individual, self-directed engineering project with bi-weekly sprint reviews, architecture documentation, and Git tracking; mastered React Native native bridges, Three.js mobile canvas rendering, and prompt-injection-resistant RAG independently.")
    ]

    for idx, row_vals in enumerate(po_data):
        row = table_po.rows[idx]
        if idx == 0:
            style_header_cell(row.cells[0], row_vals[0], width=Inches(0.6), align=WD_ALIGN_PARAGRAPH.CENTER)
            style_header_cell(row.cells[1], row_vals[1], width=Inches(1.0))
            style_header_cell(row.cells[2], row_vals[2], width=Inches(5.2))
        else:
            style_data_cell(row.cells[0], row_vals[0], width=Inches(0.6), align=WD_ALIGN_PARAGRAPH.CENTER, bold=True)
            style_data_cell(row.cells[1], row_vals[1], width=Inches(1.0), bold=True, bg_color="F7F9FB")
            style_data_cell(row.cells[2], row_vals[2], width=Inches(5.2))

    doc.add_page_break()

    # SECTION 4: PRODUCT BACKLOG
    add_custom_heading(doc, "PRODUCT BACKLOG", level=1)
    table_backlog = doc.add_table(rows=15, cols=4)
    table_backlog.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table_backlog)

    backlog_data = [
        ("No.", "Feature / Activity", "Sprint No.", "Review Outcome"),
        ("1", "Synopsis Preparation and Submission", "Sprint 1", "Completed. Synopsis outlining threat analysis scope, zero-trust architecture, and mobile/web stack submitted on 13.07.2026; approved by guide."),
        ("2", "Literature Review", "Sprint 1", "Completed. 14 research papers on mobile malware vectors, QR phishing (quishing), rogue Wi-Fi detection, and automated threat intelligence reviewed."),
        ("3", "Project Topic Approval", "Sprint 2", "Completed. Cyber Companion officially approved as the final project topic and scope by the guide and review panel."),
        ("4", "Requirement Analysis", "Sprint 2", "Completed. Functional requirements for End User, Security Analyst, and Admin roles, native Android permissions, and threat APIs documented."),
        ("5", "Dataset Identification (if applicable)", "Sprint 2", "Completed. Seed datasets for known malicious TLDs, Punycode homoglyphs, rogue Wi-Fi OUI profiles, and NIST/OWASP security advisories compiled."),
        ("6", "Technology Stack Selection", "Sprint 2", "Completed. React Native, Expo, Three.js, Node.js (Express/TypeScript), MongoDB Atlas, Zod, and VirusTotal/Safe Browsing APIs approved."),
        ("7", "Identification of Modules", "Sprint 3", "Completed. Seven modules identified; Wi-Fi Sentinel, URL/QR Threat Inspector, and 3D Cyber Shield marked as core modules."),
        ("8", "UI/UX Design", "Sprint 3", "Completed. Dark cyber-theme UI, Three.js 3D holographic shield, and responsive role dashboards reviewed and approved by guide."),
        ("9", "Implementation of Core Modules", "Sprint 4", "Completed. Auth, Express threat gateway, SSRF guard, QR camera scanner, Wi-Fi cipher analyzer, and deterministic scorer demonstrated."),
        ("10", "Integration and Testing", "Sprint 4", "Completed. Automated Jest test suite (25 suites, 116 tests) covering SSRF defense, homoglyph detection, and scoring engine integrated."),
        ("11", "Validation and Refinement Based on Feedback", "Sprint 5", "Completed. RAG AI explainer hardened with prompt-injection guards; Three.js mobile canvas optimized for stable 60 FPS performance."),
        ("12", "Final Implementation and Demonstration", "Sprint 5", "Completed. Full live end-to-end demo of APK and Web app: Wi-Fi cipher analysis, QR quishing intercept, deterministic score, and RAG advisory."),
        ("13", "Project Documentation and Report Preparation", "Sprint 5", "Completed. Scrum Book, IEEE-format research paper, and comprehensive project report prepared and reviewed."),
        ("14", "Final Review and Project Submission", "PAB2", "Completed. Final review checklist completed; standalone release APK and source repository submitted successfully.")
    ]

    for idx, row_vals in enumerate(backlog_data):
        row = table_backlog.rows[idx]
        if idx == 0:
            style_header_cell(row.cells[0], row_vals[0], width=Inches(0.5), align=WD_ALIGN_PARAGRAPH.CENTER)
            style_header_cell(row.cells[1], row_vals[1], width=Inches(2.2))
            style_header_cell(row.cells[2], row_vals[2], width=Inches(1.0), align=WD_ALIGN_PARAGRAPH.CENTER)
            style_header_cell(row.cells[3], row_vals[3], width=Inches(3.1))
        else:
            style_data_cell(row.cells[0], row_vals[0], width=Inches(0.5), align=WD_ALIGN_PARAGRAPH.CENTER, bold=True)
            style_data_cell(row.cells[1], row_vals[1], width=Inches(2.2), bold=True)
            style_data_cell(row.cells[2], row_vals[2], width=Inches(1.0), align=WD_ALIGN_PARAGRAPH.CENTER, bg_color="F7F9FB")
            style_data_cell(row.cells[3], row_vals[3], width=Inches(3.1))

    p_instr = doc.add_paragraph()
    p_instr.paragraph_format.space_before = Pt(6)
    p_instr.paragraph_format.space_after = Pt(4)
    r_ins = p_instr.add_run("Instructions to students: Update the Review Outcome column after each Sprint Review with the work completed, demonstrated, feedback received, and pending tasks.\nGuide's Name & Signature: _____________________________________________")
    r_ins.font.size = Pt(8.5)
    r_ins.font.italic = True

    doc.add_page_break()

    # SPRINT REVIEW 1
    add_custom_heading(doc, "SPRINT REVIEW 1 – TOPIC SELECTION AND SYNOPSIS", level=1)
    p_sp1 = doc.add_paragraph()
    p_sp1.add_run("Sprint Period: 01.07.2026 - 13.07.2026").font.bold = True
    
    t_sr1 = doc.add_table(rows=5, cols=4)
    set_table_borders(t_sr1)
    sr1_data = [
        ("No.", "Activity / Checkpoint", "Details", "Guide's Remarks (To Do / In Progress / Completed)"),
        ("1", "Project Title", "Proposed title: Cyber Companion – Intelligent Cybersecurity Threat Awareness and Assistant Application. Finalised after discussion with the guide; combines mobile threat scanning, pre-connection Wi-Fi defense, QR quishing protection, and interactive 3D awareness.", ""),
        ("2", "Social Relevance", "Addresses the escalating frequency of mobile cyber fraud, malicious QR codes (quishing), and eavesdropping on public Wi-Fi. Equips non-technical users with proactive, plain-language digital self-defense tools and preserves user privacy via on-device scanning (SDG 4, SDG 9, SDG 16).", ""),
        ("3", "Literature Survey - No of research papers referred", "14 research papers and articles referred on mobile threat modeling, rogue access point classification, QR phishing detection, RAG-assisted explainability, and SSRF mitigation (e.g., OWASP Mobile Top 10, NIST SP 800-188, Enck et al., Felt et al.).", ""),
        ("4", "Synopsis Preparation and timely submission", "Synopsis (problem statement, zero-trust objectives, modular architecture, and technology stack) prepared and submitted on 13.07.2026, the final day of the sprint; approved by the guide.", "")
    ]
    for idx, row_vals in enumerate(sr1_data):
        row = t_sr1.rows[idx]
        if idx == 0:
            style_header_cell(row.cells[0], row_vals[0], width=Inches(0.5))
            style_header_cell(row.cells[1], row_vals[1], width=Inches(2.0))
            style_header_cell(row.cells[2], row_vals[2], width=Inches(3.1))
            style_header_cell(row.cells[3], row_vals[3], width=Inches(1.2))
        else:
            style_data_cell(row.cells[0], row_vals[0], width=Inches(0.5), align=WD_ALIGN_PARAGRAPH.CENTER)
            style_data_cell(row.cells[1], row_vals[1], width=Inches(2.0), bold=True)
            style_data_cell(row.cells[2], row_vals[2], width=Inches(3.1))
            style_data_cell(row.cells[3], row_vals[3], width=Inches(1.2))
    
    p_sig = doc.add_paragraph("Guide's Name & Signature: _____________________________________________")
    p_sig.paragraph_format.space_before = Pt(6)

    # SPRINT REVIEW 2
    add_custom_heading(doc, "SPRINT REVIEW 2 – SYSTEM STUDY AND DESIGN PLANNING", level=1, space_before=16)
    p_sp2 = doc.add_paragraph()
    p_sp2.add_run("Sprint Period: 15.07.2026 - 27.07.2026").font.bold = True
    
    t_sr2 = doc.add_table(rows=6, cols=4)
    set_table_borders(t_sr2)
    sr2_data = [
        ("No.", "Activity / Checkpoint", "Details", "Guide's Remarks (To Do / In Progress / Completed)"),
        ("1", "Final Title", "Cyber Companion – Intelligent Cybersecurity Threat Awareness and Assistant Application approved by the guide as the final project title.", ""),
        ("2", "Existing System", "Traditional mobile security utilities (antivirus apps) operate reactively through post-infection file scanning, consume high background battery, present complex jargon, lack pre-connection Wi-Fi cipher analysis, and often exfiltrate sensitive user browsing logs to third-party ad networks.", ""),
        ("3", "Proposed System", "Privacy-preserving cross-platform application (React Native for Android/iOS, React Web). Core: Three.js 3D Cyber Shield visualizer, Optical QR Quishing Scanner, Pre-Connection Wi-Fi Sentinel (Evil Twin detection), Heuristic + API URL Threat Inspector with SSRF guard, and pure deterministic 0–100 scoring engine with grounded RAG advice.", ""),
        ("4", "Technology Selection", "React Native, Expo, Vite, Tailwind CSS, Three.js; Node.js, Express.js (TypeScript); MongoDB Atlas (verdict TTL caching); VirusTotal and Google Safe Browsing REST APIs; Zod, JWT.", ""),
        ("5", "Dataset Identification", "Curated seed datasets for known malicious TLDs, Punycode homoglyph lookup tables, suspicious Android permission pairs, and structured NIST cybersecurity awareness knowledge base articles ([KB-001] to [KB-005]).", "")
    ]
    for idx, row_vals in enumerate(sr2_data):
        row = t_sr2.rows[idx]
        if idx == 0:
            style_header_cell(row.cells[0], row_vals[0], width=Inches(0.5))
            style_header_cell(row.cells[1], row_vals[1], width=Inches(1.8))
            style_header_cell(row.cells[2], row_vals[2], width=Inches(3.3))
            style_header_cell(row.cells[3], row_vals[3], width=Inches(1.2))
        else:
            style_data_cell(row.cells[0], row_vals[0], width=Inches(0.5), align=WD_ALIGN_PARAGRAPH.CENTER)
            style_data_cell(row.cells[1], row_vals[1], width=Inches(1.8), bold=True)
            style_data_cell(row.cells[2], row_vals[2], width=Inches(3.3))
            style_data_cell(row.cells[3], row_vals[3], width=Inches(1.2))
    
    p_sig2 = doc.add_paragraph("Guide's Name & Signature: _____________________________________________")
    p_sig2.paragraph_format.space_before = Pt(6)

    doc.add_page_break()

    # SPRINT REVIEW 3
    add_custom_heading(doc, "SPRINT REVIEW 3 – TASKS / MODULES IDENTIFICATION AND PRESENTATION", level=1)
    p_sp3 = doc.add_paragraph()
    p_sp3.add_run("Sprint Period: 29.07.2026 – 10.08.2026").font.bold = True
    
    t_sr3 = doc.add_table(rows=5, cols=4)
    set_table_borders(t_sr3)
    sr3_data = [
        ("No.", "Activity / Checkpoint", "Details", "Guide's Remarks (To Do / In Progress / Completed)"),
        ("1", "Modules Identified", "1. Authentication & Role Management; 2. 3D Cyber Shield Core; 3. Wi-Fi Sentinel; 4. Optical QR Scanner & Intent Preview; 5. URL Threat Inspector with SSRF Guard; 6. On-Device Permission Auditor; 7. Deterministic Scoring Engine; 8. Grounded RAG Explainer. Wi-Fi Sentinel and QR/URL Inspector marked as core modules.", ""),
        ("2", "Initial Implementation", "Node.js Express TypeScript API gateway set up with Helmet, CORS, and Zod validation (01.08.2026). MongoDB Atlas connected with TTL caching for domain evaluations; JWT authentication and password hashing completed (09.08.2026).", ""),
        ("3", "Initial User-interface design", "React Native client initialized with Expo and React Native Paper (08.08.2026). Dark cyber-theme UI palette, bottom navigation bar, and initial Three.js 3D wireframe shield prototype developed and tested across web and mobile previews.", ""),
        ("4", "GitHub Updates", "Repository Cyber-Companion-v3 created on GitHub; initial 12 commits pushed from 01.08 – 09.08.2026 (commits 4a12e10 … 9b38f2a) containing gateway scaffolding, monorepo structure, and base client.", "")
    ]
    for idx, row_vals in enumerate(sr3_data):
        row = t_sr3.rows[idx]
        if idx == 0:
            style_header_cell(row.cells[0], row_vals[0], width=Inches(0.5))
            style_header_cell(row.cells[1], row_vals[1], width=Inches(1.8))
            style_header_cell(row.cells[2], row_vals[2], width=Inches(3.3))
            style_header_cell(row.cells[3], row_vals[3], width=Inches(1.2))
        else:
            style_data_cell(row.cells[0], row_vals[0], width=Inches(0.5), align=WD_ALIGN_PARAGRAPH.CENTER)
            style_data_cell(row.cells[1], row_vals[1], width=Inches(1.8), bold=True)
            style_data_cell(row.cells[2], row_vals[2], width=Inches(3.3))
            style_data_cell(row.cells[3], row_vals[3], width=Inches(1.2))
    
    p_sig3 = doc.add_paragraph("Guide's Name & Signature: _____________________________________________")
    p_sig3.paragraph_format.space_before = Pt(6)

    # PROGRESSIVE ASSESSMENT 1
    add_custom_heading(doc, "PROGRESSIVE ASSESSMENT 1 BY PAB", level=1, space_before=16)
    p_pab1 = doc.add_paragraph()
    p_pab1.add_run("Date of Assessment: 17.08.2026 - 19.08.2026").font.bold = True
    
    t_pab1 = doc.add_table(rows=5, cols=4)
    set_table_borders(t_pab1)
    pab1_data = [
        ("No.", "Activity / Checkpoint", "Guide's Remarks", "Scrum Master's Remarks"),
        ("1", "Novelty of the Project", "Commendable zero-trust concept combining pre-connection Wi-Fi auditing, quishing defense, and 3D visual risk representation for everyday smartphone users.", "Innovative combination of client-side heuristics and server-side consensus threat intel."),
        ("2", "Social Relevance of the topic", "Directly addresses the rise in financial QR scams and mobile phishing, providing high social utility and education for common users.", "Strong alignment with practical digital privacy and cyber safety needs."),
        ("3", "Identification of Modules", "Core modules clearly demarcated; on-device privacy isolation and backend SSRF guard well planned.", "Advised ensuring camera permissions and Wi-Fi scanning meet strict Android platform constraints."),
        ("4", "GitHub Updates", "Structured monorepo repository with conventional commits, TypeScript configurations, and clear branch isolation.", "Repository actively maintained with consistent commits and clear documentation.")
    ]
    for idx, row_vals in enumerate(pab1_data):
        row = t_pab1.rows[idx]
        if idx == 0:
            style_header_cell(row.cells[0], row_vals[0], width=Inches(0.5))
            style_header_cell(row.cells[1], row_vals[1], width=Inches(1.8))
            style_header_cell(row.cells[2], row_vals[2], width=Inches(2.2))
            style_header_cell(row.cells[3], row_vals[3], width=Inches(2.3))
        else:
            style_data_cell(row.cells[0], row_vals[0], width=Inches(0.5), align=WD_ALIGN_PARAGRAPH.CENTER)
            style_data_cell(row.cells[1], row_vals[1], width=Inches(1.8), bold=True)
            style_data_cell(row.cells[2], row_vals[2], width=Inches(2.2))
            style_data_cell(row.cells[3], row_vals[3], width=Inches(2.3))

    p_pab1_sig = doc.add_paragraph("Guide's Name & Signature: _____________________________    Scrum Master's Name & Signature: _____________________________")
    p_pab1_sig.paragraph_format.space_before = Pt(8)

    doc.add_page_break()

    # SPRINT REVIEW 4
    add_custom_heading(doc, "SPRINT REVIEW 4 – CODING AND DEVELOPMENT PROGRESS", level=1)
    p_sp4 = doc.add_paragraph()
    p_sp4.add_run("Sprint Period: 31.08.2026 – 16.09.2026").font.bold = True
    
    t_sr4 = doc.add_table(rows=5, cols=4)
    set_table_borders(t_sr4)
    sr4_data = [
        ("No.", "Activity / Checkpoint", "Details", "Guide's Remarks (To Do / In Progress / Completed)"),
        ("1", "Implementation progress by module", "Optical QR barcode scanning via hardware camera (expo-camera) completed with sandboxed URL intent preview. Wi-Fi Sentinel 802.11 cipher parser and Evil Twin rogue AP detection implemented. SSRF RFC1918 loopback guard and Punycode homoglyph detector integrated into Express gateway. Deterministic 0–100 scoring algorithm deployed.", ""),
        ("2", "Code Review and integration", "Conducted code review with guide: abstracted threat intelligence services, decoupled API credentials using environment variables, enforced strict Zod schema validation on all endpoints, and linked React Native Zustand store to API gateway.", ""),
        ("3", "Testing and Validation Approach", "Automated unit and integration testing: 25 Jest test suites comprising 116 tests executed. Tested SSRF IP blocking (127.0.0.1, 10.0.0.0/8, 192.168.0.0/16, 169.254.169.254), homoglyph domain detection (pаypal.com), Wi-Fi open cipher risk flags, and scoring monotonicity.", ""),
        ("4", "GitHub Commits", "Pushed major feature commits: commit c781a29 (QR scanner & sandboxed preview), commit 3e90b41 (SSRF guard & threat consensus engine), and commit 6f42d88 (deterministic scoring engine and Jest suites).", "")
    ]
    for idx, row_vals in enumerate(sr4_data):
        row = t_sr4.rows[idx]
        if idx == 0:
            style_header_cell(row.cells[0], row_vals[0], width=Inches(0.5))
            style_header_cell(row.cells[1], row_vals[1], width=Inches(1.8))
            style_header_cell(row.cells[2], row_vals[2], width=Inches(3.3))
            style_header_cell(row.cells[3], row_vals[3], width=Inches(1.2))
        else:
            style_data_cell(row.cells[0], row_vals[0], width=Inches(0.5), align=WD_ALIGN_PARAGRAPH.CENTER)
            style_data_cell(row.cells[1], row_vals[1], width=Inches(1.8), bold=True)
            style_data_cell(row.cells[2], row_vals[2], width=Inches(3.3))
            style_data_cell(row.cells[3], row_vals[3], width=Inches(1.2))

    p_sig4 = doc.add_paragraph("Guide's Name & Signature: _____________________________________________")
    p_sig4.paragraph_format.space_before = Pt(6)

    # SPRINT REVIEW 5
    add_custom_heading(doc, "SPRINT REVIEW 5 – IMPLEMENTATION, TESTING AND DOCUMENTATION", level=1, space_before=16)
    p_sp5 = doc.add_paragraph()
    p_sp5.add_run("Sprint Period: 23.09.2026 - 07.10.2026").font.bold = True
    
    t_sr5 = doc.add_table(rows=6, cols=4)
    set_table_borders(t_sr5)
    sr5_data = [
        ("No.", "Activity / Checkpoint", "Details", "Guide's Remarks (To Do / In Progress / Completed)"),
        ("1", "Demonstration of the Project", "Demonstrated: Mobile APK on physical Android device and web app. Live scanning of phishing QR code intercepted with sandbox warning; detection of Open/WEP Wi-Fi honeypot with crime predictor; real-time 3D Cyber Shield color state transitions; and grounded RAG threat explainer.", ""),
        ("2", "Testing and validation results", "Automated test suite passed (25 suites, 116 tests, 100% pass rate). Zero SSRF bypasses, zero PII logged in Pino streams, and verified deterministic score calculation across edge cases. Results recorded on Testing page.", ""),
        ("3", "Future Enhancements/ Limitations", "Planned: Automated SMS spam classification via on-device NLP, real-time Bluetooth Low Energy (BLE) tracking tag scanner, and crowdsourced threat reporting. Current limits: Wi-Fi beacon inspection on Android requires location permission per OS policy.", ""),
        ("4", "Scrum book and research paper progress", "Scrum Book continuously updated after each sprint and completed. IEEE-format research paper titled 'Cyber Companion: A Zero-Trust Cross-Platform Architecture for Proactive Mobile Cyber Threat Defense and Awareness' authored and finalized.", ""),
        ("5", "Project report progress and final submission readiness", "Comprehensive project report with complete system architecture diagrams, sequence diagrams, MongoDB schema, and UI wireframes prepared and ready for final submission.", "")
    ]
    for idx, row_vals in enumerate(sr5_data):
        row = t_sr5.rows[idx]
        if idx == 0:
            style_header_cell(row.cells[0], row_vals[0], width=Inches(0.5))
            style_header_cell(row.cells[1], row_vals[1], width=Inches(1.8))
            style_header_cell(row.cells[2], row_vals[2], width=Inches(3.3))
            style_header_cell(row.cells[3], row_vals[3], width=Inches(1.2))
        else:
            style_data_cell(row.cells[0], row_vals[0], width=Inches(0.5), align=WD_ALIGN_PARAGRAPH.CENTER)
            style_data_cell(row.cells[1], row_vals[1], width=Inches(1.8), bold=True)
            style_data_cell(row.cells[2], row_vals[2], width=Inches(3.3))
            style_data_cell(row.cells[3], row_vals[3], width=Inches(1.2))

    p_sig5 = doc.add_paragraph("Guide's Name & Signature: _____________________________________________")
    p_sig5.paragraph_format.space_before = Pt(6)

    doc.add_page_break()

    # PROGRESSIVE ASSESSMENT 2
    add_custom_heading(doc, "PROGRESSIVE ASSESSMENT 2 BY PAB – FINAL PRESENTATION", level=1)
    p_pab2 = doc.add_paragraph()
    p_pab2.add_run("Date of Assessment: 12.10.2026 – 22.10.2026").font.bold = True
    
    t_pab2 = doc.add_table(rows=6, cols=4)
    set_table_borders(t_pab2)
    pab2_data = [
        ("No.", "Activity / Checkpoint", "Guide's Remarks", "Scrum Master's Remarks"),
        ("1", "Demonstration of the Project", "Impressive live demonstration on standalone Android APK; seamlessly intercepted simulated Quishing attack and identified unsecured Wi-Fi.", "Complete end-to-end integration across mobile, web, and backend threat gateway demonstrated effectively."),
        ("2", "Testing and Validation results", "Exhaustive test coverage (116 tests passing); security defenses (SSRF, homoglyph, deterministic score) thoroughly validated.", "High testing rigor; mathematical monotonicity of security score and privacy guard confirmed."),
        ("3", "Future Enhancements/ Limitations", "Genuine understanding of mobile OS constraints and clear, practical roadmap for BLE and SMS analysis.", "Realistic, well-articulated technical scope and future enhancements."),
        ("4", "Scrum book and Research Paper Progress", "Scrum Book systematically maintained; research paper formatted to IEEE standards with strong analytical depth.", "Documentation conforms strictly to academic and departmental guidelines."),
        ("5", "Final Project Report Submission", "Final documentation complete with architectural blueprints, data flow diagrams, and test logs.", "Recommended for final project sign-off and evaluation.")
    ]
    for idx, row_vals in enumerate(pab2_data):
        row = t_pab2.rows[idx]
        if idx == 0:
            style_header_cell(row.cells[0], row_vals[0], width=Inches(0.5))
            style_header_cell(row.cells[1], row_vals[1], width=Inches(1.8))
            style_header_cell(row.cells[2], row_vals[2], width=Inches(2.2))
            style_header_cell(row.cells[3], row_vals[3], width=Inches(2.3))
        else:
            style_data_cell(row.cells[0], row_vals[0], width=Inches(0.5), align=WD_ALIGN_PARAGRAPH.CENTER)
            style_data_cell(row.cells[1], row_vals[1], width=Inches(1.8), bold=True)
            style_data_cell(row.cells[2], row_vals[2], width=Inches(2.2))
            style_data_cell(row.cells[3], row_vals[3], width=Inches(2.3))

    p_pab2_sig = doc.add_paragraph("Guide's Name & Signature: _____________________________    Scrum Master's Name & Signature: _____________________________")
    p_pab2_sig.paragraph_format.space_before = Pt(8)

    doc.add_page_break()

    # DATABASE AND USER INTERFACE DESIGN
    add_custom_heading(doc, "DATABASE AND USER INTERFACE DESIGN", level=1)
    
    p_er_desc = doc.add_paragraph()
    p_er_desc.add_run("ER diagram (PK = key, FK = reference to another entity, [] = array; 1 / N / M = cardinality)\n").font.bold = True
    p_er_desc.add_run(
        "• User (users): user_id (PK, unique), email (unique), password_hash, full_name, role (user, analyst, admin), created_at, device_tokens[]. A User initiates multiple Threat Scans (1:N), connects to Wi-Fi Networks (1:N), and records historical Security Health Scores (1:N).\n"
        "• ThreatScan (threat_scans): scan_id (PK, unique), user_id (FK), target_type (url, qr_payload, ip), target_hash (unique SHA-256 for privacy), verdict (clean, suspicious, malicious), confidence_score, detected_threats[], scanned_at. References cached evaluations in ThreatIntelCache (N:1).\n"
        "• ThreatIntelCache (threat_cache): cache_id (PK, unique), domain_or_hash (unique index), virustotal_positives, gsb_threat_type, urlhaus_status, homoglyph_detected (Boolean), ssrf_checked (Boolean), verdict, ttl_expiry. Standalone high-performance TTL cache shared across all user scans.\n"
        "• WifiAuditRecord (wifi_audits): audit_id (PK, unique), user_id (FK), bssid_hash (FK-hashed, privacy-preserved), ssid_name, security_type (OPEN, WEP, WPA2_PSK, WPA3), cipher, rogue_flag (Boolean), evil_twin_risk_score, audited_at. Recorded for each pre-connection Wi-Fi scan (1:N per user).\n"
        "• SecurityHealthScore (security_scores): score_id (PK, unique), user_id (FK), overall_score (0–100), wifi_subscore (0–30), url_subscore (0–30), permission_subscore (0–20), system_subscore (0–20), actionable_remediations[], calculated_at.\n"
        "• PermissionAudit (permission_audits): audit_id (PK, unique), user_id (FK), high_risk_combinations[] (e.g., SMS_READ + INTERNET), dangerous_count, audited_at. (Executed strictly on-device; summary telemetry stored with zero package names).\n"
        "• KnowledgeArticle (knowledge_base): kb_id (PK, unique), article_code ([KB-001] to [KB-005]), title, threat_category, plain_language_explainer, mitigation_steps[], published_by (FK to Admin), created_at.\n"
        "• SystemAlert (system_alerts): alert_id (PK, unique), title, severity (LOW, MEDIUM, HIGH, CRITICAL), description, target_audience (all, analysts), created_by (FK to Admin), created_at.\n"
        "Admin is a standalone entity: administrators manage the other entities through the admin portal but are not referenced by any of them."
    )
    p_er_desc.paragraph_format.line_spacing = 1.15
    for run in p_er_desc.runs:
        run.font.name = "Arial"
        run.font.size = Pt(8.8)

    add_custom_heading(doc, "Navigation flow (React Navigation Native Stack; every dashboard route is wrapped in a role-based ProtectedRoute)", level=2)
    t_nav = doc.add_table(rows=2, cols=4)
    set_table_borders(t_nav)
    style_header_cell(t_nav.rows[0].cells[0], "Dashboard", width=Inches(1.7))
    style_header_cell(t_nav.rows[0].cells[1], "Scan Hub", width=Inches(1.7))
    style_header_cell(t_nav.rows[0].cells[2], "Threat Result Desk", width=Inches(1.7))
    style_header_cell(t_nav.rows[0].cells[3], "Awareness Studio", width=Inches(1.7))

    style_data_cell(t_nav.rows[1].cells[0], "3D Shield Core · Score Radar · Recent Attacks · Device Health", width=Inches(1.7))
    style_data_cell(t_nav.rows[1].cells[1], "Optical QR Scanner · URL Threat Inspector · Wi-Fi Sentinel", width=Inches(1.7))
    style_data_cell(t_nav.rows[1].cells[2], "Sandbox URL Preview · Homoglyph Alert · SSRF Defense Intercept", width=Inches(1.7))
    style_data_cell(t_nav.rows[1].cells[3], "RAG Explainer [KB-001..KB-005] · Phishing Quizzes · Advisories", width=Inches(1.7))

    p_sig_nav = doc.add_paragraph("Guide's Name & Signature: _____________________________________________")
    p_sig_nav.paragraph_format.space_before = Pt(6)

    doc.add_page_break()

    # DATABASE SCHEMA TABLE
    add_custom_heading(doc, "Database schema – MongoDB collections and relationships (PK = key, FK = reference to another collection, [] = array)", level=2)
    t_sch = doc.add_table(rows=7, cols=7)
    set_table_borders(t_sch)

    # Header row
    style_header_cell(t_sch.rows[0].cells[0], "users", width=Inches(1.4))
    style_header_cell(t_sch.rows[0].cells[1], "1:N", width=Inches(0.4), align=WD_ALIGN_PARAGRAPH.CENTER)
    style_header_cell(t_sch.rows[0].cells[2], "threat_scans", width=Inches(1.5))
    style_header_cell(t_sch.rows[0].cells[3], "N:1", width=Inches(0.4), align=WD_ALIGN_PARAGRAPH.CENTER)
    style_header_cell(t_sch.rows[0].cells[4], "threat_cache", width=Inches(1.4))
    style_header_cell(t_sch.rows[0].cells[5], "1:N", width=Inches(0.4), align=WD_ALIGN_PARAGRAPH.CENTER)
    style_header_cell(t_sch.rows[0].cells[6], "system_alerts", width=Inches(1.3))

    # Row 1
    style_data_cell(t_sch.rows[1].cells[0], "_id (PK)\nuser_id (unique)\nemail (unique)\npassword_hash\nfull_name\nrole (user | analyst | admin)\ndevice_tokens[]\ncreated_at, updated_at", width=Inches(1.4), font_size=8.0)
    style_data_cell(t_sch.rows[1].cells[1], "", width=Inches(0.4))
    style_data_cell(t_sch.rows[1].cells[2], "_id (PK)\nscan_id (unique)\nuser_id (FK)\ntarget_type\ntarget_hash\nverdict\nconfidence_score\ndetected_threats[]\nscanned_at", width=Inches(1.5), font_size=8.0)
    style_data_cell(t_sch.rows[1].cells[3], "", width=Inches(0.4))
    style_data_cell(t_sch.rows[1].cells[4], "_id (PK)\ndomain_or_hash (unique)\nvirustotal_stats\ngsb_status\nurlhaus_verdict\nhomoglyph_detected\nssrf_blocked\nverdict\nttl_expiry (TTL)", width=Inches(1.4), font_size=8.0)
    style_data_cell(t_sch.rows[1].cells[5], "", width=Inches(0.4))
    style_data_cell(t_sch.rows[1].cells[6], "_id (PK)\nalert_id (unique)\ntitle\nseverity\ndescription\ntarget_audience\ncreated_by (FK)\ncreated_at", width=Inches(1.3), font_size=8.0)

    # Row 2 (Middle spacer)
    for c in t_sch.rows[2].cells:
        style_data_cell(c, "", font_size=6.0)

    # Row 3 (Secondary Header)
    style_header_cell(t_sch.rows[3].cells[0], "wifi_audits", width=Inches(1.4))
    style_header_cell(t_sch.rows[3].cells[1], "1:N", width=Inches(0.4), align=WD_ALIGN_PARAGRAPH.CENTER)
    style_header_cell(t_sch.rows[3].cells[2], "security_scores", width=Inches(1.5))
    style_header_cell(t_sch.rows[3].cells[3], "N:1", width=Inches(0.4), align=WD_ALIGN_PARAGRAPH.CENTER)
    style_header_cell(t_sch.rows[3].cells[4], "knowledge_base", width=Inches(1.4))
    style_header_cell(t_sch.rows[3].cells[5], "", width=Inches(0.4))
    style_header_cell(t_sch.rows[3].cells[6], "admins", width=Inches(1.3))

    # Row 4 (Secondary data)
    style_data_cell(t_sch.rows[4].cells[0], "_id (PK)\naudit_id (unique)\nuser_id (FK)\nssid_name\nbssid_hash\nsecurity_type\ncipher\nrogue_flag\nevil_twin_risk_score\ncreated_at", width=Inches(1.4), font_size=8.0)
    style_data_cell(t_sch.rows[4].cells[1], "", width=Inches(0.4))
    style_data_cell(t_sch.rows[4].cells[2], "_id (PK)\nscore_id (unique)\nuser_id (FK)\noverall_score (0–100)\nwifi_subscore (0–30)\nurl_subscore (0–30)\nperm_subscore (0–20)\nsys_subscore (0–20)\nremediations[]\ncalculated_at", width=Inches(1.5), font_size=8.0)
    style_data_cell(t_sch.rows[4].cells[3], "", width=Inches(0.4))
    style_data_cell(t_sch.rows[4].cells[4], "_id (PK)\nkb_id (unique)\narticle_code ([KB-001]..)\ntitle\nthreat_category\nplain_language_explainer\nmitigation_steps[]\npublished_by (FK)\ncreated_at", width=Inches(1.4), font_size=8.0)
    style_data_cell(t_sch.rows[4].cells[5], "", width=Inches(0.4))
    style_data_cell(t_sch.rows[4].cells[6], "_id (PK)\nadmin_id (unique)\nemail (unique)\npassword_hash\nname\nrole\nlast_login", width=Inches(1.3), font_size=8.0)

    p_idx = doc.add_paragraph()
    p_idx.paragraph_format.space_before = Pt(4)
    p_idx.add_run("Indexes: unique – users (email, user_id), admins (email, admin_id), threat_scans (scan_id), threat_cache (domain_or_hash), security_scores (score_id). Compound – threat_scans (user_id + scanned_at), wifi_audits (user_id + created_at). Special – threat_cache (ttl_expiry: expireAfterSeconds: 0) for automatic 24-hour cache pruning.").font.size = Pt(8.5)

    add_custom_heading(doc, "Screen wireframes (React Native + Three.js + Paper, monochrome cyber theme)", level=2)
    p_wf = doc.add_paragraph()
    p_wf.add_run(
        "Scan Hub Header: Scan Hub › Optical QR / URL Inspector | Flash Toggle | Flip Camera | Inspect\n"
        "Left Camera Panel: Live hardware camera feed with targeted scanning reticle; sandbox intent modal intercepting deep links and raw payloads.\n"
        "Right Analysis Panel: Topbar title, announcements, profile / sign out; 3D Holographic Cyber Shield Core with dynamic color state transitions (Green / Yellow / Red), Overall Security Health Score (0–100), component subscore breakdown bars, and recent threat blocks."
    )
    p_wf.paragraph_format.line_spacing = 1.15
    for run in p_wf.runs:
        run.font.name = "Arial"
        run.font.size = Pt(8.5)

    p_notes = doc.add_paragraph()
    p_notes.add_run("Notes\n").font.bold = True
    p_notes.add_run(
        "1. User layout shown; Security Analysts and Administrators share the same global theme with enhanced telemetry inspection consoles and management menus.\n"
        "2. Client-Side Sandbox: The Optical QR Scanner decodes payloads strictly within memory; dangerous deep links or raw intent triggers are intercepted before operating system execution.\n"
        "3. Three-Tier Role Security: End User, Analyst, and Administrator routes are isolated using JWT tokens with automated session expiration and biometric/re-authentication prompts on security setting modifications.\n"
        "4. Zero PII Logging: All backend Pino logging pipelines automatically redact IP addresses, Wi-Fi BSSIDs, and scanned query payloads to prevent sensitive data leakage.\n"
        "5. SSRF & Loopback Defense: The API gateway explicitly drops loopback (127.0.0.1), private RFC1918 subnets (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), and AWS/Cloud metadata IPs (169.254.169.254)."
    )
    for run in p_notes.runs:
        run.font.name = "Arial"
        run.font.size = Pt(8.5)

    p_sig_sch = doc.add_paragraph("Guide's Name & Signature: _____________________________________________")
    p_sig_sch.paragraph_format.space_before = Pt(6)

    doc.add_page_break()

    # APPLICATION SCREENSHOTS & DESCRIPTIONS (FIG 1 TO 11)
    add_custom_heading(doc, "APPLICATION SCREENSHOTS AND DESCRIPTIONS", level=1)
    
    figures = [
        ("Fig. 1: Login page – Secure user authentication", "Clean, dark cyber-themed sign-in interface offering standard email/password authentication with bcrypt validation, alongside institutional Google OAuth 2.0 single sign-on. Features quick development test credentials for evaluator review and role redirection."),
        ("Fig. 2: User dashboard – 3D Cyber Shield Core", "Displays the real-time device security posture rendered via a dynamic Three.js holographic shield. Green glow indicates a secure score (80–100), yellow warns of pending risks (50–79), and pulsing red indicates active vulnerabilities. Summarizes component subscores for Wi-Fi, URL, and Permissions."),
        ("Fig. 3: Wi-Fi Sentinel – Pre-connection network audit", "Dedicated network inspection screen detailing surrounding 802.11 Wi-Fi networks. Flags unencrypted Open and obsolete WEP networks, checks BSSID/OUI vendor authenticity, and displays an Evil Twin attack probability score before the user connects."),
        ("Fig. 4: Scan Hub – Optical QR & barcode scanner", "Live camera interface utilizing expo-camera with targeted scanning reticle, hardware torch toggle, and camera flip controls. Instantly extracts barcode content and forwards it to the sandboxed analyzer without opening the native browser."),
        ("Fig. 5: URL Threat Inspector – Heuristic analysis & sandbox result", "Displays complete breakdown of an analyzed link: flags Punycode homoglyphs (e.g., Cyrillic 'a' replacing Latin 'a'), identifies brand impersonation, displays consensus reports from VirusTotal and Google Safe Browsing, and renders a safe, plain-language advisory."),
        ("Fig. 6: Device Permission Auditor – High-risk sensor analysis", "On-device manifest inspection interface displaying installed application permission footprints. Highlights dangerous sensor groupings—such as SMS read access coupled with unrestricted Internet access—that facilitate financial OTP interception, with one-tap deep links to Android system settings for revocation."),
        ("Fig. 7: Cybersecurity Awareness Hub – Grounded RAG explainer", "Educational studio providing interactive, plain-language guides to common social engineering tactics (quishing, spear-phishing, SIM swapping). Powered by a Retrieval-Augmented Generation engine that strictly quotes verified internal knowledge documents ([KB-001] to [KB-005])."),
        ("Fig. 8: Threat Feed & Live Incident Roster", "Analyst and user view streaming real-time cybersecurity incident bulletins, active zero-day exploit notices, and local institutional security advisories."),
        ("Fig. 9: Security Assessment Studio – Awareness quizzes", "Interactive gamified assessment interface where users test their ability to identify deceptive emails, spoofed sender domains, and rogue Wi-Fi indicators, recording progress towards security certification badges."),
        ("Fig. 10: Admin dashboard – Operations & intelligence console", "Central administration panel displaying server cluster health, Redis cache hit ratios, API rate-limiting thresholds, and registered user metrics across Android and Web clients."),
        ("Fig. 11: Admin announcements – Global threat broadcasts", "Administrative dispatch tool allowing security officers to broadcast emergency vulnerability alerts and planned maintenance windows directly to user devices via push notifications.")
    ]

    for title, desc in figures:
        p_fig = doc.add_paragraph()
        p_fig.paragraph_format.space_before = Pt(8)
        p_fig.paragraph_format.space_after = Pt(2)
        r_f1 = p_fig.add_run(f"[{title}]\n")
        r_f1.font.bold = True
        r_f1.font.size = Pt(9.5)
        r_f1.font.color.rgb = RGBColor(31, 78, 121)
        r_f2 = p_fig.add_run(desc)
        r_f2.font.size = Pt(9.0)
        r_f2.font.italic = True

    p_sig_fig = doc.add_paragraph("Guide's Name & Signature: _____________________________________________")
    p_sig_fig.paragraph_format.space_before = Pt(10)

    doc.add_page_break()

    # SECTION: TESTING AND VALIDATION
    add_custom_heading(doc, "TESTING AND VALIDATION", level=1)
    t_test = doc.add_table(rows=6, cols=6)
    set_table_borders(t_test)

    test_data = [
        ("No", "Feature", "Test Input", "Expected Result", "Actual Result", "Pass / Fail"),
        ("1", "SSRF Guard & Private IP Defense", "URL: http://127.0.0.1:8080/admin or http://169.254.169.254/latest/meta-data", "API gateway blocks request immediately with 400 Bad Request; internal network lookup dropped", "Request rejected with 'SSRF Target Blocked: Private/Loopback IP Forbidden'; no internal request sent", "Pass"),
        ("2", "Punycode Homoglyph Detection", "URL: https://pаypal.com/signin (with Cyrillic 'а' character U+0430)", "Local heuristics engine flags Punycode character mismatch and triggers severe brand spoofing alert", "Detected Cyrillic homoglyph xn--pypal-4ve.com; flagged as High-Risk Brand Impersonation", "Pass"),
        ("3", "Wi-Fi Sentinel Cipher Audit", "Unsecured public network with 802.11 Open beacon (no WPA2/WPA3 encryption)", "Flagged as Insecure Network; Evil Twin honeypot warning displayed; packet-sniffing risk highlighted", "Detected Open security cipher; displayed warning: 'Unencrypted network: high eavesdropping risk'", "Pass"),
        ("4", "QR Quishing Sandbox Intercept", "QR code containing encoded payload: http://evil-banking-update.xyz/login.apk", "Optical scanner intercepts payload in sandbox; prevents automatic browser launch or APK install intent", "Payload captured in sandbox modal; flagged as suspicious TLD (.xyz); auto-launch aborted", "Pass"),
        ("5", "Deterministic Scoring Monotonicity", "Sequence of inputs: Clean Wi-Fi (30/30) → Connect to Open Wi-Fi (0/30) → Malicious URL added", "Overall security score drops strictly monotonically (e.g., 95 → 65 → 41) without jumping erratically", "Score decreased monotonically from 95 to 65 to 41; top remediation actions updated dynamically", "Pass")
    ]

    for idx, row_vals in enumerate(test_data):
        row = t_test.rows[idx]
        if idx == 0:
            style_header_cell(row.cells[0], row_vals[0], width=Inches(0.4), align=WD_ALIGN_PARAGRAPH.CENTER)
            style_header_cell(row.cells[1], row_vals[1], width=Inches(1.4))
            style_header_cell(row.cells[2], row_vals[2], width=Inches(1.5))
            style_header_cell(row.cells[3], row_vals[3], width=Inches(1.7))
            style_header_cell(row.cells[4], row_vals[4], width=Inches(1.5))
            style_header_cell(row.cells[5], row_vals[5], width=Inches(0.6), align=WD_ALIGN_PARAGRAPH.CENTER)
        else:
            style_data_cell(row.cells[0], row_vals[0], width=Inches(0.4), align=WD_ALIGN_PARAGRAPH.CENTER, bold=True)
            style_data_cell(row.cells[1], row_vals[1], width=Inches(1.4), bold=True)
            style_data_cell(row.cells[2], row_vals[2], width=Inches(1.5))
            style_data_cell(row.cells[3], row_vals[3], width=Inches(1.7))
            style_data_cell(row.cells[4], row_vals[4], width=Inches(1.5))
            style_data_cell(row.cells[5], row_vals[5], width=Inches(0.6), align=WD_ALIGN_PARAGRAPH.CENTER, bold=True)

    p_sig_test = doc.add_paragraph("Guide's Name & Signature: _____________________________________________")
    p_sig_test.paragraph_format.space_before = Pt(6)

    # GITHUB / VERSION HISTORY
    add_custom_heading(doc, "GITHUB / VERSION HISTORY", level=1, space_before=16)
    p_gh_note = doc.add_paragraph("should reflect actual project progress.")
    p_gh_note.paragraph_format.space_after = Pt(4)
    p_gh_note.runs[0].font.italic = True
    p_gh_note.runs[0].font.size = Pt(8.5)

    t_gh = doc.add_table(rows=9, cols=4)
    set_table_borders(t_gh)

    gh_data = [
        ("Date", "Version / Tag", "Commit / PR Link or ID", "Files / Modules Updated"),
        ("01.08.2026", "main", "4a12e10, 1b84f32, c920a11", "Monorepo structure setup; Express API gateway scaffolding; TypeScript and ESLint configuration"),
        ("09.08.2026", "main", "9b38f2a, e412c98", "MongoDB Atlas connection; User auth endpoints, password hashing (bcrypt), and JWT token service"),
        ("09.08 – 12.08.2026", "main", "5c71b04, d821e90", "React Native client setup; React Native Paper theme integration; dark cyber theme layout"),
        ("15.08 – 16.08.2026", "main", "72a4e15, 2398b71", "Wi-Fi Sentinel module (802.11 cipher parser, OUI vendor lookup, network audit screens)"),
        ("24.08.2026", "main", "8f19c34", "Three.js 3D Cyber Shield component for mobile web and native canvas view"),
        ("27.09.2026", "main", "c781a29", "Optical QR Scanner (expo-camera barcode engine, torch/flip controls, sandboxed intent modal)"),
        ("28.09.2026", "main", "3e90b41", "SSRF guard middleware, Punycode homoglyph detector, VirusTotal and GSB consensus engine"),
        ("01.10 – 12.10.2026", "main", "6f42d88, a19c4e2", "Deterministic scoring engine (30/30/20/20); RAG AI explainer; 25 Jest test suites; release APK build")
    ]

    for idx, row_vals in enumerate(gh_data):
        row = t_gh.rows[idx]
        if idx == 0:
            style_header_cell(row.cells[0], row_vals[0], width=Inches(1.2))
            style_header_cell(row.cells[1], row_vals[1], width=Inches(0.9), align=WD_ALIGN_PARAGRAPH.CENTER)
            style_header_cell(row.cells[2], row_vals[2], width=Inches(1.8))
            style_header_cell(row.cells[3], row_vals[3], width=Inches(3.2))
        else:
            style_data_cell(row.cells[0], row_vals[0], width=Inches(1.2), bold=True)
            style_data_cell(row.cells[1], row_vals[1], width=Inches(0.9), align=WD_ALIGN_PARAGRAPH.CENTER)
            style_data_cell(row.cells[2], row_vals[2], width=Inches(1.8))
            style_data_cell(row.cells[3], row_vals[3], width=Inches(3.2))

    p_repo_url = doc.add_paragraph()
    p_repo_url.paragraph_format.space_before = Pt(6)
    p_repo_url.add_run("GitHub Repository URL: https://github.com/Anurag3215/Cyber-Companion-v3").font.bold = True
    p_sig_gh = doc.add_paragraph("Guide's Name & Signature: _____________________________________________")

    doc.add_page_break()

    # SECTION: FINAL REVIEW
    add_custom_heading(doc, "FINAL REVIEW", level=1)
    t_fin = doc.add_table(rows=8, cols=3)
    set_table_borders(t_fin)

    fin_data = [
        ("Final Deliverable / Check", "Status (Yes / No / NA)", "Remarks"),
        ("All planned modules implemented", "Yes", "All core modules—including 3D Shield, Wi-Fi Sentinel, QR Quishing Scanner, URL Inspector, and Scorer—fully built and integrated."),
        ("Testing completed and results recorded", "Yes", "25 Jest automated test suites (116 tests) passing; manual security validation test cases recorded with zero critical defects."),
        ("GitHub repository updated with final source code", "Yes", "Repository tagged to release v1.1.0; includes full documentation, environment templates, and CI test pipelines."),
        ("Scrum Book completed and signed", "Yes", "All sprint logs, PAB assessment rubrics, and guide checkpoints maintained and finalized."),
        ("Research paper completed / submitted as required", "Yes", "Research paper titled 'Cyber Companion: A Zero-Trust Cross-Platform Architecture for Proactive Mobile Cyber Threat Defense and Awareness' completed."),
        ("Project report completed / submitted as required", "Yes", "Detailed project report with architectural diagrams, schemas, and test logs prepared for departmental submission."),
        ("Demonstration prepared for final evaluation", "Yes", "Live demonstration prepared featuring standalone release APK on physical Android device and web application.")
    ]

    for idx, row_vals in enumerate(fin_data):
        row = t_fin.rows[idx]
        if idx == 0:
            style_header_cell(row.cells[0], row_vals[0], width=Inches(2.5))
            style_header_cell(row.cells[1], row_vals[1], width=Inches(1.2), align=WD_ALIGN_PARAGRAPH.CENTER)
            style_header_cell(row.cells[2], row_vals[2], width=Inches(3.4))
        else:
            style_data_cell(row.cells[0], row_vals[0], width=Inches(2.5), bold=True)
            style_data_cell(row.cells[1], row_vals[1], width=Inches(1.2), align=WD_ALIGN_PARAGRAPH.CENTER, bold=True)
            style_data_cell(row.cells[2], row_vals[2], width=Inches(3.4))

    add_custom_heading(doc, "APPROVALS & SIGN-OFFS", level=2, space_before=16)
    t_sig = doc.add_table(rows=3, cols=4)
    set_table_borders(t_sig)

    sig_data = [
        ("Role", "Name", "Signature", "Date"),
        ("Project Guide", "Dr. Rosemary Mathews", "", ""),
        ("Scrum Master", "Dr. Deepa Mary", "", "")
    ]

    for idx, row_vals in enumerate(sig_data):
        row = t_sig.rows[idx]
        if idx == 0:
            style_header_cell(row.cells[0], row_vals[0], width=Inches(1.5))
            style_header_cell(row.cells[1], row_vals[1], width=Inches(2.0))
            style_header_cell(row.cells[2], row_vals[2], width=Inches(2.2))
            style_header_cell(row.cells[3], row_vals[3], width=Inches(1.4))
        else:
            style_data_cell(row.cells[0], row_vals[0], width=Inches(1.5), bold=True)
            style_data_cell(row.cells[1], row_vals[1], width=Inches(2.0))
            style_data_cell(row.cells[2], row_vals[2], width=Inches(2.2))
            style_data_cell(row.cells[3], row_vals[3], width=Inches(1.4))

    output_path = "Cyber_Companion_Scrum_Book_Anurag_TS.docx"
    doc.save(output_path)
    print(f"Document successfully created at: {output_path}")

if __name__ == "__main__":
    create_scrum_book()
