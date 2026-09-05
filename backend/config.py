import os
from pydantic_settings import BaseSettings

env_path = os.path.join(os.path.dirname(__file__), ".env")

class Settings(BaseSettings):
    # 1. UGC API for Fetching Student Details
    UGC_FETCH_STUDENT_URL: str = "http://deb.ugc.ac.in/api/DebUniqueID/GetStudentDetails"
    UGC_FETCH_STUDENT_CLIENT_ID: str = ""
    UGC_FETCH_STUDENT_API_KEY: str = ""

    # 2. UGC API for Sharing Admission Details (Reverse Push)
    UGC_SUBMIT_ADMISSION_URL: str = "http://deb.ugc.ac.in/api/DebUniqueID/GetAdmissionDetails"
    UGC_SUBMIT_ADMISSION_CLIENT_ID: str = ""
    UGC_SUBMIT_ADMISSION_API_KEY: str = ""

    # HEI AISHE Code
    DEFAULT_HEI_CODE: str = ""

    # MySQL Database Configuration
    MYSQL_HOST: str = "localhost"
    MYSQL_PORT: int = 3308
    MYSQL_USER: str = "root"
    MYSQL_PASSWORD: str = "12345"
    MYSQL_DB: str = "ugc_deb_admission"
    
    # System Mode: 'LOCAL' or 'ONLINE'
    APP_MODE: str = "ONLINE"

    class Config:
        env_file = env_path
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
