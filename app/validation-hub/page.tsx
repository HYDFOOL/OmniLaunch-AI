'use client';

import { useState } from "react";
import { Sparkles, Target, Users, TrendingUp, AlertCircle, CheckCircle, Lightbulb, ArrowRight, Loader2 } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubscription } from "@/lib/subscription-context";
import { UpgradeModal } from "@/components/upgrade-modal";
import type { ValidationResponse } from "@/lib/types";

export default function ValidationHubPage() {
  const { tier } = useSubscription();
  const isPremium = tier === "scale" || tier === "omni";
  const [productConcept, setProductConcept] = useState("");
  const [targetCategory, setTargetCategory] = useState("");
  const [validating, setValidating] = useState(false);
  const [result, setResult] = useState<ValidationResponse | null>(null);
  const [upgradeModal, setUpgradeModal] = useState({ isOpen: false, feature: "" });

  async function handleValidation() {
    if (!isPremium) {
      setUpgradeModal({ isOpen: true, feature: "Idea Validation Engine" });
      return;
    }

    if (!productConcept.trim()) {
      return;
    }

    setValidating(true);
    setResult(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productConcept: productConcept.trim(),
          targetCategory: targetCategory.trim() || undefined
        })
      });

      if (!response.ok) throw new Error("Validation failed");
      
      const data: ValidationResponse = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Validation error:", error);
    } finally {
      setValidating(false);
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-rose-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500/10 border-emerald-500/20";
    if (score >= 60) return "bg-amber-500/10 border-amber-500/20";
    return "bg-rose-500/10 border-rose-500/20";
  };

  return (
    <div className="min-h-full bg-[#0a0c10]">
      <Topbar eyebrow="Idea Validation Hub" />
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,.8)]" />
            Product Intelligence
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
            AI-Powered Idea Validation
          </h1>
          <p className="mt-3 max-w-xl text-sm text-slate-500">
            Validate your product concepts against our High-Margin Velocity Matrix before investing in development or marketing.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Section */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0e1117] p-6">
            <div className="mb-6">
              <label className="mb-2 block text-[11px] font-medium text-slate-400">
                Product Concept
              </label>
              <textarea
                value={productConcept}
                onChange={(e) => setProductConcept(e.target.value)}
                placeholder="Describe your product idea in detail (e.g., 'A smart water bottle that tracks hydration and reminds users to drink water')"
                className="h-32 w-full rounded-lg border border-white/[0.1] bg-[#090b0f] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-700 focus:border-blue-500/30 focus:outline-none resize-none"
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-[11px] font-medium text-slate-400">
                Target Category (Optional)
              </label>
              <Input
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value)}
                placeholder="e.g., Home & Kitchen, Fitness, Beauty"
                className="border-white/[0.1] bg-[#090b0f] text-slate-200 placeholder:text-slate-700"
              />
            </div>

            <Button
              onClick={handleValidation}
              disabled={validating || !productConcept.trim()}
              className="h-11 w-full bg-blue-500 text-white hover:bg-blue-400 disabled:bg-slate-800 disabled:text-slate-500"
            >
              {validating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Concept...
                </>
              ) : !isPremium ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Upgrade to Validate
                </>
              ) : (
                <>
                  <Target className="mr-2 h-4 w-4" />
                  Validate Concept
                </>
              )}
            </Button>

            <div className="mt-4 rounded-lg border border-blue-400/10 bg-blue-400/[0.035] p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-500">
                  <p className="font-medium text-slate-400 mb-1">Analysis Criteria</p>
                  <p>Manufacturing cost under $10, retail price over $35, high video content potential, and competitive differentiation opportunities.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0e1117] p-6">
            {result ? (
              <div className="space-y-6">
                {/* Feasibility Score */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-slate-200">Feasibility Score</h3>
                    <div className={`px-3 py-1 rounded-lg border ${getScoreBg(result.feasibilityScore)}`}>
                      <span className={`font-mono text-lg font-bold ${getScoreColor(result.feasibilityScore)}`}>
                        {result.feasibilityScore}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        result.feasibilityScore >= 80 ? "bg-emerald-400" :
                        result.feasibilityScore >= 60 ? "bg-amber-400" : "bg-rose-400"
                      }`}
                      style={{ width: `${result.feasibilityScore}%` }}
                    />
                  </div>
                </div>

                {/* Viability Verdict */}
                <div className="rounded-lg border border-white/[0.06] bg-black/20 p-4">
                  <div className="flex items-start gap-3">
                    {result.feasibilityScore >= 70 ? (
                      <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm text-slate-300">{result.viabilityVerdict}</p>
                  </div>
                </div>

                {/* Competitive Moat */}
                <div>
                  <h3 className="mb-3 text-sm font-medium text-slate-200">Competitive Advantages</h3>
                  <div className="space-y-2">
                    {result.competitiveMoat.map((advantage, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-slate-400">
                        <TrendingUp className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        {advantage}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Target Demographic */}
                <div>
                  <h3 className="mb-3 text-sm font-medium text-slate-200">Target Demographic</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-300">{result.targetDemographic.primary}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {result.targetDemographic.secondary.map((segment, index) => (
                            <span key={index} className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-300">
                              {segment}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="pl-6">
                      <p className="text-[10px] uppercase tracking-wide text-slate-600 mb-1">Psychographics</p>
                      <div className="space-y-1">
                        {result.targetDemographic.psychographics.map((trigger, index) => (
                          <p key={index} className="text-xs text-slate-500">• {trigger}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Test Hooks */}
                <div>
                  <h3 className="mb-3 text-sm font-medium text-slate-200">Marketing Test Hooks</h3>
                  <div className="space-y-2">
                    {result.testHooks.map((hook, index) => (
                      <div key={index} className="rounded-lg border border-white/[0.06] bg-black/20 p-3">
                        <p className="text-sm text-slate-300">"{hook}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Steps */}
                <div>
                  <h3 className="mb-3 text-sm font-medium text-slate-200">Recommended Next Steps</h3>
                  <div className="space-y-2">
                    {result.nextSteps.map((step, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm text-slate-400">
                        <ArrowRight className="h-4 w-4 text-slate-600 shrink-0 mt-0.5" />
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center text-slate-600">
                <div className="text-center">
                  <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Enter your product concept to see validation results</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <UpgradeModal 
        isOpen={upgradeModal.isOpen} 
        onClose={() => setUpgradeModal({ isOpen: false, feature: "" })}
        feature={upgradeModal.feature}
      />
    </div>
  );
}