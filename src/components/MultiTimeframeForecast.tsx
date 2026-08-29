import React from 'react';
import { ArrowDown, ArrowUp, Clock, HelpCircle, Minus, Target } from 'lucide-react';
import { TimeframeForecast } from '../types';

interface MultiTimeframeForecastProps {
  forecasts: TimeframeForecast[];
}

export const MultiTimeframeForecast: React.FC<MultiTimeframeForecastProps> = ({ forecasts }) => {
  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case 'شراء':
      case 'شراء عند التصحيح':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'احتفاظ':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'انتظار':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'جني أرباح':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'بيع':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div
      id="multi-timeframe-forecasts-card"
      className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-lg flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">مصفوفة التوقعات متعددة الأطر الزمنية</h2>
            <p className="text-xs text-slate-400">احتمالات الصعود والهبوط والحياد لكل إطار</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold">
              <th className="pb-3 pr-2">الإطار الزمني</th>
              <th className="pb-3 text-center">القرار المتوقع</th>
              <th className="pb-3 text-center">احتمال الصعود</th>
              <th className="pb-3 text-center">احتمال الهبوط</th>
              <th className="pb-3 text-center">احتمال الحياد</th>
              <th className="pb-3 text-left pl-2">النطاق المستهدف المتوقع</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {forecasts.map(fc => (
              <tr key={fc.timeframe} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 pr-2 font-sans font-bold text-slate-200">
                  {fc.timeframeArabic} ({fc.timeframe})
                </td>
                <td className="py-3 text-center font-sans">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${getDecisionBadge(fc.decision)}`}>
                    {fc.decision}
                  </span>
                </td>
                <td className="py-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <ArrowUp className="w-3 h-3 text-emerald-400" />
                    <span className="font-bold text-emerald-400">{fc.upProbability}%</span>
                  </div>
                </td>
                <td className="py-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <ArrowDown className="w-3 h-3 text-rose-400" />
                    <span className="font-bold text-rose-400">{fc.downProbability}%</span>
                  </div>
                </td>
                <td className="py-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Minus className="w-3 h-3 text-amber-400" />
                    <span className="text-amber-400">{fc.neutralProbability}%</span>
                  </div>
                </td>
                <td className="py-3 text-left pl-2 text-slate-300">
                  <span className="text-emerald-400">${fc.expectedTargetHigh.toFixed(0)}</span>
                  <span className="text-slate-500 mx-1">-</span>
                  <span className="text-rose-400">${fc.expectedTargetLow.toFixed(0)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span>تعتمد التوقعات على توافق الخوارزميات الإحصائية وحركة التدفقات النقدية.</span>
        <span className="text-amber-400 font-semibold">تحديث متزامن مع كل إغلاق شمعة</span>
      </div>
    </div>
  );
};
