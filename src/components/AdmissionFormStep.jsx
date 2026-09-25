import React, { useState, useEffect } from 'react';
import { Send, FileText, Globe, Building2, Shield, Search, Loader2, ArrowLeft, User, Calendar, CheckCircle, AlertTriangle, X, CheckCircle2, AlertOctagon, Database } from 'lucide-react';
import countries from '../data/countries.json';
import { DEB_RECOGNIZED_COURSES } from '../data/mockDebData';
import { apiService } from '../services/apiService';

export function AdmissionFormStep({
  debId,
  studentData,
  onSubmit,
  submitting,
  mode,
  onBackToProfile,
  onBackToSearch,
  formData: externalFormData,
  setFormData: setExternalFormData
}) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [dbDuplicateInfo, setDbDuplicateInfo] = useState({
    isDuplicate: false,
    debExists: null,
    enrollmentExists: null,
    checking: false
  });

  const [internalFormData, setInternalFormData] = useState({
    DEBuniqueID: debId || '',
    ABCID: '',
    studentName: (studentData && (studentData.studentName || studentData.stdname || studentData.StudentName)) || '',
    UniversityName: (studentData && (studentData.universityName || studentData.UniversityName)) || '',
    EnrollmentNumber: '',
    ModeEducation: 'Online(OL)',
    CourseName: DEB_RECOGNIZED_COURSES[0],
    AdmissionDate: new Date().toISOString().split('T')[0],
    Category: 'General',
    GovernmentIdentifier: 'AADHAR Card',
    GovernmentIdentifierNumber: '',
    Locality: 'Urban',
    Nationality: 'Indian',
    CountryResidence: 'India',
    AdmissionDetails: '13'
  });

  const formData = externalFormData || internalFormData;
  const setFormData = setExternalFormData || setInternalFormData;

  const [countryQuery, setCountryQuery] = useState(formData.CountryResidence || 'India');
  const [isCountryOpen, setIsCountryOpen] = useState(false);

  useEffect(() => {
    if (debId || studentData) {
      setFormData(prev => ({
        ...prev,
        DEBuniqueID: debId || prev.DEBuniqueID,
        studentName: studentData?.studentName || studentData?.stdname || studentData?.StudentName || prev.studentName,
        UniversityName: studentData?.universityName || studentData?.UniversityName || prev.UniversityName || ''
      }));
    }
  }, [debId, studentData]);

  // Realtime Database Duplicate Check (Debounced)
  useEffect(() => {
    const deb = formData.DEBuniqueID ? formData.DEBuniqueID.trim() : '';
    const enr = formData.EnrollmentNumber ? formData.EnrollmentNumber.trim() : '';

    if (!deb && !enr) {
      setDbDuplicateInfo({ isDuplicate: false, debExists: null, enrollmentExists: null, checking: false });
      return;
    }

    const timer = setTimeout(async () => {
      setDbDuplicateInfo(prev => ({ ...prev, checking: true }));
      try {
        const res = await apiService.checkDuplicateAdmission(deb, enr);
        if (res && res.status === "success") {
          setDbDuplicateInfo({
            isDuplicate: res.is_duplicate,
            debExists: res.deb_exists,
            enrollmentExists: res.enrollment_exists,
            checking: false
          });
        } else {
          setDbDuplicateInfo(prev => ({ ...prev, checking: false }));
        }
      } catch {
        setDbDuplicateInfo(prev => ({ ...prev, checking: false }));
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [formData.DEBuniqueID, formData.EnrollmentNumber]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredCountries = countries.filter(c =>
    c.toLowerCase().includes(countryQuery.toLowerCase())
  );

  const isDebAndEnrollmentSame = Boolean(
    formData.DEBuniqueID &&
    formData.EnrollmentNumber &&
    formData.DEBuniqueID.trim().toLowerCase() === formData.EnrollmentNumber.trim().toLowerCase()
  );

  const isDebInDb = Boolean(dbDuplicateInfo.debExists);
  const isEnrollmentInDb = Boolean(dbDuplicateInfo.enrollmentExists);
  const hasValidationError = isDebAndEnrollmentSame || isDebInDb || isEnrollmentInDb;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (hasValidationError) {
      return;
    }
    setShowConfirmModal(true);
  };

  const handleFinalConfirm = () => {
    setShowConfirmModal(false);
    onSubmit(formData);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-slate-200/90 relative shadow-xl max-w-4xl mx-auto animate-fade-in space-y-6 bg-white/90 backdrop-blur-md">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold uppercase tracking-wider mb-1">
            Step 3: New Student Admission Entry
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-heading">
            HEI Admission Form & UGC Reverse Push
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {onBackToSearch && (
            <button
              type="button"
              onClick={onBackToSearch}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 cursor-pointer border border-slate-200 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Stage 1 (Search)</span>
            </button>
          )}
          {onBackToProfile && (
            <button
              type="button"
              onClick={onBackToProfile}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-800 flex items-center gap-1.5 cursor-pointer border border-blue-200 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Stage 2 (Profile)</span>
            </button>
          )}
        </div>
      </div>

      {/* Realtime Validation Error Banner: DEB ID == Enrollment No */}
      {isDebAndEnrollmentSame && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-center gap-3 animate-fade-in shadow-xs">
          <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <strong className="font-bold">Form Validation Error:</strong> DEB Unique ID and Student Enrollment Number cannot be identical. Please enter the student's distinct HEI Enrollment Number.
          </div>
        </div>
      )}

      {/* Realtime Validation Error Banner: DEB Unique ID already in Database */}
      {isDebInDb && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-center gap-3 animate-fade-in shadow-xs">
          <Database className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <strong className="font-bold">Database Duplicate Error:</strong> DEB Unique ID <span className="font-mono font-bold text-amber-900">{formData.DEBuniqueID}</span> is already recorded in the database (Record #{dbDuplicateInfo.debExists.id} for <em>{dbDuplicateInfo.debExists.student_name}</em>). Duplicate admissions for the same DEB ID are not permitted.
          </div>
        </div>
      )}

      {/* Realtime Validation Error Banner: Enrollment Number already in Database */}
      {isEnrollmentInDb && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-950 text-xs flex items-center gap-3 animate-fade-in shadow-xs">
          <Database className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <strong className="font-bold">Database Duplicate Error:</strong> Enrollment Number <span className="font-mono font-bold text-rose-900">{formData.EnrollmentNumber}</span> already exists in the database (Assigned to <em>{dbDuplicateInfo.enrollmentExists.student_name}</em>, DEB ID: <span className="font-mono font-semibold">{dbDuplicateInfo.enrollmentExists.deb_unique_id}</span>). Enrollment Numbers must be unique.
          </div>
        </div>
      )}

      {/* UGC Fetched Credentials Summary Banner */}
      {studentData && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
          <div className="flex items-center justify-between text-xs text-emerald-800 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Credentials Fetched from UGC DEB Portal API (GetStudentDetails):
            </span>
            <span className="text-[10px] bg-emerald-200/60 px-2 py-0.5 rounded text-emerald-900 font-bold">Verified</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Student Name */}
            <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
              <div className="text-slate-500 text-[11px] flex items-center gap-1.5 mb-1">
                <User className="w-3.5 h-3.5 text-blue-600" />
                Student Name (studentName)
              </div>
              <div className="font-bold text-slate-900 truncate">
                {studentData.studentName || studentData.stdname || studentData.StudentName || 'N/A'}
              </div>
            </div>

            {/* Gender */}
            <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
              <div className="text-slate-500 text-[11px] flex items-center gap-1.5 mb-1">
                <User className="w-3.5 h-3.5 text-sky-600" />
                Gender (gender)
              </div>
              <div className="font-bold text-slate-900">
                {studentData.gender || studentData.Gender || 'N/A'}
              </div>
            </div>

            {/* Date of Birth */}
            <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
              <div className="text-slate-500 text-[11px] flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                Date of Birth (dob)
              </div>
              <div className="font-bold font-mono text-slate-900">
                {studentData.dob || studentData.DOB || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Admission Form */}
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Section 1: Student & Institution Identifiers */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            1. Student & Institution Identifiers
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Student Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Student Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => handleChange('studentName', e.target.value)}
                placeholder="Student Full Name"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-bold text-slate-900"
                required
              />
            </div>

            {/* DEB Unique ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                DEB Unique ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.DEBuniqueID}
                onChange={(e) => handleChange('DEBuniqueID', e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  isDebAndEnrollmentSame || isDebInDb
                    ? 'bg-rose-50 border-2 border-rose-500 text-rose-900 focus:ring-2 focus:ring-rose-200 outline-none'
                    : 'glass-input text-blue-700'
                }`}
                required
              />
              {isDebInDb && (
                <p className="mt-1.5 text-[11px] font-bold text-amber-700 flex items-center gap-1 animate-fade-in">
                  <Database className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                  <span>Already in DB (Rec #{dbDuplicateInfo.debExists.id} - {dbDuplicateInfo.debExists.student_name})</span>
                </p>
              )}
            </div>

            {/* ABC ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Academic Bank of Credits (ABC ID)
              </label>
              <input
                type="text"
                value={formData.ABCID}
                onChange={(e) => handleChange('ABCID', e.target.value)}
                placeholder="Enter ABC ID or NA"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono text-purple-700 font-medium"
              />
            </div>

            {/* Name of HEI (AISHE Code) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Name of HEI (AISHE Code U-XXXX) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.UniversityName}
                onChange={(e) => handleChange('UniversityName', e.target.value)}
                placeholder="Enter AISHE Code or Name (e.g. U-0421)"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-medium text-slate-900"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Programme & Admission Details */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-800 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            2. Programme & Admission Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Enrollment Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                HEI Student Enrollment Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.EnrollmentNumber}
                onChange={(e) => handleChange('EnrollmentNumber', e.target.value)}
                placeholder="Enter Enrollment Number..."
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  isDebAndEnrollmentSame || isEnrollmentInDb
                    ? 'bg-rose-50 border-2 border-rose-500 text-rose-900 focus:ring-2 focus:ring-rose-200 outline-none'
                    : 'glass-input text-slate-900'
                }`}
                required
              />
              {isDebAndEnrollmentSame && (
                <p className="mt-1.5 text-[11px] font-bold text-rose-600 flex items-center gap-1 animate-fade-in">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  DEB Unique ID and Enrollment No cannot be the same.
                </p>
              )}
              {isEnrollmentInDb && (
                <p className="mt-1.5 text-[11px] font-bold text-rose-600 flex items-center gap-1 animate-fade-in">
                  <Database className="w-3.5 h-3.5 shrink-0" />
                  <span>Already in DB (Assigned to {dbDuplicateInfo.enrollmentExists.student_name})</span>
                </p>
              )}
            </div>

            {/* Name of Programme */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Name of Programme (DEB Recognition List) <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.CourseName}
                onChange={(e) => handleChange('CourseName', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-slate-900 bg-white"
                required
              >
                {DEB_RECOGNIZED_COURSES.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>

            {/* Mode of Education */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mode of Education <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.ModeEducation}
                onChange={(e) => handleChange('ModeEducation', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-slate-900 bg-white"
                required
              >
                <option value="Online(OL)">Online(OL)</option>
                <option value="Open and Distance Learning (ODL)">Open and Distance Learning (ODL)</option>
              </select>
            </div>

            {/* Date of Admission */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Date of Admission <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.AdmissionDate}
                onChange={(e) => handleChange('AdmissionDate', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-slate-900 font-mono"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.Category}
                onChange={(e) => handleChange('Category', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-slate-900 bg-white"
                required
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
                <option value="PWD">PWD</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Admission Details Code
              </label>
              <input
                type="text"
                value={formData.AdmissionDetails}
                onChange={(e) => handleChange('AdmissionDetails', e.target.value)}
                placeholder="13 or NA"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Identity & Location */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            3. Government ID & Demographic Info
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Government Issued Identifier <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.GovernmentIdentifier}
                onChange={(e) => handleChange('GovernmentIdentifier', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-slate-900 bg-white"
                required
              >
                <option value="AADHAR Card">AADHAR Card</option>
                <option value="PAN Card">PAN Card</option>
                <option value="Voter id Card">Voter id Card</option>
                <option value="Passport">Passport</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Identifier Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.GovernmentIdentifierNumber}
                onChange={(e) => handleChange('GovernmentIdentifierNumber', e.target.value)}
                placeholder="Enter Government ID Number..."
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Locality <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.Locality}
                onChange={(e) => handleChange('Locality', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-slate-900 bg-white"
                required
              >
                <option value="Urban">Urban</option>
                <option value="Rural">Rural</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nationality <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.Nationality}
                onChange={(e) => handleChange('Nationality', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-slate-900 bg-white"
                required
              >
                <option value="Indian">Indian</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Country of Residence */}
            <div className="relative md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Country of Residence (UGC 232-Country List) <span className="text-rose-500">*</span>
              </label>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Globe className="w-4 h-4 text-blue-600" />
                </div>
                <input
                  type="text"
                  value={countryQuery}
                  onChange={(e) => {
                    setCountryQuery(e.target.value);
                    setIsCountryOpen(true);
                  }}
                  onFocus={() => setIsCountryOpen(true)}
                  placeholder="Search country..."
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl glass-input text-xs text-slate-900"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Country Dropdown List */}
              {isCountryOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 max-h-56 overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-2xl z-50 p-1">
                  {filteredCountries.length === 0 ? (
                    <div className="p-3 text-xs text-slate-500 text-center">No country found</div>
                  ) : (
                    filteredCountries.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          handleChange('CountryResidence', c);
                          setCountryQuery(c);
                          setIsCountryOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between cursor-pointer ${
                          formData.CountryResidence === c
                            ? 'bg-blue-50 text-blue-800 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{c}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Action Bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onBackToProfile && (
              <button
                type="button"
                onClick={onBackToProfile}
                className="w-full sm:w-auto px-5 py-3 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-2 cursor-pointer border border-slate-200 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Stage 2 (Profile Review)</span>
              </button>
            )}
            <div className="hidden sm:block text-xs text-slate-500 ml-2">
              Mode: <strong className="text-blue-700">{mode === 'LOCAL' ? 'Local Test Mode' : 'Realtime Online Mode'}</strong>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || hasValidationError}
            className="w-full sm:w-auto gradient-btn px-8 py-3.5 rounded-full font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-700/25"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Admission & UGC Push...</span>
              </>
            ) : isDebAndEnrollmentSame ? (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-300" />
                <span>Fix Identical DEB & Enrollment IDs</span>
              </>
            ) : isDebInDb ? (
              <>
                <Database className="w-4 h-4 text-amber-300" />
                <span>DEB Unique ID Already in Database</span>
              </>
            ) : isEnrollmentInDb ? (
              <>
                <Database className="w-4 h-4 text-rose-300" />
                <span>Enrollment No Already in Database</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit & Push Admission Data</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Confirmation Modal Before Final Submission */}
      {showConfirmModal && (
        <div
          onClick={() => setShowConfirmModal(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-amber-950/20 backdrop-blur-sm animate-fade-in overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white/95 rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-amber-200/90 shadow-2xl space-y-5 animate-scale-up"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 shadow-xs">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading">
                    Confirm Final Admission Submission
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Please review student details before sending to UGC DEB Portal and MySQL.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                title="Cancel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Summary Review Grid */}
            <div className="space-y-2.5 bg-[#FAF8F5] p-4 rounded-2xl border border-amber-100/90 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Student Name:</span>
                <span className="font-bold text-slate-900">{formData.studentName || 'N/A'}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">DEB Unique ID:</span>
                <span className="font-mono font-bold text-blue-700">{formData.DEBuniqueID}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">HEI AISHE Code / Name:</span>
                <span className="font-semibold text-slate-900">{formData.UniversityName}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Programme & Mode:</span>
                <span className="font-bold text-slate-900 text-right">{formData.CourseName} ({formData.ModeEducation})</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Enrollment Number:</span>
                <span className="font-mono font-bold text-slate-900">{formData.EnrollmentNumber}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Admission Date:</span>
                <span className="font-mono text-slate-900">{formData.AdmissionDate}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Identity Document:</span>
                <span className="font-semibold text-slate-900">{formData.GovernmentIdentifier} ({formData.GovernmentIdentifierNumber})</span>
              </div>
            </div>

            {/* Warning Alert Note */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="leading-relaxed text-[11px]">
                Once confirmed, this student admission record will be permanently saved and forwarded to the UGC API. You will not be able to resubmit this same application.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 cursor-pointer"
              >
                Cancel & Review Form
              </button>

              <button
                type="button"
                onClick={handleFinalConfirm}
                disabled={submitting}
                className="w-full sm:w-auto gradient-btn px-6 py-2.5 rounded-full text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-700/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Final Submit</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
