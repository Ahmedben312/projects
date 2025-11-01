-- E-Commerce Shop - Database Reset (Development Only)
-- WARNING: This will delete all data!

DROP DATABASE IF EXISTS `ecommerce_shop`;
CREATE DATABASE `ecommerce_shop` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ecommerce_shop`;

-- Then run the full setup
SOURCE sql/full_setup.sql;