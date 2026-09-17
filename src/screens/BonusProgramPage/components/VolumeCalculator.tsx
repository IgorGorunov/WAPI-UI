import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import useGrowthProgram from '@/context/bonusProgramContext';
import { BonusTierLevel } from '@/types/bonusProgram';
import Icon, { IconType } from '@/components/Icon';
import styles from './VolumeCalculator.module.scss';
import Button from "@/components/Button/Button";

const TIER_ICONS: Record<string, IconType> = {
  Base: 'shield',
  Silver: 'star',
  Gold: 'medal',
  Platinum: 'diamond',
  VIP: 'crown',
};

const TIER_COLORS: Record<BonusTierLevel, string> = {
  Base: 'var(--color-base-tier)',
  Silver: 'var(--color-silver-tier)',
  Gold: 'var(--color-gold-tier)',
  Platinum: 'var(--color-platinum-tier)',
  VIP: 'var(--color-vip-tier)',
};

const VolumeCalculator: React.FC = () => {
  const router = useRouter();
  const { status, allTiers, services } = useGrowthProgram();
  const [simulatedOrders, setSimulatedOrders] = useState<number>(status.averageMonthlyOrders || 2500);

  // Determine which tier the simulated orders would unlock
  const simulatedTier: BonusTierLevel = useMemo(() => {
    if (simulatedOrders >= 7001) return 'VIP';
    if (simulatedOrders >= 3501) return 'Platinum';
    if (simulatedOrders >= 1001) return 'Gold';
    if (simulatedOrders >= 101) return 'Silver';
    return 'Base';
  }, [simulatedOrders]);

  const simulatedConfig = allTiers[simulatedTier];
  const fillPercentage = Math.min(100, Math.max(0, (simulatedOrders / 10000) * 100));
  const activeTierColor = TIER_COLORS[simulatedTier];

  // Calculate unlocked services under simulated tier
  const tierOrder: Record<BonusTierLevel, number> = {
    Base: 0,
    Silver: 1,
    Gold: 2,
    Platinum: 3,
    VIP: 4
  };

  const unlockedUnderSimulation = useMemo(() => {
    const targetRank = tierOrder[simulatedTier];
    return services.filter(s => targetRank >= tierOrder[s.unlockTier]);
  }, [simulatedTier, services]);

  const estimatedSavings = useMemo(() => {
    return unlockedUnderSimulation.reduce((sum, s) => sum + s.valuePerMonthEur, 0);
  }, [unlockedUnderSimulation]);

  return (
    <div id="volume-calculator" className={styles['calculator-section']}>
      <div className={styles['section-header']}>
        <div>
          <h2 className={styles['section-title']}>Volume & Savings Simulator</h2>
          <p className={styles['section-subtitle']}>
            Slide or enter your target monthly fulfilled orders to see which tier and free services you unlock.
          </p>
        </div>
      </div>

      <div className={styles['calculator-card']}>
        <div className={styles['calculator-controls']}>
          <div className={styles['calculator-input-row']}>
            <label htmlFor="volume-slider" className={styles['calculator-label']}>
              Target Monthly Orders
            </label>
            <div className={styles['calculator-number-box']}>
              <input
                id="volume-input"
                type="number"
                min="0"
                max="15000"
                step="10"
                value={simulatedOrders}
                onChange={(e) => setSimulatedOrders(Math.max(0, parseInt(e.target.value) || 0))}
                className={styles['calculator-number-input']}
                style={{ '--input-tier-color': activeTierColor } as React.CSSProperties}
              />
              <span className={styles['calculator-number-unit']}>orders / mo</span>
            </div>
          </div>

          <div className={styles['slider-wrap']}>
            <input
              id="volume-slider"
              type="range"
              min="0"
              max="10000"
              step="10"
              value={simulatedOrders}
              onChange={(e) => setSimulatedOrders(parseInt(e.target.value))}
              className={styles['slider']}
              style={{
                '--slider-color': activeTierColor,
                background: `linear-gradient(to right, ${activeTierColor} 0%, ${activeTierColor} ${fillPercentage}%, var(--color-gray2) ${fillPercentage}%, var(--color-gray2) 100%)`
              } as React.CSSProperties}
            />
            <div className={styles['slider-ticks']}>
              <button type="button" className={`${styles['tier-tick']} ${styles['tier-tick--base']}`} onClick={() => setSimulatedOrders(50)}>Base</button>
              <button type="button" className={`${styles['tier-tick']} ${styles['tier-tick--silver']}`} onClick={() => setSimulatedOrders(550)}>Silver 101+</button>
              <button type="button" className={`${styles['tier-tick']} ${styles['tier-tick--gold']}`} onClick={() => setSimulatedOrders(2000)}>Gold 1k+</button>
              <button type="button" className={`${styles['tier-tick']} ${styles['tier-tick--platinum']}`} onClick={() => setSimulatedOrders(5000)}>Platinum 3.5k+</button>
              <button type="button" className={`${styles['tier-tick']} ${styles['tier-tick--vip']}`} onClick={() => setSimulatedOrders(8500)}>VIP 7k+</button>
            </div>
          </div>
        </div>

        {/* Results Showcase */}
        <div className={styles['calculator-results']}>
          <div className={styles['calculator-results__tier-box']}>
            <span className={styles['result-caption']}>Achieved Tier:</span>
            <div className={`${styles['result-tier-pill']} ${styles[`tier-${simulatedTier.toLowerCase()}`]}`}>
              {TIER_ICONS[simulatedConfig.level] && (
                <Icon name={TIER_ICONS[simulatedConfig.level]} className={styles['result-tier-icon']} />
              )}
              <span>{simulatedConfig.level}</span>
            </div>
            <p className={styles['result-tier-summary']}>{simulatedConfig.summary}</p>
          </div>

          <div className={styles['calculator-results__savings-box']}>
            <span className={styles['result-caption']}>Estimated Free Software & Service Value:</span>
            <div className={styles['savings-num']}>
              €{estimatedSavings.toLocaleString()}
              <span>/ month</span>
            </div>
            <span className={styles['savings-annual']}>
              €{(estimatedSavings * 12).toLocaleString()} annual software & operations value
            </span>
          </div>
        </div>

        {/* Unlocked Services List */}
        <div className={styles['calculator-unlocked-list']}>
          <span className={styles['unlocked-list-title']}>
            Services Included Free at {simulatedTier} Tier ({unlockedUnderSimulation.length} of {services.length}):
          </span>

          <div className={styles['unlocked-chips']}>
            {unlockedUnderSimulation.length === 0 ? (
              <span className={styles['no-services-chip']}>
                Standard fulfillment operations included. Increase volume to 101+ orders to unlock WAPI Checker Standard.
              </span>
            ) : (
              unlockedUnderSimulation.map((s) => (
                <div key={s.id} className={styles['unlocked-chip']}>
                  <Icon name="check" className={styles['icon-xs']} />
                  <span className={styles['unlocked-chip-name']}>{s.name}</span>
                  <span className={styles['unlocked-chip-val']}>(€{s.valuePerMonthEur}/mo)</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upsell / CSM Contact Card */}
        <div className={styles['calculator-cta']}>
          <div className={styles['calculator-cta__text']}>
            <strong>Ready to consolidate volume with WAPI?</strong>
            <p>
              Move external orders or new marketplaces to WAPI. Your Account Manager will help calculate exact bundle savings and create a smooth onboarding roadmap.
            </p>
          </div>
          <Button
            classNames={styles['calculator-cta__btn']}
            onClick={() => console.log('discuss migration')}
          >
            Discuss Migration with CSM
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VolumeCalculator;


// onClick={() => router.push('/tickets?filter=Has new messages')}