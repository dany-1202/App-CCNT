<?php
	require_once("classes/Sanitizer.php");
	require_once("classes/UserAuthentication.php");

	$authData = Sanitizer::getSanitizedJSInput(); // Récupère les données aseptisée
	$res = UserAuthentication::checkActivationAccount($authData);
	echo(json_encode($res));
?>