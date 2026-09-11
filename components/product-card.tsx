'use client';

import { useState } from "react";
import {
  Check,
  Copy,
  Gauge,
  Loader2,
  Lock,
  MapPin,
  RefreshCw,
  Rocket,
  Sparkles,
  TrendingUp,
  Video,
  Megaphone,
  Store,
} from "lucide-react";
import type { DiscoveredProduct, GenerateResponse, Platform } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/lib/subscription-context";
import { UpgradeModal } from "@/components/upgrade-modal";
import { Download, Palette, Layout, Shield } from "lucide-react";

const platformStyles: Record<Platform, string> = {
  Shopify: "border-[#95bf47]/25 bg-[#95bf47]/10 text-[#a8d25d]",
  WooCommerce: "border-purple-400/25 bg-purple-400/10 text-purple-300",
  Amazon: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  "TikTok Shop": "border-pink-400/25 bg-pink-400/10 text-pink-300",
};

type Tab = "store" | "video" | "ads" | "blueprint";

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="flex items-center gap-1 rounded-md border border-white/[0.08] px-2 py-1 text-[9px] text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-slate-300"
    >
      {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : label}
    </button>
  );
}

export function ProductCard({ product }: { product: DiscoveredProduct }) {
  const [activeTab, setActiveTab] = useState<Tab>("store");
  const [showMetrics, setShowMetrics] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copy, setCopy] = useState(product.copywriting);
  const [adAssets, setAdAssets] = useState(product.adAssets);
  const [upgradeModal, setUpgradeModal] = useState<{ isOpen: boolean; feature: string }>({ isOpen: false, feature: "" });
  const { tier } = useSubscription();
  const isPremium = tier === "scale" || tier === "omni";

  const northAmerica = product.allocations.find((a) => a.region === "North America");
  const slotsRemaining = northAmerica ? northAmerica.maxAllocations - northAmerica.allocationCount : 0;

  async function regenerateCopy() {
    if (!isPremium) {
      setUpgradeModal({ isOpen: true, feature: "AI-Powered Ad Creative Generation" });
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: product.title, category: product.niche }),
      });
      if (!response.ok) throw new Error("Generation failed");
      const data: GenerateResponse = await response.json();
      setCopy({ optimizedTitle: data.title, pasDescription: data.description, adHooks: [] });
      setAdAssets(data.adAssets);
    } catch {
      // Keep existing copy on failure
    } finally {
      setGenerating(false);
    }
  }

  const tabs: { key: Tab; label: string; icon: typeof Store }[] = [
    { key: "store", label: "Store Details", icon: Store },
    { key: "video", label: "Video Script Blueprint", icon: Video },
    { key: "ads", label: "Paid Ad Assets", icon: Megaphone },
    { key: "blueprint", label: "Custom Store Blueprint", icon: Palette },
  ];

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e1117] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.15] hover:shadow-[0_18px_45px_-20px_rgba(0,0,0,.8)]">
      <div className="relative aspect-[1.65/1] overflow-hidden bg-slate-900">
        <img src={product.image} alt={product.title} className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1117] via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2 py-1 backdrop-blur-md"><Sparkles className="h-3 w-3 text-blue-300" /><span className="text-[9px] font-medium text-white">AI DISCOVERED</span></div>
        <div className="absolute bottom-3 left-4 flex items-center gap-1.5 rounded-md bg-black/40 px-2 py-1 backdrop-blur-md"><TrendingUp className="h-3 w-3 text-emerald-400" /><span className="font-mono text-[10px] text-emerald-300">{product.trendScore}% trend score</span></div>
        {product.locked && <div className="absolute right-3 top-3 rounded-md border border-rose-400/25 bg-rose-400/15 px-2 py-1 font-mono text-[9px] text-rose-300">REGION SATURATED</div>}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div><span className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-600">{product.niche}</span><h3 className="mt-1 text-sm font-medium text-slate-200">{product.title}</h3></div>
          <div className="text-right"><p className="font-mono text-sm font-medium text-emerald-400">{product.estMargin}%</p><p className="text-[9px] text-slate-600">est. margin</p></div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.platforms.map((platform) => <span key={platform} className={`rounded-md border px-1.5 py-1 text-[9px] font-medium ${platformStyles[platform]}`}>{platform}</span>)}
        </div>

        <div className={`mt-3 flex items-center gap-2 rounded-lg border px-2.5 py-2 ${product.locked ? "border-rose-400/20 bg-rose-400/[0.06]" : slotsRemaining <= 2 ? "border-amber-400/20 bg-amber-400/[0.06]" : "border-blue-400/15 bg-blue-400/[0.05]"}`}>
          <MapPin className={`h-3.5 w-3.5 ${product.locked ? "text-rose-400" : slotsRemaining <= 2 ? "text-amber-400" : "text-blue-400"}`} />
          <span className={`text-[10px] ${product.locked ? "text-rose-300" : slotsRemaining <= 2 ? "text-amber-300" : "text-blue-300"}`}>{product.locked ? "North America allocation locked" : `Only ${slotsRemaining} slot${slotsRemaining === 1 ? "" : "s"} remaining in North America`}</span>
        </div>

        <button onClick={() => setShowMetrics(!showMetrics)} className="mt-3 flex w-full items-center justify-between border-t border-white/[0.07] pt-3 text-[11px] text-slate-500 transition-colors hover:text-slate-300">
          <span className="flex items-center gap-2"><Gauge className="h-3.5 w-3.5" />Seasonal intelligence · {product.seasonal.microSeason}</span>
          <span className="text-[9px] text-slate-700">{showMetrics ? "Hide" : "Show"}</span>
        </button>
        {showMetrics && (
          <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg border border-white/[0.06] bg-black/20 p-3">
            <div title="Relative social shares, saves, and comments vs baseline"><p className="text-[9px] uppercase tracking-wide text-slate-600">Social engagement</p><p className="mt-1 font-mono text-xs text-slate-300">{product.seasonal.socialEngagementMultiplier}x</p></div>
            <div title="Buyer-intent comments divided by total comments"><p className="text-[9px] uppercase tracking-wide text-slate-600">Intent ratio</p><p className="mt-1 font-mono text-xs text-slate-300">{Math.round(product.seasonal.buyerIntentCommentRatio * 100)}%</p></div>
            <div title="Seasonal demand strength from 0 to 10"><p className="text-[9px] uppercase tracking-wide text-slate-600">Seasonality index</p><p className="mt-1 font-mono text-xs text-amber-300">{product.seasonal.seasonalityIndex}/10</p></div>
            <div title="Local demand acceleration over the last 7 days"><p className="text-[9px] uppercase tracking-wide text-slate-600">Local velocity</p><p className="mt-1 font-mono text-xs text-emerald-300">+{product.seasonal.localTrendVelocity}%</p></div>
          </div>
        )}

        {/* Tabs */}
        <div className="mt-4 flex gap-1 rounded-lg border border-white/[0.07] bg-black/20 p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isLocked = !isPremium && (tab.key === "video" || tab.key === "ads" || tab.key === "blueprint");
            return (
              <button 
                key={tab.key} 
                onClick={() => {
                  if (isLocked) {
                    const featureMap = {
                      video: "Video Script Blueprints",
                      ads: "Paid Ad Assets",
                      blueprint: "Custom Store Blueprint"
                    };
                    setUpgradeModal({ isOpen: true, feature: featureMap[tab.key as keyof typeof featureMap] || "Premium Feature" });
                    return;
                  }
                  setActiveTab(tab.key);
                }} 
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[10px] font-medium transition-all ${activeTab === tab.key ? "bg-blue-500/15 text-blue-300" : isLocked ? "text-slate-700 cursor-not-allowed" : "text-slate-600 hover:text-slate-400"}`}
              >
                {isLocked ? <Lock className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="mt-3 min-h-[120px]">
          {generating ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <div className="relative flex h-10 w-10 items-center justify-center">
                <div className="absolute h-10 w-10 animate-ping rounded-full bg-blue-500/20" />
                <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
              </div>
              <p className="text-[10px] text-slate-500">Generating assets with Gemini AI…</p>
            </div>
          ) : activeTab === "store" ? (
            <div className="space-y-2 rounded-lg border border-white/[0.06] bg-black/20 p-3 text-[11px] leading-relaxed">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-slate-300">{copy.optimizedTitle}</p>
                <button onClick={regenerateCopy} className="shrink-0 rounded-md p-1 text-slate-600 transition-colors hover:bg-white/[0.06] hover:text-blue-400" aria-label="Regenerate"><RefreshCw className="h-3 w-3" /></button>
              </div>
              <div>
                <span className="font-mono text-[9px] uppercase text-rose-400">PAS framework</span>
                <p className="mt-1 text-slate-500">{copy.pasDescription.problem}</p>
                <p className="mt-1 text-slate-500">{copy.pasDescription.agitation}</p>
                <p className="mt-1 text-slate-400">{copy.pasDescription.solution}</p>
              </div>
              <div className="flex justify-end">
                <CopyButton text={`${copy.optimizedTitle}\n\n${copy.pasDescription.problem}\n${copy.pasDescription.agitation}\n${copy.pasDescription.solution}`} label="Copy all" />
              </div>
            </div>
          ) : activeTab === "video" ? (
            <div className="space-y-2 rounded-lg border border-white/[0.06] bg-black/20 p-3 text-[11px] leading-relaxed">
              <div>
                <div className="flex items-center justify-between"><span className="font-mono text-[9px] uppercase text-amber-400">Hook · 0-3s</span><CopyButton text={adAssets.videoScript.hook} label="Copy" /></div>
                <p className="mt-1 text-slate-400">{adAssets.videoScript.hook}</p>
              </div>
              <div>
                <div className="flex items-center justify-between"><span className="font-mono text-[9px] uppercase text-blue-400">Retention · 3-12s</span><CopyButton text={adAssets.videoScript.retention} label="Copy" /></div>
                <p className="mt-1 text-slate-400">{adAssets.videoScript.retention}</p>
              </div>
              <div>
                <div className="flex items-center justify-between"><span className="font-mono text-[9px] uppercase text-emerald-400">CTA · 12-15s</span><CopyButton text={adAssets.videoScript.cta} label="Copy" /></div>
                <p className="mt-1 text-slate-400">{adAssets.videoScript.cta}</p>
              </div>
            </div>
          ) : activeTab === "ads" ? (
            <div className="space-y-3 rounded-lg border border-white/[0.06] bg-black/20 p-3 text-[11px] leading-relaxed">
              <div>
                <div className="flex items-center justify-between"><span className="font-mono text-[9px] uppercase text-blue-400">Meta ads</span><CopyButton text={`${adAssets.metaAds.primaryText}\n\nHeadline: ${adAssets.metaAds.headline}\n\nKeywords: ${adAssets.metaAds.targetingKeywords.join(", ")}`} label="Copy all" /></div>
                <p className="mt-1 text-slate-500">{adAssets.metaAds.primaryText}</p>
                <p className="mt-1 font-medium text-slate-400">{adAssets.metaAds.headline}</p>
                <div className="mt-1 flex flex-wrap gap-1">{adAssets.metaAds.targetingKeywords.map((kw) => <span key={kw} className="rounded bg-white/[0.05] px-1.5 py-0.5 text-[9px] text-slate-500">{kw}</span>)}</div>
              </div>
              <div className="border-t border-white/[0.06] pt-2">
                <div className="flex items-center justify-between"><span className="font-mono text-[9px] uppercase text-pink-400">TikTok ads</span><CopyButton text={`${adAssets.tiktokAds.caption}\n\n${adAssets.tiktokAds.trendingHashtags.join(" ")}`} label="Copy all" /></div>
                <p className="mt-1 text-slate-500">{adAssets.tiktokAds.caption}</p>
                <div className="mt-1 flex flex-wrap gap-1">{adAssets.tiktokAds.trendingHashtags.map((tag) => <span key={tag} className="rounded bg-pink-400/10 px-1.5 py-0.5 text-[9px] text-pink-300">{tag}</span>)}</div>
              </div>
            </div>
          ) : activeTab === "blueprint" ? (
            <div className="space-y-4 rounded-lg border border-white/[0.06] bg-black/20 p-4 text-[11px] leading-relaxed">
              {/* Branding Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[9px] uppercase text-purple-400">Brand Colors</span>
                  <CopyButton text={Object.values(adAssets.customStorefrontBlueprint?.recommendedBranding || {}).slice(0, 5).join(", ")} label="Copy colors" />
                </div>
                <div className="flex gap-2">
                  {adAssets.customStorefrontBlueprint?.recommendedBranding && (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded" style={{ backgroundColor: adAssets.customStorefrontBlueprint.recommendedBranding.primaryColor }} />
                        <span className="text-slate-600">Primary</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded" style={{ backgroundColor: adAssets.customStorefrontBlueprint.recommendedBranding.secondaryColor }} />
                        <span className="text-slate-600">Secondary</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded" style={{ backgroundColor: adAssets.customStorefrontBlueprint.recommendedBranding.accentColor }} />
                        <span className="text-slate-600">Accent</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Typography */}
              <div>
                <span className="font-mono text-[9px] uppercase text-blue-400">Typography</span>
                <div className="mt-1 space-y-1">
                  {adAssets.customStorefrontBlueprint?.recommendedBranding && (
                    <>
                      <p className="text-slate-500">Headings: {adAssets.customStorefrontBlueprint.recommendedBranding.typography.headingFont} ({adAssets.customStorefrontBlueprint.recommendedBranding.typography.headingStyle})</p>
                      <p className="text-slate-500">Body: {adAssets.customStorefrontBlueprint.recommendedBranding.typography.bodyFont} ({adAssets.customStorefrontBlueprint.recommendedBranding.typography.bodyStyle})</p>
                    </>
                  )}
                </div>
              </div>

              {/* Hero Section */}
              <div>
                <span className="font-mono text-[9px] uppercase text-emerald-400">Hero Section</span>
                <div className="mt-1 space-y-1">
                  {adAssets.customStorefrontBlueprint?.heroSection && (
                    <>
                      <p className="font-medium text-slate-300">{adAssets.customStorefrontBlueprint.heroSection.headline}</p>
                      <p className="text-slate-500">{adAssets.customStorefrontBlueprint.heroSection.subheadline}</p>
                      <div className="mt-2 flex gap-2">
                        <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[9px] text-blue-300">{adAssets.customStorefrontBlueprint.heroSection.primaryCTA}</span>
                        {adAssets.customStorefrontBlueprint.heroSection.secondaryCTA && (
                          <span className="rounded bg-slate-700 px-2 py-0.5 text-[9px] text-slate-400">{adAssets.customStorefrontBlueprint.heroSection.secondaryCTA}</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Trust Badges */}
              <div>
                <span className="font-mono text-[9px] uppercase text-amber-400">Trust Badges</span>
                <div className="mt-1 space-y-2">
                  {adAssets.customStorefrontBlueprint?.trustSection?.map((badge, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-lg">{badge.icon}</span>
                      <div>
                        <p className="font-medium text-slate-300">{badge.title}</p>
                        <p className="text-slate-600">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Button */}
              <Button
                className="w-full h-8 bg-slate-700 hover:bg-slate-600 text-white text-[10px]"
                onClick={() => {
                  const blueprint = adAssets.customStorefrontBlueprint;
                  if (!blueprint) return;
                  
                  const exportData = {
                    branding: blueprint.recommendedBranding,
                    hero: blueprint.heroSection,
                    trust: blueprint.trustSection,
                    photography: blueprint.productPhotographyGuidance,
                    socialProof: blueprint.socialProofStrategy
                  };
                  
                  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${product.title.replace(/\s+/g, '_')}_storefront_blueprint.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="mr-2 h-3 w-3" />
                Export Full Custom Theme Configuration
              </Button>
            </div>
          ) : null}
        </div>

        <Button
          onClick={() => {
            if (!isPremium) {
              setUpgradeModal({ isOpen: true, feature: "Automated Production Deployment" });
              return;
            }
            setDeployed(true);
          }}
          disabled={deployed || product.locked}
          className="mt-4 h-10 w-full bg-blue-500 text-[11px] text-white hover:bg-blue-400 disabled:bg-slate-800 disabled:text-slate-500"
        >
          {deployed ? (
            <><span className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400"><svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-[#0e1117]"><path d="m2 6 2.5 2.5L10 3" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg></span>Deployed to selected platforms</>
          ) : product.locked ? (
            "Locked in this region"
          ) : !isPremium ? (
            <><Lock className="mr-2 h-3.5 w-3.5" />Upgrade to deploy</>
          ) : (
            <>Deploy to selected platforms<Rocket className="ml-2 h-3.5 w-3.5" /></>
          )}
        </Button>
      </div>
      
      <UpgradeModal 
        isOpen={upgradeModal.isOpen} 
        onClose={() => setUpgradeModal({ isOpen: false, feature: "" })}
        feature={upgradeModal.feature}
      />
    </article>
  );
}
