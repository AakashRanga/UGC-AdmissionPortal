from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class StudentFetchRequest(BaseModel):
    DEBUniqueID: str = Field(..., description="DEB Unique ID of student")
    mode: Optional[str] = Field("ONLINE", description="ONLINE or LOCAL")
    apiKey: Optional[str] = Field(None, description="Optional API key override")
    clientId: Optional[str] = Field(None, description="Optional Client ID override")

class StudentProfileData(BaseModel):
    deb_unique_id: str
    abc_id: Optional[str] = ""
    student_name: str
    gender: str
    dob: str
    mobile: Optional[str] = ""
    email: Optional[str] = ""
    university_name: Optional[str] = ""

class AdmissionSubmissionRequest(BaseModel):
    DEBuniqueID: str
    ABCID: Optional[str] = ""
    UniversityName: str = Field(..., description="Name of HEI (6-digit AISHE Code U-XXXX)")
    EnrollmentNumber: str
    ModeEducation: str = Field(..., description="Open and Distance Learning (ODL) or Online(OL)")
    CourseName: str = Field(..., description="Name of Programme as per DEB Recognition List")
    AdmissionDate: str = Field(..., description="Format YYYY-MM-DD or DD-MM-YYYY")
    Category: str = Field(..., description="SC/ST/OBC/General/PWD/EWS")
    GovernmentIdentifier: str = Field(..., description="AADHAR Card/PAN Card/Voter id Card/Passport")
    GovernmentIdentifierNumber: str
    Locality: str = Field(..., description="Urban/Rural")
    Nationality: str = Field(..., description="Indian/Others")
    CountryResidence: str = Field(..., description="Selected country from 232-country master list")
    AdmissionDetails: Optional[str] = "13"
    studentName: Optional[str] = ""
    mode: Optional[str] = "ONLINE"
    apiKey: Optional[str] = Field(None, description="Optional API key override")
    clientId: Optional[str] = Field(None, description="Optional Client ID override")

class AdmissionRecordResponse(BaseModel):
    id: int
    deb_unique_id: str
    abc_id: Optional[str]
    student_name: Optional[str]
    hei_code: str
    enrollment_no: str
    mode_education: str
    programme_name: str
    admission_date: str
    category: str
    gov_id_type: str
    gov_id_number: str
    locality: str
    nationality: str
    country_residence: str
    admission_details: Optional[str]
    sync_status: str
    mode_used: str
    created_at: datetime

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username: str = Field(..., description="Administrator username")
    password: str = Field(..., description="Administrator password")

class UserInfo(BaseModel):
    id: int
    username: str
    fullName: str
    role: str

class LoginResponse(BaseModel):
    status: str
    message: str
    token: str
    user: UserInfo

class ChangePasswordRequest(BaseModel):
    username: str
    currentPassword: str
    newPassword: str

class CreateAdminRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="Unique admin username")
    password: str = Field(..., min_length=6, description="Password (minimum 6 characters)")
    fullName: Optional[str] = Field("SIMATS Administrator", description="Full display name")
    role: Optional[str] = Field("ADMIN", description="Role: ADMIN or OPERATOR")

class CreateAdminResponse(BaseModel):
    status: str
    message: str
    user: UserInfo
