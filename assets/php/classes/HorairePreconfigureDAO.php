<?php

require_once("MySQLManager.php");

/**
* Class php qui va gérer toutes les interactions avec la table horairePreconfigure (Table : ccn_horairePreconfigure). 
* Tout le CRUD sera géré ici.	
*/
class HorairePreconfigureDAO {

	
	public static function getHorairePreconfig ($data) {
		$db = MySQLManager::get();
      		$query = "SELECT jou_id, jou_sem, jou_heureDebut, jou_heureFin, jou_heureDebutS, jou_heureFinS, jou_pause, jou_pauseS, hpr_id, hpr_nom FROM ccn_horairepreconfig JOIN ccn_contient ON con_hpr_id = hpr_id JOIN ccn_jourpreconfig ON con_jou_id = jou_id WHERE hpr_dep_id = ?";	
	  	if ($stmt = $db->prepare($query)) {
					
	  		$stmt->bind_param('i', $data['dep_id']);
		  	$stmt->execute();
		  	$stmt->bind_result($jou_id, $jou_sem, $jou_heureDebut, $jou_heureFin, $jou_heureDebutS, $jou_heureFinS, $jou_pause, $jou_pauseS, $hpr_id, $hpr_nom);
		  	$hoursPreConfig = array();
		  	$horaires = array();
		  	while($stmt->fetch()) {
		  		$horaire = [];
	  			$horaire['id'] = $hpr_id;
  				$horaire['nom'] = $hpr_nom;
  				$horaire['liste'] = false;
		  		if (!in_array($horaire, $horaires, TRUE)) {
	  				$horaires[] = $horaire;
		  		}
		  		$jour = [];
		  		$jour['hpr_id'] = $hpr_id;
  				$jour['hpr_nom'] = $hpr_nom;
		  		$jour['id'] = $jou_id;
		  		$jour['jour'] = $jou_sem;
		  		$jour['heureDebut'] = $jou_heureDebut;
		  		$jour['heureFin'] = $jou_heureFin;
		  		$jour['heureDebutS'] = $jou_heureDebutS;
		  		$jour['heureFinS'] = $jou_heureFinS;
		  		$jour['pause'] = $jou_pause;
		  		$jour['pauseS'] = $jou_pauseS;
		  		$jour['liste'] = true;
		  		$horaires[] = $jour;
	  			
  			}
  			$hoursPreConfig[] = $horaires;
  			
		  	$stmt->close();
	  		MySQLManager::close();
	  		return $hoursPreConfig;
		}
		MySQLManager::close();
		return -1;
	}
	
	
	/*
		Permet d'inserer dans la table ccn_contient l'assignation d'un département à une personne !
		Contrainte BDD: 
	*/
	public static function insertHorairePreconfig ($data) {
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
	
	public static function insertJourPreconfig ($idJour, $heureDebut, $heureFin, $heureDebutS, $heureFinS, $pause, $pauseS, $hpr_id) {
		$db = MySQLManager::get();
		$query = "INSERT INTO ccn_jourpreconfig (jou_id, jou_sem, jou_heureDebut, jou_heureFin, jou_heureDebutS, jou_heureFinS, jou_pause, jou_pauseS) 
				  VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)";
	  	if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('issssii', $idJour, $heureDebut, $heureFin, $heureDebutS, $heureFinS, $pause, $pauseS);
		  	$stmt->execute();
		  	$stmt->store_result();
		  	$jou_id = $stmt->insert_id;
		  	$stmt->close();
		  	
		  	$query1 = "INSERT INTO ccn_contient (con_hpr_id, con_jou_id) 
				  VALUES (?, ?)";
				  
		  	if ($stmt1 = $db->prepare($query1)) {
		  		$stmt1->bind_param('ii', $hpr_id, $jou_id);
		  		$stmt1->execute();
		  		$stmt1->close();
		  		MySQLManager::close();
				return $jou_id;
		  	}
		}
		MySQLManager::close();
		return -1;
	}


	public static function deleteJourPreconfig($id, $hpr_id){
		$db = MySQLManager::get();

		$query = "DELETE FROM `ccn_contient` WHERE con_jou_id = ? AND con_hpr_id = ? ";
  		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('ii', $id, $hpr_id);
		  	$stmt->execute();
		  	$stmt->close();
		  	$query = "DELETE FROM `ccn_jourpreconfig` WHERE jou_id = ?";
	  		if ($stmt = $db->prepare($query)) {
				$stmt->bind_param('i', $id);
			  	$stmt->execute();
			  	$stmt->close();
			  	MySQLManager::close();
				return 1;
			}
		}

		MySQLManager::close();
		return -1;
	}

	public static function updateJourPreconfig($data){
		$db = MySQLManager::get();

		$query = "UPDATE `ccn_jourpreconfig` SET `jou_heureDebut`=?,`jou_heureFin`=?,`jou_heureDebutS`=?,`jou_heureFinS`=?,`jou_pause`=?,`jou_pauseS`=? WHERE jou_id = ?";
  		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('ssssiii', $data['matinDebut'], $data['matinFin'],$data['soirDebut'],$data['soirFin'],$data['pauseMatin'],$data['pauseSoir'],$data['jou_id']);
		  	$stmt->execute();
		  	$stmt->close();
		  	MySQLManager::close();
			return 1;
		}

		MySQLManager::close();
		return -1;
	}

	public static function updateHorairePreconfig($data) {
		$db = MySQLManager::get();

		$query = "UPDATE `ccn_horairepreconfig` SET `hpr_nom`= ?,`hpr_dep_id`= ? WHERE hpr_id = ?";
  		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('sii', $data['hpr_nom'], $data['hpr_dep_id'], $data['hpr_id']);
		  	$stmt->execute();
		  	$stmt->close();
		  	MySQLManager::close();
			return 1;
		}
		MySQLManager::close();
		return -1;
	}


	public static function deleteHorairePreconfig($data) {
		$db = MySQLManager::get();

		$query = "SELECT jou_id FROM ccn_jourpreconfig JOIN ccn_contient WHERE con_hpr_id = ?";
	  	if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('i', $data['hpr_id']);
		  	$stmt->execute();
		  	$stmt->bind_result($jou_id);
		  	$tab = array();
		  	while ($stmt->fetch()) {
		  		$tab[] = $jou_id;
		  	}
		  	$stmt->close();

			$query = "DELETE FROM `ccn_contient` WHERE con_hpr_id = ?";
	  		if ($stmt = $db->prepare($query)) {
				$stmt->bind_param('i', $data['hpr_id']);
			  	$stmt->execute();
			  	$stmt->close();
			  	$query = "DELETE FROM `ccn_horairepreconfig` WHERE hpr_id = ?";
		  		if ($stmt = $db->prepare($query)) {
					$stmt->bind_param('i', $data['hpr_id']);
				  	$stmt->execute();
				  	$stmt->close();
				  	foreach ($tab as $key => $val) {
				  		HorairePreconfigureDAO::deleteJourPreconfig($val, $data['hpr_id']);				  	
				  	}
				  	MySQLManager::close();
					return 1;
				}
			}
		}
		MySQLManager::close();
		return -1;
	}
	
	
}



?>
