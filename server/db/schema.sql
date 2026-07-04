-- JeevanCare+ Database Schema
-- MySQL 8.0+
-- Default scope: Hyderabad, Telangana — city/state columns included for future India-wide expansion

CREATE DATABASE IF NOT EXISTS jeevancare_db;
USE jeevancare_db;

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(15),
  password_hash VARCHAR(255) NOT NULL,
  address TEXT,
  city VARCHAR(100) DEFAULT 'Hyderabad',
  state VARCHAR(100) DEFAULT 'Telangana',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- Hospitals Table
-- ============================================
CREATE TABLE IF NOT EXISTS hospitals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  type ENUM('government', 'private') NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) DEFAULT 'Hyderabad',
  state VARCHAR(100) DEFAULT 'Telangana',
  lat DECIMAL(10, 7) NOT NULL,
  lng DECIMAL(10, 7) NOT NULL,
  contact_number VARCHAR(20),
  email VARCHAR(150),
  website VARCHAR(255),
  facilities JSON COMMENT 'Array of facility strings: ICU, Blood Bank, Ambulance, Emergency 24/7, etc.',
  image_url VARCHAR(500),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_city (city),
  INDEX idx_type (type),
  INDEX idx_lat_lng (lat, lng)
);

-- ============================================
-- Hospital Doctors Table
-- ============================================
CREATE TABLE IF NOT EXISTS hospital_doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  hospital_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  specialization VARCHAR(150) NOT NULL,
  qualification VARCHAR(255),
  experience_years INT DEFAULT 0,
  photo_url VARCHAR(500),
  timings VARCHAR(255) COMMENT 'e.g., Mon-Fri 9AM-5PM',
  consultation_fee DECIMAL(10, 2),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
  INDEX idx_specialization (specialization)
);

-- ============================================
-- Clinic Doctors Table (Independent clinics — separate from hospital doctors)
-- ============================================
CREATE TABLE IF NOT EXISTS clinic_doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  specialization VARCHAR(150) NOT NULL,
  qualification VARCHAR(255),
  experience_years INT DEFAULT 0,
  clinic_name VARCHAR(200),
  clinic_address TEXT NOT NULL,
  city VARCHAR(100) DEFAULT 'Hyderabad',
  state VARCHAR(100) DEFAULT 'Telangana',
  lat DECIMAL(10, 7) NOT NULL,
  lng DECIMAL(10, 7) NOT NULL,
  consultation_fee DECIMAL(10, 2),
  home_visit_fee DECIMAL(10, 2),
  phone VARCHAR(20),
  email VARCHAR(150),
  photo_url VARCHAR(500),
  bio TEXT,
  available_slots JSON COMMENT 'Array of {day, start_time, end_time} objects',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_city (city),
  INDEX idx_specialization (specialization),
  INDEX idx_lat_lng (lat, lng)
);

-- ============================================
-- Physiotherapists Table
-- ============================================
CREATE TABLE IF NOT EXISTS physiotherapists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  specialization VARCHAR(150) NOT NULL COMMENT 'orthopedic, neuro, sports, pediatric, etc.',
  qualification VARCHAR(255),
  experience_years INT DEFAULT 0,
  address TEXT,
  city VARCHAR(100) DEFAULT 'Hyderabad',
  state VARCHAR(100) DEFAULT 'Telangana',
  lat DECIMAL(10, 7),
  lng DECIMAL(10, 7),
  home_visit_fee DECIMAL(10, 2),
  phone VARCHAR(20),
  email VARCHAR(150),
  photo_url VARCHAR(500),
  bio TEXT,
  available_slots JSON COMMENT 'Array of {day, start_time, end_time} objects',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_city (city),
  INDEX idx_specialization (specialization)
);

-- ============================================
-- Home Visit Appointments (shared by clinic doctors & physiotherapists)
-- ============================================
CREATE TABLE IF NOT EXISTS home_visit_appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  doctor_id INT NOT NULL,
  doctor_type ENUM('clinic', 'physio') NOT NULL,
  appointment_date DATE NOT NULL,
  time_slot VARCHAR(50) NOT NULL,
  patient_address TEXT NOT NULL,
  patient_city VARCHAR(100) DEFAULT 'Hyderabad',
  reason TEXT,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_doctor (doctor_id, doctor_type),
  INDEX idx_status (status),
  INDEX idx_date (appointment_date)
);

-- ============================================
-- Nurses Table (Mock Data)
-- ============================================
CREATE TABLE IF NOT EXISTS nurses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  experience_years INT DEFAULT 0,
  specialization VARCHAR(150) COMMENT 'elderly care, post-op, pediatric, general, ICU',
  rating DECIMAL(2, 1) DEFAULT 0.0,
  availability_type ENUM('one-time', 'daily', 'weekly', 'all') DEFAULT 'all',
  daily_rate DECIMAL(10, 2),
  photo_url VARCHAR(500),
  phone VARCHAR(20),
  bio TEXT,
  city VARCHAR(100) DEFAULT 'Hyderabad',
  state VARCHAR(100) DEFAULT 'Telangana',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_specialization (specialization),
  INDEX idx_rating (rating)
);

-- ============================================
-- Nurse Reviews (Mock Data)
-- ============================================
CREATE TABLE IF NOT EXISTS nurse_reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nurse_id INT NOT NULL,
  reviewer_name VARCHAR(100),
  rating DECIMAL(2, 1) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (nurse_id) REFERENCES nurses(id) ON DELETE CASCADE
);

-- ============================================
-- Nurse Bookings
-- ============================================
CREATE TABLE IF NOT EXISTS nurse_bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  nurse_id INT NOT NULL,
  duration_type ENUM('one-time', 'daily', 'weekly') NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  patient_address TEXT NOT NULL,
  patient_city VARCHAR(100) DEFAULT 'Hyderabad',
  notes TEXT,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (nurse_id) REFERENCES nurses(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_status (status)
);

-- ============================================
-- Complaints / Feedback
-- ============================================
CREATE TABLE IF NOT EXISTS complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  category ENUM('bug', 'suggestion', 'complaint', 'other') NOT NULL DEFAULT 'other',
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('open', 'in_progress', 'resolved') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_category (category)
);

-- ============================================
-- Consent Forms
-- ============================================
CREATE TABLE IF NOT EXISTS consent_forms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  patient_name VARCHAR(150) NOT NULL,
  patient_age INT,
  patient_gender ENUM('male', 'female', 'other'),
  procedure_description TEXT NOT NULL,
  doctor_name VARCHAR(150),
  hospital_name VARCHAR(200),
  agreed BOOLEAN NOT NULL DEFAULT FALSE,
  consent_text TEXT COMMENT 'The full consent text the patient agreed to',
  signature_name VARCHAR(150) NOT NULL COMMENT 'Typed signature for MVP',
  ip_address VARCHAR(45),
  user_agent TEXT,
  signed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id)
);
