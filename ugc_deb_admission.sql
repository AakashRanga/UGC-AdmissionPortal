-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 24, 2026 at 11:09 AM
-- Server version: 8.0.41
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ugc_deb_admission`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `role` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `username`, `password_hash`, `full_name`, `role`, `created_at`, `last_login`) VALUES
(1, 'admin', '6153f163ecccc8960ae1329c4b3eb592:f04fabed736519348d5726fe24790d9fec3ecc438b0ecca2299bb26bed722d57', 'SIMATS Administrator', 'ADMIN', '2026-09-24 08:57:11', '2026-09-24 09:07:26');

-- --------------------------------------------------------

--
-- Table structure for table `api_logs`
--

CREATE TABLE `api_logs` (
  `id` int NOT NULL,
  `endpoint` varchar(255) NOT NULL,
  `method` varchar(10) NOT NULL,
  `request_params` text,
  `headers_sent` text,
  `response_status` int DEFAULT NULL,
  `response_body` text,
  `mode` varchar(20) DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `api_logs`
--

INSERT INTO `api_logs` (`id`, `endpoint`, `method`, `request_params`, `headers_sent`, `response_status`, `response_body`, `mode`, `timestamp`) VALUES
(1, '/api/DebUniqueID/GetStudentDetails', 'POST', 'DEBUniqueID=1234567890', 'APIKey: Q4Gm1AMqSnJGjN33Ecw36jIoHcmlmMd6', 200, '{\"status\": \"success\", \"message\": \"Student profile fetched successfully\", \"data\": {\"studentName\": \"\", \"gender\": \"\", \"dob\": \"\", \"universityName\": \"\", \"mobile\": \"\", \"email\": \"\", \"abcId\": \"\"}, \"deb_unique_id\": \"1234567890\", \"mode\": \"LOCAL\"}', 'LOCAL', '2026-09-05 04:14:59'),
(2, '/api/DebUniqueID/GetAdmissionDetails', 'POST', 'DEBuniqueID=1234567890&ABCID=NA&UniversityName=sjgfjsgfjds1122&CourseName=Bachelor of Computer Applications (BCA)&AdmissionDate=2026-09-05&AdmissionDetails=13&EnrollmentNumber=SIMATS1001&ModeEducation=Online(OL)&Category=General&GovernmentIdentifier=AADHAR Card&Locality=Urban&Nationality=Others&GovernmentIdentifierNumber=1234567890&CountryResidence=United States', 'APIKey: Q4Gm1AMqSnJGjN33Ecw36jIoHcmlmMd6', 200, '{\"status\": \"Process Success\", \"message\": \"Admission data submitted successfully\", \"details\": {\"DEBuniqueID\": \"1234567890\", \"ABCID\": \"NA\", \"UniversityName\": \"sjgfjsgfjds1122\", \"CourseName\": \"Bachelor of Computer Applications (BCA)\", \"AdmissionDate\": \"2026-09-05\", \"AdmissionDetails\": \"13\", \"EnrollmentNumber\": \"SIMATS1001\", \"ModeEducation\": \"Online(OL)\", \"Category\": \"General\", \"GovernmentIdentifier\": \"AADHAR Card\", \"Locality\": \"Urban\", \"Nationality\": \"Others\", \"GovernmentIdentifierNumber\": \"1234567890\", \"CountryResidence\": \"United States\"}}', 'LOCAL', '2026-09-05 04:16:00'),
(3, '/api/DebUniqueID/GetStudentDetails', 'POST', 'DEBUniqueID=bfbjdsfjs1231', 'APIKey: Q4Gm1AMqSnJGjN33Ecw36jIoHcmlmMd6', 200, '{\"status\": \"success\", \"message\": \"Student profile fetched successfully\", \"data\": {\"studentName\": \"\", \"gender\": \"\", \"dob\": \"\", \"universityName\": \"\", \"mobile\": \"\", \"email\": \"\", \"abcId\": \"\"}, \"deb_unique_id\": \"bfbjdsfjs1231\", \"mode\": \"LOCAL\"}', 'LOCAL', '2026-09-05 04:16:34'),
(4, 'http://45.124.184.101/deb.ugc.ac.in/api/DebUniqueID/GetStudentDetails?DEBUniqueID=1234567890', 'POST', 'DEBUniqueID=1234567890', 'APIKey: Q4Gm1AMqSnJGjN33Ecw36jIoHcmlmMd6', 404, '{\"status\": \"error\", \"message\": \"<!DOCTYPE HTML PUBLIC \\\"-//W3C//DTD HTML 4.01//EN\\\"\\\"http://www.w3.org/TR/html4/strict.dtd\\\">\\r\\n<HTML><HEAD><TITLE>Not Found</TITLE>\\r\\n<META HTTP-EQUIV=\\\"Content-Type\\\" Content=\\\"text/html; charset=us-ascii\\\"></HEAD>\\r\\n<BODY><h2>Not Found</h2>\\r\\n<hr><p>HTTP Error 404. The requested resource is not found.</p>\\r\\n</BODY></HTML>\\r\\n\"}', 'ONLINE', '2026-09-05 04:23:15'),
(5, 'http://45.124.184.101/deb.ugc.ac.in/api/DebUniqueID/GetStudentDetails?DEBUniqueID=1234567890', 'POST', 'DEBUniqueID=1234567890', 'APIKey: Q4Gm1AMqSnJGjN33Ecw36jIoHcmlmMd6', 404, '{\"status\": \"error\", \"message\": \"<!DOCTYPE HTML PUBLIC \\\"-//W3C//DTD HTML 4.01//EN\\\"\\\"http://www.w3.org/TR/html4/strict.dtd\\\">\\r\\n<HTML><HEAD><TITLE>Not Found</TITLE>\\r\\n<META HTTP-EQUIV=\\\"Content-Type\\\" Content=\\\"text/html; charset=us-ascii\\\"></HEAD>\\r\\n<BODY><h2>Not Found</h2>\\r\\n<hr><p>HTTP Error 404. The requested resource is not found.</p>\\r\\n</BODY></HTML>\\r\\n\"}', 'ONLINE', '2026-09-05 04:23:21'),
(6, 'http://45.124.184.101/deb.ugc.ac.in/api/DebUniqueID/GetStudentDetails?DEBUniqueID=1234567890', 'POST', 'DEBUniqueID=1234567890', 'APIKey: Q4Gm1AMqSnJGjN33Ecw36jIoHcmlmMd6', 404, '{\"status\": \"error\", \"message\": \"<!DOCTYPE HTML PUBLIC \\\"-//W3C//DTD HTML 4.01//EN\\\"\\\"http://www.w3.org/TR/html4/strict.dtd\\\">\\r\\n<HTML><HEAD><TITLE>Not Found</TITLE>\\r\\n<META HTTP-EQUIV=\\\"Content-Type\\\" Content=\\\"text/html; charset=us-ascii\\\"></HEAD>\\r\\n<BODY><h2>Not Found</h2>\\r\\n<hr><p>HTTP Error 404. The requested resource is not found.</p>\\r\\n</BODY></HTML>\\r\\n\"}', 'ONLINE', '2026-09-05 04:23:35'),
(7, '/api/DebUniqueID/GetStudentDetails', 'POST', 'DEBUniqueID=1234567890', 'APIKey: Q4Gm1AMqSnJGjN33Ecw36jIoHcmlmMd6', 200, '{\"status\": \"success\", \"message\": \"Student profile fetched successfully\", \"data\": {\"studentName\": \"\", \"gender\": \"\", \"dob\": \"\", \"universityName\": \"\", \"mobile\": \"\", \"email\": \"\", \"abcId\": \"\"}, \"deb_unique_id\": \"1234567890\", \"mode\": \"LOCAL\"}', 'LOCAL', '2026-09-05 04:34:26'),
(8, '/api/DebUniqueID/GetAdmissionDetails', 'POST', 'DEBuniqueID=1234567890&ABCID=NA&UniversityName=dfdsfds&CourseName=Bachelor of Computer Applications (BCA)&AdmissionDate=2026-09-05&AdmissionDetails=13&EnrollmentNumber=ffsdfds&ModeEducation=Online(OL)&Category=General&GovernmentIdentifier=AADHAR Card&Locality=Urban&Nationality=Indian&GovernmentIdentifierNumber=12345670sdfghj&CountryResidence=India', 'APIKey: Q4Gm1AMqSnJGjN33Ecw36jIoHcmlmMd6', 200, '{\"status\": \"Process Success\", \"message\": \"Admission data submitted successfully\", \"details\": {\"DEBuniqueID\": \"1234567890\", \"ABCID\": \"NA\", \"UniversityName\": \"dfdsfds\", \"CourseName\": \"Bachelor of Computer Applications (BCA)\", \"AdmissionDate\": \"2026-09-05\", \"AdmissionDetails\": \"13\", \"EnrollmentNumber\": \"ffsdfds\", \"ModeEducation\": \"Online(OL)\", \"Category\": \"General\", \"GovernmentIdentifier\": \"AADHAR Card\", \"Locality\": \"Urban\", \"Nationality\": \"Indian\", \"GovernmentIdentifierNumber\": \"12345670sdfghj\", \"CountryResidence\": \"India\"}}', 'LOCAL', '2026-09-05 04:35:22'),
(9, 'http://45.124.184.101/deb.ugc.ac.in/api/DebUniqueID/GetStudentDetails?DEBUniqueID=1234567890', 'POST', 'DEBUniqueID=1234567890', 'APIKey: Q4Gm1AMqSnJGjN33Ecw36jIoHcmlmMd6', 404, '{\"status\": \"error\", \"message\": \"<!DOCTYPE HTML PUBLIC \\\"-//W3C//DTD HTML 4.01//EN\\\"\\\"http://www.w3.org/TR/html4/strict.dtd\\\">\\r\\n<HTML><HEAD><TITLE>Not Found</TITLE>\\r\\n<META HTTP-EQUIV=\\\"Content-Type\\\" Content=\\\"text/html; charset=us-ascii\\\"></HEAD>\\r\\n<BODY><h2>Not Found</h2>\\r\\n<hr><p>HTTP Error 404. The requested resource is not found.</p>\\r\\n</BODY></HTML>\\r\\n\"}', 'ONLINE', '2026-09-05 04:36:37'),
(10, 'http://45.124.184.101/deb.ugc.ac.in/api/DebUniqueID/GetStudentDetails?DEBUniqueID=1234567890', 'POST', 'DEBUniqueID=1234567890', 'APIKey: Q4Gm1AMqSnJGjN33Ecw36jIoHcmlmMd6', 404, '{\"status\": \"error\", \"message\": \"<!DOCTYPE HTML PUBLIC \\\"-//W3C//DTD HTML 4.01//EN\\\"\\\"http://www.w3.org/TR/html4/strict.dtd\\\">\\r\\n<HTML><HEAD><TITLE>Not Found</TITLE>\\r\\n<META HTTP-EQUIV=\\\"Content-Type\\\" Content=\\\"text/html; charset=us-ascii\\\"></HEAD>\\r\\n<BODY><h2>Not Found</h2>\\r\\n<hr><p>HTTP Error 404. The requested resource is not found.</p>\\r\\n</BODY></HTML>\\r\\n\"}', 'ONLINE', '2026-09-05 04:36:51'),
(11, 'http://45.124.184.101/deb.ugc.ac.in/api/DebUniqueID/GetStudentDetails?DEBUniqueID=1234567890', 'POST', 'DEBUniqueID=1234567890', 'APIKey: Q4Gm1AMqSnJGjN33Ecw36jIoHcmlmMd6', 404, '{\"status\": \"error\", \"message\": \"<!DOCTYPE HTML PUBLIC \\\"-//W3C//DTD HTML 4.01//EN\\\"\\\"http://www.w3.org/TR/html4/strict.dtd\\\">\\r\\n<HTML><HEAD><TITLE>Not Found</TITLE>\\r\\n<META HTTP-EQUIV=\\\"Content-Type\\\" Content=\\\"text/html; charset=us-ascii\\\"></HEAD>\\r\\n<BODY><h2>Not Found</h2>\\r\\n<hr><p>HTTP Error 404. The requested resource is not found.</p>\\r\\n</BODY></HTML>\\r\\n\"}', 'ONLINE', '2026-09-05 04:39:35'),
(12, 'http://45.124.184.101/deb.ugc.ac.in/api/DebUniqueID/GetStudentDetails?DEBUniqueID=1234567890', 'POST', 'DEBUniqueID=1234567890', 'APIKey: Q4Gm1AMqSnJGjN33Ecw36jIoHcmlmMd6', 404, '{\"status\": \"error\", \"message\": \"<!DOCTYPE HTML PUBLIC \\\"-//W3C//DTD HTML 4.01//EN\\\"\\\"http://www.w3.org/TR/html4/strict.dtd\\\">\\r\\n<HTML><HEAD><TITLE>Not Found</TITLE>\\r\\n<META HTTP-EQUIV=\\\"Content-Type\\\" Content=\\\"text/html; charset=us-ascii\\\"></HEAD>\\r\\n<BODY><h2>Not Found</h2>\\r\\n<hr><p>HTTP Error 404. The requested resource is not found.</p>\\r\\n</BODY></HTML>\\r\\n\"}', 'ONLINE', '2026-09-05 04:43:12'),
(13, 'http://45.124.184.101/deb.ugc.ac.in/api/DebUniqueID/GetStudentDetails?DEBUniqueID=1234567890', 'POST', 'DEBUniqueID=1234567890', 'APIKey: Q4Gm1AMqSnJGjN33Ecw36jIoHcmlmMd6', 404, '{\"status\": \"error\", \"message\": \"<!DOCTYPE HTML PUBLIC \\\"-//W3C//DTD HTML 4.01//EN\\\"\\\"http://www.w3.org/TR/html4/strict.dtd\\\">\\r\\n<HTML><HEAD><TITLE>Not Found</TITLE>\\r\\n<META HTTP-EQUIV=\\\"Content-Type\\\" Content=\\\"text/html; charset=us-ascii\\\"></HEAD>\\r\\n<BODY><h2>Not Found</h2>\\r\\n<hr><p>HTTP Error 404. The requested resource is not found.</p>\\r\\n</BODY></HTML>\\r\\n\"}', 'ONLINE', '2026-09-05 04:46:20'),
(14, 'http://45.124.184.101/deb.ugc.ac.in/api/DebUniqueID/GetStudentDetails?DEBUniqueID=1234567890', 'POST', 'DEBUniqueID=1234567890', 'APIKey: Q4Gm1AMqSnJGjN33Ecw36jIoHcmlmMd6', 404, '{\"status\": \"error\", \"message\": \"<!DOCTYPE HTML PUBLIC \\\"-//W3C//DTD HTML 4.01//EN\\\"\\\"http://www.w3.org/TR/html4/strict.dtd\\\">\\r\\n<HTML><HEAD><TITLE>Not Found</TITLE>\\r\\n<META HTTP-EQUIV=\\\"Content-Type\\\" Content=\\\"text/html; charset=us-ascii\\\"></HEAD>\\r\\n<BODY><h2>Not Found</h2>\\r\\n<hr><p>HTTP Error 404. The requested resource is not found.</p>\\r\\n</BODY></HTML>\\r\\n\"}', 'ONLINE', '2026-09-05 04:48:48'),
(15, 'http://deb.ugc.ac.in/api/DebUniqueID/GetStudentDetails?DEBUniqueID=1234567890', 'POST', 'DEBUniqueID=1234567890', 'APIKey: 49fV5ByAZSxPDd42kprH64xGg5dGJFtH, ClientID: ', 200, '{\"Message\": \"49fV5ByAZSxPDd42kprH64xGg5dGJFtH\", \"Status\": \"Process Refused\"}', 'ONLINE', '2026-09-05 04:49:19'),
(16, 'http://deb.ugc.ac.in/api/DebUniqueID/GetStudentDetails?DEBUniqueID=1234567890', 'POST', 'DEBUniqueID=1234567890', 'APIKey: 49fV5ByAZSxPDd42kprH64xGg5dGJFtH, ClientID: ', 200, '{\"Message\": \"49fV5ByAZSxPDd42kprH64xGg5dGJFtH\", \"Status\": \"Process Refused\"}', 'ONLINE', '2026-09-05 04:51:14'),
(17, 'http://deb.ugc.ac.in/api/DebUniqueID/GetStudentDetails?DEBUniqueID=1234567890', 'POST', 'DEBUniqueID=1234567890', 'APIKey: 49fV5ByAZSxPDd42kprH64xGg5dGJFtH, ClientID: ', 200, '{\"Message\": \"49fV5ByAZSxPDd42kprH64xGg5dGJFtH\", \"Status\": \"Process Refused\"}', 'ONLINE', '2026-09-05 04:52:23'),
(18, 'http://deb.ugc.ac.in/api/DebUniqueID/GetStudentDetails', 'POST', 'DEBUniqueID=1234567890', 'APIKey: 49fV5ByAZSxPDd42kprH64xGg5dGJFtH, ClientID: ', 200, '{\"status\": \"success\", \"message\": \"Student profile fetched successfully (Local Test Mode)\", \"data\": {\"studentName\": \"\", \"gender\": \"\", \"dob\": \"\", \"universityName\": \"\", \"mobile\": \"\", \"email\": \"\", \"abcId\": \"\"}, \"deb_unique_id\": \"1234567890\", \"mode\": \"LOCAL\"}', 'LOCAL', '2026-09-05 05:04:44'),
(19, 'http://deb.ugc.ac.in/api/DebUniqueID/GetStudentDetails', 'POST', 'DEBUniqueID=123456789', 'APIKey: 49fV5ByAZSxPDd42kprH64xGg5dGJFtH, ClientID: ', 200, '{\"status\": \"success\", \"message\": \"Student profile fetched successfully (Local Test Mode)\", \"data\": {\"studentName\": \"Aarav Sharma\", \"gender\": \"Male\", \"dob\": \"2001-05-15\", \"universityName\": \"\", \"mobile\": \"9876543210\", \"email\": \"aarav.sharma@example.com\", \"abcId\": \"ABC98765432101\"}, \"deb_unique_id\": \"123456789\", \"mode\": \"LOCAL\"}', 'LOCAL', '2026-09-24 08:18:22'),
(20, 'http://deb.ugc.ac.in/api/DebUniqueID/GetAdmissionDetails', 'POST', 'DEBuniqueID=123456789&ABCID=ABC12345&UniversityName=U_2345&CourseName=Bachelor of Computer Applications (BCA)&AdmissionDate=2026-09-24&AdmissionDetails=13&EnrollmentNumber=131312hb&ModeEducation=Online(OL)&Category=General&GovernmentIdentifier=AADHAR Card&Locality=Urban&Nationality=Indian&GovernmentIdentifierNumber=bbfb&CountryResidence=India', 'APIKey: WEtx7hXdKp3ssxcAhRam3jaEbkrsbHjq, ClientID: ', 200, '{\"status\": \"Process Success\", \"message\": \"Admission data submitted successfully\", \"details\": {\"DEBuniqueID\": \"123456789\", \"ABCID\": \"ABC12345\", \"UniversityName\": \"U_2345\", \"CourseName\": \"Bachelor of Computer Applications (BCA)\", \"AdmissionDate\": \"2026-09-24\", \"AdmissionDetails\": \"13\", \"EnrollmentNumber\": \"131312hb\", \"ModeEducation\": \"Online(OL)\", \"Category\": \"General\", \"GovernmentIdentifier\": \"AADHAR Card\", \"Locality\": \"Urban\", \"Nationality\": \"Indian\", \"GovernmentIdentifierNumber\": \"bbfb\", \"CountryResidence\": \"India\"}}', 'LOCAL', '2026-09-24 08:18:52');

-- --------------------------------------------------------

--
-- Table structure for table `deb_admissions`
--

CREATE TABLE `deb_admissions` (
  `id` int NOT NULL,
  `deb_unique_id` varchar(100) NOT NULL,
  `abc_id` varchar(100) DEFAULT NULL,
  `student_name` varchar(150) DEFAULT NULL,
  `hei_code` varchar(50) NOT NULL,
  `enrollment_no` varchar(100) NOT NULL,
  `mode_education` varchar(50) NOT NULL,
  `programme_name` varchar(200) NOT NULL,
  `admission_date` varchar(50) NOT NULL,
  `category` varchar(50) NOT NULL,
  `gov_id_type` varchar(50) NOT NULL,
  `gov_id_number` varchar(100) NOT NULL,
  `locality` varchar(50) NOT NULL,
  `nationality` varchar(50) NOT NULL,
  `country_residence` varchar(100) NOT NULL,
  `admission_details` varchar(255) DEFAULT NULL,
  `sync_status` varchar(50) DEFAULT NULL,
  `ugc_response` text,
  `mode_used` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `deb_admissions`
--

INSERT INTO `deb_admissions` (`id`, `deb_unique_id`, `abc_id`, `student_name`, `hei_code`, `enrollment_no`, `mode_education`, `programme_name`, `admission_date`, `category`, `gov_id_type`, `gov_id_number`, `locality`, `nationality`, `country_residence`, `admission_details`, `sync_status`, `ugc_response`, `mode_used`, `created_at`, `updated_at`) VALUES
(3, '123456789', 'ABC12345', 'Aarav Sharma', 'U_2345', '131312hb', 'Online(OL)', 'Bachelor of Computer Applications (BCA)', '2026-09-24', 'General', 'AADHAR Card', 'bbfb', 'Urban', 'Indian', 'India', '13', 'UGC_SYNCED', '{\"status\": \"Process Success\", \"message\": \"Admission data submitted successfully\", \"details\": {\"DEBuniqueID\": \"123456789\", \"ABCID\": \"ABC12345\", \"UniversityName\": \"U_2345\", \"CourseName\": \"Bachelor of Computer Applications (BCA)\", \"AdmissionDate\": \"2026-09-24\", \"AdmissionDetails\": \"13\", \"EnrollmentNumber\": \"131312hb\", \"ModeEducation\": \"Online(OL)\", \"Category\": \"General\", \"GovernmentIdentifier\": \"AADHAR Card\", \"Locality\": \"Urban\", \"Nationality\": \"Indian\", \"GovernmentIdentifierNumber\": \"bbfb\", \"CountryResidence\": \"India\"}}', 'LOCAL', '2026-09-24 08:18:52', '2026-09-24 08:18:52');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_admin_users_username` (`username`),
  ADD KEY `ix_admin_users_id` (`id`);

--
-- Indexes for table `api_logs`
--
ALTER TABLE `api_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ix_api_logs_id` (`id`);

--
-- Indexes for table `deb_admissions`
--
ALTER TABLE `deb_admissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ix_deb_admissions_id` (`id`),
  ADD KEY `ix_deb_admissions_deb_unique_id` (`deb_unique_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `api_logs`
--
ALTER TABLE `api_logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `deb_admissions`
--
ALTER TABLE `deb_admissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
