<?php

require_once("MySQLManager.php");
/**
* Class php qui va gérer toutes les interactions avec une personne qu'elle soit employe ou employeur. 
* Tout le CRUD sera géré ici.	
*/
class AbsenceDAO {
	/*
		Retourne les absences pour la création de planning
	*/	
	public static function getAbsence() {
		$db = MySQLManager::get();
		$query = "SELECT abs_id,abs_nom from ccn_absence";
		if ($stmt = $db->prepare($query)) {
			/* Exécution de la requête */
			$stmt->execute();
			/* Lecture des variables résultantes */
			$stmt->bind_result($abs_id, $abs_nom);
			/* Récupération des valeurs */
			$array = array();
			$absence = [];
			while($stmt->fetch()) {
			    	/* Stocker l'absence */
			    	$absence = [];
			    	$absence['id'] = $abs_id;
			    	$absence['name'] = $abs_nom;

					$array[] = $absence; // L'ajouter au tableau d'objet
		    	}
		  	$stmt->close();
		  	MySQLManager::close();
	  		return $array;
		}
		MySQLManager::close();
		return null;
	}

	

}

?>