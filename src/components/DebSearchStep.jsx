import React from 'react';
import { Search, Loader2, ArrowRight, KeyRound } from 'lucide-react';

export function DebSearchStep({ debId, setDebId, onFetch, loading, mode }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (debId.trim()) {
      onFetch(debId.trim());
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 lg:p-8 relative overflow-hidden shadow-xl border border-slate-200/90 max-w-3xl mx-auto animate-fade-in bg-white/90 backdrop-blur-md">
      <div className="text-center max-w-xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
          Step 1: DEB Unique ID Verification
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-heading">
          Fetch Student Profile from UGC DEB Portal
        </h2>
        <p className="text-xs text-slate-600 mt-1.5">
          Enter the student's 12-digit DEB Unique ID generated on the UGC DEB Portal.
        </p>
      </div>

      {/* Clean Search Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <KeyRound className="w-4 h-4 text-blue-600" />
          </div>
          <input
            type="text"
            value={debId}
            onChange={(e) => setDebId(e.target.value)}
            placeholder="Enter 12-digit DEB Unique ID (e.g. 987654321987)"
            maxLength={20}
            className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm text-slate-900 placeholder-slate-400 font-mono focus:ring-2 focus:ring-blue-500 shadow-sm"
            required
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={loading || !debId.trim()}
          className="gradient-btn px-6 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-md shadow-blue-700/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Fetching API...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Fetch Details</span>
              <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
