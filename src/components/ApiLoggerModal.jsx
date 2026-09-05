import React from 'react';
import { Terminal, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export function ApiLoggerModal({ isOpen, onClose, logs, onRefresh }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel max-w-4xl w-full rounded-2xl p-6 border border-purple-500/30 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white font-heading">
              API Execution Audit Logs & Inspector
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              title="Refresh Logs"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-lg">
              ✕
            </button>
          </div>
        </div>

        {/* Logs List */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-3 font-mono text-xs pr-1">
          {logs.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              No API execution logs recorded yet. Run a DEB ID search or submission to view live API request traces.
            </div>
          ) : (
            logs.map((log, idx) => (
              <div key={log.id || idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      log.method === 'POST' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {log.method}
                    </span>
                    <span className="text-slate-200 truncate max-w-md">{log.endpoint}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.response_status === 200 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      Status: {log.response_status}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : ''}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-slate-900 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Headers & Params:</span>
                    <div className="text-purple-300 truncate">{log.headers_sent}</div>
                    <div className="text-slate-400 truncate">{log.request_params}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Response Body:</span>
                    <div className="text-emerald-400 truncate">{log.response_body}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
