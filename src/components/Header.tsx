import React from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Calendar,
  Compass,
  Cpu,
  Flame,
  History,
  Layers,
  Radio,
  RefreshCw,
  Sliders,
  Smartphone,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import { CurrentPriceData, TradeAlert } from '../types';

interface HeaderProps {
  currentPrice: CurrentPriceData | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenAiExplain: () => void;
  upcomingAlertCount: number;
  activeAlert?: TradeAlert | null;
  secondsUntilNextCheck?: number;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onTriggerTestAlert?: (type: 'BUY' | 'SELL' | 'URGENT') => void;
  liveIntervalMs?: number;
  onChangeLiveInterval?: (ms: number) => void;
  isLiveActive?: boolean;
  onToggleLive?: () => void;
  lastTickTimestamp?: number;
  isIPhoneMode?: boolean;
  onToggleIPhoneMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPrice,
  activeTab,
  setActiveTab,
  onRefresh,
  isRefreshing,
  onOpenAiExplain,
  upcomingAlertCount,
  activeAlert,
  secondsUntilNextCheck = 600,
  soundEnabled = true,
  onToggleSound,
  onTriggerTestAlert,
  liveIntervalMs = 1500,
  onChangeLiveInterval,
  isLiveActive = true,
  onToggleLive,
  lastTickTimestamp,
  isIPhoneMode = false,
  onToggleIPhoneMode,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'لوحة التنبؤ الرئيسية', icon: BarChart3 },
    { id: 'deep-analysis', label: 'التحليل الشامل', icon: Compass },
    { id: 'economic-calendar', label: 'التقويم الاقتصادي', icon: Calendar, badge: upcomingAlertCount > 0 ? upcomingAlertCount : undefined },
    { id: 'prediction-history', label: 'سجل التوقعات', icon: History },
    { id: 'performance', label: 'أداء ودقة النظام', icon: Activity },
    { id: 'backtest', label: 'محاكي Backtesting', icon: Layers },
    { id: 'providers', label: 'مصادر البيانات و MT5', icon: Cpu },
    { id: 'settings', label: 'الإعدادات والأوزان', icon: Sliders },
  ];

  return (
    <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
      {/* Top Ticker Bar */}
      <div className="border-b border-slate-800/80 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 bg-slate-950/60">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-medium text-amber-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>الأصل النشط: XAU/USD (الذهب مقابل الدولار الأمريكي)</span>
          </div>
          {currentPrice && (
            <div className="hidden sm:flex items-center gap-3 text-slate-300 font-mono">
              <span>السعر: <strong className="text-white">${currentPrice.currentPrice.toFixed(2)}</strong></span>
              <span>السبريد: <strong className="text-slate-400">${currentPrice.spread.toFixed(2)}</strong></span>
              <span>
                التغير:
                <strong className={currentPrice.dailyChange >= 0 ? 'text-emerald-400 mr-1' : 'text-rose-400 mr-1'}>
                  {currentPrice.dailyChange >= 0 ? '+' : ''}{currentPrice.dailyChange.toFixed(2)} ({currentPrice.dailyChangePercent >= 0 ? '+' : ''}{currentPrice.dailyChangePercent}%)
                </strong>
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Streaming Indicator & Speed Controls */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full text-[11px]">
            <button
              onClick={onToggleLive}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full transition-all cursor-pointer ${
                isLiveActive ? 'text-emerald-400 bg-emerald-500/10 font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
              title={isLiveActive ? 'البث اللحظي نشط (انقر للإيقاف المؤقت)' : 'البث اللحظي متوقف (انقر للاستئناف)'}
            >
              <span className={`w-2 h-2 rounded-full ${isLiveActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`}></span>
              <span>{isLiveActive ? 'LIVE بث مباشر' : 'متوقف مؤقتاً'}</span>
            </button>

            {/* Speed pills */}
            {onChangeLiveInterval && isLiveActive && (
              <div className="hidden sm:flex items-center border-r border-slate-800 pr-1.5 mr-1 gap-1 text-[10px] font-mono">
                <button
                  onClick={() => onChangeLiveInterval(1000)}
                  className={`px-1.5 py-0.2 rounded cursor-pointer ${liveIntervalMs === 1000 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                  title="تحديث كل ثانية"
                >
                  1s
                </button>
                <button
                  onClick={() => onChangeLiveInterval(2000)}
                  className={`px-1.5 py-0.2 rounded cursor-pointer ${liveIntervalMs === 2000 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                  title="تحديث كل ثانيتين"
                >
                  2s
                </button>
                <button
                  onClick={() => onChangeLiveInterval(5000)}
                  className={`px-1.5 py-0.2 rounded cursor-pointer ${liveIntervalMs === 5000 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                  title="تحديث كل 5 ثواني"
                >
                  5s
                </button>
              </div>
            )}
          </div>

          {/* 10-Min Periodic Scanner Status */}
          <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full text-[11px]">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="text-slate-400">المسح الدوري:</span>
            <span className="font-mono font-bold text-amber-400">
              {Math.floor(secondsUntilNextCheck / 60)}:{String(secondsUntilNextCheck % 60).padStart(2, '0')}
            </span>
          </div>

          {/* Audio Chime Toggle */}
          {onToggleSound && (
            <button
              onClick={onToggleSound}
              className={`p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors text-xs flex items-center gap-1 ${
                soundEnabled ? 'text-amber-400' : 'text-slate-500'
              }`}
              title={soundEnabled ? 'صوت التنبيهات مفعّل' : 'صوت التنبيهات مكتوم'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          )}

          <div className="hidden lg:flex items-center gap-1.5 text-slate-300 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{currentPrice?.connectionStatusArabic || 'البيانات محدثة'}</span>
          </div>

          <button
            id="header-refresh-button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded text-xs cursor-pointer"
            title="تحديث البيانات الفورية يدوياً"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            <span>تحديث</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & System Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/40">
              <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  التنبؤ الذكي بالذهب
                </h1>
                <span className="text-[10px] font-semibold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded">
                  AI Gold Predictor
                </span>
              </div>
              <p className="text-xs text-slate-400">محرك التحليل الفني والأساسي والتنبؤ المركزي لـ XAU/USD</p>
            </div>
          </div>

          {/* Actions & iPhone Mode Switch */}
          <div className="flex items-center gap-2">
            {onToggleIPhoneMode && (
              <button
                id="header-toggle-iphone-mode-btn"
                onClick={onToggleIPhoneMode}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold px-3 py-2 rounded-lg text-xs transition-all transform active:scale-95 cursor-pointer"
                title="تفعيل واجهة الآيفون المبسطة والمحمولة"
              >
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>واجهة الآيفون</span>
              </button>
            )}

            <button
              id="header-ai-explain-button"
              onClick={onOpenAiExplain}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3.5 py-2 rounded-lg text-xs shadow-md shadow-amber-500/25 transition-all transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline">تقرير الذكاء الاصطناعي الشامل</span>
              <span className="sm:hidden">تقرير AI</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Scrollable on Mobile) */}
        <nav className="flex space-x-1 space-x-reverse overflow-x-auto no-scrollbar pb-2.5 pt-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
