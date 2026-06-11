import React from 'react';
import { ScoreMetric, SelectMetric } from './MetricInputs';
import { QualityMetrics } from '../types/stock';

interface QualityScoresProps {
  metrics: QualityMetrics;
  onUpdate: (metrics: QualityMetrics) => void;
}

export const QualityScores: React.FC<QualityScoresProps> = ({ metrics, onUpdate }) => {
  const updateMetric = (key: keyof QualityMetrics, value: number) => {
    onUpdate({ ...metrics, [key]: value });
  };

  return (
    <div className="bg-blue-50 p-6 rounded-lg mb-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-900">📊 Business Quality (0-60 pts)</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ScoreMetric
          label="Revenue Growth (YoY)"
          value={metrics.revenueGrowth}
          max={6}
          onChange={(val) => updateMetric('revenueGrowth', val)}
          description="0pts: Negative | 2pts: 0-5% | 3pts: 5-10% | 4pts: 10-15% | 5pts: 15-20% | 6pts: >20%"
        />

        <ScoreMetric
          label="EPS Growth (YoY)"
          value={metrics.epsGrowth}
          max={6}
          onChange={(val) => updateMetric('epsGrowth', val)}
          description="0pts: Negative | 2pts: 0-5% | 4pts: 5-15% | 5pts: 15-25% | 6pts: >25%"
        />

        <ScoreMetric
          label="Gross Margin Trend"
          value={metrics.grossMarginTrend}
          max={4}
          onChange={(val) => updateMetric('grossMarginTrend', val)}
          description="0pts: Worse | 1pt: -1% | 2pts: Flat | 3pts: +1-2% | 4pts: +2%+"
        />

        <ScoreMetric
          label="Operating Margin Trend"
          value={metrics.operatingMarginTrend}
          max={4}
          onChange={(val) => updateMetric('operatingMarginTrend', val)}
          description="0pts: Worse | 1pt: -1% | 2pts: Flat | 3pts: +1-2% | 4pts: +2%+"
        />

        <ScoreMetric
          label="Return on Equity"
          value={metrics.roe}
          max={5}
          onChange={(val) => updateMetric('roe', val)}
          description="0pts: <10% | 2pts: 10-15% | 3pts: 15-20% | 4pts: 20-25% | 5pts: >25%"
        />

        <ScoreMetric
          label="Balance Sheet (Net Debt/EBITDA)"
          value={metrics.balanceSheet}
          max={5}
          onChange={(val) => updateMetric('balanceSheet', val)}
          description="0pts: >3x | 2pts: 2-3x | 3pts: 1-2x | 4pts: <1x | 5pts: Net cash"
        />

        <ScoreMetric
          label="Share Count Trend"
          value={metrics.shareCountTrend}
          max={5}
          onChange={(val) => updateMetric('shareCountTrend', val)}
          description="0pts: Rising | 3pts: Flat | 5pts: Declining"
        />

        <ScoreMetric
          label="Returning Capital (Div + Buybacks)"
          value={metrics.returningCapital}
          max={5}
          onChange={(val) => updateMetric('returningCapital', val)}
          description="0pts: Dilution | 3pts: Neutral | 5pts: Active buybacks"
        />

        <ScoreMetric
          label="Industry Relative Strength"
          value={metrics.industryRelativeStrength}
          max={5}
          onChange={(val) => updateMetric('industryRelativeStrength', val)}
          description="0pts: Bottom 20% | 2pts: Bottom 50% | 3pts: Middle | 4pts: Top 50% | 5pts: Top 20%"
        />

        <ScoreMetric
          label="Risk Deductions"
          value={metrics.riskDeductions}
          max={10}
          onChange={(val) => updateMetric('riskDeductions', val)}
          description="Subtract points based on debt levels, interest coverage, F-Score, Z-Score"
        />
      </div>

      <div className="mt-6 p-4 bg-blue-100 rounded border border-blue-300">
        <p className="text-sm text-blue-900">
          <strong>Total Quality Score:</strong>{' '}
          {metrics.revenueGrowth +
            metrics.epsGrowth +
            metrics.grossMarginTrend +
            metrics.operatingMarginTrend +
            metrics.roe +
            metrics.balanceSheet +
            metrics.shareCountTrend +
            metrics.returningCapital +
            metrics.industryRelativeStrength -
            metrics.riskDeductions}{' '}
          / 60
        </p>
      </div>
    </div>
  );
};
