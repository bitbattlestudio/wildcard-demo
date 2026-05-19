import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ASSETS, WebB2BState, SCREEN_TRANSITION } from './constants'

// ── Prize data ────────────────────────────────────────────────────────────────
const PRIZE_ITEMS = [
  { tier: 'LEGENDARY', pct: '5%',  value: 'Full Refund',   cls: 'web-prize-legendary', rarityCls: 'web-rarity-legendary' },
  { tier: 'GOLD',      pct: '20%', value: '20% Discount',  cls: 'web-prize-gold',      rarityCls: 'web-rarity-gold' },
  { tier: 'SILVER',    pct: '30%', value: '$20 Gift Card', cls: 'web-prize-silver',    rarityCls: 'web-rarity-silver' },
  { tier: 'COMMON',    pct: '45%', value: 'W*LD Points',  cls: 'web-prize-common',    rarityCls: 'web-rarity-common' },
]

const ROULETTE_ORDER      = [0, 1, 3, 2]
const OPENING_ROULETTE_MS = 2520

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

export default function WebB2BCheckoutScreen({
  phase = WebB2BState.checkout,
  onPay,
  onUnlock,
  onConfirmPayment,
  onOpenBox,
  onClaim,
}) {
  const isCheckout          = phase === WebB2BState.checkout
  const isProcessing        = phase === WebB2BState.processing
  const isConfirmed         = phase === WebB2BState.confirmed
  const isMysteryCheckout   = phase === WebB2BState.mysteryCheckout
  const isMysteryProcessing = phase === WebB2BState.mysteryProcessing
  const isReadyToOpen       = phase === WebB2BState.readyToOpen
  const isOpening           = phase === WebB2BState.opening
  const isResult            = phase === WebB2BState.result

  const isOfferPhase  = isConfirmed || isMysteryCheckout || isMysteryProcessing
  const isRevealPhase = isReadyToOpen || isOpening || isResult
  const isPostCheckout = isProcessing || isConfirmed || isMysteryCheckout ||
                         isMysteryProcessing || isReadyToOpen || isOpening || isResult

  const [activePrizeIndex,  setActivePrizeIndex]  = React.useState(0)
  const [showGradientBurst, setShowGradientBurst] = React.useState(false)

  // Gradient explosion on readyToOpen
  React.useEffect(() => {
    if (isReadyToOpen && !showGradientBurst) {
      const id = setTimeout(() => setShowGradientBurst(true), 100)
      return () => clearTimeout(id)
    }
    if (!isReadyToOpen && !isOpening && !isResult) setShowGradientBurst(false)
    return undefined
  }, [isReadyToOpen, isOpening, isResult, showGradientBurst])

  // Roulette spin
  React.useEffect(() => {
    if (isOpening) {
      let tick = 0
      let timeoutId
      let settleTimeoutId
      let cancelled = false
      const startedAt = performance.now()
      setActivePrizeIndex(ROULETTE_ORDER[0])

      const spinTick = () => {
        if (cancelled) return
        const elapsed  = performance.now() - startedAt
        const progress = Math.min(elapsed / OPENING_ROULETTE_MS, 1)

        tick += 1
        const currentIndex = ROULETTE_ORDER[tick % ROULETTE_ORDER.length]
        setActivePrizeIndex(currentIndex)

        if (progress >= 0.78) {
          const startAt  = ROULETTE_ORDER.indexOf(currentIndex)
          const settleSeq = []
          for (let i = 1; i <= ROULETTE_ORDER.length; i += 1) {
            const next = ROULETTE_ORDER[(startAt + i) % ROULETTE_ORDER.length]
            settleSeq.push(next)
            if (next === 0) break
          }
          let cum = 0
          settleSeq.forEach((idx, step) => {
            cum += 180 + step * 120
            settleTimeoutId = window.setTimeout(() => {
              if (!cancelled) setActivePrizeIndex(idx)
            }, cum)
          })
          return
        }

        const eased   = 1 - (1 - progress) * (1 - progress)
        let delay     = 70 + (260 - 70) * eased
        if (progress > 0.72) delay += (progress - 0.72) * 460
        const remaining = OPENING_ROULETTE_MS - elapsed
        if (remaining <= delay + 120) {
          timeoutId = window.setTimeout(
            () => { if (!cancelled) setActivePrizeIndex(0) },
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
    if (isResult) setActivePrizeIndex(0)
    return undefined
  }, [isOpening, isResult])

  const boxSrc = isOpening || isResult
    ? ASSETS.mysteryBoxOpen
    : isOfferPhase || isRevealPhase
      ? ASSETS.mysteryBoxLight
      : ASSETS.mysteryBox

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
                {/* Breadcrumb steps */}
                <div className="web-checkout-steps">
                  <span className="web-step-done">Cart</span>
                  <span className="web-step-sep">›</span>
                  <span className="web-step-active">Checkout</span>
                  <span className="web-step-sep">›</span>
                  <span className="web-step-next">Confirmation</span>
                </div>

                {/* Contact */}
                <div className="web-form-section">
                  <div className="web-form-section-hd">
                    <h2 className="web-form-section-title">Contact</h2>
                    <button type="button" className="web-form-edit-link">Edit</button>
                  </div>
                  <div className="web-prefilled">leahmorgan@gmail.com</div>
                </div>

                {/* Shipping */}
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

                {/* Payment */}
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

            {/* — Post-checkout: confirmed + TAILS widget — */}
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
                  animate={{ opacity: isRevealPhase ? 0.4 : 1, y: isRevealPhase ? -6 : 0 }}
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

                {/* ── wildcard Mystery Widget ─────────────────── */}
                <div className="web-tails-widget">

                  {/* Gradient burst — is-unlock = blue/pink, base = yellow-green */}
                  <motion.div
                    className={`web-tails-gradient-fill${(isReadyToOpen || isOpening) ? ' is-unlock' : ''}`}
                    initial={false}
                    animate={
                      showGradientBurst || isOpening || isResult
                        ? { opacity: 1, scale: showGradientBurst && !isOpening && !isResult ? [0.3, 1.2, 1] : 1 }
                        : { opacity: 0, scale: 0.3 }
                    }
                    transition={
                      showGradientBurst && !isOpening && !isResult
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
                    <span className="web-tails-widget-tag">Mystery Box Reward</span>
                  </div>

                  <AnimatePresence mode="wait">

                    {/* Offer layout */}
                    {isOfferPhase && (
                      <motion.div
                        key="offer"
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
                            Omnilux has partnered with wildcard to give you a chance to win back your purchase.
                          </p>
                          <p className="web-tails-you-can-win">You&apos;re guaranteed to win one of:</p>
                          <div className="web-tails-prize-list">
                            {PRIZE_ITEMS.map((item, idx) => (
                              <div
                                key={item.tier}
                                className={`web-tails-prize-row ${item.cls} ${(isOpening || isResult) && activePrizeIndex === idx ? 'is-active' : ''}`}
                              >
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
                            <div className="web-tails-box-glow" />
                            <motion.div
                              animate={{ y: [0, -10, 0, 10, 0], rotateY: [0, 8, 0, -8, 0] }}
                              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                            >
                              <img className="web-tails-box-img" src={boxSrc} alt="Mystery Box" />
                            </motion.div>
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

                    {/* Reveal layout */}
                    {isRevealPhase && (
                      <motion.div
                        key="reveal"
                        className="web-tails-reveal-layout"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35 }}
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {isResult ? (
                            <motion.div
                              key="result-copy"
                              className="web-tails-reveal-copy"
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.4 }}
                            >
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                                <span className="mystery-tier-badge mystery-tier-legendary mystery-result-badge">LEGENDARY</span>
                                <div className="web-tails-result-headline">
                                  FULL REFUND OF <span className="web-tails-result-amount">$394.48</span>!
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="open-copy"
                              className="web-tails-reveal-copy"
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.4 }}
                            >
                              <div className="web-tails-open-prompt">
                                {isOpening ? 'Unlocking…' : 'Tap your box to open!'}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Box */}
                        <div className="web-tails-reveal-box-wrap">
                          <div className="web-tails-box-glow web-tails-box-glow-lg" />
                          <div className="mystery-box-spark mystery-box-spark-a" />
                          <div className="mystery-box-spark mystery-box-spark-b" />
                          <div className="mystery-box-spark mystery-box-spark-c" />

                          <motion.button
                            type="button"
                            className={`web-tails-reveal-box-btn ${isResult ? 'is-result' : ''}`}
                            onClick={isReadyToOpen ? onOpenBox : undefined}
                            disabled={!isReadyToOpen}
                            animate={
                              isOpening
                                ? {
                                    rotateX: [-6, -28, -12, -34, 0],
                                    rotateY: [0, 18, -14, 22, 0],
                                    scale:   [1, 1.06, 1.12, 1.02],
                                    y:       [0, -8, -18, -10, 0],
                                    filter: [
                                      'drop-shadow(0 18px 24px rgba(132,255,183,0.18))',
                                      'drop-shadow(0 0 42px rgba(250,255,92,0.6))',
                                      'drop-shadow(0 0 60px rgba(180,255,98,0.7))',
                                      'drop-shadow(0 0 40px rgba(255,255,255,0.42))',
                                    ],
                                  }
                                : isResult
                                  ? { y: 0, rotateY: 0, scale: 1 }
                                  : { y: [0, -10, 0, 10, 0], rotateY: [0, 8, 0, -8, 0] }
                            }
                            transition={
                              isOpening
                                ? { duration: 1.8, ease: [0.16, 1, 0.3, 1] }
                                : isResult
                                  ? { duration: 0.35 }
                                  : { duration: 5, repeat: Infinity, ease: 'easeInOut' }
                            }
                          >
                            <img className="web-tails-reveal-box-img" src={boxSrc} alt="Mystery Box" />
                            {isOpening && <div className="mystery-opening-rays" />}
                          </motion.button>

                          <AnimatePresence>
                            {isOpening && (
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
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Prize row — stays fixed, no downward shift */}
                        <motion.div
                          className={`web-tails-reveal-prize-row ${isOpening || isReadyToOpen ? 'is-unlock-text' : ''} ${isResult ? 'is-result-text' : ''}`}
                          animate={{ scale: (isOpening || isResult) ? 1.04 : 1 }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        >
                          {PRIZE_ITEMS.map((item, idx) => (
                            <div
                              key={item.tier}
                              className={`web-tails-reveal-prize-item ${item.cls} ${(isOpening || isResult) && activePrizeIndex === idx ? 'is-active' : ''}`}
                            >
                              <span className={`web-tails-prize-rarity ${item.rarityCls}`}>{item.tier}</span>
                              <span className="web-tails-prize-val">{item.value}</span>
                            </div>
                          ))}
                        </motion.div>

                        {/* CTA */}
                        <div className="web-tails-reveal-cta">
                          {isResult && (
                            <motion.button
                              type="button"
                              className="web-tails-claim-btn"
                              onClick={onClaim}
                              initial={{ opacity: 0, y: 10, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            >
                              REDEEM FULL REFUND
                            </motion.button>
                          )}
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

        {/* ── RIGHT COLUMN — order summary, always visible ── */}
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
            <div className="web-summary-row">
              <span>Subtotal</span>
              <span>$385.00</span>
            </div>
            <div className="web-summary-row">
              <span>Shipping</span>
              <span className="web-summary-free">Free</span>
            </div>
            <div className="web-summary-row">
              <span>Taxes (CA)</span>
              <span>$9.48</span>
            </div>
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
        {(isMysteryCheckout || isMysteryProcessing) && (
          <motion.div
            key="pay-modal"
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
              <div className="web-tails-modal-merchant">Mystery Box · Omnilux Order</div>

              <div className="web-tails-modal-card-row">
                <div className="web-tails-modal-card-icon">EB</div>
                <div className="web-tails-modal-card-info">
                  <div className="web-tails-modal-card-name">Evergreen Bank</div>
                  <div className="web-tails-modal-card-sub">Leah Morgan · Los Angeles CA 90024</div>
                </div>
                <div className="web-tails-modal-card-digits">•••• 2048</div>
              </div>

              <div className="web-tails-modal-row">
                <span>Reward box</span>
                <strong>$25.00</strong>
              </div>
              <div className="web-tails-modal-row">
                <span>Card</span>
                <strong>Visa Debit</strong>
              </div>

              <motion.button
                type="button"
                className={`web-tails-modal-btn ${isMysteryProcessing ? 'is-success' : ''}`}
                onClick={isMysteryCheckout ? onConfirmPayment : undefined}
                disabled={isMysteryProcessing}
                animate={isMysteryProcessing ? { scale: [1, 1.03, 1] } : {}}
                transition={{ scale: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } }}
              >
                <AnimatePresence mode="wait">
                  {isMysteryProcessing ? (
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
                      >
                        ✓
                      </motion.span>
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
                        {/* Touch ID fingerprint SVG */}
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
