<?php

require_once("MySQLManager.php");
require_once("ContratDAO.php");
require_once("PossedeDAO.php");
require_once("PushServiceDAO.php"); // Gestion des push en fonction des demandes
/**
* Class php qui va gérer toutes les interactions avec une demande d'un employé
* Tout le CRUD sera géré ici.	
*/
class DemandesDAO {
	
	/* Récupère tous les employés (Attention seulement les employés per_admin = 0) */
	public static function getDemandes ($eta_id) {
		$db = MySQLManager::get();
		$query = "SELECT per_id, per_nom, per_prenom, dpe_dateDebut, dpe_dateFin, dpe_motif, dpe_statut, dem_nom, dpe_id
					FROM ccn_etablissement
					JOIN ccn_departement on eta_id = dep_eta_id
					JOIN ccn_possede on dep_id = pos_dep_id
					join ccn_personne on pos_per_id = per_id
					JOIN ccn_demandepersonne on per_id = dpe_per_id
					JOIN ccn_demande on dpe_dem_id = dem_id
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
	/*
	public static function updateDemande ($hop_id) {
		$db = MySQLManager::get();
		$query = "";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('', );
			/* Exécution de la requête */
/*			$stmt->execute();
		}
		MySQLManager::close();
		return null;
	}*/
	
	// Paramètre: $dpe_id : id de la demande, $isAccept : true = demande acceptée, false = demande refusée
	public static function traiterDemande($id, $isAccept){	
		$db = MySQLManager::get();
		$queryStatut = "SELECT dpe_per_id, dpe_statut FROM ccn_demandePersonne WHERE dpe_id = ?";
		if ($stmt = $db->prepare($queryStatut)) {				
				$stmt->bind_param("i", $id);
				$stmt->execute();
				$stmt->store_result();
				$stmt->bind_result($per_id, $dpe_statut);	
				$stmt->fetch();
				if ($stmt->affected_rows > 0) {									
					// On défini le nouveau statut par rapport à la valeur de isAccept et du statut actuel, et on envois le push en fonction
					$newStatut = '';
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
					
					// On enregsitre le nouveau statut dans la BDD
					$db = MySQLManager::get();			
					$query = "UPDATE ccn_demandePersonne SET dpe_statut = ? WHERE dpe_id = ?";
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