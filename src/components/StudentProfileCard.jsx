import React from 'react';
import { User, Calendar, ShieldCheck, Clock, CheckCircle, ArrowRight } from 'lucide-react';

export function StudentProfileCard({ studentData, latency, onProceed }) {
  if (!studentData) return null;

  return (
    <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-indigo-500/30 relative shadow-2xl max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white font-heading">
                {studentData.studentName || 'Student Profile'}
              </h3>
              <span className="badge-success px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                UGC Verified
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Fetched profile from UGC DEB Portal API (GetStudentDetails)
            </p>
          </div>
        </div>

        {latency && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-center">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Response Latency: <strong className="text-indigo-300">{latency} ms</strong></span>
          </div>
        )}
      </div>

      {/* Grid Details - Exact 4 fields specified in UGC DOCX Section 5 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
        {/* Student Name */}
        <div className="glass-card p-3.5 rounded-xl">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            Student Name (studentName)
          </div>
          <p className="text-sm font-semibold text-white truncate">
            {studentData.studentName || 'N/A'}
          </p>
        </div>

        {/* Gender */}
        <div className="glass-card p-3.5 rounded-xl">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <User className="w-3.5 h-3.5 text-sky-400" />
            Gender (gender)
          </div>
          <p className="text-sm font-semibold text-slate-200">
            {studentData.gender || 'N/A'}
          </p>
        </div>

        {/* Date of Birth */}
        <div className="glass-card p-3.5 rounded-xl">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            Date of Birth (dob)
          </div>
          <p className="text-sm font-semibold font-mono text-slate-200">
            {studentData.dob || 'N/A'}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6 pt-5 border-t border-slate-800 flex justify-end">
        <button
          onClick={onProceed}
          className="gradient-btn px-6 py-3 rounded-xl font-semibold text-sm text-white flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/30"
        >
          <span>Fill HEI Admission Form</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
