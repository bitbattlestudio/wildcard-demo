import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const SPRING = { type: 'spring', stiffness: 180, damping: 20 }

const FACE_TO_STATE = {
  color: 'color',
  number: 'number',
  flap: 'reveal',
}

const BaseSVG = ({ children }) => (
  <motion.svg
    viewBox="0 0 400 400"
    className="absolute inset-0 w-full h-full"
    initial={{ opacity: 0, scale: 0.92 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.96 }}
    transition={SPRING}
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      <linearGradient id="paper" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#e5e5e5" />
      </linearGradient>
      <linearGradient id="paperSoft" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#f0f0f0" />
      </linearGradient>
      <filter id="shadow" x="-40%" y="-40%" width="180%" height="220%">
        <feDropShadow dx="0" dy="14" stdDeviation="12" floodOpacity="0.2" />
      </filter>
    </defs>

    <ellipse cx="200" cy="328" rx="112" ry="20" fill="rgba(12,12,22,0.18)" />
    {children}
  </motion.svg>
)

function Closed({ onSelect }) {
  return (
    <BaseSVG>
      <g filter="url(#shadow)">
        <motion.polygon
          onClick={() => onSelect('Green')}
          points="200,60 100,150 200,200"
          fill="url(#paper)"
          stroke="#cfcfcf"
          strokeWidth="1.2"
          style={{ cursor: 'pointer' }}
          whileHover={{ scale: 1.03 }}
        />
        <motion.polygon
          onClick={() => onSelect('Red')}
          points="200,60 300,150 200,200"
          fill="url(#paperSoft)"
          stroke="#cfcfcf"
          strokeWidth="1.2"
          style={{ cursor: 'pointer' }}
          whileHover={{ scale: 1.03 }}
        />
        <motion.polygon
          onClick={() => onSelect('Black')}
          points="100,150 200,340 200,200"
          fill="url(#paperSoft)"
          stroke="#cfcfcf"
          strokeWidth="1.2"
          style={{ cursor: 'pointer' }}
          whileHover={{ scale: 1.03 }}
        />
        <motion.polygon
          onClick={() => onSelect('Blue')}
          points="300,150 200,340 200,200"
          fill="url(#paper)"
          stroke="#cfcfcf"
          strokeWidth="1.2"
          style={{ cursor: 'pointer' }}
          whileHover={{ scale: 1.03 }}
        />

        <line x1="200" y1="60" x2="200" y2="340" stroke="rgba(80,80,80,0.2)" strokeWidth="1" />
        <line x1="100" y1="150" x2="300" y2="150" stroke="rgba(80,80,80,0.16)" strokeWidth="1" />
        <line x1="200" y1="200" x2="100" y2="150" stroke="rgba(80,80,80,0.12)" strokeWidth="1" />
        <line x1="200" y1="200" x2="300" y2="150" stroke="rgba(80,80,80,0.12)" strokeWidth="1" />

        <text x="155" y="140" fill="#169845" fontWeight="bold" fontSize="20">Green</text>
        <text x="225" y="140" fill="#d42b2b" fontWeight="bold" fontSize="20">Red</text>
        <text x="135" y="260" fill="#111111" fontWeight="bold" fontSize="20">Black</text>
        <text x="235" y="260" fill="#2d57ff" fontWeight="bold" fontSize="20">Blue</text>
      </g>
    </BaseSVG>
  )
}

function Numbers({ onSelect }) {
  return (
    <BaseSVG>
      <g filter="url(#shadow)">
        <circle cx="200" cy="200" r="120" fill="url(#paper)" stroke="#cccccc" strokeWidth="1.2" />
        <circle cx="200" cy="200" r="62" fill="#f6f6f6" stroke="#dddddd" />

        {[1, 2, 3, 4, 5, 6, 7, 8].map((n, i) => {
          const angle = (i / 8) * Math.PI * 2 - Math.PI / 2
          const x = 200 + Math.cos(angle) * 88
          const y = 200 + Math.sin(angle) * 88
          return (
            <g key={n}>
              <circle
                cx={x}
                cy={y - 7}
                r="20"
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onClick={() => onSelect(n)}
              />
              <text
                x={x}
                y={y}
                fontSize="26"
                fontWeight="bold"
                fill={n % 2 === 0 ? '#101010' : '#7a3cff'}
                textAnchor="middle"
                style={{ cursor: 'pointer' }}
                onClick={() => onSelect(n)}
              >
                {n}
              </text>
            </g>
          )
        })}
      </g>
    </BaseSVG>
  )
}

function Reveal({ rewardText }) {
  return (
    <BaseSVG>
      <g filter="url(#shadow)">
        <rect x="80" y="100" width="240" height="200" rx="8" fill="url(#paper)" stroke="#cfcfcf" strokeWidth="1.2" />
        <polygon points="80,100 200,170 320,100 200,122" fill="rgba(0,0,0,0.04)" />
        <polygon points="80,300 200,230 320,300 200,278" fill="rgba(0,0,0,0.04)" />
        <polygon points="80,100 150,200 80,300 102,200" fill="rgba(0,0,0,0.035)" />
        <polygon points="320,100 250,200 320,300 298,200" fill="rgba(0,0,0,0.035)" />

        <text x="200" y="178" textAnchor="middle" fontSize="24" fill="#1f1f1f">You win</text>
        <text x="200" y="214" textAnchor="middle" fontSize="34" fill="#ff4aa2" fontWeight="bold">
          $10 back
        </text>
        <text x="200" y="246" textAnchor="middle" fontSize="20" fill="#1f1f1f">
          {rewardText}
        </text>
      </g>
    </BaseSVG>
  )
}

export default function FortuneTeller({
  size = 320,
  face,
  onPickColor,
  onPickNumber,
  onPickFlap,
}) {
  const [state, setState] = React.useState('color')
  const [selectedColor, setSelectedColor] = React.useState(null)
  const [selectedNumber, setSelectedNumber] = React.useState(null)
  const [reward] = React.useState('in wildcard Rewards')

  React.useEffect(() => {
    if (!face) return
    const mapped = FACE_TO_STATE[face]
    if (mapped) setState(mapped)
  }, [face])

  const handleColor = (c) => {
    setSelectedColor(c)
    onPickColor?.(c.toLowerCase())
    if (!face) {
      window.setTimeout(() => setState('number'), 400)
    }
  }

  const handleNumber = (n) => {
    setSelectedNumber(n)
    onPickNumber?.(n)
    onPickFlap?.(n)
    if (!face) {
      window.setTimeout(() => setState('reveal'), 400)
    }
  }

  const resolvedState = FACE_TO_STATE[face] || state
  const stageSize = Math.max(140, size)

  return (
    <div className="w-full flex justify-center items-center py-12" style={{ width: '100%' }}>
      <motion.div
        className="relative"
        style={{ width: stageSize, height: stageSize }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <AnimatePresence mode="wait">
          {resolvedState === 'color' && <Closed key="c" onSelect={handleColor} />}
          {resolvedState === 'number' && <Numbers key="n" onSelect={handleNumber} />}
          {resolvedState === 'reveal' && <Reveal key="r" rewardText={reward} />}
        </AnimatePresence>
      </motion.div>
      <span style={{ display: 'none' }}>{selectedColor}-{selectedNumber}</span>
    </div>
  )
}
