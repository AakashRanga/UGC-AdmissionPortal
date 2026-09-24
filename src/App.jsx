import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DebSearchStep } from './components/DebSearchStep';
import { StudentProfileCard } from './components/StudentProfileCard';
import { AdmissionFormStep } from './components/AdmissionFormStep';
import { DatabaseViewer } from './components/DatabaseViewer';
import { LoginPage } from './components/LoginPage';
import { apiService } from './services/apiService';
import { CheckCircle2, AlertTriangle, Database, RotateCcw, X, Info } from 'lucide-react';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('deb_admin_user') || sessionStorage.getItem('deb_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Navigation tab: 'flow' (Admission Process) or 'database' (Admissions Database)
  const [activeTab, setActiveTab] = useState('flow');

  // Flow Stage: 'search' -> 'profile' -> 'form' -> 'success'
  const [flowStage, setFlowStage] = useState('search');

  const [mode, setMode] = useState('ONLINE'); // Default to ONLINE Mode
  const [debId, setDebId] = useState('');
  const [studentProfile, setStudentProfile] = useState(null);
  const [latency, setLatency] = useState(null);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [lastSubmission, setLastSubmission] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Database
  const [admissions, setAdmissions] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    // Keep toast visible for 12 seconds so user has time to read
    setTimeout(() => setToast(null), 12000);
  };

  useEffect(() => {
    loadAdmissions();
  }, []);

  const loadAdmissions = async () => {
    const res = await apiService.getAdmissions();
    if (res && res.data) {
      setAdmissions(res.data);
    }
  };

  // Step 1: Fetch Student Profile
  const handleFetchStudent = async (targetId) => {
    setLoadingFetch(true);
    setStudentProfile(null);
    setErrorMessage(null);

    const res = await apiService.fetchStudentDetails(targetId, mode);
    setLoadingFetch(false);

    if (res.status === 'success' && res.data) {
      setStudentProfile(res.data);
      setLatency(res.latency);
      setFlowStage('profile');
      showToast(`Student profile retrieved successfully for DEB ID ${targetId}`, 'success');
    } else {
      const errMsg = res.message || 'Unable to fetch student details from UGC DEB Portal.';
      setErrorMessage(errMsg);
      showToast(errMsg, 'error');
    }
  };

  // Step 3: Submit Admission Data
  const handleSubmitAdmission = async (formData) => {
    setLoadingSubmit(true);
    setErrorMessage(null);

    const res = await apiService.submitAdmission(formData, mode);
    setLoadingSubmit(false);

    if (res.status === 'success' || res.sync_status === 'UGC_SYNCED' || res.sync_status === 'LOCAL_ONLY') {
      setLastSubmission(res);
      setFlowStage('success');
      showToast(res.message || `Admission record #${res.db_record_id} saved successfully!`, 'success');
      loadAdmissions();
    } else {
      const errMsg = res.message || 'Admission submission error.';
      setErrorMessage(errMsg);
      showToast(errMsg, 'error');
      loadAdmissions();
    }
  };

  const [formData, setFormData] = useState({
    DEBuniqueID: '',
    ABCID: '',
    studentName: '',
    UniversityName: 'Saveetha Institute of Medical and Technical Sciences',
    EnrollmentNumber: '',
    ModeEducation: 'Online(OL)',
    CourseName: 'Bachelor of Computer Applications(BCA)',
    AdmissionDate: new Date().toISOString().split('T')[0],
    Category: 'General',
    GovernmentIdentifier: 'AADHAR Card',
    GovernmentIdentifierNumber: '',
    Locality: 'Urban',
    Nationality: 'Indian',
    CountryResidence: 'India',
    AdmissionDetails: '13'
  });

  const resetFlow = () => {
    setDebId('');
    setStudentProfile(null);
    setLastSubmission(null);
    setErrorMessage(null);
    setFormData({
      DEBuniqueID: '',
      ABCID: '',
      studentName: '',
      UniversityName: 'Saveetha Institute of Medical and Technical Sciences',
      EnrollmentNumber: '',
      ModeEducation: 'Online(OL)',
      CourseName: 'Bachelor of Computer Applications(BCA)',
      AdmissionDate: new Date().toISOString().split('T')[0],
      Category: 'General',
      GovernmentIdentifier: 'AADHAR Card',
      GovernmentIdentifierNumber: '',
      Locality: 'Urban',
      Nationality: 'Indian',
      CountryResidence: 'India',
      AdmissionDetails: '13'
    });
    setFlowStage('search');
  };

  const handleLogout = () => {
    localStorage.removeItem('deb_admin_user');
    localStorage.removeItem('deb_admin_token');
    sessionStorage.removeItem('deb_admin_user');
    sessionStorage.removeItem('deb_admin_token');
    setCurrentUser(null);
    showToast('Administrator session ended. Please login again to continue.', 'info');
  };

  // If administrator is not logged in, render LoginPage
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Welcome back, ${user.fullName || user.username}! Administrator access granted.`, 'success');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* Toast Alert Notification (With 12s timeout and manual Close button) */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce max-w-md w-full">
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-start justify-between gap-3 text-xs font-semibold backdrop-blur-xl ${
            toast.type === 'success'
              ? 'bg-emerald-950/95 text-emerald-200 border-emerald-500/50 shadow-emerald-500/20'
              : 'bg-rose-950/95 text-rose-200 border-rose-500/50 shadow-rose-500/20'
          }`}>
            <div className="flex items-start gap-2.5">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-bold uppercase tracking-wider text-[11px] mb-0.5">
                  {toast.type === 'success' ? 'Success Notification' : 'Validation / API Error'}
                </div>
                <div className="leading-relaxed">{toast.message}</div>
              </div>
            </div>

            <button
              onClick={() => setToast(null)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white shrink-0 transition-colors"
              title="Close Notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mode={mode}
        setMode={setMode}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8">
        {/* Error Banner inside active view if present */}
        {errorMessage && activeTab === 'flow' && (
          <div className="max-w-3xl mx-auto mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start justify-between gap-3 animate-fade-in shadow-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-rose-200">API Response Warning</h4>
                <p className="mt-1 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-200 text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* TAB 1: ADMISSION PROCESS FLOW (Sequential Step-by-Step Display) */}
        {activeTab === 'flow' && (
          <div className="space-y-6">
            {/* Interactive Step Progress Bar (Click any stage to navigate back/forward) */}
            <div className="max-w-3xl mx-auto bg-slate-900/80 p-2 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 shadow-xl mb-6">
              {/* Step 1 */}
              <button
                type="button"
                onClick={() => setFlowStage('search')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  flowStage === 'search'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  flowStage === 'search' ? 'bg-white text-indigo-600 font-bold' : 'bg-slate-800 text-slate-400'
                }`}>
                  1
                </span>
                <span>DEB Lookup</span>
              </button>

              <span className="text-slate-600 hidden sm:inline">&rarr;</span>

              {/* Step 2 */}
              <button
                type="button"
                onClick={() => {
                  if (studentProfile) setFlowStage('profile');
                  else showToast('Please fetch a DEB Unique ID first in Stage 1.', 'error');
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  flowStage === 'profile'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : studentProfile
                    ? 'text-indigo-300 hover:text-white hover:bg-slate-800'
                    : 'text-slate-600 hover:text-slate-400'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  flowStage === 'profile'
                    ? 'bg-white text-indigo-600 font-bold'
                    : studentProfile
                    ? 'bg-indigo-500/30 text-indigo-300'
                    : 'bg-slate-800 text-slate-600'
                }`}>
                  2
                </span>
                <span>Profile Review</span>
              </button>

              <span className="text-slate-600 hidden sm:inline">&rarr;</span>

              {/* Step 3 */}
              <button
                type="button"
                onClick={() => {
                  if (studentProfile || debId) setFlowStage('form');
                  else showToast('Please enter/fetch student details first.', 'error');
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  flowStage === 'form'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : (studentProfile || debId)
                    ? 'text-indigo-300 hover:text-white hover:bg-slate-800'
                    : 'text-slate-600 hover:text-slate-400'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  flowStage === 'form'
                    ? 'bg-white text-indigo-600 font-bold'
                    : (studentProfile || debId)
                    ? 'bg-indigo-500/30 text-indigo-300'
                    : 'bg-slate-800 text-slate-600'
                }`}>
                  3
                </span>
                <span>Admission Form</span>
              </button>

              <span className="text-slate-600 hidden sm:inline">&rarr;</span>

              {/* Step 4 */}
              <button
                type="button"
                onClick={() => {
                  if (lastSubmission) setFlowStage('success');
                  else showToast('No submission completed yet. Fill Stage 3 to submit.', 'error');
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  flowStage === 'success'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                    : lastSubmission
                    ? 'text-emerald-300 hover:text-white hover:bg-slate-800'
                    : 'text-slate-600 hover:text-slate-400'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  flowStage === 'success'
                    ? 'bg-white text-emerald-600 font-bold'
                    : lastSubmission
                    ? 'bg-emerald-500/30 text-emerald-300'
                    : 'bg-slate-800 text-slate-600'
                }`}>
                  4
                </span>
                <span>Complete</span>
              </button>
            </div>

            {/* Stage 1: Search */}
            {flowStage === 'search' && (
              <DebSearchStep
                debId={debId}
                setDebId={setDebId}
                onFetch={handleFetchStudent}
                loading={loadingFetch}
                mode={mode}
              />
            )}

            {/* Stage 2: Fetched Student Profile */}
            {flowStage === 'profile' && studentProfile && (
              <StudentProfileCard
                studentData={studentProfile}
                latency={latency}
                onProceed={() => setFlowStage('form')}
                onBack={() => setFlowStage('search')}
              />
            )}

            {/* Stage 3: Dynamic Admission Entry Form */}
            {flowStage === 'form' && (
              <AdmissionFormStep
                debId={debId}
                studentData={studentProfile}
                onSubmit={handleSubmitAdmission}
                submitting={loadingSubmit}
                mode={mode}
                formData={formData}
                setFormData={setFormData}
                onBackToProfile={() => setFlowStage(studentProfile ? 'profile' : 'search')}
                onBackToSearch={() => setFlowStage('search')}
              />
            )}

            {/* Stage 4: Submission Confirmation */}
            {flowStage === 'success' && lastSubmission && (
              <div className="glass-panel rounded-2xl p-8 max-w-2xl mx-auto border border-emerald-500/30 text-center space-y-6 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white font-heading">
                    Admission Submitted & Saved!
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Student admission record <strong className="text-indigo-300">#{lastSubmission.admission_id || lastSubmission.db_record_id}</strong> has been stored in MySQL and pushed to UGC API.
                  </p>
                </div>

                {/* Multi-action Back & Next Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setFlowStage('form')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 border border-slate-700 cursor-pointer transition-all"
                  >
                    <span>&larr; Back to Stage 3 (Form)</span>
                  </button>

                  <button
                    onClick={() => setFlowStage('profile')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 border border-slate-700 cursor-pointer transition-all"
                  >
                    <span>&larr; Back to Stage 2 (Profile)</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('database')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-indigo-300 hover:text-white flex items-center justify-center gap-2 border border-slate-700 cursor-pointer transition-all"
                  >
                    <Database className="w-4 h-4 text-indigo-400" />
                    <span>View Admissions Database</span>
                  </button>

                  <button
                    onClick={resetFlow}
                    className="gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Process Next Admission</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ADMISSIONS DATABASE TABLE */}
        {activeTab === 'database' && (
          <DatabaseViewer
            admissions={admissions}
            onRefresh={loadAdmissions}
            onDelete={(id) => {
              apiService.deleteAdmission(id);
              showToast(`Deleted record #${id}`, 'info');
              loadAdmissions();
            }}
          />
        )}
      </main>
    </div>
  );
}
