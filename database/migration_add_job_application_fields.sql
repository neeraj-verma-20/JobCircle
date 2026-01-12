-- Migration: Add job application fields to offer_submissions table
-- Run this ONLY if you already have the database created with the old schema
-- If you're creating a fresh database, use schema.sql which already includes these fields

USE dealsDB;

-- Add new columns for job applications (only if they don't exist)
-- Note: MySQL doesn't support IF NOT EXISTS for ALTER TABLE, so run this carefully
-- If you get "Duplicate column" errors, those columns already exist and you can ignore them

ALTER TABLE offer_submissions 
ADD COLUMN email VARCHAR(255) AFTER phoneNumber,
ADD COLUMN address TEXT AFTER email,
ADD COLUMN experience VARCHAR(100) AFTER address,
ADD COLUMN technicalKnowledge TEXT AFTER experience,
ADD COLUMN jobId INT AFTER id,
ADD COLUMN phoneVerified BOOLEAN DEFAULT FALSE AFTER phoneNumber;

-- Add index for jobId (only if it doesn't exist)
-- If you get "Duplicate key name" error, the index already exists
ALTER TABLE offer_submissions 
ADD INDEX idx_jobId (jobId);
