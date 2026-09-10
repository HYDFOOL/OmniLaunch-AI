'use client';

import { X, Sparkles, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
}

export function UpgradeModal({ isOpen, onClose, feature }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative mx-auto max-w-md w-full rounded-2xl border border-amber-500/20 bg-[#0e1117] p-6 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-white/[0.06] hover:text-slate-300"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
            <Crown className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Upgrade Required</h3>
            <p className="text-[11px] text-slate-500">Unlock this premium feature</p>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-amber-500/10 bg-amber-500/[0.05] p-4">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-300 mb-1">{feature}</p>
              <p className="text-[11px] text-slate-500">
                This feature is only available on the Scale Engine and Omni Automator plans. 
                Upgrade now to unlock automated production deployment and AI-powered tools.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => {
              window.location.href = "/pricing?plan=scale";
            }}
            className="h-11 w-full bg-amber-500 text-white hover:bg-amber-400 shadow-[0_8px_24px_-8px_rgba(251,191,36,0.5)]"
          >
            <Crown className="mr-2 h-4 w-4" />
            Upgrade to Scale Engine
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <Button
            onClick={onClose}
            variant="outline"
            className="h-11 w-full border-white/[0.1] bg-white/[0.02] text-slate-400 hover:bg-white/[0.06] hover:text-slate-300"
          >
            Maybe Later
          </Button>
        </div>

        <p className="mt-4 text-center text-[10px] text-slate-600">
          Start your 14-day free trial. Cancel anytime.
        </p>
      </div>
    </div>
  );
}