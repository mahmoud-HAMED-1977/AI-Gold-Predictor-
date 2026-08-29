import React, { useState } from 'react';
import {
  BookmarkPlus,
  CheckCircle2,
  Clock,
  Filter,
  History,
  Search,
  TrendingDown,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import { PredictionRecord, Timeframe } from '../types';

interface PredictionHistoryViewProps {
  history: PredictionRecord[];
  onLogNewPrediction: (tf: Timeframe) => void;
  isLogging: boolean;
}

export const PredictionHistoryView: React.FC<PredictionHistoryViewProps> = ({
  history,
  onLogNewPrediction,
  isLogging,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTfFilter, setSelectedTfFilter] = useState('ALL');
  const [selectedOutcomeFilter, setSelectedOutcomeFilter] = useState('ALL');
  const [selectedTimeframeToLog, setSelectedTimeframeToLog] = useState<Timeframe>('1h');

  const filteredHistory = history.filter(record => {
    const matchesSearch =
      record.primaryFactor.includes(searchTerm) ||
      record.decision.includes(searchTerm) ||
      record.dateStr.includes(searchTerm);

    const matchesTf = selectedTfFilter === 'ALL' || record.timeframe === selectedTfFilter;

    let matchesOutcome = true;
    if (selectedOutcomeFilter === 'CORRECT') matchesOutcome = record.isCorrect === true;
    if (selectedOutcomeFilter === 'INCORRECT') matchesOutcome = record.isCorrect === false;
    if (selectedOutcomeFilter === 'PENDING') matchesOutcome = record.isEvaluated === false;

    return matchesSearch && matchesTf && matchesOutcome;
  });

  return (
    <div id="prediction-history-view-root" className="space-y-5">
      {/* Header & Quick Action Bar */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <History className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">سجل التوقعات والتحليلات التاريخية</h2>
            <p className="text-xs text-slate-400">توثيق جميع القرارات ومقارنة السعر المتوقع بالسعر الفعلي المحقق</p>
          </div>
        </div>

        {/* Quick Log Form */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          <select
            value={selectedTimeframeToLog}
            onChange={e => setSelectedTimeframeToLog(e.target.value as Timeframe)}
            className="bg-slate-900 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 border border-slate-700 outline-none"
          >
            <option value="15m">15 دقيقة</option>
            <option value="1h">1 ساعة</option>
            <option value="4h">4 ساعات</option>
            <option value="1D">1 يوم</option>
            <option value="1W">1 أسبوع</option>
          </select>

          <button
            onClick={() => onLogNewPrediction(selectedTimeframeToLog)}
            disabled={isLogging}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>{isLogging ? 'جارِ التسجيل...' : 'تسجيل التوقع اللحظي'}</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 flex-1 min-w-[200px] max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="بحث بالعامل الأساسي أو القرار أو التاريخ..."
            className="bg-transparent text-slate-200 outline-none text-xs w-full"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedTfFilter}
            onChange={e => setSelectedTfFilter(e.target.value)}
            className="bg-slate-950 text-slate-300 rounded-lg px-2.5 py-2 border border-slate-800 outline-none text-xs"
          >
            <option value="ALL">جميع الأطر الزمنية</option>
            <option value="15m">15 دقيقة</option>
            <option value="1h">ساعة</option>
            <option value="4h">4 ساعات</option>
            <option value="1D">يومي</option>
            <option value="1W">أسبوعي</option>
          </select>

          <select
            value={selectedOutcomeFilter}
            onChange={e => setSelectedOutcomeFilter(e.target.value)}
            className="bg-slate-950 text-slate-300 rounded-lg px-2.5 py-2 border border-slate-800 outline-none text-xs"
          >
            <option value="ALL">جميع النتائج</option>
            <option value="CORRECT">صائبة (ناجحة)</option>
            <option value="INCORRECT">خاطئة</option>
            <option value="PENDING">قيد المتابعة والتقييم</option>
          </select>
        </div>
      </div>

      {/* Predictions Table */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-4">التاريخ والوقت</th>
                <th className="py-3 px-3">الإطار</th>
                <th className="py-3 px-3">السعر عند التوقع</th>
                <th className="py-3 px-3">القرار الصادر</th>
                <th className="py-3 px-3 text-center">الاحتمالات (صعود / هبوط)</th>
                <th className="py-3 px-3">الثقة / المخاطر</th>
                <th className="py-3 px-3">العامل الأساسي</th>
                <th className="py-3 px-3">السعر المحقق</th>
                <th className="py-3 px-4 text-center">تقييم النتيجة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredHistory.map(record => (
                <tr key={record.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-sans text-slate-300 whitespace-nowrap">
                    <div>{record.dateStr}</div>
                    <span className="text-[10px] text-slate-500 font-mono">{record.timeStr}</span>
                  </td>
                  <td className="py-3.5 px-3 font-sans font-semibold text-slate-300 whitespace-nowrap">
                    {record.timeframeArabic}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-white whitespace-nowrap">
                    ${record.priceAtPrediction.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-3 font-sans whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      {record.decision}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <span className="text-emerald-400 font-bold">{record.upProb}%</span>
                    <span className="text-slate-600 mx-1">/</span>
                    <span className="text-rose-400 font-bold">{record.downProb}%</span>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap text-slate-300">
                    <div>ثقة: <span className="text-amber-400">{record.confidence}%</span></div>
                    <div className="text-[10px] text-slate-500">مخاطر: {record.riskScore}/100</div>
                  </td>
                  <td className="py-3.5 px-3 font-sans text-slate-300 max-w-xs truncate" title={record.primaryFactor}>
                    {record.primaryFactor}
                  </td>
                  <td className="py-3.5 px-3 font-bold whitespace-nowrap">
                    {record.actualRealizedPrice ? (
                      <span className="text-slate-200">${record.actualRealizedPrice.toFixed(2)}</span>
                    ) : (
                      <span className="text-slate-500 font-sans">قيد المتابعة</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center font-sans whitespace-nowrap">
                    {record.isEvaluated ? (
                      record.isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          صائب ({record.deviationPercent && record.deviationPercent > 0 ? '+' : ''}{record.deviationPercent}%)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold">
                          <XCircle className="w-3.5 h-3.5" />
                          غير صائب
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        بانتظار الإغلاق
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
