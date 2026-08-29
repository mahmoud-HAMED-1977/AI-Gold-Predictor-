import React from 'react';
import { HelpCircle, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';
import { SystemDecisionData } from '../types';

interface MarketSummaryBannerProps {
  decisionData: SystemDecisionData;
  onOpenHowModal: () => void;
  onOpenAiExplain: () => void;
}

export const MarketSummaryBanner: React.FC<MarketSummaryBannerProps> = ({
  decisionData,
  onOpenHowModal,
  onOpenAiExplain,
}) => {
  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case 'شراء':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
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
      id="market-summary-now-banner"
      className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 rounded-xl border border-amber-500/30 p-4 sm:p-5 shadow-lg relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              ملخص السوق الآن
            </span>
            <span
              id="summary-decision-badge"
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getDecisionBadge(decisionData.decision)}`}
            >
              القرار: {decisionData.decision}
            </span>
            <span className="text-xs text-slate-300 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
              الثقة: <strong className="text-amber-400 font-mono">{decisionData.confidenceScore}%</strong>
            </span>
            <span className="text-xs text-slate-300 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
              المخاطر: <strong className="text-white">{decisionData.riskLevelArabic} ({decisionData.riskScore}/100)</strong>
            </span>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed max-w-4xl">
            {decisionData.marketSummaryNow}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
          <button
            id="btn-how-decision-reached"
            onClick={onOpenHowModal}
            className="flex items-center gap-1.5 text-xs font-medium text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>كيف وصل النظام إلى هذا القرار؟</span>
          </button>

          <button
            id="btn-quick-ai-explain"
            onClick={onOpenAiExplain}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>تفسير المحرك</span>
          </button>
        </div>
      </div>
    </div>
  );
};
