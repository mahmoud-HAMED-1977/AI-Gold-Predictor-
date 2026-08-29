import { initialNewsItems } from '../data/historicalData';
import { NewsItem } from '../../src/types';

export function calculateNewsAnalysis(customNews?: NewsItem[]): {
  news: NewsItem[];
  newsScore: number;
  sentimentScore: number;
} {
  const newsList = customNews && customNews.length > 0 ? customNews : initialNewsItems;

  let weightedSentimentSum = 0;
  let totalWeight = 0;

  for (const item of newsList) {
    const sentimentMultiplier = item.sentiment === 'POSITIVE' ? 1 : item.sentiment === 'NEGATIVE' ? -1 : 0;
    const impactWeight = item.impactScore / 100;
    weightedSentimentSum += sentimentMultiplier * impactWeight * 50; // Scale -50 to +50
    totalWeight += impactWeight;
  }

  const avgSentiment = totalWeight > 0 ? weightedSentimentSum / totalWeight : 0;
  // Convert -50..+50 to 0..100 scale
  const newsScore = Math.round(Math.min(95, Math.max(10, 50 + avgSentiment)));
  const sentimentScore = Math.round(newsScore * 0.95);

  return {
    news: newsList,
    newsScore,
    sentimentScore,
  };
}
