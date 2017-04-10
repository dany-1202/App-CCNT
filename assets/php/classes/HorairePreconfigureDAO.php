<?php

require_once("MySQLManager.php");

/**
* Class php qui va gérer toutes les interactions avec la table horairePreconfigure (Table : ccn_horairePreconfigure). 
* Tout le CRUD sera géré ici.	
*/
class HorairePreconfigureDAO {


	/*
		Permet d'inserer dans la table ccn_contient l'assignation d'un département à une personne !
		Contrainte BDD: 
	*/
	public static function insertHorairePreconfigure ($data) {
		$db = MySQLManager::get();

		$query = "INSERT INTO ccn_horairepreconfig (hpr_id, hpr_nom, hpr_dep_id) 
				  VALUES (NULL, ?, ?)";
	  	if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('si',$data['hpr_nom'], $data['hpr_dep_id']);
		  	$stmt->execute();
		  	$stmt->store_result();
		  	$hpr_id = $stmt->insert_id;
		  	$stmt->close();
		  	MySQLManager::close();
			return $hpr_id;
		}
		MySQLManager::close();
		return -1;
	}
}



?>
