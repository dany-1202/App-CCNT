<?php
// Fonctions génériques, pouvant être utilisées n'importe où

function getJour($idJour){
	switch($idJour){
		 case 0:
			return "Dimanche";
		case 1:
			return "Lundi";
		case 2:
			return "Mardi";
		case 3:
			return "Mercredi";	
		case 4:
			return "Jeudi";
		case 5:
			return "Vendredi";
		case 6:
			return "Samedi";
	}
}//getJour

function getMois($idMois){
	switch($idMois){
		 case 1:
			return "Janvier";
		case 2:
			return "Février";
		case 3:
			return "Mars";
		case 4:
			return "Avril";	
		case 2:
			return "Mai";
		case 6:
			return "Juin";
		case 7:
			return "Juillet";
		case 8:
			return "Août";
		case 9:
			return "Septembre";
		case 10:
			return "Octbre";
		case 11:
			return "Novembre";
		case 12:
			return "Décembre";
	}
}//getMois

function add_heures($heure1 ,$heure2 ){
	$secondes1= heure_to_secondes($heure1);
	$secondes2= heure_to_secondes($heure2);
	$somme=$secondes1+$secondes2;
	//transfo en h:i:s
	$s=$somme % 60; //reste de la division en minutes => secondes
	$m1=($somme-$s) / 60; //minutes totales
	$m=$m1 % 60;//reste de la division en heures => minutes
	$h=($m1-$m) / 60; //heures
	if($h < 10){ $h = '0'.$h;}
	if($m < 10){ $m = '0'.$m;}
	$resultat= $h.":".$m;
	return $resultat;
}//add_heures

function heure_to_secondes($heure){
	$array_heure=explode(":",$heure);
	$secondes=3600*$array_heure[0]+60*$array_heure[1]+$array_heure[2];
	return $secondes;
}//heure_to_secondes
?>