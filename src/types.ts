export type DecisionType =
  | 'BUY'
  | 'BUY_ON_DIP'
  | 'HOLD'
  | 'WAIT'
  | 'TAKE_PROFIT'
  | 'SELL';

export type DecisionArabic =
  | 'شراء'
  | 'شراء عند التصحيح'
  | 'احتفاظ'
  | 'انتظار'
  | 'جني أرباح'
  | 'بيع';

export type TrendDirection =
  | 'BULLISH_STRONG'
  | 'BULLISH'
  | 'NEUTRAL'
  | 'BEARISH'
  | 'BEARISH_STRONG';

export type TrendArabic =
  | 'صاعد بقوة'
  | 'صاعد'
  | 'محايد'
  | 'هابط'
  | 'هابط بقوة';

export type RiskLevel =
  | 'VERY_LOW'
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'VERY_HIGH';

export type RiskLevelArabic =
  | 'منخفض جداً'
  | 'منخفض'
  | 'متوسط'
  | 'مرتفع'
  | 'مرتفع جداً';

export type Timeframe = '15m' | '1h' | '4h' | '1D' | '1W';

export interface OHLCVCandle {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  rsi?: number;
  ema20?: number;
  ema50?: number;
  ema200?: number;
  upperBB?: number;
  lowerBB?: number;
}

export interface CurrentPriceData {
  symbol: string;
  currentPrice: number;
  bid: number;
  ask: number;
  spread: number;
  dailyChange: number;
  dailyChangePercent: number;
  highToday: number;
  lowToday: number;
  previousClose: number;
  lastUpdated: string;
  connectionStatus: 'LIVE' | 'DELAYED' | 'DISCONNECTED';
  connectionStatusArabic: 'البيانات محدثة' | 'البيانات متأخرة' | 'مصدر البيانات غير متاح';
}

export interface TechnicalIndicators {
  rsi14: number;
  rsiStatus: string;
  macd: {
    macdLine: number;
    signalLine: number;
    histogram: number;
    status: string;
  };
  ema20: number;
  ema50: number;
  ema100: number;
  ema200: number;
  sma20: number;
  sma50: number;
  atr14: number;
  adx14: number;
  adxTrendStrength: string;
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
    bandwidth: number;
    percentB: number;
  };
  stochastic: {
    k: number;
    d: number;
    status: string;
  };
  momentum: number;
  pivotPoints: {
    pivot: number;
    r1: number;
    r2: number;
    r3: number;
    s1: number;
    s2: number;
    s3: number;
  };
  marketStructure: 'BULLISH_HH_HL' | 'BEARISH_LH_LL' | 'RANGING';
  marketStructureArabic: string;
  divergence: 'BULLISH_DIV' | 'BEARISH_DIV' | 'NONE';
  divergenceArabic: string;
  volatilityStatus: string;
}

export interface DollarAnalysis {
  dxyPrice: number;
  dxyChangePercent: number;
  eurUsd: number;
  usdJpy: number;
  usdChf: number;
  impactScore: number; // 0 - 100
  impactStatus: 'SUPPORTIVE' | 'NEUTRAL' | 'PRESSURING';
  impactStatusArabic: 'الدولار داعم للذهب' | 'الدولار محايد' | 'الدولار ضاغط على الذهب';
  explanation: string;
}

export interface YieldsAnalysis {
  fedFundsRate: number;
  fedHikeCutExpectation: string;
  us2yYield: number;
  us10yYield: number;
  realYield10y: number;
  impactScore: number;
  impactStatus: 'SUPPORTIVE' | 'NEUTRAL' | 'PRESSURING';
  impactStatusArabic: 'عوائد داعمة للذهب' | 'عوائد محايدة' | 'عوائد ضاغطة على الذهب';
  explanation: string;
}

export type ImportanceLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface EconomicEvent {
  id: string;
  name: string;
  country: string;
  countryFlag: string;
  date: string;
  time: string;
  minutesUntil: number;
  previous: string;
  forecast: string;
  actual: string | null;
  importance: ImportanceLevel;
  importanceArabic: 'منخفض' | 'متوسط' | 'مرتفع' | 'شديد التأثير';
  goldImpact: string;
  isUpcomingAlert: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  publishedAt: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  sentimentArabic: 'إيجابي للذهب' | 'سلبي للذهب' | 'محايد';
  impactScore: number; // 0 - 100
  duration: 'VERY_SHORT' | 'SHORT' | 'MEDIUM' | 'LONG';
  durationArabic: 'قصير جداً' | 'قصير' | 'متوسط' | 'طويل';
  summary: string;
}

export interface GoldFundamentals {
  centralBankBuyingTons: number;
  centralBankTrend: string;
  etfFlowsTons: number;
  etfStatus: string;
  physicalDemandScore: number; // 0 - 100
  barAndCoinDemand: string;
  jewelryDemand: string;
  chinaDemandTrend: string;
  indiaDemandTrend: string;
  mineProductionStatus: string;
  recyclingVolume: string;
  geopoliticalRiskScore: number; // 0 - 100
  geopoliticalSummary: string;
  fundamentalScore: number; // 0 - 100
}

export interface TimeframeForecast {
  timeframe: Timeframe;
  timeframeArabic: string;
  upProbability: number;
  downProbability: number;
  neutralProbability: number;
  decision: DecisionArabic;
  decisionType: DecisionType;
  expectedTargetHigh: number;
  expectedTargetLow: number;
}

export interface FutureScenarios {
  mainScenario: {
    title: string;
    description: string;
    probability: number;
    targetRange: string;
  };
  alternativeScenario: {
    title: string;
    description: string;
    probability: number;
    targetRange: string;
  };
  riskScenario: {
    title: string;
    description: string;
    invalidationTrigger: string;
    invalidationPrice: number;
  };
}

export interface SupportResistanceLevels {
  currentPrice: number;
  resistance2: number;
  resistance1: number;
  nearestResistance: number;
  resistanceDistancePercent: number;
  support1: number;
  support2: number;
  nearestSupport: number;
  supportDistancePercent: number;
  breakoutLevel: number;
  breakdownLevel: number;
  potentialBuyZone: string;
  takeProfitZone: string;
  invalidationLevel: number;
}

export interface EngineScores {
  technicalScore: number; // 0 - 100
  macroScore: number; // 0 - 100
  dollarScore: number; // 0 - 100
  fundamentalScore: number; // 0 - 100
  newsScore: number; // 0 - 100
  sentimentScore: number; // 0 - 100
  riskScore: number; // 0 - 100
  confidenceScore: number; // 0 - 100
}

export interface EngineWeights {
  technicalWeight: number; // e.g. 30%
  macroWeight: number; // e.g. 20%
  dollarWeight: number; // e.g. 15%
  fundamentalWeight: number; // e.g. 15%
  newsWeight: number; // e.g. 10%
  sentimentWeight: number; // e.g. 10%
}

export interface SystemDecisionData {
  decision: DecisionArabic;
  decisionType: DecisionType;
  trend: TrendArabic;
  trendDirection: TrendDirection;
  trendStrength: number; // 0 - 100
  confidenceScore: number; // 0 - 100
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  riskLevelArabic: RiskLevelArabic;
  marketSummaryNow: string;
  whyExplanation: string;
  whyBreakdownPoints: string[];
  scores: EngineScores;
  weights: EngineWeights;
  supportResistance: SupportResistanceLevels;
  scenarios: FutureScenarios;
  forecasts: TimeframeForecast[];
  aiAnalysisText?: string;
  isSufficientData: boolean;
  insufficientDataReason?: string;
}

export interface PredictionRecord {
  id: string;
  timestamp: number;
  dateStr: string;
  timeStr: string;
  priceAtPrediction: number;
  timeframe: Timeframe;
  timeframeArabic: string;
  decision: DecisionArabic;
  decisionType: DecisionType;
  upProb: number;
  downProb: number;
  neutralProb: number;
  confidence: number;
  riskScore: number;
  primaryFactor: string;
  actualRealizedPrice: number | null;
  isEvaluated: boolean;
  isCorrect: boolean | null;
  deviationPercent: number | null;
}

export interface AccuracyPerformanceMetrics {
  accuracy24h: number;
  accuracy7d: number;
  accuracy30d: number;
  accuracyLast100: number;
  totalEvaluated: number;
  correctPredictions: number;
  incorrectPredictions: number;
  falseSignalRate: number;
  meanAbsoluteError: number;
  directionalAccuracy: number;
  bestTimeframe: string;
  worstTimeframe: string;
  isSampleSufficient: boolean;
  sampleStatusMessage: string;
  accuracyByTimeframe: {
    timeframe: string;
    accuracy: number;
    total: number;
  }[];
}

export interface BacktestConfig {
  timeframe: Timeframe;
  periodDays: number;
  initialCapital: number;
  riskPercentPerTrade: number;
  stopLossAtrMultiplier: number;
  takeProfitAtrMultiplier: number;
}

export interface BacktestTrade {
  id: string;
  entryTime: string;
  exitTime: string;
  type: 'BUY' | 'SELL';
  typeArabic: 'شراء' | 'بيع';
  entryPrice: number;
  exitPrice: number;
  sizeLots: number;
  profitDollar: number;
  profitPercent: number;
  reason: string;
  isWin: boolean;
}

export interface BacktestResult {
  config: BacktestConfig;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  maxDrawdownPercent: number;
  totalReturnDollar: number;
  totalReturnPercent: number;
  bestTradeDollar: number;
  worstTradeDollar: number;
  averageTradeDollar: number;
  equityCurve: {
    time: string;
    equity: number;
    drawdown: number;
  }[];
  trades: BacktestTrade[];
}

export interface DataProviderInfo {
  id: string;
  name: string;
  nameArabic: string;
  dataType: string;
  dataTypeArabic: string;
  status: 'CONNECTED' | 'DELAYED' | 'ERROR';
  statusArabic: 'البيانات محدثة' | 'البيانات متأخرة' | 'مصدر البيانات غير متاح';
  reliabilityScore: number; // 0 - 100
  lastSync: string;
  latencyMs: number;
  isMock: boolean;
  endpointOrSource: string;
}

export interface TradeAlert {
  id: string;
  type: 'BUY' | 'BUY_ON_DIP' | 'SELL' | 'TAKE_PROFIT' | 'WAIT';
  action: 'BUY' | 'SELL';
  isUrgent: boolean;
  title: string;
  subtitle: string;
  message: string;
  price: number;
  entryZone: string;
  targetPrice: number;
  targetPrice2?: number;
  stopLoss: number;
  riskReward: string;
  urgencyReason?: string;
  timestamp: number;
  timeFormatted: string;
  expiresInSeconds: number;
  indicatorsSummary: string;
  confidenceScore: number;
  riskScore: number;
  assetName: string;
  timeframe: Timeframe;
}

export interface MT5BridgeConfig {
  isConnected: boolean;
  serverName: string;
  accountNumber: string;
  symbol: string;
  pingMs: number;
  readOnlyMode: boolean; // Must always be true for safety
  lastTickTime: string;
  historicalBarsCount: number;
}

export type ChartToolType =
  | 'CURSOR'
  | 'TRENDLINE'
  | 'SUPPORT_LINE'
  | 'RESISTANCE_LINE'
  | 'MEASURE';

export interface ChartTrendline {
  id: string;
  name: string;
  startIndex: number;
  startTime: string;
  startPrice: number;
  endIndex: number;
  endTime: string;
  endPrice: number;
  color: string;
  lineStyle: 'solid' | 'dashed';
  lineWidth: number;
  createdAt: number;
}

export interface CustomLevel {
  id: string;
  type: 'SUPPORT' | 'RESISTANCE' | 'KEY_LEVEL';
  label: string;
  price: number;
  color: string;
  lineStyle: 'solid' | 'dashed';
  createdAt: number;
}

export interface ChartMeasurement {
  id: string;
  startIndex: number;
  startTime: string;
  startPrice: number;
  endIndex: number;
  endTime: string;
  endPrice: number;
  diffPrice: number;
  diffPercent: number;
  diffPips: number;
  barsCount: number;
}

export interface SystemSettings {
  weights: EngineWeights;
  updateIntervalSeconds: number;
  alertOnHighImpactNews: boolean;
  alertOnDecisionChange: boolean;
  alertOnRiskSpike: boolean;
  riskTolerance: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';
  currencyDisplay: 'USD' | 'SAR' | 'AED';
  useAiGeneratedExplanation: boolean;
  mt5Config: MT5BridgeConfig;
  autoPopupEnabled?: boolean;
  soundAlertEnabled?: boolean;
  popupIntervalMinutes?: number;
}

export interface AppNotificationItem {
  id: string;
  category: 'SIGNAL' | 'PRICE_LEVEL' | 'ECONOMIC_EVENT' | 'RISK_ALERT' | 'SYSTEM';
  title: string;
  message: string;
  timestamp: number;
  timeFormatted: string;
  isRead: boolean;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
  actionType?: 'BUY' | 'SELL' | 'WAIT';
  price?: number;
  targetPrice?: number;
  stopLoss?: number;
}

export type IPhoneTabType = 'forecast' | 'signals' | 'notifications' | 'levels' | 'settings';


