import knowledgeBase from '../data/cyberKnowledgeBase.json';
import { z } from 'zod';

export const ExplainerRequestSchema = z.object({
  query: z.string().min(2).max(500),
  immutableVerdict: z.enum(['SAFE', 'SUSPICIOUS', 'MALICIOUS', 'UNKNOWN']),
  detectedFlags: z.array(z.string()).default([]),
});

export type ExplainerRequest = z.infer<typeof ExplainerRequestSchema>;

export interface ExplainerResponse {
  immutableVerdict: 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS' | 'UNKNOWN';
  explanation: string;
  citations: string[];
  recommendedActions: string[];
  groundedInKnowledgeBase: boolean;
}

export class AiExplainerService {
  explainThreat(request: ExplainerRequest): ExplainerResponse {
    // 1. Validate request schema
    const validated = ExplainerRequestSchema.parse(request);
    const queryLower = validated.query.toLowerCase().trim();
    const queryTokens = queryLower.split(/\s+/).filter((t) => t.length >= 3);

    // 2. Score KB articles based on semantic token and keyword relevance
    const scoredArticles = knowledgeBase.map((entry) => {
      let score = 0;
      const topicLower = entry.topic.toLowerCase();
      const titleLower = entry.title.toLowerCase();
      const summaryLower = entry.summary.toLowerCase();

      // Direct exact match
      if (queryLower.includes(topicLower) || topicLower.includes(queryLower)) score += 20;
      if (titleLower.includes(queryLower)) score += 15;

      // Token matching
      for (const token of queryTokens) {
        if (topicLower.includes(token)) score += 8;
        if (titleLower.includes(token)) score += 6;
        if (summaryLower.includes(token)) score += 3;
        for (const kw of entry.keywords) {
          if (kw.toLowerCase().includes(token) || token.includes(kw.toLowerCase())) {
            score += 7;
          }
        }
      }

      // Flag matching
      for (const flag of validated.detectedFlags) {
        const flagLower = flag.toLowerCase();
        if (entry.threatVector.toLowerCase().includes(flagLower)) score += 10;
        for (const kw of entry.keywords) {
          if (flagLower.includes(kw.toLowerCase())) score += 5;
        }
      }

      return { entry, score };
    });

    // Sort descending by score
    scoredArticles.sort((a, b) => b.score - a.score);

    const hasMatch = scoredArticles.length > 0 && scoredArticles[0].score > 0;
    const primaryDoc = hasMatch ? scoredArticles[0].entry : knowledgeBase[0];
    const topArticles = scoredArticles.filter((s) => s.score > 0).slice(0, 3).map((s) => s.entry);
    const citations = (topArticles.length > 0 ? topArticles : [primaryDoc]).map((d) => `[${d.id}] ${d.title}`);

    // 3. Synthesize explanation without altering the immutable deterministic verdict
    let explanationText = '';
    if (validated.immutableVerdict === 'MALICIOUS') {
      explanationText = `SECURITY ALERT: Target confirmed as MALICIOUS based on deterministic threat signals. ${primaryDoc.summary}`;
    } else if (validated.immutableVerdict === 'SUSPICIOUS') {
      explanationText = `CAUTION ADVISED: Target displays SUSPICIOUS anomalies. ${primaryDoc.summary}`;
    } else if (validated.immutableVerdict === 'SAFE') {
      explanationText = `VERIFIED SAFE: No indicators of compromise were detected. ${primaryDoc.summary}`;
    } else {
      explanationText = `CYBER COMPANION INTEL: ${primaryDoc.summary}`;
    }

    const actionSteps = [
      primaryDoc.defenseGuidance,
      'Maintain device encryption and keep your operating system updated.',
    ];

    return {
      immutableVerdict: validated.immutableVerdict,
      explanation: explanationText,
      citations: citations.length > 0 ? citations : [`[${primaryDoc.id}] ${primaryDoc.title}`],
      recommendedActions: actionSteps,
      groundedInKnowledgeBase: hasMatch,
    };
  }
}

export const aiExplainerService = new AiExplainerService();
