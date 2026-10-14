-- ========================================================
-- ORBIT-I Website Database Schema for MySQL (Hostinger Ready)
-- ========================================================

CREATE DATABASE IF NOT EXISTS `orbit_website` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `orbit_website`;

-- 1. Client & User Information
CREATE TABLE IF NOT EXISTS `client_information` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `company` VARCHAR(255) DEFAULT NULL,
  `approved` TINYINT(1) NOT NULL DEFAULT 0,
  `role` VARCHAR(20) NOT NULL DEFAULT 'CLIENT',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_client_email` (`email`),
  INDEX `idx_client_approved` (`approved`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Project Details
CREATE TABLE IF NOT EXISTS `project_details` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `project_title` VARCHAR(255) NOT NULL,
  `project_description` TEXT NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'PLANING',
  `start_date` DATE DEFAULT NULL,
  `deadline` DATE DEFAULT NULL,
  `compelted_at` DATE DEFAULT NULL,
  `progress_percentage` INT NOT NULL DEFAULT 0,
  `client_id` BIGINT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_project_client` (`client_id`),
  CONSTRAINT `fk_project_client` FOREIGN KEY (`client_id`) REFERENCES `client_information` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Project Milestones
CREATE TABLE IF NOT EXISTS `project_milestones` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `sequence_number` INT DEFAULT 1,
  `due_date` DATE DEFAULT NULL,
  `completion_date` DATE DEFAULT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  `project_id` BIGINT NOT NULL,
  `created_at` DATE DEFAULT (CURRENT_DATE),
  PRIMARY KEY (`id`),
  INDEX `idx_milestone_project` (`project_id`),
  CONSTRAINT `fk_milestone_project` FOREIGN KEY (`project_id`) REFERENCES `project_details` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Intern Certificates
CREATE TABLE IF NOT EXISTS `intern_certificates` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(255) NOT NULL,
  `department` VARCHAR(255) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `duration` VARCHAR(100) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'COMPLETED',
  `certificate_code` VARCHAR(255) NOT NULL UNIQUE,
  `issued_by` VARCHAR(255) NOT NULL DEFAULT 'ORBIT-I Private Limited',
  `issued_at` DATE DEFAULT (CURRENT_DATE),
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_certificate_code` (`certificate_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Contact Inquiries
CREATE TABLE IF NOT EXISTS `contact_inquiries` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `company` VARCHAR(255) DEFAULT NULL,
  `service` VARCHAR(255) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'NEW',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_inquiry_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional default admin user seed:
-- Email: admin@orbit-i.tech
-- Default Password: AdminPassword123! (hashed using bcrypt)
-- Uncomment below if you want an initial admin user created immediately:
-- INSERT INTO `client_information` (`name`, `email`, `password`, `approved`, `role`)
-- VALUES ('ORBIT-I Admin', 'admin@orbit-i.tech', '$2a$10$7vN3gWjHsmQvL0R5uVl8ee2mZc7iFkKp9iR2e.t1kI1m8dJ4FmQ0e', 1, 'ADMIN')
-- ON DUPLICATE KEY UPDATE `approved` = 1, `role` = 'ADMIN';
