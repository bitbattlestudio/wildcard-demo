import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ASSETS, SCREEN_TRANSITION, TIMINGS } from './constants'
import wordmarkBlackLite from '../wildcard-master-assets/wordmark-black-lite.png'

export default function TailsOfferScreen({ phase, onFlip, onReplay }) {
  const isOffer = phase === 'tails_offer'
  const isFlipping = phase === 'coin_flipping'
  const isFreeResult = phase === 'result'
  const isDoubleResult = phase === 'double_result'
  const isResult = isFreeResult || isDoubleResult
  const [idleRotation, setIdleRotation] = useState(0)
  const [idleTossing, setIdleTossing] = useState(false)

  useEffect(() => {
    if (!isOffer) return undefined

    const triggerIdleFlip = () => {
      setIdleTossing(true)
      setIdleRotation((value) => value + 900)
      window.setTimeout(() => setIdleTossing(false), 2400)
    }

    const firstFlip = setTimeout(() => {
      triggerIdleFlip()
    }, 5200)

    const cycle = setInterval(() => {
      triggerIdleFlip()
    }, 7600)

    return () => {
      clearTimeout(firstFlip)
      clearInterval(cycle)
      setIdleTossing(false)
    }
  }, [isOffer])

  return (
    <motion.section className="screen tails-host-screen" {...SCREEN_TRANSITION}>
      <div className="status-bar status-bar-dark">
        <span>8:51</span>
        <div className="status-icons">
          <span className="signal-bars signal-bars-dark" />
          <span className="wifi-icon wifi-icon-dark" />
          <span className="battery-pill battery-pill-dark">58</span>
        </div>
      </div>

      <div className="tails-dim-stage" />

      <motion.div
        className={`tails-sheet ${isFreeResult ? 'is-success' : ''} ${isDoubleResult ? 'is-double' : ''}`}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 150, damping: 24, mass: 1 }}
      >
        <motion.div
          className={`tails-success-fill ${isDoubleResult ? 'is-double' : ''}`}
          initial={false}
          animate={{ scaleY: isResult ? 1 : 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="tails-sheet-header">
          <img className="tails-sheet-logo" src={wordmarkBlackLite} alt="wildcard" />
          <div className="tails-balance">
            <span className="tails-balance-label">Balance</span>
            <motion.span
              className="tails-balance-value"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              key={isFreeResult ? 'balance-win' : isDoubleResult ? 'balance-double' : 'balance-default'}
              transition={{ duration: 0.35 }}
            >
              {isFreeResult ? '$4' : '$0'}
            </motion.span>
          </div>
        </div>

        <div className="tails-sheet-copy">
          <AnimatePresence mode="wait" initial={false}>
            {isFreeResult ? (
              <motion.div
                key="cashout"
                className="tails-cashout"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="tails-cashout-copy">Connect your bank to cash out!</div>
                <button type="button" className="tails-cashout-button" onClick={onReplay}>
                  GET YOUR WINNINGS
                </button>
              </motion.div>
            ) : isDoubleResult ? (
              <motion.div
                key="double-due"
                className="tails-double-due"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="tails-double-due-kicker">Coin landed on double.</div>
                <div className="tails-double-due-copy">Your $4 coffee is now $8.</div>
                <button type="button" className="tails-cashout-button tails-pay-double-button" onClick={onReplay}>
                  PAY ANOTHER $4
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="offer-copy"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32 }}
              >
                <div className="tails-flip-badge">
                  <span>FLIP YOUR</span>
                  <span>$4 COFFEE?</span>
                </div>
                <div className="tails-outcome-headline">
                  <span>PAY DOUBLE.</span>
                  <span>OR NOTHING.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button type="button" className="coin-hit-area" onClick={onFlip} disabled={!isOffer}>
          <div className={`coin-stage ${isOffer ? 'coin-stage-idle' : ''}`}>
            <motion.div
              className="coin-shell"
              animate={
                isFlipping
                  ? {
                      rotateX: -2160,
                      scale: [1, 1.05, 1],
                    }
                  : isFreeResult
                    ? {
                        rotateX: [0, 3, 0, -3, 0],
                        rotateY: [0, 2, 0, -2, 0],
                        y: [0, -4, 0, 4, 0],
                        scale: [1, 1.01, 1],
                      }
                    : isDoubleResult
                      ? {
                          rotateX: [180, 183, 180, 177, 180],
                          rotateY: [0, 2, 0, -2, 0],
                          y: [0, -4, 0, 4, 0],
                          scale: [1, 1.01, 1],
                        }
                  : {
                      rotateX: idleRotation,
                      y: idleTossing ? [0, -8, -22, -6, 0] : 0,
                      scale: idleTossing ? [1, 1.02, 1.03, 1.01, 1] : 1,
                    }
              }
              transition={
                isFlipping
                  ? {
                      duration: TIMINGS.coinFlipMs / 1000,
                      ease: [0.16, 1, 0.3, 1],
                      times: [0, 0.2, 1],
                    }
                  : isResult
                    ? {
                        duration: 4.2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }
                  : {
                      duration: idleTossing ? 2.35 : 0.45,
                      ease: idleTossing ? [0.2, 0.8, 0.25, 1] : 'linear',
                      times: idleTossing ? [0, 0.3, 0.52, 0.76, 1] : undefined,
                    }
              }
            >
              <div className="coin-face coin-face-front">
                <img src={ASSETS.coin} alt="wildcard coin" className="coin-image" />
                <div className="coin-label">
                  <span className="coin-label-left">FREE</span>
                </div>
              </div>
              <div className="coin-face coin-face-back">
                <img src={ASSETS.coin} alt="" className="coin-image" />
                <div className="coin-label">
                  <span className="coin-label-left">$8</span>
                </div>
              </div>
            </motion.div>
          </div>
        </button>

        <div className="tails-sheet-footer">
          {isFreeResult ? (
            <>
              <motion.div className="tails-win-focus" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                FREE
              </motion.div>
              <div className="tails-win-subtitle">This coffee is on wildcard!</div>
            </>
          ) : isDoubleResult ? (
            <>
              <motion.div className="tails-win-focus tails-double-focus" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                DOUBLE
              </motion.div>
              <div className="tails-win-subtitle">Another $4 is due.</div>
            </>
          ) : (
            <div className="tap-to-flip">{isFlipping ? 'FLIPPING...' : 'TAP TO FLIP'}</div>
          )}
        </div>
      </motion.div>
    </motion.section>
  )
}
