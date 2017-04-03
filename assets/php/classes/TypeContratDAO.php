<?php

require_once("MySQLManager.php");
/**
* Class php qui va gérer toutes les interactions avec un département. 
* Tout le CRUD sera géré ici.	
*/
class TypeContratDAO {
	/* Récupère tous les départements d'un établissement (de l'utilisateur (employeur) connecté) */
	public static function getTypesContrat () {
		$db = MySQLManager::get();
		$query = "SELECT typ_id, typ_nom FROM ccn_typecontrat";
		if ($stmt = $db->prepare($query)) {
		  	$stmt->execute();
		  	$stmt->bind_result($typ_id, $typ_nom);
		  	$types = array();
		  	while($stmt->fetch()) {
		  		$type = [];
		  		$type['id'] = $typ_id;
		  		$type['name'] = $typ_nom;
		  		$types[] = $type;
		  	}
		  	$stmt->close();
		  	MySQLManager::close();
		  	return $types;
		}
		MySQLManager::close();
		return false;
	}
}

?>