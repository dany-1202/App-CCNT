<?php

	require_once("classes/Sanitizer.php");
	require_once("classes/UserAuthentication.php");
	

	$authData = Sanitizer::getSanitizedJSInput(); // Récupère les données aseptisée
	$authentified = UserAuthentication::checkAuthentication($authData['user_id'], $authData['user_token']);

	if ($authentified == false) {
		echo("Vous n'avez pas le droit d'appeler cette requete ou requete invalide");
	} else {
		require_once("classes/EstablishmentDAO.php");
		/* Droit de faire le travail souhaité */
		$res = EstablishmentDAO::insertEtablissement($authData);
		if ($res != -1) {
			//echo(json_encode($res));
			echo(json_encode($res));
		}else {
			echo("Impossible d'insérer l'établissement");
		}
	} 
?>