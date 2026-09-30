-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: db_web
-- ------------------------------------------------------
-- Server version	9.1.0

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
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `price` decimal(6,2) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `available` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES (1,'Poulet aux curry',15.00,'image/pouket-curry.jpg',1,'2025-10-15 21:11:48'),(2,'Riz Ndolé',20.00,'image/riz-ndolè.jpg',1,'2025-10-15 21:11:48'),(3,'Brochettes de viandes',10.00,'image/14.jpg',1,'2025-10-15 21:11:48'),(4,'Sauce gombo',15.00,'image/07.jpg',1,'2025-10-15 21:11:48'),(5,'Poulet& Galettes',15.00,'image/07.jpg',1,'2025-10-28 21:21:34'),(6,'Attieké ',15.00,'image/02-2.jpg',1,'2025-10-28 21:25:04'),(7,'Riz haricots',15.00,'image/haricots-oeufs.jpg',1,'2025-10-28 21:25:46'),(8,'Emincés de poulet & haricots blancs',15.00,'image/poulet-haricots.jpg',1,'2025-10-28 21:26:59'),(9,'Poulet à la sauce moutarde',15.00,'image/poulet-sauce-moutarde.jpg',1,'2025-10-28 21:27:26'),(10,'Attieké',15.00,'image/08.jpg',1,'2025-10-28 21:28:03'),(11,'Boulettes-poulets-Spaghettis',15.00,'image/food.jpg',1,'2025-10-28 21:28:31'),(12,'Riz aux aubergines ',15.00,'image/04-1.jpg',1,'2025-10-28 21:29:00'),(13,'Jus de Fraise',5.00,'image/fraise.jpg',1,'2025-10-28 21:29:31'),(14,'Jus de raisin',5.00,'image/raisin.jpg',1,'2025-10-28 21:30:15'),(15,'Jus de coco',5.00,'image/coco.jpg',1,'2025-10-28 21:30:41'),(16,'Boisson alcoolisé à l\'orange',5.00,'image/cocktail.jpg',1,'2025-10-28 21:31:05'),(17,'Cocktail de citron et d\'orange',5.00,'image/citron.jpg',1,'2025-10-28 21:31:30'),(18,'Vodka ',45.00,'image/rhum.jpg',1,'2025-10-28 21:31:54'),(19,'Cocktail d\'orange et de cérise',5.00,'image/orange.jpg',1,'2025-10-28 21:32:18'),(20,'Cocktail alcoolisé',15.00,'image/alcool.jpg',1,'2025-10-28 21:32:42'),(21,'Cocktail Italien ',15.00,'image/cocktail_italien.jpg',1,'2025-10-28 21:33:12'),(22,'Jus de cérise',15.00,'image/ceriseee.jpg',1,'2025-10-28 21:33:49'),(23,'Cocktail de fruits de kiwi',15.00,'image/kiwi.jpg',1,'2025-10-28 21:34:13'),(24,'Mojito',15.00,'image/paradisiaque.jpg',1,'2025-10-28 21:34:44'),(25,'Tarte Aux Profiteroles Cremé',10.00,'image/tartes-aux-profiteroles.jpg',1,'2025-10-28 21:35:14'),(26,'Gateau Au cacao soupoudré au Café ',10.00,'image/gateau-cacao.jpg',1,'2025-10-28 21:35:47'),(27,'Gateau Au Chocolat Framboises',10.00,'image/gateau-chocolat-framboise.jpg',1,'2025-10-28 21:36:12'),(28,'Gateau Au chocolat-Biscuit-Raisins ',10.00,'image/gateau-chocolat-biscuit.jpg',1,'2025-10-28 21:36:41');
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `menu_id` int DEFAULT NULL,
  `additional_food` varchar(100) DEFAULT NULL,
  `quantity` int NOT NULL,
  `date_time` datetime NOT NULL,
  `address` text NOT NULL,
  `message` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('in_attesa','confermato','annullato') DEFAULT 'in_attesa',
  `payment_method` enum('cash','card') DEFAULT 'cash',
  `total_price` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `menu_id` (`menu_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (3,11,1,NULL,3,'2025-10-29 10:30:00','Via Riccardo Restano 26','','2025-10-27 23:53:09','confermato','cash',45.00),(4,12,1,NULL,2,'2025-10-29 15:30:00','corso marcellario prestinario 14','','2025-10-28 00:18:02','confermato','card',30.00),(5,12,2,NULL,2,'2025-10-29 17:05:00','corso marcellario prestinario 14','','2025-10-28 00:27:15','confermato','card',40.00),(6,11,1,'Riz Ndolé',2,'2025-12-30 12:30:00','Via Riccardo Restano 26','','2025-10-28 20:08:16','confermato','card',30.00),(7,11,1,'Riz Ndolé',3,'2025-10-30 10:15:00','Via Riccardo Restano 26','','2025-10-28 20:26:10','confermato','card',45.00),(8,13,1,'Sauce gombo',2,'2025-10-01 10:39:00','Via Riccardo Restano 26','','2025-10-31 18:16:14','confermato','card',30.00);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `num_persons` int NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (1,11,'Jorelle MENGAPTCHE','jorellemengaptche@gmail.com','3516815502',4,'2025-10-22','19:00:00','2025-10-20 18:46:17'),(2,13,'Madeleine Youmbi','madeleineyoumbi@gmail.com','3516815502',3,'2025-11-02','10:00:00','2025-10-31 18:16:49');
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullname` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `message` text NOT NULL,
  `rating` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,'Jorelle MENGAPTCHE','jorellemengaptche@gmail.com','bellissiama luogo. I piatti sono deliziosi',5,'2025-10-20 19:59:36'),(2,'Jorelle MENGAPTCHE','jorellemengaptche@gmail.com','bellissiama luogo. I piatti sono deliziosi',5,'2025-10-20 20:07:36'),(3,'Jorelle MENGAPTCHE','jorellemengaptche@gmail.com','bellissiama luogo. I piatti sono deliziosi',5,'2025-10-20 20:14:45'),(5,'keira harisson','keiraharisson@gmail.com','bello!!!',5,'2025-10-20 20:40:18'),(6,'jorelle mengaptche','jorellemengaptche@gmail.com','bellissimo risotorante',5,'2025-10-21 21:57:16');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullname` varchar(255) NOT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('client','admin') DEFAULT 'client',
  `phone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (4,'Jorelle Madeleine','jorelle@camerfood.com','$2b$10$RWQ548U15pV30XR9v1ZlyODxmYX/RUzkSpRVFR/n3FpIjJs3GHAO6','admin','3510000001'),(5,'Lucien Mbassi','lucien@camerfood.com','$2b$10$RWQ548U15pV30XR9v1ZlyODxmYX/RUzkSpRVFR/n3FpIjJs3GHAO6','admin','3510000002'),(6,'Sophie Talla','sophie@camerfood.com','$2b$10$RWQ548U15pV30XR9v1ZlyODxmYX/RUzkSpRVFR/n3FpIjJs3GHAO6','admin','3510000003'),(7,'David Nono','david@camerfood.com','$2b$10$RWQ548U15pV30XR9v1ZlyODxmYX/RUzkSpRVFR/n3FpIjJs3GHAO6','admin','3510000004'),(8,'Aline Tchoua','aline@camerfood.com','$2b$10$RWQ548U15pV30XR9v1ZlyODxmYX/RUzkSpRVFR/n3FpIjJs3GHAO6','admin','3510000005'),(9,'Brice Kamdem','brice@camerfood.com','$2b$10$RWQ548U15pV30XR9v1ZlyODxmYX/RUzkSpRVFR/n3FpIjJs3GHAO6','admin','3510000006'),(11,'Jorelle MENGAPTCHE','jorellemengaptche@gmail.com','$2b$10$IVNX2AMK.P5ki.HdREpwoOhjCigmEYPAzp/vJOJCRTFf12/tf6uH.','client','3516815502'),(12,'Tagne Yacinthe Clovis','tayc@gmail.com','$2b$10$QahNqKWOkgzNBRaiHq50Gut0Fkokc8ytyub4SD4q/CVaXuYaAmd9u','client','3510034560'),(13,'Madeleine Youmbi','madeleineyoumbi@gmail.com','$2b$10$iyhk8ZA7vRjjeQ01y5P1gOzA7Va.PEMIzB01kJ4eupZqrtEe02HKm','client','+393516815502');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-31 20:49:50
