<?php
require_once("ApiBddService.php");
require_once("MyPDF.php");
require_once("outils.php");

class PdfService{
	
	public static function getHoraireFutures($user_id, $token){
		$pdf = new MyPDF();
		// Titres des colonnes
		// Chargement des données
		$data =  ApiBddService::getHorairesPDF($user_id, $token);
		$profil =  json_decode(ApiBddService::getUserInfo($user_id, $token));
		$titre = 'Horaire de '. $profil->prenom.' '.$profil->nom;
		if($data != 0){			
			$pdf->SetFont('Arial','',14);
			$pdf->AddPage();
			$pdf->SetTitre($titre);
			$pdf->TableHoraires($data);
			$pdf->Output();
		} 

	}//getHoraireFutures	
	
	
	public static function getHorairesValidationMensuelle($user_id, $token, $annee, $mois){
		$pdf = new MyPDF();
		// Titres des colonnes
		// Chargement des données
		$data =  ApiBddService::getHorairesValidationMensuellePdf($user_id, $token, $annee, $mois) ;		
		if($data != 0){	
			//print_r($data);
			$profil =  json_decode(ApiBddService::getUserInfo($user_id, $token));				
			$titre = 'Horaire mensuels de '. $profil->prenom.' '.$profil->nom. ' : '.getMois(intval($mois)) . ' '.$annee;
			$pdf->SetFont('Arial','',14);
			$pdf->AddPage();
			$pdf->SetTitre($titre);
			$pdf->TableValidationMensuelle($data);
			$pdf->Output();
		}
	}//getHoraireFutures	
	
}//PdfService




?>