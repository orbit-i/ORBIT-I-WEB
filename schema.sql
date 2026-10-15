-- ========================================================
-- ORBIT-I Website Database Schema for MySQL (Hostinger Ready)
-- High-Concurrency & High-Speed Indexing Engine (10,000+ req/s)
-- ========================================================

-- 1. Client & SuperAdmin User Information
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
  INDEX `idx_client_approved` (`approved`),
  INDEX `idx_client_email_role` (`email`, `role`),
  INDEX `idx_client_role_approved` (`role`, `approved`)
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
  INDEX `idx_project_client_status` (`client_id`, `status`),
  INDEX `idx_project_created` (`created_at` DESC),
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
  INDEX `idx_milestone_project_seq` (`project_id`, `sequence_number`),
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
  INDEX `idx_certificate_code` (`certificate_code`),
  INDEX `idx_certs_code_status` (`certificate_code`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Contact Inquiries & Direct Commercial Leads
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
  INDEX `idx_inquiry_status` (`status`),
  INDEX `idx_inquiry_created_status` (`created_at` DESC, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. CMS Pages (Content Management System)
CREATE TABLE IF NOT EXISTS `cms_pages` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `content_html` LONGTEXT NOT NULL,
  `excerpt` TEXT DEFAULT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'published',
  `meta_title` VARCHAR(255) DEFAULT NULL,
  `meta_description` TEXT DEFAULT NULL,
  `keywords` VARCHAR(255) DEFAULT NULL,
  `schema_type` VARCHAR(100) DEFAULT 'WebPage',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_cms_slug` (`slug`),
  INDEX `idx_cms_status` (`status`),
  INDEX `idx_cms_slug_status` (`slug`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Blog & Technical Content Articles
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `excerpt` TEXT DEFAULT NULL,
  `content` LONGTEXT NOT NULL,
  `category` VARCHAR(100) NOT NULL DEFAULT 'Engineering',
  `tags` VARCHAR(255) DEFAULT NULL,
  `author` VARCHAR(100) NOT NULL DEFAULT 'ORBIT-I Editorial',
  `featured_image` VARCHAR(500) DEFAULT NULL,
  `read_time` VARCHAR(50) DEFAULT '5 min read',
  `status` VARCHAR(50) NOT NULL DEFAULT 'published',
  `seo_title` VARCHAR(255) DEFAULT NULL,
  `seo_description` TEXT DEFAULT NULL,
  `focus_keyword` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_blog_slug` (`slug`),
  INDEX `idx_blog_category` (`category`),
  INDEX `idx_blog_status` (`status`),
  INDEX `idx_blog_slug_status` (`slug`, `status`),
  INDEX `idx_blog_category_status` (`category`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Careers & Jobs Postings
CREATE TABLE IF NOT EXISTS `careers_jobs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `category` VARCHAR(50) NOT NULL DEFAULT 'internship',
  `location` VARCHAR(255) NOT NULL DEFAULT 'Remote',
  `type` VARCHAR(50) NOT NULL DEFAULT 'Internship',
  `mode` VARCHAR(50) NOT NULL DEFAULT '100% Remote',
  `duration` VARCHAR(100) DEFAULT '2 Months',
  `openings` VARCHAR(50) DEFAULT '3 Seats',
  `compensation` VARCHAR(255) DEFAULT 'Unpaid (Verifiable Certificate & LOR)',
  `experience` VARCHAR(100) DEFAULT 'Fresh / Students',
  `summary` TEXT NOT NULL,
  `requirements` TEXT DEFAULT NULL,
  `responsibilities` TEXT DEFAULT NULL,
  `perks` TEXT DEFAULT NULL,
  `is_open` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_career_slug` (`slug`),
  INDEX `idx_career_open` (`is_open`),
  INDEX `idx_career_slug_open` (`slug`, `is_open`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Team Members & Executive Profiles
CREATE TABLE IF NOT EXISTS `team_members` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `designation` VARCHAR(255) NOT NULL,
  `department` VARCHAR(100) NOT NULL DEFAULT 'Leadership',
  `bio` TEXT DEFAULT NULL,
  `avatar_url` VARCHAR(500) DEFAULT NULL,
  `skills` VARCHAR(500) DEFAULT NULL,
  `linkedin_url` VARCHAR(255) DEFAULT NULL,
  `github_url` VARCHAR(255) DEFAULT NULL,
  `order_index` INT DEFAULT 0,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_team_department` (`department`),
  INDEX `idx_team_published` (`is_published`),
  INDEX `idx_team_published_order` (`is_published`, `order_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Testimonials & Client Reviews
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `client_name` VARCHAR(255) NOT NULL,
  `designation` VARCHAR(255) DEFAULT NULL,
  `company` VARCHAR(255) DEFAULT NULL,
  `content` TEXT NOT NULL,
  `rating` INT DEFAULT 5,
  `avatar_url` VARCHAR(500) DEFAULT NULL,
  `is_published` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_testimonial_published` (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Security Threat Audit Logs (ORBIT-I Cyber Shield Telemetry)
CREATE TABLE IF NOT EXISTS `security_audit_logs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `ip` VARCHAR(50) NOT NULL,
  `attack_type` VARCHAR(100) NOT NULL,
  `endpoint` VARCHAR(255) NOT NULL,
  `method` VARCHAR(10) NOT NULL,
  `payload_snippet` TEXT DEFAULT NULL,
  `defense_action` VARCHAR(100) NOT NULL DEFAULT 'BLOCKED_AND_RESTRICTED',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_sec_ip` (`ip`),
  INDEX `idx_sec_type` (`attack_type`),
  INDEX `idx_sec_created` (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
