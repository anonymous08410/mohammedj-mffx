// centralBankAnalysis.js
//
// For each G10 central bank: pulls the latest real statement/press-release
// text from that bank's own official RSS feed, then asks Claude to turn it
// into the structured analysis your dashboard displays (The Read, what
// changed since last meeting, vote split, per-category commentary).
//
// IMPORTANT: this only ever summarizes text actually fetched from the
// central bank's own site. If a feed fails or returns nothing, that bank's
// analysis is simply left unset (or kept at its last good value) — nothing
// here fabricates a statement.
//
// Runs once/day (not every 30 min like dataFetcher) since central bank
// statements only change around meeting dates, not continuously.

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) console.warn('[centralBankAnalysis] ANTHROPIC_API_KEY not set — statement analysis will not run.');

// Confidence-labeled feed map. "confirmed" feeds follow a verified URL
// pattern from that bank's own feed index. "unverified" are a best guess —
// they may 404; check server logs after first deploy and swap in a working
// URL if one fails. "none" means no reliable public feed was found — that
// bank's analysis stays unavailable until you supply one.
const CENTRAL_BANK_FEEDS = {
  USD: { name: 'Federal Reserve', url: 'https://www.federalreserve.gov/feeds/press_monetary.xml', confidence: 'confirmed', keywords: [] },
  EUR: { name: 'European Central Bank', url: 'https://www.ecb.europa.eu/rss/press.xml', confidence: 'confirmed', keywords: ['monetary policy', 'governing council', 'interest rate'] },
  GBP: { name: 'Bank of England', url: 'https://www.bankofengland.co.uk/rss/news', confidence: 'unverified', keywords: ['bank rate', 'mpc', 'monetary policy'] },
  CAD: { name: 'Bank of Canada', url: 'https://www.bankofcanada.ca/content_type/press-releases/feed/', confidence: 'unverified', keywords: ['interest rate', 'policy rate'] },
  AUD: { name: 'Reserve Bank of Australia', url: 'https://www.rba.gov.au/rss/rss-cb-media-releases.xml', confidence: 'unverified', keywords: ['cash rate', 'monetary policy'] },
  JPY: { name: 'Bank of Japan', url: null, confidence: 'none', keywords: [] },
  NZD: { name: 'Reserve Bank of New Zealand', url: null, confidence: 'none', keywords: [] },
  CHF: { name: 'Swiss National Bank', url: null, confidence: 'none', keywords: [] },
  SEK: { name: 'Sveriges Riksbank', url: null, confidence: 'none', keywords: [] },
  NOK: { name: 'Norges Bank', url: null, confidence: 'none', keywords: [] }
};

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractLatestRssItem(xml, preferKeywords = []) {
  const items = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
  if (items.length === 0) return null;

  function parseItem(item) {
    const title = (item.match(/<title>([\s\S]*?)<\/title>/i) || [])[1];
    const link = (item.match(/<link>([\s\S]*?)<\/link>/i) || [])[1];
    const description = (item.match(/<description>([\s\S]*?)<\/description>/i) || [])[1];
    const pubDate = (item.match(/<pubDate>([\s\S]*?)<\/pubDate>/i) || [])[1];
    return {
      title: title ? stripHtml(title.replace('<![CDATA[', '').replace(']]>', '')) : null,
      link: link ? link.replace('<![CDATA[', '').replace(']]>', '').trim() : null,
      description: description ? stripHtml(description.replace('<![CDATA[', '').replace(']]>', '')) : '',
      pubDate: pubDate || null
    };
  }

  // If the feed mixes content types (speeches, general press, etc.), prefer
  // the first item whose title actually matches what we're looking for
  // rather than blindly taking whatever happens to be newest.
  if (preferKeywords.length > 0) {
    for (const raw of items) {
      const parsed = parseItem(raw);
      if (parsed.title && preferKeywords.some(kw => parsed.title.toLowerCase().includes(kw))) {
        return parsed;
      }
    }
  }

  // No keyword match (or none requested) — fall back to the newest item
  return parseItem(items[0]);
}

async function fetchLatestStatementText(feedUrl, preferKeywords = []) {
  const res = await fetch(feedUrl);
  if (!res.ok) throw new Error(`Feed HTTP ${res.status}`);
  const xml = await res.text();
  const item = extractLatestRssItem(xml, preferKeywords);
  if (!item || !item.link) throw new Error('No item found in feed');

  // Try to fetch the full press release page for more text than the RSS snippet
  let fullText = item.description;
  try {
    const pageRes = await fetch(item.link);
    if (pageRes.ok) {
      const html = await pageRes.text();
      const bodyText = stripHtml(html);
      // Only use it if it's substantially longer than the RSS snippet (i.e. actually got the article)
      if (bodyText.length > fullText.length * 2) fullText = bodyText.slice(0, 8000);
    }
  } catch (e) {
    // Fall back to RSS description text — not fatal
  }

  return { title: item.title, link: item.link, pubDate: item.pubDate, text: fullText };
}

async function summarizeWithClaude(bankName, currency, statement) {
  const prompt = `You are analyzing an official central bank statement for an FX trading dashboard. Below is the real text of the latest statement from the ${bankName} (${currency}), published ${statement.pubDate || 'recently'}, titled "${statement.title}".

Using ONLY the information in this statement — do not invent facts, numbers, or votes not present in the text — produce a JSON object with this exact shape:

{
  "the_read": "2-3 sentence plain-English summary of the policy decision and its significance",
  "what_changed": "1-2 sentences on what changed since the prior statement, if the text indicates this; otherwise null",
  "vote_split": "e.g. '7-2' if stated in the text, otherwise null",
  "conviction": "High|Medium|Low based on how decisive/hawkish-or-dovish the language is",
  "views": {
    "inflation": "1-2 sentence summary of what the statement says about inflation, or null if not mentioned",
    "growth": "1-2 sentence summary of what the statement says about growth, or null",
    "labour": "1-2 sentence summary of what the statement says about the labor market, or null",
    "risk": "1-2 sentence summary of risks flagged, or null"
  }
}

Respond with ONLY the JSON object, no other text, no markdown fences.

STATEMENT TEXT:
${statement.text}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-5',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!res.ok) throw new Error(`Claude API HTTP ${res.status}`);
  const json = await res.json();
  const textBlock = (json.content || []).find(b => b.type === 'text');
  if (!textBlock) throw new Error('No text in Claude response');

  const cleaned = textBlock.text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
  return JSON.parse(cleaned);
}

async function refreshCentralBankAnalysis(data) {
  if (!ANTHROPIC_API_KEY) return;
  console.log('[centralBankAnalysis] Refresh starting:', new Date().toISOString());
  data.centralBankAnalysis = data.centralBankAnalysis || {};
  let ok = 0, failed = 0;
  const failures = [];

  for (const [ccy, bank] of Object.entries(CENTRAL_BANK_FEEDS)) {
    if (!bank.url) {
      failures.push(`${ccy} (no known feed — needs manual URL)`);
      continue;
    }
    try {
      const statement = await fetchLatestStatementText(bank.url, bank.keywords || []);
      const analysis = await summarizeWithClaude(bank.name, ccy, statement);
      data.centralBankAnalysis[ccy] = {
        ...analysis,
        source_title: statement.title,
        source_link: statement.link,
        source_date: statement.pubDate,
        generated_at: new Date().toISOString()
      };
      ok++;
    } catch (err) {
      failed++;
      failures.push(`${ccy}: ${err.message}`);
      console.error(`[centralBankAnalysis] ${ccy} (${bank.name}) failed:`, err.message);
    }
  }

  data.centralBankAnalysisHealth = { ok, failed, failures, lastRun: new Date().toISOString() };
  console.log(`[centralBankAnalysis] Refresh complete: ${ok} ok, ${failed} failed/skipped.`);
}

function startCentralBankAnalysis(data, intervalHours = 24) {
  refreshCentralBankAnalysis(data);
  setInterval(() => refreshCentralBankAnalysis(data), intervalHours * 60 * 60 * 1000);
}

module.exports = { startCentralBankAnalysis, refreshCentralBankAnalysis, CENTRAL_BANK_FEEDS };
