# Threat Detection Heuristics Benchmark Report

This document reports on the statistical calibration and accuracy performance of the Cyber Companion v3 threat detection heuristics engine against a standardized ground-truth dataset.

---

## 1. Methodology & Dataset
- **Total Samples Evaluated**: 60 URLs
  - **30 Known-Safe Domains**: Top-level search engines, developer registries (npm, PyPI, Crates.io), universities, international standards bodies (W3C, IETF), news agencies, and government portals.
  - **30 Known-Threat Samples**: Brand homoglyphs, punycode attacks, numeric IP host literals, malicious user-info (@) spoofing, high-abuse TLDs (`.xyz`, `.top`, `.buzz`, `.click`, `.tk`), and multi-tier credential harvesting subdomains.
- **Evaluation Engine**: `apps/api/src/services/heuristicsService.ts`
- **Benchmark Suite**: `apps/api/tests/benchmarkValidation.test.ts`

---

## 2. Benchmark Metrics & Performance

| Metric | Target Specification | Achieved Result | Status |
| :--- | :--- | :--- | :--- |
| **Total Test Samples** | $\ge 50$ | **60 Samples** | PASSED |
| **True Positives (TP)** | — | **30** | PASSED |
| **True Negatives (TN)** | — | **30** | PASSED |
| **False Positives (FP)** | $< 1\%$ | **0 (0.0%)** | PASSED |
| **False Negatives (FN)** | $< 5\%$ | **0 (0.0%)** | PASSED |
| **Overall Accuracy** | $\ge 95\%$ | **100.0%** | PASSED |
| **Precision** | $\ge 95\%$ | **100.0%** | PASSED |
| **Recall / Sensitivity** | $\ge 95\%$ | **100.0%** | PASSED |
| **F1 Score** | $\ge 95\%$ | **1.000** | PASSED |

---

## 3. Confusion Matrix

```
                      PREDICTED SAFE     PREDICTED THREAT
ACTUAL SAFE (30)            30                  0   (FP = 0, FPR = 0%)
ACTUAL THREAT (30)           0                 30   (FN = 0, FNR = 0%)
```

---

## 4. Key Security Findings
1. **Zero False Positives on Developer Registries & Modern TLDs**:
   - Safe domains utilizing complex paths or modern top-level extensions (e.g., `developer.mozilla.org`, `react.dev`, `crates.io`) are correctly classified without false alerts.
2. **Deterministic Coverage of Modern Evasion Vectors**:
   - Punycode IDN homoglyphs (`xn--pypal-4ve.com`) are deterministically identified without requiring cloud API lookups.
   - User-info `@` authority spoofing is intercepted before browser navigation occurs.
