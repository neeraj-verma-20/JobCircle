-- MySQL Database Schema for JobCircle/OfferBae
-- Run this script to create the database and all tables

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS dealsDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE dealsDB;

-- Table: offers
CREATE TABLE IF NOT EXISTS offers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image VARCHAR(500),
  mapLink VARCHAR(500),
  category VARCHAR(100),
  city VARCHAR(100),
  area VARCHAR(100),
  expiryDate DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  createdBy VARCHAR(50) DEFAULT 'admin',
  INDEX idx_city (city),
  INDEX idx_category (category),
  INDEX idx_expiryDate (expiryDate),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: offer_submissions (Job Applications)
CREATE TABLE IF NOT EXISTS offer_submissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  jobId INT,
  title VARCHAR(255),
  description TEXT,
  category VARCHAR(100),
  ownerName VARCHAR(100),
  phoneNumber VARCHAR(20),
  phoneVerified BOOLEAN DEFAULT FALSE,
  email VARCHAR(255),
  address TEXT,
  experience VARCHAR(100),
  technicalKnowledge TEXT,
  city VARCHAR(100),
  area VARCHAR(100),
  mapLink VARCHAR(500),
  socialLink VARCHAR(500),
  expiryDate DATETIME,
  imageUrl VARCHAR(500),
  image VARCHAR(500),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt),
  INDEX idx_jobId (jobId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: locations
CREATE TABLE IF NOT EXISTS locations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  city VARCHAR(100) NOT NULL UNIQUE,
  areas JSON NOT NULL,
  status ENUM('enabled', 'disabled') DEFAULT 'enabled',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: banners
CREATE TABLE IF NOT EXISTS banners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  description TEXT,
  imageUrl VARCHAR(500) NOT NULL,
  link VARCHAR(500),
  openInNewTab BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  `order` INT DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active (active),
  INDEX idx_order (`order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: siteSettings
CREATE TABLE IF NOT EXISTS siteSettings (
  id VARCHAR(50) PRIMARY KEY,
  settings JSON NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: ai_settings
CREATE TABLE IF NOT EXISTS ai_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type VARCHAR(50) NOT NULL UNIQUE,
  imageGeneration BOOLEAN DEFAULT TRUE,
  titleGeneration BOOLEAN DEFAULT TRUE,
  descriptionGeneration BOOLEAN DEFAULT TRUE,
  enabled BOOLEAN DEFAULT TRUE,
  dailyLimit INT DEFAULT 100,
  monthlyLimit INT DEFAULT 1000,
  currentDailyUsage INT DEFAULT 0,
  currentMonthlyUsage INT DEFAULT 0,
  lastResetDate DATE,
  lastMonthReset VARCHAR(7),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
