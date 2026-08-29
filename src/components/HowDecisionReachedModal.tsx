import React from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  HelpCircle,
  Percent,
  ShieldAlert,
  Sliders,
  X,
  Zap,
} from 'lucide-react';
import { SystemDecisionData } from '../types';

interface HowDecisionReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  decisionData: SystemDecisionData;
}

export const HowDecisionReachedModal: React.FC<HowDecisionReachedModalProps> = ({
  isOpen,
  onClose,
  decisionData,
}) => {
  if (!isOpen) return null;

  const { scores, weights } = decisionData;

  const calculationRows = [
    {
      name: 'المحرك الفني (المتوسطات، RSI، MACD، ADX)',
      score: scores.technicalScore,
      weight: weights.technicalWeight,
      color: 'text-emerald-400',
    },
    {
      name: 'محرك الاقتصاد الكلي وعوائد السندات الحقيقية',
      score: scores.macroScore,
      weight: weights.macroWeight,
      color: 'text-sky-400',
    },
    {
      name: 'محرك مؤشر الدولار الأمريكي DXY والعملات',
      score: scores.dollarScore,
      weight: weights.dollarWeight,
      color: 'text-amber-400',
    },
    {
      name: 'المحرك الأساسي (البنوك المركزية وصناديق ETF)',
      score: scores.fundamentalScore,
      weight: weights.fundamentalWeight,
      color: 'text-purple-400',
    },
    {
      name: 'محرك الأخبار والتقارير الجيوسياسية الموثقة',
      score: scores.newsScore,
      weight: weights.newsWeight,
      color: 'text-teal-400',
    },
    {
      name: 'محرك تحليل المشاعر وتدفقات السيولة',
      score: scores.sentimentScore,
      weight: weights.sentimentWeight,
      color: 'text-rose-400',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div
        id="modal-how-decision-reached"
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">كيف وصل النظام إلى هذا القرار؟</h2>
              <p className="text-xs text-slate-400">شفافية كاملة لتفكيك النتيجة وحساب الأوزان التراكمية</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Decision Summary Card */}
        <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">القرار النهائي الصادر:</span>
            <span className="text-xl font-black text-amber-400">{decisionData.decision}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">درجة التوافق والثقة:</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{decisionData.confidenceScore}%</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">مؤشر المخاطر:</span>
            <span className="text-xl font-bold font-mono text-rose-400">{decisionData.riskScore}/100</span>
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="space-y-2 text-xs">
          <span className="text-xs font-bold text-slate-300 block">تفصيل مساهمة المحركات الفرعية:</span>
          <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/70 font-mono">
            {calculationRows.map((row, idx) => {
              const contribution = ((row.score * row.weight) / 100).toFixed(1);
              return (
                <div key={idx} className="p-3 bg-slate-950/60 flex items-center justify-between gap-2">
                  <div className="font-sans font-medium text-slate-200 flex-1">
                    {row.name}
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <span className="text-slate-400">العلامة: <strong className={row.color}>{row.score}/100</strong></span>
                    <span className="text-slate-500">×</span>
                    <span className="text-slate-400">الوزن: <strong className="text-white">{row.weight}%</strong></span>
                    <span className="text-slate-500">=</span>
                    <span className="font-bold text-amber-400 min-w-[45px]">+{contribution}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bullet Points */}
        <div className="space-y-2 bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs">
          <span className="font-bold text-amber-400 block">عوامل الحسم في القرار الحالي:</span>
          <ul className="space-y-1.5 text-slate-300">
            {decisionData.whyBreakdownPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs transition-all cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
