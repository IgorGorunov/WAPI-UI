import React, { useEffect, useRef, useState } from 'react';
import useGrowthProgram from '@/context/bonusProgramContext';
import Icon from '@/components/Icon';
import styles from './TierProgressCard.module.scss';

interface TierProgressCardProps {
  onScrollToCalculator?: () => void;
}

const TierProgressCard: React.FC<TierProgressCardProps> = ({ onScrollToCalculator }) => {
  const { currentTier, status, tierConfig, allTiers } = useGrowthProgram();
  const nextConfig = status.nextTier ? allTiers[status.nextTier] : null;
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const hasAnimated = useRef(false);

  // Animate progress bar from 0 → target on mount / tier change
  useEffect(() => {
    hasAnimated.current = false;
    setAnimatedWidth(0);
    const raf = requestAnimationFrame(() => {
      setTimeout(() => {
        setAnimatedWidth(Math.min(status.progressPercent, 100));
        hasAnimated.current = true;
      }, 80);
    });
    return () => cancelAnimationFrame(raf);
  }, [currentTier, status.progressPercent]);

  return (
    <div
      className={`${styles['hero-card']} ${styles[`hero-card--${currentTier.toLowerCase()}`]}`}
    >
      <div className={styles['hero-card__glow']} />

      <div className={styles['hero-card__header']}>
        <div>
          <div className={styles['hero-card__eyebrow']}>
            <span>WAPI Growth Program</span>
            {status.gracePeriodActive && (
              <span className={styles['hero-card__grace-pill']}>
                <Icon name="clock" className={styles['icon-xs']} />
                Grace Period Active (until {status.gracePeriodUntil})
              </span>
            )}
          </div>
          <h1 className={styles['hero-card__title']}>
            Bonus Services for Volume Growth
          </h1>
          <p className={styles['hero-card__subtitle']}>
            Earn free premium ER-services as your fulfillment volume grows — the more you grow with WAPI, the more value and opportunities you unlock.
          </p>
        </div>

        <div className={styles['hero-card__tier-badge-container']}>
          <div className={`${styles['tier-badge-large']} ${styles[`tier-badge-large--${currentTier.toLowerCase()}`]}`}>
            <span className={styles['tier-badge-large__caption']}>Current Status</span>
            <span className={styles['tier-badge-large__name']}>{tierConfig.level}</span>
            <span className={styles['tier-badge-large__orders']}>
              {tierConfig.minOrders.toLocaleString()} – {tierConfig.maxOrders ? `${tierConfig.maxOrders.toLocaleString()} orders/mo` : 'strategic volume'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress & Milestone Section */}
      <div className={styles['hero-card__progress-section']}>
        <div className={styles['progress-header']}>
          <div className={styles['progress-header__status']}>
            {status.nextTier ? (
              <>
                <span className={styles['progress-tag']}>Progress to Next Level</span>
                <span className={styles['progress-route']}>
                  <strong>{currentTier}</strong> → <strong>{status.nextTier}</strong>
                </span>
              </>
            ) : (
              <span className={styles['progress-tag']}>
                Top Tier Reached • All ER-Services Unlocked
              </span>
            )}
          </div>

          <div className={styles['progress-header__stats']}>
            {status.nextTier ? (
              <span>
                <strong>{status.ordersToNextTier.toLocaleString()}</strong> orders remaining
              </span>
            ) : (
              <span>Maximum strategic benefits active</span>
            )}
            <span className={styles['progress-percent']}>{status.progressPercent}%</span>
          </div>
        </div>

        <div className={styles['progress-track']}>
          <div
            className={`${styles['progress-bar']} ${styles[`progress-bar--${currentTier.toLowerCase()}`]}`}
            style={{ width: `${animatedWidth}%` }}
          />
        </div>

        {/* Milestone Callout */}
        {nextConfig && (
          <div className={styles['milestone-callout']}>
            <div className={styles['milestone-callout__left']}>
              <div className={styles['milestone-icon-wrap']}>
                <Icon name="rocket" />
              </div>
              <div>
                <span className={styles['milestone-callout__label']}>Next Level Reward:</span>
                <span className={styles['milestone-callout__text']}>
                  Reach <strong>{nextConfig.level}</strong> ({nextConfig.minOrders.toLocaleString()}+ orders) to unlock{' '}
                  <strong>{nextConfig.summary}</strong>.
                </span>
              </div>
            </div>

            {onScrollToCalculator && (
              <button
                type="button"
                className={styles['milestone-callout__action-btn']}
                onClick={onScrollToCalculator}
              >
                Estimate with Simulator →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className={styles['hero-stats-grid']}>
        <div className={styles['hero-stat-card']}>
          <span className={styles['hero-stat-card__label']}>3-Month Average Volume</span>
          <div className={styles['hero-stat-card__value-row']}>
            <span className={styles['hero-stat-card__num']}>
              {status.averageMonthlyOrders.toLocaleString()}
            </span>
            <span className={styles['hero-stat-card__unit']}>orders / mo</span>
          </div>
          <span className={styles['hero-stat-card__sub']}>
            Current month: {status.currentMonthOrders.toLocaleString()} orders
          </span>
        </div>

        {/* Focal savings card */}
        <div className={`${styles['hero-stat-card']} ${styles['hero-stat-card--savings-focal']}`}>
          <span className={styles['hero-stat-card__label']}>Monthly Free Services Value</span>
          <div className={styles['hero-stat-card__value-row']}>
            <span className={`${styles['hero-stat-card__num']} ${styles['hero-stat-card__num--savings']} ${styles['hero-stat-card__num--focal']}`}>
              €{status.estimatedMonthlySavingsEur.toLocaleString()}
            </span>
            <span className={styles['hero-stat-card__unit']}>/ month</span>
          </div>
          <span className={styles['hero-stat-card__sub']}>
            {status.estimatedMonthlySavingsEur > 0
              ? `Estimated €${(status.estimatedMonthlySavingsEur * 12).toLocaleString()} saved annually`
              : 'Unlock savings starting from Silver tier'}
          </span>
          {nextConfig && status.estimatedMonthlySavingsEur >= 0 && (
            <span className={styles['hero-stat-card__next-hint']}>
              Reach {nextConfig.level} → unlock more
            </span>
          )}
        </div>

        <div className={styles['hero-stat-card']}>
          <span className={styles['hero-stat-card__label']}>Active Bonus Services</span>
          <div className={styles['hero-stat-card__value-row']}>
            <span className={styles['hero-stat-card__num']}>
              {status.unlockedServicesCount}
            </span>
            <span className={styles['hero-stat-card__unit']}>
              of {status.totalServicesCount} included
            </span>
          </div>
          <span className={styles['hero-stat-card__sub']}>
            {status.totalServicesCount - status.unlockedServicesCount > 0
              ? `${status.totalServicesCount - status.unlockedServicesCount} additional services to unlock`
              : 'All available services unlocked'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TierProgressCard;
