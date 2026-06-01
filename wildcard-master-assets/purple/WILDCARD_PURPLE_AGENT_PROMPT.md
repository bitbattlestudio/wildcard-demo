# Agent Prompt: Apply The Wild Card Purple Style

You are updating an existing app to match the Wild Card purple brand system.

Use the style guide at:

`wildcard-master-assets/purple/WILDCARD_PURPLE_STYLE_GUIDE.md`

Use assets from:

`wildcard-master-assets/purple/`

Your goal is to restyle the app so it feels like Wild Card: premium purple fintech, playful casino-style reward mechanics, fast mini-games after payments, chrome/black premium variants, and polished motion.

## Instructions

1. Read `WILDCARD_PURPLE_STYLE_GUIDE.md` first.
2. Inventory the app’s existing assets, flows, and styles.
3. Replace older green/mint/default assets with the purple, dark purple, black, chrome, and white assets from `wildcard-master-assets/purple/`.
4. Match the color, typography, glow, border, shadow, and motion direction from the style guide.
5. Keep the app’s existing functionality unless explicitly asked to change behavior.
6. Use the real Wild Card assets instead of recreating SVG stand-ins when an asset exists.
7. Build or run the app and visually verify the major flows before finishing.

## Must-Use Brand Rules

- Use `app-icon-purple.png` for app icon/favicon/small brand chips.
- Use `wild-card-debit-card-purple.png` for Apple Pay, wallet, payment, debit card, and ecosystem card screens.
- Use `wordmark-purple-lite.png`, `wordmark-purple-full.png`, or `wordmark-chrome.png` for Wild Card wordmarks.
- Use `card-purple-full.png`, `card-black-purple-full.png`, and `card-black-chrome-lite.png` for hero/cover/premium card moments.
- Use `wildcard-mystery-box-purple.png` and `wildcard-mystery-box-purple-open.png` for Mystery Box flows.
- Use `wildcard-mystery-box-black.png` and `wildcard-mystery-box-black-open.png` for premium/secret level variants.
- Use `wildcard-playing-card-purple.png` and `wildcard-playing-card-black.png` for card-pick/freebie flows.
- Use `purple-pack-1.png`, `purple-pack-2.png`, `chrome-pack-1.png`, `card-from-pack-purple-1.png`, and `card-from-pack-chrome-1.png` for pack-opening flows.
- Use `wildcard-coin-purple.png` and `wildcard-coin-black.png` for coin/reward/flip/token moments.
- Use `purple-ad-secret-level.jpg`, `purple-ad-1.jpg`, `purple-ad-boat.png`, `wildcard-reallife-1-purple.png`, and `wildcard-reallife-2-purple.png` for deck, hero, and promotional visuals.
- Always write `W*LD Points`, never `wildcard points`.

## Visual Direction

Implement the purple brand tokens:

```css
--wildcard-bg: #050505;
--wildcard-purple-light: #f3dcff;
--wildcard-purple-lavender: #d8b4fe;
--wildcard-purple-hot: #b978ff;
--wildcard-purple-main: #8b5cf6;
--wildcard-purple-deep: #4c1d95;
--wildcard-purple-ink: #1a0433;
--wildcard-copy: #edf6f2;
--wildcard-copy-muted: rgba(237, 246, 242, 0.68);
--wildcard-glow-purple: rgba(185, 120, 255, 0.45);
```

Use:

- Dark full-screen backgrounds.
- Purple/lavender glow highlights.
- Glassy dark panels with subtle white borders.
- Large, bold `Unbounded` display headings.
- SF Pro / Helvetica style body and app UI.
- Slow floating card motion and fast reward reveals.
- Rounded pill buttons and clear game-state CTAs.

Avoid:

- Green/mint legacy styling.
- Generic blue SaaS styling.
- Clipped cards, clipped boxes, or overly large slides.
- Visible scrollbars in deck/demo surfaces unless needed.
- Placeholder vector art when a real asset exists.

## Flow Updates To Consider

Apple Pay / payment:

- Use `wild-card-debit-card-purple.png`.
- Keep it large, inspectable, and premium.

Mystery Box:

- Use purple/black box assets.
- Add purple glow.
- Use open-box reveal state.

Find Your Freebie / Web B2B cards:

- Use purple/black playing card backs.
- Use a grid of selectable cards.
- Use flip animation.
- Winning card should visually pop.

Spin:

- Use `purple-gradient-circle.png` as the wheel base.
- Use the asterisk-arrow asset as pointer.

Numbers:

- Animate balls smoothly: slide/fade up in sequence, then all drop/fade out, repeat.

Scratch:

- Implement real scratch-to-reveal masking, not a sliding overlay.

Crash:

- Use dark graph, purple curve, asterisk marker, fast ticking dollar amount, and a large `Cash Out` button.

Pack opening:

- Add or update a pack-opening flow with `purple-pack-1.png`, `purple-pack-2.png`, `chrome-pack-1.png`, and card-from-pack assets.
- Animate pack shake/open and cards rising out one by one.

## Deliverable

Make the code changes directly. After implementation:

- Run the build/test command available in the project.
- Report changed files.
- Report any asset files that were missing or unused.
- Mention any visual areas that still need manual review.

