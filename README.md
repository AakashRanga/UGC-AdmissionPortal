# UGC DEB Student Admission Portal

A production-ready web application built for Higher Educational Institutions (HEIs) to manage the **UGC Distance Education Bureau (DEB)** Student Admission Process in accordance with official UGC specifications.

---

## 🌟 Features

- **Step-by-step Admission Workflow**:
  - **Step 1**: Search & Verify 12-Digit DEB Unique ID via UGC API (`GetStudentDetails`).
  - **Step 2**: Review Verified Profile (Student Name, Gender, Date of Birth, AISHE Code).
  - **Step 3**: HEI Admission Entry Form featuring 232-Country Searchable Master Dropdown.
  - **Step 4**: Realtime Reverse Push to UGC Portal (`GetAdmissionDetails`) & Automatic MySQL Saving.
- **Dual-Mode System**:
  - **Realtime Online API Mode**: Connects directly to official UGC DEB endpoints (`http://deb.ugc.ac.in`).
  - **Local Test Mode**: Allows sandbox testing for offline verification.
- **MySQL Audit Logging**:
  - Automatically records admission details into `deb_admissions` and keeps raw request/response API audit logs in `api_logs`.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Python**: Version `3.10` or higher
- **Node.js**: Version `18.0` or higher
- **MySQL Server**: Running on port `3308` (or custom port set in `.env`)

---

### 2. Backend Setup & Running (FastAPI)

1. Navigate to the backend directory or project root:
   ```bash
   cd backend
   ```

2. Create a Python Virtual Environment (`venv`):
   ```bash
   python -m venv venv
   ```

3. Activate the Virtual Environment:
   - **Windows (PowerShell)**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Windows (Command Prompt)**:
     ```cmd
     venv\Scripts\activate.bat
     ```
   - **Linux / macOS**:
     ```bash
     source venv/bin/activate
     ```

4. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Configure Environment Variables in `backend/.env`:
   Make sure `backend/.env` contains your UGC API keys and MySQL credentials:
   ```env
   # UGC DEB API Credentials
   UGC_FETCH_STUDENT_URL=http://deb.ugc.ac.in/api/DebUniqueID/GetStudentDetails
   UGC_FETCH_STUDENT_API_KEY=YOUR_FETCH_API_KEY

   UGC_SUBMIT_ADMISSION_URL=http://deb.ugc.ac.in/api/DebUniqueID/GetAdmissionDetails
   UGC_SUBMIT_ADMISSION_API_KEY=YOUR_SUBMIT_API_KEY

   # MySQL Database Settings
   MYSQL_HOST=localhost
   MYSQL_PORT=3308
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password
   MYSQL_DB=ugc_deb_admission
   ```

6. Start the FastAPI backend server:
   From project root:
   ```bash
   python -m uvicorn backend.main:app --port 8000 --reload
   ```
   *The backend will run on `http://localhost:8000` with Swagger docs at `http://localhost:8000/docs`.*

---

### 3. Frontend Setup & Running (React + Vite)

1. Open a new terminal in the project root (`DEB` directory).

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend application will open on `http://localhost:5173`.*

---

## 🗄️ Database Schema & Structure

The system automatically initializes the MySQL database `ugc_deb_admission` with the following tables:

1. **`deb_admissions`**:
   - `id`, `deb_unique_id`, `abc_id`, `student_name`, `hei_code`, `enrollment_no`, `mode_education`, `programme_name`, `admission_date`, `category`, `gov_id_type`, `gov_id_number`, `locality`, `nationality`, `country_residence`, `sync_status`, `ugc_response`, `mode_used`, `created_at`, `updated_at`

2. **`api_logs`**:
   - `id`, `endpoint`, `method`, `request_params`, `headers_sent`, `response_status`, `response_body`, `mode`, `timestamp`

3. **`admin_users`**:
   - `id`, `username`, `password_hash`, `full_name`, `role`, `created_at`, `last_login`
   - Default Administrator Credentials:
     - **Username**: `admin`
     - **Password**: `admin123` (Stored as salted SHA-256 hash in MySQL)

---

## 🔐 Administrator Authentication & Management APIs

The portal includes dedicated endpoints to manage administrator accounts stored in MySQL:

### 1. Create New Administrator Account
Create a new admin user with credentials hashed and saved into MySQL.

- **Endpoint**: `POST /api/auth/create-admin`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "username": "new_admin",
    "password": "SecurePassword123!",
    "fullName": "SIMATS Officer",
    "role": "ADMIN"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Administrator account 'new_admin' created successfully in MySQL database.",
    "user": {
      "id": 2,
      "username": "new_admin",
      "fullName": "SIMATS Officer",
      "role": "ADMIN"
    }
  }
  ```
- **cURL Example**:
  ```bash
  curl -X POST "http://localhost:8000/api/auth/create-admin" \
       -H "Content-Type: application/json" \
       -d '{"username": "simats_admin", "password": "AdminPassword2025", "fullName": "Saveetha Admissions Incharge", "role": "ADMIN"}'
  ```

---

### 2. Administrator Login
Authenticate an administrator against MySQL.

- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Administrator authenticated successfully.",
    "token": "wL9j1_...",
    "user": {
      "id": 1,
      "username": "admin",
      "fullName": "SIMATS Administrator",
      "role": "ADMIN"
    }
  }
  ```

---

### 3. List Registered Administrators
Retrieve list of registered administrator accounts (passwords are safely omitted).

- **Endpoint**: `GET /api/auth/users`
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "count": 1,
    "data": [
      {
        "id": 1,
        "username": "admin",
        "fullName": "SIMATS Administrator",
        "role": "ADMIN",
        "createdAt": "2026-09-24T14:26:00",
        "lastLogin": "2026-09-24T14:30:00"
      }
    ]
  }
  ```

---

### 4. Update Administrator Password
Update an admin account's password in MySQL.

- **Endpoint**: `POST /api/auth/change-password`
- **Request Body**:
  ```json
  {
    "username": "admin",
    "currentPassword": "admin123",
    "newPassword": "NewStrongPassword2025"
  }
  ```

---

## 📄 License & Confidentiality
Created for Higher Educational Institutions (HEIs) integrating with the UGC Distance Education Bureau (DEB) Admission System.
