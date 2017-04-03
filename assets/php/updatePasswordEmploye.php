<?php

	require_once("classes/Sanitizer.php");
	require_once("classes/UserAuthentication.php");

	$authData = Sanitizer::getSanitizedJSInput(); // Récupère les données aseptisée
	$authentified = UserAuthentication::checkAuthenticationLimited($authData['user_id'], $authData['user_token']);

	if ($authentified == false) {
		echo("Vous n'avez pas le droit d'appeler cette requete ou requete invalide");
	} else {
		require_once("classes/EmployeeDAO.php");
		$res = EmployeeDAO::updatePasswordEmploye($authData);
		echo(json_encode($res));
	}
	
?>