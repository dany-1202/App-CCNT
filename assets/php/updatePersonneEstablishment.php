<?php

	require_once("classes/Sanitizer.php");
	require_once("classes/UserAuthentication.php");
	require_once("classes/EtatInitial.php");

	$authData = Sanitizer::getSanitizedJSInput(); // Récupère les données aseptisée

	$authentified = UserAuthentication::checkLogin($authData['id'], $authData['user_token']);

	if ($authentified == false) {
		echo("Vous n'avez pas le droit d'appeler cette requete ou requete invalide");
	} else {
		require_once("classes/EtatInitial.php");
		$res = EtatInitial::insertPersonInEstablishment($authData);
		if ($res) {
			echo(json_encode($res));
		}else {
			echo("Impossible de rallier la personne à l'établissement");
		}
	}
	
?>