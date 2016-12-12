<?php

	require_once("classes/Sanitizer.php");
	require_once("classes/EtatInitial.php");

	$data = Sanitizer::getSanitizedJSInput(); // Récupère les données aseptisée
	$res = EtatInitial::insertPersonInEstablishment($data);
	if ($res) {
		echo(json_encode($res));
	}else {
		echo("Impossible de rallier la personne à l'établissement");
	}
	
?>