<?php
// Fichier de test 
// TODO: SUPPRIMER CE FICHIER EN PRODUCTION !!!
require_once("PushService.php");


// But: tester le classe PushService
// Envois un push à la personne ayant l'ID 1 selon le type passé en paramètre d'url
 
$res = false;

if(!empty($_GET['type']) && !empty($_GET['id'])){
	switch ($_GET['type']) {
		case 1:
			$res = PushService::sendPushNouveauPlanning($_GET['id']);
			break;
		case 2:
			$res = PushService::sendPushModificationPlanning($_GET['id']);
			break;
		case 3:
			 $res = PushService::sendPushDemandeCongeAcceptee($_GET['id']);
			break;
		case 4:
			$res = PushService::sendPushDemandeCongeRefusee($_GET['id']);
			break;
		case 5:
			$res = PushService::sendPushDemandeModCongeAcceptee($_GET['id']);
			break;
		case 6:
			$res = PushService::sendPushDemandeModCongeRefusee($_GET['id']);
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