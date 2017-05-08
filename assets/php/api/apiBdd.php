<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once("../classes/UserAuthentication.php");
require_once("ApiBddService.php");
require_once("DemandeDAO.php");
require_once("../classes/HoraireEmployeeDAO.php");

if(!empty($_GET['type'])){
	UserAuthentication::secureSessionStart(); // Lance une session sécurisé
	
	if($_GET['type'] == 'connect' && !empty($_GET['login']) && !empty($_GET['password']) && isset($_GET['deviceToken'])){
		echo ApiBddService::userLogin(urldecode($_GET['login']), urldecode($_GET['password']), urldecode($_GET['deviceToken']));
	
	} elseif($_GET['type'] == 'setProfil' && !empty($_GET['userId']) && !empty($_GET['token'])){
		echo ApiBddService::updateUserInfo(urldecode($_GET['userId']),
		urldecode($_GET['token']),
		urldecode($_GET['nom']),
		urldecode($_GET['prenom']),
		urldecode($_GET['dateNaissance']),
		urldecode($_GET['adresse']),
		urldecode($_GET['suppAdresse']), 
		urldecode($_GET['codePostal']),
		urldecode($_GET['ville']),
		urldecode($_GET['telFix']),
		urldecode($_GET['telMobile']));
	
	} elseif($_GET['type'] == 'setLogin' && !empty($_GET['userId']) && !empty($_GET['token']) && !empty($_GET['mail'])){
		echo ApiBddService::updateUserLogin(urldecode($_GET['userId']), urldecode($_GET['token']), urldecode($_GET['mail']));
	
	} elseif($_GET['type'] == 'setPassword' && !empty($_GET['userId']) && !empty($_GET['token']) && !empty($_GET['oldPassword']) && !empty($_GET['newPassword'])){
		echo ApiBddService::updateUserPassword(urldecode($_GET['userId']), urldecode($_GET['token']), urldecode($_GET['oldPassword']), urldecode($_GET['newPassword']));
		
	} elseif($_GET['type'] == 'getProfil' && !empty($_GET['userId']) && !empty($_GET['token'])){
		echo ApiBddService::getUserInfo(urldecode($_GET['userId']), urldecode($_GET['token']));
		
	} elseif($_GET['type'] == 'setNewPassword' && !empty($_GET['email'])){
		echo ApiBddService::forgottenUserPassword(urldecode($_GET['email']));
	
	} elseif($_GET['type'] == 'logout'  && !empty($_GET['userId']) && !empty($_GET['token'])){
		echo ApiBddService::logoutUser(urldecode($_GET['userId']), urldecode($_GET['token']));	
	
	}  elseif($_GET['type'] == 'getHoraires'  && !empty($_GET['userId']) && !empty($_GET['token'])){
		echo ApiBddService::getHoraires(urldecode($_GET['userId']), urldecode($_GET['token']), urldecode($_GET['annee']), urldecode($_GET['mois']));
			
	} elseif($_GET['type'] == 'getDetailHoraire'  && !empty($_GET['userId']) && !empty($_GET['token'])  && !empty($_GET['horaireId'])){
		echo ApiBddService::getDetailHoraire(urldecode($_GET['userId']), urldecode($_GET['token']), urldecode($_GET['horaireId']));
			
	} elseif($_GET['type'] == 'getHorairesFuturs'  && !empty($_GET['userId']) && !empty($_GET['token'])){
		echo ApiBddService::getHorairesFuturs(urldecode($_GET['userId']), urldecode($_GET['token']));
	  
	} elseif($_GET['type'] == 'getHorairesAttenteValidation'  && !empty($_GET['userId']) && !empty($_GET['token'])){
		echo ApiBddService::getHorairesAttenteValidation(urldecode($_GET['userId']), urldecode($_GET['token']));
			
	} elseif($_GET['type'] == 'setDemande'  && !empty($_GET['userId']) && !empty($_GET['token']) && !empty($_GET['demId']) && !empty($_GET['dateDebut']) && !empty($_GET['dateFin'])  && isset($_GET['isJourneeComplete'])){
		echo ApiBddService::setDemande(urldecode($_GET['userId']), urldecode($_GET['token']), urldecode($_GET['demId']), urldecode($_GET['dateDebut']) , urldecode($_GET['dateFin']) , urldecode($_GET['isJourneeComplete']), urldecode($_GET['motif']));	
	
	} elseif($_GET['type'] == 'getDemandes'  && !empty($_GET['userId']) && !empty($_GET['token'])){
		echo ApiBddService::getDemandes(urldecode($_GET['userId']), urldecode($_GET['token']));			
	
	} elseif($_GET['type'] == 'modDemande'  && !empty($_GET['userId']) && !empty($_GET['token']) && !empty($_GET['id']) && !empty($_GET['dateDebut']) && !empty($_GET['dateFin']) && isset($_GET['isJourneeComplete'])){
		echo ApiBddService::modDemande(urldecode($_GET['userId']), urldecode($_GET['token']), urldecode($_GET['id']), urldecode($_GET['dateDebut']) , urldecode($_GET['dateFin']) , urldecode($_GET['motif']), urldecode($_GET['isJourneeComplete']));		
	
	}  elseif($_GET['type'] == 'valHoraire'  && !empty($_GET['userId']) && !empty($_GET['token']) && !empty($_GET['hopId'])){
		echo ApiBddService::valHoraire(urldecode($_GET['userId']), urldecode($_GET['token']), urldecode($_GET['hopId']), urldecode($_GET['dateTimeDebut']), urldecode($_GET['dateTimeFin']),urldecode($_GET['traValide']));		
	
	} elseif($_GET['type'] == 'valMensuelle'  && !empty($_GET['userId']) && !empty($_GET['token']) && !empty($_GET['annee']) && !empty($_GET['mois'])){
		 echo ApiBddService::valMensuelle(urldecode($_GET['userId']), urldecode($_GET['token']), urldecode($_GET['annee']), urldecode($_GET['mois']));	
		 	
	}  elseif($_GET['type'] == 'getEtablissement'  && !empty($_GET['userId']) && !empty($_GET['token'])){
		 echo ApiBddService::getEtablissement(urldecode($_GET['userId']), urldecode($_GET['token']));		
	
	} elseif($_GET['type'] == 'dateMaladieAccident'  && !empty($_GET['userId']) && !empty($_GET['token']) && !empty($_GET['dateDebut']) && !empty($_GET['dateFin']) && isset($_GET['isAccident']) && !empty($_GET['horaireId'])){
		 echo ApiBddService::dateMaladieAccident(urldecode($_GET['userId']), urldecode($_GET['token']), urldecode($_GET['dateDebut']),urldecode($_GET['dateFin']),urldecode($_GET['isAccident']), urldecode($_GET['horaireId']));		
	
	}  elseif($_GET['type'] == 'getDemandesParMois'  && !empty($_GET['userId']) && !empty($_GET['token'])){
		 echo ApiBddService::getDemandesAccepteesParMois(urldecode($_GET['userId']), urldecode($_GET['token']),urldecode($_GET['annee']), urldecode($_GET['mois']));		
	
	} elseif($_GET['type'] == 'getMaladiesParMois'  && !empty($_GET['userId']) && !empty($_GET['token'])){
		 echo ApiBddService::getMaladiesParMois(urldecode($_GET['userId']), urldecode($_GET['token']),urldecode($_GET['annee']), urldecode($_GET['mois']));		
	
	} elseif($_GET['type'] == 'getValVueHor'  && !empty($_GET['userId']) && !empty($_GET['token'])){
		 echo ApiBddService::getValVueHor(urldecode($_GET['userId']), urldecode($_GET['token']));		
	
	} elseif($_GET['type'] == 'getInfosHeuresMois'  && !empty($_GET['userId'])&& !empty($_GET['token'])){
		 echo ApiBddService::getInfosHeuresMois(urldecode($_GET['userId']),urldecode($_GET['token']), urldecode($_GET['mois']), urldecode($_GET['annee']), urldecode($_GET['idEta']));		
	
	} elseif($_GET['type'] == 'getInfosSoldes'  && !empty($_GET['userId']) && !empty($_GET['token'])){
		echo ApiBddService::getInfosSoldes(urldecode($_GET['userId']),urldecode($_GET['token']), urldecode($_GET['dateDebut']), urldecode($_GET['dateFin']));
	
	} elseif($_GET['type'] == 'getIdEtablissement'  && !empty($_GET['userId']) && !empty($_GET['token'])){
		echo ApiBddService::getIdEtablissement(urldecode($_GET['userId']), urldecode($_GET['token']), urldecode($_GET['idDep']));
	
	}elseif($_GET['type'] == 'getTypeHoraireContrat'  && !empty($_GET['userId']) && !empty($_GET['token'])){
		echo ApiBddService::getTypeHoraireContrat(urldecode($_GET['userId']), urldecode($_GET['token']));
	
	}elseif($_GET['type'] == 'getIdDepartement'  && !empty($_GET['userId']) && !empty($_GET['token'])){
		echo ApiBddService::getIdDepartement(urldecode($_GET['userId']), urldecode($_GET['token']));
	
	} elseif($_GET['type'] == 'calculerSoldeEmployee'  && !empty($_GET['userId']) && !empty($_GET['token'])){
		echo ApiBddService::calculerSoldeEmployee(urldecode($_GET['userId']), urldecode($_GET['token']),urldecode($_GET['mois']), urldecode($_GET['annee']), urldecode($_GET['idDep']));
	}
  
} 
?>