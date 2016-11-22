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
	  Contraine BDD : l'attribut etaId de l'instance de Departement doit être > 0 et existé dans la bdd
	*/
	public static function insertDepartement ($data) {
		$db = MySQLManager::get();
		$query = "INSERT INTO ccn_departement (`dep_nom`, `dep_eta_id`) VALUES (?, ?)";
		if ($stmt = $db->prepare($query)) {
			$stmtUp->bind_param('si', $data['nom'], $data['noEta']);
		    $stmtUp->execute();
		}
		MySQLManager::close();
	}

	/*Permet de modifier le nom d'un Departement de la table ccn_departement
	  En paramètre: une instance de Departement contenant : 
		le nom du Departement
		l'id du Departement
      Contraine BDD : le département identifié par son id doit existé dans la base
	*/
	public static function setDepartement (Departement $d) {
		$db = MySQLManager::get();
		$query = "UPDATE ccn_departement SET dep_nom = ? WHERE dep_id = ?";
		if ($stmt = $db->prepare($query)) {
			$stmtUp->bind_param('si', $d::getNom(), $d::getEtaId());
		    $stmtUp->execute();
		}
	    MySQLManager::close();
	}

	/*Permet d'ajouter un Etablissement dans la table ccn_etablissement
	  En paramètre: un Etablissement Contenant :
		le nom, l'adresse, le teléphone de réservation, le téléphone de direction, l'email, 
		le site web, le supplément d'adresse, le code postal, la localite, le nombre d'heure
	*/
	public static function insertEtablissement (Etablissement $e) {
		$db = MySQLManager::get();
		$query = "INSERT INTO ccn_etablissement (`dep_nom`, `dep_adresse`, `dep_telReservation`, `dep_telDirection`, `dep_email`, `dep_siteWeb`, `dep_adresseInfo`, `dep_codePostal`, `dep_localite`, `dep_nbHeure`) 
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
		if ($stmt = $db->prepare($query)) {
			$stmtUp->bind_param('sssssssisi', $e::getNom(), $e::getAdresse(), $e::getTelReservation(), $e::getTelDirection(), $e::getEmail(), $e::getSiteWeb(), $e::getAdresseInfo(), $e::getCodePostal(), $e::getLocalite(), $e::getNbHeure());
		    $stmtUp->execute();
		}
	    MySQLManager::close();
	}

//pas fonctionnelle encore
	public static function insertPersonne (Personne $p) {
		$db = MySQLManager::get();
		$query = "INSERT INTO ccn_personne VALUES (-1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
		if ($stmt = $db->prepare($query)) {
			//$stmtUp->bind_param('sssssdssisissi', $e::getNom(), $e::getAdresse(), $e::getTelReservation(), $e::getTelDirection(), $e::getEmail(), $e::getSiteWeb(), $e::getAdresseInfo(), $e::getCodePostal(), $e::getLocalite(), $e::getNbHeure());
		    $stmtUp->execute();
		}
	    MySQLManager::close();
	}

}

?>
