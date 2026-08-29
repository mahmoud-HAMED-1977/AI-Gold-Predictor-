import { goldFundamentalsData } from '../data/historicalData';
import { GoldFundamentals } from '../../src/types';

export function calculateFundamentalAnalysis(): {
  fundamentals: GoldFundamentals;
  fundamentalScore: number;
} {
  // Score based on Central Bank purchases, ETF net inflows, physical demand and geopolitical hedge value
  const baseScore = goldFundamentalsData.fundamentalScore; // 84/100
  return {
    fundamentals: goldFundamentalsData,
    fundamentalScore: baseScore,
  };
}
