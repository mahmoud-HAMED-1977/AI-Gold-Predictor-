import {
  BacktestConfig,
  BacktestResult,
  BacktestTrade,
  OHLCVCandle,
} from '../../src/types';

export function runHistoricalBacktest(
  candles: OHLCVCandle[],
  config: BacktestConfig
): BacktestResult {
  let equity = config.initialCapital;
  let peakEquity = equity;
  let maxDrawdownPercent = 0;
  const equityCurve: { time: string; equity: number; drawdown: number }[] = [];
  const trades: BacktestTrade[] = [];

  // Minimum required lookback window to prevent look-ahead bias
  const lookback = 20;
  let currentPosition: {
    type: 'BUY' | 'SELL';
    entryPrice: number;
    entryTime: string;
    stopLoss: number;
    takeProfit: number;
    sizeLots: number;
  } | null = null;

  equityCurve.push({
    time: candles[lookback]?.time || 'بداية',
    equity: Math.round(equity),
    drawdown: 0,
  });

  for (let i = lookback; i < candles.length; i++) {
    const prevSlice = candles.slice(i - lookback, i);
    const currentCandle = candles[i];
    const prevCloses = prevSlice.map(c => c.close);

    // Calculate dynamic ATR on historical slice only (no future data)
    let trSum = 0;
    for (let k = 1; k < prevSlice.length; k++) {
      const h = prevSlice[k].high;
      const l = prevSlice[k].low;
      const pc = prevSlice[k - 1].close;
      trSum += Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc));
    }
    const atr = Math.max(4, trSum / (prevSlice.length - 1));

    // Calculate short & long SMA on historical slice
    const smaFast = prevCloses.slice(-5).reduce((a, b) => a + b, 0) / 5;
    const smaSlow = prevCloses.slice(-15).reduce((a, b) => a + b, 0) / 15;
    const prevFast = prevCloses.slice(-6, -1).reduce((a, b) => a + b, 0) / 5;
    const prevSlow = prevCloses.slice(-16, -1).reduce((a, b) => a + b, 0) / 15;

    // Check open position exit rules first
    if (currentPosition) {
      let isExit = false;
      let exitPrice = currentCandle.close;
      let exitReason = '';

      if (currentPosition.type === 'BUY') {
        if (currentCandle.low <= currentPosition.stopLoss) {
          exitPrice = currentPosition.stopLoss;
          exitReason = 'وقف الخسارة (Stop Loss)';
          isExit = true;
        } else if (currentCandle.high >= currentPosition.takeProfit) {
          exitPrice = currentPosition.takeProfit;
          exitReason = 'جني الأرباح (Take Profit)';
          isExit = true;
        }
      } else {
        if (currentCandle.high >= currentPosition.stopLoss) {
          exitPrice = currentPosition.stopLoss;
          exitReason = 'وقف الخسارة (Stop Loss)';
          isExit = true;
        } else if (currentCandle.low <= currentPosition.takeProfit) {
          exitPrice = currentPosition.takeProfit;
          exitReason = 'جني الأرباح (Take Profit)';
          isExit = true;
        }
      }

      if (isExit || i === candles.length - 1) {
        if (!isExit) {
          exitPrice = currentCandle.close;
          exitReason = 'إغلاق نهاية الفترة';
        }

        const delta = currentPosition.type === 'BUY'
          ? exitPrice - currentPosition.entryPrice
          : currentPosition.entryPrice - exitPrice;

        // Standard gold contract: 100 oz per standard lot
        const profitDollar = Number((delta * currentPosition.sizeLots * 100).toFixed(2));
        const profitPercent = Number(((profitDollar / equity) * 100).toFixed(2));
        equity += profitDollar;

        if (equity > peakEquity) peakEquity = equity;
        const currentDrawdown = peakEquity > 0 ? ((peakEquity - equity) / peakEquity) * 100 : 0;
        if (currentDrawdown > maxDrawdownPercent) maxDrawdownPercent = currentDrawdown;

        trades.push({
          id: `trade-${trades.length + 1}`,
          entryTime: currentPosition.entryTime,
          exitTime: currentCandle.time,
          type: currentPosition.type,
          typeArabic: currentPosition.type === 'BUY' ? 'شراء' : 'بيع',
          entryPrice: Number(currentPosition.entryPrice.toFixed(2)),
          exitPrice: Number(exitPrice.toFixed(2)),
          sizeLots: currentPosition.sizeLots,
          profitDollar,
          profitPercent,
          reason: exitReason,
          isWin: profitDollar > 0,
        });

        currentPosition = null;
      }
    }

    // Check entry signal if no active position
    if (!currentPosition && i < candles.length - 1) {
      const riskDollar = equity * (config.riskPercentPerTrade / 100);
      const stopLossDistance = atr * (config.stopLossAtrMultiplier || 1.5);
      const takeProfitDistance = atr * (config.takeProfitAtrMultiplier || 2.5);
      const calculatedLots = Math.max(0.1, Number((riskDollar / (stopLossDistance * 100)).toFixed(2)));

      // Golden Cross entry signal (no look-ahead)
      if (prevFast <= prevSlow && smaFast > smaSlow) {
        currentPosition = {
          type: 'BUY',
          entryPrice: currentCandle.close,
          entryTime: currentCandle.time,
          stopLoss: currentCandle.close - stopLossDistance,
          takeProfit: currentCandle.close + takeProfitDistance,
          sizeLots: Math.min(2.0, calculatedLots),
        };
      }
      // Death Cross entry signal
      else if (prevFast >= prevSlow && smaFast < smaSlow) {
        currentPosition = {
          type: 'SELL',
          entryPrice: currentCandle.close,
          entryTime: currentCandle.time,
          stopLoss: currentCandle.close + stopLossDistance,
          takeProfit: currentCandle.close - takeProfitDistance,
          sizeLots: Math.min(2.0, calculatedLots),
        };
      }
    }

    // Sample equity curve
    if (i % Math.max(1, Math.floor(candles.length / 25)) === 0 || i === candles.length - 1) {
      if (equity > peakEquity) peakEquity = equity;
      const dd = peakEquity > 0 ? ((peakEquity - equity) / peakEquity) * 100 : 0;
      equityCurve.push({
        time: currentCandle.time,
        equity: Math.round(equity),
        drawdown: Number(dd.toFixed(1)),
      });
    }
  }

  const winningTrades = trades.filter(t => t.isWin);
  const losingTrades = trades.filter(t => !t.isWin);
  const totalTrades = trades.length;
  const winRate = totalTrades > 0 ? Number(((winningTrades.length / totalTrades) * 100).toFixed(1)) : 0;

  const grossProfit = winningTrades.reduce((acc, t) => acc + t.profitDollar, 0);
  const grossLoss = Math.abs(losingTrades.reduce((acc, t) => acc + t.profitDollar, 0));
  const profitFactor = grossLoss > 0 ? Number((grossProfit / grossLoss).toFixed(2)) : grossProfit > 0 ? 9.99 : 0;

  const totalReturnDollar = Number((equity - config.initialCapital).toFixed(2));
  const totalReturnPercent = Number(((totalReturnDollar / config.initialCapital) * 100).toFixed(2));

  const bestTradeDollar = trades.length > 0 ? Math.max(...trades.map(t => t.profitDollar)) : 0;
  const worstTradeDollar = trades.length > 0 ? Math.min(...trades.map(t => t.profitDollar)) : 0;
  const averageTradeDollar = trades.length > 0 ? Number((totalReturnDollar / trades.length).toFixed(2)) : 0;

  return {
    config,
    totalTrades,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    winRate,
    profitFactor,
    maxDrawdownPercent: Number(maxDrawdownPercent.toFixed(2)),
    totalReturnDollar,
    totalReturnPercent,
    bestTradeDollar,
    worstTradeDollar,
    averageTradeDollar,
    equityCurve,
    trades: trades.reverse(), // Most recent first
  };
}
