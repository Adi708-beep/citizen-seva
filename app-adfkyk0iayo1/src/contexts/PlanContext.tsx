import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export type PlanId = 'free' | 'monthly' | 'half_yearly' | 'yearly';

export interface PlanDefinition {
  id: PlanId;
  name: string;
  cycle: 'free' | 'monthly' | 'half_yearly' | 'yearly';
  priceLabel: string;
  priceInr: number;
  chatLimit: number | null;
  schemeVisibilityLimit: number | null;
  isPopular?: boolean;
}

interface PlanUsage {
  chatRequests: number;
}

interface PlanContextType {
  plans: PlanDefinition[];
  activePlan: PlanDefinition;
  usage: PlanUsage;
  simulatePlanPurchase: (planId: PlanId) => void;
  resetUsage: () => void;
  canSendChatRequest: () => boolean;
  recordChatRequest: () => boolean;
  remainingChatRequests: number | null;
  isSchemeLockedByIndex: (index: number) => boolean;
}

const PLANS: PlanDefinition[] = [
  {
    id: 'free',
    name: 'Free',
    cycle: 'free',
    priceLabel: 'Rs 0',
    priceInr: 0,
    chatLimit: 10,
    schemeVisibilityLimit: 12,
  },
  {
    id: 'monthly',
    name: 'Starter Monthly',
    cycle: 'monthly',
    priceLabel: 'Rs 59 / month',
    priceInr: 59,
    chatLimit: 200,
    schemeVisibilityLimit: null,
  },
  {
    id: 'half_yearly',
    name: 'Growth 6-Month',
    cycle: 'half_yearly',
    priceLabel: 'Rs 199 / 6 months',
    priceInr: 199,
    chatLimit: 1500,
    schemeVisibilityLimit: null,
  },
  {
    id: 'yearly',
    name: 'Scale Yearly',
    cycle: 'yearly',
    priceLabel: 'Rs 399 / year',
    priceInr: 399,
    chatLimit: 5000,
    schemeVisibilityLimit: null,
    isPopular: true,
  },
];

const PlanContext = createContext<PlanContextType | undefined>(undefined);

function getStorageKeys(identityKey: string) {
  return {
    planKey: `citizen-seva-plan:${identityKey}`,
    usageKey: `citizen-seva-usage:${identityKey}`,
  };
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();

  const identityKey = useMemo(() => {
    if (profile?.id) return profile.id;
    return 'guest';
  }, [profile?.id]);

  const [activePlanId, setActivePlanId] = useState<PlanId>('free');
  const [usage, setUsage] = useState<PlanUsage>({ chatRequests: 0 });

  useEffect(() => {
    const { planKey, usageKey } = getStorageKeys(identityKey);

    const storedPlan = localStorage.getItem(planKey) as PlanId | null;
    const storedUsage = localStorage.getItem(usageKey);

    if (storedPlan && PLANS.some((plan) => plan.id === storedPlan)) {
      setActivePlanId(storedPlan);
    } else {
      setActivePlanId('free');
    }

    if (storedUsage) {
      try {
        const parsed = JSON.parse(storedUsage) as Partial<PlanUsage>;
        setUsage({
          chatRequests: parsed.chatRequests ?? 0,
        });
      } catch {
        setUsage({ chatRequests: 0 });
      }
    } else {
      setUsage({ chatRequests: 0 });
    }
  }, [identityKey]);

  const activePlan = PLANS.find((plan) => plan.id === activePlanId) ?? PLANS[0];

  const remainingChatRequests =
    activePlan.chatLimit === null ? null : Math.max(0, activePlan.chatLimit - usage.chatRequests);

  const persistPlan = (planId: PlanId) => {
    const { planKey } = getStorageKeys(identityKey);
    localStorage.setItem(planKey, planId);
    setActivePlanId(planId);
  };

  const persistUsage = (nextUsage: PlanUsage) => {
    const { usageKey } = getStorageKeys(identityKey);
    localStorage.setItem(usageKey, JSON.stringify(nextUsage));
    setUsage(nextUsage);
  };

  const simulatePlanPurchase = (planId: PlanId) => {
    persistPlan(planId);
  };

  const resetUsage = () => {
    persistUsage({ chatRequests: 0 });
  };

  const canSendChatRequest = () => {
    if (activePlan.chatLimit === null) return true;
    return usage.chatRequests < activePlan.chatLimit;
  };

  const recordChatRequest = () => {
    if (!canSendChatRequest()) return false;

    const nextUsage = {
      chatRequests: usage.chatRequests + 1,
    };

    persistUsage(nextUsage);
    return true;
  };

  const isSchemeLockedByIndex = (index: number) => {
    if (activePlan.schemeVisibilityLimit === null) return false;
    return index >= activePlan.schemeVisibilityLimit;
  };

  return (
    <PlanContext.Provider
      value={{
        plans: PLANS,
        activePlan,
        usage,
        simulatePlanPurchase,
        resetUsage,
        canSendChatRequest,
        recordChatRequest,
        remainingChatRequests,
        isSchemeLockedByIndex,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
}
