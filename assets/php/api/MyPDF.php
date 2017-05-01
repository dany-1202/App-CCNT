<?php
require_once("fpdf/fpdf.php");
require_once("outils.php");

class MyPDF extends FPDF {

	function SetTitre($titre){
		$this->SetFont('Arial','B',15);
		// Titre
		$this->Cell(0,15,utf8_decode($titre), 'B',0,'C');
		// Saut de ligne
		$this->Ln(30);
	}//SetTitre

	
	// Tableau coloré
	function TableHoraires($data){
		$this->SetFont('Arial','B',15);
		// Couleurs, épaisseur du trait et police grasse
		$this->SetLineWidth(.3);
		$this->SetFillColor(224,235,255);
		$this->SetTextColor(0);
		$this->SetFont('');
		$margeGauche = 20;
		$largeurCell = 0;
		
		// Données
		$fill = false;
		$previousDate = null;
			if(count($data) > 0){
			foreach($data as $row)	{
				if($row['date'] != $previousDate){
					 $this->Cell($largeurCell,10,$row['date'],'1',0,'C', true);
					$this->Ln();
				}
				$this->Cell($largeurCell,8,$row['horaire'],'LR',0,'R',false);
				$this->Ln();
				$previousDate = $row['date'];
			}
		} else {
			$this->Cell($largeurCell,10,utf8_decode("Aucune heure planifiée"),'1',0,'C', true);
		}
		// Trait de fin 
		$this->Cell($largeurCell,0, '','LRB',0,'R',false);
	}//TableHoraires
	

	function TableValidationMensuelle($data){
		$this->SetFont('Arial','B',15);
		// Couleurs, épaisseur du trait et police grasse
		$this->SetLineWidth(.3);			
		
		$margeGauche = 20;
		$largeurCell = 190;
		$largeurColNbHeure = 45;
		
		// Desgin pour le header
		$this->SetFillColor(0 ,0 ,0);
		$this->SetTextColor(255);
		$this->SetFont('','B');
		$this->Cell($largeurCell-$largeurColNbHeure,12,utf8_decode("Horaire de travail"),'1',0,'C',true);
		$this->Cell($largeurColNbHeure,12, utf8_decode("Temps de travail"),'1',0,'C',true);
		$this->Ln();
		
		// Design pour le tableau	
		$this->SetFont('Arial','B',12);	
		$this->SetFillColor(211 ,211 ,211);
		$this->SetTextColor(0);
		$this->SetFont('');
		// Données
		$fill = false;
		$previousDate = null;
		$totalHeures = '00:00';
		if(count($data) > 0){
			foreach($data as $row)	{
				$isInvalide = false;
				$this->SetTextColor(0);//Couleur d'ecriture par défaut
				if($row['date'] != $previousDate){
					$this->Cell($largeurCell,10, " ".$row['date'],'1',0,'L', true);
					$this->Ln();
				}
				
				if($row['valide'] == 0) {
					$isInvalide = true;
					$this->SetTextColor(255, 0, 0);
				} 
				$this->Cell($largeurCell-$largeurColNbHeure,8, utf8_decode(($isInvalide ? "(non validé) " : "").  $row['horaire']),'LR',0,'R',false);
				$this->Cell($largeurColNbHeure,8, str_replace('-', '', $row['nbHeures']),'LR',0,'R',false);
				$this->Ln();
				$previousDate = $row['date'];
				$totalHeures = add_heures($totalHeures, $row['nbHeures']);
			}
			// Trait de fin 
			$this->Cell($largeurCell,0, '','LRB',0,'R',false);

		} else {
			$this->Cell($largeurCell,10, utf8_decode('Aucune heure de travail'),'T',0,'R',false);			
		}
		
		// Saut de ligne
		$this->Ln(10);
		// On reprend le desing du header
		$this->SetFont('Arial','B',15);
		$this->SetTextColor(255);
		$this->SetTextColor(0);
		$this->SetFont('','B');
		$this->Cell($largeurCell-$largeurColNbHeure,10, utf8_decode('Temps de travail total :'),'T',0,'R',false);
		$this->Cell($largeurColNbHeure,10, $totalHeures,'T',0,'R',false);
	}//TableValidationMensuelle
	
	


	
}
?>