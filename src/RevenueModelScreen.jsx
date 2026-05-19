import React from 'react'
import { motion } from 'framer-motion'
import { MYSTERY_PROFIT_DEFAULTS, MYSTERY_PROFIT_PRESETS } from './mysteryProfitModelConfig'

const money = (value, digits = 0) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(Number.isFinite(value) ? value : 0)

const int = (value) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0)
const pct = (value) => `${(Number.isFinite(value) ? value : 0) * 100}%`
const pct1 = (value) => `${((Number.isFinite(value) ? value : 0) * 100).toFixed(1)}%`

const DAU_MILESTONES = [1000, 5000, 10000, 50000, 100000]

function nearestDau(value) {
  return DAU_MILESTONES.reduce((closest, current) =>
    Math.abs(current - value) < Math.abs(closest - value) ? current : closest
  )
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function calcFlow1(values) {
  const avgFlip = values.avgFlipAmount
  const flipsPerUser = values.flipsPerUserPerDay
  const dau = values.dailyActiveUsers
  const rtp = values.rtpPct / 100

  const winRate = rtp / 2
  const loseRate = 1 - winRate
  const houseEdge = 1 - rtp
  const grossPerFlip = houseEdge * avgFlip
  const stripeCardFeePerFlip = 0.029 * avgFlip * 0.6
  const stripeFixedFeePerFlip = 0.3 * 0.6
  const stripeInstantPayoutPerFlip = 0.01 * avgFlip * 0.4
  const processingFees = stripeCardFeePerFlip + stripeFixedFeePerFlip + stripeInstantPayoutPerFlip
  const netPerFlip = grossPerFlip - processingFees
  const dailyFlips = dau * flipsPerUser
  const dailyGrossRevenue = dailyFlips * grossPerFlip
  const dailyStripeFees = dailyFlips * processingFees
  const annualStripeFees = dailyStripeFees * 365
  const dailyNetRevenue = dailyFlips * netPerFlip
  const annualNetRevenue = dailyNetRevenue * 365
  const riskPoolRequired = dau * winRate * avgFlip * 10
  const breakEvenFlipAmount = houseEdge > 0 ? processingFees / houseEdge : Number.POSITIVE_INFINITY

  return {
    winRate,
    loseRate,
    houseEdge,
    grossPerFlip,
    stripeCardFeePerFlip,
    stripeFixedFeePerFlip,
    stripeInstantPayoutPerFlip,
    processingFees,
    netPerFlip,
    dailyFlips,
    dailyGrossRevenue,
    dailyStripeFees,
    annualStripeFees,
    dailyNetRevenue,
    annualNetRevenue,
    riskPoolRequired,
    breakEvenFlipAmount,
  }
}

function calcMysteryTiered(inputs) {
  const fullRefundProb = inputs.fullRefundProbPct / 100
  const tier1Prob = inputs.tier1ProbPct / 100
  const tier2Prob = inputs.tier2ProbPct / 100
  const noWinProb = Math.max(0, 1 - fullRefundProb - tier1Prob - tier2Prob)
  const probSum = fullRefundProb + tier1Prob + tier2Prob + noWinProb

  const tiers = inputs.tiers.map((tier) => {
    const attachRate = tier.attachRatePct / 100
    const boxesSold = tier.monthlyOrders * attachRate
    const grossRevenue = boxesSold * tier.boxFee
    const stripeFees = grossRevenue * (inputs.stripeFeePct / 100) + boxesSold * inputs.stripeFixedFee
    const netRevenue = grossRevenue - stripeFees
    const tier1Amount = tier.boxFee * inputs.tier1Multiplier
    const tier2Amount = tier.boxFee * inputs.tier2Multiplier
    const expectedPayoutPerBox = fullRefundProb * tier.avgOrderValue + tier1Prob * tier1Amount + tier2Prob * tier2Amount
    const totalPayout = boxesSold * expectedPayoutPerBox
    const payoutFees = totalPayout * (inputs.payoutFeePct / 100)
    const merchantCost = grossRevenue * (inputs.merchantRevsharePct / 100)
    const fraudCost = grossRevenue * (inputs.fraudReservePct / 100)
    const grossProfit = netRevenue - totalPayout - payoutFees - merchantCost - fraudCost
    const grossMargin = netRevenue > 0 ? grossProfit / netRevenue : 0
    const profitPerBox = boxesSold > 0 ? grossProfit / boxesSold : 0
    const rtp = tier.boxFee > 0 ? expectedPayoutPerBox / tier.boxFee : 0
    const payoutToFeeRatio = tier.boxFee > 0 ? expectedPayoutPerBox / tier.boxFee : 0
    const stripeRevenueRatio = grossRevenue > 0 ? stripeFees / grossRevenue : 0

    return {
      ...tier,
      attachRate,
      boxesSold,
      grossRevenue,
      stripeFees,
      netRevenue,
      tier1Amount,
      tier2Amount,
      expectedPayoutPerBox,
      totalPayout,
      payoutFees,
      merchantCost,
      fraudCost,
      grossProfit,
      grossMargin,
      profitPerBox,
      rtp,
      payoutToFeeRatio,
      stripeRevenueRatio,
      warningPayout50: payoutToFeeRatio > 0.5,
      warningLowFee: tier.boxFee < 2,
      warningWeakMargin: grossMargin < 0.2,
    }
  })

  const totals = tiers.reduce(
    (acc, tier) => ({
      boxesSold: acc.boxesSold + tier.boxesSold,
      grossRevenue: acc.grossRevenue + tier.grossRevenue,
      stripeFees: acc.stripeFees + tier.stripeFees,
      netRevenue: acc.netRevenue + tier.netRevenue,
      totalPayout: acc.totalPayout + tier.totalPayout,
      payoutFees: acc.payoutFees + tier.payoutFees,
      merchantCost: acc.merchantCost + tier.merchantCost,
      fraudCost: acc.fraudCost + tier.fraudCost,
      totalProfit: acc.totalProfit + tier.grossProfit,
    }),
    { boxesSold: 0, grossRevenue: 0, stripeFees: 0, netRevenue: 0, totalPayout: 0, payoutFees: 0, merchantCost: 0, fraudCost: 0, totalProfit: 0 }
  )

  const blendedMargin = totals.netRevenue > 0 ? totals.totalProfit / totals.netRevenue : 0
  const weightedAvgBoxFee = totals.boxesSold > 0 ? totals.grossRevenue / totals.boxesSold : 0
  const blendedRtp = totals.boxesSold > 0 && weightedAvgBoxFee > 0 ? totals.totalPayout / totals.boxesSold / weightedAvgBoxFee : 0
  const expectedPayoutPerBox = totals.boxesSold > 0 ? totals.totalPayout / totals.boxesSold : 0
  const stripeRevenueRatio = totals.grossRevenue > 0 ? totals.stripeFees / totals.grossRevenue : 0

  return {
    fullRefundProb,
    tier1Prob,
    tier2Prob,
    noWinProb,
    probabilitySum: probSum,
    tiers,
    totals: {
      ...totals,
      blendedMargin,
      blendedRtp,
      weightedAvgBoxFee,
      expectedPayoutPerBox,
      profitPerBox: totals.boxesSold > 0 ? totals.totalProfit / totals.boxesSold : 0,
      stripeRevenueRatio,
    },
  }
}

function Control({ label, value, min, max, step, onChange, prefix = '', suffix = '' }) {
  return (
    <div className="rev-control">
      <div className="rev-control-head">
        <span className="rev-control-label">{label}</span>
        <span className="rev-control-value">
          {prefix}
          {typeof value === 'number' && Number.isInteger(value) ? int(value) : value}
          {suffix}
        </span>
      </div>
      <input className="rev-control-range" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
      <input className="rev-control-input" type="number" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </div>
  )
}

function MetricCard({ label, value, tone = 'neutral' }) {
  return (
    <div className={`rev-metric rev-tone-${tone}`}>
      <div className="rev-metric-label">{label}</div>
      <div className="rev-metric-value">{value}</div>
    </div>
  )
}

export default function RevenueModelScreen() {
  const [activeFlowTab, setActiveFlowTab] = React.useState('flow1')
  const [flow1Inputs, setFlow1Inputs] = React.useState({
    avgFlipAmount: 6,
    flipsPerUserPerDay: 2,
    dailyActiveUsers: 10000,
    rtpPct: 80,
  })
  const [flow2Inputs, setFlow2Inputs] = React.useState(MYSTERY_PROFIT_DEFAULTS)
  const [flow2Preset, setFlow2Preset] = React.useState('base')

  const flow1 = React.useMemo(() => calcFlow1(flow1Inputs), [flow1Inputs])
  const highlightedDau = nearestDau(flow1Inputs.dailyActiveUsers)
  const flow2 = React.useMemo(() => calcMysteryTiered(flow2Inputs), [flow2Inputs])

  const setFlow2Tier = React.useCallback((tierId, field, value, min, max) => {
    setFlow2Inputs((prev) => ({
      ...prev,
      tiers: prev.tiers.map((tier) => (tier.id === tierId ? { ...tier, [field]: clamp(value || min, min, max) } : tier)),
    }))
  }, [])

  const setFlow2Probability = React.useCallback((field, value, min, max) => {
    setFlow2Inputs((prev) => {
      const clamped = clamp(value || min, min, max)
      const next = { ...prev, [field]: clamped }
      const sum = next.fullRefundProbPct + next.tier1ProbPct + next.tier2ProbPct
      if (sum > 99.9) {
        const overflow = sum - 99.9
        next[field] = Math.max(min, next[field] - overflow)
      }
      return next
    })
  }, [])

  const applyFlow2Preset = React.useCallback((presetKey) => {
    const preset = MYSTERY_PROFIT_PRESETS[presetKey]
    if (!preset) return
    setFlow2Preset(presetKey)
    setFlow2Inputs((prev) => ({ ...prev, ...preset.values }))
  }, [])

  const sensitivity = React.useMemo(() => {
    const plusAttach = calcMysteryTiered({
      ...flow2Inputs,
      tiers: flow2Inputs.tiers.map((tier) => ({ ...tier, attachRatePct: Math.min(100, tier.attachRatePct + 5) })),
    })
    const plusStripe = calcMysteryTiered({ ...flow2Inputs, stripeFeePct: flow2Inputs.stripeFeePct + 0.5 })
    const plusRtp = calcMysteryTiered({
      ...flow2Inputs,
      fullRefundProbPct: Math.min(2, flow2Inputs.fullRefundProbPct * 1.2),
      tier1ProbPct: Math.min(20, flow2Inputs.tier1ProbPct * 1.05),
      tier2ProbPct: Math.min(30, flow2Inputs.tier2ProbPct * 1.05),
    })

    return {
      attachDelta: plusAttach.totals.totalProfit - flow2.totals.totalProfit,
      stripeDelta: plusStripe.totals.totalProfit - flow2.totals.totalProfit,
      rtpDelta: plusRtp.totals.totalProfit - flow2.totals.totalProfit,
    }
  }, [flow2, flow2Inputs])

  return (
    <motion.section
      className="revenue-screen"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="revenue-inner">
        <section className="rev-section rev-hero">
          <h1 className="rev-title">Revenue Model</h1>
          <div className="rev-flow-tabs">
            <button type="button" className={`rev-flow-tab ${activeFlowTab === 'flow1' ? 'is-active' : ''}`} onClick={() => setActiveFlowTab('flow1')}>
              Flow 1 — Flip
            </button>
            <button type="button" className={`rev-flow-tab ${activeFlowTab === 'flow2' ? 'is-active' : ''}`} onClick={() => setActiveFlowTab('flow2')}>
              Flow 2 — Mystery Box
            </button>
          </div>
          <p className="rev-subtitle">
            {activeFlowTab === 'flow1'
              ? 'Coin-flip payment model: winners pay $0, losers pay double. Net spread drives revenue.'
              : 'Tiered pricing Mystery Box model engineered for margin safety and controlled payout economics.'}
          </p>
        </section>

        {activeFlowTab === 'flow1' && (
          <>
            <section className="rev-section">
              <h2 className="rev-h2">Section 1: The Mechanic</h2>
              <div className="rev-mechanic-grid">
                <div className="rev-mechanic-card">
                  <div className="rev-mechanic-title">The Flip</div>
                  <p className="rev-body">User flips on any purchase. Example purchase: $6 coffee.</p>
                </div>
                <div className="rev-mechanic-card rev-win-card">
                  <div className="rev-mechanic-title">WIN ({pct1(flow1.winRate)})</div>
                  <p className="rev-body">User pays $0. wildcard covers the $6 coffee.</p>
                </div>
                <div className="rev-mechanic-card rev-lose-card">
                  <div className="rev-mechanic-title">LOSE ({pct1(flow1.loseRate)})</div>
                  <p className="rev-body">User pays double. wildcard collects $12, pays merchant $6, keeps $6 spread.</p>
                </div>
              </div>
              <div className="rev-equation">
                <div>wildcard Revenue = (Losers × Amount) - (Winners × Amount)</div>
                <div>= (60% × $6) - (40% × $6) per flip</div>
                <div>= $3.60 - $2.40</div>
                <div>= $1.20 gross per flip</div>
                <div>= $0.84 net after fees</div>
              </div>
            </section>

            <section className="rev-section">
              <h2 className="rev-h2">Section 2: The Interactive Calculator</h2>
              <div className="rev-controls-grid">
                <Control label="Average flip amount" value={flow1Inputs.avgFlipAmount} min={2} max={50} step={0.5} prefix="$" onChange={(v) => setFlow1Inputs((p) => ({ ...p, avgFlipAmount: clamp(v || 2, 2, 50) }))} />
                <Control label="Flips per user per day" value={flow1Inputs.flipsPerUserPerDay} min={1} max={5} step={1} onChange={(v) => setFlow1Inputs((p) => ({ ...p, flipsPerUserPerDay: Math.round(clamp(v || 1, 1, 5)) }))} />
                <Control label="Daily active users" value={flow1Inputs.dailyActiveUsers} min={1000} max={500000} step={1000} onChange={(v) => setFlow1Inputs((p) => ({ ...p, dailyActiveUsers: Math.round(clamp(v || 1000, 1000, 500000)) }))} />
                <Control label="RTP %" value={flow1Inputs.rtpPct} min={70} max={95} step={0.5} suffix="%" onChange={(v) => setFlow1Inputs((p) => ({ ...p, rtpPct: clamp(v || 70, 70, 95) }))} />
              </div>

              <div className="rev-metric-grid">
                <MetricCard label="Net per flip" value={money(flow1.netPerFlip, 2)} tone={flow1.netPerFlip >= 0 ? 'good' : 'bad'} />
                <MetricCard label="Daily net revenue" value={money(flow1.dailyNetRevenue)} tone={flow1.dailyNetRevenue >= 0 ? 'good' : 'bad'} />
                <MetricCard label="Annual net revenue" value={money(flow1.annualNetRevenue)} tone={flow1.annualNetRevenue >= 0 ? 'good' : 'bad'} />
                <MetricCard label="Risk pool needed" value={money(flow1.riskPoolRequired)} />
                <MetricCard label="Stripe fees per flip" value={money(flow1.processingFees, 2)} tone="warn" />
                <MetricCard label="Daily Stripe fees" value={money(flow1.dailyStripeFees)} tone="warn" />
                <MetricCard label="Annual Stripe fees" value={money(flow1.annualStripeFees)} tone="warn" />
              </div>

              <div className="rev-derived-grid">
                <div className="rev-derived-item">Win rate: {pct1(flow1.winRate)}</div>
                <div className="rev-derived-item">House edge: {pct1(flow1.houseEdge)}</div>
                <div className="rev-derived-item">Gross per flip: {money(flow1.grossPerFlip, 2)}</div>
                <div className="rev-derived-item">Processing fees: {money(flow1.processingFees, 2)}</div>
                <div className="rev-derived-item">Stripe fee breakdown: {money(flow1.stripeCardFeePerFlip, 2)} card + {money(flow1.stripeFixedFeePerFlip, 2)} fixed + {money(flow1.stripeInstantPayoutPerFlip, 2)} payout</div>
                <div className="rev-derived-item">Daily flips: {int(flow1.dailyFlips)}</div>
                <div className="rev-derived-item">Daily gross revenue: {money(flow1.dailyGrossRevenue)}</div>
              </div>
            </section>

            <section className="rev-section">
              <h2 className="rev-h2">Section 3: Annual Forecast Table</h2>
              <div className="rev-table-wrap">
                <table className="rev-table">
                  <thead>
                    <tr>
                      <th>DAU</th>
                      <th>Daily Flips</th>
                      <th>Daily Net</th>
                      <th>Annual Net</th>
                      <th>Risk Pool</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DAU_MILESTONES.map((dau) => {
                      const row = calcFlow1({ ...flow1Inputs, dailyActiveUsers: dau })
                      return (
                        <tr key={dau} className={dau === highlightedDau ? 'rev-row-highlight' : ''}>
                          <td>{int(dau)}</td>
                          <td>{int(row.dailyFlips)}</td>
                          <td>{money(row.dailyNetRevenue)}</td>
                          <td>{money(row.annualNetRevenue)}</td>
                          <td>{money(row.riskPoolRequired)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rev-section">
              <h2 className="rev-h2">Section 4: Break-Even Line</h2>
              <div className="rev-breakeven-box">
                <div className="rev-breakeven-title">Minimum profitable flip amount</div>
                <div className="rev-breakeven-formula">breakeven = fees / house edge</div>
                <div className="rev-breakeven-value">
                  {Number.isFinite(flow1.breakEvenFlipAmount)
                    ? `wildcard is profitable on any flip above ${money(flow1.breakEvenFlipAmount, 2)}`
                    : 'House edge is 0% at this RTP, so break-even is undefined'}
                </div>
              </div>
            </section>

            <section className="rev-section rev-assumptions-footer">
              <h2 className="rev-h2">Section 5: Key Assumptions Footer</h2>
              <ul className="rev-list">
                <li>80% RTP default (adjustable above)</li>
                <li>Stripe fees: 2.9% + $0.30 per charge, 1% instant payout</li>
                <li>Win rate = RTP ÷ 2</li>
                <li>Risk pool = 10× daily win exposure</li>
                <li>Figures are pre-tax, pre-overhead estimates</li>
              </ul>
            </section>
          </>
        )}

        {activeFlowTab === 'flow2' && (
          <>
            <section className={`rev-section ${flow2.totals.expectedPayoutPerBox > flow2.totals.weightedAvgBoxFee * 0.6 ? 'rev-unprofitable-shell' : ''}`}>
              <h2 className="rev-h2">MYSTERY BOX — PROFIT MODEL</h2>
              <p className="rev-note">High-margin, opt-in post-purchase product with controlled payout mechanics.</p>
              <div className="rev-metric-grid">
                <MetricCard label="Boxes Sold (Monthly)" value={int(flow2.totals.boxesSold)} />
                <MetricCard label="Net Revenue" value={money(flow2.totals.netRevenue)} />
                <MetricCard label="Gross Profit" value={money(flow2.totals.totalProfit)} tone={flow2.totals.totalProfit >= 0 ? 'good' : 'bad'} />
                <MetricCard label="Gross Margin %" value={pct1(flow2.totals.blendedMargin)} tone={flow2.totals.blendedMargin >= 0.2 ? 'good' : 'bad'} />
              </div>
            </section>

            <section className="rev-section">
              <h2 className="rev-h2">Tiered Pricing & Volume</h2>
              <div className="rev-table-wrap">
                <table className="rev-table">
                  <thead>
                    <tr>
                      <th>Tier</th>
                      <th>Avg Order Value</th>
                      <th>Monthly Orders</th>
                      <th>Attach Rate %</th>
                      <th>Box Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flow2Inputs.tiers.map((tier) => (
                      <tr key={tier.id}>
                        <td>{tier.label}</td>
                        <td>
                          <input className="rev-cell-input" type="number" value={tier.avgOrderValue} step={1} onChange={(e) => setFlow2Tier(tier.id, 'avgOrderValue', Number(e.target.value), 20, 5000)} />
                        </td>
                        <td>
                          <input className="rev-cell-input" type="number" value={tier.monthlyOrders} step={100} onChange={(e) => setFlow2Tier(tier.id, 'monthlyOrders', Number(e.target.value), 100, 10000000)} />
                        </td>
                        <td>
                          <input className="rev-cell-input" type="number" value={tier.attachRatePct} step={0.1} onChange={(e) => setFlow2Tier(tier.id, 'attachRatePct', Number(e.target.value), 0.1, 100)} />
                        </td>
                        <td>
                          <input className="rev-cell-input" type="number" value={tier.boxFee} step={0.1} onChange={(e) => setFlow2Tier(tier.id, 'boxFee', Number(e.target.value), 0.5, 100)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rev-section">
              <h2 className="rev-h2">Global Cost + Payout Controls</h2>
              <div className="rev-controls-grid">
                <Control label="Stripe fee %" value={flow2Inputs.stripeFeePct} min={0} max={8} step={0.1} suffix="%" onChange={(v) => setFlow2Inputs((p) => ({ ...p, stripeFeePct: clamp(v || 0, 0, 8) }))} />
                <Control label="Stripe fixed fee" value={flow2Inputs.stripeFixedFee} min={0} max={2} step={0.01} prefix="$" onChange={(v) => setFlow2Inputs((p) => ({ ...p, stripeFixedFee: clamp(v || 0, 0, 2) }))} />
                <Control label="Payout fee %" value={flow2Inputs.payoutFeePct} min={0} max={5} step={0.1} suffix="%" onChange={(v) => setFlow2Inputs((p) => ({ ...p, payoutFeePct: clamp(v || 0, 0, 5) }))} />
                <Control label="Merchant revshare %" value={flow2Inputs.merchantRevsharePct} min={0} max={20} step={0.1} suffix="%" onChange={(v) => setFlow2Inputs((p) => ({ ...p, merchantRevsharePct: clamp(v || 0, 0, 20) }))} />
                <Control label="Fraud reserve %" value={flow2Inputs.fraudReservePct} min={0} max={8} step={0.1} suffix="%" onChange={(v) => setFlow2Inputs((p) => ({ ...p, fraudReservePct: clamp(v || 0, 0, 8) }))} />
                <Control label="Full refund probability" value={flow2Inputs.fullRefundProbPct} min={0} max={5} step={0.01} suffix="%" onChange={(v) => setFlow2Probability('fullRefundProbPct', v, 0, 5)} />
                <Control label="Tier1 probability" value={flow2Inputs.tier1ProbPct} min={0} max={30} step={0.1} suffix="%" onChange={(v) => setFlow2Probability('tier1ProbPct', v, 0, 30)} />
                <Control label="Tier2 probability" value={flow2Inputs.tier2ProbPct} min={0} max={40} step={0.1} suffix="%" onChange={(v) => setFlow2Probability('tier2ProbPct', v, 0, 40)} />
                <Control label="Tier1 multiplier (2.5x-4x)" value={flow2Inputs.tier1Multiplier} min={2.5} max={4} step={0.05} suffix="x" onChange={(v) => setFlow2Inputs((p) => ({ ...p, tier1Multiplier: clamp(v || 2.5, 2.5, 4) }))} />
                <Control label="Tier2 multiplier (0.8x-1.5x)" value={flow2Inputs.tier2Multiplier} min={0.8} max={1.5} step={0.05} suffix="x" onChange={(v) => setFlow2Inputs((p) => ({ ...p, tier2Multiplier: clamp(v || 0.8, 0.8, 1.5) }))} />
              </div>
              <p className="rev-body">No win probability: <strong>{pct1(flow2.noWinProb)}</strong> · Probability total: <strong>{(flow2.probabilitySum * 100).toFixed(2)}%</strong></p>
            </section>

            <section className="rev-section">
              <h2 className="rev-h2">Aggregated Totals</h2>
              <div className="rev-metric-grid">
                <MetricCard label="Total Boxes Sold" value={int(flow2.totals.boxesSold)} />
                <MetricCard label="Total Gross Revenue" value={money(flow2.totals.grossRevenue)} />
                <MetricCard label="Total Stripe Fees" value={money(flow2.totals.stripeFees)} tone="warn" />
                <MetricCard label="Total Net Revenue" value={money(flow2.totals.netRevenue)} />
                <MetricCard label="Total Payout" value={money(flow2.totals.totalPayout)} tone="warn" />
                <MetricCard label="Total Profit" value={money(flow2.totals.totalProfit)} tone={flow2.totals.totalProfit >= 0 ? 'good' : 'bad'} />
                <MetricCard label="Blended Margin" value={pct1(flow2.totals.blendedMargin)} tone={flow2.totals.blendedMargin >= 0.2 ? 'good' : 'bad'} />
                <MetricCard label="Blended RTP" value={pct1(flow2.totals.blendedRtp)} tone={flow2.totals.blendedRtp <= 0.45 ? 'good' : 'warn'} />
              </div>
            </section>

            <section className="rev-section">
              <h2 className="rev-h2">Profit Guardrails (Per Tier)</h2>
              <div className="rev-guardrails">
                {flow2.tiers.some((tier) => tier.warningPayout50) ? <p className="rev-warning is-bad">One or more tiers: expected payout &gt; 50% of box fee</p> : null}
                {flow2.tiers.some((tier) => tier.warningLowFee) ? <p className="rev-warning is-bad">Low price tier heavily penalized by fixed fees</p> : null}
                {flow2.tiers.some((tier) => tier.warningWeakMargin) ? <p className="rev-warning is-warn">One or more tiers has gross margin below 20%</p> : null}
                {flow2.totals.stripeRevenueRatio > 0.25 ? <p className="rev-warning is-warn">Payment costs dominating economics</p> : null}
              </div>
            </section>

            <section className="rev-section">
              <h2 className="rev-h2">Per-Tier Profitability Chart</h2>
              <div className="rev-tier-chart">
                {flow2.tiers.map((tier) => {
                  const maxProfit = Math.max(...flow2.tiers.map((t) => Math.abs(t.grossProfit)), 1)
                  const height = `${Math.max(10, (Math.abs(tier.grossProfit) / maxProfit) * 100)}%`
                  return (
                    <div key={tier.id} className="rev-tier-col">
                      <div className={`rev-tier-bar ${tier.grossProfit >= 0 ? 'is-pos' : 'is-neg'}`} style={{ height }} />
                      <div className="rev-tier-margin-line" style={{ bottom: `${clamp(tier.grossMargin, 0, 1) * 100}%` }} />
                      <div className="rev-tier-label">{tier.label}</div>
                    </div>
                  )
                })}
              </div>
              <div className="rev-table-wrap">
                <table className="rev-table">
                  <thead>
                    <tr>
                      <th>Tier</th>
                      <th>Revenue</th>
                      <th>Profit</th>
                      <th>Margin</th>
                      <th>RTP</th>
                      <th>Profit / Box</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flow2.tiers.map((tier) => (
                      <tr key={tier.id} className={tier.warningWeakMargin ? 'rev-row-weak' : ''}>
                        <td>{tier.label}</td>
                        <td>{money(tier.netRevenue)}</td>
                        <td>{money(tier.grossProfit)}</td>
                        <td>{pct1(tier.grossMargin)}</td>
                        <td>{pct1(tier.rtp)}</td>
                        <td>{money(tier.profitPerBox, 2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rev-section">
              <h2 className="rev-h2">Scenario Tester</h2>
              <div className="rev-presets">
                {Object.entries(MYSTERY_PROFIT_PRESETS).map(([key, preset]) => (
                  <button key={key} type="button" className={`rev-preset ${flow2Preset === key ? 'is-active' : ''}`} onClick={() => applyFlow2Preset(key)}>
                    {preset.label} <span className="rev-preset-subcopy">{preset.subtitle}</span>
                  </button>
                ))}
              </div>
              <div className="rev-metric-grid">
                <MetricCard label="Profit per box" value={money(flow2.totals.profitPerBox, 2)} tone={flow2.totals.profitPerBox >= 0 ? 'good' : 'bad'} />
                <MetricCard label="Total profit" value={money(flow2.totals.totalProfit)} tone={flow2.totals.totalProfit >= 0 ? 'good' : 'bad'} />
                <MetricCard label="Margin %" value={pct1(flow2.totals.blendedMargin)} tone={flow2.totals.blendedMargin >= 0.2 ? 'good' : 'bad'} />
              </div>
            </section>

            <section className="rev-section">
              <h2 className="rev-h2">Sensitivity</h2>
              <div className="rev-derived-grid">
                <div className="rev-derived-item">+5% attach rate: Δ {money(sensitivity.attachDelta)}</div>
                <div className="rev-derived-item">+0.5% Stripe fee: Δ {money(sensitivity.stripeDelta)}</div>
                <div className="rev-derived-item">+5% RTP increase: Δ {money(sensitivity.rtpDelta)}</div>
              </div>
            </section>

            <section className="rev-section">
              <h2 className="rev-h2">Key Insight Panel</h2>
              <ul className="rev-list">
                <li>Lower tiers are constrained by payment fees</li>
                <li>Mid tiers ($3-$6) are most efficient</li>
                <li>High tiers drive absolute profit</li>
                <li>Attach rate is the largest scaling lever</li>
                <li>Profitability is engineered through expected value control</li>
              </ul>
            </section>
          </>
        )}
      </div>
    </motion.section>
  )
}
