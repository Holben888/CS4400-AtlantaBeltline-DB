-- MySQL dump 10.13  Distrib 8.0.15, for osx10.14 (x86_64)
--
-- Host: localhost    Database: 
-- ------------------------------------------------------
-- Server version	8.0.15

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8mb4 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!50606 SET @OLD_INNODB_STATS_AUTO_RECALC=@@INNODB_STATS_AUTO_RECALC */;
/*!50606 SET GLOBAL INNODB_STATS_AUTO_RECALC=OFF */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `Phase3AtlantaBeltline` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `Phase3AtlantaBeltline`;

--
-- Table structure for table `Employee`
--

DROP TABLE IF EXISTS `Employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Employee` (
  `Username` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `EmployeeID` int(11) NOT NULL AUTO_INCREMENT,
  `Phone` char(10) COLLATE utf8mb4_general_ci NOT NULL,
  `EmployeeAddress` varchar(64) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `EmployeeCity` varchar(32) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `EmployeeState` varchar(12) COLLATE utf8mb4_general_ci NOT NULL,
  `EmployeeZipcode` char(5) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `isAdmin` bit(1) NOT NULL,
  `isMngr` bit(1) NOT NULL,
  `isStaff` bit(1) NOT NULL,
  PRIMARY KEY (`EmployeeID`),
  KEY `Username` (`Username`),
  CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`Username`) REFERENCES `user` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Employee`
--

LOCK TABLES `Employee` WRITE;
/*!40000 ALTER TABLE `Employee` DISABLE KEYS */;
INSERT INTO `Employee` VALUES ('james.smith',1,'4043721234','123 East Main Street','Rochester','NY','14604',_binary '',_binary '\0',_binary '\0'),('michael.smith',2,'4043726789','350 Ferst Drive','Atlanta','GA','30332',_binary '\0',_binary '\0',_binary ''),('robert.smith',3,'1234567890','123 East Main Street','Columbus','OH','43215',_binary '\0',_binary '\0',_binary ''),('maria.garcia',4,'7890123456','123 East Main Street','Richland','PA','17987',_binary '\0',_binary '',_binary '\0'),('david.smith',5,'5124776435','350 Ferst Drive','Atlanta','GA','30332',_binary '\0',_binary '',_binary '\0'),('manager1',6,'8045126767','123 East Main Street','Rochester','NY','14604',_binary '\0',_binary '',_binary '\0'),('manager2',7,'9876543210','123 East Main Street','Rochester','NY','14604',_binary '\0',_binary '',_binary '\0'),('manager3',8,'5432167890','350 Ferst Drive','Atlanta','GA','30332',_binary '\0',_binary '',_binary '\0'),('manager4',9,'8053467565','123 East Main Street','Columbus','OH','43215',_binary '\0',_binary '',_binary '\0'),('manager5',10,'8031446782','801 Atlantic Drive','Atlanta','GA','30332',_binary '\0',_binary '',_binary '\0'),('staff1',11,'8024456765','266 Ferst Drive Northwest','Atlanta','GA','30332',_binary '\0',_binary '\0',_binary ''),('staff2',12,'8888888888','266 Ferst Drive Northwest','Atlanta','GA','30332',_binary '\0',_binary '\0',_binary ''),('staff3',13,'3333333333','801 Atlantic Drive','Atlanta','GA','30332',_binary '\0',_binary '\0',_binary '');
/*!40000 ALTER TABLE `Employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Event`
--

DROP TABLE IF EXISTS `Event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Event` (
  `EventName` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `StartDate` date NOT NULL,
  `SiteName` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `EndDate` date NOT NULL,
  `Price` decimal(7,2) NOT NULL,
  `Capacity` int(11) NOT NULL,
  `MinStaffRequired` int(11) DEFAULT NULL,
  `Description` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`SiteName`,`StartDate`,`EventName`),
  CONSTRAINT `event_ibfk_1` FOREIGN KEY (`SiteName`) REFERENCES `site` (`SiteName`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Event`
--

LOCK TABLES `Event` WRITE;
/*!40000 ALTER TABLE `Event` DISABLE KEYS */;
INSERT INTO `Event` VALUES ('Official Atlanta BeltLine Bike T','2019-02-09','Atlanta BeltLine Center','2019-02-14',5.00,5,1,'\"\"'),('Eastside Trail','2019-02-13','Historic Fourth Ward Park','2019-02-14',0.00,99999,1,'\"\"'),('Bus Tour','2019-02-01','Inman Park','2019-02-02',25.00,6,2,'\"\"'),('Private Bus Tour','2019-02-01','Inman Park','2019-02-02',40.00,4,1,'\"\"'),('Eastside Trail','2019-02-04','Inman Park','2019-02-05',0.00,99999,1,'\"\"'),('Arboretum Walking Tour','2019-02-08','Inman Park','2019-02-11',5.00,5,1,'\"\"'),('Bus Tour','2019-02-08','Inman Park','2019-02-10',25.00,6,2,'\"\"'),('Eastside Trail','2019-03-01','Inman Park','2019-03-02',0.00,99999,1,'\"\"'),('Eastside Trail','2019-02-04','Piedmont Park','2019-02-05',0.00,99999,1,'\"\"\"'),('Westside Trail','2019-02-18','Westview Cemetery','2019-02-21',0.00,99999,1,'\"\"');
/*!40000 ALTER TABLE `Event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Site`
--

DROP TABLE IF EXISTS `Site`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Site` (
  `SiteName` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `SiteZipcode` char(5) COLLATE utf8mb4_general_ci NOT NULL,
  `SiteAddress` varchar(64) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `OpenEveryday` bit(1) NOT NULL,
  `ManagerUsername` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`SiteName`),
  KEY `ManagerUsername` (`ManagerUsername`),
  CONSTRAINT `site_ibfk_1` FOREIGN KEY (`ManagerUsername`) REFERENCES `employee` (`username`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Site`
--

LOCK TABLES `Site` WRITE;
/*!40000 ALTER TABLE `Site` DISABLE KEYS */;
INSERT INTO `Site` VALUES ('Atlanta Beltline Center','30307','112 Krog Street Northeast',_binary '\0','manager3'),('Historic Fourth Ward Park','30308','680 Dallas Street Northeast',_binary '','manager4'),('Inman Park','30307','',_binary '','david.smith'),('Piedmont Park','30306','400 Park Drive Northeast',_binary '','manager2'),('Westview Cemetery','30310','1680 Westview Drive Southwest',_binary '\0','manager5');
/*!40000 ALTER TABLE `Site` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `StaffEvent`
--

DROP TABLE IF EXISTS `StaffEvent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `StaffEvent` (
  `SiteName` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `StartDate` date NOT NULL,
  `EventName` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `StaffUsername` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`SiteName`,`StartDate`,`EventName`,`StaffUsername`),
  KEY `StaffUsername` (`StaffUsername`),
  CONSTRAINT `staffevent_ibfk_1` FOREIGN KEY (`SiteName`, `StartDate`, `EventName`) REFERENCES `event` (`SiteName`, `StartDate`, `EventName`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `staffevent_ibfk_2` FOREIGN KEY (`StaffUsername`) REFERENCES `employee` (`Username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `StaffEvent`
--

LOCK TABLES `StaffEvent` WRITE;
/*!40000 ALTER TABLE `StaffEvent` DISABLE KEYS */;
/*!40000 ALTER TABLE `StaffEvent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Transit`
--

DROP TABLE IF EXISTS `Transit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Transit` (
  `TransitType` enum('Bus','MARTA','Bike') COLLATE utf8mb4_general_ci NOT NULL,
  `TransitRoute` varchar(16) COLLATE utf8mb4_general_ci NOT NULL,
  `TransitPrice` decimal(7,2) NOT NULL,
  PRIMARY KEY (`TransitType`,`TransitRoute`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Transit`
--

LOCK TABLES `Transit` WRITE;
/*!40000 ALTER TABLE `Transit` DISABLE KEYS */;
INSERT INTO `Transit` VALUES ('Bus','152',2.00),('MARTA','Blue',2.00),('Bike','Relay',1.00);
/*!40000 ALTER TABLE `Transit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TransitConnection`
--

DROP TABLE IF EXISTS `TransitConnection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `TransitConnection` (
  `SiteName` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `TransitType` enum('Bus','MARTA','Bike') COLLATE utf8mb4_general_ci NOT NULL,
  `TransitRoute` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`SiteName`,`TransitType`,`TransitRoute`),
  KEY `TransitType` (`TransitType`,`TransitRoute`),
  CONSTRAINT `transitconnection_ibfk_1` FOREIGN KEY (`TransitType`, `TransitRoute`) REFERENCES `transit` (`transittype`, `transitroute`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `transitconnection_ibfk_2` FOREIGN KEY (`SiteName`) REFERENCES `site` (`sitename`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TransitConnection`
--

LOCK TABLES `TransitConnection` WRITE;
/*!40000 ALTER TABLE `TransitConnection` DISABLE KEYS */;
INSERT INTO `TransitConnection` VALUES ('Historic Fourth Ward Park','Bus','152'),('Inman Park','Bus','152'),('Piedmont Park','Bus','152'),('Historic Fourth Ward Park','MARTA','Blue'),('Inman Park','MARTA','Blue'),('Piedmont Park','MARTA','Blue'),('Westview Cemetery','MARTA','Blue'),('Historic Fourth Ward Park','Bike','Relay'),('Piedmont Park','Bike','Relay');
/*!40000 ALTER TABLE `TransitConnection` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `User` (
  `Username` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `Password` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `Firstname` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `Lastname` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `Status` enum('Pending','Declined','Approved') COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`Username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES ('david.smith','dsmith456','David','Smith','Approved'),('james.smith','jsmith123','James','Smith','Approved'),('manager1','manager1','Manager','One','Pending'),('manager2','manager2','Manager','Two','Approved'),('manager3','manager3','Manager','Three','Approved'),('manager4','manager4','Manager','Four','Approved'),('manager5','manager5','Manager','Five','Approved'),('maria.garcia','mgarcia123','Maria','Garcia','Approved'),('maria.hernandez','mhernandez','Maria','Hernandez','Approved'),('maria.rodriguez','mrodriguez','Maria','Rodriguez','Declined'),('mary.smith','msmith789','Mary','Smith','Approved'),('michael.smith','msmith456','Michael','Smith','Approved'),('robert.smith','rsmith789','Robert ','Smith','Approved'),('staff1','staff1234','Staff','One','Approved'),('staff2','staff4567','Staff','Two','Approved'),('staff3','staff7890','Staff','Three','Approved'),('user1','user123456','User','One','Pending'),('visitor1','visitor123','Visitor','One','Approved');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserEmail`
--

DROP TABLE IF EXISTS `UserEmail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `UserEmail` (
  `Username` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `Email` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`Username`,`Email`),
  UNIQUE KEY `Email` (`Email`),
  CONSTRAINT `useremail_ibfk_1` FOREIGN KEY (`Username`) REFERENCES `user` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserEmail`
--

LOCK TABLES `UserEmail` WRITE;
/*!40000 ALTER TABLE `UserEmail` DISABLE KEYS */;
INSERT INTO `UserEmail` VALUES ('david.smith','dsmith@outlook.com'),('james.smith','jsmith@gatech.edu'),('james.smith','jsmith@gmail.com'),('james.smith','jsmith@hotmail.com'),('james.smith','jsmith@outlook.com'),('manager1','m1@beltline.com'),('manager2','m2@beltline.com'),('manager3','m3@beltline.com'),('manager4','m4@beltline.com'),('manager5','m5@beltline.com'),('mary.smith','mary@outlook.com'),('maria.garcia','mgarcia@gatech.edu'),('maria.garcia','mgarcia@yahoo.com'),('maria.hernandez','mh123@gmail.com'),('maria.hernandez','mh@gatech.edu'),('maria.rodriguez','mrodriguez@gmail.com'),('michael.smith','msmith@gmail.com'),('robert.smith','rsmith@hotmail.com'),('staff1','s1@beltline.com'),('staff2','s2@beltline.com'),('staff3','s3@beltline.com'),('user1','u1@beltline.com'),('visitor1','v1@beltline.com');
/*!40000 ALTER TABLE `UserEmail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserTransitTaken`
--

DROP TABLE IF EXISTS `UserTransitTaken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `UserTransitTaken` (
  `Username` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `TransitType` enum('Bus','MARTA','Bike') COLLATE utf8mb4_general_ci NOT NULL,
  `TransitRoute` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `TransitDate` date NOT NULL,
  PRIMARY KEY (`Username`,`TransitType`,`TransitRoute`,`TransitDate`),
  KEY `TransitType` (`TransitType`,`TransitRoute`),
  CONSTRAINT `usertransittaken_ibfk_1` FOREIGN KEY (`Username`) REFERENCES `user` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `usertransittaken_ibfk_2` FOREIGN KEY (`TransitType`, `TransitRoute`) REFERENCES `transit` (`transittype`, `transitroute`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserTransitTaken`
--

LOCK TABLES `UserTransitTaken` WRITE;
/*!40000 ALTER TABLE `UserTransitTaken` DISABLE KEYS */;
INSERT INTO `UserTransitTaken` VALUES ('manager2','Bus','152','2019-03-20'),('maria.hernandez','Bus','152','2019-03-20'),('maria.hernandez','Bus','152','2019-03-22'),('manager2','MARTA','Blue','2019-03-20'),('manager2','MARTA','Blue','2019-03-21'),('manager2','MARTA','Blue','2019-03-22'),('visitor1','MARTA','Blue','2019-03-21'),('manager3','Bike','Relay','2019-03-20'),('maria.hernandez','Bike','Relay','2019-03-20'),('mary.smith','Bike','Relay','2019-03-23');
/*!40000 ALTER TABLE `UserTransitTaken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VisitEvent`
--

DROP TABLE IF EXISTS `VisitEvent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `VisitEvent` (
  `Username` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `EventName` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `StartDate` date NOT NULL,
  `SiteName` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `VisitEventDate` date NOT NULL,
  PRIMARY KEY (`Username`,`SiteName`,`StartDate`,`EventName`,`VisitEventDate`),
  KEY `SiteName` (`SiteName`,`StartDate`,`EventName`),
  CONSTRAINT `visitevent_ibfk_1` FOREIGN KEY (`Username`) REFERENCES `user` (`Username`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `visitevent_ibfk_2` FOREIGN KEY (`SiteName`, `StartDate`, `EventName`) REFERENCES `event` (`SiteName`, `StartDate`, `EventName`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VisitEvent`
--

LOCK TABLES `VisitEvent` WRITE;
/*!40000 ALTER TABLE `VisitEvent` DISABLE KEYS */;
INSERT INTO `VisitEvent` VALUES ('mary.smith','Official Atlanta BeltLine Bike T','2019-02-09','Atlanta BeltLine Center','2019-02-10'),('visitor1','Official Atlanta BeltLine Bike T','2019-02-09','Atlanta BeltLine Center','2019-02-10'),('mary.smith','Eastside Trail','2019-02-13','Historic Fourth Ward Park','2019-02-13'),('mary.smith','Eastside Trail','2019-02-13','Historic Fourth Ward Park','2019-02-14'),('visitor1','Eastside Trail','2019-02-13','Historic Fourth Ward Park','2019-02-14'),('manager2','Bus Tour','2019-02-01','Inman Park','2019-02-02'),('manager4','Bus Tour','2019-02-01','Inman Park','2019-02-01'),('manager5','Bus Tour','2019-02-01','Inman Park','2019-02-02'),('maria.garcia','Bus Tour','2019-02-01','Inman Park','2019-02-02'),('mary.smith','Bus Tour','2019-02-01','Inman Park','2019-02-01'),('staff2','Bus Tour','2019-02-01','Inman Park','2019-02-02'),('mary.smith','Private Bus Tour','2019-02-01','Inman Park','2019-02-01'),('mary.smith','Private Bus Tour','2019-02-01','Inman Park','2019-02-02'),('mary.smith','Arboretum Walking Tour','2019-02-08','Inman Park','2019-02-10'),('mary.smith','Eastside Trail','2019-02-04','Piedmont Park','2019-02-04'),('mary.smith','Westside Trail','2019-02-18','Westview Cemetery','2019-02-19'),('visitor1','Westside Trail','2019-02-18','Westview Cemetery','2019-02-19');
/*!40000 ALTER TABLE `VisitEvent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Visitor`
--

DROP TABLE IF EXISTS `Visitor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `Visitor` (
  `Username` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`Username`),
  CONSTRAINT `visitor_ibfk_1` FOREIGN KEY (`Username`) REFERENCES `user` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Visitor`
--

LOCK TABLES `Visitor` WRITE;
/*!40000 ALTER TABLE `Visitor` DISABLE KEYS */;
INSERT INTO `Visitor` VALUES ('manager2'),('manager4'),('manager5'),('maria.garcia'),('maria.rodriguez'),('mary.smith'),('michael.smith'),('staff2'),('staff3'),('visitor1');
/*!40000 ALTER TABLE `Visitor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VisitSite`
--

DROP TABLE IF EXISTS `VisitSite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `VisitSite` (
  `Username` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `SiteName` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `VisitSiteDate` date NOT NULL,
  PRIMARY KEY (`Username`,`SiteName`,`VisitSiteDate`),
  KEY `SiteName` (`SiteName`),
  CONSTRAINT `visitsite_ibfk_1` FOREIGN KEY (`Username`) REFERENCES `user` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `visitsite_ibfk_2` FOREIGN KEY (`SiteName`) REFERENCES `site` (`sitename`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VisitSite`
--

LOCK TABLES `VisitSite` WRITE;
/*!40000 ALTER TABLE `VisitSite` DISABLE KEYS */;
INSERT INTO `VisitSite` VALUES ('mary.smith','Atlanta Beltline Center','2019-02-01'),('mary.smith','Atlanta Beltline Center','2019-02-10'),('visitor1','Atlanta Beltline Center','2019-02-09'),('visitor1','Atlanta Beltline Center','2019-02-13'),('mary.smith','Historic Fourth Ward Park','2019-02-02'),('visitor1','Historic Fourth Ward Park','2019-02-11'),('mary.smith','Inman Park','2019-02-01'),('mary.smith','Inman Park','2019-02-02'),('mary.smith','Inman Park','2019-02-03'),('visitor1','Inman Park','2019-02-01'),('mary.smith','Piedmont Park','2019-02-02'),('visitor1','Piedmont Park','2019-02-01'),('visitor1','Piedmont Park','2019-02-11'),('visitor1','Westview Cemetery','2019-02-06');
/*!40000 ALTER TABLE `VisitSite` ENABLE KEYS */;
UNLOCK TABLES;