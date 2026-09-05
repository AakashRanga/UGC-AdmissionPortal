-- UGC DEB Admission System MySQL Schema DDL
CREATE DATABASE IF NOT EXISTS `ugc_deb_admission` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ugc_deb_admission`;

-- 1. Admission Records Table
CREATE TABLE IF NOT EXISTS `deb_admissions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `deb_unique_id` VARCHAR(100) NOT NULL,
    `abc_id` VARCHAR(100) DEFAULT NULL,
    `student_name` VARCHAR(150) DEFAULT NULL,
    `hei_code` VARCHAR(50) NOT NULL,
    `enrollment_no` VARCHAR(100) NOT NULL,
    `mode_education` VARCHAR(50) NOT NULL,
    `programme_name` VARCHAR(200) NOT NULL,
    `admission_date` VARCHAR(50) NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `gov_id_type` VARCHAR(50) NOT NULL,
    `gov_id_number` VARCHAR(100) NOT NULL,
    `locality` VARCHAR(50) NOT NULL,
    `nationality` VARCHAR(50) NOT NULL,
    `country_residence` VARCHAR(100) NOT NULL,
    `admission_details` VARCHAR(255) DEFAULT '13',
    `sync_status` VARCHAR(50) DEFAULT 'LOCAL_ONLY',
    `ugc_response` TEXT DEFAULT NULL,
    `mode_used` VARCHAR(20) DEFAULT 'LOCAL',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_deb_unique_id` (`deb_unique_id`),
    INDEX `idx_hei_code` (`hei_code`),
    INDEX `idx_sync_status` (`sync_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. API Tracing & Audit Log Table
CREATE TABLE IF NOT EXISTS `api_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `endpoint` VARCHAR(255) NOT NULL,
    `method` VARCHAR(10) NOT NULL,
    `request_params` TEXT DEFAULT NULL,
    `headers_sent` TEXT DEFAULT NULL,
    `response_status` INT DEFAULT NULL,
    `response_body` TEXT DEFAULT NULL,
    `mode` VARCHAR(20) DEFAULT 'LOCAL',
    `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
