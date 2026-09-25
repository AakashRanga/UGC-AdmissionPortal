import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DebSearchStep } from './components/DebSearchStep';
import { StudentProfileCard } from './components/StudentProfileCard';
import { AdmissionFormStep } from './components/AdmissionFormStep';
import { DatabaseViewer } from './components/DatabaseViewer';
import { LoginPage } from './components/LoginPage';
import { apiService } from './services/apiService';
import { CheckCircle2, AlertTriangle, Database, RotateCcw, X, Info, Sparkles, Palette } from 'lucide-react';

export default function App() {
  // Marble Background Toggle (Default: false -> Plain #FDF3DE, ON -> Marble Effect)
  const [marbleOn, setMarbleOn] = useState(() => {
    try {
      const stored = localStorage.getItem('deb_marble_on');
      return stored !== null ? JSON.parse(stored) : false; // Default: false (plain #FDF3DE)
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem('deb_marble_on', JSON.stringify(marbleOn));
    if (marbleOn) {
      document.body.classList.remove('bg-plain-theme');
    } else {
      document.body.classList.add('bg-plain-theme');
    }
  }, [marbleOn]);

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
  const handleSubmitAdmission = async (formDataToSubmit) => {
    setLoadingSubmit(true);
    setErrorMessage(null);

    const res = await apiService.submitAdmission(formDataToSubmit, mode);
    setLoadingSubmit(false);

    if (res.status === 'success' || res.sync_status === 'UGC_SYNCED' || res.sync_status === 'LOCAL_ONLY') {
      setLastSubmission(res);
      // Clear previous stage data so the same application cannot be re-submitted
      setDebId('');
      setStudentProfile(null);
      setFormData({
        DEBuniqueID: '',
        ABCID: '',
        studentName: '',
        UniversityName: '',
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
    UniversityName: '',
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
      UniversityName: '',
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
        marbleOn={marbleOn}
        setMarbleOn={setMarbleOn}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800">
      {/* Toast Alert Notification (With 12s timeout and manual Close button) */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce max-w-md w-full px-4">
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-start justify-between gap-3 text-xs font-semibold backdrop-blur-xl ${toast.type === 'success'
            ? 'bg-white/95 text-emerald-950 border-emerald-300 shadow-emerald-500/10'
            : toast.type === 'warning'
              ? 'bg-white/95 text-amber-950 border-amber-300 shadow-amber-500/10'
              : toast.type === 'info'
                ? 'bg-white/95 text-blue-950 border-blue-300 shadow-blue-500/10'
                : 'bg-white/95 text-rose-950 border-rose-300 shadow-rose-500/10'
            }`}>
            <div className="flex items-start gap-2.5">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : toast.type === 'warning' ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : toast.type === 'info' ? (
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <div className={`font-bold uppercase tracking-wider text-[11px] mb-0.5 ${toast.type === 'success'
                  ? 'text-emerald-700'
                  : toast.type === 'warning'
                    ? 'text-amber-700'
                    : toast.type === 'info'
                      ? 'text-blue-700'
                      : 'text-rose-700'
                  }`}>
                  {toast.type === 'success'
                    ? 'Success Notification'
                    : toast.type === 'warning'
                      ? 'Stage Notice / Warning'
                      : toast.type === 'info'
                        ? 'Information'
                        : 'Validation / API Error'}
                </div>
                <div className="leading-relaxed text-slate-700">{toast.message}</div>
              </div>
            </div>

            <button
              onClick={() => setToast(null)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 shrink-0 transition-colors cursor-pointer"
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
      <main className={`flex-1 w-full mx-auto px-4 lg:px-8 py-6 transition-all ${activeTab === 'database' ? 'max-w-[98vw]' : 'max-w-7xl'
        }`}>
        {/* Error Banner inside active view if present */}
        {errorMessage && activeTab === 'flow' && (
          <div className="max-w-3xl mx-auto mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start justify-between gap-3 animate-fade-in shadow-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-rose-800">API Response Warning</h4>
                <p className="mt-1 leading-relaxed text-rose-700">{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-700 hover:text-rose-900 text-xs font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* TAB 1: ADMISSION PROCESS FLOW (Sequential Step-by-Step Display) */}
        {activeTab === 'flow' && (
          <div className="space-y-6">
            {/* Interactive Step Progress Bar (Click any stage to navigate back/forward) */}
            <div className="max-w-3xl mx-auto bg-white/85 backdrop-blur-md p-1.5 rounded-full border border-amber-200/60 flex flex-wrap items-center justify-between gap-1 shadow-xs mb-6">
              {/* Step 1 */}
              <button
                type="button"
                onClick={() => {
                  if (flowStage === 'success') resetFlow();
                  else setFlowStage('search');
                }}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${flowStage === 'search'
                  ? 'bg-[#FDF3DE] text-[#9A3412] font-bold shadow-xs border border-amber-300/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${flowStage === 'search' ? 'bg-[#9A3412] text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                  1
                </span>
                <span>DEB Lookup</span>
              </button>

              <span className="text-amber-200 hidden sm:inline">&rarr;</span>

              {/* Step 2 */}
              <button
                type="button"
                onClick={() => {
                  if (flowStage === 'success') {
                    showToast("Admission already completed. Click 'Process Next Admission' to start a new entry.", 'info');
                  } else if (studentProfile) {
                    setFlowStage('profile');
                  } else {
                    showToast('Please fetch a DEB Unique ID first in Stage 1.', 'warning');
                  }
                }}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${flowStage === 'profile'
                  ? 'bg-[#FDF3DE] text-[#9A3412] font-bold shadow-xs border border-amber-300/80'
                  : studentProfile
                    ? 'text-amber-900 hover:bg-amber-50'
                    : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${flowStage === 'profile'
                  ? 'bg-[#9A3412] text-white'
                  : studentProfile
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-400'
                  }`}>
                  2
                </span>
                <span>Profile Review</span>
              </button>

              <span className="text-amber-200 hidden sm:inline">&rarr;</span>

              {/* Step 3 */}
              <button
                type="button"
                onClick={() => {
                  if (flowStage === 'success') {
                    showToast("Admission already completed. Click 'Process Next Admission' to start a new entry.", 'info');
                  } else if (studentProfile || debId) {
                    setFlowStage('form');
                  } else {
                    showToast('Please fetch a DEB Unique ID first in Stage 1.', 'warning');
                  }
                }}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${flowStage === 'form'
                  ? 'bg-[#FDF3DE] text-[#9A3412] font-bold shadow-xs border border-amber-300/80'
                  : (studentProfile || debId)
                    ? 'text-amber-900 hover:bg-amber-50'
                    : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${flowStage === 'form'
                  ? 'bg-[#9A3412] text-white'
                  : (studentProfile || debId)
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-400'
                  }`}>
                  3
                </span>
                <span>Admission Form</span>
              </button>

              <span className="text-amber-200 hidden sm:inline">&rarr;</span>

              {/* Step 4 */}
              <button
                type="button"
                onClick={() => {
                  if (lastSubmission) setFlowStage('success');
                  else showToast('Please complete Stage 3 to submit admission details first.', 'warning');
                }}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${flowStage === 'success'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : lastSubmission
                    ? 'text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50'
                    : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${flowStage === 'success'
                  ? 'bg-white text-emerald-600'
                  : lastSubmission
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-400'
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
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-10 max-w-2xl mx-auto border border-emerald-200 text-center space-y-6 shadow-2xl animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900 font-heading">
                    Admission Submitted & Saved!
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Student admission record <strong className="text-blue-700 font-bold">#{lastSubmission.admission_id || lastSubmission.db_record_id}</strong> has been stored in MySQL and pushed to UGC API.
                  </p>
                </div>

                {/* Final Actions (Only View Admissions Database & Process Next Admission) */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('database')}
                    className="px-6 py-3 rounded-full bg-blue-50 hover:bg-blue-100 text-xs font-semibold text-blue-800 flex items-center justify-center gap-2 border border-blue-200 cursor-pointer transition-all shadow-xs"
                  >
                    <Database className="w-4 h-4 text-blue-600" />
                    <span>View Admissions Database</span>
                  </button>

                  <button
                    onClick={resetFlow}
                    className="gradient-btn px-7 py-3 rounded-full text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
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

      {/* Minimal Marble Background Toggle (Default: OFF / #FDF3DE Plain, ON: Marble) */}
      <div className="fixed bottom-5 left-5 z-40 animate-fade-in">
        <button
          type="button"
          onClick={() => setMarbleOn(!marbleOn)}
          className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full border border-amber-200/90 shadow-lg flex items-center gap-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer transition-all hover:scale-105 active:scale-95"
          title="Toggle Marble Background (Default: Plain #FDF3DE)"
        >
          <div className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors duration-200 ${marbleOn ? 'bg-amber-600' : 'bg-slate-300'
            }`}>
            <div className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-200 ${marbleOn ? 'translate-x-3.5' : 'translate-x-0'
              }`} />
          </div>
          <span className={`text-[10px] font-bold uppercase ${marbleOn ? 'text-amber-700' : 'text-slate-400'}`}>
            {marbleOn ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>
    </div>
  );
}
