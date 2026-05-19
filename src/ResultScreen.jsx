import React from 'react'
import { motion } from 'framer-motion'
import { ASSETS, SCREEN_TRANSITION } from './constants'

export default function ResultScreen({ outcome, onReplay }) {
  return (
    <motion.section className="screen result-screen" {...SCREEN_TRANSITION}>
      <div className="status-bar status-bar-dark">
        <span>8:51</span>
        <div className="status-icons">
          <span className="signal-bars signal-bars-dark" />
          <span className="wifi-icon wifi-icon-dark" />
          <span className="battery-pill battery-pill-dark">58</span>
        </div>
      </div>

      <div className="result-content">
        <img src={ASSETS.coin} alt="" className="result-coin" />
        <div className="result-glow" />
        <div className="result-eyebrow">Outcome</div>
        <div className="result-title">{outcome}</div>
        <div className="result-subtitle">{outcome === 'FREE' ? "Coffee's on wildcard" : 'This one doubled to $8'}</div>
        <button type="button" className="primary-button dark-button" onClick={onReplay}>
          Replay
        </button>
      </div>
    </motion.section>
  )
}
