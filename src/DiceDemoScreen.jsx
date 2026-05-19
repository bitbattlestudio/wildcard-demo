import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ASSETS, SCREEN_TRANSITION } from './constants'

const DICE_MESSAGES = [
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

export default function DiceDemoScreen({ phase, messageIndex, onBuyBox, onConfirmCheckout, onOpenBox, onClaim }) {
  const isOffer = phase === 'dice_offer'
  const isCheckout = phase === 'dice_checkout'
  const isCheckoutProcessing = phase === 'dice_checkout_processing'
  const isReadyToOpen = phase === 'dice_ready_to_open'
  const isOpening = phase === 'dice_opening'
  const isResult = phase === 'dice_result'
  const activeMessage = DICE_MESSAGES[messageIndex]

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
        className="mystery-success-fill"
        initial={false}
        animate={{ opacity: isResult ? 1 : 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
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
              key="dice-result-copy"
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
              key="dice-offer-copy"
              className="mystery-copy-block"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
            >
              {isOpening ? (
                <div className="mystery-offer-copyline">Rolling ...</div>
              ) : isReadyToOpen ? (
                <div className="mystery-offer-copyline mystery-offer-copyline-open">
                  Tap to roll
                  <br />
                  the dice
                </div>
              ) : (
                <>
                  <div className="mystery-offer-kicker">Roll the dice</div>
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
                <div className="mystery-offer-subcopy-placeholder" aria-hidden="true" />
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
                    rotateX: [0, 360, 720, 1080],
                    rotateY: [0, -420, -820, -1200],
                    rotateZ: [0, 220, 420, 620],
                    x: [0, 18, -16, 12, 0],
                    y: [0, -16, -8, -20, 0],
                    scale: [1, 1.08, 1.12, 1.02],
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
            <img className="mystery-box-image" src={ASSETS.diceBox} alt="Dice" />
            {isOpening && <div className="mystery-opening-rays" />}
          </motion.button>
          <AnimatePresence>
            {isOpening && (
              <motion.div className="mystery-money-burst" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {MONEY_BURST.map((burst, index) => (
                  <motion.span
                    key={`dice-money-${index}`}
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
                  key={`dice-${activeMessage.tier}-${activeMessage.value}`}
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
              $1 to Roll the Dice
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
            key="dice-checkout"
            className="mystery-pay-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
              <div className="mystery-pay-merchant">Roll the Dice for Sneakers</div>
              <div className="mystery-pay-row">
                <span>Dice roll</span>
                <strong>$1.00</strong>
              </div>
              <div className="mystery-pay-row">
                <span>Card</span>
                <strong>Visa Debit</strong>
              </div>
              <button type="button" className="mystery-pay-button" onClick={onConfirmCheckout} disabled={isCheckoutProcessing}>
                {isCheckoutProcessing ? 'Face ID confirmed' : ' Buy with Apple Pay'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
