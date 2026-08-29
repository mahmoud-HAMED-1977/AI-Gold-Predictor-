import React from 'react';
import { Activity, Flame, TrendingDown, TrendingUp } from 'lucide-react';
import { TrendArabic, TrendDirection } from '../types';

interface CurrentTrendCardProps {
  trend: TrendArabic;
  trendDirection: TrendDirection;
  trendStrength: number; // 0 - 100
}

export const CurrentTrendCard: React.FC<CurrentTrendCardProps> = ({
  trend,
  trendDirection,
  trendStrength,
}) => {
  const isBullish = trendDirection === 'BULLISH' || trendDirection === 'BULLISH_STRONG';
  const isBearish = trendDirection === 'BEARISH' || trendDirection === 'BEARISH_STRONG';

  const getTrendColor = () => {
    if (trendDirection === 'BULLISH_STRONG') return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (trendDirection === 'BULLISH') return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (trendDirection === 'BEARISH_STRONG') return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
    if (trendDirection === 'BEARISH') return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
    return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  };

  const getBarGradient = () => {
    if (isBullish) return 'from-emerald-600 to-emerald-400';
    if (isBearish) return 'from-rose-600 to-rose-400';
    return 'from-amber-600 to-amber-400';
  };

  return (
    <div
      id="current-trend-card"
      className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-lg relative overflow-hidden flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-slate-400">الاتجاه الفني الحالي</h2>
            <p className="text-xs text-slate-500">تحليل الأطر المتعددة</p>
          </div>
        </div>

        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getTrendColor()} flex items-center gap-1`}>
          {isBullish ? <TrendingUp className="w-3.5 h-3.5" /> : isBearish ? <TrendingDown className="w-3.5 h-3.5" /> : null}
          <span>{trend}</span>
        </span>
      </div>

      {/* Big Trend Strength Score */}
      <div className="my-3">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-xs text-slate-300 font-medium">قوة الاتجاه العام:</span>
          <span className="text-2xl font-extrabold text-white font-mono">{trendStrength}<span className="text-sm font-normal text-slate-400">/100</span></span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getBarGradient()} transition-all duration-700`}
            style={{ width: `${trendStrength}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/60 text-xs space-y-1.5">
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400">هيكل السوق:</span>
          <span className="font-semibold text-emerald-400">قمم وقيعان صاعدة (Bullish)</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400">قوة الزخم (ADX):</span>
          <span className="font-mono font-semibold text-slate-200">34.5 (زخم قوي)</span>
        </div>
      </div>

      <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1.5">
        <Flame className="w-3.5 h-3.5 text-amber-400" />
        <span>الاتجاه الرئيسي مدعوم بمتوسطات EMA 20 وEMA 50 وEMA 200.</span>
      </div>
    </div>
  );
};
