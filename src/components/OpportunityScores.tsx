import React from 'react';
import { ScoreMetric, SelectMetric } from './MetricInputs';
import { OpportunityMetrics } from '../types/stock';

interface OpportunityScoresProps {
  metrics: OpportunityMetrics;
  onUpdate: (metrics: OpportunityMetrics) => void;
}

export const OpportunityScores: React.FC<OpportunityScoresProps> = ({
  metrics,
  onUpdate,
}) => {
  const updateMetric = (key: keyof OpportunityMetrics, value: number) => {
    onUpdate({ ...metrics, [key]: value });
  };

  return (
    <div className="bg-green-50 p-6 rounded-lg mb-6">
      <h2 className="text-2xl font-bold mb-6 text-green-900">🎯 Mispricing Opportunity (0-40 pts)</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ScoreMetric
          label="Distance from 52-week High"
          value={metrics.distanceFrom52High}
          max={5}
          onChange={(val) => updateMetric('distanceFrom52High', val)}
          description="2pts: 10-20% | 3pts: 20-30% | 4pts: 30-40% | 5pts: 40%+"
        />

        <ScoreMetric
          label="Valuation Discount vs 5Y Avg"
          value={metrics.valuationDiscount}
          max={5}
          onChange={(val) => updateMetric('valuationDiscount', val)}
          description="0pts: <10% | 2pts: 10-20% | 3pts: 20-30% | 4pts: 30-40% | 5pts: >40%"
        />

        <ScoreMetric
          label="Insider Buying (6 months)"
          value={metrics.insiderBuying}
          max={5}
          onChange={(val) => updateMetric('insiderBuying', val)}
          description="0pts: Selling | 2pts: Neutral | 4pts: Moderate buying | 5pts: Heavy buying"
        />

        <ScoreMetric
          label="Analyst Revisions (90 days)"
          value={metrics.analystRevisions}
          max={5}
          onChange={(val) => updateMetric('analystRevisions', val)}
          description="0pts: Downgrades | 2pts: Mixed | 3pts: Neutral | 4pts: Some upgrades | 5pts: Strong upgrades"
        />

        <ScoreMetric
          label="Post-Earnings Reaction"
          value={metrics.postEarningsReaction}
          max={5}
          onChange={(val) => updateMetric('postEarningsReaction', val)}
          description="0pts: Miss | 2pts: Neutral | 4pts: Beat with minor selloff | 5pts: Beat with >10% drop"
        />

        <ScoreMetric
          label="Margin of Safety"
          value={metrics.marginOfSafety}
          max={5}
          onChange={(val) => updateMetric('marginOfSafety', val)}
          description="0pts: Premium | 2pts: 5-10% discount | 3pts: 10-20% | 4pts: 20-30% | 5pts: >30%"
        />

        <ScoreMetric
          label="Above Moving Averages (50/150/200)"
          value={metrics.movingAverages}
          max={3}
          onChange={(val) => updateMetric('movingAverages', val)}
          description="0pts: Below 50 DMA | 1pt: Above 50 | 2pts: Above 50 & 150 | 3pts: Above all"
        />

        <ScoreMetric
          label="Technical Strength & Volume"
          value={metrics.technicalStrength}
          max={2}
          onChange={(val) => updateMetric('technicalStrength', val)}
          description="Based on RS rank and accumulation volume"
        />
      </div>

      <div className="mt-6 p-4 bg-green-100 rounded border border-green-300">
        <p className="text-sm text-green-900">
          <strong>Total Opportunity Score:</strong>{' '}
          {metrics.distanceFrom52High +
            metrics.valuationDiscount +
            metrics.insiderBuying +
            metrics.analystRevisions +
            metrics.postEarningsReaction +
            metrics.marginOfSafety +
            metrics.movingAverages +
            metrics.technicalStrength}{' '}
          / 40
        </p>
      </div>
    </div>
  );
};
