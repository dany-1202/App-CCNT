<?php

require_once("MySQLManager.php");

/**
* Class php qui va gérer toutes les interactions avec la table possede (les département assignés aux personne) (Table : ccn_possede). 
* Tout le CRUD sera géré ici.	
*/
class HoraireEmployeeDAO {
	/*
		Permet de récupérer le départements d'une personne
	*/
	public static function getHorairesEmployee ($per_id) {
		$db = MySQLManager::get();
		$query = "SELECT hop_id, hop_date, hop_heureDebut, hop_heureFin FROM ccn_travail JOIN ccn_horairepersonne ON hop_id = tra_hop_id WHERE tra_per_id = ?";
		if ($stmt=$db->prepare($query)) {
			$stmt->bind_param('i', $per_id);
		  	$stmt->execute();
		  	$stmt->bind_result($hop_id, $hop_date, $hop_heureDebut, $hop_heureFin);
		  	$array = array();
	    	$horaire = [];
	    	while($stmt->fetch()) {
		    	$horaire['id'] = $hop_id;
	        	$horaire['date'] = $hop_date;
	        	$horaire['heureDebut'] = $hop_heureDebut;
	        	$horaire['heureFin'] = $hop_heureFin;
	        	$array[] = $horaire;
	    	}
		  	$stmt->close();
		  	MySQLManager::close();
	  		return $array;
		}
		MySQLManager::close();
		return false;
	}

	private static function validationPlage($db, $horaire) {
		$req = "
			SELECT hop_id, hop_date, hop_heureDebut, hop_heureFin
			FROM ccn_horairepersonne
			JOIN ccn_travail ON tra_hop_id = hop_id
			WHERE tra_per_id = ? 
			AND hop_date = ? 
		";
		if ($stmt=$db->prepare($req)) {
			$stmt->bind_param('is', $horaire['per_id'], $horaire['date']);
		  	$stmt->execute();
		  	$stmt->bind_result($hop_id, $hop_date, $hop_heureDebut, $hop_heureFin);
		  	
		  	if ($horaire['heureFin'] < $horaire['heureDebut']) {
		  		$nbHeureParam = 24-$horaire['heureDebut'];
		  		$nbHeureParam += $horaire['heureFin'];
		  	} else {
		  		$nbHeureParam = $horaire['heureFin'] - $horaire['heureDebut'];
		  	}
		  	
		  	while($stmt->fetch()) {
		  		$nbHeures = 0;
		  		if ($hop_heureFin < $hop_heureDebut) {
			  		$nbHeures = 24-$hop_heureDebut;
			  		$nbHeures += $hop_heureFin;
			  	} else {
			  		$nbHeures = $hop_heureFin - $hop_heureDebut;
			  	}
			  	$dateA = date_create_from_format("H:i:s", $horaire['heureDebut']);
			  	$dateB = date_create_from_format("H:i:s", $hop_heureDebut);
			  	$dateF = date_create_from_format("H:i:s", $hop_heureFin);
			  	if ($dateA->format('H:i:s') >= $dateB->format('H:i:s')) {
			  		if ($dateA->format('H:i:s') < $dateF->format('H:i:s')) {
			  			$dif = $horaire['heureDebut'] - $hop_heureDebut;
				  		if ($dif >= $nbHeureParam) {
				  			return false; // Conflit
				  		}
			  		}
			  	} else {
			  		if ($dateA->format('H:i:s') < $dateF->format('H:i:s')) {
			  			$diff = $hop_heureDebut - $horaire['heureDebut'];
				  		if ($diff <= $nbHeureParam) {
				  			return false; // Conflit
				  		} 
			  		}
			  	}
		  	}
		  	return true; // Si pas de conflit
		}
	}


	public static function insertHoraire ($horaire) {
		$db = MySQLManager::get();
		if (HoraireEmployeeDAO::validationPlage($db, $horaire)) {
			/* Insertion dans la table ccn_personne */
			$query = "INSERT INTO ccn_horairepersonne (hop_date, hop_heureDebut, hop_heureFin) VALUES (?, ?, ?)";
			if ($stmt = $db->prepare($query)) {
				$stmt->bind_param('sss', $horaire['date'], $horaire['heureDebut'], $horaire['heureFin']);
			  	$stmt->execute();
			  	$hop_id = $stmt->insert_id;
			  	$horaire['id'] = $hop_id;
			  	$stmt->close();

			  	$req = "INSERT INTO ccn_travail (tra_per_id, tra_hop_id) VALUES (?, ?)";
			  	if ($stmtTra = $db->prepare($req)) {
					$stmtTra->bind_param('ii', $horaire['per_id'], $horaire['id']);
				  	$stmtTra->execute();
				  	$stmtTra->close();
				  	MySQLManager::close();
			  		return $horaire;
				}
			}
		}
		MySQLManager::close();
		return 0;
	}

	/* N'insére pas encore de pause */
	public static function deleteHoraire ($horaire) {
		$db = MySQLManager::get();
		
		$query = "SELECT hop_id FROM ccn_horairepersonne WHERE hop_date = ? AND hop_heureDebut = ? AND hop_heureFin = ?";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('sss', $horaire['date'], $horaire['heureDebut'], $horaire['heureFin']);
		  	$stmt->execute();
		  	$stmt->bind_result($hop_id);
		  	$stmt->fetch();
		  	$stmt->close();
		  	/* Suppression de l'horaire */
		  	$reqSup = "DELETE FROM ccn_travail WHERE tra_per_id = ? AND tra_hop_id = ?";
		  	if ($req = $db->prepare($reqSup)) {
		  		$req->bind_param('ii', $horaire['per_id'], $hop_id);
		  		$req->execute();
		  		$req->close();
		  		$reqSupHor = "DELETE FROM ccn_horairepersonne WHERE hop_id = ?";
			  	if ($reqHor = $db->prepare($reqSupHor)) {
			  		$reqHor->bind_param('i', $hop_id);
			  		$reqHor->execute();
			  		$reqHor->close();	
				  	MySQLManager::close();
			  		return $hop_id;
			  	}
		  	}
		}
		MySQLManager::close();
		return -1;
	}



}

?>