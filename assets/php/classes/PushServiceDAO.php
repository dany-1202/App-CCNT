<?php
require_once("MySQLManager.php");

class PushServiceDAO{
	// Access key : permet de transmettre le push à FireBase
	const API_ACCESS_KEY = 'AAAA1J14CpI:APA91bFo_w7chqGn-vZ3avUEFSMbSj7HuSngwKLlTt14uGTQ4S1AIuy8zem6r2_vvdiI6oKx2Hz9Rv-U7QaJ22Viivxo8SLHMWmVaRvZL91XPvWiJ3Xhjl75qy0ncuuRVqYAlp0TC02ZX08A73Ar_5cYLflEHD5zSg';
	
	// Mon access key : pour mes tests
	//const API_ACCESS_KEY = 'AAAAm3FEWFM:APA91bH5oPB6ybKP31cU4J10pNmSSUMriIwRi7YQZzIyaV3wAo4PwUQsMp14vPb3YTMNYwHg8sw36xvq2gCtPmF12o0zC-7hzDkZ9meANoNKM17BjxKG5Wd9buXdlDHkAe8TdE6Yle7OQjz1_QCeRySEWEQc3SExVg';
	
	// URL de firebase pour envoyer le push
	const FIREBASE_URL = 'https://fcm.googleapis.com/fcm/send';
	
	// Paramètres du push: modifiables
	const PUSH_VIBRATE = 'res://icon';
	const PUSH_SOUND = 'res://platform_default';
	const PUSH_LARGE_ICON = 'large_icon'; //TODOO : mettre le lien du logo de l'app
	const PUSH_SMALL_ICON = 'small_icon'; //TODOO : mettre le lien du logo de l'app
	
	// Paramètres des noms des pushs: modifiables : doivent être les mêmes que ceux que la BDD
	const PUSH_NOUVEAU_PLANNING = 'Nouveau planning';
	const PUSH_MOD_PLANNING = 'Modification planning';
	const PUSH_CONGE_ACCEPTEE = 'Demande conge acceptee';
	const PUSH_CONGE_REFUSEE = 'Demande conge refusee'; 
	const PUSH_MOD_CONGE_ACCEPTEE = 'Demande modification acceptee'; 
	const PUSH_MOD_CONGE_REFUSEE = 'Demande modification refusee'; 
	
	private $deviceToken = null;
	private $title = "";
	private $message = "";
	private $subtitle = "";
	private $id = "";
	private $ticket = "";
	
	function __construct($user_id, $nom){
		$this->setDeviceToken($user_id);
		$this->getPushContent($nom);
	}//__construct
	
	private function sendPush(){
		// Formatage du push
		$msg = array(
			'message'   => $this->message,
			'title'     => $this->title,
			'subtitle'  => $this->subtitle,
			'payload' => array('id' => $this->id),
			'tickerText'    =>  $this->ticket,
			'vibrate'   => self::PUSH_VIBRATE,
			'sound'     => self::PUSH_SOUND,
			'largeIcon' => self::PUSH_LARGE_ICON,
			'smallIcon' => self::PUSH_SMALL_ICON
		);
		
		// Formatage du la requete Firebase
		$fields = array(
			'registration_ids'  => array($this->deviceToken),
			'data'          => $msg
		);
		
		// Formatage du header de la requete Firebase
		$headers = array(
			'Authorization: key=' . self::API_ACCESS_KEY,
			'Content-Type: application/json'
		);
		
		// Initialisation de la session cURL: permet de se connecter au serveur de Firebase
		$ch = curl_init();
		// Tranmissions des différents paramètres à Firebase
		curl_setopt( $ch,CURLOPT_URL, self::FIREBASE_URL); // Définition de l'url
		curl_setopt( $ch,CURLOPT_POST, true );		// Définiton de la méthode d'envois de notre requete(post)
		curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );	// Définition du header de la requete
		curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );	// RETURNTRANSFER à true: permet de récupérer le résultats
		curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );	// CURLOPT_SSL_VERIFYPEER à false: on ne vérifie pas le certificat
		curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) ); // Envois du contenu de la requête
		$result = curl_exec($ch); 
		curl_close($ch);
		echo $result; // TODO: enlever cette ligne en dès qu'on a plus besoin de tester via l'URL
		$result = json_decode($result, true);
		$result = filter_var_array($result, FILTER_SANITIZE_STRING);
		return $result['success'] == 1;
	}//sendPush
	
	private function setDeviceToken($user_id){
		$db = MySQLManager::get();
		if ($stmt = $db->prepare("SELECT sma_deviceToken FROM ccn_smartphoneInfo WHERE sma_per_id = ?")) {
			$stmt->bind_param('s', $user_id);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($deviceToken);
			$stmt->fetch();
			if ($stmt->num_rows == 1) {
				$this->deviceToken = $deviceToken;
			}
		}
		MySQLManager::close();
	}//getDeviceToken
	
	private function getPushContent($nom){
		$db = MySQLManager::get();
		if ($stmt = $db->prepare("SELECT pus_id, pus_titre, pus_message, pus_sousTitre, pus_ticket FROM ccn_pushInfo WHERE pus_nom = ?")) {
			$stmt->bind_param('s', $nom);
			$stmt->execute();
			$stmt->store_result();
			$stmt->bind_result($pus_id, $pus_titre, $pus_message, $pus_sousTitre, $pus_ticket);
			$stmt->fetch();
			if ($stmt->num_rows == 1) {
				$this->id = $pus_id;
				$this->title = $pus_titre;
				$this->message = $pus_message;
				$this->subtitle = $pus_sousTitre;
				$this->ticket = $pus_ticket;
			}
		}
		MySQLManager::close();
	}//getDevideToken
	
	private function checkPushData(){
		return $this->deviceToken != null && $this->message != "" && $this->title != ""  && $this->id != "";
	}//checkPushData

	//-----------------------------------------------------------------------------------------------------------
	//------ FONCTIONS STATIQUES A UTILISER DANS LE CODE SUR SITE POUR DÉCLANCHER LES ENVOIS DE PUSH ------------
	//-----------------------------------------------------------------------------------------------------------
		
	// Envois le push pour avertir l'employé que son nouveau planning est prêt
	// Paramètre: user_id : l'id de l'employé dans la base de données
	// Renvois TRUE sur le push est envoyé avec succès, FALSE dans le cas inverse
	public static function sendPushNouveauPlanning($user_id){
		$ps = new PushServiceDAO($user_id, self::PUSH_NOUVEAU_PLANNING);
		return $ps->deviceToken;/*
		if($ps->checkPushData()){
			return $ps->sendPush();	
		}	
		return false;*/
	}//sendPushNouveauPlanning
	
	// Envois le push pour avertir l'employé que son planning a été modifié
	// Paramètre: user_id : l'id de l'employé dans la base de données
	// Renvois TRUE sur le push est envoyé avec succès, FALSE dans le cas inverse
	public static function sendPushModificationPlanning($user_id){
		$ps = new PushServiceDAO($user_id, self::PUSH_MOD_PLANNING);
		if($ps->checkPushData()){
			return $ps->sendPush();	
		}	
		return false;
	}//sendPushModificationPlanning
	
	// Envois le push pour avertir l'employé que sa demande de congée a été acceptée
	// Paramètre: user_id : l'id de l'employé dans la base de données
	// Renvois TRUE sur le push est envoyé avec succès, FALSE dans le cas inverse
	public static function sendPushDemandeCongeAcceptee($user_id){
		$ps = new PushServiceDAO($user_id, self::PUSH_CONGE_ACCEPTEE);
		if($ps->checkPushData()){
			return $ps->sendPush();	
		}	
		return false;
	}//sendPushDemandeCongeAcceptee
	
	// Envois le push pour avertir l'employé que sa demande de congée a été refusée
	// Paramètre: user_id : l'id de l'employé dans la base de données
	// Renvois TRUE sur le push est envoyé avec succès, FALSE dans le cas inverse
	public static function sendPushDemandeCongeRefusee($user_id){
		$ps = new PushServiceDAO($user_id, self::PUSH_CONGE_REFUSEE);
		if($ps->checkPushData()){
			return $ps->sendPush();	
		}	
		return false;
	}//sendPushDemandeCongeRefusee
	
	// Envois le push pour avertir l'employé que sa demande de modification de congée a été acceptée
	// Paramètre: user_id : l'id de l'employé dans la base de données
	// Renvois TRUE sur le push est envoyé avec succès, FALSE dans le cas inverse
	public static function sendPushDemandeModCongeAcceptee($user_id){
		$ps = new PushServiceDAO($user_id, self::PUSH_MOD_CONGE_ACCEPTEE);
		if($ps->checkPushData()){
			return $ps->sendPush();	
		}	
		return false;	
	}//sendPushDemandeModCongeAcceptee
	
	// Envois le push pour avertir l'employé que sa demande de modification de congée a été refusée
	// Paramètre: user_id : l'id de l'employé dans la base de données
	// Renvois TRUE sur le push est envoyé avec succès, FALSE dans le cas inverse
	public static function sendPushDemandeModCongeRefusee($user_id){
		$ps = new PushServiceDAO($user_id, self::PUSH_MOD_CONGE_REFUSEE);
		if($ps->checkPushData()){
			return $ps->sendPush();	
		}	
		return false;	
	}//sendPushDemandeModCongeRefusee
}//PushServiceDAO
?>
