import React, { useState } from 'react';
import { useRouter } from 'next/router';
import useBonusProgram from '@/context/bonusProgramContext';
import { BonusServiceItem, BonusTierLevel } from '@/types/bonusProgram';
import Icon from '@/components/Icon';
import Modal from '@/components/Modal';
import styles from './ServicesOverview.module.scss';
import Button from "@/components/Button/Button";

type FilterType = 'ALL' | 'UNLOCKED' | 'LOCKED';

const TIER_ORDER: Record<BonusTierLevel, number> = {
  Base: 0,
  Silver: 1,
  Gold: 2,
  Platinum: 3,
  VIP: 4,
};

const ServicesOverview: React.FC = () => {
  const router = useRouter();
  const { services, currentTier, status, allTiers } = useBonusProgram();
  const [selectedService, setSelectedService] = useState<BonusServiceItem | null>(null);
  const [filter, setFilter] = useState<FilterType>('ALL');

  const handleServiceAction = (service: BonusServiceItem) => {
    if (service.routeLink && service.isUnlocked) {
      router.push(service.routeLink);
    } else {
      setSelectedService(service);
    }
  };

  const unlockedCount = services.filter((s) => s.isUnlocked).length;
  const lockedCount = services.length - unlockedCount;

  // Filtered services
  const filteredServices = services.filter((service) => {
    if (filter === 'UNLOCKED') return service.isUnlocked;
    if (filter === 'LOCKED') return !service.isUnlocked;
    return true;
  });

  // Calculate percentage of progress towards unlocking a specific tier
  const progressToTier = (unlockTier: BonusTierLevel): number => {
    const unlockMin = allTiers[unlockTier].minOrders;
    const currentMin = allTiers[currentTier].minOrders;
    const avg = status.averageMonthlyOrders;
    if (avg >= unlockMin) return 100;
    if (unlockMin <= currentMin) return 100;
    return Math.max(0, Math.round(((avg - currentMin) / (unlockMin - currentMin)) * 100));
  };

  return (
    <div className={styles['services-section']}>
      <div className={styles['section-header']}>
        <div className={styles['section-header__text']}>
          <h2 className={styles['section-title']}>Your ER-Services Hub</h2>
          <p className={styles['section-subtitle']}>
            High-value proprietary tools to protect margins, eliminate returns, and accelerate growth — included free as your volume scales.
          </p>
        </div>

        {/* Filter Pills */}
        <div className={styles['filter-bar']}>
          <button
            type="button"
            className={`${styles['filter-btn']} ${filter === 'ALL' ? styles['filter-btn--active'] : ''}`}
            onClick={() => setFilter('ALL')}
          >
            All Services <span className={styles['filter-btn__count']}>{services.length}</span>
          </button>
          <button
            type="button"
            className={`${styles['filter-btn']} ${filter === 'UNLOCKED' ? styles['filter-btn--active'] : ''}`}
            onClick={() => setFilter('UNLOCKED')}
          >
            Active & Free <span className={styles['filter-btn__count']}>{unlockedCount}</span>
          </button>
          <button
            type="button"
            className={`${styles['filter-btn']} ${filter === 'LOCKED' ? styles['filter-btn--active'] : ''}`}
            onClick={() => setFilter('LOCKED')}
          >
            Unlock with Volume <span className={styles['filter-btn__count']}>{lockedCount}</span>
          </button>
        </div>
      </div>

      {/* Unified 3-Column Services Grid */}
      <div className={styles['services-grid']}>
        {filteredServices.map((service) => {
          const tierCfg = allTiers[service.unlockTier];
          const pct = service.isUnlocked ? 100 : progressToTier(service.unlockTier);

          return (
            <div
              key={service.id}
              className={`${styles['service-card']} ${styles[`service-card--tier-${service.unlockTier.toLowerCase()}`]} ${
                service.isUnlocked ? styles['service-card--unlocked'] : styles['service-card--locked']
              }`}
            >
              <div className={styles['service-card__top']}>
                <div className={styles['service-card__header-row']}>
                  <div className={styles['service-card__tags']}>
                    <span className={styles['service-card__category']}>{service.category}</span>
                    <span className={`${styles['tier-pill']} ${styles[`tier-pill--${service.unlockTier.toLowerCase()}`]}`}>
                      {service.unlockTier} Tier
                    </span>
                  </div>

                  {service.isUnlocked ? (
                    <span className={styles['badge-unlocked']}>
                      <Icon name="biggest-check" className={styles['badge-unlocked__check']} /> Active
                    </span>
                  ) : (
                    <span className={styles['badge-locked']}>
                      Locked
                    </span>
                  )}
                </div>

                <h3 className={styles['service-card__title']}>{service.name}</h3>
                <p className={styles['service-card__subtitle']}>{service.subtitle}</p>
                <p className={styles['service-card__desc']}>{service.description}</p>
              </div>

              <div className={styles['service-card__benefits']}>
                <span className={styles['service-card__benefits-label']}>Key Advantages:</span>
                <ul>
                  {service.benefits.map((benefit, idx) => (
                    <li key={idx} className={styles['service-card__benefits-list-item']}>
                      <Icon name="check" className={styles['service-card__benefits-check-icon']} />
                      <span className={styles['service-card__benefits-advantage']}>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles['service-card__footer']}>
                <div className={styles['service-card__value']}>
                  <span className={styles['value-caption']}>Retail Value</span>
                  <span className={styles['value-amount']}>€{service.valuePerMonthEur}/mo</span>
                  {service.isUnlocked && (
                    <span className={styles['value-free-tag']}>100% Free</span>
                  )}
                </div>

                {service.isUnlocked ? service.routeLink ? (
                    <Button
                      classNames={`${styles['service-card__btn']} ${styles['service-card__btn--active']}`}
                      onClick={() => handleServiceAction(service)}
                    >
                      {service.routeLink ? 'Configure Settings →' : 'Active Service'}
                    </Button>) : null
                 : (
                  <div className={styles['service-card__lock-progress']}>
                    <div className={styles['service-card__lock-progress-header']}>
                      <span className={styles['service-card__lock-progress-target']}>
                        🔒 {tierCfg.minOrders.toLocaleString()}+ orders
                      </span>
                      <span className={styles['service-card__lock-progress-pct']}>{pct}%</span>
                    </div>
                    <div className={styles['service-card__lock-progress-track']}>
                      <div
                        className={`${styles['service-card__lock-progress-fill']} ${styles[`service-card__lock-progress-fill--${service.unlockTier.toLowerCase()}`]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal for Locked or Consult Services */}
      {selectedService && (
        <Modal
          title={selectedService.name}
          onClose={() => setSelectedService(null)}
          classNames="Bonus-service-modal"
        >
          <div className={styles['service-modal-content']}>
            <div className={styles['service-modal-badge-row']}>
              <span className={styles['service-card__category']}>{selectedService.category}</span>
              <span className={selectedService.isUnlocked ? styles['badge-unlocked'] : styles['badge-locked']}>
                {selectedService.isUnlocked
                  ? 'Currently Active'
                  : `Included Free with ${selectedService.unlockTier} (${allTiers[selectedService.unlockTier].minOrders.toLocaleString()}+ orders)`}
              </span>
            </div>

            <p className={styles['service-modal-desc']}>{selectedService.description}</p>

            <div className={styles['service-modal-benefits']}>
              <h4>What is included:</h4>
              <ul>
                {selectedService.benefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>

            <div className={styles['service-modal-csm-box']}>
              <div>
                <strong>Want to activate this service now?</strong>
                <p>
                  Consolidate additional fulfillment volume with WAPI to reach{' '}
                  {selectedService.unlockTier} tier ({allTiers[selectedService.unlockTier].minOrders.toLocaleString()}+ orders/mo) or speak with support.
                </p>
              </div>
              <button
                type="button"
                className={styles['csm-contact-btn']}
                onClick={() => {
                  setSelectedService(null);
                  router.push('/tickets?filter=Has new messages');
                }}
              >
                Open Support Ticket
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ServicesOverview;
