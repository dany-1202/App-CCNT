<?php

	require_once("classes/Sanitizer.php");
	require_once("classes/EtatInitial.php");

	$data = Sanitizer::getSanitizedJSInput(); // Récupère les données aseptisée
	$res = EtatInitial::insertEtablissement($data);

	if ($res != -1) {
		//echo(json_encode($res));
		echo(json_encode($res));
	}else {
		echo("Impossible d'insérer l'établissement");
	}
	
?>