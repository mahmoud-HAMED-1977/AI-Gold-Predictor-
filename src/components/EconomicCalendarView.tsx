import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Bell, Calendar, Clock, Filter, Info } from 'lucide-react';
import { EconomicEvent, ImportanceLevel } from '../types';

interface EconomicCalendarViewProps {
  events: EconomicEvent[];
}

export const EconomicCalendarView: React.FC<EconomicCalendarViewProps> = ({ events }) => {
  const [selectedImportance, setSelectedImportance] = useState<string>('ALL');

  const filteredEvents = events.filter(e => {
    if (selectedImportance === 'ALL') return true;
    return e.importance === selectedImportance;
  });

  const getImportanceBadge = (imp: ImportanceLevel, arabic: string) => {
    switch (imp) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-black';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40 font-bold';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div id="economic-calendar-view-root" className="space-y-5">
      {/* Impending Alert Banner if any event within 90 minutes */}
      {events.some(e => e.isUpcomingAlert && e.minutesUntil <= 90) && (
        <div className="bg-gradient-to-r from-rose-950/80 to-slate-900 border-2 border-rose-500/50 rounded-xl p-4 flex items-center justify-between gap-4 shadow-lg animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0 border border-rose-500/40">
              <Bell className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-400 block">تنبيه حدث اقتصادي حرج وشيك!</span>
              <p className="text-sm font-bold text-white">
                مؤشر أسعار المستهلكين الأمريكي (CPI) يصدر بعد 45 دقيقة
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-rose-300 bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/30 whitespace-nowrap">
            متبقي: 45 دقيقة
          </span>
        </div>
      )}

      {/* Header & Filter Controls */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">الأجندة والتقويم الاقتصادي</h2>
            <p className="text-xs text-slate-400">توقيت الأحداث الكبرى وتأثيرها المباشر على تحركات الذهب</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setSelectedImportance('ALL')}
            className={`px-3 py-1 rounded font-semibold transition-all cursor-pointer ${
              selectedImportance === 'ALL' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            الكل ({events.length})
          </button>
          <button
            onClick={() => setSelectedImportance('CRITICAL')}
            className={`px-3 py-1 rounded font-semibold transition-all cursor-pointer ${
              selectedImportance === 'CRITICAL' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            شديد التأثير
          </button>
          <button
            onClick={() => setSelectedImportance('HIGH')}
            className={`px-3 py-1 rounded font-semibold transition-all cursor-pointer ${
              selectedImportance === 'HIGH' ? 'bg-orange-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            مرتفع
          </button>
          <button
            onClick={() => setSelectedImportance('MEDIUM')}
            className={`px-3 py-1 rounded font-semibold transition-all cursor-pointer ${
              selectedImportance === 'MEDIUM' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            متوسط
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filteredEvents.map(item => (
          <div
            key={item.id}
            className={`bg-slate-900/90 rounded-xl border p-4 sm:p-5 shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              item.isUpcomingAlert ? 'border-rose-500/40 bg-gradient-to-r from-slate-900 to-rose-950/20' : 'border-slate-800'
            }`}
          >
            {/* Event Name & Flag */}
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base">{item.countryFlag}</span>
                <span className="text-xs text-slate-400 font-medium">{item.country}</span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-amber-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.date} - {item.time}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getImportanceBadge(item.importance, item.importanceArabic)}`}>
                  {item.importanceArabic}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white">{item.name}</h3>

              <div className="flex items-start gap-1.5 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 mt-2">
                <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong className="text-amber-300">التأثير على الذهب:</strong> {item.goldImpact}
                </p>
              </div>
            </div>

            {/* Figures Grid */}
            <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center border-t md:border-t-0 md:border-r border-slate-800 pt-3 md:pt-0 md:pr-5 shrink-0">
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 min-w-[75px]">
                <span className="text-slate-500 text-[10px] block font-sans">السابق</span>
                <span className="font-bold text-slate-300">{item.previous}</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 min-w-[75px]">
                <span className="text-slate-500 text-[10px] block font-sans">المتوقع</span>
                <span className="font-bold text-amber-400">{item.forecast}</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 min-w-[75px]">
                <span className="text-slate-500 text-[10px] block font-sans">الفعلي</span>
                <span className="font-bold text-slate-400">{item.actual || 'قيد الانتظار'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
