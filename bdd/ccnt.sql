-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Client :  localhost:8889
-- G\'e9n\'e9r\'e9 le :  Jeu 27 Octobre 2016 \'e0 14:27
-- Version du serveur :  5.6.33
-- Version de PHP :  7.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de donn\'e9es :  `ccnt`\
--
CREATE DATABASE IF NOT EXISTS `ccnt` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `ccnt`;

-- --------------------------------------------------------

--
-- Structure de la table `ccn_personne`
--

CREATE TABLE `ccn_personne` (
  `per_id` int(11) NOT NULL,
  `per_nom` varchar(50) NOT NULL,
  `per_prenom` varchar(50) NOT NULL,
  `per_mail` varchar(80) NOT NULL,
  `per_mdp` varchar(128) NOT NULL,
  `per_token` varchar(128) NULL,
  `per_dateNaissance` date NOT NULL,
  `per_adresse` varchar(50) NOT NULL,
  `per_codePostal` int(11) NOT NULL,
  `per_ville` varchar(50) NOT NULL,
  `per_admin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Contenu de la table `ccn_personne`
--

INSERT INTO `ccn_personne` (`per_id`, `per_nom`, `per_prenom`, `per_mail`, `per_mdp`, `per_token`, `per_dateNaissance`, `per_adresse`, `per_codePostal`, `per_ville`, `per_admin`) VALUES
(1, 'Bedonni', 'Jean-Pierre', 'jpb@gprh.ch', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', NULL, '1970-01-01', 'Rue de la batelle 5', 1205, 'Geneve', 1);

--
-- Index pour les tables export\'e9es
--

--
-- Index pour la table `ccn_personne`
--
ALTER TABLE `ccn_personne`
  ADD PRIMARY KEY (`per_id`);

--
-- AUTO_INCREMENT pour les tables export\'e9es
--

--
-- AUTO_INCREMENT pour la table `ccn_personne`
--
ALTER TABLE `ccn_personne`
  MODIFY `per_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;