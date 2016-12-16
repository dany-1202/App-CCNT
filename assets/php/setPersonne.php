<?php
/*
Auteur : Vincent Jalley
Date : 13.12.2016
Description : Fait le lien entre l'API PHP et le controller de l'application
*/

	require_once("classes/Sanitizer.php");
	require_once("classes/UserAuthentication.php");
	

	$authData = Sanitizer::getSanitizedJSInput(); // Récupère les données aseptisées

	$authentified = UserAuthentication::checkLogin($authData['id'], $authData['user_token']);

	if ($authentified == false) {
		echo("Vous n'avez pas le droit d'appeler cette requete ou requete invalide");
	} else {
		require_once("classes/EtatInitial.php");
		$res = EtatInitial::setPersonne($authData);

		if ($res) {
			//si erreur
			echo(json_encode($authData));
		}else {
			echo("modification de la personne");
		}
	}
	
?>