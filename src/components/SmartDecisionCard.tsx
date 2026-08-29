import React from 'react';
import {
  AlertCircle,
  BookmarkPlus,
  CheckCircle2,
  ChevronLeft,
  HelpCircle,
  ShieldCheck,
  Target,
  Zap,
} from 'lucide-react';
import { DecisionArabic, DecisionType, SupportResistanceLevels } from '../types';

interface SmartDecisionCardProps {
  decision: DecisionArabic;
  decisionType: DecisionType;
  confidenceScore: number;
  whyExplanation: string;
  supportResistance: SupportResistanceLevels;
  onOpenHowModal: () => void;
  onLogPrediction: () => void;
  isLogging: boolean;
  logSuccess: boolean;
}

export const SmartDecisionCard: React.FC<SmartDecisionCardProps> = ({
  decision,
  confidenceScore,
  whyExplanation,
  supportResistance,
  onOpenHowModal,
  onLogPrediction,
  isLogging,
  logSuccess,
}) => {
  const getDecisionTheme = (dec: DecisionArabic) => {
    switch (dec) {
      case 'شراء':
        return {
          bg: 'from-emerald-950/80 to-slate-900',
          border: 'border-emerald-500/50',
          text: 'text-emerald-400',
          badgeBg: 'bg-emerald-500 text-slate-950',
          ring: 'ring-emerald-500/20',
          dot: 'bg-emerald-400',
        };
      case 'شراء عند التصحيح':
        return {
          bg: 'from-emerald-950/80 to-slate-900',
          border: 'border-emerald-500/50',
          text: 'text-emerald-300',
          badgeBg: 'bg-emerald-500 text-slate-950',
          ring: 'ring-emerald-500/20',
          dot: 'bg-emerald-400',
        };
      case 'احتفاظ':
        return {
          bg: 'from-sky-950/80 to-slate-900',
          border: 'border-sky-500/50',
          text: 'text-sky-400',
          badgeBg: 'bg-sky-500 text-slate-950',
          ring: 'ring-sky-500/20',
          dot: 'bg-sky-400',
        };
      case 'انتظار':
        return {
          bg: 'from-amber-950/80 to-slate-900',
          border: 'border-amber-500/50',
          text: 'text-amber-400',
          badgeBg: 'bg-amber-500 text-slate-950',
          ring: 'ring-amber-500/20',
          dot: 'bg-amber-400',
        };
      case 'جني أرباح':
        return {
          bg: 'from-orange-950/80 to-slate-900',
          border: 'border-orange-500/50',
          text: 'text-orange-400',
          badgeBg: 'bg-orange-500 text-slate-950',
          ring: 'ring-orange-500/20',
          dot: 'bg-orange-400',
        };
      case 'بيع':
        return {
          bg: 'from-rose-950/80 to-slate-900',
          border: 'border-rose-500/50',
          text: 'text-rose-400',
          badgeBg: 'bg-rose-500 text-slate-950',
          ring: 'ring-rose-500/20',
          dot: 'bg-rose-400',
        };
      default:
        return {
          bg: 'from-slate-900 to-slate-900',
          border: 'border-slate-700',
          text: 'text-slate-200',
          badgeBg: 'bg-slate-700 text-white',
          ring: 'ring-slate-700/20',
          dot: 'bg-slate-400',
        };
    }
  };

  const theme = getDecisionTheme(decision);

  return (
    <div
      id="smart-decision-card"
      className={`bg-gradient-to-br ${theme.bg} rounded-xl border-2 ${theme.border} p-5 sm:p-6 shadow-xl relative overflow-hidden ring-4 ${theme.ring}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              المحرك المركزي لاتخاذ القرار
            </h2>
            <p className="text-base sm:text-lg font-black text-white">القرار الذكي الموصى به</p>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="flex items-center gap-2 bg-slate-950/80 px-3.5 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block leading-tight">درجة الثقة:</span>
            <span className="text-base font-extrabold text-amber-400 font-mono leading-tight">
              {confidenceScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Primary Highlighted Decision Output */}
      <div className="bg-slate-950/90 rounded-xl p-4 sm:p-5 border border-slate-800/80 my-3 text-center sm:text-right flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-400">التوصية الحالية للمستثمر:</span>
          <div className="flex items-center gap-3">
            <span className={`w-3.5 h-3.5 rounded-full ${theme.dot} animate-ping`}></span>
            <span className={`text-2xl sm:text-3xl font-black ${theme.text} tracking-tight`}>
              {decision}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-decision-details"
            onClick={onOpenHowModal}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2.5 rounded-lg border border-slate-700 transition-all cursor-pointer whitespace-nowrap"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>لماذا هذا القرار؟</span>
          </button>

          <button
            id="btn-log-prediction-checkpoint"
            onClick={onLogPrediction}
            disabled={isLogging || logSuccess}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-800 disabled:text-slate-400 px-3.5 py-2.5 rounded-lg transition-all cursor-pointer whitespace-nowrap"
          >
            {logSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>تم التسجيل بالسجل</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-4 h-4" />
                <span>{isLogging ? 'جارِ الحفظ...' : 'حفظ بسجل التوقعات'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Suggested Entry, Take Profit, and Invalidation Levels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3 text-xs">
        <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>منطقة الشراء المحتملة:</span>
          </div>
          <span className="text-sm font-bold font-mono text-emerald-300">
            ${supportResistance.potentialBuyZone}
          </span>
        </div>

        <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            <span>منطقة جني الأرباح:</span>
          </div>
          <span className="text-sm font-bold font-mono text-amber-300">
            ${supportResistance.takeProfitZone}
          </span>
        </div>

        <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>إلغاء السيناريو أدنى:</span>
          </div>
          <span className="text-sm font-bold font-mono text-rose-400">
            ${supportResistance.invalidationLevel}
          </span>
        </div>
      </div>

      {/* Why Explanation Snippet */}
      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/40">
        <strong className="text-amber-400 font-semibold ml-1">تفسير المحرك:</strong>
        {whyExplanation}
      </p>
    </div>
  );
};
