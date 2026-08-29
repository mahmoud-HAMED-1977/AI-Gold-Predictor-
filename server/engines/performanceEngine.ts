import { AccuracyPerformanceMetrics, PredictionRecord } from '../../src/types';

export function calculateSystemAccuracy(records: PredictionRecord[]): AccuracyPerformanceMetrics {
  const evaluated = records.filter(r => r.isEvaluated && r.isCorrect !== null);
  const totalEvaluated = evaluated.length;

  if (totalEvaluated < 4) {
    return {
      accuracy24h: 0,
      accuracy7d: 0,
      accuracy30d: 0,
      accuracyLast100: 0,
      totalEvaluated: 0,
      correctPredictions: 0,
      incorrectPredictions: 0,
      falseSignalRate: 0,
      meanAbsoluteError: 0,
      directionalAccuracy: 0,
      bestTimeframe: 'غير متاح',
      worstTimeframe: 'غير متاح',
      isSampleSufficient: false,
      sampleStatusMessage: 'البيانات غير كافية لتقييم الدقة (يلزم ما لا يقل عن 5 توقعات مكتملة).',
      accuracyByTimeframe: [],
    };
  }

  const correct = evaluated.filter(r => r.isCorrect === true).length;
  const incorrect = evaluated.filter(r => r.isCorrect === false).length;
  const winRate = Number(((correct / totalEvaluated) * 100).toFixed(1));

  // Time-based slices
  const now = Date.now();
  const last24h = evaluated.filter(r => now - r.timestamp <= 24 * 60 * 60 * 1000);
  const last7d = evaluated.filter(r => now - r.timestamp <= 7 * 24 * 60 * 60 * 1000);
  const last30d = evaluated.filter(r => now - r.timestamp <= 30 * 24 * 60 * 60 * 1000);

  const acc24h = last24h.length > 0 ? Number(((last24h.filter(r => r.isCorrect).length / last24h.length) * 100).toFixed(1)) : winRate;
  const acc7d = last7d.length > 0 ? Number(((last7d.filter(r => r.isCorrect).length / last7d.length) * 100).toFixed(1)) : winRate;
  const acc30d = last30d.length > 0 ? Number(((last30d.filter(r => r.isCorrect).length / last30d.length) * 100).toFixed(1)) : winRate;

  // Deviation & MAE
  const deviations = evaluated.map(r => Math.abs(r.deviationPercent || 0));
  const mae = Number((deviations.reduce((a, b) => a + b, 0) / deviations.length).toFixed(2));

  // Timeframe grouping
  const tfMap: Record<string, { correct: number; total: number }> = {};
  for (const r of evaluated) {
    const tf = r.timeframeArabic;
    if (!tfMap[tf]) tfMap[tf] = { correct: 0, total: 0 };
    tfMap[tf].total += 1;
    if (r.isCorrect) tfMap[tf].correct += 1;
  }

  const accuracyByTimeframe = Object.entries(tfMap).map(([timeframe, data]) => ({
    timeframe,
    accuracy: Number(((data.correct / data.total) * 100).toFixed(1)),
    total: data.total,
  })).sort((a, b) => b.accuracy - a.accuracy);

  const bestTimeframe = accuracyByTimeframe[0]?.timeframe || '4 ساعات';
  const worstTimeframe = accuracyByTimeframe[accuracyByTimeframe.length - 1]?.timeframe || '15 دقيقة';

  return {
    accuracy24h: acc24h,
    accuracy7d: acc7d,
    accuracy30d: acc30d,
    accuracyLast100: winRate,
    totalEvaluated,
    correctPredictions: correct,
    incorrectPredictions: incorrect,
    falseSignalRate: Number((100 - winRate).toFixed(1)),
    meanAbsoluteError: mae,
    directionalAccuracy: winRate,
    bestTimeframe,
    worstTimeframe,
    isSampleSufficient: true,
    sampleStatusMessage: `تم تقييم ${totalEvaluated} توقعاً مسجلاً بنجاح.`,
    accuracyByTimeframe,
  };
}
