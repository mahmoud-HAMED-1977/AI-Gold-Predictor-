import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  generateHistoricalCandles,
  getCurrentGoldPrice,
  goldFundamentalsData,
  initialEconomicEvents,
  initialNewsItems,
  samplePredictionHistory,
} from './server/data/historicalData';
import { runHistoricalBacktest } from './server/engines/backtestEngine';
import { defaultMT5Config, initialDataProviders } from './server/engines/dataProviders';
import { defaultEngineWeights, synthesizeDecision } from './server/engines/decisionEngine';
import { calculateFundamentalAnalysis } from './server/engines/fundamentalEngine';
import { generateAiGoldExplanation } from './server/engines/geminiExplainer';
import { calculateMacroAnalysis } from './server/engines/macroEngine';
import { calculateNewsAnalysis } from './server/engines/newsEngine';
import { calculateSystemAccuracy } from './server/engines/performanceEngine';
import { calculateMultiTimeframePredictions } from './server/engines/predictionEngine';
import { calculateGoldRiskIndex } from './server/engines/riskEngine';
import { calculateTechnicalAnalysis } from './server/engines/technicalEngine';
import {
  BacktestConfig,
  EngineWeights,
  PredictionRecord,
  SystemSettings,
  Timeframe,
} from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory persistent state for sessions
let predictionHistory: PredictionRecord[] = [...samplePredictionHistory];
let currentSettings: SystemSettings = {
  weights: { ...defaultEngineWeights },
  updateIntervalSeconds: 5,
  alertOnHighImpactNews: true,
  alertOnDecisionChange: true,
  alertOnRiskSpike: true,
  riskTolerance: 'BALANCED',
  currencyDisplay: 'USD',
  useAiGeneratedExplanation: true,
  mt5Config: { ...defaultMT5Config },
};

// Unified helper to compute the complete live system state
function computeSystemState(customTimeframe: Timeframe = '1h') {
  const currentPrice = getCurrentGoldPrice();
  const candles = generateHistoricalCandles(customTimeframe, 80);
  const { indicators, supportResistance, technicalScore } = calculateTechnicalAnalysis(candles, currentPrice);
  const { dollarAnalysis, yieldsAnalysis, macroScore, dollarScore } = calculateMacroAnalysis();
  const { fundamentals, fundamentalScore } = calculateFundamentalAnalysis();
  const { news, newsScore, sentimentScore } = calculateNewsAnalysis(initialNewsItems);
  const { riskScore, riskLevel, riskLevelArabic, riskDrivers } = calculateGoldRiskIndex(
    indicators,
    supportResistance,
    initialEconomicEvents
  );
  const { forecasts, scenarios } = calculateMultiTimeframePredictions(
    currentPrice,
    indicators,
    supportResistance,
    macroScore,
    fundamentalScore,
    riskScore
  );

  const decisionData = synthesizeDecision(
    currentPrice,
    indicators,
    supportResistance,
    dollarAnalysis,
    yieldsAnalysis,
    fundamentals,
    news,
    initialEconomicEvents,
    forecasts,
    scenarios,
    currentSettings.weights
  );

  return {
    currentPrice,
    candles,
    indicators,
    supportResistance,
    dollarAnalysis,
    yieldsAnalysis,
    fundamentals,
    news,
    economicEvents: initialEconomicEvents,
    riskScore,
    riskLevel,
    riskLevelArabic,
    riskDrivers,
    forecasts,
    scenarios,
    decisionData,
  };
}

// ==================== API ROUTES ====================

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', symbol: 'XAU/USD', timestamp: new Date().toISOString() });
});

// 2. Current Price
app.get('/api/gold/current', (req, res) => {
  const price = getCurrentGoldPrice();
  res.json(price);
});

// 2.5 Live Real-time Pulse (Ultra-fast synchronization)
app.get('/api/gold/live-pulse', (req, res) => {
  const tf = (req.query.timeframe as Timeframe) || '1h';
  const price = getCurrentGoldPrice();
  const state = computeSystemState(tf);
  res.json({
    price,
    decision: state.decisionData,
    indicators: state.indicators,
    supportResistance: state.supportResistance,
    timestamp: Date.now(),
  });
});

// 3. Historical Candlesticks
app.get('/api/gold/history', (req, res) => {
  const tf = (req.query.timeframe as Timeframe) || '1h';
  const count = Number(req.query.count) || 80;
  const candles = generateHistoricalCandles(tf, count);
  res.json(candles);
});

// 4. Complete Unified Decision & Analysis
app.get('/api/gold/decision', (req, res) => {
  const state = computeSystemState((req.query.timeframe as Timeframe) || '1h');
  res.json(state.decisionData);
});

// 5. Technical Engine Data
app.get('/api/gold/technical', (req, res) => {
  const state = computeSystemState((req.query.timeframe as Timeframe) || '1h');
  res.json({
    indicators: state.indicators,
    supportResistance: state.supportResistance,
    technicalScore: state.decisionData.scores.technicalScore,
  });
});

// 6. Macro & Dollar Analysis
app.get('/api/gold/macro', (req, res) => {
  const { dollarAnalysis, yieldsAnalysis, macroScore, dollarScore } = calculateMacroAnalysis();
  res.json({
    dollarAnalysis,
    yieldsAnalysis,
    macroScore,
    dollarScore,
  });
});

// 7. Fundamental Gold Data
app.get('/api/gold/fundamentals', (req, res) => {
  const { fundamentals, fundamentalScore } = calculateFundamentalAnalysis();
  res.json({
    fundamentals,
    fundamentalScore,
  });
});

// 8. News Sentiment Engine
app.get('/api/gold/news', (req, res) => {
  const { news, newsScore, sentimentScore } = calculateNewsAnalysis(initialNewsItems);
  res.json({
    news,
    newsScore,
    sentimentScore,
  });
});

// 9. Economic Calendar
app.get('/api/economic-calendar', (req, res) => {
  res.json(initialEconomicEvents);
});

// 10. Risk Engine Data
app.get('/api/gold/risk', (req, res) => {
  const state = computeSystemState('1h');
  res.json({
    riskScore: state.riskScore,
    riskLevel: state.riskLevel,
    riskLevelArabic: state.riskLevelArabic,
    riskDrivers: state.riskDrivers,
  });
});

// 11. Prediction Records
app.get('/api/gold/predictions', (req, res) => {
  res.json(predictionHistory);
});

app.post('/api/gold/predictions/log', (req, res) => {
  const state = computeSystemState('1h');
  const newRecord: PredictionRecord = {
    id: `pred-${Date.now()}`,
    timestamp: Date.now(),
    dateStr: new Date().toISOString().split('T')[0],
    timeStr: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    priceAtPrediction: state.currentPrice.currentPrice,
    timeframe: (req.body.timeframe as Timeframe) || '1h',
    timeframeArabic: req.body.timeframeArabic || 'ساعة',
    decision: state.decisionData.decision,
    decisionType: state.decisionData.decisionType,
    upProb: state.decisionData.forecasts.find(f => f.timeframe === (req.body.timeframe || '1h'))?.upProbability || 68,
    downProb: state.decisionData.forecasts.find(f => f.timeframe === (req.body.timeframe || '1h'))?.downProbability || 20,
    neutralProb: 12,
    confidence: state.decisionData.confidenceScore,
    riskScore: state.decisionData.riskScore,
    primaryFactor: 'توافق مؤشرات الزخم الصاعد مع تراجع مؤشر الدولار DXY',
    actualRealizedPrice: null,
    isEvaluated: false,
    isCorrect: null,
    deviationPercent: null,
  };
  predictionHistory.unshift(newRecord);
  res.json({ success: true, record: newRecord });
});

// 12. Accuracy Performance Metrics
app.get('/api/gold/performance', (req, res) => {
  const metrics = calculateSystemAccuracy(predictionHistory);
  res.json(metrics);
});

// 13. Backtest Simulation
app.post('/api/gold/backtest', (req, res) => {
  const config: BacktestConfig = {
    timeframe: req.body.timeframe || '1h',
    periodDays: req.body.periodDays || 30,
    initialCapital: Number(req.body.initialCapital) || 10000,
    riskPercentPerTrade: Number(req.body.riskPercentPerTrade) || 2,
    stopLossAtrMultiplier: Number(req.body.stopLossAtrMultiplier) || 1.5,
    takeProfitAtrMultiplier: Number(req.body.takeProfitAtrMultiplier) || 2.5,
  };

  const candleCount = Math.min(250, config.periodDays * (config.timeframe === '15m' ? 40 : config.timeframe === '1h' ? 14 : 4));
  const historicalCandles = generateHistoricalCandles(config.timeframe, candleCount);
  const result = runHistoricalBacktest(historicalCandles, config);
  res.json(result);
});

// 14. Data Providers & MT5 Status
app.get('/api/gold/providers', (req, res) => {
  res.json({
    providers: initialDataProviders,
    mt5Config: currentSettings.mt5Config,
  });
});

// 15. AI Explanation Generator
app.post('/api/gold/ai-explain', async (req, res) => {
  try {
    const state = computeSystemState((req.body.timeframe as Timeframe) || '1h');
    const aiText = await generateAiGoldExplanation(state.decisionData);
    res.json({ explanation: aiText });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to generate AI analysis' });
  }
});

// 16. System Settings
app.get('/api/gold/settings', (req, res) => {
  res.json(currentSettings);
});

app.post('/api/gold/settings', (req, res) => {
  currentSettings = {
    ...currentSettings,
    ...req.body,
    weights: {
      ...currentSettings.weights,
      ...(req.body.weights || {}),
    },
    mt5Config: {
      ...currentSettings.mt5Config,
      ...(req.body.mt5Config || {}),
      readOnlyMode: true, // STRICT SAFETY GUARD: Always read-only
    },
  };
  res.json({ success: true, settings: currentSettings });
});

// ==================== VITE / STATIC SERVING ====================

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Gold Predictor Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
