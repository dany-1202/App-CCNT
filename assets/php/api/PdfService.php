<?php
//require_once("ApiBddService.php");
require_once("../classes/MySQLManager.php");
require_once("MyPDF.php");
require_once("outils.php");

class PdfService{
	
	public static function getHoraireFutures($user_id, $token){		
		$pdf = new MyPDF();
		// Titres des colonnes
		// Chargement des données
		$data =  self::getHorairesPDF($user_id, $token);
		$profil =  json_decode(self::getUserInfo($user_id, $token));
		$titre = 'Horaire de '. $profil->prenom.' '.$profil->nom;
		if($data != 0){			
			$pdf->SetFont('Arial','',14);
			$pdf->AddPage();
			$pdf->SetTitre($titre);
			$pdf->TableHoraires($data);
			$pdf->Output();
		} 
	}//getHoraireFutures	
	
	
	public static function getHorairesValidationMensuelle($user_id, $token, $annee, $mois){
		$pdf = new MyPDF();
		// Titres des colonnes
		// Chargement des données
		$data =  self::getHorairesValidationMensuellePdf($user_id, $token, $annee, $mois) ;		
		if($data != 0){	
			//print_r($data);
			$profil =  json_decode(self::getUserInfo($user_id, $token));				
			$titre = 'Horaire mensuels de '. $profil->prenom.' '.$profil->nom. ' : '.getMois(intval($mois)) . ' '.$annee;
			$pdf->SetFont('Arial','',14);
			$pdf->AddPage();
			$pdf->SetTitre($titre);
			$pdf->TableValidationMensuelle($data);
			$pdf->Output();
		}
	}//getHoraireFutures	
	
	// Retourne les horaires d'un utilisateur pour impression PDF
	public static function getHorairesPDF($user_id, $token) {
		$data = false;
		if(self::checkUserAuthentication($user_id, $token)){
			$db = MySQLManager::get();
			$query = "SELECT hop_id, DATE_FORMAT(hop_date, '%d.%m.%Y') AS date, DATE_FORMAT(hop_date, '%w') AS jour, DATE_FORMAT(hop_heureDebut, '%H:%i') AS  heureDebut, 
				DATE_FORMAT(hop_heureFin, '%H:%i') AS  heureFin  FROM ccn_horairepersonne INNER JOIN ccn_travail ON (hop_id = tra_hop_id) WHERE tra_per_id = ? AND hop_date >= CURDATE() ORDER BY hop_date ASC, hop_heureDebut ASC";		
			if ($stmt = $db->prepare($query)) {				
				$stmt->bind_param('i', $user_id);
				$stmt->execute();
				$stmt->bind_result($id, $date, $jour, $heureDebut,  $heureFin);
				$data = array(); // On créer un array
				while($stmt->fetch()) {
					$hor = []; // On créer un deuxième array qui contient les horaires courrants
					$hor['date'] = getJour($jour)." ".$date;
					$hor['horaire'] = $heureDebut." - ".$heureFin;
	
					$data[] = $hor; // On met l'array des horaires dans le 1er array
		  		}	
			} 
			MySQLManager::close();
		}
		return $data; // On retourne l'array sans autre formatage
	}//getHorairesPDF
	
	// Format des mois : MM = le numéro du mois, de 01 à 12 (les mois ayant un seul chiffre peuvent être indiquer indifférement avec un "0" précédent le chiffre ou non : 1 ou 01)
	// Format des années: YYYY
	public static function getHorairesValidationMensuellePdf($user_id, $token, $annee, $mois) {
		if(self::checkUserAuthentication($user_id, $token)){
			$db = MySQLManager::get();
			$query = "SELECT hop_id, DATE_FORMAT(hop_date, '%d.%m.%Y') AS date, DATE_FORMAT(hop_date, '%w') AS jour, DATE_FORMAT(hop_heureDebut, '%H:%i') AS  heureDebut, 
				DATE_FORMAT(hop_heureFin, '%H:%i') AS  heureFin, tra_valide , DATE_FORMAT(TIMEDIFF(hop_heureFin, hop_heureDebut), '%H:%i') AS heures, 				
				DATE_FORMAT(tram_heureDebut, '%d.%m.%Y') AS mod_dateDebut, DATE_FORMAT(tram_heureDebut, '%w') AS mod_jourDebut, DATE_FORMAT(tram_heureDebut, '%H:%i') AS  mod_heureDebut, 
				DATE_FORMAT(tram_heureFin, '%d.%m.%Y') AS mod_dateFin, DATE_FORMAT(tram_heureFin, '%w') AS mod_jourFin, DATE_FORMAT(tram_heureFin, '%H:%i') AS mod_heureFin,
				DATE_FORMAT(TIMEDIFF(tram_heureFin, tram_heureDebut), '%H:%i') AS mod_heures				
				FROM ccn_horairepersonne INNER JOIN ccn_travail ON (hop_id = tra_hop_id) LEFT JOIN ccn_travailmodifie ON (tra_hop_id = tram_tra_hop_id)
				WHERE tra_per_id = ? AND YEAR(hop_date) = ?  AND MONTH(hop_date) = ? AND (tra_valide = 'non' OR tra_valide = 'oui' OR tra_valide = 'mod')
				ORDER BY hop_date ASC, hop_heureDebut ASC";	
			if ($stmt = $db->prepare($query)) {				
				$stmt->bind_param('iii', $user_id, $annee, $mois);
				$stmt->execute();
				$stmt->bind_result($id, $date, $jour, $heureDebut, $heureFin, $traValide, $heures, $mod_dateDebut, $mod_jourDebut, $mod_heureDebut, $mod_dateFin, $mod_jourFin, $mod_heureFin, $mod_heures);
				$data = array(); // On créer un array
				while($stmt->fetch()) {
					$hor = []; // On créer un deuxième array qui contient les horaires courrants
					
					$hor['id'] = $id;
					$hor['periode'] = $moisStr.' '.$annee;
					$hor['date'] = getJour($jour)." ".$date;		
					
					if($mod_dateDebut != null){// Si les horaires ont été modifiés
					 	if($mod_dateDebut != $mod_dateFin){// Si la date de début est différente de la date de fin (ex: on a fini le lendemin matin : on affiche la date en même temps
							$hor['horaire'] = $mod_heureDebut." (".$mod_dateDebut.")"." - ";
							$hor['horaire'].=$mod_heureFin." (".$mod_dateFin.")";
						} else {
							$hor['horaire'] = $mod_heureDebut." - ".$mod_heureFin;
						}
						$hor['nbHeures'] = $mod_heures;
					} else { //Sinon: on prend ce qu'on a dans la table horaires
					 	$hor['horaire'] = $heureDebut." - ".$heureFin;
						$hor['nbHeures'] = $heures;
					}					
					$hor['valide'] = $traValide;
					$data[] = $hor; // On met l'array des horaires dans le 1er array
		  		}	
			} 
			MySQLManager::close();
			return $data; // On retourne le tout sous forme d'array
		} 
		return 0;
	}//getHorairesValidationMensuellePdf
	
		private static function checkUserAuthentication($user_id, $token) {
		$db = MySQLManager::get(); 
		$query = "SELECT per_token, per_admin FROM ccn_personne WHERE per_id = ?";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param("i", $user_id);
			$stmt->execute();
			$stmt->store_result();
			if ($stmt->affected_rows == 1) {
				$stmt->bind_result($per_token, $per_admin);
				$stmt->fetch();
				MySQLManager::close();
				return $per_token == $token; // Verification de la correspondance des token : si ce n'est pas le cas : connexion invalide
			}
		}
		MySQLManager::close();
		return false;
	}//checkUserAuthentication	
	
	public static function getUserInfo($user_id, $token) {
		$userData = false;
		if(self::checkUserAuthentication($user_id, $token)){
			$db = MySQLManager::get();
			$query = "SELECT per_nom, per_prenom, per_mail, per_dateNaissance,per_adresse, per_InfoSuppAdresse, per_codePostal, per_ville, per_telFixe, per_telMobile FROM ccn_personne WHERE per_id = ?";			
			if ($stmt = $db->prepare($query)) {
				$stmt->bind_param('i', $user_id);
				$stmt->execute();
				$stmt->store_result();
				$stmt->bind_result($per_nom, $per_prenom, $per_mail, $per_dateNaissance, $per_adresse, $per_InfoSuppAdresse, $per_codePostal, $per_ville, $per_telFixe, $per_telMobile);
				$stmt->fetch();
				if ($stmt->affected_rows == 1) {
					$userData = array('nom'  => $per_nom != null ? $per_nom : "" , 
									'prenom' => $per_prenom != null ? $per_prenom : "" ,
									'mail' => $per_mail  != null ? $per_mail  : "" ,
									'dateNaissance' => $per_dateNaissance != null ? $per_dateNaissance : "" ,
									'adresse' =>  $per_adresse != null ? $per_adresse : "" ,
									'suppAdresse' =>  $per_InfoSuppAdresse != null ? $per_InfoSuppAdresse : "" ,
									'codePostal' =>  $per_codePostal != null ? $per_codePostal : "" ,
									'ville' =>  $per_ville != null ? $per_ville : "" ,
									'telFix' =>  $per_telFixe != null ? $per_telFixe : "" ,
									'telMobile' => $per_telMobile != null ? $per_telMobile : "" );
				}				
			} 
			MySQLManager::close();
		}
		return (json_encode($userData));
	}//updateUserLogin
}//PdfService




?>