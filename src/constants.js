import appIconGreen from '../wildcard-master-assets/app-icon-green.png'
import cardGreenLite from '../wildcard-master-assets/card-green-lite.png'
import wordmarkGreenLite from '../wildcard-master-assets/wordmark-green-lite.png'
import wildcardCoinGreen from '../wildcard-master-assets/wildcard-coin-green.png'
import wildcardMysteryBox from '../wildcard-master-assets/wildcard-mystery-box.png'
import wildcardMysteryBoxOpen from '../wildcard-master-assets/wildcard-mystery-box-open.png'
import wildcardPlayingCardGreen from '../wildcard-master-assets/wildcard-playing-card-green.png'

export const DemoTab = {
  mobile: 'mobile',
  mystery: 'mystery',
  dice: 'dice',
  revenue: 'revenue',
  pitchDeck: 'pitch_deck',
  howItWorks: 'how_it_works',
  b2bOld: 'b2b_old',
  b2bNew: 'b2b_new',
  webB2b: 'web_b2b',
  fortuneCookieWeb: 'fortune_cookie_web',
  webB2bCards: 'web_b2b_cards',
  fortuneWeb: 'fortune_web',
}

export const DemoState = {
  start: 'start',
  account: 'account',
  paymentCardIntro: 'payment_card_intro',
  paymentProcessing: 'payment_processing',
  paymentSuccess: 'payment_success',
  paymentNotification: 'payment_notification',
  tailsOffer: 'tails_offer',
  coinFlipping: 'coin_flipping',
  result: 'result',
  doubleResult: 'double_result',
}

export const MysteryState = {
  start: 'mystery_start',
  paymentCardIntro: 'mystery_payment_card_intro',
  paymentProcessing: 'mystery_payment_processing',
  paymentNotification: 'mystery_payment_notification',
  offer: 'mystery_offer',
  checkout: 'mystery_checkout',
  checkoutProcessing: 'mystery_checkout_processing',
  readyToOpen: 'mystery_ready_to_open',
  opening: 'mystery_opening',
  result: 'mystery_result',
}

export const DiceState = {
  start: 'dice_start',
  paymentCardIntro: 'dice_payment_card_intro',
  paymentProcessing: 'dice_payment_processing',
  paymentNotification: 'dice_payment_notification',
  offer: 'dice_offer',
  checkout: 'dice_checkout',
  checkoutProcessing: 'dice_checkout_processing',
  readyToOpen: 'dice_ready_to_open',
  opening: 'dice_opening',
  result: 'dice_result',
}

export const B2BState = {
  start: 'b2b_start',
  paymentCardIntro: 'b2b_payment_card_intro',
  paymentProcessing: 'b2b_payment_processing',
  paymentNotification: 'b2b_payment_notification',
  offer: 'b2b_offer',
  checkout: 'b2b_checkout',
  checkoutProcessing: 'b2b_checkout_processing',
  readyToOpen: 'b2b_ready_to_open',
  opening: 'b2b_opening',
  result: 'b2b_result',
}

export const WebB2BState = {
  product:           'web_b2b_product',
  checkout:          'web_b2b_checkout',
  processing:        'web_b2b_processing',        // auto → confirmed (1.5 s)
  confirmed:         'web_b2b_confirmed',          // order confirmed + mystery offer
  mysteryCheckout:   'web_b2b_mystery_checkout',   // payment modal open
  mysteryProcessing: 'web_b2b_mystery_processing', // auto → readyToOpen (1.5 s)
  readyToOpen:       'web_b2b_ready_to_open',
  opening:           'web_b2b_opening',            // auto → result (~2.5 s)
  result:            'web_b2b_result',
}

export const FortuneWebState = {
  product:            'fw_product',
  checkout:           'fw_checkout',
  processing:         'fw_processing',
  confirmed:          'fw_confirmed',
  fortuneCheckout:    'fw_fortune_checkout',
  fortuneProcessing:  'fw_fortune_processing',
  pickColor:          'fw_pick_color',
  animatingColor:     'fw_animating_color',
  pickNumber:         'fw_pick_number',
  animatingNumber:    'fw_animating_number',
  pickFlap:           'fw_pick_flap',
  result:             'fw_result',
}

export const WebB2BCardsState = {
  product:         'web_b2b_cards_product',
  checkout:        'web_b2b_cards_checkout',
  processing:      'web_b2b_cards_processing',
  confirmed:       'web_b2b_cards_confirmed',
  cardsCheckout:   'web_b2b_cards_checkout_modal',
  cardsProcessing: 'web_b2b_cards_processing_modal',
  readyToPick:     'web_b2b_cards_ready_to_pick',
  picking:         'web_b2b_cards_picking',
  result:          'web_b2b_cards_result',
}

export const TIMINGS = {
  cardIntroMs: 900,
  processingMs: 1500,
  paymentSuccessMs: 900,
  coinFlipMs: 3000,
  mysteryOpeningMs: 1800,
}

export const ASSETS = {
  card: cardGreenLite,
  coin: wildcardCoinGreen,
  logo: wordmarkGreenLite,
  logoCard: cardGreenLite,
  appIcon: appIconGreen,
  mysteryBox: wildcardMysteryBox,
  mysteryBoxOpen: wildcardMysteryBoxOpen,
  mysteryBoxLight: wildcardMysteryBox,
  fortuneCookie: './fortune-cookie.png',
  fortuneCookieOpen: './fortune-ccokie-open.png',
  tailsCardBack: wildcardPlayingCardGreen,
  diceBox: './dice-box.png',
  nikeCheckout: './nike-checkout.PNG',
  applePayMobileWeb: './apple-pay-mobile-web.PNG',
  omniluxProduct: './omnilux-contour.jpg',
  omniluxLogo: './omnilux-logo.svg',
}

export const SCREEN_TRANSITION = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
}
