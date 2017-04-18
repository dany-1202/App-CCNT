<?php

require_once("MySQLManager.php");
require_once("ContratDAO.php");
require_once("PossedeDAO.php");
/**
* Class php qui va gérer toutes les interactions avec une demande d'un employé
* Tout le CRUD sera géré ici.	
*/
class DemandesDAO {
	
	/* Récupère tous les employés (Attention seulement les employés per_admin = 0) */
	public static function getDemandes ($eta_id) {
		$db = MySQLManager::get();
		$query = "SELECT per_id, per_nom, per_prenom, dpe_dateDebut, dpe_dateFin, dpe_motif, dpe_statut, dem_nom
					FROM ccn_etablissement
					JOIN ccn_departement on eta_id = dep_eta_id
					JOIN ccn_possede on dep_id = pos_dep_id
					join ccn_personne on pos_per_id = per_id
					JOIN ccn_demandepersonne on per_id = dpe_per_id
					JOIN ccn_demande on dpe_dem_id = dem_id
					WHERE eta_id = ?";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('i', $eta_id);
			/* Exécution de la requête */
			$stmt->execute();
			/* Lecture des variables résultantes */
			$stmt->bind_result($per_id, $per_nom, $per_prenom, $dpe_dateDebut, $dpe_dateFin, $dpe_motif, $dpe_statut, $dem_nom);
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
			    	
					$demandes[] = $demande; // L'ajouter au tableau d'objet
		    	}
		  	$stmt->close();
		  	MySQLManager::close();
	  		return $demandes;
		}
		MySQLManager::close();
		return null;
	} // getDemandes

}

?>