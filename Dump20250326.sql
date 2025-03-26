-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: dr_app
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `profilePic` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'Dr. khan','admin@gmail.com','$2b$10$uNwWCAaTBsQY08gukFoEIOVZdn7iQGjtHBXMtQDgyL4LP5n6Iv/3O','http://localhost:3000/uploads/1742519723286-profilePic.jpg');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alarms`
--

DROP TABLE IF EXISTS `alarms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alarms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int DEFAULT NULL,
  `time` time DEFAULT NULL,
  `medicine_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `patient_id` (`patient_id`),
  CONSTRAINT `patient_id` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alarms`
--

LOCK TABLES `alarms` WRITE;
/*!40000 ALTER TABLE `alarms` DISABLE KEYS */;
INSERT INTO `alarms` VALUES (1,3,'05:40:00',NULL),(2,3,'06:40:00',NULL);
/*!40000 ALTER TABLE `alarms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bills`
--

DROP TABLE IF EXISTS `bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_name` varchar(255) DEFAULT NULL,
  `medicines` json DEFAULT NULL,
  `total_bill` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bills`
--

LOCK TABLES `bills` WRITE;
/*!40000 ALTER TABLE `bills` DISABLE KEYS */;
INSERT INTO `bills` VALUES (1,'Ali Raza','[{\"name\": \"Panadol\", \"price\": 53, \"quantity\": 1, \"medicine_id\": 10}, {\"name\": \"peracetamol\", \"price\": 21, \"quantity\": 1, \"medicine_id\": 12}, {\"name\": \"Panadol\", \"price\": 9, \"quantity\": 1, \"medicine_id\": 20}]',83.00,'2025-03-20 16:26:36'),(2,'Mahak Tanveer','[{\"name\": \"Panadol\", \"price\": 53, \"quantity\": 1, \"medicine_id\": 10}, {\"name\": \"peracetamol\", \"price\": 21, \"quantity\": 1, \"medicine_id\": 12}, {\"name\": \"amoxil\", \"price\": 100, \"quantity\": 2, \"medicine_id\": 21}, {\"name\": \"arthromycine\", \"price\": 80, \"quantity\": 2, \"medicine_id\": 22}]',434.00,'2025-03-21 00:37:26'),(3,'Malik Aftab','[{\"name\": \"Panadol\", \"price\": 53, \"quantity\": 4, \"medicine_id\": 10}, {\"name\": \"peracetamol\", \"price\": 21, \"quantity\": 2, \"medicine_id\": 12}, {\"name\": \"amoxil\", \"price\": 100, \"quantity\": 2, \"medicine_id\": 21}]',454.00,'2025-03-21 01:14:28'),(4,'abdul rehman','[{\"name\": \"peracetamol\", \"price\": 21, \"quantity\": 1, \"medicine_id\": 12}, {\"name\": \"amoxil\", \"price\": 100, \"quantity\": 2, \"medicine_id\": 21}, {\"name\": \"arthromycine\", \"price\": 80, \"quantity\": 1, \"medicine_id\": 22}]',301.00,'2025-03-24 04:40:10'),(5,'aftab','[{\"name\": \"peracetamol\", \"price\": 21, \"quantity\": 4, \"medicine_id\": 12}, {\"name\": \"amoxil\", \"price\": 100, \"quantity\": 2, \"medicine_id\": 21}, {\"name\": \"arthromycine\", \"price\": 80, \"quantity\": 1, \"medicine_id\": 22}]',364.00,'2025-03-24 07:01:23');
/*!40000 ALTER TABLE `bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `book_appointment2`
--

DROP TABLE IF EXISTS `book_appointment2`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book_appointment2` (
  `appointment_id` int NOT NULL AUTO_INCREMENT,
  `ptnt_name` varchar(100) NOT NULL,
  `ptnt_phone` varchar(15) NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `appointment_service` enum('general','specialist','course') NOT NULL,
  `appointment_shift` enum('morning','afternoon') NOT NULL,
  `request` varchar(100) DEFAULT NULL,
  `status` varchar(45) DEFAULT 'Ongoing',
  `patient_id` int DEFAULT NULL,
  PRIMARY KEY (`appointment_id`),
  KEY `fk_patient_appointment` (`patient_id`),
  CONSTRAINT `fk_patient_appointment` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book_appointment2`
--

LOCK TABLES `book_appointment2` WRITE;
/*!40000 ALTER TABLE `book_appointment2` DISABLE KEYS */;
INSERT INTO `book_appointment2` VALUES (1,'Ali Raza','03095652004','2025-03-21','09:17:00','general','morning',NULL,'Completed',1),(3,'Mahak Tanveer','03095652005','2025-03-22','09:36:00','general','morning',NULL,'Completed',3),(4,'Malik Aftab','03095652004','2025-03-22','09:12:00','general','morning',NULL,'Completed',4),(10,'Abdul rehman','03095652005','2025-03-24','15:00:00','general','afternoon',NULL,'Completed',5);
/*!40000 ALTER TABLE `book_appointment2` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delay_appointment`
--

DROP TABLE IF EXISTS `delay_appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delay_appointment` (
  `id_delay_appointment` int NOT NULL AUTO_INCREMENT,
  `delayReason` text NOT NULL,
  `delayTime` int NOT NULL,
  `delayTodayDate` date NOT NULL DEFAULT (curdate()),
  `appointment_id` int NOT NULL,
  PRIMARY KEY (`id_delay_appointment`),
  KEY `fk_appointment` (`appointment_id`),
  CONSTRAINT `fk_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `book_appointment2` (`appointment_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delay_appointment`
--

LOCK TABLES `delay_appointment` WRITE;
/*!40000 ALTER TABLE `delay_appointment` DISABLE KEYS */;
INSERT INTO `delay_appointment` VALUES (4,'Aftab in danger',15,'2025-03-24',10);
/*!40000 ALTER TABLE `delay_appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `disease_cases`
--

DROP TABLE IF EXISTS `disease_cases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `disease_cases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `disease_name` varchar(100) NOT NULL,
  `reported_cases` int NOT NULL DEFAULT '1',
  `report_date` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_disease` (`disease_name`,`report_date`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `disease_cases`
--

LOCK TABLES `disease_cases` WRITE;
/*!40000 ALTER TABLE `disease_cases` DISABLE KEYS */;
INSERT INTO `disease_cases` VALUES (1,'Fever',6,'2025-03-23'),(17,'BACK PAIN',2,'2025-03-23'),(18,'BLOOD IN THE URINE',2,'2025-03-23'),(19,'CONSTIPATION',2,'2025-03-23'),(20,'Stomach ache',2,'2025-03-23'),(21,'DIARRHEA',2,'2025-03-23'),(22,'FEVER IN CHILDREN',2,'2025-03-23'),(23,'ANXIETY',2,'2025-03-23'),(24,'Breast Pain',2,'2025-03-23'),(25,'DIARRHEA IN CHILDREN',2,'2025-03-23'),(26,'COUGHING IN CHILDREN',2,'2025-03-23'),(27,'Ear Pain In Children',2,'2025-03-23'),(28,'PAIN IN THE ANKLES OR FEET',2,'2025-03-23'),(29,'RECURRING ABDOMINAL PAIN',2,'2025-03-23'),(30,'pain disorder',2,'2025-03-23'),(42,'Hypersexuality',2,'2025-03-23'),(43,'Forgetting',2,'2025-03-23'),(44,'Stammering',2,'2025-03-23'),(45,'Cough',2,'2025-03-23'),(46,'STRESS',2,'2025-03-23'),(47,'Lack of Concentration',2,'2025-03-23'),(48,'Schizophrenia',2,'2025-03-23'),(49,'VOMITING OR NAUSEA IN CHILDREN',2,'2025-03-23'),(50,'Overthinking',2,'2025-03-23'),(51,'Flu',6,'2025-03-23'),(52,'Hapatitous',8,'2025-03-23'),(53,'Malarya',12,'2025-03-23'),(54,'Mental Disorder',2,'2025-03-23'),(55,'Alzhymer',2,'2025-03-23'),(56,'Cheonical Cough',4,'2025-03-23'),(57,'Hypertention',8,'2025-03-23'),(58,'Fracture',9,'2025-03-23'),(59,'Heart Problem',5,'2025-03-23'),(60,'Fever',1,'2025-03-24');
/*!40000 ALTER TABLE `disease_cases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicines`
--

DROP TABLE IF EXISTS `medicines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicines` (
  `medicine_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `price` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`medicine_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicines`
--

LOCK TABLES `medicines` WRITE;
/*!40000 ALTER TABLE `medicines` DISABLE KEYS */;
INSERT INTO `medicines` VALUES (12,'peracetamol',21,81),(21,'amoxil',100,58),(22,'arthromycine',80,85),(24,'cycline',900,8),(28,'kh',3,3);
/*!40000 ALTER TABLE `medicines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `patient_id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(100) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `lastName` varchar(45) DEFAULT NULL,
  `contactNumber` varchar(45) DEFAULT NULL,
  `profilePic` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`patient_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
INSERT INTO `patients` VALUES (1,'Ali Raza','ali.razakhanskt@gmail.com','$2b$10$cAZXqQ6Wcd6z02NLGYZtIOH4nHKAKl10tlitVJ4iFXdPLDDl5dph.',NULL,NULL,NULL),(2,'huzaifa','huzaifa@gmail.com','$2b$10$79AdoY/JOd3W4uBhOikWI.SsJxeLtx1cnyiMyYrZiT0nvIXuGHLr2',NULL,NULL,NULL),(3,'Mahak Tanveer','mahak@gmail.com','$2b$10$pHO6hbGBP1Y35usng6//7.heoVTh2iqLy6sHYwX1vEqMzvBr1rgXu','Tanveer','03095652005','http://localhost:3000/uploads/1742517053352-profilePic.jpg'),(4,'Malik Aftab','aftab@gmail.com','$2b$10$e7RLdOz/panpMhIb1gOtXOSYktKdVeAxZFjGvvBy1PB58CR6woPty','Malik','03095652004','http://localhost:3000/uploads/1742519245843-Capture.JPG'),(5,'abdul rehman','abdulrehman@gmail.com','$2b$10$t.oChBJ3Q767ABFjnXutouiXfn/I/OlipXHZ/ByD7todV1tdEOpOm','Ilyas','03095652005','http://localhost:3000/uploads/1742789399802-ALI_9974[original].jpg');
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescriptions`
--

DROP TABLE IF EXISTS `prescriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescriptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `appointment_id` int DEFAULT NULL,
  `disease_name` varchar(255) DEFAULT NULL,
  `medicine_name` varchar(255) DEFAULT NULL,
  `dose` varchar(255) DEFAULT NULL,
  `frequency` varchar(255) DEFAULT NULL,
  `duration` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_prescription_appointment` (`appointment_id`),
  CONSTRAINT `fk_prescription_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `book_appointment2` (`appointment_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescriptions`
--

LOCK TABLES `prescriptions` WRITE;
/*!40000 ALTER TABLE `prescriptions` DISABLE KEYS */;
INSERT INTO `prescriptions` VALUES (1,1,'Fever','Panadol','9mg','1+1','2 week'),(2,1,'Fever','Panadol mesdicnie 1','9mg','2 + 1','3 week'),(3,3,'Fever','Panadol','40 mg','1+1','2 week'),(4,3,'Fever','paracetamol','60 mg','1+1 +1','3 week'),(5,4,'Fever','Panadol','30 mg','1+1','2 week'),(6,4,'Fever','peracetamol','40 mg','2 + 1','4 year'),(10,10,'Fever','Panadol','6 mg','1+1','2 week'),(11,10,'Fever','Panadol mesdicnie 1','9mg','2','3 month');
/*!40000 ALTER TABLE `prescriptions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-26 11:58:34
