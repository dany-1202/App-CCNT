<?php
require_once("../classes/MySQLManager.php");
require_once("PushService.php"); // Gestion des push en fonction des demandes

class DemandeDAO{
	/* Retourne toutes les nouvelles demandes et les demandes modifiées non traitées  */
	public static function getDemandesATraiter () {
		$res = false;
		$db = MySQLManager::get();
		$query = "SELECT dpe_id, dpe_dateDebut, dpe_dateFin, dpe_motif, dpe_statut, dem_id, dem_nom, per_id, per_nom, per_prenom, per_mail FROM ccn_demandePersonne
				 INNER JOIN ccn_demande ON (dpe_dem_id = dem_id)
				 INNER JOIN ccn_personne ON (dpe_per_id = per_id)
				 WHERE dpe_statut = 'new' OR dpe_statut = 'modify'";
		if ($stmt = $db->prepare($query)) {
		  	$stmt->execute();
		  	$stmt->bind_result($dpe_id, $dpe_dateDebut, $dpe_dateFin, $dpe_motif, $dpe_statut, $dem_id, $dem_nom, $per_id, $per_nom, $per_prenom, $per_mail);
		  	$data = array();
		  	while($stmt->fetch()) {
		  		$dem = [];
		  		$dem['id'] = $dpe_id;
		  		$dem['dateDebut'] = $dpe_dateDebut;
				$dem['dateFin'] = $dpe_dateFin;
				$dem['motif'] = $dpe_motif;
				$dem['statut'] = $dpe_statut;
				$dem['typeDemande_id'] = $dem_id;
				$dem['typeDemande_nom'] = $dem_nom;
				$dem['per_id'] = $per_id;
				$dem['per_nom'] = $per_nom;
				$dem['per_prenom'] = $per_prenom;
				$dem['per_mail'] = $per_mail;
		  		$data[] = $dem;
		  	}	
			if(count($data) == 0) { $data = false;}	// Si le tableau est vide : on met false = aucune demande					
			MySQLManager::close();
		}
		return (json_encode($data)); // On retourne le tout en JSON
	}//getDemandesATraiter
	
	// Traide une demande
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
							PushService::sendPushDemandeCongeAcceptee($per_id);
						} else {
							$newStatut = 'modifyAccept';
							PushService::sendPushDemandeModCongeAcceptee($per_id);						
						}
					 } else {					
						if($dpe_statut == 'new'){
							$newStatut = 'refuse';	
							PushService::sendPushDemandeCongeRefusee($per_id);
						} else {
							$newStatut = 'modifyRefuse';
							PushService::sendPushDemandeModCongeRefusee($per_id);
						}
					}
					// On enregsitre le nouveau statut dans la BDD
					$db = MySQLManager::get();			
					$query = "UPDATE ccn_demandePersonne SET dpe_statut = ? WHERE dpe_id = ?";
					if ($stmt = $db->prepare($query)) {
							$stmt->bind_param("si", $newStatut, $dpe_id);
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
	
}//DemandeDAO
?>