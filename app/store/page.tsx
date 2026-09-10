'use client';

import { useState } from "react";
import {
  ArrowRight,
  Check,
  ExternalLink,
  Globe2,
  Loader2,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Store,
  Workflow,
  Radio,
  ShoppingBasket,
  Music2,
  Package,
} from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Platform } from "@/lib/types";

interface PlatformConfig {
  platform: Platform;
  label: string;
  icon: typeof ShoppingBag;
  color: string;
  bgColor: string;
  borderColor: string;
  placeholder: string;
  inputType: "text" | "password";
  apiPath: string;
  bodyKey: string;
  description: string;
}

const platformConfigs: PlatformConfig[] = [
  {
    platform: "Shopify",
    label: "Shopify",
    icon: ShoppingBag,
    color: "text-[#95bf47]",
    bgColor: "bg-[#95bf47]/10",
    borderColor: "border-[#95bf47]/30",
    placeholder: "my-brand.myshopify.com",
    inputType: "text",
    apiPath: "/api/shopify/auth",
    bodyKey: "domain",
    description: "OAuth 2.0 secure connection via your permanent .myshopify.com domain.",
  },
  {
    platform: "WooCommerce",
    label: "WooCommerce",
    icon: ShoppingBasket,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-400/30",
    placeholder: "your-store.com",
    inputType: "text",
    apiPath: "/api/woocommerce/auth",
    bodyKey: "domain",
    description: "REST API key authentication via your WooCommerce store URL.",
  },
  {
    platform: "Amazon",
    label: "Amazon Seller Central",
    icon: Package,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    borderColor: "border-amber-400/30",
    placeholder: "A1B2C3D4E5F6",
    inputType: "text",
    apiPath: "/api/amazon/auth",
    bodyKey: "sellerId",
    description: "SP-API integration via your Amazon Seller Central merchant ID.",
  },
  {
    platform: "TikTok Shop",
    label: "TikTok Shop",
    icon: Music2,
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
    borderColor: "border-pink-400/30",
    placeholder: "shop_code_12345",
    inputType: "text",
    apiPath: "/api/tiktok-shop/auth",
    bodyKey: "shopCode",
    description: "Shop API authorization via your TikTok Shop seller code.",
  },
];

type ConnectionState = Record<Platform, { connected: boolean; identifier: string }>;

export default function StorePage() {
  const [activePlatform, setActivePlatform] = useState<Platform>("Shopify");
  const [inputs, setInputs] = useState<Record<Platform, string>>({
    Shopify: "",
    WooCommerce: "",
    Amazon: "",
    "TikTok Shop": "",
  });
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");
  const [connections, setConnections] = useState<ConnectionState>({
    Shopify: { connected: false, identifier: "" },
    WooCommerce: { connected: false, identifier: "" },
    Amazon: { connected: false, identifier: "" },
    "TikTok Shop": { connected: false, identifier: "" },
  });

  const config = platformConfigs.find((c) => c.platform === activePlatform)!;
  const connectedCount = Object.values(connections).filter((c) => c.connected).length;

  async function connect() {
    const value = inputs[activePlatform].trim();
    if (!value) {
      setError(`Enter your ${config.label} identifier to continue.`);
      return;
    }
    setConnecting(true);
    setError("");
    try {
      const response = await fetch(config.apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [config.bodyKey]: value }),
      });
      const data: { connected: boolean; storeIdentifier?: string; error?: string } =
        await response.json();
      if (!response.ok || !data.connected)
        throw new Error(data.error || "Connection failed");
      setConnections((prev) => ({
        ...prev,
        [activePlatform]: { connected: true, identifier: data.storeIdentifier || value },
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to connect this store.");
    } finally {
      setConnecting(false);
    }
  }

  return (
    <div className="min-h-full bg-[#0a0c10]">
      <Topbar eyebrow="Store Connection Node" />
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="mb-10 max-w-2xl">
          <div className="mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,.8)]" />
            Infrastructure
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
            Store Connection Node
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Connect your storefronts across platforms. OmniLaunch agents handle product
            deployment, inventory sync, and performance feedback automatically.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-2.5 py-1 font-mono text-[9px] text-emerald-400">
              {connectedCount} / 4 PLATFORMS CONNECTED
            </span>
          </div>
        </div>

        {/* Platform selector tabs */}
        <div className="mb-5 flex flex-wrap gap-2">
          {platformConfigs.map((cfg) => {
            const Icon = cfg.icon;
            const isActive = cfg.platform === activePlatform;
            const isConnected = connections[cfg.platform].connected;
            return (
              <button
                key={cfg.platform}
                onClick={() => {
                  setActivePlatform(cfg.platform);
                  setError("");
                }}
                className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-[11px] font-medium transition-all ${
                  isActive
                    ? `${cfg.borderColor} ${cfg.bgColor} ${cfg.color}`
                    : "border-white/[0.08] bg-[#0e1117] text-slate-500 hover:border-white/[0.14] hover:text-slate-300"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.8} />
                {cfg.label}
                {isConnected && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400/20">
                    <Check className="h-2.5 w-2.5 text-emerald-400" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.4fr_.8fr]">
          {/* Active platform connection panel */}
          <section className="overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0e1117] shadow-2xl">
            <div className="border-b border-white/[0.07] px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <config.icon className={`h-4 w-4 ${config.color}`} />
                    <h2 className="text-sm font-medium text-slate-200">{config.label} integration</h2>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600">{config.description}</p>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-1 font-mono text-[9px] ${
                    connections[activePlatform].connected
                      ? "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-400"
                      : "border-slate-600/20 bg-slate-600/[0.08] text-slate-500"
                  }`}
                >
                  {connections[activePlatform].connected ? "CONNECTED" : "READY"}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="mb-8 flex items-center gap-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                    connections[activePlatform].connected
                      ? "border-emerald-400/30 bg-emerald-400/10"
                      : `${config.borderColor} ${config.bgColor}`
                  }`}
                >
                  {connections[activePlatform].connected ? (
                    <Check className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <Store className={`h-5 w-5 ${config.color}`} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {connections[activePlatform].connected
                      ? `${config.label} instance connected`
                      : `Connect your ${config.label} instance`}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {connections[activePlatform].connected
                      ? "Your store is ready for autonomous deployments."
                      : `Enter your ${config.label} identifier below.`}
                  </p>
                </div>
              </div>

              <label className="mb-2 block text-[11px] font-medium text-slate-400" htmlFor="platform-input">
                {config.label} identifier
              </label>
              <div className="relative">
                <Globe2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                <Input
                  id="platform-input"
                  type={config.inputType}
                  value={inputs[activePlatform]}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, [activePlatform]: e.target.value }))
                  }
                  disabled={connections[activePlatform].connected}
                  placeholder={config.placeholder}
                  className="h-12 border-white/[0.1] bg-[#090b0f] pl-10 font-mono text-xs text-slate-200 placeholder:text-slate-700"
                />
              </div>

              {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}

              <Button
                onClick={connect}
                disabled={connecting || connections[activePlatform].connected}
                className="mt-5 h-11 w-full bg-blue-500 text-xs font-medium text-white shadow-[0_8px_24px_-8px_rgba(59,130,246,.7)] hover:bg-blue-400"
              >
                {connecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Simulating secure handshake…
                  </>
                ) : connections[activePlatform].connected ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {config.label} connected
                  </>
                ) : (
                  <>
                    Connect {config.label} Instance
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-slate-600">
                <LockKeyhole className="h-3 w-3" />
                Encrypted handshake · We never store your password
              </div>
            </div>
          </section>

          {/* Capabilities sidebar */}
          <section className="rounded-2xl border border-white/[0.09] bg-[#0e1117] p-6">
            <div className="mb-7 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-400" />
              <h2 className="text-sm font-medium text-slate-200">Connection capabilities</h2>
            </div>
            <div className="space-y-5">
              {[
                { icon: Workflow, title: "One-click deployment", detail: "Publish winning products directly to your catalog." },
                { icon: Radio, title: "Live performance loop", detail: "Feed conversion data back to the discovery engine." },
                { icon: LockKeyhole, title: "Scoped permissions", detail: "Only the access required to operate your store." },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                    <item.icon className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-300">{item.title}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-600">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-white/[0.07] pt-5">
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.1em] text-slate-600">
                Platform status
              </p>
              <div className="space-y-2">
                {platformConfigs.map((cfg) => (
                  <div key={cfg.platform} className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-2 text-slate-500">
                      <cfg.icon className={`h-3.5 w-3.5 ${cfg.color}`} />
                      {cfg.label}
                    </span>
                    {connections[cfg.platform].connected ? (
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Connected
                      </span>
                    ) : (
                      <span className="text-slate-700">Not connected</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-xl border border-blue-400/10 bg-blue-400/[0.035] px-4 py-3 text-[11px] text-slate-500">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          <span>Demo environment:</span>
          <span className="text-slate-400">
            all connection flows are simulated and do not modify real stores.
          </span>
        </div>
      </div>
    </div>
  );
}
