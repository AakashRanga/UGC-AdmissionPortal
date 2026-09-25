import React from 'react';

export function SimatsLogo({ className = "", showSubtitle = true }) {
  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* Official SIMATS University Emblem */}
      <img
        src="/logo1.png"
        alt="Saveetha Institute of Medical and Technical Sciences"
        className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 object-contain drop-shadow-sm hover:scale-105 transition-transform"
      />

      {/* University Titles in Official Navy Blue & Gold */}
      <div className="flex flex-col">
        <span className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 font-heading leading-tight">
          Saveetha Institute of Medical and Technical Sciences
        </span>
        {showSubtitle && (
          <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider mt-0.5">
            Online Education &bull; UGC DEB Portal
          </span>
        )}
      </div>
    </div>
  );
}
