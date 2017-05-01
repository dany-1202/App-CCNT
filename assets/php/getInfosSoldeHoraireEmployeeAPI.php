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
		require_once("classes/Sanitizer.php");
		require_once("classes/HoraireEmployeeDAO.php");
		$tab = [];
		$tab['infoSolde'] = HoraireEmployeeDAO::getInfosSolde($authData['per_id'], $authData['dateDebut'], $authData['dateFin']); // Récupère le résulat obtenu
		$tab['infoSoldeMois'] = HoraireEmployeeDAO::getInfosHeuresMois($authData['per_id'], $authData['mois'], $authData['annee'], $authData['eta_id']); // Récupère le résulat obtenu
		$tab['soldeCourant'] = HoraireEmployeeDAO::calculerSoldeEmployee($authData['per_id'], $authData['mois'], $authData['annee'], $authData['eta_id']);
		echo(json_encode($tab)); // Retourner le résultat sous format json
	}
	
?>