import { Bell, CircleHelp, Search } from "lucide-react";

export function Topbar({ eyebrow }: { eyebrow: string }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/[0.07] px-5 sm:px-8">
      <div className="flex items-center gap-2 text-[11px] text-slate-600">
        <span>OmniLaunch AI</span><span className="text-slate-800">/</span><span className="text-slate-400">{eyebrow}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <button className="hidden items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-1.5 text-[11px] text-slate-500 transition-colors hover:border-white/[0.14] hover:text-slate-300 sm:flex"><Search className="h-3.5 w-3.5" /><span>Search</span><kbd className="ml-2 rounded border border-white/[0.1] px-1.5 py-0.5 font-mono text-[9px] text-slate-600">⌘ K</kbd></button>
        <button className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-white/[0.05] hover:text-slate-300" aria-label="Help"><CircleHelp className="h-4 w-4" /></button>
        <button className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-white/[0.05] hover:text-slate-300" aria-label="Notifications"><Bell className="h-4 w-4" /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-blue-400" /></button>
      </div>
    </header>
  );
}
