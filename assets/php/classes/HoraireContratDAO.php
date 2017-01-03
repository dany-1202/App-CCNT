<?php

require_once("MySQLManager.php");
/**
* Class php qui va gérer toutes les interactions avec un département. 
* Tout le CRUD sera géré ici.	
*/
class HoraireContratDAO {
	/* Récupère tous les départements d'un établissement (de l'utilisateur (employeur) connecté) */
	public static function getHorairesContrat () {
		$db = MySQLManager::get();
		$query = "SELECT hor_id, hor_nom FROM ccn_horairecontrat";
		if ($stmt = $db->prepare($query)) {
		  	$stmt->execute();
		  	$stmt->bind_result($hor_id, $hor_nom);
		  	$hors = array();
		  	while($stmt->fetch()) {
		  		$hor = [];
		  		$hor['id'] = $hor_id;
		  		$hor['name'] = $hor_nom;
		  		$hors[] = $hor;
		  	}
		  	$stmt->close();
		  	MySQLManager::close();
		  	return $hors;
		}
		MySQLManager::close();
		return false;
	}
}

?>