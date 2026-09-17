import React, { useState, useRef } from 'react';
import Layout from '@/components/Layout/Layout';
import Header from '@/components/Header';
import SeoHead from '@/components/SeoHead';
import Tabs from '@/components/Tabs';
import TierDemoSwitcher from './components/TierDemoSwitcher';
import TierProgressCard from './components/TierProgressCard';
import ServicesOverview from './components/ServicesOverview';
import TiersRoadmap from './components/TiersRoadmap';
import VolumeCalculator from './components/VolumeCalculator';
import RulesAndFaq from './components/RulesAndFaq';
import styles from './styles.module.scss';

const TAB_TITLES = [
  { title: 'Unlocked ER-Services' },
  { title: 'Tiers & Roadmap' },
  { title: 'Volume & Savings Simulator' },
  { title: 'Program Rules & Support' },
];

const BonusProgramPageInner: React.FC<{ activeTab: number; setActiveTab: (n: number) => void }> = ({ activeTab, setActiveTab }) => {
  const calculatorRef = useRef<HTMLDivElement>(null);

  const handleScrollToCalculator = () => {
    setActiveTab(2);
    setTimeout(() => {
      const el = document.getElementById('volume-calculator');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className={`page-component ${styles['growth-program-page']}`}>
      <Header pageTitle="Bonus program" toRight />

      {/* Draft/Demo Mode Switcher for reviewing all 5 tiers */}
      <TierDemoSwitcher />

      {/* Hero Banner with Current Tier, Progress Bar & Metrics */}
      <TierProgressCard onScrollToCalculator={handleScrollToCalculator} />

      {/* Tabs */}
      <Tabs
        id="bonus-program-tabs"
        curTab={activeTab}
        setCurTab={setActiveTab}
        tabTitles={TAB_TITLES}
        withHorizontalDivider
        needContentScroll={false}
        needMinHeight={false}
        classNames={styles['bonus-program-tabs']}
      >
        <ServicesOverview />
        <TiersRoadmap />
        <div ref={calculatorRef}>
          <VolumeCalculator />
        </div>
        <RulesAndFaq />
      </Tabs>
    </div>
  );
};

const BonusProgramPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <Layout hasFooter>
      <SeoHead
        title="Bonus program | WAPI"
        description="Earn free premium ER-services as your fulfillment volume scales. Track your tier progress, unlocked services, and estimated monthly savings."
      />
      <BonusProgramPageInner activeTab={activeTab} setActiveTab={setActiveTab} />
    </Layout>
  );
};

export default BonusProgramPage;
