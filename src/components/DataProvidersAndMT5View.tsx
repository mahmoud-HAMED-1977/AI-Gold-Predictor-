import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Cpu,
  Database,
  Lock,
  RefreshCw,
  Server,
  Shield,
  ShieldCheck,
  Wifi,
} from 'lucide-react';
import { DataProviderInfo, MT5BridgeConfig } from '../types';

interface DataProvidersAndMT5ViewProps {
  providers: DataProviderInfo[];
  mt5Config: MT5BridgeConfig;
  onUpdateMT5: (config: Partial<MT5BridgeConfig>) => void;
}

export const DataProvidersAndMT5View: React.FC<DataProvidersAndMT5ViewProps> = ({
  providers,
  mt5Config,
  onUpdateMT5,
}) => {
  const [serverName, setServerName] = useState(mt5Config.serverName);
  const [accountNumber, setAccountNumber] = useState(mt5Config.accountNumber);
  const [symbol, setSymbol] = useState(mt5Config.symbol);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMT5({
      serverName,
      accountNumber,
      symbol,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const getStatusColor = (status: string) => {
    if (status === 'CONNECTED') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (status === 'DELAYED') return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  };

  return (
    <div id="data-providers-view-root" className="space-y-6">
      {/* 1. MetaTrader 5 Bridge Configuration Card */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">جسر بيانات ميتاتريدر 5 (MT5 Data Bridge)</h2>
              <p className="text-xs text-slate-400">اتصال القراءة اللحظية وتغذية الشموع دون تنفيذ أي صفقات</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
              <Wifi className="w-3.5 h-3.5" />
              <span>{mt5Config.lastTickTime}</span>
            </span>
            <span className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full font-semibold">
              <Lock className="w-3 h-3" />
              <span>وضع القراءة فقط (Read-Only)</span>
            </span>
          </div>
        </div>

        {/* Security / Non-Trading Notice */}
        <div className="bg-slate-950/80 border border-amber-500/30 p-3.5 rounded-xl text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-slate-300 leading-relaxed">
            <strong className="text-amber-300">بروتوكول الأمان المالي:</strong> هذا الجسر يعمل بوضع المشاهد والقراءة الصامتة (Observer Pattern) لجلب الأسعار وسجل الشموع وحساب المؤشرات، وهو معزول برمجياً عن إرسال أي أوامر فتح أو إغلاق صفقات أو تداول حقيقي.
          </p>
        </div>

        {/* MT5 Bridge Form */}
        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">اسم خادم الوسيط (Broker Server):</label>
            <input
              type="text"
              value={serverName}
              onChange={e => setServerName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">رقم الحساب التعريفي (Read-Only):</label>
            <input
              type="text"
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">رمز الذهب في الوسيط (Symbol):</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={symbol}
                onChange={e => setSymbol(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono outline-none"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap"
              >
                {savedSuccess ? 'تم الحفظ!' : 'حفظ الإعدادات'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 2. All Data Providers Status List */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white">طبقة مصادر البيانات ومراقبة الاتصال (Data Providers Layer)</h2>
              <p className="text-xs text-slate-400">حالة الخوادم، سرعة الاستجابة (Latency)، ومستوى الوثوقية</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {providers.map(prov => (
            <div key={prov.id} className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{prov.nameArabic}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">{prov.name}</span>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusColor(prov.status)}`}>
                  {prov.statusArabic}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between border-b border-slate-800/60 pb-1">
                  <span className="text-slate-400">نوع البيانات:</span>
                  <span>{prov.dataTypeArabic}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-1 font-mono">
                  <span className="text-slate-400 font-sans">سرعة الاستجابة (Ping):</span>
                  <span className="text-emerald-400">{prov.latencyMs} ms</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-1 font-mono">
                  <span className="text-slate-400 font-sans">نسبة الوثوقية (Reliability):</span>
                  <span className="text-amber-400 font-bold">{prov.reliabilityScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">المصدر / Endpoint:</span>
                  <span className="font-mono text-[10px] text-slate-400 truncate max-w-[200px]">{prov.endpointOrSource}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
