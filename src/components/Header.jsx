import React from 'react';
import { ShieldCheck, Cpu, Database, FileText, UserCheck, LogOut } from 'lucide-react';
import { SimatsLogo } from './SimatsLogo';

export function Header({ activeTab, setActiveTab, mode, setMode, currentUser, onLogout }) {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-indigo-500/20 px-4 lg:px-8 py-3.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Identity: SIMATS University */}
        <SimatsLogo />

        {/* Header Navigation Tabs & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Header Navigation Tabs */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('flow')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'flow'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Admission Process
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'database'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Admissions Database
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setMode('LOCAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                mode === 'LOCAL'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Local Test
            </button>

            <button
              onClick={() => setMode('ONLINE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                mode === 'ONLINE'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Online API
            </button>
          </div>

          {/* Admin User Profile & Logout */}
          {currentUser && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-[11px] font-bold text-white flex items-center gap-1 justify-end">
                  <UserCheck className="w-3 h-3 text-emerald-400" />
                  {currentUser.username || 'admin'}
                </span>
                <span className="text-[9px] text-indigo-300 font-semibold uppercase tracking-wider">
                  {currentUser.role || 'Admin'}
                </span>
              </div>

              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Log out of Admin Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
