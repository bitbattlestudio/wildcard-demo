import React from 'react'
import { motion } from 'framer-motion'
import { ASSETS, SCREEN_TRANSITION } from './constants'

export default function DiceStartScreen({ onStart }) {
  return (
    <motion.section className="screen start-screen mystery-start-screen" {...SCREEN_TRANSITION}>
      <div className="status-bar">
        <span>8:51</span>
        <div className="status-icons">
          <span className="signal-bars" />
          <span className="wifi-icon" />
          <span className="battery-pill">58</span>
        </div>
      </div>

      <div className="start-content mystery-start-content">
        <div className="mystery-start-box-wrap">
          <motion.div
            className="mystery-start-box"
            animate={{
              y: [0, -12, 0, 12, 0],
              rotateZ: [0, 2, 0, -2, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img className="mystery-box-image mystery-box-image-start" src={ASSETS.diceBox} alt="Dice" />
          </motion.div>
        </div>
        <img className="start-logo" src={ASSETS.logo} alt="wildcard" />
        <p className="start-kicker">
          Post-payment
          <br />
          dice demo
        </p>
        <h1 className="start-title">Roll for your sneaker reward</h1>
        <button type="button" className="primary-button" onClick={onStart}>
          Pay with Apple Pay
        </button>
      </div>
    </motion.section>
  )
}
