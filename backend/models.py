import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from backend.database import Base

class AdmissionRecord(Base):
    __tablename__ = "deb_admissions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    deb_unique_id = Column(String(100), index=True, nullable=False)
    abc_id = Column(String(100), nullable=True)
    student_name = Column(String(150), nullable=True)
    hei_code = Column(String(50), nullable=False)
    enrollment_no = Column(String(100), nullable=False)
    mode_education = Column(String(50), nullable=False)
    programme_name = Column(String(200), nullable=False)
    admission_date = Column(String(50), nullable=False)
    category = Column(String(50), nullable=False)
    gov_id_type = Column(String(50), nullable=False)
    gov_id_number = Column(String(100), nullable=False)
    locality = Column(String(50), nullable=False)
    nationality = Column(String(50), nullable=False)
    country_residence = Column(String(100), nullable=False)
    admission_details = Column(String(255), default="13")
    sync_status = Column(String(50), default="LOCAL_ONLY") # LOCAL_ONLY, UGC_SYNCED, SYNC_FAILED
    ugc_response = Column(Text, nullable=True)
    mode_used = Column(String(20), default="LOCAL") # LOCAL, ONLINE
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class ApiLog(Base):
    __tablename__ = "api_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    endpoint = Column(String(255), nullable=False)
    method = Column(String(10), nullable=False)
    request_params = Column(Text, nullable=True)
    headers_sent = Column(Text, nullable=True)
    response_status = Column(Integer, nullable=True)
    response_body = Column(Text, nullable=True)
    mode = Column(String(20), default="LOCAL")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
