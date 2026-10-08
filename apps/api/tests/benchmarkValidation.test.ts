import { runBenchmarkEvaluation } from '../src/services/benchmarkRunner';

describe('Heuristics Ground-Truth Benchmark Validation', () => {
  const metrics = runBenchmarkEvaluation();

  test('benchmark dataset contains at least 50 validated ground-truth samples', () => {
    expect(metrics.totalSamples).toBeGreaterThanOrEqual(50);
  });

  test('False Positive Rate satisfies strict target (FPR < 1%)', () => {
    // Ensuring legitimate domains are not blocked or flagged
    expect(metrics.falsePositiveRate).toBeLessThan(0.01);
  });

  test('False Negative Rate satisfies strict target (FNR < 5%)', () => {
    // Ensuring zero or minimal evasions on active phishing/malware patterns
    expect(metrics.falseNegativeRate).toBeLessThan(0.05);
  });

  test('Overall classification accuracy satisfies high assurance target (Accuracy >= 95%)', () => {
    expect(metrics.accuracy).toBeGreaterThanOrEqual(0.95);
  });

  test('Precision, Recall, and F1 score satisfy production thresholds', () => {
    expect(metrics.precision).toBeGreaterThanOrEqual(0.95);
    expect(metrics.recall).toBeGreaterThanOrEqual(0.95);
    expect(metrics.f1Score).toBeGreaterThanOrEqual(0.95);
  });
});
