-- UGC DEB Admission System MySQL Schema DDL
CREATE DATABASE IF NOT EXISTS `ugc_deb_admission` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ugc_deb_admission`;

-- 1. Admission Records Table
CREATE TABLE IF NOT EXISTS `deb_admissions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `deb_unique_id` VARCHAR(255) NOT NULL,
    `abc_id` VARCHAR(255) DEFAULT NULL,
    `student_name` VARCHAR(255) DEFAULT NULL,
    `hei_code` VARCHAR(255) NOT NULL,
    `enrollment_no` VARCHAR(255) NOT NULL,
    `mode_education` VARCHAR(255) NOT NULL,
    `programme_name` VARCHAR(500) NOT NULL,
    `admission_date` VARCHAR(100) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `gov_id_type` VARCHAR(100) NOT NULL,
    `gov_id_number` VARCHAR(255) NOT NULL,
    `locality` VARCHAR(100) NOT NULL,
    `nationality` VARCHAR(100) NOT NULL,
    `country_residence` VARCHAR(255) NOT NULL,
    `admission_details` VARCHAR(500) DEFAULT '13',
    `sync_status` VARCHAR(100) DEFAULT 'LOCAL_ONLY',
    `ugc_response` LONGTEXT DEFAULT NULL,
    `mode_used` VARCHAR(50) DEFAULT 'LOCAL',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_deb_unique_id` (`deb_unique_id`),
    INDEX `idx_hei_code` (`hei_code`),
    INDEX `idx_sync_status` (`sync_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. API Tracing & Audit Log Table
CREATE TABLE IF NOT EXISTS `api_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `endpoint` VARCHAR(500) NOT NULL,
    `method` VARCHAR(50) NOT NULL,
    `request_params` LONGTEXT DEFAULT NULL,
    `headers_sent` LONGTEXT DEFAULT NULL,
    `response_status` INT DEFAULT NULL,
    `response_body` LONGTEXT DEFAULT NULL,
    `mode` VARCHAR(50) DEFAULT 'LOCAL',
    `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Admin Authentication Table
CREATE TABLE IF NOT EXISTS `admin_users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(100) NOT NULL UNIQUE,
    `password_hash` VARCHAR(500) NOT NULL,
    `full_name` VARCHAR(255) DEFAULT 'SIMATS Administrator',
    `role` VARCHAR(50) DEFAULT 'ADMIN',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `last_login` DATETIME DEFAULT NULL,
    INDEX `idx_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
