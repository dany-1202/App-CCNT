<?php

require_once("MySQLManager.php");
require_once("ContratDAO.php");
require_once("PossedeDAO.php");
require_once("PushServiceDAO.php"); // Gestion des push en fonction des demandes
require_once("HoraireEmployeeDAO.php");
/**
* Class php qui va gérer toutes les interactions avec une demande d'un employé
* Tout le CRUD sera géré ici.	
*/
class DemandesDAO {
	
	/* Retourne toutes les nouvelles demandes*/
	public static function getNouvellesDemandes ($eta_id) {
		$res = false;
		$db = MySQLManager::get();
		$query = "SELECT dpe_id, dpe_dateDebut, dpe_dateFin, dpe_motif, dpe_statut, abs_id, abs_nom, per_id, per_nom, per_prenom, per_mail FROM ccn_demandepersonne
		INNER JOIN ccn_absence ON (dpe_abs_id = abs_id)
		INNER JOIN ccn_personne ON (dpe_per_id = per_id)
		JOIN ccn_possede ON per_id = pos_per_id
		JOIN ccn_departement ON dep_id = pos_dep_id
		WHERE dpe_statut = 'new' AND dep_eta_id = ?";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('i', $eta_id);
			$stmt->execute();
			$stmt->bind_result($dpe_id, $dpe_dateDebut, $dpe_dateFin, $dpe_motif, $dpe_statut, $abs_id, $abs_nom, $per_id, $per_nom, $per_prenom, $per_mail);
			$data = array();
			while($stmt->fetch()) {
				$dem = [];
				$dem['idDem'] = $dpe_id;
				$dem['dateDebut'] = $dpe_dateDebut;
				$dem['dateFin'] = $dpe_dateFin;
				$dem['motif'] = $dpe_motif;
				$dem['statut'] = $dpe_statut;
				$dem['typeDemande_id'] = $abs_id;
				$dem['typeDemande_nom'] = $abs_nom;
				$dem['per_id'] = $per_id;
				$dem['per_nom'] = $per_nom;
				$dem['per_prenom'] = $per_prenom;
				$dem['per_mail'] = $per_mail;
				$data[] = $dem;
			}					
			MySQLManager::close();
			return $data;
		}
		return false; // On retourne le tout en JSON
	}//getDemandesATraiter
	
	
	/* Récupère tous les employés (Attention seulement les employés per_admin = 0) */
	public static function getDemandes ($eta_id) {
		$db = MySQLManager::get();
		$query = "SELECT per_id, per_nom, per_prenom, dpe_dateDebut, dpe_dateFin, dpe_motif, dpe_statut, abs_nom, dpe_id
		FROM ccn_etablissement
		JOIN ccn_departement on eta_id = dep_eta_id
		JOIN ccn_possede on dep_id = pos_dep_id
		join ccn_personne on pos_per_id = per_id
		JOIN ccn_demandepersonne on per_id = dpe_per_id
		INNER JOIN ccn_absence ON (dpe_abs_id = abs_id)
		WHERE eta_id = ?
		ORDER BY dpe_dateDebut ASC";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('i', $eta_id);
			/* Exécution de la requête */
			$stmt->execute();
			/* Lecture des variables résultantes */
			$stmt->bind_result($per_id, $per_nom, $per_prenom, $dpe_dateDebut, $dpe_dateFin, $dpe_motif, $dpe_statut, $dem_nom, $dpe_id);
			/* Récupération des valeurs */
			$demandes = array();
			while($stmt->fetch()) {
				$demande = [];
				$demande['id'] = $per_id;
				$demande['nom'] = $per_nom;
				$demande['prenom'] = $per_prenom;
				$demande['dateDebut'] = $dpe_dateDebut;
				$demande['dateFin'] = $dpe_dateFin;
				$demande['motif'] = $dpe_motif;
				$demande['statut'] = $dpe_statut;
				$demande['nomDemande'] = $dem_nom;
				$demande['dpe_id'] = $dpe_id;
				$demandes[] = $demande; // L'ajouter au tableau d'objet
			}
			$stmt->close();
			MySQLManager::close();
			return $demandes;
		}
		MySQLManager::close();
		return null;
	} // getDemandes

	public static function accepterDemande ($data) {
		$db = MySQLManager::get();
		$query = "SELECT hop_id
		FROM ccn_horairepersonne
		JOIN ccn_travail ON hop_id = tra_hop_id
		WHERE (hop_date BETWEEN ? AND ?) 
		AND tra_per_id = ?";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('ssi', $data['dateDebut'], $data['dateFin'], $data['idPers']);
			/* Exécution de la requête */
			$stmt->execute();
			/* Lecture des variables résultantes */
			$stmt->bind_result($hop_id);
			/* Récupération des valeurs */
			while($stmt->fetch()) {
				DemandesDAO::updateDemande($hop_id);
			}
		}
		MySQLManager::close();
		return null;
	}	

	public static function insertDemandeIntoHoraire($dateDebut, $heureDebut, $heureFin, $abs_id, $abs_freq) {
		$db = MySQLManager::get();
		$query = "INSERT INTO `ccn_horairepersonne`(`hop_id`, `hop_date`, `hop_heureDebut`, `hop_heureFin`, `hop_pause`, `hop_abs_id`, `hop_abs_freq`) 
		VALUES (NULL,?,?,?,0,?,?)";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param("sssii", $dateDebut, $heureDebut, $heureFin, $abs_id, $abs_freq);
			$stmt->execute();
			$hop_id = $stmt->insert_id;
			print($hop_id);
			$stmt->close();
			MySQLManager::close();
			return $hop_id;
		}
		return -1;
	}

	public static function deleteDemandeInHoraire($date, $per_id, $hop_abs_id, $hop_abs_freq, $heureDebut, $heureFin) {
		$req = "SELECT hop_id FROM ccn_horairepersonne JOIN ccn_travail ON tra_hop_id = hop_id WHERE (hop_date = ?) AND (tra_per_id = ?) AND hop_abs_id = ? AND hop_abs_freq = ? AND hop_dem_modif = -1";
		$db = MySQLManager::get();
		if ($stmt = $db->prepare($req)) {
			$stmt->bind_param("siii", $date, $per_id, $hop_abs_id, $hop_abs_freq);
			$stmt->execute();
			$stmt->bind_result($hop_id);
			while ($stmt->fetch()) {
				$horaire = [];
				$horaire['hor_id'] = $hop_id;
				$horaire['per_id'] = $per_id;
				MySQLManager::close();
				HoraireEmployeeDAO::deleteHoraire($horaire);
			}
			$stmt->close();
			return true;				
		} 
		return false;
	}

	public static function insertUpdateDemandeTravail($tab, $per_id, $hop_id, $tra_valide, $dpe_abs_id, $dpe_freq, $date, $heureDebut, $heureFin, $modif) {
		if (count($tab) > 0) {
			if ($modif ==  -1) {
				$abs_id = NULL;
				$freq = NULL;
			} else {
				$abs_id = $dpe_abs_id;
				$freq =  $dpe_freq;
			}
			print("Tableau : " . $modif);
			foreach ($tab as $key => $val) {
				HoraireEmployeeDAO::updateHoraireIntoAbsence($per_id, $tra_valide, $val, $abs_id, $freq, $modif);
			}
		} else {
			if ($modif == 1) {
				print("Insertion normal : " . $modif);
				$hop_id = DemandesDAO::insertDemandeIntoHoraire($date, $heureDebut, $heureFin, $dpe_abs_id, $dpe_freq);
				HoraireEmployeeDAO::insertTravail($per_id, $hop_id, $tra_valide);
			} else {
				DemandesDAO::deleteDemandeInHoraire($date, $per_id, $dpe_abs_id, $dpe_freq, $heureDebut, $heureFin);
			}
		}
	}

	public static function deleteHoraireByDemande($dateDebut, $dateFin, $per_id, $dpe_statut, $dpe_abs_id, $dpe_dateDebut, $dpe_dateFin, $dpe_isJourneeComplete) {
		if ($dpe_isJourneeComplete == 1) {
			$dpe_freq = 1;
			$heureDebut = "00:00:00";
			$heureFin = "23:59:59";
			$hop_id = 0;

			$arrayHopId = HoraireEmployeeDAO::getHorairesEmployeeInDate($per_id, $dateDebut->format('Y-m-d'), $dpe_dateDebut, $heureFin, 1);
			
			DemandesDAO::insertUpdateDemandeTravail($arrayHopId, $per_id, $hop_id, 'non',  $dpe_abs_id,  $dpe_freq, $dateDebut->format('Y-m-d'), $dpe_dateDebut, $heureFin, -1);// Supprimer les horaires de la plage 
			
			$dateDebut->add(new DateInterval('P1D'));

			if ($dateDebut->format('Y-m-d') < $dateFin->format('Y-m-d')) {
				while ($dateDebut->format('Y-m-d') != $dateFin->format('Y-m-d')) {
					$arrayHopId = HoraireEmployeeDAO::getHorairesEmployeeInDate($per_id, $dateDebut->format('Y-m-d'), $heureDebut, $heureFin, 1);
					DemandesDAO::insertUpdateDemandeTravail($arrayHopId, $per_id, $hop_id, 'non', $dpe_abs_id, $dpe_freq, $dateDebut->format('Y-m-d'), $heureDebut, $heureFin, -1);
					$dateDebut->add(new DateInterval('P1D'));
				}
			}
			$arrayHopId = HoraireEmployeeDAO::getHorairesEmployeeInDate($per_id, $dateFin->format('Y-m-d'), $heureDebut, $dpe_dateFin, 1);
			DemandesDAO::insertUpdateDemandeTravail($arrayHopId, $per_id, $hop_id, 'non', $dpe_abs_id, $dpe_freq, $dateFin->format('Y-m-d'), $heureDebut, $dpe_dateFin, -1);

		} else {
			$dpe_freq = 0.5;
			$arrayHopId = HoraireEmployeeDAO::getHorairesEmployeeInDate($per_id, $dpe_dateDebut, $dpe_dateDebut, $dpe_dateDebut, 1);
			DemandesDAO::insertUpdateDemandeTravail($arrayHopId, $per_id, $hop_id, 'non', $dpe_abs_id, $dpe_freq, $dpe_dateDebut, $dpe_dateDebut, $dpe_dateDebut, -1);						
		}
	}


	// Paramètre: $dpe_id : id de la demande, $isAccept : true = demande acceptée, false = demande refusée
	public static function traiterDemande($id, $isAccept){	
		$db = MySQLManager::get();

		$queryStatut = "SELECT dpe_per_id, dpe_statut, dpe_abs_id, dpe_dateDebut, dpe_dateFin, dpe_isJourneeComplete FROM ccn_demandepersonne WHERE dpe_id = ?";
		if ($stmt = $db->prepare($queryStatut)) {				
			$stmt->bind_param("i", $id);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($per_id, $dpe_statut, $dpe_abs_id, $dpe_dateDebut, $dpe_dateFin, $dpe_isJourneeComplete);	
			$stmt->fetch();
			if ($stmt->affected_rows > 0) {								
					// On défini le nouveau statut par rapport à la valeur de isAccept et du statut actuel, et on envois le push en fonction
				$newStatut = '';
				$tra_valide = 'absent';

				if ($dpe_abs_id == 1) {
					$tra_valide = 'maladie';
				} else if ($dpe_abs_id == 13) {
					$tra_valide = 'accident';
				}

				if($isAccept){
					if($dpe_statut == 'new'){
						$newStatut = 'accept';
						PushServiceDAO::sendPushDemandeCongeAcceptee($per_id);
					} else {
						$newStatut = 'modifyAccept';
						PushServiceDAO::sendPushDemandeModCongeAcceptee($per_id);						
					}
				} else {					
					if($dpe_statut == 'new'){
						$newStatut = 'refuse';	
						PushServiceDAO::sendPushDemandeCongeRefusee($per_id);
					} else {
						$newStatut = 'modifyRefuse';
						PushServiceDAO::sendPushDemandeModCongeRefusee($per_id);
					}
				}
				$dateDebut = new DateTime($dpe_dateDebut);
				$dateFin = new DateTime($dpe_dateFin);
				if ($isAccept) {
					if ($dpe_isJourneeComplete == 1) {

						$dpe_freq = 1;
						$heureDebut = "00:00:00";
						$heureFin = "23:59:59";
						$hop_id = 0;

						/* Récupération des employés qui empietent dans l'horaire à cette date */
						$arrayHopId = HoraireEmployeeDAO::getHorairesEmployeeInDate($per_id, $dateDebut->format('Y-m-d'), $dpe_dateDebut, $heureFin, -1);
						
						/* Suite au résultat on ajoute les absences et modifie les horaires du tableau */
						DemandesDAO::insertUpdateDemandeTravail($arrayHopId, $per_id, $hop_id, $tra_valide, $dpe_abs_id, $dpe_freq, $dateDebut->format('Y-m-d'), $dpe_dateDebut, $heureFin, 1);
						
						$dateDebut->add(new DateInterval('P1D')); // J'ajoute un jour

						if ($dateDebut->format('Y-m-d') < $dateFin->format('Y-m-d')) {
							while ($dateDebut->format('Y-m-d') != $dateFin->format('Y-m-d')) {
								$arrayHopId = HoraireEmployeeDAO::getHorairesEmployeeInDate($per_id, $dateDebut->format('Y-m-d'), $heureDebut, $heureFin, -1);
								DemandesDAO::insertUpdateDemandeTravail($arrayHopId, $per_id, $hop_id, $tra_valide, $dpe_abs_id, $dpe_freq, $dateDebut->format('Y-m-d'), $heureDebut, $heureFin, 1);
								$dateDebut->add(new DateInterval('P1D'));
							}
						}

						$arrayHopId = HoraireEmployeeDAO::getHorairesEmployeeInDate($per_id, $dateFin->format('Y-m-d'), $heureDebut, $dpe_dateFin, -1);
						DemandesDAO::insertUpdateDemandeTravail($arrayHopId, $per_id, $hop_id, $tra_valide, $dpe_abs_id, $dpe_freq, $dateFin->format('Y-m-d'), $heureDebut, $dpe_dateFin, 1);

					} else {
						$dpe_freq = 0.5;
						$arrayHopId = HoraireEmployeeDAO::getHorairesEmployeeInDate($per_id, $dpe_dateDebut, $dpe_dateDebut, $dpe_dateDebut, -1);
						DemandesDAO::insertUpdateDemandeTravail($arrayHopId, $per_id, $hop_id, $tra_valide, $dpe_abs_id, $dpe_freq, $dpe_dateDebut, $dpe_dateDebut, $dpe_dateDebut, 1);						
					}

					$stmt->close();
					MySQLManager::close();
				} else {
					if($dpe_statut == 'modifyAccept'){ // Si ça a déjà été modifier par une acceptation
						DemandesDAO::deleteHoraireByDemande($dateDebut, $dateFin, $per_id, $dpe_statut, $dpe_abs_id, $dpe_dateDebut, $dpe_dateFin, $dpe_isJourneeComplete);
					}	
				}

				
				// On enregsitre le nouveau statut dans la BDD
				$db = MySQLManager::get();			
				$query = "UPDATE ccn_demandepersonne SET dpe_statut = ? WHERE dpe_id = ?";
				if ($stmt = $db->prepare($query)) {
					$stmt->bind_param("si", $newStatut, $id);
					$stmt->execute();
					if ($stmt->affected_rows > -1) {
						MySQLManager::close();
						return true;			 
					} 							
				} 
				MySQLManager::close();
			}
		}
		return false;
	}//traiterDemande
}

?>