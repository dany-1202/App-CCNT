<?php
require_once("../classes/MySQLManager.php");
require_once("outils.php");
require_once("../classes/HoraireEmployeeDAO.php");

class ApiBddService{
	// Email de nouveau mot de passe:
	private static $newPass_subject = 'Nouveau mot de passe';
	private static $newPass_message = '<span style="font-family:arial; font-size:14px">Bonjour,<br/><br />Voici votre nouveau mot de passe : <span style="font-weight:bold; color:#009BC1;">$newPassword</span><br/>Une fois que vous serez connecté, merci de changer de mot de passe depuis la page "Profil" .<br/><br/><br/> Meilleures salutations, <br/><br />Emply</span>';	
	
	//-----------------------------------------------------------------------------------------------------------------
	//------------------------------------------- LOGIN ET LOGOUT -----------------------------------------------------
	//-----------------------------------------------------------------------------------------------------------------
	public static function userLogin($login, $password, $deviceToken) {
		$res = self::validateUserLogin($login, $password); // Récupère le résulat obtenu
		$userData = false;
		if($res != 0) {
			$data = explode ('-', $res);
			$userData = array('token'  => $data[1], 'id' => $data[0]);
			
			self::updateUserDeviceToken($data[0], $deviceToken);
		}
		return (json_encode($userData));
	}//userLogin
	
	// Deconnexion de l'utilisateur: supprime son tokenet son deviceToken
	public static function logoutUser($user_id, $token) {
		$res = false;
		if(self::checkUserAuthentication($user_id, $token)){
			$db = MySQLManager::get();
			$query = "UPDATE ccn_personne SET per_token = NULL WHERE per_id = ?"; // On supprime le token			
			if ($stmt = $db->prepare($query)) {
				$stmt->bind_param('i', $user_id);
				$stmt->execute();
				if ($stmt->affected_rows > -1) {
					$query = "UPDATE ccn_smartphoneinfo SET sma_deviceToken = NULL WHERE sma_per_id = ?";	 // On supprime le device Token
					if ($stmt = $db->prepare($query)) {
						$stmt->bind_param('i', $user_id);
						$stmt->execute();
						MySQLManager::close();
						$res = true;
					}
			  }
			} 
			MySQLManager::close();
		}
		return (json_encode($res));
	}//logoutUser
	
	public static function forgottenUserPassword($email) {
		$res = false;
		$db = MySQLManager::get();
		if ($stmt = $db->prepare("SELECT per_id FROM ccn_personne WHERE per_mail = ?")) {
			$stmt->bind_param('s', $email);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($user_id);
			$stmt->fetch();
			if ($stmt->affected_rows == 1) { // Si l'email de cette personne existe :
				// On créer une nouveau mot de passe à 6 caractères avec Rand()
				$newPassword =  rand (100000 ,999999);			
				// On enregsitre le nouveau mot de passe dans le BDD
				$passwordCrypt = hash('sha512', $newPassword);			
				$query = "UPDATE ccn_personne SET per_mdp = ? WHERE per_id = ?"; // On enregistre le nouveau password			
				if ($stmt = $db->prepare($query)) {
					$stmt->bind_param('si', $passwordCrypt, $user_id);
					$stmt->execute();
					if ($stmt->affected_rows > -1) {
						MySQLManager::close();
						// En envois un mail à la personne pour lui donner son nouveau mot de passe
						$message = str_replace('$newPassword', $newPassword, self::$newPass_message);
						mail($email, self::$newPass_subject, $message, "Content-Type: text/html;charset=utf-8");	
						$res = true;
				  	} 
				} 
			} 				
		} 
		 MySQLManager::close();		
		return (json_encode($res));
	}//forgottenUserPassword
	
	private static function updateUserDeviceToken($user_id, $deviceToken){
		$res = false;		
		if(!empty($deviceToken) && $deviceToken != NULL){
			$db = MySQLManager::get();
			if ($stmt = $db->prepare("SELECT COUNT(*) AS total FROM ccn_smartphoneinfo WHERE sma_per_id = ?")) {
				$stmt->bind_param('i', $user_id);
				$stmt->execute();
				$stmt->store_result();
				$stmt->bind_result($res);
				$stmt->fetch();
				if ($res > 0) {
					// Si le device-token de cette personne existe déja : on le met à jour (au cas où il aurait changé entre temps		
					$db = MySQLManager::get();
					$query = "UPDATE ccn_smartphoneinfo SET sma_deviceToken = ? WHERE sma_per_id = ?";
					if ($stmt = $db->prepare($query)) {
						$stmt->bind_param('si', $deviceToken, $user_id);
						$stmt->execute();
						if ($stmt->affected_rows > -1) {
							MySQLManager::close();
							return true;
					  }
					} 
				} else { // Si le device-token de cette personne n'est pas enregistré: on l'enregistre
					$db = MySQLManager::get();
					$query = "INSERT INTO ccn_smartphoneinfo VALUES (?, ?)";
					if ($stmt = $db->prepare($query)) {
						$stmt->bind_param('is',$user_id, $deviceToken);
						$stmt->execute();
						if ($stmt->affected_rows == 1) {
							MySQLManager::close();
							$res = true;
						}
					}
				}
			}
			MySQLManager::close();
		}
		return (json_encode($res));
	}//updateUserDeviceToken
	
	//-----------------------------------------------------------------------------------------------------------------
	//------------------------------------------------ PROFIL ---------------------------------------------------------
	//-----------------------------------------------------------------------------------------------------------------
	
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
	
	public static function updateUserInfo($user_id, $token, $nom, $prenom,  $dateNaissance, $adresse, $suppAdresse, $codePostal, $ville, $telFix, $telMobile) {
		$res = false;
		if(self::checkUserAuthentication($user_id, $token)){
			$db = MySQLManager::get();
			$query = "UPDATE ccn_personne SET 
				per_nom = ?, 
				per_prenom = ?, 	
				per_dateNaissance = ?,
				per_adresse = ?, 
				per_InfoSuppAdresse = ?,
				per_codePostal = ?,
				per_ville = ?,
				per_telFixe = ?,
				per_telMobile = ?
				WHERE per_id = ?";
				$dnom = ($nom == '') ? NULL : $nom;
				$dprenom = ($prenom == '') ? NULL : $prenom; 
				$ddateNaissance = ($dateNaissance == '') ? NULL : $dateNaissance;
				$dadresse = ($adresse == '') ? NULL : $adresse;
				$dsuppAdresse = ($suppAdresse == '') ? NULL : $suppAdresse;
				$dcodePostal = ($codePostal == '') ? NULL : $codePostal;
				$dville = ($ville == '') ? NULL : $ville;
				$dtelFix = ($telFix == '') ? NULL : $telFix; 
				$dtelMobile = ($telMobile == '') ? NULL : $telMobile;				
			if ($stmt = $db->prepare($query)) {
				$stmt->bind_param('sssssisssi', $dnom, $dprenom, $ddateNaissance, $dadresse, $dsuppAdresse, $dcodePostal, $dville, $dtelFix, $dtelMobile, $user_id);
				$stmt->execute();
				if ($stmt->affected_rows > -1) {
					MySQLManager::close();
					$res = true;
			  }
			} 
			MySQLManager::close();
		}
		return (json_encode($res));
	}//updateUserInfo
	
	// Met à jour l'adresse email de l'utilisateur
	public static function updateUserLogin($user_id, $token, $mail) {
		$res = false;
		if(self::checkUserAuthentication($user_id, $token)){
			$db = MySQLManager::get();
			$query = "UPDATE ccn_personne SET per_mail = ? WHERE per_id = ?";			
			if ($stmt = $db->prepare($query)) {
				$stmt->bind_param('si', $mail, $user_id);
				$stmt->execute();
				if ($stmt->affected_rows > -1) {
					MySQLManager::close();
					$res = true;
			  }
			} 
			MySQLManager::close();
		}
		return (json_encode($res));
	}//updateUserLogin
	
	public static function updateUserPassword($user_id, $token, $oldPassword, $newPassword) {
		$res = false;
		if(self::checkUserAuthentication($user_id, $token)){
			$oldPasswordCrypt = hash('sha512', $oldPassword);	// On crypte l'ancien passoword
			$db = MySQLManager::get();
			if($stmt = $db->prepare("SELECT per_mdp FROM ccn_personne WHERE per_id = ?")) { // On récupère le password dans la BDD
				$stmt->bind_param('i', $user_id);
				$stmt->execute();
				$stmt->store_result();
				$stmt->bind_result($per_mdp);
				$stmt->fetch();
				if ($stmt->affected_rows ==  1 && $oldPasswordCrypt == $per_mdp) {	  // On vérifie que l'ancien password est correct
					$passwordCrypt = hash('sha512', $newPassword);			
					$query = "UPDATE ccn_personne SET per_mdp = ? WHERE per_id = ?"; // On enregistre le nouveau password			
					if ($stmt = $db->prepare($query)) {
						$stmt->bind_param('si', $passwordCrypt, $user_id);
						$stmt->execute();
						if ($stmt->affected_rows > -1) {
							MySQLManager::close();
							$res = true;
					  } 
					} 
				} 
			} 
			MySQLManager::close();
		} 
		return (json_encode($res));
	}//updateUserPassword
	
	//-----------------------------------------------------------------------------------------------------------------
	//--------------------------------------------- HORAIRES  ---------------------------------------------------------
	//-----------------------------------------------------------------------------------------------------------------
	
	// Paramètres optionnels : année et mois : s'ils sont omis, l'intégralité des horaires de la personnes sont retournés<br />
	// Il est possible de mettre  soit seulement l'année, soit seulement le mois (même si dans le cas où on met le mois, il est plus logique de spéficier l'année également)<br />
	// Format des mois : MM = le numéro du mois, de 01 à 12 (les mois ayant un seul chiffre peuvent être indiquer indifférement avec un "0" précédent le chiffre ou non : 1 ou 01)
	// Format des années: YYYY
	public static function getHoraires($user_id, $token, $annee=NULL, $mois=NULL) {
		$data = false;
		if(self::checkUserAuthentication($user_id, $token)){
			$db = MySQLManager::get();
			$query = "SELECT hop_id, hop_date, 
				HOUR(hop_heureDebut) as heureDebut, MINUTE(hop_heureDebut) as minuteDebut, 
				HOUR(hop_heureFin) as heureFin, MINUTE(hop_heureFin) as minuteFin,
				HOUR(tram_heureDebut) as modHeureDebut, MINUTE(tram_heureDebut) as modMinuteDebut, 
				HOUR(tram_heureFin) as modHeureFin, MINUTE(tram_heureFin) as modMinuteFin
				FROM ccn_horairepersonne INNER JOIN ccn_travail ON (hop_id = tra_hop_id) 
				LEFT JOIN ccn_travailmodifie ON (tram_tra_hop_id = tra_hop_id)
				WHERE tra_per_id = ?";		
			if($annee != NULL){ $query.= " AND YEAR(hop_date) = ".$annee; } // Si l'année est spécifiés : on ajoute l'année dans la requête	
			if($mois != NULL){ $query.= " AND MONTH(hop_date) = ".$mois; }  // Si le mois est spécifiés : on ajoute le mois dans la requête	
			$query.=" ORDER BY hop_date ASC, hop_heureDebut ASC";
			if ($stmt = $db->prepare($query)) {				
				$stmt->bind_param('i', $user_id);
				$stmt->execute();
				$stmt->bind_result($id, $date, $heureDebut, $minuteDebut, $heureFin, $minuteFin, $modHeureDebut, $modMinuteDebut, $modHeureFin, $modMinuteFin);				
				$data = array(); // On créer un array
				while($stmt->fetch()) {					
					$hor = []; // On créer un deuxième array qui contient les horaires courrants
					$hor['id'] = $id;
					$hor['date'] = $date;
					$hor['heureDebut'] = (isset($modHeureDebut) && isset($modMinuteDebut)) ? $modHeureDebut : $heureDebut;
					$hor['minuteDebut'] = (isset($modHeureDebut) && isset($modMinuteDebut)) ? $modMinuteDebut :  $minuteDebut;
					$hor['heureFin'] =  (isset($modHeureFin) && isset($modMinuteFin)) ? $modHeureFin : $heureFin;
					$hor['minuteFin'] = (isset($modHeureFin) && isset($modMinuteFin)) ? $modMinuteFin : $minuteFin;
					$data[] = $hor; // On met l'array des horaires dans le 1er array
		  		}	
			} 
			MySQLManager::close();			
		}
		return (json_encode($data)); // On retourne le tout en JSON
	}//getHoraires
	
	

	// Retourne les horaires futurs d'un utilisateur
	public static function getHorairesFuturs($user_id, $token) {
		$data = false;
		if(self::checkUserAuthentication($user_id, $token)){
			$db = MySQLManager::get();
			$query = "SELECT hop_id, hop_date, HOUR(hop_heureDebut) as heureDebut, MINUTE(hop_heureDebut) as minuteDebut, 
				HOUR(hop_heureFin) as heureFin, MINUTE(hop_heureFin) as minuteFin  FROM ccn_horairepersonne INNER JOIN ccn_travail ON (hop_id = tra_hop_id) WHERE tra_per_id = ? AND hop_date >= CURDATE() ORDER BY hop_date ASC, hop_heureDebut ASC";		
			if ($stmt = $db->prepare($query)) {				
				$stmt->bind_param('i', $user_id);
				$stmt->execute();
				$stmt->bind_result($id, $date, $heureDebut, $minuteDebut, $heureFin, $minuteFin);
				$data = array(); // On créer un array
				while($stmt->fetch()) {
					$hor = []; // On créer un deuxième array qui contient les horaires courrants
					$hor['id'] = $id;
					$hor['date'] = $date;
					$hor['heureDebut'] = $heureDebut;
					$hor['minuteDebut'] = $minuteDebut;
					$hor['heureFin'] = $heureFin;
					$hor['minuteFin'] = $minuteFin;
					$data[] = $hor; // On met l'array des horaires dans le 1er array
		  		}	
			} 
			MySQLManager::close();
		}
		return (json_encode($data)); // On retourne le tout je JSON
	}//getHorairesFuturs
  
  	// Retourne les horaires en attente de validation d'un utilisateur
	public static function getHorairesAttenteValidation($user_id, $token) {
		$data = false;
		if(self::checkUserAuthentication($user_id, $token)){
			$db = MySQLManager::get();
			$query = "SELECT hop_id, hop_date, HOUR(hop_heureDebut) as heureDebut, MINUTE(hop_heureDebut) as minuteDebut, HOUR(hop_heureFin) as heureFin, MINUTE(hop_heureFin) as minuteFin 
			FROM ccn_horairepersonne INNER JOIN ccn_travail ON (hop_id = tra_hop_id) 
			WHERE tra_per_id = ? AND tra_valide = 'non' AND (hop_date < CURRENT_DATE() OR (DATE(hop_date) = CURRENT_DATE() AND hop_heureFin <= CURRENT_TIME()))";		
			if ($stmt = $db->prepare($query)) {				
				$stmt->bind_param('i', $user_id);
				$stmt->execute();
				$stmt->bind_result($id, $date, $heureDebut, $minuteDebut, $heureFin, $minuteFin);
				$data = array(); // On créer un array
				while($stmt->fetch()) {
					$hor = []; // On créer un deuxième array qui contient les horaires courrants
					$hor['id'] = $id;
					$hor['date'] = $date;
					$hor['heureDebut'] = $heureDebut;
					$hor['minuteDebut'] = $minuteDebut;
					$hor['heureFin'] = $heureFin;
					$hor['minuteFin'] = $minuteFin;
					$data[] = $hor; // On met l'array des horaires dans le 1er array
		  		}	
			} 
			MySQLManager::close();
		}
		return (json_encode($data)); // On retourne le tout en JSON
	}//getHorairesAttenteValidation
	
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
					
					//------------------------------------------------------------------------------------------------------------------------
					// Je ne sais pas pourquoi ce bout de code avait été mis en commentaire, qui a fait ça et pourquoi 
					// mais merci de ne pas y toucher ou de m'en parler avant car je m'en sert et s'il n'est plus là je passe 
					// des heures à essayer de comprendre pourquoi les PDF ne s'affichent tout à coup plus correctement...
					$hor['id'] = $id;
					$hor['periode'] = $moisStr.' '.$annee;
					$hor['date'] = getJour($jour)." ".$date;		
					//------------------------------------------------------------------------------------------------------------------------
					
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
		
	public static function getDetailHoraire($user_id, $token, $horaire_id){
		$data = false;
		if(self::checkUserAuthentication($user_id, $token)){
			$db = MySQLManager::get();
			$query = "SELECT hop_id, hop_date, HOUR(hop_heureDebut) as heureDebut, MINUTE(hop_heureDebut) as minuteDebut, 
				HOUR(hop_heureFin) as heureFin, MINUTE(hop_heureFin) as minuteFin  FROM ccn_horairepersonne WHERE hop_id = ?";		
			if ($stmt = $db->prepare($query)) {				
				$stmt->bind_param('i', $horaire_id);
				$stmt->execute();
				$stmt->bind_result($id, $date, $heureDebut, $minuteDebut, $heureFin, $minuteFin);
				$data = array(); // On créer un array
				while($stmt->fetch()) {
					$hor = []; // On créer un deuxième array qui contient les horaires courrants
					$hor['id'] = $id;
					$hor['date'] = $date;
					$hor['heureDebut'] = $heureDebut;
					$hor['minuteDebut'] = $minuteDebut;
					$hor['heureFin'] = $heureFin;
					$hor['minuteFin'] = $minuteFin;
					$data[] = $hor; // On met l'array des horaires dans le 1er array
		  		}	
			} 
			MySQLManager::close();
			if(count($data) <= 0){ $data = false;}
		}
		return (json_encode($data)); // On retourne le tout je JSON
	}//getDetailHoraire

	//-----------------------------------------------------------------------------------------------------------------
	//--------------------------------------------- ADRESSE TRAVAIL ---------------------------------------------------
	//-----------------------------------------------------------------------------------------------------------------
	// Récupère l'adresse de l'établissement dans lequel l'employé travaille
	public static function getEtablissement($user_id, $token) {		
		$data = false;
		if(self::checkUserAuthentication($user_id, $token)){
			$db = MySQLManager::get(); 
			$query = "SELECT eta_nom, eta_adresse, eta_telDirection, eta_email, eta_adresseInfo, eta_codePostal, eta_localite FROM ccn_etablissement 
				INNER JOIN ccn_appartient ON (eta_id = app_eta_id)
				INNER JOIN ccn_personne ON (app_per_id = per_id)
				WHERE per_id = ?";
			if ($stmt = $db->prepare($query)) {
				$stmt->bind_param("i", $user_id);
				$stmt->execute();
				$stmt->bind_result($eta_nom, $eta_adresse, $eta_telDirection, $eta_email, $eta_adresseInfo, $eta_codePostal, $eta_localite);
				$data = array(); // On créer un array
				while($stmt->fetch()) {
					$eta = []; // On créer un deuxième array qui contient les demandes courrants
					$eta['nom'] = $eta_nom;
					$eta['adresse'] = $eta_adresse;
					$eta['telDirection'] = $eta_telDirection;
					$eta['email'] = $eta_email;
					$eta['adresseInfo'] = $eta_adresseInfo;
					$eta['codePostal'] = $eta_codePostal;
					$eta['localite'] = $eta_localite;
					$data[] = $eta; // On met l'array des demandes dans le 1er array
		  		}	
				if(count($data) == 0) { $data = false;}	// Si le tableau est vide : on met false = aucune demande					
			} 
			MySQLManager::close();
		}
		return (json_encode($data)); // On retourne le tout en JSON
	}//getAdresseEtablissement
		
	//-----------------------------------------------------------------------------------------------------------------
	//--------------------------------------------- DEMANDES  ---------------------------------------------------------
	//-----------------------------------------------------------------------------------------------------------------
		
	// Enregistre une nouvelle demande
	public static function setDemande($user_id, $token, $dem_id, $dateDebut, $dateFin, $isJourneeComplete, $motif) {
		$res = false;
		if(self::checkUserAuthentication($user_id, $token)){
			$db = MySQLManager::get(); 
			$query = "INSERT INTO ccn_demandepersonne (dpe_abs_id, dpe_per_id, dpe_dateDebut, dpe_dateFin, dpe_isJourneeComplete, dpe_motif) VALUES (?, ?, ?, ?, ?, ?)";
			if ($stmt = $db->prepare($query)) {
				$stmt->bind_param("iissss", $dem_id, $user_id, $dateDebut, $dateFin, $isJourneeComplete, ($motif == '') ? NULL : $motif);
				$stmt->execute();
				if ($stmt->affected_rows == 1) {
					$res = true;
				}
			}
			MySQLManager::close();		
		}
		return (json_encode($res));
	}//setDemande
	
	// Récupère la liste des demandes qui ne sont pas encore passées (date de fin encore dans le futur)
	public static function getDemandes($user_id, $token) {		
		$data = false;
		if(self::checkUserAuthentication($user_id, $token)){
			$db = MySQLManager::get(); 
			$query = "SELECT dpe_id, dpe_dateDebut, dpe_dateFin, dpe_motif, dpe_isJourneeComplete, dpe_statut, abs_id, abs_nom FROM ccn_demandepersonne
				INNER JOIN ccn_absence ON (dpe_abs_id = abs_id) WHERE dpe_per_id = ? AND dpe_dateFin >= NOW()";
			if ($stmt = $db->prepare($query)) {
				$stmt->bind_param("i", $user_id);
				$stmt->execute();
				$stmt->bind_result($dpe_id, $dpe_dateDebut, $dpe_dateFin, $dpe_motif, $dpe_isJourneeComplete, $dpe_statut, $abs_id, $abs_nom);
				$data = array(); // On créer un array
				while($stmt->fetch()) {
					$dem = []; // On créer un deuxième array qui contient les demandes courrants
					$dem['id'] = $dpe_id;
					$dem['dateDebut'] = $dpe_dateDebut;
					$dem['dateFin'] = $dpe_dateFin;
					$dem['motif'] = ($dpe_motif != null && $dpe_motif != "") ? $dpe_motif : "";
					$dem['statut'] = $dpe_statut;
					$dem['isJourneeComplete'] = $dpe_isJourneeComplete;
					$dem['id_typeDemande'] = $abs_id;
					$dem['nom_typeDemande'] = $abs_nom;
					$data[] = $dem; // On met l'array des demandes dans le 1er array
		  		}	
			} 
			MySQLManager::close();
		}
		return (json_encode($data)); // On retourne le tout en JSON
	}//getDemandes
	
	// Modifier une nouvelle demande
	public static function modDemande($user_id, $token, $dpe_id, $dateDebut, $dateFin, $motif, $isJourneeComplete) {
		$res = false;
		($motif == '') ? NULL : $motif;
		if(self::checkUserAuthentication($user_id, $token)){
			$db = MySQLManager::get(); 
			$query = "UPDATE ccn_demandepersonne SET dpe_dateDebut=?, dpe_dateFin=?, dpe_motif=?, dpe_isJourneeComplete = ?, dpe_statut= 'modify' WHERE dpe_id= ?";
			if ($stmt = $db->prepare($query)) {
				$stmt->bind_param("ssssi", $dateDebut, $dateFin, $motif, $isJourneeComplete, $dpe_id);
				$stmt->execute();
				if ($stmt->affected_rows > -1) {
					$res = true;
				}
			}
			MySQLManager::close();		
		}
		return (json_encode($res));
	}//modDemande
	
	// Récupère la liste des demandes qui ont été acceptées, pour l'année et le mois passé en paramètre (ou toutes les demandes valides si le mois et l'année sont omis)
	public static function getDemandesAccepteesParMois($user_id, $token, $annee=NULL, $mois=NULL) {	
		$data = false;	
		if(self::checkUserAuthentication($user_id, $token)){
			$db = MySQLManager::get(); 
			$query = "SELECT dpe_id, dpe_dateDebut, dpe_dateFin, dpe_motif, dpe_isJourneeComplete, abs_id, abs_nom FROM ccn_demandepersonne
				INNER JOIN ccn_absence ON (dpe_abs_id = abs_id) WHERE dpe_per_id = ? AND (dpe_statut = 'accept' OR dpe_statut='modifyAccept')";
			if($annee != NULL){ $query.= " AND (YEAR(dpe_dateDebut) = ".$annee. " OR  YEAR(dpe_dateFin) = ".$annee. ")"; } // Si l'année est spécifiés : on ajoute l'année dans la requête	
			if($mois != NULL){ $query.= " AND (MONTH(dpe_dateDebut) = ".$mois. " OR MONTH(dpe_dateFin) = ".$mois. ")"; }  // Si le mois est spécifiés : on ajoute le mois dans la requête	

			if ($stmt = $db->prepare($query)) {
				$stmt->bind_param("i", $user_id);
				$stmt->execute();
				$stmt->bind_result($dpe_id, $dpe_dateDebut, $dpe_dateFin, $dpe_motif,  $dpe_isJourneeComplete, $abs_id, $abs_nom);
				$data = array(); // On créer un array
				while($stmt->fetch()) {
					$dem = []; // On créer un deuxième array qui contient les demandes courrants
					$dem['id'] = $dpe_id;
					$dem['dateDebut'] = $dpe_dateDebut;
					$dem['dateFin'] = $dpe_dateFin;
					$dem['motif'] = ($dpe_motif != null && $dpe_motif != "") ? $dpe_motif : "";
					$dem['isJourneeComplete'] = $dpe_isJourneeComplete;
					$dem['id_typeDemande'] = $abs_id;
					$dem['nom_typeDemande'] = $abs_nom;
					$data[] = $dem; // On met l'array des demandes dans le 1er array
		  		}	
			} 
			
		}
		return (json_encode($data)); // On retourne le tout en JSON
	}//getDemandesAccepteesParMois
  
  	//-----------------------------------------------------------------------------------------------------------------
	//--------------------------------------------- VALIDATION DES HORAIRES -------------------------------------------
	//-----------------------------------------------------------------------------------------------------------------
	
  	// Valider les horaires et modification des horaires
	public static function valHoraire($user_id, $token, $hop_id, $dateHeureDebut, $dateHeureFin, $tra_valide) {
		$res = false;
	  	if(self::checkUserAuthentication($user_id, $token)){ // Vérification de la connexion
			$db = MySQLManager::get(); 
			$query = "UPDATE ccn_travail SET tra_valide = ? WHERE tra_per_id = ? AND tra_hop_id = ?";
				if ($stmt = $db->prepare($query)) {
				$stmt->bind_param("sii", $tra_valide, $user_id, $hop_id);  
				$stmt->execute();
				if ($stmt->affected_rows >= 0) {
				  if(!empty($dateHeureDebut) && !empty($dateHeureFin)){
					$db = MySQLManager::get();
					$query = "INSERT INTO ccn_travailmodifie VALUES (?, ?, ?, ?,'', NOW())";//On enregsitre le moment où on insert cette modification (avec NOW())
					if ($stmt = $db->prepare($query)) {
						$stmt->bind_param('iiss', $user_id, $hop_id, $dateHeureDebut, $dateHeureFin);
						$stmt->execute();
						if ($stmt->affected_rows == 1) {
							MySQLManager::close();
							$res = true;
						}
					}
				  }else{
				  	$res = true;
					//echo $tra_valide;
				  }
				}
			}
			MySQLManager::close();		
		}
		return (json_encode($res));
	}//valHoraire
  
  
  
	//-----------------------------------------------------------------------------------------------------------------
	//--------------------------------------------- VALIDATION VUE HORAIRE -------------------------------------------
	//-----------------------------------------------------------------------------------------------------------------
	
  	// Valider qu'on a vu les modifications sur nos horaires 
	public static function getValVueHor($user_id, $token) {
		$res = false;
	  	if(self::checkUserAuthentication($user_id, $token)){ // Vérification de la connexion
		  $db = MySQLManager::get();
		  
		  // On regarde su cette personne a déja une entrée dans la table
		  if ($stmt = $db->prepare("SELECT COUNT(*) AS total FROM ccn_valvuehoraire WHERE valho_per_id =?")) { 
			   			
			$stmt->bind_param('i', $user_id);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($res);
			$stmt->fetch();
			if ($res > 0) { // Si oui (res plus grand que zéro
			  $query = "UPDATE  ccn_valvuehoraire SET valho_date= NOW() WHERE valho_per_id = ?"; // On met à jour la date
			} else { // Si non
			  $query = "INSERT INTO ccn_valvuehoraire(valho_per_id, valho_date) VALUES (?, NOW())"; // On créer une nouvelle entrée avec la date actuelle
		  	}
			
			// Dans  les 2 cas:
			if ($stmt = $db->prepare($query)) { // On envois la requête
			  $stmt->bind_param('i',$user_id); // On met les paramètres
				$stmt->execute();
			  if ($stmt->affected_rows == 1) { // Si notre requête à fait une modification = c'est tout bon, return true
					MySQLManager::close();
					$res = true;
				}
			}
		  } 
		}	  
	  	return (json_encode($res));
	}//valVueHoraire

	//-----------------------------------------------------------------------------------------------------------------
	//--------------------------------------------- VALIDATION MENSUELLE -------------------------------------------
	//-----------------------------------------------------------------------------------------------------------------
	
  	// Valider qu'on a vu notre feuille d'heures mensuelle
	public static function valMensuelle($user_id, $token, $annee, $mois) {
		$res = false;
	  	if(self::checkUserAuthentication($user_id, $token)){ // Vérification de la connexion
			 $db = MySQLManager::get();
			 $query = "INSERT INTO ccn_validationmensuelle(val_per_id, val_mois) VALUES (?, ?)";
			 $date = $annee.'-'.$mois.'-1';  // On met l'année et le mois reçu, et je jour à 1
				if ($stmt = $db->prepare($query)) {
					$stmt->bind_param('is', $user_id, $date);
					$stmt->execute();
					if ($stmt->affected_rows == 1) {
						MySQLManager::close();
						$res = true;
					}
				}
				MySQLManager::close();		
		}
		return (json_encode($res));
	}//valMensuelle

    //-----------------------------------------------------------------------------------------------------------------
    //--------------------------------------------- HORAIRE MALADIE --------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    // Valider les horaires et modification des horaires
	public static function dateMaladieAccident($user_id, $token, $dateDebut, $dateFin, $isAccident, $horaire_id) {
		$res = false;
	  	if(self::checkUserAuthentication($user_id, $token)){ // Vérification de la connexion
			 $db = MySQLManager::get();
			 $query = "INSERT INTO ccn_maladieaccident(mac_per_id, mac_tra_id, mac_dateDebut, mac_dateFin, mac_isAccident) VALUES (?, ?, ?, ?, ?)";
				if ($stmt = $db->prepare($query)) {
					$stmt->bind_param('iissi', $user_id, $horaire_id, $dateDebut, $dateFin, $isAccident);
					$stmt->execute();
					if ($stmt->affected_rows == 1) {
						MySQLManager::close();
						$res = true;
					}
				}
				MySQLManager::close();		
		}
		return (json_encode($res));
	}//dateMaladieAccident 
	
	// Récupère la liste des maladies et accidents  pour l'année et le mois passé en paramètre (ou toutes les maladies et accidents si le mois et l'année sont omis)
	public static function getMaladiesParMois($user_id, $token, $annee=NULL, $mois=NULL) {	
		$data = false;	
		if(self::checkUserAuthentication($user_id, $token)){
			$db = MySQLManager::get(); 
			$query = "SELECT mac_id, mac_dateDebut, mac_dateFin, mac_isAccident FROM ccn_maladieaccident WHERE mac_per_id = ?";
			if($annee != NULL){ $query.= " AND (YEAR(mac_dateDebut) = ".$annee." OR YEAR(mac_dateFin) = ".$annee.")"; } // Si l'année est spécifiés : on ajoute l'année dans la requête	
			if($mois != NULL){ $query.= " AND (MONTH(mac_dateDebut) = ".$mois." OR MONTH(mac_dateFin) = ".$mois.")"; }  // Si le mois est spécifiés : on ajoute le mois dans la requête	

			if ($stmt = $db->prepare($query)) {
				$stmt->bind_param("i", $user_id);
				$stmt->execute();
				$stmt->bind_result($mac_id, $mac_dateDebut, $mac_dateFin, $mac_isAccident);
				$data = array(); // On créer un array
				while($stmt->fetch()) {
					$mal = []; // On créer un deuxième array qui contient les elements courrants
					$mal['id'] = $mac_id;
					$mal['dateDebut'] = $mac_dateDebut;
					$mal['dateFin'] = $mac_dateFin;
					$mal['isAccident'] = $mac_isAccident;
					$data[] = $mal; // On met l'array des dans le 1er array
		  		}	
			} 
			MySQLManager::close();
		}
		return (json_encode($data)); // On retourne le tout en JSON
	}//getMaladiesParMois
  	
  
  
	//-----------------------------------------------------------------------------------------------------------------
	//--------------------------------------------- AUTENTIFICATION  --------------------------------------------------
	//-----------------------------------------------------------------------------------------------------------------
		
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
	
	// Retourne 0 si la connexion est un echec, autrement retourne l'id "-" et le token
	private static function validateUserLogin($login, $password) {
		$res = 0; 
		$db = MySQLManager::get();
		$passwordCrypt = hash('sha512', $password);
		if ($stmt = $db->prepare("SELECT per_id, per_nom FROM ccn_personne WHERE per_mail = ? and per_mdp = ?")) {
			$stmt->bind_param("ss", $login, $passwordCrypt);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($per_id, $per_nom);
			$stmt->fetch();
			if ($stmt->affected_rows == 1) {			
				$token = $per_nom . " | " . uniqid() . uniqid() . uniqid();
				if ($stmtUp = $db->prepare("UPDATE ccn_personne SET per_token = ? WHERE per_id = ?")) {
					$stmtUp->bind_param('ss',$token, $per_id);
					$stmtUp->execute();
					MySQLManager::close();					
				}
				$res = $per_id.'-'.$token;
			}
		}
		MySQLManager::close();
		return $res;
	}//validateUserLogin
  
//------------------------------------------------------------------------------------------------------------
//----------------------------------------- RECUPERE ID ETABLISSEMENT ----------------------------------------------
//-----------------------------------------------------------------------------------------------------------  

  //Permet de récupérer l'ID d'un établissement selon l'id du departement 
  public static function getIdEtablissement($user_id, $token, $idDepart) {
	if(self::checkUserAuthentication($user_id, $token)){
		$db = MySQLManager::get();
	  $query = "SELECT dep_eta_id FROM ccn_departement WHERE dep_id = ?"; 
			if ($stmt = $db->prepare($query)) {
				$stmt->bind_param("i", $idDepart);
				$stmt->execute();
				$stmt->store_result();
				if ($stmt->affected_rows == 1) {
					$stmt->bind_result($dep_eta_id);
					$stmt->fetch();
					MySQLManager::close();
					return (json_encode($dep_eta_id)); // Verification de la correspondance des token : si ce n'est pas le cas : connexion invalide
				}
		}
		MySQLManager::close();
	}
		return false;
	}
  
  
  //----------------------------------------------------------------------------------------------------
  //----------------------------------ID DU DEPARTEMENT DE L'EMPLOYE ----------------------------------------
  //----------------------------------------------------------------------------------------------------
  
  //Permet de récupérer l'ID d'un département selon l'id d'un employe 
  public static function getIdDepartement($user_id, $token) {
	if(self::checkUserAuthentication($user_id, $token)){
		$db = MySQLManager::get();
	  $query = "SELECT pos_dep_id FROM ccn_possede WHERE pos_per_id = ?"; 
			if ($stmt = $db->prepare($query)) {
				$stmt->bind_param("i", $user_id);
				$stmt->execute();
				$stmt->store_result();
				if ($stmt->affected_rows == 1) {
					$stmt->bind_result($pos_dep_id);
					$stmt->fetch();
					MySQLManager::close();
					return (json_encode($pos_dep_id)); // Verification de la correspondance des token : si ce n'est pas le cas : connexion invalide
				}
		}
		MySQLManager::close();
	}
		return false;
	}  
  
  
  
  //----------------------------------------------------------------------------------------------------
  //------------------------------------TYPE CONTRAT ET HORAIRE ----------------------------------------
  //----------------------------------------------------------------------------------------------------
	  //Permet de récupérer le type d'horaire et le taux ou horaire du contrat
  public static function getTypeHoraireContrat($user_id, $token) {
	if(self::checkUserAuthentication($user_id, $token)){
		$db = MySQLManager::get();
	  $query = "SELECT con_particularite, con_hor_id FROM ccn_contrat WHERE con_per_id = ?"; 
			if ($stmt = $db->prepare($query)) {
				$stmt->bind_param("i", $user_id);
				$stmt->execute();
				$stmt->store_result();
				if ($stmt->affected_rows == 1) {
					$stmt->bind_result($con_particularite, $con_hor_id);
				  	$data = array(); // On créer un array
					while($stmt->fetch()) {
						$dem = []; // On créer un deuxième array qui contient les demandes courrants
						$dem['idHor'] = $con_hor_id;
						$dem['conParticularite'] = $con_particularite;
						$data[] = $dem; // On met l'array des demandes dans le 1er array
		  			}
				  MySQLManager::close();
				  return (json_encode($data)); // Verification de la correspondance des token : si ce n'est pas le cas : connexion invalide
				}
		}
		MySQLManager::close();
	}
		return false;
	}
 
  //-----------------------------------------------------------------------------------------------
  //-----------------------Récupération API HoraireEmployeeDAO-------------------------------------
  //-----------------------------------------------------------------------------------------------
  
  
  public static function getInfosSoldes($user_id, $token, $dateDebut, $dateFin) {
	if(self::checkUserAuthentication($user_id, $token)){
		return HoraireEmployeeDAO::getInfosSolde($userId, $dateDebut, $dateFin);		
	}
	return false;
  } 
  
  public static function getInfosHeuresMois($user_id, $token, $mois, $annee, $idEta) {
	if(self::checkUserAuthentication($user_id, $token)){
		return HoraireEmployeeDAO::getInfosHeuresMois($userId, $mois, $annee, $idEta);		
	}
	return false;
  }  
  
  public static function calculerSoldeEmployee($user_id, $token, $mois, $annee, $idEta) {
	if(self::checkUserAuthentication($user_id, $token)){
		return HoraireEmployeeDAO::calculerSoldeEmployee($userId, $mois, $annee, $idEta);		
	}
	return false;
  }  
  
}//ApiBddService
?>