import React, { useState } from 'react';
import { fetchStockData, StockData } from '../services/finnhubApi';
import { calculateTechnicalIndicators, TechnicalAnalysis } from '../services/technicalAnalysisApi';
import { QualityMetrics, OpportunityMetrics } from '../types/stock';

interface DataFetcherProps {
  onDataFetch: (
    stockData: StockData,
    technicalData: TechnicalAnalysis,
    qualityMetrics: QualityMetrics,
    opportunityMetrics: OpportunityMetrics
  ) => void;
  onError: (error: string) => void;
}

export const DataFetcher: React.FC<DataFetcherProps> = ({ onDataFetch, onError }) => {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFetchData = async () => {
    if (!ticker.trim()) {
      onError('Please enter a stock ticker');
      return;
    }

    setLoading(true);
    try {
      const [stockData, technicalData] = await Promise.all([
        fetchStockData(ticker),
        calculateTechnicalIndicators(ticker),
      ]);

      if (stockData.error) {
        onError(stockData.error);
        setLoading(false);
        return;
      }

      // Auto-populate quality metrics
      const qualityMetrics: QualityMetrics = {
        revenueGrowth: Math.min(Math.max(Math.round((stockData.revenueGrowth / 25) * 6), 0), 6),
        epsGrowth: Math.min(Math.max(Math.round((stockData.epsGrowth / 25) * 6), 0), 6),
        grossMarginTrend: 2,
        operatingMarginTrend: 2,
        roe: Math.min(Math.max(Math.round((stockData.roe / 30) * 5), 0), 5),
        balanceSheet: stockData.netDebt < 1 ? 5 : stockData.netDebt < 2 ? 3 : 0,
        shareCountTrend: 3,
        returningCapital: 3,
        industryRelativeStrength: 3,
        riskDeductions: 0,
      };

      // 1. Translate Insider Transactions to 0-5 Score
      let insiderScore = 2; // Defaults to Neutral if Finnhub provides no data
      if (stockData.insiderNetSharesBought > 50000) {
        insiderScore = 5; 
      } else if (stockData.insiderNetSharesBought > 0) {
        insiderScore = 4; 
      } else if (stockData.insiderNetSharesBought < 0) {
        insiderScore = 0; 
      }

      // 2. Translate Analyst Ratings to 0-5 Score
      let analystScore = 3; 
      const totalRatings = stockData.analystBuys + stockData.analystHolds + stockData.analystSells;
      if (totalRatings > 0) {
        const buyRatio = stockData.analystBuys / totalRatings;
        const sellRatio = stockData.analystSells / totalRatings;

        if (buyRatio > 0.75) analystScore = 5;
        else if (buyRatio > 0.5) analystScore = 4;
        else if (sellRatio > 0.3) analystScore = 0;
        else analystScore = 2;
      }

      // 3. Technical Strength & Volume (0 to 3 scale)
      let techScore = 0;
      if (technicalData.relativeStrengthRank >= 60) techScore += 2;
      else if (technicalData.relativeStrengthRank >= 45) techScore += 1;
      
      if (technicalData.accumulationVolume === 'uptrend') techScore += 1;
      else if (technicalData.accumulationVolume === 'downtrend') techScore -= 1;
      
      techScore = Math.min(Math.max(techScore, 0), 3); // Clamps between 0 and 3

      // 4. Moving Averages (0 to 3 scale)
      let maScore = 0;
      if (technicalData.above50DMA && technicalData.above150DMA && technicalData.above200DMA) {
        maScore = 3; // Above all
      } else if (technicalData.above50DMA && technicalData.above150DMA) {
        maScore = 2; // Above 50 & 150
      } else if (technicalData.above50DMA) {
        maScore = 1; // Above 50
      }

      const fiftyTwoWeekRange = stockData.fiftyTwoWeekHigh - stockData.fiftyTwoWeekLow;
      const distanceFromHigh = fiftyTwoWeekRange > 0 
        ? ((stockData.fiftyTwoWeekHigh - stockData.currentPrice) / fiftyTwoWeekRange) * 100 
        : 0;

      // Final Metric Assignment
      const opportunityMetrics: OpportunityMetrics = {
        distanceFrom52High: Math.min(Math.max(Math.round((distanceFromHigh / 50) * 5), 0), 5),
        valuationDiscount: stockData.pe > 0 ? Math.min(Math.max(Math.round((20 / stockData.pe) * 5), 0), 5) : 2,
        insiderBuying: insiderScore,
        analystRevisions: analystScore,
        postEarningsReaction: 0, // Left at 0 so you can grade the chart manually
        marginOfSafety: Math.min(Math.max(Math.round((distanceFromHigh / 40) * 5), 0), 5),
        movingAverages: maScore,
        technicalStrength: techScore,
      };

      onDataFetch(stockData, technicalData, qualityMetrics, opportunityMetrics);
      setTicker('');
    } catch (error) {
      onError('Failed to fetch data. Please check your API keys and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg shadow-md mb-6 border-2 border-indigo-200">
      <h2 className="text-xl font-bold text-indigo-900 mb-4">🔍 Auto-Fetch Financial Data</h2>
      <div className="flex gap-3">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          onKeyPress={(e) => e.key === 'Enter' && handleFetchData()}
          placeholder="Enter ticker (e.g., AAPL, MSFT)"
          className="flex-1 p-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={loading}
        />
        <button
          onClick={handleFetchData}
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? '⏳ Fetching...' : '📊 Fetch Data'}
        </button>
      </div>
      <p className="text-sm text-indigo-700 mt-3">
        💡 Tip: Auto-fetches Revenue Growth, EPS Growth, ROE, P/E, 52-week range, and technical indicators. Adjust other metrics as needed.
      </p>
    </div>
  );
};
