<?php
	require_once("classes/UserAuthentication.php");
	require_once("classes/Sanitizer.php");

	$authData = Sanitizer::getSanitizedJSInput(); // Récupère les données aseptisée
	UserAuthentication::secureSessionStart(); // Lance une session sécurisé
	$res = UserAuthentication::validateUserLogin($authData['login'], $authData['password']); // Récupère le résulat obtenu

	if ($res) { echo(json_encode($_SESSION)); } // Connexion réussi
?>