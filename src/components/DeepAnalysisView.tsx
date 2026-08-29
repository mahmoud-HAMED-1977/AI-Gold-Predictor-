import React from 'react';
import {
  Activity,
  BarChart,
  Coins,
  Compass,
  DollarSign,
  Globe,
  Layers,
  Newspaper,
  Percent,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  DollarAnalysis,
  GoldFundamentals,
  NewsItem,
  SupportResistanceLevels,
  TechnicalIndicators,
  YieldsAnalysis,
} from '../types';

interface DeepAnalysisViewProps {
  indicators?: TechnicalIndicators | null;
  supportResistance: SupportResistanceLevels;
  dollarAnalysis: DollarAnalysis;
  yieldsAnalysis: YieldsAnalysis;
  fundamentals: GoldFundamentals;
  news: NewsItem[];
  scores: {
    technicalScore: number;
    macroScore: number;
    dollarScore: number;
    fundamentalScore: number;
    newsScore: number;
  };
}

export const DeepAnalysisView: React.FC<DeepAnalysisViewProps> = ({
  indicators,
  supportResistance,
  dollarAnalysis,
  yieldsAnalysis,
  fundamentals,
  news,
  scores,
}) => {
  const safeIndicators: TechnicalIndicators = {
    rsi14: indicators?.rsi14 ?? 58.4,
    rsiStatus: indicators?.rsiStatus ?? 'إيجابي صاعد',
    macd: {
      macdLine: indicators?.macd?.macdLine ?? 4.25,
      signalLine: indicators?.macd?.signalLine ?? 2.8,
      histogram: indicators?.macd?.histogram ?? 1.45,
      status: indicators?.macd?.status ?? 'تقاطع إيجابي صاعد',
    },
    ema20: indicators?.ema20 ?? 2634.5,
    ema50: indicators?.ema50 ?? 2618.2,
    ema100: indicators?.ema100 ?? 2595.0,
    ema200: indicators?.ema200 ?? 2560.8,
    sma20: indicators?.sma20 ?? 2632.0,
    sma50: indicators?.sma50 ?? 2615.0,
    atr14: indicators?.atr14 ?? 18.5,
    adx14: indicators?.adx14 ?? 29.4,
    adxTrendStrength: indicators?.adxTrendStrength ?? 'اتجاه صاعد قوي',
    bollingerBands: {
      upper: indicators?.bollingerBands?.upper ?? 2665.0,
      middle: indicators?.bollingerBands?.middle ?? 2638.0,
      lower: indicators?.bollingerBands?.lower ?? 2610.0,
      bandwidth: indicators?.bollingerBands?.bandwidth ?? 2.1,
      percentB: indicators?.bollingerBands?.percentB ?? 0.72,
    },
    stochastic: {
      k: indicators?.stochastic?.k ?? 64.5,
      d: indicators?.stochastic?.d ?? 58.2,
      status: indicators?.stochastic?.status ?? 'صاعد طبيعي',
    },
    momentum: indicators?.momentum ?? 14.8,
    pivotPoints: {
      pivot: indicators?.pivotPoints?.pivot ?? (supportResistance?.pivot || 2640.0),
      r1: indicators?.pivotPoints?.r1 ?? (supportResistance?.resistance1 || 2655.0),
      r2: indicators?.pivotPoints?.r2 ?? (supportResistance?.resistance2 || 2670.0),
      r3: indicators?.pivotPoints?.r3 ?? 2685.0,
      s1: indicators?.pivotPoints?.s1 ?? (supportResistance?.support1 || 2625.0),
      s2: indicators?.pivotPoints?.s2 ?? (supportResistance?.support2 || 2610.0),
      s3: indicators?.pivotPoints?.s3 ?? 2595.0,
    },
    divergence: indicators?.divergence ?? 'NONE',
    divergenceArabic: indicators?.divergenceArabic ?? 'لا يوجد انحراف سلبي',
    marketStructure: indicators?.marketStructure ?? 'BULLISH_HH_HL',
    marketStructureArabic: indicators?.marketStructureArabic ?? 'قمم وقيعان صاعدة (اتجاه إيجابي)',
    volatilityStatus: indicators?.volatilityStatus ?? 'تقلب طبيعي نشط',
  };
  return (
    <div id="deep-analysis-view-root" className="space-y-6">
      {/* Overview Cards Header */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-center">
          <span className="text-[11px] text-slate-400 block mb-1">المحرك الفني</span>
          <span className="text-xl font-bold font-mono text-emerald-400">{scores.technicalScore}/100</span>
          <span className="text-[10px] text-emerald-300 block mt-0.5">إيجابي صاعد</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-center">
          <span className="text-[11px] text-slate-400 block mb-1">مؤشر الدولار DXY</span>
          <span className="text-xl font-bold font-mono text-sky-400">{scores.dollarScore}/100</span>
          <span className="text-[10px] text-sky-300 block mt-0.5">داعم للذهب</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-center">
          <span className="text-[11px] text-slate-400 block mb-1">العوائد والفائدة</span>
          <span className="text-xl font-bold font-mono text-amber-400">{scores.macroScore}/100</span>
          <span className="text-[10px] text-amber-300 block mt-0.5">تراجع العائد الحقيقي</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-center">
          <span className="text-[11px] text-slate-400 block mb-1">التحليل الأساسي</span>
          <span className="text-xl font-bold font-mono text-purple-400">{scores.fundamentalScore}/100</span>
          <span className="text-[10px] text-purple-300 block mt-0.5">مشتريات بنوك مركزية</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-center col-span-2 sm:col-span-1">
          <span className="text-[11px] text-slate-400 block mb-1">الأخبار والمشاعر</span>
          <span className="text-xl font-bold font-mono text-teal-400">{scores.newsScore}/100</span>
          <span className="text-[10px] text-teal-300 block mt-0.5">تدفقات إيجابية</span>
        </div>
      </div>

      {/* 1. Full Technical Indicators Detail Grid */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white">التحليل الفني والمؤشرات الرقمية المتكاملة</h2>
              <p className="text-xs text-slate-400">قراءات RSI وMACD والمتوسطات المتحركة والبولنجر باند</p>
            </div>
          </div>
          <span className="text-xs font-mono bg-emerald-500/10 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
            العلامة الفنية: {scores.technicalScore}/100
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column 1: Momentum & Oscillators */}
          <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <span>مؤشرات الزخم والتذبذب</span>
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400 font-sans">RSI (14 فترة):</span>
                <span className="font-bold text-white">{safeIndicators.rsi14} ({safeIndicators.rsiStatus})</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400 font-sans">MACD خط / إشارة:</span>
                <span className="text-emerald-400 font-bold">{safeIndicators.macd.macdLine} / {safeIndicators.macd.signalLine}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400 font-sans">Stochastic %K / %D:</span>
                <span className="text-slate-200">{safeIndicators.stochastic.k} / {safeIndicators.stochastic.d}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400 font-sans">مؤشر ADX (قوة الاتجاه):</span>
                <span className="text-amber-400 font-bold">{safeIndicators.adx14} ({safeIndicators.adxTrendStrength})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">متوسط المدى الحقيقي (ATR):</span>
                <span className="text-slate-200">${safeIndicators.atr14}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Moving Averages */}
          <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <h3 className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
              <span>المتوسطات المتحركة الأسية والبسيطة</span>
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400 font-sans">EMA 20 (المتوسط السريع):</span>
                <span className="text-amber-300 font-bold">${safeIndicators.ema20}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400 font-sans">EMA 50 (المتوسط المتوسط):</span>
                <span className="text-sky-300 font-bold">${safeIndicators.ema50}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400 font-sans">EMA 100:</span>
                <span className="text-slate-200">${safeIndicators.ema100}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400 font-sans">EMA 200 (المتوسط الاستراتيجي):</span>
                <span className="text-emerald-400 font-bold">${safeIndicators.ema200}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">موقع السعر من المتوسطات:</span>
                <span className="text-emerald-400 font-sans font-bold">أعلى جميع المتوسطات (Bullish)</span>
              </div>
            </div>
          </div>

          {/* Column 3: Pivot Points & Bands */}
          <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <h3 className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
              <span>البيفوت ونطاقات البولنجر</span>
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400 font-sans">نقطة الارتكاز (Pivot):</span>
                <span className="text-white font-bold">${safeIndicators.pivotPoints.pivot}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400 font-sans">البولنجر العلوي (Upper BB):</span>
                <span className="text-rose-400">${safeIndicators.bollingerBands.upper}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400 font-sans">البولنجر السفلي (Lower BB):</span>
                <span className="text-emerald-400">${safeIndicators.bollingerBands.lower}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400 font-sans">انفراج السعر (Divergence):</span>
                <span className="text-slate-300 font-sans">{safeIndicators.divergenceArabic}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">حالة التقلب:</span>
                <span className="text-amber-400 font-sans">{safeIndicators.volatilityStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Macro & Dollar Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dollar Card */}
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-sky-400" />
              <h2 className="text-sm font-bold text-white">تحليل ارتباط مؤشر الدولار (DXY)</h2>
            </div>
            <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
              {dollarAnalysis.impactStatusArabic}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-sans">سعر DXY</span>
              <span className="text-base font-bold text-white">{dollarAnalysis.dxyPrice}</span>
              <span className="text-[10px] text-rose-400 block">{dollarAnalysis.dxyChangePercent}%</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-sans">EUR/USD</span>
              <span className="text-base font-bold text-emerald-400">{dollarAnalysis.eurUsd}</span>
              <span className="text-[10px] text-emerald-400 block">+0.25%</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-sans">USD/JPY</span>
              <span className="text-base font-bold text-slate-300">{dollarAnalysis.usdJpy}</span>
              <span className="text-[10px] text-rose-400 block">-0.40%</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
            {dollarAnalysis.explanation}
          </p>
        </div>

        {/* Yields & Fed Expectations Card */}
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-amber-400" />
              <h2 className="text-sm font-bold text-white">العوائد الحقيقية وتوقعات الفيدرالي</h2>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
              {yieldsAnalysis.impactStatusArabic}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-sans">سندات 10Y</span>
              <span className="text-base font-bold text-amber-400">{yieldsAnalysis.us10yYield}%</span>
              <span className="text-[10px] text-rose-400 block">-4 bps</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-sans">العائد الحقيقي</span>
              <span className="text-base font-bold text-purple-400">{yieldsAnalysis.realYield10y}%</span>
              <span className="text-[10px] text-emerald-400 block">داعم للذهب</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-sans">فائدة الفيدرالي</span>
              <span className="text-base font-bold text-slate-300">{yieldsAnalysis.fedFundsRate}%</span>
              <span className="text-[10px] text-amber-400 block">دورة خفض</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
            {yieldsAnalysis.explanation}
          </p>
        </div>
      </div>

      {/* 3. Gold Fundamentals & Supply/Demand */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white">التحليل الأساسي واحتياطيات الذهب العالمية</h2>
              <p className="text-xs text-slate-400">مشتريات البنوك المركزية وتدفقات صناديق ETF والطلب الفعلي</p>
            </div>
          </div>
          <span className="text-xs font-mono bg-purple-500/10 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
            التقييم الأساسي: {fundamentals.fundamentalScore}/100
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block">مشتريات البنوك المركزية:</span>
            <span className="text-xl font-bold font-mono text-amber-400 block my-1">{fundamentals.centralBankBuyingTons} طن/عام</span>
            <p className="text-[11px] text-slate-300">{fundamentals.centralBankTrend}</p>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block">تدفقات صناديق ETF العالمية:</span>
            <span className="text-xl font-bold font-mono text-emerald-400 block my-1">+{fundamentals.etfFlowsTons} طن</span>
            <p className="text-[11px] text-slate-300">{fundamentals.etfStatus}</p>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block">الطلب الفعلي والسبائك:</span>
            <span className="text-xl font-bold font-mono text-sky-400 block my-1">{fundamentals.physicalDemandScore}/100</span>
            <p className="text-[11px] text-slate-300">{fundamentals.chinaDemandTrend}</p>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block">مؤشر المخاطر الجيوسياسية:</span>
            <span className="text-xl font-bold font-mono text-rose-400 block my-1">{fundamentals.geopoliticalRiskScore}/100</span>
            <p className="text-[11px] text-slate-300">{fundamentals.geopoliticalSummary}</p>
          </div>
        </div>
      </div>

      {/* 4. News & Sentiment Wire */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-teal-400" />
            <div>
              <h2 className="text-base font-bold text-white">شريط الأخبار المؤثرة وتحليل المشاعر</h2>
              <p className="text-xs text-slate-400">تقارير موثقة مع تحديد وزن التأثير الزمني (قصير/متوسط/طويل)</p>
            </div>
          </div>
          <span className="text-xs font-mono bg-teal-500/10 text-teal-300 px-3 py-1 rounded-full border border-teal-500/30">
            مؤشر الأخبار: {scores.newsScore}/100
          </span>
        </div>

        <div className="space-y-3">
          {news.map(item => (
            <div key={item.id} className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {item.source}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{item.timeAgo}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.sentiment === 'POSITIVE'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : item.sentiment === 'NEGATIVE'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.sentimentArabic}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-100">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.summary}</p>
              </div>

              <div className="flex md:flex-col items-center justify-between md:justify-center gap-2 border-t md:border-t-0 md:border-r border-slate-800 pt-2 md:pt-0 md:pr-4 font-mono text-xs shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block font-sans">قوة التأثير:</span>
                  <span className="font-bold text-amber-400">{item.impactScore}/100</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block font-sans">المدى الزمني:</span>
                  <span className="text-slate-300 font-sans">{item.durationArabic}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
