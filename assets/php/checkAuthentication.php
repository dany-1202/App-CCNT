<?php
	require_once("classes/Sanitizer.php");
	require_once("classes/UserAuthentication.php");

	$authData = Sanitizer::getSanitizedJSInput(); // Récupère les données aseptisée
	UserAuthentication::secureSessionStart();
	$res = UserAuthentication::checkLogin($authData['id'], $authData['user_token']); // Récupère le résulat obtenu
	echo(json_encode($res));
?>