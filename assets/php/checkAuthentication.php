<?php
	require_once("classes/Sanitizer.php");
	require_once("classes/UserAuthentication.php");

	$authData = Sanitizer::getSanitizedJSInput(); // Récupère les données aseptisée
	UserAuthentication::secureSessionStart();
	$res = UserAuthentication::checkLogin($authData['id'], $authData['token']); // Récupère le résulat obtenu
	if ($res) {
		echo(json_encode($res));
	} else {
		echo(json_encode(false));
	}
?>