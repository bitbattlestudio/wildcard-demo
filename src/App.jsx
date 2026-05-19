import React from 'react'
import { AnimatePresence } from 'framer-motion'
import PhoneFrame from './PhoneFrame'
import StartScreen from './StartScreen'
import MysteryStartScreen from './MysteryStartScreen'
import DiceStartScreen from './DiceStartScreen'
import PaymentScreen from './PaymentScreen'
import MysteryNikePaymentScreen from './MysteryNikePaymentScreen'
import TailsOfferScreen from './TailsOfferScreen'
import MysteryBoxScreen from './MysteryBoxScreen'
import DiceDemoScreen from './DiceDemoScreen'
import B2BPaymentScreen from './B2BPaymentScreen'
import B2BMysteryBoxScreen from './B2BMysteryBoxScreen'
import B2BMysteryBoxNewScreen from './B2BMysteryBoxNewScreen'
import RevenueModelScreen from './RevenueModelScreen'
import PitchDeckScreen from './PitchDeckScreen'
import HowItWorksScreen from './HowItWorksScreen'
import AccountScreen from './AccountScreen'
import WebB2BProductScreen from './WebB2BProductScreen'
import WebB2BCheckoutScreen from './WebB2BCheckoutScreen'
import WebFortuneCookieScreen from './WebFortuneCookieScreen'
import WebB2BMysteryScreen from './WebB2BMysteryScreen'
import WebB2BCardsScreen from './WebB2BCardsScreen'
import WebFortuneScreen from './WebFortuneScreen'
import { ASSETS, B2BState, DemoState, DemoTab, DiceState, FortuneWebState, MysteryState, TIMINGS, WebB2BCardsState, WebB2BState } from './constants'

function usePreloadAssets() {
  // Native stability: do not gate first paint on asset preloading.
  return true
}

const COIN_NEXT_OUTCOME_KEY = 'wildcard.coinFlipNextOutcome'

function readNextCoinOutcome() {
  try {
    return window.localStorage.getItem(COIN_NEXT_OUTCOME_KEY) === DemoState.result
      ? DemoState.result
      : DemoState.doubleResult
  } catch {
    return DemoState.doubleResult
  }
}

function writeNextCoinOutcome(result) {
  const next = result === DemoState.doubleResult ? DemoState.result : DemoState.doubleResult
  try {
    window.localStorage.setItem(COIN_NEXT_OUTCOME_KEY, next)
  } catch {
    // If localStorage is unavailable, the in-memory result still works for the current run.
  }
}

export default function App() {
  const ready = usePreloadAssets()
  const [activeDemo, setActiveDemo] = React.useState(DemoTab.pitchDeck)
  const [state, setState] = React.useState(DemoState.start)
  const [coinResultState, setCoinResultState] = React.useState(DemoState.doubleResult)
  const coinNextOutcomeRef = React.useRef(null)
  const [mysteryState, setMysteryState] = React.useState(MysteryState.start)
  const [diceState, setDiceState] = React.useState(DiceState.start)
  const [b2bOldState, setB2bOldState] = React.useState(B2BState.start)
  const [b2bNewState, setB2bNewState] = React.useState(B2BState.start)
  const [webB2bState, setWebB2bState] = React.useState(WebB2BState.product)
  const [fortuneCookieWebState, setFortuneCookieWebState] = React.useState(WebB2BState.product)
  const [webB2bCardsState, setWebB2bCardsState] = React.useState(WebB2BCardsState.product)
  const [webB2bMessageIndex, setWebB2bMessageIndex] = React.useState(0)
  const [fortuneCookieMessageIndex, setFortuneCookieMessageIndex] = React.useState(0)
  const [fortuneWebState, setFortuneWebState] = React.useState(FortuneWebState.product)
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [mysteryMessageIndex, setMysteryMessageIndex] = React.useState(0)
  const [diceMessageIndex, setDiceMessageIndex] = React.useState(0)
  const [b2bNewMessageIndex, setB2bNewMessageIndex] = React.useState(0)

  const isLandingScreen =
    (activeDemo === DemoTab.mobile && state === DemoState.start) ||
    (activeDemo === DemoTab.mystery && mysteryState === MysteryState.start) ||
    (activeDemo === DemoTab.dice && diceState === DiceState.start) ||
    (activeDemo === DemoTab.b2bOld && b2bOldState === B2BState.start) ||
    (activeDemo === DemoTab.b2bNew && b2bNewState === B2BState.start) ||
    (activeDemo === DemoTab.webB2b && webB2bState === WebB2BState.product) ||
    (activeDemo === DemoTab.fortuneCookieWeb && fortuneCookieWebState === WebB2BState.product) ||
    (activeDemo === DemoTab.webB2bCards && webB2bCardsState === WebB2BCardsState.product) ||
    (activeDemo === DemoTab.fortuneWeb && fortuneWebState === FortuneWebState.product)

  React.useEffect(() => {
    let timeoutId

    if (activeDemo === DemoTab.mobile && state === DemoState.paymentProcessing) {
      timeoutId = window.setTimeout(() => setState(DemoState.paymentSuccess), TIMINGS.processingMs)
    }

    if (activeDemo === DemoTab.mobile && state === DemoState.paymentSuccess) {
      timeoutId = window.setTimeout(() => setState(DemoState.paymentNotification), TIMINGS.paymentSuccessMs)
    }

    if (activeDemo === DemoTab.mobile && state === DemoState.coinFlipping) {
      timeoutId = window.setTimeout(() => setState(coinResultState), TIMINGS.coinFlipMs)
    }

    return () => window.clearTimeout(timeoutId)
  }, [activeDemo, state, coinResultState])

  React.useEffect(() => {
    let timeoutId

    if (activeDemo === DemoTab.mystery && mysteryState === MysteryState.paymentProcessing) {
      timeoutId = window.setTimeout(() => setMysteryState(MysteryState.paymentNotification), TIMINGS.processingMs)
    }

    if (activeDemo === DemoTab.mystery && mysteryState === MysteryState.checkoutProcessing) {
      timeoutId = window.setTimeout(() => setMysteryState(MysteryState.readyToOpen), TIMINGS.processingMs)
    }

    if (activeDemo === DemoTab.mystery && mysteryState === MysteryState.opening) {
      timeoutId = window.setTimeout(() => setMysteryState(MysteryState.result), TIMINGS.mysteryOpeningMs)
    }

    return () => window.clearTimeout(timeoutId)
  }, [activeDemo, mysteryState])

  React.useEffect(() => {
    let timeoutId

    if (activeDemo === DemoTab.dice && diceState === DiceState.paymentProcessing) {
      timeoutId = window.setTimeout(() => setDiceState(DiceState.paymentNotification), TIMINGS.processingMs)
    }

    if (activeDemo === DemoTab.dice && diceState === DiceState.checkoutProcessing) {
      timeoutId = window.setTimeout(() => setDiceState(DiceState.readyToOpen), TIMINGS.processingMs)
    }

    if (activeDemo === DemoTab.dice && diceState === DiceState.opening) {
      timeoutId = window.setTimeout(() => setDiceState(DiceState.result), TIMINGS.mysteryOpeningMs)
    }

    return () => window.clearTimeout(timeoutId)
  }, [activeDemo, diceState])

  React.useEffect(() => {
    if (activeDemo !== DemoTab.b2bNew) {
      return undefined
    }

    if (
      b2bNewState === B2BState.offer ||
      b2bNewState === B2BState.checkout ||
      b2bNewState === B2BState.checkoutProcessing ||
      b2bNewState === B2BState.readyToOpen
    ) {
      const intervalId = window.setInterval(() => {
        setB2bNewMessageIndex((index) => (index + 1) % 4)
      }, 3000)

      return () => window.clearInterval(intervalId)
    }

    return undefined
  }, [activeDemo, b2bNewState])

  React.useEffect(() => {
    let timeoutId

    if (activeDemo === DemoTab.b2bOld && b2bOldState === B2BState.paymentProcessing) {
      timeoutId = window.setTimeout(() => setB2bOldState(B2BState.offer), TIMINGS.processingMs)
    }

    if (activeDemo === DemoTab.b2bOld && b2bOldState === B2BState.checkoutProcessing) {
      timeoutId = window.setTimeout(() => setB2bOldState(B2BState.readyToOpen), TIMINGS.processingMs)
    }

    if (activeDemo === DemoTab.b2bOld && b2bOldState === B2BState.opening) {
      timeoutId = window.setTimeout(() => setB2bOldState(B2BState.result), TIMINGS.mysteryOpeningMs)
    }

    return () => window.clearTimeout(timeoutId)
  }, [activeDemo, b2bOldState])

  React.useEffect(() => {
    let timeoutId

    if (activeDemo === DemoTab.b2bNew && b2bNewState === B2BState.paymentProcessing) {
      timeoutId = window.setTimeout(() => setB2bNewState(B2BState.offer), TIMINGS.processingMs)
    }

    if (activeDemo === DemoTab.b2bNew && b2bNewState === B2BState.checkoutProcessing) {
      timeoutId = window.setTimeout(() => setB2bNewState(B2BState.readyToOpen), TIMINGS.processingMs)
    }

    if (activeDemo === DemoTab.b2bNew && b2bNewState === B2BState.opening) {
      timeoutId = window.setTimeout(() => setB2bNewState(B2BState.result), Math.round(TIMINGS.mysteryOpeningMs * 1.4))
    }

    return () => window.clearTimeout(timeoutId)
  }, [activeDemo, b2bNewState])

  React.useEffect(() => {
    if (activeDemo !== DemoTab.mystery) {
      return undefined
    }

    if (mysteryState === MysteryState.offer || mysteryState === MysteryState.checkout || mysteryState === MysteryState.checkoutProcessing) {
      const intervalId = window.setInterval(() => {
        setMysteryMessageIndex((index) => (index + 1) % 4)
      }, 3000)

      return () => window.clearInterval(intervalId)
    }

    return undefined
  }, [activeDemo, mysteryState])

  React.useEffect(() => {
    if (activeDemo !== DemoTab.dice) {
      return undefined
    }

    if (diceState === DiceState.offer || diceState === DiceState.checkout || diceState === DiceState.checkoutProcessing) {
      const intervalId = window.setInterval(() => {
        setDiceMessageIndex((index) => (index + 1) % 4)
      }, 3000)

      return () => window.clearInterval(intervalId)
    }

    return undefined
  }, [activeDemo, diceState])

  // Web B2B — auto-advance timed states
  React.useEffect(() => {
    let timeoutId
    if (activeDemo === DemoTab.webB2b && webB2bState === WebB2BState.processing) {
      timeoutId = window.setTimeout(() => setWebB2bState(WebB2BState.confirmed), TIMINGS.processingMs)
    }
    if (activeDemo === DemoTab.webB2b && webB2bState === WebB2BState.mysteryProcessing) {
      timeoutId = window.setTimeout(() => setWebB2bState(WebB2BState.readyToOpen), TIMINGS.processingMs)
    }
    if (activeDemo === DemoTab.webB2b && webB2bState === WebB2BState.opening) {
      timeoutId = window.setTimeout(() => setWebB2bState(WebB2BState.result), Math.round(TIMINGS.mysteryOpeningMs * 1.4))
    }
    return () => window.clearTimeout(timeoutId)
  }, [activeDemo, webB2bState])

  // Fortune Cookie Web — auto-advance timed states
  React.useEffect(() => {
    let timeoutId
    if (activeDemo === DemoTab.fortuneCookieWeb && fortuneCookieWebState === WebB2BState.processing) {
      timeoutId = window.setTimeout(() => setFortuneCookieWebState(WebB2BState.confirmed), TIMINGS.processingMs)
    }
    if (activeDemo === DemoTab.fortuneCookieWeb && fortuneCookieWebState === WebB2BState.mysteryProcessing) {
      timeoutId = window.setTimeout(() => setFortuneCookieWebState(WebB2BState.readyToOpen), TIMINGS.processingMs)
    }
    if (activeDemo === DemoTab.fortuneCookieWeb && fortuneCookieWebState === WebB2BState.opening) {
      timeoutId = window.setTimeout(() => setFortuneCookieWebState(WebB2BState.result), Math.round(TIMINGS.mysteryOpeningMs * 1.4))
    }
    return () => window.clearTimeout(timeoutId)
  }, [activeDemo, fortuneCookieWebState])

  // Web B2B Cards — auto-advance timed states
  React.useEffect(() => {
    let timeoutId
    if (activeDemo === DemoTab.webB2bCards && webB2bCardsState === WebB2BCardsState.processing) {
      timeoutId = window.setTimeout(() => setWebB2bCardsState(WebB2BCardsState.confirmed), TIMINGS.processingMs)
    }
    if (activeDemo === DemoTab.webB2bCards && webB2bCardsState === WebB2BCardsState.cardsProcessing) {
      timeoutId = window.setTimeout(() => setWebB2bCardsState(WebB2BCardsState.readyToPick), TIMINGS.processingMs)
    }
    if (activeDemo === DemoTab.webB2bCards && webB2bCardsState === WebB2BCardsState.picking) {
      timeoutId = window.setTimeout(() => setWebB2bCardsState(WebB2BCardsState.result), 2200)
    }
    return () => window.clearTimeout(timeoutId)
  }, [activeDemo, webB2bCardsState])

  // Fortune Web — auto-advance timed states
  React.useEffect(() => {
    let timeoutId
    if (activeDemo === DemoTab.fortuneWeb && fortuneWebState === FortuneWebState.processing) {
      timeoutId = window.setTimeout(() => setFortuneWebState(FortuneWebState.confirmed), TIMINGS.processingMs)
    }
    if (activeDemo === DemoTab.fortuneWeb && fortuneWebState === FortuneWebState.fortuneProcessing) {
      timeoutId = window.setTimeout(() => setFortuneWebState(FortuneWebState.pickColor), TIMINGS.processingMs)
    }
    if (activeDemo === DemoTab.fortuneWeb && fortuneWebState === FortuneWebState.animatingColor) {
      timeoutId = window.setTimeout(() => setFortuneWebState(FortuneWebState.pickNumber), 2500)
    }
    if (activeDemo === DemoTab.fortuneWeb && fortuneWebState === FortuneWebState.animatingNumber) {
      timeoutId = window.setTimeout(() => setFortuneWebState(FortuneWebState.pickFlap), 2000)
    }
    return () => window.clearTimeout(timeoutId)
  }, [activeDemo, fortuneWebState])

  // Web B2B — rotate message index during mystery phases
  React.useEffect(() => {
    if (activeDemo !== DemoTab.webB2b) return undefined
    const activeStates = [WebB2BState.confirmed, WebB2BState.mysteryCheckout, WebB2BState.mysteryProcessing, WebB2BState.readyToOpen]
    if (activeStates.includes(webB2bState)) {
      const id = window.setInterval(() => setWebB2bMessageIndex((i) => (i + 1) % 4), 3000)
      return () => window.clearInterval(id)
    }
    return undefined
  }, [activeDemo, webB2bState])

  // Fortune Cookie Web — rotate message index during reward phases
  React.useEffect(() => {
    if (activeDemo !== DemoTab.fortuneCookieWeb) return undefined
    const activeStates = [WebB2BState.confirmed, WebB2BState.mysteryCheckout, WebB2BState.mysteryProcessing, WebB2BState.readyToOpen]
    if (activeStates.includes(fortuneCookieWebState)) {
      const id = window.setInterval(() => setFortuneCookieMessageIndex((i) => (i + 1) % 4), 3000)
      return () => window.clearInterval(id)
    }
    return undefined
  }, [activeDemo, fortuneCookieWebState])

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth <= 520 && !isLandingScreen && sidebarOpen) {
      setSidebarOpen(false)
    }
  }, [isLandingScreen, sidebarOpen])

  const switchDemo = (demo) => {
    if (demo === DemoTab.mobile) {
      setState(DemoState.start)
    }

    if (demo === DemoTab.mystery) {
      setMysteryState(MysteryState.start)
      setMysteryMessageIndex(0)
    }

    if (demo === DemoTab.dice) {
      setDiceState(DiceState.start)
      setDiceMessageIndex(0)
    }

    if (demo === DemoTab.b2bOld) {
      setB2bOldState(B2BState.start)
    }

    if (demo === DemoTab.b2bNew) {
      setB2bNewState(B2BState.start)
      setB2bNewMessageIndex(0)
    }

    if (demo === DemoTab.webB2b) {
      setWebB2bState(WebB2BState.product)
      setWebB2bMessageIndex(0)
    }
    if (demo === DemoTab.fortuneCookieWeb) {
      setFortuneCookieWebState(WebB2BState.product)
      setFortuneCookieMessageIndex(0)
    }

    if (demo === DemoTab.webB2bCards) {
      setWebB2bCardsState(WebB2BCardsState.product)
    }

    if (demo === DemoTab.fortuneWeb) {
      setFortuneWebState(FortuneWebState.product)
    }

    setActiveDemo(demo)
    setSidebarOpen(false)
  }

  return (
    <main className={`app ${ready ? 'is-ready' : ''}`}>
      <div className="bg-glow bg-glow-top" />
      <div className="bg-glow bg-glow-bottom" />

      <div className={`app-shell ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <button
          type="button"
          className={`sidebar-toggle ${isLandingScreen ? '' : 'mobile-toggle-disabled'}`}
          aria-expanded={sidebarOpen}
          aria-controls="demo-sidebar"
          aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
          onClick={() => setSidebarOpen((open) => !open)}
        >
          <img className="sidebar-toggle-icon" src={ASSETS.appIcon} alt="" />
        </button>

        <aside id="demo-sidebar" className="app-sidebar" aria-label="Demo navigation">
          <div className="sidebar-panel">
            <div className="sidebar-brand">
              <img className="sidebar-brand-icon" src={ASSETS.appIcon} alt="wildcard" />
              <div>
                <div className="sidebar-eyebrow">Project</div>
                <div className="sidebar-title">wildcard demos</div>
              </div>
            </div>

            <nav className="sidebar-nav">
              <button
                type="button"
                className={`sidebar-nav-item ${activeDemo === DemoTab.pitchDeck ? 'is-active' : 'is-idle'}`}
                onClick={() => switchDemo(DemoTab.pitchDeck)}
              >
                <span className="sidebar-nav-label">BRAND DECK</span>
                <span className="sidebar-nav-meta">Slides</span>
              </button>
              <button
                type="button"
                className={`sidebar-nav-item ${activeDemo === DemoTab.mobile ? 'is-active' : 'is-idle'}`}
                onClick={() => switchDemo(DemoTab.mobile)}
              >
                <span className="sidebar-nav-label">FLIP</span>
                <span className="sidebar-nav-meta">Live demo</span>
              </button>
              <button
                type="button"
                className={`sidebar-nav-item ${activeDemo === DemoTab.b2bNew ? 'is-active' : 'is-idle'}`}
                onClick={() => switchDemo(DemoTab.b2bNew)}
              >
                <span className="sidebar-nav-label">MYSTERY BOX MOBILE</span>
                <span className="sidebar-nav-meta">Updated flow</span>
              </button>
              <button
                type="button"
                className={`sidebar-nav-item ${activeDemo === DemoTab.webB2b ? 'is-active' : 'is-idle'}`}
                onClick={() => switchDemo(DemoTab.webB2b)}
              >
                <span className="sidebar-nav-label">MYSTERY BOX WEB</span>
                <span className="sidebar-nav-meta">Desktop flow</span>
              </button>
              <button
                type="button"
                className={`sidebar-nav-item ${activeDemo === DemoTab.webB2bCards ? 'is-active' : 'is-idle'}`}
                onClick={() => switchDemo(DemoTab.webB2bCards)}
              >
                <span className="sidebar-nav-label">WEB B2B CARDS</span>
                <span className="sidebar-nav-meta">Card draw flow</span>
              </button>
              <button
                type="button"
                className={`sidebar-nav-item ${activeDemo === DemoTab.fortuneCookieWeb ? 'is-active' : 'is-idle'}`}
                onClick={() => switchDemo(DemoTab.fortuneCookieWeb)}
              >
                <span className="sidebar-nav-label">FORTUNE COOKIE</span>
                <span className="sidebar-nav-meta">Desktop flow</span>
              </button>
            </nav>
          </div>
        </aside>

        {sidebarOpen && isLandingScreen && (
          <button type="button" className="sidebar-scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />
        )}

        <div className={`demo ${activeDemo === DemoTab.revenue || activeDemo === DemoTab.howItWorks || activeDemo === DemoTab.webB2b || activeDemo === DemoTab.fortuneCookieWeb || activeDemo === DemoTab.webB2bCards || activeDemo === DemoTab.fortuneWeb || activeDemo === DemoTab.pitchDeck ? 'demo-revenue' : ''}`}>
          {activeDemo === DemoTab.revenue ? (
            <RevenueModelScreen />
          ) : activeDemo === DemoTab.pitchDeck ? (
            <PitchDeckScreen />
          ) : activeDemo === DemoTab.howItWorks ? (
            <HowItWorksScreen />
          ) : activeDemo === DemoTab.webB2b ? (
            <div className="web-b2b-viewport">
              <AnimatePresence mode="wait" initial={false}>
                {webB2bState === WebB2BState.product ? (
                  <WebB2BProductScreen
                    key="web-product"
                    onNext={() => setWebB2bState(WebB2BState.checkout)}
                  />
                ) : (
                  // Stable key — right column never remounts, left column animates internally
                  <WebB2BCheckoutScreen
                    key="web-checkout"
                    phase={webB2bState}
                    onPay={() => setWebB2bState(WebB2BState.processing)}
                    onUnlock={() => setWebB2bState(WebB2BState.mysteryCheckout)}
                    onConfirmPayment={() => setWebB2bState(WebB2BState.mysteryProcessing)}
                    onOpenBox={() => setWebB2bState(WebB2BState.opening)}
                    onClaim={() => setWebB2bState(WebB2BState.product)}
                  />
                )}
              </AnimatePresence>
            </div>
          ) : activeDemo === DemoTab.fortuneCookieWeb ? (
            <div className="web-b2b-viewport">
              <AnimatePresence mode="wait" initial={false}>
                {fortuneCookieWebState === WebB2BState.product ? (
                  <WebB2BProductScreen
                    key="fortune-cookie-product"
                    onNext={() => setFortuneCookieWebState(WebB2BState.checkout)}
                  />
                ) : (
                  <WebFortuneCookieScreen
                    key="fortune-cookie-checkout"
                    phase={fortuneCookieWebState}
                    messageIndex={fortuneCookieMessageIndex}
                    onPay={() => setFortuneCookieWebState(WebB2BState.processing)}
                    onUnlock={() => setFortuneCookieWebState(WebB2BState.mysteryCheckout)}
                    onConfirmPayment={() => setFortuneCookieWebState(WebB2BState.mysteryProcessing)}
                    onOpenBox={() => setFortuneCookieWebState(WebB2BState.opening)}
                    onClaim={() => setFortuneCookieWebState(WebB2BState.product)}
                  />
                )}
              </AnimatePresence>
            </div>
          ) : activeDemo === DemoTab.webB2bCards ? (
            <div className="web-b2b-viewport">
              <AnimatePresence mode="wait" initial={false}>
                {webB2bCardsState === WebB2BCardsState.product ? (
                  <WebB2BProductScreen
                    key="web-cards-product"
                    onNext={() => setWebB2bCardsState(WebB2BCardsState.checkout)}
                  />
                ) : (
                  <WebB2BCardsScreen
                    key="web-cards-checkout"
                    phase={webB2bCardsState}
                    onPay={() => setWebB2bCardsState(WebB2BCardsState.processing)}
                    onDrawCards={() => setWebB2bCardsState(WebB2BCardsState.cardsCheckout)}
                    onConfirmPayment={() => setWebB2bCardsState(WebB2BCardsState.cardsProcessing)}
                    onSelectCard={() => setWebB2bCardsState(WebB2BCardsState.picking)}
                    onClaim={() => setWebB2bCardsState(WebB2BCardsState.product)}
                  />
                )}
              </AnimatePresence>
            </div>
          ) : activeDemo === DemoTab.fortuneWeb ? (
            <div className="web-b2b-viewport">
              <AnimatePresence mode="wait" initial={false}>
                {fortuneWebState === FortuneWebState.product ? (
                  <WebB2BProductScreen
                    key="fortune-product"
                    onNext={() => setFortuneWebState(FortuneWebState.checkout)}
                  />
                ) : (
                  <WebFortuneScreen
                    key="fortune-checkout"
                    phase={fortuneWebState}
                    onPay={() => setFortuneWebState(FortuneWebState.processing)}
                    onUnlock={() => setFortuneWebState(FortuneWebState.fortuneCheckout)}
                    onConfirmPayment={() => setFortuneWebState(FortuneWebState.fortuneProcessing)}
                    onPickColor={() => setFortuneWebState(FortuneWebState.animatingColor)}
                    onPickNumber={() => setFortuneWebState(FortuneWebState.animatingNumber)}
                    onPickFlap={() => setFortuneWebState(FortuneWebState.result)}
                    onClaim={() => setFortuneWebState(FortuneWebState.product)}
                  />
                )}
              </AnimatePresence>
            </div>
          ) : (
            <PhoneFrame>
              <AnimatePresence mode="wait" initial={false}>
              {activeDemo === DemoTab.mobile && state === DemoState.start && (
                <StartScreen
                  key="start"
                  onStart={() => setState(DemoState.paymentCardIntro)}
                  onAccount={() => setState(DemoState.account)}
                />
              )}
              {activeDemo === DemoTab.mobile && state === DemoState.account && <AccountScreen key="account" onBack={() => setState(DemoState.start)} />}
              {activeDemo === DemoTab.mobile &&
                (state === DemoState.paymentCardIntro ||
                  state === DemoState.paymentProcessing ||
                  state === DemoState.paymentSuccess ||
                  state === DemoState.paymentNotification) && (
                  <PaymentScreen
                    key="payment"
                    phase={state}
                    onPay={() => setState(DemoState.paymentProcessing)}
                    onOpenNotification={() => setState(DemoState.tailsOffer)}
                  />
                )}
              {activeDemo === DemoTab.mobile &&
                (state === DemoState.tailsOffer ||
                  state === DemoState.coinFlipping ||
                  state === DemoState.result ||
                  state === DemoState.doubleResult) && (
                <TailsOfferScreen
                  key="tails"
                  phase={state}
                  onFlip={() => {
                    setState((current) => {
                      if (current !== DemoState.tailsOffer) return current
                      const nextResult = coinNextOutcomeRef.current || readNextCoinOutcome()
                      coinNextOutcomeRef.current = nextResult === DemoState.doubleResult ? DemoState.result : DemoState.doubleResult
                      writeNextCoinOutcome(nextResult)
                      setCoinResultState(nextResult)
                      return DemoState.coinFlipping
                    })
                  }}
                  onReplay={() => setState(DemoState.start)}
                />
              )}

              {activeDemo === DemoTab.mystery && mysteryState === MysteryState.start && (
                <MysteryStartScreen key="mystery-start" onStart={() => setMysteryState(MysteryState.paymentCardIntro)} />
              )}
              {activeDemo === DemoTab.mystery &&
                (mysteryState === MysteryState.paymentCardIntro ||
                  mysteryState === MysteryState.paymentProcessing ||
                  mysteryState === MysteryState.paymentNotification) && (
                  <MysteryNikePaymentScreen
                    key="mystery-payment"
                    phase={mysteryState}
                    onPay={() => setMysteryState(MysteryState.paymentProcessing)}
                    onOpenNotification={() => setMysteryState(MysteryState.offer)}
                  />
                )}
              {activeDemo === DemoTab.mystery &&
                (mysteryState === MysteryState.offer ||
                  mysteryState === MysteryState.checkout ||
                  mysteryState === MysteryState.checkoutProcessing ||
                  mysteryState === MysteryState.readyToOpen ||
                  mysteryState === MysteryState.opening ||
                  mysteryState === MysteryState.result) && (
                  <MysteryBoxScreen
                    key="mystery-box"
                    phase={mysteryState}
                    messageIndex={mysteryMessageIndex}
                    onBuyBox={() => setMysteryState(MysteryState.checkout)}
                    onConfirmCheckout={() => setMysteryState(MysteryState.checkoutProcessing)}
                    onOpenBox={() => setMysteryState(MysteryState.opening)}
                    onClaim={() => setMysteryState(MysteryState.start)}
                  />
                )}

              {activeDemo === DemoTab.dice && diceState === DiceState.start && (
                <DiceStartScreen key="dice-start" onStart={() => setDiceState(DiceState.paymentCardIntro)} />
              )}
              {activeDemo === DemoTab.dice &&
                (diceState === DiceState.paymentCardIntro || diceState === DiceState.paymentProcessing || diceState === DiceState.paymentNotification) && (
                  <MysteryNikePaymentScreen
                    key="dice-payment"
                    phase={diceState}
                    phases={{
                      intro: DiceState.paymentCardIntro,
                      processing: DiceState.paymentProcessing,
                      notification: DiceState.paymentNotification,
                    }}
                    notificationTitle="Roll the dice!"
                    notificationCopy="Tap to roll this purchase outcome"
                    onPay={() => setDiceState(DiceState.paymentProcessing)}
                    onOpenNotification={() => setDiceState(DiceState.offer)}
                  />
                )}
              {activeDemo === DemoTab.dice &&
                (diceState === DiceState.offer ||
                  diceState === DiceState.checkout ||
                  diceState === DiceState.checkoutProcessing ||
                  diceState === DiceState.readyToOpen ||
                  diceState === DiceState.opening ||
                  diceState === DiceState.result) && (
                  <DiceDemoScreen
                    key="dice-screen"
                    phase={diceState}
                    messageIndex={diceMessageIndex}
                    onBuyBox={() => setDiceState(DiceState.checkout)}
                    onConfirmCheckout={() => setDiceState(DiceState.checkoutProcessing)}
                    onOpenBox={() => setDiceState(DiceState.opening)}
                    onClaim={() => setDiceState(DiceState.start)}
                  />
                )}

              {activeDemo === DemoTab.b2bOld &&
                (b2bOldState === B2BState.start ||
                  b2bOldState === B2BState.paymentCardIntro ||
                  b2bOldState === B2BState.paymentProcessing) && (
                  <B2BPaymentScreen
                    key="b2b-old-payment"
                    phase={b2bOldState}
                    onStartCheckout={() => setB2bOldState(B2BState.paymentCardIntro)}
                    onPay={() => setB2bOldState(B2BState.paymentProcessing)}
                  />
                )}
              {activeDemo === DemoTab.b2bOld &&
                (b2bOldState === B2BState.offer ||
                  b2bOldState === B2BState.checkout ||
                  b2bOldState === B2BState.checkoutProcessing ||
                  b2bOldState === B2BState.readyToOpen ||
                  b2bOldState === B2BState.opening ||
                  b2bOldState === B2BState.result) && (
                  <B2BMysteryBoxScreen
                    key="b2b-old-box"
                    phase={b2bOldState}
                    onBuyBox={() => setB2bOldState(B2BState.checkout)}
                    onToggleCheckoutConfirm={() => setB2bOldState(B2BState.checkoutProcessing)}
                    onOpenBox={() => setB2bOldState(B2BState.opening)}
                    onClaim={() => setB2bOldState(B2BState.start)}
                  />
                )}

              {activeDemo === DemoTab.b2bNew &&
                (b2bNewState === B2BState.start ||
                  b2bNewState === B2BState.paymentCardIntro ||
                  b2bNewState === B2BState.paymentProcessing) && (
                  <B2BPaymentScreen
                    key="b2b-new-payment"
                    phase={b2bNewState}
                    onStartCheckout={() => setB2bNewState(B2BState.paymentCardIntro)}
                    onPay={() => setB2bNewState(B2BState.paymentProcessing)}
                  />
                )}
              {activeDemo === DemoTab.b2bNew &&
                (b2bNewState === B2BState.offer ||
                  b2bNewState === B2BState.checkout ||
                  b2bNewState === B2BState.checkoutProcessing ||
                  b2bNewState === B2BState.readyToOpen ||
                  b2bNewState === B2BState.opening ||
                  b2bNewState === B2BState.result) && (
                  <B2BMysteryBoxNewScreen
                    key="b2b-new-box"
                    phase={b2bNewState}
                    messageIndex={b2bNewMessageIndex}
                    onBuyBox={() => setB2bNewState(B2BState.checkout)}
                    onToggleCheckoutConfirm={() => setB2bNewState(B2BState.checkoutProcessing)}
                    onOpenBox={() => setB2bNewState(B2BState.opening)}
                    onClaim={() => setB2bNewState(B2BState.start)}
                  />
                )}

              </AnimatePresence>
            </PhoneFrame>
          )}
        </div>
      </div>
    </main>
  )
}
