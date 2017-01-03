<?php

require_once("MySQLManager.php");
/**
* Class php qui va gérer toutes les interactions avec un département. 
* Tout le CRUD sera géré ici.	
*/
class DepartementDAO {
	/* Récupère tous les départements d'un établissement (de l'utilisateur (employeur) connecté) */
	public static function getDepartements ($user_id) {
		$db = MySQLManager::get();
		$query = "SELECT app_eta_id FROM ccn_appartient WHERE app_per_id = ?";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('i', $user_id);
		  	$stmt->execute();
		  	$stmt->bind_result($eta_id);
		  	if ($stmt->fetch()) {
		  		$stmt->close();
		  		$query1 = "SELECT dep_id, dep_nom FROM ccn_departement WHERE dep_eta_id = ?";
				if ($stmt1 = $db->prepare($query1)) {
					$stmt1->bind_param('i', $eta_id);
				  	$stmt1->execute();
				  	$stmt1->bind_result($dep_id, $dep_nom);
				  	$deps = array();
				  	while($stmt1->fetch()) {
				  		$dep = [];
				  		$dep['id'] = $dep_id;
				  		$dep['name'] = $dep_nom;
				  		$deps[] = $dep;
				  	}
				  	$stmt1->close();
				  	MySQLManager::close();
				  	return $deps;
				}
		  	};
		}
		MySQLManager::close();
		return false;
	}
}

?>