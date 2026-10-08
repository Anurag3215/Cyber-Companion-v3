export interface ThreatInspectionResponse {
  target: string;
  verdict: 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS' | 'UNKNOWN';
  confidenceScore: number;
  plainLanguageExplanation: string;
  recommendation: string;
  heuristicsTriggered: string[];
  cached?: boolean;
}

const DEFAULT_API_BASE_URL = 'http://localhost:5000/v1';

export class ApiClient {
  private static baseUrl = DEFAULT_API_BASE_URL;

  static setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  static async inspectUrl(url: string): Promise<ThreatInspectionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/threat/inspect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, source: 'USER_INPUT' }),
      });

      if (!response.ok) {
        throw new Error(`Gateway returned HTTP ${response.status}`);
      }

      return await response.json();
    } catch {
      // Graceful offline fallback: evaluate with basic heuristics
      const isMalicious = url.includes('phish') || url.includes('malware') || url.includes('bank-verify');
      return {
        target: url,
        verdict: isMalicious ? 'MALICIOUS' : 'SAFE',
        confidenceScore: 70,
        plainLanguageExplanation: isMalicious
          ? 'Offline heuristic check detected suspicious phishing patterns in domain name.'
          : 'Offline check found no immediate structural anomalies.',
        recommendation: isMalicious
          ? 'Do not open this URL.'
          : 'Proceed with standard caution while offline.',
        heuristicsTriggered: isMalicious ? ['OFFLINE_HEURISTIC_FLAG'] : [],
        cached: false,
      };
    }
  }
}
