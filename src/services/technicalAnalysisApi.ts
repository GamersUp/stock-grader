import axios from 'axios';

const ALPHA_VANTAGE_API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY || 'demo';
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

export interface TechnicalAnalysis {
  above50DMA: boolean;
  above150DMA: boolean;
  above200DMA: boolean;
  relativeStrengthRank: number;
  accumulationVolume: 'uptrend' | 'flat' | 'downtrend';
}

// Fetch daily time series data
export const fetchDailyData = async (ticker: string): Promise<any> => {
  try {
    const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: ticker.toUpperCase(),
        apikey: ALPHA_VANTAGE_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching daily data:', error);
    return null;
  }
};

// Calculate moving averages and technical indicators
export const calculateTechnicalIndicators = async (
  ticker: string
): Promise<TechnicalAnalysis> => {
  try {
    const data = await fetchDailyData(ticker);

    if (!data || !data['Time Series (Daily)']) {
      return {
        above50DMA: false,
        above150DMA: false,
        above200DMA: false,
        relativeStrengthRank: 0,
        accumulationVolume: 'flat',
      };
    }

    const timeSeries = data['Time Series (Daily)'];
    const dates = Object.keys(timeSeries).slice(0, 200);

    const prices = dates.map((date) => parseFloat(timeSeries[date]['4. close']));
    const currentPrice = prices[0];

    // Calculate moving averages
    const ma50 = prices.slice(0, 50).reduce((a, b) => a + b) / 50;
    const ma150 = prices.slice(0, 150).reduce((a, b) => a + b) / 150;
    const ma200 = prices.slice(0, 200).reduce((a, b) => a + b) / 200;

    // Calculate RSI (14-period)
    const rsiPeriod = 14;
    const changes = [];
    for (let i = 0; i < rsiPeriod; i++) {
      changes.push(prices[i] - prices[i + 1]);
    }

    const gains = changes.filter((c) => c > 0).reduce((a, b) => a + b, 0) / rsiPeriod;
    const losses = Math.abs(
      changes.filter((c) => c < 0).reduce((a, b) => a + b, 0) / rsiPeriod
    );
    const rs = gains / (losses || 1);
    const rsi = 100 - 100 / (1 + rs);

    // Calculate volume trend
    const recentVolumes = dates.slice(0, 20).map((date) => 
      parseFloat(timeSeries[date]['5. volume'])
    );
    const avgRecentVolume = recentVolumes.reduce((a, b) => a + b) / 20;
    const maxRecentVolume = Math.max(...recentVolumes);
    const accumulationVolume =
      maxRecentVolume > avgRecentVolume * 1.3
        ? 'uptrend'
        : maxRecentVolume < avgRecentVolume * 0.7
        ? 'downtrend'
        : 'flat';

    return {
      above50DMA: currentPrice > ma50,
      above150DMA: currentPrice > ma150,
      above200DMA: currentPrice > ma200,
      relativeStrengthRank: Math.round(rsi),
      accumulationVolume,
    };
  } catch (error) {
    console.error('Error calculating technical indicators:', error);
    return {
      above50DMA: false,
      above150DMA: false,
      above200DMA: false,
      relativeStrengthRank: 0,
      accumulationVolume: 'flat',
    };
  }
};
