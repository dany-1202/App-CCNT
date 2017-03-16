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
		
		$query = "SELECT hop_id, hop_date, hop_heureDebut, hop_heureFin, hop_pauseDebut, hop_pauseFin FROM ccn_travail JOIN ccn_horairepersonne ON hop_id = tra_hop_id WHERE tra_per_id = ?";
		
		if ($stmt=$db->prepare($query)) {
			$stmt->bind_param('i', $per_id);
		  	$stmt->execute();
		  	$stmt->bind_result($hop_id, $hop_date, $hop_heureDebut, $hop_heureFin, $hop_pauseDebut, $hop_pauseFin);
		  	$array = array();
<<<<<<< Updated upstream
		    	$horaire = [];
		    	while($stmt->fetch()) {
			    	$horaire['id'] = $hop_id;
			        	$horaire['date'] = $hop_date;
			        	$horaire['heureDebut'] = $hop_heureDebut;
			        	$horaire['heureFin'] = $hop_heureFin;
			        	$horaire['pauseDebut'] = $hop_pauseDebut;
			        	$horaire['pauseFin'] = $hop_pauseFin;
			        	$array[] = $horaire;
		    	}
=======
		    $horaire = [];
		    while($stmt->fetch()) {
		    	$horaire['id'] = $hop_id;
		        $horaire['date'] = $hop_date;
		        $horaire['heureDebut'] = $hop_heureDebut;
		        $horaire['heureFin'] = $hop_heureFin;
		        $horaire['pauseDebut'] = $hop_pauseDebut;
		        $horaire['pauseFin'] = $hop_pauseFin;
		        $array[] = $horaire;
		    }
>>>>>>> Stashed changes
		  	$stmt->close();
		  	MySQLManager::close();
	  		return $array;
		}
		MySQLManager::close();
		return false;
	}

	/* N'insére pas encore de pause */
	public static function insertHoraire ($horaire) {
		$db = MySQLManager::get();
		/* Insertion dans la table ccn_personne */
		$query = "INSERT INTO ccn_horairepersonne (hop_date, hop_heureDebut, hop_heureFin, hop_pauseDebut, hop_pauseFin) VALUES (?, ?, ?, NULL, NULL)";
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
		MySQLManager::close();
		return -1;
	}

	/* N'insére pas encore de pause */
<<<<<<< Updated upstream
	public static function deleteHoraire ($horaire) {
=======
	public static function supprimerHoraire ($horaire) {
>>>>>>> Stashed changes
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