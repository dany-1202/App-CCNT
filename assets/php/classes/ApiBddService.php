<?php
require_once("MySQLManager.php");

class ApiBddService{
	// Email de nouveau mot de passe:
	private static $newPass_subject = 'Nouveau mot de passe';
	private static $newPass_message = '<span style="font-family:arial; font-size:14px">Bonjour,<br/><br />Voici votre nouveau mot de passe : <span style="font-weight:bold; color:#009BC1;">$newPassword</span><br/>Une fois que vous serez connecter, merci de changer de mot de passe depuis la page "Profil" .<br/><br/><br/> Meilleures salutations, <br/><br />Emply</span>';	
	
	//-----------------------------------------------------------------------------------------------------------------
	//------------------------------------------- LOGIN ET LOGOUT -----------------------------------------------------
	//-----------------------------------------------------------------------------------------------------------------
	public static function userLogin($login, $password, $deviceToken) {
		$res = self::validateUserLogin($login, $password); // Récupère le résulat obtenu
		$userData = false;
		if($res != 0) {
			$data = explode ('-', $res);
			$userData = array('token'  => $data[1], 'id' => $data[0]);
			self::updateUserDeviceToken(data[0], $deviceToken);
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
					$query = "UPDATE ccn_smartphoneInfo SET sma_deviceToken = NULL WHERE sma_per_id = ?";	 // On supprime le device Token
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
						return  true;
				  	} 
				} 
			} 				
		} 
		MySQLManager::close();
		return false;
	}//forgottenUserPassword
	
	private static function updateUserDeviceToken($user_id, $deviceToken){
		$db = MySQLManager::get();
		if ($stmt = $db->prepare("SELECT sma_deviceToken FROM ccn_smartphoneInfo WHERE sma_per_id = ?")) {
			$stmt->bind_param('i', $user_id);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($res);
			$stmt->fetch();
			if ($stmt->affected_rows == 1) {
				// Si le device-token de cette personne existe déja : on le met à jour (au cas où il aurait changé entre temps		
				$query = "UPDATE ccn_smartphoneInfo SET sma_deviceToken = ? WHERE sma_per_id = ?";
				if ($stmt = $db->prepare($query)) {
					$stmt->bind_param('si', $deviceToken, $user_id);
					$stmt->execute();
					if ($stmt->affected_rows > -1) {
						MySQLManager::close();
						return true;
				  }
				} 
			} else { // Si le device-token de cette personne n'est pas enregistré: on l'enregistre
				$query = "INSERT INTO ccn_smartphoneInfo VALUES (?, ?)";
				if ($stmt = $db->prepare($query)) {
					$stmt->bind_param('is',$user_id, $deviceToken);
					$stmt->execute();
					if ($stmt->affected_rows == 1) {
						MySQLManager::close();
						return true;
					}
				}
			}
		}
		MySQLManager::close();
		return false;
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
	public static function getUserHoraires($user_id, $token, $annee=NULL, $mois=NULL) {
		$data = false;
		if(self::checkUserAuthentication($user_id, $token)){
			$db = MySQLManager::get();
			$query = "SELECT hop_id, YEAR(hop_date) as annee, MONTH(hop_date) as mois, DAYOFMONTH(hop_date) as jour, HOUR(hop_heureDebut) as heureDebut, MINUTE(hop_heureDebut) as minuteDebut, 
				HOUR(hop_heureFin) as heureFin, MINUTE(hop_heureFin) as minuteFin  FROM ccn_horairepersonne INNER JOIN ccn_travail ON (hop_id = tra_hop_id) WHERE tra_per_id = ?";		
			if($annee != NULL){ $query.= " AND YEAR(hop_date) = ".$annee; } // Si l'année est spécifiés : on ajoute l'année dans la requête	
			if($mois != NULL){ $query.= " AND MONTH(hop_date) = ".$mois; }  // Si le mois est spécifiés : on ajoute le mois dans la requête	
			if ($stmt = $db->prepare($query)) {				
				$stmt->bind_param('i', $user_id);
				$stmt->execute();
				$stmt->bind_result($id, $annee, $mois, $jour, $heureDebut, $minuteDebut, $heureFin, $minuteFin);
				$data = array(); // On créer un array
				while($stmt->fetch()) {
					$hor = []; // On créer un deuxième array qui contient les horaires courrants
					$hor['id'] = $id;
					$hor['annee'] = $annee;
					$hor['mois'] = $mois;
					$hor['jour'] = $jour;
					$hor['heureDebut'] = $heureDebut;
					$hor['minuteDebut'] = $minuteDebut;
					$hor['heureFin'] = $heureFin;
					$hor['minuteFin'] = $minuteFin;
					$data[] = $hor; // On met l'array des horaires dans le 1er array
		  		}	
				if(count($data) == 0) { $data = false;}	// Si le tableau est vide : on met false = aucun horaire					
			} 
			MySQLManager::close();
		}
		return (json_encode($data)); // On retourne le tout je JSON
	}//getUserHoraires

	
	//-----------------------------------------------------------------------------------------------------------------
	//--------------------------------------------- DEMANDES  ---------------------------------------------------------
	//-----------------------------------------------------------------------------------------------------------------
		
	// Enregistre une nouvelle demande
	public static function setDemande($user_id, $token, $dem_id, $dateDebut, $dateFin, $motif) {
		$res = false;
		if(self::checkUserAuthentication($user_id, $token)){
			$db = MySQLManager::get(); 
			$query = "INSERT INTO ccn_demandePersonne (dpe_dem_id, dpe_per_id, dpe_dateDebut, dpe_dateFin, dpe_motif) VALUES (?, ?, ?, ?, ?)";
			if ($stmt = $db->prepare($query)) {
				$stmt->bind_param("iisss", $dem_id, $user_id, $dateDebut, $dateFin, ($motif == '') ? NULL : $motif);
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
			$query = "SELECT dpe_id, dpe_dateDebut, dpe_dateFin, dpe_motif, dpe_statut, dem_id, dem_nom FROM ccn_demandePersonne
				INNER JOIN ccn_demande ON (dpe_dem_id = dem_id) WHERE dpe_per_id = ? AND dpe_dateFin > NOW()";
			if ($stmt = $db->prepare($query)) {
				$stmt->bind_param("i", $user_id);
				$stmt->execute();
				$stmt->bind_result($dpe_id, $dpe_dateDebut, $dpe_dateFin, $dpe_motif, $dpe_statut, $dem_id, $dem_nom);
				$data = array(); // On créer un array
				while($stmt->fetch()) {
					$dem = []; // On créer un deuxième array qui contient les demandes courrants
					$dem['id'] = $dpe_id;
					$dem['dateDebut'] = $dpe_dateDebut;
					$dem['dateFin'] = $dpe_dateFin;
					$dem['motif'] = $dpe_motif;
					$dem['statut'] = $dpe_statut;
					$dem['id_typeDemande'] = $dem_id;
					$dem['nom_typeDemande'] = $dem_nom;
					$data[] = $dem; // On met l'array des horaires dans le 1er array
		  		}	
				if(count($data) == 0) { $data = false;}	// Si le tableau est vide : on met false = aucune demande					
			} 
			MySQLManager::close();
		}
		return (json_encode($data)); // On retourne le tout en JSON
	}//getDemandes
	
	// Modifier une nouvelle demande
	public static function modDemande($user_id, $token, $dpe_id, $dateDebut, $dateFin, $motif) {
		$res = false;
		($motif == '') ? NULL : $motif;
		if(self::checkUserAuthentication($user_id, $token)){
			$db = MySQLManager::get(); 
			$query = "UPDATE ccn_demandePersonne SET dpe_dateDebut=?, dpe_dateFin=?, dpe_motif=?, dpe_statut= 'modify' WHERE dpe_id= ?";
			if ($stmt = $db->prepare($query)) {
				$stmt->bind_param("sssi", $dateDebut, $dateFin, $motif, $dpe_id);
				$stmt->execute();
				if ($stmt->affected_rows > -1) {
					$res = true;
				}
			}
			MySQLManager::close();		
		}
		return (json_encode($res));
	}//modDemande
	
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
	
}//ApiBddService
?>