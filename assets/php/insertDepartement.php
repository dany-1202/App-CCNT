<?php

	require_once("classes/Sanitizer.php");
	require_once("classes/UserAuthentication.php");
	

	$data = Sanitizer::getSanitizedJSInput(); // Récupère les données aseptisée

	$authentified = UserAuthentication::checkAuthentication($authData['id'], $authData['user_token']);

	if ($authentified == false) {
		echo("Vous n'avez pas le droit d'appeler cette requete ou requete invalide");
	} else {
		require_once("classes/EtatInitial.php");
		$res = EtatInitial::insertDepartement($data);

		if ($res) {
			//si erreur :
			//echo(json_encode($res));
			echo(json_encode($data));
		}else {
			echo("Impossible d'insérer le département");
		}
	}
	
?>