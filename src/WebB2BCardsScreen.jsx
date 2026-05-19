import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ASSETS, SCREEN_TRANSITION, WebB2BCardsState } from './constants'

const PRIZE_CARDS = [
  { id: 'legendary', tier: 'LEGENDARY', pct: '5%', value: 'Full Refund', className: 'web-cards-card-legendary' },
  { id: 'gold', tier: 'GOLD', pct: '20%', value: '20% Discount', className: 'web-cards-card-gold' },
  { id: 'silver', tier: 'SILVER', pct: '30%', value: '$20 Gift Card', className: 'web-cards-card-silver' },
  { id: 'common', tier: 'COMMON', pct: '45%', value: 'W*LD Points', className: 'web-cards-card-common' },
]

const OFFER_PRIZES = [
  { tier: 'LEGENDARY', pct: '5%', value: 'Full Refund', cls: 'web-prize-legendary', rarityCls: 'web-rarity-legendary' },
  { tier: 'GOLD', pct: '20%', value: '20% Discount', cls: 'web-prize-gold', rarityCls: 'web-rarity-gold' },
  { tier: 'SILVER', pct: '30%', value: '$20 Gift Card', cls: 'web-prize-silver', rarityCls: 'web-rarity-silver' },
  { tier: 'COMMON', pct: '45%', value: 'W*LD Points', cls: 'web-prize-common', rarityCls: 'web-rarity-common' },
]

function shuffleIndices(list) {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function RewardCard({ face, isBack, onClick, disabled, isSelected, compact = false }) {
  const displayValue = face.id === 'legendary' || face.className?.includes('legendary-win') ? 'FREE' : face.value

  return (
    <motion.button
      type="button"
      className={`web-cards-pick-card ${compact ? 'is-compact' : ''} ${isSelected ? 'is-selected' : ''}`}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.98 }}
      whileHover={
        disabled
          ? {}
          : {
              rotate: [0, -1.8, 1.6, -1.2, 0],
              y: [0, -2, 0],
            }
      }
      animate={{ rotateY: isBack ? 0 : 180 }}
      transition={{
        rotateY: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        rotate: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
        y: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      <span
        className="web-cards-pick-card-face web-cards-pick-card-back"
        style={{ backgroundImage: `url(${ASSETS.tailsCardBack})` }}
        aria-label="Card back"
      />
      <span className={`web-cards-pick-card-face web-cards-pick-card-front ${face.className}`}>
        <span className="web-cards-tier">
          {face.tier} <span className="web-cards-tier-pct">{face.pct}</span>
        </span>
        <span className="web-cards-value">{displayValue}</span>
      </span>
    </motion.button>
  )
}

function OfferStackCard({ face, stackIndex }) {
  const isTop = stackIndex === 0
  return (
    <motion.div
      className={`web-cards-orbit-card ${face.className} ${isTop ? 'is-top' : 'is-back'}`}
      animate={{
        y: stackIndex * 8,
        x: stackIndex * 2,
        rotate: stackIndex === 0 ? -1 : stackIndex === 1 ? 3 : stackIndex === 2 ? -3 : 2,
        scale: 1 - stackIndex * 0.02,
        opacity: 1 - stackIndex * 0.08,
      }}
      transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
      style={{ zIndex: 10 - stackIndex }}
    >
      {isTop ? (
        <>
          <span className="web-cards-tier">
            {face.tier} <span className="web-cards-tier-pct">{face.pct}</span>
          </span>
          <span className="web-cards-value">{face.value}</span>
        </>
      ) : (
        <span className="web-cards-back-mark">wildcard</span>
      )}
    </motion.div>
  )
}

export default function WebB2BCardsScreen({
  phase = WebB2BCardsState.checkout,
  onPay,
  onDrawCards,
  onConfirmPayment,
  onSelectCard,
  onClaim,
}) {
  const isCheckout = phase === WebB2BCardsState.checkout
  const isProcessing = phase === WebB2BCardsState.processing
  const isConfirmed = phase === WebB2BCardsState.confirmed
  const isCardsCheckout = phase === WebB2BCardsState.cardsCheckout
  const isCardsProcessing = phase === WebB2BCardsState.cardsProcessing
  const isReadyToPick = phase === WebB2BCardsState.readyToPick
  const isPicking = phase === WebB2BCardsState.picking
  const isResult = phase === WebB2BCardsState.result

  const isOfferPhase = isConfirmed || isCardsCheckout || isCardsProcessing
  const isRevealPhase = isReadyToPick || isPicking || isResult
  const isPostCheckout = isProcessing || isOfferPhase || isRevealPhase

  const [deckOrder, setDeckOrder] = React.useState([0, 1, 2, 3])
  const [offerStackOrder, setOfferStackOrder] = React.useState([0, 1, 2, 3])
  const [shuffleReady, setShuffleReady] = React.useState(false)
  const [selectedCardId, setSelectedCardId] = React.useState(null)
  const [revealFlipReady, setRevealFlipReady] = React.useState(false)
  const [revealedMissedCardIds, setRevealedMissedCardIds] = React.useState([])
  const selectedIndex = selectedCardId ?? 0

  React.useEffect(() => {
    if (isReadyToPick) {
      setSelectedCardId(null)
      setShuffleReady(false)
      setDeckOrder([0, 1, 2, 3])
      const base = [0, 1, 2, 3]
      const intervalId = window.setInterval(() => {
        setDeckOrder(shuffleIndices(base))
      }, 260)
      const doneId = window.setTimeout(() => {
        window.clearInterval(intervalId)
        setDeckOrder([0, 1, 2, 3])
        setShuffleReady(true)
      }, 1800)
      return () => {
        window.clearInterval(intervalId)
        window.clearTimeout(doneId)
      }
    }
    if (!isPicking && !isResult) {
      setSelectedCardId(null)
      setShuffleReady(false)
    }
    return undefined
  }, [isReadyToPick, isPicking, isResult])

  React.useEffect(() => {
    if (!isOfferPhase) {
      setOfferStackOrder([0, 1, 2, 3])
      return undefined
    }
    const id = window.setInterval(() => {
      setOfferStackOrder((prev) => [...prev.slice(1), prev[0]])
    }, 3600)
    return () => window.clearInterval(id)
  }, [isOfferPhase])

  React.useEffect(() => {
    if (isPicking) {
      setRevealFlipReady(false)
      setRevealedMissedCardIds([])
      const missedCards = deckOrder.filter((id) => id !== selectedIndex)
      const timers = [
        window.setTimeout(() => setRevealedMissedCardIds([missedCards[0]].filter(Boolean)), 260),
        window.setTimeout(() => setRevealedMissedCardIds(missedCards.slice(0, 2)), 690),
        window.setTimeout(() => setRevealedMissedCardIds(missedCards.slice(0, 3)), 1120),
        window.setTimeout(() => setRevealFlipReady(true), 1520),
      ]
      return () => timers.forEach((id) => window.clearTimeout(id))
    }
    if (!isResult) {
      setRevealFlipReady(false)
      setRevealedMissedCardIds([])
    }
    return undefined
  }, [isPicking, isResult, deckOrder, selectedIndex])

  const handleSelect = (cardId) => {
    if (!isReadyToPick || !shuffleReady || selectedCardId !== null) return
    setSelectedCardId(cardId)
    onSelectCard()
  }

  const selectedLegendary = PRIZE_CARDS[0]
  const selectedLegendaryWin = { ...selectedLegendary, className: 'web-cards-card-legendary-win' }
  const nonLegendaryFaces = deckOrder.map((id) => PRIZE_CARDS[id]).filter((c) => c.id !== 'legendary')
  const isShuffling = isReadyToPick && !shuffleReady
  const resultFaces = deckOrder.map((id, cardOrderIndex) => {
    if (id === selectedIndex) return selectedLegendary
    const fallback = PRIZE_CARDS[id]
    return fallback.id === 'legendary' ? nonLegendaryFaces[cardOrderIndex % nonLegendaryFaces.length] : fallback
  })

  return (
    <motion.div className="web-b2b-page web-checkout-page" {...SCREEN_TRANSITION}>
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

      <div className="web-checkout-body">
        <div className="web-checkout-left-col">
          <AnimatePresence mode="wait" initial={false}>
            {isCheckout && (
              <motion.div
                key="cards-checkout-form"
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
                </div>

                <div className="web-form-section">
                  <div className="web-form-section-hd">
                    <h2 className="web-form-section-title">Payment</h2>
                  </div>
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
              </motion.div>
            )}

            {isProcessing && (
              <motion.div
                key="cards-processing"
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

            {isPostCheckout && !isProcessing && (
              <motion.div
                key="cards-post-checkout"
                className="web-post-checkout-col"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
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
                      Your order is confirmed. A shipping email will be sent to <strong>leahmorgan@gmail.com</strong>.
                    </p>
                    <div className="web-confirmed-delivery">📦 Estimated delivery: <strong>Sunday, April 12th</strong></div>
                  </div>
                </motion.div>

                <div className="web-tails-widget web-cards-widget">
                  <motion.div
                    className="web-cards-widget-fill is-picking"
                    initial={false}
                    animate={{
                      opacity: isRevealPhase && !(isPicking && revealFlipReady) && !isResult ? 1 : 0,
                    }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <motion.div
                    className="web-cards-widget-fill is-success"
                    initial={false}
                    animate={{
                      opacity: (isPicking && revealFlipReady) || isResult ? 1 : 0,
                    }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <div className="web-tails-widget-hd">
                    <div className="web-tails-brand">
                      <img className="web-tails-brand-icon" src={ASSETS.appIcon} alt="wildcard" />
                      <span className="web-tails-brand-name">wildcard</span>
                    </div>
                    <span className="web-tails-widget-tag">Rewards Cards</span>
                  </div>

                  <AnimatePresence mode="wait">
                    {isOfferPhase && (
                      <motion.div
                        key="cards-offer"
                        className="web-tails-offer-layout web-cards-offer-layout"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35 }}
                      >
                        <div className="web-tails-offer-left">
                          <div className="web-tails-kicker">DRAW A REWARDS CARD</div>
                          <div className="web-tails-headline">WIN BACK<br /><span className="web-tails-offer-amount">$394.48</span></div>
                          <p className="web-tails-offer-body">
                            Omnilux has partnered with wildcard to give you a chance to win back your purchase.
                          </p>
                          <p className="web-tails-you-can-win">You&apos;re guaranteed to win one of:</p>
                          <div className="web-tails-prize-list">
                            {OFFER_PRIZES.map((item) => (
                              <div key={item.tier} className={`web-tails-prize-row ${item.cls}`}>
                                <span className={`web-tails-prize-rarity ${item.rarityCls}`}>
                                  {item.tier} <span className="web-tails-prize-pct">{item.pct}</span>
                                </span>
                                <span className="web-tails-prize-val">{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="web-cards-orbit-side">
                          <motion.div
                            className="web-cards-orbit-stage"
                            animate={{ y: [0, -6, 0, 6, 0] }}
                            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            {PRIZE_CARDS.map((card, cardIndex) => {
                              const stackIndex = offerStackOrder.indexOf(cardIndex)
                              return (
                                <OfferStackCard
                                  key={card.id}
                                  face={card}
                                  stackIndex={stackIndex}
                                />
                              )
                            })}
                          </motion.div>
                          <button
                            type="button"
                            className="web-tails-unlock-btn"
                            onClick={isConfirmed ? onDrawCards : undefined}
                            disabled={!isConfirmed}
                          >
                            $25 to Draw Cards
                          </button>
                          <p className="web-tails-unlock-sub">Pay once, then pick one of four cards.</p>
                        </div>
                      </motion.div>
                    )}

                    {isRevealPhase && (
                      <motion.div
                        key="cards-reveal"
                        className="web-cards-reveal-layout"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35 }}
                      >
                        <div className="web-cards-reveal-copy">
                          {isResult || (isPicking && revealFlipReady) ? (
                            <>
                              <motion.span
                                className="mystery-tier-badge mystery-tier-legendary mystery-result-badge"
                                initial={{ opacity: 0, y: 10, scale: 0.92 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.55, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                              >
                                LEGENDARY
                              </motion.span>
                              <motion.div
                                className="web-tails-result-headline"
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                              >
                                FULL REFUND OF <span className="web-tails-result-amount">$394.48</span>!
                              </motion.div>
                            </>
                          ) : (
                            <div className="web-cards-prompt-stack">
                              <div className="web-tails-open-prompt web-cards-open-prompt">
                                {!shuffleReady ? 'Shuffling cards…' : isPicking ? 'Revealing…' : 'Choose your card'}
                              </div>
                              {shuffleReady && !isPicking && (
                                <div className="web-cards-open-subprompt">Your freebie is in here ...</div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="web-cards-pick-grid">
                          {deckOrder.map((cardId, cardOrderIndex) => {
                            const shownFace = isResult ? resultFaces[cardOrderIndex] : PRIZE_CARDS[cardId]
                            const isChosen = cardId === selectedIndex
                            const shouldShowFace = isResult
                              || (isPicking
                                ? (isChosen ? revealFlipReady : false)
                                : false)
                            return (
                              <motion.div
                                key={`slot-${cardId}`}
                                className="web-cards-slot"
                                layout
                                animate={{
                                  y: isResult
                                      ? [0, -8, 0]
                                      : [0, -6 + cardOrderIndex * 1.5, 0, 6 - cardOrderIndex * 1.5, 0],
                                  scale: isPicking && isChosen
                                      ? revealFlipReady
                                        ? [1.1, 1.16, 1.08]
                                        : [1, 1.14, 1.08, 1.12]
                                      : isResult && isChosen
                                        ? 1.06
                                        : 1,
                                  opacity: (isPicking || isResult) && !isChosen ? 0.36 : 1,
                                  filter: (isPicking || isResult) && !isChosen ? 'saturate(0.5)' : 'saturate(1)',
                                  rotate: isPicking && isChosen && !revealFlipReady
                                      ? [0, -2, 2, -1, 0]
                                      : 0,
                                }}
                                transition={{
                                  layout: { type: 'spring', stiffness: 240, damping: 24, mass: 0.9 },
                                  y: isResult
                                      ? { duration: 1.2, ease: 'easeInOut' }
                                      : { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
                                  scale: { duration: isPicking ? 1.5 : 0.45, ease: [0.16, 1, 0.3, 1] },
                                  opacity: { duration: 0.45 },
                                  filter: { duration: 0.45 },
                                  rotate: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
                                }}
                              >
                                <RewardCard
                                  face={(isPicking || isResult) && isChosen ? selectedLegendaryWin : shownFace}
                                  isBack={!shouldShowFace}
                                  disabled={!shuffleReady || isPicking || isResult}
                                  onClick={() => handleSelect(cardId)}
                                  isSelected={isChosen && (isPicking || isResult)}
                                />
                              </motion.div>
                            )
                          })}
                        </div>

                        <div className="web-tails-reveal-cta">
                          {isResult && (
                            <motion.button
                              type="button"
                              className="web-tails-claim-btn"
                              onClick={onClaim}
                              initial={{ opacity: 0, y: 10, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.45, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            >
                              REDEEM FULL REFUND
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
          <div className="web-summary-total-row"><span>Total</span><span>$394.48</span></div>
          <div className="web-summary-badges">
            <span className="web-summary-badge">🔒 SSL Secured</span>
            <span className="web-summary-badge">✓ PCI Compliant</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {(isCardsCheckout || isCardsProcessing) && (
          <motion.div
            key="cards-pay-modal"
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
              <div className="web-tails-modal-merchant">Rewards Cards · Omnilux Order</div>

              <div className="web-tails-modal-row"><span>Draw cards</span><strong>$25.00</strong></div>
              <div className="web-tails-modal-row"><span>Card</span><strong>Visa Debit</strong></div>

              <motion.button
                type="button"
                className={`web-tails-modal-btn ${isCardsProcessing ? 'is-success' : ''}`}
                onClick={isCardsCheckout ? onConfirmPayment : undefined}
                disabled={isCardsProcessing}
                animate={isCardsProcessing ? { scale: [1, 1.03, 1] } : {}}
                transition={{ scale: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } }}
              >
                <AnimatePresence mode="wait">
                  {isCardsProcessing ? (
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
    </motion.div>
  )
}
