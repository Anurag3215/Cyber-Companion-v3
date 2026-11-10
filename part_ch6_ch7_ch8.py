import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT
from docx.enum.table import WD_TABLE_ALIGNMENT
from report_helpers import (
    add_p, add_chapter_title, add_h1, add_h2, add_code_block,
    add_ui_screenshot_placeholder, FONT_PRIMARY, FONT_CODE, COLOR_TEXT
)

def build_chapter_6(doc):
    # PAGE 48 (Report Page 41): Chapter 6 Coding & app.ts
    add_chapter_title(doc, "6", "Coding")
    add_h1(doc, "6.1 Source Code")
    add_p(
        doc,
        "This chapter lists the source code of the modules that implement the core features of Cyber Companion: "
        "the Threat Intelligence Gateway application entry point, the SSRF & DNS-rebinding guard, the pure deterministic "
        "0–100 scoring engine, and the grounded RAG AI Explainer service. The complete repository source code is "
        "available at https://github.com/Anurag3215/Cyber-Companion-v3.",
        space_after=8, line_spacing=1.15
    )

    code_p48 = """import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { healthRouter } from './routes/health.js';
import { threatRouter } from './routes/threat.js';
import { tipsRouter } from './routes/tips.js';
import { adminRouter } from './routes/admin.js';
import { rateLimiterMiddleware } from './middleware/rateLimiter.js';
import { structuredLogger } from './middleware/logger.js';

export function createApp(): Express {
  const app = express();

  // Structured logging & Security headers
  app.use(structuredLogger);
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    }),
  );

  // Rate Limiting
  app.use(rateLimiterMiddleware);

  // Body parser with size limits
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));"""

    add_code_block(doc, code_p48, filename="6.1.1 app.ts", desc="Threat Intelligence Gateway application entry point (apps/api/src/app.ts)")
    doc.add_page_break()

    # PAGE 49 (Report Page 42): app.ts cont.
    code_p49 = """  // Root & API Discovery Handler
  app.get(['/', '/v1'], (_req: Request, res: Response) => {
    res.status(200).json({
      service: 'Cyber Companion Threat Intelligence Gateway',
      version: '1.1.0',
      status: 'healthy',
      appUiUrl: 'http://localhost:8081',
      message: 'This is the backend REST API Gateway. Open http://localhost:8081 for App UI.',
      endpoints: {
        health: 'GET /v1/health',
        inspectThreat: 'POST /v1/threat/inspect',
        assessWifi: 'POST /v1/threat/wifi/assess',
        aiExplainer: 'POST /v1/threat/explain',
        dailyTips: 'GET /v1/tips/today',
        adminAuth: 'POST /v1/admin/login',
        adminBenchmark: 'POST /v1/admin/benchmark/run',
      },
    });
  });

  // Core Service Routes
  app.use('/v1/health', healthRouter);
  app.use('/v1/threat', threatRouter);
  app.use('/v1/tips', tipsRouter);
  app.use('/v1/awareness/tips', tipsRouter);
  app.use('/v1/admin', adminRouter);"""

    add_code_block(doc, code_p49, filename="", desc="app.ts (continued)")
    doc.add_page_break()

    # PAGE 50 (Report Page 43): app.ts cont.
    code_p50 = """  // 404 Not Found handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not Found',
      message: 'The requested endpoint does not exist on this gateway.',
    });
  });

  // Global centralized error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : err.message,
    });
  });

  return app;
}

// Server initialization & graceful shutdown
export function startServer(port = process.env.PORT || 5000) {
  const app = createApp();
  const server = app.listen(port, () => {
    console.log(`[CyberCompanion] Threat Gateway listening on port ${port}`);
  });
  return server;
}"""

    add_code_block(doc, code_p50, filename="", desc="app.ts (continued)")
    doc.add_page_break()

    # PAGE 51 (Report Page 44): app.ts export & ssrfGuard.ts
    code_p51 = """export default createApp;

// 6.1.2 ssrfGuard.ts
// Server-Side Request Forgery & DNS Rebinding Guard (apps/api/src/middleware/ssrfGuard.ts)

import { Request, Response, NextFunction } from 'express';

const PRIVATE_IP_PATTERNS = [
  /^127\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$/, // 127.0.0.0/8 Loopback
  /^10\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$/,  // 10.0.0.0/8 Private
  /^192\\.168\\.\\d{1,3}\\.\\d{1,3}$/,     // 192.168.0.0/16 Private
  /^172\\.(1[6-9]|2\\d|3[0-1])\\.\\d{1,3}\\.\\d{1,3}$/, // 172.16.0.0/12 Private
  /^169\\.254\\.\\d{1,3}\\.\\d{1,3}$/,    // 169.254.0.0/16 Link-local / Cloud Metadata
  /^0\\.0\\.0\\.0$/,
  /^::1$/,
  /^::$/,
  /^0$/,
];

export function parseDwordOrHexIp(hostname: string): string | null {
  // Check decimal integer / dword representation (e.g. 2130706433 -> 127.0.0.1)
  if (/^\\d+$/.test(hostname)) {
    const num = parseInt(hostname, 10);
    if (num >= 0 && num <= 4294967295) {
      return `${(num >>> 24) & 255}.${(num >>> 16) & 255}.${(num >>> 8) & 255}.${num & 255}`;
    }
  }

  // Check hex integer representation (e.g. 0x7f000001)
  if (/^0x[0-9a-fA-F]+$/.test(hostname)) {
    const num = parseInt(hostname, 16);
    if (!isNaN(num) && num >= 0 && num <= 4294967295) {
      return `${(num >>> 24) & 255}.${(num >>> 16) & 255}.${(num >>> 8) & 255}.${num & 255}`;
    }
  }
  return null;
}"""

    add_code_block(doc, code_p51, filename="6.1.2 ssrfGuard.ts", desc="SSRF and DNS-rebinding guard (apps/api/src/middleware/ssrfGuard.ts)")
    doc.add_page_break()

    # PAGE 52 (Report Page 45): ssrfGuard.ts cont. & scorer.ts
    code_p52 = """export function isPrivateOrLoopbackHost(hostname: string): boolean {
  let normalized = hostname.toLowerCase().trim();
  if (normalized.startsWith('[') && normalized.endsWith(']')) normalized = normalized.slice(1, -1);
  if (normalized.startsWith('::ffff:')) normalized = normalized.replace('::ffff:', '');

  const convertedNumeric = parseDwordOrHexIp(normalized);
  if (convertedNumeric) normalized = convertedNumeric;

  if (normalized === 'localhost' || normalized.endsWith('.localhost')) return true;
  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(normalized)) return true;
  }
  return false;
}

// 6.1.3 scorer.ts
// Pure Deterministic Monotonic Scoring Engine (packages/scoring-core/src/scorer.ts)

export interface ScoringInput {
  wifi?: {
    securityType: 'OPEN' | 'WEP' | 'WPA' | 'WPA2' | 'WPA3' | 'UNKNOWN';
    isCaptivePortal?: boolean;
  };
  recentUrls?: Array<{ verdict: 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS' | 'UNKNOWN' }>;
  appAudits?: Array<{ riskLevel: 'SAFE' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'; appName?: string }>;
  device?: { isScreenLockEnabled?: boolean; isOsUpdated?: boolean; isRootedOrJailbroken?: boolean };
}

export const SCORING_WEIGHTS = {
  NETWORK: 0.3,
  URL_SAFETY: 0.3,
  PERMISSIONS: 0.2,
  DEVICE_BASELINE: 0.2,
} as const;"""

    add_code_block(doc, code_p52, filename="6.1.3 scorer.ts", desc="Pure deterministic mathematical scoring engine (packages/scoring-core/src/scorer.ts)")
    doc.add_page_break()

    # PAGE 53 (Report Page 46): scorer.ts cont. & aiExplainerService.ts
    code_p53 = """export function calculateNetworkScore(wifi?: ScoringInput['wifi']): number {
  if (!wifi) return 80;
  let score = 100;
  switch (wifi.securityType) {
    case 'OPEN': score -= 70; break;
    case 'WEP': score -= 50; break;
    case 'WPA': score -= 25; break;
    case 'WPA2': score -= 5; break;
    case 'WPA3': score = 100; break;
    case 'UNKNOWN': score = 60; break;
  }
  if (wifi.isCaptivePortal) score -= 30;
  return Math.max(0, Math.min(100, score));
}

export function calculateOverallScore(input: ScoringInput): { score: number; band: string } {
  const net = calculateNetworkScore(input.wifi);
  const url = calculateUrlScore(input.recentUrls);
  const perm = calculatePermissionScore(input.appAudits);
  const dev = calculateDeviceScore(input.device);

  const raw = (net * SCORING_WEIGHTS.NETWORK) +
              (url * SCORING_WEIGHTS.URL_SAFETY) +
              (perm * SCORING_WEIGHTS.PERMISSIONS) +
              (dev * SCORING_WEIGHTS.DEVICE_BASELINE);
  const score = Math.round(Math.max(0, Math.min(100, raw)));
  const band = score >= 80 ? 'SECURE' : score >= 60 ? 'MODERATE' : score >= 40 ? 'AT_RISK' : 'CRITICAL';
  return { score, band };
}

// 6.1.4 aiExplainerService.ts
// Grounded RAG AI Explainer with Prompt Injection Defense (apps/api/src/services/aiExplainerService.ts)

import knowledgeBase from '../data/cyberKnowledgeBase.json';
import { z } from 'zod';

export const ExplainerRequestSchema = z.object({
  query: z.string().min(2).max(500),
  immutableVerdict: z.enum(['SAFE', 'SUSPICIOUS', 'MALICIOUS', 'UNKNOWN']),
  detectedFlags: z.array(z.string()).default([]),
});"""

    add_code_block(doc, code_p53, filename="6.1.4 aiExplainerService.ts", desc="Grounded RAG AI explainer with prompt injection defenses")
    doc.add_page_break()

    # PAGE 54 (Report Page 47): aiExplainerService.ts cont.
    code_p54 = """export class AiExplainerService {
  explainThreat(request: ExplainerRequest): ExplainerResponse {
    const validated = ExplainerRequestSchema.parse(request);
    const queryLower = validated.query.toLowerCase().trim();
    const queryTokens = queryLower.split(/\\s+/).filter((t) => t.length >= 3);

    // Score KB articles [KB-001..KB-005] based on semantic relevance
    const scoredArticles = knowledgeBase.map((entry) => {
      let score = 0;
      if (queryLower.includes(entry.topic.toLowerCase())) score += 20;
      for (const token of queryTokens) {
        if (entry.topic.toLowerCase().includes(token)) score += 8;
        if (entry.summary.toLowerCase().includes(token)) score += 3;
      }
      for (const flag of validated.detectedFlags) {
        if (entry.threatVector.toLowerCase().includes(flag.toLowerCase())) score += 10;
      }
      return { entry, score };
    });

    scoredArticles.sort((a, b) => b.score - a.score);
    const primaryDoc = scoredArticles.length > 0 && scoredArticles[0].score > 0
      ? scoredArticles[0].entry
      : knowledgeBase[0];

    // Preserve mathematically immutable verdict
    return {
      immutableVerdict: validated.immutableVerdict,
      explanation: `${primaryDoc.summary} This threat corresponds to ${primaryDoc.threatVector}.`,
      citations: [`[${primaryDoc.id}] ${primaryDoc.title}`],
      recommendedActions: primaryDoc.remediation,
      groundedInKnowledgeBase: true,
    };
  }
}"""

    add_code_block(doc, code_p54, filename="", desc="aiExplainerService.ts (continued)")
    doc.add_page_break()

def build_chapter_7(doc):
    # PAGE 55 (Report Page 48): Chapter 7 Screen Shots (Figures 7.1 & 7.2)
    add_chapter_title(doc, "7", "Screen Shots")
    add_p(
        doc,
        "The primary user dashboard of Cyber Companion. The real-time 3D Cyber Shield Core visualizes device posture, "
        "paired with the deterministic 0–100 security health gauge and quick access action cards.",
        space_after=4, line_spacing=1.15
    )

    add_ui_screenshot_placeholder(
        doc,
        "Mobile Dashboard with 3D Cyber Shield Core and Real-Time Security Health Score",
        "Figure 7.1: Mobile Dashboard with 3D Cyber Shield Core and Real-Time Security Health Score"
    )

    add_p(
        doc,
        "The Scan Hub interface featuring hardware camera barcode scanning and the isolated in-memory Quishing Sandbox preview.",
        space_after=4, line_spacing=1.15
    )

    add_ui_screenshot_placeholder(
        doc,
        "Scan Hub Screen with Optical Camera QR Scanner and Quishing Sandbox",
        "Figure 7.2: Scan Hub Screen with Optical Camera QR Scanner and Quishing Sandbox"
    )

    doc.add_page_break()

    # PAGE 56 (Report Page 49): Figures 7.3 & 7.4
    add_p(
        doc,
        "Detailed URL Threat Inspector view displaying detected Cyrillic homoglyphs, SSRF loopback verification, and multi-engine consensus.",
        space_after=4, line_spacing=1.15
    )

    add_ui_screenshot_placeholder(
        doc,
        "URL Threat Inspector Result with Lexical Homoglyph Warnings and Multi-Engine Consensus",
        "Figure 7.3: URL Threat Inspector Result with Lexical Homoglyph Warnings and Multi-Engine Consensus"
    )

    add_p(
        doc,
        "Pre-Connection Wi-Fi Sentinel screen displaying 802.11 beacon cipher inspection, Evil Twin detection, and predicted attack vectors.",
        space_after=4, line_spacing=1.15
    )

    add_ui_screenshot_placeholder(
        doc,
        "Wi-Fi Sentinel Screen with 802.11 Beacon Cipher Analysis and Attack Vector Predictions",
        "Figure 7.4: Wi-Fi Sentinel Screen with 802.11 Beacon Cipher Analysis and Attack Vector Predictions"
    )

    doc.add_page_break()

    # PAGE 57 (Report Page 50): Figures 7.5 & 7.6
    add_p(
        doc,
        "On-Device Application Permission Auditor highlighting high-risk sensor combinations (SMS reading + Internet access) without cloud exfiltration.",
        space_after=4, line_spacing=1.15
    )

    add_ui_screenshot_placeholder(
        doc,
        "On-Device Application Permission Auditor High-Risk Sensor Matrix",
        "Figure 7.5: On-Device Application Permission Auditor High-Risk Sensor Matrix"
    )

    add_p(
        doc,
        "Grounded RAG AI Explainer modal presenting plain-language threat remediation and authoritative knowledge base citations ([KB-001]).",
        space_after=4, line_spacing=1.15
    )

    add_ui_screenshot_placeholder(
        doc,
        "Grounded RAG AI Explainer Modal with Knowledge Base Citations",
        "Figure 7.6: Grounded RAG AI Explainer Modal with Knowledge Base Citations"
    )

    doc.add_page_break()

    # PAGE 58 (Report Page 51): Figures 7.7 & 7.8
    add_p(
        doc,
        "Cyber Awareness Hub providing daily byte-sized security tips (<=60 words), interactive quizzes, and gamified hygiene streaks.",
        space_after=4, line_spacing=1.15
    )

    add_ui_screenshot_placeholder(
        doc,
        "Cyber Awareness Hub with Daily Byte-Sized Tips and Micro-Learning Modules",
        "Figure 7.7: Cyber Awareness Hub with Daily Byte-Sized Tips and Micro-Learning Modules"
    )

    add_p(
        doc,
        "Chronological Threat History screen displaying previous URL, QR, and Wi-Fi inspections with persistent encrypted on-device storage.",
        space_after=4, line_spacing=1.15
    )

    add_ui_screenshot_placeholder(
        doc,
        "Inspection History Screen with Chronological Threat Logs and Re-Scan Actions",
        "Figure 7.8: Inspection History Screen with Chronological Threat Logs and Re-Scan Actions"
    )

    doc.add_page_break()

    # PAGE 59 (Report Page 52): Figures 7.9 & 7.10
    add_p(
        doc,
        "Administrator Authentication modal enforcing RFC 6238 Time-Based One-Time Password (TOTP) cryptographic verification.",
        space_after=4, line_spacing=1.15
    )

    add_ui_screenshot_placeholder(
        doc,
        "Administrative Login and Real-Time Benchmark Runner Console",
        "Figure 7.9: Administrative Login and Real-Time Benchmark Runner Console"
    )

    add_p(
        doc,
        "Administrative Threat Intelligence Cache Management console displaying MongoDB 24-hour TTL statistics and real-time health metrics.",
        space_after=4, line_spacing=1.15
    )

    add_ui_screenshot_placeholder(
        doc,
        "Administrative Threat Intelligence Cache Management and System Diagnostics",
        "Figure 7.10: Administrative Threat Intelligence Cache Management and System Diagnostics"
    )

    doc.add_page_break()

    # PAGE 60 (Report Page 53): Figure 7.11
    add_p(
        doc,
        "User Profile and Configuration screen allowing custom Threat Intelligence Gateway API URL assignment and zero-trust privacy controls.",
        space_after=4, line_spacing=1.15
    )

    add_ui_screenshot_placeholder(
        doc,
        "User Settings and Custom Gateway API Configuration Screen",
        "Figure 7.11: User Settings and Custom Gateway API Configuration Screen"
    )

    doc.add_page_break()

def build_chapter_8(doc):
    # PAGE 61 (Report Page 54): Chapter 8 References
    add_chapter_title(doc, "8", "References")

    references = [
        "[1] P. Ihantola, T. Ahoniemi, V. Karavirta and O. Seppälä, “Review of recent systems for automatic assessment of programming assignments,” in Proc. 10th Koli Calling Int. Conf. on Computing Education Research, 2010, pp. 86–93.",
        "[2] C. Douce, D. Livingstone and J. Orwell, “Automatic test-based assessment of programming: A review,” ACM Journal on Educational Resources in Computing, vol. 5, no. 3, Art. 4, 2005.",
        "[3] Y. Rekhter, B. Moskowitz, D. Karrenberg, G. J. de Groot, and E. Lear, “Address Allocation for Private Internets,” RFC 1918, Best Current Practice, Internet Engineering Task Force, Feb. 1996.",
        "[4] M. Jones, J. Bradley and N. Sakimura, “JSON Web Token (JWT),” RFC 7519, Internet Engineering Task Force, May 2015.",
        "[5] R. T. Fielding, “Architectural Styles and the Design of Network-based Software Architectures,” Ph.D. dissertation, Univ. of California, Irvine, 2000.",
        "[6] D. M'Raihi, S. Machani, M. Pei, and J. Rydell, “TOTP: Time-Based One-Time Password Algorithm,” RFC 6238, Internet Engineering Task Force, May 2011.",
        "[7] K. Schwaber and J. Sutherland, “The Scrum Guide,” Nov. 2020. [Online]. Available: https://scrumguides.org",
        "[8] Node.js Foundation, “Node.js v20.x LTS Documentation,” 2024. [Online]. Available: https://nodejs.org/docs/",
        "[9] MongoDB Inc., “MongoDB Atlas Manual and TTL Indexing,” 2024. [Online]. Available: https://www.mongodb.com/docs/manual/",
        "[10] React Native Community, “React Native Documentation,” Meta Platforms, 2024. [Online]. Available: https://reactnative.dev",
        "[11] M. Davis and M. Suignard, “Unicode Security Considerations,” Unicode Technical Report #36, Unicode Consortium, Aug. 2023. [Online]. Available: https://unicode.org/reports/tr36/",
        "[12] OWASP Foundation, “OWASP Mobile Top 10 Security Risks,” 2024. [Online]. Available: https://owasp.org/www-project-mobile-top-10/",
        "[13] VirusTotal, “VirusTotal REST API v3 Reference Documentation,” Google LLC, 2024. [Online]. Available: https://docs.virustotal.com/reference/overview",
        "[14] Three.js Authors, “Three.js WebGL 3D Engine Documentation,” 2024. [Online]. Available: https://threejs.org/docs/",
        "[15] P. Lewis, E. Perez, et al., “Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks,” in Proc. Advances in Neural Information Processing Systems (NeurIPS), vol. 33, 2020, pp. 9459–9474.",
        "[16] C. Colgan, “Zod: TypeScript-First Schema Validation with Static Type Inference,” 2024. [Online]. Available: https://zod.dev",
        "[17] Google LLC, “Google Safe Browsing APIs (v4) Documentation,” 2024. [Online]. Available: https://developers.google.com/safe-browsing/v4"
    ]

    for ref in references:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.left_indent = Inches(0.35)
        p.paragraph_format.first_line_indent = Inches(-0.35)
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(4.5)
        p.paragraph_format.line_spacing = 1.15
        r = p.add_run(ref)
        r.font.name = FONT_PRIMARY
        r.font.size = Pt(10)
