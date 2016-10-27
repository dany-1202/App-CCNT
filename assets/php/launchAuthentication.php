<?php
	require_once("classes/UserAuthentication.php");
	require_once("classes/Sanitizer.php");


	$authData = Sanitizer::getSanitizedJSInput(); // Récupère les données aseptisée
	
	$res = UserAuthentication::validateUserLogin($authData['logon'], $authData['password']); // Récupère le résulat obtenu

	if ($res) { echo(json_encode($_SESSION)); } // Connexion réussi
?>