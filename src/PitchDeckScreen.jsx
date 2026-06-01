import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ASSETS } from './constants'
import cardGreenFull from '../wildcard-master-assets/purple/card-purple-full.png'
import wildCardDebitCard1 from '../wildcard-master-assets/purple/wild-card-debit-card-purple.png'
import wildcardAsteriskBlack from '../wildcard-master-assets/wildcard-asterisk-black.png'
import wildcardAsteriskArrowBlack from '../wildcard-master-assets/wildcard-asterisk-arrow-black.png'
import wildcardRealLife1 from '../wildcard-master-assets/purple/wildcard-reallife-1-purple.png'
import wildcardRealLife3 from '../wildcard-master-assets/purple/wildcard-reallife-2-purple.png'
import wordmarkGreenLite from '../wildcard-master-assets/purple/wordmark-purple-lite.png'
import appIconGreen from '../wildcard-master-assets/purple/app-icon-purple.png'
import cardGlassLite from '../wildcard-master-assets/card-glass-lite.png'
import cardBlackFull from '../wildcard-master-assets/purple/card-black-purple-full.png'
import cardBlackChromeLite from '../wildcard-master-assets/purple/card-black-chrome-lite.png'
import wordmarkChrome from '../wildcard-master-assets/purple/wordmark-chrome.png'
import appIconChrome from '../wildcard-master-assets/purple/app-icon-chrome.png'
import asteriskChrome from '../wildcard-master-assets/purple/asterisk-chrome.png'
import wildcardCoinBlack from '../wildcard-master-assets/purple/wildcard-coin-black.png'
import wildcardMysteryBoxBlack from '../wildcard-master-assets/purple/wildcard-mystery-box-black.png'
import wildcardMysteryBox from '../wildcard-master-assets/purple/wildcard-mystery-box-purple.png'
import wildcardPlayingCardGreen from '../wildcard-master-assets/purple/wildcard-playing-card-purple.png'
import wildcardCoinGreen from '../wildcard-master-assets/purple/wildcard-coin-purple.png'
import wildcardSmileGreen from '../wildcard-master-assets/purple/wild-card-smile-purple.png'
import greenGradientCircle from '../wildcard-master-assets/purple/purple-gradient-circle.png'
import purpleAdSecretLevel from '../wildcard-master-assets/purple/purple-ad-secret-level.jpg'
import purpleAdBoat from '../wildcard-master-assets/purple/purple-ad-boat.png'
import starbucksLogo from '../wildcard-master-assets/starbucks-logo.png'
import sevenElevenLogo from '../wildcard-master-assets/7-eleven-logo.png'
import chipotleLogo from '../wildcard-master-assets/chipotle-logo.png'
import parkingLogo from '../wildcard-master-assets/parking-logo.png'

const COVER_CARD_STORAGE_KEY = 'wildcard_cover_card_index_v1'
const COVER_CARD_IMAGES = [
  { src: cardGreenFull, alt: 'wildcard purple card' },
  { src: cardBlackFull, alt: 'wildcard black purple card' },
  { src: cardBlackChromeLite, alt: 'wildcard black chrome card' },
]

function getCoverCardForLoad() {
  if (typeof window === 'undefined') return COVER_CARD_IMAGES[0]

  const storedIndex = Number.parseInt(window.localStorage.getItem(COVER_CARD_STORAGE_KEY) || '0', 10)
  const index = Number.isFinite(storedIndex) ? storedIndex % COVER_CARD_IMAGES.length : 0
  window.localStorage.setItem(COVER_CARD_STORAGE_KEY, String((index + 1) % COVER_CARD_IMAGES.length))
  return COVER_CARD_IMAGES[index]
}

const coverCardForLoad = getCoverCardForLoad()

/* ── Slide data ─────────────────────────────────────────────────────────── */
const BASE_SLIDES = [
  {
    id: 'cover',
    type: 'cover',
  },
  {
    id: 'statement',
    type: 'statement',
    label: 'THE OPPORTUNITY',
    title: 'wildcard makes every purchase playable.',
    subtitle: 'Turning everyday spending into winning opportunities.',
    chips: ['Stablecoin Card', 'Casino-Style Moments', 'Commerce-Native'],
  },
  {
    id: 'wildcard-credit-card',
    type: 'credit-card',
    section: '01',
    accent: 'green',
    title: 'The wildcard Debit Card',
    body: 'Every tap triggers a mini game with a chance to win full refunds, risk your balance, get cash back, earn store credits and more.',
  },
  {
    id: 'launch-games',
    type: 'games',
    section: '02',
    accent: 'blue',
    title: 'Playable at Launch',
  },
  {
    id: 'targeted-purchase-patterns',
    type: 'purchase-patterns',
    section: '03',
    accent: 'green',
    title: 'Targeted Purchase Patterns',
    subtitle: 'wildcard works best where everyday card swipes are frequent, low-stakes, and repeatable.',
  },
  {
    id: 'business-model',
    type: 'content',
    section: '04',
    accent: 'purple',
    title: 'Revenue Model',
    image: wildcardRealLife3,
    imageAlt: 'wildcard notification and Apple Pay at checkout',
    imageSide: 'left',
    revenueGroups: [
      {
        title: 'At Launch',
        items: [
          'Interchange fees on every card transaction',
          'Yield earned on stablecoin reserves and treasury holdings',
          'Vig on paid “Flip” or premium reward mechanics',
          'FX spreads and international transaction conversion fees',
          'Breakage from unused rewards, credits, and promotional balances',
          'Reward pool optimization and treasury management',
          'Interest income from idle balances and settlement float',
        ],
      },
      {
        title: 'Future',
        items: [
          'Sponsored “Free Purchase” moments funded by brands',
          'Revenue share from partner merchants and commerce integrations',
          'Subscription tiers for boosted rewards and higher win rates',
          'White-label infrastructure licensing for banks and fintech partners',
          'Affiliate revenue from commerce and merchant referrals',
          'Data and consumer spending insights for merchant analytics (aggregated/anonymized)',
          'Creator / influencer reward campaigns and co-branded experiences',
        ],
      },
    ],
  },
  {
    id: 'the-brand',
    type: 'brand',
    section: '05',
    accent: 'green',
    title: 'The Brand',
  },
  {
    id: 'future-games',
    type: 'future-games',
    section: '06',
    accent: 'green',
    title: 'Future Games',
    subtitle: 'More post-purchase moments that keep wildcard feeling fresh after every swipe.',
  },
  {
    id: 'wildcard-ecosystem',
    type: 'ecosystem',
    section: '07',
    accent: 'green',
    title: 'The wildcard ecosystem',
  },
  {
    id: 'gamify-moments',
    type: 'image-only',
    accent: 'purple',
    image: purpleAdSecretLevel,
    imageAlt: 'Every tap has a secret level wildcard ad',
  },
  {
    id: 'boat-ad',
    type: 'image-only',
    accent: 'purple',
    image: purpleAdBoat,
    imageAlt: 'wildcard purple boat ad',
  },
]

const PITCH_DECK_ORDER_KEY = 'wildcard_pitch_deck_order_v5'

function buildOrderedSlides(orderIds) {
  if (!Array.isArray(orderIds) || !orderIds.length) return BASE_SLIDES
  const byId = new Map(BASE_SLIDES.map((s) => [s.id, s]))
  const ordered = orderIds.map((id) => byId.get(id)).filter(Boolean)
  const missing = BASE_SLIDES.filter((s) => !orderIds.includes(s.id))
  return [...ordered, ...missing]
}

/* ── Animation variants ──────────────────────────────────────────────────── */
const slideVariants = {
  enter: (d) => ({ opacity: 0, y: d > 0 ? 28 : -28 }),
  center: { opacity: 1, y: 0 },
  exit:  (d) => ({ opacity: 0, y: d > 0 ? -28 : 28 }),
}
const slideTx = { duration: 0.42, ease: [0.22, 1, 0.36, 1] }

const SPINNER_DURATION = 4.8
const SPINNER_HOLD = 0.85
const SPINNER_LOGO_IDLE_SHADOW = '0 8px 16px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.16)'
const SPINNER_LOGO_ACTIVE_SHADOW = '0 0 0 3px rgba(255, 255, 255, 0.78), 0 0 24px rgba(185, 120, 255, 0.9), 0 10px 20px rgba(0, 0, 0, 0.24)'

const spinnerMerchants = [
  { merchant: 'Coffee', logo: starbucksLogo, className: 'is-starbucks' },
  { merchant: 'Parking', logo: parkingLogo, className: 'is-parking' },
  { merchant: 'Chipotle', logo: chipotleLogo, className: 'is-chipotle' },
  { merchant: '7/11', logo: sevenElevenLogo, className: 'is-seven' },
  { merchant: 'Haircut', logo: null, className: 'is-barber' },
  { merchant: 'Local', logo: null, className: 'is-local' },
]

function getSpinnerLogoPulse(index) {
  const passTimes = [0.985, 0.265, 0.308, 0.363, 0.441, 0.563]
  const pass = passTimes[index]
  if (index === 0) {
    return {
      animate: {
        scale: [1, 1, 1.18, 1.18],
        filter: ['brightness(1)', 'brightness(1)', 'brightness(1.38)', 'brightness(1.38)'],
        boxShadow: [
          SPINNER_LOGO_IDLE_SHADOW,
          SPINNER_LOGO_IDLE_SHADOW,
          SPINNER_LOGO_ACTIVE_SHADOW,
          SPINNER_LOGO_ACTIVE_SHADOW,
        ],
      },
      transition: {
        duration: SPINNER_DURATION,
        repeat: Infinity,
        repeatDelay: SPINNER_HOLD,
        ease: 'linear',
        times: [0, 0.92, 0.985, 1],
      },
    }
  }
  const start = Math.max(0, pass - 0.018)
  const end = Math.min(1, pass + 0.026)
  return {
    animate: {
      scale: [1, 1, 1.08, 1],
      filter: ['brightness(1)', 'brightness(1)', 'brightness(1.28)', 'brightness(1)'],
      boxShadow: [
        SPINNER_LOGO_IDLE_SHADOW,
        SPINNER_LOGO_IDLE_SHADOW,
        SPINNER_LOGO_ACTIVE_SHADOW,
        SPINNER_LOGO_IDLE_SHADOW,
      ],
    },
    transition: {
      duration: SPINNER_DURATION,
      repeat: Infinity,
      repeatDelay: SPINNER_HOLD,
      ease: 'easeInOut',
      times: [0, start, pass, end],
    },
  }
}

function MerchantSpinner({ compact = false }) {
  return (
    <div className={`pitch-pattern-wheel-wrap${compact ? ' pitch-pattern-wheel-wrap-compact' : ''}`}>
      <img className="pitch-pattern-spinner-bg" src={greenGradientCircle} alt="" aria-hidden="true" />
      {spinnerMerchants.map((merchant, index) => {
        const pulse = getSpinnerLogoPulse(index)
        return (
          <motion.span
            key={`${merchant.merchant}-${index}`}
            className={`pitch-pattern-spinner-logo pitch-pattern-spinner-logo-${index + 1} ${merchant.className}`}
            aria-label={merchant.merchant}
            animate={pulse.animate}
            transition={pulse.transition}
          >
            {merchant.logo ? (
              <img src={merchant.logo} alt="" aria-hidden="true" />
            ) : merchant.className === 'is-barber' ? (
              <span className="pitch-pattern-barber-mark" aria-hidden="true" />
            ) : (
              <span className="pitch-pattern-local-mark">LOCAL</span>
            )}
          </motion.span>
        )
      })}
      <motion.img
        className="pitch-pattern-spinner-arrow"
        src={wildcardAsteriskArrowBlack}
        alt=""
        aria-hidden="true"
        animate={{ rotate: [0, 2160] }}
        transition={{
          duration: SPINNER_DURATION,
          repeat: Infinity,
          repeatDelay: SPINNER_HOLD,
          ease: [0.05, 0.82, 0.16, 1],
        }}
      />
    </div>
  )
}

/* ── Slide components ────────────────────────────────────────────────────── */

function CoverSlide() {
  return (
    <div className="pitch-cover">
      <div className="pitch-cover-orb pitch-cover-orb-a" />
      <div className="pitch-cover-orb pitch-cover-orb-b" />
      <div className="pitch-cover-orb pitch-cover-orb-c" />
      <div className="pitch-cover-inner">
        <motion.img
          src={coverCardForLoad.src}
          alt={coverCardForLoad.alt}
          className="pitch-cover-card"
          initial={{ scale: 0.8, opacity: 0, y: 24, rotate: -5 }}
          animate={{
            scale: [1, 1.02, 1],
            opacity: 1,
            y: [0, -10, 0, 10, 0],
            rotate: [-2, 1, -2, -5, -2],
          }}
          transition={{
            opacity: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
            scale: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
        <motion.div
          className="pitch-cover-badge"
          initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.35 }}
        >
          BRAND DECK 2026
        </motion.div>
      </div>
    </div>
  )
}

function StatementSlide({ slide }) {
  return (
    <div className="pitch-statement">
      <div className="pitch-statement-label">{slide.label}</div>
      <motion.div
        className="pitch-statement-asterisk-wrap"
        initial={{ opacity: 0, scale: 0.82, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
      >
        <img className="pitch-statement-asterisk" src={wildcardAsteriskBlack} alt="" aria-hidden="true" />
      </motion.div>
      <h1 className="pitch-statement-title pitch-statement-title-with-logo">
        <span>{slide.title}</span>
      </h1>
      <p className="pitch-statement-body">{slide.subtitle}</p>
      <div className="pitch-chip-row">
        {slide.chips.map((c) => (
          <span key={c} className="pitch-chip">{c}</span>
        ))}
      </div>
    </div>
  )
}

function CreditCardSlide({ slide }) {
  return (
    <div className="pitch-credit-card-layout">
      <div className="pitch-content-left">
        {slide.section && <div className="pitch-section-num">{slide.section}</div>}
        <h2 className="pitch-title">{slide.title}</h2>
        <p className="pitch-credit-card-copy">{slide.body}</p>
      </div>
      <div className="pitch-credit-card-stage">
        <motion.img
          src={wildcardRealLife1}
          alt="wildcard card in use"
          className="pitch-credit-card-reallife"
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="pitch-credit-card-glow" />
      </div>
    </div>
  )
}

function ContentSlide({ slide }) {
  return (
    <div className={`pitch-content${slide.imageSide === 'left' ? ' pitch-content-image-left' : ''}`}>
      <div className="pitch-content-left">
        {slide.section && <div className="pitch-section-num">{slide.section}</div>}
        {slide.kicker && <div className="pitch-kicker">{slide.kicker}</div>}
        <h2 className="pitch-title">{slide.title}</h2>
        {slide.revenueGroups ? (
          <div className="pitch-revenue-groups">
            {slide.revenueGroups.map((group) => (
              <section key={group.title} className="pitch-revenue-group">
                <h3>{group.title}</h3>
                <ul className="pitch-list pitch-revenue-list">
                  {group.items.map((item) => (
                    <li key={item}>
                      <span className="pitch-bullet-dot" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <ul className="pitch-list">
            {slide.bullets.map((b) => (
              <li key={b}>
                <span className="pitch-bullet-dot" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="pitch-content-right">
        <div className="pitch-media-card">
          <div className="pitch-media-glow" />
          <img src={slide.image} alt={slide.imageAlt} className="pitch-media-image" />
        </div>
      </div>
    </div>
  )
}

function ImageOnlySlide({ slide }) {
  return (
    <div className="pitch-image-only">
      <img src={slide.image} alt={slide.imageAlt} className="pitch-image-only-media" />
    </div>
  )
}

function BrandSlide({ slide }) {
  const assets = [
    { src: cardGlassLite, alt: 'wildcard glass card', className: 'is-card is-card-glass' },
    { src: wordmarkGreenLite, alt: 'wildcard wordmark', className: 'is-wordmark is-wordmark-green' },
    { src: appIconGreen, alt: 'wildcard app icon', className: 'is-icon' },
    { src: wildcardMysteryBox, alt: 'wildcard mystery box', className: 'is-box' },
    { src: wildcardPlayingCardGreen, alt: 'wildcard playing card', className: 'is-playing-card' },
    { src: wildcardCoinGreen, alt: 'wildcard coin', className: 'is-coin' },
    { src: wildcardAsteriskBlack, alt: 'wildcard asterisk', className: 'is-asterisk' },
    { src: cardBlackFull, alt: 'wildcard black card', className: 'is-card is-card-black-full' },
    { src: wildcardSmileGreen, alt: 'wildcard smile mark', className: 'is-smile' },
    { src: cardBlackChromeLite, alt: 'wildcard black chrome card', className: 'is-card is-card-chrome-lite' },
    { src: wordmarkChrome, alt: 'wildcard chrome wordmark', className: 'is-wordmark is-wordmark-chrome' },
    { src: appIconChrome, alt: 'wildcard chrome app icon', className: 'is-icon is-icon-chrome' },
    { src: wildcardCoinBlack, alt: 'wildcard black coin', className: 'is-coin is-coin-black' },
    { src: wildcardMysteryBoxBlack, alt: 'wildcard black mystery box', className: 'is-box is-box-black' },
    { src: asteriskChrome, alt: 'wildcard chrome asterisk', className: 'is-asterisk is-asterisk-chrome' },
  ]

  return (
    <div className="pitch-brand-slide">
      <div className="pitch-brand-assets" aria-hidden="true">
        {assets.map((asset, index) => (
          <motion.div
            key={`${asset.alt}-${index}`}
            className={`pitch-brand-asset pitch-brand-asset-${index + 1} ${asset.className}`}
            animate={{
              y: [0, index % 2 ? -10 : 10, 0],
              rotate: [0, index % 2 ? 2 : -2, 0],
            }}
            transition={{
              duration: 4.4 + index * 0.18,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.1,
            }}
          >
            <img src={asset.src} alt="" />
          </motion.div>
        ))}
      </div>
      <div className="pitch-brand-center">
        {slide.section && <div className="pitch-section-num">{slide.section}</div>}
        <h2 className="pitch-title">{slide.title}</h2>
        <p>
          wildcard represents a new category of “playable commerce” — where payments evolve from passive
          utility into interactive winning experiences.
        </p>
      </div>
    </div>
  )
}

function GameTypesSlide({ slide }) {
  const items = [
    { title: 'Flip: Pay double. Or nothing.', label: 'A fast coin-flip moment where each purchase resolves into either a bigger charge or a free win.', kind: 'coin' },
    { title: 'Mystery Box', label: 'Pay to unlock your box and win a full refund, store credit or points.', kind: 'box' },
    { title: 'Find your Freebie', label: 'Pick the right card, get your purchase for free.', kind: 'cards' },
    { title: 'Spin to Win', label: 'Spin across recent purchases and land on one to refund, boost, or replay.', kind: 'spin' },
  ]

  const renderPreview = (kind) => {
    if (kind === 'coin') {
      return (
        <motion.div
          className="pitch-coin-preview-wrap"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            className="pitch-coin-preview-flip"
            animate={{ rotateX: [0, 180, 360] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
          >
            <div className="pitch-coin-preview-face is-front">
              <img src={ASSETS.coin} alt="Coin Flip" className="pitch-game-asset pitch-game-asset-coin" />
              <span>FREE</span>
            </div>
            <div className="pitch-coin-preview-face is-back">
              <img src={ASSETS.coin} alt="" className="pitch-game-asset pitch-game-asset-coin" />
              <span>DOUBLE</span>
            </div>
          </motion.div>
        </motion.div>
      )
    }
    if (kind === 'box') {
      return (
        <motion.img
          src={ASSETS.mysteryBox}
          alt="Mystery Box"
          className="pitch-game-asset pitch-game-asset-box"
          animate={{ y: [0, -7, 0], rotate: [0, -3, 2, 0], scale: [1, 1.03, 1] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )
    }
    if (kind === 'cards') {
      const positions = [
        { x: '-56%', y: '-52%' },
        { x: '56%', y: '-52%' },
        { x: '-56%', y: '52%' },
        { x: '56%', y: '52%' },
      ]
      return (
        <div className="pitch-game-cards-stage">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className={`pitch-game-card-tile ${i === 2 ? 'is-free' : ''}`}
              animate={{
                x: ['0%', `${i % 2 === 0 ? -5 : 5}%`, '0%', positions[i].x, positions[i].x, positions[i].x, '0%'],
                y: ['0%', `${i % 2 === 0 ? 5 : -5}%`, '0%', positions[i].y, positions[i].y, positions[i].y, '0%'],
                rotate: [0, i % 2 === 0 ? -8 : 8, i % 2 === 0 ? 6 : -6, 0, 0, 0, 0],
                rotateY: i === 2 ? [0, 0, 0, 0, 180, 180, 0] : 0,
                scale: i === 2 ? [1, 1.02, 1, 1, 1.08, 1.08, 1] : [1, 1.02, 1, 1, 1, 1, 1],
                zIndex: i === 2 ? [2, 5, 2, 2, 8, 8, 2] : [2 + i, 5 - i, 2 + i, 2 + i, 2 + i, 2 + i, 2 + i],
              }}
              transition={{
                duration: 5.6,
                repeat: Infinity,
                ease: [0.22, 1, 0.36, 1],
                times: [0, 0.12, 0.24, 0.46, 0.62, 0.82, 1],
                delay: i * 0.05,
              }}
            >
              <div className="pitch-game-card-face pitch-game-card-back-face">
                <img src={ASSETS.tailsCardBack} alt="" />
              </div>
              <div className="pitch-game-card-face pitch-game-card-free-face">FREE</div>
            </motion.div>
          ))}
        </div>
      )
    }
    if (kind === 'spin') {
      return <MerchantSpinner compact />
    }
    return null
  }

  return (
    <div className="pitch-games-layout">
      <div className="pitch-games-head">
        {slide.section && <div className="pitch-section-num">{slide.section}</div>}
        {slide.kicker && <div className="pitch-kicker">{slide.kicker}</div>}
        <h2 className="pitch-title">{slide.title}</h2>
      </div>
      <div className="pitch-games-grid">
        {items.map((item, i) => (
          <motion.article
            key={item.title}
            className="pitch-game-card-item"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              opacity: { duration: 0.32, delay: i * 0.06 },
              y: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
            }}
          >
            <div className="pitch-game-media-wrap">
              {renderPreview(item.kind)}
            </div>
            <h3>{item.title}</h3>
            <p>{item.label}</p>
          </motion.article>
        ))}
      </div>
    </div>
  )
}

function FutureGamesSlide({ slide }) {
  const [crashFrame, setCrashFrame] = React.useState(0)

  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCrashFrame((frame) => (frame + 1) % 72)
    }, 70)
    return () => window.clearInterval(intervalId)
  }, [])

  const isCrashBust = crashFrame >= 58 && crashFrame < 68
  const crashProgress = Math.min(crashFrame, 57) / 57
  const crashAmount = isCrashBust ? 0 : Math.pow(crashProgress, 1.72) * 4.86
  const crashAmountLabel = `$${crashAmount.toFixed(2)} back`

  return (
    <div className="pitch-future-games-layout">
      <div className="pitch-games-head">
        {slide.section && <div className="pitch-section-num">{slide.section}</div>}
        <h2 className="pitch-title">{slide.title}</h2>
        <p className="pitch-steps-subtitle">{slide.subtitle}</p>
      </div>

      <div className="pitch-future-games-grid">
        <article className="pitch-future-game-card">
          <div className="pitch-future-game-preview">
            <div className="pitch-scratch-card">
              <div className="pitch-scratch-brand">
                <img src={appIconGreen} alt="" aria-hidden="true" />
                <span>SCRATCH</span>
              </div>
              <div className="pitch-scratch-grid">
                {['$5', '2X', 'FREE'].map((value, index) => (
                  <div key={value} className="pitch-scratch-box">
                    <span>{value}</span>
                    <motion.svg
                      className="pitch-scratch-foil"
                      viewBox="0 0 76 92"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient id={`scratchFoil-${index}`} x1="0" x2="1" y1="0" y2="1">
                          <stop offset="0%" stopColor="#8a999f" />
                          <stop offset="48%" stopColor="#d7f0ed" />
                          <stop offset="100%" stopColor="#68787d" />
                        </linearGradient>
                        <pattern id={`scratchTexture-${index}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
                          <rect width="8" height="8" fill={`url(#scratchFoil-${index})`} />
                          <rect width="3" height="8" fill="rgba(255,255,255,0.18)" />
                        </pattern>
                        <mask id={`scratchMask-${index}`}>
                          <rect width="76" height="92" fill="white" />
                          {[
                            'M10 20 C24 12 43 18 66 11',
                            'M8 35 C25 44 42 27 68 38',
                            'M9 55 C25 48 42 61 67 51',
                            'M14 72 C30 78 46 66 64 74',
                            'M19 15 C26 34 44 53 57 78',
                          ].map((path, stroke) => (
                            <motion.path
                              key={path}
                              d={path}
                              fill="none"
                              stroke="black"
                              strokeWidth={stroke === 4 ? 11 : 13}
                              strokeLinecap="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: [0, 0, 1, 1, 0] }}
                              transition={{
                                duration: 5.2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                times: [0, 0.16, 0.48, 0.82, 1],
                                delay: index * 0.36 + stroke * 0.08,
                              }}
                            />
                          ))}
                        </mask>
                      </defs>
                      <rect width="76" height="92" rx="14" fill={`url(#scratchTexture-${index})`} mask={`url(#scratchMask-${index})`} />
                      <motion.circle
                        r="8"
                        fill="#f3dcff"
                        stroke="#06120d"
                        strokeWidth="2"
                        animate={{
                          cx: [9, 20, 55, 13, 62, 38, 9],
                          cy: [18, 32, 18, 56, 50, 76, 18],
                          opacity: [0, 1, 1, 1, 1, 0, 0],
                        }}
                        transition={{
                          duration: 5.2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          times: [0, 0.14, 0.28, 0.44, 0.58, 0.78, 1],
                          delay: index * 0.36,
                        }}
                      />
                      <motion.g
                        animate={{ opacity: [0, 0, 1, 1, 0] }}
                        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', times: [0, 0.2, 0.48, 0.82, 1], delay: index * 0.36 }}
                      >
                        <path d="M14 22 C28 14 48 18 65 12" stroke="rgba(243,220,255,0.45)" strokeWidth="2" strokeLinecap="round" fill="none" />
                        <path d="M9 56 C28 48 45 62 67 51" stroke="rgba(243,220,255,0.34)" strokeWidth="2" strokeLinecap="round" fill="none" />
                      </motion.g>
                    </motion.svg>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="pitch-future-game-copy">
            <h3>Scratch Offs</h3>
            <p>Three wildcard scratch boxes reveal instantly after purchase, with the final panel hitting FREE.</p>
          </div>
        </article>

        <article className="pitch-future-game-card">
          <div className="pitch-future-game-preview">
            <div className="pitch-numbers-stage">
              <div className="pitch-picked-numbers">
                {[7, 11, 24].map((number) => <span key={number}>{number}</span>)}
              </div>
              <div className="pitch-number-tube">
                {[7, 11, 24].map((number, index) => (
                  <span
                    key={number}
                    className="pitch-number-ball"
                    style={{ '--ball-index': index }}
                  >
                    {number}
                  </span>
                ))}
              </div>
              <motion.div
                className="pitch-numbers-match"
                animate={{ opacity: [0.45, 1, 0.45], scale: [0.98, 1.04, 0.98] }}
                transition={{ duration: 2.7, repeat: Infinity, ease: 'easeInOut' }}
              >
                MATCH
              </motion.div>
            </div>
          </div>
          <div className="pitch-future-game-copy">
            <h3>Numbers</h3>
            <p>Pick 3 numbers, then the wildcard number picker runs. If all 3 match, you win.</p>
          </div>
        </article>

        <article className="pitch-future-game-card">
          <div className="pitch-future-game-preview">
            <div className={`pitch-crash-stage ${isCrashBust ? 'is-crashed' : ''}`}>
              <div className="pitch-crash-value">{crashAmountLabel}</div>
              <svg className="pitch-crash-chart" viewBox="0 0 240 150" aria-hidden="true">
                <path className="pitch-crash-guide" d="M24 132 C74 122 110 96 144 62 C164 42 184 31 214 24" />
                <motion.path
                  className="pitch-crash-curve"
                  d="M24 132 C74 122 110 96 144 62 C164 42 184 31 214 24"
                  animate={{ pathLength: [0, 0.18, 0.52, 1, 1, 0] }}
                  transition={{ duration: 5.04, repeat: Infinity, ease: [0.22, 1, 0.36, 1], times: [0, 0.18, 0.48, 0.8, 0.92, 1] }}
                />
              </svg>
              <div className="pitch-crash-asterisk">
                *
              </div>
              <motion.button
                type="button"
                className="pitch-crash-cashout"
                animate={{ opacity: [0.92, 1, 1, 0.52, 0.18, 0.92], scale: [1, 1.03, 1.03, 0.98, 0.98, 1] }}
                transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                Cash Out
              </motion.button>
              <motion.div
                className="pitch-crash-bust"
                animate={{ opacity: [0, 0, 0, 0, 1, 0], scale: [0.92, 0.92, 0.92, 0.92, 1.08, 0.92] }}
                transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                CRASH
              </motion.div>
            </div>
          </div>
          <div className="pitch-future-game-copy">
            <h3>Crash Back</h3>
            <p>Post-swipe cash back rises in real time. Cash out before the asterisk crashes back to $0.</p>
          </div>
        </article>
      </div>
    </div>
  )
}

function PurchasePatternsSlide({ slide }) {
  const transactions = [
    { merchant: 'Coffee', logo: starbucksLogo, amount: '$6', className: 'is-starbucks' },
    { merchant: 'Haircut', logo: null, amount: '$32', className: 'is-barber' },
    { merchant: 'Parking', logo: parkingLogo, amount: '$2.50', className: 'is-parking' },
    { merchant: 'Chipotle', logo: chipotleLogo, amount: '$18', className: 'is-chipotle' },
    { merchant: '7/11', logo: sevenElevenLogo, amount: '$9', className: 'is-seven' },
  ]
  const gameLoop = ['Flip', 'Mystery Box', 'Freebie Cards', 'Spin to Win', 'Numbers', 'Scratch', 'Crash Back']

  return (
    <div className="pitch-pattern-layout">
      <div className="pitch-pattern-copy">
        {slide.section && <div className="pitch-section-num">{slide.section}</div>}
        <h2 className="pitch-title">{slide.title}</h2>
        <p className="pitch-steps-subtitle">{slide.subtitle}</p>
      </div>

      <div className="pitch-pattern-grid">
        <section className="pitch-pattern-card pitch-pattern-sweet">
          <div className="pitch-pattern-kicker">Sweet spot</div>
          <div className="pitch-pattern-amount">Under $40</div>
          <p>Low-ticket purchases are emotional enough to feel lucky, but small enough to make replay feel natural.</p>
          <div className="pitch-pattern-transaction-list">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.merchant}
                className="pitch-pattern-transaction"
                animate={{ y: [0, index % 2 ? -4 : 4, 0] }}
                transition={{ duration: 2.8 + index * 0.12, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className={`pitch-pattern-transaction-logo ${transaction.className}`}>
                  {transaction.logo ? (
                    <img src={transaction.logo} alt="" aria-hidden="true" />
                  ) : (
                    <span className="pitch-pattern-barber-mark" aria-hidden="true" />
                  )}
                </span>
                <span className="pitch-pattern-transaction-copy">
                  <strong>{transaction.merchant}</strong>
                  <small>{transaction.amount}</small>
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="pitch-pattern-card pitch-pattern-loop">
          <div className="pitch-pattern-kicker">After every purchase</div>
          <div className="pitch-pattern-loop-stage">
            {gameLoop.map((game, index) => (
              <motion.div
                key={game}
                className="pitch-pattern-game-pill"
                animate={{
                  opacity: [0.32, index === 0 ? 1 : 0.32, index === 1 ? 1 : 0.32, index === 2 ? 1 : 0.32, index === 3 ? 1 : 0.32, 0.32],
                  scale: [0.94, index === 0 ? 1.08 : 0.94, index === 1 ? 1.08 : 0.94, index === 2 ? 1.08 : 0.94, index === 3 ? 1.08 : 0.94, 0.94],
                }}
                transition={{ duration: 6.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {game}
              </motion.div>
            ))}
          </div>
          <p>A rotating variety of games keeps each purchase from feeling repetitive.</p>
          <div className="pitch-pattern-callout">
            <strong>Paid Mystery Box</strong>
            <span>Best for higher-dollar transactions of $100+ where the prize reveal can feel bigger.</span>
          </div>
        </section>

        <section className="pitch-pattern-card pitch-pattern-spin">
          <div className="pitch-pattern-spin-head">
            <div className="pitch-pattern-kicker">Spin to Win</div>
            <p>Spin to refund a past purchase and pull older transactions back into the fun. Every 5 swipes gets you a spin.</p>
          </div>
          <MerchantSpinner />
        </section>
      </div>
    </div>
  )
}

function MetricsSlide({ slide }) {
  return (
    <div className="pitch-metrics-layout">
      <div className="pitch-metrics-left">
        {slide.section && <div className="pitch-section-num">{slide.section}</div>}
        <h2 className="pitch-title">{slide.title}</h2>
        <div className="pitch-stat-grid">
          {slide.stats.map((s) => (
            <div key={s.label} className={`pitch-stat-card pitch-stat-${s.accent}`}>
              <div className="pitch-stat-value">{s.value}</div>
              <div className="pitch-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
        {slide.note && <p className="pitch-footnote">{slide.note}</p>}
      </div>
      <div className="pitch-content-right">
        <div className="pitch-media-card">
          <div className="pitch-media-glow" />
          <img src={slide.image} alt={slide.imageAlt} className="pitch-media-image" />
        </div>
      </div>
    </div>
  )
}

function StepsSlide({ slide }) {
  return (
    <div className="pitch-steps-layout">
      <div className="pitch-steps-header">
        {slide.section && <div className="pitch-section-num">{slide.section}</div>}
        <h2 className="pitch-title">{slide.title}</h2>
        {slide.subtitle && <p className="pitch-steps-subtitle">{slide.subtitle}</p>}
      </div>
      <div className="pitch-steps-grid">
        {slide.steps.map((step, i) => (
          <React.Fragment key={step.n}>
            <div className="pitch-step-card">
              <div className="pitch-step-num">{step.n}</div>
              <div className="pitch-step-title">{step.title}</div>
              <div className="pitch-step-body">{step.body}</div>
            </div>
            {i < slide.steps.length - 1 && (
              <div className="pitch-step-arrow">→</div>
            )}
          </React.Fragment>
        ))}
      </div>
      {slide.footnote && <p className="pitch-footnote">{slide.footnote}</p>}
    </div>
  )
}

function EngineSlide({ slide }) {
  const rails = [
    { label: 'RTP Balance', value: 74, accent: 'purple' },
    { label: 'Churn Risk', value: 38, accent: 'blue' },
    { label: 'Revenue Yield', value: 82, accent: 'green' },
    { label: 'Reward Timing', value: 61, accent: 'pink' },
  ]
  return (
    <div className="pitch-engine-layout">
      <div className="pitch-steps-header">
        {slide.section && <div className="pitch-section-num">{slide.section}</div>}
        <h2 className="pitch-title">{slide.title}</h2>
        <p className="pitch-steps-subtitle">{slide.subtitle}</p>
      </div>
      <div className="pitch-engine-grid">
        <section className="pitch-engine-card">
          {rails.map((r) => (
            <div key={r.label} className="pitch-engine-row">
              <div className="pitch-engine-row-label">{r.label}</div>
              <div className="pitch-engine-rail">
                <motion.div
                  className={`pitch-engine-fill pitch-engine-fill-${r.accent}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${r.value}%` }}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <div className="pitch-engine-val">{r.value}%</div>
            </div>
          ))}
        </section>
        <section className="pitch-engine-card">
          <h3>How it works</h3>
          <ul className="pitch-list">
            <li><span className="pitch-bullet-dot" /><span>Monitors cohort payout pressure and expected value in real time.</span></li>
            <li><span className="pitch-bullet-dot" /><span>Adjusts reward cadence to sustain engagement while preserving contribution margin.</span></li>
            <li><span className="pitch-bullet-dot" /><span>Tunes outcomes per merchant profile and basket mix.</span></li>
            <li><span className="pitch-bullet-dot" /><span>Continuously optimizes toward revenue, retention, and merchant ROI.</span></li>
          </ul>
        </section>
      </div>
    </div>
  )
}

function EcosystemSlide({ slide }) {
  const containers = [
    {
      title: 'Wildcard Digital Debit Card',
      label: '01',
      className: 'is-card',
      image: wildCardDebitCard1,
      imageAlt: 'wildcard debit card',
      items: [
        'Stablecoin-powered card and digital dollar account',
        'Fundable via Apple Pay or ACH',
        'Apple Pay ready',
      ],
    },
    {
      title: 'The Wildcard App and W*LD Rewards',
      label: '02',
      className: 'is-app',
      image: appIconGreen,
      imageAlt: 'wildcard app icon',
      items: [
        'Companion app for debit card, facilitates push notifications, gameplay and winnings',
        'Hosts all balances, transactions and account info',
        'Stores W*LD Rewards that can be used towards purchases',
      ],
    },
    {
      title: 'Shopify Plugin',
      label: '03',
      className: 'is-plugin',
      image: wildcardMysteryBox,
      imageAlt: 'wildcard mystery box',
      items: [
        'Post-purchase eCommerce Shopify app',
        'Hosts same suite of post-purchase games',
        'Feeds customers back to B2C card/app',
      ],
    },
  ]

  return (
    <div className="pitch-ecosystem-layout">
      <div className="pitch-games-head">
        {slide.section && <div className="pitch-section-num">{slide.section}</div>}
        <h2 className="pitch-title">{slide.title}</h2>
      </div>
      <div className="pitch-ecosystem-grid">
        {containers.map((container) => (
          <article key={container.title} className={`pitch-ecosystem-card ${container.className}`}>
            <div className="pitch-ecosystem-visual">
              <img src={container.image} alt={container.imageAlt} />
            </div>
            <div className="pitch-ecosystem-card-head">
              <span>{container.label}</span>
              <h3>{container.title}</h3>
            </div>
            <ul>
              {container.items.map((item) => (
                <li key={item}>
                  <span className="pitch-bullet-dot" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  )
}

function RefundFlowSlide({ slide }) {
  const steps = [
    {
      title: 'Step 1 — Purchase (Shopify)',
      body: 'Customer buys product ($100) via Shopify checkout',
      sub: 'Funds → Merchant',
    },
    {
      title: 'Step 2 — wildcard Offer',
      body: 'Post-purchase Mystery Box offer',
      sub: '“Play for $25”',
    },
    {
      title: 'Step 3 — Mystery Box Purchase',
      body: 'Customer pays $25 to wildcard',
      sub: 'Processed via Stripe · Funds → wildcard',
    },
    {
      title: 'Step 4 — Outcome + Refund',
      body: 'User wins $10',
      sub: 'wildcard triggers Shopify refund → $10 back to customer card',
    },
    {
      title: 'Step 5 — Settlement',
      body: 'wildcard reimburses merchant',
      sub: 'Net settlement (daily/weekly)',
    },
  ]

  return (
    <div className="pitch-refund-slide">
      <div className="pitch-refund-head">
        <div className="pitch-refund-kicker">{slide.section}</div>
        <h2 className="pitch-refund-title">{slide.title}</h2>
        <p className="pitch-refund-subtitle">“{slide.subtitle}”</p>
      </div>

      <div className="pitch-refund-main">
        <section className="pitch-refund-flow-panel">
          <div className="pitch-refund-steps">
            {steps.map((step, i) => (
              <React.Fragment key={step.title}>
                <article className="pitch-refund-step-card">
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                  <span>{step.sub}</span>
                </article>
                {i < steps.length - 1 ? <div className="pitch-refund-step-arrow">→</div> : null}
              </React.Fragment>
            ))}
          </div>

          <div className="pitch-refund-top-arrowline">
            Customer → Shopify → wildcard → Shopify Refund → Merchant Settlement
          </div>

          <div className="pitch-refund-secondary-lines">
            <p>Customer → Shopify → $100 → Merchant</p>
            <p>Customer → wildcard → $25 → wildcard</p>
            <p>wildcard → Shopify → Refund $10 → Customer Card</p>
            <p>wildcard → Merchant → $10 reimbursement</p>
          </div>
        </section>

        <section className="pitch-refund-right">
          <section className="pitch-refund-econ-card">
            <h4>Unit Economics</h4>
            <p><strong>Customer pays:</strong> $25</p>
            <p><strong>Refund:</strong> $10</p>
            <p><strong>wildcard keeps:</strong> ~$15 (before fees)</p>
          </section>

          <section className="pitch-refund-insight-card">
            <h4>Key Insight</h4>
            <p>wildcard does NOT touch the original payment. It:</p>
            <ul>
              <li>Sells a separate game ($25)</li>
              <li>Uses Shopify refunds to pay winnings</li>
              <li>Reimburses the merchant</li>
            </ul>
          </section>
        </section>
      </div>

      <div className="pitch-refund-footer">
        Requires merchant approval for refunds · Uses Shopify refund APIs (partial refunds supported) · Settlement handled off-platform
      </div>
    </div>
  )
}

function ShopifyPluginSlide({ slide }) {
  const stats = [
    { value: 'Post', label: 'Runs after purchase without disrupting checkout' },
    { value: '1 tap', label: 'Customer accepts the game moment instantly' },
    { value: 'API', label: 'Refunds, credits, and rewards settle through merchant rails' },
  ]
  const flow = [
    'Merchant installs wildcard and configures reward budget',
    'Customer completes purchase normally',
    'wildcard game appears between checkout and thank-you page',
    'Outcome reveals refund, credit, cash back, or loyalty value',
  ]
  return (
    <div className="pitch-plugin-layout">
      <div className="pitch-steps-header">
        {slide.section && <div className="pitch-section-num">{slide.section}</div>}
        <h2 className="pitch-title">{slide.title}</h2>
        <p className="pitch-steps-subtitle">{slide.subtitle}</p>
      </div>
      <div className="pitch-plugin-grid">
        <section className="pitch-plugin-stats">
          {stats.map((s) => (
            <article key={s.label} className="pitch-plugin-stat-card">
              <div className="pitch-plugin-stat-value">{s.value}</div>
              <div className="pitch-plugin-stat-label">{s.label}</div>
            </article>
          ))}
        </section>
        <section className="pitch-plugin-flow">
          {flow.map((step, i) => (
            <React.Fragment key={step}>
              <article className="pitch-plugin-flow-step">
                <span>{step}</span>
              </article>
              {i < flow.length - 1 ? <div className="pitch-plugin-flow-arrow">↓</div> : null}
            </React.Fragment>
          ))}
        </section>
      </div>
      <div className="pitch-plugin-callout">
        The plugin gives merchants a plug-and-play game layer while the card makes every off-platform purchase playable too.
      </div>
      <p className="pitch-plugin-footnote">
        Shopify is the first cross-back channel: merchant rewards feed the card/app loop, and card users can be sent back into merchant experiences.
      </p>
    </div>
  )
}

function PluginCapabilitiesSlide({ slide }) {
  const canList = [
    'Charge the customer an additional amount using vaulted payment token (one tap, no card re-entry)',
    "Issue refunds to original payment method via Shopify Refund API (credit, debit, Apple Pay, Shop Pay)",
    'Create gift cards programmatically and issue instantly for guaranteed-win mechanics',
    'Add product line items to orders for physical prize fulfillment',
    'Read customer + order context: email, name, address, order total, card brand/last4, line items',
    "Query merchant catalog via Shopify Storefront API for prize selection",
    'Deduct inventory for physical prizes and trigger fulfillment workflows',
  ]
  const cannotList = [
    'Access full card number or CVV (tokenized rails only)',
    "Run silent background charges without explicit customer confirmation",
    'Process Apple Pay / Google Pay / Shop Pay as independent rails outside Shopify',
    'Customize mid-checkout information/shipping/payment steps on non-Plus plans',
    'Run two post-purchase extensions in the same checkout concurrently',
  ]
  return (
    <div className="pitch-cap-layout">
      <div className="pitch-steps-header">
        {slide.section && <div className="pitch-section-num">{slide.section}</div>}
        <h2 className="pitch-title">{slide.title}</h2>
        <p className="pitch-steps-subtitle">{slide.subtitle}</p>
      </div>
      <div className="pitch-cap-grid">
        <section className="pitch-cap-column">
          <h3 className="pitch-cap-head pitch-cap-head-good">✓ We Can Do This</h3>
          <div className="pitch-cap-list">
            {canList.map((item) => (
              <article key={item} className="pitch-cap-row pitch-cap-row-good">
                <span className="pitch-cap-icon">✓</span>
                <span>{item}</span>
              </article>
            ))}
          </div>
        </section>
        <section className="pitch-cap-column">
          <h3 className="pitch-cap-head pitch-cap-head-bad">✗ We Cannot Do This</h3>
          <div className="pitch-cap-list">
            {cannotList.map((item) => (
              <article key={item} className="pitch-cap-row pitch-cap-row-bad">
                <span className="pitch-cap-icon">✗</span>
                <span>{item}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
      <div className="pitch-cap-callout">
        Key constraint: only one post-purchase extension can run per checkout. wildcard must be the merchant's only
        post-purchase app, or negotiate priority placement.
      </div>
    </div>
  )
}

function GuaranteedWinSlide({ slide }) {
  const outcomes = [
    {
      label: 'W*LD Points',
      probability: 'Highest',
      value: 'Entry reward / loyalty balance',
      logic: 'Keeps every box rewarding, drives account creation and future play',
      accent: 'silver',
    },
    {
      label: 'Store Credit',
      probability: 'High',
      value: 'Merchant-funded credit toward future purchase',
      logic: 'Pushes repeat purchase and keeps value inside merchant ecosystem',
      accent: 'teal',
    },
    {
      label: 'Partial Refund',
      probability: 'Medium',
      value: 'Cash-back or % refund on current order',
      logic: 'Creates excitement while preserving target margin',
      accent: 'green',
    },
    {
      label: 'Full Refund',
      probability: 'Lowest',
      value: '100% order refund',
      logic: 'Hero outcome used sparingly for virality and retention',
      accent: 'gold',
    },
  ]
  const economics = [
    ['Gross box revenue', 'configurable'],
    ['Reward cost', 'controlled by target RTP'],
    ['Processing/platform fees', 'estimated'],
    ['Merchant revenue share', 'configurable'],
    ['wildcard net margin', 'optimized by reward distribution'],
  ]
  return (
    <div className="pitch-win-layout">
      <div className="pitch-steps-header">
        {slide.section && <div className="pitch-section-num">{slide.section}</div>}
        <h2 className="pitch-title">ALWAYS WIN SOMETHING</h2>
        <p className="pitch-steps-subtitle">Every box returns value — points, credit, or refunds — while the engine controls margin.</p>
      </div>

      <section className="pitch-win-table">
        <header>
          <span>OUTCOME</span>
          <span>PROBABILITY</span>
          <span>VALUE TO CUSTOMER</span>
          <span>BUSINESS LOGIC</span>
        </header>
        {outcomes.map((row) => (
          <article key={row.label} className={`pitch-win-row pitch-win-row-${row.accent}`}>
            <span>{row.label}</span>
            <span>{row.probability}</span>
            <span>{row.value}</span>
            <span>{row.logic}</span>
          </article>
        ))}
        <footer>Prize probabilities are dynamically controlled by the wildcard engine based on merchant budget, target RTP, user behavior, and campaign goals.</footer>
      </section>

      <section className="pitch-win-econ-grid">
        <article className="pitch-win-econ-card">
          <h3>Per 100 Boxes Sold</h3>
          {economics.map(([k, v]) => (
            <div key={k} className="pitch-win-econ-line">
              <span>{k}</span>
              <strong>{v}</strong>
            </div>
          ))}
          <div className="pitch-win-econ-divider" />
          <div className="pitch-win-econ-line is-net">
            <span>Target margin</span>
            <strong>configurable by campaign</strong>
          </div>
        </article>
        <article className="pitch-win-scale-card">
          <h3>At Scale</h3>
          <p>Merchants × boxes/day × net margin/box = annualized wildcard revenue</p>
          <div className="pitch-win-scale-line"><span>Formula</span><strong>100 × 100 × $X × 365</strong></div>
          <div className="pitch-win-annual">Scalable Revenue</div>
          <div className="pitch-win-annual-label">Revenue scales with merchant count, daily box volume, and optimized payout rates.</div>
        </article>
      </section>

      <section className="pitch-win-pill-row">
        <div className="pitch-win-pill pitch-win-pill-green">W*LD Points create account conversion</div>
        <div className="pitch-win-pill pitch-win-pill-amber">Store credit drives repeat purchase</div>
        <div className="pitch-win-pill pitch-win-pill-blue">Refunds create viral moments</div>
      </section>

      <footer className="pitch-win-footer">
        Prize mix, RTP, merchant contribution, and revenue share are configurable by campaign.
      </footer>
    </div>
  )
}

function ClosingSlide({ slide }) {
  return (
    <div className="pitch-closing">
      <div className="pitch-closing-orb" />
      <h2 className="pitch-closing-title">{slide.title}</h2>
      <div className="pitch-advantage-grid">
        {slide.advantages.map((a) => (
          <div key={a.title} className="pitch-advantage-card">
            <div className="pitch-advantage-icon">{a.icon}</div>
            <div className="pitch-advantage-title">{a.title}</div>
            <div className="pitch-advantage-body">{a.body}</div>
          </div>
        ))}
      </div>
      <div className="pitch-closing-footer">tails.money · 2025</div>
    </div>
  )
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function PitchDeckScreen() {
  const [slideOrder] = React.useState(() => {
    try {
      const raw = window.localStorage.getItem(PITCH_DECK_ORDER_KEY)
      const parsed = raw ? JSON.parse(raw) : null
      return Array.isArray(parsed) ? parsed : BASE_SLIDES.map((s) => s.id)
    } catch {
      return BASE_SLIDES.map((s) => s.id)
    }
  })
  const [index, setIndex] = React.useState(0)
  const [dir, setDir] = React.useState(1)

  const slides = React.useMemo(() => buildOrderedSlides(slideOrder), [slideOrder])
  const slide = slides[index]
  const total = slides.length

  const goTo = React.useCallback((next) => {
    setDir(next > index ? 1 : -1)
    setIndex(next)
  }, [index])

  const goNext = React.useCallback(() => { if (index < total - 1) goTo(index + 1) }, [index, goTo, total])
  const goPrev = React.useCallback(() => { if (index > 0) goTo(index - 1) }, [index, goTo])

  React.useEffect(() => {
    if (index > total - 1) setIndex(Math.max(0, total - 1))
  }, [index, total])

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') goNext()
      if (e.key === 'ArrowLeft'  || e.key === 'PageUp')   goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  return (
    <div className="pitch-viewport">

      {/* Top progress bar */}
      <div className="pitch-progress-bar">
        <motion.div
          className="pitch-progress-fill"
          animate={{ width: `${((index + 1) / total) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Slide area */}
      <div className="pitch-slide-wrap">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={slide.id}
            className={`pitch-slide pitch-accent-${slide.accent || 'green'} ${slide.type === 'cover' ? 'pitch-slide-cover' : ''} ${slide.type === 'games' ? 'pitch-slide-games' : ''}`}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTx}
          >
            <div className="pitch-slide-scale">
              {slide?.type === 'cover'     && <CoverSlide />}
              {slide?.type === 'statement' && <StatementSlide slide={slide} />}
              {slide?.type === 'credit-card' && <CreditCardSlide slide={slide} />}
              {slide?.type === 'games'     && <GameTypesSlide slide={slide} />}
              {slide?.type === 'future-games' && <FutureGamesSlide slide={slide} />}
              {slide?.type === 'purchase-patterns' && <PurchasePatternsSlide slide={slide} />}
              {slide?.type === 'brand' && <BrandSlide slide={slide} />}
              {slide?.type === 'shopify-plugin' && <ShopifyPluginSlide slide={slide} />}
              {slide?.type === 'plugin-capabilities' && <PluginCapabilitiesSlide slide={slide} />}
              {slide?.type === 'guaranteed-win' && <GuaranteedWinSlide slide={slide} />}
              {slide?.type === 'content'   && <ContentSlide  slide={slide} />}
              {slide?.type === 'image-only' && <ImageOnlySlide slide={slide} />}
              {slide?.type === 'metrics'   && <MetricsSlide  slide={slide} />}
              {slide?.type === 'refund-flow' && <RefundFlowSlide slide={slide} />}
              {slide?.type === 'steps'     && <StepsSlide    slide={slide} />}
              {slide?.type === 'engine'    && <EngineSlide   slide={slide} />}
              {slide?.type === 'ecosystem' && <EcosystemSlide slide={slide} />}
              {slide?.type === 'closing'   && <ClosingSlide  slide={slide} />}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav */}
      <footer className="pitch-nav">
        <button type="button" className="pitch-nav-btn" onClick={goPrev} disabled={index === 0}>
          ← Prev
        </button>

        <div className="pitch-nav-center">
          <span className="pitch-nav-count">{index + 1} / {total}</span>
          <div className="pitch-dots">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={`pitch-dot${i === index ? ' is-active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <button type="button" className="pitch-nav-btn" onClick={goNext} disabled={index === total - 1}>
          Next →
        </button>
      </footer>
    </div>
  )
}
