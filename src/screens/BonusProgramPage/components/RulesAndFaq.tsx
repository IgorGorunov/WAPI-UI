import React from 'react';
import { useRouter } from 'next/router';
import { BONUS_PROGRAM_FAQS } from '../mockData';
import Icon, { IconType } from '@/components/Icon';
import Accordion from '@/components/Accordion';
import styles from './RulesAndFaq.module.scss';

interface ProgramHighlight {
  icon: IconType;
  colorType: 'green' | 'blue' | 'gold' | 'vip';
  title: string;
  desc: string;
}

const PROGRAM_HIGHLIGHTS: ProgramHighlight[] = [
  {
    icon: 'trending-up',
    colorType: 'green',
    title: 'Volume = Value',
    desc: 'Every additional order you route to WAPI directly unlocks more of the ER-service ecosystem — no separate fees, no paperwork.',
  },
  {
    icon: 'calendar',
    colorType: 'blue',
    title: 'Rolling 3-Month Window',
    desc: 'Tier status is based on your average over the last 3 months, not a single month — protecting you from short spikes and dips.',
  },
  {
    icon: 'shield',
    colorType: 'gold',
    title: '60-Day Grace Period',
    desc: 'Seasonal slowdowns won\'t cost you your tier. A 60-day buffer keeps all unlocked services active while volume recovers.',
  },
  {
    icon: 'lightning-bolt',
    colorType: 'vip',
    title: 'Instant Activation',
    desc: 'Services activate automatically when you cross a tier threshold — no manual request needed for WAPI Checker Standard or Advanced.',
  },
];

const RulesAndFaq: React.FC = () => {
  const router = useRouter();

  return (
    <div className={styles['rules-faq-section']}>
      <div className={styles['section-header']}>
        <div>
          <h2 className={styles['section-title']}>Program Rules & FAQ</h2>
          <p className={styles['section-subtitle']}>
            Clear guidelines on tier assessment, calculation periods, and service activation.
          </p>
        </div>
      </div>

      {/* Rules 3-Grid */}
      <div className={styles['rules-grid']}>
        <div className={styles['rule-card']}>
          <div className={styles['rule-card__icon']}>
            <Icon name="calendar" />
          </div>
          <h3 className={styles['rule-card__title']}>3-Month Calculation Period</h3>
          <p className={styles['rule-card__desc']}>
            Your status is determined by your average monthly fulfillment volume over the last 3 calendar months or current quarter. This prevents minor weekly variances from disrupting your tier.
          </p>
        </div>

        <div className={styles['rule-card']}>
          <div className={styles['rule-card__icon']}>
            <Icon name="clock" />
          </div>
          <h3 className={styles['rule-card__title']}>Soft Grace Period</h3>
          <p className={styles['rule-card__desc']}>
            If your order volume temporarily dips due to seasonal changes or restocking delays, you receive a 60-day grace period where your status and all ER-services stay active.
          </p>
        </div>

        <div className={styles['rule-card']}>
          <div className={styles['rule-card__icon']}>
            <Icon name="refresh-clock" className={styles['icon-sm']} />
          </div>
          <h3 className={styles['rule-card__title']}>Transparent Reassessment</h3>
          <p className={styles['rule-card__desc']}>
            If order volume remains below the threshold past the grace period, the tier adjusts down to your current volume level. You can regain status instantly as soon as volume recovers.
          </p>
        </div>
      </div>

      {/* Split layout: FAQs + Program Highlights */}
      <div className={styles['faq-support-row']}>
        <div className={styles['faq-column']}>
          <h3 className={styles['sub-heading']}>Frequently Asked Questions</h3>
          <div className={styles['faq-list']}>
            {BONUS_PROGRAM_FAQS.map((faq, idx) => (
              <Accordion
                key={idx}
                title={faq.question}
                isOpen={idx === 0}
                classNames={styles['faq-accordion']}
              >
                <div className={styles['faq-answer']}>{faq.answer}</div>
              </Accordion>
            ))}
          </div>
        </div>

        {/* Program Highlights panel replacing the CSM card */}
        <div className={styles['support-column']}>
          <div className={styles['highlights-panel']}>
            <div className={styles['highlights-panel__header']}>
              <span className={styles['highlights-panel__badge']}>How It Works</span>
              <h3 className={styles['highlights-panel__title']}>Good to Know</h3>
              <p className={styles['highlights-panel__desc']}>
                The Bonus Program is designed to be effortless — your tier updates automatically, and services activate without any extra steps.
              </p>
            </div>

            <ul className={styles['highlights-list']}>
              {PROGRAM_HIGHLIGHTS.map((item, idx) => (
                <li key={idx} className={styles['highlights-item']}>
                  <div className={`${styles['highlights-item__icon']} ${styles[`highlights-item__icon--${item.colorType}`]}`}>
                    <Icon name={item.icon} className={styles['highlight-svg']} />
                  </div>
                  <div>
                    <span className={styles['highlights-item__title']}>{item.title}</span>
                    <p className={styles['highlights-item__desc']}>{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className={styles['highlights-cta']}
              onClick={()=>console.log('contact us')}
            >
              {/*Have questions? Open a support ticket →*/}
              Have questions? Contact us in a chat →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesAndFaq;

// onClick={() => router.push('/tickets?filter=Has new messages')}