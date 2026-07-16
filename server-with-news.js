const http = require('http');
const PORT = process.env.PORT || 5000;

const data = {
  rates: [
    { country: 'US', rate: 3.75 },
    { country: 'EUR', rate: 2.25 },
    { country: 'UK', rate: 3.75 },
    { country: 'Japan', rate: 1.00 }
  ],
  inflation: [
    { country: 'US', value: 4.2 },
    { country: 'EUR', value: 3.2 },
    { country: 'UK', value: 3.8 },
    { country: 'Japan', value: 1.9 }
  ],
  fxPairs: [
    { pair: 'EUR/USD', rate: 1.1683, change: 0.25 },
    { pair: 'GBP/USD', rate: 1.3400, change: 0.15 },
    { pair: 'USD/JPY', rate: 159.40, change: -0.30 },
    { pair: 'AUD/USD', rate: 0.6750, change: 0.10 }
  ],
  commodities: [
    { name: 'Brent Crude', price: 95.50, change: -1.20 },
    { name: 'Gold', price: 1945.50, change: 0.85 },
    { name: 'Silver', price: 24.75, change: 0.15 }
  ],
  news: [
    { title: 'Fed Signals Pause in Rate Hikes', source: 'Reuters', category: 'Fed', impact: 'High', published: new Date().toISOString(), summary: 'New Fed Chair hints at end of tightening cycle' },
    { title: 'ECB Hikes 25bps; More to Come', source: 'Bloomberg', category: 'ECB', impact: 'High', published: new Date().toISOString(), summary: 'ECB raises to 2.25%, expects additional hikes' },
    { title: 'USD/JPY Near 160 Intervention Level', source: 'FT', category: 'FX', impact: 'High', published: new Date().toISOString(), summary: 'Yen weakness escalates; MoF intervention risk rises' },
    { title: 'Oil Rally on Hormuz Tensions', source: 'MarketWatch', category: 'Commodities', impact: 'Medium', published: new Date().toISOString(), summary: 'Brent crude breaks above $95 on supply concerns' }
  ]
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/api/dashboard') {
    res.writeHead(200);
    res.end(JSON.stringify(data));
  } else if (req.url === '/api/news') {
    res.writeHead(200);
    res.end(JSON.stringify({ news: data.news }));
  } else if (req.url === '/api/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok' }));
  } else {
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'Macro Dashboard API' }));
  }
});

server.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
