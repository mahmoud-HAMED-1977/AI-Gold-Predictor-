import React from 'react';
import { AlertTriangle, Info, ShieldAlert, ShieldCheck } from 'lucide-react';
import { RiskLevel, RiskLevelArabic } from '../types';

interface GoldRiskMeterProps {
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  riskLevelArabic: RiskLevelArabic;
  riskDrivers?: { name: string; score: number; description: string }[];
}

export const GoldRiskMeter: React.FC<GoldRiskMeterProps> = ({
  riskScore,
  riskLevel,
  riskLevelArabic,
  riskDrivers = [],
}) => {
  const getRiskColor = (score: number) => {
    if (score <= 20) return { text: 'text-emerald-400', bg: 'bg-emerald-500', bar: 'from-emerald-500 to-emerald-400' };
    if (score <= 40) return { text: 'text-teal-400', bg: 'bg-teal-500', bar: 'from-emerald-500 to-teal-400' };
    if (score <= 60) return { text: 'text-amber-400', bg: 'bg-amber-500', bar: 'from-emerald-500 via-amber-400 to-amber-500' };
    if (score <= 80) return { text: 'text-orange-400', bg: 'bg-orange-500', bar: 'from-amber-500 to-orange-500' };
    return { text: 'text-rose-400', bg: 'bg-rose-500', bar: 'from-orange-500 to-rose-600' };
  };

  const colors = getRiskColor(riskScore);

  return (
    <div
      id="gold-risk-meter-card"
      className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-lg relative overflow-hidden flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-slate-400">مؤشر مخاطر الذهب</h2>
            <p className="text-xs text-slate-500">Gold Risk Index</p>
          </div>
        </div>

        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border border-slate-700 bg-slate-950 ${colors.text}`}>
          {riskLevelArabic} ({riskScore}/100)
        </span>
      </div>

      {/* Main Bar Meter */}
      <div className="my-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400">مستوى المخاطرة اللحظي:</span>
          <span className={`text-2xl font-black font-mono ${colors.text}`}>{riskScore}%</span>
        </div>

        <div className="w-full bg-slate-950 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-800 relative">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${colors.bar} transition-all duration-700`}
            style={{ width: `${riskScore}%` }}
          ></div>
        </div>

        {/* 5 Risk Range Marks */}
        <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1 px-1">
          <span>0 (منخفض جداً)</span>
          <span>40 (منخفض)</span>
          <span>60 (متوسط)</span>
          <span>80 (مرتفع)</span>
          <span>100 (حرج)</span>
        </div>
      </div>

      {/* Active Risk Drivers */}
      <div className="space-y-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800/60 text-xs">
        <span className="text-[11px] font-semibold text-slate-400 block">عوامل الخطر النشطة حالياً:</span>
        {riskDrivers.length > 0 ? (
          riskDrivers.slice(0, 2).map((driver, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-slate-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-tight">
                <strong className="text-slate-200">{driver.name}:</strong> {driver.description}
              </p>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>لا توجد مخاطر استثنائية خارج النطاق الطبيعي للذهب.</span>
          </div>
        )}
      </div>

      <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
        <Info className="w-3.5 h-3.5 text-slate-500" />
        <span>يُستخدم هذا المؤشر لتحديد حجم العقود المناسب وتوقيت الدخول.</span>
      </div>
    </div>
  );
};
