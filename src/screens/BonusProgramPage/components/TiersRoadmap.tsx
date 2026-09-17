import React from 'react';
import useBonusProgram from '@/context/bonusProgramContext';
import Icon, { IconType } from '@/components/Icon';
import styles from './TiersRoadmap.module.scss';

const TIER_ORDER: Record<string, number> = {
  Base: 0, Silver: 1, Gold: 2, Platinum: 3, VIP: 4,
};

const TIER_ICONS: Record<string, IconType> = {
  Base: 'shield',
  Silver: 'star',
  Gold: 'medal',
  Platinum: 'diamond',
  VIP: 'crown',
};

const GROWTH_STEPS: Array<{
  num: string;
  icon: IconType;
  colorClass: string;
  title: string;
  desc: string;
}> = [
  {
    num: '01',
    icon: 'warehouse',
    colorClass: 'step-1',
    title: 'Concentrate Fulfillment',
    desc: 'Route all European orders to WAPI',
  },
  {
    num: '02',
    icon: 'trending-up',
    colorClass: 'step-2',
    title: 'Elevate Your Tier',
    desc: 'Advance to Silver, Gold, Platinum, VIP',
  },
  {
    num: '03',
    icon: 'lightning-bolt',
    colorClass: 'step-3',
    title: 'Activate ER-Services',
    desc: 'Get WAPI Checker, AI & Payment links free',
  },
  {
    num: '04',
    icon: 'rocket',
    colorClass: 'step-4',
    title: 'Scale Profit & Retention',
    desc: 'Reduce returns, boost buyouts & grow volume',
  },
];

const TiersRoadmap: React.FC = () => {
  const { currentTier, status, allTiers } = useBonusProgram();
  const tiersList = Object.values(allTiers);
  const currentRank = TIER_ORDER[currentTier];

  return (
    <div className={styles['roadmap-section']}>
      <div className={styles['section-header']}>
        <div>
          <h2 className={styles['section-title']}>Bonus Tiers & Thresholds</h2>
          <p className={styles['section-subtitle']}>
            Transparent volume milestones designed to reward scale, stability, and operational partnership.
          </p>
        </div>
      </div>

      {/* 5-Column Tier Cards with next-tier arrow */}
      <div className={styles['roadmap-grid-wrapper']}>
        {tiersList.map((tier, idx) => {
          const isCurrent = currentTier === tier.level;
          const isNext = status.nextTier === tier.level;
          const isVip = tier.level === 'VIP';
          const showArrow = idx < tiersList.length - 1;

          return (
            <React.Fragment key={tier.level}>
              <div
                className={`${styles['roadmap-card']} ${styles[`roadmap-card--${tier.level.toLowerCase()}`]} ${
                  isCurrent ? styles['roadmap-card--current'] : ''
                } ${isNext ? styles['roadmap-card--next'] : ''} ${isVip ? styles['roadmap-card--vip-shine'] : ''}`}
              >
                {isVip && <div className={styles['roadmap-card__vip-shimmer']} aria-hidden="true" />}
                {isCurrent && (
                  <div className={styles['roadmap-card__current-pill']}>
                    <Icon name="biggest-check" className={styles['icon-xs']} /> Your Current Tier
                  </div>
                )}
                {isNext && (
                  <div className={styles['roadmap-card__next-pill']}>
                    <Icon name="target" className={styles['icon-xs']} /> Next Goal
                  </div>
                )}
                {isVip && !isCurrent && !isNext && (
                  <div className={styles['roadmap-card__vip-pill']}>
                    <Icon name="crown" className={styles['icon-xs']} /> Top Tier
                  </div>
                )}

                <div className={styles['roadmap-card__header']}>
                  <h3 className={styles['roadmap-card__name']}>
                    {TIER_ICONS[tier.level] && (
                      <Icon
                        name={TIER_ICONS[tier.level]}
                        className={styles['roadmap-card__tier-icon']}
                      />
                    )}
                    <span>{tier.level}</span>
                  </h3>
                  <div className={styles['roadmap-card__condition']}>
                    {tier.minOrders === 0
                      ? `Up to ${tier.maxOrders} orders`
                      : tier.maxOrders
                      ? `${tier.minOrders.toLocaleString()} – ${tier.maxOrders.toLocaleString()} orders`
                      : `from ${tier.minOrders.toLocaleString()} orders`}
                  </div>
                  <p className={styles['roadmap-card__summary']}>{tier.summary}</p>
                </div>

                <div className={styles['roadmap-card__body']}>
                  <span className={styles['roadmap-card__features-title']}>Included Privileges:</span>
                  <ul>
                    {tier.features.map((feat, i) => (
                      <li key={i}>
                        <Icon name="check" className={styles['feat-check']} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {showArrow && (
                <div
                  className={`${styles['roadmap-arrow']} ${
                    isCurrent ? styles['roadmap-arrow--active'] : ''
                  }`}
                >
                  →
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Principle Callout: Value vs Discount */}
      <div className={styles['principle-banner']}>
        <div className={styles['principle-banner__badge']}>Core Principle</div>
        <h3 className={styles['principle-banner__title']}>
          A Compounding Growth Ecosystem
        </h3>
        <p className={styles['principle-banner__text']}>
          Every additional service is an earned operational advantage directly tied to your volume. We protect fulfillment quality and inject cutting-edge tools into your business so you scale faster.
        </p>

        <div className={styles['principle-comparison']}>
          <div className={styles['principle-box-no']}>
            <span className={styles['principle-box-tag']}>Traditional Vendor</span>
            <h4>Price Discounts</h4>
            <p>
              Cuts fulfillment rates slightly, reducing support quality and leading to hidden charges without improving conversion.
            </p>
          </div>

          <div className={styles['principle-box-yes']}>
            <span className={styles['principle-box-tag']}>WAPI Bonus Program</span>
            <h4>Value Maximization</h4>
            <p>
              Maintains first-class fulfillment SLAs while equipping your brand with free proprietary fraud defense, contact center, and instant payment tools.
            </p>
          </div>
        </div>

        {/* Decorative Growth Flow */}
        <div className={styles['growth-flow']}>
          {GROWTH_STEPS.map((step, idx) => (
            <React.Fragment key={step.num}>
              <div className={`${styles['growth-flow__step']} ${styles[`growth-flow__step--${step.colorClass}`]}`}>
                <div className={styles['growth-flow__header']}>
                  <div className={styles['growth-flow__icon-box']}>
                    <Icon name={step.icon} className={styles['growth-flow__icon']} />
                  </div>
                  <span className={styles['growth-flow__step-num']}>{step.num}</span>
                </div>
                <h4 className={styles['growth-flow__title']}>{step.title}</h4>
                <p className={styles['growth-flow__desc']}>{step.desc}</p>
              </div>

              {idx < GROWTH_STEPS.length - 1 && (
                <div className={styles['growth-flow__arrow']}>
                  <span className={styles['growth-flow__arrow-horiz']}>→</span>
                  <span className={styles['growth-flow__arrow-vert']}>↓</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TiersRoadmap;
