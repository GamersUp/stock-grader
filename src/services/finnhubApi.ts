import axios from 'axios';

const FINNHUB_API_KEY = process.env.REACT_APP_FINNHUB_API_KEY || 'demo';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

export interface StockData {
  ticker: string;
  company: string;
  revenueGrowth: number; // YoY revenue growth %
  epsGrowth: number; // YoY EPS growth %
  grossMargin: number; // Current gross margin %
  operatingMargin: number; // Current operating margin %
  roe: number; // Return on equity %
  netDebt: number; // Net debt
  totalAssets: number; // Total assets
  shares: number; // Shares outstanding
  currentPrice: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  pe: number; // P/E ratio
  pb: number; // Price to book
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
        fiftyTwoWeekHigh: quote?.h52 || 0,
        fiftyTwoWeekLow: quote?.l52 || 0,
        pe: quote?.pe || 0,
        pb: financials?.metric?.pbRatio || 0,
        error: 'Unable to fetch complete data. Verify ticker symbol.',
      };
    }

    // Extract metrics from Finnhub data
    const metric = financials.metric || {};
    const roic = metric.roic || 0;
    const roe = metric.roe || 0;
    const grossMargin = metric.grossMargin || 0;
    const operatingMargin = metric.operatingMarginTTM || 0;
    const revenueGrowth = metric.revenueGrowth5Y || 0;
    const epsGrowth = metric.epsGrowth5Y || 0;

    return {
      ticker: ticker.toUpperCase(),
      company: profile.name || 'Unknown',
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      epsGrowth: Math.round(epsGrowth * 100) / 100,
      grossMargin: Math.round(grossMargin * 10000) / 100,
      operatingMargin: Math.round(operatingMargin * 10000) / 100,
      roe: Math.round(roe * 10000) / 100,
      netDebt: metric.debtToEquity || 0,
      totalAssets: metric.totalAssets || 0,
      shares: metric.shareOutstandingTTM || 0,
      currentPrice: quote.c || 0,
      fiftyTwoWeekHigh: quote.h52 || 0,
      fiftyTwoWeekLow: quote.l52 || 0,
      pe: quote.pe || 0,
      pb: metric.pbRatio || 0,
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
