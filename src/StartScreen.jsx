import React from 'react'
import { motion } from 'framer-motion'
import { ASSETS, SCREEN_TRANSITION } from './constants'

export default function StartScreen({ onStart, onAccount }) {
  return (
    <motion.section className="screen start-screen" {...SCREEN_TRANSITION}>
      <div className="status-bar">
        <span>8:51</span>
        <div className="status-icons">
          <span className="signal-bars" />
          <span className="wifi-icon" />
          <span className="battery-pill">58</span>
        </div>
      </div>

      <div className="start-content">
        <div className="start-hero-logo-stage start-hero-logo-float">
          <img
            className="start-hero-logo"
            src={ASSETS.logoCard}
            alt="wildcard flip free earn"
          />
        </div>
        <p className="start-kicker">
          Post-payment
          <br />
          coin flip demo
        </p>
        <h1 className="start-title">Flip for your coffee.</h1>
        <button type="button" className="primary-button" onClick={onStart}>
          Pay with Apple Pay
        </button>
        <button type="button" className="secondary-link" onClick={onAccount}>
          My wildcard
        </button>
      </div>
    </motion.section>
  )
}
