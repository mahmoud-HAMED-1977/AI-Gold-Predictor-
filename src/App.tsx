import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Calendar,
  Compass,
  Cpu,
  History,
  Layers,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import { AiExplanationModal } from './components/AiExplanationModal';
import { BacktestView } from './components/BacktestView';
import { CurrentPriceCard } from './components/CurrentPriceCard';
import { CurrentTrendCard } from './components/CurrentTrendCard';
import { DataProvidersAndMT5View } from './components/DataProvidersAndMT5View';
import { DeepAnalysisView } from './components/DeepAnalysisView';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { EconomicCalendarView } from './components/EconomicCalendarView';
import { FlickerSignalPopup } from './components/FlickerSignalPopup';
import { GoldRiskMeter } from './components/GoldRiskMeter';
import { Header } from './components/Header';
import { HowDecisionReachedModal } from './components/HowDecisionReachedModal';
import { IPhoneMobileView } from './components/IPhoneMobileView';
import { MarketSummaryBanner } from './components/MarketSummaryBanner';
import { MultiTimeframeForecast } from './components/MultiTimeframeForecast';
import { PerformanceView } from './components/PerformanceView';
import { PredictionHistoryView } from './components/PredictionHistoryView';
import { PriceChart } from './components/PriceChart';
import { ScenariosCard } from './components/ScenariosCard';
import { SettingsView } from './components/SettingsView';
import { SmartDecisionCard } from './components/SmartDecisionCard';
import { SupportResistanceCard } from './components/SupportResistanceCard';
import {
  AccuracyPerformanceMetrics,
  AppNotificationItem,
  BacktestConfig,
  BacktestResult,
  CurrentPriceData,
  DataProviderInfo,
  EconomicEvent,
  GoldFundamentals,
  MT5BridgeConfig,
  NewsItem,
  OHLCVCandle,
  PredictionRecord,
  SystemDecisionData,
  SystemSettings,
  TechnicalIndicators,
  Timeframe,
  TradeAlert,
} from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1h');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Core Data States
  const [currentPrice, setCurrentPrice] = useState<CurrentPriceData | null>(null);
  const [candles, setCandles] = useState<OHLCVCandle[]>([]);
  const [indicators, setIndicators] = useState<TechnicalIndicators | null>(null);
  const [decisionData, setDecisionData] = useState<SystemDecisionData | null>(null);
  const [economicEvents, setEconomicEvents] = useState<EconomicEvent[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [fundamentals, setFundamentals] = useState<GoldFundamentals | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<PredictionRecord[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<AccuracyPerformanceMetrics | null>(null);
  const [dataProviders, setDataProviders] = useState<DataProviderInfo[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  // Backtest State
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);
  const [isBacktestRunning, setIsBacktestRunning] = useState<boolean>(false);

  // Prediction Logging State
  const [isLoggingPrediction, setIsLoggingPrediction] = useState<boolean>(false);
  const [logSuccess, setLogSuccess] = useState<boolean>(false);

  // Modals
  const [isHowModalOpen, setIsHowModalOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiExplanationText, setAiExplanationText] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Real-time Live Engine State
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);
  const [liveIntervalMs, setLiveIntervalMs] = useState<number>(1500);
  const [lastTickTimestamp, setLastTickTimestamp] = useState<number>(Date.now());

  // 10-Minute Periodic Scanner State
  const [activeAlert, setActiveAlert] = useState<TradeAlert | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [secondsUntilNextCheck, setSecondsUntilNextCheck] = useState<number>(600); // 10 minutes default
  const [snoozeUntil, setSnoozeUntil] = useState<number>(0);
  const [isEvaluatingAlert, setIsEvaluatingAlert] = useState<boolean>(false);

  // iPhone / Mobile Mode State
  const [isIPhoneMode, setIsIPhoneMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gold_app_is_iphone');
      if (saved !== null) return saved === 'true';
      return window.innerWidth <= 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    }
    return false;
  });

  const handleToggleIPhoneMode = () => {
    setIsIPhoneMode(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('gold_app_is_iphone', String(next));
      }
      return next;
    });
  };

  // Web Notification Permission State
  const [hasNotificationPermission, setHasNotificationPermission] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission === 'granted';
    }
    return false;
  });

  const handleRequestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setHasNotificationPermission(perm === 'granted');
        if (perm === 'granted') {
          new Notification('تم تفعيل إشعارات الذهب الفورية بنجاح! 🔔', {
            body: 'ستصلك كافة إشارات الشراء والبيع وتحديثات المستويات لحظة بلحظة.',
            icon: '/favicon.ico',
          });
        }
      } catch (e) {
        console.warn('Error requesting notifications:', e);
      }
    }
  };

  // Live Notifications Stream State
  const [notifications, setNotifications] = useState<AppNotificationItem[]>(() => {
    const now = Date.now();
    return [
      {
        id: 'notif-initial-1',
        category: 'SIGNAL',
        title: 'إشارة شراء نشطة: XAU/USD',
        message: 'ارتداد إيجابي من مستوى دعم 2510.00 مع ضعف في مؤشر الدولار DXY.',
        timestamp: now - 120000,
        timeFormatted: new Date(now - 120000).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
        priority: 'HIGH',
        actionType: 'BUY',
        price: 2518.40,
        targetPrice: 2535.00,
        stopLoss: 2508.50,
      },
      {
        id: 'notif-initial-2',
        category: 'PRICE_LEVEL',
        title: 'اختراق مستوى مقاومة 2515.00',
        message: 'تجاوز السعر حاجز 2515 بنجاح، مما يعزز استمرار الزخم الصاعد نحو 2530.',
        timestamp: now - 600000,
        timeFormatted: new Date(now - 600000).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
        priority: 'NORMAL',
        price: 2516.20,
      },
      {
        id: 'notif-initial-3',
        category: 'ECONOMIC_EVENT',
        title: 'تنبيه حدث اقتصادي هام: مؤشر التضخم الأمريكي CPI',
        message: 'صدور بيانات مؤشر أسعار المستهلكين خلال ساعتين. تقلبات متوقعة قوية على الذهب.',
        timestamp: now - 1800000,
        timeFormatted: new Date(now - 1800000).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        isRead: true,
        priority: 'CRITICAL',
      },
    ];
  });

  const addNotificationItem = (notif: Omit<AppNotificationItem, 'id' | 'timestamp' | 'timeFormatted' | 'isRead'>) => {
    const now = Date.now();
    const newNotif: AppNotificationItem = {
      ...notif,
      id: `notif-${now}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: now,
      timeFormatted: new Date(now).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      isRead: false,
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 49)]);

    // Trigger Native Browser / Phone Push Notification if permission is granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(newNotif.title, {
          body: newNotif.message + (newNotif.targetPrice ? ` | الهدف: $${newNotif.targetPrice.toFixed(1)}` : ''),
          icon: '/favicon.ico',
        });
      } catch (e) {
        console.warn('Native notification trigger error:', e);
      }
    }
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // Signal Evaluation and Alert Generator
  const evaluateSignalsAndTriggerAlert = (
    currentDecision: SystemDecisionData | null = decisionData,
    currentPriceObj: CurrentPriceData | null = currentPrice,
    forcedType?: 'BUY' | 'SELL' | 'URGENT'
  ) => {
    if (!currentPriceObj) return;

    // Handle Manual Simulation / Test Alerts
    if (forcedType === 'BUY') {
      const buyAlert: TradeAlert = {
        id: `buy-alert-${Date.now()}`,
        type: 'BUY',
        action: 'BUY',
        isUrgent: false,
        title: 'فرصة شراء جيدة للذهب (XAU/USD)',
        subtitle: `الذهب مقابل الدولار | الفترة: ${selectedTimeframe}`,
        message: 'السعر بدأ يرتد للأعلى من مستوى دعم ممتاز، والدولار ضعيف مما يعطي الذهب فرصة قوية للصعود.',
        price: currentPriceObj.currentPrice,
        entryZone: `$${(currentPriceObj.currentPrice - 2).toFixed(2)} - $${currentPriceObj.currentPrice.toFixed(2)}`,
        targetPrice: currentPriceObj.currentPrice + 16.5,
        targetPrice2: currentPriceObj.currentPrice + 32.0,
        stopLoss: currentPriceObj.currentPrice - 9.5,
        riskReward: '1:2.4',
        timestamp: Date.now(),
        timeFormatted: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        expiresInSeconds: 600,
        indicatorsSummary: 'حركة السعر إيجابية | المشترين أقوى من البائعين',
        confidenceScore: 86,
        riskScore: 32,
        assetName: 'XAU/USD',
        timeframe: selectedTimeframe,
      };
      setActiveAlert(buyAlert);
      addNotificationItem({
        category: 'SIGNAL',
        title: buyAlert.title,
        message: buyAlert.message,
        priority: 'HIGH',
        actionType: 'BUY',
        price: buyAlert.price,
        targetPrice: buyAlert.targetPrice,
        stopLoss: buyAlert.stopLoss,
      });
      return;
    }

    if (forcedType === 'SELL') {
      const sellAlert: TradeAlert = {
        id: `sell-alert-${Date.now()}`,
        type: 'SELL',
        action: 'SELL',
        isUrgent: false,
        title: 'إشارة بيع أو جني أرباح على الذهب (XAU/USD)',
        subtitle: `الذهب مقابل الدولار | الفترة: ${selectedTimeframe}`,
        message: 'السعر وصل إلى حاجز مقاومة مرتفع وصعب اختراقه حالياً، ننصح بالبيع أو إغلاق جزء من الصفقات الرابحة.',
        price: currentPriceObj.currentPrice,
        entryZone: `$${currentPriceObj.currentPrice.toFixed(2)} - $${(currentPriceObj.currentPrice + 2).toFixed(2)}`,
        targetPrice: currentPriceObj.currentPrice - 18.0,
        targetPrice2: currentPriceObj.currentPrice - 34.0,
        stopLoss: currentPriceObj.currentPrice + 11.0,
        riskReward: '1:2.2',
        timestamp: Date.now(),
        timeFormatted: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        expiresInSeconds: 600,
        indicatorsSummary: 'السعر تشبع بالشراء | احتمالية هبوط تصحيحي',
        confidenceScore: 82,
        riskScore: 48,
        assetName: 'XAU/USD',
        timeframe: selectedTimeframe,
      };
      setActiveAlert(sellAlert);
      addNotificationItem({
        category: 'SIGNAL',
        title: sellAlert.title,
        message: sellAlert.message,
        priority: 'HIGH',
        actionType: 'SELL',
        price: sellAlert.price,
        targetPrice: sellAlert.targetPrice,
        stopLoss: sellAlert.stopLoss,
      });
      return;
    }

    if (forcedType === 'URGENT') {
      const urgentAlert: TradeAlert = {
        id: `urgent-alert-${Date.now()}`,
        type: 'SELL',
        action: 'SELL',
        isUrgent: true,
        title: '🚨 تنبيه عاجل ولحظي: اخرج أو خفف صفقاتك فوراً لحماية حسابك!',
        subtitle: 'تنبيه سريع عالي الأهمية',
        message: 'حدث هبوط مفاجئ وكسر السعر مستوى الأمان، تحرك فوراً ولا تنتظر لتتجنب أي خسارة إضافية.',
        price: currentPriceObj.currentPrice,
        entryZone: `$${currentPriceObj.currentPrice.toFixed(2)}`,
        targetPrice: currentPriceObj.currentPrice - 25.0,
        stopLoss: currentPriceObj.currentPrice + 8.5,
        riskReward: '1:3.0',
        urgencyReason: 'السعر كسر خط الأمان بسرعة وكميات البيع في السوق زادت فجأة، الخروج الآن هو القرار الأسلم.',
        timestamp: Date.now(),
        timeFormatted: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        expiresInSeconds: 300,
        indicatorsSummary: 'تنبيه هبوط سريع | نسبة الخطر: 85/100',
        confidenceScore: 92,
        riskScore: 85,
        assetName: 'XAU/USD',
        timeframe: selectedTimeframe,
      };
      setActiveAlert(urgentAlert);
      addNotificationItem({
        category: 'SIGNAL',
        title: urgentAlert.title,
        message: urgentAlert.urgencyReason || urgentAlert.message,
        priority: 'CRITICAL',
        actionType: 'SELL',
        price: urgentAlert.price,
        targetPrice: urgentAlert.targetPrice,
        stopLoss: urgentAlert.stopLoss,
      });
      return;
    }

    // Standard Periodic Check
    if (!currentDecision) return;
    if (Date.now() < snoozeUntil) return;

    const isBuy = currentDecision.decisionType === 'BUY' || currentDecision.decisionType === 'BUY_ON_DIP';
    const isSell = currentDecision.decisionType === 'SELL' || currentDecision.decisionType === 'TAKE_PROFIT';

    if (!isBuy && !isSell) return;

    // Check for critical urgency triggers
    const isUrgent =
      currentDecision.riskScore >= 68 ||
      currentDecision.confidenceScore >= 90 ||
      currentDecision.whyExplanation.includes('كسر') ||
      currentDecision.whyExplanation.includes('فوري');

    const sr = currentDecision.supportResistance;
    const price = currentPriceObj.currentPrice;

    const targetPrice = isBuy
      ? (sr?.resistance1 || price + 15)
      : (sr?.support1 || price - 15);

    const stopLoss = isBuy
      ? (sr?.support1 || price - 10)
      : (sr?.resistance1 || price + 10);

    const alertTitle = isUrgent
      ? (isBuy ? '🚨 قرار شراء مستعجل ولحظي: اختراق صاعد حاسم' : '🚨 قرار بيع مستعجل ولحظي: كسر دعم محوري وخروج')
      : (isBuy
          ? (currentDecision.decision === 'شراء' ? 'فرصة شراء مواتية على الذهب XAU/USD' : 'فرصة شراء وتجميع عند التصحيح')
          : (currentDecision.decision === 'بيع' ? 'إشارة بيع وتخفيف مراكز على الذهب' : 'إشارة جني أرباح عند مستويات المقاومة'));

    const newAlert: TradeAlert = {
      id: `auto-alert-${Date.now()}`,
      type: currentDecision.decisionType as any,
      action: isBuy ? 'BUY' : 'SELL',
      isUrgent,
      title: alertTitle,
      subtitle: `الذهب XAU/USD | الإطار: ${selectedTimeframe}`,
      message: currentDecision.whyExplanation,
      price,
      entryZone: sr?.potentialBuyZone || `$${(price - 2).toFixed(2)} - $${price.toFixed(2)}`,
      targetPrice,
      stopLoss,
      riskReward: '1:2.3',
      urgencyReason: isUrgent
        ? 'تحرك سعري حاد مع تسارع زخم السيولة يتطلب رد فعل فوري ومباشر لحفظ المكاسب وتجنب التقلبات.'
        : undefined,
      timestamp: Date.now(),
      timeFormatted: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      expiresInSeconds: 600,
      indicatorsSummary: `الثقة: ${currentDecision.confidenceScore}% | المخاطرة: ${currentDecision.riskScore}/100`,
      confidenceScore: currentDecision.confidenceScore,
      riskScore: currentDecision.riskScore,
      assetName: 'XAU/USD',
      timeframe: selectedTimeframe,
    };

    setActiveAlert(newAlert);
    addNotificationItem({
      category: 'SIGNAL',
      title: newAlert.title,
      message: newAlert.message,
      priority: isUrgent ? 'CRITICAL' : 'HIGH',
      actionType: isBuy ? 'BUY' : 'SELL',
      price: newAlert.price,
      targetPrice: newAlert.targetPrice,
      stopLoss: newAlert.stopLoss,
    });
  };

  // 10-Minute Periodic Auto-Scanning Timer Loop
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsUntilNextCheck(prev => {
        if (prev <= 1) {
          // Re-evaluate on 10-minute tick
          evaluateSignalsAndTriggerAlert();
          const nextIntervalSeconds = (settings?.popupIntervalMinutes ?? 10) * 60;
          return nextIntervalSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [decisionData, currentPrice, settings, snoozeUntil, selectedTimeframe]);

  // Initial trigger after 3 seconds on first load if opportunity exists
  useEffect(() => {
    if (decisionData && currentPrice && !activeAlert) {
      const initialTimeout = setTimeout(() => {
        evaluateSignalsAndTriggerAlert(decisionData, currentPrice);
      }, 3500);
      return () => clearTimeout(initialTimeout);
    }
  }, [decisionData?.decisionType]);

  const handleDismissAlert = () => {
    setActiveAlert(null);
  };

  const handleSnoozeAlert = (minutes: number) => {
    setSnoozeUntil(Date.now() + minutes * 60 * 1000);
    setActiveAlert(null);
  };

  const handleForceReevaluate = async () => {
    setIsEvaluatingAlert(true);
    await fetchAllData(selectedTimeframe, false);
    evaluateSignalsAndTriggerAlert();
    setSecondsUntilNextCheck((settings?.popupIntervalMinutes ?? 10) * 60);
    setTimeout(() => setIsEvaluatingAlert(false), 400);
  };

  const handleTriggerTestAlert = (type: 'BUY' | 'SELL' | 'URGENT') => {
    evaluateSignalsAndTriggerAlert(decisionData, currentPrice, type);
  };

  // Fetch complete state from backend
  const fetchAllData = async (tf: Timeframe = selectedTimeframe, showSpinner = false) => {
    if (showSpinner) setIsRefreshing(true);
    try {
      const [
        priceRes,
        candlesRes,
        decisionRes,
        techRes,
        ecoRes,
        newsRes,
        fundRes,
        predsRes,
        perfRes,
        provsRes,
        settingsRes,
      ] = await Promise.all([
        fetch('/api/gold/current').then(r => r.json()),
        fetch(`/api/gold/history?timeframe=${tf}&count=80`).then(r => r.json()),
        fetch(`/api/gold/decision?timeframe=${tf}`).then(r => r.json()),
        fetch(`/api/gold/technical?timeframe=${tf}`).then(r => r.json()),
        fetch('/api/economic-calendar').then(r => r.json()),
        fetch('/api/gold/news').then(r => r.json()),
        fetch('/api/gold/fundamentals').then(r => r.json()),
        fetch('/api/gold/predictions').then(r => r.json()),
        fetch('/api/gold/performance').then(r => r.json()),
        fetch('/api/gold/providers').then(r => r.json()),
        fetch('/api/gold/settings').then(r => r.json()),
      ]);

      setCurrentPrice(priceRes);
      setCandles(candlesRes);
      setDecisionData(decisionRes);
      if (techRes && techRes.indicators) {
        setIndicators(techRes.indicators);
      }
      setEconomicEvents(ecoRes);
      setNews(newsRes.news || []);
      setFundamentals(fundRes.fundamentals || null);
      setPredictionHistory(predsRes);
      setPerformanceMetrics(perfRes);
      setDataProviders(provsRes.providers || []);
      setSettings(settingsRes);
    } catch (err) {
      console.error('Error fetching gold data from backend:', err);
    } finally {
      if (showSpinner) {
        setTimeout(() => setIsRefreshing(false), 400);
      }
    }
  };

  // Initial Load
  useEffect(() => {
    fetchAllData(selectedTimeframe, true);
  }, []);

  // Timeframe change
  const handleTimeframeChange = (tf: Timeframe) => {
    setSelectedTimeframe(tf);
    fetchAllData(tf, false);
  };

  // High-frequency Real-time Live Pulse (Updates price, latest candle, and technical decision)
  useEffect(() => {
    if (!isLiveActive) return;

    const interval = setInterval(async () => {
      try {
        const pulseRes = await fetch(`/api/gold/live-pulse?timeframe=${selectedTimeframe}`);
        if (!pulseRes.ok) return;
        const pulseData = await pulseRes.json();

        // 1. Update live price data
        if (pulseData.price) {
          setCurrentPrice(pulseData.price);
        }

        // 2. Smoothly update the active candle in chart without wiping user drawings
        if (pulseData.price) {
          const newPrice = pulseData.price.currentPrice;
          setCandles(prevCandles => {
            if (!prevCandles || prevCandles.length === 0) return prevCandles;
            const last = { ...prevCandles[prevCandles.length - 1] };
            last.close = newPrice;
            if (newPrice > last.high) last.high = newPrice;
            if (newPrice < last.low) last.low = newPrice;
            return [...prevCandles.slice(0, -1), last];
          });
        }

        // 3. Update indicators & decision scores if provided
        if (pulseData.indicators) {
          setIndicators(pulseData.indicators);
        }
        if (pulseData.decision) {
          setDecisionData(pulseData.decision);
        }

        setLastTickTimestamp(Date.now());
      } catch (e) {
        console.warn('Live pulse error:', e);
      }
    }, liveIntervalMs);

    return () => clearInterval(interval);
  }, [isLiveActive, liveIntervalMs, selectedTimeframe]);

  // Periodic background sync for news, calendar, and prediction performance (every 20 seconds)
  useEffect(() => {
    if (!isLiveActive) return;
    const bgSyncInterval = setInterval(async () => {
      try {
        const [ecoRes, newsRes, predsRes, perfRes] = await Promise.all([
          fetch('/api/economic-calendar').then(r => r.json()),
          fetch('/api/gold/news').then(r => r.json()),
          fetch('/api/gold/predictions').then(r => r.json()),
          fetch('/api/gold/performance').then(r => r.json()),
        ]);
        setEconomicEvents(ecoRes);
        if (newsRes && newsRes.news) setNews(newsRes.news);
        setPredictionHistory(predsRes);
        setPerformanceMetrics(perfRes);
      } catch (e) {
        console.warn('Background sync error:', e);
      }
    }, 20000);
    return () => clearInterval(bgSyncInterval);
  }, [isLiveActive]);

  // Backtest runner
  const handleRunBacktest = async (config: BacktestConfig) => {
    setIsBacktestRunning(true);
    try {
      const res = await fetch('/api/gold/backtest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      setBacktestResult(data);
    } catch (e) {
      console.error('Backtest error:', e);
    } finally {
      setIsBacktestRunning(false);
    }
  };

  // Log prediction
  const handleLogPrediction = async (tf: Timeframe = selectedTimeframe) => {
    setIsLoggingPrediction(true);
    try {
      const res = await fetch('/api/gold/predictions/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeframe: tf,
          timeframeArabic: tf === '15m' ? '15 دقيقة' : tf === '1h' ? 'ساعة' : tf === '4h' ? '4 ساعات' : tf === '1D' ? 'يوم' : 'أسبوع',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLogSuccess(true);
        // Refresh predictions list
        const preds = await fetch('/api/gold/predictions').then(r => r.json());
        setPredictionHistory(preds);
        const perf = await fetch('/api/gold/performance').then(r => r.json());
        setPerformanceMetrics(perf);
        setTimeout(() => setLogSuccess(false), 3000);
      }
    } catch (e) {
      console.error('Log prediction error:', e);
    } finally {
      setIsLoggingPrediction(false);
    }
  };

  // AI Explanation handler
  const handleFetchAiExplanation = async () => {
    setIsAiLoading(true);
    setIsAiModalOpen(true);
    try {
      const res = await fetch('/api/gold/ai-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeframe: selectedTimeframe }),
      });
      const data = await res.json();
      setAiExplanationText(data.explanation || 'تعذر استرجاع التقرير');
    } catch (e) {
      setAiExplanationText('حدث خطأ أثناء استدعاء محرك الذكاء الاصطناعي. يرجى المحاولة لاحقاً.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Save settings
  const handleSaveSettings = async (newSettings: Partial<SystemSettings>) => {
    try {
      const res = await fetch('/api/gold/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        fetchAllData(selectedTimeframe, false);
      }
    } catch (e) {
      console.error('Save settings error:', e);
    }
  };

  const handleUpdateMT5 = async (mt5Update: Partial<MT5BridgeConfig>) => {
    if (!settings) return;
    await handleSaveSettings({
      mt5Config: {
        ...settings.mt5Config,
        ...mt5Update,
      },
    });
  };

  const upcomingAlertCount = economicEvents.filter(e => e.isUpcomingAlert && e.minutesUntil <= 120).length;

  // If in iPhone / Mobile mode, render dedicated iPhone UI
  if (isIPhoneMode) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 antialiased" dir="rtl">
        <IPhoneMobileView
          decisionData={decisionData}
          currentPrice={currentPrice}
          candles={candles}
          indicators={indicators}
          economicEvents={economicEvents}
          news={news}
          predictionHistory={predictionHistory}
          notifications={notifications}
          selectedTimeframe={selectedTimeframe}
          onSelectTimeframe={handleTimeframeChange}
          activeAlert={activeAlert}
          onDismissAlert={handleDismissAlert}
          onSnoozeAlert={handleSnoozeAlert}
          onTriggerTestAlert={handleTriggerTestAlert}
          secondsUntilNextCheck={secondsUntilNextCheck}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(prev => !prev)}
          isLiveActive={isLiveActive}
          onToggleLive={() => setIsLiveActive(prev => !prev)}
          onOpenHowModal={() => setIsHowModalOpen(true)}
          onOpenAiExplain={handleFetchAiExplanation}
          onLogPrediction={() => handleLogPrediction(selectedTimeframe)}
          isLoggingPrediction={isLoggingPrediction}
          logSuccess={logSuccess}
          onToggleDesktopMode={handleToggleIPhoneMode}
          hasNotificationPermission={hasNotificationPermission}
          onRequestNotificationPermission={handleRequestNotificationPermission}
          onClearNotifications={handleClearNotifications}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
        />

        {/* Flickery Signal Popup Notification (Urgent & Periodic Decisions) */}
        <FlickerSignalPopup
          alert={activeAlert}
          onDismiss={handleDismissAlert}
          onSnooze={handleSnoozeAlert}
          onViewDetails={() => {
            setIsHowModalOpen(true);
          }}
          secondsUntilNextCheck={secondsUntilNextCheck}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(prev => !prev)}
          onForceReevaluate={handleForceReevaluate}
          isEvaluating={isEvaluatingAlert}
        />

        {/* Transparent How Decision Reached Modal */}
        {decisionData && (
          <HowDecisionReachedModal
            isOpen={isHowModalOpen}
            onClose={() => setIsHowModalOpen(false)}
            decisionData={decisionData}
          />
        )}

        {/* AI Explanation Report Modal */}
        <AiExplanationModal
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
          explanation={aiExplanationText}
          onRefreshExplanation={handleFetchAiExplanation}
          isLoading={isAiLoading}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 antialiased" dir="rtl">
      {/* 1. Header Navigation Bar */}
      <Header
        currentPrice={currentPrice}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefresh={() => fetchAllData(selectedTimeframe, true)}
        isRefreshing={isRefreshing}
        onOpenAiExplain={handleFetchAiExplanation}
        upcomingAlertCount={upcomingAlertCount}
        activeAlert={activeAlert}
        secondsUntilNextCheck={secondsUntilNextCheck}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
        onTriggerTestAlert={handleTriggerTestAlert}
        liveIntervalMs={liveIntervalMs}
        onChangeLiveInterval={(ms) => setLiveIntervalMs(ms)}
        isLiveActive={isLiveActive}
        onToggleLive={() => setIsLiveActive(prev => !prev)}
        lastTickTimestamp={lastTickTimestamp}
        isIPhoneMode={isIPhoneMode}
        onToggleIPhoneMode={handleToggleIPhoneMode}
      />

      {/* Main App Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Loading Spinner Skeleton on Initial Load */}
        {!decisionData || !currentPrice ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 rounded-full border-3 border-amber-500 border-t-transparent animate-spin"></div>
            <p className="text-sm font-bold text-amber-400">جارِ تفعيل محركات التحليل والتنبؤ للذهب XAU/USD...</p>
          </div>
        ) : (
          <>
            {/* Market Summary Now Banner */}
            <MarketSummaryBanner
              decisionData={decisionData}
              onOpenHowModal={() => setIsHowModalOpen(true)}
              onOpenAiExplain={handleFetchAiExplanation}
            />

            {/* TAB 1: Main Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fadeIn">
                {/* 3 Top Cards Grid: Current Price, Trend, and Risk Meter */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <CurrentPriceCard priceData={currentPrice} />
                  <CurrentTrendCard
                    trend={decisionData.trend}
                    trendDirection={decisionData.trendDirection}
                    trendStrength={decisionData.trendStrength}
                  />
                  <GoldRiskMeter
                    riskScore={decisionData.riskScore}
                    riskLevel={decisionData.riskLevel}
                    riskLevelArabic={decisionData.riskLevelArabic}
                  />
                </div>

                {/* Primary Decision Banner */}
                <SmartDecisionCard
                  decision={decisionData.decision}
                  decisionType={decisionData.decisionType}
                  confidenceScore={decisionData.confidenceScore}
                  whyExplanation={decisionData.whyExplanation}
                  supportResistance={decisionData.supportResistance}
                  onOpenHowModal={() => setIsHowModalOpen(true)}
                  onLogPrediction={() => handleLogPrediction(selectedTimeframe)}
                  isLogging={isLoggingPrediction}
                  logSuccess={logSuccess}
                />

                {/* Price Chart with Overlays & Timeframe */}
                <PriceChart
                  candles={candles}
                  selectedTimeframe={selectedTimeframe}
                  onSelectTimeframe={handleTimeframeChange}
                  supportResistance={decisionData.supportResistance}
                />

                {/* Multi-Timeframe Forecasts Matrix */}
                <MultiTimeframeForecast forecasts={decisionData.forecasts} />

                {/* Support/Resistance & Scenarios Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SupportResistanceCard levels={decisionData.supportResistance} />
                  <ScenariosCard scenarios={decisionData.scenarios} />
                </div>
              </div>
            )}

            {/* TAB 2: Deep Analysis */}
            {activeTab === 'deep-analysis' && fundamentals && (
              <DeepAnalysisView
                indicators={indicators}
                supportResistance={decisionData.supportResistance}
                dollarAnalysis={{
                  dxyPrice: 101.85,
                  dxyChangePercent: -0.32,
                  eurUsd: 1.0945,
                  usdJpy: 144.2,
                  usdChf: 0.846,
                  impactScore: decisionData.scores.dollarScore,
                  impactStatus: 'SUPPORTIVE',
                  impactStatusArabic: 'الدولار داعم للذهب',
                  explanation: 'تراجع مؤشر الدولار DXY واستقراره دون 102.00 يقلل تكلفة شراء الذهب ويوفر بيئة دافعة للأسعار.',
                }}
                yieldsAnalysis={{
                  fedFundsRate: 5.25,
                  fedHikeCutExpectation: 'تسعير خفض بمقدار 25-50 نقطة أساس',
                  us2yYield: 3.65,
                  us10yYield: 3.82,
                  realYield10y: 1.58,
                  impactScore: decisionData.scores.macroScore,
                  impactStatus: 'SUPPORTIVE',
                  impactStatusArabic: 'عوائد داعمة للذهب',
                  explanation: 'انخفاض العائد الحقيقي على السندات يقلص تكلفة الفرصة البديلة للاحتفاظ بالذهب.',
                }}
                fundamentals={fundamentals}
                news={news}
                scores={decisionData.scores}
              />
            )}

            {/* TAB 3: Economic Calendar */}
            {activeTab === 'economic-calendar' && (
              <EconomicCalendarView events={economicEvents} />
            )}

            {/* TAB 4: Prediction History */}
            {activeTab === 'prediction-history' && (
              <PredictionHistoryView
                history={predictionHistory}
                onLogNewPrediction={handleLogPrediction}
                isLogging={isLoggingPrediction}
              />
            )}

            {/* TAB 5: System Performance & Accuracy */}
            {activeTab === 'performance' && performanceMetrics && (
              <PerformanceView metrics={performanceMetrics} />
            )}

            {/* TAB 6: Backtesting Simulator */}
            {activeTab === 'backtest' && (
              <BacktestView
                onRunBacktest={handleRunBacktest}
                isRunning={isBacktestRunning}
                result={backtestResult}
              />
            )}

            {/* TAB 7: Data Providers & MT5 */}
            {activeTab === 'providers' && settings && (
              <DataProvidersAndMT5View
                providers={dataProviders}
                mt5Config={settings.mt5Config}
                onUpdateMT5={handleUpdateMT5}
              />
            )}

            {/* TAB 8: Settings & Weights */}
            {activeTab === 'settings' && settings && (
              <SettingsView
                settings={settings}
                onSaveSettings={handleSaveSettings}
                onTriggerTestAlert={handleTriggerTestAlert}
                secondsUntilNextCheck={secondsUntilNextCheck}
              />
            )}
          </>
        )}
      </main>

      {/* Financial Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Flickery Signal Popup Notification (10-Min Periodic & Urgent Decisions) */}
      <FlickerSignalPopup
        alert={activeAlert}
        onDismiss={handleDismissAlert}
        onSnooze={handleSnoozeAlert}
        onViewDetails={() => {
          setActiveTab('dashboard');
          setIsHowModalOpen(true);
        }}
        secondsUntilNextCheck={secondsUntilNextCheck}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
        onForceReevaluate={handleForceReevaluate}
        isEvaluating={isEvaluatingAlert}
      />

      {/* Transparent How Decision Reached Modal */}
      {decisionData && (
        <HowDecisionReachedModal
          isOpen={isHowModalOpen}
          onClose={() => setIsHowModalOpen(false)}
          decisionData={decisionData}
        />
      )}

      {/* AI Explanation Report Modal */}
      <AiExplanationModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        explanation={aiExplanationText}
        onRefreshExplanation={handleFetchAiExplanation}
        isLoading={isAiLoading}
      />
    </div>
  );
}
export default App;
