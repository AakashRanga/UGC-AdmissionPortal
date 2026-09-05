import React, { useState } from 'react';
import { Database, Search, Download, Trash2, CheckCircle2, AlertTriangle, RefreshCw, FileText } from 'lucide-react';

export function DatabaseViewer({ admissions, onRefresh, onDelete }) {
  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const filteredAdmissions = admissions.filter(r => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (r.deb_unique_id && r.deb_unique_id.toLowerCase().includes(s)) ||
      (r.student_name && r.student_name.toLowerCase().includes(s)) ||
      (r.enrollment_no && r.enrollment_no.toLowerCase().includes(s)) ||
      (r.programme_name && r.programme_name.toLowerCase().includes(s)) ||
      (r.country_residence && r.country_residence.toLowerCase().includes(s))
    );
  });

  const exportCSV = () => {
    if (admissions.length === 0) return;
    const headers = [
      "ID", "DEB Unique ID", "ABC ID", "Student Name", "HEI Code",
      "Enrollment No", "Mode Education", "Programme Name", "Admission Date",
      "Category", "Gov ID Type", "Gov ID Number", "Locality",
      "Nationality", "Country Residence", "Sync Status", "Mode Used", "Created At"
    ];
    
    const rows = admissions.map(r => [
      r.id, r.deb_unique_id, r.abc_id, `"${r.student_name || ''}"`, r.hei_code,
      r.enrollment_no, `"${r.mode_education}"`, `"${r.programme_name}"`, r.admission_date,
      r.category, r.gov_id_type, r.gov_id_number, r.locality,
      r.nationality, `"${r.country_residence}"`, r.sync_status, r.mode_used, r.created_at
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `UGC_DEB_Admissions_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-slate-800 relative shadow-2xl animate-fade-in max-w-6xl mx-auto">
      {/* Table Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xl font-bold text-white font-heading">
              Admissions Database
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete records of all processed student admissions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-all"
            title="Refresh Records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={exportCSV}
            disabled={admissions.length === 0}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Search Input Filter */}
      <div className="mt-5 mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search admissions by DEB Unique ID, Student Name, Enrollment No, Programme..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white"
          />
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900/90 text-slate-300 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">DEB Unique ID</th>
              <th className="py-3 px-4">Student Name</th>
              <th className="py-3 px-4">Programme & Mode</th>
              <th className="py-3 px-4">Enrollment No</th>
              <th className="py-3 px-4">Country</th>
              <th className="py-3 px-4">Sync Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredAdmissions.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                  No admission records found in database.
                </td>
              </tr>
            ) : (
              filteredAdmissions.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400">#{rec.id}</td>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-300">{rec.deb_unique_id}</td>
                  <td className="py-3 px-4 font-semibold text-white">{rec.student_name || 'N/A'}</td>
                  <td className="py-3 px-4 text-slate-300">
                    <div>{rec.programme_name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{rec.mode_education}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">{rec.enrollment_no}</td>
                  <td className="py-3 px-4 text-slate-300">{rec.country_residence}</td>
                  <td className="py-3 px-4">
                    {rec.sync_status === 'UGC_SYNCED' ? (
                      <span className="badge-success px-2 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> UGC Synced
                      </span>
                    ) : rec.sync_status === 'LOCAL_ONLY' ? (
                      <span className="badge-warning px-2 py-0.5 rounded-full text-[10px] font-semibold inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Saved
                      </span>
                    ) : (
                      <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        Sync Failed
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedRecord(rec)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 transition-all"
                        title="View Payload Details"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(rec.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-all"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel max-w-2xl w-full rounded-2xl p-6 border border-indigo-500/30 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h4 className="text-base font-bold text-white font-heading">
                Admission Record #{selectedRecord.id} Details
              </h4>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Admission Details:
                </label>
                <pre className="p-3.5 rounded-xl bg-slate-950 text-xs font-mono text-indigo-300 overflow-x-auto border border-slate-800">
                  {JSON.stringify(selectedRecord, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
