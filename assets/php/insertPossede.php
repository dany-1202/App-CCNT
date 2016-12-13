<?php

	require_once("classes/Sanitizer.php");
	require_once("classes/EtatInitial.php");

	$data = Sanitizer::getSanitizedJSInput(); // Récupère les données aseptisée
	$res = EtatInitial::insertPossede($data);

	if ($res) {
		//si erreur
		echo(json_encode($data));
	}else {
		echo("insertPossde($data)");
	}
	
?>