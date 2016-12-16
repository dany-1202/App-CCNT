<?php

	require_once("classes/Sanitizer.php");
	require_once("classes/UserAuthentication.php");
	

	$authData = Sanitizer::getSanitizedJSInput(); // Récupère les données aseptisée

	$authentified = UserAuthentication::checkLogin($authData['id'], $authData['user_token']);

	if ($authentified == false) {
		echo("Vous n'avez pas le droit d'appeler cette requete ou requete invalide");
	} else {
		require_once("classes/EtatInitial.php");
		$res = EtatInitial::insertPossede($authData);

		if ($res) {
			//si erreur
			echo(json_encode($authData));
		}else {
			echo("insertPossde($authData)");
		}
	}
		
?>