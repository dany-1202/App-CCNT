<?php

require_once("MySQLManager.php");

/**
* Class php qui va gérer toutes les interactions avec un contrat (Table : ccn_contrat). 
* Tout le CRUD sera géré ici.	
*/
class ContratDAO {
	/*
		Permet de modififier le contrat d'une personne !
	*/
	public static function updateContratEmp ($data) {
		$db = MySQLManager::get();
		$query = "UPDATE ccn_contrat SET con_dateIn = ?, con_dateOut = ?, con_particularite = ?, con_hor_id = ?, con_typ_id = ? WHERE con_per_id = ?";
		if ($stmt = $db->prepare($query)) {
			$hor = $data['horaire'];
	  		$type = $data['contrat'];
	  		if ($data['particularite'] == "") {$part = NULL;} else {$part = $data['particularite'];}
	  		if ($data['dateOut'] == "") {$dateOut = NULL;} else {$dateOut = $data['dateOut'];}

			$stmt->bind_param('sssiii', $data['dateIn'], $dateOut, $part, $hor['id'], $type['id'], $data['id']);
		  	$stmt->execute();
		  	$stmt->close();
	  		MySQLManager::close();
	  		return true;
		}
		MySQLManager::close();
		return false;
	}

	/* Insertion dans la table ccn_contrat */
	public static function insertContrat ($data) {
		$db = MySQLManager::get();
	  	$query = "INSERT INTO ccn_contrat (con_dateIn,con_dateOut,con_particularite,con_per_id,con_hor_id,con_typ_id) VALUES (?,?,?,?,?,?)";
	  	if ($stmt = $db->prepare($query)) {
	  		$hor = $data['horaire'];
	  		$type = $data['contrat'];
	  		if ($data['particularite'] == "") {$part = NULL;} else {$part = $data['particularite'];}
	  		if ($data['dateOut'] == "") {$dateOut = NULL;} else {$dateOut = $data['dateOut'];}

			$stmt->bind_param('sssiii', $data['dateIn'], $dateOut, $part, $data['id'], $hor['id'], $type['id']);
		  	$stmt->execute();
		  	$stmt->close();
	  		MySQLManager::close();
	  		return $data['id'];
	  	}
		MySQLManager::close();
		return false;
	}

}

?>