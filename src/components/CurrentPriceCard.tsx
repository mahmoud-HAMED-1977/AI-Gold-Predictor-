import React from 'react';
import { ArrowDownRight, ArrowUpRight, Clock, DollarSign, Wifi } from 'lucide-react';
import { CurrentPriceData } from '../types';

interface CurrentPriceCardProps {
  priceData: CurrentPriceData;
}

export const CurrentPriceCard: React.FC<CurrentPriceCardProps> = ({ priceData }) => {
  const isPositive = priceData.dailyChange >= 0;

  return (
    <div
      id="current-price-card"
      className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-lg relative overflow-hidden flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-slate-400">سعر الذهب الفوري</h2>
            <p className="text-sm font-bold text-white tracking-wide">XAU/USD</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
          <Wifi className="w-3 h-3" />
          <span>{priceData.connectionStatusArabic}</span>
        </div>
      </div>

      {/* Main Big Price */}
      <div className="my-3">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
            ${priceData.currentPrice.toFixed(2)}
          </span>
          <div className={`flex items-center text-xs sm:text-sm font-bold font-mono ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>{isPositive ? '+' : ''}{priceData.dailyChange.toFixed(2)} ({isPositive ? '+' : ''}{priceData.dailyChangePercent}%)</span>
          </div>
        </div>
      </div>

      {/* Bid / Ask / Spread / High / Low Grid */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-xs">
        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50">
          <span className="text-slate-400 block text-[10px]">الطلب (Bid)</span>
          <span className="font-mono font-bold text-slate-200">${priceData.bid.toFixed(2)}</span>
        </div>
        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50">
          <span className="text-slate-400 block text-[10px]">العرض (Ask)</span>
          <span className="font-mono font-bold text-slate-200">${priceData.ask.toFixed(2)}</span>
        </div>
        <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/50">
          <span className="text-slate-400 block text-[10px]">الفارق (Spread)</span>
          <span className="font-mono font-bold text-amber-400">${priceData.spread.toFixed(2)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
        <div className="flex items-center justify-between bg-slate-950/40 px-2 py-1.5 rounded border border-slate-800/40">
          <span className="text-slate-400 text-[11px]">أعلى اليوم:</span>
          <span className="font-mono font-semibold text-emerald-400">${priceData.highToday.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between bg-slate-950/40 px-2 py-1.5 rounded border border-slate-800/40">
          <span className="text-slate-400 text-[11px]">أقل اليوم:</span>
          <span className="font-mono font-semibold text-rose-400">${priceData.lowToday.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>آخر تحديث:</span>
        </span>
        <span className="font-mono text-slate-300">{priceData.lastUpdated}</span>
      </div>
    </div>
  );
};
