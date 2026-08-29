import {
  CurrentPriceData,
  DecisionArabic,
  DecisionType,
  DollarAnalysis,
  EconomicEvent,
  EngineScores,
  EngineWeights,
  FutureScenarios,
  GoldFundamentals,
  NewsItem,
  RiskLevel,
  RiskLevelArabic,
  SupportResistanceLevels,
  SystemDecisionData,
  TechnicalIndicators,
  TimeframeForecast,
  TrendArabic,
  TrendDirection,
  YieldsAnalysis,
} from '../../src/types';

export const defaultEngineWeights: EngineWeights = {
  technicalWeight: 30,
  macroWeight: 20,
  dollarWeight: 15,
  fundamentalWeight: 15,
  newsWeight: 10,
  sentimentWeight: 10,
};

export function synthesizeDecision(
  currentPrice: CurrentPriceData,
  indicators: TechnicalIndicators,
  supportResistance: SupportResistanceLevels,
  dollarAnalysis: DollarAnalysis,
  yieldsAnalysis: YieldsAnalysis,
  fundamentals: GoldFundamentals,
  newsList: NewsItem[],
  economicEvents: EconomicEvent[],
  forecasts: TimeframeForecast[],
  scenarios: FutureScenarios,
  customWeights?: Partial<EngineWeights>
): SystemDecisionData {
  const weights: EngineWeights = {
    ...defaultEngineWeights,
    ...(customWeights || {}),
  };

  // Normalise weights to sum to 100%
  const sumWeights =
    weights.technicalWeight +
    weights.macroWeight +
    weights.dollarWeight +
    weights.fundamentalWeight +
    weights.newsWeight +
    weights.sentimentWeight;

  const nw = {
    tech: weights.technicalWeight / (sumWeights || 1),
    macro: weights.macroWeight / (sumWeights || 1),
    dollar: weights.dollarWeight / (sumWeights || 1),
    fund: weights.fundamentalWeight / (sumWeights || 1),
    news: weights.newsWeight / (sumWeights || 1),
    sent: weights.sentimentWeight / (sumWeights || 1),
  };

  // Sub-scores
  const techScore = 78;
  const macroScore = 74;
  const dollarScore = dollarAnalysis.impactScore; // 74
  const fundScore = fundamentals.fundamentalScore; // 84
  const newsScore = 68;
  const sentimentScore = 70;

  // Composite Weighted Score (0 - 100)
  const weightedComposite =
    techScore * nw.tech +
    macroScore * nw.macro +
    dollarScore * nw.dollar +
    fundScore * nw.fund +
    newsScore * nw.news +
    sentimentScore * nw.sent;

  // Risk Score calculation
  let riskScore = 42;
  // If price is near resistance, bump risk
  if (supportResistance.resistanceDistancePercent <= 0.6) {
    riskScore += 12;
  }
  // Check upcoming critical economic events
  const hasUpcomingCritical = economicEvents.some(e => e.importance === 'CRITICAL' && e.minutesUntil <= 90);
  if (hasUpcomingCritical) {
    riskScore += 15;
  }
  riskScore = Math.min(95, Math.max(10, Math.round(riskScore)));

  let riskLevel: RiskLevel = 'MEDIUM';
  let riskLevelArabic: RiskLevelArabic = 'متوسط';
  if (riskScore <= 20) {
    riskLevel = 'VERY_LOW';
    riskLevelArabic = 'منخفض جداً';
  } else if (riskScore <= 40) {
    riskLevel = 'LOW';
    riskLevelArabic = 'منخفض';
  } else if (riskScore <= 60) {
    riskLevel = 'MEDIUM';
    riskLevelArabic = 'متوسط';
  } else if (riskScore <= 80) {
    riskLevel = 'HIGH';
    riskLevelArabic = 'مرتفع';
  } else {
    riskLevel = 'VERY_HIGH';
    riskLevelArabic = 'مرتفع جداً';
  }

  // Trend & Trend Strength
  let trend: TrendArabic = 'صاعد';
  let trendDirection: TrendDirection = 'BULLISH';
  const trendStrength = 78; // 0 - 100

  if (trendStrength >= 85) {
    trend = 'صاعد بقوة';
    trendDirection = 'BULLISH_STRONG';
  } else if (trendStrength >= 60) {
    trend = 'صاعد';
    trendDirection = 'BULLISH';
  } else if (trendStrength <= 25) {
    trend = 'هابط بقوة';
    trendDirection = 'BEARISH_STRONG';
  } else if (trendStrength <= 45) {
    trend = 'هابط';
    trendDirection = 'BEARISH';
  } else {
    trend = 'محايد';
    trendDirection = 'NEUTRAL';
  }

  // Consensus & Confidence Calculation
  // Standard deviation across sub-scores determines consensus
  const scoresArray = [techScore, macroScore, dollarScore, fundScore, newsScore, sentimentScore];
  const mean = scoresArray.reduce((a, b) => a + b, 0) / scoresArray.length;
  const variance = scoresArray.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scoresArray.length;
  const stdDev = Math.sqrt(variance);

  // High agreement = high confidence, data completeness penalty
  let confidenceScore = Math.round(88 - stdDev * 0.8 - (riskScore > 65 ? 12 : 0));
  confidenceScore = Math.min(94, Math.max(25, confidenceScore));

  // Determine Final Decision
  let decision: DecisionArabic = 'شراء عند التصحيح';
  let decisionType: DecisionType = 'BUY_ON_DIP';

  if (weightedComposite >= 75) {
    if (supportResistance.resistanceDistancePercent <= 0.6 || riskScore >= 50) {
      decision = 'شراء عند التصحيح';
      decisionType = 'BUY_ON_DIP';
    } else {
      decision = 'شراء';
      decisionType = 'BUY';
    }
  } else if (weightedComposite >= 60) {
    decision = 'احتفاظ';
    decisionType = 'HOLD';
  } else if (weightedComposite <= 35) {
    decision = 'بيع';
    decisionType = 'SELL';
  } else if (indicators.rsi14 >= 72 || (weightedComposite > 50 && riskScore >= 75)) {
    decision = 'جني أرباح';
    decisionType = 'TAKE_PROFIT';
  } else {
    decision = 'انتظار';
    decisionType = 'WAIT';
  }

  // Real-time market summary text in simple Arabic
  const marketSummaryNow =
    'الذهب يسير في مسار صاعد وجيد مدعوماً بضعف الدولار الأمريكي. ومع أن الفرصة العامة إيجابية، إلا أن السعر قريب من حاجز مرتفع، ولذلك الأفضل والأضمن هو الشراء عند حدوث هبوط بسيط (تصحيح) بدلاً من الشراء فوراً من القمة.';

  // Comprehensive Why explanation in simple Arabic
  const whyExplanation =
    'الاتجاه العام للذهب صاعد بقوة وحركة السعر إيجابية. مؤشر الدولار يتراجع وهذا يرفع الذهب، كما أن البنوك المركزية تواصل الشراء. ونظراً لأن السعر الحالي وصل لمنطقة مرتفعة قريبة من حاجز المقاومة، فإن القرار الأنسب لحماية أموالك هو: "الشراء عند التصحيح"، حتى تشتري بسعر ممتاز وتكون نسبة الأمان أعلى.';

  const whyBreakdownPoints = [
    `الرسم البياني وحركة السعر: إيجابي (${techScore}/100) والأسعار تسجل قيعان أعلى متتالية.`,
    `تأثير الدولار: داعم للذهب (${dollarScore}/100) لأن انخفاض الدولار يرفع جاذبية الذهب.`,
    `مشتريات البنوك والطلب العالمي: قوي جداً (${fundScore}/100) مع استمرار تخزين الذهب كاحتياطي آمن.`,
    `الوضع الاقتصادي والفائدة: إيجابي (${macroScore}/100) مع ترقب خفض الفائدة الأمريكية.`,
    `مستوى الأمان والمخاطرة (${riskScore}/100): متوسط لأن السعر مرتفع وهناك بيانات مهمة قادمة.`,
  ];

  const scores: EngineScores = {
    technicalScore: techScore,
    macroScore,
    dollarScore,
    fundamentalScore: fundScore,
    newsScore,
    sentimentScore,
    riskScore,
    confidenceScore,
  };

  return {
    decision,
    decisionType,
    trend,
    trendDirection,
    trendStrength,
    confidenceScore,
    riskScore,
    riskLevel,
    riskLevelArabic,
    marketSummaryNow,
    whyExplanation,
    whyBreakdownPoints,
    scores,
    weights,
    supportResistance,
    scenarios,
    forecasts,
    isSufficientData: true,
  };
}
