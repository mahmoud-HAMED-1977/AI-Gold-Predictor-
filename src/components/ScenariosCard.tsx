import React from 'react';
import { AlertOctagon, CheckCircle, Compass, HelpCircle, RefreshCw } from 'lucide-react';
import { FutureScenarios } from '../types';

interface ScenariosCardProps {
  scenarios: FutureScenarios;
}

export const ScenariosCard: React.FC<ScenariosCardProps> = ({ scenarios }) => {
  return (
    <div
      id="future-scenarios-card"
      className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-lg space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Compass className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">السيناريوهات المستقبلية لحركة الذهب</h2>
            <p className="text-xs text-slate-400">السيناريو الأرجح والبديل ومستوى إلغاء التوقع</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Scenario */}
        <div className="bg-slate-950/70 border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500"></div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                السيناريو الرئيسي (الأرجح)
              </span>
              <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {scenarios.mainScenario.probability}%
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed mb-3">
              {scenarios.mainScenario.description}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800 text-xs flex justify-between items-center text-slate-300">
            <span className="text-slate-400">النطاق المستهدف:</span>
            <span className="font-mono font-bold text-emerald-400">${scenarios.mainScenario.targetRange}</span>
          </div>
        </div>

        {/* Alternative Scenario */}
        <div className="bg-slate-950/70 border border-amber-500/30 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1 h-full bg-amber-500"></div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />
                السيناريو البديل (تصحيح)
              </span>
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {scenarios.alternativeScenario.probability}%
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed mb-3">
              {scenarios.alternativeScenario.description}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800 text-xs flex justify-between items-center text-slate-300">
            <span className="text-slate-400">نطاق الدعم للشراء:</span>
            <span className="font-mono font-bold text-amber-400">${scenarios.alternativeScenario.targetRange}</span>
          </div>
        </div>

        {/* Risk / Invalidation Scenario */}
        <div className="bg-slate-950/70 border border-rose-500/30 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1 h-full bg-rose-500"></div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5" />
                سيناريو الخطر (إلغاء النظرة)
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed mb-3">
              {scenarios.riskScenario.description}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800 text-xs flex flex-col gap-1 text-slate-300">
            <span className="text-rose-400 text-[11px] font-semibold">شرط إلغاء السيناريو الصاعد:</span>
            <span className="text-[11px] text-slate-300">{scenarios.riskScenario.invalidationTrigger}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
