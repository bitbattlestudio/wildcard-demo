import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ASSETS, SCREEN_TRANSITION } from './constants'
import wordmarkBlackLite from '../wildcard-master-assets/wordmark-black-lite.png'
import wildcardAsteriskBlack from '../wildcard-master-assets/wildcard-asterisk-black.png'
import blurGradientWide from '../wildcard-master-assets/blur-gradient-wide.jpg'

export default function PaymentScreen({
  phase,
  onPay,
  onOpenNotification,
  itemSubtitle = 'Morning Roast · $4.00',
  processingSubtitle = 'Authorizing with wildcard',
  notificationTitle = 'Flip your purchase!',
  notificationCopy = 'Tap to get your coffee for free',
}) {
  const isIntro = phase === 'payment_card_intro'
  const isProcessing = phase === 'payment_processing'
  const isSuccess = phase === 'payment_success'
  const isNotification = phase === 'payment_notification'
  const isConfirmed = isSuccess || isNotification

  return (
    <motion.section className="screen payment-screen" {...SCREEN_TRANSITION}>
      <div className="status-bar">
        <span>8:51</span>
        <div className="status-icons">
          <span className="signal-bars" />
          <span className="wifi-icon" />
          <span className="battery-pill">58</span>
        </div>
      </div>

      <button type="button" className="payment-center payment-center-button" onClick={isIntro ? onPay : undefined} disabled={!isIntro}>
        <div className="reader-indicator">
          <AnimatePresence mode="wait" initial={false}>
            {isConfirmed ? (
              <motion.div
                key="reader-success"
                className="reader-ring payment-success-circle-inline"
                initial={{ opacity: 0, scale: 0.88, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotate: 8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <svg viewBox="0 0 44 44" aria-hidden="true">
                  <path className="payment-success-check" d="M12 23.5L19 30.5L33 15.5" />
                </svg>
              </motion.div>
            ) : (
              <motion.div
                key="reader-idle"
                className="reader-ring"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="reader-phone" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="reader-title">{isConfirmed ? 'Done' : isProcessing ? 'Processing...' : 'Hold Near Reader'}</div>
        <div className="reader-subtitle">{isConfirmed ? 'Payment complete' : isProcessing ? processingSubtitle : itemSubtitle}</div>
      </button>

      <div className="wallet-stack">
        <div className="wallet-card wallet-card-back wallet-card-top" />
        <div className="wallet-card wallet-card-back wallet-card-mid" />
        <div className="wallet-card wallet-card-back wallet-card-low" />
        <div className="wallet-card wallet-card-front">
          <div className="wallet-brand">NOPA</div>
          <div className="wallet-balance">
            <span>BALANCE</span>
            <strong>$100</strong>
          </div>
        </div>
      </div>

      <motion.div
        className="payment-card"
        initial={{ y: 420, scale: 0.96, opacity: 0.98 }}
        animate={{
          y: 0,
          scale: isProcessing ? 0.985 : 1,
          opacity: 1,
        }}
        transition={{ type: 'spring', stiffness: 155, damping: 22, mass: 1 }}
      >
        <div className="generic-card wildcard-credit-card" style={{ '--wildcard-card-bg': `url(${blurGradientWide})` }}>
          <img className="wildcard-card-brand" src={wordmarkBlackLite} alt="wildcard" />
          <img className="wildcard-card-asterisk" src={wildcardAsteriskBlack} alt="" aria-hidden="true" />
          <div className="wildcard-card-chip" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="generic-card-number wildcard-card-number">•••• 2048</div>
          <div className="generic-card-visa wildcard-card-network">
            <span>CREDIT</span>
            <strong>VISA</strong>
          </div>
        </div>
      </motion.div>

      {isProcessing && (
        <motion.div
          className="processing-panel"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="processing-dot" />
          <div className="processing-text">Face ID confirmed</div>
        </motion.div>
      )}

      {isNotification && (
        <motion.button
          type="button"
          className="payment-notification"
          onClick={onOpenNotification}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="payment-notification-row">
            <img src={ASSETS.appIcon} alt="" className="payment-notification-icon" />
            <div className="payment-notification-texts">
              <div className="payment-notification-title">{notificationTitle}</div>
              <div className="payment-notification-copy">{notificationCopy}</div>
            </div>
          </div>
        </motion.button>
      )}
    </motion.section>
  )
}
