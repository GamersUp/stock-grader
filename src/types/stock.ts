// Type definitions for the Stock Grader application

export interface QualityMetrics {
  revenueGrowth: number;
  epsGrowth: number;
  grossMarginTrend: number;
  operatingMarginTrend: number;
  roe: number;
  balanceSheet: number;
  shareCountTrend: number;
  returningCapital: number;
  industryRelativeStrength: number;
  riskDeductions: number;
}

export interface OpportunityMetrics {
  distanceFrom52High: number;
  valuationDiscount: number;
  insiderBuying: number;
  analystRevisions: number;
  postEarningsReaction: number;
  marginOfSafety: number;
  movingAverages: number;
  technicalStrength: number;
}

export interface TechnicalMetrics {
  above50DMA: boolean;
  above150DMA: boolean;
  above200DMA: boolean;
  relativeStrengthRank: number;
  accumulationVolume: string; // 'uptrend' | 'flat' | 'downtrend'
}

export interface ManagementMetrics {
  shareCountTrend: string; // 'declining' | 'flat' | 'rising'
  returningCapital: string; // 'active_buybacks' | 'neutral' | 'dilution'
}

export interface StockGrade {
  ticker: string;
  company: string;
  date: string;
  qualityMetrics: QualityMetrics;
  opportunityMetrics: OpportunityMetrics;
  technicalMetrics: TechnicalMetrics;
  managementMetrics: ManagementMetrics;
  notes: string;
}

export interface CompositeScore {
  qualityScore: number;
  opportunityScore: number;
  totalScore: number;
  recommendation: string;
}
