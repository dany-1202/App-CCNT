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
	Class name : EtatInitial
	Description : Contient les fonctions permettant d'intéragir avec la bdd
*/
class EtatInitial {

	/*Permet d'ajouter un Departement dans la table ccn_departement
	  En paramètre: un tableau de data[] contenant :
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
	} // insertDepartement

	/*Permet de modifier le nom d'un Departement de la table ccn_departement
	  En paramètre: un tableau de data[] contenant :
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
	} // setDepartement

	/*Permet d'ajouter un Etablissement dans la table ccn_etablissement
	  En paramètre: un tableau de data[] contenant :
		le nom, l'adresse, le teléphone de réservation, le téléphone de direction, l'email, 
		le site web, le supplément d'adresse, le code postal, la localite, le nombre d'heure
	*/	
	public static function insertEtablissement ($data) {
	    $db = MySQLManager::get();
		$query = "INSERT INTO ccn_etablissement (eta_nom, eta_adresse, eta_telReservation, eta_telDirection, eta_email, eta_siteWeb, eta_adresseInfo, eta_codePostal, eta_localite, eta_nbHeure) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('sssssssisi', $data['nom'], $data['adresse'], $data['telReservation'], $data['telDirection'], $data['email'], $data['siteWeb'], $data['adresseInfo'], $data['codePostal'], $data['localite'], $data['nbHeure']);
			$stmt->execute();
			MySQLManager::close();
			return $stmt->insert_id;
		}
		MySQLManager::close();
		return -1;
	} // insertEtablissement

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
	
	/* Permet d'insérer dans la bdd le lien qui relie le département à une personne */
	//LA FONCTION N'A PAS ENCORE ETE TESTEE
	public static function insertPossede ($data) {
		$db = MySQLManager::get();
		$query = "INSERT INTO ccn_possede (pos_dep_id, pos_per_id) VALUES (?, ?)";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('ii', $data['depId'], $data['perId']);
		  	$stmt->execute();
		  	if ($stmt->num_rows == 1) {
		  		MySQLManager::close();
		  		return true;
		  	}
		}
		MySQLManager::close();
		return false;
	} // insertPossede

	/*Permet d'ajouter une heure de fermeture dans la table ccn_fermetureInfo
	  En paramètre: un Etablissement Contenant :
		la date de fermeture
		l'identifiant de l'établissement
	*/
	public static function insertFermetureInfo ($data) {
		$db = MySQLManager::get();
		$query = "INSERT INTO ccn_fermetureInfo (fer_date, fer_eta_id) VALUES (?, ?)";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('si', $data['date'], $data['etaId']);
		  	$stmt->execute();
		  	if ($stmt->num_rows == 1) {
		  		MySQLManager::close();
		  		return true;
		  	}
		}
		MySQLManager::close();
		return false;
	} // insertFermetureInfo

	/*Permet d'ajouter une heure d'ouverture dans la table ccn_ouvertureInfo
	  En paramètre: un Etablissement Contenant :
		la date d'ouverture
		une date / heure de début
		une date / heure de fin
		l'identifiant de l'établissement
	*/
	public static function insertOuvertureInfo ($data) {
		$db = MySQLManager::get();
		$query = "INSERT INTO ccn_ouvertureInfo (ouv_jour, ouv_debut, ouv_fin, ouv_pauseDebut, ouv_pauseFin, ouv_eta_id) VALUES (?, ?, ?, ?, ?, ?)";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('sssssi', $data['jour'], $data['debut'], $data['fin'], $data['pauseDebut'], $data['pauseFin'], $data['etaId']);
		  	$stmt->execute();
		  	if ($stmt->num_rows == 1) {
		  		MySQLManager::close();
		  		return true;
		  	}
		}
		MySQLManager::close();
		return false;
	} // insertOuvertureInfo

	public static function insertPersonInEstablishment ($data) {
		$db = MySQLManager::get();
		$query = "INSERT INTO ccn_appartient (app_eta_id, app_per_id) VALUES (?, ?)";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('ii', $data['eta_id'], $data['user_id']);
		  $stmt->execute();
		  if ($stmt->num_rows == 1) {
		  	MySQLManager::close();
		  	return true;
		  }
		}
		MySQLManager::close();
		return false;
	} // insertPersonInEstablishment

	/*
		Permet de vérifier si un établissement a déjà été configuré pour celle qui est connectée
	*/
	public static function checkConfiguration ($data) {
		$db = MySQLManager::get();
		$query = "SELECT app_eta_id FROM ccn_appartient WHERE app_per_id = ?";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('i', $data['user_id']);
	  	$stmt->execute();
	  	$stmt->store_result();
	  	if ($stmt->num_rows == 1) {
	  		MySQLManager::close();
	  		return true;
	  	}
		}
		MySQLManager::close();
		return false; // Il ne trouve rien
	} // checkConfiguration
	
	
}

?>
