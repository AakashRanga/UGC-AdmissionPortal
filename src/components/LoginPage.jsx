import React, { useState } from 'react';
import { Lock, User, KeyRound, ShieldAlert, CheckCircle2, Eye, EyeOff, Loader2, Sparkles, Building2 } from 'lucide-react';
import { apiService } from '../services/apiService';

export function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both administrator username and password.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const res = await apiService.login(username.trim(), password.trim());
    setLoading(false);

    if (res.status === 'success' && res.user) {
      if (rememberMe) {
        localStorage.setItem('deb_admin_user', JSON.stringify(res.user));
        localStorage.setItem('deb_admin_token', res.token);
      } else {
        sessionStorage.setItem('deb_admin_user', JSON.stringify(res.user));
        sessionStorage.setItem('deb_admin_token', res.token);
      }
      onLoginSuccess(res.user);
    } else {
      setErrorMessage(res.message || 'Authentication failed. Please verify administrator credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-950 relative overflow-hidden text-slate-100 font-sans">
      {/* Dynamic Background Glow Effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Center Login Box */}
      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-indigo-500/30 shadow-2xl backdrop-blur-2xl animate-fade-in relative overflow-hidden">
          
          {/* Top Decorative Border Highlight */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600" />

          {/* SIMATS University Logo & Branding */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img
                src="/logo1.png"
                alt="Saveetha Institute of Medical and Technical Sciences"
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              />
            </div>

            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight font-heading leading-snug">
              Saveetha Institute of Medical and Technical Sciences
            </h1>
            <p className="text-xs text-indigo-300 mt-1.5 font-semibold">
              UGC DEB Student Admission Management Portal
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Admin Gateway &bull; Authorized Personnel Access Only
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 animate-shake shadow-lg">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4 text-indigo-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-xs font-medium text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 transition-all"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 text-indigo-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl glass-input text-xs font-medium text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span>Remember this session</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-btn py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 cursor-pointer disabled:opacity-50 transition-all mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Sign In to Admin Portal</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
