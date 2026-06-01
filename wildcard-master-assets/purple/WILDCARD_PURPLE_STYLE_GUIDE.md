# Wild Card Purple Style Guide

Use this guide to restyle an app, pitch deck, or interactive payment/game flow in the Wild Card purple visual system. The goal is to make the app feel like Wild Card: playful commerce, casino-style reward moments, premium fintech polish, and fast animated mini-games around everyday payments.

All referenced files live in this folder:

`wildcard-master-assets/purple/`

## Brand Personality

Wild Card should feel:

- Premium, kinetic, and a little mischievous.
- Fintech-clean, but not sterile.
- Casino/game-inspired, but still trustworthy enough for a payment product.
- Purple, chrome, black, and bright-white, with glowing highlights and soft glass.
- Built around the idea that every payment can unlock a small game, surprise, or reward.

Avoid:

- Flat generic SaaS styling.
- Overly corporate blue dashboards.
- Heavy green/mint styling from older versions.
- Cartoonish casino visuals.
- Beige, tan, orange, or one-note dark navy palettes.

## Core Color System

Use these as CSS variables or design tokens:

```css
:root {
  --wildcard-bg: #050505;
  --wildcard-panel: #11101a;
  --wildcard-panel-soft: rgba(255, 255, 255, 0.06);
  --wildcard-panel-border: rgba(255, 255, 255, 0.14);

  --wildcard-purple-light: #f3dcff;
  --wildcard-purple-lavender: #d8b4fe;
  --wildcard-purple-hot: #b978ff;
  --wildcard-purple-main: #8b5cf6;
  --wildcard-purple-deep: #4c1d95;
  --wildcard-purple-ink: #1a0433;

  --wildcard-white: #ffffff;
  --wildcard-copy: #edf6f2;
  --wildcard-copy-muted: rgba(237, 246, 242, 0.68);
  --wildcard-black: #020204;
  --wildcard-chrome: #ece8ff;

  --wildcard-glow-purple: rgba(185, 120, 255, 0.45);
  --wildcard-glow-soft: rgba(185, 120, 255, 0.18);
}
```

Primary gradients:

```css
.wildcard-gradient-primary {
  background:
    radial-gradient(118% 90% at 6% 6%, rgba(243, 220, 255, 0.76) 0%, rgba(185, 120, 255, 0.44) 36%, transparent 72%),
    radial-gradient(112% 82% at 72% 18%, rgba(139, 92, 246, 0.82) 0%, rgba(216, 180, 254, 0.54) 44%, transparent 82%),
    radial-gradient(90% 70% at 86% 92%, rgba(76, 29, 149, 0.46) 0%, rgba(91, 33, 182, 0.26) 44%, transparent 78%),
    linear-gradient(162deg, #f3dcff 0%, #8b5cf6 46%, #4c1d95 100%);
}

.wildcard-gradient-soft {
  background:
    radial-gradient(110% 86% at 2% 8%, rgba(243, 220, 255, 0.7) 0%, rgba(185, 120, 255, 0.26) 40%, transparent 78%),
    radial-gradient(92% 70% at 82% 24%, rgba(139, 92, 246, 0.28) 0%, rgba(216, 180, 254, 0.2) 52%, transparent 100%),
    linear-gradient(180deg, #ffffff 0%, #fbf7ff 56%, #f3dcff 100%);
}

.wildcard-panel-dark {
  background:
    radial-gradient(circle at 20% 12%, rgba(185, 120, 255, 0.16), transparent 42%),
    radial-gradient(circle at 80% 90%, rgba(185, 120, 255, 0.14), transparent 44%),
    linear-gradient(160deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.02) 100%),
    rgba(11, 13, 27, 0.74);
}
```

## Typography

Use this import when the app can load Google Fonts:

```css
@import url("https://fonts.googleapis.com/css2?family=Unbounded:wght@900&family=Orbitron:wght@700;800;900&family=DM+Sans:wght@400;500;700&display=swap");
```

Font roles:

- Headlines, game labels, deck titles: `"Unbounded", "Helvetica Neue", Helvetica, Arial, sans-serif`
- Body/UI copy: `"Helvetica Neue", Helvetica, Arial, sans-serif`
- App/payments/mobile UI: `"SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif`
- Numeric/game readouts when useful: `"Orbitron", "Unbounded", sans-serif`
- Dense supporting copy: `"DM Sans", "Helvetica Neue", Helvetica, Arial, sans-serif`

Type treatment:

- Use extra-bold, wide, rounded display type for major labels.
- Keep letter spacing at `0` unless matching an existing tiny uppercase label.
- Use compact line heights: `0.9` to `1.05` for huge display headings, `1.2` to `1.4` for body copy.
- Use uppercase labels sparingly for game states like `LEGENDARY`, `FREE`, `CASH OUT`, `MATCH`, `REVEAL`.

## Asset Inventory And Usage

### Core Identity

- `app-icon-purple.png` - default purple app icon.
- `app-icon-purple-black.png` - darker app icon variant.
- `app-icon-chrome.png` - chrome/black premium icon.
- `wordmark-purple-lite.png` - main wordmark for dark or purple surfaces.
- `wordmark-purple-full.png` - fuller purple wordmark treatment.
- `wordmark-chrome.png` - chrome premium wordmark for brand/deck moments.
- `wildcard-asterisk-black.png` - black asterisk mark.
- `wildcard-asterisk-arrow-black.png` - arrow/asterisk mark for spin/crash/game directions.
- `asterisk-chrome.png` - chrome asterisk for premium/chrome compositions.
- `wild-card-smile-purple.png` - smile/mascot-style brand mark.

Usage:

- Use `app-icon-purple.png` for favicon, app launcher, notification icon, and small square brand chips.
- Use `wordmark-purple-lite.png` or `wordmark-chrome.png` on brand slides, top bars, and premium splash screens.
- Use asterisk assets as hero marks, card centers, button icons, spin wheels, crash-game markers, and card backs.

### Payment Cards

- `wild-card-debit-card-purple.png` - main debit/credit card asset for Apple Pay, ecosystem, and payment screens.
- `wild-card-debit-card-purple-1.png` - alternate debit card variant.
- `card-purple-full.png` - large purple branded card for hero/cover slides.
- `card-purple-lite.png` - lighter card/brand panel, useful for Flip flow or smaller UI.
- `card-black-purple-full.png` - black/purple premium card.
- `card-black-purple-lite.png` - lighter black/purple card variant.
- `card-black-chrome-lite.png` - black/chrome premium card.
- `card-black-chrome-dark.png` - darker chrome card variant.

Usage:

- Apple Pay and wallet screens should use `wild-card-debit-card-purple.png`.
- Deck covers can rotate between `card-purple-full.png`, `card-black-purple-full.png`, and `card-black-chrome-lite.png`.
- Use black/chrome cards for premium, VIP, or dark-mode reward states.
- Keep cards floating with soft shadows and subtle y-axis motion.

### Mystery Box

- `wildcard-mystery-box-purple.png` - closed purple mystery box.
- `wildcard-mystery-box-purple-open.png` - open purple mystery box.
- `wildcard-mystery-box-black.png` - closed black/premium mystery box.
- `wildcard-mystery-box-black-open.png` - open black/premium mystery box.

Usage:

- Use purple box as the default Mystery Box flow.
- Use black box for premium, higher-risk, or "secret level" variants.
- Glow should be purple/lavender, not green.
- Opening animations should include scale, glow pulse, lid/open state transition, and prize reveal.

### Playing Cards And Freebie Cards

- `wildcard-playing-card-purple.png` - default purple card back.
- `wildcard-playing-card-black.png` - black/premium card back.
- `card-from-pack-purple-1.png` - purple card pulled from a pack.
- `card-from-pack-chrome-1.png` - chrome card pulled from a pack.

Usage:

- Use for `Find your Freebie`, card-grid, pick-a-card, and card-flip flows.
- Card backs should be arranged in a clean 2x2 or 3x2 grid.
- Winning card faces can use light lavender/white surfaces with dark text to pop.
- Text on card faces must fit; break words intentionally and scale large labels.

### Packs And Pack Opening

- `purple-pack-1.png` - purple pack asset.
- `purple-pack-2.png` - alternate purple pack.
- `chrome-pack-1.png` - chrome/premium pack.
- `card-from-pack-purple-1.png` - purple card reveal from pack.
- `card-from-pack-chrome-1.png` - chrome card reveal from pack.

Pack-opening flow direction:

- Show a sealed pack centered on a dark/purple gradient stage.
- Animate the pack with a small shake, glow, then tear/open.
- Cards should rise out of the pack one at a time with staggered scale and opacity.
- Use chrome pack/card for rare or premium reward tiers.
- Potential reward labels: `FREE`, `BOOST`, `CASH BACK`, `W*LD Points`, `MYSTERY`, `LEGENDARY`.

### Coins And Game Objects

- `wildcard-coin-purple.png` - purple coin.
- `wildcard-coin-black.png` - black premium coin.
- `purple-gradient-circle.png` - circular gradient object for wheels, tokens, and large backgrounds.
- `purple-gradient-sq.png` and `purple-gradient-sq2.png` - square gradient panels or texture blocks.
- `purple-gradient-clean.jpg` - clean full-bleed gradient background.
- `black-gradient-1.png` - dark premium gradient.
- `abstract-wildcard-purple-1.png` - abstract purple artwork/background.

Usage:

- Use coins for Flip, reward meters, balances, and small game tokens.
- Use gradient circle for Spin to Win wheels or abstract behind-the-card glows.
- Use black gradient for premium modal surfaces.

### Real-Life And Ad Images

- `wildcard-reallife-1-purple.png` - real-world Wild Card lifestyle/payment scene.
- `wildcard-reallife-2-purple.png` - alternate real-life slide/scene.
- `purple-ad-1.jpg` - purple ad creative.
- `purple-ad-boat.png` - purple ad creative with boat scene.
- `purple-ad-secret-level.jpg` - "secret level" ad creative.

Usage:

- Use these for deck slides, hero backgrounds, launch screens, and promotional moments.
- Avoid covering the central message of the artwork with UI cards.
- When image-only, center the image and keep it mostly visible in regular laptop browser heights.

### Source/Workspace Files

- `purple-ad-workspace.ai`
- `purple-gradient-workspace.ai`

These are editable design/source files. Do not import them into an app bundle.

## Layout System

### App Shell

- Background: near-black, usually `#050505`, with dark panels and purple glows.
- Use a left menu/sidebar for demos or flows.
- Primary app surface should feel full-screen and immersive.
- Hide visible scrollbars in deck/demo slides where possible.

### Cards And Panels

Use restrained border radii:

- Main app panels: `20px` to `28px`
- Buttons and pills: `999px`
- Inner cards: `14px` to `20px`
- Deck/content cards: `8px` to `22px` depending on scale

Panel styling:

```css
.wildcard-glass-panel {
  border: 1px solid rgba(255, 255, 255, 0.14);
  background:
    radial-gradient(circle at 18% 8%, rgba(185, 120, 255, 0.18), transparent 46%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.025)),
    rgba(8, 8, 14, 0.82);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.12),
    0 24px 70px rgba(0,0,0,0.42);
  backdrop-filter: blur(22px) saturate(1.25);
}
```

### Buttons

Primary actions:

```css
.wildcard-primary-button {
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 999px;
  background: linear-gradient(135deg, #f3dcff 0%, #b978ff 48%, #8b5cf6 100%);
  color: #120019;
  font-family: "Unbounded", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 900;
  box-shadow: 0 14px 38px rgba(139, 92, 246, 0.34);
}
```

Dark actions:

```css
.wildcard-dark-button {
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 999px;
  background: #050505;
  color: #ffffff;
  font-family: "Unbounded", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 900;
}
```

## Motion And Interaction

Use motion to create game feel:

- Floating cards: slow y-motion, `4s` to `6s`, ease-in-out.
- Reveals: scale from `0.92` to `1`, opacity from `0` to `1`, quick spring.
- Card flips: rotateY with 3D perspective, front/back faces.
- Mystery box: pulse glow, lid/open asset swap, prize burst.
- Scratch-off: covering layer should actually erase/reveal using canvas or clip-mask, not just slide.
- Numbers game: balls slide up and fade in sequentially, then drop/fade out together, repeat.
- Crash game: asterisk must stay centered on a curved line/path while value ticks upward quickly; sync crash state with icon and amount.
- Pack opening: pack shake, tear/open, cards rise out in staggered sequence.

Suggested timing:

```css
--wildcard-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--wildcard-ease-soft: cubic-bezier(0.22, 1, 0.36, 1);
```

## Flow-Specific Direction

### Apple Pay / Tap Flow

- Use `wild-card-debit-card-purple.png` for card artwork.
- Use purple app icon in notifications.
- Make the card large enough to inspect.
- Keep the UI feeling like a real mobile wallet/payment interaction.

### Flip

- Use a purple or black coin/card object.
- Flip can resolve into free, double, or lose states.
- Use large readable result text.
- Keep the moment fast and satisfying.

### Mystery Box

- Use `wildcard-mystery-box-purple.png` and `wildcard-mystery-box-purple-open.png`.
- Use `wildcard-mystery-box-black.png` for premium variants.
- Prize labels should include `FREE`, `Cash Back`, `Store Credit`, `W*LD Points`, and `Boost`.
- Never use "wildcard points"; use `W*LD Points`.

### Find Your Freebie / Card Grid

- Use `wildcard-playing-card-purple.png` or `wildcard-playing-card-black.png`.
- Use a 2x2 grid for simple web/B2B flows.
- Winning card face should pop in lavender/white/purple with dark text.
- Suggested helper copy: `Your freebie is in here ...`

### Spin To Win

- Use `purple-gradient-circle.png` as the wheel base.
- Use brand/merchant icons around the wheel.
- Use the asterisk arrow asset as the pointer.

### Scratch Offs

- Use purple card/back assets and a real scratch-to-reveal mask.
- Reveal boxes should uncover one by one or with user/cursor motion.
- Final reveal can show `FREE`, `BOOST`, or `W*LD Points`.

### Numbers

- Balls should slide up and fade in sequence.
- Then all balls drop and fade away before repeating.
- Avoid abrupt disappearance.

### Crash Back

- Use a dark graph panel, purple curve, and chrome/black asterisk.
- The amount should tick up with cents moving quickly.
- `Cash Out` should be a large pill button.
- Crash state should visibly sync with the asterisk and value reset.

### Pack Opening

- Use `purple-pack-1.png`, `purple-pack-2.png`, and `chrome-pack-1.png`.
- Use `card-from-pack-purple-1.png` and `card-from-pack-chrome-1.png` for revealed cards.
- The premium/chrome path should feel rarer and more dramatic.

## Copy Standards

Brand name:

- Use `wildcard` in wordmark contexts.
- Use `Wild Card` in product/body copy if a human-readable brand name is needed.

Rewards:

- Always use `W*LD Points`.
- Avoid `wildcard points` or `Wildcard points`.

Tone:

- Short, punchy, game-like.
- Examples:
  - `Every tap has a secret level.`
  - `Pick the right card.`
  - `Your freebie is in here ...`
  - `Cash Out`
  - `Full refund`
  - `Open Box`
  - `Tap to play`

## Implementation Checklist

- Replace older green/mint assets with purple folder assets.
- Replace old green color tokens with purple tokens from this guide.
- Use `app-icon-purple.png` for favicon/app icon.
- Use `wild-card-debit-card-purple.png` for Apple Pay and debit card screens.
- Use purple or black mystery boxes in Mystery Box flows.
- Use purple/black playing card backs in card-pick flows.
- Add pack-opening flow support when relevant using pack/card-from-pack assets.
- Preserve responsive fit: no clipped cards, boxes, pack tops, or huge slide overflow.
- Hide scrollbars on slide/demo surfaces when they are not part of the intended UI.
- Build and visually check key flows at desktop and laptop-height browser sizes.

