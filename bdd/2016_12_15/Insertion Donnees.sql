use `ccnt`;

INSERT INTO `ccn_etablissement` (`eta_nom`, `eta_adresse`, `eta_telReservation`, `eta_telDirection`, `eta_email`, `eta_siteWeb`, `eta_adresseInfo`, `eta_codePostal`, `eta_localite`, `eta_nbHeure`) 
VALUES ('Le Château d''If', 'Route de Thonon 51', '+41 22 752 12 11', '', '', 'www.chateaudif.ch', 'CP 166', '1222', 'Vésenaz', '45');

INSERT INTO `ccn_departement` (`dep_id`, `dep_nom`, `dep_eta_id`) 
VALUES (NULL, 'Cuisine', '1');

INSERT INTO `ccn_departement` (`dep_id`, `dep_nom`, `dep_eta_id`) 
VALUES (NULL, 'Bar', '1');

INSERT INTO `ccn_departement` (`dep_id`, `dep_nom`, `dep_eta_id`) 
VALUES (NULL, 'Service', '1');

INSERT INTO `ccn_personne` (`per_id`, `per_nom`, `per_prenom`, `per_mail`, `per_mdp`, `per_token`, `per_dateNaissance`, `per_adresse`, `per_InfoSuppAdresse`, `per_codePostal`, `per_ville`, `per_admin`, `per_telFixe`, `per_telMobile`, `per_genre`) 
VALUES (NULL, 'Bedonni', 'Jean-Pierre', 'jpb@gprh.ch', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', NULL, '1970-01-01', 'Rue de la batelle 5', null, '1205', 'Geneve', '1', null, null, 'M');

INSERT INTO `ccn_personne` (`per_id`, `per_nom`, `per_prenom`, `per_mail`, `per_mdp`, `per_token`, `per_dateNaissance`, `per_adresse`, `per_InfoSuppAdresse`, `per_codePostal`, `per_ville`, `per_admin`, `per_telFixe`, `per_telMobile`, `per_genre`) 
VALUES (NULL, 'Jalley', 'Vincent', 'vincent@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', NULL, '1992-05-09', 'chemin des champignons', 'cp 44', '1227', 'Carouge', '1', '0223429999', '0793709999', 'M');

INSERT INTO `ccn_personne` (`per_id`, `per_nom`, `per_prenom`, `per_mail`, `per_mdp`, `per_token`, `per_dateNaissance`, `per_adresse`, `per_InfoSuppAdresse`, `per_codePostal`, `per_ville`, `per_admin`, `per_telFixe`, `per_telMobile`, `per_genre`) 
VALUES (NULL, 'Da Silva', 'Joel', 'joel@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', NULL, '1992-05-09', 'chemin des champignons', 'cp 44', '1227', 'Carouge', '0', '0223429999', '0793709999', 'M');

INSERT INTO `ccn_personne` (`per_id`, `per_nom`, `per_prenom`, `per_mail`, `per_mdp`, `per_token`, `per_dateNaissance`, `per_adresse`, `per_InfoSuppAdresse`, `per_codePostal`, `per_ville`, `per_admin`, `per_telFixe`, `per_telMobile`, `per_genre`) 
VALUES (NULL, 'Gomes', 'Dany', 'dany@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', NULL, '1992-05-09', 'chemin des champignons', 'cp 44', '1227', 'Carouge', '1', '0223429999', '0793709999', 'M');

INSERT INTO `ccn_personne` (`per_id`, `per_nom`, `per_prenom`, `per_mail`, `per_mdp`, `per_token`, `per_dateNaissance`, `per_adresse`, `per_InfoSuppAdresse`, `per_codePostal`, `per_ville`, `per_admin`, `per_telFixe`, `per_telMobile`, `per_genre`) 
VALUES (NULL, 'Bartolomei', 'Baptiste', 'baptiste@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', NULL, '1992-05-09', 'chemin des champignons', 'cp 44', '1227', 'Carouge', '0', '0223429999', '0793709999', 'M');

INSERT INTO `ccnt`.`ccn_possede` (`pos_dep_id`, `pos_per_id`) VALUES ('1', '2');
INSERT INTO `ccnt`.`ccn_possede` (`pos_dep_id`, `pos_per_id`) VALUES ('2', '3');
INSERT INTO `ccnt`.`ccn_possede` (`pos_dep_id`, `pos_per_id`) VALUES ('3', '4');
INSERT INTO `ccnt`.`ccn_possede` (`pos_dep_id`, `pos_per_id`) VALUES ('3', '5');

INSERT INTO `ccnt`.`ccn_typecontrat` (`typ_id`, `typ_nom`) VALUES ('1', 'Normal');
INSERT INTO `ccnt`.`ccn_typecontrat` (`typ_id`, `typ_nom`) VALUES ('2', 'Apprentissage');
INSERT INTO `ccnt`.`ccn_typecontrat` (`typ_id`, `typ_nom`) VALUES ('3', 'Personne externe');

INSERT INTO `ccnt`.`ccn_horairecontrat` (`hor_id`, `hor_nom`) VALUES ('1', 'Par heure');
INSERT INTO `ccnt`.`ccn_horairecontrat` (`hor_id`, `hor_nom`) VALUES ('2', 'Mensuel');
INSERT INTO `ccnt`.`ccn_horairecontrat` (`hor_id`, `hor_nom`) VALUES ('3', 'Spécial');
INSERT INTO `ccnt`.`ccn_horairecontrat` (`hor_id`, `hor_nom`) VALUES ('4', 'Cadre');

INSERT INTO `ccnt`.`ccn_contrat` (`con_dateIn`, `con_dateOut`, `con_particularite`, `con_per_id`, `con_hor_id`, `con_typ_id`) VALUES ('2016-12-13', NULL, 15, '3', '3', '2');
INSERT INTO `ccnt`.`ccn_contrat` (`con_dateIn`, `con_dateOut`, `con_particularite`, `con_per_id`, `con_hor_id`, `con_typ_id`) VALUES ('2016-12-14', NULL, 0.70, '5', '2', '2');

INSERT INTO `ccnt`.`ccn_appartient` (`app_eta_id`, `app_per_id`) VALUES ('1', '1');