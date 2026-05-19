import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ASSETS, FortuneWebState, SCREEN_TRANSITION } from './constants'
import Fortune2D from './Fortune2D'

// ── Fortune teller colors (TAILS brand palette) ───────────────────────────────
const FT_COLORS = [
  { id: 'green',  label: 'Green',  hex: '#63ff9d', dark: '#0a2e18', letters: 5 },
  { id: 'blue',   label: 'Blue',   hex: '#43c6ff', dark: '#062233', letters: 4 },
  { id: 'red',    label: 'Red',    hex: '#ff5d5d', dark: '#330b0b', letters: 3 },
  { id: 'black',  label: 'Black',  hex: '#171717', dark: '#060606', letters: 5 },
]

// ── Prize data ─────────────────────────────────────────────────────────────────
const PRIZE_ITEMS = [
  { tier: 'LEGENDARY', pct: '5%',  value: 'Full Refund',   cls: 'web-prize-legendary', rarityCls: 'web-rarity-legendary' },
  { tier: 'GOLD',      pct: '20%', value: '20% Discount',  cls: 'web-prize-gold',      rarityCls: 'web-rarity-gold' },
  { tier: 'SILVER',    pct: '30%', value: '$20 Gift Card', cls: 'web-prize-silver',    rarityCls: 'web-rarity-silver' },
  { tier: 'COMMON',    pct: '45%', value: 'W*LD Points',  cls: 'web-prize-common',    rarityCls: 'web-rarity-common' },
]

// Roulette settles on index 1 (GOLD — 20% Discount)
const ROULETTE_ORDER = [0, 1, 3, 2]
const ROULETTE_MS    = 2520

const MONEY_BURST = [
  { x: -130, y: -130, rotate: -26, delay: 0.02 },
  { x:  -90, y: -170, rotate: -18, delay: 0.08 },
  { x:  -44, y: -188, rotate: -10, delay: 0.14 },
  { x:    0, y: -205, rotate:   0, delay: 0.20 },
  { x:   46, y: -186, rotate:  10, delay: 0.12 },
  { x:   92, y: -162, rotate:  18, delay: 0.06 },
  { x:  130, y: -130, rotate:  24, delay: 0.01 },
  { x: -110, y:  -88, rotate: -20, delay: 0.24 },
  { x:  -62, y: -108, rotate: -12, delay: 0.18 },
  { x:   62, y: -108, rotate:  12, delay: 0.16 },
  { x:  110, y:  -88, rotate:  20, delay: 0.22 },
  { x:    0, y: -126, rotate:   0, delay: 0.28 },
]



// ── Main screen component ─────────────────────────────────────────────────────
export default function WebFortuneScreen({
  phase = FortuneWebState.checkout,
  onPay,
  onUnlock,
  onConfirmPayment,
  onPickColor,
  onPickNumber,
  onPickFlap,
  onClaim,
}) {
  const isCheckout          = phase === FortuneWebState.checkout
  const isProcessing        = phase === FortuneWebState.processing
  const isConfirmed         = phase === FortuneWebState.confirmed
  const isFortuneCheckout   = phase === FortuneWebState.fortuneCheckout
  const isFortuneProcessing = phase === FortuneWebState.fortuneProcessing
  const isPickColor         = phase === FortuneWebState.pickColor
  const isAnimatingColor    = phase === FortuneWebState.animatingColor
  const isPickNumber        = phase === FortuneWebState.pickNumber
  const isAnimatingNumber   = phase === FortuneWebState.animatingNumber
  const isPickFlap          = phase === FortuneWebState.pickFlap
  const isResult            = phase === FortuneWebState.result

  const isOfferPhase       = isConfirmed || isFortuneCheckout || isFortuneProcessing
  const isInteractivePhase = isPickColor || isAnimatingColor || isPickNumber || isAnimatingNumber || isPickFlap
  const isPostCheckout     = !isCheckout && !isProcessing

  // Selected states (local, purely visual)
  const [selectedColor, setSelectedColor]   = React.useState(null)
  const [selectedNumber, setSelectedNumber] = React.useState(null)
  const [activePrizeIndex, setActivePrizeIndex] = React.useState(0)
  const [showGradientBurst, setShowGradientBurst] = React.useState(false)

  // Counter label during animating phases
  const [countStep, setCountStep] = React.useState(0)

  // Step counter for animating phases
  React.useEffect(() => {
    if (!isAnimatingColor && !isAnimatingNumber) {
      setCountStep(0)
      return undefined
    }
    const maxSteps = isAnimatingColor ? (selectedColor?.letters ?? 5) : (selectedNumber ?? 5)
    if (countStep >= maxSteps) return undefined
    const id = window.setTimeout(() => setCountStep((s) => s + 1), isAnimatingColor ? 480 : 380)
    return () => window.clearTimeout(id)
  }, [isAnimatingColor, isAnimatingNumber, countStep, selectedColor, selectedNumber])

  // Gradient burst on pickColor (like readyToOpen)
  React.useEffect(() => {
    if (isPickColor && !showGradientBurst) {
      const id = window.setTimeout(() => setShowGradientBurst(true), 100)
      return () => window.clearTimeout(id)
    }
    if (!isPickColor && !isAnimatingColor && !isPickNumber && !isAnimatingNumber && !isPickFlap && !isResult) {
      setShowGradientBurst(false)
    }
    return undefined
  }, [isPickColor, isAnimatingColor, isPickNumber, isAnimatingNumber, isPickFlap, isResult, showGradientBurst])

  // Roulette spin during result
  React.useEffect(() => {
    if (isResult) {
      let tick = 0
      let timeoutId
      let settleTimeoutId
      let cancelled = false
      const startedAt = performance.now()
      setActivePrizeIndex(ROULETTE_ORDER[0])

      const spinTick = () => {
        if (cancelled) return
        const elapsed  = performance.now() - startedAt
        const progress = Math.min(elapsed / ROULETTE_MS, 1)

        tick += 1
        const currentIndex = ROULETTE_ORDER[tick % ROULETTE_ORDER.length]
        setActivePrizeIndex(currentIndex)

        if (progress >= 0.78) {
          const startAt = ROULETTE_ORDER.indexOf(currentIndex)
          const settleSeq = []
          for (let i = 1; i <= ROULETTE_ORDER.length; i += 1) {
            const next = ROULETTE_ORDER[(startAt + i) % ROULETTE_ORDER.length]
            settleSeq.push(next)
            if (next === 1) break // settle on GOLD
          }
          let cum = 0
          settleSeq.forEach((idx) => {
            cum += 200
            settleTimeoutId = window.setTimeout(() => {
              if (!cancelled) setActivePrizeIndex(idx)
            }, cum)
          })
          return
        }

        const eased = 1 - (1 - progress) * (1 - progress)
        let delay = 70 + (260 - 70) * eased
        if (progress > 0.72) delay += (progress - 0.72) * 460
        const remaining = ROULETTE_MS - elapsed
        if (remaining <= delay + 120) {
          timeoutId = window.setTimeout(
            () => { if (!cancelled) setActivePrizeIndex(1) }, // GOLD
            Math.max(remaining, 60)
          )
          return
        }
        timeoutId = window.setTimeout(spinTick, delay)
      }

      timeoutId = window.setTimeout(spinTick, 70)
      return () => {
        cancelled = true
        window.clearTimeout(timeoutId)
        window.clearTimeout(settleTimeoutId)
      }
    }
    return undefined
  }, [isResult])

  // Reset local state on restart
  React.useEffect(() => {
    if (isCheckout || isConfirmed) {
      setSelectedColor(null)
      setSelectedNumber(null)
      setActivePrizeIndex(0)
      setCountStep(0)
    }
  }, [isCheckout, isConfirmed])

  // ── Derived fortune teller face ───────────────────────────────────────────
  const ftFace = (isPickNumber || isAnimatingNumber) ? 'number' : (isPickFlap || isResult) ? 'flap' : 'color'
  const ftSize = isInteractivePhase || isResult ? 210 : 110

  // ── Gradient background class ─────────────────────────────────────────────
  // offer = white/pink, interactive = blue/purple (is-unlock), result = yellow-green
  const gradientUnlock = isPickColor || isAnimatingColor || isPickNumber || isAnimatingNumber || isPickFlap
  const gradientResult = isResult

  return (
    <motion.div className="web-b2b-page web-checkout-page" {...SCREEN_TRANSITION}>

      {/* ── Header ───────────────────────────────────────── */}
      <header className="web-checkout-header">
        <div className="web-checkout-header-inner">
          <img className="web-site-logo" src={ASSETS.omniluxLogo} alt="Omnilux" />
          {isCheckout && (
            <div className="web-checkout-secure-badge">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13">
                <path d="M8 1L2 4v4c0 4 6 7 6 7s6-3 6-7V4L8 1z" />
              </svg>
              Secure Checkout
            </div>
          )}
        </div>
      </header>

      {/* ── Two-column body ───────────────────────────────── */}
      <div className="web-checkout-body">

        {/* ── LEFT COLUMN ─────────────────────────────────── */}
        <div className="web-checkout-left-col">
          <AnimatePresence mode="wait" initial={false}>

            {/* — Checkout form — */}
            {isCheckout && (
              <motion.div
                key="checkout-form"
                className="web-checkout-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="web-checkout-steps">
                  <span className="web-step-done">Cart</span>
                  <span className="web-step-sep">›</span>
                  <span className="web-step-active">Checkout</span>
                  <span className="web-step-sep">›</span>
                  <span className="web-step-next">Confirmation</span>
                </div>

                <div className="web-form-section">
                  <div className="web-form-section-hd">
                    <h2 className="web-form-section-title">Contact</h2>
                    <button type="button" className="web-form-edit-link">Edit</button>
                  </div>
                  <div className="web-prefilled">leahmorgan@gmail.com</div>
                </div>

                <div className="web-form-section">
                  <div className="web-form-section-hd">
                    <h2 className="web-form-section-title">Shipping address</h2>
                    <button type="button" className="web-form-edit-link">Edit</button>
                  </div>
                  <div className="web-prefilled-stack">
                    <div className="web-prefilled">Leah Morgan</div>
                    <div className="web-prefilled">11 Beverly Glen Blvd, Apt 3</div>
                    <div className="web-prefilled">Los Angeles, CA 90024 · United States</div>
                  </div>
                  <div className="web-shipping-method-pill">
                    <span className="web-shipping-dot" />
                    <span>Standard Shipping (5–7 business days)</span>
                    <span className="web-shipping-free">Free</span>
                  </div>
                </div>

                <div className="web-form-section">
                  <div className="web-form-section-hd">
                    <h2 className="web-form-section-title">Payment</h2>
                  </div>
                  <p className="web-payment-note">All transactions are encrypted and secure.</p>
                  <div className="web-payment-btns">
                    <button type="button" className="web-applepay-btn" onClick={onPay}>
                      <span className="web-applepay-symbol"> Pay</span>
                    </button>
                    <div className="web-pay-or"><span>or</span></div>
                    <button type="button" className="web-card-pay-btn" onClick={onPay}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="17" height="17">
                        <rect x="1" y="4" width="22" height="16" rx="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                      Pay with Card
                    </button>
                  </div>
                </div>

                <button type="button" className="web-place-order-btn" onClick={onPay}>
                  Complete Order — $394.48
                </button>

                <p className="web-checkout-legal">
                  By completing your purchase you agree to our{' '}
                  <span className="web-legal-link">Terms of Service</span> and{' '}
                  <span className="web-legal-link">Privacy Policy</span>.
                </p>
              </motion.div>
            )}

            {/* — Processing spinner — */}
            {isProcessing && (
              <motion.div
                key="processing"
                className="web-left-processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="web-processing-ring" />
                <p className="web-processing-label">Processing your order…</p>
              </motion.div>
            )}

            {/* — Post-checkout: confirmed card + Fortune Widget — */}
            {isPostCheckout && !isProcessing && (
              <motion.div
                key="post-checkout"
                className="web-post-checkout-col"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Order confirmed card */}
                <motion.div
                  className="web-confirmed-card"
                  animate={{ opacity: (isInteractivePhase || isResult) ? 0.4 : 1, y: (isInteractivePhase || isResult) ? -6 : 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="web-confirmed-icon-wrap">
                    <svg viewBox="0 0 40 40" fill="none" width="40" height="40">
                      <circle cx="20" cy="20" r="18" fill="#22c55e" />
                      <path d="M11 21.5 18 28 30 13" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="web-confirmed-copy">
                    <p className="web-confirmed-order-no">Order #OML-28471</p>
                    <h1 className="web-confirmed-heading">Thank you, Leah!</h1>
                    <p className="web-confirmed-sub">
                      Your order is confirmed. A shipping email will be sent to{' '}
                      <strong>leahmorgan@gmail.com</strong>.
                    </p>
                    <div className="web-confirmed-delivery">
                      📦 Estimated delivery: <strong>Sunday, April 12th</strong>
                    </div>
                  </div>
                </motion.div>

                {/* ── wildcard Fortune Widget ─────────────────── */}
                <div className="web-tails-widget">

                  {/* Gradient fill — is-unlock = blue/purple, base = yellow-green for result */}
                  <motion.div
                    className={`web-tails-gradient-fill${gradientUnlock ? ' is-unlock' : ''}`}
                    initial={false}
                    animate={
                      showGradientBurst || isInteractivePhase || isResult
                        ? { opacity: 1, scale: showGradientBurst && !isInteractivePhase && !isResult ? [0.3, 1.2, 1] : 1 }
                        : { opacity: 0, scale: 0.3 }
                    }
                    transition={
                      showGradientBurst && !isInteractivePhase && !isResult
                        ? { opacity: { duration: 0.5 }, scale: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } }
                        : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
                    }
                    style={{ transformOrigin: 'center center' }}
                  />

                  {/* Widget header bar */}
                  <div className="web-tails-widget-hd">
                    <div className="web-tails-brand">
                      <img className="web-tails-brand-icon" src={ASSETS.appIcon} alt="wildcard" />
                      <span className="web-tails-brand-name">wildcard</span>
                    </div>
                    <span className="web-tails-widget-tag">Fortune Teller Reward</span>
                  </div>

                  <AnimatePresence mode="wait">

                    {/* ── OFFER PHASE: buy the fortune teller ── */}
                    {isOfferPhase && (
                      <motion.div
                        key="fortune-offer"
                        className="web-tails-offer-layout"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35 }}
                      >
                        <div className="web-tails-offer-left">
                          <div className="web-tails-kicker">YOUR ORDER COMES WITH</div>
                          <div className="web-tails-headline">WIN BACK<br /><span className="web-tails-offer-amount">$394.48</span></div>
                          <p className="web-tails-offer-body">
                            Omnilux has partnered with wildcard — play the fortune teller to win back your purchase.
                          </p>
                          <p className="web-tails-you-can-win">You&apos;re guaranteed to win one of:</p>
                          <div className="web-tails-prize-list">
                            {PRIZE_ITEMS.map((item) => (
                              <div key={item.tier} className={`web-tails-prize-row ${item.cls}`}>
                                <span className={`web-tails-prize-rarity ${item.rarityCls}`}>
                                  {item.tier} <span className="web-tails-prize-pct">{item.pct}</span>
                                </span>
                                <span className="web-tails-prize-val">{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="web-tails-offer-right">
                          <div className="web-tails-box-stage">
                            <div className="ft-offer-glow" style={{ background: 'radial-gradient(circle, rgba(187,115,255,0.35) 0%, transparent 70%)' }} />
                            <Fortune2D
                              size={110}
                              face="color"
                              isAnimating={false}
                            />
                          </div>
                          <button
                            type="button"
                            className="web-tails-unlock-btn"
                            onClick={isConfirmed ? onUnlock : undefined}
                            disabled={!isConfirmed}
                          >
                            $25 to Unlock
                          </button>
                          <p className="web-tails-unlock-sub">Powered by wildcard — Secure payment</p>
                        </div>
                      </motion.div>
                    )}

                    {/* ── INTERACTIVE PHASES: pick color / animate / pick number / animate / pick flap ── */}
                    {isInteractivePhase && (
                      <motion.div
                        key="fortune-interactive"
                        className="ft-interactive-layout"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35 }}
                      >
                        {/* Instruction */}
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={phase}
                            className="ft-instruction"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.28 }}
                          >
                            {isPickColor && 'Pick a color ↓'}
                            {isAnimatingColor && (
                              <span>
                                {selectedColor ? (
                                  <>Counting <span style={{ color: selectedColor.hex }}>{selectedColor.label}</span>…</>
                                ) : 'Counting…'}
                                {' '}<strong className="ft-step-counter">{countStep}</strong>
                              </span>
                            )}
                            {isPickNumber && 'Pick a number ↓'}
                            {isAnimatingNumber && (
                              <span>
                                Counting to <strong style={{ color: '#bb73ff' }}>{selectedNumber}</strong>…{' '}
                                <strong className="ft-step-counter">{countStep}</strong>
                              </span>
                            )}
                            {isPickFlap && 'Lift a flap ↓'}
                          </motion.div>
                        </AnimatePresence>

                        {/* Fortune teller */}
                        <div className="ft-stage">
                          {/* Glow ring */}
                          <div className="ft-stage-glow" />

                          <Fortune2D
                            size={210}
                            face={ftFace}
                            isAnimating={isAnimatingColor || isAnimatingNumber}
                            onPickColor={isPickColor ? (colorId) => {
                              const found = FT_COLORS.find(c => c.id === colorId)
                              setSelectedColor(found ?? FT_COLORS[0])
                              onPickColor()
                            } : null}
                            onPickNumber={isPickNumber ? (num) => {
                              setSelectedNumber(num)
                              onPickNumber()
                            } : null}
                            onPickFlap={isPickFlap ? onPickFlap : null}
                          />

                          {/* Spark particles during animating */}
                          {(isAnimatingColor || isAnimatingNumber) && (
                            <div className="ft-sparks">
                              {[...Array(6)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="ft-spark"
                                  style={{
                                    background: FT_COLORS[i % 4].hex,
                                    left: `${15 + i * 14}%`,
                                  }}
                                  animate={{ y: [-8, -28, -8], opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                                  transition={{ duration: 0.8, delay: i * 0.12, repeat: Infinity, ease: 'easeInOut' }}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Prize row */}
                        <div className="ft-mini-prize-row">
                          {PRIZE_ITEMS.map((item) => (
                            <div key={item.tier} className={`web-tails-reveal-prize-item ${item.cls}`}>
                              <span className={`web-tails-prize-rarity ${item.rarityCls}`}>{item.tier}</span>
                              <span className="web-tails-prize-val">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* ── RESULT PHASE ── */}
                    {isResult && (
                      <motion.div
                        key="fortune-result"
                        className="web-tails-reveal-layout"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35 }}
                      >
                        {/* Result copy */}
                        <motion.div
                          className="web-tails-reveal-copy"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                            <span className="mystery-tier-badge mystery-tier-gold mystery-result-badge">GOLD</span>
                            <div className="web-tails-result-headline">
                              YOU WON A <span className="web-tails-result-amount">20% DISCOUNT</span>!
                            </div>
                          </div>
                        </motion.div>

                        {/* Fortune teller (small, with glow) */}
                        <div className="web-tails-reveal-box-wrap">
                          <div className="web-tails-box-glow web-tails-box-glow-lg" />
                          <div className="mystery-box-spark mystery-box-spark-a" />
                          <div className="mystery-box-spark mystery-box-spark-b" />
                          <div className="mystery-box-spark mystery-box-spark-c" />

                          <motion.div
                            animate={{ y: [0, -8, 0], rotate: [0, -3, 3, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            <Fortune2D
                              size={130}
                              face="flap"
                              isAnimating={false}
                            />
                          </motion.div>

                          {/* Money burst */}
                          <AnimatePresence>
                            <motion.div
                              className="mystery-money-burst"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              {MONEY_BURST.map((b, i) => (
                                <motion.span
                                  key={`mb-${i}`}
                                  className="mystery-money-sign"
                                  initial={{ x: 0, y: -8, scale: 0.62, opacity: 0, rotate: 0 }}
                                  animate={{ x: b.x, y: [0, b.y * 0.58, b.y], scale: [0.62, 1.04, 0.94], opacity: [0, 1, 0], rotate: [0, b.rotate] }}
                                  transition={{ duration: 1.35, delay: b.delay, ease: [0.16, 1, 0.3, 1], times: [0, 0.45, 1] }}
                                >
                                  wildcard
                                </motion.span>
                              ))}
                            </motion.div>
                          </AnimatePresence>
                        </div>

                        {/* Prize row */}
                        <motion.div
                          className="web-tails-reveal-prize-row is-result-text"
                          animate={{ scale: 1.04 }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                          {PRIZE_ITEMS.map((item, idx) => (
                            <div
                              key={item.tier}
                              className={`web-tails-reveal-prize-item ${item.cls} ${activePrizeIndex === idx ? 'is-active' : ''}`}
                            >
                              <span className={`web-tails-prize-rarity ${item.rarityCls}`}>{item.tier}</span>
                              <span className="web-tails-prize-val">{item.value}</span>
                            </div>
                          ))}
                        </motion.div>

                        {/* CTA */}
                        <div className="web-tails-reveal-cta">
                          <motion.button
                            type="button"
                            className="web-tails-claim-btn"
                            onClick={onClaim}
                            initial={{ opacity: 0, y: 10, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          >
                            REDEEM 20% OFF
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </div>
                {/* end .web-tails-widget */}

              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* end left col */}

        {/* ── RIGHT COLUMN — order summary ─────────────────── */}
        <div className="web-order-summary-panel">
          <h2 className="web-summary-title">Order Summary</h2>

          <div className="web-summary-item">
            <div className="web-summary-item-img-wrap">
              <img className="web-summary-item-img" src={ASSETS.omniluxProduct} alt="Omnilux Contour Face" />
              <span className="web-summary-item-qty">1</span>
            </div>
            <div className="web-summary-item-info">
              <div className="web-summary-item-name">Omnilux Contour Face</div>
              <div className="web-summary-item-variant">Women's · Rose Quartz · LED Mask</div>
            </div>
            <div className="web-summary-item-price">$385.00</div>
          </div>

          <div className="web-summary-rule" />

          <div className="web-summary-totals">
            <div className="web-summary-row"><span>Subtotal</span><span>$385.00</span></div>
            <div className="web-summary-row"><span>Shipping</span><span className="web-summary-free">Free</span></div>
            <div className="web-summary-row"><span>Taxes (CA)</span><span>$9.48</span></div>
          </div>

          <div className="web-summary-rule" />

          <div className="web-summary-total-row">
            <span>Total</span>
            <span>$394.48</span>
          </div>

          <div className="web-summary-badges">
            <span className="web-summary-badge">🔒 SSL Secured</span>
            <span className="web-summary-badge">✓ PCI Compliant</span>
          </div>
        </div>

      </div>
      {/* end .web-checkout-body */}

      {/* ── Payment modal overlay ─────────────────────────── */}
      <AnimatePresence>
        {(isFortuneCheckout || isFortuneProcessing) && (
          <motion.div
            key="fortune-pay-modal"
            className="web-tails-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="web-tails-modal"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            >
              <div className="web-tails-modal-handle" />
              <div className="web-tails-modal-title">Pay $25.00</div>
              <div className="web-tails-modal-merchant">Fortune Teller · Omnilux Order</div>

              <div className="web-tails-modal-card-row">
                <div className="web-tails-modal-card-icon">EB</div>
                <div className="web-tails-modal-card-info">
                  <div className="web-tails-modal-card-name">Evergreen Bank</div>
                  <div className="web-tails-modal-card-sub">Leah Morgan · Los Angeles CA 90024</div>
                </div>
                <div className="web-tails-modal-card-digits">•••• 2048</div>
              </div>

              <div className="web-tails-modal-row">
                <span>Fortune Teller</span>
                <strong>$25.00</strong>
              </div>
              <div className="web-tails-modal-row">
                <span>Card</span>
                <strong>Visa Debit</strong>
              </div>

              <motion.button
                type="button"
                className={`web-tails-modal-btn ${isFortuneProcessing ? 'is-success' : ''}`}
                onClick={isFortuneCheckout ? onConfirmPayment : undefined}
                disabled={isFortuneProcessing}
                animate={isFortuneProcessing ? { scale: [1, 1.03, 1] } : {}}
                transition={{ scale: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } }}
              >
                <AnimatePresence mode="wait">
                  {isFortuneProcessing ? (
                    <motion.span
                      key="confirmed"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <motion.span
                        className="mystery-webpay-success-dot"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                      >✓</motion.span>
                      Touch ID confirmed
                    </motion.span>
                  ) : (
                    <motion.span
                      key="pay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2C8.5 2 5.5 3.9 4 6.7" />
                          <path d="M4.2 10a8 8 0 0 0 .3 5" />
                          <path d="M6.1 17.4A8 8 0 0 0 20 12a8 8 0 0 0-1-3.9" />
                          <path d="M19.4 6.7A8 8 0 0 0 12 4" />
                          <path d="M12 8a4 4 0 0 0-4 4 13 13 0 0 0 1.5 6" />
                          <path d="M12 8a4 4 0 0 1 4 4 13 13 0 0 1-.6 3.9" />
                          <path d="M12 12v.01" />
                        </svg>
                        Buy with Apple Pay
                      </span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  )
}
