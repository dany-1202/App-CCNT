-- phpMyAdmin SQL Dump
-- version 4.4.14
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Jeu 06 Avril 2017 à 15:29
-- Version du serveur :  5.6.26
-- Version de PHP :  5.6.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `ccnt`
--

-- --------------------------------------------------------

--
-- Structure de la table `ccn_absence`
--

CREATE TABLE IF NOT EXISTS `ccn_absence` (
  `abs_id` int(11) NOT NULL,
  `abs_nom` varchar(30) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

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

CREATE TABLE IF NOT EXISTS `ccn_appartient` (
  `app_eta_id` int(11) NOT NULL,
  `app_per_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_appartient`
--

INSERT INTO `ccn_appartient` (`app_eta_id`, `app_per_id`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `ccn_contient`
--

CREATE TABLE IF NOT EXISTS `ccn_contient` (
  `con_hpr_id` int(11) NOT NULL,
  `con_jou_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `ccn_contrat`
--

CREATE TABLE IF NOT EXISTS `ccn_contrat` (
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
('2016-12-14', NULL, 0.7, 5, 2, 2);

-- --------------------------------------------------------

--
-- Structure de la table `ccn_departement`
--

CREATE TABLE IF NOT EXISTS `ccn_departement` (
  `dep_id` int(11) NOT NULL,
  `dep_nom` varchar(45) DEFAULT NULL,
  `dep_img_no` int(11) NOT NULL,
  `dep_eta_id` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_departement`
--

INSERT INTO `ccn_departement` (`dep_id`, `dep_nom`, `dep_img_no`, `dep_eta_id`) VALUES
(1, 'Cuisine', 1, 1),
(2, 'Bar', 2, 1),
(3, 'Service', 3, 1);

-- --------------------------------------------------------

--
-- Structure de la table `ccn_etablissement`
--

CREATE TABLE IF NOT EXISTS `ccn_etablissement` (
  `eta_id` int(11) NOT NULL,
  `eta_nom` varchar(100) NOT NULL,
  `eta_adresse` varchar(100) DEFAULT NULL,
  `eta_telReservation` varchar(20) DEFAULT NULL,
  `eta_telDirection` varchar(20) DEFAULT NULL,
  `eta_email` varchar(100) DEFAULT NULL,
  `eta_siteWeb` varchar(100) DEFAULT NULL,
  `eta_adresseInfo` varchar(100) DEFAULT NULL,
  `eta_codePostal` int(11) DEFAULT NULL,
  `eta_localite` varchar(100) DEFAULT NULL,
  `eta_nbHeure` float NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;


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
-- Contenu de la table `ccn_etablissement`
--

INSERT INTO `ccn_etablissement` (`eta_id`, `eta_nom`, `eta_adresse`, `eta_telReservation`, `eta_telDirection`, `eta_email`, `eta_siteWeb`, `eta_adresseInfo`, `eta_codePostal`, `eta_localite`, `eta_nbHeure`) VALUES
(1, 'Macdoo', 'Route de Genève 12', '+41 22 827 12 13', '', '', 'www.macdoo.ch', 'CP 222', 1205, 'Genève', 45),
(2, 'Starbuckk', 'Route de ClaireFontaine 32', '+41 22 895 11 10', '', '', 'www.starbuckk.ch', 'CP 161', 1227, 'Carouge', 43.5),
(3, 'Le Château d''If', 'Route de Thonon 51', '+41 22 752 12 11', '', '', 'www.chateaudif.ch', 'CP 166', 1222, 'Vésenaz', 42);





-- --------------------------------------------------------

--
-- Structure de la table `ccn_fermetureinfo`
--

CREATE TABLE IF NOT EXISTS `ccn_fermetureinfo` (
  `fer_id` int(11) NOT NULL,
  `fer_date` date DEFAULT NULL,
  `fer_Eta_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `ccn_horairecontrat`
--

CREATE TABLE IF NOT EXISTS `ccn_horairecontrat` (
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

CREATE TABLE IF NOT EXISTS `ccn_horairepersonne` (
  `hop_id` int(11) NOT NULL,
  `hop_date` date NOT NULL,
  `hop_heureDebut` time NOT NULL,
  `hop_heureFin` time NOT NULL,
  `hop_pause` int(11) NOT NULL,
  `hop_abs_id` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_horairepersonne`
--

INSERT INTO `ccn_horairepersonne` (`hop_id`, `hop_date`, `hop_heureDebut`, `hop_heureFin`, `hop_pause`, `hop_abs_id`) VALUES
(1, '2017-01-18', '09:15:00', '23:30:00', 0, NULL),
(2, '2017-01-20', '08:00:00', '15:30:00', 0, NULL),
(3, '2017-01-17', '15:00:00', '02:30:00', 0, 5),
(4, '2017-01-24', '08:00:00', '15:30:00', 0, NULL),
(5, '2017-01-20', '08:00:00', '15:30:00', 0, NULL),
(6, '2017-01-25', '08:00:00', '00:30:00', 0, NULL),
(7, '2017-01-26', '09:00:00', '18:30:00', 0, NULL),
(8, '2017-01-16', '10:00:00', '15:30:00', 0, NULL),
(9, '2017-01-23', '08:00:00', '23:30:00', 0, NULL),
(10, '2017-01-08', '08:30:00', '17:30:00', 0, NULL),
(11, '2017-03-07', '00:00:00', '00:00:00', 0, NULL),
(12, '2017-03-15', '10:00:00', '00:00:00', 0, NULL),
(13, '2017-03-16', '03:00:00', '07:13:00', 40, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `ccn_horairepreconfig`
--

CREATE TABLE IF NOT EXISTS `ccn_horairepreconfig` (
  `hpr_id` int(11) NOT NULL,
  `hpr_nom` varchar(40) NOT NULL,
  `hpr_dep_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `ccn_jourpreconfig`
--

CREATE TABLE IF NOT EXISTS `ccn_jourpreconfig` (
  `jou_id` int(11) NOT NULL,
  `jou_sem` int(11) NOT NULL,
  `jou_heureDebut` datetime NOT NULL,
  `jou_heureFin` datetime NOT NULL,
  `jou_heureDebutS` datetime NOT NULL,
  `jou_heureFinS` datetime NOT NULL,
  `jou_pause` int(11) NOT NULL,
  `jou_pauseS` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

-- --------------------------------------------------------

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
(1, 'Semaine de base', NULL, NULL, 1, 3),
(2, 'Période été', '2017-06-01', '2017-09-01', 0, 3);

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
  `oui_matinDebut` timestamp NULL DEFAULT NULL,
  `oui_matinFin` timestamp NULL DEFAULT NULL,
  `oui_soirDebut` timestamp NULL DEFAULT NULL,
  `oui_soirFin` timestamp NULL DEFAULT NULL
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
-- Structure de la table `ccn_personne`
--

CREATE TABLE IF NOT EXISTS `ccn_personne` (
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_personne`
--

INSERT INTO `ccn_personne` (`per_id`, `per_nom`, `per_prenom`, `per_mail`, `per_mdp`, `per_token`, `per_dateNaissance`, `per_adresse`, `per_InfoSuppAdresse`, `per_codePostal`, `per_ville`, `per_admin`, `per_telFixe`, `per_telMobile`, `per_genre`, `per_inactif`) VALUES
(1, 'Bedonni', 'Jean-Pierre', 'jpb@gprh.ch', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', NULL, '1970-01-01', 'Rue de la batelle 5', NULL, 1205, 'Geneve', 1, NULL, NULL, 'M', 0),
(2, 'Jalley', 'Vincent', 'vincent@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', NULL, '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 1, '0223429999', '0793709999', 'M', 0),
(3, 'Da Silva', 'Joel', 'joel@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', NULL, '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 0, '0223429999', '0793709999', 'M', 0),
(4, 'Gomes', 'Dany', 'dany@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', NULL, '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 1, '0223429999', '0793709999', 'M', 0),
(5, 'Bartolomei', 'Baptiste', 'baptiste@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', NULL, '1992-05-09', 'chemin des champignons', 'cp 44', 1227, 'Carouge', 0, '0223429999', '0793709999', 'M', 0),
(6, 'Guillerault', 'Lucille', 'lucille.guillerault@gmail.com', 'd404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db', 'Guillerault | 5893efedbfdce5893efedbfe0a5893efedbfe54', '1990-06-20', 'Chemin de la Rochette 12', NULL, 1220, 'Geneve', 0, '0221113322', '0778889911', 'F', 0),
(7, 'Marcuzzo', 'Vaness', 'vanessa@gmail.com', 'd404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db', 'Marcuzzo | 587fd3c92d0c8587fd3c92d102587fd3c92d139', '1992-03-10', 'rue des crevette', NULL, 1202, 'Genve', 0, '0223334455', NULL, 'F', 0),
(8, 'Paniz', 'Celine', 'celine@gmail.com', 'd404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db', 'Paniz | 587fc869d6c9b587fc869d6cd3587fc869d6d09', '0000-00-00', 'Chemin de poney', NULL, 1202, 'Genève', 0, '022334455', '0789480231', 'F', 0),
(9, 'Ribeiro', 'Juliana', 'julianafilipa4@gmail.com', 'd404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db', 'Ribeiro | 58928fec6ed0f58928fec6ed4958928fec6ed81', '0000-00-00', 'Chemin de crabe', NULL, 1202, 'Genève', 0, '022334455', '0789480231', 'F', 0);

-- --------------------------------------------------------

--
-- Structure de la table `ccn_possede`
--

CREATE TABLE IF NOT EXISTS `ccn_possede` (
  `pos_dep_id` int(11) NOT NULL,
  `pos_per_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_possede`
--

INSERT INTO `ccn_possede` (`pos_dep_id`, `pos_per_id`) VALUES
(1, 2),
(1, 6),
(1, 8),
(2, 3),
(2, 4),
(2, 7),
(3, 5),
(3, 9);

-- --------------------------------------------------------

--
-- Structure de la table `ccn_travail`
--

CREATE TABLE IF NOT EXISTS `ccn_travail` (
  `tra_per_id` int(11) NOT NULL,
  `tra_hop_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_travail`
--

INSERT INTO `ccn_travail` (`tra_per_id`, `tra_hop_id`) VALUES
(3, 1),
(3, 5),
(3, 9),
(5, 2),
(5, 3),
(5, 7),
(5, 8),
(5, 10);

-- --------------------------------------------------------

--
-- Structure de la table `ccn_typecontrat`
--

CREATE TABLE IF NOT EXISTS `ccn_typecontrat` (
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
  ADD KEY `hop_abs_id` (`hop_abs_id`);

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
-- Index pour la table `ccn_travail`
--
ALTER TABLE `ccn_travail`
  ADD PRIMARY KEY (`tra_per_id`,`tra_hop_id`),
  ADD KEY `fk_ccn_travail_ccn_personne1_idx` (`tra_per_id`),
  ADD KEY `fk_ccn_travail_ccn_horairepersonne_idx` (`tra_hop_id`);

--
-- Index pour la table `ccn_typecontrat`
--
ALTER TABLE `ccn_typecontrat`
  ADD PRIMARY KEY (`typ_id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `ccn_absence`
--
ALTER TABLE `ccn_absence`
  MODIFY `abs_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT pour la table `ccn_departement`
--
ALTER TABLE `ccn_departement`
  MODIFY `dep_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;


--
-- AUTO_INCREMENT pour la table `ccn_fermetureinfo`
--
ALTER TABLE `ccn_fermetureinfo`
  MODIFY `fer_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `ccn_horairepersonne`
--
ALTER TABLE `ccn_horairepersonne`
  MODIFY `hop_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT pour la table `ccn_horairepreconfig`
--
ALTER TABLE `ccn_horairepreconfig`
  MODIFY `hpr_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `ccn_jourpreconfig`
--
ALTER TABLE `ccn_jourpreconfig`
  MODIFY `jou_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `ccn_personne`
--
ALTER TABLE `ccn_personne`
  MODIFY `per_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=10;
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
  ADD CONSTRAINT `ccn_horairepersonne_ibfk_1` FOREIGN KEY (`hop_abs_id`) REFERENCES `ccn_absence` (`abs_id`);

--
-- Contraintes pour la table `ccn_horairepreconfig`
--
ALTER TABLE `ccn_horairepreconfig`
  ADD CONSTRAINT `fk_horairepreconfig_departement` FOREIGN KEY (`hpr_dep_id`) REFERENCES `ccn_departement` (`dep_id`);

--
-- Contraintes pour la table `ccn_possede`
--
ALTER TABLE `ccn_possede`
  ADD CONSTRAINT `fk_ccn_possede_ccn_departement1` FOREIGN KEY (`pos_dep_id`) REFERENCES `ccn_departement` (`dep_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_ccn_possede_ccn_personne1` FOREIGN KEY (`pos_per_id`) REFERENCES `ccn_personne` (`per_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `ccn_travail`
--
ALTER TABLE `ccn_travail`
  ADD CONSTRAINT `fk_ccn_travail_ccn_horairepersonne_idx` FOREIGN KEY (`tra_hop_id`) REFERENCES `ccn_horairepersonne` (`hop_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_ccn_travail_ccn_personne1_idx` FOREIGN KEY (`tra_per_id`) REFERENCES `ccn_personne` (`per_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
