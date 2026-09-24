import React from 'react';

export function SimatsLogo({ className = "", showSubtitle = true }) {
  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* Official SIMATS University Emblem */}
      <img
        src="/logo1.png"
        alt="Saveetha Institute of Medical and Technical Sciences"
        className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 object-contain drop-shadow-md hover:scale-105 transition-transform"
      />

      {/* University Titles */}
      <div className="flex flex-col">
        <span className="text-sm sm:text-base font-extrabold tracking-tight text-white font-heading leading-tight">
          Saveetha Institute of Medical and Technical Sciences
        </span>
        {showSubtitle && (
          <span className="text-[10px] text-slate-400 font-medium mt-0.5">
            Directorate of Distance & Online Education &bull; UGC DEB Portal
          </span>
        )}
      </div>
    </div>
  );
}
