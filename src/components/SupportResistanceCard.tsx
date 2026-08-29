import React from 'react';
import { ArrowDown, ArrowUp, Layers, Shield, Target, Zap } from 'lucide-react';
import { SupportResistanceLevels } from '../types';

interface SupportResistanceCardProps {
  levels: SupportResistanceLevels;
}

export const SupportResistanceCard: React.FC<SupportResistanceCardProps> = ({ levels }) => {
  return (
    <div
      id="support-resistance-card"
      className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-lg space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">سلم مستويات الدعم والمقاومة</h2>
            <p className="text-xs text-slate-400">حواجز السيولة ومناطق الانعكاس والكسر</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-white bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
          السعر الحالي: ${levels.currentPrice.toFixed(2)}
        </span>
      </div>

      {/* Vertical Ladder Representation */}
      <div className="space-y-2 font-mono text-xs">
        {/* Resistance 2 */}
        <div className="flex items-center justify-between bg-rose-950/30 border border-rose-500/30 px-3.5 py-2 rounded-lg text-rose-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span className="font-sans font-bold">مقاومة رئيسية ثانية (R2)</span>
          </div>
          <span className="font-bold">${levels.resistance2.toFixed(2)}</span>
        </div>

        {/* Resistance 1 */}
        <div className="flex items-center justify-between bg-rose-950/40 border border-rose-500/50 px-3.5 py-2.5 rounded-lg text-rose-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
            <span className="font-sans font-extrabold">أقرب مقاومة فنية (R1)</span>
            <span className="font-sans text-[10px] text-rose-400">({levels.resistanceDistancePercent}% من السعر)</span>
          </div>
          <span className="font-extrabold text-sm text-rose-300">${levels.resistance1.toFixed(2)}</span>
        </div>

        {/* Current Price Marker */}
        <div className="flex items-center justify-between bg-amber-500/20 border-2 border-amber-400/80 px-4 py-2.5 rounded-xl text-amber-300 shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
            <span className="font-sans font-black text-amber-200">موقع السعر اللحظي الآن</span>
          </div>
          <span className="text-base font-black text-white">${levels.currentPrice.toFixed(2)}</span>
        </div>

        {/* Support 1 */}
        <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-500/50 px-3.5 py-2.5 rounded-lg text-emerald-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="font-sans font-extrabold">أقرب دعم فني (S1)</span>
            <span className="font-sans text-[10px] text-emerald-400">({levels.supportDistancePercent}% من السعر)</span>
          </div>
          <span className="font-extrabold text-sm text-emerald-300">${levels.support1.toFixed(2)}</span>
        </div>

        {/* Support 2 */}
        <div className="flex items-center justify-between bg-emerald-950/30 border border-emerald-500/30 px-3.5 py-2 rounded-lg text-emerald-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-sans font-bold">دعم رئيسي ثانٍ (S2)</span>
          </div>
          <span className="font-bold">${levels.support2.toFixed(2)}</span>
        </div>
      </div>

      {/* Breakout & Breakdown Triggers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400 font-sans">تأكيد الاختراق الصاعد فوق:</span>
          <span className="font-mono font-bold text-emerald-400">${levels.breakoutLevel}</span>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400 font-sans">تأكيد الكسر الهابط دون:</span>
          <span className="font-mono font-bold text-rose-400">${levels.breakdownLevel}</span>
        </div>
      </div>
    </div>
  );
};
