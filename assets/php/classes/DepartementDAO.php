<?php

require_once("MySQLManager.php");
/**
* Class php qui va gérer toutes les interactions avec un département. 
* Tout le CRUD sera géré ici.	
*/
class DepartementDAO {
	
	/*Permet d'ajouter un Departement dans la table ccn_departement
	  En paramètre: un tableau de data[] contenant :
		le nom du Departement
		l'id de l'Etablissement
	  Contraine BDD : l'attribut etaId de l'instance de Departement doit être > 0 et exister dans la bdd
	*/
	  public static function insertDepartement ($data) {
	  	$db = MySQLManager::get();
	  	$query = "INSERT INTO ccn_departement (`dep_nom`, `dep_img_no`, `dep_eta_id`) VALUES (?, ?, ?)";
	  	if ($stmt = $db->prepare($query)) {
	  		$stmt->bind_param('sii', $data['nom'], $data['img'], $data['noEta']);
	  		$stmt->execute();
	  		$dep_id = $stmt->insert_id;
	  		MySQLManager::close();
	  		return $dep_id;
	  	}
	  	MySQLManager::close();
	  	return false;
	} // insertDepartement

	public static function updateDepartment ($data) {
	  	$db = MySQLManager::get();
	  	$query = "UPDATE `ccn_departement` SET `dep_nom`=?,`dep_img_no`=? WHERE dep_id = ? AND dep_eta_id = ?";
	  	if ($stmt = $db->prepare($query)) {
	  		$stmt->bind_param('siii', $data['nom'], $data['img'], $data['id'], $data['noEta']);
	  		$stmt->execute();
	  		MySQLManager::close();
	  		return $data['id'];
	  	}
	  	MySQLManager::close();
	  	return false;
	} // insertDepartement

	public static function deleteDepartment ($data) {
	  	$db = MySQLManager::get();
	  	$query = "DELETE FROM `ccn_departement` WHERE dep_id = ?";
	  	if ($stmt = $db->prepare($query)) {
	  		$stmt->bind_param('i', $data['id']);
	  		$stmt->execute();
	  		$stmt->close();
  			MySQLManager::close();
  			return $data['id'];
	  	}
	  	MySQLManager::close();
	  	return false;
	} // insertDepartement


	public static function checkDepartmentsToDelete ($data) {
		$db = MySQLManager::get();
		$query1 = "SELECT dep_id, dep_nom, dep_img_no, per_nom, per_prenom FROM ccn_departement JOIN ccn_possede ON pos_dep_id = dep_id JOIN ccn_personne ON pos_per_id = per_id WHERE dep_eta_id = ? AND dep_id = ?";
		if ($stmt1 = $db->prepare($query1)) {
			$stmt1->bind_param('ii', $data['noEta'], $data['noDep']);
			$stmt1->execute();
			$stmt1->bind_result($dep_id, $dep_nom, $dep_img_no, $per_nom, $per_prenom);
			$deps = array();
			while($stmt1->fetch()) {
				$dep = [];
				$dep['id'] = $dep_id;
				$dep['name'] = $dep_nom;
				$dep['img'] = $dep_img_no;
				$dep['per_nom'] = $per_nom;
				$dep['per_prenom'] = $per_prenom;
				$deps[] = $dep;
			}
			$stmt1->close();
			$query1 = "SELECT dep_id, dep_nom, dep_img_no, hpr_id, hpr_nom FROM ccn_departement JOIN ccn_horairepreconfig ON hpr_dep_id = dep_id WHERE dep_eta_id = ? AND dep_id = ?";
			if ($stmt1 = $db->prepare($query1)) {
				$stmt1->bind_param('ii', $data['noEta'], $data['noDep']);
				$stmt1->execute();
				$stmt1->bind_result($dep_id, $dep_nom, $dep_img_no, $per_nom, $per_prenom);
				while($stmt1->fetch()) {
					$dep = [];
					$dep['id'] = $dep_id;
					$dep['name'] = $dep_nom;
					$dep['img'] = $dep_img_no;
					$dep['per_nom'] = $per_nom;
					$dep['per_prenom'] = $per_prenom;
					$deps[] = $dep;
				}
				$stmt1->close();
				MySQLManager::close();
				return $deps;
			}
			
		};
		MySQLManager::close();
		return false;
	}


	/* Récupère tous les départements d'un établissement (de l'utilisateur (employeur) connecté) */
	public static function getDepartements ($user_id) {
		$db = MySQLManager::get();
		$query = "SELECT app_eta_id FROM ccn_appartient WHERE app_per_id = ?";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('i', $user_id);
			$stmt->execute();
			$stmt->bind_result($eta_id);
			if ($stmt->fetch()) {
				$stmt->close();
				$query1 = "SELECT dep_id, dep_nom, dep_img_no FROM ccn_departement WHERE dep_eta_id = ?";
				if ($stmt1 = $db->prepare($query1)) {
					$stmt1->bind_param('i', $eta_id);
					$stmt1->execute();
					$stmt1->bind_result($dep_id, $dep_nom, $dep_img_no);
					$deps = array();
					while($stmt1->fetch()) {
						$dep = [];
						$dep['id'] = $dep_id;
						$dep['name'] = $dep_nom;
						$dep['img'] = $dep_img_no;
						$dep['state'] = "modif";
						$deps[] = $dep;
					}
					$stmt1->close();
					MySQLManager::close();
					return $deps;
				}
			};
		}
		MySQLManager::close();
		return false;
	}
}

?>