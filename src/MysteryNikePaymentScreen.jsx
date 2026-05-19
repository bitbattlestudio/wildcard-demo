import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ASSETS, SCREEN_TRANSITION } from './constants'

const DEFAULT_PHASES = {
  intro: 'mystery_payment_card_intro',
  processing: 'mystery_payment_processing',
  notification: 'mystery_payment_notification',
}

export default function MysteryNikePaymentScreen({
  phase,
  onPay,
  onOpenNotification,
  phases = DEFAULT_PHASES,
  notificationTitle = 'Unlock your Mystery Box!',
  notificationCopy = 'Tap to reveal your post-purchase reward',
}) {
  const isIntro = phase === phases.intro
  const isProcessing = phase === phases.processing
  const isNotification = phase === phases.notification
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  React.useEffect(() => {
    if (isProcessing) {
      setDrawerOpen(true)
    }

    if (isNotification) {
      setDrawerOpen(false)
    }
  }, [isProcessing, isNotification])

  return (
    <motion.section className="screen mystery-nike-payment-screen" {...SCREEN_TRANSITION}>
      <img className="mystery-nike-background" src={ASSETS.nikeCheckout} alt="Nike checkout" />

      {isIntro && !drawerOpen && (
        <button type="button" className="mystery-apple-pay-hotspot" onClick={() => setDrawerOpen(true)} aria-label="Open Apple Pay" />
      )}

      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            key="mystery-apple-pay-drawer"
            className="mystery-webpay-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="mystery-webpay-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 170, damping: 24, mass: 1 }}
            >
              <div className="mystery-webpay-header">
                <div className="mystery-webpay-brand">
                  <span className="mystery-webpay-apple"></span>
                  <span>Apple Pay</span>
                </div>
                <button type="button" className="mystery-webpay-close" onClick={() => setDrawerOpen(false)} aria-label="Close">
                  ×
                </button>
              </div>

              <div className="mystery-webpay-card-row">
                <div className="mystery-webpay-card-icon">EB</div>
                <div className="mystery-webpay-card-copy">
                  <div className="mystery-webpay-card-title">Evergreen Bank</div>
                  <div className="mystery-webpay-card-subtitle">Jordan Parker · Portland OR 97205</div>
                </div>
                <div className="mystery-webpay-card-digits">•••• 2048</div>
              </div>

              <div className="mystery-webpay-row">
                <span>Contact</span>
                <strong>Jordan Parker</strong>
              </div>
              <div className="mystery-webpay-row">
                <span>Ship to</span>
                <strong>21 Everett St</strong>
              </div>
              <div className="mystery-webpay-row">
                <span>Pay Nike</span>
                <strong>$141.21</strong>
              </div>

              <button
                type="button"
                className={`mystery-webpay-confirm ${isProcessing ? 'is-success' : ''}`}
                onClick={isIntro ? onPay : undefined}
                disabled={!isIntro}
              >
                {isProcessing ? (
                  <>
                    <span className="mystery-webpay-success-dot">✓</span>
                    <span>Paid</span>
                  </>
                ) : (
                  <>
                    <span className="mystery-webpay-side-icon">↩</span>
                    <span>Confirm with Side Button</span>
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isNotification && (
        <motion.button
          type="button"
          className="payment-notification mystery-payment-notification"
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
