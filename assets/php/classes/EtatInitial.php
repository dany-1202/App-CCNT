<?php
/**
 *
 */
require_once("MySQLManager.php");
/**
 *
 * @access public
 */
/*
	Class name : EtatInitial
	Description : Contient les fonctions permettant d'intéragir avec la bdd
*/
	class EtatInitial {

	/*Permet de modifier le nom d'un Departement de la table ccn_departement
	  En paramètre: un tableau de data[] contenant :
		le nom du Departement
		l'id du Departement
      Contraine BDD : le département identifié par son id doit existé dans la base
	*/
      public static function setDepartement ($data) {
      	$db = MySQLManager::get();
      	$query = "UPDATE ccn_departement set dep_nom = ? WHERE dep_id = ?";
      	if ($stmt = $db->prepare($query)) {
      		$stmt->bind_param('si', $data['depNom'], $data['etaId']);
      		$stmt->execute();
      		if ($stmt->num_rows == 1) {
      			MySQLManager::close();
      			return true;
      		}
      	}
      	MySQLManager::close();
      	return false;
	} // setDepartement

	

	
	/* Permet d'insérer dans la bdd le lien qui relie le département à une personne */
	//LA FONCTION N'A PAS ENCORE ETE TESTEE
	public static function insertPossede ($data) {
		$db = MySQLManager::get();
		$query = "INSERT INTO ccn_possede (pos_dep_id, pos_per_id) VALUES (?, ?)";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('ii', $data['depId'], $data['perId']);
			$stmt->execute();
			if ($stmt->num_rows == 1) {
				MySQLManager::close();
				return true;
			}
		}
		MySQLManager::close();
		return false;
	} // insertPossede

	/*Permet d'ajouter un jour de fermeture dans la table ccn_fermetureInfo
	  En paramètre: un Etablissement Contenant :
		la date de fermeture
		l'identifiant de l'établissement
	*/
	public static function insertFermetureInfo ($data) {
		$db = MySQLManager::get();
		$query = "INSERT INTO ccn_fermetureInfo (fer_nom, fer_dateDebut, fer_dateFin, fer_Eta_id) VALUES (?,?,?,?)";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('sssi', $data['nom'], $data['dateDebut'], $data['dateFin'], $data['etaId']);
			$stmt->execute();
			$stmt->store_result();
			if ($stmt->num_rows == 1) {
				MySQLManager::close();
				return true;
			}
		}
		MySQLManager::close();
		return false;
	} // insertFermetureInfo

	public static function updateFermetureInfo ($data) {
		$db = MySQLManager::get();
		$query = "UPDATE `ccn_fermetureinfo` SET `fer_nom` = ? ,`fer_dateDebut` = ?,`fer_dateFin` = ? WHERE fer_id = ?";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('sssi', $data['nom'], $data['dateDebut'], $data['dateFin'], $data['id']);
			$stmt->execute();
			$stmt->store_result();
			$stmt->close();
			MySQLManager::close();
			return $data['id'];
		}
		MySQLManager::close();
		return false;
	} // insertFermetureInfo

	public static function deleteFermetureInfo ($data) {
		$db = MySQLManager::get();
		$query = "DELETE FROM ccn_fermetureinfo WHERE fer_id = ? AND fer_Eta_id = ?";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('ii', $data['id'], $data['idEta']);
			$stmt->execute();
			$stmt->close();
			MySQLManager::close();
			return $data['idEta'];
		}
		MySQLManager::close();
		return false;
	} // insertFermetureInfo


	 public static function insertOuvertureInfo ($data) {
	 	$db = MySQLManager::get();
	 	$query = "INSERT INTO ccn_ouvertureInfo (ouv_jour, ouv_matinDebut, ouv_matinFin, ouv_soirDebut, ouv_soirFin, ouv_eta_id) VALUES (?, ?, ?, ?, ?, ?)";
	 	if ($stmt = $db->prepare($query)) {
	 		if ($data['matinFin'] == "" || $data['matinFin'] == "Heure fin") {$matinFin = NULL;} else {$matinFin = $data['matinFin'];}
	 		if ($data['soirDebut'] == "" || $data['soirDebut'] == "Heure début") {$soirDebut = NULL;} else {$soirDebut = $data['soirDebut'];}
	 		$stmt->bind_param('sssssi', $data['jour'], $data['matinDebut'], $matinFin, $soirDebut, $data['soirFin'], $data['etaId']);
	 		$stmt->execute();
	 		$stmt->store_result();
	 		if ($stmt->num_rows == 1) {
	 			MySQLManager::close();
	 			return true;
	 		}
	 	}
	 	MySQLManager::close();
	 	return false;
	} // insertOuvertureInfo

	public static function insertPersonInEstablishment ($data) {
		$db = MySQLManager::get();
		$query = "INSERT INTO ccn_appartient (app_eta_id, app_per_id) VALUES (?, ?)";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('ii', $data['eta_id'], $data['user_id']);
			$stmt->execute();
			if ($stmt->num_rows == 1) {
				MySQLManager::close();
				return true;
			}
		}
		MySQLManager::close();
		return false;
	} // insertPersonInEstablishment

	/*
		Permet de vérifier si un établissement a déjà été configuré pour celle qui est connectée
	*/
	public static function checkConfiguration ($data) {
		$db = MySQLManager::get();
		$query = "SELECT app_eta_id FROM ccn_appartient WHERE app_per_id = ?";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('i', $data['user_id']);
			$stmt->execute();
			$stmt->store_result();
			if ($stmt->num_rows == 1) {
				MySQLManager::close();
				return true;
			}
		}
		MySQLManager::close();
		return false; // Il ne trouve rien
	} // checkConfiguration
	
	public static function checkConfigurationEmp ($data) {
		$db = MySQLManager::get();
		$query = "SELECT app_eta_id FROM ccn_appartient WHERE app_per_id = ?";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('i', $data['user_id']);
			$stmt->execute();
			$stmt->bind_result($eta_id);
			if ($stmt->fetch()) {
				$stmt->close();
				$query1 = "SELECT COUNT(pos_per_id) FROM ccn_etablissement JOIN ccn_departement ON eta_id = dep_eta_id JOIN ccn_possede ON pos_dep_id = dep_id JOIN ccn_personne ON per_id = pos_per_id WHERE eta_id = ? AND per_admin = 0 AND per_inactif = 0";
				$db1 = MySQLManager::get();
				if ($stmt1 = $db1->prepare($query1)) {
					$stmt1->bind_param('i', $eta_id);
					$stmt1->execute();
					$stmt1->bind_result($nbPersons);
					$stmt1->fetch();
					MySQLManager::close();
					return $nbPersons;
				}
			}
		}
		MySQLManager::close();
		return 0; // Il ne trouve rien
	} // checkConfiguration

	public static function getEstablishmentPerson ($data) {
		$db = MySQLManager::get();
		$query = "SELECT app_eta_id FROM ccn_appartient WHERE app_per_id = ?";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('i', $data['user_id']);
			$stmt->execute();
			$stmt->bind_result($eta_id);
			$stmt->fetch(); // Il faut le mettre sinon ça ne marche pas ! 
			$stmt->close();
			return $eta_id;
		}
		MySQLManager::close();
		return -1; // Il ne trouve rien
	} // checkConfiguration

	/* 
		Permet de modifier le mot de passe d'une personne dans la base de données
		Contrainte : il faut impérativement le per_id de la personne 
	*/
	//LA FONCTION N'A PAS ENCORE ETE TESTEE
		public static function setMdpPersonne ($data) {
			$db = MySQLManager::get();
			$query = "UPDATE ccn_personne SET (per_mdp = ?) WHERE per_id = ?";
			if ($stmt = $db->prepare($query)) {
				$stmt->bind_param('si', $data['perMdp'], $data['perId']);
				$stmt->execute();
				if ($stmt->num_rows == 1) {
					MySQLManager::close();
					return true;
				}
			}
			MySQLManager::close();
			return false;
	} // setMdpPersonne

	public static function getFermetureInfo ($user_id) {
		$db = MySQLManager::get();
		$query = "SELECT app_eta_id FROM ccn_appartient WHERE app_per_id = ?";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param('i', $user_id);
			$stmt->execute();
			$stmt->bind_result($eta_id);
			if ($stmt->fetch()) {
				$stmt->close();
				$query1 = "SELECT fer_id, fer_nom, fer_dateDebut, fer_dateFin, fer_eta_id FROM ccn_fermetureinfo WHERE fer_eta_id = ?";
				if ($stmt1 = $db->prepare($query1)) {
					$stmt1->bind_param('i', $eta_id);
					$stmt1->execute();
					$stmt1->bind_result($fer_id, $fer_nom, $fer_dateDebut, $fer_dateFin, $fer_eta_id);
					$fers = array();
					while($stmt1->fetch()) {
						$fer = [];
						$fer['id'] = $fer_id;
						$fer['title'] = $fer_nom;
						$fer['dateDebut'] = $fer_dateDebut;
						$fer['dateFin'] = ($fer_dateFin == NULL ? 0 : $fer_dateFin);
						$fer['etaId'] = $fer_eta_id;
						$fers[] = $fer;
					}
					$stmt1->close();
					MySQLManager::close();
					return $fers;
				}
			};
		}
		MySQLManager::close();
		return false;
	}

}

?>
