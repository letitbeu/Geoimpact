import type { AssetRow, DataSourceHealth, GeoEvent, ImpactCell, RegionRisk } from '../types';

export const regionRisks: RegionRisk[] = [
  { rank: 1, region: 'Middle East', regionCn: '中东', country: 'Iran', countryCn: '伊朗', eventType: 'Military Escalation', eventTypeCn: '军事升级', riskLevel: 'EXTREME', giriScore: 82.6, change24h: 8.3, impactedAssets: ['Oil', 'Gold', 'DXY', 'Defense'], summary: '以色列与伊朗相关冲突风险继续升温，能源供应与避险资产敏感度最高。', trend: [52, 55, 59, 61, 60, 65, 67, 71, 74, 82] },
  { rank: 2, region: 'Middle East', regionCn: '中东', country: 'Israel', countryCn: '以色列', eventType: 'Military Escalation', eventTypeCn: '军事升级', riskLevel: 'EXTREME', giriScore: 79.1, change24h: 6.7, impactedAssets: ['Oil', 'Aviation', 'Gold'], summary: '与伊朗相互打击的叙事加剧，地区战争溢价仍在上升。', trend: [48, 51, 56, 55, 58, 62, 69, 70, 75, 79] },
  { rank: 3, region: 'Eastern Europe', regionCn: '东欧', country: 'Russia', countryCn: '俄罗斯', eventType: 'Armed Conflict', eventTypeCn: '军事冲突', riskLevel: 'HIGH', giriScore: 74.3, change24h: 4.9, impactedAssets: ['Wheat', 'Oil', 'Shipping'], summary: '乌克兰北部与克里米亚相关军事设施风险加剧，粮食与能源链条承压。', trend: [60, 62, 65, 64, 68, 72, 69, 73, 71, 74] },
  { rank: 4, region: 'East Asia', regionCn: '东亚', country: 'Taiwan', countryCn: '台湾', eventType: 'Geopolitical Tension', eventTypeCn: '地缘紧张', riskLevel: 'HIGH', giriScore: 71.8, change24h: 3.6, impactedAssets: ['Semiconductors', 'HK Stocks', 'DXY'], summary: '台海周边军演与政治表态增强，半导体和亚洲风险资产敏感。', trend: [49, 53, 57, 62, 60, 66, 69, 70, 68, 72] },
  { rank: 5, region: 'Africa', regionCn: '非洲', country: 'Sudan', countryCn: '苏丹', eventType: 'Civil War / Violence', eventTypeCn: '内战/暴力冲突', riskLevel: 'HIGH', giriScore: 66.4, change24h: 2.1, impactedAssets: ['Food', 'Humanitarian', 'Oil'], summary: '冲突扩散至更多地区，人道危机恶化，区域稳定性下降。', trend: [44, 47, 50, 54, 58, 57, 61, 62, 64, 66] },
  { rank: 6, region: 'South Asia', regionCn: '南亚', country: 'Pakistan', countryCn: '巴基斯坦', eventType: 'Terrorism / Security', eventTypeCn: '恐怖袭击/安全事件', riskLevel: 'MEDIUM', giriScore: 58.7, change24h: 1.8, impactedAssets: ['Security', 'FX', 'Bonds'], summary: '国内安全事件增加，边境紧张周期性抬头，外资风险上升。', trend: [48, 50, 49, 53, 55, 57, 56, 58, 57, 59] },
  { rank: 7, region: 'Latin America', regionCn: '拉美', country: 'Venezuela', countryCn: '委内瑞拉', eventType: 'Political Instability', eventTypeCn: '政局动荡', riskLevel: 'MEDIUM', giriScore: 53.2, change24h: -0.6, impactedAssets: ['Oil', 'FX', 'Bonds'], summary: '选举与制裁不确定性扰动市场，油气供应与本币压力仍需观察。', trend: [56, 54, 55, 53, 52, 50, 51, 52, 54, 53] },
  { rank: 8, region: 'Southeast Asia', regionCn: '东南亚', country: 'Myanmar', countryCn: '缅甸', eventType: 'Civil War / Violence', eventTypeCn: '内战/暴力冲突', riskLevel: 'MEDIUM', giriScore: 50.1, change24h: 0.9, impactedAssets: ['Humanitarian', 'Regional FX'], summary: '内部冲突持续，外溢到贸易和边境安全的风险温和上升。', trend: [42, 45, 44, 47, 49, 48, 50, 51, 49, 50] },
  { rank: 9, region: 'North America', regionCn: '北美', country: 'United States', countryCn: '美国', eventType: 'Policy / Trade Tension', eventTypeCn: '政策/贸易摩擦', riskLevel: 'LOW', giriScore: 46.3, change24h: -1.2, impactedAssets: ['DXY', 'US10Y', 'Equities'], summary: '关税与财政政策存在变数，企业成本上升，市场波动加剧。', trend: [49, 48, 46, 45, 47, 46, 44, 45, 46, 46] },
  { rank: 10, region: 'Western Europe', regionCn: '西欧', country: 'France', countryCn: '法国', eventType: 'Civil Unrest / Protests', eventTypeCn: '社会动荡/抗议', riskLevel: 'LOW', giriScore: 42.9, change24h: -1.5, impactedAssets: ['EUR', 'Retail', 'Transport'], summary: '劳资纠纷与示威有所缓和，短期社会影响可控。', trend: [48, 47, 45, 44, 43, 44, 42, 41, 43, 43] }
];

export const geoEvents: GeoEvent[] = [
  { id: 'evt-001', time: '14:28', date: '2025-06-01', title: '乌克兰对克里米亚北部军事设施发动无人机袭击', titleEn: 'Ukraine launches drone strike on northern Crimea military facilities', source: 'REUTERS', credibility: 'High', region: 'Eastern Europe', location: 'Ukraine / Crimea', severity: 78.2, confidence: 85, giriScore: 78.2, riskLevel: 'HIGH', impactedAssets: ['Military', 'Communications', 'Transport'], keyFacts: ['乌克兰军方称在当地时间 06:10 使用无人机打击军事设施。', '目标可能包括雷达站、通信中心及防空系统。', '交通一度中断，后续仍需观察俄方回应。'] },
  { id: 'evt-002', time: '13:47', date: '2025-06-01', title: '中东多国呼吁通过外交途径缓解加沙人道危机', titleEn: 'Several Middle East countries call for diplomatic resolution to Gaza humanitarian crisis', source: 'ALJAZEERA', credibility: 'Medium', region: 'Middle East', location: 'Israel / Gaza', severity: 68.1, confidence: 72, giriScore: 68.1, riskLevel: 'MEDIUM', impactedAssets: ['Oil', 'Gold', 'Aviation'], keyFacts: ['区域外交压力升高。', '人道主义走廊与停火条件仍不确定。', '油价对升级信号保持敏感。'] },
  { id: 'evt-003', time: '12:32', date: '2025-06-01', title: '美中贸易代表团将在伦敦举行新一轮经贸磋商', titleEn: 'US and China trade delegations to hold new round of talks in London', source: 'BLOOMBERG', credibility: 'High', region: 'Global', location: 'US / China / UK', severity: 64.0, confidence: 78, giriScore: 64.0, riskLevel: 'MEDIUM', impactedAssets: ['Nasdaq', 'HK Stocks', 'DXY'], keyFacts: ['关税与出口管制议题仍是谈判重点。', '科技供应链与半导体板块敏感。', '市场关注会后联合声明。'] },
  { id: 'evt-004', time: '11:08', date: '2025-06-01', title: '台海周边军事活动增加，中国国防部回应外媒关切', titleEn: 'Increased military aircraft activity around Taiwan Strait, China MoD responds', source: 'CGTN', credibility: 'Medium', region: 'East Asia', location: 'Taiwan Strait', severity: 58.7, confidence: 65, giriScore: 58.7, riskLevel: 'MEDIUM', impactedAssets: ['Semiconductors', 'HK Stocks', 'Defense'], keyFacts: ['区域军事活动频率上升。', '外媒关注半导体供应链影响。', '尚未出现直接封锁或冲突信号。'] },
  { id: 'evt-005', time: '09:42', date: '2025-06-01', title: 'OPEC+ 同意将原油日产量提高 41.1 万桶', titleEn: 'OPEC+ agrees to increase oil production by 411,000 barrels per day', source: 'S&P Global', credibility: 'High', region: 'Global', location: 'Energy Market', severity: 52.0, confidence: 80, giriScore: 52.0, riskLevel: 'LOW', impactedAssets: ['Oil', 'Nat Gas', 'Inflation'], keyFacts: ['供应政策出现边际变化。', '油价需同时观察中东风险溢价。', '能源通胀压力可能阶段性缓和。'] }
];

export const assetRows: AssetRow[] = [
  { asset: 'OIL', assetCn: '原油', symbol: 'WTI', direction: 'Strong Bullish', impactScore: 82, change24h: 3.42, trend: [62, 64, 63, 68, 70, 73, 71, 76, 78, 82] },
  { asset: 'GOLD', assetCn: '黄金', symbol: 'XAU', direction: 'Bullish', impactScore: 72, change24h: 1.28, trend: [52, 54, 58, 57, 60, 63, 62, 66, 70, 72] },
  { asset: 'DXY', assetCn: '美元指数', symbol: 'DXY', direction: 'Bullish', impactScore: 57, change24h: 0.61, trend: [48, 50, 49, 53, 56, 55, 56, 58, 57, 57] },
  { asset: 'BTC', assetCn: '比特币', symbol: 'BTC/USDT', direction: 'Bearish', impactScore: 44, change24h: -0.73, trend: [53, 51, 49, 48, 47, 44, 46, 43, 45, 44] },
  { asset: 'S&P500', assetCn: '标普500', symbol: 'SPX', direction: 'Bearish', impactScore: 48, change24h: -0.68, trend: [57, 55, 56, 52, 51, 50, 48, 49, 47, 48] },
  { asset: 'NASDAQ', assetCn: '纳斯达克', symbol: 'NDX', direction: 'Bearish', impactScore: 46, change24h: -1.15, trend: [58, 55, 52, 50, 48, 47, 45, 46, 44, 46] },
  { asset: 'SHIPPING', assetCn: '航运', symbol: 'BDI', direction: 'Strong Bullish', impactScore: 81, change24h: 4.8, trend: [54, 58, 61, 63, 70, 76, 74, 78, 80, 81] },
  { asset: 'DEFENSE', assetCn: '军工', symbol: 'ITA', direction: 'Bullish', impactScore: 68, change24h: 2.18, trend: [46, 50, 54, 57, 58, 61, 63, 65, 66, 68] }
];

export const impactMatrix: ImpactCell[] = [
  { eventType: 'Middle East Escalation', eventTypeCn: '中东局势升级', values: { OIL: 'Strong Bullish', GOLD: 'Bullish', DXY: 'Bullish', US10Y: 'Bearish', BTC: 'Bearish', ETH: 'Bearish', 'S&P500': 'Bearish', NASDAQ: 'Strong Bearish', 'A股': 'Bearish', '港股': 'Bearish', SHIPPING: 'Bullish', DEFENSE: 'Bullish', 'NAT GAS': 'Bullish' } },
  { eventType: 'Red Sea Shipping Disruption', eventTypeCn: '红海航运中断', values: { OIL: 'Bullish', GOLD: 'Neutral', DXY: 'Bullish', US10Y: 'Bearish', BTC: 'Neutral', ETH: 'Neutral', 'S&P500': 'Bearish', NASDAQ: 'Bearish', 'A股': 'Bearish', '港股': 'Bearish', SHIPPING: 'Strong Bullish', DEFENSE: 'Neutral', 'NAT GAS': 'Neutral' } },
  { eventType: 'Taiwan Strait Tension', eventTypeCn: '台海局势紧张', values: { OIL: 'Neutral', GOLD: 'Bullish', DXY: 'Bullish', US10Y: 'Bearish', BTC: 'Bearish', ETH: 'Bearish', 'S&P500': 'Bearish', NASDAQ: 'Strong Bearish', 'A股': 'Strong Bearish', '港股': 'Strong Bearish', SHIPPING: 'Neutral', DEFENSE: 'Bullish', 'NAT GAS': 'Neutral' } },
  { eventType: 'Russia-Ukraine Escalation', eventTypeCn: '俄乌冲突升级', values: { OIL: 'Bullish', GOLD: 'Bullish', DXY: 'Bullish', US10Y: 'Bearish', BTC: 'Bearish', ETH: 'Bearish', 'S&P500': 'Bearish', NASDAQ: 'Bearish', 'A股': 'Neutral', '港股': 'Neutral', SHIPPING: 'Neutral', DEFENSE: 'Bullish', 'NAT GAS': 'Bullish' } },
  { eventType: 'Sanctions Shock', eventTypeCn: '制裁冲击', values: { OIL: 'Neutral', GOLD: 'Bullish', DXY: 'Bullish', US10Y: 'Bearish', BTC: 'Bearish', ETH: 'Bearish', 'S&P500': 'Bearish', NASDAQ: 'Bearish', 'A股': 'Bearish', '港股': 'Bearish', SHIPPING: 'Neutral', DEFENSE: 'Neutral', 'NAT GAS': 'Neutral' } },
  { eventType: 'Tariff Shock', eventTypeCn: '关税冲击', values: { OIL: 'Neutral', GOLD: 'Neutral', DXY: 'Bullish', US10Y: 'Bearish', BTC: 'Bearish', ETH: 'Bearish', 'S&P500': 'Strong Bearish', NASDAQ: 'Strong Bearish', 'A股': 'Strong Bearish', '港股': 'Strong Bearish', SHIPPING: 'Bearish', DEFENSE: 'Neutral', 'NAT GAS': 'Neutral' } },
  { eventType: 'Energy Facility Attack', eventTypeCn: '能源设施袭击', values: { OIL: 'Strong Bullish', GOLD: 'Bullish', DXY: 'Bullish', US10Y: 'Bearish', BTC: 'Bearish', ETH: 'Bearish', 'S&P500': 'Bearish', NASDAQ: 'Bearish', 'A股': 'Neutral', '港股': 'Neutral', SHIPPING: 'Neutral', DEFENSE: 'Bullish', 'NAT GAS': 'Bullish' } }
];

export const dataSources: DataSourceHealth[] = [
  { source: 'GDELT', status: 'Healthy', uptime: 99.92, latency: 1.42, freshness: 3.8, errorRate: 0.02, eventsToday: 452812, trend: [42, 45, 48, 46, 50, 54, 52, 59, 62, 64] },
  { source: 'ACLED', status: 'Healthy', uptime: 99.71, latency: 2.31, freshness: 6.1, errorRate: 0.05, eventsToday: 218943, trend: [30, 34, 36, 35, 39, 42, 45, 44, 48, 50] },
  { source: 'OFAC', status: 'Healthy', uptime: 99.98, latency: 1.21, freshness: 1.6, errorRate: 0.0, eventsToday: 4912, trend: [12, 11, 13, 14, 18, 17, 20, 22, 21, 24] },
  { source: 'ReliefWeb', status: 'Healthy', uptime: 99.55, latency: 6.42, freshness: 15.2, errorRate: 0.11, eventsToday: 31984, trend: [20, 22, 24, 25, 23, 27, 31, 29, 34, 36] },
  { source: 'EIA', status: 'Warning', uptime: 98.21, latency: 8.71, freshness: 21.7, errorRate: 0.38, eventsToday: 7413, trend: [15, 14, 17, 19, 21, 20, 24, 23, 26, 28] },
  { source: 'PortWatch', status: 'Healthy', uptime: 99.43, latency: 3.95, freshness: 9.4, errorRate: 0.04, eventsToday: 11276, trend: [17, 20, 22, 21, 25, 27, 30, 31, 33, 37] }
];

export const watchpoints = ['霍尔木兹海峡航运安全与电子干扰', '伊以局势是否进一步升级', 'OPEC+ 会议对产量政策的最新动向', '美伊谈判进展与制裁执行变化', '也门胡塞武装在红海的行动强度'];
