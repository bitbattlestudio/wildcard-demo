import React from 'react'
import { motion } from 'framer-motion'
import { ASSETS, SCREEN_TRANSITION } from './constants'

const HISTORY = [
  { date: 'Mar 14', merchant: 'Morning Roast', amount: 'FREE', originalAmount: '$12', outcome: 'WIN' },
  { date: 'Mar 12', merchant: 'Daily Grind', amount: '$5', originalAmount: '$20', outcome: 'WIN' },
  { date: 'Mar 10', merchant: 'Green Market', amount: '$6', outcome: 'LOSS' },
  { date: 'Mar 08', merchant: 'Metro Cafe', amount: 'FREE', originalAmount: '$9', outcome: 'WIN' },
  { date: 'Mar 05', merchant: 'Sunset Deli', amount: '$7', originalAmount: '$16', outcome: 'WIN' },
  { date: 'Mar 03', merchant: 'Northside', amount: '$4', outcome: 'LOSS' },
  { date: 'Mar 01', merchant: 'Morning Roast', amount: 'FREE', originalAmount: '$11', outcome: 'WIN' },
  { date: 'Feb 27', merchant: 'Blue Bottle', amount: 'FREE', originalAmount: '$8', outcome: 'WIN' },
]

export default function AccountScreen({ onBack }) {
  return (
    <motion.section className="screen account-screen" {...SCREEN_TRANSITION}>
      <div className="status-bar status-bar-dark">
        <span>8:51</span>
        <div className="status-icons">
          <span className="signal-bars signal-bars-dark" />
          <span className="wifi-icon wifi-icon-dark" />
          <span className="battery-pill battery-pill-dark">58</span>
        </div>
      </div>

      <div className="account-content">
        <div className="account-header">
          <img className="account-logo" src={ASSETS.logo} alt="wildcard" />
          <button type="button" className="account-back" onClick={onBack}>
            Back
          </button>
        </div>

        <div className="account-summary">
          <div className="account-summary-row">
            <div className="account-summary-block">
              <div className="account-summary-label">wildcard Balance</div>
              <div className="account-balance-row">
                <img className="account-balance-coin" src={ASSETS.coin} alt="" />
                <span className="account-balance-value">250</span>
              </div>
            </div>
            <div className="account-summary-block account-summary-block-right">
              <div className="account-summary-label">STREAK</div>
              <div className="account-streak-value">2</div>
            </div>
          </div>
        </div>

        <div className="account-history-head">
          <span>History</span>
        </div>

        <div className="account-history-list">
          {HISTORY.map((item) => (
            <div className="account-history-row" key={`${item.date}-${item.merchant}`}>
              <div className="account-history-left">
                <div className="account-history-merchant">{item.merchant}</div>
                <div className="account-history-date">{item.date}</div>
              </div>
              <div className="account-history-right">
                <div className="account-history-amount-row">
                  {item.originalAmount && <div className="account-history-original">{item.originalAmount}</div>}
                  <div className={`account-history-amount ${item.outcome === 'WIN' ? 'is-win' : 'is-loss'}`}>{item.amount}</div>
                </div>
                <div className={`account-history-outcome ${item.outcome === 'WIN' ? 'is-win' : 'is-loss'}`}>{item.outcome}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
