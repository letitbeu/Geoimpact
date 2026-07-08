import { useMemo, useState } from 'react';
import { assetRows, dataSources, geoEvents, impactMatrix, regionRisks, watchpoints } from './data/mock';
import type { AssetRow, Direction, GeoEvent, PageId, RiskLevel } from './types';

const navItems: { id: PageId; label: string; labelEn: string; icon: string }[] = [
  { id: 'home', label: '首页', labelEn: 'Home', icon: '⌂' },
  { id: 'ranking', label: '风险榜', labelEn: 'Risk Ranking', icon: '▦' },
  { id: 'timeline', label: '事件时间线', labelEn: 'Event Timeline', icon: '☷' },
  { id: 'matrix', label: '资产影响矩阵', labelEn: 'Asset Impact Matrix', icon: '▧' },
  { id: 'brief', label: 'AI 快讯日报', labelEn: 'AI Daily Brief', icon: '◰' },
  { id: 'regional', label: '地区分析', labelEn: 'Regional Analysis', icon: '✣' },
  { id: 'monitoring', label: '数据监控', labelEn: 'Data Monitoring', icon: '⬡' }
];

const regionPoints = [
  { label: '74.1\n中东地区', top: '44%', left: '58%', level: 'extreme' },
  { label: '78.2\n红海航道', top: '56%', left: '55%', level: 'extreme' },
  { label: '58.3\n台海地区', top: '48%', left: '77%', level: 'high' },
  { label: '54.7\n俄乌冲突', top: '30%', left: '55%', level: 'medium' },
  { label: '49.6\n萨赫勒', top: '58%', left: '47%', level: 'medium' },
  { label: '53.2\n拉美政局', top: '68%', left: '29%', level: 'medium' }
];

const matrixAssets = ['OIL', 'GOLD', 'DXY', 'US10Y', 'BTC', 'ETH', 'S&P500', 'NASDAQ', 'A股', '港股', 'SHIPPING', 'DEFENSE', 'NAT GAS'];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function directionMeta(direction: Direction) {
  const meta: Record<Direction, { arrow: string; className: string; label: string }> = {
    'Strong Bullish': { arrow: '↑↑', className: 'bull strong', label: '强烈利多' },
    Bullish: { arrow: '↑', className: 'bull', label: '利多' },
    Neutral: { arrow: '→', className: 'neutral', label: '中性' },
    Bearish: { arrow: '↓', className: 'bear', label: '利空' },
    'Strong Bearish': { arrow: '↓↓', className: 'bear strong', label: '强烈利空' }
  };
  return meta[direction];
}

function riskClass(level: RiskLevel | string) {
  return level.toLowerCase();
}

function riskText(level: RiskLevel) {
  const dict: Record<RiskLevel, string> = { LOW: '低', MEDIUM: '中等', HIGH: '高', EXTREME: '极高' };
  return dict[level];
}

function Sparkline({ data, tone = 'red' }: { data: number[]; tone?: 'red' | 'green' | 'orange' | 'blue' }) {
  const width = 112;
  const height = 38;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg className={`sparkline ${tone}`} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="trend sparkline">
      <defs>
        <linearGradient id={`fill-${tone}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.38" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#fill-${tone})`} />
    </svg>
  );
}

function MiniBars({ value, direction }: { value: number; direction?: Direction }) {
  const active = Math.round(clamp(value, 0, 100) / 10);
  const className = direction ? directionMeta(direction).className : value >= 70 ? 'bear' : value >= 50 ? 'neutral' : 'bull';
  return (
    <div className={`mini-bars ${className}`}>
      {Array.from({ length: 10 }).map((_, index) => (
        <span key={index} className={index < active ? 'active' : ''} />
      ))}
    </div>
  );
}

function RiskBadge({ level }: { level: RiskLevel }) {
  return <span className={`risk-badge ${riskClass(level)}`}>{level}</span>;
}

function Panel({ title, subtitle, action, children, className = '' }: { title: string; subtitle?: string; action?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-titlebar">
        <div>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action && <button className="ghost-button">{action}</button>}
      </div>
      {children}
    </section>
  );
}

function MetricCard({ label, labelEn, value, suffix, delta, tone = 'red', children }: { label: string; labelEn?: string; value: string | number; suffix?: string; delta?: string; tone?: 'red' | 'green' | 'orange' | 'blue'; children?: React.ReactNode }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      {labelEn && <div className="metric-label-en">{labelEn}</div>}
      <div className={`metric-value ${tone}`}>{value}<small>{suffix}</small></div>
      {delta && <div className={`metric-delta ${tone}`}>{delta}</div>}
      {children && <div className="metric-extra">{children}</div>}
    </div>
  );
}

function Sidebar({ activePage, onChange }: { activePage: PageId; onChange: (page: PageId) => void }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">◎</div>
        <div>
          <div className="brand-title">GEOIMPACT</div>
          <div className="brand-subtitle">TERMINAL</div>
        </div>
      </div>
      <nav className="main-nav">
        {navItems.map((item) => (
          <button key={item.id} className={activePage === item.id ? 'active' : ''} onClick={() => onChange(item.id)}>
            <span className="nav-icon">{item.icon}</span>
            <span><b>{item.label}</b><em>{item.labelEn}</em></span>
          </button>
        ))}
      </nav>
      <div className="side-tools">
        <button><span>♧</span><span>通知中心<em>Notifications</em></span><strong>3</strong></button>
        <button><span>☆</span><span>收藏夹<em>Watchlist</em></span></button>
        <button><span>⚙</span><span>设置<em>Settings</em></span></button>
        <button><span>?</span><span>帮助中心<em>Help Center</em></span></button>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-spacer" />
      <div className="clock">2025-06-01 14:32:45 <span>UTC+8</span></div>
      <button className="icon-button">♧</button>
      <button className="icon-button">☆</button>
      <button className="icon-button">⚙</button>
      <button className="login-button">登录</button>
    </header>
  );
}

function WorldRiskMap({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`world-map ${compact ? 'compact' : ''}`}>
      <div className="map-grid" />
      <div className="map-shape shape-a" />
      <div className="map-shape shape-b" />
      <div className="map-shape shape-c" />
      <div className="map-shape shape-d" />
      {!compact && <div className="map-controls"><span>＋</span><span>−</span><span>□</span></div>}
      {regionPoints.map((point) => (
        <div key={point.label} className={`map-hotspot ${point.level}`} style={{ top: point.top, left: point.left }}>
          <i />
          {!compact && <b>{point.label.split('\n').map((part) => <span key={part}>{part}</span>)}</b>}
        </div>
      ))}
      <div className="map-legend"><span>LOW</span><i /><span>EXTREME</span></div>
    </div>
  );
}

function RankingTable({ dense = false }: { dense?: boolean }) {
  return (
    <div className="table-wrap">
      <table className="terminal-table ranking-table">
        <thead>
          <tr>
            <th>#</th><th>地区 / 事件</th><th>风险等级</th><th>GIRI分数</th><th>24h变化</th><th>趋势</th><th>主要影响资产</th>{!dense && <th>AI 摘要</th>}
          </tr>
        </thead>
        <tbody>
          {regionRisks.map((risk) => (
            <tr key={`${risk.rank}-${risk.country}`}>
              <td>{risk.rank}</td>
              <td><strong>{risk.region}</strong><small>{risk.regionCn} / {risk.countryCn}</small></td>
              <td><RiskBadge level={risk.riskLevel} /></td>
              <td className="score">{risk.giriScore.toFixed(1)}</td>
              <td className={risk.change24h >= 0 ? 'up' : 'down'}>{risk.change24h >= 0 ? '▲' : '▼'} {Math.abs(risk.change24h).toFixed(1)}</td>
              <td><Sparkline data={risk.trend} tone={risk.change24h >= 0 ? 'red' : 'green'} /></td>
              <td><div className="asset-chips">{risk.impactedAssets.slice(0, 4).map((asset) => <span key={asset}>{asset}</span>)}</div></td>
              {!dense && <td className="summary-cell">{risk.summary}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EventList({ selectedId, onSelect }: { selectedId?: string; onSelect?: (event: GeoEvent) => void }) {
  return (
    <div className="event-list">
      {geoEvents.map((event, index) => (
        <button key={event.id} className={`event-row ${selectedId === event.id ? 'selected' : ''}`} onClick={() => onSelect?.(event)}>
          <div className="timeline-pin"><span className={event.riskLevel.toLowerCase()} />{index < geoEvents.length - 1 && <i />}</div>
          <div className="event-time"><b>{event.time}</b><small>{event.date}</small></div>
          <div className="event-main"><strong>{event.title}</strong><small>{event.titleEn}</small><div className="event-meta"><span>{event.source}</span><span>{event.credibility}</span><span>{event.location}</span></div></div>
          <div className="event-score"><RiskBadge level={event.riskLevel} /><strong>{event.giriScore.toFixed(1)}</strong></div>
        </button>
      ))}
    </div>
  );
}

function AssetImpactList() {
  return (
    <div className="asset-list">
      {assetRows.map((asset) => {
        const meta = directionMeta(asset.direction);
        return (
          <div className="asset-line" key={asset.asset}>
            <div><strong>{asset.asset} <small>({asset.symbol})</small></strong><span>{asset.assetCn}</span></div>
            <b className={meta.className}>{meta.arrow}</b>
            <MiniBars value={asset.impactScore} direction={asset.direction} />
            <Sparkline data={asset.trend} tone={asset.change24h >= 0 ? 'green' : 'red'} />
          </div>
        );
      })}
    </div>
  );
}

function Dashboard() {
  return (
    <div className="page dashboard-page">
      <div className="metric-grid home-metrics">
        <MetricCard label="GLOBAL GIRI INDEX" labelEn="全球地缘影响风险指数" value="68.7" delta="24h 变化 ▲ +6.3 (+10.1%)" tone="red"><Sparkline data={[44,45,43,48,49,55,58,63,61,69]} tone="red" /></MetricCard>
        <MetricCard label="风险等级" labelEn="Risk Level" value="HIGH" suffix="" tone="red"><p className="metric-note">高风险</p></MetricCard>
        <MetricCard label="最高风险区域" labelEn="Top Risk Region" value="MIDDLE EAST" tone="blue"><p className="metric-note">中东地区</p></MetricCard>
        <MetricCard label="最高影响资产" labelEn="Top Impact Asset" value="OIL" suffix=" (WTI)" tone="orange"><p className="metric-note">原油</p></MetricCard>
        <MetricCard label="市场情绪" labelEn="Market Sentiment" value="RISK OFF" tone="red"><p className="metric-note">避险情绪增强</p></MetricCard>
        <MetricCard label="监控事件总数" labelEn="Total Tracked Events" value="127" tone="blue"><p className="metric-note">较昨日 +23</p></MetricCard>
      </div>

      <div className="dashboard-grid">
        <Panel title="TOP GEOPOLITICAL RISKS" subtitle="地缘风险热榜" action="更多 >" className="risk-panel"><RankingTable dense /></Panel>
        <Panel title="GLOBAL RISK HEATMAP" subtitle="全球风险热力图" className="map-panel"><WorldRiskMap /></Panel>
        <Panel title="ASSET IMPACT MATRIX (Overall)" subtitle="资产影响矩阵（综合影响）" className="asset-panel"><AssetImpactList /><div className="legend-row"><span className="bear strong">↑↑ 强烈利多</span><span className="bull">↑ 利多</span><span>→ 中性</span><span className="green">↓ 利空</span><span className="bear strong">↓↓ 强烈利空</span></div></Panel>
        <Panel title="LATEST HIGH IMPACT EVENTS" subtitle="最新高影响事件" action="更多 >"><EventList /></Panel>
        <Panel title="GIRI 指数构成" subtitle="当前事件平均"><div className="score-breakdown">{['冲突强度 25%', '战略重要性 20%', '能源/航运敏感度 20%', '大国卷入程度 15%', '新闻热度变化 10%', '市场价格响应 10%'].map((item, index) => <div key={item}><span>{item}</span><b>{[18.7,15.6,14.8,10.9,6.8,6.0][index]}/{[25,20,20,15,10,10][index]}</b><i style={{ width: `${[74,78,74,72,68,60][index]}%` }} /></div>)}</div></Panel>
        <Panel title="GIRI 指数趋势" subtitle="过去7天"><div className="large-chart"><Sparkline data={[38,39,48,50,51,56,54,59,57,63,66,74,69,68.7]} tone="red" /><div className="chart-tabs"><span>24H</span><b>7D</b><span>30D</span><span>90D</span></div></div></Panel>
        <Panel title="AI 快讯（最新）" subtitle="AI briefing" action="更多 >"><div className="brief-card"><div><strong>中东紧张局势升级，油价飙升，市场避险情绪增强</strong><RiskBadge level="HIGH" /></div><p>以色列与伊朗之间的对抗持续升级，区域冲突风险显著上升。红海航运再遭袭击，全球供应链和能源运输面临更大不确定性。资金流向避险资产，黄金和美元走强，风险资产承压。</p><div className="asset-chips big"><span>OIL</span><span>GOLD</span><span>DXY</span><span>VIX</span><span>DEFENSE</span></div><div className="button-row"><button>查看详情 →</button><button>推文版</button><button>Telegram 快讯</button></div></div></Panel>
      </div>

      <Panel title="MARKET SNAPSHOT" subtitle="市场快照" className="market-strip">{assetRows.concat([{ asset: 'VIX', assetCn: '波动率', symbol: 'VIX', direction: 'Bullish', impactScore: 73, change24h: 8.23, trend: [42,44,50,49,58,60,57,69,72,73] } as AssetRow]).map((asset) => <div className="market-tile" key={asset.asset}><b>{asset.asset}</b><strong>{asset.asset === 'OIL' ? '78.64' : asset.asset === 'GOLD' ? '2,358.45' : asset.asset === 'DXY' ? '104.62' : asset.asset === 'BTC' ? '68,542' : asset.asset === 'ETH' ? '3,762' : asset.asset === 'S&P500' ? '5,283.40' : asset.asset === 'NASDAQ' ? '16,920.58' : asset.asset === 'VIX' ? '18.74' : asset.impactScore}</strong><span className={asset.change24h >= 0 ? 'up' : 'down'}>{asset.change24h >= 0 ? '+' : ''}{asset.change24h}%</span><Sparkline data={asset.trend} tone={asset.change24h >= 0 ? 'green' : 'red'} /></div>)}</Panel>
    </div>
  );
}

function RankingPage() {
  return (
    <div className="page">
      <PageTitle title="风险榜 / Risk Ranking" />
      <FilterBar filters={['地区 Region', '事件类型 Event Type', '风险等级 Risk Level', '时间范围 Timeframe']} />
      <div className="metric-grid four">
        <MetricCard label="高风险事件数" labelEn="High-Risk Events" value="68" delta="▲ 12.1%" tone="red"><Sparkline data={[42,45,49,47,56,61,58,69,65,68]} tone="red" /></MetricCard>
        <MetricCard label="升级中地区" labelEn="Regions Under Escalation" value="9" delta="较昨日 +2" tone="orange"><Sparkline data={[2,3,5,4,6,8,9,7,8,9]} tone="orange" /></MetricCard>
        <MetricCard label="最强资产敏感度" labelEn="Strongest Asset Sensitivity" value="OIL" suffix=" (WTI)" tone="orange"><p className="metric-note">敏感度 9.2/10</p></MetricCard>
        <MetricCard label="全球平均风险分" labelEn="Global Average Risk Score" value="45.7" delta="▲ 3.4" tone="orange"><Sparkline data={[35,38,36,40,42,41,44,45,47,45.7]} tone="orange" /></MetricCard>
      </div>
      <div className="content-with-rail">
        <Panel title="风险排名 / Risk Ranking" subtitle="数据每5分钟更新"><RankingTable /></Panel>
        <aside className="right-rail">
          <Panel title="风险分布（按地区）" subtitle="Risk distribution by region"><DonutList /></Panel>
          <Panel title="最近风险变化 TOP 5" subtitle="Top 5 changes (24h)"><ol className="compact-list">{regionRisks.slice(0,5).map((risk) => <li key={risk.rank}><span>{risk.countryCn}</span><b>{risk.giriScore}</b><em className="up">▲ {risk.change24h}</em></li>)}</ol></Panel>
          <Panel title="数据来源与更新时间" subtitle="Data sources"><div className="meta-box"><p>事件数据源 <b>27</b></p><p>覆盖国家/地区 <b>195</b></p><p>最后更新 <b>2025-06-01 14:30</b></p><button className="full-button">数据方法论 Data Methodology ↗</button></div></Panel>
        </aside>
      </div>
    </div>
  );
}

function TimelinePage() {
  const [selected, setSelected] = useState<GeoEvent>(geoEvents[0]);
  return (
    <div className="page">
      <PageTitle title="事件时间线 / Event Timeline" subtitle="从公开事件流中提取高影响地缘风险，并映射到市场影响。" />
      <FilterBar filters={['地区 Region', '事件类型 Event Type', '来源可信度 Source Credibility', '严重程度 Severity', '日期范围 Date Range']} />
      <div className="metric-grid timeline-metrics">
        <MetricCard label="事件总数" labelEn="Total Events" value="127" delta="较昨日 +23 (+22.1%)" tone="blue" />
        <MetricCard label="高影响事件" labelEn="High-impact Events" value="18" delta="占比 14.2%" tone="red" />
        <MetricCard label="来源覆盖度" labelEn="Source Coverage" value="96%" delta="覆盖 87/91 可信来源" tone="green" />
        <MetricCard label="24h 事件动能" labelEn="24h Event Momentum" value="68.7" delta="高 High" tone="orange"><Sparkline data={[44,46,49,48,52,58,60,62,66,68.7]} tone="orange" /></MetricCard>
        <Panel title="全球事件热力图（24h）" subtitle="Global event heatmap"><WorldRiskMap compact /></Panel>
      </div>
      <div className="timeline-layout">
        <Panel title="时间线视图" subtitle="Timeline view"><div className="timeline-toolbar"><button className="active">时间线视图</button><button>列表视图</button><span>排序：最新优先</span><button>导出</button></div><EventList selectedId={selected.id} onSelect={setSelected} /></Panel>
        <Panel title={selected.title} subtitle={selected.titleEn} className="event-detail-panel"><EventDetail event={selected} /></Panel>
      </div>
    </div>
  );
}

function EventDetail({ event }: { event: GeoEvent }) {
  return (
    <div className="event-detail">
      <div className="tabs"><b>事件详情 Event Details</b><span>影响评估 Impact Assessment</span><span>相关事件 Related Events</span></div>
      <h4>关键事实 | Key Facts</h4>
      <ul>{event.keyFacts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
      <small>来源：{event.source}, {event.date} {event.time}</small>
      <h4>影响资产 | Impacted Assets</h4>
      <div className="impact-card-grid">{event.impactedAssets.map((asset, index) => <div key={asset}><strong>{asset}</strong><span className={index === 0 ? 'risk-red' : index === 1 ? 'risk-orange' : 'risk-green'}>{index === 0 ? '高 HIGH' : index === 1 ? '中 MEDIUM' : '低 LOW'}</span></div>)}</div>
      <div className="risk-meter"><span>风险等级</span><strong>{riskText(event.riskLevel)}风险</strong><b>{event.giriScore}</b><MiniBars value={event.giriScore} /></div>
      <h4>后续关注 | Follow-up Watchpoints</h4>
      <ul className="watch-list">{watchpoints.slice(0, 4).map((item) => <li key={item}>{item}<span>◎</span></li>)}</ul>
    </div>
  );
}

function MatrixPage() {
  return (
    <div className="page">
      <PageTitle title="资产影响矩阵 / Asset Impact Matrix" subtitle="关键地缘事件对全球主要资产的潜在影响强度与方向" />
      <div className="segment-bar"><button className="active">1周</button><button>2周</button><button>1个月</button><button>3个月</button><button>6个月</button><button>12个月</button><span /> <button className="active">全球 Global</button><button>中东</button><button>亚太</button><button>欧洲</button><button>北美</button><button>导出</button></div>
      <Panel title="地缘事件 × 资产影响方向" subtitle="Direction and strength"><div className="impact-matrix-wrap"><table className="impact-matrix"><thead><tr><th>地缘事件类型</th>{matrixAssets.map((asset) => <th key={asset}>{asset}</th>)}</tr></thead><tbody>{impactMatrix.map((row) => <tr key={row.eventType}><td><strong>{row.eventTypeCn}</strong><small>{row.eventType}</small></td>{matrixAssets.map((asset) => { const meta = directionMeta(row.values[asset]); return <td key={asset} className={meta.className}><b>{meta.arrow}</b><MiniBars value={meta.className.includes('strong') ? 90 : meta.className.includes('bull') || meta.className.includes('bear') ? 70 : 35} direction={row.values[asset]} /></td>; })}</tr>)}</tbody></table></div><div className="matrix-legend"><span className="bull">↑ 利多 Bullish</span><span className="bear">↓ 利空 Bearish</span><span>→ 中性 Neutral</span><span>影响强度：更多条 = 更强</span></div></Panel>
      <div className="matrix-bottom-grid">
        <Panel title="最强受益资产（利多）" subtitle="Strongest beneficiaries"><AssetRank assets={assetRows.filter((a) => a.impactScore >= 55)} positive /></Panel>
        <Panel title="最强受损资产（风险偏好下行）" subtitle="Strongest casualties"><AssetRank assets={assetRows.filter((a) => a.impactScore < 55)} /></Panel>
        <Panel title="历史反应速度" subtitle="Historical reaction snapshot"><table className="terminal-table small"><tbody>{['红海航运中断','中东局势升级','台海局势紧张','俄乌冲突升级','制裁冲击'].map((event, index) => <tr key={event}><td>{event}</td><td>202{index + 1}-0{index + 1}</td><td className="up">+{(12.3-index*2.1).toFixed(1)}%</td><td className="up">+{(3.1+index*0.4).toFixed(1)}%</td><td className="down">-{(1.6+index*0.7).toFixed(1)}%</td></tr>)}</tbody></table></Panel>
      </div>
      <Panel title="资产市场敏感度评分（综合）" subtitle="综合衡量资产对地缘事件的平均绝对影响强度"><div className="sensitivity-grid">{assetRows.concat([{ asset: 'US10Y', assetCn: '美债10Y', symbol: 'US10Y', direction: 'Neutral', impactScore: 53, change24h: -0.1, trend: [40,43,44,46,50,48,52,51,53,53] } as AssetRow]).map((asset) => <div key={asset.asset} className="sensitivity-card"><b>{asset.asset}</b><strong>{asset.impactScore}</strong><span>{asset.impactScore >= 70 ? '非常高' : asset.impactScore >= 55 ? '高' : '中等'}</span><MiniBars value={asset.impactScore} /></div>)}</div></Panel>
    </div>
  );
}

function BriefPage() {
  return (
    <div className="page">
      <PageTitle title="AI 快讯日报 / AI Daily Brief" subtitle="AI 驱动的地缘情报简报 / AI-powered geopolitical intelligence briefing" />
      <div className="brief-actions"><button className="active">推文版 Tweet</button><button>研报版 Research</button><button>Telegram 快讯</button></div>
      <div className="brief-layout">
        <main>
          <Panel title="今日地缘日报 / Daily Geopolitical Briefing" subtitle="AI 生成于 14:32"><div className="daily-brief"><p>全球风险偏好继续承压，地缘冲突与政策不确定性共振，能源与避险资产表现分化。关注中东、俄乌与美中关系的新动向对市场情绪与资产定价的信号。</p><div className="brief-columns"><div><h4>TOP 5 风险</h4>{regionRisks.slice(0,5).map((risk) => <p key={risk.rank}><b>{risk.rank}</b> {risk.regionCn} / {risk.eventTypeCn} <RiskBadge level={risk.riskLevel} /></p>)}</div><div><h4>24小时变化</h4><p>中东局势升级 ↑↑</p><p>原油供应担忧上升 ↑</p><p>美联储降息预期降温 ↓</p><p>美元走强 ↑</p></div><div><h4>市场解读</h4><p className="big-number">23<small>/100</small></p><span className="risk-red">极度避险 / Extreme Risk-Off</span><Sparkline data={[28,29,25,27,22,24,20,23]} tone="red" /></div><div><h4>未来72小时关注</h4>{watchpoints.slice(0,5).map((item) => <p key={item}>▣ {item}</p>)}</div><div><h4>重点关注资产</h4>{assetRows.slice(0,6).map((asset) => <p key={asset.asset}>{asset.asset} <span className={asset.change24h >= 0 ? 'up' : 'down'}>{asset.change24h >= 0 ? '↑' : '↓'}</span></p>)}</div></div></div></Panel>
          <div className="brief-bottom-grid"><Panel title="地区焦点" subtitle="Regional highlights"><div className="regional-mini"><ul>{['中东 HIGH', '东欧 HIGH', '东亚 MEDIUM', '北美 MEDIUM', '拉美 LOW'].map((item) => <li key={item}>{item}</li>)}</ul><WorldRiskMap compact /></div></Panel><Panel title="资产反应概览" subtitle="Asset reaction summary"><AssetImpactList /></Panel></div>
        </main>
        <aside className="right-rail"><Panel title="AI 快速洞察" subtitle="AI Quick Insights"><div className="insight-list"><p>🔥 中东冲突升级推高油价与避险需求 <RiskBadge level="HIGH" /></p><p>⚖ 美联储降息预期显著降温 <RiskBadge level="MEDIUM" /></p><p>▣ 中美科技限制升级 <RiskBadge level="MEDIUM" /></p><p>📈 全球股市波动性上升 <RiskBadge level="MEDIUM" /></p></div></Panel><Panel title="事件概览（24h）" subtitle="Event summary"><div className="stat-row"><b>27</b><b>9</b><b>14</b><b>41</b></div><div className="progress-stack"><i style={{ width: '22%' }} /><i style={{ width: '32%' }} /><i style={{ width: '46%' }} /></div></Panel><Panel title="重大事件时间线" subtitle="Major developments"><EventList /></Panel></aside>
      </div>
    </div>
  );
}

function RegionalPage() {
  const subregions = ['波斯湾 / Persian Gulf', '霍尔木兹海峡 / Strait of Hormuz', '红海 / Red Sea', '黎凡特 / Levant', '伊拉克 / Iraq', '也门 / Yemen'];
  return (
    <div className="page">
      <PageTitle title="地区分析 / Regional Analysis" />
      <div className="region-selector"><span>选择地区 / Select Region</span><button>🌐 中东 / Middle East ▾</button><em>自动刷新 / Auto-refresh: 60s</em><button>导出报告 / Export</button></div>
      <div className="metric-grid five"><MetricCard label="区域风险评分 (GIRI)" labelEn="Regional GIRI" value="68.7" suffix=" /100" tone="red" /><MetricCard label="24小时变化" labelEn="24h Change" value="+4.8" delta="(+7.9%) 趋势上升" tone="red" /><MetricCard label="关键咽喉要道" labelEn="Key chokepoints" value="7" suffix=" /12" tone="blue" /><MetricCard label="受影响最大的资产" labelEn="Most impacted assets" value="OIL" suffix=" (WTI)" tone="orange" /><MetricCard label="事件总数（24h）" labelEn="Total events" value="47" delta="较昨日 +9" tone="blue" /></div>
      <div className="regional-grid"><Panel title="中东风险态势地图" subtitle="Middle East risk heatmap"><WorldRiskMap /></Panel><Panel title="子区域风险评分" subtitle="Subregion risk breakdown"><table className="terminal-table"><tbody>{subregions.map((name, index) => <tr key={name}><td>{name}</td><td className="score">{[72.4,78.1,61.8,64.2,58.7,69.3][index]}</td><td className="up">▲ {[5.3,6.1,3.6,4.0,2.1,4.7][index]}</td><td><Sparkline data={[43+index,47+index,50+index,52+index,55+index,58+index]} tone="red" /></td></tr>)}</tbody></table></Panel><Panel title="相关资产" subtitle="Related assets"><AssetImpactList /></Panel><Panel title="区域 GIRI 趋势（7天）" subtitle="Regional GIRI trend"><div className="large-chart"><Sparkline data={[42,45,48,49,54,52,60,58,66,62,68,65,68.7]} tone="red" /></div></Panel><Panel title="最新区域事件" subtitle="Latest regional events"><EventList /></Panel><Panel title="情景分析" subtitle="Scenario analysis"><table className="terminal-table"><tbody>{[['基准情景（持续紧张）','55%','高 High','68'],['冲突升级（以伊直接冲突）','25%','极高 Extreme','82'],['停火缓和（区域降温）','15%','中等 Medium','46'],['供应中断（霍尔木兹封锁）','5%','极高 Extreme','90']].map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></Panel></div>
      <Panel title="战略驱动因素" subtitle="Strategic drivers"><div className="driver-grid">{['石油供应','航运安全','军事升级','制裁与政策','政治稳定'].map((driver, index) => <div className="driver-card" key={driver}><span>{driver}</span><strong>{[78,72,69,55,52][index]}<small>/100</small></strong><Sparkline data={[40+index,45+index,50+index,48+index,55+index,60+index]} tone={index < 3 ? 'red' : 'orange'} /><p>{index < 3 ? '高风险 HIGH' : '中等风险 MEDIUM'}</p></div>)}</div></Panel>
    </div>
  );
}

function MonitoringPage() {
  return (
    <div className="page">
      <PageTitle title="数据监控 / Data Monitoring" />
      <div className="metric-grid five"><MetricCard label="数据源可用性（平均）" labelEn="Source uptime" value="99.62%" delta="▲ 0.42%" tone="green" /><MetricCard label="今日摄取事件" labelEn="Events ingested today" value="1.28M" delta="▲ 12.7%" tone="blue" /><MetricCard label="平均延迟（所有源）" labelEn="Avg latency" value="2.83s" delta="▲ 0.36s" tone="orange" /><MetricCard label="API 健康度" labelEn="Core services" value="99.83%" delta="▲ 0.21%" tone="green" /><MetricCard label="数据新鲜度（中位）" labelEn="Freshness median" value="6.2 min" delta="▼ 1.3 min" tone="green" /></div>
      <Panel title="数据管道状态" subtitle="Data pipeline status"><div className="pipeline">{['采集 Collect','传输 Transport','解析 Parse','标准化 Normalize','存储 Store','分发 Serve'].map((step, index) => <div key={step} className="pipe-step"><b>{step}</b><span>{index === 0 ? '36 源 Sources' : '正常 Healthy'}</span>{index < 5 && <i>→</i>}</div>)}</div><div className="pipeline-stats"><span>端到端延迟 <b>2.83s</b></span><span>最后成功处理 <b>14:32:10</b></span><span>吞吐量 <b>18,752 events/min</b></span></div></Panel>
      <div className="monitoring-grid"><Panel title="数据源健康状态" subtitle="Source health"><table className="terminal-table"><thead><tr><th>数据源</th><th>状态</th><th>可用性</th><th>延迟</th><th>新鲜度</th><th>错误率</th><th>今日事件</th><th>趋势</th></tr></thead><tbody>{dataSources.map((source) => <tr key={source.source}><td>{source.source}</td><td><span className={`status ${source.status.toLowerCase()}`}>{source.status}</span></td><td>{source.uptime}%</td><td>{source.latency}s</td><td>{source.freshness} min</td><td className={source.errorRate > 0.2 ? 'down' : 'up'}>{source.errorRate}%</td><td>{source.eventsToday.toLocaleString()}</td><td><Sparkline data={source.trend} tone={source.status === 'Warning' ? 'orange' : 'green'} /></td></tr>)}</tbody></table></Panel><Panel title="摄取量趋势" subtitle="Ingestion volume"><div className="large-chart blue"><Sparkline data={[18,20,28,25,34,29,38,41,55,45,50,42,31]} tone="blue" /></div></Panel><Panel title="告警规则" subtitle="Alert rules"><table className="terminal-table small"><tbody>{['源可用性低于 98%','延迟超过 30 分钟','错误率超过 1%','新鲜度超过 15 分钟','API 响应失败'].map((rule, index) => <tr key={rule}><td>{rule}</td><td className={index === 0 || index === 4 ? 'down' : 'risk-orange'}>{index === 0 || index === 4 ? 'Critical' : 'Warning'}</td><td className="up">启用</td><td>{[2,5,3,4,1][index]}</td></tr>)}</tbody></table></Panel><Panel title="错误日志（最近24小时）" subtitle="Error logs"><table className="terminal-table small"><tbody>{[['14:31:12','EIA','Timeout','Request timeout after 30s'],['14:29:47','ReliefWeb','HTTP 429','Too Many Requests'],['14:27:03','ACLED','ParseError','Invalid date format'],['14:20:58','PortWatch','FieldMissing','Missing vessel imo field']].map((row) => <tr key={row.join('-')}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></Panel><Panel title="数据新鲜度热力图" subtitle="Freshness heatmap"><div className="freshness-grid">{dataSources.map((source) => <div key={source.source}><b>{source.source}</b>{[72,21,5,2,0].map((value, index) => <span key={index} style={{ opacity: 0.35 + value / 120 }}>{value}%</span>)}</div>)}</div></Panel><Panel title="数据覆盖（事件）" subtitle="Source coverage by region"><WorldRiskMap compact /></Panel></div>
    </div>
  );
}

function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return <div className="page-title"><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>;
}

function FilterBar({ filters }: { filters: string[] }) {
  return <div className="filter-bar">{filters.map((filter) => <button key={filter}>{filter}<b>全部 All</b></button>)}<label><span>⌕</span><input placeholder="搜索国家 / 事件 / 关键词" /></label><button>筛选 Filter</button></div>;
}

function DonutList() {
  const regions = ['中东', '东欧', '东亚', '非洲', '南亚', '拉美', '北美', '西欧'];
  return <div className="donut-wrap"><div className="donut" /> <ul>{regions.map((region, index) => <li key={region}><span>{region}</span><b>{[25.8,18.7,14.2,11.6,9.8,7.4,4.1,2.3][index]}</b><em className={index < 5 ? 'up' : 'down'}>{index < 5 ? '▲' : '▼'} {[5.4,3.9,2.5,2.1,1.6,0.8,0.4,0.6][index]}</em></li>)}</ul></div>;
}

function AssetRank({ assets, positive = false }: { assets: AssetRow[]; positive?: boolean }) {
  return <ol className="asset-rank">{assets.slice(0, 5).map((asset, index) => <li key={asset.asset}><b>{index + 1}</b><span>{asset.asset} <small>{asset.assetCn}</small></span><strong className={positive ? 'up' : 'down'}>{positive ? asset.impactScore : -asset.impactScore}</strong><MiniBars value={asset.impactScore} direction={asset.direction} /></li>)}</ol>;
}

function App() {
  const [activePage, setActivePage] = useState<PageId>('home');
  const page = useMemo(() => {
    switch (activePage) {
      case 'ranking': return <RankingPage />;
      case 'timeline': return <TimelinePage />;
      case 'matrix': return <MatrixPage />;
      case 'brief': return <BriefPage />;
      case 'regional': return <RegionalPage />;
      case 'monitoring': return <MonitoringPage />;
      default: return <Dashboard />;
    }
  }, [activePage]);

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onChange={setActivePage} />
      <main className="main-shell">
        <Topbar />
        {page}
      </main>
    </div>
  );
}

export default App;
