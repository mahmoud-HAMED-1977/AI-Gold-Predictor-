import {
  CurrentPriceData,
  DecisionArabic,
  DecisionType,
  FutureScenarios,
  RiskLevel,
  SupportResistanceLevels,
  TechnicalIndicators,
  Timeframe,
  TimeframeForecast,
} from '../../src/types';

export function calculateMultiTimeframePredictions(
  currentPriceData: CurrentPriceData,
  indicators: TechnicalIndicators,
  supportResistance: SupportResistanceLevels,
  macroScore: number,
  fundamentalScore: number,
  riskScore: number
): { forecasts: TimeframeForecast[]; scenarios: FutureScenarios } {
  const currentPrice = currentPriceData.currentPrice;

  // Multi-timeframe probabilistic synthesis
  const timeframes: { tf: Timeframe; arabic: string; multiplier: number; shortTermNoise: boolean }[] = [
    { tf: '15m', arabic: '15 دقيقة', multiplier: 0.003, shortTermNoise: true },
    { tf: '1h', arabic: 'ساعة', multiplier: 0.007, shortTermNoise: true },
    { tf: '4h', arabic: '4 ساعات', multiplier: 0.015, shortTermNoise: false },
    { tf: '1D', arabic: 'يوم', multiplier: 0.028, shortTermNoise: false },
    { tf: '1W', arabic: 'أسبوع', multiplier: 0.065, shortTermNoise: false },
  ];

  const forecasts: TimeframeForecast[] = timeframes.map(item => {
    let upProb = 65;
    let downProb = 20;
    let neutralProb = 15;

    // Macro and fundamentals dominate higher timeframes
    if (item.tf === '1D' || item.tf === '1W') {
      upProb = Math.min(88, Math.round(50 + (macroScore * 0.2) + (fundamentalScore * 0.25) - (riskScore * 0.1)));
      downProb = Math.round((100 - upProb) * 0.6);
      neutralProb = 100 - upProb - downProb;
    } else if (item.tf === '15m' || item.tf === '1h') {
      // Short-term noise and RSI resistance
      if (indicators.rsi14 > 65 || riskScore > 50) {
        upProb = 42;
        downProb = 44;
        neutralProb = 14;
      } else {
        upProb = 58;
        downProb = 28;
        neutralProb = 14;
      }
    } else {
      // 4h
      upProb = 72;
      downProb = 18;
      neutralProb = 10;
    }

    let decision: DecisionArabic = 'شراء عند التصحيح';
    let decisionType: DecisionType = 'BUY_ON_DIP';

    if (upProb >= 75) {
      decision = 'شراء';
      decisionType = 'BUY';
    } else if (upProb >= 60 && riskScore <= 55) {
      decision = 'شراء عند التصحيح';
      decisionType = 'BUY_ON_DIP';
    } else if (downProb >= 60) {
      decision = 'بيع';
      decisionType = 'SELL';
    } else if (downProb > 45 && upProb < 45) {
      decision = 'جني أرباح';
      decisionType = 'TAKE_PROFIT';
    } else if (Math.abs(upProb - downProb) < 15 || riskScore > 65) {
      decision = 'انتظار';
      decisionType = 'WAIT';
    } else {
      decision = 'احتفاظ';
      decisionType = 'HOLD';
    }

    const expectedDelta = currentPrice * item.multiplier;
    const expectedTargetHigh = Number((currentPrice + expectedDelta).toFixed(2));
    const expectedTargetLow = Number((currentPrice - expectedDelta * 0.7).toFixed(2));

    return {
      timeframe: item.tf,
      timeframeArabic: item.arabic,
      upProbability: upProb,
      downProbability: downProb,
      neutralProbability: neutralProb,
      decision,
      decisionType,
      expectedTargetHigh,
      expectedTargetLow,
    };
  });

  // Future Scenarios (Primary, Alternative, Risk/Invalidation)
  const scenarios: FutureScenarios = {
    mainScenario: {
      title: 'استمرار الاتجاه الصاعد نحو مستهدفات المقاومة (السيناريو الأرجح)',
      description:
        'الحفاظ على التداول أعلى مستويات الدعم الفنية (2875 - 2880) مدعوماً بضعف الدولار وانخفاض عوائد السندات، مع استهداف مناطق 2908 ثم 2925 دولار للأونصة.',
      probability: 68,
      targetRange: `${supportResistance.nearestResistance} - ${supportResistance.resistance2}`,
    },
    alternativeScenario: {
      title: 'حركة تصحيحية هابطة مؤقتة لإعادة اختبار الدعم الرئيسي',
      description:
        'في حال ظهور عمليات جني أرباح سريعة قبيل البيانات الاقتصادية، قد يتراجع السعر لاختبار منطقة الدعم (2875 - 2880) قبل استئناف مسار الصعود، وتعد هذه المنطقة فرصة بناء مراكز شرائية للمستثمر طويل الأجل.',
      probability: 22,
      targetRange: supportResistance.potentialBuyZone,
    },
    riskScenario: {
      title: 'سيناريو الخطر وإلغاء النظرة الإيجابية (إلغاء السيناريو)',
      description:
        'كسر واضح ومؤكد لمستوى الدعم الرئيسي مع إغلاق شمعة 4 ساعات أدناه، بالتزامن مع قفزة مفاجئة في مؤشر الدولار DXY فوق 103.50.',
      invalidationTrigger: `كسر مستوى الدعم ${supportResistance.invalidationLevel} دولار وإغلاق أدناه مع ارتفاع حاد في عوائد السندات`,
      invalidationPrice: supportResistance.invalidationLevel,
    },
  };

  return {
    forecasts,
    scenarios,
  };
}
