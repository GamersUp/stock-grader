import axios from 'axios';

const FINNHUB_API_KEY = process.env.REACT_APP_FINNHUB_API_KEY || 'demo';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

export interface StockData {
  ticker: string;
  company: string;
  revenueGrowth: number;
  epsGrowth: number;
  grossMargin: number;
  operatingMargin: number;
  roe: number;
  netDebt: number;
  totalAssets: number;
  shares: number;
  currentPrice: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  pe: number;
  pb: number;
  error?: string;
}

// Fetch company profile and basic info
export const fetchCompanyProfile = async (ticker: string): Promise<any> => {
  try {
    const response = await axios.get(`${FINNHUB_BASE_URL}/company-profile2`, {
      params: {
        symbol: ticker.toUpperCase(),
        token: FINNHUB_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching company profile:', error);
    return null;
  }
};

// Fetch quote (price, 52-week high/low, etc.)
export const fetchQuote = async (ticker: string): Promise<any> => {
  try {
    const response = await axios.get(`${FINNHUB_BASE_URL}/quote`, {
      params: {
        symbol: ticker.toUpperCase(),
        token: FINNHUB_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching quote:', error);
    return null;
  }
};

// Fetch financial metrics (fundamentals)
export const fetchFinancials = async (ticker: string): Promise<any> => {
  try {
    const response = await axios.get(
      `${FINNHUB_BASE_URL}/stock/metric`,
      {
        params: {
          symbol: ticker.toUpperCase(),
          metric: 'all',
          token: FINNHUB_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching financials:', error);
    return null;
  }
};

// Fetch insider transactions
export const fetchInsiderTransactions = async (ticker: string): Promise<any> => {
  try {
    const response = await axios.get(
      `${FINNHUB_BASE_URL}/stock/insider-transactions`,
      {
        params: {
          symbol: ticker.toUpperCase(),
          token: FINNHUB_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching insider transactions:', error);
    return null;
  }
};

// Fetch recommendation trends (analyst ratings)
export const fetchRecommendations = async (ticker: string): Promise<any> => {
  try {
    const response = await axios.get(
      `${FINNHUB_BASE_URL}/stock/recommendation`,
      {
        params: {
          symbol: ticker.toUpperCase(),
          token: FINNHUB_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return null;
  }
};

// Main function to aggregate all data
export const fetchStockData = async (ticker: string): Promise<StockData> => {
  try {
    const [profile, quote, financials] = await Promise.all([
      fetchCompanyProfile(ticker),
      fetchQuote(ticker),
      fetchFinancials(ticker),
    ]);

    if (!profile || !quote || !financials) {
      return {
        ticker: ticker.toUpperCase(),
        company: 'Unknown',
        revenueGrowth: 0,
        epsGrowth: 0,
        grossMargin: 0,
        operatingMargin: 0,
        roe: 0,
        netDebt: 0,
        totalAssets: 0,
        shares: 0,
        currentPrice: quote?.c || 0,
        fiftyTwoWeekHigh: financials?.metric?.['52WeekHigh'] || 0,
        fiftyTwoWeekLow: financials?.metric?.['52WeekLow'] || 0,
        pe: financials?.metric?.peExclExtraTTM || 0,
        pb: financials?.metric?.pbAnnual || financials?.metric?.pbRatio || 0,
        error: 'Unable to fetch complete data. Verify ticker symbol.',
      };
    }

    // Extract metrics from Finnhub data
    const metric = financials.metric || {};
    
    // Corrected Finnhub API keys
    const roe = metric.roeTTM || metric.roeAnnual || 0;
    const grossMargin = metric.grossMarginTTM || metric.grossMarginAnnual || 0;
    const operatingMargin = metric.operatingMarginTTM || metric.operatingMarginAnnual || 0;
    const revenueGrowth = metric.revenueGrowth5Y || metric.revenueGrowth3Y || 0;
    const epsGrowth = metric.epsGrowth5Y || metric.epsGrowth3Y || 0;
    
    // 52-week data and PE live in the metric object, NOT the quote object
    const fiftyTwoWeekHigh = metric['52WeekHigh'] || 0;
    const fiftyTwoWeekLow = metric['52WeekLow'] || 0;
    const pe = metric.peExclExtraTTM || metric.peNormalizedAnnual || 0;

    return {
      ticker: ticker.toUpperCase(),
      company: profile.name || 'Unknown',
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      epsGrowth: Math.round(epsGrowth * 100) / 100,
      grossMargin: Math.round(grossMargin * 100) / 100,
      operatingMargin: Math.round(operatingMargin * 100) / 100,
      roe: Math.round(roe * 10000) / 100,
      netDebt: metric.netDebt || metric.debtToEquity || 0,
      totalAssets: metric.totalAssets || 0,
      shares: metric.shareOutstandingTTM || metric.shareOutstanding || 0,
      currentPrice: quote.c || 0,
      fiftyTwoWeekHigh: fiftyTwoWeekHigh,
      fiftyTwoWeekLow: fiftyTwoWeekLow,
      pe: Math.round(pe * 100) / 100, // Rounded cleanly to 2 decimals
      pb: metric.pbAnnual || metric.pbRatio || 0,
    };
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return {
      ticker: ticker.toUpperCase(),
      company: 'Error',
      revenueGrowth: 0,
      epsGrowth: 0,
      grossMargin: 0,
      operatingMargin: 0,
      roe: 0,
      netDebt: 0,
      totalAssets: 0,
      shares: 0,
      currentPrice: 0,
      fiftyTwoWeekHigh: 0,
      fiftyTwoWeekLow: 0,
      pe: 0,
      pb: 0,
      error: 'Failed to fetch data. Please try again.',
    };
  }
};
