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
		require_once("classes/EmployeeDAO.php");
		require_once("classes/EtatInitial.php");
		$authData['eta_id']  = EtatInitial::getEstablishmentPerson($authData);
		$res = EmployeeDAO::getPersonneEmp($authData); // Récupère le résulat obtenu
		$resFiltres = EmployeeDAO::getHoraireFiltreAbs($res); // Récupère le résulat obtenu

		echo(json_encode($res)); // Retourner le résultat sous format json
	}
?>