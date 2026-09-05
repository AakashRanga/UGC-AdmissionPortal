import os
import json
import logging
import datetime
import httpx
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend.database import get_db, engine, Base
from backend.models import AdmissionRecord, ApiLog
from backend.schemas import (
    StudentFetchRequest,
    AdmissionSubmissionRequest,
    AdmissionRecordResponse
)
from backend.config import settings

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("deb_app")

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="UGC DEB Student Admission System",
    description="Official UGC DEB API integration backend for HEI Admission Process.",
    version="1.0.0"
)

# Enable CORS for React Vite Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def sanitize_response(text_body: str) -> str:
    """Sanitize HTML error responses (e.g. 404/500 IIS pages) into human-readable messages."""
    if not text_body:
        return "Empty response received from server."
    if "<!DOCTYPE" in text_body or "<html" in text_body.lower():
        if "404" in text_body or "Not Found" in text_body:
            return "HTTP Error 404: The requested UGC DEB endpoint or DEB Unique ID was not found."
        elif "500" in text_body or "Internal Server Error" in text_body:
            return "HTTP Error 500: UGC DEB Portal server encountered an internal error."
        else:
            return "The UGC DEB Portal returned an unexpected HTML error page instead of JSON."
    return text_body[:300]

def normalize_ugc_student_response(resp_json: dict) -> dict:
    """Normalize raw response from UGC GetStudentDetails into standardized format."""
    if not isinstance(resp_json, dict):
        return {"status": "error", "message": "Invalid response format received from UGC API."}

    # If UGC returned error format
    if resp_json.get("status") in ["error", "Process Error", "Error", "404"]:
        msg = resp_json.get("message") or resp_json.get("Message") or resp_json.get("error") or "Student details not found."
        return {"status": "error", "message": str(msg)}

    # Check for success structure
    target = resp_json.get("data") or resp_json.get("Resource") or resp_json.get("List") or resp_json

    if isinstance(target, list) and len(target) > 0:
        target = target[0]

    if isinstance(target, dict):
        name = target.get("studentName") or target.get("stdname") or target.get("StudentName") or ""
        gender = target.get("gender") or target.get("Gender") or ""
        dob = target.get("dob") or target.get("DOB") or ""
        univ = target.get("universityName") or target.get("UniversityName") or settings.DEFAULT_HEI_CODE
        abc_id = target.get("abcId") or target.get("ABCID") or target.get("StudentID") or target.get("studentId") or ""

        if name or gender or dob or univ:
            return {
                "status": "success",
                "message": "Student profile fetched successfully from UGC DEB Portal",
                "data": {
                    "studentName": name,
                    "gender": gender,
                    "dob": dob,
                    "universityName": univ,
                    "abcId": abc_id
                }
            }

    msg = resp_json.get("message") or "DEB Unique ID not registered or no profile data found on UGC portal."
    return {"status": "error", "message": msg}

def log_api_call(db: Session, endpoint: str, method: str, req_params: str, headers: str, status_code: int, response_body: str, mode_used: str):
    """Save API audit log to MySQL database."""
    try:
        log_entry = ApiLog(
            endpoint=endpoint,
            method=method,
            request_params=req_params[:1000] if req_params else None,
            request_headers=headers[:500] if headers else None,
            response_code=status_code,
            response_body=response_body[:2000] if response_body else None,
            mode_used=mode_used
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

# (Existing student fetch & submit admission routes remain unchanged)

@app.get("/api/admissions")
@app.get("/api/deb/admissions")
def get_all_admissions(db: Session = Depends(get_db)):
    """Retrieve all admission records saved in MySQL database."""
    records = db.query(AdmissionRecord).order_by(AdmissionRecord.created_at.desc()).all()
    return {"status": "success", "count": len(records), "data": records}

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

@app.get("/api/logs")
@app.get("/api/deb/logs")
def get_api_logs(limit: int = 50, db: Session = Depends(get_db)):
    """Retrieve API audit logs from MySQL database."""
    logs = db.query(ApiLog).order_by(ApiLog.created_at.desc()).limit(limit).all()
    return {"status": "success", "count": len(logs), "data": logs}

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
                clean_msg = sanitize_response(resp.text)
                resp_json = {"status": "error", "message": clean_msg}

            log_api_call(db, target_url, "POST", f"DEBUniqueID={deb_id}", f"APIKey: {api_key}, ClientID: {client_id}", status_code, json.dumps(resp_json) if isinstance(resp_json, dict) else str(resp_json), "ONLINE")

            # Normalize raw UGC response into clear English feedback
            normalized = normalize_ugc_student_response(resp_json)
            normalized["deb_unique_id"] = deb_id
            normalized["mode"] = "ONLINE"
            return normalized
        
        except Exception as err:
            error_payload = {
                "status": "error",
                "message": f"Connection Error: Could not connect to UGC DEB Portal server ({str(err)}). Please check your internet connection.",
                "details": f"Online request to {target_url} failed or timed out."
            }
            log_api_call(db, target_url, "POST", f"DEBUniqueID={deb_id}", f"APIKey: {api_key}, ClientID: {client_id}", 500, json.dumps(error_payload), "ONLINE")
            return error_payload

@app.post("/api/deb/submit-admission")
async def submit_admission(req: AdmissionSubmissionRequest, db: Session = Depends(get_db)):
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
                clean_msg = sanitize_response(resp.text)
                resp_json = {"status": "error", "message": clean_msg}

            raw_ugc_resp = json.dumps(resp_json) if isinstance(resp_json, dict) else str(resp_json)
            log_api_call(db, target_url, "POST", param_str, f"APIKey: {api_key}, ClientID: {client_id}", status_code, raw_ugc_resp, "ONLINE")

            if status_code == 200 and isinstance(resp_json, dict) and (resp_json.get("status") == "Process Success" or resp_json.get("Status") == "Process Success"):
                ugc_status = "UGC_SYNCED"
                user_message = "Admission successfully pushed to UGC DEB Portal and saved in MySQL Database."
            else:
                ugc_status = "UGC_FAILED"
                err_detail = resp_json.get("message") if isinstance(resp_json, dict) else resp.text
                user_message = f"UGC DEB Reverse Push Warning: {err_detail} (Admission saved locally in MySQL DB)."
        
        except Exception as err:
            ugc_status = "UGC_ERROR"
            raw_ugc_resp = str(err)
            user_message = f"Saved in MySQL DB. Note: Could not sync with UGC DEB Portal server ({str(err)})."
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
            raw_response=raw_ugc_resp,
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
