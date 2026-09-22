// indicatorExplainers.js
//
// "What is this?" / "Typical impact" text for the detail-page drill-downs.
// These are stable, general definitions (same for every reader), not
// generated or fetched — no live source needed.

module.exports = {
  policy_rate: {
    label: 'Central Bank Policy Rate',
    what_is_this: 'The interest rate a central bank sets for overnight lending between banks. It is the primary tool central banks use to influence inflation and growth.',
    typical_impact: 'A higher/hawkish policy rate is typically supportive for the currency, as it attracts yield-seeking capital. A lower/dovish rate does the reverse.'
  },
  cpi_yoy: {
    label: 'Inflation Rate YoY (CPI)',
    what_is_this: 'The percentage change in the price of a basket of consumer goods and services compared to the same period a year ago.',
    typical_impact: 'A higher inflation reading is typically supportive for the currency, since it raises the odds the central bank keeps rates higher for longer. A lower reading does the reverse.'
  },
  gdp_growth: {
    label: 'GDP Growth Rate',
    what_is_this: 'The percentage change in the total value of goods and services produced by the economy over the period.',
    typical_impact: 'Stronger-than-expected growth is typically supportive for the currency, as it gives the central bank more room to keep policy tight. Weaker growth does the reverse.'
  },
  unemployment: {
    label: 'Unemployment Rate',
    what_is_this: 'The percentage of the labor force that is jobless and actively looking for work.',
    typical_impact: 'A rising unemployment rate is typically negative for the currency, as it signals labor-market weakness and raises the odds of future rate cuts. A falling rate does the reverse.'
  },
  bond_yield_10y: {
    label: '10-Year Government Bond Yield',
    what_is_this: 'The annual return investors demand to lend to the government for about ten years. It reflects long-run growth and inflation expectations and is a benchmark for long-term borrowing costs.',
    typical_impact: 'Rising yields are typically supportive for the currency, since they widen the rate-differential appeal versus other currencies. Falling yields do the reverse.'
  }
};
