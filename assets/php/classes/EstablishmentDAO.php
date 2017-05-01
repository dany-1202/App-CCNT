<?php

require_once("MySQLManager.php");
/**
* Class php qui va gérer toutes les interactions avec un établissement. 
* Tout le CRUD sera géré ici.	
*/
class EstablishmentDAO {
	/*Permet d'ajouter un Etablissement dans la table ccn_etablissement
	  En paramètre: un tableau de data[] contenant :
		le nom, l'adresse, le teléphone de réservation, le téléphone de direction, l'email, 
		le site web, le supplément d'adresse, le code postal, la localite, le nombre d'heure
	*/	
		public static function insertEtablissement ($data) {
			$db = MySQLManager::get();
			$query = "INSERT INTO ccn_etablissement (eta_nom, eta_adresse, eta_telReservation, eta_telDirection, eta_email, eta_siteWeb, eta_adresseInfo, eta_codePostal, eta_localite, eta_nbHeure) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
			if ($stmt = $db->prepare($query)) {
				$stmt->bind_param('sssssssisi', $data['nom'], $data['adresse'], $data['telReservation'], $data['telDirection'], $data['email'], $data['siteWeb'], $data['adresseInfo'], $data['codePostal'], $data['localite'], $data['nbHeure']);
				$stmt->execute();
				$id = $stmt->insert_id;
				$stmt->close();
				MySQLManager::close();
				return $id;
			}
			MySQLManager::close();
			return -1;
	} // insertEtablissement
	
	/*Permet d'ajouter un Etablissement dans la table ccn_etablissement
	  En paramètre: un tableau de data[] contenant :
		le nom, l'adresse, le teléphone de réservation, le téléphone de direction, l'email, 
		le site web, le supplément d'adresse, le code postal, la localite, le nombre d'heure
	*/	
		public static function getEtablissement ($user_id) {
			$db = MySQLManager::get();
			$query = "SELECT app_eta_id FROM ccn_appartient WHERE app_per_id = ?";
			if ($stmt = $db->prepare($query)) {
				$stmt->bind_param('i',$user_id);
				$stmt->execute();
				$stmt->bind_result($eta_id);
				$stmt->fetch();
				$stmt->close();
				MySQLManager::close();
				return $eta_id;
			}
			MySQLManager::close();
			return -1;
	} // insertEtablissement

	public static function getInfoEtablissement ($user_id) {
		$db = MySQLManager::get();
		$query = "SELECT app_eta_id FROM ccn_appartient WHERE app_per_id = ?";
		if ($stmt = $db->prepare($query)) {

			$stmt->bind_param('i', $user_id);
			$stmt->execute();
			$stmt->bind_result($eta_id);
			if ($stmt->fetch()) {


				$stmt->close();
				$query1 = "SELECT eta_nom, eta_adresse, eta_telReservation, eta_telDirection, eta_email, eta_siteWeb, eta_adresseInfo, eta_codePostal, eta_localite, eta_nbHeure FROM ccn_etablissement WHERE eta_id = ?";
				if ($stmt1 = $db->prepare($query1)) {
					$stmt1->bind_param('i', $eta_id);
					$stmt1->execute();
					$stmt1->bind_result($eta_nom, $eta_adresse, $eta_telRes, $eta_telDir, $eta_mail, $eta_site, $eta_adresseInfo, $eta_codePostal, $eta_localite, $eta_nbHeure);
					$stmt1->fetch();
					$eta = [];
					$eta['nom'] = $eta_nom;
					$eta['adresse'] = $eta_adresse;
					$eta['telReservation'] = $eta_telRes;
					$eta['telDirection'] = $eta_telDir;
					$eta['email'] = $eta_mail;
					$eta['siteWeb'] = $eta_site;
					$eta['adresseInfo'] = $eta_adresseInfo;
					$eta['codePostal'] = $eta_codePostal;
					$eta['localite'] = $eta_localite;
					$eta['nbHeure'] = $eta_nbHeure;
					$stmt1->close();
					MySQLManager::close();
					return $eta;
				}
			};
		}
		MySQLManager::close();
		return false;
	}
}

?>