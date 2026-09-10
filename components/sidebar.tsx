'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Command,
  CreditCard,
  Crosshair,
  LayoutGrid,
  Network,
  PanelLeftClose,
  Settings2,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Product Discovery Hub", icon: LayoutGrid },
  { href: "/store", label: "Store Connection Node", icon: Network },
  { href: "/ads", label: "Autonomous Ad Validator", icon: Crosshair },
  { href: "/pricing", label: "Pricing & Billing", icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn("hidden h-full shrink-0 flex-col border-r border-white/[0.07] bg-[#080a0e] transition-[width] duration-300 md:flex", collapsed ? "w-[72px]" : "w-[264px]")}>
      <div className="flex h-16 items-center border-b border-white/[0.07] px-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500 shadow-[0_0_24px_rgba(59,130,246,0.35)]">
            <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-[#080a0e] bg-emerald-400" />
          </div>
          {!collapsed && <span className="truncate text-[15px] font-semibold tracking-[-0.02em] text-white">OmniLaunch <span className="text-blue-400">AI</span></span>}
        </Link>
        {!collapsed && <button onClick={() => setCollapsed(true)} className="ml-auto rounded-md p-1.5 text-slate-600 transition-colors hover:bg-white/[0.06] hover:text-slate-300" aria-label="Collapse sidebar"><PanelLeftClose className="h-4 w-4" /></button>}
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3 py-5">
        {!collapsed && <div className="mb-3 flex items-center justify-between px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600"><span>Command center</span><Command className="h-3 w-3" /></div>}
        <nav>
          {!collapsed && <div className="mb-2 px-2 text-[11px] font-medium text-slate-500">Workspace</div>}
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined} className={cn("group relative flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-[12px] font-medium transition-all", active ? "bg-blue-500/[0.12] text-blue-300" : "text-slate-500 hover:bg-white/[0.045] hover:text-slate-200", collapsed && "justify-center px-0")}>
                {active && <span className="absolute -left-3 h-5 w-0.5 rounded-full bg-blue-400" />}
                <Icon className={cn("h-[17px] w-[17px] shrink-0 transition-colors", active ? "text-blue-400" : "text-slate-600 group-hover:text-slate-300")} strokeWidth={1.8} />
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />}
              </Link>;
            })}
          </div>
        </nav>

        <div className="mt-8 border-t border-white/[0.06] pt-5">
          {!collapsed && <div className="mb-2 px-2 text-[11px] font-medium text-slate-500">System</div>}
          <div className="space-y-1">
            {[{ icon: Terminal, label: "Activity log" }, { icon: Settings2, label: "Workspace settings" }].map((item) => <button key={item.label} title={collapsed ? item.label : undefined} className={cn("flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left text-[12px] font-medium text-slate-600 transition-colors hover:bg-white/[0.045] hover:text-slate-300", collapsed && "justify-center px-0")}><item.icon className="h-[17px] w-[17px] shrink-0" strokeWidth={1.8} />{!collapsed && item.label}</button>)}
          </div>
        </div>

        <div className="mt-auto">
          {!collapsed ? <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3"><div className="mb-2 flex items-center gap-2"><div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10"><Zap className="h-3.5 w-3.5 text-emerald-400" /></div><span className="text-[11px] font-medium text-slate-300">Autopilot is live</span><span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" /></div><p className="text-[10px] leading-relaxed text-slate-600">Your agents are scanning 18,402 signals across 6 markets.</p><div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-800"><div className="h-full w-[72%] rounded-full bg-emerald-400/80" /></div></div> : <button onClick={() => setCollapsed(false)} className="flex w-full justify-center rounded-lg p-2.5 text-slate-600 transition-colors hover:bg-white/[0.045] hover:text-slate-300" aria-label="Expand sidebar"><PanelLeftClose className="h-4 w-4 rotate-180" /></button>}
        </div>
      </div>

      <div className={cn("flex items-center border-t border-white/[0.07] px-4 py-3", collapsed ? "justify-center px-0" : "gap-3")}>
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-500 to-slate-700 text-[10px] font-semibold text-white ring-2 ring-white/[0.08]">AK</div>
        {!collapsed && <><div className="min-w-0"><p className="truncate text-[11px] font-medium text-slate-300">Alex Kim</p><p className="truncate text-[10px] text-slate-600">Growth operator</p></div><ChevronDown className="ml-auto h-3.5 w-3.5 text-slate-600" /></>}
      </div>
    </aside>
  );
}
