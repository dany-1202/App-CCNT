use `ccnt`;

INSERT INTO `ccn_etablissement` (`eta_nom`, `eta_adresse`, `eta_telReservation`, `eta_telDirection`, `eta_email`, `eta_siteWeb`, `eta_adresseInfo`, `eta_codePostal`, `eta_localite`, `eta_nbHeure`) 
VALUES ('Le Château d''If', 'Route de Thonon 51', '+41 22 752 12 11', '', '', 'www.chateaudif.ch', 'CP 166', '1222', 'Vésenaz', '45');

INSERT INTO `ccn_departement` (`dep_id`, `dep_nom`, `dep_eta_id`) 
VALUES (NULL, 'Cuisine', '1');

INSERT INTO `ccn_departement` (`dep_id`, `dep_nom`, `dep_eta_id`) 
VALUES (NULL, 'Bar', '1');

INSERT INTO `ccn_departement` (`dep_id`, `dep_nom`, `dep_eta_id`) 
VALUES (NULL, 'Service', '1');


INSERT INTO `ccn_personne` (`per_id`, `per_nom`, `per_prenom`, `per_mail`, `per_mdp`, `per_token`, `per_dateNaissance`, `per_adresse`, `per_InfoSuppAdresse`, `per_codePostal`, `per_ville`, `per_admin`, `per_telFixe`, `per_telMobile`, `per_genre`, `per_inactif`) 
VALUES (NULL, 'Bedonni', 'Jean-Pierre', 'jpb@gprh.ch', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', NULL, '1970-01-01', 'Rue de la batelle 5', null, '1205', 'Geneve', '1', null, null, 'M', 0);

INSERT INTO `ccn_personne` (`per_id`, `per_nom`, `per_prenom`, `per_mail`, `per_mdp`, `per_token`, `per_dateNaissance`, `per_adresse`, `per_InfoSuppAdresse`, `per_codePostal`, `per_ville`, `per_admin`, `per_telFixe`, `per_telMobile`, `per_genre`, `per_inactif`) 
VALUES (NULL, 'Jalley', 'Vincent', 'vincent@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', NULL, '1992-05-09', 'chemin des champignons', 'cp 44', '1227', 'Carouge', '1', '0223429999', '0793709999', 'M', 0);

INSERT INTO `ccn_personne` (`per_id`, `per_nom`, `per_prenom`, `per_mail`, `per_mdp`, `per_token`, `per_dateNaissance`, `per_adresse`, `per_InfoSuppAdresse`, `per_codePostal`, `per_ville`, `per_admin`, `per_telFixe`, `per_telMobile`, `per_genre`, `per_inactif`) 
VALUES (NULL, 'Da Silva', 'Joel', 'joel@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', NULL, '1992-05-09', 'chemin des champignons', 'cp 44', '1227', 'Carouge', '0', '0223429999', '0793709999', 'M', 0);

INSERT INTO `ccn_personne` (`per_id`, `per_nom`, `per_prenom`, `per_mail`, `per_mdp`, `per_token`, `per_dateNaissance`, `per_adresse`, `per_InfoSuppAdresse`, `per_codePostal`, `per_ville`, `per_admin`, `per_telFixe`, `per_telMobile`, `per_genre`, `per_inactif`) 
VALUES (NULL, 'Gomes', 'Dany', 'dany@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', NULL, '1992-05-09', 'chemin des champignons', 'cp 44', '1227', 'Carouge', '1', '0223429999', '0793709999', 'M', 0);

INSERT INTO `ccn_personne` (`per_id`, `per_nom`, `per_prenom`, `per_mail`, `per_mdp`, `per_token`, `per_dateNaissance`, `per_adresse`, `per_InfoSuppAdresse`, `per_codePostal`, `per_ville`, `per_admin`, `per_telFixe`, `per_telMobile`, `per_genre`, `per_inactif`) 
VALUES (NULL, 'Bartolomei', 'Baptiste', 'baptiste@gmail.com', 'd8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98', NULL, '1992-05-09', 'chemin des champignons', 'cp 44', '1227', 'Carouge', '0', '0223429999', '0793709999', 'M', 0);


/* Infos Filles */

INSERT INTO `ccn_personne` (`per_id`, `per_nom`, `per_prenom`, `per_mail`, `per_mdp`, `per_token`, `per_dateNaissance`, `per_adresse`, `per_InfoSuppAdresse`, `per_codePostal`, `per_ville`, `per_admin`, `per_telFixe`, `per_telMobile`, `per_inactif`, `per_genre`) 
VALUES (NULL, 'Guillerault', 'Lucille', 'lucille.guillerault@gmail.com', 'd404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db', 'Guillerault | 5893efedbfdce5893efedbfe0a5893efedbfe54', '1990-06-20', 'Chemin de la Rochette 12', NULL, '1220', 'Geneve', '0', '0221113322', '0778889911', '0', 'F');

INSERT INTO `ccn_personne` (`per_id`, `per_nom`, `per_prenom`, `per_mail`, `per_mdp`, `per_token`, `per_dateNaissance`, `per_adresse`, `per_InfoSuppAdresse`, `per_codePostal`, `per_ville`, `per_admin`, `per_telFixe`, `per_telMobile`, `per_inactif`, `per_genre`) 
VALUES (NULL, 'Marcuzzo', 'Vaness', 'vanessa@gmail.com', 'd404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db', 'Marcuzzo | 587fd3c92d0c8587fd3c92d102587fd3c92d139', '1992-03-10', 'rue des crevette', NULL, '1202', 'Genve', '0', '0223334455', NULL, '0', 'F');

INSERT INTO `ccn_personne` (`per_id`, `per_nom`, `per_prenom`, `per_mail`, `per_mdp`, `per_token`, `per_dateNaissance`, `per_adresse`, `per_InfoSuppAdresse`, `per_codePostal`, `per_ville`, `per_admin`, `per_telFixe`, `per_telMobile`, `per_inactif`, `per_genre`) 
VALUES (NULL, 'Paniz', 'Celine', 'celine@gmail.com', 'd404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db', 'Paniz | 587fc869d6c9b587fc869d6cd3587fc869d6d09', '0000-00-00', 'Chemin de poney', NULL, '1202', 'Genève', '0', '022334455', '0789480231', '0', 'F');

INSERT INTO `ccn_personne` (`per_id`, `per_nom`, `per_prenom`, `per_mail`, `per_mdp`, `per_token`, `per_dateNaissance`, `per_adresse`, `per_InfoSuppAdresse`, `per_codePostal`, `per_ville`, `per_admin`, `per_telFixe`, `per_telMobile`, `per_inactif`, `per_genre`) 
VALUES (NULL, 'Ribeiro', 'Juliana', 'julianafilipa4@gmail.com', 'd404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db', 'Ribeiro | 58928fec6ed0f58928fec6ed4958928fec6ed81', '0000-00-00', 'Chemin de crabe', NULL, '1202', 'Genève', '0', '022334455', '0789480231', '0', 'F');


INSERT INTO `ccnt`.`ccn_possede` (`pos_dep_id`, `pos_per_id`) VALUES ('1', '2');
INSERT INTO `ccnt`.`ccn_possede` (`pos_dep_id`, `pos_per_id`) VALUES ('2', '3');
INSERT INTO `ccnt`.`ccn_possede` (`pos_dep_id`, `pos_per_id`) VALUES ('2', '4');
INSERT INTO `ccnt`.`ccn_possede` (`pos_dep_id`, `pos_per_id`) VALUES ('3', '5');

INSERT INTO `ccnt`.`ccn_possede` (`pos_dep_id`, `pos_per_id`) VALUES ('1', '6');
INSERT INTO `ccnt`.`ccn_possede` (`pos_dep_id`, `pos_per_id`) VALUES ('2', '7');
INSERT INTO `ccnt`.`ccn_possede` (`pos_dep_id`, `pos_per_id`) VALUES ('1', '8');
INSERT INTO `ccnt`.`ccn_possede` (`pos_dep_id`, `pos_per_id`) VALUES ('3', '9');


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


/* Avant (Maj BDD CCNT - Enregistrement fait par M. Bedonni) */
/*INSERT INTO `ccn_etablissement` (`eta_id`, `eta_nom`, `eta_adresse`, `eta_telReservation`, `eta_telDirection`, `eta_email`, `eta_siteWeb`, `eta_adresseInfo`, `eta_codePostal`, `eta_localite`, `eta_nbHeure`) VALUES (NULL, 'xxxx', 'xxxx', '0227521211', '0795093454', 'contact@chateaudif.ch', 'www.chteaudif.ch', '', '1222', 'Vésenaz', NULL)

INSERT INTO `ccn_departement` (`dep_id`, `dep_nom`, `dep_eta_id`) 
VALUES (NULL, 'Bar', '38'), (NULL, 'Cuisine', '38'), (NULL, 'lessive', '38'), (NULL, 'Votre département', '38'), (NULL, 'Salle', '38')

INSERT INTO `ccn_appartient` (`app_eta_id`, `app_per_id`) VALUES ('5
	38', '1')

INSERT INTO `ccn_ouvertureInfo` (`ouv_id`, `ouv_jour`, `ouv_debut`, `ouv_fin`, `ouv_eta_id`, `ouv_pauseDebut`, `ouv_pauseFin`) 
VALUES (NULL, 'Mardi', '2016-12-09 07:00:14', '2016-12-10 00:00:14', '38', '0000-00-00 00:00:00', '0000-00-00 00:00:00'), (NULL, 'Lundi', '2016-12-09 07:00:14', '2016-12-10 00:00:14', '38', '0000-00-00 00:00:00', '0000-00-00 00:00:00'), (NULL, 'Jeudi', '2016-12-09 07:00:14', '2016-12-10 00:00:14', '38', '0000-00-00 00:00:00', '0000-00-00 00:00:00'), (NULL, 'Mercredi', '2016-12-09 07:00:14', '2016-12-10 00:00:14', '38', '0000-00-00 00:00:00', '0000-00-00 00:00:00'), (NULL, 'Samedi', '2016-12-09 10:00:14', '2016-12-10 00:00:14', '38', '0000-00-00 00:00:00', '0000-00-00 00:00:00'), (NULL, 'Vendredi', '2016-12-09 07:00:14', '2016-12-10 00:00:14', '38', '0000-00-00 00:00:00', '0000-00-00 00:00:00'), (NULL, 'Dimanche', '2016-12-09 10:00:14', '2016-12-10 00:00:14', '38', '0000-00-00 00:00:00', '0000-00-00 00:00:00')

INSERT INTO `ccn_fermetureInfo` (`fer_id`, `fer_date`, `fer_Eta_id`) VALUES (NULL, '2016-05-20', '38')

INSERT INTO `cnn_pushInfo` (`pus_id`, `pus_nom`, `pus_titre`, `pus_message`, `pus_sousTitre`, `pus_ticket`) 
VALUES (NULL, 'Nouveau planning', 'Nouveau planning', 'Bonjour, votre nouveau planning est prêt !', NULL, NULL), (NULL, 'Modification planning', 'Modification planning', 'Bonjour, votre planning a été modifié', NULL, NULL), (NULL, 'Demande conge acceptee', 'Demande de congée acceptée', 'Bonjour, votre demande de congé a été acceptée', NULL, NULL), (NULL, 'Demande conge refusee', 'Demande de congé refusée', 'Bonjour, votre demande de congé a été refusée', NULL, NULL), (NULL, 'Demande modification acceptee', 'Modification de congé acceptée', 'Bonjour, votre demande de modification de congé a été acceptée', NULL, NULL), (NULL, 'Demande modification refusee', 'Modification de congé refusée', 'Bonjour, votre demande de modification de congé a été refusée', NULL, NULL);

INSERT INTO `cnn_smartphoneInfo` (`sma_per_id`, `sma_deviceToken`)
VALUES ('1', 'c6rjCKA70KY:APA91bHalFA6IDccWKHfSVaNn9eIuJENZZyG3YQ38kvOkijQVr4vxNWxADywaq_aSu1NXaWMQQ0wK8zvsmqbymhoXKwdhZ7pRfo2yUmHs_nM07qOSAJayvt-ENHbWlngSO6MxL1IbRFV'), ('2', 'cqDDEQUUqis:APA91bHXW-BCaGcv3PRdW5_O8Cp2_ELDeAPj-3pVj40LI8-newi7n3rfiNm68eYNv8QOv1an3ZtckVhvDRkVjl0n2U-LQcJwj0F8DUtpu4jY1atSsggOjMgbrSEkClEg-PTeDnHsYAsU'), ('3', 'c6rjCKA70KY:APA91bHalFA6IDccWKHfSVaNn9eIuJENZZyG3YQ38kvOkijQVr4vxNWxADywaq_aSu1NXaWMQQ0wK8zvsmqbymhoXKwdhZ7pRfo2yUmHs_nM07qOSAJayvt-ENHbWlngSO6MxL1IbRFV'), ('4', 'dH16u7jF_D0:APA91bE47O7TumBH0rehtDLNCR6Ynb-v3rmDx5Rpb8flO4xVRB1uIu_JyyMCBMt-8NzJpMDWhBxY57-x1j3CmCqs3dQHZ9RpIwEPpNV3B4qHKkERo1V1dvWQK1dt1HpstC5WX-k_4fCi'), ('5', 'dH16u7jF_D0:APA91bE47O7TumBH0rehtDLNCR6Ynb-v3rmDx5Rpb8flO4xVRB1uIu_JyyMCBMt-8NzJpMDWhBxY57-x1j3CmCqs3dQHZ9RpIwEPpNV3B4qHKkERo1V1dvWQK1dt1HpstC5WX-k_4fCi'), ('6', '12345678'); 
*/