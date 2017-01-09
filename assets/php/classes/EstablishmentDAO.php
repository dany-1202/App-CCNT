<?php

require_once("MySQLManager.php");
/**
* Class php qui va gérer toutes les interactions avec un établissement. 
* Tout le CRUD sera géré ici.	
*/
class EstablishmentDAO {
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
}

?>