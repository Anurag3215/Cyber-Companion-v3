import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT
from docx.enum.table import WD_TABLE_ALIGNMENT
from report_helpers import (
    add_p, add_bullet, add_chapter_title, add_h1, add_h2, add_h3,
    add_subheading_bold, add_figure_image, add_table_header,
    set_cell_margins, set_cell_background, set_table_borders,
    FONT_PRIMARY, COLOR_TEXT
)

def build_chapter_3_a(doc):
    # PAGE 14 (Report Page 7): Chapter 3 Implementation & Architecture
    add_chapter_title(doc, "3", "Implementation")
    add_p(
        doc,
        "This chapter describes how Cyber Companion is built: the overall architecture, the database design, "
        "the functional modules, and the main algorithms that implement the Pre-Connection Wi-Fi Sentinel, "
        "the Optical QR Quishing Sandbox, the deterministic 0–100 scoring engine, and the grounded RAG AI Explainer.",
        space_after=8, line_spacing=1.15
    )

    add_h1(doc, "3.1 System Architecture")
    add_p(
        doc,
        "Cyber Companion follows a decoupled three-tier client–server architecture. The presentation tier is a cross-platform "
        "React Native application running on Android, iOS, and modern web browsers; it contains the interactive 3D Cyber Shield "
        "Core, the Scan Hub, the Awareness Hub, and the Profile settings. The application tier is a high-performance Node.js "
        "service utilizing Express and TypeScript, exposing a versioned REST API under /v1. It is organized into modular route "
        "handlers (threat, health, tips, admin) and a decoupled service layer executing lexical heuristics, threat consensus, "
        "and AI explanations. The data tier is MongoDB Atlas, providing high-throughput storage for cached verdicts, micro-learning "
        "tips, and administrator audit logs. Two external integrations complete the architecture: upstream Threat Intelligence "
        "APIs (VirusTotal v3, Google Safe Browsing v4, URLhaus) and Android native hardware bindings for Wi-Fi and optical camera sensors.",
        space_after=6, line_spacing=1.15
    )

    add_figure_image(
        doc,
        "report_assets/fig_3_1_architecture.png",
        "Figure 3.1: System architecture of Cyber Companion",
        width=Inches(5.6)
    )

    add_p(
        doc,
        "Every request originating from the client application is validated against strict Zod schema contracts before processing. "
        "Administrative routes enforce RFC 6238 Time-Based One-Time Password (TOTP) authentication and issue scoped session tokens. "
        "A zero-trust Server-Side Request Forgery (SSRF) and DNS-rebinding guard intercepts incoming inspection requests, verifying that "
        "destination hosts do not map to private, loopback, or link-local network segments before upstream queries are permitted.",
        space_after=6, line_spacing=1.15
    )

    doc.add_page_break()

    # PAGE 15 (Report Page 8): Layers
    add_subheading_bold(doc, "Presentation layer")
    add_p(
        doc,
        "The presentation layer is implemented with React Native and Expo, delivering a responsive user interface across Android "
        "smartphones, tablets, and desktop web browsers. Shared navigation hierarchies, reactive Zustand state management, "
        "reusable Glassmorphism design primitives, and toast notifications are leveraged across all user screens. The central "
        "interactive element is the 3D Cyber Shield Core, rendered in real time via Three.js and WebGL. The shield dynamically reflects "
        "the device's security health: mutating from a steady emerald geometry with high-frequency harmonic pulsation when secure, "
        "to an erratic, crimson-tinted faceted shield when critical threats (such as open Wi-Fi or active phishing links) are detected.",
        space_after=6, line_spacing=1.15
    )
    add_p(
        doc,
        "The client application handles user interaction and preliminary lexical evaluation, but does not make authoritative "
        "threat decisions independently. To minimize latency and prevent network round-trips for obvious attacks, the client "
        "runs on-device heuristics—evaluating Cyrillic IDN homoglyphs, suspicious top-level domains (.zip, .top, .mov), and IP literal "
        "hostnames—before querying the Threat Intelligence Gateway. Local inspection history is persisted encrypted on-device to prevent "
        "accidental data loss, ensuring complete user privacy.",
        space_after=8, line_spacing=1.15
    )

    add_subheading_bold(doc, "Application layer")
    add_p(
        doc,
        "The application layer is a Node.js and Express service written in TypeScript, exposing a versioned RESTful interface under /v1. "
        "Route controllers separate health verification, threat intelligence lookups, cyber awareness tips, and administrative "
        "benchmarking. Incoming request payloads are strictly parsed and validated against Zod schemas prior to service execution. "
        "An SSRF protection middleware normalizes hostnames—decoding hex, octal, and dword integer IP representations—and verifies "
        "against RFC 1918 private subnets and cloud metadata endpoints (169.254.169.254).",
        space_after=6, line_spacing=1.15
    )
    add_p(
        doc,
        "Service functions orchestrate multi-engine threat aggregation. When a URL inspection is triggered, the service first queries "
        "the MongoDB 24-hour TTL verdict cache. On a cache miss, the service dispatches concurrent queries to VirusTotal v3, Google "
        "Safe Browsing v4, and URLhaus. A consensus algorithm computes an aggregated confidence score. Global error handlers, Helmet "
        "security headers, structured Pino logging with automated PII redaction, and IP-based rate limiters protect the gateway against "
        "denial-of-service abuse.",
        space_after=8, line_spacing=1.15
    )

    add_subheading_bold(doc, "Data layer and external integrations")
    add_p(
        doc,
        "MongoDB Atlas serves as the persistence engine. Document collections model threat verdict caches, byte-sized cyber tips, "
        "administrative credentials, threat logs, and the cybersecurity knowledge base. Time-To-Live (TTL) indexes automatically purge "
        "expired threat evaluations after 24 hours to ensure fresh threat telemetry. Upstream intelligence integrations (VirusTotal and "
        "Google Safe Browsing) are encapsulated behind resilient adapter interfaces with configurable timeouts, ensuring the gateway "
        "remains responsive even during external API degradation.",
        space_after=6, line_spacing=1.15
    )

    doc.add_page_break()

    # PAGE 16 (Report Page 9): Security & Trust Boundaries
    add_p(
        doc,
        "Google Safe Browsing provides real-time URL reputation analysis against known malware distributors and social engineering "
        "portals. VirusTotal coordinates consensus across commercial antivirus engines. URLhaus provides rapid identification of active "
        "payload distribution sites. These services are isolated behind defensive adapter abstractions, allowing graceful fallback to local "
        "heuristics and cached verdicts if an external service encounters network timeouts or rate exhaustion.",
        space_after=6, line_spacing=1.15
    )
    add_p(
        doc,
        "The context and data-flow diagrams below illustrate the system boundary, data stores, external threat APIs, and the "
        "flow of security telemetry between mobile users, gateway services, and administrators.",
        space_after=8, line_spacing=1.15
    )

    add_subheading_bold(doc, "Security, trust boundaries and failure handling")
    add_p(
        doc,
        "All incoming HTTP requests to the Threat Intelligence Gateway pass through defensive security boundaries. The SSRF guard "
        "resolves target domain names via DNS and rejects any IP address falling within loopback (127.0.0.0/8), private (10.0.0.0/8, "
        "172.16.0.0/12, 192.168.0.0/16), link-local (169.254.0.0/16), or IPv6 unspecified subnets (::1, ::). This eliminates the "
        "possibility of attackers exploiting the gateway as an open proxy to probe FISAT campus intranet infrastructure.",
        space_after=6, line_spacing=1.15
    )
    add_p(
        doc,
        "Strict on-device scopes govern client-side telemetry collection. The Pre-Connection Wi-Fi Sentinel evaluates 802.11 beacon ciphers "
        "using native Android WifiManager APIs, but never transmits the user's BSSID or geographic location to the server. Similarly, "
        "the Application Permission Auditor evaluates manifest permissions purely within local memory; package lists are never uploaded. "
        "This architectural choice upholds the zero-PII privacy guarantee mandated in Section 1.4.",
        space_after=6, line_spacing=1.15
    )
    add_p(
        doc,
        "External integrations incorporate explicit fault isolation. When external threat APIs fail or encounter rate limits, the system "
        "falls back to internal lexical heuristics and cached verdicts rather than presenting unhandled errors to the user. Database "
        "connection pools and index verification occur during application bootstrap, while the /v1/health endpoint provides real-time "
        "operational diagnostics for gateway uptime and upstream feed connectivity.",
        space_after=6, line_spacing=1.15
    )

    doc.add_page_break()

    # PAGE 17 (Report Page 10): Context Diagram
    add_figure_image(
        doc,
        "report_assets/fig_3_2_context.png",
        "Figure 3.2: Cyber Companion context diagram and external information flows",
        width=Inches(5.5)
    )

    add_p(
        doc,
        "Smartphone users submit URLs, scan optical QR codes, trigger Wi-Fi beacon checks, and run permission audits; in response, "
        "they receive real-time 0–100 security scores, interactive 3D shield animations, plain-language risk explanations, and contextual "
        "remediation steps. The Android OS hardware delivers raw camera frames, 802.11 beacon ciphers, and installed application package "
        "manifests to local sensor collectors. The Threat Intelligence Gateway evaluates target domain hashes against VirusTotal and "
        "Google Safe Browsing feeds, enforcing SSRF validation and returning aggregated verdicts. Administrators authenticate via TOTP "
        "to execute threat benchmarks, clear stale caches, author cyber awareness tips, and inspect operational gateway metrics. "
        "External threat intelligence ecosystems remain strictly isolated beyond verified network boundaries.",
        space_after=6, line_spacing=1.15
    )

    doc.add_page_break()

    # PAGE 18 (Report Page 11): DFD Level 1
    add_figure_image(
        doc,
        "report_assets/fig_3_3_dfd_l1.png",
        "Figure 3.3: Level-one data-flow diagram for Cyber Companion",
        width=Inches(5.6)
    )

    add_p(
        doc,
        "The level-one data-flow view decomposes the system into seven primary operational processes: 1.0 Optical QR & Link Intake, "
        "2.0 Local Heuristics & SSRF Verification, 3.0 Threat Intelligence Gateway & Consensus, 4.0 Pre-Connection Wi-Fi Sentinel, "
        "5.0 On-Device Permission Auditor, 6.0 Pure Deterministic Scorer, and 7.0 Grounded RAG AI Explainer. These processes interact "
        "with persistent data stores including D1 (Local Encrypted Storage), D2 (MongoDB 24-Hour TTL Verdict Cache), D3 (Cyber Knowledge "
        "Base & Tips), and D4 (Administrative Audit & Benchmark Logs). Process 1.0 extracts URLs from camera frames without executing "
        "intents; Process 2.0 strips homoglyphs and blocks loopback targets; Process 3.0 queries upstream APIs; Process 6.0 synthesizes "
        "all telemetry into a monotonic 0–100 score; and Process 7.0 produces plain-language remediation.",
        space_after=6, line_spacing=1.15
    )

    doc.add_page_break()

    # PAGE 19 (Report Page 12): DFD Persistent Stores
    add_figure_image(
        doc,
        "report_assets/fig_3_4_dfd_stores.png",
        "Figure 3.4: Data-flow view of Cyber Companion processes, integrations and data stores",
        width=Inches(5.5)
    )

    add_p(
        doc,
        "This data-flow view makes the persistent data stores explicit. D1 (Local Encrypted Storage) stores user inspection history, "
        "gamified streak counters, and client preferences entirely on-device using encrypted key-value storage. D2 (MongoDB Atlas "
        "TTL Verdict Cache) maintains SHA-256 domain hashes, multi-engine analysis results, and confidence ratings, automatically purging "
        "records after 24 hours to enforce telemetry freshness. D3 (Cyber Knowledge Base & Tips) stores structured RFC/NIST guidance "
        "articles ([KB-001] to [KB-005]) and bite-sized tips curated at a 6th-grade reading level. D4 (Admin Audit Store) logs TOTP "
        "authentication events, benchmark verification executions, and gateway configuration updates.",
        space_after=6, line_spacing=1.15
    )

    doc.add_page_break()

    # PAGE 20 (Report Page 13): Process Interactions by Role
    add_figure_image(
        doc,
        "report_assets/fig_3_5_dfd_roles.png",
        "Figure 3.5: Data-flow diagram for role-based process interactions",
        width=Inches(5.5)
    )

    add_p(
        doc,
        "The process-interaction view highlights the clear boundary between everyday end-users and system administrators. Smartphone "
        "users interact with client-facing modules: triggering optical QR scans, testing suspicious URLs, analyzing Wi-Fi beacon ciphers, "
        "auditing installed app permissions, observing 3D shield posture transformations, and reading daily awareness tips. Administrators "
        "interact with privileged operational services: authenticating via RFC 6238 TOTP two-factor tokens, executing the 25-suite automated "
        "benchmark suite, invalidating stale verdict cache records, and reviewing system latency metrics. All administrative actions "
        "are captured in structured audit logs, ensuring accountability across the gateway infrastructure.",
        space_after=6, line_spacing=1.15
    )

    doc.add_page_break()

    # PAGE 21 (Report Page 14): Sequence Diagram & Requirements
    add_figure_image(
        doc,
        "report_assets/fig_3_6_seq_threat.png",
        "Figure 3.6: Sequence diagram for URL Threat Inspection & Consensus Execution",
        width=Inches(5.6)
    )

    add_p(
        doc,
        "The sequence view illustrates a representative URL threat inspection. When a user submits a suspicious link or scans a QR "
        "code, the mobile client executes local lexical heuristics. The payload is transmitted to the gateway via POST /v1/threat/inspect. "
        "The SSRF guard resolves the target IP and halts requests targeting private subnets. The gateway checks the MongoDB TTL cache; on a "
        "miss, it concurrently queries VirusTotal, Google Safe Browsing, and URLhaus. The aggregated verdict is returned to the client, "
        "where the deterministic scoring engine updates the device health score and renders contextual remediation.",
        space_after=6, line_spacing=1.15
    )

    add_h1(doc, "3.1.1 Methodology")
    add_p(
        doc,
        "Cyber Companion was engineered using the Agile Scrum framework. Development proceeded in reviewable increments, ensuring "
        "that threat detection algorithms were mathematically verified before integration into the mobile client. Increment 1 established "
        "the Threat Intelligence Gateway, SSRF guard, and upstream API adapters. Increment 2 developed the React Native interface, "
        "Zustand state store, and Three.js 3D shield visualization. Increment 3 integrated native Android Wi-Fi beacon inspection and "
        "the optical camera QR Quishing sandbox. Increment 4 implemented on-device permission auditing, the deterministic scoring "
        "engine, and the grounded RAG AI Explainer. Each increment was validated through automated tests before subsequent development.",
        space_after=6, line_spacing=1.15
    )

    add_h1(doc, "3.1.2 Hardware Requirements")
    add_p(
        doc,
        "The specifications below outline practical hardware requirements for running the client application and deploying the "
        "gateway service in a production academic environment.",
        space_after=4, line_spacing=1.15
    )

    doc.add_page_break()

    # PAGE 22 (Report Page 15): Requirements cont. & Database Design
    add_p(
        doc,
        "Mobile Client Hardware (Android / iOS): A smartphone running Android 10+ (API level 29) or iOS 14+; a minimum of a dual-core "
        "1.8 GHz ARM64 processor; 3 GB RAM (4 GB recommended for concurrent 3D WebGL rendering); rear-facing camera sensor with autofocus; "
        "802.11 b/g/n/ac/ax Wi-Fi radio supporting passive beacon scanning; and 150 MB available internal storage.",
        space_after=6, line_spacing=1.15
    )
    add_p(
        doc,
        "Server Deployment Hardware: A virtual or dedicated server running Linux (Ubuntu 22.04 LTS recommended); minimum 2 virtual CPU "
        "cores; 4 GB RAM (8 GB recommended for concurrent threat API caching and benchmark suites); 20 GB SSD storage for operating system, "
        "MongoDB indexes, and structured log retention; and a 100 Mbps stable network connection for external threat feed synchronization.",
        space_after=8, line_spacing=1.15
    )

    add_h1(doc, "3.1.3 Software Requirements")
    add_table_header(doc, "Table 3.1: Software requirements for Cyber Companion")

    t_sw = doc.add_table(rows=7, cols=3)
    t_sw.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_sw, color="D3D3D3", sz="4", val="single")

    sw_data = [
        ("Layer", "Software / Service", "Purpose"),
        ("Mobile Client", "React Native 0.74, Expo SDK 51, Three.js 0.164", "Cross-platform UI, 3D Cyber Shield rendering, camera barcode scanning."),
        ("Gateway API", "Node.js 20 LTS, Express 4.19, TypeScript 5.4", "RESTful threat intelligence endpoints, validation, and SSRF guard."),
        ("Database", "MongoDB Atlas 7.0, Mongoose ODM 8.3", "TTL verdict caching, cyber tips storage, and admin audit logging."),
        ("Security", "Helmet 7.1, Express-Rate-Limit 7.2, Zod 3.23", "HTTP security headers, rate limiting, and runtime request contract validation."),
        ("External APIs", "VirusTotal REST API v3, Google Safe Browsing v4", "Upstream threat intelligence aggregation and malware reputation lookups."),
        ("Build & QA", "Jest 29, Supertest 6.3, Expo CLI, Android SDK 34", "Automated unit/integration testing, APK bundling, and linting.")
    ]

    for row_idx, (c1_txt, c2_txt, c3_txt) in enumerate(sw_data):
        row = t_sw.rows[row_idx]
        for col_idx, txt in enumerate([c1_txt, c2_txt, c3_txt]):
            cell = row.cells[col_idx]
            cell.width = [Inches(1.5), Inches(2.3), Inches(2.4)][col_idx]
            set_cell_margins(cell, top=50, bottom=50, left=70, right=70)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.05
            r = p.add_run(txt)
            r.font.name = FONT_PRIMARY
            r.font.size = Pt(8.5)
            if row_idx == 0:
                set_cell_background(cell, "EAECF0")
                r.font.bold = True
            elif col_idx == 0:
                r.font.bold = True

    add_h1(doc, "3.2 Database Design")
    add_p(
        doc,
        "Cyber Companion utilizes MongoDB Atlas, a document database, because cybersecurity telemetry—comprising nested threat source "
        "reports, polymorphic heuristic flags, and structured JSON knowledge base documents—maps naturally to flexible BSON documents. "
        "The database contains five primary collections described in Table 3.2.",
        space_after=6, line_spacing=1.15
    )

    doc.add_page_break()

    # PAGE 23 (Report Page 16): Database Collections Table
    add_table_header(doc, "Table 3.2: MongoDB collections in Cyber Companion")

    t_db = doc.add_table(rows=6, cols=2)
    t_db.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_db, color="D3D3D3", sz="4", val="single")

    db_data = [
        ("Collection", "Purpose and main fields"),
        ("verdict_caches", "Caches evaluated domain and URL threat assessments: domainOrUrlHash (SHA-256 string, indexed), target (string), verdict (Enum: SAFE, SUSPICIOUS, MALICIOUS, UNKNOWN), confidenceScore (number 0-1), primaryCategory (string), heuristicsTriggered (array of strings), plainLanguageExplanation (string), recommendation (string), threatIntelSources (array of objects: source, positives, totalEngines), createdAt (date), expiresAt (date with TTL index)."),
        ("cyber_tips", "Bite-sized cybersecurity hygiene tips: id (string, unique), title (string), summary (string, <=60 words, 6th-grade reading level), category (Enum: WIFI_SAFETY, PHISHING_AWARENESS, QR_HYGIENE, PASSWORD_SECURITY, APP_PERMISSIONS, DEVICE_CARE), actionText (string), readingLevelGrade (number), published (boolean), createdAt (date)."),
        ("admin_users", "Cryptographic administrator registry: id (string), username (string, unique), role (Enum: ADMIN, EDITOR, VIEWER), totpSecret (string, AES-256 encrypted), isActive (boolean), lastLoginAt (date), createdAt (date)."),
        ("threat_logs", "Anonymized, high-level threat telemetry: logId (ObjectId), timestamp (date), threatCategory (string), riskLevel (Enum: LOW, MODERATE, HIGH, CRITICAL), sourceVector (Enum: QR_CODE, BROWSER_LINK, WIFI_BEACON), scoreImpact (number). Zero user PII recorded."),
        ("knowledge_docs", "Curated cybersecurity knowledge base for RAG grounding: kbId (string: KB-001 to KB-005), topic (string), title (string), keywords (array of strings), summary (string), plainLanguageExplanation (string), remediation (array of actionable strings), sourceReference (string).")
    ]

    for row_idx, (col1, col2) in enumerate(db_data):
        row = t_db.rows[row_idx]
        c1, c2 = row.cells[0], row.cells[1]
        c1.width, c2.width = Inches(1.8), Inches(4.2)
        set_cell_margins(c1, top=50, bottom=50, left=80, right=80)
        set_cell_margins(c2, top=50, bottom=50, left=80, right=80)
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
        r_c1.font.size = Pt(8.5)
        r_c2.font.size = Pt(8.5)

        if row_idx == 0:
            set_cell_background(c1, "EAECF0")
            set_cell_background(c2, "EAECF0")
            r_c1.font.bold = True
            r_c2.font.bold = True
        else:
            r_c1.font.bold = True

    add_p(
        doc,
        "Database indexes are automatically verified during application bootstrap. A 24-hour TTL index on expiresAt in the verdict_caches "
        "collection ensures that threat evaluations automatically expire, enforcing data freshness without manual administrative intervention. "
        "Unique indexes on domainOrUrlHash, username, and id prevent record duplication.",
        space_after=6, line_spacing=1.15
    )

    doc.add_page_break()

    # PAGE 24 (Report Page 17): Database Narrative & Schema Diagram
    add_p(
        doc,
        "The collection design reflects the operational independence of threat evaluation, user education, and administrative auditing. "
        "Threat verdicts are cached independently of individual user identities, ensuring that multiple users querying the same URL benefit "
        "from cached threat evaluations without revealing who initiated the request. The knowledge base collection serves as the authoritative "
        "grounding source for the RAG AI Explainer, providing verified citations from NIST and OWASP standards.",
        space_after=6, line_spacing=1.15
    )
    add_p(
        doc,
        "The schema diagram below provides a logical view of the MongoDB document models. While MongoDB does not enforce relational "
        "foreign keys, logical references connect threat categories, knowledge base articles, and audit entries.",
        space_after=6, line_spacing=1.15
    )

    add_figure_image(
        doc,
        "report_assets/fig_3_7_mongodb_schema.png",
        "Figure 3.7: Logical MongoDB collection relationship diagram",
        width=Inches(5.5)
    )

    add_p(
        doc,
        "Database access is strictly encapsulated within the gateway service layer using Mongoose schemas. Direct client-to-database "
        "connections are forbidden by network architecture. Connection pooling and write timeouts guarantee that transient database "
        "slowdowns do not cascade into client UI freezes, allowing the mobile app to fall back to in-memory evaluation seamlessly.",
        space_after=6, line_spacing=1.15
    )

    doc.add_page_break()

    # PAGE 25 (Report Page 18): Modules & Module 3.3.1
    add_h1(doc, "3.3 Modules")
    add_table_header(doc, "Table 3.3: REST API endpoint groups")

    t_api = doc.add_table(rows=7, cols=3)
    t_api.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_api, color="D3D3D3", sz="4", val="single")

    api_data = [
        ("Router", "Endpoints", "Examples"),
        ("Health", "1", "GET /v1/health"),
        ("Threat Inspection", "4", "POST /v1/threat/inspect, POST /v1/threat/wifi/assess, POST /v1/threat/explain, POST /v1/threat/quishing/sandbox"),
        ("Tips & Awareness", "3", "GET /v1/tips, GET /v1/tips/today, GET /v1/tips/:id"),
        ("Admin Auth", "2", "POST /v1/admin/login, POST /v1/admin/logout"),
        ("Admin Management", "3", "POST /v1/admin/cache/clear, POST /v1/admin/tips, DELETE /v1/admin/tips/:id"),
        ("Benchmark & Metrics", "2", "POST /v1/admin/benchmark/run, GET /v1/admin/metrics")
    ]

    for row_idx, (c1_txt, c2_txt, c3_txt) in enumerate(api_data):
        row = t_api.rows[row_idx]
        for col_idx, txt in enumerate([c1_txt, c2_txt, c3_txt]):
            cell = row.cells[col_idx]
            cell.width = [Inches(1.8), Inches(1.0), Inches(3.4)][col_idx]
            set_cell_margins(cell, top=50, bottom=50, left=70, right=70)
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.05
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if col_idx == 1 else WD_ALIGN_PARAGRAPH.LEFT
            r = p.add_run(txt)
            r.font.name = FONT_PRIMARY
            r.font.size = Pt(8.5)
            if row_idx == 0:
                set_cell_background(cell, "EAECF0")
                r.font.bold = True
            elif col_idx == 0:
                r.font.bold = True

    add_h2(doc, "3.3.1 THREAT INTELLIGENCE GATEWAY AND SSRF GUARD")
    add_p(
        doc,
        "The Threat Intelligence Gateway serves as the centralized threat assessment and security enforcement engine for Cyber Companion. "
        "It receives URL inspection requests, evaluates target destinations against multiple commercial and open-source threat intelligence "
        "feeds, and computes an aggregated consensus verdict. To protect server infrastructure, the gateway incorporates a strict Server-Side "
        "Request Forgery (SSRF) and DNS-rebinding guard. Before resolving or querying an external domain, the guard validates that the host "
        "does not map to private RFC 1918 addresses (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), loopback addresses (127.0.0.0/8), "
        "link-local cloud metadata endpoints (169.254.169.254), or IPv6 equivalents (::1).",
        space_after=6, line_spacing=1.15
    )
    add_p(
        doc,
        "The SSRF guard specifically defeats IP obfuscation techniques used by attackers, including decimal integer (dword) representations "
        "(e.g., 2130706433 resolving to 127.0.0.1) and hexadecimal IP formats (0x7f000001). Any attempt to inspect an internal network target "
        "is immediately rejected with an HTTP 400 Bad Request, shielding institutional intranet assets from reconnaissance.",
        space_after=6, line_spacing=1.15
    )

    doc.add_page_break()

    # PAGE 26 (Report Page 19): Modules 3.3.1 cont, 3.3.2 & 3.3.3
    add_p(
        doc,
        "Following SSRF verification, the gateway hashes the target URL using SHA-256 and queries the MongoDB TTL cache. On a cache hit, "
        "the stored verdict is returned in under 15 milliseconds. On a cache miss, the gateway dispatches asynchronous queries to VirusTotal "
        "and Google Safe Browsing. A consensus engine aggregates the responses: if any reputable source flags the URL as malicious, or if "
        "multiple heuristic indicators trigger simultaneously, the overall verdict is marked MALICIOUS with a high confidence score. "
        "The result is cached for 24 hours and returned to the client.",
        space_after=8, line_spacing=1.15
    )

    add_h2(doc, "3.3.2 INTERACTIVE 3D DASHBOARD AND SECURITY POSTURE CORE")
    add_p(
        doc,
        "The mobile dashboard provides everyday users with an intuitive, non-intimidating visualization of their real-time cybersecurity "
        "posture. At the center of the dashboard is the 3D Cyber Shield Core, rendered using Three.js and WebGL. Rather than presenting "
        "cryptic logs, the 3D shield undergoes real-time physical deformations, rotation rate changes, and chromatic shifts based on the "
        "device's deterministic 0–100 security score.",
        space_after=6, line_spacing=1.15
    )
    add_p(
        doc,
        "When the score is in the SECURE band (80–100), the shield maintains an emerald green hue with smooth harmonic pulsation and a steady "
        "rotational velocity. When the score drops into the MODERATE or AT_RISK band (60–79), the shield adopts an amber glow with increased "
        "surface turbulence. In the CRITICAL band (0–59), the shield deforms into an unstable, jagged crimson wireframe with flashing hazard "
        "particles. Surrounding the shield, an SVG-based animated score gauge displays the numerical score, accompanied by the top three "
        "actionable security fixes.",
        space_after=8, line_spacing=1.15
    )

    add_h2(doc, "3.3.3 OPTICAL QR SCANNER AND QUISHING SANDBOX")
    add_p(
        doc,
        "The Optical QR Scanner module mitigates the growing threat of Quishing (QR code phishing). Using the device's hardware camera frames "
        "processed through an optimized barcode decoder, the scanner decodes QR payloads within an isolated, in-memory execution sandbox.",
        space_after=6, line_spacing=1.15
    )
    add_p(
        doc,
        "Traditional camera apps automatically invoke operating system intent handlers when a QR code is scanned, immediately opening web "
        "browsers or executing deep links. Cyber Companion intercepts this flow: decoded payloads are classified (URL, Wi-Fi configuration, "
        "vCard, or Plain Text) and held in the sandbox. If the payload is a URL, the scanner runs local lexical heuristics, expands shortened "
        "links (bit.ly, tinyurl), checks for Cyrillic IDN homoglyphs, and queries the Threat Intelligence Gateway before the user can proceed.",
        space_after=6, line_spacing=1.15
    )

    doc.add_page_break()

    # PAGE 27 (Report Page 20): Module 3.3.3 cont.
    add_p(
        doc,
        "The sandboxed preview modal displays the full unshortened destination URL, the detected domain reputation, and an explicit hazard "
        "breakdown. If a link is identified as phishing or malware, the sandbox blocks automatic browser launching, requiring explicit "
        "multi-step user confirmation to override. This halts physical-world quishing campaigns that place malicious stickers over legitimate "
        "parking or payment QR codes.",
        space_after=8, line_spacing=1.15
    )
    add_p(
        doc,
        "In addition to web links, the sandbox parses Wi-Fi connection QR codes (WIFI:S:ssid;T:WPA;P:password;;). The scanner extracts the "
        "embedded network parameters and forwards them directly to the Pre-Connection Wi-Fi Sentinel, ensuring that rogue access point "
        "configurations embedded in malicious QR stickers are flagged before wireless association occurs.",
        space_after=8, line_spacing=1.15
    )
    add_p(
        doc,
        "The module provides seamless camera frame processing on physical devices while maintaining full support for image uploads from the "
        "device photo gallery. When operating in desktop web environments, the module gracefully falls back to an integrated drag-and-drop "
        "image barcode scanner, guaranteeing feature parity across all supported client platforms.",
        space_after=6, line_spacing=1.15
    )

    doc.add_page_break()
