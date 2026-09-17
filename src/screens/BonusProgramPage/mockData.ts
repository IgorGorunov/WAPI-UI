import { BonusTierConfig, BonusTierLevel, BonusServiceItem, ClientBonusStatus, BonusFaqItem } from "@/types/bonusProgram";

export const BONUS_TIERS_CONFIG: Record<BonusTierLevel, BonusTierConfig> = {
  Base: {
    level: 'Base',
    minOrders: 0,
    maxOrders: 100,
    label: 'Base Tier',
    badgeColor: 'var(--color-base-tier)',
    textColor: 'var(--color-base-tier-text)',
    bgGradient: 'var(--color-base-tier-gradient)',
    borderColor: 'var(--color-base-tier-border)',
    accentColor: 'var(--color-base-tier)',
    summary: 'Standard fulfillment operations & fundamental support',
    features: [
      'Standard WAPI fulfillment network across Europe',
      'Basic SLA support via ticketing system',
      'Standard warehouse storage & inventory sync',
      'Pay-per-use access to advanced ER tools'
    ]
  },
  Silver: {
    level: 'Silver',
    minOrders: 101,
    maxOrders: 1000,
    label: 'Silver Tier',
    badgeColor: 'var(--color-silver-tier)',
    textColor: 'var(--color-silver-tier-text)',
    bgGradient: 'var(--color-silver-tier-gradient)',
    borderColor: 'var(--color-silver-tier-border)',
    accentColor: 'var(--color-silver-tier)',
    summary: 'Free WAPI Checker Standard verification for all your WAPI shipments',
    features: [
      'All Base fulfillment features',
      'WAPI Checker Standard included FREE (€120/mo value)',
      'Automated phone number check & delivery zone scoring (Green, Yellow, Red, Grey)',
      'Automatic Allow/Block rules to prevent shipping to risky buyers'
    ]
  },
  Gold: {
    level: 'Gold',
    minOrders: 1001,
    maxOrders: 3500,
    label: 'Gold Tier',
    badgeColor: 'var(--color-gold-tier)',
    textColor: 'var(--color-gold-tier-text)',
    bgGradient: 'var(--color-gold-tier-gradient)',
    borderColor: 'var(--color-gold-tier-border)',
    accentColor: 'var(--color-gold-tier)',
    summary: 'WAPI Checker Advanced with buyer buyout % and extended order statistics',
    features: [
      'All Silver tier benefits included',
      'WAPI Checker Advanced included FREE (€350/mo value)',
      'Buyer buyout rate (%) and delivery success/failure statistics',
      'Customer average check value, item counts, and previously ordered product types'
    ]
  },
  Platinum: {
    level: 'Platinum',
    minOrders: 3501,
    maxOrders: 7000,
    label: 'Platinum Tier',
    badgeColor: 'var(--color-platinum-tier)',
    textColor: 'var(--color-platinum-tier-text)',
    bgGradient: 'var(--color-platinum-tier-gradient)',
    borderColor: 'var(--color-platinum-tier-border)',
    accentColor: 'var(--color-platinum-tier)',
    summary: 'AI Call Center & Extended Support for high-velocity brands',
    features: [
      'All Gold tier benefits included',
      'AI Interactive Call Center included FREE (€650/mo value)',
      'Omnichannel order confirmation & AI voice call bots',
      'Extended Priority Support & faster SLA response'
    ]
  },
  VIP: {
    level: 'VIP',
    minOrders: 7001,
    maxOrders: null,
    label: 'VIP Strategic',
    badgeColor: 'var(--color-vip-tier)',
    textColor: 'var(--color-vip-tier-text)',
    bgGradient: 'var(--color-vip-tier-gradient)',
    borderColor: 'var(--color-vip-tier-border)',
    accentColor: 'var(--color-vip-tier)',
    summary: 'Comprehensive ER-ecosystem & Payment by Link',
    features: [
      'Full WAPI ER-Services suite included (€1,500+/mo value)',
      'Payment by Link integration (instant COD prepayment)',
      'WAPI Checker Detailed with per-product category buyout stats & last order date',
      '24/7 Priority SLA',
      'Custom fulfillment pricing & tailored packaging SLAs'
    ]
  }
};

export const BONUS_SERVICES_CATALOG: BonusServiceItem[] = [
  {
    id: 'wapi-checker-standard',
    name: 'WAPI Checker Standard',
    subtitle: 'Delivery Zone Scoring & Anti-Fraud Rules',
    description: 'Checks customer phone numbers against delivery history to classify orders into Green, Yellow, Red, or Grey zones and automatically execute Allow/Block actions before shipping.',
    category: 'Anti-Fraud',
    unlockTier: 'Silver',
    isUnlocked: true,
    valuePerMonthEur: 120,
    badgeText: 'Included in Silver+',
    routeLink: '/wapi-checker/settings',
    iconName: 'check',
    benefits: [
      'Automated phone number check against historical delivery zones',
      'Configurable Allow / Block action triggers based on risk thresholds',
      'Available directly in WAPI order management & settings'
    ]
  },
  {
    id: 'wapi-checker-advanced',
    name: 'WAPI Checker Advanced',
    subtitle: 'Buyer Buyout % & Extended Order History',
    description: 'Extends standard checks with complete buyer order statistics, historical buyout rate percentage, average check value, item quantities, and previously ordered product categories.',
    category: 'Anti-Fraud',
    unlockTier: 'Gold',
    isUnlocked: true,
    valuePerMonthEur: 350,
    badgeText: 'Included in Gold+',
    routeLink: '/wapi-checker/settings',
    iconName: 'big-check',
    benefits: [
      'Exact historical buyout rate (%) and success vs failure counts',
      'Customer average check amount (€) and average products per order',
      'List of product categories previously ordered by the customer'
    ]
  },
  {
    id: 'ai-contact-center',
    name: 'AI Call Center',
    subtitle: 'Intelligent Interactive Confirmation Bot',
    description: 'Autonomous voice and chat AI agent that contacts clients to verify delivery addresses, confirm COD orders, and schedule courier pickups.',
    category: 'AI & Communication',
    unlockTier: 'Platinum',
    isUnlocked: false,
    valuePerMonthEur: 650,
    badgeText: 'Unlocks at Platinum (3,501+)',
    iconName: 'message',
    benefits: [
      'Multi-language conversational AI voice bots',
      'Automated WhatsApp & SMS delivery reminders',
      'Boosts delivery buyout rate by 12–18%'
    ]
  },
  {
    id: 'extended-support',
    name: 'Extended Support & Priority SLA',
    subtitle: 'High-Priority Dispatch & Dedicated Desk',
    description: 'Shortened response times, dedicated ticket routing, priority warehouse processing windows, and quarterly operational reviews.',
    category: 'Support & SLA',
    unlockTier: 'Platinum',
    isUnlocked: false,
    valuePerMonthEur: 250,
    badgeText: 'Unlocks at Platinum (3,501+)',
    iconName: 'ticket',
    benefits: [
      '< 1-hour ticket response time SLA',
      'Priority order queueing during peak seasons (Q4)',
      'Dedicated logistics operations specialist'
    ]
  },
  {
    id: 'payment-by-link',
    name: 'Payment by Link',
    subtitle: 'Seamless Prepayment & COD Conversion',
    description: 'Enables buyers to convert COD orders into prepaid card transactions via branded secure links sent over SMS, WhatsApp, and email.',
    category: 'Payments',
    unlockTier: 'VIP',
    isUnlocked: false,
    valuePerMonthEur: 450,
    badgeText: 'Unlocks at VIP (7,001+)',
    iconName: 'finances',
    benefits: [
      'Converts 20–35% of risky COD orders into prepayments',
      'Supports Apple Pay, Google Pay, Visa & Mastercard',
      'Instant payout reconciliation in WAPI finances'
    ]
  },
  {
    id: 'wapi-checker-detailed',
    name: 'WAPI Checker Detailed & Custom SLA',
    subtitle: 'Per-Product Category Statistics & Last Order Date',
    description: 'Provides granular per-product breakdown tables with individual buyout % per item type, product matching indicator for current orders, date of last order, and tailored SLAs.',
    category: 'Anti-Fraud',
    unlockTier: 'VIP',
    isUnlocked: false,
    valuePerMonthEur: 550,
    badgeText: 'Unlocks at VIP (7,001+)',
    iconName: 'gala-settings',
    benefits: [
      'Per-product category statistics table with category-specific buyout %',
      'Product matching check (verifies if customer ordered this item type before)',
      'Timestamp of buyer\'s last recorded order across the network'
    ]
  }
];

export const MOCK_CLIENT_STATUSES: Record<BonusTierLevel, ClientBonusStatus> = {
  Base: {
    clientName: 'Demo Client',
    currentTier: 'Base',
    averageMonthlyOrders: 78,
    currentMonthOrders: 92,
    nextTier: 'Silver',
    ordersToNextTier: 9,
    progressPercent: 78,
    gracePeriodActive: false,
    estimatedMonthlySavingsEur: 0,
    unlockedServicesCount: 0,
    totalServicesCount: 6
  },
  Silver: {
    clientName: 'Demo Client',
    currentTier: 'Silver',
    averageMonthlyOrders: 640,
    currentMonthOrders: 710,
    nextTier: 'Gold',
    ordersToNextTier: 361,
    progressPercent: 64,
    gracePeriodActive: false,
    estimatedMonthlySavingsEur: 120,
    unlockedServicesCount: 1,
    totalServicesCount: 6
  },
  Gold: {
    clientName: 'Demo Client',
    currentTier: 'Gold',
    averageMonthlyOrders: 2450,
    currentMonthOrders: 2680,
    nextTier: 'Platinum',
    ordersToNextTier: 1051,
    progressPercent: 70,
    gracePeriodActive: true,
    gracePeriodUntil: '30 Nov 2026',
    estimatedMonthlySavingsEur: 470,
    unlockedServicesCount: 2,
    totalServicesCount: 6
  },
  Platinum: {
    clientName: 'Demo Client',
    currentTier: 'Platinum',
    averageMonthlyOrders: 5400,
    currentMonthOrders: 5820,
    nextTier: 'VIP',
    ordersToNextTier: 1601,
    progressPercent: 77,
    gracePeriodActive: false,
    estimatedMonthlySavingsEur: 1370,
    unlockedServicesCount: 4,
    totalServicesCount: 6
  },
  VIP: {
    clientName: 'Demo Client',
    currentTier: 'VIP',
    averageMonthlyOrders: 9250,
    currentMonthOrders: 9800,
    nextTier: null,
    ordersToNextTier: 0,
    progressPercent: 100,
    gracePeriodActive: false,
    estimatedMonthlySavingsEur: 2370,
    unlockedServicesCount: 6,
    totalServicesCount: 6
  }
};

export const BONUS_PROGRAM_FAQS: BonusFaqItem[] = [
  {
    question: 'How is my monthly tier level determined?',
    answer: 'Your tier is calculated automatically based on your average monthly fulfilled order volume over the trailing 3 calendar months. This rolling calculation ensures fair assessment that isn’t penalized by short-term weekly fluctuations.',
    tag: 'Calculations'
  },
  {
    question: 'What is the seasonal Grace Period?',
    answer: 'We understand that e-commerce experiences seasonal demand shifts. If your volume temporarily dips below your tier threshold, our 60-day Grace Period keeps your tier status and all unlocked ER-services active while you ramp back up.',
    tag: 'Retention'
  },
  {
    question: 'Why do we receive free ER-services instead of fulfillment discounts?',
    answer: 'Rather than minor price cuts that erode service quality, the Bonus Program delivers substantial operational value. High-performing tools like WAPI Checker and AI Call Center directly reduce returns, eliminate fraud, and accelerate your brand growth.',
    tag: 'Philosophy'
  },
  {
    question: 'How do I activate my unlocked services?',
    answer: 'Services like WAPI Checker Standard and Advanced activate immediately in your cabinet under the WAPI Checker menu. Advanced services such as AI Call Center and Payment by Link can be configured with one click or with assistance from your dedicated CSM.',
    tag: 'Activation'
  },
  {
    question: 'Can I route external fulfillment volume to WAPI to reach a higher tier faster?',
    answer: 'Yes! Consolidating your operations with WAPI is the fastest way to unlock our highest tiers. Speak to your Account Manager to map out an easy migration of additional product lines or regional stores.',
    tag: 'Scaling'
  }
];
