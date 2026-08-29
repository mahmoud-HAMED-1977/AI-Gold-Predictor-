import {
  EconomicEvent,
  RiskLevel,
  RiskLevelArabic,
  SupportResistanceLevels,
  TechnicalIndicators,
} from '../../src/types';

export function calculateGoldRiskIndex(
  indicators: TechnicalIndicators,
  supportResistance: SupportResistanceLevels,
  economicEvents: EconomicEvent[]
): {
  riskScore: number;
  riskLevel: RiskLevel;
  riskLevelArabic: RiskLevelArabic;
  riskDrivers: { name: string; score: number; description: string }[];
} {
  let riskScore = 20; // Base baseline risk in financial markets

  const riskDrivers: { name: string; score: number; description: string }[] = [];

  // 1. Proximity to resistance (buying right at resistance increases risk)
  if (supportResistance.resistanceDistancePercent <= 0.6) {
    riskScore += 18;
    riskDrivers.push({
      name: 'القرب من مقاومة رئيسية',
      score: 18,
      description: `السعر على بعد ${supportResistance.resistanceDistancePercent}% فقط من أقرب مقاومة (${supportResistance.nearestResistance})، مما يرفع احتمالية التصحيح السريع.`,
    });
  } else if (supportResistance.resistanceDistancePercent <= 1.2) {
    riskScore += 8;
    riskDrivers.push({
      name: 'الاقتراب من منطقة تصريف',
      score: 8,
      description: `السعر يقترب تدريجياً من حواجز المقاومة الفنية (${supportResistance.nearestResistance}).`,
    });
  }

  // 2. Upcoming High/Critical Economic Event within 2 hours
  const upcomingCritical = economicEvents.find(
    e => (e.importance === 'CRITICAL' || e.importance === 'HIGH') && e.minutesUntil <= 120 && e.minutesUntil > 0
  );
  if (upcomingCritical) {
    const eventPenalty = upcomingCritical.importance === 'CRITICAL' ? 22 : 14;
    riskScore += eventPenalty;
    riskDrivers.push({
      name: 'حدث اقتصادي عالي التأثير وشيك',
      score: eventPenalty,
      description: `صدور (${upcomingCritical.name}) بعد ${upcomingCritical.minutesUntil} دقيقة، مما يزيد تقلبات السبريد والسيولة.`,
    });
  }

  // 3. Technical Indicator Overbought / Divergence
  if (indicators.rsi14 >= 70) {
    riskScore += 12;
    riskDrivers.push({
      name: 'تشبع شرائي على مؤشر RSI',
      score: 12,
      description: `قراءة RSI الحالية (${indicators.rsi14}) تشير إلى احتمالية عمليات جني أرباح مؤقتة.`,
    });
  }

  // 4. Volatility (ATR)
  if (indicators.atr14 > 15) {
    riskScore += 10;
    riskDrivers.push({
      name: 'اتساع نطاق التذبذب اليومي (ATR)',
      score: 10,
      description: `مؤشر متوسط المدى الحقيقي ATR يسجل ${indicators.atr14}، مما يعني تحركات سعرية حادة وسريعة.`,
    });
  }

  // Cap at 100 and floor at 10
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

  return {
    riskScore,
    riskLevel,
    riskLevelArabic,
    riskDrivers,
  };
}
