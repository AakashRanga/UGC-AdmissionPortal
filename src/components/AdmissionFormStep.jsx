import React, { useState, useEffect } from 'react';
import { Send, FileText, Globe, Building2, Shield, Search, Loader2, ArrowLeft, User, Calendar, CheckCircle } from 'lucide-react';
import countries from '../data/countries.json';
import { DEB_RECOGNIZED_COURSES } from '../data/mockDebData';

export function AdmissionFormStep({ debId, studentData, onSubmit, submitting, mode, onBack }) {
  const [formData, setFormData] = useState({
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

  const [countryQuery, setCountryQuery] = useState('India');
  const [isCountryOpen, setIsCountryOpen] = useState(false);

  useEffect(() => {
    if (debId || studentData) {
      setFormData(prev => ({
        ...prev,
        DEBuniqueID: debId || prev.DEBuniqueID,
        studentName: studentData?.studentName || studentData?.stdname || studentData?.StudentName || prev.studentName,
        UniversityName: studentData?.universityName || studentData?.UniversityName || prev.UniversityName
      }));
    }
  }, [debId, studentData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredCountries = countries.filter(c =>
    c.toLowerCase().includes(countryQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-indigo-500/30 relative shadow-2xl max-w-4xl mx-auto animate-fade-in space-y-6">
      {/* Top Bar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-semibold uppercase tracking-wider mb-1">
            Step 3: New Student Admission Entry
          </div>
          <h2 className="text-xl font-bold text-white font-heading">
            HEI Admission Form & UGC Reverse Push
          </h2>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Search
        </button>
      </div>

      {/* UGC Fetched Credentials Summary Banner (Exact 4 fields from Section 5 DOCX) */}
      {studentData && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Credentials Fetched from UGC DEB Portal API (GetStudentDetails):
            </span>
            <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">Verified</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Student Name */}
            <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[11px] flex items-center gap-1.5 mb-1">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                Student Name (studentName)
              </div>
              <div className="font-semibold text-white truncate">
                {studentData.studentName || studentData.stdname || studentData.StudentName || 'N/A'}
              </div>
            </div>

            {/* Gender */}
            <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[11px] flex items-center gap-1.5 mb-1">
                <User className="w-3.5 h-3.5 text-sky-400" />
                Gender (gender)
              </div>
              <div className="font-semibold text-slate-200">
                {studentData.gender || studentData.Gender || 'N/A'}
              </div>
            </div>

            {/* Date of Birth */}
            <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[11px] flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                Date of Birth (dob)
              </div>
              <div className="font-semibold font-mono text-slate-200">
                {studentData.dob || studentData.DOB || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Admission Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Student & Institution Identifiers */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            1. Student & Institution Identifiers
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Student Name */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Student Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => handleChange('studentName', e.target.value)}
                placeholder="Student Full Name"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-semibold text-white"
                required
              />
            </div>

            {/* DEB Unique ID */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                DEB Unique ID <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.DEBuniqueID}
                onChange={(e) => handleChange('DEBuniqueID', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono text-indigo-300 font-bold"
                required
              />
            </div>

            {/* ABC ID */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Academic Bank of Credits (ABC ID)
              </label>
              <input
                type="text"
                value={formData.ABCID}
                onChange={(e) => handleChange('ABCID', e.target.value)}
                placeholder="Enter ABC ID or NA"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono text-purple-300"
              />
            </div>

            {/* Name of HEI (AISHE Code) */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Name of HEI (AISHE Code U-XXXX) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.UniversityName}
                onChange={(e) => handleChange('UniversityName', e.target.value)}
                placeholder="e.g. U-XXXX"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono text-white"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Programme & Admission Details */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            2. Programme & Admission Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Enrollment Number */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                HEI Student Enrollment Number <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.EnrollmentNumber}
                onChange={(e) => handleChange('EnrollmentNumber', e.target.value)}
                placeholder="Enter Enrollment Number..."
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono text-white"
                required
              />
            </div>

            {/* Name of Programme */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Name of Programme (DEB Recognition List) <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.CourseName}
                onChange={(e) => handleChange('CourseName', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white bg-slate-900"
                required
              >
                {DEB_RECOGNIZED_COURSES.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>

            {/* Mode of Education */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Mode of Education <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.ModeEducation}
                onChange={(e) => handleChange('ModeEducation', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white bg-slate-900"
                required
              >
                <option value="Online(OL)">Online(OL)</option>
                <option value="Open and Distance Learning (ODL)">Open and Distance Learning (ODL)</option>
              </select>
            </div>

            {/* Date of Admission */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Date of Admission <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={formData.AdmissionDate}
                onChange={(e) => handleChange('AdmissionDate', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white font-mono"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.Category}
                onChange={(e) => handleChange('Category', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white bg-slate-900"
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
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Admission Details Code
              </label>
              <input
                type="text"
                value={formData.AdmissionDetails}
                onChange={(e) => handleChange('AdmissionDetails', e.target.value)}
                placeholder="13 or NA"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Identity & Location */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            3. Government ID & Demographic Info
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Government Issued Identifier <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.GovernmentIdentifier}
                onChange={(e) => handleChange('GovernmentIdentifier', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white bg-slate-900"
                required
              >
                <option value="AADHAR Card">AADHAR Card</option>
                <option value="PAN Card">PAN Card</option>
                <option value="Voter id Card">Voter id Card</option>
                <option value="Passport">Passport</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Identifier Number <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.GovernmentIdentifierNumber}
                onChange={(e) => handleChange('GovernmentIdentifierNumber', e.target.value)}
                placeholder="Enter Government ID Number..."
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Locality <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.Locality}
                onChange={(e) => handleChange('Locality', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white bg-slate-900"
                required
              >
                <option value="Urban">Urban</option>
                <option value="Rural">Rural</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Nationality <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.Nationality}
                onChange={(e) => handleChange('Nationality', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white bg-slate-900"
                required
              >
                <option value="Indian">Indian</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Country of Residence (232 Countries Searchable Dropdown) */}
            <div className="relative md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Country of Residence (UGC 232-Country List) <span className="text-rose-400">*</span>
              </label>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Globe className="w-4 h-4 text-indigo-400" />
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
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl glass-input text-xs text-white"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Country Dropdown List */}
              {isCountryOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 max-h-56 overflow-y-auto rounded-xl bg-slate-900 border border-indigo-500/30 shadow-2xl z-50 p-1">
                  {filteredCountries.length === 0 ? (
                    <div className="p-3 text-xs text-slate-400 text-center">No country found</div>
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
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                          formData.CountryResidence === c
                            ? 'bg-indigo-600/30 text-indigo-200 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800'
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
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Mode: <strong className="text-indigo-300">{mode === 'LOCAL' ? 'Local Test Mode' : 'Realtime Online Mode'}</strong>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto gradient-btn px-8 py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-indigo-500/30"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Admission & UGC Push...</span>
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
    </div>
  );
}
