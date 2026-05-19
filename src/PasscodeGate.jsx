import React from 'react'
import { ASSETS } from './constants'

const PASSCODE = 'w*ldcard-may'
const PASSCODE_KEY = 'wildcard.demo.passcodeAccepted'

export default function PasscodeGate({ children }) {
  const [isUnlocked, setIsUnlocked] = React.useState(() => {
    try {
      return window.localStorage.getItem(PASSCODE_KEY) === 'true'
    } catch {
      return false
    }
  })
  const [value, setValue] = React.useState('')
  const [error, setError] = React.useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (value.trim() !== PASSCODE) {
      setError('Incorrect passcode')
      return
    }

    try {
      window.localStorage.setItem(PASSCODE_KEY, 'true')
    } catch {
      // The gate still unlocks for this session if storage is unavailable.
    }
    setIsUnlocked(true)
  }

  if (isUnlocked) {
    return children
  }

  return (
    <main className="passcode-page">
      <div className="bg-glow bg-glow-top" />
      <div className="bg-glow bg-glow-bottom" />
      <form className="passcode-card" onSubmit={handleSubmit}>
        <img className="passcode-icon" src={ASSETS.appIcon} alt="wildcard" />
        <div>
          <div className="passcode-eyebrow">Private preview</div>
          <h1 className="passcode-title">wildcard demos</h1>
        </div>
        <label className="passcode-label" htmlFor="wildcard-passcode">
          Passcode
        </label>
        <input
          id="wildcard-passcode"
          className="passcode-input"
          type="password"
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            setError('')
          }}
          autoComplete="current-password"
          autoFocus
        />
        {error && <div className="passcode-error">{error}</div>}
        <button type="submit" className="passcode-button">
          Enter
        </button>
      </form>
    </main>
  )
}
