<?php

	require_once("classes/Sanitizer.php");
	require_once("classes/UserAuthentication.php");

	$authData = Sanitizer::getSanitizedJSInput(); // Récupère les données aseptisées
	$authentified = UserAuthentication::checkAuthentication($authData['user_id'], $authData['user_token']);
	
	if ($authentified == false) {
		echo("Vous n'avez pas le droit d'appeler cette requete ou requete invalide");
	} else {
		require_once("classes/HorairePreconfigureDAO.php");
		$hpr_id = HorairePreconfigureDAO::updateHorairePreconfig($authData);
		echo(json_encode($hpr_id));
	}
	
?>