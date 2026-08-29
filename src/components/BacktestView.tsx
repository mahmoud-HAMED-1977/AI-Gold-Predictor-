import React, { useState } from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Calculator,
  CheckCircle2,
  DollarSign,
  Layers,
  Play,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { BacktestConfig, BacktestResult, Timeframe } from '../types';

interface BacktestViewProps {
  onRunBacktest: (config: BacktestConfig) => void;
  isRunning: boolean;
  result: BacktestResult | null;
}

export const BacktestView: React.FC<BacktestViewProps> = ({
  onRunBacktest,
  isRunning,
  result,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1h');
  const [periodDays, setPeriodDays] = useState<number>(30);
  const [initialCapital, setInitialCapital] = useState<number>(10000);
  const [riskPercentPerTrade, setRiskPercentPerTrade] = useState<number>(2);
  const [stopLossAtrMultiplier, setStopLossAtrMultiplier] = useState<number>(1.5);
  const [takeProfitAtrMultiplier, setTakeProfitAtrMultiplier] = useState<number>(2.5);

  const handleRun = () => {
    onRunBacktest({
      timeframe,
      periodDays,
      initialCapital,
      riskPercentPerTrade,
      stopLossAtrMultiplier,
      takeProfitAtrMultiplier,
    });
  };

  return (
    <div id="backtest-view-root" className="space-y-6">
      {/* Simulation Configuration Card */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Layers className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">مختبر المحاكاة والاختبار التاريخي (Backtesting Engine)</h2>
              <p className="text-xs text-slate-400">اختبار خوارزميات التنبؤ على بيانات الذهب السابقة مع عزل أي تسريب بيانات مستقبلي</p>
            </div>
          </div>

          <button
            id="btn-run-backtest"
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all cursor-pointer"
          >
            <Play className={`w-4 h-4 fill-slate-950 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'جارِ تشغيل المحاكاة...' : 'تشغيل الاختبار التاريخي الآن'}</span>
          </button>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">الإطار الزمني:</label>
            <select
              value={timeframe}
              onChange={e => setTimeframe(e.target.value as Timeframe)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 outline-none"
            >
              <option value="15m">15 دقيقة</option>
              <option value="1h">1 ساعة</option>
              <option value="4h">4 ساعات</option>
              <option value="1D">1 يوم</option>
              <option value="1W">1 أسبوع</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">فترة الاختبار (أيام):</label>
            <select
              value={periodDays}
              onChange={e => setPeriodDays(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 outline-none"
            >
              <option value={7}>آخر 7 أيام</option>
              <option value={14}>آخر 14 يوماً</option>
              <option value={30}>آخر 30 يوماً</option>
              <option value={60}>آخر 60 يوماً</option>
              <option value={90}>آخر 90 يوماً</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">رأس المال الافتراضي ($):</label>
            <input
              type="number"
              value={initialCapital}
              onChange={e => setInitialCapital(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">مخاطرة الصفقة (%):</label>
            <input
              type="number"
              step="0.5"
              value={riskPercentPerTrade}
              onChange={e => setRiskPercentPerTrade(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">مضاعف وقف الخسارة (ATR):</label>
            <input
              type="number"
              step="0.1"
              value={stopLossAtrMultiplier}
              onChange={e => setStopLossAtrMultiplier(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">مضاعف جني الأرباح (ATR):</label>
            <input
              type="number"
              step="0.1"
              value={takeProfitAtrMultiplier}
              onChange={e => setTakeProfitAtrMultiplier(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono outline-none"
            />
          </div>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block mb-1">صافي العائد ($)</span>
              <span className={`text-xl font-bold font-mono ${result.totalReturnDollar >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {result.totalReturnDollar >= 0 ? '+' : ''}${result.totalReturnDollar}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">({result.totalReturnPercent}%)</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block mb-1">نسبة النجاح (Win Rate)</span>
              <span className="text-xl font-bold font-mono text-emerald-400">{result.winRate}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{result.winningTrades} من {result.totalTrades} صفقات</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block mb-1">معامل الربحية (Profit Factor)</span>
              <span className="text-xl font-bold font-mono text-amber-400">{result.profitFactor}</span>
              <span className="text-[10px] text-emerald-300 block mt-0.5">ممتاز</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block mb-1">أقصى تراجع (Max Drawdown)</span>
              <span className="text-xl font-bold font-mono text-rose-400">{result.maxDrawdownPercent}%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">مخاطرة منضبطة</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block mb-1">أفضل صفقة ربحية</span>
              <span className="text-xl font-bold font-mono text-emerald-400">+${result.bestTradeDollar}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">XAU/USD Long</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-center">
              <span className="text-[11px] text-slate-400 block mb-1">أسوأ تراجع لصفقة</span>
              <span className="text-xl font-bold font-mono text-rose-400">${result.worstTradeDollar}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">انضباط وقف الخسارة</span>
            </div>
          </div>

          {/* Equity Curve Chart */}
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white">منحنى نمو رأس المال (Equity Curve)</h3>
              <span className="text-xs font-mono text-emerald-400">
                الرصيد النهائي: ${(result.config.initialCapital + result.totalReturnDollar).toLocaleString()}
              </span>
            </div>

            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={result.equityCurve} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" domain={['auto', 'auto']} orientation="right" tick={{ fontSize: 10 }} tickFormatter={(v: number) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <Area type="monotone" dataKey="equity" stroke="#10b981" strokeWidth={2} fill="url(#equityGrad)" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Trades Journal Table */}
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden shadow-lg space-y-3 p-4">
            <h3 className="text-sm font-bold text-white px-2">سجل الصفقات التفصيلي للمحاكاة</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold font-sans">
                    <th className="py-2.5 px-3">النوع</th>
                    <th className="py-2.5 px-3">وقت الدخول / الخروج</th>
                    <th className="py-2.5 px-3">سعر الدخول</th>
                    <th className="py-2.5 px-3">سعر الخروج</th>
                    <th className="py-2.5 px-3">الحجم (Lots)</th>
                    <th className="py-2.5 px-3">الربح / الخسارة ($)</th>
                    <th className="py-2.5 px-3">سبب الإغلاق</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {result.trades.map(t => (
                    <tr key={t.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                          {t.typeArabic}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">{t.entryTime} - {t.exitTime}</td>
                      <td className="py-2.5 px-3 text-white">${t.entryPrice.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-white">${t.exitPrice.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-slate-400">{t.sizeLots}</td>
                      <td className={`py-2.5 px-3 font-bold ${t.profitDollar >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {t.profitDollar >= 0 ? '+' : ''}${t.profitDollar} ({t.profitPercent}%)
                      </td>
                      <td className="py-2.5 px-3 font-sans text-slate-400">{t.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
