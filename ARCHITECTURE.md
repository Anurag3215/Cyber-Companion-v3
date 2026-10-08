# Cyber Companion — Enterprise Architecture Specification

> **Definitive Architectural Blueprint & Data Flow Reference**

---

## 1. High-Level System Architecture

```mermaid
flowchart TD
    subgraph Client["Cross-Platform Client (Android / iOS / Web)"]
        UI["React Native Paper UI & Theme Provider"]
        Nav["React Navigation (Native Stack)"]
        Store["Zustand Global State Store"]
        NativeBridge["Sensors & Telemetry Collector\n(WifiManager, VisionCamera, PackageManager)"]
        LocalHeuristics["Client Heuristics Engine\n(Punycode, Shorteners, TLD check)"]
        SecureStorage["Secure Storage (MMKV / Web Fallback)"]
        
        UI --> Nav
        Nav --> Store
        Store <--> NativeBridge
        Store <--> LocalHeuristics
        Store <--> SecureStorage
    end

    subgraph Gateway["Threat Intelligence Gateway (Node.js + Express + TS)"]
        SecLayer["Helmet + CORS + Pino Logger (Redacted)"]
        SSRFGuard["SSRF & DNS-Rebinding Guard"]
        Validator["Zod Contract Request Validator"]
        VerdictEngine["Verdict Merger & Confidence Engine"]
        CacheStore[("MongoDB TTL Cache / Memory Fallback")]
        
        SecLayer --> SSRFGuard --> Validator --> VerdictEngine
        VerdictEngine <--> CacheStore
    end

    subgraph ExternalIntel["Global Threat Intelligence Ecosystem"]
        VT["VirusTotal API (v3)"]
        GSB["Google Safe Browsing API (v4)"]
        US["URLScan.io API"]
        UH["URLhaus / OpenPhish Feeds"]
    end

    Store <-->|"HTTPS REST / TLS 1.3"| SecLayer
    VerdictEngine <-->|"Upstream REST API"| VT
    VerdictEngine <-->|"Upstream REST API"| GSB
    VerdictEngine <-->|"Upstream REST API"| US
    VerdictEngine <-->|"Upstream Feeds"| UH
```

---

## 2. Threat Intelligence & Scoring Data Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Non-Technical User
    participant App as Mobile/Web Client
    participant GW as API Gateway
    participant SSRF as SSRF Guard
    participant Cache as Mongo Cache
    participant Intel as Threat Intel APIs
    participant Scorer as Scoring Engine

    User->>App: Submits URL or Scans QR Code
    App->>App: Run Local Heuristics (Homoglyphs, IP literal, Suspicious TLD)
    alt Obvious High-Risk Pattern Found
        App->>App: Flag immediate preliminary warning
    end
    App->>GW: POST /v1/threat/inspect { url, source }
    GW->>SSRF: Validate destination IP / DNS Rebinding check
    alt Private/Loopback IP Detected
        SSRF-->>GW: REJECT (Blocked SSRF Target)
        GW-->>App: 400 Bad Request (Private IP Target Forbidden)
    else Target is Public Web Endpoint
        GW->>Cache: Query cached domain verdict (TTL: 24h)
        alt Cache Hit
            Cache-->>GW: Return cached threat evaluation
        else Cache Miss
            par Query External Engines
                GW->>Intel: VirusTotal URL report
                GW->>Intel: Google Safe Browsing lookup
                GW->>Intel: URLhaus malware feed check
            end
            Intel-->>GW: Engine responses
            GW->>GW: Aggregate verdicts & calculate confidence
            GW->>Cache: Store verdict with TTL
        end
        GW-->>App: 200 OK (ThreatAnalysisResult)
    end
    App->>Scorer: Feed Result into Deterministic Scoring Engine
    Scorer-->>App: Updated Overall Security Health Score (0-100)
    App->>User: Display Plain-Language Explanation & Action Card
```

---

## 3. Module Interaction Matrix

| Module | Primary Inputs | Internal Processing | Outputs |
| :--- | :--- | :--- | :--- |
| **Wi-Fi Risk** | Current connection SSID, BSSID, protocol | Detect Open/WEP vs WPA2/WPA3, flag captive portals | `WifiTelemetry`, Risk level, Action card |
| **URL Scanner** | User input string or clipboard | Lexical heuristics + Gateway Threat Intel APIs | `ThreatAnalysisResult`, Verdict, Confidence |
| **QR Scanner** | Camera frame or gallery image | Vision barcode decoder + payload classifier | Classified payload, sandbox verification |
| **Permission Analyzer** | Android `PackageManager` manifest | Sensitive permission matrix, dangerous combos | `AppPermissionAudit`, Top risky apps list |
| **Scoring Engine** | Wi-Fi, URL results, app audits, device flags | Pure weighted function ($30/30/20/20$), bounded $0-100$ | `OverallSecurityScore`, Top 3 fixes |
| **Awareness Hub** | Threat results, daily timer | Localized JSON tips, $\le 60$ words, 6th-grade readability | Daily tip card, contextual alert notifications |
