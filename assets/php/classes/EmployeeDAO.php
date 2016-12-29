<?php

require_once("MySQLManager.php");
/**
* 	
*/
class EmployeeDAO {
	
	public static function getEmployees () {
		$db = MySQLManager::get();
		$query = "SELECT per_nom, per_prenom, per_admin, per_genre, dep_id, dep_nom FROM ccn_personne JOIN ccn_possede ON pos_per_id = per_id JOIN ccn_departement ON pos_dep_id = dep_id WHERE per_admin like 0";
		if ($stmt = $db->prepare($query)) {
			/* Exécution de la requête */
		    $stmt->execute();
		    /* Lecture des variables résultantes */
		    $stmt->bind_result($per_nom, $per_prenom, $per_admin, $per_genre, $dep_id, $dep_nom);
		    /* Récupération des valeurs */
		    $array = array();
		    $person = [];
		    while($stmt->fetch()) {
		        $person['nom'] = $per_nom;
		        $person['prenom'] = $per_prenom;
		        $person['admin'] = $per_admin;
		        $person['dep_id'] = $dep_id;
		        $person['genre'] = $per_genre;
		        $person['dep_nom'] = $dep_nom;
		        $array[] = $person;
		    }
		  	$stmt->close();
		  	MySQLManager::close();
	  		return $array;
		}
		MySQLManager::close();
		return null;
	} // setPersonne
}

?>