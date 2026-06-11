// Calculation utilities for stock grading

import { QualityMetrics, OpportunityMetrics, TechnicalMetrics } from '../types/stock';

export const calculateQualityScore = (metrics: QualityMetrics): number => {
  return (
    metrics.revenueGrowth +
    metrics.epsGrowth +
    metrics.grossMarginTrend +
    metrics.operatingMarginTrend +
    metrics.roe +
    metrics.balanceSheet +
    metrics.shareCountTrend +
    metrics.returningCapital +
    metrics.industryRelativeStrength -
    metrics.riskDeductions
  );
};

export const calculateOpportunityScore = (metrics: OpportunityMetrics): number => {
  return (
    metrics.distanceFrom52High +
    metrics.valuationDiscount +
    metrics.insiderBuying +
    metrics.analystRevisions +
    metrics.postEarningsReaction +
    metrics.marginOfSafety +
    metrics.movingAverages +
    metrics.technicalStrength
  );
};

export const calculateTechnicalScore = (metrics: TechnicalMetrics): number => {
  let score = 0;
  
  if (metrics.above50DMA) score += 4;
  if (metrics.above150DMA) score += 4;
  if (metrics.above200DMA) score += 4;
  
  score += metrics.relativeStrengthRank;
  
  if (metrics.accumulationVolume === 'uptrend') score += 4;
  else if (metrics.accumulationVolume === 'flat') score += 2;
  
  return Math.min(score, 20); // Cap at 20
};

export const getRecommendation = (
  qualityScore: number,
  opportunityScore: number
): string => {
  const qualityPercentage = (qualityScore / 60) * 100;
  const opportunityPercentage = (opportunityScore / 40) * 100;

  if (qualityPercentage >= 80 && opportunityPercentage >= 70) {
    return '🟢 STRONG BUY - High quality, strong opportunity';
  } else if (qualityPercentage >= 80 && opportunityPercentage >= 50) {
    return '🟢 BUY - High quality, moderate opportunity';
  } else if (qualityPercentage >= 70 && opportunityPercentage >= 70) {
    return '🟡 BUY - Good quality, strong opportunity';
  } else if (qualityPercentage >= 60 && opportunityPercentage >= 50) {
    return '🟡 HOLD - Fair quality and opportunity';
  } else if (qualityPercentage < 50 && opportunityPercentage >= 75) {
    return '🔴 AVOID - Potential value trap (cheap but low quality)';
  } else if (qualityPercentage >= 80 && opportunityPercentage < 40) {
    return '🟡 WAIT - Great business, not attractively priced';
  } else {
    return '🔴 AVOID - Poor metrics overall';
  }
};

export const defaultQualityMetrics: QualityMetrics = {
  revenueGrowth: 0,
  epsGrowth: 0,
  grossMarginTrend: 0,
  operatingMarginTrend: 0,
  roe: 0,
  balanceSheet: 0,
  shareCountTrend: 0,
  returningCapital: 0,
  industryRelativeStrength: 0,
  riskDeductions: 0,
};

export const defaultOpportunityMetrics: OpportunityMetrics = {
  distanceFrom52High: 0,
  valuationDiscount: 0,
  insiderBuying: 0,
  analystRevisions: 0,
  postEarningsReaction: 0,
  marginOfSafety: 0,
  movingAverages: 0,
  technicalStrength: 0,
};

export const defaultTechnicalMetrics: TechnicalMetrics = {
  above50DMA: false,
  above150DMA: false,
  above200DMA: false,
  relativeStrengthRank: 0,
  accumulationVolume: 'flat',
};
