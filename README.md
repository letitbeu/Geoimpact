# GeoImpact Terminal

GeoImpact Terminal 是一个地缘政治风险影响监控终端原型，目标是把公开地缘事件转化为风险评分、资产影响矩阵和 AI 简报。

当前版本是 **V0.1 静态前端原型**，重点还原深色金融终端风格和核心产品结构，暂时使用 mock data，不接真实 API。

> Deployment note: this repo now uses TypeScript `moduleResolution: Bundler` for Vercel compatibility.

## 当前已实现

- 左侧侧边栏导航
- 首页 Dashboard
- 风险榜 Risk Ranking
- 事件时间线 Event Timeline
- 资产影响矩阵 Asset Impact Matrix
- AI 快讯日报 AI Daily Brief
- 地区分析 Regional Analysis
- 数据监控 Data Monitoring
- GIRI 地缘影响风险指数展示
- mock 地缘事件、资产影响、数据源健康状态

## 技术栈

- Vite
- React
- TypeScript
- 原生 CSS 深色金融终端风格

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开：

```bash
http://localhost:5173
```

## 构建

```bash
npm run build
npm run preview
```

## 下一步建议

1. 接入 GDELT 最近 24h 事件流。
2. 建立事件去重、地区识别、事件类型分类。
3. 接入市场价格数据，用于 Asset Impact 和 Market Response Score。
4. 接入 Supabase，建立 geo_events、geo_risk_scores、asset_impact_scores 等表。
5. 做 Telegram / Web Push 高影响事件预警。
