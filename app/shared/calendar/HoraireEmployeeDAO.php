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

	public static function getAbsence ($id) {
		$db = MySQLManager::get();
		$query = "SELECT abs_nom FROM ccn_absence WHERE abs_id = ?";
		if ($stmt=$db->prepare($query)) {
			$stmt->bind_param('i', $id);
		  	$stmt->execute();
		  	$stmt->bind_result($abs_nom);
		  	$stmt->fetch();
		  	$stmt->close();
		  	MySQLManager::close();
	  		return $abs_nom;
		}
		MySQLManager::close();
		return false;
	}

	public static function seconds($time){
		$time = explode(':', $time);
		return ($time[0]*3600) + ($time[1]*60) + $time[2];
	}
	
	public static function toHoursMinutesSeconds ($seconds) {
		$hours = floor($seconds / 3600);
	  	$minutes = floor(($seconds / 60) % 60);
	  	$seconds = $seconds % 60;
	  	return "$hours:$minutes:$seconds";
	}
	
	public static function daysToHoursMinutesSeconds ($days) {
		$seconds = 86400*$days;
	  	return HoraireEmployeeDAO::toHoursMinutesSeconds($seconds);
	}
	
	
	public static function timeToObject ($time) {
	  	$objet = [];
	  	$objet['time'] = $time;
	  	$timeexploded = explode(':', $time);
	  	$objet['hours'] = $timeexploded[0];
	  	$objet['minutes'] = $timeexploded[1];
	  	$objet['seconds'] = $timeexploded[2];
	  	return $objet;
	}
	
	public static function timeToObjectWithDays ($time, $days) {
	  	$objet = [];
	  	$objet['time'] = $days;
	  	$timeexploded = explode(':', $time);
	  	$objet['hours'] = $timeexploded[0];
	  	$objet['minutes'] = $timeexploded[1];
	  	$objet['seconds'] = $timeexploded[2];
	  	return $objet;
	}

	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/* 
		Function qui permet de récupérer un objet qui contient :
			- brut : 
			- jour de congés qu'il a pris,
			- net,
			- pause
	*/
	public static function getInfosSolde ($per_id, $dateDebut, $dateFin) {
		$db = MySQLManager::get();
		$query = "SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(hop_heureFin, hop_heureDebut)))) FROM ccn_travail JOIN ccn_horairepersonne ON hop_id = tra_hop_id WHERE hop_heureDebut < hop_heureFin AND tra_per_id = ? AND hop_date BETWEEN ? and ?";
		
		if ($stmt=$db->prepare($query)) {
			$stmt->bind_param('iss', $per_id, $dateDebut, $dateFin);
		  	$stmt->execute();
		  	$stmt->bind_result($nbHeuresMin);
	    	$stmt->fetch();
	    	
	    	$infos = [];
	    	
		  	$stmt->close();
		  	
		  	$query2 = "SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(hop_heureDebut, hop_heureFin)))) FROM ccn_travail JOIN ccn_horairepersonne ON hop_id = tra_hop_id WHERE hop_heureDebut >= hop_heureFin AND tra_per_id = ? AND hop_date BETWEEN ? and ?";
		  	if ($stmt=$db->prepare($query2)) {
				$stmt->bind_param('iss', $per_id, $dateDebut, $dateFin);
			  	$stmt->execute();
			  	$stmt->bind_result($nbHeuresPos);
		    	$stmt->fetch();
		    	
		    	$infos = [];
		    	
			  	$stmt->close();
			  	
			  	$queryeff = "SELECT SEC_TO_TIME((SUM(hop_pause)*60)) FROM ccn_travail JOIN ccn_horairepersonne ON hop_id = tra_hop_id LEFT JOIN ccn_absence ON abs_id = hop_abs_id AND tra_per_id = ? AND hop_date BETWEEN ? and ?";
			  	if ($stmt = $db->prepare($queryeff)) {
			  		$stmt->bind_param('iss', $per_id, $dateDebut, $dateFin);
				  	$stmt->execute();
				  	$stmt->bind_result($pauseTotal);
			    	$stmt->fetch();
			    	
			    	$res = HoraireEmployeeDAO::seconds($nbHeuresMin) + HoraireEmployeeDAO::seconds($nbHeuresPos);
		    		$infos['brut'] = HoraireEmployeeDAO::timeToObject(HoraireEmployeeDAO::toHoursMinutesSeconds($res));
			    	$infos['totalPause'] = HoraireEmployeeDAO::timeToObject($pauseTotal);
			    	
			    	$infos['net'] = HoraireEmployeeDAO::timeToObject(HoraireEmployeeDAO::toHoursMinutesSeconds(($res - HoraireEmployeeDAO::seconds($pauseTotal))));
				  	$stmt->close();
				  	
				  	$queryNbConge = "SELECT SUM(hop_abs_freq) FROM ccn_travail JOIN ccn_horairepersonne ON hop_id = tra_hop_id LEFT JOIN ccn_absence ON abs_id = hop_abs_id AND tra_per_id = ? AND hop_date BETWEEN ? and ? AND hop_abs_id NOT LIKE NULL";
				  	if ($stmt = $db->prepare($queryNbConge)) {
				  		$stmt->bind_param('iss', $per_id, $dateDebut, $dateFin);
					  	$stmt->execute();
					  	$stmt->bind_result($pauseTotal);
				    	$stmt->fetch();
				    	$infos['conges'] = $pauseTotal;
					  	$stmt->close();
					  	MySQLManager::close();
		  				return (json_encode($infos));
				  	}
			  	}
			}
		}
		MySQLManager::close();
		return false;
	}
	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/* 
		Function qui permet de récupérer un objet qui contient :
			- droitconges : 8.5714285714286
			- droitjoursferies/mois : 6
			- droitvacances/annee : Object 
			- droitvacances/mois : Object
			- heures/mois : 135heures/semaine 
			- solde: Object {hours: 232,minutes: 34,seconds: 59, time: "232:34:59"}
			- joureffectifconges : 30
			- joureffectifheures : 21
			- tot/semaine : 3
	*/
	public static function getInfosHeuresMois ($per_id, $mois, $annee, $eta_id) {
		$db = MySQLManager::get();
		$queryHeureCCNT = "SELECT eta_nbHeure FROM ccn_etablissement WHERE eta_id = ?";
		if ($stmt=$db->prepare($queryHeureCCNT)) {
			$stmt->bind_param('i', $eta_id);
		  	$stmt->execute();
		  	$stmt->bind_result($heuresCCNT);
	    	$stmt->fetch();
	    	$stmt->close();
		
		
			$query = "SELECT SUM(hop_abs_freq) FROM ccn_travail JOIN ccn_horairepersonne ON hop_id = tra_hop_id LEFT JOIN ccn_absence ON abs_id = hop_abs_id WHERE tra_per_id = ? AND MONTH(hop_date) = ? AND hop_abs_id NOT LIKE NULL AND hop_abs_id <> 9";
			if ($stmt=$db->prepare($query)) {
				$stmt->bind_param('ii', $per_id, $mois);
			  	$stmt->execute();
			  	$stmt->bind_result($nbDaysAbsencesSansAutre);
		    	$stmt->fetch();
		    	$stmt->close();
		    	
		    	
		    	$queryAbsencesTotal = "SELECT SUM(hop_abs_freq) FROM ccn_travail JOIN ccn_horairepersonne ON hop_id = tra_hop_id LEFT JOIN ccn_absence ON abs_id = hop_abs_id WHERE tra_per_id = ? AND MONTH(hop_date) = ? AND hop_abs_id NOT LIKE NULL AND hop_abs_id <> 9";
		    	if ($stmt=$db->prepare($queryAbsencesTotal)) {
		    		$stmt->bind_param('ii', $per_id, $mois);
				  	$stmt->execute();
				  	$stmt->bind_result($nbDaysAbsencesTotal);
			    	$stmt->fetch();
			    	$stmt->close();
			    	$infos = [];
			    	$nbDays = cal_days_in_month(CAL_GREGORIAN, $mois, $annee);
			    	
			    	$queryFerie = "SELECT COUNT(*) FROM ccn_fermetureinfo WHERE fer_Eta_id = ? AND MONTH(fer_date) = ?";
					
					if ($stmt=$db->prepare($queryFerie)) {
						$stmt->bind_param('ii', $eta_id, $mois);
					  	$stmt->execute();
					  	$stmt->bind_result($nbDaysFeries);
				    	$stmt->fetch();
				    	$stmt->close();
				    	
				    	$queryHeuresSemaine = "SELECT con_hor_id, con_particularite FROM ccn_contrat WHERE con_per_id = ?";
					
						if ($stmt=$db->prepare($queryHeuresSemaine)) {
							$stmt->bind_param('i', $per_id);
						  	$stmt->execute();
						  	$stmt->bind_result($typeHeure, $particularite);
					    	$stmt->fetch();
					    	$stmt->close();
					    	
							$infos['joureffectifconges'] = $nbDays - $nbDaysAbsencesSansAutre;
					    	$infos['joureffectifheures'] = $nbDays - ($nbDaysAbsencesTotal + $nbDaysFeries);
					    	$infos['droitconges'] = ($infos['joureffectifconges']/7)*2;
					    	$infos['droitvacances/mois'] = HoraireEmployeeDAO::timeToObjectWithDays(HoraireEmployeeDAO::daysToHoursMinutesSeconds((30 / 30) * 2.92), (30 / 30) * 2.92);
					    	$infos['droitvacances/annee'] = HoraireEmployeeDAO::timeToObjectWithDays(HoraireEmployeeDAO::daysToHoursMinutesSeconds((12 / 12) * 35), (12 / 12) * 35);
					    	$infos['droitjoursferies/mois'] = (30 / 30) * 0.5;
					    	$infos['droitjoursferies/annee'] = (12 / 12) * 6;
					    	
					    	$heuresSemaines = $heuresCCNT;
							if ($typeHeure == 2) {
					    		$heuresSemaines = $heuresCCNT * $particularite;
					    	} else if ($typeHeure == 3) {
					    		$heuresSemaines = $particularite;
					    	}
					    	$infos['heures/semaine'] = $heuresSemaines;
					    	$infos['tot/semaine'] = ($infos['joureffectifheures']/7);
					    	$infos['heures/mois'] = $infos['heures/semaine'] * $infos['tot/semaine'];
					    	
					    	
					    	$query1 = "SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(hop_heureFin, hop_heureDebut)))) FROM ccn_travail JOIN ccn_horairepersonne ON hop_id = tra_hop_id WHERE hop_heureDebut < hop_heureFin AND tra_per_id = ? AND MONTH(hop_date) = ?";
		
							if ($stmt=$db->prepare($query1)) {
								$stmt->bind_param('ii', $per_id, $mois);
							  	$stmt->execute();
							  	$stmt->bind_result($nbHeuresMin);
						    	$stmt->fetch();
							  	$stmt->close();
							  	
							  	$query2 = "SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(hop_heureDebut, hop_heureFin)))) FROM ccn_travail JOIN ccn_horairepersonne ON hop_id = tra_hop_id WHERE hop_heureDebut >= hop_heureFin AND tra_per_id = ? AND MONTH(hop_date) = ?";
							  	if ($stmt=$db->prepare($query2)) {
									$stmt->bind_param('ii', $per_id, $mois);
								  	$stmt->execute();
								  	$stmt->bind_result($nbHeuresPos);
							    	$stmt->fetch();
								  	$stmt->close();
								  	$res = HoraireEmployeeDAO::seconds($nbHeuresMin) + HoraireEmployeeDAO::seconds($nbHeuresPos);
								  	
								  	$infos['solde'] = HoraireEmployeeDAO::timeToObject(HoraireEmployeeDAO::toHoursMinutesSeconds(($res - ($infos['heures/mois'] * 3600))));
								  	MySQLManager::close();
									return (json_encode($infos));
								}
							}
						}
					}
		    	}
			}
		}
		MySQLManager::close();
		return false;
	}

	public static function getHorairesEmployee ($per_id, $absences) {
		$db = MySQLManager::get();
		$query = "SELECT hop_id, hop_date, hop_heureDebut, hop_heureFin, hop_pause, hop_abs_id, abs_nom FROM ccn_travail JOIN ccn_horairepersonne ON hop_id = tra_hop_id LEFT JOIN ccn_absence ON abs_id = hop_abs_id WHERE tra_per_id = ?";
		
		if ($stmt=$db->prepare($query)) {
			$stmt->bind_param('i', $per_id);
		  	$stmt->execute();
		  	$stmt->bind_result($hop_id, $hop_date, $hop_heureDebut, $hop_heureFin, $hop_pause, $hop_abs_id, $abs_nom);
		  	$array = array();
	    	$horaire = [];
	    	while($stmt->fetch()) {
	    		$absence = [];
		    	$horaire['id'] = $hop_id;
	        	$horaire['date'] = $hop_date;
	        	$horaire['heureDebut'] = $hop_heureDebut;
	        	$horaire['heureFin'] = $hop_heureFin;
	        	$horaire['pause'] = $hop_pause;
	        	
	        	if ($hop_abs_id != NULL) {
	        		$found = false;
	        		foreach ($absences as $key => $val) {
						if ($val['id'] == $hop_abs_id) {$found = true;}
					}
					if (!$found) {
						$absence['id'] = $hop_abs_id;
						$absence['nom'] = $abs_nom;
						$horaire['absence'] = $absence;
    					$array[] = $horaire;
					}
	        	} else {
	        		$absence['id'] = NULL;
	        		$horaire['absence'] = $absence;
    				$array[] = $horaire;
	        	}
	    	}
		  	$stmt->close();
		  	MySQLManager::close();
	  		return $array;
		}
		MySQLManager::close();
		return false;
	}

	private static function validationPlage($db, $horaire, $modif) {
		$req = "
			SELECT hop_id, hop_date, hop_heureDebut, hop_heureFin
			FROM ccn_horairepersonne
			JOIN ccn_travail ON tra_hop_id = hop_id
			WHERE tra_per_id = ? 
			AND hop_date = ?
		";
		
		if ($modif) {
			 $req = $req . " AND hop_id <> ?";
		}
		
		if ($stmt=$db->prepare($req)) {
			if ($modif) {
				$stmt->bind_param('isi', $horaire['per_id'], $horaire['date'], $horaire['hop_id']);
			} else {
				$stmt->bind_param('is', $horaire['per_id'], $horaire['date']);
			}
			
		  	$stmt->execute();
		  	$stmt->bind_result($hop_id, $hop_date, $hop_heureDebut, $hop_heureFin);
		  	
		  	$dateDebut = new DateTime($horaire['heureDebut']);
		  	$dateFin = new DateTime($horaire['heureFin']);
		  	
		  	if ($dateDebut > $dateFin) {
		  		$dateFin->add(new DateInterval('P1D')); // Ajoute un jour à la date
		  	}
		  	
		  	$nbHeureParam = $dateFin->diff($dateDebut, true);
		  	
		  	while($stmt->fetch()) {
		  		$dateDebutComp = new DateTime($hop_heureDebut);
		  		$dateFinComp = new DateTime($hop_heureFin);
		  		
		  		if ($dateDebutComp > $dateFinComp) {
		  			$dateFinComp->add(new DateInterval('P1D')); // Ajoute un jour à la date
		  		}
		  		
			  	if ($dateDebut >= $dateDebutComp) {
			  		if ($dateDebut <= $dateFinComp) {
			  			return false;
			  		}
			  	} else {
			  		if ($dateFin >= $dateDebutComp) {
			  			return false;
			  		}
			  	}
		  	}
		  	return true; // Si pas de conflit
		}
	}
	
	public static function updateHoraire ($horaire) {
		$db = MySQLManager::get();
		if (HoraireEmployeeDAO::validationPlage($db, $horaire, true)) {
			$query = "UPDATE ccn_horairepersonne SET hop_date = ?, hop_heureDebut = ?, hop_heureFin = ?, hop_pause = ?, hop_abs_id = ? WHERE hop_id = ?";
			if ($stmt = $db->prepare($query)) {
				$val;
				if ($horaire['absid'] == '') {
					$val = NULL;
				} else {
					$val = $horaire['absid'];
				}
				$stmt->bind_param('sssisi', $horaire['date'], $horaire['heureDebut'], $horaire['heureFin'], $horaire['pause'], $val, $horaire['hop_id']);
			  	$stmt->execute();
			  	$stmt->close();
			  	$query1 = "UPDATE ccn_travail SET tra_per_id = ? WHERE tra_hop_id = ?";
				if ($stmt = $db->prepare($query1)) {
					$stmt->bind_param('ii', $horaire['per_id'], $horaire['hop_id']);
				  	$stmt->execute();
				  	$stmt->close();
				  	MySQLManager::close();
		  			return $horaire;
				}
		  		MySQLManager::close();
		  		return 1;
			}
		}
		MySQLManager::close();
		return 0;
	}
	

	public static function insertHoraire ($horaire) {
		$db = MySQLManager::get();

		if (HoraireEmployeeDAO::validationPlage($db, $horaire, false)) {
			/* Insertion dans la table ccn_personne */
			$query = "INSERT INTO ccn_horairepersonne (hop_date, hop_heureDebut, hop_heureFin, hop_pause, hop_abs_id) VALUES (?, ?, ?, ?, ?)";
			if ($stmt = $db->prepare($query)) {
				
				$val;
				if ($horaire['absid'] == '') {
					$val = NULL;
				} else {
					$val = $horaire['absid'];
				}
				
				$stmt->bind_param('sssis', $horaire['date'], $horaire['heureDebut'], $horaire['heureFin'], $horaire['pause'], $val);
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
			  		return $hop_id;
				}
			}
		}
		MySQLManager::close();
		return 0;
	}

	/* N'insére pas encore de pause */
	public static function deleteHoraire ($horaire) {
		$db = MySQLManager::get();
		
		// $query = "SELECT hop_id FROM ccn_horairepersonne WHERE hop_date = ? AND hop_heureDebut = ? AND hop_heureFin = ?";
		// if ($stmt = $db->prepare($query)) {
		// 	$stmt->bind_param('sss', $horaire['date'], $horaire['heureDebut'], $horaire['heureFin']);
		//   	$stmt->execute();
		//   	$stmt->bind_result($hop_id);
		//   	$stmt->fetch();
		//   	$stmt->close();
		//   	/* Suppression de l'horaire */
	  	$reqSup = "DELETE FROM ccn_travail WHERE tra_per_id = ? AND tra_hop_id = ?";
	  	if ($req = $db->prepare($reqSup)) {
	  		$req->bind_param('ii', $horaire['per_id'], $horaire['hor_id']);
	  		$req->execute();
	  		$req->close();
	  		$reqSupHor = "DELETE FROM ccn_horairepersonne WHERE hop_id = ?";
		  	if ($reqHor = $db->prepare($reqSupHor)) {
		  		$reqHor->bind_param('i', $horaire['hor_id']);
		  		$reqHor->execute();
		  		$reqHor->close();	
			  	MySQLManager::close();
		  		return $horaire['hor_id'];
		  	}
	  	}
		//}
		MySQLManager::close();
		return -1;
	}



}

?>