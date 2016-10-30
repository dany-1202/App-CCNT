<?php 
	require_once("classes/Sanitizer.php");
	require_once("classes/UserAuthentication.php");
	
	$authData = Sanitizer::getSanitizedJSInput(); 
	UserAuthentication::disconnect($authData['id']);
	echo(json_encode($authData['id']));
?>