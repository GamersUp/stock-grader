import React from 'react';
import { calculateQualityScore, calculateOpportunityScore, getRecommendation } from '../utils/calculations';
import { QualityMetrics, OpportunityMetrics } from '../types/stock';

interface SummaryDashboardProps {
  ticker: string;
  company: string;
  qualityMetrics: QualityMetrics;
  opportunityMetrics: OpportunityMetrics;
  notes: string;
  onNotesChange: (notes: string) => void;
}

export const SummaryDashboard: React.FC<SummaryDashboardProps> = ({
  ticker,
  company,
  qualityMetrics,
  opportunityMetrics,
  notes,
  onNotesChange,
}) => {
  const qualityScore = calculateQualityScore(qualityMetrics);
  const opportunityScore = calculateOpportunityScore(opportunityMetrics);
  const recommendation = getRecommendation(qualityScore, opportunityScore);

  const handleExportJSON = () => {
    const data = {
      ticker,
      company,
      date: new Date().toISOString().split('T')[0],
      qualityScore,
      opportunityScore,
      qualityPercentage: ((qualityScore / 60) * 100).toFixed(1),
      opportunityPercentage: ((opportunityScore / 40) * 100).toFixed(1),
      recommendation,
      qualityMetrics,
      opportunityMetrics,
      notes,
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ticker}-grade-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Stock Grading Report', `${ticker} - ${company}`],
      ['Date', new Date().toISOString().split('T')[0]],
      [],
      ['Quality Score', qualityScore, '/ 60'],
      ['Quality %', ((qualityScore / 60) * 100).toFixed(1) + '%'],
      [],
      ['Opportunity Score', opportunityScore, '/ 40'],
      ['Opportunity %', ((opportunityScore / 40) * 100).toFixed(1) + '%'],
      [],
      ['Recommendation', recommendation],
      [],
      ['Notes', notes],
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ticker}-grade-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const qualityPercentage = ((qualityScore / 60) * 100).toFixed(1);
  const opportunityPercentage = ((opportunityScore / 40) * 100).toFixed(1);

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800">{ticker}</h1>
        <p className="text-lg text-gray-600">{company}</p>
        <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Quality Score */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-lg font-bold text-blue-900 mb-4">Quality Score</h2>
          <div className="flex items-end gap-4">
            <div>
              <div className="text-5xl font-bold text-blue-600">{qualityScore}</div>
              <div className="text-sm text-gray-600">out of 60</div>
            </div>
            <div className="flex-1">
              <div className="text-3xl font-bold text-blue-400">{qualityPercentage}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.min(Number(qualityPercentage), 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Opportunity Score */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-lg font-bold text-green-900 mb-4">Opportunity Score</h2>
          <div className="flex items-end gap-4">
            <div>
              <div className="text-5xl font-bold text-green-600">{opportunityScore}</div>
              <div className="text-sm text-gray-600">out of 40</div>
            </div>
            <div className="flex-1">
              <div className="text-3xl font-bold text-green-400">{opportunityPercentage}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${Math.min(Number(opportunityPercentage), 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

      {/* Recommendation */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 text-center">
        <h2 className="text-lg font-bold text-gray-800 mb-3">Recommendation</h2>
        <div className="text-2xl font-bold text-gray-800">{recommendation}</div>
      </div>

      {/* Notes */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <label className="block text-sm font-bold text-gray-700 mb-3">
          Investment Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Add any additional notes about this stock..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>

      {/* Export Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={handleExportJSON}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          📥 Export as JSON
        </button>
        <button
          onClick={handleExportCSV}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
        >
          📥 Export as CSV
        </button>
      </div>
    </div>
  );
};
