<?php

	require_once("classes/Sanitizer.php");
	require_once("classes/EtatInitial.php");

	$data = Sanitizer::getSanitizedJSInput(); // Récupère les données aseptisée
	$res = EtatInitial::insertPossede($data);

	if ($res) {
		//echo(json_encode($res));
		echo(json_encode($data));
	}else {
		echo("Impossible d'insérer la date / heure de fermeture");
	}
	
?>