const http = require('http');
const PORT = process.env.PORT || 5000;

// Mock data
const macroData = {
  rates: [
    { country: 'US', rate: 3.75 },
    { country: 'EUR', rate: 2.25 },
    { country: 'UK', rate: 3.75 },
    { country: 'Japan', rate: 1.00 },
    { country: 'Canada', rate: 4.50 },
    { country: 'Australia', rate: 3.60 },
    { country: 'New Zealand', rate: 4.25 },
    { country: 'Switzerland', rate: 1.50 }
  ],
  inflation: [
    { country: 'US', value: 4.2 },
    { country: 'EUR', value: 3.2 },
    { country: 'UK', value: 3.8 },
    { country: 'Japan', value: 1.9 },
    { country: 'Canada', value: 2.7 },
    { country: 'Australia', value: 3.5 }
  ],
  fxPairs: [
    { pair: 'EUR/USD', rate: 1.1683, change: 0.25 },
    { pair: 'GBP/USD', rate: 1.3400, change: 0.15 },
    { pair: 'USD/JPY', rate: 159.40, change: -0.30 },
    { pair: 'AUD/USD', rate: 0.6750, change: 0.10 },
    { pair: 'NZD/USD', rate: 0.6100, change: 0.05 },
    { pair: 'USD/CHF', rate: 0.8950, change: 0.20 },
    { pair: 'USD/NOK', rate: 10.85, change: 0.35 },
    { pair: 'USD/SEK', rate: 10.45, change: 0.40 }
  ],
  commodities: [
    { name: 'Brent Crude', price: 95.50, change: -1.20 },
    { name: 'WTI Crude', price: 92.30, change: -1.10 },
    { name: 'Gold', price: 1945.50, change: 0.85 },
    { name: 'Silver', price: 24.75, change: 0.15 },
    { name: 'Copper', price: 4.15, change: 0.10 },
    { name: 'Natural Gas', price: 2.85, change: -0.05 }
  ],
  news: [
    {
      title: 'Fed Chair Warsh Signals Pause in Rate Hikes Amid Economic Slowdown',
      source: 'Reuters',
      category: 'Fed',
      impact: 'High',
      published: new Date(Date.now() - 2 * 60000).toISOString(),
      summary: 'New Fed Chair suggests current rate levels may be appropriate as inflation moderates'
    },
    {
      title: 'ECB Hikes Rates 25bps; Lagarde: More Tightening Ahead',
      source: 'Bloomberg',
      category: 'ECB',
      impact: 'High',
      published: new Date(Date.now() - 5 * 60000).toISOString(),
      summary: 'ECB raises rates to 2.25%, expects additional hikes despite economic headwinds'
    },
    {
      title: 'US CPI Rises 4.2% YoY in May; Shelter Pressure Persists',
      source: 'CNBC',
      category: 'Inflation',
      impact: 'High',
      published: new Date(Date.now() - 8 * 60000).toISOString(),
      summary: 'Consumer price inflation remains elevated; shelter costs driving core CPI higher'
    },
    {
      title: 'BoJ Raises Rates to 1.0%; JPY Intervention Risk Escalates',
      source: 'Financial Times',
      category: 'BoJ',
      impact: 'High',
      published: new Date(Date.now() - 10 * 60000).toISOString(),
      summary: 'Bank of Japan hikes to 1% amid yen weakness; MoF warns on intervention'
    },
    {
      title: 'Oil Markets Rally on Hormuz Strait Tensions; Brent Above $95',
      source: 'MarketWatch',
      category: 'Commodities',
      impact: 'Medium',
      published: new Date(Date.now() - 15 * 60000).toISOString(),
      summary: 'Crude oil gains on geopolitical risk; supply concerns support prices'
    },
    {
      title: 'Euro Strengthens Against Dollar Despite Economic Weakness',
      source: 'DW',
      category: 'FX',
      impact: 'Medium',
      published: new Date(Date.now() - 20 * 60000).toISOString(),
      summary: 'EUR/USD rallies to 1.17 on ECB hawkish tilt; market reprices rate expectations'
    },
    {
      title: 'UK PMI Falls to 6-Month Low; BoE Rate Hike Pressure Eases',
      source: 'Financial Times',
      category: 'UK',
      impact: 'Medium',
      published: new Date(Date.now() - 25 * 60000).toISOString(),
      summary: 'Manufacturing PMI weakens; market now pricing fewer BoE rate hikes'
    },
    {
      title: 'China Cuts Reserve Requirements; Yuan Weakens 0.5%',
      source: 'Bloomberg',
      category: 'EM',
      impact: 'Medium',
      published: new Date(Date.now() - 30 * 60000).toISOString(),
      summary: 'PBOC easing signals soften yuan; implications for global risk sentiment'
    }
  ]
};

// Simple HTTP server
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Routes
  if (req.url === '/api/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
  }
  else if (req.url === '/api/dashboard') {
    res.writeHead(200);
    res.end(JSON.stringify(macroData));
  }
  else if (req.url === '/api/news') {
    res.writeHead(200);
    res.end(JSON.stringify({ news: macroData.news }));
  }
  else if (req.url === '/api/rates') {
    res.writeHead(200);
    res.end(JSON.stringify(macroData.rates));
  }
  else if (req.url === '/api/inflation') {
    res.writeHead(200);
    res.end(JSON.stringify(macroData.inflation));
  }
  else if (req.url === '/api/fx-pairs') {
    res.writeHead(200);
    res.end(JSON.stringify(macroData.fxPairs));
  }
  else if (req.url === '/api/commodities') {
    res.writeHead(200);
    res.end(JSON.stringify(macroData.commodities));
  }
  else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Macro Dashboard API running on port ${PORT}`);
});
