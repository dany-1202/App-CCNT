<?php

	require_once("classes/Sanitizer.php");
	require_once("classes/EtatInitial.php");

	$data = Sanitizer::getSanitizedJSInput(); // Récupère les données aseptisée
	$res = InitialState::setDepartement($data);

	if ($res) {
		//echo(json_encode($res));
		echo(json_encode($data));
	}else {
		echo("Impossible d'insérer le département");
	}
	
?>