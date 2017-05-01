-- phpMyAdmin SQL Dump
-- version 4.6.6
-- https://www.phpmyadmin.net/
--
-- Client :  h2mysql17
-- Généré le :  Jeu 13 Avril 2017 à 17:41
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
(9, 'Autre');

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
(1, 4),
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
(49, 26);

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
(1, 2);

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
('2005-04-12', '0000-00-00', NULL, 31, 1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `ccn_demande`
--

CREATE TABLE `ccn_demande` (
  `dem_id` int(11) NOT NULL,
  `dem_nom` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_demande`
--

INSERT INTO `ccn_demande` (`dem_id`, `dem_nom`) VALUES
(1, 'Vacances / Férié'),
(2, 'Congé de formation'),
(3, 'Congé paternité'),
(4, 'Congé sans solde'),
(5, 'Récupération'),
(6, 'Autre demande');

-- --------------------------------------------------------

--
-- Structure de la table `ccn_demandepersonne`
--

CREATE TABLE `ccn_demandepersonne` (
  `dpe_id` int(11) NOT NULL,
  `dpe_dem_id` int(11) NOT NULL,
  `dpe_per_id` int(11) NOT NULL,
  `dpe_dateDebut` date NOT NULL,
  `dpe_dateFin` date NOT NULL,
  `dpe_motif` varchar(250) DEFAULT NULL,
  `dpe_statut` enum('new','accept','refuse','modify','modifyAccept','modifyRefuse') NOT NULL DEFAULT 'new'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_demandepersonne`
--

INSERT INTO `ccn_demandepersonne` (`dpe_id`, `dpe_dem_id`, `dpe_per_id`, `dpe_dateDebut`, `dpe_dateFin`, `dpe_motif`, `dpe_statut`) VALUES
(1, 1, 3, '2017-03-01', '2017-03-04', 'Salut', 'accept'),
(2, 3, 3, '2017-05-10', '2017-05-20', NULL, 'modifyAccept'),
(3, 2, 3, '2017-03-26', '2017-03-24', '', 'modify'),
(4, 5, 3, '2017-07-10', '2017-07-20', NULL, 'modifyRefuse'),
(5, 4, 3, '2017-03-25', '2017-03-26', 'asasaaasas', 'new'),
(6, 6, 3, '2017-04-01', '2017-04-04', 'J\'en ai marre', 'modify'),
(7, 1, 3, '2017-02-01', '2017-02-03', NULL, 'new'),
(8, 1, 3, '2017-03-09', '2017-03-15', NULL, 'new'),
(9, 1, 3, '2017-03-10', '2017-03-20', 'Salut', 'new'),
(10, 1, 3, '2017-02-01', '2017-01-31', NULL, 'new'),
(11, 1, 3, '2017-02-02', '2017-02-03', NULL, 'new'),
(12, 4, 3, '2017-03-08', '2017-03-09', NULL, 'accept'),
(13, 1, 5, '2017-03-07', '2017-03-24', '', 'new'),
(14, 1, 5, '2017-03-25', '2017-04-07', '', 'modify'),
(15, 2, 4, '2017-03-18', '2017-03-26', NULL, 'new'),
(16, 2, 4, '2017-03-13', '2017-03-07', NULL, 'new'),
(17, 3, 5, '2017-03-10', '2017-03-25', '', 'modify'),
(18, 2, 4, '2017-05-15', '2017-05-21', NULL, 'accept'),
(19, 1, 5, '2017-03-14', '2017-03-28', NULL, 'new'),
(20, 1, 5, '2017-03-28', '2017-03-08', NULL, 'new'),
(21, 2, 5, '2017-03-01', '2017-03-10', NULL, 'new'),
(22, 1, 5, '2017-03-29', '2017-03-31', NULL, 'new'),
(23, 1, 5, '2017-03-31', '2017-03-29', NULL, 'new'),
(24, 1, 5, '2017-03-30', '2017-03-31', NULL, 'new'),
(25, 1, 5, '2017-03-30', '2017-03-30', NULL, 'new'),
(26, 2, 5, '2017-03-30', '2017-03-31', NULL, 'new'),
(27, 3, 5, '2017-03-30', '2017-03-31', NULL, 'new'),
(28, 4, 5, '2017-03-30', '2017-03-31', NULL, 'new'),
(29, 5, 5, '2017-03-30', '2017-03-31', NULL, 'new'),
(30, 6, 5, '2017-03-30', '2017-03-31', NULL, 'new'),
(31, 4, 4, '2017-04-14', '2017-04-29', '', 'modify'),
(32, 1, 5, '2017-03-21', '2017-03-24', NULL, 'new'),
(33, 1, 5, '2017-03-07', '2017-03-09', NULL, 'new'),
(34, 1, 5, '2017-03-07', '2017-03-09', NULL, 'new'),
(35, 5, 5, '2017-03-01', '2017-03-03', NULL, 'new'),
(36, 1, 5, '2017-03-15', '2017-03-17', NULL, 'new'),
(37, 1, 5, '2017-03-01', '2017-03-02', NULL, 'new'),
(38, 1, 5, '2017-03-06', '2017-03-12', NULL, 'new'),
(39, 1, 5, '2017-03-31', '2017-04-02', NULL, 'new'),
(40, 1, 5, '2017-04-03', '2017-04-05', NULL, 'new'),
(41, 1, 5, '2017-03-15', '2017-03-18', NULL, 'new'),
(42, 1, 5, '2017-03-21', '2017-03-22', NULL, 'new'),
(43, 2, 4, '2017-04-14', '2017-05-19', NULL, 'new'),
(44, 2, 3, '2017-03-29', '2017-04-08', NULL, 'new'),
(45, 2, 4, '2017-04-10', '2017-04-01', NULL, 'new'),
(46, 1, 4, '2017-04-01', '2017-04-09', NULL, 'new'),
(47, 1, 5, '2017-04-04', '2017-04-05', NULL, 'new'),
(48, 4, 5, '2017-04-12', '2017-04-20', '', 'modify'),
(49, 1, 7, '2017-04-06', '2017-04-06', NULL, 'new'),
(50, 1, 7, '2017-04-06', '2017-04-06', 'Test', 'new'),
(51, 6, 7, '2017-04-08', '2017-04-10', 'Test', 'new'),
(52, 3, 7, '2017-04-07', '2017-04-07', NULL, 'new'),
(53, 4, 7, '2017-04-07', '2017-04-07', NULL, 'new'),
(54, 2, 6, '2017-04-15', '2017-04-17', NULL, 'new'),
(55, 1, 6, '2017-05-26', '2017-05-30', '', 'modify'),
(56, 1, 5, '2017-04-27', '2017-04-30', NULL, 'new'),
(57, 2, 30, '2017-04-13', '2017-04-28', NULL, 'new'),
(58, 2, 4, '2017-04-24', '2017-04-30', NULL, 'new'),
(59, 4, 6, '2017-04-15', '2017-04-19', NULL, 'new');

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
(74, 'Bar', 50, 3);

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
  `eta_nbHeure` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_etablissement`
--

INSERT INTO `ccn_etablissement` (`eta_id`, `eta_nom`, `eta_adresse`, `eta_telReservation`, `eta_telDirection`, `eta_email`, `eta_siteWeb`, `eta_adresseInfo`, `eta_codePostal`, `eta_localite`, `eta_nbHeure`) VALUES
(1, 'Le Château d\'If', 'Route de Thonon 51', '+41 22 752 12 11', '0795093454', 'contact@chateaudif.ch', 'www.chateaudif.ch', 'CP 166', 1222, 'Vésenaz', 45),
(38, 'xxxx', 'xxxx', '0227521211', '0795093454', 'contact@chateaudif.ch', 'www.chteaudif.ch', '', 1222, 'Vésenaz', NULL),
(39, 'fdsa', 'fasfsa', '0779878789', '0789978798', 'joel.marquesd@gmail.com', 'www.site.ch', 'fasfsa', 1225, 'Thônexx', 45),
(40, 'Le Château d&#39;If', '51 Route de thonon', '0227521211', '0227521211', '123@frg.ch', '', '', 1222, 've', 45),
(41, 'rfreg', 'frre', '0222222222', '0232323232', 'fdfd@g.ch', '', '', 1003, 'Lausanne', 42),
(42, 'rfreg', 'frre', '0222222222', '0232323232', 'fdfd@g.ch', '', '', 1003, 'Lausanne', 42),
(43, 'rfreg', 'frre', '0222222222', '0232323232', 'fdfd@g.ch', '', '', 1003, 'Lausanne', 42),
(44, 'fdgdgdf', 'dfgfd', '0222222222', '0222222222', 'efewe@ff.ch', '', '', 1003, 'Lausanne', 42),
(45, 'fdgdgdf', 'dfgfd', '0222222222', '0222222222', 'efewe@ff.ch', '', '', 1003, 'Lausanne', 42),
(46, 'test5', 'teretret', '0212121212', '0112121212', 'tisba@gmail.com', '', '', 1207, 'Genève', 43),
(47, 'regere', 'tgtgtrt', '0222232323', '0232323232', 'tdfrf@dff.ch', '', 'trtrtrzt', 1200, 'Genève', 45),
(48, 'fgfdg', 'gfgdf', '0232323232', '0232323232', 'dsfd@gg.ch', '', '', 1003, 'Lausanne', 43),
(49, 'efdfgfd', 'fdgf', '0232323232', '0232323232', 'ffdgfg@gg.ch', '', '', 1003, 'Lausanne', 45),
(50, 'fsda', 'fdsa', '0789978987', '0789779889', 'j@gmail.com', '', '', 1226, 'Thônex', 45);

-- --------------------------------------------------------
--
-- Index pour la table `ccn_etablissement`
--
ALTER TABLE `ccn_etablissement`
  ADD PRIMARY KEY (`eta_id`);

--
-- AUTO_INCREMENT pour la table `ccn_etablissement`
--
ALTER TABLE `ccn_etablissement`
  MODIFY `eta_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
  
--
-- Structure de la table `ccn_ouverture`
--

CREATE TABLE IF NOT EXISTS `ccn_ouverture` (
  `ouv_id` int(11) NOT NULL,
  `ouv_nom` varchar(80) NOT NULL,
  `ouv_dateDebut` date DEFAULT NULL,
  `ouv_dateFin` date DEFAULT NULL,
  `ouv_base` int(11) NOT NULL,
  `ouv_eta_id` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_ouverture`
--

INSERT INTO `ccn_ouverture` (`ouv_id`, `ouv_nom`, `ouv_dateDebut`, `ouv_dateFin`, `ouv_base`, `ouv_eta_id`) VALUES
(1, 'Semaine de base', NULL, NULL, 1, 1),
(2, 'Période été', '2017-06-01', '2017-09-01', 0, 1);

--
-- Index pour les tables exportées
--

--
-- Index pour la table `ccn_ouverture`
--
ALTER TABLE `ccn_ouverture`
  ADD PRIMARY KEY (`ouv_id`),
  ADD KEY `ouv_eta_id` (`ouv_eta_id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `ccn_ouverture`
--
ALTER TABLE `ccn_ouverture`
  MODIFY `ouv_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `ccn_ouverture`
--
ALTER TABLE `ccn_ouverture`
  ADD CONSTRAINT `fk_etablissemnet_ouv` FOREIGN KEY (`ouv_eta_id`) REFERENCES `ccn_etablissement` (`eta_id`);


--
-- Structure de la table `ccn_ouvertureinfo`
--

CREATE TABLE IF NOT EXISTS `ccn_ouvertureinfo` (
  `oui_id` int(11) NOT NULL,
  `oui_jour` int(20) DEFAULT NULL,
  `oui_matinDebut` time NULL DEFAULT NULL,
  `oui_matinFin` time NULL DEFAULT NULL,
  `oui_soirDebut` time NULL DEFAULT NULL,
  `oui_soirFin` time NULL DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_ouvertureinfo`
--

INSERT INTO `ccn_ouvertureinfo` (`oui_id`, `oui_jour`, `oui_matinDebut`, `oui_matinFin`, `oui_soirDebut`, `oui_soirFin`) VALUES
(1, 1, '2017-04-09 05:00:00', NULL, NULL, '2017-04-09 21:30:59'),
(2, 2, '2017-04-10 05:00:00', NULL, NULL, '2017-04-10 21:30:59'),
(3, 3, '2017-04-12 05:00:00', NULL, NULL, '2017-04-12 21:30:59'),
(4, 4, '2017-04-11 05:00:00', NULL, NULL, '2017-04-11 21:30:59'),
(5, 5, '2017-04-13 05:00:00', NULL, NULL, '2017-04-13 21:30:59'),
(6, 6, '2017-04-15 05:00:00', NULL, NULL, '2017-04-15 21:30:59'),
(7, 0, '2017-04-14 05:00:00', NULL, NULL, '2017-04-14 21:30:59'),
(8, 1, '2017-04-09 05:00:00', NULL, NULL, '2017-04-09 21:30:28'),
(9, 2, '2017-04-10 05:00:00', '2017-04-10 11:00:28', '2017-04-10 13:00:28', '2017-04-10 21:30:28'),
(10, 3, '2017-04-11 05:00:00', '2017-04-11 11:00:28', '2017-04-11 13:00:28', '2017-04-11 21:30:28'),
(11, 4, '2017-04-12 05:00:00', NULL, NULL, '2017-04-12 21:30:28'),
(12, 5, '2017-04-13 05:00:00', '2017-04-13 11:00:28', '2017-04-13 13:00:28', '2017-04-13 21:30:28'),
(13, 6, '2017-04-14 05:00:00', '2017-04-14 11:00:28', '2017-04-14 13:00:28', '2017-04-14 21:30:28'),
(14, 0, '2017-04-15 05:00:00', NULL, NULL, '2017-04-15 21:30:28'),
(15, 2, '2017-04-14 05:00:00', '2017-04-14 11:00:28', '2017-04-14 13:00:28', '2017-04-14 21:30:28'),
(16, 5, '2017-04-14 05:00:00', '2017-04-14 11:00:28', '2017-04-14 16:00:28', '2017-04-14 21:30:28');

--
-- Index pour les tables exportées
--

--
-- Index pour la table `ccn_ouvertureinfo`
--
ALTER TABLE `ccn_ouvertureinfo`
  ADD PRIMARY KEY (`oui_id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `ccn_ouvertureinfo`
--
ALTER TABLE `ccn_ouvertureinfo`
  MODIFY `oui_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=17;

--
-- Structure de la table `ccn_lienouverture`
--

CREATE TABLE IF NOT EXISTS `ccn_lienouverture` (
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
(2, 16);

--
-- Index pour les tables exportées
--

--
-- Index pour la table `ccn_lienouverture`
--
ALTER TABLE `ccn_lienouverture`
  ADD PRIMARY KEY (`lie_ouv_id`,`lie_oui_id`),
  ADD KEY `fk_etablissemnet_ouv_info` (`lie_oui_id`);

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `ccn_lienouverture`
--
ALTER TABLE `ccn_lienouverture`
  ADD CONSTRAINT `fk_etablissement_ouv` FOREIGN KEY (`lie_ouv_id`) REFERENCES `ccn_ouverture` (`ouv_id`),
  ADD CONSTRAINT `fk_etablissemnet_ouv_info` FOREIGN KEY (`lie_oui_id`) REFERENCES `ccn_ouvertureinfo` (`oui_id`);


--
-- Structure de la table `ccn_fermetureinfo`
--

CREATE TABLE `ccn_fermetureinfo` (
  `fer_id` int(11) NOT NULL,
  `fer_date` date DEFAULT NULL,
  `fer_Eta_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_fermetureinfo`
--

INSERT INTO `ccn_fermetureinfo` (`fer_id`, `fer_date`, `fer_Eta_id`) VALUES
(14, '2016-05-20', 38),
(15, '2017-02-07', 39),
(16, '2017-02-06', 39),
(17, '2017-02-08', 39),
(18, '2017-02-09', 39),
(19, '2017-02-10', 39),
(20, '2017-02-11', 39),
(21, '2017-02-12', 39),
(22, '2017-02-13', 39),
(23, '2017-02-14', 39),
(24, '2017-02-01', 40),
(25, '2017-02-06', 40),
(26, '2017-02-07', 40),
(27, '2017-02-08', 40),
(28, '2017-02-09', 40),
(29, '2017-02-10', 40),
(30, '2017-02-11', 40),
(31, '2017-02-12', 40),
(32, '2017-02-13', 40),
(33, '2017-02-14', 40),
(34, '2017-02-01', 40),
(35, '2017-02-02', 40),
(36, '2017-02-03', 40),
(37, '2017-02-05', 40),
(38, '2017-02-04', 40),
(39, '2017-02-06', 40),
(40, '2017-02-07', 40),
(41, '2017-02-08', 40),
(42, '2017-02-07', 40),
(43, '2017-02-08', 40),
(44, '2017-02-09', 40),
(45, '2017-02-10', 40),
(46, '2017-02-12', 40),
(47, '2017-02-11', 40),
(48, '2017-02-13', 40),
(49, '2017-02-14', 40),
(50, '2017-03-13', 41),
(51, '2017-03-28', 41),
(52, '2017-03-29', 41),
(53, '2017-04-01', 41),
(54, '2017-03-30', 41),
(55, '2017-03-31', 41),
(56, '2017-04-02', 41),
(57, '2017-04-04', 41),
(58, '2017-04-03', 41),
(59, '2017-04-05', 41),
(60, '2017-04-06', 41),
(61, '2017-04-07', 41),
(62, '2017-04-09', 41),
(63, '2017-04-08', 41),
(64, '2017-04-10', 41),
(65, '2017-04-11', 41),
(66, '2017-03-13', 42),
(67, '2017-03-28', 42),
(68, '2017-03-29', 42),
(69, '2017-03-30', 42),
(70, '2017-03-31', 42),
(71, '2017-04-01', 42),
(72, '2017-04-02', 42),
(73, '2017-04-03', 42),
(74, '2017-04-05', 42),
(75, '2017-04-04', 42),
(76, '2017-04-06', 42),
(77, '2017-04-07', 42),
(78, '2017-04-08', 42),
(79, '2017-04-09', 42),
(80, '2017-04-10', 42),
(81, '2017-04-11', 42),
(82, '2017-03-13', 43),
(83, '2017-03-29', 43),
(84, '2017-03-28', 43),
(85, '2017-03-30', 43),
(86, '2017-03-31', 43),
(87, '2017-04-02', 43),
(88, '2017-04-01', 43),
(89, '2017-04-04', 43),
(90, '2017-04-03', 43),
(91, '2017-04-05', 43),
(92, '2017-04-06', 43),
(93, '2017-04-08', 43),
(94, '2017-04-07', 43),
(95, '2017-04-10', 43),
(96, '2017-04-09', 43),
(97, '2017-04-11', 43),
(98, '2017-03-20', 44),
(99, '2017-03-20', 45),
(100, '2017-03-21', 46),
(101, '2017-03-28', 48);

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
  `hop_abs_freq` float DEFAULT NULL
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
(73, '2017-04-17', '12:00:00', '20:00:00', 1, NULL, NULL),
(74, '2017-04-07', '05:00:00', '13:00:00', 0, NULL, NULL),
(75, '2017-05-05', '05:00:00', '13:00:00', 0, NULL, NULL),
(76, '2017-05-04', '22:32:00', '23:32:00', 30, NULL, NULL);

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
(1, 'Service Salle', 72);

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
(2, 5, '2017-04-15 05:00:00', '2017-04-15 13:00:58', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `ccn_maladieaccident`
--

CREATE TABLE `ccn_maladieaccident` (
  `mac_id` int(11) NOT NULL,
  `mac_per_id` int(11) NOT NULL,
  `mac_dateDebut` date NOT NULL,
  `mac_dateFin` date NOT NULL,
  `mac_isAccident` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_maladieaccident`
--

INSERT INTO `ccn_maladieaccident` (`mac_id`, `mac_per_id`, `mac_dateDebut`, `mac_dateFin`, `mac_isAccident`) VALUES
(1, 3, '2017-03-12', '2017-03-16', 0),
(2, 3, '2017-01-01', '2017-01-14', 1),
(6, 3, '2017-03-12', '2017-03-15', 1),
(7, 3, '2017-01-12', '2017-01-13', 0),
(21, 4, '2017-04-02', '2017-04-04', 0),
(22, 6, '2017-04-13', '2017-04-15', 0);



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
(1, 'Bedonni', 'Jean-Pierre', 'jpb@gprh.ch', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'Bedonni | 58ef60c19770f58ef60c19774858ef60c19777e', '1970-01-01', 'Rue de la batelle 5', NULL, 120555, 'Geneve', 1, '04', '08787976767676677', 'M', 0),
(2, 'Jalley', 'Vincent', 'vincent@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'Jalley | 58ee61945e37e58ee61945e3b858ee61945e3f0', '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 1, '0223429999', '0793709999', 'M', 0),
(3, 'Guillerault', 'Lucille', 'lucille.guillerault@gmail.com', 'd404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db', 'Guillerault | 58ee6cee5e73d58ee6cee5e77758ee6cee5e7af', '1990-06-20', 'Chemin de la Rochette 12', NULL, 1220, 'Geneve', 0, '0221113322', '0778889911', 'F', 1),
(4, 'Marcuzzo', 'Vanessa B.', 'vanessa@gmail.com', 'd404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db', 'Marcuzzo | 58ef924f3cf1858ef924f3cf5058ef924f3cf87', '1993-03-10', '12 rue des omars', NULL, 1220, 'Genève', 0, '0223334450', NULL, 'F', 0),
(5, 'Paniz', 'Celine', 'celine@gmail.com', 'd404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db', 'Paniz | 58ef8b9a4a9be58ef8b9a4a9ff58ef8b9a4aa37', '1992-01-14', 'Chemin de poney', '', 1202, '    genève', 0, '0223344550', '0789480231', 'F', 0),
(6, 'Ribeiro', 'Juliana', 'julianafilipa4@gmail.com', 'd404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db', 'Ribeiro | 58ef7fbd5771f58ef7fbd5775758ef7fbd5778d', '1990-11-04', 'Av. Stitch 4', NULL, 1020, 'Renens', 0, '02144444444', '0777777777', 'F', 0),
(7, 'Da Silva', 'Joel', 'Joel@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'Da Silva | 58ef2511cca3958ef2511cca7158ef2511ccaa7', '1992-05-09', 'chemin des champignons', 'cp 44', 2147483647, 'Carouge', 1, '0223429999', '0793709999', 'M', 0),
(8, 'Gomes', 'Dany', 'dany@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'Gomes | 58ecf41372a2258ecf41372a5958ecf41372a90', '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 1, '0223429999', '0793709999', 'M', 0),
(9, 'Bartolomei', 'Baptiste', 'baptiste@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'Bartolomei | 58ece36c2a18958ece36c2a1c158ece36c2a1f7', '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 0, '0223429999', '0793709999', 'M', 0),
(10, 'xxxx', 'xxxx', 'joel.marquesd3@gmail.com', NULL, NULL, '1992-08-10', 'fdsalkjkf', 'klfjsdlkjlkfajl', 1226, 'Thônex', 0, '0788978978', '0789798788', 'F', 1),
(11, 'jdjdn', 'ncnxn', 'joel.marquesd2@gmail.com', NULL, NULL, '2017-02-09', 'jxjdnnxn', 'nxnxnxjn', 1226, 'thonex', 0, '0275757567', '0727373733', 'M', 0),
(12, 'Jdnxnnx', 'Nxnxnnx', 'joel.marquesd1@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'Jdnxnnx | 58bd9131e5fe958bd9131e602158bd9131e6057', '2017-02-06', 'Nxnxnnx', '', 1226, 'Thonex', 1, '0727227273', '0727272727', 'F', 1),
(13, 'Hxndj', 'Bxnxn', 'Jkem.maruqes@gmail.com', NULL, NULL, '1992-02-12', 'Hcncnnc', 'Ncncn', 1226, 'Thonex', 1, '0222276767', '2797667273', 'M', 1),
(14, 'Bartolomei', 'Baptiste', 'test@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'Bartolomei | 58de65c35b45a58de65c35b49258de65c35b4c8', '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 1, '0223429999', '0793709999', 'M', 0),
(15, 'fas', 'fas', 'joel.maruqesd@gmail.com', NULL, NULL, '1983-03-01', 'fdsa', 'fdas', 1224, ' chêne-bougeries', 0, '0789798789', '0789788979', 'F', 0),
(16, 'Marcos Widner', 'Johann', 'joel.marquesd@gmail.com', 'a4065a15315bad70773097c5e4b7865e98161529f73857cd046bd92f768b3f563b3793ff09d4ef7faa961c5c73d4f0e91c699297e55218f7d850a955dedd1270', NULL, '1993-03-16', 'Chemin des grangettes 11', '', 1208, ' genève', 0, '0786737337', '0757676737', 'F', 0),
(17, 'test1', 'test1', 'test1@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'test1 | 58d8c880ea43158d8c880ea46958d8c880ea49f', '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 1, '0223429999', '0793709999', 'M', 0),
(18, 'Test', 'Test', 'joel.marques@gmail.com', NULL, NULL, '1987-04-16', 'Jdjdnd', '', 1204, 'Genève', 0, '0789373767', '0786423434', 'F', 1),
(19, 'BartolomeiTest', 'BaptisteTest', 'tisba888@hotmail.com', NULL, NULL, '1990-12-20', 'fsffff dfdf 3333', 'feff', 1207, 'Genève', 0, '0223222222', '0222222222', 'M', 0),
(20, 'gfdgg', 'fdgfdgfdgfd', '455454@gg.ch', NULL, NULL, '2017-04-04', 'ghgfhgfh', '', 1200, 'Genève', 0, '5454354354', '4545454544', 'M', 1),
(21, 'gfhgfhgf', 'gfhgfhgfhgf', 'fdgg2g@dd.ch', NULL, NULL, '2017-04-03', 'hfghgfhgf', '', 1231, 'Conches', 0, '4543543545', '5453454353', 'M', 1),
(22, 'test5', 'test5', 'test5@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'test5 | 58cfd1631aa9c58cfd1631aad458cfd1631ab0d', '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 1, '0223429999', '0793709999', 'M', 0),
(23, 'Bartolomei5', 'Baptiste5', 'tisba8@gmail.com', NULL, NULL, '1990-12-20', 'route de ddfiejer 5', '', 1208, 'Genève', 0, '0123132131', '0213123213', 'F', 0),
(25, 'test11', 'test11', 'test11@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'test11 | 58db9b48e1eb058db9b48e1ee858db9b48e1f20', '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 1, '0223429999', '0793709999', 'M', 0),
(26, 'test12', 'test12', 'test12@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', 'test12 | 58db9bbd7e59758db9bbd7e5cf58db9bbd7e605', '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 1, '0223429999', '0793709999', 'M', 0),
(27, 'toto', 'toto', 'toto@gmail.com', NULL, NULL, '1992-01-13', 'Route de Chênes 44', '', 1208, 'Genève', 0, '0223232323', '0782343422', 'M', 0),
(28, 'tata', 'tata', 'tata@gmail.com', NULL, NULL, '1991-11-07', 'Rue de Rive', '', 1207, 'Genève', 0, '0228673844', '0794648595', 'F', 0),
(29, 'Marques da Silva', 'Joel', 'joel.marquesd@gmail.com', NULL, '58ece46333f4658ece46333f7f58ece46333fb7', '1992-08-11', 'Chemin des deux-communes 11', '', 1226, 'Thônex', 0, '0789779987', '0788789987', 'M', 0),
(30, 'Cardoso', 'Stéphane', 'joel.marquesd@gmail.com', '6ec96e21cf18f1843cf2dd00f3af9af19cdc245ec37968934af09c59a24826323968e2392040c935695cda835681a37985220c807336dc20b4764808a0fc6581', NULL, '1992-04-11', 'Rue du rhône', '', 1036, ' sullens', 0, '0798787987', '7879897879', 'M', 0),
(31, 'Lamerti', 'Martin', 'joel.marquesd@gmail.com', NULL, '58edf631e206c58edf631e20a458edf631e20da', '1992-04-12', 'Jxjdjsk', '', 1227, 'Carouge ge', 0, '6767667676', '0467676676', 'M', 0);

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
(74, 4);

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
(3, NULL),
(4, 'ckdeVV8C_68:APA91bEQZi1lQv-AG_h_zlKLrHFOd5NOPeHgTkd5f-t592Vf74qW2AOCUWpTNeMeDrOD8zT0H0JPwjcwFqg35yGF_miNC4Tjx68FewOO3d76grym4-njxi8dMyMCacIsnifLMDaRg4F2'),
(5, 'e2WUuXyt8Hs:APA91bFAQ-iElDHeQdbvsHWQ227BJV9fhLqfwcj03TxLrFqMLVjW1Cc0XdwRK6otSeOVDdAAe8gCCGqmI_UxlG5hoiVMRVeYUxAWxCbCugULMk3Rl92J-dQXBrkpetxjezV8NPxKm6Ed'),
(6, 'dRsSUw1DC6E:APA91bHXGu9lh0_glyt8zOC9-cr6JSp6D7G2PoHiKV_f8HJ4PzAyUKTeY5bQujpoqeyIL6uNBxBxRnD8qIcisClWmKLnkUBMiDJsHRkLwuhbycYf6RE5iMDDtPobEr-D1VGbwJO9M19_'),
(7, 'fCwX3ctQqaM:APA91bF-bZD7fyvJ6jlgqmGJqFq0_tCkOvBD2nkdlRklORPKJLusxtgtfldWcGnPoovi8WLCy1sSm4OtnSeNAu266vXCQ3RwfavWLSHxXJvQntCJOLZ6Nytb8h6m6COjVQsTT54R5iEs'),
(9, 'fzNP78W8soU:APA91bGGwnc64r0UZ4TNA2eNkpFo3gbO6Yi_cTXMnNInC3QiAYukaCKMajTfBvJZTMjMg7Yb3hMb0E4QFZBXcsKkd4TcMqsmw5qX1vtYtakL2d5XnT6mEUs68curAvinWtaQsL9T1Sd-'),
(30, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `ccn_travail`
--

CREATE TABLE `ccn_travail` (
  `tra_per_id` int(11) NOT NULL,
  `tra_hop_id` int(11) NOT NULL,
  `tra_valide` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_travail`
--

INSERT INTO `ccn_travail` (`tra_per_id`, `tra_hop_id`, `tra_valide`) VALUES
(3, 1, 0),
(3, 2, 0),
(3, 3, 0),
(3, 4, 0),
(3, 12, 0),
(3, 13, 0),
(3, 14, 0),
(3, 15, 0),
(3, 21, 1),
(3, 28, 0),
(3, 34, 1),
(3, 35, 0),
(3, 36, 0),
(3, 37, 0),
(3, 41, 1),
(3, 42, 0),
(3, 43, 0),
(3, 72, 0),
(3, 73, 0),
(4, 5, 1),
(4, 6, -1),
(4, 7, 1),
(4, 8, 1),
(4, 9, 1),
(4, 10, 1),
(4, 11, 1),
(4, 21, 1),
(4, 23, 0),
(4, 24, 1),
(4, 25, 1),
(4, 26, 1),
(4, 27, 1),
(5, 47, 0),
(5, 48, 0),
(5, 70, 0),
(5, 71, 0),
(5, 72, 0),
(5, 73, 0),
(6, 35, 0),
(6, 36, 1),
(6, 41, 0),
(6, 42, 0),
(6, 43, 0),
(6, 44, 0),
(6, 45, 0),
(6, 46, 0),
(29, 56, 0),
(29, 57, 0),
(30, 50, 0),
(30, 51, 0),
(30, 60, 0),
(30, 61, 0),
(30, 62, 0),
(30, 63, 0),
(30, 66, 0),
(30, 74, 0),
(30, 75, 0),
(30, 76, 0);

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
(3, 1, '2017-01-17 18:00:00', '2017-01-18 03:00:00', 0, '2017-04-01 00:15:44'),
(3, 2, '2017-03-15 08:00:00', '2017-03-15 12:00:00', 0, '0000-00-00 00:00:00'),
(3, 3, '2017-03-15 08:00:00', '2017-03-15 12:00:00', 0, '2017-03-21 22:40:34'),
(3, 4, '2017-01-17 13:00:00', '2017-01-17 17:00:00', 0, '2017-04-01 00:56:44'),
(3, 5, '2017-03-06 21:01:00', '2017-03-06 23:36:00', 0, '2017-04-01 21:36:20'),
(3, 6, '2017-03-02 09:00:00', '2017-03-02 20:30:00', 0, '2017-04-02 21:04:19'),
(3, 12, '2017-03-16 17:00:00', '2017-03-17 03:00:00', 0, '0000-00-00 00:00:00'),
(3, 13, '2017-03-15 14:00:00', '2017-03-15 16:00:00', 0, '0000-00-00 00:00:00'),
(3, 14, '2017-03-08 00:17:00', '2017-03-08 01:17:00', 0, '2017-04-08 01:17:13'),
(3, 15, '2017-03-01 11:16:00', '2017-03-01 12:10:00', 0, '2017-04-01 11:20:33'),
(3, 16, '2017-01-17 12:00:00', '2017-01-17 15:00:00', 0, '2017-04-01 10:40:42'),
(4, 7, '2017-03-19 06:00:00', '2017-03-19 20:00:00', 0, '0000-00-00 00:00:00'),
(4, 8, '2017-03-19 06:00:00', '2017-03-19 21:00:00', 0, '0000-00-00 00:00:00'),
(4, 9, '2017-03-19 06:00:00', '2017-03-19 21:00:00', 0, '0000-00-00 00:00:00'),
(4, 10, '2017-03-19 06:00:00', '2017-03-19 21:00:00', 0, '0000-00-00 00:00:00'),
(4, 17, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 0, '2017-03-31 23:18:47'),
(30, 49, '2017-03-11 16:59:00', '2017-03-11 22:59:00', 0, '2017-04-11 23:00:28');

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
(16, 5, '2017-04-01');

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
(3, '2017-04-12 20:07:07'),
(4, '2017-04-11 22:17:35'),
(5, '2017-04-13 14:39:53'),
(6, '2017-04-10 01:01:22'),
(7, '2017-04-07 00:01:26'),
(9, '2017-04-11 16:08:48'),
(30, '2017-04-12 22:34:16');

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
-- Index pour la table `ccn_demande`
--
ALTER TABLE `ccn_demande`
  ADD PRIMARY KEY (`dem_id`);

--
-- Index pour la table `ccn_demandepersonne`
--
ALTER TABLE `ccn_demandepersonne`
  ADD PRIMARY KEY (`dpe_id`),
  ADD KEY `_DemandePersonne_Demande_id` (`dpe_dem_id`) USING BTREE,
  ADD KEY `_DemandePersonne_Personne_id` (`dpe_per_id`) USING BTREE;

--
-- Index pour la table `ccn_departement`
--
ALTER TABLE `ccn_departement`
  ADD PRIMARY KEY (`dep_id`,`dep_eta_id`),
  ADD KEY `fk_Departement_Etablissement1_idx` (`dep_eta_id`);

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
-- Index pour la table `ccn_maladieaccident`
--
ALTER TABLE `ccn_maladieaccident`
  ADD PRIMARY KEY (`mac_id`),
  ADD KEY `mac_per_id` (`mac_per_id`);


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
  MODIFY `abs_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT pour la table `ccn_demande`
--
ALTER TABLE `ccn_demande`
  MODIFY `dem_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT pour la table `ccn_demandepersonne`
--
ALTER TABLE `ccn_demandepersonne`
  MODIFY `dpe_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;
--
-- AUTO_INCREMENT pour la table `ccn_departement`
--
ALTER TABLE `ccn_departement`
  MODIFY `dep_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;
  
  
-- AUTO_INCREMENT pour la table `ccn_fermetureinfo`
--
ALTER TABLE `ccn_fermetureinfo`
  MODIFY `fer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;
--
-- AUTO_INCREMENT pour la table `ccn_horairepersonne`
--
ALTER TABLE `ccn_horairepersonne`
  MODIFY `hop_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;
--
-- AUTO_INCREMENT pour la table `ccn_horairepreconfig`
--
ALTER TABLE `ccn_horairepreconfig`
  MODIFY `hpr_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT pour la table `ccn_jourpreconfig`
--
ALTER TABLE `ccn_jourpreconfig`
  MODIFY `jou_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT pour la table `ccn_maladieaccident`
--
ALTER TABLE `ccn_maladieaccident`
  MODIFY `mac_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT pour la table `ccn_personne`
--
ALTER TABLE `ccn_personne`
  MODIFY `per_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;
--
-- AUTO_INCREMENT pour la table `ccn_pushinfo`
--
ALTER TABLE `ccn_pushinfo`
  MODIFY `pus_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT pour la table `ccn_validationmensuelle`
--
ALTER TABLE `ccn_validationmensuelle`
  MODIFY `val_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
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
  ADD CONSTRAINT `fk_DemandePersonne_Demande` FOREIGN KEY (`dpe_dem_id`) REFERENCES `ccn_demande` (`dem_id`) ON DELETE CASCADE ON UPDATE CASCADE,
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
-- Contraintes pour la table `ccn_maladieaccident`
--
ALTER TABLE `ccn_maladieaccident`
  ADD CONSTRAINT `mac_per_id` FOREIGN KEY (`mac_per_id`) REFERENCES `ccn_personne` (`per_id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
