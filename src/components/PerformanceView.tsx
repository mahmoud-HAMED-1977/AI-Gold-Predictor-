import React from 'react';
import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  CheckCircle,
  Percent,
  PieChart,
  ShieldCheck,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import { AccuracyPerformanceMetrics } from '../types';

interface PerformanceViewProps {
  metrics: AccuracyPerformanceMetrics;
}

export const PerformanceView: React.FC<PerformanceViewProps> = ({ metrics }) => {
  return (
    <div id="performance-view-root" className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">لوحة قياس أداء ودقة نظام التنبؤ</h2>
            <p className="text-xs text-slate-400">تقييم النماذج الإحصائية ومعدل الإصابة الإجمالي بدون تزييف</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">حالة العينة الإحصائية:</span>
          <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
            {metrics.sampleStatusMessage}
          </span>
        </div>
      </div>

      {/* Main KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">دقة آخر 24 ساعة</span>
          <span className="text-2xl font-black font-mono text-emerald-400">{metrics.accuracy24h}%</span>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>معدل توافق لحظي</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">دقة آخر 7 أيام</span>
          <span className="text-2xl font-black font-mono text-amber-400">{metrics.accuracy7d}%</span>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
            <TrendingUp className="w-3 h-3 text-amber-400" />
            <span>الأداء الأسبوعي المتراكم</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">دقة آخر 30 يوماً</span>
          <span className="text-2xl font-black font-mono text-sky-400">{metrics.accuracy30d}%</span>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
            <TrendingUp className="w-3 h-3 text-sky-400" />
            <span>الأداء الشهري العام</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">متوسط الخطأ المطلق (MAE)</span>
          <span className="text-2xl font-black font-mono text-purple-400">{metrics.meanAbsoluteError}%</span>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
            <Percent className="w-3 h-3 text-purple-400" />
            <span>انحراف سعري ضئيل</span>
          </div>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Accuracy by Timeframe */}
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">الدقة بحسب الإطار الزمني</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              أفضل إطار: <strong className="text-emerald-400">{metrics.bestTimeframe}</strong>
            </span>
          </div>

          <div className="space-y-3">
            {metrics.accuracyByTimeframe.map(tf => (
              <div key={tf.timeframe} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-sans font-medium text-slate-300">{tf.timeframe} ({tf.total} توقع)</span>
                  <span className="font-bold text-white">{tf.accuracy}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"
                    style={{ width: `${tf.accuracy}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Signals Quality & Validation */}
        <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">جودة الإشارات الإحصائية</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              إجمالي المفحوصة: <strong className="text-white">{metrics.totalEvaluated}</strong>
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span>التوقعات الصائبة المكتملة:</span>
              </div>
              <span className="font-mono font-bold text-emerald-400">{metrics.correctPredictions}</span>
            </div>

            <div className="flex items-center justify-between bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 text-rose-400">
                <XCircle className="w-4 h-4" />
                <span>التوقعات غير الصائبة:</span>
              </div>
              <span className="font-mono font-bold text-rose-400">{metrics.incorrectPredictions}</span>
            </div>

            <div className="flex items-center justify-between bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <span>معدل الإشارات الخاطئة (False Signals):</span>
              </div>
              <span className="font-mono font-bold text-amber-400">{metrics.falseSignalRate}%</span>
            </div>

            <div className="flex items-center justify-between bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 text-sky-400">
                <Award className="w-4 h-4" />
                <span>الدقة الاتجاهية (Directional Accuracy):</span>
              </div>
              <span className="font-mono font-bold text-sky-400">{metrics.directionalAccuracy}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
