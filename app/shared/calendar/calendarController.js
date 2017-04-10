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
appCal.controller('calendarController', function($timeout, $mdDialog, SessionService, $scope, moment, alert, calendarConfig, $http, NotifService, DateFactory) {

	var vm = this; // Je prend la référence de moi-même et je la stocke
	
	vm.isOpen = false;
  	vm.selectedMode = 'md-scale';
  		
  	if (window.innerWidth >= 443) {
  		vm.selectedDirection = 'left';
  		vm.dir1 = 'top';
  		vm.dir2 = 'bottom';
  		vm.dir3 = 'left';
  	} else {
  		vm.selectedDirection = 'down';
  		vm.dir1 = 'left';
  		vm.dir2 = 'left';
  		vm.dir3 = 'left';
  	}  	
  	
  	$scope.tooltipVisible = false;
  	
  	$scope.$watch('vm.isOpen', function(isOpen) {
        if (vm.isOpen) {
	      	$timeout(function() {
	        	$scope.tooltipVisible = true;
	      	}, 400);
	    } else {
	    	$timeout(function() {
	        	$scope.tooltipVisible = false;
	      	}, 0);
	    }
  	});
  	
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
		  {primary: '#00695c', secondary: '#93C8C2', font: '#222'}, 
		  {primary: '#388e3c', secondary: '#81D285', font: '#222'},
		  {primary: '#039be5', secondary: '#8AC6E4', font: '#222'},
		  {primary: '#f57c00', secondary: '#F4BF8A', font: '#222'},
		  {primary: '#6d4c41', secondary: '#6d4c41', font: '#222'},
		  {primary: '#512da8', secondary: '#512da8', font: '#222'},
		  {primary: '#33691E', secondary: '#33691E', font: '#222'}, 
		  {primary: '#212121', secondary: '#212121', font: '#222'},
		  {primary: '#2c3e50', secondary: '#2c3e50', font: '#fff'}
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
	
	var isFiltered = function (personne) {
		for (var i = 0; i < $scope.personsSel.length; i++) {
			if ($scope.personsSel[i].id == personne.id) {return true}
		}
		return false;
	}
	
  	var actions = [{
	  	label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
	  	onClick: function(args) {
	  		vm.modif = true;
			vm.event = args.calendarEvent;
			vm.styleDep = $scope.styleDep;
			vm.persons = $scope.persons;
			vm.myPerson = angular.copy(vm.event.personne);
			vm.deps = $scope.deps;
			vm.departmentsSel = $scope.departmentsSel;
			vm.absences1 = $scope.absences1;
			vm.motif = $scope.motif;
			vm.nbPause = $scope.nbPause;
			vm.pauseService1 = $scope.pauseService1;
			vm.pauseService2 = $scope.pauseService2;
			vm.personsSel = $scope.personsSel;
		  	$mdDialog.show({
			      controller: CreatePlanningController,
			      templateUrl: 'app/shared/calendar/modalModifPlanning.html',
			      parent: angular.element(document.body),
			      targetEvent: event,
			      clickOutsideToClose:true,
			      fullscreen: true,
		    })
		    .then(function(answer) {
		    	vm.events.splice(answer.calendarEventId, 1);
		    	
		    	$timeout(function() {
		    		var obj = {
		    			id: answer.id,
						absence: answer.absence,
						pause: answer.pause,
						personne: answer.personne,
					  	title: answer.title,
					  	color: answer.color,
					  	startsAt: answer.startsAt,
					  	endsAt: answer.endsAt,
					  	draggable: true,
					  	resizable: true,
					  	actions: actions,
					  	cssClass: 'custom-event'
		    		};
			      	if (isFiltered(answer.personne)) {vm.events.push(obj)};
		      	}, 10);
		    }, function() {/* Annulation */});
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

	var searchAbsenceID = function (idA) {
	  	var pos = -1;
	  	for (var i = 0; i < $scope.absencesSel.length; i++) {
			if ($scope.absencesSel[i].id == idA) {
			  	pos = i;
			}
	 	}
	  	return pos;
	}
	
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


	$scope.majAffAbs = function (absence) {
	  	var pos = searchAbsenceID(absence.id);
	  	if (pos != -1) {
			$scope.absencesSel.splice(pos, 1);
	  	} else {
			$scope.absencesSel.push(absence);
	  	}

	  	vm.events.splice(0, vm.events.length); // Supprimer l'affichage
	  	var $req = $http.post("assets/php/getPersonnesFiltreEmpAPI.php", {user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token'), 'deps' : $scope.departmentsSel, 'emps' : $scope.personsSel});
	  	$req.then(function (message) {
	  		console.log(message);
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
	  	var $req = $http.post("assets/php/getHorairesEmployeeAPI.php", {user_id : SessionService.get('user_id'), user_token: SessionService.get('user_token'), per_id: personne.id, absences: $scope.absencesSel});
	  	$req.then(function (message) {
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

	/* Récupère les personnes avec leurs horaires et initialise le calendrier */
	$scope.getPersons = function () {
	  	var $res = $http.post("assets/php/getEmployeesAPI.php", {user_id : SessionService.get('user_id'), user_token: SessionService.get('user_token')}); // Envoie de la requête en 'POST'
	  	$res.then(function (message) { // Réponse de la promesse
			var tabPerson = message.data; // Stocke le tableau d'objet
			if (tabPerson.length > 0) { // Si il y a des données
			  	for (var i = 0; i < tabPerson.length; i++) {
			  		tabPerson[i].color = $scope.deps[tabPerson[i].dep.img];
			  		tabPerson[i].initiales = tabPerson[i].nom.charAt(0).toUpperCase() + tabPerson[i].prenom.charAt(0).toUpperCase();
			  		console.log(tabPerson[i]);
			  		tabPerson[i].contrat.particularitestring = (tabPerson[i].contrat.particularite != null) ? (tabPerson[i].contrat.horaire.id == 3 ? tabPerson[i].contrat.particularite + " Heures" : tabPerson[i].contrat.particularite * 100 + " %") : "";
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
			console.log(message);
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

	/*****************************************************************************************\
			* Gestion de la modale afficher informations de l'horaire *                        
	\*****************************************************************************************/
	vm.eventClicked = function(event) {
		vm.eventCurrent = event;
		$mdDialog.show({
	      controller: DialogController,
	      templateUrl: 'app/shared/calendar/modalInfoPlanning.html',
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
	};
	function DialogController($scope, $mdDialog) {
		$scope.event = angular.copy(vm.eventCurrent);
		$scope.events = [];
		$scope.events.push($scope.event);
		$scope.calendarView = 'day';
		$scope.isTwoDays = ($scope.event.endsAt.getDate() > $scope.event.startsAt.getDate()) ? true : false;
		
		$scope.hide = function() {$mdDialog.hide();};
	    $scope.cancel = function() {$mdDialog.cancel();};
	    $scope.answer = function(answer) {$mdDialog.hide(answer);};
  	}
  	
  	/*****************************************************************************************\
  			* Gestion de la modale ajouter horaire *                        
  	\*****************************************************************************************/
 	$scope.showAddHoraire = function () {
 		vm.modif = false;
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
		vm.personsSel = $scope.personsSel;
		$mdDialog.show({
	      	controller: CreatePlanningController,
	      	templateUrl: 'app/shared/calendar/modalPlanning.html',
	      	parent: angular.element(document.body),
	      	targetEvent: event,
	      	clickOutsideToClose:true,
	      	fullscreen: true,
	    })
	    .then(function(answer) {
	    	// Faire quelque chose
	    }, function() {
	    });
	}
	
	function CreatePlanningController($scope, $mdDialog, $mdpTimePicker, $filter, Const) {
		$scope.scope = $scope;
		$scope.modif = vm.modif;
		$scope.event = angular.copy(vm.event);
		$scope.personsSel = vm.personsSel;
		$scope.styleDep = {'background-color': 'white'};
		$scope.depSel = "";
		$scope.imgDep = {'background-color': 'white'};
		$scope.person = null;
		$scope.heureDebut1 = $scope.modif ? $scope.event.startsAt : 'Heure début';
	    $scope.heureFin1 = $scope.modif ? $scope.event.endsAt : 'Heure fin';
	    $scope.heureDebut2 = 'Heure début';
	    $scope.heureFin2 = 'Heure fin';
	    $scope.motifAfficher = $scope.modif ? $scope.event.absence.absence : false;
	    $scope.absent1 = $scope.modif ? $scope.event.absence.absence : false;
	    $scope.absent2 = false;
		$scope.persons = angular.copy(vm.persons);
		if ($scope.modif) {
			$scope.myPerson = vm.myPerson.id.toString();
			$scope.person = vm.myPerson;
		}
		
		$scope.departmentsSel = angular.copy(vm.departmentsSel);
		$scope.deps = angular.copy(vm.deps);
	    
		$scope.nbPause = [];
		$scope.nbPause2= [];
		
		$scope.absences1 = angular.copy(vm.absences1);
	    $scope.motif = $scope.motifAfficher ? $scope.event.absence.objet.id.toString() : $scope.absences1[0].id.toString();
	    
	    for (var nb = 0; nb <= 60; nb+=5) {
			$scope.nbPause.push({name: nb + ' minutes', value:nb});
			$scope.nbPause2.push({name: nb + ' minutes', value:nb});
		}

	   	var getPauseService1 = function () {
	   		for (var i = 0; i < $scope.nbPause.length; i++) {
	   			if ($scope.nbPause[i].value == vm.event.pause) {
	   				return $scope.nbPause[i];
	   			}
	   		}
	   		return $scope.nbPause[0];
	   	}
	   	
	    $scope.pauseService1 = ($scope.modif && $scope.event.pause > 0) ? getPauseService1() : $scope.nbPause.length > 0 ? $scope.nbPause[0] : undefined;
	    $scope.pauseService2 = $scope.nbPause2.length > 0 ? $scope.nbPause2[0] : undefined;
	    
	    $scope.getColor = function (id) {return $scope.deps[id];}
	    
		var rechercherPersonne = function (id) {
		  	for (var i = 0; i < $scope.persons.length; i++) {
				if ($scope.persons[i].id == id) {
			  		return $scope.persons[i];
				}
		  	}
		  	return null;
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
		
		if ($scope.modif) {$scope.majPerson();}
		
		
		$scope.getPauseById = function (id) {
			for (var i = 0; i < $scope.nbPause.length; i++) {
				if (nb + ' minutes' == id) {
					return $scope.nbPause[i];
				}
			}
			return null;
		}
		
		$scope.changeAb1 = function() { if($scope.absent1){$scope.absent1 = false;}else{$scope.absent1 = true;} };
		$scope.changeAb2 = function() { if($scope.absent2){$scope.absent2 = false;}else{$scope.absent2 = true;} };
		
		$scope.validationAbsence = function() { $scope.motifAfficher = ($scope.absent1 == true || $scope.absent2 == true) };
		
		var getMotifById = function (id) {
			for (var i = 0; i < $scope.absences1.length; i++) {
				if ($scope.absences1[i].id == id) {
					return $scope.absences1[i];
				}
			}
			return null;
		}
		
		$scope.changeMotif = function (index) {
			console.log($scope.motif);
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
		
		var isFiltered = function () {
			for (var i = 0; i < $scope.personsSel.length; i++) {
				if ($scope.personsSel[i].id == $scope.person.id) {return true}
			}
			return false;
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
		  			var heureFinS1 = $scope.heureFin1.getHours() +":"+$scope.heureFin1.getMinutes()+":00";
		  			var absenceMotif = null;
		  			if ($scope.motifAfficher && $scope.absent1) {absenceMotif = parseInt($scope.motif);}
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
						
						$scope.event.id = message.data;
						$scope.event.startsAt = dateDebutS1F;
						$scope.event.endsAt = dateFinS1;
						$scope.event.personne = angular.copy($scope.person);
						$scope.event.pause = $scope.pauseService1.value;
						$scope.event.color = $scope.absent1 ? $scope.getColor(9) : $scope.getColor($scope.person.dep.img);
						var abs = getMotifById(parseInt($scope.motif));
						$scope.event.absence = ($scope.absent1 ? {absence: true, objet: {id: abs.id, nom: abs.name}}: {absence: false});
						
						if (isFiltered()) {vm.events.push($scope.event)};
						NotifService.success('Ajout Horaire', "L'horaire pour l'employé : " + $scope.event.title + " a été ajouté avec succès");
						
						$scope.reinitEvent();
						/*****************************************************************************************\
								* Insertion du deuxième service *                        
						\*****************************************************************************************/
						if(angular.isDate($scope.heureDebut2) && angular.isDate($scope.heureFin2)){
							var heureDebutS2 = $scope.heureDebut2.getHours()+":"+$scope.heureDebut2.getMinutes()+":00";
			  				var heureFinS2 = $scope.heureFin2.getHours()+":"+$scope.heureFin2.getMinutes()+":00";
							
							var absenceMotif = null;
							if($scope.motifAfficher || $scope.absent2){absenceMotif = parseInt($scope.motif);}
							
							var $res = $http.post("assets/php/insertHoraireEmployeeAPI.php", {user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token'), 'per_id': $scope.myPerson, 'date': DateFactory.getDateBDD(dateDebut), 'heureDebut': heureDebutS2, 'heureFin': heureFinS2,'pause':$scope.pauseService2.value, 'absid': absenceMotif}); // Envoie de la requête en 'POST'
							$res.then(function (message) {
								console.log(message);
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
								
								var abs = getMotifById(parseInt($scope.motif));
								$scope.event.absence = ($scope.absent2 ? {absence: true, objet: {id: abs.id, nom: abs.name}}: {absence: false});
								$scope.event.color = $scope.absent2 ? $scope.getColor(9) : $scope.getColor($scope.person.dep.img);
								
								if (isFiltered()) {vm.events.push($scope.event)};
								NotifService.success('Ajout Horaire', "L'horaire pour l'employé : " + $scope.event.title + " a été ajouté avec succès");
							});
						}
						$mdDialog.hide(answer);
					});
					
		  		} else {
	   				NotifService.error("Les heures ne sont pas correcte !", "Erreur de configuration");
		  		}
		  	}
		}
		
		$scope.showModifHeureDebutSer1 = function(ev, index) {
		 	$mdpTimePicker($scope.heureDebut1, {
		 		targetEvent: ev,
		 		parent: angular.element(document.body.parentElement)
		 	}).then(function(selectedDate) {
		 		var date = DateFactory.newDate($scope.event.startsAt, selectedDate);
		 		if ($scope.heureFin1 != Const.HOUR_END) {
		 			var dateFin = DateFactory.newDate($scope.event.startsAt, $scope.heureFin1);
		 			if(date >= dateFin){
	   					NotifService.error(Const.TITLE_ERROR_CONFIG, Const.MSG_OPEN_AFTER_END);
	   					return;
		 			}
		 		}
		 		$scope.heureDebut1 = date;
		 	});
		};
		
		$scope.showModifHeureFinSer1 = function(ev, index) {
		 	$mdpTimePicker($scope.heureFin1, {
		 		targetEvent: ev,
		 		parent: angular.element(document.body.parentElement)
		 	}).then(function(selectedDate) {

		 		var date = DateFactory.newDate($scope.event.startsAt, selectedDate);
		 		if ($scope.heureDebut1 != Const.HOUR_OPEN && date <= $scope.heureDebut1) { // Comparer la première heure
	   				NotifService.error(Const.TITLE_ERROR_CONFIG, Const.MSG_END_BEFORE_OPEN);
	   				return;
		 		}
		 		
		 		if ($scope.heureDebut2 != Const.HOUR_OPEN) {
		 			var dateFin = DateFactory.newDate($scope.event.startsAt, scope.heureDebut2);
 					if(date >= dateFin){
		   				NotifService.error(Const.TITLE_ERROR_CONFIG, Const.MSG_FIN1_AFTER_OPEN2);
		   				return;
		 			}
		 		}
		 		
				$scope.heureFin1 = date;
		 	});
		};
			
		$scope.modifHoraire = function () {
			var dateDebut = $scope.event.startsAt;
  			var heureDebutS1 = $scope.heureDebut1.getHours()+":"+$scope.heureDebut1.getMinutes()+":00";
  			var heureFinS1 = $scope.heureFin1.getHours()+":"+$scope.heureFin1.getMinutes()+":00";
  			var absenceMotif = null;
  			if ($scope.motifAfficher && $scope.absent1) {absenceMotif = parseInt($scope.motif);}
  			
			var $res = $http.post("assets/php/updateHoraireEmployeeAPI.php", {user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token'), 'per_id': $scope.myPerson, 'date': DateFactory.getDateBDD(dateDebut), 'heureDebut': heureDebutS1, 'heureFin': heureFinS1,'pause':$scope.pauseService1.value, 'absid':absenceMotif, 'hop_id': $scope.event.id}); // Envoie de la requête en 'POST'
			$res.then(function (message) {
				console.log(message);
				if (message.data == false) {
					NotifService.error('Conflit Horaire', "L'horaire que vous essayé de configuré entre en conflit avec un autre horaire");
					return;
				} else if (message.data == 1) {
					NotifService.error('Modification Horaire', "L'horaire n'a pas pu être assigné à l'employé !");
					return;
				}
				var dateDebutS1 =  moment(message.data.date).startOf('day').add($scope.heureDebut1.getHours() , 'hours').add($scope.heureDebut1.getMinutes(), 'minutes').toDate();
				var dateFinS1 =  moment(message.data.date).startOf('day').add($scope.heureFin1.getHours() , 'hours').add($scope.heureFin1.getMinutes(), 'minutes').toDate();
				if (dateDebutS1 > dateFinS1) {
					dateFinS1 = moment(dateFinS1).add(1 , 'days').toDate();
				}
				
				$scope.event.startsAt = dateDebutS1;
				$scope.event.endsAt = dateFinS1;
				$scope.event.personne = angular.copy($scope.person);
				$scope.event.pause = $scope.pauseService1.value;
				$scope.event.color = $scope.absent1 ? $scope.getColor(9) : $scope.getColor($scope.person.dep.img);
				var abs = getMotifById(parseInt(message.data.absid));
				$scope.event.absence = ($scope.absent1 ? {absence: true, objet: {id: abs.id, nom: abs.name}}: {absence: false});
	
				$mdDialog.hide($scope.event);
			});
		}
		
		$scope.hide = function() {
      		$mdDialog.hide();
    	};

	    $scope.cancel = function() {
	      	$mdDialog.cancel();
	    };

	    $scope.answer = function(answer) {
	    	if (answer == 'modif') {
				$scope.modifHoraire();
			} else {
	    		$scope.addHoraire(answer);
	    	}
	      	//$mdDialog.hide(answer);
	    };
	}
	
	$scope.validationAbsence = function(){
		$scope.motifAfficher = ($scope.absent1 == true || $scope.absent2 == true);
	};
	/*///////////////////////////////////////////////////////////////////////////////////////*/
	
	/*****************************************************************************************\
			* Fonctions du composant calendrier  *                        
	\*****************************************************************************************/
	vm.eventEdited = function(event) {};
	vm.eventDeleted = function(event) {};
	vm.eventTimesChanged = function(event) {};

	vm.toggle = function($event, field, event) {
	  	$event.preventDefault();
	  	$event.stopPropagation();
	  	event[field] = !event[field];
	};

	vm.modifyCell = function (calendarCell) {}

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
  });

})();