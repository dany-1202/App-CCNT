<?php
// Fichier de test 
// TODO: SUPPRIMER CE FICHIER EN PRODUCTION !!!
require_once("PushService.php");


// But: tester le classe PushService
// Envois un push à la personne ayant l'ID 1 selon le type passé en paramètre d'url
 
$res = false;

if(!empty($_GET['type'])){
	switch ($_GET['type']) {
		case 1:
			$res = PushService::sendPushNouveauPlanning(1);
			break;
		case 2:
			$res = PushService::sendPushModificationPlanning(1);
			break;
		case 3:
			 $res = PushService::sendPushDemandeCongeAcceptee(1);
			break;
		case 4:
			$res = PushService::sendPushDemandeCongeRefusee(1);
			break;
		case 5:
			$res = PushService::sendPushDemandeModCongeAcceptee(1);
			break;
		case 6:
			$res = PushService::sendPushDemandeModCongeRefusee(1);
			break;
	}	
}

if(!empty($_GET['type2'])){
	switch ($_GET['type2']) {
		case 1:
			$res = PushService::sendPushNouveauPlanning(3);
			break;
		case 2:
			$res = PushService::sendPushModificationPlanning(3);
			break;
		case 3:
			 $res = PushService::sendPushDemandeCongeAcceptee(3);
			break;
		case 4:
			$res = PushService::sendPushDemandeCongeRefusee(3);
			break;
		case 5:
			$res = PushService::sendPushDemandeModCongeAcceptee(3);
			break;
		case 6:
			$res = PushService::sendPushDemandeModCongeRefusee(3);
			break;
	}	
}
if(!empty($_GET['type3'])){
	switch ($_GET['type3']) {
		case 1:
			$res = PushService::sendPushNouveauPlanning(4);
			break;
		case 2:
			$res = PushService::sendPushModificationPlanning(4);
			break;
		case 3:
			 $res = PushService::sendPushDemandeCongeAcceptee(4);
			break;
		case 4:
			$res = PushService::sendPushDemandeCongeRefusee(4);
			break;
		case 5:
			$res = PushService::sendPushDemandeModCongeAcceptee(4);
			break;
		case 6:
			$res = PushService::sendPushDemandeModCongeRefusee(4);
			break;
	}	
}
echo 'Résultat : ';
if($res) {
	echo 'OK';
} else {
	echo 'ECHEC';
}
?>