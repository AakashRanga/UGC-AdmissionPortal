import React from 'react';
import { ShieldCheck, Cpu, Database, FileText, UserCheck, LogOut } from 'lucide-react';
import { SimatsLogo } from './SimatsLogo';

export function Header({ activeTab, setActiveTab, mode, setMode, currentUser, onLogout }) {
  return (
    <header className="sticky top-0 z-30 bg-white/92 backdrop-blur-md border-b border-amber-200/60 px-4 lg:px-8 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Identity: SIMATS University */}
        <SimatsLogo />

        {/* Header Navigation Tabs & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Header Navigation Tabs - Styled like SIMATS Education Navigation Pills */}
          <div className="flex items-center bg-[#FDFBF7] p-1 rounded-full border border-amber-200/60 shadow-2xs">
            <button
              onClick={() => setActiveTab('flow')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'flow'
                  ? 'bg-[#FDF3DE] text-[#9A3412] font-bold shadow-xs border border-amber-300/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Admission Flow
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'database'
                  ? 'bg-[#FDF3DE] text-[#9A3412] font-bold shadow-xs border border-amber-300/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Admissions Database
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-[#FDFBF7] p-1 rounded-full border border-amber-200/60 shadow-2xs">
            <button
              onClick={() => setMode('LOCAL')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                mode === 'LOCAL'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Local Test
            </button>

            <button
              onClick={() => setMode('ONLINE')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                mode === 'ONLINE'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Online API
            </button>
          </div>

          {/* Admin User Profile & Logout */}
          {currentUser && (
            <div className="flex items-center gap-2.5 pl-2 border-l border-amber-200/60">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-[11px] font-bold text-slate-900 flex items-center gap-1 justify-end">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {currentUser.username || 'admin'}
                </span>
                <span className="text-[9px] text-amber-700 font-bold uppercase tracking-wider">
                  {currentUser.role || 'Admin'}
                </span>
              </div>

              <button
                onClick={onLogout}
                className="px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
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
