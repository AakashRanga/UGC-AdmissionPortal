import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from backend.database import Base

class AdmissionRecord(Base):
    __tablename__ = "deb_admissions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    deb_unique_id = Column(String(255), index=True, nullable=False)
    abc_id = Column(String(255), nullable=True)
    student_name = Column(String(255), nullable=True)
    hei_code = Column(String(255), nullable=False)
    enrollment_no = Column(String(255), nullable=False)
    mode_education = Column(String(255), nullable=False)
    programme_name = Column(String(500), nullable=False)
    admission_date = Column(String(100), nullable=False)
    category = Column(String(100), nullable=False)
    gov_id_type = Column(String(100), nullable=False)
    gov_id_number = Column(String(255), nullable=False)
    locality = Column(String(100), nullable=False)
    nationality = Column(String(100), nullable=False)
    country_residence = Column(String(255), nullable=False)
    admission_details = Column(String(500), default="13")
    sync_status = Column(String(100), default="LOCAL_ONLY") # LOCAL_ONLY, UGC_SYNCED, SYNC_FAILED
    ugc_response = Column(Text, nullable=True)
    mode_used = Column(String(50), default="LOCAL") # LOCAL, ONLINE
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class ApiLog(Base):
    __tablename__ = "api_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    endpoint = Column(String(500), nullable=False)
    method = Column(String(50), nullable=False)
    request_params = Column(Text, nullable=True)
    headers_sent = Column(Text, nullable=True)
    response_status = Column(Integer, nullable=True)
    response_body = Column(Text, nullable=True)
    mode = Column(String(50), default="LOCAL")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(500), nullable=False)
    full_name = Column(String(255), default="SIMATS Administrator")
    role = Column(String(50), default="ADMIN")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
