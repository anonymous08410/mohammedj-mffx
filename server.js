const http = require('http');
const PORT = process.env.PORT || 5000;

const data = {
  // TOP STATS
  topStats: {
    dot: { value: 53.6, change: 0.3, direction: 'up' },
    institutions: { value: 53.6, change: -2.1, direction: 'down' },
    retail: { value: 46.8, change: 1.2, direction: 'up' },
    oil: { value: 95.50, change: -2.92, direction: 'down' },
    gold: { value: 1945.27, change: -0.83, direction: 'down' },
    silver: { value: 24.98, change: -1.16, direction: 'down' },
    dxy: { value: 104.3, change: 0.4, direction: 'up' },
    vix: { value: 18.5, change: 1.2, direction: 'up' },
    usHY: { value: 425, change: 15, direction: 'up' }
  },

  // COMPREHENSIVE G10 DATA
  g10Data: {
    USD: {
      name: 'United States',
      flag: '🇺🇸',
      rate: 3.75,
      inflation: 4.2,
      rateExpectation: { prev: 3.75, next6m: 3.50, next12m: 3.25, nextMeeting: '2026-09-16' },
      
      // MACRO DATA
      macroData: {
        unemployment: 3.9,
        wageGrowth: 4.0,
        ppi_yoy: 3.1,
        ppi_mom: 0.2,
        nfp: 206000,
        manufacturingPmi: 51.2,
        servicesPmi: 54.3,
        compositePmi: 53.8,
        retailSales: -0.4,
        industrialProduction: 1.2,
        gdpGrowth: 0.8,
        cpi_yoy: 4.2,
        cpi_mom: 0.3,
        cpi_3m: 3.8,
        coreInflation: 2.9,
        participationRate: 63.1
      },

      // REAL YIELDS & BONDS
      realYields: {
        rea_10y: 1.85,
        nom_10y: 4.25,
        tips_breakeven: 2.40,
        rea_2y: 2.15,
        rea_5y: 1.95,
        termPremium: 0.45,
        basisPoints_2s10s: 210
      },

      // YIELD CURVE
      yieldCurve: {
        '2Y': 4.10,
        '5Y': 4.05,
        '10Y': 4.25,
        '30Y': 4.35,
        spread_2s10s: 15
      },

      // COT POSITIONING (Commitments of Traders - DXY Futures)
      cot: {
        commercialNet: -85000,
        largeSpecNet: 125000,
        smallSpecNet: -40000,
        totalOpenInterest: 500000,
        commercialPercent: -17,
        largeSpecPercent: 25
      },

      // CREDIT SPREADS
      creditSpreads: {
        ig_oas: 95,
        hy_oas: 425,
        tt_oas: 175
      },

      // CAPITAL FLOWS
      capitalFlows: {
        fdi_3m: 45000,
        portfolio_inflow_week: 12000,
        equityFlow: 8500,
        bondFlow: 3500,
        netFlow: 11500
      },

      // MONETARY CONDITIONS
      monetaryConditions: {
        index: 75,
        rating: 'Tight',
        rateGap: 0.75,
        creditGrowth: 2.8,
        m2_growth: 3.2
      },

      // RISK SENTIMENT
      riskSentiment: {
        equity_implied_vol: 18.5,
        riskReversal_1m: 1.2,
        put_call_ratio: 1.15,
        safehaven_demand: 'Moderate',
        riskSentiment: 'Neutral'
      },

      // ECONOMIC SURPRISES
      surprises: {
        cisiEconomicSurpriseIndex: 35,
        nfpSurprise: 11000,
        cpiSurprise: -0.1,
        pmiSurprise: 2.3,
        surveyBeatPercent: 62
      },

      leadingIndicators: {
        ppi: { value: 3.1, change: -0.1, direction: 'down' },
        economicSentiment: { value: 93.5, change: 2.1, direction: 'up' },
        retailSales: { value: -0.4, change: 0.2, direction: 'down' },
        labourMarketIndex: { value: 65.3, change: -1.2, direction: 'down' }
      },

      themes: [
        { name: 'INFLATION', value: 4.2, sentiment: 'falling' },
        { name: 'GROWTH', value: 0.8, sentiment: 'stable' },
        { name: 'LABOUR', value: 3.9, sentiment: 'stable' },
        { name: 'POLICY', value: '3.75%', sentiment: 'unknown' }
      ],

      recentReleases: [
        { event: 'Unemployment Rate', value: '3.9%', prev: '4.0%', impact: 'BEAT', time: '1h ago', surprise: 10 },
        { event: 'Non Farm Payrolls', value: '206K', prev: '195K', impact: 'BEAT', time: '1h ago', surprise: 11 },
        { event: 'Average Hourly Earnings YoY', value: '4.0%', prev: '3.8%', impact: 'BEAT', time: '1h ago', surprise: 200 }
      ]
    },

    EUR: {
      name: 'Eurozone',
      flag: '🇪🇺',
      rate: 2.25,
      inflation: 3.2,
      rateExpectation: { prev: 2.25, next6m: 2.00, next12m: 1.75, nextMeeting: '2026-10-06' },
      
      macroData: {
        unemployment: 6.2,
        wageGrowth: 3.2,
        ppi_yoy: 2.8,
        ppi_mom: 0.0,
        manufacturingPmi: 48.5,
        servicesPmi: 52.1,
        compositePmi: 50.3,
        retailSales: -0.8,
        industrialProduction: -0.5,
        gdpGrowth: 0.1,
        cpi_yoy: 3.2,
        cpi_mom: 0.1,
        cpi_3m: 2.9,
        coreInflation: 2.5,
        participationRate: 65.2
      },

      realYields: {
        rea_10y: 0.65,
        nom_10y: 2.25,
        tips_breakeven: 1.60,
        rea_2y: 1.15,
        rea_5y: 0.85,
        termPremium: 0.30,
        basisPoints_2s10s: 110
      },

      yieldCurve: {
        '2Y': 2.05,
        '5Y': 2.10,
        '10Y': 2.25,
        '30Y': 2.50,
        spread_2s10s: 20
      },

      cot: {
        commercialNet: 125000,
        largeSpecNet: -95000,
        smallSpecNet: -30000,
        totalOpenInterest: 450000,
        commercialPercent: 28,
        largeSpecPercent: -21
      },

      creditSpreads: {
        ig_oas: 110,
        hy_oas: 520,
        tt_oas: 200
      },

      capitalFlows: {
        fdi_3m: 28000,
        portfolio_inflow_week: -5000,
        equityFlow: -3000,
        bondFlow: -2000,
        netFlow: -5000
      },

      monetaryConditions: {
        index: 55,
        rating: 'Neutral',
        rateGap: -0.25,
        creditGrowth: 1.8,
        m2_growth: 1.2
      },

      riskSentiment: {
        equity_implied_vol: 22.1,
        riskReversal_1m: -2.1,
        put_call_ratio: 1.35,
        safehaven_demand: 'Moderate',
        riskSentiment: 'Risk-off'
      },

      surprises: {
        cisiEconomicSurpriseIndex: -15,
        nfpSurprise: -8000,
        cpiSurprise: -0.2,
        pmiSurprise: -1.5,
        surveyBeatPercent: 42
      },

      leadingIndicators: {
        ppi: { value: 2.8, change: 0.1, direction: 'up' },
        economicSentiment: { value: 88.2, change: -1.5, direction: 'down' },
        retailSales: { value: -0.8, change: -0.2, direction: 'down' },
        labourMarketIndex: { value: 62.1, change: 0.5, direction: 'up' }
      },

      themes: [
        { name: 'INFLATION', value: 3.2, sentiment: 'falling' },
        { name: 'GROWTH', value: 0.1, sentiment: 'falling' },
        { name: 'LABOUR', value: 6.2, sentiment: 'rising' },
        { name: 'POLICY', value: 'Cut - Maybe', sentiment: 'cutting' }
      ],

      recentReleases: [
        { event: 'CPI Release', value: '3.2%', prev: '3.4%', impact: 'BEAT', time: '2h ago', surprise: -20 },
        { event: 'Manufacturing PMI', value: '48.5', prev: '49.2', impact: 'MISS', time: '3h ago', surprise: -70 },
        { event: 'Unemployment Rate', value: '6.2%', prev: '6.5%', impact: 'BEAT', time: '1d ago', surprise: 30 }
      ]
    },

    GBP: {
      name: 'United Kingdom',
      flag: '🇬🇧',
      rate: 3.75,
      inflation: 3.8,
      rateExpectation: { prev: 3.75, next6m: 3.50, next12m: 3.25, nextMeeting: '2026-08-20' },
      
      macroData: {
        unemployment: 4.1,
        wageGrowth: 5.2,
        ppi_yoy: 2.1,
        ppi_mom: -0.1,
        manufacturingPmi: 49.3,
        servicesPmi: 53.5,
        compositePmi: 51.4,
        retailSales: 1.3,
        industrialProduction: 0.8,
        gdpGrowth: 0.5,
        cpi_yoy: 3.8,
        cpi_mom: 0.2,
        cpi_3m: 3.5,
        coreInflation: 3.2,
        participationRate: 64.8
      },

      realYields: {
        rea_10y: 1.35,
        nom_10y: 3.75,
        tips_breakeven: 2.40,
        rea_2y: 1.65,
        rea_5y: 1.45,
        termPremium: 0.35,
        basisPoints_2s10s: 110
      },

      yieldCurve: {
        '2Y': 3.75,
        '5Y': 3.70,
        '10Y': 3.75,
        '30Y': 3.95,
        spread_2s10s: 0
      },

      cot: {
        commercialNet: -45000,
        largeSpecNet: 65000,
        smallSpecNet: -20000,
        totalOpenInterest: 380000,
        commercialPercent: -12,
        largeSpecPercent: 17
      },

      creditSpreads: {
        ig_oas: 105,
        hy_oas: 480,
        tt_oas: 185
      },

      capitalFlows: {
        fdi_3m: 18000,
        portfolio_inflow_week: 6000,
        equityFlow: 3500,
        bondFlow: 2500,
        netFlow: 6000
      },

      monetaryConditions: {
        index: 70,
        rating: 'Tight',
        rateGap: 0.50,
        creditGrowth: 2.2,
        m2_growth: 2.8
      },

      riskSentiment: {
        equity_implied_vol: 20.3,
        riskReversal_1m: 0.8,
        put_call_ratio: 1.12,
        safehaven_demand: 'Low',
        riskSentiment: 'Neutral'
      },

      surprises: {
        cisiEconomicSurpriseIndex: 22,
        nfpSurprise: 5000,
        cpiSurprise: 0.1,
        pmiSurprise: 1.2,
        surveyBeatPercent: 58
      },

      leadingIndicators: {
        ppi: { value: 2.1, change: -0.1, direction: 'down' },
        economicSentiment: { value: 85.4, change: 1.2, direction: 'up' },
        retailSales: { value: 1.3, change: 0.4, direction: 'up' },
        labourMarketIndex: { value: 68.5, change: -0.8, direction: 'down' }
      },

      themes: [
        { name: 'INFLATION', value: 3.8, sentiment: 'stable' },
        { name: 'GROWTH', value: 0.5, sentiment: 'stable' },
        { name: 'LABOUR', value: 5.2, sentiment: 'rising' },
        { name: 'POLICY', value: 'Hold', sentiment: 'unknown' }
      ],

      recentReleases: [
        { event: 'Unemployment Rate', value: '4.1%', prev: '4.2%', impact: 'BEAT', time: '5h ago', surprise: 10 },
        { event: 'Average Earnings Growth', value: '5.2%', prev: '5.0%', impact: 'BEAT', time: '5h ago', surprise: 200 },
        { event: 'Retail Sales', value: '1.3%', prev: '0.9%', impact: 'BEAT', time: '1d ago', surprise: 40 }
      ]
    },

    JPY: {
      name: 'Japan',
      flag: '🇯🇵',
      rate: 1.00,
      inflation: 1.9,
      rateExpectation: { prev: 1.00, next6m: 1.25, next12m: 1.50, nextMeeting: '2026-07-27' },
      
      macroData: {
        unemployment: 2.5,
        wageGrowth: 2.1,
        ppi_yoy: 1.5,
        ppi_mom: 0.1,
        manufacturingPmi: 50.8,
        servicesPmi: 51.2,
        compositePmi: 51.0,
        retailSales: 0.2,
        industrialProduction: -0.8,
        gdpGrowth: 0.0,
        cpi_yoy: 1.9,
        cpi_mom: 0.1,
        cpi_3m: 1.6,
        coreInflation: 1.5,
        participationRate: 62.5
      },

      realYields: {
        rea_10y: 1.15,
        nom_10y: 1.85,
        tips_breakeven: 0.70,
        rea_2y: 0.65,
        rea_5y: 0.90,
        termPremium: 0.50,
        basisPoints_2s10s: 120
      },

      yieldCurve: {
        '2Y': 0.95,
        '5Y': 1.20,
        '10Y': 1.85,
        '30Y': 2.15,
        spread_2s10s: 90
      },

      cot: {
        commercialNet: 185000,
        largeSpecNet: -125000,
        smallSpecNet: -60000,
        totalOpenInterest: 520000,
        commercialPercent: 35,
        largeSpecPercent: -24
      },

      creditSpreads: {
        ig_oas: 85,
        hy_oas: 380,
        tt_oas: 155
      },

      capitalFlows: {
        fdi_3m: 12000,
        portfolio_inflow_week: -8000,
        equityFlow: -5000,
        bondFlow: -3000,
        netFlow: -8000
      },

      monetaryConditions: {
        index: 35,
        rating: 'Very Loose',
        rateGap: -2.75,
        creditGrowth: 0.8,
        m2_growth: 2.1
      },

      riskSentiment: {
        equity_implied_vol: 19.2,
        riskReversal_1m: -3.5,
        put_call_ratio: 1.45,
        safehaven_demand: 'High',
        riskSentiment: 'Risk-off'
      },

      surprises: {
        cisiEconomicSurpriseIndex: -25,
        nfpSurprise: -12000,
        cpiSurprise: -0.3,
        pmiSurprise: 0.5,
        surveyBeatPercent: 40
      },

      leadingIndicators: {
        ppi: { value: 1.5, change: 0.1, direction: 'up' },
        economicSentiment: { value: 79.3, change: -2.3, direction: 'down' },
        retailSales: { value: 0.2, change: -0.1, direction: 'down' },
        labourMarketIndex: { value: 55.2, change: 1.5, direction: 'up' }
      },

      themes: [
        { name: 'INFLATION', value: 1.9, sentiment: 'stable' },
        { name: 'GROWTH', value: 0.0, sentiment: 'falling' },
        { name: 'LABOUR', value: 2.5, sentiment: 'stable' },
        { name: 'POLICY', value: '+25bps', sentiment: 'hiking' }
      ],

      recentReleases: [
        { event: 'CPI Release', value: '1.9%', prev: '2.0%', impact: 'MISS', time: '2d ago', surprise: -10 },
        { event: 'Industrial Production', value: '-0.8%', prev: '0.5%', impact: 'MISS', time: '3d ago', surprise: -130 },
        { event: 'Unemployment Rate', value: '2.5%', prev: '2.6%', impact: 'BEAT', time: '4d ago', surprise: 10 }
      ]
    },

    CAD: {
      name: 'Canada',
      flag: '🇨🇦',
      rate: 4.50,
      inflation: 2.7,
      rateExpectation: { prev: 4.50, next6m: 4.00, next12m: 3.50, nextMeeting: '2026-09-16' },
      
      macroData: {
        unemployment: 6.0,
        wageGrowth: 3.8,
        ppi_yoy: 2.4,
        ppi_mom: 0.0,
        manufacturingPmi: 47.3,
        servicesPmi: 50.8,
        compositePmi: 49.0,
        retailSales: -1.2,
        industrialProduction: -0.6,
        gdpGrowth: 0.1,
        cpi_yoy: 2.7,
        cpi_mom: 0.2,
        cpi_3m: 2.4,
        coreInflation: 2.2,
        participationRate: 61.8
      },

      realYields: {
        rea_10y: 1.55,
        nom_10y: 3.45,
        tips_breakeven: 1.90,
        rea_2y: 1.85,
        rea_5y: 1.65,
        termPremium: 0.25,
        basisPoints_2s10s: 160
      },

      yieldCurve: {
        '2Y': 3.65,
        '5Y': 3.50,
        '10Y': 3.45,
        '30Y': 3.80,
        spread_2s10s: -20
      },

      cot: {
        commercialNet: -65000,
        largeSpecNet: 85000,
        smallSpecNet: -20000,
        totalOpenInterest: 420000,
        commercialPercent: -15,
        largeSpecPercent: 20
      },

      creditSpreads: {
        ig_oas: 115,
        hy_oas: 510,
        tt_oas: 210
      },

      capitalFlows: {
        fdi_3m: 22000,
        portfolio_inflow_week: -3000,
        equityFlow: -2000,
        bondFlow: -1000,
        netFlow: -3000
      },

      monetaryConditions: {
        index: 72,
        rating: 'Tight',
        rateGap: 0.75,
        creditGrowth: 1.9,
        m2_growth: 1.8
      },

      riskSentiment: {
        equity_implied_vol: 21.5,
        riskReversal_1m: -1.8,
        put_call_ratio: 1.28,
        safehaven_demand: 'Moderate',
        riskSentiment: 'Neutral'
      },

      surprises: {
        cisiEconomicSurpriseIndex: -8,
        nfpSurprise: -15000,
        cpiSurprise: -0.05,
        pmiSurprise: -2.0,
        surveyBeatPercent: 45
      },

      leadingIndicators: {
        ppi: { value: 2.4, change: 0.0, direction: 'stable' },
        economicSentiment: { value: 82.1, change: 0.8, direction: 'up' },
        retailSales: { value: -1.2, change: -0.3, direction: 'down' },
        labourMarketIndex: { value: 59.5, change: -1.8, direction: 'down' }
      },

      themes: [
        { name: 'INFLATION', value: 2.7, sentiment: 'falling' },
        { name: 'GROWTH', value: 0.1, sentiment: 'falling' },
        { name: 'LABOUR', value: 6.0, sentiment: 'falling' },
        { name: 'POLICY', value: 'Cut - Hard', sentiment: 'cutting' }
      ],

      recentReleases: [
        { event: 'Unemployment Rate', value: '6.0%', prev: '5.9%', impact: 'MISS', time: '3h ago', surprise: 10 },
        { event: 'Employment Change', value: '-40K', prev: '+85K', impact: 'MISS', time: '3h ago', surprise: -125000 },
        { event: 'Retail Sales', value: '-1.2%', prev: '-0.8%', impact: 'MISS', time: '1d ago', surprise: -40 }
      ]
    },

    AUD: {
      name: 'Australia',
      flag: '🇦🇺',
      rate: 3.60,
      inflation: 3.5,
      rateExpectation: { prev: 3.60, next6m: 3.60, next12m: 3.35, nextMeeting: '2026-08-04' },
      
      macroData: {
        unemployment: 3.8,
        wageGrowth: 4.2,
        ppi_yoy: 2.8,
        ppi_mom: 0.1,
        manufacturingPmi: 49.8,
        servicesPmi: 52.5,
        compositePmi: 51.1,
        retailSales: 0.8,
        industrialProduction: 0.3,
        gdpGrowth: 0.2,
        cpi_yoy: 3.5,
        cpi_mom: 0.1,
        cpi_3m: 3.2,
        coreInflation: 2.9,
        participationRate: 66.2
      },

      realYields: {
        rea_10y: 0.95,
        nom_10y: 3.60,
        tips_breakeven: 2.65,
        rea_2y: 1.25,
        rea_5y: 1.05,
        termPremium: 0.40,
        basisPoints_2s10s: 135
      },

      yieldCurve: {
        '2Y': 3.55,
        '5Y': 3.60,
        '10Y': 3.60,
        '30Y': 3.85,
        spread_2s10s: 5
      },

      cot: {
        commercialNet: 55000,
        largeSpecNet: -75000,
        smallSpecNet: 20000,
        totalOpenInterest: 380000,
        commercialPercent: 14,
        largeSpecPercent: -20
      },

      creditSpreads: {
        ig_oas: 100,
        hy_oas: 450,
        tt_oas: 175
      },

      capitalFlows: {
        fdi_3m: 35000,
        portfolio_inflow_week: 9000,
        equityFlow: 5500,
        bondFlow: 3500,
        netFlow: 9000
      },

      monetaryConditions: {
        index: 65,
        rating: 'Neutral',
        rateGap: 0.25,
        creditGrowth: 3.1,
        m2_growth: 3.8
      },

      riskSentiment: {
        equity_implied_vol: 19.8,
        riskReversal_1m: 1.5,
        put_call_ratio: 1.08,
        safehaven_demand: 'Low',
        riskSentiment: 'Risk-on'
      },

      surprises: {
        cisiEconomicSurpriseIndex: 28,
        nfpSurprise: 8000,
        cpiSurprise: 0.05,
        pmiSurprise: 0.8,
        surveyBeatPercent: 56
      },

      leadingIndicators: {
        ppi: { value: 2.8, change: 0.1, direction: 'up' },
        economicSentiment: { value: 84.2, change: 1.5, direction: 'up' },
        retailSales: { value: 0.8, change: 0.2, direction: 'up' },
        labourMarketIndex: { value: 66.3, change: 0.3, direction: 'up' }
      },

      themes: [
        { name: 'INFLATION', value: 3.5, sentiment: 'falling' },
        { name: 'GROWTH', value: 0.2, sentiment: 'rising' },
        { name: 'LABOUR', value: 4.2, sentiment: 'rising' },
        { name: 'POLICY', value: 'Hold', sentiment: 'unknown' }
      ],

      recentReleases: [
        { event: 'Unemployment Rate', value: '3.8%', prev: '3.9%', impact: 'BEAT', time: '6h ago', surprise: 10 },
        { event: 'Wage Growth', value: '4.2%', prev: '4.0%', impact: 'BEAT', time: '1d ago', surprise: 200 },
        { event: 'Retail Sales', value: '0.8%', prev: '0.5%', impact: 'BEAT', time: '2d ago', surprise: 30 }
      ]
    },

    NZD: {
      name: 'New Zealand',
      flag: '🇳🇿',
      rate: 4.25,
      inflation: 3.1,
      rateExpectation: { prev: 4.25, next6m: 3.75, next12m: 3.25, nextMeeting: '2026-08-12' },
      
      macroData: {
        unemployment: 3.6,
        wageGrowth: 3.5,
        ppi_yoy: 2.3,
        ppi_mom: -0.1,
        manufacturingPmi: 50.5,
        servicesPmi: 51.8,
        compositePmi: 51.1,
        retailSales: -0.3,
        industrialProduction: -0.2,
        gdpGrowth: 0.1,
        cpi_yoy: 3.1,
        cpi_mom: 0.0,
        cpi_3m: 2.8,
        coreInflation: 2.6,
        participationRate: 63.5
      },

      realYields: {
        rea_10y: 1.25,
        nom_10y: 3.75,
        tips_breakeven: 2.50,
        rea_2y: 1.55,
        rea_5y: 1.35,
        termPremium: 0.35,
        basisPoints_2s10s: 120
      },

      yieldCurve: {
        '2Y': 3.85,
        '5Y': 3.80,
        '10Y': 3.75,
        '30Y': 4.05,
        spread_2s10s: -10
      },

      cot: {
        commercialNet: 35000,
        largeSpecNet: -55000,
        smallSpecNet: 20000,
        totalOpenInterest: 340000,
        commercialPercent: 10,
        largeSpecPercent: -16
      },

      creditSpreads: {
        ig_oas: 120,
        hy_oas: 525,
        tt_oas: 215
      },

      capitalFlows: {
        fdi_3m: 8000,
        portfolio_inflow_week: 2000,
        equityFlow: 1000,
        bondFlow: 1000,
        netFlow: 2000
      },

      monetaryConditions: {
        index: 68,
        rating: 'Tight',
        rateGap: 0.50,
        creditGrowth: 2.0,
        m2_growth: 2.3
      },

      riskSentiment: {
        equity_implied_vol: 20.5,
        riskReversal_1m: 0.5,
        put_call_ratio: 1.18,
        safehaven_demand: 'Low',
        riskSentiment: 'Neutral'
      },

      surprises: {
        cisiEconomicSurpriseIndex: 18,
        nfpSurprise: 4000,
        cpiSurprise: 0.0,
        pmiSurprise: 0.3,
        surveyBeatPercent: 52
      },

      leadingIndicators: {
        ppi: { value: 2.3, change: -0.1, direction: 'down' },
        economicSentiment: { value: 80.5, change: 0.9, direction: 'up' },
        retailSales: { value: -0.3, change: 0.1, direction: 'down' },
        labourMarketIndex: { value: 61.8, change: -0.6, direction: 'down' }
      },

      themes: [
        { name: 'INFLATION', value: 3.1, sentiment: 'falling' },
        { name: 'GROWTH', value: 0.1, sentiment: 'falling' },
        { name: 'LABOUR', value: 3.5, sentiment: 'stable' },
        { name: 'POLICY', value: 'Cut', sentiment: 'cutting' }
      ],

      recentReleases: [
        { event: 'Unemployment Rate', value: '3.6%', prev: '3.7%', impact: 'BEAT', time: '1d ago', surprise: 10 },
        { event: 'Wage Growth', value: '3.5%', prev: '3.4%', impact: 'BEAT', time: '1d ago', surprise: 100 },
        { event: 'CPI Release', value: '3.1%', prev: '3.3%', impact: 'BEAT', time: '2d ago', surprise: -20 }
      ]
    },

    CHF: {
      name: 'Switzerland',
      flag: '🇨🇭',
      rate: 1.50,
      inflation: 1.4,
      rateExpectation: { prev: 1.50, next6m: 1.25, next12m: 1.00, nextMeeting: '2026-09-17' },
      
      macroData: {
        unemployment: 2.1,
        wageGrowth: 2.8,
        ppi_yoy: 0.8,
        ppi_mom: 0.0,
        manufacturingPmi: 48.9,
        servicesPmi: 50.2,
        compositePmi: 49.5,
        retailSales: 0.1,
        industrialProduction: -0.3,
        gdpGrowth: 0.0,
        cpi_yoy: 1.4,
        cpi_mom: 0.0,
        cpi_3m: 1.2,
        coreInflation: 1.1,
        participationRate: 68.1
      },

      realYields: {
        rea_10y: 0.45,
        nom_10y: 1.50,
        tips_breakeven: 1.05,
        rea_2y: 0.75,
        rea_5y: 0.55,
        termPremium: 0.20,
        basisPoints_2s10s: 75
      },

      yieldCurve: {
        '2Y': 1.35,
        '5Y': 1.45,
        '10Y': 1.50,
        '30Y': 1.80,
        spread_2s10s: 15
      },

      cot: {
        commercialNet: -35000,
        largeSpecNet: 45000,
        smallSpecNet: -10000,
        totalOpenInterest: 300000,
        commercialPercent: -12,
        largeSpecPercent: 15
      },

      creditSpreads: {
        ig_oas: 75,
        hy_oas: 350,
        tt_oas: 130
      },

      capitalFlows: {
        fdi_3m: 15000,
        portfolio_inflow_week: 8000,
        equityFlow: 4500,
        bondFlow: 3500,
        netFlow: 8000
      },

      monetaryConditions: {
        index: 45,
        rating: 'Loose',
        rateGap: -1.25,
        creditGrowth: 1.2,
        m2_growth: 1.5
      },

      riskSentiment: {
        equity_implied_vol: 17.2,
        riskReversal_1m: -2.8,
        put_call_ratio: 1.42,
        safehaven_demand: 'High',
        riskSentiment: 'Risk-off'
      },

      surprises: {
        cisiEconomicSurpriseIndex: -18,
        nfpSurprise: -6000,
        cpiSurprise: -0.15,
        pmiSurprise: -1.2,
        surveyBeatPercent: 44
      },

      leadingIndicators: {
        ppi: { value: 0.8, change: 0.0, direction: 'stable' },
        economicSentiment: { value: 76.3, change: -0.5, direction: 'down' },
        retailSales: { value: 0.1, change: 0.0, direction: 'stable' },
        labourMarketIndex: { value: 58.2, change: -0.3, direction: 'down' }
      },

      themes: [
        { name: 'INFLATION', value: 1.4, sentiment: 'falling' },
        { name: 'GROWTH', value: 0.0, sentiment: 'stable' },
        { name: 'LABOUR', value: 2.1, sentiment: 'stable' },
        { name: 'POLICY', value: 'Cut', sentiment: 'cutting' }
      ],

      recentReleases: [
        { event: 'CPI Release', value: '1.4%', prev: '1.6%', impact: 'MISS', time: '3d ago', surprise: -20 },
        { event: 'Unemployment Rate', value: '2.1%', prev: '2.2%', impact: 'BEAT', time: '4d ago', surprise: 10 },
        { event: 'Manufacturing PMI', value: '48.9', prev: '49.5', impact: 'MISS', time: '5d ago', surprise: -60 }
      ]
    }
  },

  // CENTRAL BANK TRACKER
  centralBanks: [
    { country: 'US', bank: 'Federal Reserve', rate: 3.75, nextMeeting: '2026-09-16', decision: 'Hold', chair: 'Kevin Warsh' },
    { country: 'EUR', bank: 'ECB', rate: 2.25, nextMeeting: '2026-10-06', decision: 'Hold', chair: 'Christine Lagarde' },
    { country: 'GBP', bank: 'BoE', rate: 3.75, nextMeeting: '2026-08-20', decision: 'Hold', chair: 'Andrew Bailey' },
    { country: 'JPY', bank: 'BoJ', rate: 1.00, nextMeeting: '2026-07-27', decision: 'Hike', chair: 'Kazuo Ueda' },
    { country: 'CAD', bank: 'BoC', rate: 4.50, nextMeeting: '2026-09-16', decision: 'Cut', chair: 'Tiff Macklem' },
    { country: 'AUD', bank: 'RBA', rate: 3.60, nextMeeting: '2026-08-04', decision: 'Hold', chair: 'Michele Bullock' },
    { country: 'NZD', bank: 'RBNZ', rate: 4.25, nextMeeting: '2026-08-12', decision: 'Cut', chair: 'Adrian Orr' },
    { country: 'CHF', bank: 'SNB', rate: 1.50, nextMeeting: '2026-09-17', decision: 'Cut', chair: 'Karin Kimberly' }
  ],

  // TRADING SETUPS
  tradingSetups: [
    {
      name: 'USD/JPY Divergence',
      rationale: 'US holding 3.75%, Japan hiking to 1%. Rate diff widening.',
      entry: 160.50,
      target: 165.00,
      stop: 158.50,
      riskReward: '1:3.5',
      confidence: 'High',
      timeframe: '3-6 months',
      catalyst: 'BoJ June decision, Fed hold expected'
    },
    {
      name: 'AUD/USD Strength',
      rationale: 'Commodity super-cycle, rate advantage 3.60% vs 3.75%, China stimulus',
      entry: 0.6850,
      target: 0.7150,
      stop: 0.6700,
      riskReward: '1:2.8',
      confidence: 'Medium',
      timeframe: '2-4 months',
      catalyst: 'China data, commodity prices, RBA hold'
    },
    {
      name: 'EUR/USD Short',
      rationale: 'Growth divergence (0.1% vs 0.8%), ECB cuts vs Fed hold',
      entry: 1.0900,
      target: 1.0600,
      stop: 1.1050,
      riskReward: '1:2.2',
      confidence: 'Medium',
      timeframe: '2-3 months',
      catalyst: 'ECB cut signals, eurozone weakness'
    }
  ],

  // ECONOMIC CALENDAR
  calendar: [
    { date: '2026-07-20', country: 'US', event: 'CPI Release', previous: 4.3, forecast: 4.2, actual: null, importance: 'High' },
    { date: '2026-07-22', country: 'US', event: 'NFP', previous: 195000, forecast: 185000, actual: null, importance: 'High' },
    { date: '2026-07-27', country: 'JPY', event: 'BoJ Decision', previous: 0.50, forecast: 1.00, actual: null, importance: 'High' },
    { date: '2026-07-30', country: 'US', event: 'FOMC', previous: 3.50, forecast: 3.75, actual: 3.75, importance: 'High' },
    { date: '2026-08-01', country: 'EUR', event: 'ECB', previous: 2.00, forecast: 2.25, actual: null, importance: 'High' }
  ],

  // NEWS FEEDS
  news: [
    { title: 'Fed Chair Signals Pause in Rate Hikes', source: 'Reuters', category: 'Fed', impact: 'High', published: new Date().toISOString(), summary: 'Kevin Warsh hints at end of tightening cycle' },
    { title: 'ECB Hikes 25bps; More to Come', source: 'Bloomberg', category: 'ECB', impact: 'High', published: new Date().toISOString(), summary: 'ECB raises to 2.25%, expects additional hikes' },
    { title: 'USD/JPY Near 160 Intervention Level', source: 'FT', category: 'FX', impact: 'High', published: new Date().toISOString(), summary: 'Yen weakness escalates; MoF intervention risk rises' },
    { title: 'Commodity Supercycle Accelerates', source: 'WSJ', category: 'Macro', impact: 'Medium', published: new Date().toISOString(), summary: 'Oil and gold surge on geopolitical tensions' }
  ]
};

const { startLiveDataRefresh } = require('./dataFetcher');
const { startCentralBankAnalysis } = require('./centralBankAnalysis');
const indicatorExplainers = require('./indicatorExplainers');

startLiveDataRefresh(data, 30); // live macro/FX/commodities, every 30 min
startCentralBankAnalysis(data, 24); // central bank statement analysis, once/day

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/api/dashboard') {
    res.writeHead(200);
    res.end(JSON.stringify(data));
  } else if (req.url.startsWith('/api/currency/')) {
    const currency = req.url.split('/')[3].toUpperCase();
    res.writeHead(200);
    res.end(JSON.stringify(data.g10Data[currency] || { error: 'Not found' }));
  } else if (req.url === '/api/compare') {
    const params = new URL(req.url, 'http://localhost').searchParams;
    const c1 = params.get('c1');
    const c2 = params.get('c2');
    res.writeHead(200);
    res.end(JSON.stringify({
      c1: data.g10Data[c1],
      c2: data.g10Data[c2]
    }));
  } else if (req.url === '/api/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'ok',
      lastLiveUpdate: data.lastLiveUpdate || null,
      liveDataHealth: data.liveDataHealth || null,
      centralBankAnalysisHealth: data.centralBankAnalysisHealth || null
    }));
  } else if (req.url.startsWith('/api/indicator')) {
    // /api/indicator?type=cpi_yoy&currency=USD
    const parsed = new URL(req.url, `http://${req.headers.host}`);
    const type = parsed.searchParams.get('type');
    const currency = parsed.searchParams.get('currency');
    const explainer = indicatorExplainers[type];
    const ccyData = data.g10Data[currency];

    if (!explainer || !ccyData) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Unknown indicator type or currency', validTypes: Object.keys(indicatorExplainers) }));
      return;
    }

    let actual = null;
    if (type === 'policy_rate') actual = ccyData.rate;
    else if (type === 'cpi_yoy') actual = ccyData.macroData ? ccyData.macroData.cpi_yoy : null;
    else if (type === 'gdp_growth') actual = ccyData.macroData ? ccyData.macroData.gdpGrowth : null;
    else if (type === 'unemployment') actual = ccyData.macroData ? ccyData.macroData.unemployment : null;

    res.writeHead(200);
    res.end(JSON.stringify({
      currency,
      type,
      label: explainer.label,
      what_is_this: explainer.what_is_this,
      typical_impact: explainer.typical_impact,
      actual,
      lastLiveUpdate: data.lastLiveUpdate || null
    }));
  } else if (req.url.startsWith('/api/central-bank')) {
    // /api/central-bank?currency=USD
    const parsed = new URL(req.url, `http://${req.headers.host}`);
    const currency = parsed.searchParams.get('currency');
    const analysis = data.centralBankAnalysis ? data.centralBankAnalysis[currency] : null;

    if (!analysis) {
      res.writeHead(404);
      res.end(JSON.stringify({
        error: 'No analysis available yet for this currency',
        note: 'Either the daily refresh hasn\'t run yet, or this bank has no confirmed statement feed configured — check /api/health'
      }));
      return;
    }

    res.writeHead(200);
    res.end(JSON.stringify({ currency, ...analysis }));
  } else {
    res.writeHead(200);
    res.end(JSON.stringify({ message: 'Ultimate G10 Macro Dashboard API' }));
  }
});

server.listen(PORT, () => {
  console.log('Ultimate G10 Macro Dashboard API running on port ' + PORT);
});
