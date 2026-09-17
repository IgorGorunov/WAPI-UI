import React from 'react';
import { BonusTierLevel } from '@/types/bonusProgram';
import useGrowthProgram from '@/context/bonusProgramContext';
import styles from './TierDemoSwitcher.module.scss';

const TIERS: BonusTierLevel[] = ['Base', 'Silver', 'Gold', 'Platinum', 'VIP'];

const TierDemoSwitcher: React.FC = () => {
  const { currentTier, setCurrentTier } = useGrowthProgram();

  return (
    <div className={styles['demo-switcher']}>
      <div className={styles['demo-switcher__header']}>
        <div className={styles['demo-switcher__label']}>
          <span className={styles['demo-switcher__badge']}>Draft Mode</span>
          <span>Simulate Client Tier:</span>
        </div>
        <div className={styles['demo-switcher__buttons']}>
          {TIERS.map((tier) => {
            const isActive = currentTier === tier;
            return (
              <button
                key={tier}
                type="button"
                className={`${styles['demo-switcher__btn']} ${
                  styles[`demo-switcher__btn--${tier.toLowerCase()}`]
                } ${isActive ? styles['demo-switcher__btn--active'] : ''}`}
                onClick={() => setCurrentTier(tier)}
              >
                {tier}
              </button>
            );
          })}
        </div>
      </div>
      {/*<p className={styles['demo-switcher__hint']}>*/}
      {/*  Select a tier above to preview how the cabinet appears for clients at different order volume levels.*/}
      {/*  Real backend metrics will replace this mock data automatically.*/}
      {/*</p>*/}
    </div>
  );
};

export default TierDemoSwitcher;
