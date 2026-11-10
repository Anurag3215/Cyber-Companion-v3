import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

os.makedirs("report_assets", exist_ok=True)

plt.rcParams['font.sans-serif'] = 'Arial'
plt.rcParams['font.family'] = 'sans-serif'

# 1. Figure 3.1: System Architecture
def make_fig_3_1():
    fig, ax = plt.subplots(figsize=(10, 6.2), dpi=250)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Presentation Tier
    p_box = patches.FancyBboxPatch((4, 68), 92, 28, boxstyle="round,pad=1.5", ec="#2B6CB0", fc="#EBF8FF", lw=2)
    ax.add_patch(p_box)
    ax.text(6, 92, "Presentation Layer: Cross-Platform Mobile & Web (React Native / Expo / Three.js)", fontsize=11, fontweight='bold', color="#2B6CB0")
    
    # Submodules in Presentation
    modules_p = [
        ("3D Security Dashboard\n(Three.js Cyber Shield Core,\nAnimated Score Gauge)", 6, 70, 26, 18),
        ("Scan Hub & Quishing Sandbox\n(Hardware Camera QR Scanner,\nLink Inspector, Heuristics)", 37, 70, 27, 18),
        ("Wi-Fi Sentinel & Auditor\n(802.11 Beacon Inspector,\nOn-Device Permission Audit)", 69, 70, 25, 18)
    ]
    for title, x, y, w, h in modules_p:
        b = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.8", ec="#4299E1", fc="#FFFFFF", lw=1.2)
        ax.add_patch(b)
        ax.text(x + w/2, y + h/2, title, fontsize=8.5, ha='center', va='center', color="#2D3748")

    # Arrow down
    ax.annotate("", xy=(50, 60), xytext=(50, 68), arrowprops=dict(arrowstyle="<->", color="#2B6CB0", lw=2))
    ax.text(50.5, 63.5, "HTTPS REST / TLS 1.3 (Zod Schema Validation)", fontsize=8.5, fontweight='bold', color="#2B6CB0", ha='center')

    # Application Tier
    a_box = patches.FancyBboxPatch((4, 28), 92, 30, boxstyle="round,pad=1.5", ec="#2F855A", fc="#F0FFF4", lw=2)
    ax.add_patch(a_box)
    ax.text(6, 54, "Application Layer: Threat Intelligence Gateway (Node.js + Express + TypeScript)", fontsize=11, fontweight='bold', color="#2F855A")

    modules_a = [
        ("Security Middleware\n(SSRF Guard, Rate Limiter,\nPrompt Injection Guard)", 6, 31, 26, 19),
        ("Threat Analysis Core\n(Consensus Aggregator,\nConfidence Scoring)", 37, 31, 27, 19),
        ("RAG AI Explainer\n(Knowledge Base Embedder,\nPlain-Language Remediation)", 69, 31, 25, 19)
    ]
    for title, x, y, w, h in modules_a:
        b = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.8", ec="#48BB78", fc="#FFFFFF", lw=1.2)
        ax.add_patch(b)
        ax.text(x + w/2, y + h/2, title, fontsize=8.5, ha='center', va='center', color="#2D3748")

    # Arrow down
    ax.annotate("", xy=(50, 20), xytext=(50, 28), arrowprops=dict(arrowstyle="<->", color="#2F855A", lw=2))
    ax.text(50.5, 23.5, "Database Driver & External HTTPS APIs", fontsize=8.5, fontweight='bold', color="#2F855A", ha='center')

    # Data & External Tier
    d_box = patches.FancyBboxPatch((4, 2), 92, 17, boxstyle="round,pad=1.2", ec="#805AD5", fc="#FAF5FF", lw=2)
    ax.add_patch(d_box)
    ax.text(6, 16, "Data Tier & External Threat Intelligence Ecosystem", fontsize=10.5, fontweight='bold', color="#805AD5")

    modules_d = [
        ("MongoDB Atlas\n(TTL Verdict Cache, Tips,\nAdmin Audit Logs)", 7, 3.5, 25, 10.5),
        ("Upstream Threat Engines\n(VirusTotal v3, Google Safe\nBrowsing v4, URLhaus)", 37, 3.5, 27, 10.5),
        ("Knowledge Repository\n(Curated Security KB,\nOWASP & NIST Guidelines)", 69, 3.5, 25, 10.5)
    ]
    for title, x, y, w, h in modules_d:
        b = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.8", ec="#9F7AEA", fc="#FFFFFF", lw=1.2)
        ax.add_patch(b)
        ax.text(x + w/2, y + h/2, title, fontsize=8, ha='center', va='center', color="#2D3748")

    plt.tight_layout()
    plt.savefig("report_assets/fig_3_1_architecture.png", dpi=250, bbox_inches='tight')
    plt.close()

# 2. Figure 3.2: Context Diagram
def make_fig_3_2():
    fig, ax = plt.subplots(figsize=(9, 5.5), dpi=250)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Central Circle
    cc = patches.Circle((50, 50), 16, ec="#2B6CB0", fc="#EBF8FF", lw=2.5)
    ax.add_patch(cc)
    ax.text(50, 51.5, "0\nCyber Companion\nSystem", fontsize=11, fontweight='bold', ha='center', va='center', color="#1A365D")

    # Entities
    entities = [
        ("Smartphone User", 12, 75, 18, 12, "#3182CE"),
        ("Android OS Hardware\n(Wi-Fi, Camera, Sensors)", 12, 25, 20, 14, "#4A5568"),
        ("Threat Intel Feeds\n(VirusTotal, GSB, URLhaus)", 72, 75, 22, 14, "#805AD5"),
        ("System Administrator", 72, 25, 20, 12, "#DD6B20")
    ]
    for name, x, y, w, h, col in entities:
        b = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.6", ec=col, fc="#FFFFFF", lw=1.8)
        ax.add_patch(b)
        ax.text(x + w/2, y + h/2, name, fontsize=8.5, fontweight='bold', ha='center', va='center', color=col)

    # Connections & labels
    # User -> System
    ax.annotate("", xy=(37, 56), xytext=(28, 75), arrowprops=dict(arrowstyle="->", color="#2D3748", lw=1.2))
    ax.text(26, 68, "URLs, QR scans,\nsettings", fontsize=7.5, color="#4A5568", ha='right')

    # System -> User
    ax.annotate("", xy=(26, 73), xytext=(36, 52), arrowprops=dict(arrowstyle="->", color="#2D3748", lw=1.2))
    ax.text(37, 60, "Security Score, 3D Shield,\nThreat alerts, remediation", fontsize=7.5, color="#4A5568")

    # Hardware -> System
    ax.annotate("", xy=(38, 43), xytext=(30, 32), arrowprops=dict(arrowstyle="<->", color="#2D3748", lw=1.2))
    ax.text(24, 40, "802.11 beacon ciphers,\napp permissions, frames", fontsize=7.5, color="#4A5568", ha='right')

    # System -> Threat Intel
    ax.annotate("", xy=(72, 79), xytext=(63, 58), arrowprops=dict(arrowstyle="<->", color="#2D3748", lw=1.2))
    ax.text(70, 66, "URL hash lookup,\nverdict responses", fontsize=7.5, color="#4A5568")

    # Admin <-> System
    ax.annotate("", xy=(72, 33), xytext=(63, 44), arrowprops=dict(arrowstyle="<->", color="#2D3748", lw=1.2))
    ax.text(70, 39, "TOTP auth, benchmarks,\ncache control, tips", fontsize=7.5, color="#4A5568")

    plt.tight_layout()
    plt.savefig("report_assets/fig_3_2_context.png", dpi=250, bbox_inches='tight')
    plt.close()

# 3. Figure 3.3: DFD Level 1
def make_fig_3_3():
    fig, ax = plt.subplots(figsize=(10, 5.8), dpi=250)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    processes = [
        ("1.0 Optical QR & Link Intake", 8, 70, 24, 11),
        ("2.0 Local Heuristics & SSRF Guard", 38, 70, 26, 11),
        ("3.0 Threat Intel Gateway & Consensus", 70, 70, 26, 11),
        ("4.0 Wi-Fi Sentinel Analysis", 8, 38, 24, 11),
        ("5.0 On-Device Permission Auditor", 38, 38, 26, 11),
        ("6.0 Pure Deterministic Scorer", 70, 38, 26, 11),
        ("7.0 Grounded RAG AI Explainer", 38, 8, 26, 11)
    ]
    for p_name, x, y, w, h in processes:
        b = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.8", ec="#2B6CB0", fc="#EBF8FF", lw=1.5)
        ax.add_patch(b)
        ax.text(x + w/2, y + h/2, p_name, fontsize=8, fontweight='bold', ha='center', va='center', color="#1A365D")

    # Stores
    stores = [
        ("D1 Verdict TTL Cache", 70, 18, 26, 8),
        ("D2 Knowledge Base", 8, 18, 24, 8)
    ]
    for s_name, x, y, w, h in stores:
        b = patches.Rectangle((x, y), w, h, ec="#4A5568", fc="#EDF2F7", lw=1.2)
        ax.add_patch(b)
        ax.text(x + w/2, y + h/2, s_name, fontsize=8, ha='center', va='center', color="#2D3748")

    # Connectors
    ax.annotate("", xy=(38, 75.5), xytext=(32, 75.5), arrowprops=dict(arrowstyle="->", color="#4A5568", lw=1.2))
    ax.annotate("", xy=(70, 75.5), xytext=(64, 75.5), arrowprops=dict(arrowstyle="->", color="#4A5568", lw=1.2))
    ax.annotate("", xy=(83, 49), xytext=(83, 70), arrowprops=dict(arrowstyle="->", color="#4A5568", lw=1.2))
    ax.annotate("", xy=(70, 43.5), xytext=(64, 43.5), arrowprops=dict(arrowstyle="->", color="#4A5568", lw=1.2))
    ax.annotate("", xy=(38, 43.5), xytext=(32, 43.5), arrowprops=dict(arrowstyle="->", color="#4A5568", lw=1.2))
    ax.annotate("", xy=(51, 19), xytext=(51, 38), arrowprops=dict(arrowstyle="->", color="#4A5568", lw=1.2))
    ax.annotate("", xy=(70, 22), xytext=(51, 13), arrowprops=dict(arrowstyle="<->", color="#4A5568", lw=1.2))
    ax.annotate("", xy=(32, 22), xytext=(40, 13), arrowprops=dict(arrowstyle="<-", color="#4A5568", lw=1.2))

    plt.tight_layout()
    plt.savefig("report_assets/fig_3_3_dfd_l1.png", dpi=250, bbox_inches='tight')
    plt.close()

# 4. Figure 3.4: Data-Flow View with Persistent Stores
def make_fig_3_4():
    fig, ax = plt.subplots(figsize=(9.5, 5.5), dpi=250)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Stores
    d_stores = [
        ("D1 Local Encrypted Storage\n(Inspection History, Streaks)", 6, 75, 26, 14),
        ("D2 MongoDB Atlas TTL Cache\n(Domain & Hash Verdicts, 24h)", 68, 75, 26, 14),
        ("D3 Cyber Tips & Knowledge Docs\n(Published Tips, RFC/NIST KB)", 6, 15, 26, 14),
        ("D4 Admin Audit & System State\n(TOTP Sessions, Benchmarks)", 68, 15, 26, 14)
    ]
    for name, x, y, w, h in d_stores:
        b = patches.Rectangle((x, y), w, h, ec="#2C5282", fc="#EBF8FF", lw=1.5)
        ax.add_patch(b)
        ax.text(x + w/2, y + h/2, name, fontsize=8, fontweight='bold', ha='center', va='center', color="#1A365D")

    # Central Core
    c = patches.Circle((50, 48), 15, ec="#2F855A", fc="#F0FFF4", lw=2)
    ax.add_patch(c)
    ax.text(50, 48, "Cyber Companion\nProcess Hub", fontsize=10, fontweight='bold', ha='center', va='center', color="#22543D")

    # Arrows between stores and center
    ax.annotate("", xy=(40, 56), xytext=(28, 75), arrowprops=dict(arrowstyle="<->", color="#4A5568", lw=1.2))
    ax.annotate("", xy=(60, 56), xytext=(72, 75), arrowprops=dict(arrowstyle="<->", color="#4A5568", lw=1.2))
    ax.annotate("", xy=(40, 40), xytext=(28, 29), arrowprops=dict(arrowstyle="<->", color="#4A5568", lw=1.2))
    ax.annotate("", xy=(60, 40), xytext=(72, 29), arrowprops=dict(arrowstyle="<->", color="#4A5568", lw=1.2))

    # Descriptions
    ax.text(32, 65, "save / restore logs", fontsize=7.5, color="#718096", rotation=30)
    ax.text(68, 65, "verdict cache hit / store", fontsize=7.5, color="#718096", rotation=-30)
    ax.text(30, 35, "read KB & tips", fontsize=7.5, color="#718096", rotation=-30)
    ax.text(68, 35, "audit logs & runs", fontsize=7.5, color="#718096", rotation=30)

    plt.tight_layout()
    plt.savefig("report_assets/fig_3_4_dfd_stores.png", dpi=250, bbox_inches='tight')
    plt.close()

# 5. Figure 3.5: Process Interactions by Role
def make_fig_3_5():
    fig, ax = plt.subplots(figsize=(9.5, 5.5), dpi=250)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Roles
    user_box = patches.FancyBboxPatch((4, 55), 20, 35, boxstyle="round,pad=0.8", ec="#3182CE", fc="#EBF8FF", lw=1.8)
    ax.add_patch(user_box)
    ax.text(14, 85, "Mobile / Web User", fontsize=9.5, fontweight='bold', ha='center', color="#2B6CB0")
    user_actions = ["• Scan Barcodes / QR", "• Inspect Target Link", "• Wi-Fi Beacon Scan", "• Run Permission Audit", "• View 3D Posture Core", "• Request RAG Explain"]
    for i, act in enumerate(user_actions):
        ax.text(6, 78 - i*4, act, fontsize=7.5, color="#2D3748")

    admin_box = patches.FancyBboxPatch((4, 10), 20, 35, boxstyle="round,pad=0.8", ec="#DD6B20", fc="#FFFAF0", lw=1.8)
    ax.add_patch(admin_box)
    ax.text(14, 40, "System Admin", fontsize=9.5, fontweight='bold', ha='center', color="#DD6B20")
    admin_actions = ["• TOTP Multi-Factor Auth", "• Trigger Benchmark Suite", "• Invalidate Threat Cache", "• Author Security Tips", "• Review Gateway Metrics"]
    for i, act in enumerate(admin_actions):
        ax.text(6, 33 - i*4, act, fontsize=7.5, color="#2D3748")

    # Center Pipeline
    pipe_box = patches.FancyBboxPatch((32, 10), 36, 80, boxstyle="round,pad=1.0", ec="#38A169", fc="#F0FFF4", lw=2)
    ax.add_patch(pipe_box)
    ax.text(50, 85, "Cyber Companion Core Services", fontsize=10.5, fontweight='bold', ha='center', color="#22543D")

    services = [
        ("Zod Input Validator & Sanitizer", 76),
        ("SSRF & DNS-Rebinding Guard", 66),
        ("Lexical Heuristics Engine", 56),
        ("Threat Intel Multi-Engine Consensus", 46),
        ("Pure Deterministic Scoring (30/30/20/20)", 36),
        ("Grounded RAG Explainer Service", 26),
        ("Automated 25-Suite Benchmark Engine", 16)
    ]
    for s_name, y_pos in services:
        sb = patches.FancyBboxPatch((34, y_pos - 3), 32, 6, boxstyle="round,pad=0.4", ec="#48BB78", fc="#FFFFFF", lw=1.2)
        ax.add_patch(sb)
        ax.text(50, y_pos, s_name, fontsize=8, ha='center', va='center', color="#2D3748")

    # Outputs
    out_box = patches.FancyBboxPatch((76, 30), 20, 42, boxstyle="round,pad=0.8", ec="#805AD5", fc="#FAF5FF", lw=1.8)
    ax.add_patch(out_box)
    ax.text(86, 68, "System Telemetry & Artifacts", fontsize=9, fontweight='bold', ha='center', color="#6B46C1")
    outs = ["• Monotonic 0-100 Score", "• 3D Holographic Gauge", "• Plain-Language Card", "• High-Risk Combo Alerts", "• Zero-Trust Audit Logs"]
    for i, out in enumerate(outs):
        ax.text(78, 60 - i*5.5, out, fontsize=7.5, color="#2D3748")

    # Arrows
    ax.annotate("", xy=(32, 70), xytext=(24, 70), arrowprops=dict(arrowstyle="->", color="#2B6CB0", lw=1.5))
    ax.annotate("", xy=(32, 27), xytext=(24, 27), arrowprops=dict(arrowstyle="->", color="#DD6B20", lw=1.5))
    ax.annotate("", xy=(76, 50), xytext=(68, 50), arrowprops=dict(arrowstyle="->", color="#38A169", lw=1.5))

    plt.tight_layout()
    plt.savefig("report_assets/fig_3_5_dfd_roles.png", dpi=250, bbox_inches='tight')
    plt.close()

# 6. Figure 3.6: Threat Inspection Sequence Diagram
def make_fig_3_6():
    fig, ax = plt.subplots(figsize=(10, 6), dpi=250)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    cols = [
        ("Mobile Client", 10),
        ("SSRF Guard", 30),
        ("Verdict Cache", 50),
        ("Threat Intel APIs", 70),
        ("Scoring Engine", 90)
    ]
    for name, x in cols:
        b = patches.FancyBboxPatch((x-8, 90), 16, 6, boxstyle="round,pad=0.3", ec="#2B6CB0", fc="#EBF8FF", lw=1.2)
        ax.add_patch(b)
        ax.text(x, 93, name, fontsize=8, fontweight='bold', ha='center', va='center', color="#1A365D")
        ax.plot([x, x], [10, 90], color="#CBD5E0", linestyle="--", lw=1.2)

    seqs = [
        (10, 30, 84, "POST /v1/threat/inspect (URL)", "->"),
        (30, 30, 77, "Resolve DNS & check private/loopback IP", "self"),
        (30, 50, 70, "Query cached verdict (SHA-256)", "->"),
        (50, 30, 63, "Cache Miss (return null)", "-->"),
        (30, 70, 56, "Dispatch async query (VT v3, GSB v4, URLhaus)", "->"),
        (70, 30, 49, "Aggregated threat responses", "-->"),
        (30, 50, 42, "Store merged verdict (TTL: 24h)", "->"),
        (30, 10, 35, "200 OK (ThreatAnalysisResult)", "-->"),
        (10, 90, 28, "Update Scorer with Threat Result", "->"),
        (90, 10, 21, "Monotonic Score (0-100) + Action Card", "-->")
    ]
    for x1, x2, y, msg, style in seqs:
        if style == "self":
            ax.annotate("", xy=(x1+4, y-2), xytext=(x1, y+1), arrowprops=dict(arrowstyle="->", color="#2F855A", lw=1.2))
            ax.text(x1+5, y, msg, fontsize=7, color="#2D3748")
        elif style == "->":
            ax.annotate("", xy=(x2, y), xytext=(x1, y), arrowprops=dict(arrowstyle="->", color="#2B6CB0", lw=1.2))
            ax.text((x1+x2)/2, y+1.5, msg, fontsize=7, ha='center', color="#2D3748")
        elif style == "-->":
            ax.annotate("", xy=(x2, y), xytext=(x1, y), arrowprops=dict(arrowstyle="->", linestyle="--", color="#4A5568", lw=1.2))
            ax.text((x1+x2)/2, y+1.5, msg, fontsize=7, ha='center', color="#2D3748")

    plt.tight_layout()
    plt.savefig("report_assets/fig_3_6_seq_threat.png", dpi=250, bbox_inches='tight')
    plt.close()

# 7. Figure 3.7: MongoDB Schema Diagram
def make_fig_3_7():
    fig, ax = plt.subplots(figsize=(9.5, 5.5), dpi=250)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    collections = [
        ("verdict_caches", 5, 52, 28, 42, [
            ("PK _id: ObjectId", True),
            ("domainOrUrlHash: String (Indexed)", False),
            ("target: String", False),
            ("verdict: Enum (SAFE/SUSP/MAL)", False),
            ("confidenceScore: Number", False),
            ("heuristicsTriggered: Array", False),
            ("threatIntelSources: Array", False),
            ("expiresAt: Date (TTL Index)", False)
        ]),
        ("cyber_tips", 37, 52, 27, 42, [
            ("PK _id: ObjectId", True),
            ("id: String (Unique)", False),
            ("title: String", False),
            ("summary: String (<=60 words)", False),
            ("category: Enum (WIFI/PHISH)", False),
            ("readingLevelGrade: Number", False),
            ("published: Boolean", False),
            ("createdAt: Date", False)
        ]),
        ("admin_users", 68, 52, 27, 42, [
            ("PK _id: ObjectId", True),
            ("username: String (Unique)", False),
            ("role: Enum (ADMIN/EDITOR)", False),
            ("totpSecret: String (Encrypted)", False),
            ("isActive: Boolean", False),
            ("lastLoginAt: Date", False),
            ("createdAt: Date", False)
        ]),
        ("threat_logs", 18, 5, 29, 38, [
            ("PK _id: ObjectId", True),
            ("source: Enum (QR/URL/WIFI)", False),
            ("targetHash: String", False),
            ("verdict: String", False),
            ("scoreImpact: Number", False),
            ("timestamp: Date", False)
        ]),
        ("knowledge_docs", 55, 5, 29, 38, [
            ("PK _id: ObjectId", True),
            ("kbId: String (KB-001..005)", False),
            ("topic: String", False),
            ("keywords: Array", False),
            ("summary: String", False),
            ("remediation: Array", False)
        ])
    ]

    for c_name, x, y, w, h, fields in collections:
        hb = patches.Rectangle((x, y + h - 8), w, 8, ec="#2B6CB0", fc="#2B6CB0", lw=1.2)
        ax.add_patch(hb)
        ax.text(x + w/2, y + h - 4, c_name, fontsize=8.5, fontweight='bold', ha='center', va='center', color="#FFFFFF")
        bb = patches.Rectangle((x, y), w, h - 8, ec="#2B6CB0", fc="#F7FAFC", lw=1.2)
        ax.add_patch(bb)
        for idx, (f_text, is_pk) in enumerate(fields):
            fw = 'bold' if is_pk else 'normal'
            col = '#C53030' if is_pk else '#2D3748'
            ax.text(x + 2, y + h - 12 - idx*4, f_text, fontsize=7, fontweight=fw, color=col)

    # Relationship connectors
    ax.annotate("", xy=(32, 43), xytext=(19, 52), arrowprops=dict(arrowstyle="->", color="#718096", lw=1.2))
    ax.annotate("", xy=(55, 24), xytext=(37, 52), arrowprops=dict(arrowstyle="<->", color="#718096", lw=1.2))

    plt.tight_layout()
    plt.savefig("report_assets/fig_3_7_mongodb_schema.png", dpi=250, bbox_inches='tight')
    plt.close()

# 8. Figure 3.8: Flow of a Threat Inspection Request
def make_fig_3_8():
    fig, ax = plt.subplots(figsize=(8, 6.5), dpi=250)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    steps = [
        ("Client Submits URL / QR Code", 50, 94, "rect"),
        ("Run Local Heuristics (Homoglyphs, IP Literal, TLD)", 50, 84, "rect"),
        ("Send POST /v1/threat/inspect", 50, 74, "rect"),
        ("SSRF Guard: Private / Loopback IP?", 50, 62, "diamond"),
        ("Query MongoDB TTL Verdict Cache", 50, 48, "rect"),
        ("Cache Hit?", 50, 36, "diamond"),
        ("Query Multi-Engine APIs (VT, GSB, URLhaus)", 75, 24, "rect"),
        ("Merge Verdicts & Calculate Confidence", 50, 14, "rect"),
        ("Feed Scorer & Display 3D Posture", 50, 4, "rect")
    ]

    for text, cx, cy, shape in steps:
        if shape == "rect":
            b = patches.FancyBboxPatch((cx-24, cy-3), 48, 6, boxstyle="round,pad=0.4", ec="#2B6CB0", fc="#EBF8FF", lw=1.2)
            ax.add_patch(b)
            ax.text(cx, cy, text, fontsize=7.5, fontweight='bold', ha='center', va='center', color="#1A365D")
        elif shape == "diamond":
            d = patches.Polygon([[cx, cy+4.5], [cx+20, cy], [cx, cy-4.5], [cx-20, cy]], closed=True, ec="#DD6B20", fc="#FFFAF0", lw=1.2)
            ax.add_patch(d)
            ax.text(cx, cy, text, fontsize=7, fontweight='bold', ha='center', va='center', color="#7B341E")

    # Connectors
    ax.annotate("", xy=(50, 87), xytext=(50, 91), arrowprops=dict(arrowstyle="->", lw=1.2))
    ax.annotate("", xy=(50, 77), xytext=(50, 81), arrowprops=dict(arrowstyle="->", lw=1.2))
    ax.annotate("", xy=(50, 66.5), xytext=(50, 71), arrowprops=dict(arrowstyle="->", lw=1.2))
    # SSRF Yes -> Reject
    ax.annotate("", xy=(18, 62), xytext=(30, 62), arrowprops=dict(arrowstyle="->", color="#E53E3E", lw=1.2))
    ax.text(24, 63.5, "Yes", fontsize=7.5, color="#E53E3E", fontweight='bold')
    rb = patches.FancyBboxPatch((4, 59.5), 14, 5, boxstyle="round,pad=0.3", ec="#E53E3E", fc="#FFF5F5", lw=1.2)
    ax.add_patch(rb)
    ax.text(11, 62, "400 Reject (SSRF)", fontsize=6.5, fontweight='bold', color="#9B2C2C", ha='center', va='center')
    # SSRF No -> Cache
    ax.annotate("", xy=(50, 51), xytext=(50, 57.5), arrowprops=dict(arrowstyle="->", lw=1.2))
    ax.text(51.5, 54, "No", fontsize=7.5, color="#2D3748")
    ax.annotate("", xy=(50, 40.5), xytext=(50, 45), arrowprops=dict(arrowstyle="->", lw=1.2))
    # Cache Hit Yes
    ax.annotate("", xy=(50, 17), xytext=(50, 31.5), arrowprops=dict(arrowstyle="->", lw=1.2))
    ax.text(51.5, 27, "Yes (Hit)", fontsize=7.5, color="#2F855A", fontweight='bold')
    # Cache Hit No
    ax.annotate("", xy=(75, 27), xytext=(70, 36), arrowprops=dict(arrowstyle="->", lw=1.2))
    ax.text(74, 33, "No (Miss)", fontsize=7.5, color="#DD6B20")
    ax.annotate("", xy=(72, 14), xytext=(75, 21), arrowprops=dict(arrowstyle="->", lw=1.2))
    ax.annotate("", xy=(50, 7), xytext=(50, 11), arrowprops=dict(arrowstyle="->", lw=1.2))

    plt.tight_layout()
    plt.savefig("report_assets/fig_3_8_threat_flow.png", dpi=250, bbox_inches='tight')
    plt.close()

# 9. Figure 3.9: Wi-Fi Sentinel Sequence Diagram
def make_fig_3_9():
    fig, ax = plt.subplots(figsize=(9.5, 5.5), dpi=250)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    cols = [
        ("Mobile Hardware\n(802.11 Radios)", 15),
        ("Wi-Fi Sentinel\n(Client Module)", 40),
        ("Attack Predictor\n(Risk Rules)", 65),
        ("Score & Alert Engine\n(State Store)", 88)
    ]
    for name, x in cols:
        b = patches.FancyBboxPatch((x-10, 88), 20, 8, boxstyle="round,pad=0.3", ec="#2F855A", fc="#F0FFF4", lw=1.2)
        ax.add_patch(b)
        ax.text(x, 92, name, fontsize=7.5, fontweight='bold', ha='center', va='center', color="#22543D")
        ax.plot([x, x], [8, 88], color="#CBD5E0", linestyle="--", lw=1.2)

    seqs = [
        (15, 40, 80, "Trigger Pre-Connection Scan (SSID, BSSID, RSSI)", "->"),
        (40, 40, 72, "Inspect Beacon Ciphers (Open, WEP, WPA2, WPA3)", "self"),
        (40, 65, 64, "Evaluate Network Telemetry against Attack Profiles", "->"),
        (65, 65, 56, "Detect Honeypot / Rogue AP / Fake Captive Portal", "self"),
        (65, 40, 48, "Risk Assessment: CRITICAL (Open/Unencrypted AP)", "-->"),
        (40, 88, 40, "Update Network Sub-Score (-70 points)", "->"),
        (88, 88, 32, "Trigger Monotonic Score Re-Calculation", "self"),
        (88, 40, 24, "Emit Emergency Disconnect Warning Card", "-->")
    ]
    for x1, x2, y, msg, style in seqs:
        if style == "self":
            ax.annotate("", xy=(x1+3, y-2), xytext=(x1, y+1), arrowprops=dict(arrowstyle="->", color="#2F855A", lw=1.2))
            ax.text(x1+4, y, msg, fontsize=7, color="#2D3748")
        elif style == "->":
            ax.annotate("", xy=(x2, y), xytext=(x1, y), arrowprops=dict(arrowstyle="->", color="#2B6CB0", lw=1.2))
            ax.text((x1+x2)/2, y+1.5, msg, fontsize=7, ha='center', color="#2D3748")
        elif style == "-->":
            ax.annotate("", xy=(x2, y), xytext=(x1, y), arrowprops=dict(arrowstyle="->", linestyle="--", color="#E53E3E", lw=1.2))
            ax.text((x1+x2)/2, y+1.5, msg, fontsize=7, ha='center', color="#9B2C2C")

    plt.tight_layout()
    plt.savefig("report_assets/fig_3_9_seq_wifi.png", dpi=250, bbox_inches='tight')
    plt.close()

# 10. Figure 3.10: Use Case Diagram
def make_fig_3_10():
    fig, ax = plt.subplots(figsize=(9.5, 6), dpi=250)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Actors
    # User on left
    ax.plot([10, 10], [55, 65], color="#1A365D", lw=2) # body
    ax.plot([10], [70], marker='o', markersize=12, color="#1A365D") # head
    ax.plot([5, 15], [60, 60], color="#1A365D", lw=2) # arms
    ax.plot([5, 10], [47, 55], color="#1A365D", lw=2) # leg
    ax.plot([15, 10], [47, 55], color="#1A365D", lw=2) # leg
    ax.text(10, 42, "Mobile User", fontsize=9, fontweight='bold', ha='center', color="#1A365D")

    # Admin on right
    ax.plot([90, 90], [55, 65], color="#DD6B20", lw=2)
    ax.plot([90], [70], marker='o', markersize=12, color="#DD6B20")
    ax.plot([85, 95], [60, 60], color="#DD6B20", lw=2)
    ax.plot([85, 90], [47, 55], color="#DD6B20", lw=2)
    ax.plot([95, 90], [47, 55], color="#DD6B20", lw=2)
    ax.text(90, 42, "Administrator", fontsize=9, fontweight='bold', ha='center', color="#DD6B20")

    # Boundary Box
    bound = patches.FancyBboxPatch((24, 6), 52, 88, boxstyle="round,pad=1.0", ec="#4A5568", fc="#F7FAFC", lw=1.8)
    ax.add_patch(bound)
    ax.text(50, 90, "Cyber Companion System", fontsize=10.5, fontweight='bold', ha='center', color="#2D3748")

    use_cases = [
        ("Scan Barcode / QR Quishing", 78, "user"),
        ("Inspect Target URL & Homoglyphs", 67, "user"),
        ("Pre-Connection Wi-Fi Sentinel Check", 56, "user"),
        ("Audit On-Device App Permissions", 45, "user"),
        ("View 3D Cyber Shield & Health Score", 34, "user"),
        ("Query Grounded RAG AI Explainer", 23, "user"),
        ("TOTP Authentication", 78, "admin"),
        ("Run 25-Suite Threat Benchmark", 62, "admin"),
        ("Manage MongoDB Verdict TTL Cache", 46, "admin"),
        ("Publish Byte-Sized Cyber Tips", 30, "admin"),
        ("Inspect Gateway Health & Logs", 14, "admin")
    ]

    for uc_text, y_pos, role in use_cases:
        if role == "user":
            uc = patches.Ellipse((38, y_pos), 22, 7.5, ec="#2B6CB0", fc="#EBF8FF", lw=1.2)
            ax.add_patch(uc)
            ax.text(38, y_pos, uc_text, fontsize=6.8, ha='center', va='center', color="#1A365D")
            ax.plot([14, 27], [60, y_pos], color="#2B6CB0", lw=1)
        elif role == "admin":
            uc = patches.Ellipse((62, y_pos), 22, 7.5, ec="#DD6B20", fc="#FFFAF0", lw=1.2)
            ax.add_patch(uc)
            ax.text(62, y_pos, uc_text, fontsize=6.8, ha='center', va='center', color="#7B341E")
            ax.plot([86, 73], [60, y_pos], color="#DD6B20", lw=1)

    plt.tight_layout()
    plt.savefig("report_assets/fig_3_10_usecase.png", dpi=250, bbox_inches='tight')
    plt.close()

# 11. Figure 3.11: UML Class Diagram
def make_fig_3_11():
    fig, ax = plt.subplots(figsize=(10, 6.2), dpi=250)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    classes = [
        ("ScoringEngine", 5, 55, 27, 40, [
            "+ SCORING_WEIGHTS: Map",
            "+ calculateOverallScore(input): ScoreOutput",
            "+ calculateNetworkScore(wifi): number",
            "+ calculateUrlSafetyScore(urls): number",
            "+ calculatePermissionScore(apps): number",
            "+ calculateDeviceBaseline(dev): number"
        ]),
        ("ScoreOutput", 37, 65, 27, 30, [
            "+ score: number (0-100)",
            "+ band: ScoreBand",
            "+ isPartialScore: boolean",
            "+ breakdown: Breakdown",
            "+ topRecommendations: Array"
        ]),
        ("ThreatAnalysisResult", 69, 55, 27, 40, [
            "+ target: string",
            "+ verdict: ThreatVerdict",
            "+ confidenceScore: number",
            "+ heuristicsTriggered: string[]",
            "+ threatIntelSources: Array",
            "+ recommendedAction: string"
        ]),
        ("WifiTelemetry", 5, 8, 27, 38, [
            "+ ssid: string",
            "+ bssid: string",
            "+ securityType: SecurityType",
            "+ isCaptivePortal: boolean",
            "+ predictedAttacks: string[]",
            "+ inspectBeacons(): Telemetry"
        ]),
        ("PermissionAuditor", 37, 8, 27, 38, [
            "+ HIGH_RISK_COMBOS: Map",
            "+ auditPackage(pkg): Audit",
            "+ evaluateMatrix(): Report",
            "+ dangerousCombos: Array",
            "+ isZeroPIIEnforced: boolean"
        ]),
        ("AiExplainerService", 69, 8, 27, 38, [
            "+ explainThreat(req): Response",
            "+ matchKnowledgeBase(q): Article[]",
            "+ enforceInjectionGuard(): void",
            "+ immutableVerdict: string",
            "+ citations: string[]"
        ])
    ]

    for c_name, x, y, w, h, methods in classes:
        hb = patches.Rectangle((x, y + h - 8), w, 8, ec="#2B6CB0", fc="#2B6CB0", lw=1.2)
        ax.add_patch(hb)
        ax.text(x + w/2, y + h - 4, c_name, fontsize=8, fontweight='bold', ha='center', va='center', color="#FFFFFF")
        bb = patches.Rectangle((x, y), w, h - 8, ec="#2B6CB0", fc="#F7FAFC", lw=1.2)
        ax.add_patch(bb)
        for idx, m_text in enumerate(methods):
            ax.text(x + 1.5, y + h - 12 - idx*4.5, m_text, fontsize=6.8, color="#2D3748")

    # Connectors
    ax.annotate("", xy=(37, 78), xytext=(32, 78), arrowprops=dict(arrowstyle="->", color="#4A5568", lw=1.2))
    ax.annotate("", xy=(20, 55), xytext=(20, 46), arrowprops=dict(arrowstyle="<-", color="#4A5568", lw=1.2))
    ax.annotate("", xy=(50, 55), xytext=(50, 46), arrowprops=dict(arrowstyle="<-", color="#4A5568", lw=1.2))
    ax.annotate("", xy=(82, 55), xytext=(82, 46), arrowprops=dict(arrowstyle="<->", color="#4A5568", lw=1.2))

    plt.tight_layout()
    plt.savefig("report_assets/fig_3_11_class_diagram.png", dpi=250, bbox_inches='tight')
    plt.close()

# 12. Figure 3.12: Activity Diagram
def make_fig_3_12():
    fig, ax = plt.subplots(figsize=(8, 6.8), dpi=250)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Initial state
    ax.plot([50], [95], marker='o', markersize=14, color="#1A365D")

    activities = [
        ("User Captures QR Frame or Inputs URL", 87, "rect"),
        ("Execute Client Heuristics (Homoglyphs & TLDs)", 77, "rect"),
        ("Dispatch Payload to Threat Gateway", 67, "rect"),
        ("SSRF Guard Checks Destination IP", 57, "rect"),
        ("Is Target Public Web Host?", 46, "diamond"),
        ("Query Multi-Engine Consensus & Compute Confidence", 34, "rect"),
        ("Calculate Deterministic 0-100 Monotonic Score", 22, "rect"),
        ("Update 3D Shield Posture & Render Remediation", 10, "rect")
    ]

    for text, y_pos, shape in activities:
        if shape == "rect":
            b = patches.FancyBboxPatch((25, y_pos - 3), 50, 6, boxstyle="round,pad=0.4", ec="#2B6CB0", fc="#EBF8FF", lw=1.2)
            ax.add_patch(b)
            ax.text(50, y_pos, text, fontsize=7.5, fontweight='bold', ha='center', va='center', color="#1A365D")
        elif shape == "diamond":
            d = patches.Polygon([[50, y_pos+4.5], [70, y_pos], [50, y_pos-4.5], [30, y_pos]], closed=True, ec="#DD6B20", fc="#FFFAF0", lw=1.2)
            ax.add_patch(d)
            ax.text(50, y_pos, text, fontsize=7, fontweight='bold', ha='center', va='center', color="#7B341E")

    # Connectors
    ax.annotate("", xy=(50, 90), xytext=(50, 93), arrowprops=dict(arrowstyle="->", lw=1.2))
    ax.annotate("", xy=(50, 80), xytext=(50, 84), arrowprops=dict(arrowstyle="->", lw=1.2))
    ax.annotate("", xy=(50, 70), xytext=(50, 74), arrowprops=dict(arrowstyle="->", lw=1.2))
    ax.annotate("", xy=(50, 60), xytext=(50, 64), arrowprops=dict(arrowstyle="->", lw=1.2))
    ax.annotate("", xy=(50, 50.5), xytext=(50, 54), arrowprops=dict(arrowstyle="->", lw=1.2))

    # Decision branches
    ax.annotate("", xy=(50, 37), xytext=(50, 41.5), arrowprops=dict(arrowstyle="->", lw=1.2))
    ax.text(52, 39, "Yes", fontsize=7.5, color="#2F855A", fontweight='bold')

    ax.annotate("", xy=(18, 46), xytext=(30, 46), arrowprops=dict(arrowstyle="->", color="#E53E3E", lw=1.2))
    ax.text(24, 47.5, "No", fontsize=7.5, color="#E53E3E", fontweight='bold')
    rej = patches.FancyBboxPatch((4, 43.5), 14, 5, boxstyle="round,pad=0.3", ec="#E53E3E", fc="#FFF5F5", lw=1.2)
    ax.add_patch(rej)
    ax.text(11, 46, "Block (SSRF)", fontsize=6.5, fontweight='bold', color="#9B2C2C", ha='center', va='center')

    ax.annotate("", xy=(50, 25), xytext=(50, 31), arrowprops=dict(arrowstyle="->", lw=1.2))
    ax.annotate("", xy=(50, 13), xytext=(50, 19), arrowprops=dict(arrowstyle="->", lw=1.2))

    # Final state
    ax.plot([50], [2], marker='o', markersize=14, color="#1A365D")
    ax.plot([50], [2], marker='o', markersize=8, color="#FFFFFF")
    ax.annotate("", xy=(50, 4), xytext=(50, 7), arrowprops=dict(arrowstyle="->", lw=1.2))

    plt.tight_layout()
    plt.savefig("report_assets/fig_3_12_activity.png", dpi=250, bbox_inches='tight')
    plt.close()

# 13. Figure 3.13: QR Quishing Sandbox and RAG AI Sequence
def make_fig_3_13():
    fig, ax = plt.subplots(figsize=(10, 5.8), dpi=250)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    cols = [
        ("Camera Hardware\n(Frame Buffer)", 12),
        ("QR Scanner Service\n(In-Memory Sandbox)", 36),
        ("Threat Gateway\n(Consensus)", 62),
        ("RAG AI Explainer\n(Knowledge Base)", 88)
    ]
    for name, x in cols:
        b = patches.FancyBboxPatch((x-10, 88), 20, 8, boxstyle="round,pad=0.3", ec="#2B6CB0", fc="#EBF8FF", lw=1.2)
        ax.add_patch(b)
        ax.text(x, 92, name, fontsize=7.5, fontweight='bold', ha='center', va='center', color="#1A365D")
        ax.plot([x, x], [8, 88], color="#CBD5E0", linestyle="--", lw=1.2)

    seqs = [
        (12, 36, 80, "Raw video frames / Image buffer", "->"),
        (36, 36, 72, "Decode barcode & isolate payload string in sandbox", "self"),
        (36, 62, 64, "Dispatch sandboxed URL for Threat Verification", "->"),
        (62, 62, 56, "Evaluate VT, GSB, Lexical Heuristics", "self"),
        (62, 36, 48, "Verdict: MALICIOUS (Quishing credential harvester)", "-->"),
        (36, 88, 40, "Request plain-language explanation (Query + Flags)", "->"),
        (88, 88, 32, "Score KB articles [KB-001..005] & enforce Prompt Guard", "self"),
        (88, 36, 24, "Return grounded remediation citing authoritative sources", "-->"),
        (36, 36, 16, "Intercept Android deep link launch & show warning modal", "self")
    ]
    for x1, x2, y, msg, style in seqs:
        if style == "self":
            ax.annotate("", xy=(x1+3, y-2), xytext=(x1, y+1), arrowprops=dict(arrowstyle="->", color="#2F855A", lw=1.2))
            ax.text(x1+4, y, msg, fontsize=7, color="#2D3748")
        elif style == "->":
            ax.annotate("", xy=(x2, y), xytext=(x1, y), arrowprops=dict(arrowstyle="->", color="#2B6CB0", lw=1.2))
            ax.text((x1+x2)/2, y+1.5, msg, fontsize=7, ha='center', color="#2D3748")
        elif style == "-->":
            ax.annotate("", xy=(x2, y), xytext=(x1, y), arrowprops=dict(arrowstyle="->", linestyle="--", color="#E53E3E", lw=1.2))
            ax.text((x1+x2)/2, y+1.5, msg, fontsize=7, ha='center', color="#9B2C2C")

    plt.tight_layout()
    plt.savefig("report_assets/fig_3_13_seq_quishing_rag.png", dpi=250, bbox_inches='tight')
    plt.close()

# 14. Figure 4.1: Performance Chart
def make_fig_4_1():
    fig, ax = plt.subplots(figsize=(9, 4.6), dpi=250)
    
    tasks = [
        "Local Lexical Heuristics",
        "SSRF & DNS-Rebinding Guard",
        "MongoDB TTL Verdict Cache Hit",
        "Wi-Fi Sentinel Beacon Analysis",
        "On-Device Permission Audit",
        "Deterministic Scoring Engine",
        "Grounded RAG AI Explainer",
        "Multi-Engine Intel API Aggregation"
    ]
    times = [4, 6, 11, 18, 22, 2, 36, 485]
    colors = ["#3182CE", "#3182CE", "#38A169", "#4299E1", "#4299E1", "#38A169", "#805AD5", "#DD6B20"]

    y_pos = range(len(tasks))
    bars = ax.barh(y_pos, times, color=colors, height=0.6, edgecolor="#2D3748", lw=0.8)

    ax.set_yticks(y_pos)
    ax.set_yticklabels(tasks, fontsize=8.5, fontweight='bold', color="#2D3748")
    ax.set_xlabel("Mean Execution / Latency Time (ms) - 3 Runs Average", fontsize=9, fontweight='bold', color="#2D3748")
    ax.set_xlim(0, 560)
    ax.grid(axis='x', linestyle='--', alpha=0.6)

    for bar, t in zip(bars, times):
        ax.text(bar.get_width() + 8, bar.get_y() + bar.get_height()/2, f"{t} ms", va='center', fontsize=8, fontweight='bold', color="#2D3748")

    plt.tight_layout()
    plt.savefig("report_assets/fig_4_1_performance_chart.png", dpi=250, bbox_inches='tight')
    plt.close()

print("Generating all 14 architectural diagrams and performance charts...")
make_fig_3_1()
make_fig_3_2()
make_fig_3_3()
make_fig_3_4()
make_fig_3_5()
make_fig_3_6()
make_fig_3_7()
make_fig_3_8()
make_fig_3_9()
make_fig_3_10()
make_fig_3_11()
make_fig_3_12()
make_fig_3_13()
make_fig_4_1()
print("All 14 diagrams generated successfully in report_assets/!")
