import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Bell,
  BellRing,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  ShieldAlert,
  ShieldCheck,
  Volume2,
  VolumeX,
  Sparkles,
  Radio,
  RefreshCw,
  Sliders,
  Share2,
  CheckCircle2,
  Layers,
  Zap,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Maximize2,
  Calendar,
  Newspaper,
  Check,
  Info,
  DollarSign,
} from 'lucide-react';
import {
  CurrentPriceData,
  SystemDecisionData,
  TechnicalIndicators,
  EconomicEvent,
  NewsItem,
  Timeframe,
  TradeAlert,
  AppNotificationItem,
  IPhoneTabType,
  OHLCVCandle,
} from '../types';

interface IPhoneMobileViewProps {
  currentPrice: CurrentPriceData;
  decisionData: SystemDecisionData;
  indicators: TechnicalIndicators | null;
  candles: OHLCVCandle[];
  selectedTimeframe: Timeframe;
  onSelectTimeframe: (tf: Timeframe) => void;
  economicEvents: EconomicEvent[];
  news: NewsItem[];
  activeAlert: TradeAlert | null;
  notifications: AppNotificationItem[];
  onDismissAlert: () => void;
  onTriggerTestAlert: (type: 'BUY' | 'SELL' | 'URGENT') => void;
  onForceReevaluate: () => void;
  isEvaluatingAlert: boolean;
  secondsUntilNextCheck: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isLiveActive: boolean;
  onToggleLive: () => void;
  liveIntervalMs: number;
  onChangeLiveInterval: (ms: number) => void;
  onOpenAiExplain: () => void;
  onOpenHowModal: () => void;
  onLogPrediction: () => void;
  isLoggingPrediction: boolean;
  logSuccess: boolean;
  onSwitchToFullView: () => void;
  onRequestNotificationPermission: () => void;
  hasNotificationPermission: boolean;
  onClearNotifications: () => void;
  onMarkNotificationAsRead: (id: string) => void;
}

export const IPhoneMobileView: React.FC<IPhoneMobileViewProps> = ({
  currentPrice,
  decisionData,
  indicators,
  candles,
  selectedTimeframe,
  onSelectTimeframe,
  economicEvents,
  news,
  activeAlert,
  notifications,
  onDismissAlert,
  onTriggerTestAlert,
  onForceReevaluate,
  isEvaluatingAlert,
  secondsUntilNextCheck,
  soundEnabled,
  onToggleSound,
  isLiveActive,
  onToggleLive,
  liveIntervalMs,
  onChangeLiveInterval,
  onOpenAiExplain,
  onOpenHowModal,
  onLogPrediction,
  isLoggingPrediction,
  logSuccess,
  onSwitchToFullView,
  onRequestNotificationPermission,
  hasNotificationPermission,
  onClearNotifications,
  onMarkNotificationAsRead,
}) => {
  const [activeTab, setActiveTab] = useState<IPhoneTabType>('forecast');
  const [notificationFilter, setNotificationFilter] = useState<'ALL' | 'SIGNAL' | 'NEWS' | 'LEVEL'>('ALL');
  const [showPwaGuide, setShowPwaGuide] = useState<boolean>(false);
  const [liveTime, setLiveTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTime(
        now.toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isBuy = decisionData.decisionType === 'BUY' || decisionData.decisionType === 'BUY_ON_DIP';
  const isSell = decisionData.decisionType === 'SELL';
  const isWait = decisionData.decisionType === 'WAIT' || decisionData.decisionType === 'NEUTRAL';

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const nearestEvent = economicEvents.find(e => e.minutesUntil > 0 && e.minutesUntil <= 1440);

  const filteredNotifications = notifications.filter(item => {
    if (notificationFilter === 'ALL') return true;
    if (notificationFilter === 'SIGNAL') return item.category === 'SIGNAL';
    if (notificationFilter === 'NEWS') return item.category === 'ECONOMIC_EVENT';
    if (notificationFilter === 'LEVEL') return item.category === 'PRICE_LEVEL';
    return true;
  });

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between pb-24 select-none relative font-['Cairo',sans-serif]">
      
      {/* 1. iOS Dynamic Island & App Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-900/80 px-4 pt-3 pb-2.5">
        {/* Dynamic Island Bar */}
        <div className="flex items-center justify-between gap-2 mb-2">
          {/* iOS Island Pill */}
          <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-full px-3 py-1 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isLiveActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`}></span>
              <span className="text-[11px] font-bold text-slate-200">XAU/USD</span>
              <span className="text-[10px] font-mono text-amber-400 font-bold">${currentPrice.currentPrice.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-1">
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                currentPrice.changePercent24h >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {currentPrice.changePercent24h >= 0 ? '+' : ''}{currentPrice.changePercent24h.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Switch to Full Screen Desktop Mode */}
          <button
            onClick={onSwitchToFullView}
            className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white p-2 rounded-full border border-slate-800 transition-colors cursor-pointer"
            title="التبديل إلى واجهة سطح المكتب الكاملة"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Secondary Status Line */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>المسح: <strong className="font-mono text-amber-400">{Math.floor(secondsUntilNextCheck / 60)}:{String(secondsUntilNextCheck % 60).padStart(2, '0')}</strong></span>
            </div>
            <span>•</span>
            <span className="font-mono text-slate-400">{liveTime}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className={`p-1 rounded-md transition-colors cursor-pointer ${soundEnabled ? 'text-amber-400' : 'text-slate-600'}`}
              title={soundEnabled ? 'كتم الصوت' : 'تفعيل صوت التنبيه'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Notification Permission status */}
            <button
              onClick={onRequestNotificationPermission}
              className={`p-1 rounded-md transition-colors cursor-pointer ${hasNotificationPermission ? 'text-emerald-400' : 'text-amber-500'}`}
              title={hasNotificationPermission ? 'إشعارات الهاتف مفعلة' : 'انقر لتفعيل إشعارات الآيفون'}
            >
              {hasNotificationPermission ? <BellRing className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5 animate-bounce" />}
            </button>

            {/* Live Toggle */}
            <button
              onClick={onToggleLive}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                isLiveActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isLiveActive ? 'LIVE' : 'متوقف'}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content Views */}
      <div className="flex-1 px-4 py-3 space-y-4">
        
        {/* Urgent Active Signal Banner if available */}
        {activeAlert && (
          <div
            id="iphone-active-alert-card"
            className={`p-3.5 rounded-2xl border shadow-xl relative overflow-hidden transition-all animate-pulse ${
              activeAlert.isUrgent
                ? 'bg-red-950/80 border-red-500 text-red-100'
                : activeAlert.action === 'BUY'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-100'
                : 'bg-rose-950/80 border-rose-500 text-rose-100'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${activeAlert.action === 'BUY' ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'}`}>
                  {activeAlert.action === 'BUY' ? <TrendingUp className="w-4 h-4 font-black" /> : <TrendingDown className="w-4 h-4 font-black" />}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black uppercase tracking-wide">
                      {activeAlert.action === 'BUY' ? 'إشارة شراء نشطة' : 'إشارة بيع نشطة'}
                    </span>
                    {activeAlert.isUrgent && (
                      <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                        <Flame className="w-2.5 h-2.5 fill-white" />
                        عاجل
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-medium opacity-90">{activeAlert.title}</p>
                </div>
              </div>

              <button
                onClick={onDismissAlert}
                className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded bg-slate-900/60"
              >
                إغلاق
              </button>
            </div>

            <div className="mt-2.5 grid grid-cols-3 gap-1.5 text-center font-mono text-[11px]">
              <div className="bg-slate-950/70 rounded-lg p-1.5">
                <span className="text-[9px] text-slate-400 block font-sans">الدخول</span>
                <span className="font-bold text-white">${activeAlert.price.toFixed(1)}</span>
              </div>
              <div className="bg-slate-950/70 rounded-lg p-1.5">
                <span className="text-[9px] text-slate-400 block font-sans">الهدف (TP)</span>
                <span className="font-bold text-emerald-400">${activeAlert.targetPrice.toFixed(1)}</span>
              </div>
              <div className="bg-slate-950/70 rounded-lg p-1.5">
                <span className="text-[9px] text-slate-400 block font-sans">الوقف (SL)</span>
                <span className="font-bold text-rose-400">${activeAlert.stopLoss.toFixed(1)}</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 1: FORECAST (التنبؤ السريع) ================= */}
        {activeTab === 'forecast' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* Timeframe Selector Pills (iOS Segmented Control) */}
            <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
              {(['15m', '1h', '4h', '1d'] as Timeframe[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => onSelectTimeframe(tf)}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-all cursor-pointer ${
                    selectedTimeframe === tf
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tf === '15m' ? '15 د' : tf === '1h' ? '1 ساعة' : tf === '4h' ? '4 ساعات' : 'يومي'}
                </button>
              ))}
            </div>

            {/* Main Decision Card */}
            <div className={`p-4 rounded-3xl border relative overflow-hidden shadow-2xl transition-all ${
              isBuy
                ? 'bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border-emerald-500/50 shadow-emerald-950/30'
                : isSell
                ? 'bg-gradient-to-br from-rose-950/60 via-slate-900 to-slate-950 border-rose-500/50 shadow-rose-950/30'
                : 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-slate-700 shadow-slate-950/50'
            }`}>
              {/* Top Decision Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2.5 rounded-2xl ${
                    isBuy ? 'bg-emerald-500 text-slate-950' : isSell ? 'bg-rose-500 text-white' : 'bg-slate-700 text-slate-200'
                  }`}>
                    {isBuy ? <TrendingUp className="w-6 h-6" /> : isSell ? <TrendingDown className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">توصية الذكاء الاصطناعي ({selectedTimeframe})</span>
                    <h2 className="text-xl font-black text-white">{decisionData.decision}</h2>
                  </div>
                </div>

                {/* Confidence Badge */}
                <div className="text-left bg-slate-950/80 px-2.5 py-1.5 rounded-2xl border border-slate-800">
                  <span className="text-[9px] text-slate-400 block font-sans">درجة الثقة</span>
                  <span className="text-sm font-black font-mono text-amber-400">{decisionData.confidenceScore}%</span>
                </div>
              </div>

              {/* Actionable Trade Levels Grid */}
              <div className="grid grid-cols-3 gap-2 text-center font-mono my-3">
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2">
                  <span className="text-[10px] text-slate-400 block font-sans">نطاق الدخول</span>
                  <span className="text-xs font-bold text-amber-400">
                    ${(currentPrice.currentPrice - 1.5).toFixed(1)} - ${currentPrice.currentPrice.toFixed(1)}
                  </span>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2">
                  <span className="text-[10px] text-slate-400 block font-sans">الهدف (TP)</span>
                  <span className="text-xs font-bold text-emerald-400">
                    ${(decisionData.supportResistance.r1 || currentPrice.currentPrice + 15).toFixed(1)}
                  </span>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2">
                  <span className="text-[10px] text-slate-400 block font-sans">وقف الخسارة (SL)</span>
                  <span className="text-xs font-bold text-rose-400">
                    ${(decisionData.supportResistance.s1 || currentPrice.currentPrice - 9).toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Simplified Why Explanation */}
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                {decisionData.whyExplanation}
              </p>

              {/* Quick AI & Plan Buttons */}
              <div className="mt-3.5 flex items-center gap-2">
                <button
                  onClick={onOpenAiExplain}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>تحليل الذكاء الاصطناعي</span>
                </button>

                <button
                  onClick={onLogPrediction}
                  disabled={isLoggingPrediction || logSuccess}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                    logSuccess
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 active:scale-95'
                  }`}
                >
                  {logSuccess ? <Check className="w-3.5 h-3.5" /> : <Target className="w-3.5 h-3.5" />}
                  <span>{logSuccess ? 'تم الحفظ' : 'تثبيت التوقع'}</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics 2x2 Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3">
                <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                  <span>مستوى المخاطرة</span>
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-base font-black text-white font-mono">
                  {decisionData.riskScore}<span className="text-xs text-slate-500 font-sans">/100 ({decisionData.riskLevelArabic})</span>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3">
                <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                  <span>قوة الاتجاه العام</span>
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-base font-black text-white font-mono">
                  {decisionData.trendStrength}<span className="text-xs text-slate-500 font-sans">% ({decisionData.trend})</span>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3">
                <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                  <span>أعلى سعر اليوم (High)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-sm font-black text-emerald-400 font-mono">
                  ${currentPrice.high24h.toFixed(2)}
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3">
                <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                  <span>أدنى سعر اليوم (Low)</span>
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                </div>
                <div className="text-sm font-black text-rose-400 font-mono">
                  ${currentPrice.low24h.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Upcoming Next Economic Event Card */}
            {nearestEvent && (
              <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                    <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white">{nearestEvent.name}</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1 rounded font-mono">
                        بعد {Math.floor(nearestEvent.minutesUntil / 60)} س {nearestEvent.minutesUntil % 60} د
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">تأثير متوقع عالي على تقلبات سعر الذهب</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= VIEW 2: SIGNALS (الإشارات والتوصيات) ================= */}
        {activeTab === 'signals' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <h3 className="font-bold text-sm text-white">المراقب التلقائي للإشارات</h3>
                </div>
                <button
                  onClick={onForceReevaluate}
                  disabled={isEvaluatingAlert}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isEvaluatingAlert ? 'animate-spin' : ''}`} />
                  <span>فحص الآن</span>
                </button>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                يقوم النظام بإجراء مسح خوارزمي شامل كل 10 دقائق لتوليد إشارات الدخول مع تحديد الأهداف ووقف الخسارة بدقة.
              </p>
              <div className="mt-3 flex items-center justify-between text-xs font-mono bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-sans">المسح القادم بعد:</span>
                <span className="text-amber-400 font-bold">
                  {Math.floor(secondsUntilNextCheck / 60)} دقيقة و {secondsUntilNextCheck % 60} ثانية
                </span>
              </div>
            </div>

            {/* Test Simulation Buttons for Instant verification */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3">
              <span className="text-[11px] text-slate-400 font-bold block mb-2">اختبار الإشارات الفورية والتنبيهات:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onTriggerTestAlert('BUY')}
                  className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>إشارة شراء</span>
                </button>

                <button
                  onClick={() => onTriggerTestAlert('SELL')}
                  className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
                >
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>إشارة بيع</span>
                </button>

                <button
                  onClick={() => onTriggerTestAlert('URGENT')}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>تنبيه عاجل</span>
                </button>
              </div>
            </div>

            {/* Timeframe Forecast Summary Matrix */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">توقعات الفترات الزمنية المختلفة:</span>
              {decisionData.forecasts.map((f) => (
                <div key={f.timeframe} className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400 w-12">{f.timeframe}</span>
                    <span className="font-bold text-white">{f.directionArabic}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400">${f.targetPrice.toFixed(1)}</span>
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-amber-300 font-bold">{f.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= VIEW 3: NOTIFICATIONS (مركز الإشعارات والتحديثات) ================= */}
        {activeTab === 'notifications' && (
          <div className="space-y-3.5 animate-fadeIn">
            {/* Header & Filter Controls */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <BellRing className="w-4 h-4 text-amber-400" />
                  <span>مركز إشعارات الآيفون</span>
                </h3>
                <p className="text-[11px] text-slate-400">تحديثات لحظية لتضمن عدم تفويت أي فرصة</p>
              </div>

              {notifications.length > 0 && (
                <button
                  onClick={onClearNotifications}
                  className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors"
                >
                  مسح السجل
                </button>
              )}
            </div>

            {/* Notification Permission Banner if not granted */}
            {!hasNotificationPermission && (
              <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/30 rounded-2xl p-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
                  <span className="text-xs text-amber-200 font-medium">تفعيل إشعارات الهاتف لضمان وصول التنبيهات الفورية</span>
                </div>
                <button
                  onClick={onRequestNotificationPermission}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-xl shrink-0 cursor-pointer shadow"
                >
                  تفعيل الآن
                </button>
              </div>
            )}

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1">
              {[
                { id: 'ALL', label: 'الكل' },
                { id: 'SIGNAL', label: 'إشارات الصفقات' },
                { id: 'NEWS', label: 'أخبار وأحداث' },
                { id: 'LEVEL', label: 'كسر المستويات' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setNotificationFilter(filter.id as any)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    notificationFilter === filter.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Notification Stream List */}
            <div className="space-y-2">
              {filteredNotifications.length === 0 ? (
                <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-8 text-center text-slate-400 space-y-2">
                  <Bell className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs font-bold">لا توجد إشعارات جديدة حالياً</p>
                  <p className="text-[11px] text-slate-500">سيتم إشعارك فور حدوث أي فرصة شراء/بيع أو كسر لمستويات الذهب.</p>
                </div>
              ) : (
                filteredNotifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => onMarkNotificationAsRead(n.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      n.isRead
                        ? 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                        : 'bg-slate-900 border-amber-500/40 shadow-lg text-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg text-xs ${
                          n.priority === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-400'
                            : n.actionType === 'BUY'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : n.actionType === 'SELL'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {n.priority === 'CRITICAL' ? (
                            <AlertTriangle className="w-3.5 h-3.5" />
                          ) : n.actionType === 'BUY' ? (
                            <TrendingUp className="w-3.5 h-3.5" />
                          ) : n.actionType === 'SELL' ? (
                            <TrendingDown className="w-3.5 h-3.5" />
                          ) : (
                            <Zap className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">{n.title}</h4>
                          <span className="text-[10px] text-slate-500 font-mono">{n.timeFormatted}</span>
                        </div>
                      </div>

                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1"></span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                      {n.message}
                    </p>

                    {n.targetPrice && n.stopLoss && (
                      <div className="mt-2 flex items-center gap-3 text-[10px] font-mono text-slate-400 pt-1.5 border-t border-slate-800/60">
                        <span>الهدف: <strong className="text-emerald-400">${n.targetPrice.toFixed(1)}</strong></span>
                        <span>الوقف: <strong className="text-rose-400">${n.stopLoss.toFixed(1)}</strong></span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= VIEW 4: LEVELS & NEWS (المستويات والأخبار) ================= */}
        {activeTab === 'levels' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Key Support & Resistance Levels */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5">
              <h3 className="font-bold text-xs text-slate-300 mb-2.5 flex items-center justify-between">
                <span>المستويات الفنية المحورية للذهب</span>
                <span className="text-[10px] font-mono text-amber-400">السعر: ${currentPrice.currentPrice.toFixed(2)}</span>
              </h3>

              <div className="space-y-1.5 font-mono text-xs">
                {/* Resistance 2 */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-rose-950/30 border border-rose-900/30 text-rose-300">
                  <span className="font-sans text-[11px]">مقاومة قوية (R2)</span>
                  <span className="font-bold">${decisionData.supportResistance.r2.toFixed(2)}</span>
                </div>
                {/* Resistance 1 */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300">
                  <span className="font-sans text-[11px]">مقاومة أولى (R1)</span>
                  <span className="font-bold">${decisionData.supportResistance.r1.toFixed(2)}</span>
                </div>
                {/* Current Price Reference */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                  <span className="font-sans text-[11px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                    السعر الحالي
                  </span>
                  <span>${currentPrice.currentPrice.toFixed(2)}</span>
                </div>
                {/* Support 1 */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-300">
                  <span className="font-sans text-[11px]">دعم أول (S1)</span>
                  <span className="font-bold">${decisionData.supportResistance.s1.toFixed(2)}</span>
                </div>
                {/* Support 2 */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-950/30 border border-emerald-900/30 text-emerald-300">
                  <span className="font-sans text-[11px]">دعم قوي (S2)</span>
                  <span className="font-bold">${decisionData.supportResistance.s2.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Flash Gold News */}
            <div className="space-y-2">
              <h3 className="font-bold text-xs text-slate-300 flex items-center gap-1.5">
                <Newspaper className="w-3.5 h-3.5 text-amber-400" />
                <span>أحدث أخبار الذهب والمحركات</span>
              </h3>

              {news.slice(0, 4).map((item) => (
                <div key={item.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-mono">{item.time}</span>
                    <span className={`px-1.5 py-0.2 rounded-full font-bold ${
                      item.impact === 'BULLISH'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : item.impact === 'BEARISH'
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.impactArabic}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-snug">{item.title}</h4>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= VIEW 5: SETTINGS & PWA GUIDE (إعدادات الآيفون) ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Install on iPhone PWA Banner */}
            <div className="bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-950 border border-amber-500/40 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">تثبيت التطبيق على شاشة الآيفون</h3>
                  <p className="text-[11px] text-amber-300">للحصول على تجربة التطبيق الأصلي وسرعة فائقة</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-mono font-bold text-[11px]">1</span>
                  <span>اضغط على زر المشاركة (Share) في أسفل متصفح Safari.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-mono font-bold text-[11px]">2</span>
                  <span>اختر <strong>«إضافة إلى الشاشة الرئيسية» (Add to Home Screen)</strong>.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-mono font-bold text-[11px]">3</span>
                  <span>سيظهر التطبيق كأيقونة مستقلة تعمل بملء الشاشة مع التنبيهات الفورية!</span>
                </div>
              </div>
            </div>

            {/* Live Update Rate Controls */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                <span>معدل تحديث الأسعار اللحظية</span>
              </h4>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                {[
                  { ms: 1000, label: '1 ثانية (سريع جداً)' },
                  { ms: 2000, label: '2 ثانية (افتراضي)' },
                  { ms: 5000, label: '5 ثواني (اقتصادي)' },
                ].map((speed) => (
                  <button
                    key={speed.ms}
                    onClick={() => onChangeLiveInterval(speed.ms)}
                    className={`py-2 px-1 rounded-xl text-center font-bold transition-all cursor-pointer ${
                      liveIntervalMs === speed.ms
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {speed.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound & Notifications Toggles */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">التنبيهات الصوتية</span>
                  <span className="text-[11px] text-slate-400">تشغيل نغمات موسيقية عند ظهور إشارات شراء أو بيع</span>
                </div>
                <button
                  onClick={onToggleSound}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${soundEnabled ? 'bg-amber-500' : 'bg-slate-800'}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${soundEnabled ? 'left-1' : 'right-1'}`}></span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div>
                  <span className="font-bold text-white block">إشعارات النظام (Web Push)</span>
                  <span className="text-[11px] text-slate-400">إشعارك حتى لو كان الهاتف مقفلاً أو في تطبيق آخر</span>
                </div>
                <button
                  onClick={onRequestNotificationPermission}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    hasNotificationPermission ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500 text-slate-950'
                  }`}
                >
                  {hasNotificationPermission ? 'مفعل' : 'تفعيل'}
                </button>
              </div>
            </div>

            {/* Return to Full Desktop Mode Button */}
            <button
              onClick={onSwitchToFullView}
              className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>التبديل إلى لوحة التحكم الكاملة (Desktop View)</span>
            </button>
          </div>
        )}

      </div>

      {/* 3. Native iOS Bottom Navigation Bar (Fixed Safe-Area Footer) */}
      <nav
        id="iphone-bottom-nav-bar"
        className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/80 px-2 py-1.5 pb-safe max-w-md mx-auto"
      >
        <div className="flex items-center justify-around text-[10px] font-medium">
          
          {/* Tab 1: Forecast */}
          <button
            onClick={() => setActiveTab('forecast')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'forecast' ? 'text-amber-400 font-bold scale-105' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span>التنبؤ</span>
          </button>

          {/* Tab 2: Signals */}
          <button
            onClick={() => setActiveTab('signals')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all cursor-pointer relative ${
              activeTab === 'signals' ? 'text-amber-400 font-bold scale-105' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Target className="w-5 h-5" />
            <span>الإشارات</span>
            {activeAlert && (
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1 right-2 animate-ping"></span>
            )}
          </button>

          {/* Tab 3: Notifications */}
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all cursor-pointer relative ${
              activeTab === 'notifications' ? 'text-amber-400 font-bold scale-105' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Bell className="w-5 h-5" />
            <span>الإشعارات</span>
            {unreadCount > 0 && (
              <span className="min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center absolute top-0.5 right-1">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Tab 4: Levels & News */}
          <button
            onClick={() => setActiveTab('levels')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'levels' ? 'text-amber-400 font-bold scale-105' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span>المستويات</span>
          </button>

          {/* Tab 5: Settings */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'settings' ? 'text-amber-400 font-bold scale-105' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Sliders className="w-5 h-5" />
            <span>الإعدادات</span>
          </button>

        </div>
      </nav>

    </div>
  );
};
