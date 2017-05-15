<?php

	require_once("classes/Sanitizer.php");
	require_once("classes/UserAuthentication.php");

	$authData = Sanitizer::getSanitizedJSInput(); // Récupère les données aseptisées
	$authentified = UserAuthentication::checkAuthentication($authData['user_id'], $authData['user_token']);
	
	if ($authentified == false) {
		echo("Vous n'avez pas le droit d'appeler cette requete ou requete invalide");
	} else {
		require_once("classes/HorairePreconfigureDAO.php");
	
		$res = HorairePreconfigureDAO::insertJourPreconfig($authData['id'], $authData['matinDebut'], $authData['matinFin'], $authData['soirDebut'], $authData['soirFin'], $authData['pauseMatin'], $authData['pauseSoir'], $authData['hpr_id']);
		echo(json_encode($res));
	}
	
?>