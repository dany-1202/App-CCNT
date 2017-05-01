<?php

require_once("MySQLManager.php");

/**
* Class php qui va gérer toutes les interactions avec un contrat (Table : ccn_contrat). 
* Tout le CRUD sera géré ici.	
*/
class OuvertureDAO {
	/*
		Permet de modififier le contrat d'une personne !
	*/
		public static function insertOuvertureEstablishment ($data) {
			$db = MySQLManager::get();
			$query = "INSERT INTO ccn_ouverture (ouv_nom, ouv_dateDebut, ouv_dateFin, ouv_base, ouv_eta_id) VALUES (?, ?, ?, ?, ?)";
			if ($stmt = $db->prepare($query)) {
				if ($data['dateDebut'] == "") {$dateDebut = NULL;} else {$dateDebut = $data['dateDebut'];}
				if ($data['dateFin'] == "") {$dateFin = NULL;} else {$dateFin = $data['dateFin'];}
				$stmt->bind_param('sssii', $data['nom'], $dateDebut, $dateFin, $data['base'], $data['etaId']);
				$stmt->execute();
				$idOuv = $stmt->insert_id;
				$stmt->close();
				if ($idOuv != -1) {
					foreach ($data['hours'] as $key => $val) {
						$idOui = OuvertureDAO::insertOuvertureInfoEstablishment($val['id'], $val['pause']['existe'], $val['matin']['debut'], $val['matin']['fin'], $val['soir']['debut'], $val['soir']['fin']);
						if ($idOui != -1) {
							OuvertureDAO::insertLienOuvertureEstablishment($idOuv, $idOui);
						}
					}
					MySQLManager::close();
					return true;
				}
			}
			MySQLManager::close();
			return false;
		}

		/* Insertion dans la table ccn_contrat */
		public static function insertOuvertureInfoEstablishment ($oui_jour, $oui_pause, $oui_matinDebut, $oui_matinFin, $oui_soirDebut, $oui_soirFin) {
			$db = MySQLManager::get();
			$query = "INSERT INTO ccn_ouvertureinfo (oui_jour, oui_matinDebut, oui_matinFin, oui_soirDebut, oui_soirFin) VALUES (?, ?, ?, ?, ?)";
			if ($stmt = $db->prepare($query)) {
				if ($oui_pause) {
					$matinFin = $oui_matinFin; $soirDebut = $oui_soirDebut;
				} else {
					$matinFin = NULL; $soirDebut = NULL;
				}
				$stmt->bind_param('issss', $oui_jour, $oui_matinDebut, $matinFin, $soirDebut, $oui_soirFin);
				$stmt->execute();
				$id = $stmt->insert_id;
				MySQLManager::close();
				return $id;
			}
			MySQLManager::close();
			return -1;
		}

		public static function insertLienOuvertureEstablishment ($ouv_id, $oui_id) {
			$db = MySQLManager::get();
			$query = "INSERT INTO ccn_lienouverture (lie_ouv_id, lie_oui_id) VALUES (?, ?)";
			if ($stmt = $db->prepare($query)) {
				$stmt->bind_param('ii', $ouv_id, $oui_id);
				$stmt->execute();
				$stmt->store_result();
				if ($stmt->num_rows == 1) {
					MySQLManager::close();
					return true;
				}
			}
			MySQLManager::close();
			return false;
		}

		public static function getOuvertureInfo ($user_id) {
			require_once("EstablishmentDAO.php");

			$eta_id = EstablishmentDAO::getEtablissement($user_id);
			$db = MySQLManager::get();
			$query = "SELECT ouv_id, oui_id, ouv_nom, ouv_dateDebut, ouv_dateFin, ouv_base, oui_jour, oui_matinDebut, oui_matinFin, oui_soirDebut, oui_soirFin FROM `ccn_ouverture`JOIN ccn_lienouverture ON lie_ouv_id = ouv_id JOIN ccn_ouvertureinfo ON lie_oui_id = oui_id WHERE ouv_eta_id =?";
			if ($stmt = $db->prepare($query)) {
				$stmt->bind_param('i', $eta_id);
				$stmt->execute();
				$stmt->bind_result($ouv_id, $oui_id, $ouv_nom, $ouv_dateDebut, $ouv_dateFin, $ouv_base, $oui_jour, $oui_matinDebut, $oui_matinFin, $oui_soirDebut, $oui_soirFin);

				$liste = array();
				while ($stmt->fetch()) {
					$hor = [];
					$hor['id'] = $ouv_id;
					$hor['nom'] = $ouv_nom;
					$hor['base'] = $ouv_base;
					$hor['dateDebut'] = $ouv_dateDebut;
					$hor['dateFin'] = $ouv_dateFin;
					$hor['nom'] = $ouv_nom;
					$hor['jour'] = $oui_jour;
					$hor['matinDebut'] = $oui_matinDebut;
					$hor['matinFin'] = $oui_matinFin;
					$hor['soirDebut'] = $oui_soirDebut;
					$hor['soirFin'] = $oui_soirFin;
					$liste[] = $hor;
				}				

				$stmt->close();
				MySQLManager::close();
				return $liste;
			}
			MySQLManager::close();
			return false;
		}

	}

?>