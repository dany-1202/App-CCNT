<?php
	require_once("classes/Sanitizer.php");
	require_once("classes/UserAuthentication.php");

	$authData = Sanitizer::getSanitizedJSInput();
	$authentified = UserAuthentication::checkAuthentication($authData['user_id'], $authData['user_token']);

	if ($authentified == false) {
		/* Utilisateur non autorisé */
		echo("Vous n'avez pas le droit d'appeler cette requete ou requete invalide");
	} else {
		/* Utilisateur autorisé */
		require_once("classes/EtatInitial.php");
		$res = EtatInitial::getFermetureInfo($authData['user_id']); // Récupère le résulat obtenu
		echo(json_encode($res));
	}
?>