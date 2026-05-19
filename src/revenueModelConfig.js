export const REVENUE_ASSUMPTIONS = {
  flow1: {
    avgOrderValue: 12,
    monthlyTransactions: 250000,
    userFeePct: 0.18,
    refundPctOnWin: 1,
    fixedCostMonthly: 40000,
    processingCostPct: 0.02,
    fraudReservePct: 0.0075,
    promoReservePct: 0.01,
    winBands: [
      { id: 'b1', label: '$0-$5', share: 0.3, winRate: 0.26 },
      { id: 'b2', label: '$5-$10', share: 0.3, winRate: 0.18 },
      { id: 'b3', label: '$10-$15', share: 0.24, winRate: 0.12 },
      { id: 'b4', label: '$15-$20', share: 0.16, winRate: 0.07 },
    ],
  },
  flow2: {
    processingCostPct: 0.02,
    merchantRevsharePct: 0.06,
    fraudReservePct: 0.01,
    payout: {
      fullRefundProb: 0.0025,
      tier1Prob: 0.065,
      tier2Prob: 0.12,
      tier1Amount: 20,
      tier2Amount: 5,
    },
    bands: [
      { id: '20-50', label: '$20-$50', avgOrderValue: 35, monthlyOrders: 100000, attachRate: 0.12, boxFee: 1 },
      { id: '50-100', label: '$50-$100', avgOrderValue: 75, monthlyOrders: 78000, attachRate: 0.11, boxFee: 2 },
      { id: '100-200', label: '$100-$200', avgOrderValue: 145, monthlyOrders: 55000, attachRate: 0.1, boxFee: 4 },
      { id: '200-350', label: '$200-$350', avgOrderValue: 260, monthlyOrders: 21000, attachRate: 0.085, boxFee: 5 },
      { id: '350-500', label: '$350-$500', avgOrderValue: 420, monthlyOrders: 8500, attachRate: 0.07, boxFee: 7 },
      { id: '500+', label: '$500+', avgOrderValue: 680, monthlyOrders: 5200, attachRate: 0.055, boxFee: 10 },
    ],
  },
}

export const SCENARIO_PRESETS = {
  low: {
    volumeMultiplier: 0.72,
    attachMultiplier: 0.86,
    flow1FeePct: 0.16,
    flow1WinRateMultiplier: 1.12,
    rtpPct: 0.56,
  },
  base: {
    volumeMultiplier: 1,
    attachMultiplier: 1,
    flow1FeePct: 0.18,
    flow1WinRateMultiplier: 1,
    rtpPct: 0.45,
  },
  high: {
    volumeMultiplier: 1.35,
    attachMultiplier: 1.2,
    flow1FeePct: 0.2,
    flow1WinRateMultiplier: 0.85,
    rtpPct: 0.37,
  },
}

export const VOLUME_SCALE_POINTS = [100000, 500000, 1000000, 5000000, 10000000]
