import React from 'react';
import { Info, AlertTriangle, CheckCircle2, ShieldCheck, Server } from 'lucide-react';

export function ModeBanner({ mode, activeDb, heiCode, apiKey }) {
  if (mode === 'LOCAL') {
    return (
      <div className="bg-amber-500/10 border-y border-amber-500/30 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Local Test / Sandbox Mode Active:</strong> API calls and admission submissions are tested locally using pre-configured dummy DEB IDs and saved to local DB (<strong>{activeDb}</strong>).
            </span>
          </div>
          <div className="flex items-center gap-3 text-amber-200/80">
            <span>HEI AISHE Code: <code className="bg-amber-950/60 px-1.5 py-0.5 rounded text-amber-300 font-mono">{heiCode}</code></span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Offline Simulation Ready</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-emerald-500/10 border-y border-emerald-500/30 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Realtime UGC Online Mode Active:</strong> Directly communicating with UGC DEB Live Server (<code>http://45.124.184.101/...</code>) & persisting to MySQL.
          </span>
        </div>
        <div className="flex items-center gap-3 text-emerald-200/80">
          <span>HEI AISHE Code: <code className="bg-emerald-950/60 px-1.5 py-0.5 rounded text-emerald-300 font-mono">{heiCode}</code></span>
          <span className="hidden sm:inline">•</span>
          <span>API Key: <code className="bg-emerald-950/60 px-1.5 py-0.5 rounded text-emerald-300 font-mono">{apiKey.slice(0, 6)}...</code></span>
        </div>
      </div>
    </div>
  );
}
