import React from 'react'
import { motion } from 'framer-motion'
import { ASSETS, SCREEN_TRANSITION } from './constants'

export default function WebB2BProductScreen({ onNext }) {
  return (
    <motion.div className="web-b2b-page" {...SCREEN_TRANSITION}>

      {/* ── Site Header ───────────────────────────────── */}
      <header className="web-site-header">
        <div className="web-site-header-inner">
          <img className="web-site-logo" src={ASSETS.omniluxLogo} alt="Omnilux" />
          <nav className="web-site-nav">
            <span className="web-site-nav-link">Products</span>
            <span className="web-site-nav-link">Science</span>
            <span className="web-site-nav-link">Professionals</span>
            <span className="web-site-nav-link">About</span>
          </nav>
          <div className="web-site-header-actions">
            <button type="button" className="web-site-cart-btn" aria-label="Cart (1 item)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="22" height="22">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <span className="web-site-cart-badge">1</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Breadcrumb ────────────────────────────────── */}
      <div className="web-breadcrumb-bar">
        <div className="web-breadcrumb-inner">
          <span>Home</span>
          <span className="web-bc-sep">›</span>
          <span>LED Therapy</span>
          <span className="web-bc-sep">›</span>
          <span className="web-bc-current">Contour Face</span>
        </div>
      </div>

      {/* ── Product Section ───────────────────────────── */}
      <div className="web-product-section">
        <div className="web-product-grid">

          {/* Left — Gallery */}
          <div className="web-product-gallery">
            <div className="web-product-main-wrap">
              <img className="web-product-main-img" src={ASSETS.omniluxProduct} alt="Omnilux Contour Face" />
            </div>
            <div className="web-product-thumbs">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`web-product-thumb${i === 0 ? ' is-active' : ''}`}>
                  <img src={ASSETS.omniluxProduct} alt={`View ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Right — Info */}
          <div className="web-product-info">
            <div className="web-product-brand-tag">OMNILUX</div>
            <h1 className="web-product-name">Contour Face</h1>
            <div className="web-product-rating-row">
              <span className="web-product-stars">★★★★★</span>
              <span className="web-product-review-count">4.9 · 2,847 reviews</span>
            </div>
            <div className="web-product-price">$385.00</div>

            <div className="web-product-rule" />

            <p className="web-product-desc">
              FDA-cleared LED light therapy device clinically proven to reduce fine lines,
              wrinkles, and improve skin tone. Trusted by dermatologists and medical spas worldwide.
            </p>

            <ul className="web-product-features">
              {[
                'FDA-cleared for anti-aging & collagen stimulation',
                'Dual wavelength: 633nm red + 830nm near-infrared',
                'Flexible medical-grade silicone — fits all face shapes',
                '10-minute sessions, 3–5× per week for visible results',
                'Free shipping · 2-year warranty included',
              ].map((f) => (
                <li key={f}>
                  <span className="web-feature-tick">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="web-product-rule" />

            <div className="web-product-qty-row">
              <span className="web-qty-label">Qty</span>
              <div className="web-qty-control">
                <button type="button" className="web-qty-btn">−</button>
                <span className="web-qty-val">1</span>
                <button type="button" className="web-qty-btn">+</button>
              </div>
            </div>

            <button type="button" className="web-btn-primary" onClick={onNext}>
              Add to Cart
            </button>
            <button type="button" className="web-btn-secondary" onClick={onNext}>
              Buy Now
            </button>

            <div className="web-product-trust-row">
              <span>🔒 Secure checkout</span>
              <span>📦 Free shipping</span>
              <span>↩ 60-day returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Specs Bar ─────────────────────────────────── */}
      <div className="web-specs-bar">
        <div className="web-specs-inner">
          {[
            { label: 'Wavelength', value: '633nm + 830nm' },
            { label: 'Clearance',  value: 'FDA Cleared' },
            { label: 'Session',    value: '10 minutes' },
            { label: 'Warranty',   value: '2 years' },
            { label: 'Ships from', value: 'Los Angeles, CA' },
          ].map((spec, i, arr) => (
            <React.Fragment key={spec.label}>
              <div className="web-spec-item">
                <div className="web-spec-label">{spec.label}</div>
                <div className="web-spec-value">{spec.value}</div>
              </div>
              {i < arr.length - 1 && <div className="web-spec-divider" />}
            </React.Fragment>
          ))}
        </div>
      </div>

    </motion.div>
  )
}
