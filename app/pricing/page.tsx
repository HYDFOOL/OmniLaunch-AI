'use client';

import { useState, useEffect } from "react";
import { Check, Crown, Loader2, Lock, Sparkles, ArrowRight, Globe } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/lib/subscription-context";
import type { SubscriptionTier } from "@/lib/types";

const plans = [
  {
    id: "free" as const,
    name: "Starter Sandbox",
    price: 0,
    description: "Explore the discovery engine with text previews",
    color: "text-slate-400",
    borderColor: "border-slate-700/50",
    bgColor: "bg-slate-900/50",
    features: [
      "Browse discovered products",
      "View seasonal intelligence",
      "Text preview only",
      "Connect one store",
      "Basic dashboard access"
    ],
    lockedFeatures: [
      "Deploy to store",
      "AI ad creative generation",
      "Video script blueprints",
      "Multi-platform export"
    ],
    buttonText: "Current Plan",
    buttonDisabled: true
  },
  {
    id: "scale" as const,
    name: "Scale Engine",
    price: 149,
    description: "For brands ready to automate production",
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-950/20",
    glow: "shadow-[0_0_40px_-10px_rgba(251,191,36,0.3)]",
    popular: true,
    features: [
      "Everything in Starter",
      "15 automated deployments/mo",
      "Full AI direct-response copy",
      "Custom lifestyle imagery slots",
      "Video script blueprints",
      "Multi-platform export"
    ],
    lockedFeatures: [],
    buttonText: "Upgrade to Scale",
    buttonDisabled: false
  },
  {
    id: "omni" as const,
    name: "Omni Automator",
    price: 299,
    description: "Unlimited autonomous multi-platform operations",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    bgColor: "bg-emerald-950/20",
    features: [
      "Everything in Scale",
      "Unlimited deployments",
      "Multi-store access",
      "Regional anti-saturation matrix",
      "Priority AI processing",
      "Dedicated support"
    ],
    lockedFeatures: [],
    buttonText: "Upgrade to Omni",
    buttonDisabled: false
  }
];

export default function PricingPage() {
  const { tier, upgradeToScale, upgradeToOmni, setTier } = useSubscription();
  const [loading, setLoading] = useState<"scale" | "omni" | null>(null);
  const [success, setSuccess] = useState(false);
  const [simulation, setSimulation] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("status") === "success") {
      const plan = params.get("plan") as SubscriptionTier;
      if (plan && (plan === "scale" || plan === "omni")) {
        setTier(plan);
        setSuccess(true);
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [setTier]);

  async function handleCheckout(planId: "scale" | "omni") {
    setLoading(planId);
    setSimulation(true);
    
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId })
      });
      
      const data: { url: string | null; mock: boolean; plan: SubscriptionTier } = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        setTimeout(() => {
          if (planId === "scale") upgradeToScale();
          if (planId === "omni") upgradeToOmni();
          setSuccess(true);
          setLoading(null);
          setSimulation(false);
        }, 2000);
      }
    } catch {
      setTimeout(() => {
        if (planId === "scale") upgradeToScale();
        if (planId === "omni") upgradeToOmni();
        setSuccess(true);
        setLoading(null);
        setSimulation(false);
      }, 2000);
    }
  }

  return (
    <div className="min-h-full bg-[#0a0c10]">
      <Topbar eyebrow="Pricing & Billing" />
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,.8)]" />
            Enterprise Pricing
          </div>
          <h1 className="text-4xl font-semibold tracking-[-0.035em] text-white sm:text-5xl">
            Scale Your E-Commerce Empire
          </h1>
          <p className="mt-4 text-sm text-slate-500 max-w-2xl mx-auto">
            Choose the automation tier that matches your growth trajectory. All plans include our AI-powered discovery engine.
          </p>
        </div>

        {success && (
          <div className="mx-auto mb-8 flex max-w-lg items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3 animate-in fade-in slide-in-from-bottom-4">
            <Check className="h-5 w-5 text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-emerald-300">Upgrade Successful</p>
              <p className="text-[11px] text-slate-500">Your account has been upgraded. All premium features are now unlocked.</p>
            </div>
          </div>
        )}

        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
          {plans.map((plan) => {
            const isActive = tier === plan.id;
            const isLoading = loading === plan.id;
            
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-6 transition-all duration-300 ${
                  isActive 
                    ? `${plan.borderColor} ${plan.bgColor} ${plan.glow || ''} scale-105` 
                    : `${plan.borderColor} ${plan.bgColor} hover:border-white/[0.2]`
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                      <Sparkles className="h-3 w-3" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] ${plan.color}`}>
                      <span className="text-2xl">{plan.id === "free" ? "⚡" : plan.id === "scale" ? "🔥" : "∞"}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                      <p className="text-[11px] text-slate-500">{plan.description}</p>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-sm text-slate-600">/mo</span>
                  </div>
                </div>

                <div className="mb-6 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <Check className={`h-4 w-4 shrink-0 mt-0.5 ${isActive ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span className={`text-[11px] ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>{feature}</span>
                    </div>
                  ))}
                  {plan.lockedFeatures.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <Lock className="h-4 w-4 shrink-0 mt-0.5 text-slate-700" />
                      <span className="text-[11px] text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {isActive ? (
                  <div className="flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
                    <Check className="h-4 w-4" />
                    Current Plan
                  </div>
                ) : (
                  <Button
                    onClick={() => plan.id !== "free" && handleCheckout(plan.id)}
                    disabled={isLoading || plan.buttonDisabled || plan.id === "free"}
                    className={`h-11 w-full ${
                      plan.popular 
                        ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-[0_8px_24px_-8px_rgba(251,191,36,0.5)]' 
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    } text-[11px] font-medium transition-all`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing…
                      </>
                    ) : (
                      <>
                        {plan.buttonText}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-xl border border-blue-400/10 bg-blue-400/[0.035] px-4 py-3 text-[11px] text-slate-500">
            <Globe className="h-4 w-4 text-blue-400" />
            <span>Enterprise pricing available for custom solutions. Contact sales for details.</span>
          </div>
        </div>

        {simulation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="rounded-2xl border border-emerald-400/20 bg-[#0e1117] p-8 text-center shadow-2xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Processing Upgrade</h3>
              <p className="text-sm text-slate-500">Simulating secure checkout flow...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
