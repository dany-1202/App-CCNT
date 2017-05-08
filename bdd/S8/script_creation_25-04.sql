-- phpMyAdmin SQL Dump
-- version 4.6.6
-- https://www.phpmyadmin.net/
--
-- Client :  h2mysql17
-- Généré le :  Mar 25 Avril 2017 à 19:24
-- Version du serveur :  5.6.33-log
-- Version de PHP :  7.0.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `nvfr_ctrl_ccnt`
--

-- --------------------------------------------------------

--
-- Structure de la table `ccn_absence`
--

CREATE TABLE `ccn_absence` (
  `abs_id` int(11) NOT NULL,
  `abs_nom` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_absence`
--

INSERT INTO `ccn_absence` (`abs_id`, `abs_nom`) VALUES
(1, 'Maladie'),
(2, 'Congé'),
(3, 'Vacances'),
(4, 'Militaire'),
(5, 'Formation'),
(6, 'Maternité'),
(7, 'Décès'),
(8, 'Déménagement'),
(9, 'Autre'),
(10, 'Paternité'),
(11, 'Congé sans solde'),
(12, 'Récupération'),
(13, 'Accident');

-- --------------------------------------------------------

--
-- Structure de la table `ccn_appartient`
--

CREATE TABLE `ccn_appartient` (
  `app_eta_id` int(11) NOT NULL,
  `app_per_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_appartient`
--

INSERT INTO `ccn_appartient` (`app_eta_id`, `app_per_id`) VALUES
(1, 1),
(39, 2),
(1, 3),
(50, 7),
(38, 8),
(47, 14),
(41, 17),
(42, 17),
(43, 17),
(44, 17),
(45, 17),
(46, 22),
(48, 25),
(49, 26),
(51, 32),
(53, 35),
(54, 43),
(55, 44),
(56, 46),
(57, 48);

-- --------------------------------------------------------

--
-- Structure de la table `ccn_contient`
--

CREATE TABLE `ccn_contient` (
  `con_hpr_id` int(11) NOT NULL,
  `con_jou_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_contient`
--

INSERT INTO `ccn_contient` (`con_hpr_id`, `con_jou_id`) VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 4),
(2, 5),
(3, 6),
(2, 7),
(3, 8),
(2, 9),
(3, 10),
(3, 11),
(3, 12),
(7, 17),
(6, 18),
(7, 20),
(6, 19),
(6, 21),
(8, 22),
(8, 23),
(9, 24),
(9, 25),
(9, 26),
(9, 27),
(10, 28),
(10, 29),
(11, 30),
(12, 31),
(12, 32),
(12, 33),
(12, 34),
(12, 35),
(13, 36);

-- --------------------------------------------------------

--
-- Structure de la table `ccn_contrat`
--

CREATE TABLE `ccn_contrat` (
  `con_dateIn` date NOT NULL,
  `con_dateOut` date DEFAULT NULL,
  `con_particularite` float DEFAULT NULL,
  `con_per_id` int(11) NOT NULL,
  `con_hor_id` int(2) NOT NULL,
  `con_typ_id` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_contrat`
--

INSERT INTO `ccn_contrat` (`con_dateIn`, `con_dateOut`, `con_particularite`, `con_per_id`, `con_hor_id`, `con_typ_id`) VALUES
('2016-12-13', NULL, 15, 3, 3, 2),
('2017-04-02', NULL, 0.8, 4, 2, 2),
('2016-12-16', NULL, 0.7, 5, 2, 2),
('2006-05-01', NULL, 25, 10, 3, 3),
('2017-02-07', '2017-02-09', 69, 11, 3, 3),
('2017-02-02', NULL, NULL, 12, 1, 1),
('2017-02-15', NULL, NULL, 13, 1, 1),
('2017-03-06', '2017-03-16', NULL, 15, 1, 1),
('2017-03-08', '2017-03-16', 45, 16, 3, 1),
('2017-03-13', NULL, NULL, 18, 1, 1),
('2017-03-13', '2017-03-14', 0.4, 19, 2, 1),
('2017-03-07', NULL, NULL, 20, 1, 1),
('2017-03-05', NULL, NULL, 21, 1, 1),
('2017-03-20', NULL, 0.2, 23, 2, 1),
('2015-08-12', NULL, NULL, 27, 1, 1),
('2016-12-20', NULL, NULL, 28, 1, 1),
('2005-04-11', '0000-00-00', NULL, 29, 1, 1),
('2005-04-11', NULL, NULL, 30, 1, 1),
('2005-04-12', '0000-00-00', NULL, 31, 1, 1),
('2005-04-24', '0000-00-00', NULL, 36, 1, 1),
('2005-04-24', '0000-00-00', NULL, 37, 1, 1),
('2005-04-24', '0000-00-00', NULL, 38, 1, 1),
('2005-04-24', '0000-00-00', NULL, 39, 1, 1),
('2005-04-24', '0000-00-00', NULL, 40, 1, 1),
('2005-04-24', '0000-00-00', NULL, 41, 1, 1),
('2011-01-02', '0000-00-00', NULL, 42, 1, 1),
('2006-06-08', NULL, NULL, 45, 1, 1),
('2005-04-25', '0000-00-00', NULL, 49, 1, 1),
('2005-04-25', '0000-00-00', NULL, 50, 1, 1),
('2005-04-04', '2015-01-19', 0.3, 51, 2, 1),
('2005-04-25', '0000-00-00', NULL, 52, 1, 1),
('2005-04-25', '0000-00-00', NULL, 53, 1, 1),
('2005-04-25', '0000-00-00', NULL, 55, 1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `ccn_demandepersonne`
--

CREATE TABLE `ccn_demandepersonne` (
  `dpe_id` int(11) NOT NULL,
  `dpe_abs_id` int(11) DEFAULT NULL,
  `dpe_per_id` int(11) NOT NULL,
  `dpe_dateDebut` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  `dpe_dateFin` datetime NOT NULL,
  `dpe_motif` varchar(250) DEFAULT NULL,
  `dpe_isJourneeComplete` tinyint(1) NOT NULL DEFAULT '1',
  `dpe_statut` enum('new','accept','refuse','modify','modifyAccept','modifyRefuse') NOT NULL DEFAULT 'new'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_demandepersonne`
--

INSERT INTO `ccn_demandepersonne` (`dpe_id`, `dpe_abs_id`, `dpe_per_id`, `dpe_dateDebut`, `dpe_dateFin`, `dpe_motif`, `dpe_isJourneeComplete`, `dpe_statut`) VALUES
(1, 2, 3, '2017-05-03 15:30:00', '2017-05-03 16:30:00', '', 0, 'accept'),
(2, 4, 3, '2017-04-19 18:53:24', '2017-05-19 23:59:59', '', 1, 'modify'),
(3, 2, 3, '2017-04-19 19:13:10', '2017-05-01 23:59:59', 'salut', 1, 'accept'),
(5, 2, 3, '2017-05-03 14:30:00', '2017-05-03 15:30:00', 'salut', 0, 'new'),
(6, 2, 3, '2017-05-05 14:30:00', '2017-05-05 16:30:00', 'salut', 0, 'new'),
(7, 2, 5, '2017-04-20 00:00:00', '2017-04-20 23:59:59', NULL, 1, 'new'),
(8, 5, 5, '2017-04-20 00:00:00', '2017-04-23 23:59:59', '', 1, 'modify'),
(9, 3, 5, '2017-04-20 15:30:00', '2017-04-20 17:30:00', '', 0, 'modify'),
(10, 3, 5, '2017-04-20 13:30:00', '2017-04-20 23:30:00', NULL, 0, 'new'),
(11, 3, 3, '2017-04-20 00:00:00', '2017-04-20 23:59:59', 'Bahhh', 1, 'new'),
(13, 3, 3, '2017-04-21 10:30:00', '2017-04-21 16:00:00', NULL, 0, 'new'),
(16, 5, 3, '2017-05-17 00:00:00', '2017-05-19 23:59:59', NULL, 1, 'accept'),
(17, 11, 3, '2017-07-01 21:20:07', '2017-07-09 23:59:59', NULL, 1, 'accept'),
(18, 9, 5, '2017-04-20 00:00:00', '2017-04-20 23:59:59', 'Fgffg', 1, 'new'),
(19, 2, 5, '2017-04-20 00:00:00', '2017-04-20 23:59:59', NULL, 1, 'new'),
(20, 3, 4, '2017-04-24 21:18:10', '2017-04-25 10:44:00', NULL, 0, 'accept'),
(21, 3, 4, '2017-04-24 21:16:41', '2017-04-24 23:59:59', 'bla bla', 1, 'refuse'),
(22, 3, 4, '2017-04-24 21:17:57', '2017-04-24 23:59:59', NULL, 1, 'accept'),
(23, 4, 5, '2017-04-22 14:28:00', '2017-04-22 15:29:00', NULL, 0, 'new'),
(24, 2, 5, '2017-04-22 13:30:00', '2017-04-22 14:30:00', '', 0, 'modify'),
(25, 2, 5, '2017-04-22 21:25:00', '2017-04-22 22:25:00', NULL, 0, 'new'),
(26, 2, 5, '2017-04-22 00:10:00', '2017-04-22 06:10:00', NULL, 0, 'new'),
(27, 5, 42, '2017-04-25 10:48:24', '2017-05-05 23:59:59', 'Vaccination', 1, 'modifyAccept'),
(28, 4, 42, '2017-04-24 21:25:23', '2017-05-26 23:59:59', 'Armée', 1, 'modifyRefuse'),
(29, 3, 42, '2017-04-24 21:24:46', '2017-04-24 23:59:59', NULL, 1, 'accept'),
(30, 7, 42, '2017-04-24 21:27:30', '2017-05-17 21:30:00', 'Deces de mon chien', 0, 'accept'),
(31, 4, 42, '2017-04-24 21:27:26', '2017-04-24 23:59:59', 'Nanana', 1, 'refuse'),
(32, 4, 42, '2017-04-24 21:34:43', '2017-04-24 23:59:59', 'Jsksks', 1, 'accept'),
(33, 10, 42, '2017-04-24 21:36:06', '2017-05-31 23:59:59', 'Ujshshs', 1, 'refuse'),
(34, 12, 42, '2017-04-24 21:37:55', '2017-05-31 23:59:59', 'Nouveau', 1, 'accept'),
(35, 5, 42, '2017-04-24 21:37:58', '2017-04-28 23:59:59', 'Bsjsjs', 1, 'refuse'),
(36, 11, 42, '2017-04-24 21:39:41', '2017-04-24 23:59:59', 'Nymykks', 1, 'refuse'),
(37, 4, 42, '2017-04-24 21:40:24', '2017-04-24 23:59:59', 'Byjy', 1, 'accept'),
(38, 9, 42, '2017-04-24 21:40:32', '2017-05-26 23:59:59', NULL, 1, 'refuse'),
(39, 3, 40, '2017-04-25 00:00:00', '2017-04-29 23:59:59', 'Vacances été', 1, 'new'),
(40, 2, 42, '2017-04-25 10:15:44', '2017-04-28 23:59:59', 'repos', 1, 'accept'),
(41, 2, 5, '2017-04-25 04:30:00', '2017-04-25 19:30:00', NULL, 0, 'new');

-- --------------------------------------------------------

--
-- Structure de la table `ccn_departement`
--

CREATE TABLE `ccn_departement` (
  `dep_id` int(11) NOT NULL,
  `dep_nom` varchar(45) DEFAULT NULL,
  `dep_eta_id` int(11) NOT NULL,
  `dep_img_no` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_departement`
--

INSERT INTO `ccn_departement` (`dep_id`, `dep_nom`, `dep_eta_id`, `dep_img_no`) VALUES
(1, 'Cuisine', 1, 1),
(15, 'Bar', 38, 1),
(16, 'Cuisine', 38, 2),
(17, 'lessive', 38, 3),
(18, 'Votre département', 38, 4),
(19, 'Salle', 38, 5),
(20, 'Bar', 1, 2),
(21, 'Service', 1, 3),
(22, 'Salle à manger', 39, 1),
(23, 'Restaurant', 39, 2),
(24, 'Bar', 39, 3),
(25, 'Cuisine', 40, 1),
(26, 'Bar', 40, 2),
(27, 'Bureau', 40, 3),
(28, 'Salle', 40, 4),
(29, 'Cuisine', 41, 1),
(30, 'Salle', 41, 2),
(31, 'Bar', 41, 3),
(32, 'ggdfdg', 41, 4),
(33, 'fgfdgfdg', 41, 5),
(34, 'fdgfdgd', 41, 6),
(35, 'erererr', 41, 8),
(36, 'fdgdgdg', 41, 7),
(37, 'Cuisine', 42, 1),
(38, 'Salle', 42, 2),
(39, 'ggdfdg', 42, 4),
(40, 'Bar', 42, 3),
(41, 'fgfdgfdg', 42, 5),
(42, 'fdgfdgd', 42, 6),
(43, 'erererr', 42, 8),
(44, 'fdgdgdg', 42, 7),
(45, 'Cuisine', 43, 1),
(46, 'Salle', 43, 2),
(47, 'Bar', 43, 3),
(48, 'ggdfdg', 43, 4),
(49, 'fgfdgfdg', 43, 5),
(50, 'fdgfdgd', 43, 6),
(51, 'fdgdgdg', 43, 7),
(52, 'erererr', 43, 8),
(53, 'Cuisine', 44, 1),
(54, 'Salle', 44, 2),
(55, 'Bar', 44, 3),
(56, 'Salle', 45, 2),
(57, 'Cuisine', 45, 1),
(58, 'Bar', 45, 3),
(59, 'Cuisine', 46, 1),
(60, 'Terrasse', 46, 4),
(61, 'Salle', 46, 2),
(62, 'Bar', 46, 3),
(63, 'Cuisine', 47, 1),
(64, 'Salle', 47, 2),
(65, 'Bar', 47, 3),
(66, 'Cuisine', 48, 1),
(67, 'Salle', 48, 2),
(68, 'Bar', 48, 3),
(69, 'Cuisine', 49, 1),
(70, 'Salle', 49, 2),
(71, 'Bar', 49, 3),
(72, 'Salle', 50, 2),
(73, 'Cuisine', 50, 1),
(74, 'Bar', 50, 3),
(75, 'Cuisine', 51, 1),
(76, 'Salle', 51, 2),
(77, 'Bar', 51, 3),
(81, 'Cuisine', 53, 1),
(82, 'Salle', 53, 2),
(83, 'Bar', 53, 3),
(84, 'Cuisine', 54, 1),
(85, 'Salle', 54, 2),
(86, 'Bar', 54, 3),
(87, 'Cuisine', 55, 1),
(88, 'Salle', 55, 2),
(89, 'Bar', 55, 3),
(90, 'Cuisine', 56, 2),
(91, 'Salle', 56, 1),
(92, 'Bar', 56, 3),
(93, 'cuisine', 57, 1);

-- --------------------------------------------------------

--
-- Structure de la table `ccn_etablissement`
--

CREATE TABLE `ccn_etablissement` (
  `eta_id` int(11) NOT NULL,
  `eta_nom` varchar(100) DEFAULT NULL,
  `eta_adresse` varchar(100) DEFAULT NULL,
  `eta_telReservation` varchar(20) DEFAULT NULL,
  `eta_telDirection` varchar(20) DEFAULT NULL,
  `eta_email` varchar(100) DEFAULT NULL,
  `eta_siteWeb` varchar(100) DEFAULT NULL,
  `eta_adresseInfo` varchar(100) DEFAULT NULL,
  `eta_codePostal` int(11) DEFAULT NULL,
  `eta_localite` varchar(100) DEFAULT NULL,
  `eta_nbHeure` float(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_etablissement`
--

INSERT INTO `ccn_etablissement` (`eta_id`, `eta_nom`, `eta_adresse`, `eta_telReservation`, `eta_telDirection`, `eta_email`, `eta_siteWeb`, `eta_adresseInfo`, `eta_codePostal`, `eta_localite`, `eta_nbHeure`) VALUES
(1, 'Le Château d\'If', 'Route de Thonon 51', '+41 22 752 12 11', '0795093454', 'contact@chateaudif.ch', 'www.chateaudif.ch', 'CP 166', 1222, 'Vésenaz', 45),
(38, 'xxxx', 'xxxx', '0227521211', '0795093454', 'contact@chateaudif.ch', 'www.chteaudif.ch', '', 1222, 'Vésenaz', 42),
(39, 'fdsa', 'fasfsa', '0779878789', '0789978798', 'joel.marquesd@gmail.com', 'www.site.ch', 'fasfsa', 1225, 'Thônexx', 45),
(40, 'Le Château d&#39;If', '51 Route de thonon', '0227521211', '0227521211', '123@frg.ch', '', '', 1222, 've', 45),
(41, 'rfreg', 'frre', '0222222222', '0232323232', 'fdfd@g.ch', '', '', 1003, 'Lausanne', 42),
(42, 'rfreg', 'frre', '0222222222', '0232323232', 'fdfd@g.ch', '', '', 1003, 'Lausanne', 42),
(43, 'rfreg', 'frre', '0222222222', '0232323232', 'fdfd@g.ch', '', '', 1003, 'Lausanne', 42),
(44, 'fdgdgdf', 'dfgfd', '0222222222', '0222222222', 'efewe@ff.ch', '', '', 1003, 'Lausanne', 42),
(45, 'fdgdgdf', 'dfgfd', '0222222222', '0222222222', 'efewe@ff.ch', '', '', 1003, 'Lausanne', 42),
(46, 'test5', 'teretret', '0212121212', '0112121212', 'tisba@gmail.com', '', '', 1207, 'Genève', 43.5),
(47, 'regere', 'tgtgtrt', '0222232323', '0232323232', 'tdfrf@dff.ch', '', 'trtrtrzt', 1200, 'Genève', 45),
(48, 'fgfdg', 'gfgdf', '0232323232', '0232323232', 'dsfd@gg.ch', '', '', 1003, 'Lausanne', 43.5),
(49, 'efdfgfd', 'fdgf', '0232323232', '0232323232', 'ffdgfg@gg.ch', '', '', 1003, 'Lausanne', 45),
(50, 'fsda', 'fdsa', '0789978987', '0789779889', 'j@gmail.com', '', '', 1226, 'Thônex', 45),
(51, 'Chez nina', 'ch. des Beaux-champs 5c', '0223783894', '0788998273', 'nina@gmail.com', '', '', 1234, 'Vessy', 45),
(53, 'fdsafa', 'fdsakll', '0877879879', '0788778978', 'j@gmail.com', 'www.gprh.ch', 'fdsajlk', 1000, 'Lausanne 25', 43.5),
(54, 'jsjsjsj', 'Nsnsmsms', '0757673733', '0767373373', 'j@gmail.com', '', 'Nsjsmsm', 1793, 'Jeuss', 43.5),
(55, 'lkfdasjlj', 'fasklfjl', '0787989898', '0788879789', 'j@gmail.com', '', 'fdsafl', 1226, 'Thônex', 45),
(56, 'McDo', 'Rue de Rive 44', '0222342342', '0232323232', 'tisba@h.ch', '', '', 1207, 'Genève', 45),
(57, 'Test', 'route de chêne 40', '0223454545', '0780987654', 'test@g.ch', 'www.testg.ch', '', 1208, 'Genève', 42);

-- --------------------------------------------------------

--
-- Structure de la table `ccn_fermetureinfo`
--

CREATE TABLE `ccn_fermetureinfo` (
  `fer_id` int(11) NOT NULL,
  `fer_nom` varchar(40) NOT NULL,
  `fer_dateDebut` date NOT NULL,
  `fer_dateFin` date DEFAULT NULL,
  `fer_Eta_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_fermetureinfo`
--
INSERT INTO `ccn_fermetureinfo` (`fer_id`, `fer_nom`, `fer_dateDebut`, `fer_dateFin`, `fer_Eta_id`) VALUES
(14, 'Férié 1', '2016-05-20', NULL, 53),
(15, 'Vac', '2017-02-07', '2017-02-15', 53),
(16, 'Férié 2', '2017-02-04', NULL, 53),
(17, '', '2017-02-08', NULL, 39),
(18, '', '2017-02-09', NULL, 39),
(19, '', '2017-02-10', NULL, 39),
(20, '', '2017-02-11', NULL, 39),
(21, '', '2017-02-12', NULL, 39),
(22, '', '2017-02-13', NULL, 39),
(23, '', '2017-02-14', NULL, 39),
(24, '', '2017-02-01', NULL, 40),
(25, '', '2017-02-06', NULL, 40),
(26, '', '2017-02-07', NULL, 40),
(27, '', '2017-02-08', NULL, 40),
(28, '', '2017-02-09', NULL, 40),
(29, '', '2017-02-10', NULL, 40),
(30, '', '2017-02-11', NULL, 40),
(31, '', '2017-02-12', NULL, 40),
(32, '', '2017-02-13', NULL, 40),
(33, '', '2017-02-14', NULL, 40),
(34, '', '2017-02-01', NULL, 40),
(35, '', '2017-02-02', NULL, 40),
(36, '', '2017-02-03', NULL, 40),
(37, '', '2017-02-05', NULL, 40),
(38, '', '2017-02-04', NULL, 40),
(39, '', '2017-02-06', NULL, 40),
(40, '', '2017-02-07', NULL, 40),
(41, '', '2017-02-08', NULL, 40),
(42, '', '2017-02-07', NULL, 40),
(43, '', '2017-02-08', NULL, 40),
(44, '', '2017-02-09', NULL, 40),
(45, '', '2017-02-10', NULL, 40),
(46, '', '2017-02-12', NULL, 40),
(47, '', '2017-02-11', NULL, 40),
(48, '', '2017-02-13', NULL, 40),
(49, '', '2017-02-14', NULL, 40),
(50, '', '2017-03-13', NULL, 41),
(51, '', '2017-03-28', NULL, 41),
(52, '', '2017-03-29', NULL, 41),
(53, '', '2017-04-01', NULL, 41),
(54, '', '2017-03-30', NULL, 41),
(55, '', '2017-03-31', NULL, 41),
(56, '', '2017-04-02', NULL, 41),
(57, '', '2017-04-04', NULL, 41),
(58, '', '2017-04-03', NULL, 41),
(59, '', '2017-04-05', NULL, 41),
(60, '', '2017-04-06', NULL, 41),
(61, '', '2017-04-07', NULL, 41),
(62, '', '2017-04-09', NULL, 41),
(63, '', '2017-04-08', NULL, 41),
(64, '', '2017-04-10', NULL, 41),
(65, '', '2017-04-11', NULL, 41),
(66, '', '2017-03-13', NULL, 42),
(67, '', '2017-03-28', NULL, 42),
(68, '', '2017-03-29', NULL, 42),
(69, '', '2017-03-30', NULL, 42),
(70, '', '2017-03-31', NULL, 42),
(71, '', '2017-04-01', NULL, 42),
(72, '', '2017-04-02', NULL, 42),
(73, '', '2017-04-03', NULL, 42),
(74, '', '2017-04-05', NULL, 42),
(75, '', '2017-04-04', NULL, 42),
(76, '', '2017-04-06', NULL, 42),
(77, '', '2017-04-07', NULL, 42),
(78, '', '2017-04-08', NULL, 42),
(79, '', '2017-04-09', NULL, 42),
(80, '', '2017-04-10', NULL, 42),
(81, '', '2017-04-11', NULL, 42),
(82, '', '2017-03-13', NULL, 43),
(83, '', '2017-03-29', NULL, 43),
(84, '', '2017-03-28', NULL, 43),
(85, '', '2017-03-30', NULL, 43),
(86, '', '2017-03-31', NULL, 43),
(87, '', '2017-04-02', NULL, 43),
(88, '', '2017-04-01', NULL, 43),
(89, '', '2017-04-04', NULL, 43),
(90, '', '2017-04-03', NULL, 43),
(91, '', '2017-04-05', NULL, 43),
(92, '', '2017-04-06', NULL, 43),
(93, '', '2017-04-08', NULL, 43),
(94, '', '2017-04-07', NULL, 43),
(95, '', '2017-04-10', NULL, 43),
(96, '', '2017-04-09', NULL, 43),
(97, '', '2017-04-11', NULL, 43),
(98, '', '2017-03-20', NULL, 44),
(99, '', '2017-03-20', NULL, 45),
(100, '', '2017-03-21', NULL, 46),
(101, '', '2017-03-28', NULL, 48);

-- --------------------------------------------------------

--
-- Structure de la table `ccn_horairecontrat`
--

CREATE TABLE `ccn_horairecontrat` (
  `hor_id` int(2) NOT NULL,
  `hor_nom` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_horairecontrat`
--

INSERT INTO `ccn_horairecontrat` (`hor_id`, `hor_nom`) VALUES
(1, 'Par heure'),
(2, 'Mensuel'),
(3, 'Spécial'),
(4, 'Cadre');

-- --------------------------------------------------------

--
-- Structure de la table `ccn_horairepersonne`
--

CREATE TABLE `ccn_horairepersonne` (
  `hop_id` int(11) NOT NULL,
  `hop_date` date NOT NULL,
  `hop_heureDebut` time NOT NULL,
  `hop_heureFin` time NOT NULL,
  `hop_pause` int(11) NOT NULL,
  `hop_abs_id` int(11) DEFAULT NULL,
  `hop_abs_freq` float DEFAULT NULL,
  `hop_dem_modif` tinyint(1) NOT NULL DEFAULT '-1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_horairepersonne`
--

INSERT INTO `ccn_horairepersonne` (`hop_id`, `hop_date`, `hop_heureDebut`, `hop_heureFin`, `hop_pause`, `hop_abs_id`, `hop_abs_freq`) VALUES
(1, '2017-02-17', '12:00:00', '15:00:00', 0, 1, 1),
(2, '2017-02-17', '17:00:00', '22:00:00', 0, 1, NULL),
(3, '2017-02-18', '11:00:00', '14:00:00', 0, 1, NULL),
(4, '2017-02-18', '19:00:00', '21:00:00', 0, 1, NULL),
(5, '2017-02-16', '11:00:00', '14:00:00', 0, 1, NULL),
(6, '2017-02-16', '18:00:00', '22:00:00', 0, 1, NULL),
(7, '2017-02-17', '17:00:00', '23:00:00', 0, NULL, NULL),
(8, '2017-02-19', '11:00:00', '13:00:00', 0, NULL, NULL),
(9, '2017-02-21', '11:00:00', '21:00:00', 0, NULL, NULL),
(10, '2017-02-23', '10:00:00', '16:00:00', 0, NULL, NULL),
(11, '2017-02-23', '20:00:00', '22:00:00', 0, NULL, NULL),
(12, '2017-03-04', '12:00:00', '14:00:00', 0, NULL, NULL),
(13, '2017-03-04', '16:00:00', '22:00:00', 0, NULL, NULL),
(14, '2017-03-05', '14:00:00', '18:00:00', 0, NULL, NULL),
(15, '2017-03-18', '21:00:00', '22:00:00', 0, NULL, NULL),
(16, '2017-03-24', '10:00:00', '18:00:00', 0, NULL, NULL),
(17, '2017-03-21', '18:00:00', '20:00:00', 0, NULL, NULL),
(18, '2017-03-26', '10:00:00', '13:00:00', 0, NULL, NULL),
(19, '2017-03-26', '18:00:00', '23:00:00', 0, NULL, NULL),
(21, '2017-04-02', '08:00:00', '21:04:00', 0, NULL, NULL),
(22, '2017-03-26', '14:00:00', '15:00:00', 0, NULL, NULL),
(23, '2017-04-05', '11:00:00', '19:00:00', 0, NULL, NULL),
(24, '2017-03-29', '23:00:00', '23:32:00', 0, NULL, NULL),
(25, '2017-03-30', '11:00:00', '12:00:00', 0, NULL, NULL),
(26, '2017-03-30', '09:10:00', '09:15:00', 0, NULL, NULL),
(27, '2017-03-31', '17:00:00', '22:00:00', 0, NULL, NULL),
(28, '2017-03-31', '13:00:00', '15:00:00', 0, NULL, NULL),
(29, '2017-03-31', '11:00:00', '12:00:00', 0, NULL, NULL),
(30, '2017-04-05', '09:00:00', '13:00:00', 0, NULL, NULL),
(31, '2017-04-05', '17:00:00', '22:00:00', 0, NULL, NULL),
(32, '2017-04-06', '10:00:00', '15:00:00', 0, NULL, NULL),
(33, '2017-04-07', '10:00:00', '19:00:00', 0, NULL, NULL),
(34, '2017-04-06', '20:00:00', '23:43:00', 0, NULL, NULL),
(35, '2017-04-01', '00:30:00', '00:45:00', 0, NULL, NULL),
(36, '2017-04-01', '07:00:00', '10:00:00', 0, NULL, NULL),
(37, '2017-04-01', '21:42:00', '21:45:00', 0, NULL, NULL),
(38, '2017-04-02', '14:12:00', '14:10:00', 0, NULL, NULL),
(39, '2017-04-02', '14:06:00', '14:17:00', 0, NULL, NULL),
(40, '2017-04-02', '14:08:00', '14:27:00', 0, NULL, NULL),
(41, '2017-04-08', '00:00:00', '01:17:00', 0, NULL, NULL),
(42, '2017-04-08', '13:00:00', '20:00:00', 0, NULL, NULL),
(43, '2017-04-09', '10:00:00', '17:29:00', 0, NULL, NULL),
(44, '2017-04-09', '15:30:00', '15:32:00', 0, NULL, NULL),
(45, '2017-04-09', '15:33:00', '15:34:00', 0, NULL, NULL),
(46, '2017-04-09', '15:35:00', '15:37:00', 0, NULL, NULL),
(47, '2017-04-11', '08:27:00', '09:27:00', 10, NULL, NULL),
(48, '2017-04-10', '16:17:00', '23:17:00', 50, NULL, NULL),
(49, '2017-04-11', '16:59:00', '22:59:00', 50, NULL, NULL),
(50, '2017-06-15', '05:00:00', '16:00:00', 30, NULL, NULL),
(51, '2017-04-03', '10:00:00', '22:00:00', 40, NULL, NULL),
(52, '2017-04-11', '08:00:00', '11:38:00', 0, NULL, NULL),
(53, '2017-04-12', '05:29:00', '14:50:00', 0, NULL, NULL),
(54, '2017-04-11', '08:00:00', '11:38:00', 5, NULL, NULL),
(55, '2017-04-12', '05:29:00', '14:50:00', 5, NULL, NULL),
(56, '2017-04-21', '05:00:00', '13:00:00', 0, NULL, NULL),
(57, '2017-04-19', '17:23:00', '22:23:00', 25, NULL, NULL),
(60, '2017-08-04', '16:30:00', '22:30:00', 0, NULL, NULL),
(61, '2017-04-24', '07:00:00', '13:00:00', 35, NULL, NULL),
(62, '2017-04-28', '05:00:00', '13:00:00', 0, NULL, NULL),
(63, '2017-04-05', '14:36:00', '21:36:00', 0, 1, 0.5),
(66, '2017-04-09', '04:39:00', '22:39:00', 50, NULL, NULL),
(68, '2017-04-12', '18:00:00', '22:00:00', 0, NULL, NULL),
(69, '2017-04-13', '12:00:00', '17:00:00', 0, NULL, NULL),
(70, '2017-04-12', '16:00:00', '23:00:00', 1, NULL, NULL),
(71, '2017-04-13', '10:00:00', '13:20:00', 1, NULL, NULL),
(72, '2017-04-14', '16:00:00', '17:00:00', 1, NULL, NULL),
(73, '2017-04-17', '12:00:00', '20:50:00', 1, NULL, NULL),
(74, '2017-04-07', '05:00:00', '13:00:00', 0, NULL, NULL),
(75, '2017-05-05', '05:00:00', '13:00:00', 0, NULL, NULL),
(76, '2017-05-04', '22:32:00', '23:59:00', 30, NULL, NULL),
(77, '2017-04-19', '07:00:00', '12:00:00', 0, NULL, NULL),
(78, '2017-04-15', '20:00:00', '20:49:00', 0, NULL, NULL),
(79, '2017-04-15', '21:00:00', '21:05:00', 0, NULL, NULL),
(80, '2017-04-15', '21:00:00', '21:02:00', 0, NULL, NULL),
(81, '2017-04-22', '11:00:00', '16:00:00', 0, NULL, NULL),
(82, '2017-04-22', '11:00:00', '16:00:00', 0, NULL, NULL),
(83, '2017-05-03', '09:00:00', '17:00:00', 0, NULL, NULL),
(84, '2017-04-07', '05:00:00', '13:00:00', 0, NULL, NULL),
(85, '2017-04-03', '07:00:00', '13:00:00', 35, NULL, NULL),
(86, '2017-04-24', '08:00:00', '12:00:00', 0, NULL, NULL),
(87, '2017-04-24', '16:00:00', '21:30:00', 0, NULL, NULL),
(88, '2017-04-26', '08:00:00', '12:00:00', 0, NULL, NULL),
(89, '2017-04-25', '10:00:00', '10:30:00', 0, NULL, NULL),
(90, '2017-04-25', '18:00:00', '23:30:00', 0, NULL, NULL),
(91, '2017-04-26', '16:00:00', '21:30:00', 0, NULL, NULL),
(92, '2017-04-27', '08:00:00', '12:00:00', 0, NULL, NULL),
(93, '2017-04-27', '16:00:00', '21:30:00', 0, NULL, NULL),
(94, '2017-04-28', '08:00:00', '12:00:00', 0, NULL, NULL),
(95, '2017-04-28', '16:00:00', '21:30:00', 0, NULL, NULL),
(113, '2017-05-02', '05:00:00', '18:00:00', 20, NULL, NULL),
(114, '2017-05-01', '13:00:00', '21:30:00', 15, NULL, NULL),
(115, '2017-05-01', '05:00:00', '11:00:00', 15, NULL, NULL),
(116, '2017-05-08', '13:00:00', '21:30:00', 15, NULL, NULL),
(117, '2017-05-09', '05:00:00', '18:00:00', 20, NULL, NULL),
(118, '2017-05-08', '05:00:00', '11:00:00', 15, NULL, NULL),
(119, '2017-05-16', '05:00:00', '18:00:00', 20, NULL, NULL),
(120, '2017-05-15', '05:00:00', '11:00:00', 15, NULL, NULL),
(121, '2017-05-15', '13:00:00', '21:30:00', 15, NULL, NULL),
(122, '2017-05-22', '05:00:00', '11:00:00', 15, NULL, NULL),
(123, '2017-05-22', '13:00:00', '21:30:00', 15, NULL, NULL),
(124, '2017-05-23', '05:00:00', '18:00:00', 20, NULL, NULL),
(125, '2017-05-03', '14:00:00', '22:00:00', 60, NULL, NULL),
(126, '2017-04-24', '20:02:00', '22:03:00', 10, NULL, NULL),
(127, '2017-04-24', '23:03:00', '23:28:00', 25, NULL, NULL),
(131, '2017-04-30', '05:00:00', '12:00:00', 10, NULL, NULL),
(132, '2017-04-30', '13:00:00', '21:30:00', 0, NULL, NULL),
(133, '2017-04-10', '20:20:00', '22:20:00', 0, 4, NULL),
(134, '2017-06-06', '20:20:00', '22:20:00', 0, 1, NULL),
(135, '2017-05-09', '16:21:00', '21:21:00', 0, 11, NULL),
(136, '2017-04-24', '16:57:00', '22:57:00', 25, NULL, NULL),
(137, '2017-05-04', '00:00:00', '11:00:00', 10, NULL, NULL),
(138, '2017-05-04', '13:00:00', '21:30:00', 25, NULL, NULL),
(139, '2017-04-26', '08:44:00', '23:19:00', 20, NULL, NULL),
(141, '2017-05-01', '05:00:00', '11:00:00', 25, NULL, NULL),
(142, '2017-04-25', '05:00:00', '11:00:00', 25, NULL, NULL),
(143, '2017-04-25', '13:00:00', '21:30:00', 10, NULL, NULL),
(146, '2017-04-27', '05:00:00', '11:00:00', 20, NULL, NULL),
(147, '2017-04-27', '13:00:00', '21:30:00', 20, NULL, NULL),
(148, '2017-04-28', '06:00:00', '14:00:00', 10, NULL, NULL),
(149, '2017-05-01', '07:00:00', '13:00:00', 40, NULL, NULL),
(150, '2017-05-01', '15:00:00', '23:30:00', 25, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `ccn_horairepreconfig`
--

CREATE TABLE `ccn_horairepreconfig` (
  `hpr_id` int(11) NOT NULL,
  `hpr_nom` varchar(40) CHARACTER SET latin1 NOT NULL,
  `hpr_dep_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_horairepreconfig`
--

INSERT INTO `ccn_horairepreconfig` (`hpr_id`, `hpr_nom`, `hpr_dep_id`) VALUES
(1, 'Service Salle', 72),
(2, 'Horaire cuisine', 75),
(3, 'Horaire Salle', 76),
(6, 'Service Salle', 82),
(7, 'Service 2', 82),
(8, 'Service Bar', 83),
(9, 'Service salle', 85),
(10, 'Service Salle', 88),
(11, 'Horaire salle 2', 90),
(12, 'Horaire salle', 91),
(13, 'test', 93);

-- --------------------------------------------------------

--
-- Structure de la table `ccn_jourpreconfig`
--

CREATE TABLE `ccn_jourpreconfig` (
  `jou_id` int(11) NOT NULL,
  `jou_sem` int(11) NOT NULL,
  `jou_heureDebut` datetime NOT NULL,
  `jou_heureFin` datetime NOT NULL,
  `jou_heureDebutS` datetime NOT NULL,
  `jou_heureFinS` datetime NOT NULL,
  `jou_pause` int(11) NOT NULL,
  `jou_pauseS` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_jourpreconfig`
--

INSERT INTO `ccn_jourpreconfig` (`jou_id`, `jou_sem`, `jou_heureDebut`, `jou_heureFin`, `jou_heureDebutS`, `jou_heureFinS`, `jou_pause`, `jou_pauseS`) VALUES
(1, 1, '2017-04-11 07:00:00', '2017-04-11 13:00:57', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 35, 0),
(2, 5, '2017-04-15 05:00:00', '2017-04-15 13:00:58', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, 0),
(3, 1, '2017-04-24 10:00:00', '2017-04-24 14:00:06', '2017-04-24 18:00:06', '2017-04-24 23:00:06', 0, 0),
(4, 2, '2017-04-25 08:00:00', '2017-04-25 12:00:07', '2017-04-25 16:00:07', '2017-04-25 21:00:07', 0, 0),
(5, 3, '2017-04-26 08:00:00', '2017-04-26 12:00:07', '2017-04-26 16:00:07', '2017-04-26 21:00:07', 0, 0),
(6, 1, '2017-04-24 08:00:00', '2017-04-24 12:00:07', '2017-04-24 16:00:07', '2017-04-24 21:30:07', 0, 0),
(7, 4, '2017-04-27 08:00:00', '2017-04-27 12:00:07', '2017-04-27 16:00:07', '2017-04-27 21:00:07', 0, 0),
(8, 2, '2017-04-25 10:00:00', '2017-04-25 14:00:06', '2017-04-25 18:00:06', '2017-04-25 23:30:06', 0, 0),
(9, 5, '2017-04-28 08:00:00', '2017-04-28 12:00:07', '2017-04-28 16:00:07', '2017-04-28 21:00:07', 0, 0),
(10, 3, '2017-04-26 08:00:00', '2017-04-26 12:00:07', '2017-04-26 16:00:07', '2017-04-26 21:30:07', 0, 0),
(11, 4, '2017-04-27 08:00:00', '2017-04-27 12:00:07', '2017-04-27 16:00:07', '2017-04-27 21:30:07', 0, 0),
(12, 5, '2017-04-28 08:00:00', '2017-04-28 12:00:07', '2017-04-28 16:00:07', '2017-04-28 21:30:07', 0, 0),
(13, 1, '2017-04-24 07:00:00', '2017-04-24 13:00:59', '2017-04-24 15:00:59', '2017-04-24 23:30:59', 15, 25),
(14, 3, '2017-04-26 05:00:00', '2017-04-26 11:01:00', '2017-04-26 13:01:00', '2017-04-26 21:31:00', 45, 60),
(15, 3, '2017-04-26 06:00:00', '2017-04-26 14:01:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 20, 0),
(16, 5, '2017-04-28 06:00:00', '2017-04-28 12:32:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 15, 0),
(17, 1, '2017-04-24 05:00:00', '2017-04-24 11:00:51', '2017-04-24 13:00:51', '2017-04-24 21:30:51', 5, 60),
(18, 1, '2017-04-24 05:00:00', '2017-04-24 11:00:51', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 25, 0),
(19, 3, '2017-04-26 05:00:00', '2017-04-26 14:00:51', '2017-04-26 15:00:51', '2017-04-26 23:30:51', 15, 55),
(20, 2, '2017-04-25 05:00:00', '2017-04-25 18:00:51', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 20, 0),
(21, 4, '2017-04-27 00:00:00', '2017-04-27 11:00:51', '2017-04-27 13:00:51', '2017-04-27 21:30:51', 15, 25),
(22, 1, '2017-04-24 07:00:00', '2017-04-24 13:00:50', '2017-04-24 15:00:50', '2017-04-24 23:30:50', 50, 10),
(23, 4, '2017-04-27 05:00:00', '2017-04-27 11:00:51', '2017-04-27 13:00:51', '2017-04-27 18:30:51', 15, 20),
(24, 1, '2017-04-24 07:00:00', '2017-04-24 13:00:13', '2017-04-24 15:00:13', '2017-04-24 23:30:13', 55, 0),
(25, 2, '2017-04-25 05:00:00', '2017-04-25 10:00:14', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 10, 0),
(26, 4, '2017-04-27 05:00:00', '2017-04-27 11:00:14', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 40, 0),
(27, 0, '2017-04-30 05:00:00', '2017-04-30 12:00:14', '2017-04-30 13:00:14', '2017-04-30 21:30:14', 55, 0),
(28, 2, '2017-04-26 05:00:00', '2017-04-26 11:00:35', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 30, 0),
(29, 4, '2017-04-28 05:00:00', '2017-04-28 14:00:35', '2017-04-28 15:00:35', '2017-04-28 21:30:35', 10, 60),
(30, 1, '2017-04-25 05:00:00', '2017-04-25 11:00:02', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 25, 0),
(31, 1, '2017-04-25 07:00:00', '2017-04-25 13:00:01', '2017-04-25 15:00:01', '2017-04-25 23:30:01', 40, 25),
(32, 2, '2017-04-26 05:00:00', '2017-04-26 11:00:02', '2017-04-26 13:00:02', '2017-04-26 21:30:02', 25, 10),
(33, 3, '2017-04-27 04:00:00', '2017-04-27 13:45:02', '2017-04-27 14:00:02', '2017-04-28 00:30:02', 5, 55),
(34, 4, '2017-04-28 05:00:00', '2017-04-28 11:00:02', '2017-04-28 13:00:02', '2017-04-28 21:30:02', 20, 20),
(35, 5, '2017-04-29 06:00:00', '2017-04-29 14:00:02', '2017-04-29 14:00:02', '2017-04-29 21:30:02', 10, 25),
(36, 1, '2017-04-25 07:00:00', '2017-04-25 13:00:53', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `ccn_lienouverture`
--

CREATE TABLE `ccn_lienouverture` (
  `lie_ouv_id` int(11) NOT NULL,
  `lie_oui_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `ccn_lienouverture`
--

INSERT INTO `ccn_lienouverture` (`lie_ouv_id`, `lie_oui_id`) VALUES
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(2, 15),
(2, 16),
(3, 31),
(4, 32),
(3, 33),
(4, 34),
(3, 35),
(4, 36),
(3, 37),
(4, 38),
(3, 39),
(4, 40),
(3, 41),
(4, 42),
(3, 43),
(4, 44),
(5, 45),
(5, 46),
(5, 47),
(6, 48),
(5, 49),
(6, 50),
(5, 51),
(6, 52),
(5, 53),
(6, 54),
(5, 55),
(6, 56),
(6, 57),
(6, 58),
(7, 59),
(7, 60),
(7, 61),
(7, 62),
(7, 63),
(7, 64),
(7, 65),
(8, 66),
(8, 67),
(8, 68),
(8, 69),
(8, 70),
(8, 71),
(8, 72),
(9, 73),
(9, 74),
(9, 75),
(9, 76),
(9, 77),
(9, 78),
(9, 79);

-- --------------------------------------------------------

--
-- Structure de la table `ccn_maladieaccident`
--

CREATE TABLE `ccn_maladieaccident` (
  `mac_id` int(11) NOT NULL,
  `mac_per_id` int(11) NOT NULL,
  `mac_tra_id` int(11) DEFAULT NULL,
  `mac_dateDebut` date NOT NULL,
  `mac_dateFin` date NOT NULL,
  `mac_isAccident` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_maladieaccident`
--

INSERT INTO `ccn_maladieaccident` (`mac_id`, `mac_per_id`, `mac_tra_id`, `mac_dateDebut`, `mac_dateFin`, `mac_isAccident`) VALUES
(1, 3, NULL, '2017-04-01', '2017-04-04', 0),
(2, 3, NULL, '2017-01-01', '2017-01-14', 1),
(6, 3, NULL, '2017-03-12', '2017-03-15', 1),
(7, 3, NULL, '2017-01-12', '2017-01-13', 0),
(21, 4, NULL, '2017-04-02', '2017-04-04', 0),
(22, 6, NULL, '2017-04-13', '2017-04-15', 0);

-- --------------------------------------------------------

--
-- Structure de la table `ccn_ouverture`
--

CREATE TABLE `ccn_ouverture` (
  `ouv_id` int(11) NOT NULL,
  `ouv_nom` varchar(80) NOT NULL,
  `ouv_dateDebut` date DEFAULT NULL,
  `ouv_dateFin` date DEFAULT NULL,
  `ouv_base` int(11) NOT NULL,
  `ouv_eta_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_ouverture`
--

INSERT INTO `ccn_ouverture` (`ouv_id`, `ouv_nom`, `ouv_dateDebut`, `ouv_dateFin`, `ouv_base`, `ouv_eta_id`) VALUES
(1, 'Semaine de base', NULL, NULL, 1, 1),
(2, 'Période été', '2017-06-01', '2017-09-01', 0, 1),
(3, 'Semaine de base', NULL, NULL, 1, 53),
(4, 'Période été', '2017-06-01', '2017-06-30', 0, 53),
(5, 'Semaine de base', NULL, NULL, 1, 54),
(6, 'Période été', '2017-06-01', '2017-09-30', 0, 54),
(7, 'Semaine de base', NULL, NULL, 1, 55),
(8, 'Semaine de base', NULL, NULL, 1, 56),
(9, 'Semaine de base', NULL, NULL, 1, 57);

-- --------------------------------------------------------

--
-- Structure de la table `ccn_ouvertureinfo`
--

CREATE TABLE `ccn_ouvertureinfo` (
  `oui_id` int(11) NOT NULL,
  `oui_jour` tinyint(1) DEFAULT NULL,
  `oui_matinDebut` time DEFAULT NULL,
  `oui_matinFin` time DEFAULT NULL,
  `oui_soirDebut` time DEFAULT NULL,
  `oui_soirFin` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_ouvertureinfo`
--

INSERT INTO `ccn_ouvertureinfo` (`oui_id`, `oui_jour`, `oui_matinDebut`, `oui_matinFin`, `oui_soirDebut`, `oui_soirFin`) VALUES
(1, 1, '05:00:00', NULL, NULL, '21:30:59'),
(2, 2, '05:00:00', NULL, NULL, '21:30:59'),
(3, 3, '05:00:00', NULL, NULL, '21:30:59'),
(4, 4, '05:00:00', NULL, NULL, '21:30:59'),
(5, 5, '05:00:00', NULL, NULL, '21:30:59'),
(6, 6, '05:00:00', NULL, NULL, '21:30:59'),
(7, 0, '05:00:00', NULL, NULL, '21:30:59'),
(8, 1, '05:00:00', NULL, NULL, '21:30:28'),
(9, 2, '05:00:00', '11:00:28', '13:00:28', '21:30:28'),
(10, 3, '05:00:00', '11:00:28', '13:00:28', '21:30:28'),
(11, 4, '05:00:00', NULL, NULL, '21:30:28'),
(12, 5, '05:00:00', '11:00:28', '13:00:28', '21:30:28'),
(13, 6, '05:00:00', '11:00:28', '13:00:28', '21:30:28'),
(14, 0, '05:00:00', NULL, NULL, '21:30:28'),
(15, 2, '05:00:00', '11:00:28', '13:00:28', '21:30:28'),
(16, 5, '05:00:00', '11:00:28', '16:00:28', '21:30:28'),
(31, 1, '07:00:00', NULL, NULL, '23:30:50'),
(32, 1, '07:00:00', NULL, NULL, '21:30:50'),
(33, 2, '07:00:00', NULL, NULL, '23:30:50'),
(34, 2, '07:00:00', NULL, NULL, '21:30:50'),
(35, 3, '07:00:00', NULL, NULL, '23:30:50'),
(36, 3, '07:00:00', NULL, NULL, '21:30:50'),
(37, 4, '07:00:00', NULL, NULL, '23:30:50'),
(38, 4, '07:00:00', NULL, NULL, '21:30:50'),
(39, 5, '07:00:00', NULL, NULL, '23:30:50'),
(40, 5, '09:00:00', NULL, NULL, '03:50:50'),
(41, 6, '07:00:00', NULL, NULL, '23:30:50'),
(42, 6, '04:00:00', NULL, NULL, '21:30:50'),
(43, 0, '07:00:00', NULL, NULL, '23:30:50'),
(44, 0, '07:00:00', NULL, NULL, '21:30:50'),
(45, 1, '07:00:00', NULL, NULL, '23:30:13'),
(46, 2, '07:00:00', NULL, NULL, '23:30:13'),
(47, 3, '07:00:00', NULL, NULL, '23:30:13'),
(48, 1, '07:00:00', NULL, NULL, '21:30:13'),
(49, 4, '07:00:00', NULL, NULL, '23:30:13'),
(50, 2, '07:00:00', NULL, NULL, '21:30:13'),
(51, 5, '07:00:00', NULL, NULL, '23:30:13'),
(52, 3, '07:00:00', NULL, NULL, '21:30:13'),
(53, 6, '07:00:00', NULL, NULL, '23:30:13'),
(54, 4, '07:00:00', NULL, NULL, '21:30:13'),
(55, 0, '07:00:00', NULL, NULL, '23:30:13'),
(56, 5, '07:00:00', NULL, NULL, '21:30:13'),
(57, 6, '07:00:00', NULL, NULL, '21:30:13'),
(58, 0, '07:00:00', NULL, NULL, '21:30:13'),
(59, 1, '07:00:00', NULL, NULL, '23:30:35'),
(60, 2, '07:00:00', NULL, NULL, '23:30:35'),
(61, 3, '07:00:00', NULL, NULL, '23:30:35'),
(62, 4, '07:00:00', NULL, NULL, '23:30:35'),
(63, 5, '07:00:00', NULL, NULL, '23:30:35'),
(64, 6, '07:00:00', NULL, NULL, '23:30:35'),
(65, 0, '07:00:00', NULL, NULL, '23:30:35'),
(66, 1, '07:00:00', NULL, NULL, '23:30:01'),
(67, 2, '07:00:00', NULL, NULL, '23:30:01'),
(68, 3, '07:00:00', NULL, NULL, '23:30:01'),
(69, 4, '07:00:00', NULL, NULL, '23:30:01'),
(70, 5, '07:00:00', NULL, NULL, '23:30:01'),
(71, 6, '07:00:00', NULL, NULL, '23:30:01'),
(72, 0, '07:00:00', NULL, NULL, '23:30:01'),
(73, 1, '07:00:00', NULL, NULL, '23:30:53'),
(74, 2, '07:00:00', NULL, NULL, '23:30:53'),
(75, 3, '00:00:00', NULL, NULL, '00:00:00'),
(76, 4, '07:00:00', NULL, NULL, '23:30:53'),
(77, 5, '07:00:00', NULL, NULL, '23:30:53'),
(78, 6, '07:00:00', NULL, NULL, '23:30:53'),
(79, 0, '00:00:00', NULL, NULL, '00:00:00');

-- --------------------------------------------------------

--
-- Structure de la table `ccn_personne`
--

CREATE TABLE `ccn_personne` (
  `per_id` int(11) NOT NULL,
  `per_nom` varchar(50) DEFAULT NULL,
  `per_prenom` varchar(50) DEFAULT NULL,
  `per_mail` varchar(100) DEFAULT NULL,
  `per_mdp` varchar(128) DEFAULT NULL,
  `per_token` varchar(128) DEFAULT NULL,
  `per_dateNaissance` date DEFAULT NULL,
  `per_adresse` varchar(100) DEFAULT NULL,
  `per_InfoSuppAdresse` varchar(100) DEFAULT NULL,
  `per_codePostal` int(11) DEFAULT NULL,
  `per_ville` varchar(50) DEFAULT NULL,
  `per_admin` tinyint(1) DEFAULT NULL,
  `per_telFixe` varchar(20) DEFAULT NULL,
  `per_telMobile` varchar(20) DEFAULT NULL,
  `per_genre` varchar(1) DEFAULT NULL,
  `per_inactif` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_personne`
--

INSERT INTO `ccn_personne` (`per_id`, `per_nom`, `per_prenom`, `per_mail`, `per_mdp`, `per_token`, `per_dateNaissance`, `per_adresse`, `per_InfoSuppAdresse`, `per_codePostal`, `per_ville`, `per_admin`, `per_telFixe`, `per_telMobile`, `per_genre`, `per_inactif`) VALUES
(1, 'Bedonni', 'Jean-Pierre', 'jpb@gprh.ch', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'Bedonni | 58fe4f127f7f758fe4f127f83058fe4f127f868', '1970-01-01', 'Rue de la batelle 5', NULL, 120555, 'Geneve', 1, '04', '08787976767676677', 'M', 0),
(2, 'Jalley', 'Vincent', 'vincent@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'Jalley | 58fdc0573be3c58fdc0573be7458fdc0573beaa', '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 1, '0223429999', '0793709999', 'M', 0),
(3, 'Guillerault', 'Lucille', 'lucille.guillerault@gmail.com', 'd404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db', 'Guillerault | 58fbf8982fe4d58fbf8982fe8758fbf8982febe', '1990-06-20', 'Chemin de la Rochette 12', NULL, 1220, 'Geneve', 0, '0221113322', '0778889911', 'F', 1),
(4, 'Marcuzzo', 'Vanessa B.', 'vanessa@gmail.com', 'd404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db', 'Marcuzzo | 58ff180bb99f458ff180bb9a2c58ff180bb9a61', '1993-03-10', '12 rue des omars', NULL, 1220, 'Genève', 0, '022333467', NULL, 'F', 0),
(5, 'Paniz', 'Celine', 'celine@gmail.com', 'd404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db', 'Paniz | 58ff3b2b89d7758ff3b2b89dae58ff3b2b89de5', '1992-01-14', 'Chemin de poney', NULL, 1202, '    genève', 0, '0223442344', '0789480231', 'F', 0),
(6, 'Ribeiro', 'Juliana', 'julianafilipa4@gmail.com', 'd404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db', 'Ribeiro | 58ff23efdaa6058ff23efdaa9c58ff23efdaad6', '1990-11-04', 'Av. Stitch 4', NULL, 1020, 'Renens', 0, '02144444444', '0777777777', 'F', 0),
(7, 'Da Silva', 'Joel', 'Joel@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'Da Silva | 58fdc9319fe9458fdc9319fecc58fdc9319ff02', '1992-05-09', 'chemin des champignons', 'cp 44', 2147483647, 'Carouge', 1, '0223429999', '0793709999', 'M', 0),
(8, 'Gomes', 'Dany', 'dany@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'Gomes | 58fdc1fae0d3758fdc1fae0d7258fdc1fae0daa', '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 1, '0223429999', '0793709999', 'M', 0),
(9, 'Bartolomei', 'Baptiste', 'baptiste@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'Bartolomei | 58ece36c2a18958ece36c2a1c158ece36c2a1f7', '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 0, '0223429999', '0793709999', 'M', 0),
(10, 'Terieur', 'Alain', 'joel.marquesd3@gmail.com', NULL, NULL, '1992-08-10', 'fdsalkjkf', 'klfjsdlkjlkfajl', 1226, 'Thônex', 0, '0788978978', '0789798788', 'M', 1),
(11, 'Terieur', 'Alex', 'joel.marquesd2@gmail.com', NULL, NULL, '2017-02-09', 'jxjdnnxn', 'nxnxnxjn', 1226, 'thonex', 0, '0275757567', '0727373733', 'M', 0),
(12, 'Martin ', 'Alice', 'joel.marquesd1@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'Jdnxnnx | 58bd9131e5fe958bd9131e602158bd9131e6057', '2017-02-06', 'Nxnxnnx', '', 1226, 'Thonex', 1, '0727227273', '0727272727', 'F', 1),
(13, 'Durand', 'Catherine', 'Jkem.maruqes@gmail.com', NULL, NULL, '1992-02-12', 'Hcncnnc', 'Ncncn', 1226, 'Thonex', 1, '0222276767', '2797667273', 'F', 1),
(14, 'Caron', 'Arthur', 'test@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'Caron | 58fdc3280571858fdc3280575058fdc32805786', '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 1, '0223429999', '0793709999', 'M', 0),
(15, 'Bonnet', 'Julie', 'joel.maruqesd@gmail.com', NULL, NULL, '1983-03-01', 'fdsa', 'fdas', 1224, ' chêne-bougeries', 0, '0789798789', '0789788979', 'F', 0),
(16, 'Widner', 'Johann', 'joel.marquesd@gmail.com', 'a4065a15315bad70773097c5e4b7865e98161529f73857cd046bd92f768b3f563b3793ff09d4ef7faa961c5c73d4f0e91c699297e55218f7d850a955dedd1270', NULL, '1993-03-16', 'Chemin des grangettes 11', '', 1208, ' genève', 0, '0786737337', '0757676737', 'M', 0),
(17, 'Muller', 'Océane', 'test1@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'test1 | 58d8c880ea43158d8c880ea46958d8c880ea49f', '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 1, '0223429999', '0793709999', 'F', 0),
(18, 'Lefevre', 'Daphnée', 'joel.marques@gmail.com', NULL, NULL, '1987-04-16', 'Jdjdnd', '', 1204, 'Genève', 0, '0789373767', '0786423434', 'F', 1),
(19, 'Dumas', 'Bertrand', 'tisba888@hotmail.com', NULL, NULL, '1990-12-20', 'fsffff dfdf 3333', 'feff', 1207, 'Genève', 0, '0223222222', '0222222222', 'M', 0),
(20, 'Faure', 'Nathan', '455454@gg.ch', NULL, NULL, '2017-04-04', 'ghgfhgfh', '', 1200, 'Genève', 0, '5454354354', '4545454544', 'M', 1),
(21, 'Gautier', 'Lucas', 'fdgg2g@dd.ch', NULL, NULL, '2017-04-03', 'hfghgfhgf', '', 1231, 'Conches', 0, '4543543545', '5453454353', 'M', 1),
(22, 'Denis', 'Nicolas', 'test5@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'test5 | 58cfd1631aa9c58cfd1631aad458cfd1631ab0d', '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 1, '0223429999', '0793709999', 'M', 0),
(23, 'Leroux', 'Maxime', 'tisba8@gmail.com', NULL, NULL, '1990-12-20', 'route de ddfiejer 5', '', 1208, 'Genève', 0, '0123132131', '0213123213', 'M', 0),
(25, 'Clerc', 'Samuel', 'test11@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'test11 | 58db9b48e1eb058db9b48e1ee858db9b48e1f20', '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 1, '0223429999', '0793709999', 'M', 0),
(26, 'Rey', 'Julien', 'test12@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'test12 | 58db9bbd7e59758db9bbd7e5cf58db9bbd7e605', '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 1, '0223429999', '0793709999', 'M', 0),
(27, 'Schmitt', 'Jérémy', 'toto@gmail.com', NULL, NULL, '1992-01-13', 'Route de Chênes 44', '', 1208, 'Genève', 0, '0223232323', '0782343422', 'M', 0),
(28, 'Gaillard', 'Laurie', 'tata@gmail.com', NULL, NULL, '1991-11-07', 'Rue de Rive', '', 1207, 'Genève', 0, '0228673844', '0794648595', 'F', 0),
(29, 'Martinez', 'Joel', 'joel.marquesd@gmail.com', NULL, '58ece46333f4658ece46333f7f58ece46333fb7', '1992-08-11', 'Chemin des deux-communes 11', '', 1226, 'Thônex', 0, '0789779987', '0788789987', 'M', 0),
(30, 'Cardoso', 'Stéphane', 'joel.marquesd@gmail.com', '6ec96e21cf18f1843cf2dd00f3af9af19cdc245ec37968934af09c59a24826323968e2392040c935695cda835681a37985220c807336dc20b4764808a0fc6581', NULL, '1992-04-11', 'Rue du rhône', '', 1036, ' sullens', 0, '0798787987', '7879897879', 'M', 0),
(31, 'Lamerti', 'Martin', 'joel.marquesd@gmail.com', NULL, '58edf631e206c58edf631e20a458edf631e20da', '1992-04-12', 'Jxjdjsk', '', 1227, 'Carouge ge', 0, '6767667676', '0467676676', 'M', 0),
(32, 'Gomes', 'Dany', 'danygomes@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'Gomes | 58ff049e1a6aa58ff049e1a6e158ff049e1a717', '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 1, '0223429999', '0793709999', 'M', 0),
(33, 'Jalley', 'Vincent', 'vincent2@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'Jalley | 58fdc0573be3c58fdc0573be7458fdc0573beaa', '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 1, '0223429999', '0793709999', 'M', 0),
(34, 'Bartolomei', 'Baptiste', 'baptiste2@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'Bartolomei | 58fdc3d134d0858fdc3d134d4058fdc3d134d77', '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 1, '0223429999', '0793709999', 'M', 0),
(35, 'Da Silva', 'Joel', 'Joel2@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'Da Silva | 58ff05ab864ea58ff05ab8652558ff05ab8655d', '1992-05-09', 'chemin des champignons', 'cp 44', 2147483647, 'Carouge', 1, '0223429999', '0793709999', 'M', 0),
(36, 'Da Silva', 'Joel', 'j@gprh.ch', NULL, '58fdc4e88845458fdc4e88848e58fdc4e8884c7', '1992-04-24', 'ch. des beaux-champs 5c', '', 1234, 'Vessy', 0, '0227888989', '0788766767', 'M', 0),
(37, 'Jalley', 'Vincent', 'v@gprh.ch', NULL, '58fdc520bd68658fdc520bd6bf58fdc520bd6f7', '1992-04-24', 'ch. des beaux-champs 5c', '', 1234, 'Vessy', 0, '0227897878', '0787878878', 'M', 0),
(38, 'Croft', 'Lara', 'l@gprh.ch', NULL, '58fdc575f30e158fdc575f311958fdc575f3150', '1992-04-24', 'ch. des beaux-champs 5c', '', 1234, 'Vessy', 0, '0228908989', '0223893898', 'F', 0),
(39, 'Gomes', 'Dany', 'dany.gomes.ifa@gmail.com', NULL, '58fdc714cfc1b58fdc714cfc5258fdc714cfc88', '1992-04-24', 'ch. des beaux champs 5c', '', 1234, 'Vessy', 0, '0228977878', '0787897878', 'M', 1),
(40, 'Alexandre', 'Dany', 'dany.gomes.ifa@gmail.com', 'd4c381f1b4d18932e8b18ecc1663f0454dbe5850510c4f01bd601dcc72bf7ab4166c7d95ad1879399a7e1e282190271636e93b8b5fb37267f8081ffbe27ccc9f', NULL, '1992-04-24', 'ch des beaux-champs 5c', '', 1234, 'Vessy', 0, '0788908998', '0899283893', 'M', 0),
(41, 'Marques da Silva', 'Joel', 'joel.marquesd@gmail.com', 'b7b6302a85410d5278908d14f5eabca671c050ae62dd138f3049f16e6ff8156e521fc081c7357fed3b89142d2af00b3aa47a98e73db7e3a9c60144215ba7cc93', NULL, '1992-07-11', 'Chemin des deux-communes 11', '', 1226, 'Thônex', 0, '0789797787', '0789789898', 'M', 0),
(42, 'Marques da Silva', 'Joel', 'joel.marquesd@gmail.com', '498ed6039107be48477b1797acf92962d97cebfd32b6e285189d51e30b52b167b8560cf5d0ff228b66cd1c06ef9ce07c5c573ea219ebe89346d6db35cb267c6d', NULL, '1992-08-11', 'Chemin des deux-communes 11', '', 1226, 'Thônex', 0, '0789798798', '0788789787', 'M', 0),
(43, 'Da Silva', 'Joel', 'employeur@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'Da Silva | 58ff051c4e5b058ff051c4e5e858ff051c4e61e', '1992-05-09', 'chemin des champignons', 'cp 44', 2147483647, 'Carouge', 1, '0223429999', '0793709999', 'M', 0),
(44, 'Bedonni', 'Jean-Pierre', 'employeur@gprh.ch', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'Bedonni | 58ff04786f2b058ff04786f2e858ff04786f31e', '1970-01-01', 'Rue de la batelle 5', NULL, 120555, 'Geneve', 1, '04', '08787976767676677', 'M', 0),
(45, 'Marques da silva', 'Joel', 'joel.marquesd@gmail.com', NULL, '58fe3d350869758fe3d35086cf58fe3d3508706', '1992-04-24', 'Chemin des deux-comunes', '', 1226, '   thônex', 0, '0576767676', '0787676673', 'M', 0),
(46, 'Bartolomei', 'Baptiste', 'baptiste.test7@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'Bartolomei | 58ff2be92301758ff2be92304e58ff2be923083', '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 1, '0223429999', '0793709999', 'M', 0),
(47, 'Bartolomei', 'Baptiste', 'baptiste.test8@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'Bartolomei | 58ff4b2d09fa858ff4b2d09fe058ff4b2d0a016', '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 1, '0223429999', '0793709999', 'M', 0),
(48, 'Bartolomei', 'Baptiste', 'baptiste.test9@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'Bartolomei | 58ff3421cc51758ff3421cc54f58ff3421cc585', '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 1, '0223429999', '0793709999', 'M', 0),
(49, 'Tisba', 'Tisba2', 'test@h.ch', NULL, '58ff249b489c758ff249b489ff58ff249b48a36', '1992-04-25', 'Route de chene', '', 1208, 'Genève', 0, '0222222222', '0788888888', 'M', 0),
(50, 'Pauline', 'Dupont', 'tisba888@hotmail.com', NULL, '58ff25344a99958ff25344a9d158ff25344aa09', '1992-04-25', 'dsfdsfdsf', '', 1200, 'Genève', 0, '0324324324', '0324324324', 'F', 0),
(51, 'testnom', 'testprenom', 'd@a.ch', NULL, '58ff283c3602858ff283c3605f58ff283c36096', '2018-01-01', 'test', '', 1281, 'Russin', 0, '0788888888', '8888888888', 'M', 1),
(52, 'test1§', 'test', 'h@jj.cj', NULL, '58ff28da7022f58ff28da7026858ff28da702a1', '2023-01-09', '12', '', 1281, 'Russin', 0, '0000000000', '0000000000', 'M', 1),
(53, 'Test', 'test', 'dsfdsfsd@hhh.ch', NULL, '58ff2d098b54658ff2d098b57d58ff2d098b5ba', '2023-01-02', 'gfdgfdg', '', 1208, 'Genève', 0, '0324343243', '0213214343', 'M', 0),
(54, 'Bartolomei', 'Baptiste', 'baptiste.test10@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'Bartolomei | 58ff3457101c158ff3457101f958ff34571022f', '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 1, '0223429999', '0793709999', 'M', 0),
(55, 'sdss', 'sss', 'a@dd.ch', NULL, '58ff336981b1058ff336981b4958ff336981b82', '1992-04-25', 'sss', '', 1208, 'Genève', 0, '2222222222', '2222222222', 'M', 1);

-- --------------------------------------------------------

--
-- Structure de la table `ccn_possede`
--

CREATE TABLE `ccn_possede` (
  `pos_dep_id` int(11) NOT NULL,
  `pos_per_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_possede`
--

INSERT INTO `ccn_possede` (`pos_dep_id`, `pos_per_id`) VALUES
(1, 2),
(1, 16),
(15, 3),
(15, 12),
(15, 13),
(15, 18),
(17, 6),
(19, 7),
(20, 4),
(20, 8),
(21, 9),
(22, 10),
(23, 11),
(27, 15),
(29, 20),
(29, 21),
(31, 19),
(60, 23),
(69, 27),
(70, 28),
(72, 29),
(72, 30),
(72, 31),
(75, 36),
(76, 37),
(76, 38),
(76, 39),
(76, 40),
(82, 42),
(85, 45),
(90, 50),
(90, 53),
(91, 49),
(93, 51),
(93, 52),
(93, 55);

-- --------------------------------------------------------

--
-- Structure de la table `ccn_pushinfo`
--

CREATE TABLE `ccn_pushinfo` (
  `pus_id` int(11) NOT NULL,
  `pus_nom` varchar(50) DEFAULT NULL,
  `pus_titre` varchar(100) DEFAULT NULL,
  `pus_message` varchar(255) DEFAULT NULL,
  `pus_sousTitre` varchar(150) DEFAULT NULL,
  `pus_ticket` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_pushinfo`
--

INSERT INTO `ccn_pushinfo` (`pus_id`, `pus_nom`, `pus_titre`, `pus_message`, `pus_sousTitre`, `pus_ticket`) VALUES
(1, 'Nouveau planning', 'Nouveau planning', 'Bonjour, votre nouveau planning est prêt !', NULL, NULL),
(2, 'Modification planning', 'Modification planning', 'Bonjour, votre planning a été modifié', NULL, NULL),
(3, 'Demande conge acceptee', 'Demande de congée acceptée', 'Bonjour, votre demande de congé a été acceptée', NULL, NULL),
(4, 'Demande conge refusee', 'Demande de congé refusée', 'Bonjour, votre demande de congé a été refusée', NULL, NULL),
(5, 'Demande modification acceptee', 'Modification de congé acceptée', 'Bonjour, votre demande de modification de congé a été acceptée', NULL, NULL),
(6, 'Demande modification refusee', 'Modification de congé refusée', 'Bonjour, votre demande de modification de congé a été refusée', NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `ccn_smartphoneinfo`
--

CREATE TABLE `ccn_smartphoneinfo` (
  `sma_per_id` int(11) NOT NULL,
  `sma_deviceToken` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_smartphoneinfo`
--

INSERT INTO `ccn_smartphoneinfo` (`sma_per_id`, `sma_deviceToken`) VALUES
(1, 'cte4X2rDr_o:APA91bHRLfwNW6_PE52HqHaW0XdGoj9rw4FBPYvqQDkGe6J--s5WjgO8_2AKrBA54vXjC8cnBp3a9GQ7PYROGQlxKSBmcQa5vN1ZKwyReIMGwBB68UxrWFSQkQsIpM1vdiL89xJungw7'),
(2, NULL),
(3, 'dH16u7jF_D0:APA91bE47O7TumBH0rehtDLNCR6Ynb-v3rmDx5Rpb8flO4xVRB1uIu_JyyMCBMt-8NzJpMDWhBxY57-x1j3CmCqs3dQHZ9RpIwEPpNV3B4qHKkERo1V1dvWQK1dt1HpstC5WX-k_4fCi'),
(4, 'dH16u7jF_D0:APA91bE47O7TumBH0rehtDLNCR6Ynb-v3rmDx5Rpb8flO4xVRB1uIu_JyyMCBMt-8NzJpMDWhBxY57-x1j3CmCqs3dQHZ9RpIwEPpNV3B4qHKkERo1V1dvWQK1dt1HpstC5WX-k_4fCi'),
(5, 'e2WUuXyt8Hs:APA91bFAQ-iElDHeQdbvsHWQ227BJV9fhLqfwcj03TxLrFqMLVjW1Cc0XdwRK6otSeOVDdAAe8gCCGqmI_UxlG5hoiVMRVeYUxAWxCbCugULMk3Rl92J-dQXBrkpetxjezV8NPxKm6Ed'),
(6, 'dRsSUw1DC6E:APA91bHXGu9lh0_glyt8zOC9-cr6JSp6D7G2PoHiKV_f8HJ4PzAyUKTeY5bQujpoqeyIL6uNBxBxRnD8qIcisClWmKLnkUBMiDJsHRkLwuhbycYf6RE5iMDDtPobEr-D1VGbwJO9M19_'),
(7, 'fCwX3ctQqaM:APA91bF-bZD7fyvJ6jlgqmGJqFq0_tCkOvBD2nkdlRklORPKJLusxtgtfldWcGnPoovi8WLCy1sSm4OtnSeNAu266vXCQ3RwfavWLSHxXJvQntCJOLZ6Nytb8h6m6COjVQsTT54R5iEs'),
(9, 'fzNP78W8soU:APA91bGGwnc64r0UZ4TNA2eNkpFo3gbO6Yi_cTXMnNInC3QiAYukaCKMajTfBvJZTMjMg7Yb3hMb0E4QFZBXcsKkd4TcMqsmw5qX1vtYtakL2d5XnT6mEUs68curAvinWtaQsL9T1Sd-'),
(30, NULL),
(40, NULL),
(41, NULL),
(42, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `ccn_travail`
--

CREATE TABLE `ccn_travail` (
  `tra_per_id` int(11) NOT NULL,
  `tra_hop_id` int(11) NOT NULL,
  `tra_valide` enum('non','oui','mod','maladie','accident','absent') NOT NULL DEFAULT 'non'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_travail`
--

INSERT INTO `ccn_travail` (`tra_per_id`, `tra_hop_id`, `tra_valide`) VALUES
(3, 1, 'mod'),
(3, 2, 'oui'),
(3, 3, 'absent'),
(3, 4, 'maladie'),
(3, 12, 'accident'),
(3, 13, 'oui'),
(3, 14, 'oui'),
(3, 15, 'oui'),
(3, 21, 'mod'),
(3, 28, 'oui'),
(3, 34, 'maladie'),
(3, 35, 'oui'),
(3, 36, 'oui'),
(3, 37, 'absent'),
(3, 41, 'mod'),
(3, 42, 'oui'),
(3, 43, 'mod'),
(3, 72, 'non'),
(3, 73, 'oui'),
(3, 77, 'non'),
(3, 78, 'mod'),
(3, 80, 'absent'),
(3, 82, 'oui'),
(3, 83, 'non'),
(4, 5, 'oui'),
(4, 6, 'oui'),
(4, 7, 'non'),
(4, 8, 'non'),
(4, 9, 'non'),
(4, 10, 'non'),
(4, 11, 'non'),
(4, 21, 'non'),
(4, 23, 'non'),
(4, 24, 'non'),
(4, 25, 'non'),
(4, 26, 'non'),
(4, 27, 'non'),
(5, 47, 'oui'),
(5, 48, 'oui'),
(5, 70, 'oui'),
(5, 71, 'non'),
(5, 72, 'non'),
(5, 73, 'non'),
(6, 35, 'non'),
(6, 36, 'non'),
(6, 41, 'non'),
(6, 42, 'non'),
(6, 43, 'non'),
(6, 44, 'non'),
(6, 45, 'non'),
(6, 46, 'non'),
(29, 56, 'non'),
(29, 57, 'non'),
(29, 84, 'non'),
(29, 85, 'non'),
(30, 50, 'non'),
(30, 51, 'non'),
(30, 60, 'non'),
(30, 61, 'non'),
(30, 62, 'non'),
(30, 63, 'non'),
(30, 66, 'non'),
(30, 74, 'non'),
(30, 75, 'non'),
(30, 76, 'non'),
(37, 86, 'non'),
(37, 87, 'non'),
(37, 88, 'non'),
(37, 89, 'non'),
(37, 90, 'non'),
(37, 91, 'non'),
(37, 92, 'non'),
(37, 93, 'non'),
(37, 94, 'non'),
(37, 95, 'non'),
(42, 113, 'non'),
(42, 114, 'non'),
(42, 115, 'non'),
(42, 116, 'non'),
(42, 117, 'non'),
(42, 118, 'non'),
(42, 119, 'non'),
(42, 120, 'non'),
(42, 121, 'non'),
(42, 122, 'non'),
(42, 123, 'non'),
(42, 124, 'non'),
(42, 125, 'non'),
(42, 136, 'oui'),
(42, 137, 'non'),
(42, 138, 'non'),
(42, 139, 'non'),
(45, 126, 'non'),
(45, 127, 'non'),
(45, 131, 'non'),
(45, 132, 'non'),
(45, 133, 'non'),
(45, 134, 'non'),
(45, 135, 'non'),
(49, 142, 'non'),
(49, 143, 'non'),
(49, 146, 'non'),
(49, 147, 'non'),
(49, 148, 'non'),
(49, 149, 'non'),
(49, 150, 'non'),
(50, 141, 'non');

-- --------------------------------------------------------

--
-- Structure de la table `ccn_travailmodifie`
--

CREATE TABLE `ccn_travailmodifie` (
  `tram_tra_per_id` int(11) NOT NULL,
  `tram_tra_hop_id` int(11) NOT NULL,
  `tram_heureDebut` datetime NOT NULL,
  `tram_heureFin` datetime NOT NULL,
  `tram_valide` tinyint(1) NOT NULL DEFAULT '0',
  `tram_dateModification` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_travailmodifie`
--

INSERT INTO `ccn_travailmodifie` (`tram_tra_per_id`, `tram_tra_hop_id`, `tram_heureDebut`, `tram_heureFin`, `tram_valide`, `tram_dateModification`) VALUES
(3, 1, '2017-01-17 12:00:00', '2017-01-17 17:00:00', 0, '2017-04-15 19:55:23'),
(3, 21, '2017-03-02 08:00:00', '2017-03-02 21:04:00', 0, '2017-04-15 20:00:42'),
(3, 41, '2017-03-08 00:00:00', '2017-03-08 03:17:00', 0, '2017-04-15 20:31:11'),
(3, 43, '2017-03-09 10:00:00', '2017-03-09 19:30:00', 0, '2017-04-20 00:45:50'),
(3, 78, '2017-03-15 20:00:00', '2017-03-15 21:00:00', 0, '2017-04-15 20:49:16');

-- --------------------------------------------------------

--
-- Structure de la table `ccn_typecontrat`
--

CREATE TABLE `ccn_typecontrat` (
  `typ_id` int(2) NOT NULL,
  `typ_nom` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_typecontrat`
--

INSERT INTO `ccn_typecontrat` (`typ_id`, `typ_nom`) VALUES
(1, 'Normal'),
(2, 'Apprentissage'),
(3, 'Personne externe');

-- --------------------------------------------------------

--
-- Structure de la table `ccn_validationmensuelle`
--

CREATE TABLE `ccn_validationmensuelle` (
  `val_id` int(11) NOT NULL,
  `val_per_id` int(11) NOT NULL,
  `val_mois` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_validationmensuelle`
--

INSERT INTO `ccn_validationmensuelle` (`val_id`, `val_per_id`, `val_mois`) VALUES
(1, 4, '2017-03-22'),
(2, 3, '0000-00-00'),
(3, 3, '2017-03-22'),
(4, 3, '0000-00-00'),
(5, 3, '2017-03-01'),
(6, 3, '2017-03-01'),
(7, 3, '2017-01-01'),
(8, 3, '2017-04-01'),
(9, 3, '2017-04-01'),
(10, 3, '2017-04-01'),
(11, 3, '2017-04-01'),
(12, 6, '2017-04-01'),
(13, 6, '2017-04-01'),
(14, 5, '2017-04-01'),
(15, 5, '2017-04-01'),
(16, 5, '2017-04-01'),
(17, 3, '2017-04-01'),
(18, 3, '2017-04-01'),
(19, 3, '2017-04-01'),
(20, 3, '2017-04-01');

-- --------------------------------------------------------

--
-- Structure de la table `ccn_valvuehoraire`
--

CREATE TABLE `ccn_valvuehoraire` (
  `valho_per_id` int(11) NOT NULL,
  `valho_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_valvuehoraire`
--

INSERT INTO `ccn_valvuehoraire` (`valho_per_id`, `valho_date`) VALUES
(1, '2017-04-10 09:26:35'),
(3, '2017-04-23 02:43:04'),
(4, '2017-04-19 14:44:10'),
(5, '2017-04-20 12:50:27'),
(6, '2017-04-10 01:01:22'),
(7, '2017-04-18 16:43:52'),
(9, '2017-04-11 16:08:48'),
(30, '2017-04-12 22:34:16'),
(40, '2017-04-25 10:26:32'),
(41, '2017-04-24 12:03:02'),
(42, '2017-04-25 10:27:54');

--
-- Index pour les tables exportées
--

--
-- Index pour la table `ccn_absence`
--
ALTER TABLE `ccn_absence`
  ADD PRIMARY KEY (`abs_id`);

--
-- Index pour la table `ccn_appartient`
--
ALTER TABLE `ccn_appartient`
  ADD PRIMARY KEY (`app_eta_id`,`app_per_id`),
  ADD KEY `fk_Etablissement_has_Personne_Personne1_idx` (`app_per_id`),
  ADD KEY `fk_Etablissement_has_Personne_Etablissement_idx` (`app_eta_id`);

--
-- Index pour la table `ccn_contient`
--
ALTER TABLE `ccn_contient`
  ADD KEY `con_jou_id` (`con_jou_id`),
  ADD KEY `con_hpr_id` (`con_hpr_id`);

--
-- Index pour la table `ccn_contrat`
--
ALTER TABLE `ccn_contrat`
  ADD PRIMARY KEY (`con_per_id`,`con_hor_id`,`con_typ_id`),
  ADD KEY `fk_ccn_contrat_ccn_personne1_idx` (`con_per_id`),
  ADD KEY `fk_ccn_contrat_ccn_horairecontrat1_idx` (`con_hor_id`),
  ADD KEY `fk_ccn_contrat_ccn_typecontrat1_idx` (`con_typ_id`);

--
-- Index pour la table `ccn_demandepersonne`
--
ALTER TABLE `ccn_demandepersonne`
  ADD PRIMARY KEY (`dpe_id`),
  ADD KEY `_DemandePersonne_Personne_id` (`dpe_per_id`) USING BTREE,
  ADD KEY `DemandePersonne_abs_id` (`dpe_abs_id`) USING BTREE;

--
-- Index pour la table `ccn_departement`
--
ALTER TABLE `ccn_departement`
  ADD PRIMARY KEY (`dep_id`,`dep_eta_id`),
  ADD KEY `fk_Departement_Etablissement1_idx` (`dep_eta_id`);

--
-- Index pour la table `ccn_etablissement`
--
ALTER TABLE `ccn_etablissement`
  ADD PRIMARY KEY (`eta_id`);

--
-- Index pour la table `ccn_fermetureinfo`
--
ALTER TABLE `ccn_fermetureinfo`
  ADD PRIMARY KEY (`fer_id`,`fer_Eta_id`),
  ADD KEY `fk_InfoFermeture_Etablissement1_idx` (`fer_Eta_id`);

--
-- Index pour la table `ccn_horairecontrat`
--
ALTER TABLE `ccn_horairecontrat`
  ADD PRIMARY KEY (`hor_id`);

--
-- Index pour la table `ccn_horairepersonne`
--
ALTER TABLE `ccn_horairepersonne`
  ADD PRIMARY KEY (`hop_id`),
  ADD KEY `hor_abs_id` (`hop_abs_id`),
  ADD KEY `hop_abs_id` (`hop_abs_id`),
  ADD KEY `hop_abs_id_2` (`hop_abs_id`);

--
-- Index pour la table `ccn_horairepreconfig`
--
ALTER TABLE `ccn_horairepreconfig`
  ADD PRIMARY KEY (`hpr_id`),
  ADD KEY `hpr_dep_id` (`hpr_dep_id`);

--
-- Index pour la table `ccn_jourpreconfig`
--
ALTER TABLE `ccn_jourpreconfig`
  ADD PRIMARY KEY (`jou_id`);

--
-- Index pour la table `ccn_lienouverture`
--
ALTER TABLE `ccn_lienouverture`
  ADD PRIMARY KEY (`lie_ouv_id`,`lie_oui_id`),
  ADD KEY `fk_etablissemnet_ouv_info` (`lie_oui_id`);

--
-- Index pour la table `ccn_maladieaccident`
--
ALTER TABLE `ccn_maladieaccident`
  ADD PRIMARY KEY (`mac_id`),
  ADD KEY `mac_per_id` (`mac_per_id`),
  ADD KEY `mac_tra_id` (`mac_tra_id`);

--
-- Index pour la table `ccn_ouverture`
--
ALTER TABLE `ccn_ouverture`
  ADD PRIMARY KEY (`ouv_id`),
  ADD KEY `ouv_eta_id` (`ouv_eta_id`);

--
-- Index pour la table `ccn_ouvertureinfo`
--
ALTER TABLE `ccn_ouvertureinfo`
  ADD PRIMARY KEY (`oui_id`);

--
-- Index pour la table `ccn_personne`
--
ALTER TABLE `ccn_personne`
  ADD PRIMARY KEY (`per_id`);

--
-- Index pour la table `ccn_possede`
--
ALTER TABLE `ccn_possede`
  ADD PRIMARY KEY (`pos_dep_id`,`pos_per_id`),
  ADD KEY `fk_ccn_possede_ccn_departement1_idx` (`pos_dep_id`),
  ADD KEY `fk_ccn_possede_ccn_personne1_idx` (`pos_per_id`);

--
-- Index pour la table `ccn_pushinfo`
--
ALTER TABLE `ccn_pushinfo`
  ADD PRIMARY KEY (`pus_id`);

--
-- Index pour la table `ccn_smartphoneinfo`
--
ALTER TABLE `ccn_smartphoneinfo`
  ADD PRIMARY KEY (`sma_per_id`),
  ADD KEY `fk_SmarphoneInfo_Personne_idx` (`sma_per_id`);

--
-- Index pour la table `ccn_travail`
--
ALTER TABLE `ccn_travail`
  ADD PRIMARY KEY (`tra_per_id`,`tra_hop_id`),
  ADD KEY `fk_ccn_travail_ccn_personne1_idx` (`tra_per_id`),
  ADD KEY `fk_ccn_travail_ccn_horairepersonne_idx` (`tra_hop_id`);

--
-- Index pour la table `ccn_travailmodifie`
--
ALTER TABLE `ccn_travailmodifie`
  ADD PRIMARY KEY (`tram_tra_per_id`,`tram_tra_hop_id`),
  ADD KEY `travailModifie_tra_hop_id` (`tram_tra_per_id`) USING BTREE,
  ADD KEY `travailModfie_tra_per_id` (`tram_tra_per_id`) USING BTREE,
  ADD KEY `fk hop` (`tram_tra_hop_id`);

--
-- Index pour la table `ccn_typecontrat`
--
ALTER TABLE `ccn_typecontrat`
  ADD PRIMARY KEY (`typ_id`);

--
-- Index pour la table `ccn_validationmensuelle`
--
ALTER TABLE `ccn_validationmensuelle`
  ADD PRIMARY KEY (`val_id`),
  ADD KEY `val_per_id` (`val_per_id`) USING BTREE;

--
-- Index pour la table `ccn_valvuehoraire`
--
ALTER TABLE `ccn_valvuehoraire`
  ADD PRIMARY KEY (`valho_per_id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `ccn_absence`
--
ALTER TABLE `ccn_absence`
  MODIFY `abs_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT pour la table `ccn_demandepersonne`
--
ALTER TABLE `ccn_demandepersonne`
  MODIFY `dpe_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;
--
-- AUTO_INCREMENT pour la table `ccn_departement`
--
ALTER TABLE `ccn_departement`
  MODIFY `dep_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;
--
-- AUTO_INCREMENT pour la table `ccn_etablissement`
--
ALTER TABLE `ccn_etablissement`
  MODIFY `eta_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;
--
-- AUTO_INCREMENT pour la table `ccn_fermetureinfo`
--
ALTER TABLE `ccn_fermetureinfo`
  MODIFY `fer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;
--
-- AUTO_INCREMENT pour la table `ccn_horairepersonne`
--
ALTER TABLE `ccn_horairepersonne`
  MODIFY `hop_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=151;
--
-- AUTO_INCREMENT pour la table `ccn_horairepreconfig`
--
ALTER TABLE `ccn_horairepreconfig`
  MODIFY `hpr_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT pour la table `ccn_jourpreconfig`
--
ALTER TABLE `ccn_jourpreconfig`
  MODIFY `jou_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;
--
-- AUTO_INCREMENT pour la table `ccn_maladieaccident`
--
ALTER TABLE `ccn_maladieaccident`
  MODIFY `mac_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
--
-- AUTO_INCREMENT pour la table `ccn_ouverture`
--
ALTER TABLE `ccn_ouverture`
  MODIFY `ouv_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT pour la table `ccn_ouvertureinfo`
--
ALTER TABLE `ccn_ouvertureinfo`
  MODIFY `oui_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;
--
-- AUTO_INCREMENT pour la table `ccn_personne`
--
ALTER TABLE `ccn_personne`
  MODIFY `per_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;
--
-- AUTO_INCREMENT pour la table `ccn_pushinfo`
--
ALTER TABLE `ccn_pushinfo`
  MODIFY `pus_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT pour la table `ccn_validationmensuelle`
--
ALTER TABLE `ccn_validationmensuelle`
  MODIFY `val_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `ccn_appartient`
--
ALTER TABLE `ccn_appartient`
  ADD CONSTRAINT `fk_Etablissement_has_Personne_Etablissement` FOREIGN KEY (`app_eta_id`) REFERENCES `ccn_etablissement` (`eta_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_Etablissement_has_Personne_Personne1` FOREIGN KEY (`app_per_id`) REFERENCES `ccn_personne` (`per_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `ccn_contient`
--
ALTER TABLE `ccn_contient`
  ADD CONSTRAINT `fk_horairepreconfig` FOREIGN KEY (`con_hpr_id`) REFERENCES `ccn_horairepreconfig` (`hpr_id`),
  ADD CONSTRAINT `fk_jourpreconfig` FOREIGN KEY (`con_jou_id`) REFERENCES `ccn_jourpreconfig` (`jou_id`);

--
-- Contraintes pour la table `ccn_contrat`
--
ALTER TABLE `ccn_contrat`
  ADD CONSTRAINT `fk_ccn_contrat_ccn_horairecontrat1_idx` FOREIGN KEY (`con_hor_id`) REFERENCES `ccn_horairecontrat` (`hor_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_ccn_contrat_ccn_personne1_idx` FOREIGN KEY (`con_per_id`) REFERENCES `ccn_personne` (`per_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_ccn_contrat_ccn_typecontrat1_idx` FOREIGN KEY (`con_typ_id`) REFERENCES `ccn_typecontrat` (`typ_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `ccn_demandepersonne`
--
ALTER TABLE `ccn_demandepersonne`
  ADD CONSTRAINT `fk_DemandePersonne_Absence` FOREIGN KEY (`dpe_abs_id`) REFERENCES `ccn_absence` (`abs_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_DemandePersonne_Personne` FOREIGN KEY (`dpe_per_id`) REFERENCES `ccn_personne` (`per_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `ccn_departement`
--
ALTER TABLE `ccn_departement`
  ADD CONSTRAINT `fk_Departement_Etablissement1` FOREIGN KEY (`dep_eta_id`) REFERENCES `ccn_etablissement` (`eta_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `ccn_fermetureinfo`
--
ALTER TABLE `ccn_fermetureinfo`
  ADD CONSTRAINT `fk_InfoFermeture_Etablissement1` FOREIGN KEY (`fer_Eta_id`) REFERENCES `ccn_etablissement` (`eta_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `ccn_horairepersonne`
--
ALTER TABLE `ccn_horairepersonne`
  ADD CONSTRAINT `ccn_horairepersonne_ibfk_12` FOREIGN KEY (`hop_abs_id`) REFERENCES `ccn_absence` (`abs_id`);

--
-- Contraintes pour la table `ccn_horairepreconfig`
--
ALTER TABLE `ccn_horairepreconfig`
  ADD CONSTRAINT `fk_horairepreconfig_departement` FOREIGN KEY (`hpr_dep_id`) REFERENCES `ccn_departement` (`dep_id`);

--
-- Contraintes pour la table `ccn_lienouverture`
--
ALTER TABLE `ccn_lienouverture`
  ADD CONSTRAINT `fk_etablissement_ouv` FOREIGN KEY (`lie_ouv_id`) REFERENCES `ccn_ouverture` (`ouv_id`),
  ADD CONSTRAINT `fk_etablissemnet_ouv_info` FOREIGN KEY (`lie_oui_id`) REFERENCES `ccn_ouvertureinfo` (`oui_id`);

--
-- Contraintes pour la table `ccn_maladieaccident`
--
ALTER TABLE `ccn_maladieaccident`
  ADD CONSTRAINT `mac_per_id` FOREIGN KEY (`mac_per_id`) REFERENCES `ccn_personne` (`per_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `mac_tra_id` FOREIGN KEY (`mac_tra_id`) REFERENCES `ccn_travail` (`tra_hop_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `ccn_ouverture`
--
ALTER TABLE `ccn_ouverture`
  ADD CONSTRAINT `fk_etablissemnet_ouv` FOREIGN KEY (`ouv_eta_id`) REFERENCES `ccn_etablissement` (`eta_id`);

--
-- Contraintes pour la table `ccn_possede`
--
ALTER TABLE `ccn_possede`
  ADD CONSTRAINT `fk_ccn_possede_ccn_departement1` FOREIGN KEY (`pos_dep_id`) REFERENCES `ccn_departement` (`dep_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_ccn_possede_ccn_personne1` FOREIGN KEY (`pos_per_id`) REFERENCES `ccn_personne` (`per_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `ccn_smartphoneinfo`
--
ALTER TABLE `ccn_smartphoneinfo`
  ADD CONSTRAINT `fk_SmarphoneInfo_Personne` FOREIGN KEY (`sma_per_id`) REFERENCES `ccn_personne` (`per_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `ccn_travail`
--
ALTER TABLE `ccn_travail`
  ADD CONSTRAINT `fk_ccn_travail_ccn_horairepersonne_idx` FOREIGN KEY (`tra_hop_id`) REFERENCES `ccn_horairepersonne` (`hop_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_ccn_travail_ccn_personne1_idx` FOREIGN KEY (`tra_per_id`) REFERENCES `ccn_personne` (`per_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `ccn_travailmodifie`
--
ALTER TABLE `ccn_travailmodifie`
  ADD CONSTRAINT `fk hop` FOREIGN KEY (`tram_tra_hop_id`) REFERENCES `ccn_horairepersonne` (`hop_id`),
  ADD CONSTRAINT `fk pers` FOREIGN KEY (`tram_tra_per_id`) REFERENCES `ccn_personne` (`per_id`);

--
-- Contraintes pour la table `ccn_validationmensuelle`
--
ALTER TABLE `ccn_validationmensuelle`
  ADD CONSTRAINT `validMen_pers_id` FOREIGN KEY (`val_per_id`) REFERENCES `ccn_personne` (`per_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `ccn_valvuehoraire`
--
ALTER TABLE `ccn_valvuehoraire`
  ADD CONSTRAINT `valho_per-id` FOREIGN KEY (`valho_per_id`) REFERENCES `ccn_personne` (`per_id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
