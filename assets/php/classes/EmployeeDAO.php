<?php

require_once("MySQLManager.php");
/**
* Class php qui va gérer toutes les interactions avec une personne qu'elle soit employe ou employeur. 
* Tout le CRUD sera géré ici.	
*/
class EmployeeDAO {
	
	/* Récupère tous les employés (Attention seulement les employés per_admin = 0) */
	public static function getEmployees () {
		$db = MySQLManager::get();
		$query = "SELECT per_id, per_nom, per_prenom, per_adresse, per_dateNaissance, per_InfoSuppAdresse, per_telFixe, per_telMobile, per_codePostal, per_ville, per_mail, per_genre, dep_id, dep_nom, con_dateIn, con_dateOut, con_particularite, hor_id, hor_nom, typ_id, typ_nom FROM ccn_personne JOIN ccn_possede ON pos_per_id = per_id JOIN ccn_departement ON pos_dep_id = dep_id JOIN ccn_contrat ON con_per_id = per_id JOIN ccn_horairecontrat ON con_hor_id = hor_id JOIN ccn_typecontrat ON con_typ_id = typ_id WHERE per_admin = 0";
		if ($stmt = $db->prepare($query)) {
			/* Exécution de la requête */
		    $stmt->execute();
		    /* Lecture des variables résultantes */
		    $stmt->bind_result($per_id, $per_nom, $per_prenom, $per_adresse, $per_dateNaissance, $per_InfoSuppAdresse, $per_telFixe, $per_telMobile, $per_codePostal, $per_ville, $per_mail, $per_genre, $dep_id, $dep_nom, $con_dateIn, $con_dateOut, $con_particularite, $hor_id, $hor_nom, $typ_id, $typ_nom);
		    /* Récupération des valeurs */
		    $array = array();
		    $person = [];
		    while($stmt->fetch()) {
		    	/* Stocker le département */
		    	$dep = [];
		    	$dep['id'] = $dep_id;
		    	$dep['nom'] = $dep_nom;
				
		    	/* Stocker le type de contrat */
		    	$typ_contrat = [];
		    	$typ_contrat['id'] = $typ_id;
		    	$typ_contrat['nom'] = $typ_nom;

		    	/* Stocker le type horaire du contrat */
		    	$hor_contrat = [];
		    	$hor_contrat['id'] = $hor_id;
		    	$hor_contrat['nom'] = $hor_nom; // Problème avec les accents

		    	/* Stocker les infos du contrat */
		    	$contrat = [];
		    	$contrat['dateIn'] = $con_dateIn;
		    	$contrat['dateOut'] = $con_dateOut;
		    	$contrat['particularite'] = $con_particularite;
		    	$contrat['horaire'] = $hor_contrat;
		    	$contrat['type'] = $typ_contrat;

		    	/* Stocker la personne avec toutes ses infos */
		    	$person['id'] = $per_id;
		        $person['nom'] = $per_nom;
		        $person['prenom'] = $per_prenom;
		        $person['adresse'] = $per_adresse;
		        $person['codePostal'] = $per_codePostal;
		        $person['ville'] = $per_ville;
		        $person['mail'] = $per_mail;
		        $person['genre'] = $per_genre;
		        $person['dateNaissance'] = $per_dateNaissance;
		        $person['adresseSup'] = $per_InfoSuppAdresse;
		        $person['telFixe'] = $per_telFixe;
		        $person['telMobile'] = $per_telMobile;
		        $person['dep'] = $dep;
		        $person['contrat'] = $contrat;

		        $array[] = $person; // L'ajouter au tableau d'objet
		    }
		  	$stmt->close();
		  	MySQLManager::close();
	  		return $array;
		}
		MySQLManager::close();
		return null;
	} // setPersonne

	public static function updateEmployee ($data) {
		$db = MySQLManager::get();
		$query = "UPDATE ccn_personne SET (per_nom = ?, per_prenom = ?, per_mail = ?, per_dateNaissance = ?, per_adresse = ?, per_infoSuppAdresse = ?, per_codePostal = ?, per_ville = ?, per_telFixe = ?, per_telMobile = ?, per_genre = ?) WHERE per_id = ?";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('ssssssissssi', $data['perNom'], $data['perPrenom'], $data['perNaissance'], $data['perAdresse'], $data['perSuppAdresse'], $data['perCodePostal'], $data['perVille'], $data['perTelFixe'], $data['perTelMobile'], $data['perGenre'], $data['perId']);
		  	$stmt->execute();
		  	if ($stmt->num_rows == 1) {
		  		MySQLManager::close();
		  		return true;
		  }
		}
		MySQLManager::close();
		return false;
	}


	/*Permet d'ajouter les données d'une personne dans la table ccn_personne
	  En paramètre: un tableau de data[] contenant :
		per_nom, per_prenom, per_mail, per_mdp, per_token, per_dateNaissance, 
		per_adresse, per_infoSuppAdresse, per_codePostal, per_ville, per_admin, 
		per_telFixe, per_telMobile, per_dep_id, per_genre

	  Contraine BDD : l'attribut per_dep_id doit être > 0 et doit exister dans la bdd
	*/	
	public static function insertPersonne ($data) {
		$db = MySQLManager::get();
		$query = "INSERT INTO ccn_personne (per_nom, per_prenom, per_mail, per_mdp, per_token, per_dateNaissance, per_adresse, per_infoSuppAdresse, per_codePostal, per_ville, per_admin, per_telFixe, per_telMobile, per_genre) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('ssssssssisisss', $data['nom'], $data['prenom'], $data['mail'], $data['mdp'], $data['token'], $data['dateNaissance'], $data['adresse'], $data['infoSuppAdresse'], $data['codePostal'], $data['ville'], $data['admin'], $data['telFixe'], $data['telMobile'], $data['perGenre']);
		  	$stmt->execute();
		  	if ($stmt->num_rows == 1) {
		  		MySQLManager::close();
		  		return true;
		  	}
		}
		MySQLManager::close();
		return false;
	} // insertPersonne
}

?>