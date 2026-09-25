import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileText,
  X,
  User,
  Building2,
  Calendar,
  Shield,
  Globe,
  Clock,
  Check,
  Copy,
  Hash
} from 'lucide-react';

export function DatabaseViewer({ admissions, onRefresh, onDelete }) {
  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [copied, setCopied] = useState(false);

  // Close modal with ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedRecord(null);
      }
    };
    if (selectedRecord) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedRecord]);

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

  const handleCopySummary = () => {
    if (!selectedRecord) return;
    const summaryText = `UGC DEB Admission Record #${selectedRecord.id}
Student Name: ${selectedRecord.student_name || 'N/A'}
DEB Unique ID: ${selectedRecord.deb_unique_id}
ABC ID: ${selectedRecord.abc_id || 'N/A'}
HEI / University: ${selectedRecord.hei_code}
Programme: ${selectedRecord.programme_name}
Mode: ${selectedRecord.mode_education}
Enrollment No: ${selectedRecord.enrollment_no}
Admission Date: ${selectedRecord.admission_date}
Category: ${selectedRecord.category}
Government ID: ${selectedRecord.gov_id_type} (${selectedRecord.gov_id_number})
Locality: ${selectedRecord.locality}
Country: ${selectedRecord.country_residence}
Sync Status: ${selectedRecord.sync_status} (${selectedRecord.mode_used || 'ONLINE'})`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-slate-200/90 relative shadow-xl animate-fade-in w-full bg-white/90 backdrop-blur-md">
      {/* Table Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-700" />
            <h3 className="text-xl font-bold text-slate-900 font-heading">
              Admissions Database
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete records of all processed student admissions saved in MySQL Database.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
            title="Refresh Records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={exportCSV}
            disabled={admissions.length === 0}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Search Input Filter & Count Badge */}
      <div className="mt-5 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search admissions by DEB Unique ID, Student Name, Enrollment No, Programme..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-slate-900 placeholder-slate-400"
          />
        </div>
        <div className="text-xs text-slate-600 font-medium shrink-0 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
          Showing <strong className="text-blue-700 font-bold">{filteredAdmissions.length}</strong> of {admissions.length} records
        </div>
      </div>

      {/* Table Data Container with Horizontal & Vertical Scrolling + Sticky Header */}
      <div className="max-h-[560px] overflow-auto rounded-xl border border-slate-200 shadow-sm custom-scrollbar relative bg-white">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-50 backdrop-blur-md shadow-sm">
            <tr className="text-slate-700 border-b border-slate-200">
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] bg-slate-50">#</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] bg-slate-50">Student Name</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] bg-slate-50">DEB Unique ID</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] bg-slate-50">Programme</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] bg-slate-50">Mode</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] bg-slate-50">Enrollment No</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] bg-slate-50">Admission Date</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] bg-slate-50">UGC Sync Status</th>
              <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] bg-slate-50 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAdmissions.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  No admission records found. Complete Step 3 to submit and save student admissions.
                </td>
              </tr>
            ) : (
              filteredAdmissions.map((rec, index) => (
                <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-500">{index + 1}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 truncate max-w-[160px]">
                    {rec.student_name || 'N/A'}
                  </td>
                  <td className="py-3 px-4 font-mono text-blue-700 font-bold">{rec.deb_unique_id}</td>
                  <td className="py-3 px-4 text-slate-700 truncate max-w-[180px]">{rec.programme_name}</td>
                  <td className="py-3 px-4 text-slate-700">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-mono border border-slate-200">
                      {rec.mode_education}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-800">{rec.enrollment_no}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{rec.admission_date}</td>
                  <td className="py-3 px-4">
                    {rec.sync_status === 'UGC_SYNCED' ? (
                      <span className="badge-success px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" />
                        UGC Synced
                      </span>
                    ) : rec.sync_status === 'LOCAL_ONLY' ? (
                      <span className="badge-purple px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit">
                        Local Test
                      </span>
                    ) : (
                      <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3 h-3" />
                        Sync Failed
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedRecord(rec)}
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 transition-all cursor-pointer border border-blue-200"
                        title="View Admission Details"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(rec.id)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-all cursor-pointer border border-slate-200"
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

      {/* Modern Structured Record Details Modal (Light Education Theme) */}
      {selectedRecord && (
        <div
          onClick={() => setSelectedRecord(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-amber-950/20 backdrop-blur-sm animate-fade-in overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-panel max-w-5xl lg:max-w-6xl xl:max-w-7xl w-full rounded-2xl p-6 lg:p-8 border border-amber-100 shadow-2xl max-h-[88vh] overflow-y-auto space-y-6 my-auto animate-scale-up bg-white/95"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 font-heading">
                      Admission Record #{selectedRecord.id}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 border ${
                      selectedRecord.sync_status === 'UGC_SYNCED'
                        ? 'badge-success'
                        : selectedRecord.sync_status === 'LOCAL_ONLY'
                        ? 'badge-purple'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {selectedRecord.sync_status === 'UGC_SYNCED' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          UGC Synced
                        </>
                      ) : selectedRecord.sync_status === 'LOCAL_ONLY' ? (
                        'Local Test Mode'
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3" />
                          Sync Failed
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Saved on {selectedRecord.created_at ? new Date(selectedRecord.created_at).toLocaleString() : 'N/A'} • Mode: {selectedRecord.mode_used || 'ONLINE'}
                  </p>
                </div>
              </div>

              {/* Close Icon Button */}
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
                title="Close (or press Esc / tap outside)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: Student Information Card */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                1. Student Profile
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] text-slate-500 mb-1">Student Name</div>
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {selectedRecord.student_name || 'N/A'}
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] text-slate-500 mb-1">DEB Unique ID</div>
                  <div className="text-xs font-mono font-bold text-blue-700">
                    {selectedRecord.deb_unique_id}
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] text-slate-500 mb-1">ABC ID</div>
                  <div className="text-xs font-mono text-purple-700 font-bold">
                    {selectedRecord.abc_id || 'NA'}
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] text-slate-500 mb-1">Social Category</div>
                  <div className="text-xs font-bold text-slate-900">
                    {selectedRecord.category}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Academic & HEI Details Card */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-800 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                2. Academic & Higher Educational Institution (HEI)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="sm:col-span-2 lg:col-span-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] text-slate-500 mb-1">Institution Name / HEI AISHE</div>
                  <div className="text-xs font-bold text-slate-900">
                    {selectedRecord.hei_code}
                  </div>
                </div>

                <div className="sm:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] text-slate-500 mb-1">Programme / Course Name</div>
                  <div className="text-xs font-bold text-slate-900">
                    {selectedRecord.programme_name}
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] text-slate-500 mb-1">Mode of Education</div>
                  <div className="text-xs font-bold text-blue-700">
                    {selectedRecord.mode_education}
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] text-slate-500 mb-1">Student Enrollment No</div>
                  <div className="text-xs font-mono font-bold text-slate-900">
                    {selectedRecord.enrollment_no}
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] text-slate-500 mb-1">Admission Date</div>
                  <div className="text-xs font-mono font-bold text-slate-900">
                    {selectedRecord.admission_date}
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] text-slate-500 mb-1">Admission Details Code</div>
                  <div className="text-xs font-mono font-bold text-slate-900">
                    {selectedRecord.admission_details || '13'}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Demographic & Government Identification */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                3. Identity & Demographics
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] text-slate-500 mb-1">Government ID Type</div>
                  <div className="text-xs font-bold text-slate-900">
                    {selectedRecord.gov_id_type}
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] text-slate-500 mb-1">ID Number</div>
                  <div className="text-xs font-mono text-slate-900 font-bold">
                    {selectedRecord.gov_id_number}
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] text-slate-500 mb-1">Locality</div>
                  <div className="text-xs font-bold text-slate-900">
                    {selectedRecord.locality}
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-[11px] text-slate-500 mb-1">Country of Residence</div>
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {selectedRecord.country_residence}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCopySummary}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-200"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied Summary!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Record Summary</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-700/20"
              >
                <span>Close Details</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
