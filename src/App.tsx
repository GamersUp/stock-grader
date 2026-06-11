import React, { useState, useEffect } from 'react';
import { QualityScores } from './components/QualityScores';
import { OpportunityScores } from './components/OpportunityScores';
import { SummaryDashboard } from './components/SummaryDashboard';
import { DataFetcher } from './components/DataFetcher';
import {
  defaultQualityMetrics,
  defaultOpportunityMetrics,
  defaultTechnicalMetrics,
} from './utils/calculations';
import { QualityMetrics, OpportunityMetrics, TechnicalMetrics, StockGrade } from './types/stock';
import { StockData } from './services/finnhubApi';
import { TechnicalAnalysis } from './services/technicalAnalysisApi';

const App: React.FC = () => {
  const [ticker, setTicker] = useState('');
  const [company, setCompany] = useState('');
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetrics>(
    defaultQualityMetrics
  );
  const [opportunityMetrics, setOpportunityMetrics] = useState<OpportunityMetrics>(
    defaultOpportunityMetrics
  );
  const [technicalMetrics, setTechnicalMetrics] = useState<TechnicalMetrics>(
    defaultTechnicalMetrics
  );
  const [notes, setNotes] = useState('');
  const [savedGrades, setSavedGrades] = useState<StockGrade[]>([]);
  const [error, setError] = useState('');
  const [stockData, setStockData] = useState<StockData | null>(null);

  // Load saved grades from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('stockGrades');
    if (stored) {
      setSavedGrades(JSON.parse(stored));
    }
  }, []);

  // Handle data fetch from API
  const handleDataFetch = (
    fetchedStockData: StockData,
    technicalData: TechnicalAnalysis,
    autoQualityMetrics: QualityMetrics,
    autoOpportunityMetrics: OpportunityMetrics
  ) => {
    setTicker(fetchedStockData.ticker);
    setCompany(fetchedStockData.company);
    setQualityMetrics(autoQualityMetrics);
    setOpportunityMetrics(autoOpportunityMetrics);
    setTechnicalMetrics(technicalData);
    setStockData(fetchedStockData);
    setError('');
    setNotes(`Fetched on ${new Date().toLocaleDateString()}`);
  };

  // Save current grade to localStorage
  const handleSaveGrade = () => {
    if (!ticker.trim()) {
      setError('Please enter a stock ticker');
      return;
    }

    const newGrade: StockGrade = {
      ticker: ticker.toUpperCase(),
      company,
      date: new Date().toISOString().split('T')[0],
      qualityMetrics,
      opportunityMetrics,
      technicalMetrics,
      managementMetrics: {
        capitalAllocation: 0,
        insiderActivity: 'Neutral',
        shareholderReturn: 0
      },
      notes: notes || ''
    };

    const updated = [...savedGrades, newGrade];
    setSavedGrades(updated);
    localStorage.setItem('stockGrades', JSON.stringify(updated));
    setError('');
    alert(`Grade saved for ${ticker}!`);
  };

  // Load a saved grade
  const handleLoadGrade = (grade: StockGrade) => {
    setTicker(grade.ticker);
    setCompany(grade.company);
    setQualityMetrics(grade.qualityMetrics);
    setOpportunityMetrics(grade.opportunityMetrics);
    setTechnicalMetrics(grade.technicalMetrics);
    setNotes(grade.notes);
    setError('');
    setStockData(null);
  };

  // Reset form
  const handleReset = () => {
    setTicker('');
    setCompany('');
    setQualityMetrics(defaultQualityMetrics);
    setOpportunityMetrics(defaultOpportunityMetrics);
    setTechnicalMetrics(defaultTechnicalMetrics);
    setNotes('');
    setError('');
    setStockData(null);
  };

  // Delete a saved grade
  const handleDeleteGrade = (index: number) => {
    const updated = savedGrades.filter((_, i) => i !== index);
    setSavedGrades(updated);
    localStorage.setItem('stockGrades', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg mb-8 shadow-lg">
          <h1 className="text-5xl font-bold mb-2">📈 Stock Grader</h1>
          <p className="text-lg opacity-90">
            Dual-Scoring System: Separate Quality from Opportunity + Auto-Fetch Financial Data
          </p>
        </div>

        {/* Data Fetcher */}
        <DataFetcher
          onDataFetch={handleDataFetch}
          onError={setError}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Stock Data Display */}
        {stockData && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-l-4 border-indigo-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Fetched Data</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Current Price</p>
                <p className="text-xl font-bold text-blue-600">${stockData.currentPrice.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">P/E Ratio</p>
                <p className="text-xl font-bold text-blue-600">{stockData.pe.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">52-Week High</p>
                <p className="text-xl font-bold text-green-600">${stockData.fiftyTwoWeekHigh.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">52-Week Low</p>
                <p className="text-xl font-bold text-red-600">${stockData.fiftyTwoWeekLow.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Revenue Growth</p>
                <p className="text-xl font-bold text-purple-600">{stockData.revenueGrowth.toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">EPS Growth</p>
                <p className="text-xl font-bold text-purple-600">{stockData.epsGrowth.toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ROE</p>
                <p className="text-xl font-bold text-orange-600">{stockData.roe.toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gross Margin</p>
                <p className="text-xl font-bold text-orange-600">{stockData.grossMargin.toFixed(2)}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Stock Input */}
        {!stockData && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Stock Ticker
                </label>
                <input
                  type="text"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  placeholder="e.g., AAPL"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g., Apple Inc."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={handleSaveGrade}
                  className="flex-1 px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                  💾 Save Grade
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
                >
                  🔄 Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Saved Grades */}
        {savedGrades.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">📚 Saved Grades</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedGrades.map((grade, idx) => (
                <div
                  key={idx}
                  className="border border-gray-300 p-4 rounded-lg hover:shadow-lg transition cursor-pointer"
                >
                  <h3 className="text-lg font-bold text-gray-800">{grade.ticker}</h3>
                  <p className="text-sm text-gray-600">{grade.company}</p>
                  <p className="text-xs text-gray-500 mb-3">{grade.date}</p>
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => handleLoadGrade(grade)}
                      className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm font-semibold rounded hover:bg-blue-600 transition"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDeleteGrade(idx)}
                      className="flex-1 px-3 py-2 bg-red-500 text-white text-sm font-semibold rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scoring Sections */}
        {ticker && (
          <>
            <QualityScores
              metrics={qualityMetrics}
              onUpdate={setQualityMetrics}
            />
            <OpportunityScores
              metrics={opportunityMetrics}
              onUpdate={setOpportunityMetrics}
            />
            <SummaryDashboard
              ticker={ticker}
              company={company}
              qualityMetrics={qualityMetrics}
              opportunityMetrics={opportunityMetrics}
              notes={notes}
              onNotesChange={setNotes}
            />
          </>
        )}

        {!ticker && !stockData && (
          <div className="bg-blue-50 p-8 rounded-lg text-center border-2 border-blue-200">
            <p className="text-lg text-gray-700">
              Use the data fetcher above or enter a stock ticker manually to get started →
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
