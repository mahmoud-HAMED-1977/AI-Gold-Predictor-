import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <footer className="mt-8 border-t border-slate-800/80 pt-6 pb-8 text-xs text-slate-500 max-w-7xl mx-auto px-4">
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500/80 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-slate-400 text-[11px]">
            <strong className="text-slate-300">إخلاء مسؤولية استثماري ومالي:</strong> نظام "التنبؤ الذكي بالذهب (AI Gold Predictor)" هو أداة تحليل إحصائي ومساعد لاتخاذ القرارات الاستثمارية، وليس منصة تنفيذ صفقات، ولا يقدم ضماناً ثابتاً لحركة الأسعار أو الأرباح. حركة أسواق المعادن الثمينة XAU/USD تنطوي على مخاطر تقلبات سعرية عالية؛ لذلك يجب دائماً تطبيق استراتيجية صارمة لإدارة رأس المال وتحمل المسؤولية الفردية لقرارات التداول.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono shrink-0">
          <span>AI Gold Predictor v2.4</span>
          <span>•</span>
          <span>XAU/USD Real-Time Engine</span>
        </div>
      </div>
    </footer>
  );
};
