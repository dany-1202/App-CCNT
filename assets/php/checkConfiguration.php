<?php
	require_once("classes/Sanitizer.php");
	require_once("classes/EtatInitial.php");

	$authData = Sanitizer::getSanitizedJSInput(); // Récupère les données aseptisée
	$res = InitialState::checkConfiguration($authData); // Récupère le résulat obtenu
	echo(json_encode($res));
?>