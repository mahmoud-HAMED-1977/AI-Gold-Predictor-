import { DollarAnalysis, YieldsAnalysis } from '../../src/types';

export function calculateMacroAnalysis(): {
  dollarAnalysis: DollarAnalysis;
  yieldsAnalysis: YieldsAnalysis;
  macroScore: number;
  dollarScore: number;
} {
  // Dollar Index DXY metrics
  const dxyPrice = 101.85;
  const dxyChangePercent = -0.32;
  const eurUsd = 1.0945;
  const usdJpy = 144.20;
  const usdChf = 0.8460;

  // DXY below 102.5 and declining is supportive for gold
  const dollarImpactScore = 74; // 0-100 supportive
  const dollarImpactStatus: DollarAnalysis['impactStatus'] = 'SUPPORTIVE';
  const dollarImpactStatusArabic = 'الدولار داعم للذهب';
  const dollarExplanation =
    'تراجع مؤشر الدولار DXY بنسبة 0.32% واستقراره تحت 102.00 يقلل تكلفة شراء الذهب لحائزي العملات الأخرى ويوفر بيئة داعمة للأسعار.';

  const dollarAnalysis: DollarAnalysis = {
    dxyPrice,
    dxyChangePercent,
    eurUsd,
    usdJpy,
    usdChf,
    impactScore: dollarImpactScore,
    impactStatus: dollarImpactStatus,
    impactStatusArabic: dollarImpactStatusArabic,
    explanation: dollarExplanation,
  };

  // Yields metrics
  const fedFundsRate = 5.25;
  const fedHikeCutExpectation = 'تسعير خفض بمقدار 25-50 نقطة أساس في الاجتماع القادم بنسبة 88%';
  const us2yYield = 3.65;
  const us10yYield = 3.82;
  const realYield10y = 1.58;

  // Falling real yields are strongly supportive for gold
  const yieldsImpactScore = 72;
  const yieldsImpactStatus: YieldsAnalysis['impactStatus'] = 'SUPPORTIVE';
  const yieldsImpactStatusArabic = 'عوائد داعمة للذهب';
  const yieldsExplanation =
    'انخفاض العائد الحقيقي على السندات الأمريكية لأجل 10 سنوات إلى 1.58% يقلص تكلفة الفرصة البديلة للاحتفاظ بالذهب ويشجع التدفقات الاستثمارية.';

  const yieldsAnalysis: YieldsAnalysis = {
    fedFundsRate,
    fedHikeCutExpectation,
    us2yYield,
    us10yYield,
    realYield10y,
    impactScore: yieldsImpactScore,
    impactStatus: yieldsImpactStatus,
    impactStatusArabic: yieldsImpactStatusArabic,
    explanation: yieldsExplanation,
  };

  const macroScore = Math.round((dollarImpactScore * 0.5) + (yieldsImpactScore * 0.5));

  return {
    dollarAnalysis,
    yieldsAnalysis,
    macroScore,
    dollarScore: dollarImpactScore,
  };
}
