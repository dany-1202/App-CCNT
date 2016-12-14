<?php
/*
Auteur : Vincent Jalley
Date : 13.12.2016
Description : Fait le lien entre l'API PHP et le controller de l'application
*/

	require_once("classes/Sanitizer.php");
	require_once("classes/EtatInitial.php");

	$data = Sanitizer::getSanitizedJSInput(); // Récupère les données aseptisées
	$res = EtatInitial::setMdpPersonne($data);

	if ($res) {
		//si erreur
		echo(json_encode($data));
	}else {
		echo("modification du mot de passe d'une personne");
	}
	
?>