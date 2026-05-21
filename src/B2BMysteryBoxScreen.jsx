import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ASSETS, B2BState, SCREEN_TRANSITION } from './constants'

const B2B_PRIZES = [
  { tier: 'LEGENDARY', value: 'Full Refund', badgeClass: 'b2b-tier-legendary' },
  { tier: 'GOLD', value: '20% Back', badgeClass: 'b2b-tier-gold' },
  { tier: 'SILVER', value: '$20 Gift Card', badgeClass: 'b2b-tier-silver' },
  { tier: 'Common', value: 'W*LD Points', badgeClass: 'b2b-tier-common' },
]

const MONEY_BURST = [
  { x: -122, y: -150, rotate: -26, delay: 0.02 },
  { x: -86, y: -186, rotate: -18, delay: 0.08 },
  { x: -42, y: -202, rotate: -10, delay: 0.14 },
  { x: 0, y: -218, rotate: 0, delay: 0.2 },
  { x: 44, y: -200, rotate: 10, delay: 0.12 },
  { x: 86, y: -176, rotate: 18, delay: 0.06 },
  { x: 120, y: -146, rotate: 24, delay: 0.01 },
]

export default function B2BMysteryBoxScreen({ phase, onBuyBox, onToggleCheckoutConfirm, onOpenBox, onClaim }) {
  const [messageIndex, setMessageIndex] = React.useState(0)
  const [showPrizeGuide, setShowPrizeGuide] = React.useState(false)
  const [showGradientExplosion, setShowGradientExplosion] = React.useState(false)
  const isOffer = phase === B2BState.offer
  const isCheckout = phase === B2BState.checkout
  const isCheckoutProcessing = phase === B2BState.checkoutProcessing
  const isReadyToOpen = phase === B2BState.readyToOpen
  const isOpening = phase === B2BState.opening
  const isResult = phase === B2BState.result
  const isPreUnlock = isOffer || isCheckout || isCheckoutProcessing
  const isBreakoutActive = isReadyToOpen || isOpening
  const activeMessage = B2B_PRIZES[messageIndex]

  React.useEffect(() => {
    if (!(isOffer || isCheckout || isCheckoutProcessing || isReadyToOpen)) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setMessageIndex((index) => (index + 1) % B2B_PRIZES.length)
    }, 3000)

    return () => window.clearInterval(intervalId)
  }, [isOffer, isCheckout, isCheckoutProcessing, isReadyToOpen])

  React.useEffect(() => {
    if (isResult || isOpening) {
      setShowPrizeGuide(false)
    }
  }, [isResult, isOpening])

  React.useEffect(() => {
    if (isReadyToOpen && !showGradientExplosion) {
      const timeoutId = setTimeout(() => setShowGradientExplosion(true), 100)
      return () => clearTimeout(timeoutId)
    }
    if (!isReadyToOpen && !isOpening && !isResult) {
      setShowGradientExplosion(false)
    }
  }, [isReadyToOpen, isOpening, isResult, showGradientExplosion])

  return (
    <motion.section className="screen mystery-screen b2b-mystery-screen" {...SCREEN_TRANSITION}>
      <div className="status-bar status-bar-dark">
        <span>8:51</span>
        <div className="status-icons">
          <span className="signal-bars signal-bars-dark" />
          <span className="wifi-icon wifi-icon-dark" />
          <span className="battery-pill battery-pill-dark">58</span>
        </div>
      </div>

      <motion.div
        className="mystery-success-fill"
        initial={false}
        animate={{ opacity: isResult ? 1 : 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="b2b-breakout-fill"
        initial={false}
        animate={{
          opacity: isBreakoutActive ? 1 : 0,
          clipPath: showGradientExplosion
            ? [
                'circle(18% at 50% 58%)',
                'circle(140% at 50% 58%)',
              ]
            : isBreakoutActive
              ? 'circle(140% at 50% 58%)'
              : 'circle(18% at 50% 58%)',
          scale: showGradientExplosion && !isOpening ? [0.95, 1.08, 1] : 1,
        }}
        transition={{
          opacity: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
          clipPath: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
          scale: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
        }}
      />

      <div className="mystery-content b2b-mystery-content">
        <motion.div
          className="b2b-order-summary"
          initial={false}
          animate={{
            opacity: isBreakoutActive ? 0 : 1,
            y: isBreakoutActive ? -10 : 0,
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
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

        <motion.div
          className="b2b-rewards-chip"
          aria-label="wildcard Rewards"
          initial={false}
          animate={{
            opacity: isBreakoutActive ? 0 : 1,
            y: isBreakoutActive ? -8 : 0,
          }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src={ASSETS.appIcon} alt="" className="b2b-rewards-chip-icon" />
          <span>wildcard MYSTERY BOX</span>
        </motion.div>

        <div className={`b2b-mystery-card ${isBreakoutActive ? 'is-breakout' : ''}`}>
          <AnimatePresence mode="wait" initial={false}>
            {isResult ? (
              <motion.div
                key="b2b-result-copy"
                className="mystery-copy-block b2b-copy-block"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mystery-title b2b-result-title">You won a FREE ORDER!</div>
                <div className="mystery-subtitle b2b-result-subtitle">Jackpot - your entire order is on us!</div>
              </motion.div>
            ) : (
              <motion.div
                key="b2b-offer-copy"
                className="mystery-copy-block b2b-copy-block"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
              >
                {isOpening ? (
                  <div className="mystery-offer-copyline">Unlocking ...</div>
                ) : isReadyToOpen ? (
                  <div className="mystery-offer-copyline mystery-offer-copyline-open b2b-tap-to-unlock-copy">TAP TO UNLOCK YOUR MYSTERY BOX!</div>
                ) : (
                  <>
                    <div className="mystery-offer-headline b2b-offer-headline">
                      Win Back
                      <br />
                      <span className="b2b-offer-amount">$394.48</span>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mystery-box-stage-wrap b2b-box-stage">
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
                        y: [0, -6, 0, 6, 0],
                        rotateZ: [0, 2, 0, -2, 0],
                      }
                    : {
                        y: [0, -10, 0, 10, 0],
                        rotateY: [0, 8, 0, -8, 0],
                      }
              }
              transition={
                isOpening
                  ? { duration: 1.8, ease: [0.16, 1, 0.3, 1] }
                  : { duration: 5, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              <div className="mystery-box-glow" />
              <img className="mystery-box-image" src={isOpening || isResult ? ASSETS.mysteryBoxOpen : ASSETS.mysteryBoxLight} alt="Mystery box" />
              {isOpening && <div className="mystery-opening-rays" />}
            </motion.button>

            <AnimatePresence>
              {isOpening && (
                <motion.div className="mystery-money-burst" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {MONEY_BURST.map((burst, index) => (
                    <motion.span
                      key={`b2b-money-${index}`}
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

          <div className="b2b-prize-slot">
            {!isResult && !isOpening && !isReadyToOpen && (
              <div className="mystery-rotator b2b-rotator">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={`${activeMessage.tier}-${activeMessage.value}`}
                    className="mystery-rotator-text"
                    initial={{ opacity: 0, scale: 0.98, filter: 'blur(2px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.985, filter: 'blur(2px)' }}
                    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className={`mystery-tier-badge ${activeMessage.badgeClass}`}>
                      {activeMessage.tier}
                    </span>
                    <span className="mystery-tier-value">{activeMessage.value}</span>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="mystery-bottom-cta">
            {isOffer ? (
              <button type="button" className="mystery-primary-button" onClick={onBuyBox}>
                $25 to Unlock
              </button>
            ) : isResult ? (
              <button type="button" className="mystery-claim-button" onClick={onClaim}>
                CLAIM REWARD
              </button>
            ) : (
              <div className="mystery-bottom-cta-placeholder" aria-hidden="true" />
            )}
          </div>
        </div>

        {!isResult && !isOpening && (
          <div className={`b2b-prize-guide-wrap ${showPrizeGuide ? 'is-expanded' : 'is-collapsed'}`}>
            <AnimatePresence mode="wait" initial={false}>
              {showPrizeGuide && isPreUnlock && (
                <motion.div
                  key="b2b-prize-guide-grid"
                  className="b2b-prize-guide-grid"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="b2b-prize-guide-item b2b-prize-guide-item-legendary">
                    <span className="b2b-guide-rarity b2b-guide-rarity-legendary">LEGENDARY 5%</span>
                    <span className="b2b-guide-value">Full Refund</span>
                  </div>
                  <div className="b2b-prize-guide-item b2b-prize-guide-item-gold">
                    <span className="b2b-guide-rarity b2b-guide-rarity-gold">GOLD 20%</span>
                    <span className="b2b-guide-value">20% Discount</span>
                  </div>
                  <div className="b2b-prize-guide-item b2b-prize-guide-item-silver">
                    <span className="b2b-guide-rarity b2b-guide-rarity-silver">SILVER 30%</span>
                    <span className="b2b-guide-value">$20 Gift Card</span>
                  </div>
                  <div className="b2b-prize-guide-item b2b-prize-guide-item-common">
                    <span className="b2b-guide-rarity b2b-guide-rarity-common">COMMON 35%</span>
                    <span className="b2b-guide-value">W*LD Points</span>
                  </div>
                </motion.div>
              )}
              {!showPrizeGuide && isPreUnlock && (
                <motion.button
                  key="b2b-prize-guide-button"
                  type="button"
                  className="b2b-prize-guide-button"
                  onClick={() => setShowPrizeGuide(true)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                  What could you win?
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {(isCheckout || isCheckoutProcessing) && (
          <motion.div
            key="b2b-checkout"
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
              <div className="mystery-pay-merchant">Mystery Box for Omnilux Order</div>
              <div className="mystery-pay-row">
                <span>Mystery box unlock</span>
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
                animate={
                  isCheckoutProcessing
                    ? {
                        scale: [1, 1.03, 1],
                      }
                    : {}
                }
                transition={{
                  scale: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
                }}
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
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                      >
                        ✓
                      </motion.span>
                      Face ID confirmed
                    </motion.span>
                  ) : (
                    <motion.span
                      key="pay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
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
