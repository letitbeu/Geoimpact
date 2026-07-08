export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
export type Direction = 'Strong Bullish' | 'Bullish' | 'Neutral' | 'Bearish' | 'Strong Bearish';
export type PageId = 'home' | 'ranking' | 'timeline' | 'matrix' | 'brief' | 'regional' | 'monitoring';

export interface RegionRisk {
  rank: number;
  region: string;
  regionCn: string;
  country: string;
  countryCn: string;
  eventType: string;
  eventTypeCn: string;
  riskLevel: RiskLevel;
  giriScore: number;
  change24h: number;
  impactedAssets: string[];
  summary: string;
  trend: number[];
}

export interface GeoEvent {
  id: string;
  time: string;
  date: string;
  title: string;
  titleEn: string;
  source: string;
  credibility: 'High' | 'Medium' | 'Low';
  region: string;
  location: string;
  severity: number;
  confidence: number;
  giriScore: number;
  riskLevel: RiskLevel;
  impactedAssets: string[];
  keyFacts: string[];
}

export interface AssetRow {
  asset: string;
  assetCn: string;
  symbol: string;
  direction: Direction;
  impactScore: number;
  change24h: number;
  trend: number[];
}

export interface ImpactCell {
  eventType: string;
  eventTypeCn: string;
  values: Record<string, Direction>;
}

export interface DataSourceHealth {
  source: string;
  status: 'Healthy' | 'Warning' | 'Critical' | 'Offline';
  uptime: number;
  latency: number;
  freshness: number;
  errorRate: number;
  eventsToday: number;
  trend: number[];
}
