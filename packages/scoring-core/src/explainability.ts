import { ScoreOutput } from './scorer.js';

export interface ScoreExplanationSummary {
  headline: string;
  summaryText: string;
  summary?: string;
  badgeLabel: string;
  priorityActions: Array<{
    title: string;
    gainText: string;
    reason: string;
  }>;
  topRecommendations?: Array<{
    id: string;
    title: string;
    description: string;
    potentialPointGain?: number;
  }>;
}

export function generateScoreExplanation(scoreResult: any): ScoreExplanationSummary {
  if (scoreResult.summary !== undefined) {
    return {
      headline: scoreResult.riskBand === 'CRITICAL' ? 'Immediate Action Required' : 'Excellent Cyber Hygiene',
      summaryText: scoreResult.summary,
      summary: scoreResult.summary,
      badgeLabel: scoreResult.riskBand || 'Assessed',
      priorityActions: (scoreResult.topRecommendations || []).map((r: any) => ({
        title: r.title,
        gainText: `+${r.potentialPointGain || 10} points`,
        reason: r.description,
      })),
      topRecommendations: scoreResult.topRecommendations || [],
    };
  }

  let headline = '';
  let summaryText = '';
  let badgeLabel = '';

  const band = scoreResult.band || scoreResult.riskBand;
  switch (band) {
    case 'SECURE':
      headline = 'Excellent Cyber Hygiene';
      summaryText =
        'Your device, network connections, and applications follow strong cybersecurity best practices. No critical exposure vectors were identified.';
      badgeLabel = 'Strong Protection';
      break;
    case 'MODERATE':
      headline = 'Good Baseline with Minor Vulnerabilities';
      summaryText =
        'Your digital safety is generally healthy, but a few permissions or network configurations could be strengthened.';
      badgeLabel = 'Minor Fixes Needed';
      break;
    case 'AT_RISK':
      headline = 'Attention Required: Active Exposure Detected';
      summaryText =
        'Your device is exposed to potential security risks, such as insecure network links or applications with elevated access.';
      badgeLabel = 'At Risk';
      break;
    case 'CRITICAL':
    default:
      headline = 'Immediate Action Required';
      summaryText =
        'Critical cybersecurity threats were detected. Your data or communications may be actively vulnerable to interception.';
      badgeLabel = 'Critical Exposure';
      break;
  }

  const priorityActions = scoreResult.topRecommendations.map((rec) => ({
    title: rec.title,
    gainText: `+${rec.potentialPointGain} points`,
    reason: rec.description,
  }));

  return {
    headline,
    summaryText,
    badgeLabel,
    priorityActions,
  };
}
