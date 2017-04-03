<?php

require_once("MySQLManager.php");

/**
* Class php qui va gérer toutes les interactions avec la table contient (Table : ccn_contient). 
* Tout le CRUD sera géré ici.	
*/
class ContientDAO {


	/*
		Permet d'inserer dans la table ccn_contient l'assignation d'un département à une personne !
		Contrainte BDD: les 2 id doivent exister !
	*/
	public static function insertContient ($data) {
		$db = MySQLManager::get();
		$query = "INSERT INTO ccn_contient (con_dep_id, con_hor_id) VALUES (?, ?)";
	  	if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('ii', $data['dep_id'], $data['hor_id']);
		  	$stmt->execute();
		  	$stmt->close();
		  	MySQLManager::close();
			return $query;
			//return true;
		}
		MySQLManager::close();
		return false;
	}

}

?>
