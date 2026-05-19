import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ASSETS, SCREEN_TRANSITION } from './constants'

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

export default function MysteryBoxScreen({ phase, messageIndex, onBuyBox, onConfirmCheckout, onOpenBox, onClaim }) {
  const isOffer = phase === 'mystery_offer'
  const isCheckout = phase === 'mystery_checkout'
  const isCheckoutProcessing = phase === 'mystery_checkout_processing'
  const isReadyToOpen = phase === 'mystery_ready_to_open'
  const isOpening = phase === 'mystery_opening'
  const isResult = phase === 'mystery_result'
  const activeMessage = BOX_MESSAGES[messageIndex]
  const [showGradientExplosion, setShowGradientExplosion] = React.useState(false)

  React.useEffect(() => {
    if (isReadyToOpen && !showGradientExplosion) {
      // Small delay before gradient explosion starts
      const timeoutId = setTimeout(() => setShowGradientExplosion(true), 100)
      return () => clearTimeout(timeoutId)
    }
    if (!isReadyToOpen && !isOpening && !isResult) {
      setShowGradientExplosion(false)
    }
  }, [isReadyToOpen, isOpening, isResult, showGradientExplosion])

  return (
    <motion.section className="screen mystery-screen" {...SCREEN_TRANSITION}>
      <div className="status-bar status-bar-dark">
        <span>8:51</span>
        <div className="status-icons">
          <span className="signal-bars signal-bars-dark" />
          <span className="wifi-icon wifi-icon-dark" />
          <span className="battery-pill battery-pill-dark">58</span>
        </div>
      </div>

      <motion.div
        className={`mystery-success-fill ${isReadyToOpen || isOpening ? 'is-unlock' : ''}`}
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
        style={{
          transformOrigin: 'center center',
        }}
      />

      <div className="mystery-content">
        <div className="mystery-header">
          <img className="tails-sheet-logo" src={ASSETS.logo} alt="wildcard" />
          {!isResult && (
            <div className="mystery-purchase-card mystery-purchase-card-header">
              <div className="mystery-purchase-amount">$141.20 at Nike</div>
              <div className="mystery-purchase-method">VISA 2048</div>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {isResult ? (
            <motion.div
              key="mystery-result-copy"
              className="mystery-copy-block"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
            >
              <span className="mystery-tier-badge mystery-tier-super-rare mystery-result-badge">SUPER RARE</span>
              <div className="mystery-title">FREE!</div>
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
                <div className="mystery-offer-copyline">Unlocking ...</div>
              ) : isReadyToOpen ? (
                <div className="mystery-offer-copyline mystery-offer-copyline-open">
                  Tap your box
                  <br />
                  to open
                </div>
              ) : (
                <>
                  <div className="mystery-offer-kicker">Mystery Box</div>
                  <div className="mystery-offer-headline">
                    WIN A REFUND.
                    <br />
                    CASH BACK.
                    <br />
                    OR NOTHING.
                  </div>
                </>
              )}
              <div className="mystery-subcopy-slot">
                {!isOpening && !isReadyToOpen ? (
                  <div className="mystery-offer-subcopy-placeholder" aria-hidden="true" />
                ) : (
                  <div className="mystery-offer-subcopy-placeholder" aria-hidden="true" />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                      'drop-shadow(0 18px 24px rgba(132, 255, 183, 0.18))',
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

        <div className="mystery-rotator-slot">
          {isResult ? (
            <motion.div
              className="mystery-win-refund"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              You won a
              <br />
              FULL REFUND!
            </motion.div>
          ) : !isReadyToOpen && !isOpening ? (
            <div className="mystery-rotator">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${activeMessage.tier}-${activeMessage.value}`}
                  className="mystery-rotator-text"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className={`mystery-tier-badge mystery-tier-${activeMessage.tier.toLowerCase().replace(/\s+/g, '-')}`}>
                    {activeMessage.tier}
                  </span>
                  <span className="mystery-tier-value">{activeMessage.value}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <div className="mystery-rotator-placeholder" aria-hidden="true" />
          )}
        </div>

        <div className="mystery-bottom-cta">
          {isOffer ? (
            <button type="button" className="mystery-primary-button" onClick={onBuyBox}>
              $1 to Unlock
            </button>
          ) : isResult ? (
            <button type="button" className="mystery-claim-button" onClick={onClaim}>
              CASH OUT $141.20
            </button>
          ) : (
            <div className="mystery-bottom-cta-placeholder" aria-hidden="true" />
          )}
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
              <div className="mystery-pay-title">Pay $1.00</div>
              <div className="mystery-pay-merchant">Mystery Box for Sneakers</div>
              <div className="mystery-pay-row">
                <span>Reward box</span>
                <strong>$1.00</strong>
              </div>
              <div className="mystery-pay-row">
                <span>Card</span>
                <strong>Visa Debit</strong>
              </div>
              <motion.button
                type="button"
                className={`mystery-pay-button ${isCheckoutProcessing ? 'is-success' : ''}`}
                onClick={onConfirmCheckout}
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
