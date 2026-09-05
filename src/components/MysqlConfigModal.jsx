import React, { useState } from 'react';
import { Database, Server, Key, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { apiService } from '../services/apiService';

export function MysqlConfigModal({ isOpen, onClose, onConfigSaved, activeDb }) {
  const [config, setConfig] = useState({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'ugc_deb_admission'
  });
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleConnect = async (e) => {
    e.preventDefault();
    setTesting(true);
    setResult(null);

    const res = await apiService.updateMySQLConfig(config);
    setTesting(false);
    setResult(res);

    if (res.status === 'success') {
      onConfigSaved(res.active_type);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel max-w-md w-full rounded-2xl p-6 border border-indigo-500/30 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white font-heading">
              MySQL Database Configuration
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold">
            ✕
          </button>
        </div>

        <form onSubmit={handleConnect} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Host / Server Address
            </label>
            <input
              type="text"
              value={config.host}
              onChange={(e) => setConfig({ ...config, host: e.target.value })}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Port
              </label>
              <input
                type="number"
                value={config.port}
                onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value) || 3306 })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Database Name
              </label>
              <input
                type="text"
                value={config.database}
                onChange={(e) => setConfig({ ...config, database: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              MySQL Username
            </label>
            <input
              type="text"
              value={config.user}
              onChange={(e) => setConfig({ ...config, user: e.target.value })}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              MySQL Password
            </label>
            <input
              type="password"
              value={config.password}
              onChange={(e) => setConfig({ ...config, password: e.target.value })}
              placeholder="Enter MySQL password"
              className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono text-white"
            />
          </div>

          {result && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              result.status === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
            }`}>
              {result.status === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />}
              <div>{result.message}</div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={testing}
              className="gradient-btn px-5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2"
            >
              {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
              <span>Test & Connect MySQL</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
