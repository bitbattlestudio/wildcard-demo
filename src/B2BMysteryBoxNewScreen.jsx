import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ASSETS, B2BState, SCREEN_TRANSITION } from './constants'

const BOX_MESSAGES = [
  { tier: 'LEGENDARY', value: 'Full Refund' },
  { tier: 'GOLD', value: '20% Back' },
  { tier: 'SILVER', value: '$20 Gift Card' },
  { tier: 'Common', value: 'W*LD Points' },
]

const MONEY_BURST = [
  { x: -122, y: -150, rotate: -26, delay: 0.02 },
  { x: -86, y: -186, rotate: -18, delay: 0.08 },
  { x: -42, y: -202, rotate: -10, delay: 0.14 },
  { x: 0, y: -218, rotate: 0, delay: 0.2 },
  { x: 44, y: -200, rotate: 10, delay: 0.12 },
  { x: 86, y: -176, rotate: 18, delay: 0.06 },
  { x: 120, y: -146, rotate: 24, delay: 0.01 },
  { x: -104, y: -108, rotate: -20, delay: 0.24 },
  { x: -58, y: -126, rotate: -12, delay: 0.18 },
  { x: 58, y: -126, rotate: 12, delay: 0.16 },
  { x: 104, y: -108, rotate: 20, delay: 0.22 },
  { x: 0, y: -144, rotate: 0, delay: 0.28 },
]

const PRIZE_ITEMS = [
  { tier: 'LEGENDARY 5%', value: 'Full Refund', className: 'b2b-prize-guide-item-legendary', rarityClass: 'b2b-guide-rarity-legendary' },
  { tier: 'GOLD 20%', value: '20% Discount', className: 'b2b-prize-guide-item-gold', rarityClass: 'b2b-guide-rarity-gold' },
  { tier: 'SILVER 30%', value: '$20 Gift Card', className: 'b2b-prize-guide-item-silver', rarityClass: 'b2b-guide-rarity-silver' },
  { tier: 'COMMON 35%', value: 'W*LD Points', className: 'b2b-prize-guide-item-common', rarityClass: 'b2b-guide-rarity-common' },
]

const ROULETTE_ORDER = [0, 1, 3, 2]
const OPENING_ROULETTE_MS = 2520

export default function B2BMysteryBoxNewScreen({
  phase,
  messageIndex,
  onBuyBox,
  onToggleCheckoutConfirm,
  onOpenBox,
  onClaim,
}) {
  const isOffer = phase === B2BState.offer
  const isCheckout = phase === B2BState.checkout
  const isCheckoutProcessing = phase === B2BState.checkoutProcessing
  const isReadyToOpen = phase === B2BState.readyToOpen
  const isOpening = phase === B2BState.opening
  const isResult = phase === B2BState.result
  const isUnlockPhase = isReadyToOpen || isOpening || isResult
  const isUnlockMotionPhase = isReadyToOpen || isOpening
  const activeMessage = BOX_MESSAGES[messageIndex]
  const [showGradientExplosion, setShowGradientExplosion] = React.useState(false)
  const [activePrizeIndex, setActivePrizeIndex] = React.useState(0)

  React.useEffect(() => {
    if (isReadyToOpen && !showGradientExplosion) {
      const timeoutId = setTimeout(() => setShowGradientExplosion(true), 100)
      return () => clearTimeout(timeoutId)
    }
    if (!isReadyToOpen && !isOpening && !isResult) {
      setShowGradientExplosion(false)
    }
    return undefined
  }, [isReadyToOpen, isOpening, isResult, showGradientExplosion])

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
        const elapsed = performance.now() - startedAt
        const progress = Math.min(elapsed / OPENING_ROULETTE_MS, 1)

        tick += 1
        const currentIndex = ROULETTE_ORDER[tick % ROULETTE_ORDER.length]
        setActivePrizeIndex(currentIndex)

        if (progress >= 0.78) {
          const startAt = ROULETTE_ORDER.indexOf(currentIndex)
          const settleSequence = []
          for (let i = 1; i <= ROULETTE_ORDER.length; i += 1) {
            const next = ROULETTE_ORDER[(startAt + i) % ROULETTE_ORDER.length]
            settleSequence.push(next)
            if (next === 0) break
          }

          let cumulativeDelay = 0
          settleSequence.forEach((index, seqStep) => {
            const stepDelay = 180 + seqStep * 120
            cumulativeDelay += stepDelay
            settleTimeoutId = window.setTimeout(() => {
              if (!cancelled) setActivePrizeIndex(index)
            }, cumulativeDelay)
          })
          return
        }

        const eased = 1 - (1 - progress) * (1 - progress)
        let delay = 70 + (260 - 70) * eased
        if (progress > 0.72) {
          delay += (progress - 0.72) * 460
        }

        const remaining = OPENING_ROULETTE_MS - elapsed
        if (remaining <= delay + 120) {
          timeoutId = window.setTimeout(() => {
            setActivePrizeIndex(0)
          }, Math.max(remaining, 60))
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

    if (isResult) {
      setActivePrizeIndex(0)
    }

    return undefined
  }, [isOpening, isResult])

  return (
    <motion.section className="screen mystery-screen b2b-new-mystery-screen" {...SCREEN_TRANSITION}>
      <div className="status-bar status-bar-dark">
        <span>8:51</span>
        <div className="status-icons">
          <span className="signal-bars signal-bars-dark" />
          <span className="wifi-icon wifi-icon-dark" />
          <span className="battery-pill battery-pill-dark">58</span>
        </div>
      </div>

      <motion.div
        className={`mystery-success-fill ${isUnlockMotionPhase ? 'b2b-new-unlock-fill' : ''}`}
        initial={false}
        animate={
          showGradientExplosion || isOpening || isResult
            ? {
                opacity: 1,
                scale: showGradientExplosion && !isOpening && !isResult ? [0.3, 1.2, 1] : 1,
              }
            : {
                opacity: 0,
                scale: 0.3,
              }
        }
        transition={
          showGradientExplosion && !isOpening && !isResult
            ? {
                opacity: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                scale: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
              }
            : {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }
        }
        style={{ transformOrigin: 'center center' }}
      />

      <div className="mystery-content b2b-new-mystery-content">
        <div className="mystery-header">
          <motion.div
            className="b2b-order-summary b2b-new-order-summary"
            initial={false}
            animate={{ opacity: isUnlockPhase ? 0 : 1, y: isUnlockPhase ? -8 : 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="b2b-order-icon" aria-hidden="true">
              <svg viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="17" />
                <path d="M11 21.5 18 28 30 13" />
              </svg>
            </div>
            <div className="b2b-order-copy-wrap">
              <div className="b2b-order-title">Your order is confirmed!</div>
              <div className="b2b-order-copy">You&apos;ll receive a confirmation email shortly.</div>
              <div className="b2b-order-copy">
                Estimated delivery: <strong>Sunday, April 12th.</strong>
              </div>
            </div>
          </motion.div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {isResult ? (
            <motion.div
              key="mystery-result-copy"
              className="mystery-copy-block b2b-new-result-copy"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="b2b-new-result-slot"
                initial={false}
                animate={{ y: -82, scale: 1.03 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="mystery-tier-badge mystery-tier-legendary mystery-result-badge">LEGENDARY</span>
                <div className="mystery-title b2b-new-result-title">
                  FULL REFUND OF <span className="b2b-new-result-amount">$394.48</span>!
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="mystery-offer-copy"
              className="mystery-copy-block"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
            >
              {isOpening ? (
                <motion.div
                  className="mystery-offer-copyline mystery-offer-copyline-open b2b-new-open-copy"
                  initial={false}
                  animate={{ y: isUnlockMotionPhase ? -82 : 0, scale: isUnlockMotionPhase ? 1.03 : 1 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  Unlocking ...
                </motion.div>
              ) : isReadyToOpen ? (
                <motion.div
                  className="mystery-offer-copyline mystery-offer-copyline-open b2b-new-open-copy"
                  initial={false}
                  animate={{ y: isUnlockMotionPhase ? -82 : 0, scale: isUnlockMotionPhase ? 1.03 : 1 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  Tap your box
                  <br />
                  to open!
                </motion.div>
              ) : (
                <>
                  <div className="mystery-offer-kicker">wildcard MYSTERY BOX</div>
                  <div className="mystery-offer-headline">
                    WIN BACK
                    <br />
                    <span className="b2b-offer-amount">$394.48</span>
                    
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="b2b-new-offer-area">
          <div className="mystery-box-stage-wrap">
            <div className="mystery-box-spark mystery-box-spark-a" />
            <div className="mystery-box-spark mystery-box-spark-b" />
            <div className="mystery-box-spark mystery-box-spark-c" />
            <motion.button
              type="button"
              className={`mystery-box-hero ${isResult ? 'is-result' : ''}`}
              onClick={isReadyToOpen ? onOpenBox : undefined}
              disabled={!isReadyToOpen}
              animate={
                isOpening
                  ? {
                      rotateX: [-6, -28, -12, -34, 0],
                      rotateY: [0, 18, -14, 22, 0],
                      scale: [1, 1.06, 1.12, 1.02],
                      y: [0, -8, -18, -10, 0],
                      filter: [
                        'drop-shadow(0 18px 24px rgba(185, 120, 255, 0.22))',
                        'drop-shadow(0 0 42px rgba(250, 255, 92, 0.6))',
                        'drop-shadow(0 0 60px rgba(180, 255, 98, 0.7))',
                        'drop-shadow(0 0 40px rgba(255, 255, 255, 0.42))',
                      ],
                    }
                  : isResult
                    ? {
                        y: 0,
                        rotateY: 0,
                        rotateZ: 0,
                        scale: 1,
                      }
                    : {
                        y: [0, -10, 0, 10, 0],
                        rotateY: [0, 8, 0, -8, 0],
                      }
              }
              transition={
                isOpening
                  ? { duration: 1.8, ease: [0.16, 1, 0.3, 1] }
                  : isResult
                    ? { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
                    : { duration: 5, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              <div className="mystery-box-glow" />
              <img
                className="mystery-box-image"
                src={
                  isOpening || isResult
                    ? ASSETS.mysteryBoxOpen
                    : isOffer || isCheckout || isCheckoutProcessing || isReadyToOpen
                      ? ASSETS.mysteryBoxLight
                      : ASSETS.mysteryBox
                }
                alt="Mystery box"
              />
              {isOpening && <div className="mystery-opening-rays" />}
            </motion.button>
            <AnimatePresence>
              {isOpening && (
                <motion.div className="mystery-money-burst" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {MONEY_BURST.map((burst, index) => (
                    <motion.span
                      key={`money-${index}`}
                      className="mystery-money-sign"
                      initial={{ x: 0, y: -8, scale: 0.62, opacity: 0, rotate: 0 }}
                      animate={{
                        x: burst.x,
                        y: [0, burst.y * 0.58, burst.y],
                        scale: [0.62, 1.04, 0.94],
                        opacity: [0, 1, 0],
                        rotate: [0, burst.rotate],
                      }}
                      transition={{
                        duration: 1.35,
                        delay: burst.delay,
                        ease: [0.16, 1, 0.3, 1],
                        times: [0, 0.45, 1],
                      }}
                    >
                      wildcard
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            className="b2b-new-inline-rewards"
            initial={false}
            animate={{
              y: isUnlockMotionPhase ? 88 : isResult ? 10 : 0,
              scale: isUnlockMotionPhase ? 1.2 : isResult ? 1.06 : 1,
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {!isUnlockPhase && <div className="b2b-new-rewards-kicker">You&apos;re guaranteed to win one of:</div>}
            <div
              className={`b2b-prize-guide-grid b2b-new-prize-grid ${isUnlockMotionPhase ? 'is-unlock-text' : ''} ${isResult ? 'is-result-text' : ''}`}
            >
              {PRIZE_ITEMS.map((item, index) => (
                <div
                  key={`prize-${item.tier}`}
                  className={`b2b-prize-guide-item ${item.className} ${(isOpening || isResult) && activePrizeIndex === index ? 'is-active' : ''}`}
                >
                  <span className={`b2b-guide-rarity ${item.rarityClass}`}>{item.tier}</span>
                  <span className="b2b-guide-value">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="mystery-bottom-cta">
            {isOffer ? (
              <>
                <button type="button" className="mystery-primary-button" onClick={onBuyBox}>
                  $25 to Unlock
                </button>
              </>
            ) : isResult ? (
              <motion.button
                type="button"
                className="mystery-claim-button"
                onClick={onClaim}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                REDEEM FULL REFUND
              </motion.button>
            ) : (
              <div className="mystery-bottom-cta-placeholder" aria-hidden="true" />
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {(isCheckout || isCheckoutProcessing) && (
          <motion.div
            key="mystery-checkout"
            className="mystery-pay-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="mystery-pay-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 170, damping: 22, mass: 1 }}
            >
              <div className="mystery-pay-handle" />
              <div className="mystery-pay-title">Pay $25.00</div>
              <div className="mystery-pay-merchant">Mystery Box for Sneakers</div>
              <div className="mystery-pay-row">
                <span>Reward box</span>
                <strong>$25.00</strong>
              </div>
              <div className="mystery-pay-row">
                <span>Card</span>
                <strong>Visa Debit</strong>
              </div>
              <motion.button
                type="button"
                className={`mystery-pay-button ${isCheckoutProcessing ? 'is-success' : ''}`}
                onClick={onToggleCheckoutConfirm}
                disabled={isCheckoutProcessing}
                animate={isCheckoutProcessing ? { scale: [1, 1.03, 1] } : {}}
                transition={{ scale: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } }}
              >
                <AnimatePresence mode="wait">
                  {isCheckoutProcessing ? (
                    <motion.span
                      key="confirmed"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <motion.span
                        className="mystery-webpay-success-dot"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                      >
                        ✓
                      </motion.span>
                      Face ID confirmed
                    </motion.span>
                  ) : (
                    <motion.span key="pay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                      Buy with Apple Pay
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
