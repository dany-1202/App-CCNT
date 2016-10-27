<?php
	require_once("classes/UserAuthentication.php");
	require_once("classes/Sanitizer.php");

	//get sanitized input
	$authData = Sanitizer::getSanitizedJSInput();
	
	$res = UserAuthentication::validateUserLogin($authData['logon'], $authData['password']);

	if ($res) { echo(json_encode($_SESSION)); } // Connexion réussi
?>