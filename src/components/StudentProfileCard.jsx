import React from 'react';
import { User, Calendar, Clock, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export function StudentProfileCard({ studentData, latency, onProceed, onBack }) {
  if (!studentData) return null;

  return (
    <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-slate-200/90 relative shadow-xl max-w-3xl mx-auto animate-fade-in bg-white/90 backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                {studentData.studentName || 'Student Profile'}
              </h3>
              <span className="badge-success px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                UGC Verified
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Fetched profile from UGC DEB Portal API (GetStudentDetails)
            </p>
          </div>
        </div>

        {latency && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-center">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Response Latency: <strong className="text-blue-700 font-bold">{latency} ms</strong></span>
          </div>
        )}
      </div>

      {/* Grid Details - Exact 4 fields specified in UGC DOCX Section 5 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
        {/* Student Name */}
        <div className="glass-card p-4 rounded-xl bg-white/85 border border-amber-100/90 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <span>Student Name</span>
          </div>
          <p className="text-sm font-bold text-slate-900 truncate">
            {studentData.studentName || 'N/A'}
          </p>
        </div>

        {/* Gender */}
        <div className="glass-card p-4 rounded-xl bg-white/85 border border-amber-100/90 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-sky-50 flex items-center justify-center text-sky-700 shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <span>Gender</span>
          </div>
          <p className="text-sm font-bold text-slate-900">
            {studentData.gender || 'N/A'}
          </p>
        </div>

        {/* Date of Birth */}
        <div className="glass-card p-4 rounded-xl bg-white/85 border border-amber-100/90 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <span>Date of Birth</span>
          </div>
          <p className="text-sm font-bold font-mono text-slate-900">
            {studentData.dob || 'N/A'}
          </p>
        </div>
      </div>

      {/* Action Buttons: Back to Stage 1 & Proceed to Stage 3 */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-4 py-2.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Stage 1 (DEB Search)</span>
        </button>

        <button
          type="button"
          onClick={onProceed}
          className="w-full sm:w-auto gradient-btn px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-700/20"
        >
          <span>Proceed to Stage 3 (Admission Form)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
