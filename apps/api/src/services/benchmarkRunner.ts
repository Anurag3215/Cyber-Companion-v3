import benchmarkData from '../data/benchmarkUrls.json';
import { analyzeUrlHeuristics } from './heuristicsService';

export interface BenchmarkMetrics {
  totalSamples: number;
  truePositives: number;
  trueNegatives: number;
  falsePositives: number;
  falseNegatives: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  falsePositiveRate: number; // FPR = FP / (FP + TN)
  falseNegativeRate: number; // FNR = FN / (FN + TP)
}

export function runBenchmarkEvaluation(): BenchmarkMetrics {
  let tp = 0; // Correctly identified threat (isMalicious or isSuspicious when expectedSafe is false)
  let tn = 0; // Correctly identified safe (neither malicious nor suspicious when expectedSafe is true)
  let fp = 0; // Incorrecly identified safe URL as threat
  let fn = 0; // Incorrecly identified threat URL as safe

  for (const item of benchmarkData) {
    const analysis = analyzeUrlHeuristics(item.url);
    const predictedThreat = analysis.isMalicious || analysis.isSuspicious;

    if (!item.expectedSafe) {
      // Ground truth is THREAT
      if (predictedThreat) {
        tp += 1;
      } else {
        fn += 1;
      }
    } else {
      // Ground truth is SAFE
      if (predictedThreat) {
        fp += 1;
      } else {
        tn += 1;
      }
    }
  }

  const total = benchmarkData.length;
  const accuracy = (tp + tn) / total;
  const precision = tp + fp > 0 ? tp / (tp + fp) : 1;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 1;
  const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 1;
  const fpr = fp + tn > 0 ? fp / (fp + tn) : 0;
  const fnr = fn + tp > 0 ? fn / (fn + tp) : 0;

  return {
    totalSamples: total,
    truePositives: tp,
    trueNegatives: tn,
    falsePositives: fp,
    falseNegatives: fn,
    accuracy: Math.round(accuracy * 1000) / 1000,
    precision: Math.round(precision * 1000) / 1000,
    recall: Math.round(recall * 1000) / 1000,
    f1Score: Math.round(f1Score * 1000) / 1000,
    falsePositiveRate: Math.round(fpr * 1000) / 1000,
    falseNegativeRate: Math.round(fnr * 1000) / 1000,
  };
}
