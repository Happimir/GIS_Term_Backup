SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';


-- -----------------------------------------------------
-- Schema UserData
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `gis_term_dynamic` DEFAULT CHARACTER SET utf8 collate utf8_unicode_ci  ;
USE `GIS_TERM_dynamic`;

-- -----------------------------------------------------
-- Table `UserData`.`Tweet`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `gis_term_dynamic`.`Tweet` (
  `id` INT NOT NULL auto_increment KEY,
  `region` varchar(160) NOT NULL,
  `category` varchar(160) NULL,
  `tweet` VARCHAR(160) NOT NULL,
  `sentiment` float NULL,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC)
  )ENGINE = InnoDB;