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
    const queryLower = validated.query.toLowerCase();

    // 2. Curated RAG retrieval: find best matching KB articles
    const matchedArticles = knowledgeBase.filter((entry) => {
      const matchTopic = queryLower.includes(entry.topic.toLowerCase());
      const matchKeyword = entry.keywords.some((kw) => queryLower.includes(kw.toLowerCase()));
      const matchFlags = validated.detectedFlags.some((flag) =>
        entry.threatVector.toLowerCase().includes(flag.toLowerCase()) ||
        entry.keywords.some((kw) => flag.toLowerCase().includes(kw))
      );
      return matchTopic || matchKeyword || matchFlags;
    });

    const primaryDoc = matchedArticles[0] || knowledgeBase[0];
    const citations = matchedArticles.map((d) => `[${d.id}] ${d.title}`);

    // 3. Synthesize explanation without altering the immutable deterministic verdict
    let explanationText = '';
    if (validated.immutableVerdict === 'MALICIOUS') {
      explanationText = `SECURITY ALERT: This target was confirmed as MALICIOUS based on deterministic threat signals. ${primaryDoc.summary}`;
    } else if (validated.immutableVerdict === 'SUSPICIOUS') {
      explanationText = `CAUTION ADVISED: This target displays SUSPICIOUS anomalies. ${primaryDoc.summary}`;
    } else {
      explanationText = `VERIFIED SAFE: No indicators of compromise were detected. ${primaryDoc.summary}`;
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
      groundedInKnowledgeBase: matchedArticles.length > 0,
    };
  }
}

export const aiExplainerService = new AiExplainerService();
