import React, { useState } from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  Flame,
  Radio,
  RefreshCw,
  RotateCcw,
  Save,
  Sliders,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Volume2,
  Zap,
} from 'lucide-react';
import { EngineWeights, SystemSettings } from '../types';

interface SettingsViewProps {
  settings: SystemSettings;
  onSaveSettings: (settings: Partial<SystemSettings>) => void;
  onTriggerTestAlert?: (type: 'BUY' | 'SELL' | 'URGENT') => void;
  secondsUntilNextCheck?: number;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onTriggerTestAlert,
  secondsUntilNextCheck = 600,
}) => {
  const [weights, setWeights] = useState<EngineWeights>({ ...settings.weights });
  const [updateInterval, setUpdateInterval] = useState(settings.updateIntervalSeconds);
  const [alertHighImpact, setAlertHighImpact] = useState(settings.alertOnHighImpactNews);
  const [alertDecisionChange, setAlertDecisionChange] = useState(settings.alertOnDecisionChange);
  const [alertRiskSpike, setAlertRiskSpike] = useState(settings.alertOnRiskSpike);
  const [riskTolerance, setRiskTolerance] = useState(settings.riskTolerance);
  const [autoPopupEnabled, setAutoPopupEnabled] = useState(settings.autoPopupEnabled ?? true);
  const [soundAlertEnabled, setSoundAlertEnabled] = useState(settings.soundAlertEnabled ?? true);
  const [popupIntervalMinutes, setPopupIntervalMinutes] = useState(settings.popupIntervalMinutes ?? 10);
  const [saved, setSaved] = useState(false);

  const totalWeight =
    weights.technicalWeight +
    weights.macroWeight +
    weights.dollarWeight +
    weights.fundamentalWeight +
    weights.newsWeight +
    weights.sentimentWeight;

  const handleResetDefaults = () => {
    setWeights({
      technicalWeight: 30,
      macroWeight: 20,
      dollarWeight: 15,
      fundamentalWeight: 15,
      newsWeight: 10,
      sentimentWeight: 10,
    });
  };

  const handleSave = () => {
    onSaveSettings({
      weights,
      updateIntervalSeconds: updateInterval,
      alertOnHighImpactNews: alertHighImpact,
      alertOnDecisionChange: alertDecisionChange,
      alertOnRiskSpike: alertRiskSpike,
      riskTolerance,
      autoPopupEnabled,
      soundAlertEnabled,
      popupIntervalMinutes,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div id="settings-view-root" className="space-y-6">
      {/* 1. Decision Engine Weights Customizer */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Sliders className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">تخصيص أوزان المحركات في اتخاذ القرار</h2>
              <p className="text-xs text-slate-400">تحديد نسبة مساهمة كل محرك تحليلي في حساب القرار النهائي ومستوى الثقة</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${totalWeight === 100 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
              المجموع: {totalWeight}%
            </span>
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1 rounded border border-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>استعادة الافتراضي</span>
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* Technical Weight */}
          <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between font-medium">
              <span className="text-slate-200">وزن التحليل الفني (المتوسطات، RSI، MACD):</span>
              <span className="font-mono font-bold text-emerald-400">{weights.technicalWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={weights.technicalWeight}
              onChange={e => setWeights({ ...weights, technicalWeight: Number(e.target.value) })}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Macro Weight */}
          <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between font-medium">
              <span className="text-slate-200">وزن الاقتصاد الكلي وعوائد السندات:</span>
              <span className="font-mono font-bold text-sky-400">{weights.macroWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={weights.macroWeight}
              onChange={e => setWeights({ ...weights, macroWeight: Number(e.target.value) })}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Dollar Weight */}
          <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between font-medium">
              <span className="text-slate-200">وزن مؤشر الدولار DXY والعملات:</span>
              <span className="font-mono font-bold text-amber-400">{weights.dollarWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={weights.dollarWeight}
              onChange={e => setWeights({ ...weights, dollarWeight: Number(e.target.value) })}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Fundamental Weight */}
          <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between font-medium">
              <span className="text-slate-200">وزن التحليل الأساسي ومشتريات البنوك وETF:</span>
              <span className="font-mono font-bold text-purple-400">{weights.fundamentalWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={weights.fundamentalWeight}
              onChange={e => setWeights({ ...weights, fundamentalWeight: Number(e.target.value) })}
              className="w-full accent-amber-500"
            />
          </div>

          {/* News Weight */}
          <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between font-medium">
              <span className="text-slate-200">وزن الأخبار الجيوسياسية الموثقة:</span>
              <span className="font-mono font-bold text-teal-400">{weights.newsWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={weights.newsWeight}
              onChange={e => setWeights({ ...weights, newsWeight: Number(e.target.value) })}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Sentiment Weight */}
          <div className="space-y-1.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between font-medium">
              <span className="text-slate-200">وزن مشاعر المستثمرين والسيولة:</span>
              <span className="font-mono font-bold text-rose-400">{weights.sentimentWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={weights.sentimentWeight}
              onChange={e => setWeights({ ...weights, sentimentWeight: Number(e.target.value) })}
              className="w-full accent-amber-500"
            />
          </div>
        </div>
      </div>

      {/* 2. System Preferences & Alerts */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-lg space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Bell className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-white">إعدادات التنبيهات وإدارة المخاطر</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <label className="flex items-center justify-between bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 cursor-pointer">
            <span className="text-slate-200 font-medium">تنبيه فوري عند صدور أحداث اقتصادية كبرى (CPI, NFP):</span>
            <input
              type="checkbox"
              checked={alertHighImpact}
              onChange={e => setAlertHighImpact(e.target.checked)}
              className="w-4 h-4 accent-amber-500"
            />
          </label>

          <label className="flex items-center justify-between bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 cursor-pointer">
            <span className="text-slate-200 font-medium">تنبيه عند تغير قرار النظام (مثال: من انتظار إلى شراء):</span>
            <input
              type="checkbox"
              checked={alertDecisionChange}
              onChange={e => setAlertDecisionChange(e.target.checked)}
              className="w-4 h-4 accent-amber-500"
            />
          </label>

          <label className="flex items-center justify-between bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 cursor-pointer">
            <span className="text-slate-200 font-medium">تنبيه عند قفزة مفاجئة في مؤشر المخاطر فوق 65%:</span>
            <input
              type="checkbox"
              checked={alertRiskSpike}
              onChange={e => setAlertRiskSpike(e.target.checked)}
              className="w-4 h-4 accent-amber-500"
            />
          </label>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <span className="text-slate-200 font-medium">نمط تحمل المخاطر المفضل:</span>
            <select
              value={riskTolerance}
              onChange={e => setRiskTolerance(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2.5 py-1 outline-none"
            >
              <option value="CONSERVATIVE">متحفظ (حماية رأس المال)</option>
              <option value="BALANCED">متوازن (الافتراضي الموصى به)</option>
              <option value="AGGRESSIVE">جريء (عالي التقبل للمخاطر)</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2 flex items-center justify-end gap-3">
          {saved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              تم حفظ الإعدادات وتطبيقها على المحرك فورياً!
            </span>
          )}
          <button
            id="btn-save-settings"
            onClick={handleSave}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>حفظ وتطبيق الإعدادات</span>
          </button>
        </div>
      </div>

      {/* 3. Flickery Signal Popups & 10-Minute Periodic Automation */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>نظام التنبيهات المنبثقة التلقائي (Flickery Signals)</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  تحديث كل 10 دقائق + لحظي مستعجل
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                إظهار رسائل منبثقة ملونة وفليكيرية نابضة عند توفر فرصة شراء (أخضر)، بيع (أحمر)، أو قرار طارئ مستعجل
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">المسح القادم بعد:</span>
            <span className="text-amber-400 font-bold">
              {Math.floor(secondsUntilNextCheck / 60)}:{String(secondsUntilNextCheck % 60).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <label className="flex items-center justify-between bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 cursor-pointer">
            <div>
              <span className="text-slate-200 font-bold block">تفعيل التنبيهات المنبثقة التلقائية:</span>
              <span className="text-[11px] text-slate-400">إظهار النافذة الفليكيرية عند تحقق الشروط</span>
            </div>
            <input
              type="checkbox"
              checked={autoPopupEnabled}
              onChange={e => setAutoPopupEnabled(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 cursor-pointer">
            <div>
              <span className="text-slate-200 font-bold block">التنبيه الصوتي (Audio Chime):</span>
              <span className="text-[11px] text-slate-400">نغمة صوتية تمايزية للشراء والبيع والطوارئ</span>
            </div>
            <input
              type="checkbox"
              checked={soundAlertEnabled}
              onChange={e => setSoundAlertEnabled(e.target.checked)}
              className="w-4 h-4 accent-amber-500 cursor-pointer"
            />
          </label>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-200 font-bold block">دورة المسح الدوري:</span>
              <span className="text-[11px] text-slate-400">الفترة الزمنية بين التقييمات الآلية</span>
            </div>
            <select
              value={popupIntervalMinutes}
              onChange={e => setPopupIntervalMinutes(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2.5 py-1 outline-none text-xs font-mono"
            >
              <option value={5}>كل 5 دقائق</option>
              <option value={10}>كل 10 دقائق (الموصى به)</option>
              <option value={15}>كل 15 دقيقة</option>
              <option value={30}>كل 30 دقيقة</option>
            </select>
          </div>
        </div>

        {/* Live Test Triggers */}
        {onTriggerTestAlert && (
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-slate-200">
                اختبار فوري لنماذج الرسائل المنبثقة (Live Simulation Test):
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <button
                type="button"
                onClick={() => onTriggerTestAlert('BUY')}
                className="flex items-center justify-center gap-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 font-bold py-2.5 px-3 rounded-xl transition-all cursor-pointer text-xs"
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>تجربة تنبيه شراء (أخضر فليكيري)</span>
              </button>

              <button
                type="button"
                onClick={() => onTriggerTestAlert('SELL')}
                className="flex items-center justify-center gap-2 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 hover:text-rose-200 font-bold py-2.5 px-3 rounded-xl transition-all cursor-pointer text-xs"
              >
                <TrendingDown className="w-4 h-4 text-rose-400" />
                <span>تجربة تنبيه بيع (أحمر فليكيري)</span>
              </button>

              <button
                type="button"
                onClick={() => onTriggerTestAlert('URGENT')}
                className="flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/60 text-red-300 hover:text-white font-bold py-2.5 px-3 rounded-xl transition-all cursor-pointer text-xs animate-pulse"
              >
                <Flame className="w-4 h-4 text-red-400" />
                <span>تجربة قرار مستعجل لحظي 🚨</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
