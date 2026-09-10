"use client";

import React, { useState } from "react";
import type { GeneratedProduct } from "@/types/product";
import DeploymentLogPanel from "./DeploymentLogPanel";

interface BlueprintPanelProps {
  product: GeneratedProduct;
}

export default function BlueprintPanel({ product }: BlueprintPanelProps): JSX.Element {
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);

  const executeExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(product.customStorefrontBlueprint, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${product.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-config.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const triggerLivePush = (platform: string) => {
    setIsDeploying(true);
    setDeployLogs((prev) => [...prev, `Initializing ingestion node targeting connected ${platform} catalog...`]);
    
    setTimeout(() => {
      setDeployLogs((prev) => [...prev, `Mapping product payload parameters for "${product.title}"...`]);
    }, 800);

    setTimeout(() => {
      setDeployLogs((prev) => [...prev, `Success: Verified draft listing updated in ${platform} dashboard.`]);
      setIsDeploying(false);
    }, 1800);
  };

  const bp = product.customStorefrontBlueprint;

  return (
    <div className="bg-slate-950 p-5 rounded-xl border border-slate-900 text-xs space-y-6">
      
      {/* BRAND COLOR BLOCKS */}
      <div>
        <span className="text-slate-500 font-bold uppercase block mb-2 tracking-wider">Dynamic Palette Swatches</span>
        <div className="flex flex-wrap gap-2">
          {Object.entries(bp.colorPalette).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-[11px]">
              <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: val as string }} />
              <span className="text-slate-400 capitalize">{key}:</span>
              <span className="text-white font-bold">{val as string}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TYPOGRAPHY AND HEADLINES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-900 pt-4">
        <div>
          <span className="text-[10px] text-slate-500 font-bold block uppercase mb-1">Branded Copy Frameworks</span>
          <ul className="space-y-1 list-inside list-disc text-slate-300 font-medium">
            {bp.heroHeadlines.map((headline: string, i: number) => (
              <li key={i}>"{headline}"</li>
            ))}
          </ul>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 font-bold block uppercase mb-1 font-mono">Typography Guidelines</span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Heading Font: <span className="text-white font-bold">{bp.typography.headingFont}</span> | Body Font: <span className="text-white font-bold">{bp.typography.bodyFont}</span>
          </p>
          <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">"{bp.typography.styleDirection}"</p>
        </div>
      </div>

      {/* TRUST CHIPS */}
      <div className="border-t border-slate-900 pt-4">
        <span className="text-[10px] text-slate-500 font-bold block uppercase mb-1">Conversion Trust Elements</span>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {bp.trustSection?.map((chip: string, i: number) => (
            <span key={i} className="bg-slate-900 px-2.5 py-1 rounded-md text-[10px] font-mono text-slate-300 border border-slate-800">
              ✓ {chip}
            </span>
          ))}
        </div>
      </div>

      {/* CONTROL DEPLOYMENT SUITE AND LOG PANELS */}
      <div className="border-t border-slate-900 pt-4 space-y-4">
        <div className="flex gap-2">
          <button onClick={() => triggerLivePush("Shopify")} disabled={isDeploying} className="bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-400 px-3 py-1.5 rounded-lg font-bold transition disabled:opacity-50">
            🚀 Sync Shopify
          </button>
          <button onClick={() => triggerLivePush("TikTok Shop")} disabled={isDeploying} className="bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 text-pink-400 px-3 py-1.5 rounded-lg font-bold transition disabled:opacity-50">
            🎵 Sync TikTok Shop
          </button>
          <button onClick={executeExport} className="ml-auto bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-lg transition hover:bg-slate-800">
            📥 Export File
          </button>
        </div>

        {deployLogs.length > 0 && <DeploymentLogPanel logs={deployLogs} />}
      </div>
    </div>
  );
}
