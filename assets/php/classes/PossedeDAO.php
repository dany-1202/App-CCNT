<?php

require_once("MySQLManager.php");

/**
* Class php qui va gérer toutes les interactions avec la table possede (les département assignés aux personne) (Table : ccn_possede). 
* Tout le CRUD sera géré ici.	
*/
class PossedeDAO {
	/*
		Permet de modififier le département assigné à une personne !
		Contrainte BDD: on doit avoir l'id de la personne que l'on souhaite modifier
	*/
	public static function updatePossede ($data) {
		$db = MySQLManager::get();
		$query = "UPDATE ccn_possede SET pos_dep_id = ? WHERE pos_per_id = ?";
		if ($stmt = $db->prepare($query)) {
			$dep = $data['dep'];
			$stmt->bind_param('ii', $dep['id'], $data['id']);
		  	$stmt->execute();
		  	$stmt->close();
	  		MySQLManager::close();
	  		return true;
		}
		MySQLManager::close();
		return false;
	}

	/*
		Permet d'inserer dans la table ccn_possede l'assignation d'un département à une personne !
		Contrainte BDD: on doit avoir l'id de la personne que l'on souhaite modifier
	*/
	public static function insertPossede ($data) {
		$db = MySQLManager::get();
		$query = "INSERT INTO ccn_possede (pos_dep_id, pos_per_id) VALUES (?, ?)";
	  	if ($stmt = $db->prepare($query)) {
	  		$dep = $data['dep'];
			$stmt->bind_param('ii', $dep['id'], $data['id']);
		  	$stmt->execute();
		  	$stmt->close();
		  	MySQLManager::close();
			return true;
		}
		MySQLManager::close();
		return false;
	}

}

?>