export enum BONUS_TIER_TYPE {
  Base = 'Base',
  Silver = 'Silver',
  Gold = 'Gold',
  Platinum = 'Platinum',
  VIP = 'VIP',
}

export type BonusTierLevel = keyof typeof BONUS_TIER_TYPE; //'Base' | 'Silver' | 'Gold' | 'Platinum' | 'VIP';

export interface BonusTierConfig {
  level: BonusTierLevel;
  minOrders: number;
  maxOrders: number | null;
  label: string;
  badgeColor: string;
  textColor: string;
  bgGradient: string;
  borderColor: string;
  accentColor: string;
  summary: string;
  features: string[];
}

export interface BonusServiceItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  category: 'Anti-Fraud' | 'AI & Communication' | 'Payments' | 'Support & SLA' | 'Fulfillment';
  unlockTier: BonusTierLevel;
  isUnlocked: boolean;
  valuePerMonthEur: number;
  badgeText: string;
  routeLink?: string;
  iconName: string;
  benefits: string[];
}

export interface ClientBonusStatus {
  clientName: string;
  currentTier: BonusTierLevel;
  averageMonthlyOrders: number;
  currentMonthOrders: number;
  nextTier: BonusTierLevel | null;
  ordersToNextTier: number;
  progressPercent: number;
  gracePeriodActive: boolean;
  gracePeriodUntil?: string;
  estimatedMonthlySavingsEur: number;
  unlockedServicesCount: number;
  totalServicesCount: number;
}

export interface BonusFaqItem {
  question: string;
  answer: string;
  tag?: string;
}
