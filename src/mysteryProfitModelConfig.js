export const MYSTERY_PROFIT_DEFAULTS = {
  stripeFeePct: 2.9,
  stripeFixedFee: 0.3,
  payoutFeePct: 1,
  merchantRevsharePct: 6,
  fraudReservePct: 1,
  fullRefundProbPct: 0.2,
  tier1ProbPct: 6,
  tier2ProbPct: 12,
  tier1Multiplier: 3.2,
  tier2Multiplier: 1.1,
  tiers: [
    { id: 't1', label: '$20-$50', avgOrderValue: 35, monthlyOrders: 100000, attachRatePct: 12, boxFee: 2 },
    { id: 't2', label: '$50-$100', avgOrderValue: 75, monthlyOrders: 70000, attachRatePct: 11, boxFee: 3 },
    { id: 't3', label: '$100-$200', avgOrderValue: 150, monthlyOrders: 45000, attachRatePct: 10, boxFee: 5 },
    { id: 't4', label: '$200-$350', avgOrderValue: 275, monthlyOrders: 25000, attachRatePct: 9, boxFee: 6 },
    { id: 't5', label: '$350-$500', avgOrderValue: 425, monthlyOrders: 12000, attachRatePct: 8, boxFee: 8 },
    { id: 't6', label: '$500+', avgOrderValue: 700, monthlyOrders: 8000, attachRatePct: 7, boxFee: 10 },
  ],
}

export const MYSTERY_PROFIT_PRESETS = {
  lowMargin: {
    label: 'LOW MARGIN',
    subtitle: 'engagement heavy',
    values: {
      fullRefundProbPct: 0.35,
      tier1ProbPct: 8,
      tier2ProbPct: 15,
      tier1Multiplier: 3.8,
      tier2Multiplier: 1.35,
    },
  },
  base: {
    label: 'BASE',
    subtitle: 'optimal',
    values: {
      fullRefundProbPct: 0.2,
      tier1ProbPct: 6,
      tier2ProbPct: 12,
      tier1Multiplier: 3.2,
      tier2Multiplier: 1.1,
    },
  },
  highMargin: {
    label: 'HIGH MARGIN',
    subtitle: 'profit focus',
    values: {
      fullRefundProbPct: 0.1,
      tier1ProbPct: 5,
      tier2ProbPct: 10,
      tier1Multiplier: 2.7,
      tier2Multiplier: 0.9,
    },
  },
}
