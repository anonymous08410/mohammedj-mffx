// dataFetcher.js
//
// Replaces the static numbers in server.js's `data` object with live values,
// refreshed on a schedule. Mutates the `data` object in place so server.js
// doesn't need to change how it serves /api/dashboard.
//
// Sources:
//   - FRED (api.stlouisfed.org)     -> CPI YoY + unemployment, per G10 currency
//   - Frankfurter (frankfurter.app) -> FX pair rates (no key needed)
//   - Twelve Data (twelvedata.com)  -> Gold, Silver, Oil, Copper, Nat Gas
//
// Deliberately NOT automated: central bank policy rates (data.centralBanks).
// They only change around ~8 meetings/year per bank and FRED doesn't have a
// single reliable, consistently-named series for every G10 central bank's
// current policy rate. Safer to keep updating data.centralBanks by hand after
// each meeting than to silently trust a shaky auto-feed on something this
// important to a trade thesis.

const fs = require('fs');
const path = require('path');

const FRED_API_KEY = process.env.FRED_API_KEY;
const TWELVEDATA_API_KEY = process.env.TWELVEDATA_API_KEY;

if (!FRED_API_KEY) console.warn('[dataFetcher] FRED_API_KEY not set — CPI/unemployment will not refresh.');
if (!TWELVEDATA_API_KEY) console.warn('[dataFetcher] TWELVEDATA_API_KEY not set — commodities will not refresh.');

const FRED_BASE = 'https://api.stlouisfed.org/fred/series/observations';

// OECD country codes behind FRED's CPALTT01{CC}M659N (CPI YoY) and
// LRHUTTTT{CC}M156S (harmonized unemployment rate) series.
// EUR uses Germany (DEU) as a proxy — FRED's true euro-area HICP series has a
// different ID (CP0000EZ19M086NEST) if you'd rather switch to that later.
const CURRENCY_TO_OECD = {
  USD: 'USA', EUR: 'DEU', GBP: 'GBR', JPY: 'JPN', CAD: 'CAN',
  AUD: 'AUS', NZD: 'NZL', CHF: 'CHE', SEK: 'SWE', NOK: 'NOR'
};

const COMMODITY_SYMBOLS = {
  gold: 'XAU/USD',
  silver: 'XAG/USD',
  platinum: 'XPT/USD',
  palladium: 'XPD/USD',
  oil_wti: 'WTI/USD',
  oil_brent: 'BRENT/USD',
  natgas: 'NG/USD',
  copper: 'XCU/USD',
  wheat: 'WHEAT/USD',
  corn: 'CORN/USD'
};

const SNAPSHOT_DIR = path.join(__dirname, 'data-snapshots');
if (!fs.existsSync(SNAPSHOT_DIR)) fs.mkdirSync(SNAPSHOT_DIR);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchFredLatest(seriesId) {
  if (!FRED_API_KEY) return { value: null, error: 'FRED_API_KEY not set' };
  const url = `${FRED_BASE}?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=1`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      // FRED puts the real reason in the response body even on 4xx — surface it
      const bodyText = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status}${bodyText ? ' — ' + bodyText.slice(0, 200) : ''}`);
    }
    const json = await res.json();
    const obs = json.observations && json.observations[0];
    if (!obs || obs.value === '.') return { value: null, error: 'No observation data returned' };
    return { value: parseFloat(obs.value), error: null };
  } catch (err) {
    console.error(`[dataFetcher] FRED ${seriesId} failed:`, err.message);
    return { value: null, error: err.message };
  }
}

async function fetchFrankfurterRates(base = 'USD') {
  try {
    const res = await fetch(`https://api.frankfurter.app/latest?from=${base}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return { value: json.rates || null, error: json.rates ? null : 'No rates in response' };
  } catch (err) {
    console.error('[dataFetcher] Frankfurter fetch failed:', err.message);
    return { value: null, error: err.message };
  }
}

async function fetchTwelveDataPrice(symbol) {
  if (!TWELVEDATA_API_KEY) return { value: null, error: 'TWELVEDATA_API_KEY not set' };
  try {
    const res = await fetch(`https://api.twelvedata.com/price?symbol=${encodeURIComponent(symbol)}&apikey=${TWELVEDATA_API_KEY}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.status === 'error' || !json.price) {
      const msg = json.message || 'no price in response';
      console.error(`[dataFetcher] TwelveData ${symbol}:`, msg);
      return { value: null, error: msg };
    }
    return { value: parseFloat(json.price), error: null };
  } catch (err) {
    console.error(`[dataFetcher] TwelveData ${symbol} failed:`, err.message);
    return { value: null, error: err.message };
  }
}

function saveDailySnapshot(data) {
  const today = new Date().toISOString().slice(0, 10);
  const file = path.join(SNAPSHOT_DIR, `${today}.json`);
  if (fs.existsSync(file)) return; // already have today's snapshot

  const snapshot = {};
  for (const [ccy, d] of Object.entries(data.g10Data || {})) {
    snapshot[ccy] = {
      rate: d.rate,
      cpi_yoy: d.macroData ? d.macroData.cpi_yoy : undefined,
      unemployment: d.macroData ? d.macroData.unemployment : undefined,
      gdpGrowth: d.macroData ? d.macroData.gdpGrowth : undefined
    };
  }
  try {
    fs.writeFileSync(file, JSON.stringify({ date: today, snapshot }, null, 2));
    console.log(`[dataFetcher] Saved daily snapshot: ${file}`);
  } catch (err) {
    console.error('[dataFetcher] Failed to write daily snapshot:', err.message);
  }
}

async function refreshLiveData(data) {
  const startedAt = new Date().toISOString();
  console.log('[dataFetcher] Refresh starting:', startedAt);
  let ok = 0, failed = 0;
  const failures = [];

  // --- CPI + unemployment per G10 currency (FRED) ---
  for (const [ccy, oecdCode] of Object.entries(CURRENCY_TO_OECD)) {
    if (!data.g10Data[ccy]) continue;

    const cpi = await fetchFredLatest(`CPALTT01${oecdCode}M659N`);
    if (cpi.value !== null) {
      data.g10Data[ccy].inflation = cpi.value;
      data.g10Data[ccy].macroData.cpi_yoy = cpi.value;
      ok++;
    } else {
      failed++; failures.push(`${ccy} CPI: ${cpi.error}`);
    }

    const unemployment = await fetchFredLatest(`LRHUTTTT${oecdCode}M156S`);
    if (unemployment.value !== null) {
      data.g10Data[ccy].macroData.unemployment = unemployment.value;
      ok++;
    } else {
      failed++; failures.push(`${ccy} unemployment: ${unemployment.error}`);
    }
  }

  // US GDP growth — kept US-only for now; other countries' FRED growth series
  // aren't consistent enough in naming to trust without individually verifying each one.
  const usGdp = await fetchFredLatest('A191RL1Q225SBEA');
  if (usGdp.value !== null) {
    data.g10Data.USD.macroData.gdpGrowth = usGdp.value;
    ok++;
  } else {
    failed++; failures.push(`USD GDP growth: ${usGdp.error}`);
  }

  // --- FX rates (Frankfurter, no key) ---
  const fxRates = await fetchFrankfurterRates('USD');
  if (fxRates.value) {
    data.fxRates = { base: 'USD', rates: fxRates.value, updated: new Date().toISOString() };
    ok++;
  } else {
    failed++; failures.push(`FX rates: ${fxRates.error}`);
  }

  // --- Commodities (Twelve Data) ---
  // Free tier caps at 8 requests/minute, so space calls out instead of firing
  // them back-to-back — otherwise everything after the first few silently
  // rate-limits.
  data.commodities = data.commodities || {};
  let commodityIndex = 0;
  for (const [key, symbol] of Object.entries(COMMODITY_SYMBOLS)) {
    if (commodityIndex > 0) await sleep(8000); // stay under 8 req/min
    commodityIndex++;

    const price = await fetchTwelveDataPrice(symbol);
    if (price.value !== null) {
      data.commodities[key] = { price: price.value, symbol, updated: new Date().toISOString() };
      ok++;
    } else {
      failed++; failures.push(`${key}: ${price.error}`);
    }
  }

  data.lastLiveUpdate = new Date().toISOString();
  data.liveDataHealth = { ok, failed, failures, lastRun: data.lastLiveUpdate };

  saveDailySnapshot(data);
  console.log(`[dataFetcher] Refresh complete: ${ok} ok, ${failed} failed.`, failed ? `Failed: ${failures.join(', ')}` : '');
}

function startLiveDataRefresh(data, intervalMinutes = 30) {
  refreshLiveData(data); // run once immediately on boot
  setInterval(() => refreshLiveData(data), intervalMinutes * 60 * 1000);
}

module.exports = { startLiveDataRefresh, refreshLiveData };
