<?php
/**
 *
 */
require_once("MySQLManager.php");
/**
 *
 * @access public
 */
/*
	Class name : InitialState
	Description : Contient les fonctions permettant d'intéragir avec la bdd
*/
class InitialState {

	/*Permet d'ajouter un Departement dans la table ccn_departement
	  En paramètre: une instance de Departement contenant :
		le nom du Departement
		l'id de l'Etablissement
	  Contraine BDD : l'attribut etaId de l'instance de Departement doit être > 0 et exister dans la bdd
	*/
	public static function insertDepartement ($data) {
		$db = MySQLManager::get();
		$query = "INSERT INTO ccn_departement (`dep_nom`, `dep_eta_id`) VALUES (?, ?)";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('si', $data['nom'], $data['noEta']);
		  	$stmt->execute();
		  	if ($stmt->num_rows == 1) {
		  		MySQLManager::close();
		  		return true;
		  	}
		}
		MySQLManager::close();
		return false;
	}

	/*Permet de modifier le nom d'un Departement de la table ccn_departement
	  En paramètre: une instance de Departement contenant : 
		le nom du Departement
		l'id du Departement
      Contraine BDD : le département identifié par son id doit existé dans la base
	*/
    public static function setDepartement ($data) {
		$db = MySQLManager::get();
		$query = "UPDATE ccn_departement set dep_nom = ? WHERE dep_id = ?";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('si', $data['depNom'], $data['etaId']);
		  	$stmt->execute();
		  	if ($stmt->num_rows == 1) {
		  		MySQLManager::close();
		  		return true;
		  }
		}
		MySQLManager::close();
		return false;
	}

	//ne fonctionne pas !!!!!!!
	/*Permet d'ajouter un Etablissement dans la table ccn_etablissement
	  En paramètre: un Etablissement Contenant :
		le nom, l'adresse, le teléphone de réservation, le téléphone de direction, l'email, 
		le site web, le supplément d'adresse, le code postal, la localite, le nombre d'heure
	*/	
		
	/*public static function insertEtablissement ($data) {
	    $db = MySQLManager::get();
		$query = "INSERT INTO ccn_etablissement VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('sssssssisi', $data['nom'], $data['adresse'], $data['telReservation'], $data['telDirection'], $data['email'], $data['siteWeb'], $data['adresseInfo'], $data['codePostal'], $data['localite'], $data['nbHeure']);
			$stmt->execute();
			if ($stmt->num_rows == 1) {
			  	MySQLManager::close();
			  	return true;
		  	}
		}
		MySQLManager::close();
		return false;
	}*/

	/*Permet d'ajouter un Departement dans la table ccn_departement
	  En paramètre: une instance de Departement contenant :
		le nom du Departement
		l'id de l'Etablissement
	  Contraine BDD : l'attribut etaId de l'instance de Departement doit être > 0 et existé dans la bdd
	*/	
	  public static function insertPersonne ($data) {
		$db = MySQLManager::get();
		$query = "INSERT INTO ccn_personne (per_nom, per_prenom, per_mail, per_mdp, per_token, per_dateNaissance, per_adresse, per_infoSuppAdresse, per_codePostal, per_ville, per_admin, per_telFixe, per_telMobile, per_dep_id, per_genre) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('ssssssssisissis', $data['nom'], $data['prenom'], $data['mail'], $data['mdp'], $data['token'], $data['dateNaissance'], $data['adresse'], $data['infoSuppAdresse'], $data['codePostal'], $data['ville'], $data['admin'], $data['telFixe'], $data['telMobile'], $data['depId'], $data['perGenre']);
		  	$stmt->execute();
		  	if ($stmt->num_rows == 1) {
		  		MySQLManager::close();
		  		return true;
		  	}
		}
		MySQLManager::close();
		return false;
	}

}

?>
