import React, { createContext, useContext, useState, useEffect, useMemo, PropsWithChildren } from 'react';
import Cookie from 'js-cookie';
import {
  ClientBonusStatus,
  BonusServiceItem,
  BonusTierConfig,
  BonusTierLevel
} from '@/types/bonusProgram';
import {
  BONUS_SERVICES_CATALOG,
  BONUS_TIERS_CONFIG,
  MOCK_CLIENT_STATUSES
} from '@/screens/BonusProgramPage/mockData';

const TIER_ORDER: Record<BonusTierLevel, number> = {
  Base: 0,
  Silver: 1,
  Gold: 2,
  Platinum: 3,
  VIP: 4
};

interface BonusProgramContextType {
  currentTier: BonusTierLevel;
  setCurrentTier: (tier: BonusTierLevel) => void;
  status: ClientBonusStatus;
  tierConfig: BonusTierConfig;
  allTiers: Record<BonusTierLevel, BonusTierConfig>;
  services: BonusServiceItem[];
}

const BonusProgramContext = createContext<BonusProgramContextType>({} as BonusProgramContextType);

const COOKIE_TIER_KEY = 'mock_Bonus_tier';

export const BonusProgramProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [currentTier, setTierState] = useState<BonusTierLevel>('Gold');

  useEffect(() => {
    const savedTier = Cookie.get(COOKIE_TIER_KEY) as BonusTierLevel | undefined;
    if (savedTier && BONUS_TIERS_CONFIG[savedTier]) {
      setTierState(savedTier);
    }
  }, []);

  const setCurrentTier = (tier: BonusTierLevel) => {
    Cookie.set(COOKIE_TIER_KEY, tier, { expires: 30 });
    setTierState(tier);
  };

  const status = useMemo(() => {
    return MOCK_CLIENT_STATUSES[currentTier] || MOCK_CLIENT_STATUSES.Gold;
  }, [currentTier]);

  const tierConfig = useMemo(() => {
    return BONUS_TIERS_CONFIG[currentTier] || BONUS_TIERS_CONFIG.Gold;
  }, [currentTier]);

  // Adjust each service's `isUnlocked` status dynamically based on current client tier
  const services = useMemo(() => {
    const clientTierRank = TIER_ORDER[currentTier];
    return BONUS_SERVICES_CATALOG.map(svc => ({
      ...svc,
      isUnlocked: clientTierRank >= TIER_ORDER[svc.unlockTier]
    }));
  }, [currentTier]);

  return (
    <BonusProgramContext.Provider
      value={{
        currentTier,
        setCurrentTier,
        status,
        tierConfig,
        allTiers: BONUS_TIERS_CONFIG,
        services
      }}
    >
      {children}
    </BonusProgramContext.Provider>
  );
};

export const useBonusProgram = () => useContext(BonusProgramContext);
export default useBonusProgram;
