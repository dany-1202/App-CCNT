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
		$query = "INSERT INTO ccn_horairepreconfigure (hor_id, hor_libelle, hor_matinDebut, hor_matinFin, hor_soirDebut, hor_soirFin) 
				  VALUES (NULL, ?, ?, ?, ?, ?)";
	  	if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('sssss',$data['hor_libelle'], $data['hor_matinDebut'], $data['hor_matinFin'], $data['hor_soirDebut'], $data['hor_soirFin']);
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
