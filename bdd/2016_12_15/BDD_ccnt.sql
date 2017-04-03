-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Client :  localhost:8889
-- Généré le :  Lun 27 Mars 2017 à 13:33
-- Version du serveur :  5.6.33
-- Version de PHP :  7.0.12

/**

ATTENTION IL FAUT CREER D'ABORD UNE BASE APPELLER 'CCNT' PUIS IMPORTER CE FICHIER A L'INTERIEUR
*/

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de données :  `ccnt`
--

-- --------------------------------------------------------

--
-- Structure de la table `ccn_absence`
--

CREATE TABLE `ccn_absence` (
  `abs_id` int(11) NOT NULL,
  `abs_nom` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `ccn_appartient`
--

CREATE TABLE `ccn_appartient` (
  `app_eta_id` int(11) NOT NULL,
  `app_per_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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

-- --------------------------------------------------------

--
-- Structure de la table `ccn_departement`
--

CREATE TABLE `ccn_departement` (
  `dep_id` int(11) NOT NULL,
  `dep_nom` varchar(45) DEFAULT NULL,
  `dep_img_no` int(11) NOT NULL,
  `dep_eta_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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

-- --------------------------------------------------------

--
-- Structure de la table `ccn_fermetureInfo`
--

CREATE TABLE `ccn_fermetureInfo` (
  `fer_id` int(11) NOT NULL,
  `fer_date` date DEFAULT NULL,
  `fer_Eta_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `ccn_horairecontrat`
--

CREATE TABLE `ccn_horairecontrat` (
  `hor_id` int(2) NOT NULL,
  `hor_nom` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
  `hop_abs_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `ccn_ouvertureInfo`
--

CREATE TABLE `ccn_ouvertureInfo` (
  `ouv_id` int(11) NOT NULL,
  `ouv_jour` varchar(20) DEFAULT NULL,
  `ouv_matinDebut` datetime DEFAULT NULL,
  `ouv_matinFin` datetime DEFAULT NULL,
  `ouv_eta_id` int(11) NOT NULL,
  `ouv_soirDebut` datetime DEFAULT NULL,
  `ouv_soirFin` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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

-- --------------------------------------------------------

--
-- Structure de la table `ccn_possede`
--

CREATE TABLE `ccn_possede` (
  `pos_dep_id` int(11) NOT NULL,
  `pos_per_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `ccn_travail`
--

CREATE TABLE `ccn_travail` (
  `tra_per_id` int(11) NOT NULL,
  `tra_hop_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `ccn_typecontrat`
--

CREATE TABLE `ccn_typecontrat` (
  `typ_id` int(2) NOT NULL,
  `typ_nom` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
-- Index pour la table `ccn_etablissement`
--
ALTER TABLE `ccn_etablissement`
  ADD PRIMARY KEY (`eta_id`);

--
-- Index pour la table `ccn_fermetureInfo`
--
ALTER TABLE `ccn_fermetureInfo`
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
-- Index pour la table `ccn_ouvertureInfo`
--
ALTER TABLE `ccn_ouvertureInfo`
  ADD PRIMARY KEY (`ouv_id`,`ouv_eta_id`),
  ADD KEY `fk_InfoOuverture_Etablissement1_idx` (`ouv_eta_id`);

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
  MODIFY `abs_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `ccn_departement`
--
ALTER TABLE `ccn_departement`
  MODIFY `dep_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `ccn_etablissement`
--
ALTER TABLE `ccn_etablissement`
  MODIFY `eta_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `ccn_fermetureInfo`
--
ALTER TABLE `ccn_fermetureInfo`
  MODIFY `fer_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `ccn_horairepersonne`
--
ALTER TABLE `ccn_horairepersonne`
  MODIFY `hop_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `ccn_ouvertureInfo`
--
ALTER TABLE `ccn_ouvertureInfo`
  MODIFY `ouv_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `ccn_personne`
--
ALTER TABLE `ccn_personne`
  MODIFY `per_id` int(11) NOT NULL AUTO_INCREMENT;
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
-- Contraintes pour la table `ccn_fermetureInfo`
--
ALTER TABLE `ccn_fermetureInfo`
  ADD CONSTRAINT `fk_InfoFermeture_Etablissement1` FOREIGN KEY (`fer_Eta_id`) REFERENCES `ccn_etablissement` (`eta_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `ccn_horairepersonne`
--
ALTER TABLE `ccn_horairepersonne`
  ADD CONSTRAINT `ccn_horairepersonne_ibfk_1` FOREIGN KEY (`hop_abs_id`) REFERENCES `ccn_absence` (`abs_id`);

--
-- Contraintes pour la table `ccn_ouvertureInfo`
--
ALTER TABLE `ccn_ouvertureInfo`
  ADD CONSTRAINT `fk_InfoOuverture_Etablissement1` FOREIGN KEY (`ouv_eta_id`) REFERENCES `ccn_etablissement` (`eta_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

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
