import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ASSETS, B2BState, SCREEN_TRANSITION } from './constants'

export default function B2BPaymentScreen({ phase, onStartCheckout, onPay }) {
  const isStart = phase === B2BState.start
  const isIntro = phase === B2BState.paymentCardIntro
  const isProcessing = phase === B2BState.paymentProcessing
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  React.useEffect(() => {
    if (isProcessing) {
      setDrawerOpen(true)
      const closeTimer = window.setTimeout(() => setDrawerOpen(false), 700)
      return () => window.clearTimeout(closeTimer)
    }

    if (phase !== B2BState.paymentCardIntro && phase !== B2BState.paymentProcessing) {
      setDrawerOpen(false)
    }
    return undefined
  }, [isProcessing, phase])

  return (
    <motion.section className="screen b2b-payment-screen" {...SCREEN_TRANSITION}>
      <div className="status-bar status-bar-dark">
        <span>8:51</span>
        <div className="status-icons">
          <span className="signal-bars signal-bars-dark" />
          <span className="wifi-icon wifi-icon-dark" />
          <span className="battery-pill battery-pill-dark">58</span>
        </div>
      </div>

      <div className="b2b-checkout-content">
        <div className="b2b-checkout-brand">
          <img
            className="b2b-checkout-brand-logo"
            src={ASSETS.omniluxLogo}
            alt="Omnilux"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
        <div className="b2b-checkout-header">My Cart</div>

        <div className="b2b-product-row">
          <img className="b2b-product-image" src={ASSETS.omniluxProduct} alt="Omnilux Contour Face" />
          <div className="b2b-product-copy">
            <div className="b2b-product-title">Omnilux Contour Face</div>
            <div className="b2b-product-sub">Women&apos;s LED Device</div>
            <div className="b2b-product-sub">Red Light Therapy Mask</div>
            <div className="b2b-product-sub">Rose Quartz</div>
          </div>
        </div>

        <div className="b2b-qty-row">
          <span>Qty 1</span>
          <span>$385.00</span>
        </div>

        <div className="b2b-divider" />

        <div className="b2b-summary-row">
          <span>Subtotal</span>
          <strong>$385.00</strong>
        </div>
        <div className="b2b-summary-row">
          <span>Shipping</span>
          <strong>Standard - Free</strong>
        </div>
        <div className="b2b-summary-row b2b-summary-total">
          <span>Estimated Total</span>
          <strong>$394.48</strong>
        </div>

        <div className="b2b-apple-pay-row">
          <button
            type="button"
            className="b2b-apple-pay-button"
            onClick={() => {
              if (isStart) {
                onStartCheckout()
              }
              setDrawerOpen(true)
            }}
            aria-label="Open Apple Pay"
          >
             Pay
          </button>
          <button type="button" className="b2b-checkout-button">
            Checkout
          </button>
        </div>
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            key="b2b-apple-pay-drawer"
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
                  <div className="mystery-webpay-card-subtitle">Leah Morgan · Los Angeles CA 90024</div>
                </div>
                <div className="mystery-webpay-card-digits">•••• 2048</div>
              </div>

              <div className="mystery-webpay-row">
                <span>Contact</span>
                <strong>Leah Morgan</strong>
              </div>
              <div className="mystery-webpay-row">
                <span>Ship to</span>
                <strong>11 Beverly Glen</strong>
              </div>
              <div className="mystery-webpay-row">
                <span>Pay Omnilux</span>
                <strong>$394.48</strong>
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
    </motion.section>
  )
}
