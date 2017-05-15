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
		if ($hpr_id != -1) {
			foreach ($authData['prehours'] as $key => $val) {
				if (($val['matin']['debut'] != 'Heure début') || ($val['soir']['debut'] != 'Heure début')) {
					HorairePreconfigureDAO::insertJourPreconfig($val['id'], $val['matin']['debut'], $val['matin']['fin'], $val['soir']['debut'], $val['soir']['fin'], $val['datapauseMatin']['value'], $val['datapauseSoir']['value'], $hpr_id);
				}
			}
		}
		echo(json_encode($hpr_id));
	}
	
?>