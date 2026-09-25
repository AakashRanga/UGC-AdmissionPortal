import os
import json
import logging
import datetime
import hashlib
import secrets
import re
from typing import Optional
import httpx
from fastapi import FastAPI, Depends, HTTPException, Query, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from backend.database import get_db, engine, Base, SessionLocal
from backend.models import AdmissionRecord, ApiLog, AdminUser
from backend.schemas import (
    StudentFetchRequest,
    AdmissionSubmissionRequest,
    AdmissionRecordResponse,
    LoginRequest,
    LoginResponse,
    UserInfo,
    ChangePasswordRequest,
    CreateAdminRequest,
    CreateAdminResponse
)
from backend.config import settings

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("deb_app")

# Initialize database tables
Base.metadata.create_all(bind=engine)

def migrate_database_schema():
    """Ensure all existing table columns in MySQL are expanded to prevent Data too long errors."""
    alter_queries = [
        # deb_admissions
        "ALTER TABLE deb_admissions MODIFY deb_unique_id VARCHAR(255) NOT NULL",
        "ALTER TABLE deb_admissions MODIFY abc_id VARCHAR(255) DEFAULT NULL",
        "ALTER TABLE deb_admissions MODIFY student_name VARCHAR(255) DEFAULT NULL",
        "ALTER TABLE deb_admissions MODIFY hei_code VARCHAR(255) NOT NULL",
        "ALTER TABLE deb_admissions MODIFY enrollment_no VARCHAR(255) NOT NULL",
        "ALTER TABLE deb_admissions MODIFY mode_education VARCHAR(255) NOT NULL",
        "ALTER TABLE deb_admissions MODIFY programme_name VARCHAR(500) NOT NULL",
        "ALTER TABLE deb_admissions MODIFY admission_date VARCHAR(100) NOT NULL",
        "ALTER TABLE deb_admissions MODIFY category VARCHAR(100) NOT NULL",
        "ALTER TABLE deb_admissions MODIFY gov_id_type VARCHAR(100) NOT NULL",
        "ALTER TABLE deb_admissions MODIFY gov_id_number VARCHAR(255) NOT NULL",
        "ALTER TABLE deb_admissions MODIFY locality VARCHAR(100) NOT NULL",
        "ALTER TABLE deb_admissions MODIFY nationality VARCHAR(100) NOT NULL",
        "ALTER TABLE deb_admissions MODIFY country_residence VARCHAR(255) NOT NULL",
        "ALTER TABLE deb_admissions MODIFY admission_details VARCHAR(500) DEFAULT '13'",
        "ALTER TABLE deb_admissions MODIFY sync_status VARCHAR(100) DEFAULT 'LOCAL_ONLY'",
        "ALTER TABLE deb_admissions MODIFY ugc_response LONGTEXT DEFAULT NULL",
        "ALTER TABLE deb_admissions MODIFY mode_used VARCHAR(50) DEFAULT 'LOCAL'",
        
        # api_logs
        "ALTER TABLE api_logs MODIFY endpoint VARCHAR(500) NOT NULL",
        "ALTER TABLE api_logs MODIFY method VARCHAR(50) NOT NULL",
        "ALTER TABLE api_logs MODIFY request_params LONGTEXT DEFAULT NULL",
        "ALTER TABLE api_logs MODIFY headers_sent LONGTEXT DEFAULT NULL",
        "ALTER TABLE api_logs MODIFY response_body LONGTEXT DEFAULT NULL",
        "ALTER TABLE api_logs MODIFY mode VARCHAR(50) DEFAULT 'LOCAL'",

        # admin_users
        "ALTER TABLE admin_users MODIFY username VARCHAR(100) NOT NULL",
        "ALTER TABLE admin_users MODIFY password_hash VARCHAR(500) NOT NULL",
        "ALTER TABLE admin_users MODIFY full_name VARCHAR(255) DEFAULT 'SIMATS Administrator'",
        "ALTER TABLE admin_users MODIFY role VARCHAR(50) DEFAULT 'ADMIN'",
    ]
    try:
        with engine.connect() as conn:
            for q in alter_queries:
                try:
                    conn.execute(text(q))
                    conn.commit()
                except Exception:
                    pass
    except Exception as e:
        logger.warning(f"Schema migration note: {e}")

migrate_database_schema()

def hash_password(password: str) -> str:
    """Generate salted SHA-256 hash for secure MySQL storage."""
    salt = secrets.token_hex(16)
    hashed = hashlib.sha256(f"{salt}:{password}".encode("utf-8")).hexdigest()
    return f"{salt}:{hashed}"

def verify_password(stored_hash: str, provided_password: str) -> bool:
    """Verify password against salted SHA-256 hash."""
    try:
        if not stored_hash or ":" not in stored_hash:
            return False
        salt, hashed = stored_hash.split(":", 1)
        test_hash = hashlib.sha256(f"{salt}:{provided_password}".encode("utf-8")).hexdigest()
        return secrets.compare_digest(hashed, test_hash)
    except Exception:
        return False

# Ensure default admin account exists in MySQL
def init_default_admin():
    db = SessionLocal()
    try:
        admin = db.query(AdminUser).filter(AdminUser.username == "admin").first()
        if not admin:
            default_admin = AdminUser(
                username="admin",
                password_hash=hash_password("admin123"),
                full_name="SIMATS Administrator",
                role="ADMIN"
            )
            db.add(default_admin)
            db.commit()
            logger.info("Created default administrator account in MySQL: username 'admin', password 'admin123'")
    except Exception as e:
        logger.error(f"Error initializing default admin user: {e}")
    finally:
        db.close()

init_default_admin()

app = FastAPI(
    title="Saveetha Institute of Medical and Technical Sciences (SIMATS) - UGC DEB Admission System",
    description="Official UGC DEB API integration backend for SIMATS (Deemed to be University) Admission Process.",
    version="1.0.0"
)

# Enable CORS for React Vite Frontend, Live Public IP, and Localhost
origins = [
    "http://180.235.121.253:8192",
    "http://180.235.121.253:8191",
    "http://180.235.121.253",
    "https://180.235.121.253:8192",
    "https://180.235.121.253:8191",
    "https://180.235.121.253",
    "http://localhost:8192",
    "http://127.0.0.1:8192",
    "http://localhost:8191",
    "http://127.0.0.1:8191",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def redact_sensitive_keys(text_content: str) -> str:
    """Redact institutional API keys and secret tokens from strings or JSON payloads."""
    if not text_content:
        return ""
    
    redacted = str(text_content)
    
    # Redact known API keys from environment settings
    known_keys = [
        settings.UGC_FETCH_STUDENT_API_KEY,
        settings.UGC_SUBMIT_ADMISSION_API_KEY,
        getattr(settings, "UGC_FETCH_STUDENT_CLIENT_ID", ""),
        getattr(settings, "UGC_SUBMIT_ADMISSION_CLIENT_ID", "")
    ]
    for k in known_keys:
        if k and len(k.strip()) >= 6:
            redacted = redacted.replace(k.strip(), "[REDACTED_API_KEY]")

    # Redact any header/param patterns like 'APIKey: ...' or 'apiKey=...'
    redacted = re.sub(r'(APIKey|apiKey|client_id|ClientID)[:=]\s*([a-zA-Z0-9_-]{6,})', r'\1: [REDACTED_API_KEY]', redacted, flags=re.IGNORECASE)
    
    return redacted

def sanitize_ugc_user_message(raw_msg: str, status_code: int = 200) -> str:
    """Convert raw, restricted, or cryptic UGC response messages into user-friendly, safe notices."""
    if not raw_msg:
        return "No response details received from UGC DEB Portal."

    # First redact any sensitive keys
    clean_msg = redact_sensitive_keys(str(raw_msg))
    lower_msg = clean_msg.lower()

    if "process refused" in lower_msg or "refused" in lower_msg:
        return "UGC DEB Server: Request Refused / Unauthorized. Please verify your institution's public server IP is whitelisted with the UGC DEB Directorate."
    elif "ip not whitelisted" in lower_msg or "whitelist" in lower_msg or "forbidden" in lower_msg or status_code == 403:
        return "UGC DEB Server: IP Access Restricted. The server IP address is not authorized in the UGC DEB Firewall."
    elif "401" in lower_msg or "unauthorized" in lower_msg or status_code == 401:
        return "UGC DEB Server: Authentication failed. Please check the institution's API Key configuration."
    elif "<!doctype" in lower_msg or "<html" in lower_msg:
        if "404" in lower_msg or status_code == 404:
            return "UGC DEB Server: Requested service endpoint or DEB Unique ID was not found (HTTP 404)."
        elif "500" in lower_msg or status_code == 500:
            return "UGC DEB Server: The remote portal encountered an internal server error (HTTP 500)."
        else:
            return "UGC DEB Server: Unexpected response received from government portal."
    
    return clean_msg[:250]

def normalize_ugc_student_response(resp_json: dict) -> dict:
    """Normalize raw response from UGC GetStudentDetails into standardized, secure format."""
    if not isinstance(resp_json, dict):
        return {"status": "error", "message": "Invalid response format received from UGC API."}

    # Check for failure/refusal status explicitly
    status_str = str(resp_json.get("status") or resp_json.get("Status") or "").lower()
    if any(err_word in status_str for err_word in ["error", "refused", "fail", "invalid", "404", "500"]):
        raw_msg = resp_json.get("message") or resp_json.get("Message") or resp_json.get("error") or resp_json.get("details") or resp_json.get("status") or "Process Refused"
        user_msg = sanitize_ugc_user_message(str(raw_msg))
        return {"status": "error", "message": user_msg}

    # Check for success structure
    target = resp_json.get("data") or resp_json.get("Resource") or resp_json.get("List") or resp_json.get("details") or resp_json

    if isinstance(target, list) and len(target) > 0:
        target = target[0]

    if isinstance(target, dict):
        name = target.get("studentName") or target.get("stdname") or target.get("StudentName") or target.get("Name") or ""
        gender = target.get("gender") or target.get("Gender") or ""
        dob = target.get("dob") or target.get("DOB") or ""
        abc_id = target.get("abcId") or target.get("ABCID") or target.get("StudentID") or target.get("studentId") or ""
        univ = target.get("universityName") or target.get("UniversityName") or settings.DEFAULT_HEI_CODE

        # Must have actual student fields (name, dob, gender, or abc_id)
        if name or dob or gender or abc_id:
            return {
                "status": "success",
                "message": "Student profile fetched successfully from UGC DEB Portal",
                "data": {
                    "studentName": redact_sensitive_keys(str(name)),
                    "gender": redact_sensitive_keys(str(gender)),
                    "dob": redact_sensitive_keys(str(dob)),
                    "universityName": redact_sensitive_keys(str(univ)),
                    "abcId": redact_sensitive_keys(str(abc_id))
                }
            }

    raw_msg = resp_json.get("message") or resp_json.get("Message") or "DEB Unique ID not registered or no profile data found on UGC portal."
    return {"status": "error", "message": sanitize_ugc_user_message(str(raw_msg))}

def log_api_call(db: Session, endpoint: str, method: str, req_params: str, headers: str, status_code: int, response_body: str, mode_used: str):
    """Save API audit log to MySQL database with sensitive keys redacted."""
    try:
        log_entry = ApiLog(
            endpoint=redact_sensitive_keys(endpoint[:500]),
            method=method,
            request_params=redact_sensitive_keys(req_params[:1000]) if req_params else None,
            headers_sent=redact_sensitive_keys(headers[:500]) if headers else None,
            response_status=status_code,
            response_body=redact_sensitive_keys(response_body[:2000]) if response_body else None,
            mode=mode_used
        )
        db.add(log_entry)
        db.commit()
    except Exception as e:
        logger.error(f"Failed to save API audit log: {e}")

@app.get("/api/health")
@app.get("/api/deb/health")
def health_check():
    return {
        "status": "online",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "database": "MySQL WorkBench",
        "default_hei": settings.DEFAULT_HEI_CODE
    }

# ================= AUTHENTICATION ROUTES (Admin Only) =================

@app.post("/api/auth/login", response_model=LoginResponse)
def admin_login(req: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate administrator using MySQL stored credentials."""
    username = req.username.strip()
    password = req.password.strip()

    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password are required.")

    admin = db.query(AdminUser).filter(AdminUser.username == username).first()
    if not admin or not verify_password(admin.password_hash, password):
        raise HTTPException(status_code=401, detail="Invalid administrator username or password.")

    # Update last login timestamp
    admin.last_login = datetime.datetime.utcnow()
    db.commit()

    # Generate secure session token
    session_token = secrets.token_urlsafe(32)

    return {
        "status": "success",
        "message": "Administrator authenticated successfully.",
        "token": session_token,
        "user": {
            "id": admin.id,
            "username": admin.username,
            "fullName": admin.full_name or "SIMATS Administrator",
            "role": admin.role or "ADMIN"
        }
    }

@app.get("/api/auth/verify")
def verify_session(username: str = Query("admin"), db: Session = Depends(get_db)):
    """Verify administrator session status."""
    admin = db.query(AdminUser).filter(AdminUser.username == username).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Administrator account not found.")
    return {
        "status": "authenticated",
        "user": {
            "id": admin.id,
            "username": admin.username,
            "fullName": admin.full_name,
            "role": admin.role
        }
    }

@app.post("/api/auth/change-password")
def change_admin_password(req: ChangePasswordRequest, db: Session = Depends(get_db)):
    """Allow administrator to update password stored in MySQL."""
    admin = db.query(AdminUser).filter(AdminUser.username == req.username).first()
    if not admin or not verify_password(admin.password_hash, req.currentPassword):
        raise HTTPException(status_code=401, detail="Current password is incorrect.")
    
    if len(req.newPassword) < 6:
        raise HTTPException(status_code=400, detail="New password must be at least 6 characters.")
    
    admin.password_hash = hash_password(req.newPassword)
    db.commit()
    return {"status": "success", "message": "Administrator password updated successfully in MySQL database."}

@app.post("/api/auth/create-admin", response_model=CreateAdminResponse)
def create_admin_user(req: CreateAdminRequest, db: Session = Depends(get_db)):
    """Create a new administrator account with username and password stored in MySQL."""
    username = req.username.strip()
    password = req.password.strip()

    if len(username) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters.")
    
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    # Check if username already exists in MySQL
    existing_user = db.query(AdminUser).filter(AdminUser.username == username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail=f"Administrator username '{username}' already exists in MySQL.")

    # Hash password with salted SHA-256
    new_admin = AdminUser(
        username=username,
        password_hash=hash_password(password),
        full_name=req.fullName or "SIMATS Administrator",
        role=req.role or "ADMIN"
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    logger.info(f"Successfully created new administrator account: {username}")

    return {
        "status": "success",
        "message": f"Administrator account '{username}' created successfully in MySQL database.",
        "user": {
            "id": new_admin.id,
            "username": new_admin.username,
            "fullName": new_admin.full_name,
            "role": new_admin.role
        }
    }

@app.get("/api/auth/users")
def list_admin_users(db: Session = Depends(get_db)):
    """List registered administrator accounts (excluding password hashes)."""
    users = db.query(AdminUser).all()
    return {
        "status": "success",
        "count": len(users),
        "data": [
            {
                "id": u.id,
                "username": u.username,
                "fullName": u.full_name,
                "role": u.role,
                "createdAt": u.created_at.isoformat() if u.created_at else None,
                "lastLogin": u.last_login.isoformat() if u.last_login else None
            }
            for u in users
        ]
    }

# (Existing student fetch & submit admission routes remain unchanged)

@app.get("/api/admissions")
@app.get("/api/deb/admissions")
def get_all_admissions(db: Session = Depends(get_db)):
    """Retrieve all admission records saved in MySQL database with sensitive credentials redacted."""
    records = db.query(AdmissionRecord).order_by(AdmissionRecord.created_at.desc()).all()
    sanitized_records = []
    for r in records:
        r_dict = {
            "id": r.id,
            "deb_unique_id": r.deb_unique_id,
            "abc_id": r.abc_id,
            "student_name": r.student_name,
            "hei_code": r.hei_code,
            "enrollment_no": r.enrollment_no,
            "mode_education": r.mode_education,
            "programme_name": r.programme_name,
            "admission_date": r.admission_date,
            "category": r.category,
            "gov_id_type": r.gov_id_type,
            "gov_id_number": r.gov_id_number,
            "locality": r.locality,
            "nationality": r.nationality,
            "country_residence": r.country_residence,
            "admission_details": r.admission_details,
            "sync_status": r.sync_status,
            "ugc_response": redact_sensitive_keys(r.ugc_response),
            "mode_used": r.mode_used,
            "created_at": r.created_at,
            "updated_at": r.updated_at
        }
        sanitized_records.append(r_dict)
    return {"status": "success", "count": len(sanitized_records), "data": sanitized_records}

@app.delete("/api/admissions/{admission_id}")
@app.delete("/api/deb/admissions/{admission_id}")
def delete_admission(admission_id: int, db: Session = Depends(get_db)):
    """Delete an admission record from MySQL database."""
    record = db.query(AdmissionRecord).filter(AdmissionRecord.id == admission_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Admission record not found.")
    db.delete(record)
    db.commit()
    return {"status": "success", "message": f"Admission record #{admission_id} deleted successfully."}

@app.get("/api/admissions/check-duplicate")
@app.get("/api/deb/check-duplicate")
def check_duplicate(
    deb_unique_id: Optional[str] = Query(None, alias="deb_unique_id"),
    enrollment_no: Optional[str] = Query(None, alias="enrollment_no"),
    db: Session = Depends(get_db)
):
    """Check whether a DEB Unique ID or Enrollment Number already exists in the MySQL admissions database."""
    deb_exists = None
    enrollment_exists = None

    if deb_unique_id and deb_unique_id.strip():
        existing_deb = db.query(AdmissionRecord).filter(
            AdmissionRecord.deb_unique_id == deb_unique_id.strip()
        ).first()
        if existing_deb:
            deb_exists = {
                "id": existing_deb.id,
                "deb_unique_id": existing_deb.deb_unique_id,
                "student_name": existing_deb.student_name,
                "enrollment_no": existing_deb.enrollment_no,
                "programme_name": existing_deb.programme_name,
                "admission_date": existing_deb.admission_date
            }

    if enrollment_no and enrollment_no.strip():
        existing_enr = db.query(AdmissionRecord).filter(
            AdmissionRecord.enrollment_no == enrollment_no.strip()
        ).first()
        if existing_enr:
            enrollment_exists = {
                "id": existing_enr.id,
                "deb_unique_id": existing_enr.deb_unique_id,
                "student_name": existing_enr.student_name,
                "enrollment_no": existing_enr.enrollment_no,
                "programme_name": existing_enr.programme_name,
                "admission_date": existing_enr.admission_date
            }

    return {
        "status": "success",
        "is_duplicate": bool(deb_exists or enrollment_exists),
        "deb_exists": deb_exists,
        "enrollment_exists": enrollment_exists
    }

@app.get("/api/logs")
@app.get("/api/deb/logs")
def get_api_logs(limit: int = 50, db: Session = Depends(get_db)):
    """Retrieve API audit logs from MySQL database with sensitive credentials redacted."""
    logs = db.query(ApiLog).order_by(ApiLog.timestamp.desc()).limit(limit).all()
    sanitized_logs = []
    for l in logs:
        l_dict = {
            "id": l.id,
            "endpoint": redact_sensitive_keys(l.endpoint),
            "method": l.method,
            "request_params": redact_sensitive_keys(l.request_params),
            "headers_sent": redact_sensitive_keys(l.headers_sent),
            "response_status": l.response_status,
            "response_body": redact_sensitive_keys(l.response_body),
            "mode": l.mode,
            "timestamp": l.timestamp
        }
        sanitized_logs.append(l_dict)
    return {"status": "success", "count": len(sanitized_logs), "data": sanitized_logs}

@app.post("/api/deb/fetch-student")
async def fetch_student_details(req: StudentFetchRequest, db: Session = Depends(get_db)):
    deb_id = req.DEBUniqueID.strip()
    if not deb_id:
        raise HTTPException(status_code=400, detail="DEB Unique ID is required.")

    mode = req.mode.upper() if req.mode else "LOCAL"
    api_key = getattr(req, "apiKey", None) or settings.UGC_FETCH_STUDENT_API_KEY
    client_id = getattr(req, "clientId", None) or settings.UGC_FETCH_STUDENT_CLIENT_ID

    logger.info(f"Fetching student details for DEB ID: {deb_id} in {mode} mode.")

    if mode == "LOCAL":
        # LOCAL TEST MODE - Standard test data response
        data = {
            "studentName": "Aarav Sharma",
            "gender": "Male",
            "dob": "2001-05-15",
            "universityName": settings.DEFAULT_HEI_CODE,
            "mobile": "9876543210",
            "email": "aarav.sharma@example.com",
            "abcId": "ABC98765432101"
        }
        response_payload = {
            "status": "success",
            "message": "Student profile fetched successfully (Local Test Mode)",
            "data": data,
            "deb_unique_id": deb_id,
            "mode": "LOCAL"
        }
        log_api_call(db, settings.UGC_FETCH_STUDENT_URL, "POST", f"DEBUniqueID={deb_id}", f"APIKey: {api_key}, ClientID: {client_id}", 200, json.dumps(response_payload), "LOCAL")
        return response_payload

    else:
        # REALTIME ONLINE MODE - Official Fetch Endpoint Domain
        target_url = f"{settings.UGC_FETCH_STUDENT_URL}?DEBUniqueID={deb_id}"
        headers = {
            "APIKey": api_key,
            "User-Agent": "UGC-DEB-Admission-Portal/1.0"
        }
        if client_id:
            headers["ClientID"] = client_id
        
        try:
            async with httpx.AsyncClient(timeout=12.0) as client:
                resp = await client.post(target_url, headers=headers)
                
            status_code = resp.status_code
            try:
                resp_json = resp.json()
            except Exception:
                clean_msg = sanitize_ugc_user_message(resp.text, status_code=status_code)
                resp_json = {"status": "error", "message": clean_msg}

            log_api_call(db, target_url, "POST", f"DEBUniqueID={deb_id}", f"APIKey: {api_key}, ClientID: {client_id}", status_code, json.dumps(resp_json) if isinstance(resp_json, dict) else str(resp_json), "ONLINE")

            # Normalize raw UGC response into clear English feedback
            normalized = normalize_ugc_student_response(resp_json)
            normalized["deb_unique_id"] = deb_id
            normalized["mode"] = "ONLINE"
            return normalized
        
        except Exception as err:
            safe_err = sanitize_ugc_user_message(str(err), status_code=500)
            error_payload = {
                "status": "error",
                "message": f"Connection Notice: Could not reach UGC DEB Portal ({safe_err}).",
                "details": "Online request to UGC server failed or timed out."
            }
            log_api_call(db, target_url, "POST", f"DEBUniqueID={deb_id}", f"APIKey: {api_key}, ClientID: {client_id}", 500, json.dumps(error_payload), "ONLINE")
            return error_payload

@app.post("/api/deb/submit-admission")
async def submit_admission(req: AdmissionSubmissionRequest, db: Session = Depends(get_db)):
    deb_id_clean = req.DEBuniqueID.strip() if req.DEBuniqueID else ""
    enrollment_clean = req.EnrollmentNumber.strip() if req.EnrollmentNumber else ""

    # 1. Validation: DEB ID and Enrollment No cannot be identical
    if deb_id_clean and enrollment_clean and deb_id_clean.lower() == enrollment_clean.lower():
        raise HTTPException(
            status_code=400,
            detail="DEB Unique ID and Enrollment Number cannot be identical. Please provide a distinct HEI Enrollment Number."
        )

    # 2. Validation: DEB ID already exists in Database
    if deb_id_clean:
        existing_deb = db.query(AdmissionRecord).filter(
            AdmissionRecord.deb_unique_id == deb_id_clean
        ).first()
        if existing_deb:
            raise HTTPException(
                status_code=400,
                detail=f"Database Validation Error: DEB Unique ID '{deb_id_clean}' is already registered in the Admissions Database (Record #{existing_deb.id} for student '{existing_deb.student_name}'). Duplicate DEB ID is not allowed."
            )

    # 3. Validation: Enrollment Number already exists in Database
    if enrollment_clean:
        existing_enr = db.query(AdmissionRecord).filter(
            AdmissionRecord.enrollment_no == enrollment_clean
        ).first()
        if existing_enr:
            raise HTTPException(
                status_code=400,
                detail=f"Database Validation Error: Enrollment Number '{enrollment_clean}' is already assigned in the Admissions Database (Record #{existing_enr.id} for student '{existing_enr.student_name}', DEB ID: {existing_enr.deb_unique_id}). Duplicate enrollment number is not allowed."
            )

    mode = req.mode.upper() if req.mode else "LOCAL"
    api_key = getattr(req, "apiKey", None) or settings.UGC_SUBMIT_ADMISSION_API_KEY
    client_id = getattr(req, "clientId", None) or settings.UGC_SUBMIT_ADMISSION_CLIENT_ID

    query_params = {
        "DEBuniqueID": req.DEBuniqueID,
        "ABCID": req.ABCID or "NA",
        "UniversityName": req.UniversityName,
        "CourseName": req.CourseName,
        "AdmissionDate": req.AdmissionDate,
        "AdmissionDetails": req.AdmissionDetails or "13",
        "EnrollmentNumber": req.EnrollmentNumber,
        "ModeEducation": req.ModeEducation,
        "Category": req.Category,
        "GovernmentIdentifier": req.GovernmentIdentifier,
        "Locality": req.Locality,
        "Nationality": req.Nationality,
        "GovernmentIdentifierNumber": req.GovernmentIdentifierNumber,
        "CountryResidence": req.CountryResidence
    }

    param_str = "&".join([f"{k}={v}" for k, v in query_params.items()])
    
    ugc_status = "LOCAL_ONLY"
    raw_ugc_resp = ""
    user_message = ""

    if mode == "LOCAL":
        simulated_resp = {
            "status": "Process Success",
            "message": "Admission data submitted successfully",
            "details": query_params
        }
        raw_ugc_resp = json.dumps(simulated_resp)
        ugc_status = "UGC_SYNCED"
        user_message = "Admission details submitted and recorded successfully in Local Test Mode."
        log_api_call(db, settings.UGC_SUBMIT_ADMISSION_URL, "POST", param_str, f"APIKey: {api_key}, ClientID: {client_id}", 200, raw_ugc_resp, "LOCAL")

    else:
        # REALTIME ONLINE MODE - Official Reverse Push Endpoint Domain
        target_url = f"{settings.UGC_SUBMIT_ADMISSION_URL}?{param_str}"
        headers = {
            "APIKey": api_key,
            "User-Agent": "UGC-DEB-Admission-Portal/1.0"
        }
        if client_id:
            headers["ClientID"] = client_id

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.post(target_url, headers=headers)
                
            status_code = resp.status_code
            try:
                resp_json = resp.json()
            except Exception:
                clean_msg = sanitize_ugc_user_message(resp.text, status_code=status_code)
                resp_json = {"status": "error", "message": clean_msg}

            raw_ugc_resp = json.dumps(resp_json) if isinstance(resp_json, dict) else str(resp_json)
            log_api_call(db, target_url, "POST", param_str, f"APIKey: {api_key}, ClientID: {client_id}", status_code, raw_ugc_resp, "ONLINE")

            if status_code == 200 and isinstance(resp_json, dict) and (str(resp_json.get("status")).lower() == "process success" or str(resp_json.get("Status")).lower() == "process success"):
                ugc_status = "UGC_SYNCED"
                user_message = "Admission successfully pushed to UGC DEB Portal and saved in MySQL Database."
            else:
                ugc_status = "UGC_FAILED"
                raw_err = resp_json.get("message") or resp_json.get("Message") or resp_json.get("details") or (resp.text if not isinstance(resp_json, dict) else "Process Refused")
                safe_err = sanitize_ugc_user_message(str(raw_err), status_code=status_code)
                user_message = f"UGC Sync Notice: {safe_err} (Admission record saved locally in MySQL DB)."
        
        except Exception as err:
            ugc_status = "UGC_ERROR"
            safe_err = sanitize_ugc_user_message(str(err), status_code=500)
            raw_ugc_resp = redact_sensitive_keys(str(err))
            user_message = f"Saved in MySQL DB. Note: Could not sync with UGC DEB Portal server ({safe_err})."
            log_api_call(db, target_url, "POST", param_str, f"APIKey: {api_key}, ClientID: {client_id}", 500, raw_ugc_resp, "ONLINE")

    # Save record to MySQL Database
    try:
        adm_record = AdmissionRecord(
            deb_unique_id=req.DEBuniqueID,
            abc_id=req.ABCID or "NA",
            student_name=req.studentName or "Unknown Student",
            hei_code=req.UniversityName,
            enrollment_no=req.EnrollmentNumber,
            mode_education=req.ModeEducation,
            programme_name=req.CourseName,
            admission_date=req.AdmissionDate,
            category=req.Category,
            gov_id_type=req.GovernmentIdentifier,
            gov_id_number=req.GovernmentIdentifierNumber,
            locality=req.Locality,
            nationality=req.Nationality,
            country_residence=req.CountryResidence,
            sync_status=ugc_status,
            ugc_response=raw_ugc_resp,
            mode_used=mode
        )
        db.add(adm_record)
        db.commit()
        db.refresh(adm_record)

        return {
            "status": "success",
            "message": user_message,
            "admission_id": adm_record.id,
            "sync_status": ugc_status,
            "data": adm_record
        }

    except Exception as db_err:
        db.rollback()
        logger.error(f"MySQL Insert Failed: {db_err}")
        raise HTTPException(status_code=500, detail=f"Database Save Error: {str(db_err)}")
