<?php 
	require_once("classes/Sanitizer.php");
	require_once("classes/UserAuthentication.php");
	
	$authData = Sanitizer::getSanitizedJSInput();
	$authentified = UserAuthentication::checkAuthentication($authData['user_id'], $authData['user_token']);

	if ($authentified == false) {
		echo("Vous n'avez pas le droit d'appeler cette requete ou requete invalide");
	} else {
		UserAuthentication::disconnect($authData['user_id']);
	}
?>