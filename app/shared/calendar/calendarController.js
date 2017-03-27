(function(){

var appCal = angular.module('ctrlCCNT');

appCal.config(['calendarConfig', function(calendarConfig) {
  	calendarConfig.dateFormatter = 'angular'; // Utiliser par défaut 'Angular' pour le format des dates
}]);

/* 
* Contrôleur de l'application - calendarController
* Paramètres : $scope, moment (pour les dates), alert (pour les fenêres modales), calendarConfig (Objet du calendrier), $http (Requêtes HTTP)
* Gère le calendrier
*/
appCal.controller('calendarController', function($timeout, $mdDialog,SessionService, $scope, moment, alert, calendarConfig, $http, NotifService, DateFactory) {

	var vm = this; // Je prend la référence de moi-même et je la stocke
	/*****************************************************************************/
	/* Ces variables doivent être défini sinon le calendrier ne fonctionnera pas */

	vm.viewDate = new Date(); // Défini la date d'aujourd'hui
	vm.calendarView = 'month'; // Vue par défaut : 'Mois'
	vm.cellIsOpen = true; // La cellule d'aujourd'hui est ouverte
	vm.events = []; // Liste des évennements (Horaires des personnes)

	var getInfoEvent = function (nomPrenom) {
	  var person = null;
	  for (var i = 0; i < $scope.persons.length; i++) {
		var nom = $scope.persons[i].nom + " " + $scope.persons[i].prenom;
		if (nom == nomPrenom) {
		  person = $scope.persons[i];
		}
	  }
	  return person;
	}
	
	
	
 	$scope.departments = [];
  	$scope.departmentsSel = [];
  	$scope.deps = [ // Stocke les codes couleurs nécessaires pour les départements
		  {}, // Premier objet vide
		  {primary: '#00695c', secondary: '#93C8C2'}, 
		  {primary: '#388e3c', secondary: '#81D285'},
		  {primary: '#039be5', secondary: '#8AC6E4'},
		  {primary: '#f57c00', secondary: '#F4BF8A'},
		  {primary: '#6d4c41', secondary: '#6d4c41'},
		  {primary: '#512da8', secondary: '#512da8'},
		  {primary: '#33691E', secondary: '#33691E'}, 
		  {primary: '#212121', secondary: '#212121'},
		  {primary: '#2c3e50', secondary: '#2c3e50'}
  	];
  	
  	/*$scope.absences = [
  		{name: 'Maladie'},
  		{name: 'Congé'}, 
  		{name: 'Vacance'}, 
  		{name: 'Militaire'}, 
  		{name: 'Formation'}, 
  		{name: 'Maternité'}, 
  		{name: 'Décès'}, 
  		{name: 'Déménagement'},
  	];*/

  	$scope.absences = [];
  	
  	$scope.persons = [];
  	$scope.myPerson = null;
  	$scope.depSel = "";
  	$scope.styleDep = {'color': 'black'};

  	$scope.personsDeps = [];
  	$scope.personsSel = [];
  	$scope.absencesSel = [];

	$scope.pauseService1 = $scope.nbPause[0];
	$scope.pauseService2 = $scope.nbPause[0];
	
  	var actions = [{
	  	label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
	  	onClick: function(args) {
		  	alert.show(args);
	  	}
  	}, {
	 	label: '<i class=\'glyphicon glyphicon-remove\'></i>',
	  	onClick: function(args, event) {
		  //alert.show('Deleted', args.calendarEvent);
		  	var person = getInfoEvent(args.calendarEvent.title);
		  	var objDate = args.calendarEvent;
		  	var heureDebut = getTimeDate(objDate.startsAt);
		  	var heureFin = getTimeDate(objDate.endsAt);
		  	var dateDebut = DateFactory.getDateBDD(objDate.startsAt);

		  	UIkit.modal.confirm('Voulez vous vraiment supprimer cet horaire de ' + person.nom, {center: true}).then(function() {
		    	var $req = $http.post("assets/php/supHoraireEmployeeAPI.php", {user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token'), 'per_id': person.id, 'hor_id': objDate.id});
		  		$req.then(function (message) {
		  			console.log(message);
				  	if (message.data != null) {
				  		vm.events.splice(args.calendarEvent.calendarEventId, 1);
						NotifService.success('Suppression Horaire', "L'horaire : " + dateDebut + " de l'employé : " + person.nom + " " + person.prenom + " a été supprimé avec succès");
				  	} else {
						NotifService.success('Suppression Horaire', "L'horaire n'a pas pu être supprimé");
				  	}
		  		}); 
			}, function () {return;});
	  	}     
  	}];
	  
	$scope.event = {
	  	title: '',
	  	startsAt: moment().startOf('day').toDate(),
	  	endsAt: moment().endOf('day').toDate(),
		color: calendarConfig.colorTypes.important,
		draggable: true,
		type: 'info',
	  	resizable: true,
	  	actions : actions,
	  	cssClass: 'custom-event'
  	};

	var reinitEvent = function () {
	  	$scope.event = { // Réinitialiser l'objet
	  		title: '',
		  	startsAt: moment().startOf('day').toDate(),
		  	endsAt: moment().endOf('day').toDate(),
		  	color: calendarConfig.colorTypes.important,
		  	draggable: true,
		  	resizable: true,
		  	actions : actions,
		  	cssClass: 'custom-event'
		};
	  	$scope.myPerson = null;
	  	$scope.depSel = "";
	  	$scope.styleDep = {'color': 'black'};
	}

	var searchDepID = function (idDep) {
	  	var pos = -1;
	  	for (var i = 0; i < $scope.departmentsSel.length; i++) {
			if ($scope.departmentsSel[i].id == idDep) {
		  		pos = i;
			}
	  	}
	  	return pos;
	}

	var searchDepNom = function (nom) {
	  	var pos = -1;
	  	for (var i = 0; i < $scope.departmentsSel.length; i++) {
			if ($scope.departmentsSel[i].name == nom) {
		  		pos = i;
			}
	  	}
	  	return pos;
	}

	var searchPersonID = function (idP) {
	  	var pos = -1;
	  	for (var i = 0; i < $scope.personsSel.length; i++) {
			if ($scope.personsSel[i].id == idP) {
			  	pos = i;
			}
	 	}
	  	return pos;
	}
/*
	var virerEmployeDep = function (item) {
	  	for (var i = $scope.personsDeps.length - 1; i >= 0; i--) {
			if ($scope.personsDeps[i].dep.id == item.id) {
		  		$scope.personsDeps.splice(i, 1);
			}
	  	}
	}
*/
	var virerEmployeDep = function (dep) {
	  	for (var i = $scope.personsDeps.length - 1; i >= 0; i--) {
			if ($scope.personsDeps[i].dep.id == dep.id) {
			  	var pos = searchPersonID($scope.personsDeps[i].id);
			  	if (pos != -1) {
					$scope.personsSel.splice(pos, 1);
			  	}
			  	$scope.personsDeps.splice(i, 1);
			}
	  	}
	}

	var ajouterEmployeDep = function (dep) {
	  	for (var i = 0; i < $scope.persons.length; i++) {
			if ($scope.persons[i].dep.id == dep.id) {
			  	$scope.personsDeps.push($scope.persons[i]);
			  	$scope.personsSel.push($scope.persons[i]);
			}
	  	}
	}

	$scope.majAffDep = function(dep) {
	  	var pos = searchDepID(dep.id);

	  	if (pos != -1) {
			$scope.departmentsSel.splice(pos, 1);
			virerEmployeDep(dep);
	  	} else {
			$scope.departmentsSel.push(dep);
			ajouterEmployeDep(dep);
	  	}

	  	vm.events.splice(0, vm.events.length); // Supprimer l'affichage
	  	var $req = $http.post("assets/php/getPersonnesFiltreDepAPI.php", {user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token'), 'deps' : $scope.departmentsSel});
	  	$req.then(function (message) {
	  		
			var tabPerson = message.data;
			if (message.data.length > 0) { // Si il y a des données
			  	for (var i = 0; i < tabPerson.length; i++) {
					getHoraires(tabPerson[i]);
			  	}
			}
	  	});
	}
	
	$scope.majAffDep = function(dep) {
	  	var pos = searchDepID(dep.id);

	  	if (pos != -1) {
			$scope.departmentsSel.splice(pos, 1);
			virerEmployeDep(dep);
	  	} else {
			$scope.departmentsSel.push(dep);
			ajouterEmployeDep(dep);
	  	}

	  	vm.events.splice(0, vm.events.length); // Supprimer l'affichage
	}
	

	$scope.majAffPers = function (person) {
	  	var pos = searchPersonID(person.id);
	  	if (pos != -1) {
			$scope.personsSel.splice(pos, 1);
	  	} else {
			$scope.personsSel.push(person);
	  	}
	  	vm.events.splice(0, vm.events.length); // Supprimer l'affichage
	  	var $req = $http.post("assets/php/getPersonnesFiltreEmpAPI.php", {user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token'), 'deps' : $scope.departmentsSel, 'emps' : $scope.personsSel});
	  	$req.then(function (message) {
			var tabPerson = message.data;
			
			if (message.data.length > 0) { // Si il y a des données
			  	for (var i = 0; i < tabPerson.length; i++) {
					getHoraires(tabPerson[i]);
			  	}
			}
	  	});
	}

	var getDeps = function () {
	  	var $req = $http.post("assets/php/getDepartementsAPI.php",{user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token')});
	  	$req.then(function (message) {
	  		//console.log(message);
	  		console.log(message);
			$scope.departments = message.data;
			$scope.departmentsSel = angular.copy($scope.departments);
	  	});
	}
	
	getDeps();
	
	var getTime = function (time) {
	  	var objTime = time.split(':');
	  	return {'heures' : objTime[0], 'minutes' : objTime[1], 'secondes' : objTime[2]};
	}

	var getTimeDate = function (date) {
	  	return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
	}

	var rechercherPersonne = function (id) {
	  	for (var i = 0; i < $scope.persons.length; i++) {
			if ($scope.persons[i].id == id) {
		  		return $scope.persons[i];
			}
	  	}
	  	return null;
	}
	
	var getPersonWithName = function (name) {
	  	for (var i = 0; i < $scope.persons.length; i++) {
			if (($scope.persons[i].nom + " " + $scope.persons[i].prenom) == name) {
		  		return $scope.persons[i];
			}
	  	}
	  	return null;
	}


	/* Récupère l'objet couleur selon l'id du départements */
	$scope.getColor = function (id) {
	  	return $scope.deps[id];
	};

	var getDateFin = function (heureDebut, heureFin, date) {
	  	var dateFin;
	  	if (heureDebut > heureFin) {
			dateFin = moment(new Date(date)).subtract(1, 'hours').add(1, 'day'); // On enleve une heure, car GMT+1
	  	} else {
			dateFin = moment(new Date(date)).subtract(1, 'hours');
	  	}
	  	return dateFin;
	}

	var getHoraires = function (personne) {
	  	var $req = $http.post("assets/php/getHorairesEmployeeAPI.php", {user_id : SessionService.get('user_id'), user_token: SessionService.get('user_token'), per_id: personne.id});
	  	$req.then(function (message) {
	  		console.log(message);
			tabHoraires = message.data;
			
			if (tabHoraires != 'false' || tabHoraires.length > 0 || angular.isUndefined(tabHoraires)) { // Si l'employé n'a pas d'horaires n'ajoute rien au calendrier
			 	 for (var i = 0; i < tabHoraires.length; i++) {
			 	 	
			 	 	
					var hor = tabHoraires[i];
					var heureDebut = getTime(hor.heureDebut);
					var heureFin = getTime(hor.heureFin);
					var dateDebut = moment(new Date(hor.date)).subtract(2, 'hours'); // On enleve une heure, car GMT+1
					var dateFin = getDateFin(hor.heureDebut, hor.heureFin, hor.date);
					var absence = hor.absence;
					var horaire = {
						id: hor.id,
						absence: (absence.id == null) ? {absence : false} : {absence : true, objet: absence},
						pause: hor.pause,
						personne: personne,
					  	title: personne.nom + " " + personne.prenom,
					  	color: (absence.id == null) ? $scope.getColor(personne.dep.img) : $scope.getColor(9),
					  	startsAt: dateDebut.add(heureDebut.heures, 'hours').add(heureDebut.minutes, 'minutes').add(heureDebut.secondes, 'seconds').toDate(),
					  	endsAt: dateFin.add(heureFin.heures - 1, 'hours').add(heureFin.minutes, 'minutes').add(heureFin.secondes, 'seconds').toDate(),
					  	draggable: true,
					  	resizable: true,
					  	actions: actions,
					  	cssClass: 'custom-event'
					};
					vm.events.push(horaire);
			  	}
			}
	  	});
	}

	$scope.addHoraire = function () {
	  	if ($scope.event.title != "") {
	  		var horaireDeuxJours = false;
	  		var dateFin;
	  		if(angular.isDate($scope.heureDebut1) && angular.isDate($scope.heureFin1)){
	  			var dateDebut = $scope.event.startsAt;
	  			var heureDebutS1 = $scope.heureDebut1.getHours()+":"+$scope.heureDebut1.getMinutes()+":00";
	  			var heureFinS1 = $scope.heureFin1.getHours()+":"+$scope.heureFin1.getMinutes()+":00";
	  			
	  			/*if($scope.heureFin2.getDay() != $scope.heureDebut2.getDay()){
	  				horaireDeuxJours = true;
	  				var heureInterFinS2 = "23:59:59";
	  				var heureInterDebutS2 = "00:00:00";
	  				var dateFin = moment(dateDebut).add(1, 'days').toDate();
	  			}*/
	  			var pos = searchDepNom($scope.depSel);
				if (pos != -1) {vm.events.push($scope.event);}
				var absenceMotif = null;
				if(motifAfficher == true){
					absenceMotif = $scope.motif.id;
					console.log(absenceMotif);
				}
				// Insérer l'horaire' pour le premier service
				var $res = $http.post("assets/php/insertHoraireEmployeeAPI.php", {user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token'), 'per_id': $scope.myPerson, 'date': DateFactory.getDateBDD(dateDebut), 'heureDebut': heureDebutS1, 'heureFin': heureFinS1,'pause':$scope.pauseService1.value, 'absid':absenceMotif}); // Envoie de la requête en 'POST'
				$res.then(function (message) {
					
					console.log(message);
					if (message.data == false) {
						NotifService.error('Conflit Horaire', "L'horaire que vous essayé de configuré entre en conflit avec un autre horaire");
						return;
					}
					// Création de l'objet event pour l'insérer visuellement
					
					var dateDebutS1 = angular.copy(dateDebut);
					var dateDebutS1F = moment(angular.copy(dateDebutS1)).add($scope.heureDebut1.getHours() , 'hours').add($scope.heureDebut1.getMinutes(), 'minutes').toDate();
					var dateFinS1 = moment(angular.copy(dateDebutS1)).add($scope.heureFin1.getHours() , 'hours').add($scope.heureFin1.getMinutes(), 'minutes').toDate();
					if (dateDebutS1F > dateFinS1) {
						dateFinS1 = moment(dateFinS1).add(1 , 'days').toDate();
					}
					$scope.event.startsAt = dateDebutS1F;
					$scope.event.endsAt = dateFinS1;
					var pos = searchDepNom($scope.depSel);
					if (pos != -1) {vm.events.push($scope.event);} else {
						NotifService.error('Problème Insertion', "Une erreur est survenue veuillez raffraîchir votre page afin de corriger ce problème !");
						return;
					}
					NotifService.success('Ajout Horaire', "L'horaire pour l'employé : " + $scope.event.title + " a été ajouté avec succès");
					reinitEvent();
				});
				//si le service est sur 2 jours 
				/*if(horaireDeuxJours){
					var $res = $http.post("assets/php/insertHoraireEmployeeAPI.php", {user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token'), 'per_id': $scope.myPerson, 'date': DateFactory.getDateBDD(dateDebut), 'heureDebut': heureDebutS2, 'heureFin': heureInterFinS2,'pause':0}); // Envoie de la requête en 'POST'
					$res.then(function (message) {});
					var $res = $http.post("assets/php/insertHoraireEmployeeAPI.php", {user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token'), 'per_id': $scope.myPerson, 'date': DateFactory.getDateBDD(dateFin), 'heureDebut': heureInterDebutS2, 'heureFin': heureFinS2,'pause':0}); // Envoie de la requête en 'POST'
					$res.then(function (message) {});
				}else{*/
					var $res = $http.post("assets/php/insertHoraireEmployeeAPI.php", {user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token'), 'per_id': $scope.myPerson, 'date': DateFactory.getDateBDD(dateDebut), 'heureDebut': heureDebutS2, 'heureFin': heureFinS2,'pause':$scope.pauseService2.value, 'absid':absenceMotif}); // Envoie de la requête en 'POST'
					$res.then(function (message) {
					});
					if(angular.isDate($scope.heureDebut2) && angular.isDate($scope.heureFin2)){
						var heureDebutS2 = $scope.heureDebut2.getHours()+":"+$scope.heureDebut2.getMinutes()+":00";
		  				var heureFinS2 = $scope.heureFin2.getHours()+":"+$scope.heureFin2.getMinutes()+":00";
						var pos = searchDepNom($scope.depSel);
						if (pos != -1) {vm.events.push($scope.event);}
						var $res = $http.post("assets/php/insertHoraireEmployeeAPI.php", {user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token'), 'per_id': $scope.myPerson, 'date': DateFactory.getDateBDD(dateDebut), 'heureDebut': heureDebutS2, 'heureFin': heureFinS2,'pause':$scope.pauseService2.value}); // Envoie de la requête en 'POST'
						$res.then(function (message) {
							if (message.data == false) {
								NotifService.error('Conflit Horaire', "L'horaire que vous essayé de configuré entre en conflit avec un autre horaire");
								return;
							}
							var dateDebutS2 = angular.copy(dateDebut);
							var dateDebutS2F = moment(angular.copy(dateDebutS2)).add($scope.heureDebut2.getHours() , 'hours').add($scope.heureDebut2.getMinutes(), 'minutes').toDate();
							var dateFinS1 = moment(angular.copy(dateDebutS2)).add($scope.heureFin2.getHours() , 'hours').add($scope.heureFin2.getMinutes(), 'minutes').toDate();
							if (dateDebutS2F > dateFinS2) {
								dateFinS2 = moment(dateFinS3).add(1 , 'days').toDate();
							}
							$scope.event.startsAt = dateDebutS2F;
							$scope.event.endsAt = dateFinS2;
							var pos = searchDepNom($scope.depSel);
							if (pos != -1) {vm.events.push($scope.event);} else {
								NotifService.error('Problème Insertion', "Une erreur est survenue veuillez raffraîchir votre page afin de corriger ce problème !");
								return;
							}
							NotifService.success('Ajout Horaire', "L'horaire pour l'employé : " + $scope.event.title + " a été ajouté avec succès");
							reinitEvent();
						});
					}
				/*};*/
				
	  		}else{
	  			var message = "Les heures ne sont pas correcte !";
   				var titre = "Erreur de configuration";
   				NotifService.error(titre, message);
	  		}
	  		

			/*var dateDebut = $scope.event.startsAt;
			var heureDebut = $scope.heureDebut1.getHours()+":"+$scope.heureDebut1.getMinutes()+":00";
			var heureFin = getTimeDate($scope.event.endsAt);
			
			moment(dateFin).subtract(1, 'hours');
			if (heureDebut > heureFin) {
			  	//console.log(dateDebut.getFullYear() + "-" + dateDebut.getMonth() + "-" + dateDebut.getDay());
			  	dateFin = moment(dateFin).add(1, 'days').toDate();
			}
			var objHeureFin = getTime(heureFin);
			dateFin = moment(dateFin).add(objHeureFin.heures, 'hours').add(objHeureFin.minutes, 'minutes').add(objHeureFin.secondes, 'seconds').toDate();
			$scope.event.endsAt = dateFin;
			
			var pos = searchDepNom($scope.depSel);
			if (pos != -1) {vm.events.push($scope.event);}

			// Insérer l'horaire' 
			var $res = $http.post("assets/php/insertHoraireEmployeeAPI.php", {user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token'), 'per_id': $scope.myPerson, 'date': DateFactory.getDateBDD(dateDebut), 'heureDebut': heureDebut, 'heureFin': heureFin}); // Envoie de la requête en 'POST'
			$res.then(function (message) {
			});

			NotifService.success('Ajout Horaire', "L'horaire pour l'employé : " + $scope.event.title + " a été ajouté avec succès");
			reinitEvent();*/
	  	}
	}

	/* Récupère les personnes avec leurs horaires et initialise le calendrier */
	$scope.getPersons = function () {
	  	var $res = $http.post("assets/php/getEmployeesAPI.php", {user_id : SessionService.get('user_id'), user_token: SessionService.get('user_token')}); // Envoie de la requête en 'POST'
	  	$res.then(function (message) { // Réponse de la promesse
			var tabPerson = message.data; // Stocke le tableau d'objet
			if (tabPerson.length > 0) { // Si il y a des données
			  	for (var i = 0; i < tabPerson.length; i++) {
					$scope.persons.push(tabPerson[i]);
					$scope.personsDeps.push(tabPerson[i]);
					$scope.personsSel.push(tabPerson[i]);
					getHoraires(tabPerson[i]);
			  	}
			}
	  	});
	} // Fin getPerson()

	$scope.getPersons(); // Initialiser le calendrier avec les données des horaires
	
	$scope.getAbsences = function(){
		var $res = $http.post("assets/php/getAbsenceAPI.php", {user_id : SessionService.get('user_id'), user_token: SessionService.get('user_token')}); // Envoie de la requête en 'POST'
		$res.then(function (message){
			var abs = message.data;
			if(abs.length > 0){
				for (var i = 0; i < abs.length; i++) {
					$scope.absences.push(abs[i]);
				};
				$scope.absences1 = angular.copy($scope.absences);
				$scope.motif = angular.copy($scope.absences1[0]);
			}
		});
	};

	$scope.getAbsences();
	

	vm.addEvent = function() {
	  vm.events.push({
		title: '',
		startsAt: moment().startOf('day').toDate(),
		endsAt: moment().endOf('day').toDate(),
		color: calendarConfig.colorTypes.important,
		draggable: true,
		resizable: true,
		actions : actions,
	  });
	};
	/*****************************************************************************************\
			* Gestion de la modale afficher informations de l'horaire *                        
	\*****************************************************************************************/
	vm.eventClicked = function(event) {
		vm.eventCurrent = event;
		$mdDialog.show({
	      controller: DialogController,
	      templateUrl: 'app/shared/calendar/modalInfoPlanning.html',
	      parent: angular.element(document.body.parentElement),
	      targetEvent: event,
	      clickOutsideToClose:true,
	      fullscreen: true,
	    })
	    .then(function(answer) {
	      $scope.status = 'You said the information was "' + answer + '".';
	    }, function() {
	      $scope.status = 'You cancelled the dialog.';
	    });
	};
	function DialogController($scope, $mdDialog) {
		$scope.event = angular.copy(vm.eventCurrent);
		$scope.events = [];
		$scope.events.push($scope.event);
		$scope.calendarView = 'day';
		$scope.isTwoDays = ($scope.event.endsAt.getDate() > $scope.event.startsAt.getDate()) ? true : false;
		
		$scope.hide = function() {
      		$mdDialog.hide();
    	};

	    $scope.cancel = function() {
	      	$mdDialog.cancel();
	    };

	    $scope.answer = function(answer) {
	      	$mdDialog.hide(answer);
	    };
	   
  	}
  	
  	/*****************************************************************************************\
  			* Gestion de la modale ajouter horaire *                        
  	\*****************************************************************************************/
 	$scope.showAddHoraire = function () {
		vm.styleDep = $scope.styleDep;
		vm.myPerson = $scope.myPerson;
		vm.persons = $scope.persons;
		vm.deps = $scope.deps;
		vm.event = $scope.event;
		vm.departmentsSel = $scope.departmentsSel;
		vm.absences1 = $scope.absences1;
		vm.motif = $scope.motif;
		vm.nbPause = $scope.nbPause;
		vm.pauseService1 = $scope.pauseService1;
		vm.pauseService2 = $scope.pauseService2;
		$mdDialog.show({
	      controller: CreatePlanningController,
	      templateUrl: 'app/shared/calendar/modalPlanning.html',
	      parent: angular.element(document.body),
	      targetEvent: event,
	      clickOutsideToClose:true,
	      fullscreen: true,
	    })
	    .then(function(answer) {
	      $scope.status = 'You said the information was "' + answer + '".';
	    }, function() {
	      $scope.status = 'You cancelled the dialog.';
	    });
	}
	
	function CreatePlanningController($scope, $mdDialog, $mdpTimePicker) {
		$scope.styleDep = {'background-color': 'white'};
		$scope.depSel = "";
		$scope.imgDep = {'background-color': 'white'};
		$scope.person = null;
		$scope.heureDebut1 = 'Heure début';
	    $scope.heureFin1 = 'Heure fin';
	    $scope.heureDebut2 = 'Heure début';
	    $scope.heureFin2 = 'Heure fin';
	    $scope.motifAfficher = false
	    $scope.absent1 = false;
	    $scope.absent2 = false;
		$scope.myPerson = angular.copy(vm.myPerson);
		$scope.persons = angular.copy(vm.persons);
		$scope.departmentsSel = angular.copy(vm.departmentsSel);
		
		$scope.deps = angular.copy(vm.deps);
		$scope.event = angular.copy(vm.event);
	    $scope.absences1 = angular.copy(vm.absences1);

		$scope.nbPause = [];
		$scope.nbPause2= [];
	    $scope.motif = $scope.absences1[0];
	    
	    for (var nb = 0; nb <= 60; nb+=5) {
			$scope.nbPause.push({name: nb + ' minutes', value:nb});
			$scope.nbPause2.push({name: nb + ' minutes', value:nb});
		}
	    
	    $scope.pauseService1 = $scope.nbPause[0];
	    $scope.pauseService2 = $scope.nbPause2[0];

		var rechercherPersonne = function (id) {
		  	for (var i = 0; i < $scope.persons.length; i++) {
				if ($scope.persons[i].id == id) {
			  		return $scope.persons[i];
				}
		  	}
		  	return null;
		}
		
		$scope.showHeureDebutSer1 = function(ev, index) {
		 	$mdpTimePicker($scope.heureDebut1, {
		 		targetEvent: ev,
		 		parent: angular.element(document.body.parentElement)
		 	}).then(function(selectedDate) {
		 		if(selectedDate > $scope.heureFin1){
		 			var message = "L'heure d'ouverture est après celle de fermeture !";
	   				var titre = "Erreur de configuration";
	   				NotifService.error(titre, message);
		 		}else{
					$scope.heureDebut1 = selectedDate;
		 		};
		 	});
		};
		
		$scope.getPauseById = function (id) {
			console.log(id);
			for (var i = 0; i < $scope.nbPause.length; i++) {
				if (nb + ' minutes' == id) {
					return $scope.nbPause[i];
				}
			}
			return null;
		}
		
		$scope.changePause1 = function () {
			var res = $scope.getPauseById($('#selPause1').val());
			console.log(res);
			if (res != null) {
				$scope.pauseService1 = res;
			}
			console.log($scope.pauseService1);
		}
		
		$scope.changePause2 = function () {
			console.log($('#selPause2').val());
			var res = $scope.getPauseById();
			if (res != null) {
				$scope.pauseService2 = res;
			}
			console.log($scope.pauseService2);
		}
		
		$scope.showHeureFinSer1 = function(ev, index) {
			
		 	$mdpTimePicker($scope.heureFin1, {
		 		targetEvent: ev,
		 		parent: angular.element(document.body.parentElement)
		 	}).then(function(selectedDate) {
		 		if(selectedDate < $scope.heureDebut1){
		 			var message = "L'heure de fermeture est avant celle d'ouverture !";
	   				var titre = "Erreur de configuration";
	   				NotifService.error(titre, message);
		 		}else if(selectedDate > $scope.heureDebut2){
		 			var message = "L'heure de fin de ce service est après la début du service suivant !";
	   				var titre = "Erreur de configuration";
	   				NotifService.error(titre, message);
		 		}else{
					$scope.heureFin1 = selectedDate;
		 		};
		 	});
		};
		$scope.showHeureDebutSer2 = function(ev, index) {
		 	$mdpTimePicker($scope.heureDebut2, {
		 		targetEvent: ev,
		 		parent: angular.element(document.body.parentElement)
		 	}).then(function(selectedDate) {
		 		if(selectedDate > $scope.heureFin2){
		 			var message = "L'heure d'ouverture est après celle de fermeture !";
	   				var titre = "Erreur de configuration";
	   				NotifService.error(titre, message);
		 		}else if(selectedDate < $scope.heureFin1){
		 			var message = "L'heure de début est avant la fermeture du service précédent !";
	   				var titre = "Erreur de configuration";
	   				NotifService.error(titre, message);
		 		}else{
					$scope.heureDebut2 = selectedDate;
		 		};
		 	});
		};
		$scope.showHeureFinSer2 = function(ev, index) {
		 	$mdpTimePicker($scope.heureFin2, {
		 		targetEvent: ev,
		 		parent: angular.element(document.body.parentElement)
		 	}).then(function(selectedDate) {
		 		if(selectedDate < $scope.heureDebut2){
		 			var message = "L'heure de fermeture est avant celle d'ouverture !";
	   				var titre = "Erreur de configuration";
	   				NotifService.error(titre, message);
		 		}else{
					$scope.heureFin2 = selectedDate;
		 		};
		 		
		 	});
		};
		
		$scope.getColor = function (id) {
	  		return $scope.deps[id];
		}
		
		$scope.majPerson = function () {
			var person = rechercherPersonne($scope.myPerson);
		  	if (person != null) {
				$scope.depSel = person.dep.nom;
				$scope.styleDep = {'background-color' : $scope.getColor(person.dep.img).primary}
				$scope.event.title = person.nom + " " + person.prenom;
				$scope.event.color = $scope.getColor(person.dep.img);
				$scope.person = person;
				$scope.event.person = angular.copy(person);
		  	}
		}
		
		$scope.changeAb1 = function(){
			if($scope.absent1){$scope.absent1 = false;}else{$scope.absent1 = true;}
		};
		$scope.changeAb2 = function(){
			if($scope.absent2){$scope.absent2 = false;}else{$scope.absent2 = true;}
		};
		
		$scope.validationAbsence = function(){
			
			console.log($scope.motif);
			if ($scope.absent1 == true|| $scope.absent2 == true) {
				$scope.motifAfficher = true;
			}else{
				$scope.motifAfficher = false;
			};
			
		};
		
		$scope.getMotifById = function (id) {
			for (var i = 0; i < $scope.absences1.length; i++) {
				if ($scope.absences1[i].id == id) {
					return $scope.absences1[i];
				}
			}
			return null;
		}
		
		$scope.changeMotif = function (index) {
			var res = $scope.getMotifById($('#selMotif').val());
			if (res != null) {
				$scope.motif = res;
			}
		}
		
		$scope.reinitEvent = function () {
		  	$scope.event = { // Réinitialiser l'objet
		  		title: '',
			  	startsAt: moment().startOf('day').toDate(),
			  	endsAt: moment().endOf('day').toDate(),
			  	color: calendarConfig.colorTypes.important,
			  	draggable: true,
			  	resizable: true,
			  	actions : actions,
			  	cssClass: 'custom-event'
			};
		}

		$scope.addHoraire = function (answer) {
		  	if ($scope.event.title != "") {
		  		var horaireDeuxJours = false;
		  		var dateFin;
		  		
		  		/*****************************************************************************************\
		  				* Insertion du premier service  *                        
		  		\*****************************************************************************************/
		  		if(angular.isDate($scope.heureDebut1) && angular.isDate($scope.heureFin1)){
		  			var dateDebut = $scope.event.startsAt;
		  			var heureDebutS1 = $scope.heureDebut1.getHours()+":"+$scope.heureDebut1.getMinutes()+":00";
		  			var heureFinS1 = $scope.heureFin1.getHours()+":"+$scope.heureFin1.getMinutes()+":00";
		  			var absenceMotif = null;
					if($scope.motifAfficher || $scope.absent1){absenceMotif = $scope.motif.id;}


					console.log(absenceMotif);
					var $res = $http.post("assets/php/insertHoraireEmployeeAPI.php", {user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token'), 'per_id': $scope.myPerson, 'date': DateFactory.getDateBDD(dateDebut), 'heureDebut': heureDebutS1, 'heureFin': heureFinS1,'pause':$scope.pauseService1.value, 'absid':absenceMotif}); // Envoie de la requête en 'POST'
					$res.then(function (message) {
						console.log(message);
						if (message.data == false) {
							NotifService.error('Conflit Horaire', "L'horaire que vous essayé de configuré entre en conflit avec un autre horaire");
							return;
						}
						var dateDebutS1 = angular.copy(dateDebut);
						var dateDebutS1F = moment(angular.copy(dateDebutS1)).add($scope.heureDebut1.getHours() , 'hours').add($scope.heureDebut1.getMinutes(), 'minutes').toDate();
						var dateFinS1 = moment(angular.copy(dateDebutS1)).add($scope.heureFin1.getHours() , 'hours').add($scope.heureFin1.getMinutes(), 'minutes').toDate();
						if (dateDebutS1F > dateFinS1) {
							dateFinS1 = moment(dateFinS1).add(1 , 'days').toDate();
						}
						$scope.event.startsAt = dateDebutS1F;
						$scope.event.endsAt = dateFinS1;
						$scope.event.personne = angular.copy($scope.person);
						$scope.event.pause = $scope.pauseService1.value;
						$scope.event.color = $scope.absent1 ? $scope.getColor(9) : $scope.getColor($scope.person.dep.img);
						$scope.event.absence = ($scope.absent1 ? {absence: true, objet: {id: $scope.motif.id, nom: $scope.motif.name}}: {absence: false});
						
						var pos = searchDepNom($scope.depSel);
						if (pos != -1) {vm.events.push($scope.event);} else {
							NotifService.error('Problème Insertion', "Une erreur est survenue veuillez raffraîchir votre page afin de corriger ce problème !");
							return;
						}
						NotifService.success('Ajout Horaire', "L'horaire pour l'employé : " + $scope.event.title + " a été ajouté avec succès");
						
						$scope.reinitEvent();
						/*****************************************************************************************\
								* Insertion du deuxième service *                        
						\*****************************************************************************************/
						if(angular.isDate($scope.heureDebut2) && angular.isDate($scope.heureFin2)){
							var heureDebutS2 = $scope.heureDebut2.getHours()+":"+$scope.heureDebut2.getMinutes()+":00";
			  				var heureFinS2 = $scope.heureFin2.getHours()+":"+$scope.heureFin2.getMinutes()+":00";
							
							var absenceMotif = null;
							if($scope.motifAfficher || $scope.absent2){absenceMotif = $scope.motif.id;}
							
							var $res = $http.post("assets/php/insertHoraireEmployeeAPI.php", {user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token'), 'per_id': $scope.myPerson, 'date': DateFactory.getDateBDD(dateDebut), 'heureDebut': heureDebutS2, 'heureFin': heureFinS2,'pause':$scope.pauseService2.value, 'absid': absenceMotif}); // Envoie de la requête en 'POST'
							$res.then(function (message) {
								
								if (message.data == false) {
									NotifService.error('Conflit Horaire', "L'horaire que vous essayé de configuré entre en conflit avec un autre horaire");
									return;
								}
								var dateDebutS2 = angular.copy(dateDebut);
								var dateDebutS2F = moment(angular.copy(dateDebutS2)).add($scope.heureDebut2.getHours() , 'hours').add($scope.heureDebut2.getMinutes(), 'minutes').toDate();
								var dateFinS2 = moment(angular.copy(dateDebutS2)).add($scope.heureFin2.getHours() , 'hours').add($scope.heureFin2.getMinutes(), 'minutes').toDate();
								
								if (dateDebutS2F > dateFinS2) {
									dateFinS2 = moment(dateFinS2).add(1 , 'days').toDate();
								}
								
								$scope.event.title = $scope.person.nom + " " + $scope.person.prenom;
								$scope.event.startsAt = dateDebutS2F;
								$scope.event.endsAt = dateFinS2;
								$scope.event.personne = $scope.person;
								$scope.event.pause = $scope.pauseService2.value;
								$scope.event.absence =  ($scope.absent2 ? {absence: true, objet: {id: $scope.motif.id, nom: $scope.motif.name}}: {absence: false});
								$scope.event.color = $scope.absent2 ? $scope.getColor(9) : $scope.getColor($scope.person.dep.img);
								
								vm.events.push($scope.event);
								var pos = searchDepNom($scope.depSel);
								if (pos != -1) {} else {
									NotifService.error('Problème Insertion', "Une erreur est survenue veuillez raffraîchir votre page afin de corriger ce problème !");
									return;
								}
								NotifService.success('Ajout Horaire', "L'horaire pour l'employé : " + $scope.event.title + " a été ajouté avec succès");
							});
						}
						$mdDialog.hide(answer);
					});
					
		  		}else{
		  			var message = "Les heures ne sont pas correcte !";
	   				var titre = "Erreur de configuration";
	   				NotifService.error(titre, message);
		  		}
		  	}
		}
		
		$scope.hide = function() {
      		$mdDialog.hide();
    	};

	    $scope.cancel = function() {
	      	$mdDialog.cancel();
	    };

	    $scope.answer = function(answer) {
	    	$scope.addHoraire(answer);
	    	
	      	//$mdDialog.hide(answer);
	    };
	}
	/*///////////////////////////////////////////////////////////////////////////////////////*/
	
	vm.eventEdited = function(event) {
		
	  	
	};

	vm.eventDeleted = function(event) {
	  /*alert.show('Deleted', event);
	  console.log(event); */
	};

	vm.eventTimesChanged = function(event) {
	  	alert.show('Dropped or resized', event);
	};

	vm.toggle = function($event, field, event) {
	  	$event.preventDefault();
	  	$event.stopPropagation();
	  	event[field] = !event[field];
	};

	vm.modifyCell = function (calendarCell) {

	}
	
	/*
	vm.groupEvents = function(cell) {
	      	cell.groups = {};
	      	cell.events.forEach(function(event) {
	      		console.log(event);
		       	cell.groups[event.type] = cell.groups[event.type] || [];
		        	cell.groups[event.type].push(event);
      		});
    	};*/

	vm.timespanClicked = function(date, cell) {
	  	if (vm.calendarView === 'month') {
			if ((vm.cellIsOpen && moment(date).startOf('day').isSame(moment(vm.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
			  vm.cellIsOpen = false;
			} else {
			  vm.cellIsOpen = true;
			  vm.viewDate = date;
			}
	  	} else if (vm.calendarView === 'year') {
			if ((vm.cellIsOpen && moment(date).startOf('month').isSame(moment(vm.viewDate).startOf('month'))) || cell.events.length === 0) {
			  vm.cellIsOpen = false;
			} else {
			  vm.cellIsOpen = true;
			  vm.viewDate = date;
			}
	  	}
	};

	$scope.validationAbsence = function(){
		if ($scope.absent1 == true || $scope.absent2 == true) {
			$scope.motifAfficher = true;
		}else{
			$scope.motifAfficher = false;
		};
	};
  });

})();