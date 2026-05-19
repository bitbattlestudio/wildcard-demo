import React from 'react'

function StepBox({ label, sub, tone = 'default' }) {
  return (
    <div className={`howit-step howit-step-${tone}`}>
      <div className="howit-step-label">{label}</div>
      <div className="howit-step-sub">{sub}</div>
    </div>
  )
}

function Arrow() {
  return (
    <div className="howit-arrow" aria-hidden="true">
      <div className="howit-arrow-line" />
      <div className="howit-arrow-head" />
    </div>
  )
}

function MathCard({ title, lines, note, noteTone = 'muted' }) {
  return (
    <div className="howit-math-wrap">
      <div className="howit-math-card">
        <div className="howit-math-title">{title}</div>
        <pre className="howit-math-pre">{lines.join('\n')}</pre>
      </div>
      <p className={`howit-math-note howit-math-note-${noteTone}`}>{note}</p>
    </div>
  )
}

export default function HowItWorksScreen() {
  return (
    <section className="howit-screen">
      <div className="howit-inner">
        <h1 className="howit-page-title">HOW IT WORKS</h1>

        <div className="howit-grid">
          <section className="howit-section">
            <header className="howit-section-header">
              <h2 className="howit-section-title">B2B · Online or In-Store</h2>
              <p className="howit-section-subtitle">No debit card · no app · no setup · any card works</p>
            </header>

            <div className="howit-flow">
              <div className="howit-callout">wildcard pays merchant first · then flips with the user</div>
              <StepBox label='User selects "Pay with wildcard" at checkout' sub="Appears alongside Apple Pay · Klarna · PayPal" />
              <Arrow />
              <StepBox label="wildcard pays merchant immediately" sub="$60 wholesale to Nike · merchant is done" />
              <Arrow />
              <StepBox label="wildcard pre-auths user credit card at 2×" sub="$200 hold · any credit card · nothing charged yet" />
              <Arrow />
              <StepBox label="Coin flip fires" sub="Provably fair · result in under 1 second" />

              <div className="howit-fork" aria-hidden="true">
                <div className="howit-fork-stem" />
                <div className="howit-fork-branch" />
                <div className="howit-fork-down howit-fork-down-left" />
                <div className="howit-fork-down howit-fork-down-right" />
                <div className="howit-fork-head howit-fork-head-left" />
                <div className="howit-fork-head howit-fork-head-right" />
              </div>

              <div className="howit-outcomes">
                <StepBox label="WIN · 40%" sub="Pre-auth released\nUser pays $0\nUser got $100 shoes free" tone="win" />
                <StepBox label="LOSE · 60%" sub="Pre-auth captured\nUser pays $200\nUser paid double" tone="lose" />
              </div>

              <div className="howit-merge" aria-hidden="true">
                <div className="howit-merge-up howit-merge-up-left" />
                <div className="howit-merge-up howit-merge-up-right" />
                <div className="howit-merge-branch" />
                <div className="howit-merge-stem" />
                <div className="howit-arrow-head" />
              </div>

              <StepBox label="Transaction complete" sub="Nike received $60 · wildcard absorbed win or kept spread" />
            </div>

            <MathCard
              title="EXAMPLE: $100 Nike shoes · 100 flips"
              lines={[
                'wildcard pays Nike wholesale upfront',
                '100 × $60                        −  $6,000',
                '',
                '60 losers  charged $200 each     +  $12,000',
                '40 winners charged $0                    $0',
                '',
                'Gross collected:                    $12,000',
                'Wholesale cost:                    − $6,000',
                'Stripe fees blended ~$3.50 × 100  −    $350',
                '',
                'Net to wildcard:                        $5,650',
                'Per flip:                               $56.50',
                'Net margin:                             18.8%',
              ]}
              note="Nike is paid before the flip. wildcard carries the risk. No debit card. No app. No Plaid. User only needs a credit card they already have."
            />
          </section>

          <section className="howit-section">
            <header className="howit-section-header">
              <h2 className="howit-section-title">B2C · wildcard App</h2>
              <p className="howit-section-subtitle">Debit card required · detects purchases automatically</p>
            </header>

            <div className="howit-flow">
              <StepBox label="Download wildcard app" sub="One-time setup · iOS" />
              <Arrow />
              <StepBox label="Connect debit card" sub="Stripe · required for instant win payouts" />
              <Arrow />
              <StepBox label="Connect bank via Plaid" sub="Read-only · detects purchases automatically" />
              <Arrow />
              <StepBox label="Make any purchase" sub="Coffee · restaurant · anywhere" />
              <Arrow />
              <StepBox label="Plaid webhook fires" sub="wildcard detects transaction in real time" />
              <Arrow />
              <StepBox label="Push notification sent" sub={'"Flip your $100 Nike order?"'} />
              <Arrow />
              <StepBox label="User taps and flips" sub="Coin animates · result in under 1 second" />

              <div className="howit-fork" aria-hidden="true">
                <div className="howit-fork-stem" />
                <div className="howit-fork-branch" />
                <div className="howit-fork-down howit-fork-down-left" />
                <div className="howit-fork-down howit-fork-down-right" />
                <div className="howit-fork-head howit-fork-head-left" />
                <div className="howit-fork-head howit-fork-head-right" />
              </div>

              <div className="howit-outcomes">
                <StepBox label="WIN · 48%" sub="$100 paid to debit card\ninstantly" tone="win" />
                <StepBox label="LOSE · 52%" sub="$100 charged from debit\ncard instantly" tone="lose" />
              </div>
            </div>

            <MathCard
              title="EXAMPLE: $100 purchase · 100 flips · 80% RTP"
              lines={[
                '52 losers  pay wildcard $100     =  $5,200',
                '48 winners receive $100       −  $4,800',
                'Gross:                              $400',
                '',
                'Stripe fees blended ~$3.50',
                '× 100 flips                   −    $350',
                '',
                'Net to wildcard:                        $50',
                'Per flip:                             $0.50',
                'Net margin:                           0.5%',
              ]}
              note="B2C margin is thin at $100. Profitable from volume and subscriptions. Coffee shop builds the habit."
              noteTone="green"
            />
          </section>
        </div>
      </div>
    </section>
  )
}
