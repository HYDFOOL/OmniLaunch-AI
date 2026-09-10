'use client';

import { createContext, useContext, useState, type ReactNode } from "react";
import type { SubscriptionTier } from "@/lib/types";

interface SubscriptionContextValue {
  tier: SubscriptionTier;
  upgradeToScale: () => void;
  upgradeToOmni: () => void;
  downgrade: () => void;
  setTier: (tier: SubscriptionTier) => void;
}

const SubscriptionContext = createContext<SubscriptionContextValue>({
  tier: "free",
  upgradeToScale: () => {},
  upgradeToOmni: () => {},
  downgrade: () => {},
  setTier: () => {},
});

export function useSubscription() {
  return useContext(SubscriptionContext);
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<SubscriptionTier>("free");

  const value: SubscriptionContextValue = {
    tier,
    upgradeToScale: () => setTier("scale"),
    upgradeToOmni: () => setTier("omni"),
    downgrade: () => setTier("free"),
    setTier,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}
