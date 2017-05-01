<?php
require_once("PdfService.php");
require_once("../classes/UserAuthentication.php");

if(!empty($_GET['type'])){
	UserAuthentication::secureSessionStart(); // Lance une session sécurisé
	if($_GET['type'] == 'horaires' && !empty($_GET['userId']) && !empty($_GET['token'])){
		PdfService::getHoraireFutures(urldecode($_GET['userId']), urldecode($_GET['token']));
	} else if($_GET['type'] == 'valMensuelle' && !empty($_GET['userId']) && !empty($_GET['token'])  && !empty($_GET['annee'])  && !empty($_GET['mois'])){
		PdfService::getHorairesValidationMensuelle(urldecode($_GET['userId']), urldecode($_GET['token']),  urldecode($_GET['annee']),  urldecode($_GET['mois']));
	}
}
	
?>