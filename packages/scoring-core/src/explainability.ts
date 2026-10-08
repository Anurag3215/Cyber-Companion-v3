import { ScoreOutput } from './scorer.js';

export interface ScoreExplanationSummary {
  headline: string;
  summaryText: string;
  badgeLabel: string;
  priorityActions: Array<{
    title: string;
    gainText: string;
    reason: string;
  }>;
}

export function generateScoreExplanation(scoreResult: ScoreOutput): ScoreExplanationSummary {
  let headline = '';
  let summaryText = '';
  let badgeLabel = '';

  switch (scoreResult.band) {
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
