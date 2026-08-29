import {
  CurrentPriceData,
  EconomicEvent,
  GoldFundamentals,
  NewsItem,
  OHLCVCandle,
  PredictionRecord,
  Timeframe,
} from '../../src/types';

// Base current market price for Gold XAU/USD
let currentBasePrice = 2894.50;
let currentBid = 2894.35;
let currentAsk = 2894.65;
let dayOpen = 2881.20;
let dayHigh = 2908.40;
let dayLow = 2876.50;
let lastUpdate = new Date().toISOString();

export function getCurrentGoldPrice(): CurrentPriceData {
  // Add subtle micro-fluctuation for live feel
  const microJitter = (Math.random() - 0.48) * 0.35;
  currentBasePrice = Number((currentBasePrice + microJitter).toFixed(2));
  currentBid = Number((currentBasePrice - 0.15).toFixed(2));
  currentAsk = Number((currentBasePrice + 0.15).toFixed(2));
  if (currentBasePrice > dayHigh) dayHigh = currentBasePrice;
  if (currentBasePrice < dayLow) dayLow = currentBasePrice;

  const dailyChange = Number((currentBasePrice - dayOpen).toFixed(2));
  const dailyChangePercent = Number(((dailyChange / dayOpen) * 100).toFixed(2));

  return {
    symbol: 'XAU/USD',
    currentPrice: currentBasePrice,
    bid: currentBid,
    ask: currentAsk,
    spread: 0.30,
    dailyChange,
    dailyChangePercent,
    highToday: dayHigh,
    lowToday: dayLow,
    previousClose: dayOpen,
    lastUpdated: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    connectionStatus: 'LIVE',
    connectionStatusArabic: 'البيانات محدثة',
  };
}

export function generateHistoricalCandles(timeframe: Timeframe, count: number = 80): OHLCVCandle[] {
  const candles: OHLCVCandle[] = [];
  const now = Date.now();
  let intervalMs = 15 * 60 * 1000;
  if (timeframe === '1h') intervalMs = 60 * 60 * 1000;
  if (timeframe === '4h') intervalMs = 4 * 60 * 60 * 1000;
  if (timeframe === '1D') intervalMs = 24 * 60 * 60 * 1000;
  if (timeframe === '1W') intervalMs = 7 * 24 * 60 * 60 * 1000;

  let price = 2820.00;
  if (timeframe === '15m') price = currentBasePrice - (count * 0.45);
  else if (timeframe === '1h') price = currentBasePrice - (count * 1.1);
  else if (timeframe === '4h') price = currentBasePrice - (count * 2.4);
  else if (timeframe === '1D') price = 2650.00;
  else if (timeframe === '1W') price = 2380.00;

  for (let i = count; i >= 0; i--) {
    const timestamp = now - i * intervalMs;
    const date = new Date(timestamp);
    const timeStr = timeframe === '1D' || timeframe === '1W'
      ? date.toLocaleDateString('ar-SA', { month: 'numeric', day: 'numeric' })
      : date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

    // Realistic trend + noise
    const trendFactor = 0.65; // Overall bullish gold macro
    const randomDelta = (Math.random() - 0.46) * (timeframe === '15m' ? 3.5 : timeframe === '1h' ? 7 : 18);
    const open = Number(price.toFixed(2));
    const close = Number((open + randomDelta + (trendFactor * 0.8)).toFixed(2));
    const high = Number((Math.max(open, close) + Math.random() * (timeframe === '15m' ? 2.5 : 5)).toFixed(2));
    const low = Number((Math.min(open, close) - Math.random() * (timeframe === '15m' ? 2.5 : 5)).toFixed(2));
    const volume = Math.floor(1200 + Math.random() * 5800);

    price = close;
    candles.push({
      time: timeStr,
      timestamp,
      open,
      high,
      low,
      close: i === 0 ? currentBasePrice : close,
      volume,
    });
  }

  // Calculate technical indicator overlays for chart
  return enrichCandlesWithIndicators(candles);
}

function enrichCandlesWithIndicators(candles: OHLCVCandle[]): OHLCVCandle[] {
  const closes = candles.map(c => c.close);

  // EMA helper
  const calcEMA = (period: number): number[] => {
    const k = 2 / (period + 1);
    const emas: number[] = [];
    let prev = closes[0];
    for (let i = 0; i < closes.length; i++) {
      if (i === 0) {
        emas.push(prev);
      } else {
        const val = closes[i] * k + prev * (1 - k);
        emas.push(Number(val.toFixed(2)));
        prev = val;
      }
    }
    return emas;
  };

  const ema20 = calcEMA(20);
  const ema50 = calcEMA(50);
  const ema200 = calcEMA(Math.min(candles.length - 1, 100));

  // RSI 14 helper
  const rsis: number[] = [];
  let gains = 0;
  let losses = 0;
  for (let i = 0; i < closes.length; i++) {
    if (i === 0) {
      rsis.push(50);
      continue;
    }
    const diff = closes[i] - closes[i - 1];
    if (i <= 14) {
      if (diff >= 0) gains += diff;
      else losses += Math.abs(diff);
      rsis.push(50);
    } else {
      if (diff >= 0) {
        gains = (gains * 13 + diff) / 14;
        losses = (losses * 13) / 14;
      } else {
        gains = (gains * 13) / 14;
        losses = (losses * 13 + Math.abs(diff)) / 14;
      }
      const rs = losses === 0 ? 100 : gains / losses;
      const rsi = Number((100 - 100 / (1 + rs)).toFixed(1));
      rsis.push(rsi);
    }
  }

  return candles.map((c, idx) => {
    const mid = ema20[idx] || c.close;
    const stdDev = 14.5;
    return {
      ...c,
      ema20: ema20[idx],
      ema50: ema50[idx],
      ema200: ema200[idx],
      rsi: rsis[idx] || 52,
      upperBB: Number((mid + 2 * stdDev).toFixed(2)),
      lowerBB: Number((mid - 2 * stdDev).toFixed(2)),
    };
  });
}

export const initialEconomicEvents: EconomicEvent[] = [
  {
    id: 'eco-1',
    name: 'مؤشر أسعار المستهلكين الأمريكي (CPI الأساسي)',
    country: 'الولايات المتحدة',
    countryFlag: '🇺🇸',
    date: 'اليوم',
    time: '15:30 GMT+3',
    minutesUntil: 45,
    previous: '3.1%',
    forecast: '2.9%',
    actual: null,
    importance: 'CRITICAL',
    importanceArabic: 'شديد التأثير',
    goldImpact: 'انخفاض التضخم دون المتوقع يضعف الدولار ويدفع الذهب نحو مستويات قياسية صاعدة.',
    isUpcomingAlert: true,
  },
  {
    id: 'eco-2',
    name: 'تقرير الوظائف غير الزراعية (NFP)',
    country: 'الولايات المتحدة',
    countryFlag: '🇺🇸',
    date: 'الجمعة القادمة',
    time: '15:30 GMT+3',
    minutesUntil: 2880,
    previous: '142K',
    forecast: '165K',
    actual: null,
    importance: 'HIGH',
    importanceArabic: 'مرتفع',
    goldImpact: 'تباطؤ نمو الوظائف يزيد رهانات خفض الفائدة بنصف نقطة مئوية ويدعم الذهب بقوة.',
    isUpcomingAlert: false,
  },
  {
    id: 'eco-3',
    name: 'معدل البطالة الأمريكي',
    country: 'الولايات المتحدة',
    countryFlag: '🇺🇸',
    date: 'الجمعة القادمة',
    time: '15:30 GMT+3',
    minutesUntil: 2880,
    previous: '4.2%',
    forecast: '4.2%',
    actual: null,
    importance: 'HIGH',
    importanceArabic: 'مرتفع',
    goldImpact: 'أي ارتفاع في البطالة يرفع احتمالات الركود الاقتصادي وتدفق الملاذات الآمنة للذهب.',
    isUpcomingAlert: false,
  },
  {
    id: 'eco-4',
    name: 'بيان الفائدة للبنك المركزي الأوروبي (ECB)',
    country: 'منطقة اليورو',
    countryFlag: '🇪🇺',
    date: 'غداً',
    time: '16:15 GMT+3',
    minutesUntil: 1240,
    previous: '3.50%',
    forecast: '3.25%',
    actual: null,
    importance: 'HIGH',
    importanceArabic: 'مرتفع',
    goldImpact: 'خفض الفائدة الأوروبية يعزز جاذبية الذهب كأصل غير مدر لعائد مقارنة بالعملات الورقية.',
    isUpcomingAlert: false,
  },
  {
    id: 'eco-5',
    name: 'مؤشر مديري المشتريات الصناعي (ISM Manufacturing)',
    country: 'الولايات المتحدة',
    countryFlag: '🇺🇸',
    date: 'الأسبوع القادم',
    time: '17:00 GMT+3',
    minutesUntil: 5760,
    previous: '47.2',
    forecast: '47.8',
    actual: null,
    importance: 'MEDIUM',
    importanceArabic: 'متوسط',
    goldImpact: 'بقاء المؤشر دون مستوى 50 يشير إلى انكماش صناعي مستمر مما يدعم التحوط بالذهب.',
    isUpcomingAlert: false,
  },
];

export const initialNewsItems: NewsItem[] = [
  {
    id: 'news-1',
    title: 'البنك المركزي الصيني يواصل زيادة احتياطياته الرسمية من الذهب للشهر الثاني عشر توالياً',
    source: 'رويترز للأسواق المالية',
    timeAgo: 'منذ 25 دقيقة',
    publishedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    sentiment: 'POSITIVE',
    sentimentArabic: 'إيجابي للذهب',
    impactScore: 88,
    duration: 'LONG',
    durationArabic: 'طويل',
    summary: 'أظهرت بيانات البنك الشعبي الصيني شراء ما يقارب 16 طناً إضافياً من الذهب لتعزيز تنويع الاحتياطيات وتقليل الاعتماد على سندات الخزانة الأمريكية.',
  },
  {
    id: 'news-2',
    title: 'عوائد سندات الخزانة الأمريكية لأجل 10 سنوات تتراجع دون 4.05% مع تسعير الأسواق خفض الفائدة',
    source: 'بلومبرغ نيوز',
    timeAgo: 'منذ 1 ساعة',
    publishedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    sentiment: 'POSITIVE',
    sentimentArabic: 'إيجابي للذهب',
    impactScore: 78,
    duration: 'MEDIUM',
    durationArabic: 'متوسط',
    summary: 'تراجع العائد الحقيقي على السندات يقلل تكلفة الفرصة البديلة لحيازة السبائك الذهبية، مما يمنح الثيران زخماً إضافياً.',
  },
  {
    id: 'news-3',
    title: 'مؤشر الدولار DXY يستقر بالقرب من 102.30 وسط ترقب المستثمرين لبيانات التضخم الأمريكية',
    source: 'فاينانشال تايمز',
    timeAgo: 'منذ ساعتين',
    publishedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    sentiment: 'NEUTRAL',
    sentimentArabic: 'محايد',
    impactScore: 55,
    duration: 'SHORT',
    durationArabic: 'قصير',
    summary: 'تداولات جانبية للدولار أمام سلة العملات الرئيسية تحد من حدة التقلبات في عقود الذهب الفورية قبيل صدور مؤشر أسعار المستهلكين.',
  },
  {
    id: 'news-4',
    title: 'ارتفاع حاد في تدفقات صناديق الذهب المتداولة (SPDR Gold Shares) للأسبوع الثالث على التوالي',
    source: 'مجلس الذهب العالمي (WGC)',
    timeAgo: 'منذ 4 ساعات',
    publishedAt: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
    sentiment: 'POSITIVE',
    sentimentArabic: 'إيجابي للذهب',
    impactScore: 82,
    duration: 'LONG',
    durationArabic: 'طويل',
    summary: 'تدفقات استثمارية مؤسسية بقيمة 1.4 مليار دولار تدخل الصناديق المدعومة بالذهب الفعلي في أمريكا الشمالية وأوروبا.',
  },
  {
    id: 'news-5',
    title: 'تصريحات متشددة لأحد أعضاء الفيدرالي تدعو للحذر قبل التسرع في خفض الفائدة بحدة',
    source: 'وول ستريت جورنال',
    timeAgo: 'منذ 6 ساعات',
    publishedAt: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
    sentiment: 'NEGATIVE',
    sentimentArabic: 'سلبي للذهب',
    impactScore: 62,
    duration: 'SHORT',
    durationArabic: 'قصير',
    summary: 'أكد العضو أن التضخم لا يزال عنيداً في قطاع الخدمات مما قد يبطئ وتيرة التيسير النقدي على المدى القريب.',
  },
];

export const goldFundamentalsData: GoldFundamentals = {
  centralBankBuyingTons: 1045,
  centralBankTrend: 'شراء تاريخي مكثف بقيادة الصين وبولندا وتركيا والهند',
  etfFlowsTons: 64.8,
  etfStatus: 'تحول إيجابي صافي في تدفقات الصناديق العالمية للشهر الثالث',
  physicalDemandScore: 84,
  barAndCoinDemand: 'طلب قوي جداً على السبائك في الشرق الأوسط وآسيا مع التضخم',
  jewelryDemand: 'طلب مستقر مع بعض الحذر السعري في السوق الهندية والصينية',
  chinaDemandTrend: 'شراء قياسي للتحوط ضد تقلبات الأسهم والعقارات المحلية',
  indiaDemandTrend: 'انتعاش كبير مع موسم المهرجانات وخفض الرسوم الجمركية على الواردات',
  mineProductionStatus: 'نمو إنتاج المناجم شبه راكد (أقل من +0.8% سنوياً)',
  recyclingVolume: 'ارتفاع طفيف في المعروض المعاد تدويره بسبب المستويات السعرية المرتفعة',
  geopoliticalRiskScore: 82,
  geopoliticalSummary: 'توترات جيوسياسية مرتفعة في الشرق الأوسط وأوروبا تدعم علاوة الملاذ الآمن للذهب بحوالي 80-120 دولاراً للأونصة.',
  fundamentalScore: 84,
};

export const samplePredictionHistory: PredictionRecord[] = [
  {
    id: 'pred-101',
    timestamp: Date.now() - 14400000,
    dateStr: '2026-08-28',
    timeStr: '18:30',
    priceAtPrediction: 2872.40,
    timeframe: '4h',
    timeframeArabic: '4 ساعات',
    decision: 'شراء عند التصحيح',
    decisionType: 'BUY_ON_DIP',
    upProb: 74,
    downProb: 16,
    neutralProb: 10,
    confidence: 82,
    riskScore: 38,
    primaryFactor: 'ارتداد من دعم EMA 50 وتدفقات قوية لصناديق ETF',
    actualRealizedPrice: 2894.50,
    isEvaluated: true,
    isCorrect: true,
    deviationPercent: 0.77,
  },
  {
    id: 'pred-102',
    timestamp: Date.now() - 28800000,
    dateStr: '2026-08-28',
    timeStr: '14:30',
    priceAtPrediction: 2868.10,
    timeframe: '1h',
    timeframeArabic: 'ساعة',
    decision: 'شراء',
    decisionType: 'BUY',
    upProb: 69,
    downProb: 19,
    neutralProb: 12,
    confidence: 78,
    riskScore: 42,
    primaryFactor: 'كسر مقاومة فرعية 2865 وتراجع مؤشر الدولار',
    actualRealizedPrice: 2879.80,
    isEvaluated: true,
    isCorrect: true,
    deviationPercent: 0.41,
  },
  {
    id: 'pred-103',
    timestamp: Date.now() - 43200000,
    dateStr: '2026-08-28',
    timeStr: '10:30',
    priceAtPrediction: 2875.90,
    timeframe: '15m',
    timeframeArabic: '15 دقيقة',
    decision: 'جني أرباح',
    decisionType: 'TAKE_PROFIT',
    upProb: 28,
    downProb: 58,
    neutralProb: 14,
    confidence: 76,
    riskScore: 58,
    primaryFactor: 'تشبع شرائي على RSI (74) واقتراب مقاومة يومية',
    actualRealizedPrice: 2867.20,
    isEvaluated: true,
    isCorrect: true,
    deviationPercent: -0.30,
  },
  {
    id: 'pred-104',
    timestamp: Date.now() - 86400000,
    dateStr: '2026-08-27',
    timeStr: '22:00',
    priceAtPrediction: 2855.00,
    timeframe: '1D',
    timeframeArabic: 'يوم',
    decision: 'شراء',
    decisionType: 'BUY',
    upProb: 80,
    downProb: 12,
    neutralProb: 8,
    confidence: 86,
    riskScore: 35,
    primaryFactor: 'إغلاق شمعة يومية صاعدة فوق المتوسطات 20 و50',
    actualRealizedPrice: 2884.00,
    isEvaluated: true,
    isCorrect: true,
    deviationPercent: 1.02,
  },
  {
    id: 'pred-105',
    timestamp: Date.now() - 172800000,
    dateStr: '2026-08-26',
    timeStr: '16:00',
    priceAtPrediction: 2862.00,
    timeframe: '4h',
    timeframeArabic: '4 ساعات',
    decision: 'انتظار',
    decisionType: 'WAIT',
    upProb: 35,
    downProb: 38,
    neutralProb: 27,
    confidence: 58,
    riskScore: 72,
    primaryFactor: 'تضارب بين مؤشرات الزخم قبيل محضر اجتماع الفيدرالي',
    actualRealizedPrice: 2858.30,
    isEvaluated: true,
    isCorrect: true,
    deviationPercent: -0.13,
  },
  {
    id: 'pred-106',
    timestamp: Date.now() - 259200000,
    dateStr: '2026-08-25',
    timeStr: '12:00',
    priceAtPrediction: 2844.00,
    timeframe: '1W',
    timeframeArabic: 'أسبوع',
    decision: 'شراء',
    decisionType: 'BUY',
    upProb: 82,
    downProb: 10,
    neutralProb: 8,
    confidence: 88,
    riskScore: 32,
    primaryFactor: 'استمرار الاتجاه الصاعد الهيكلي ومشتريات البنوك المركزية',
    actualRealizedPrice: 2894.50,
    isEvaluated: true,
    isCorrect: true,
    deviationPercent: 1.77,
  },
];
