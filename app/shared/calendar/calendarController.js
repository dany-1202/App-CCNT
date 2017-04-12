
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

appCal.controller('calendarController', function($timeout,$rootScope, $mdDialog, SessionService, $scope, moment, alert, calendarConfig, $http, NotifService, DateFactory, PromiseDAO, State, Popover, Const, $mdpTimePicker) {

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
  	$scope.colorDeps = [ // Stocke les codes couleurs nécessaires pour les départements
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
			vm.colorDeps = $scope.colorDeps;
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
		    	/*vm.events.splice(answer.calendarEventId, 1);
		    	
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
		      	}, 10);*/
		      	NotifService.success('Moditication Réussi', 'L\'horaire a été modifié avec succès !');
		      	$scope.majEvents();
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
						var $res2 = $http.post("assets/php/sendPushNouveauPlanningAPI.php", {user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token'), 'per_id': person.id, type_push: 'modif'});
						$res2.then(function (message) {
							console.log(message);
						});
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
	  	$scope.majEvents();
	}
	
	$scope.majEvents = function() {
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
	  	return $scope.colorDeps[id];
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
		$rootScope.loading = true;
	  	var $res = $http.post("assets/php/getEmployeesAPI.php", {user_id : SessionService.get('user_id'), user_token: SessionService.get('user_token')}); // Envoie de la requête en 'POST'
	  	$res.then(function (message) { // Réponse de la promesse
			var tabPerson = message.data; // Stocke le tableau d'objet
			if (tabPerson.length > 0) { // Si il y a des données
			  	for (var i = 0; i < tabPerson.length; i++) {
			  		tabPerson[i].color = $scope.colorDeps[tabPerson[i].dep.img];
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
	  	var majLoading = function() {
	  		$rootScope.loading = false;
	  	}
	  	$timeout(majLoading, 500);
	  	
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
  	
  	
  	var getListe = function(hour, tableau) {
  		var liste = [];
  		for (var i = 0; i < tableau.length; i++) {
  			var tabdonnees = tableau[i];
  			for (var cpt = 0; cpt < tabdonnees.length; cpt++) {
  				if (tabdonnees[cpt].liste && tabdonnees[cpt].hpr_id == hour.id) {
  					liste.push(tabdonnees[cpt]);
  				}
  			}
  		}
  		return liste;
  	}

  	
  	var insertionHoraireTypePreConfig = function (index, event) {
  		var data = {user_id : SessionService.get('user_id'), user_token: SessionService.get('user_token'), dep_id: $scope.departments[index].id};
		$res = $http.post('assets/php/getHoraireTypePreConfigAPI.php', data);
		$res.then(function(message) {
			$scope.departments[index].prehours = [];
			
			var obj = message.data;
			
			for (var i = 0; i < obj.length; i++) {
				var data = obj[i];
				for (var i = 0; i < data.length; i++) {
					if (!data[i].liste) {
						$scope.departments[index].prehours.push({prehour: data[i], liste : getListe(data[i], message.data)});
					}
				}
			}
			
			if (index == $scope.departments.length-1){
				$('.side-nav').css('display', 'none');
				$('#page-wrapper').css('position', 'absolute');
				$('#page-wrapper').css('left', '0px');

				$mdDialog.show({
			      	controller: GestionHoraireTypeController,
			      	templateUrl: 'app/shared/calendar/modalPlanningType.html',
			      	parent: angular.element(document.body),
			      	targetEvent: event,
			      	clickOutsideToClose:true,
			      	fullscreen: true,
			    }).then(function(answer) {
			    	$('#page-wrapper').css('position', '');
					$('#page-wrapper').css('left', '');
			    	$('.side-nav').css('display', '');
			    	$scope.majEvents();
			    	NotifService.success('Ajout Horaire', "Les horaires ont été ajouté avec succès");
			    }, function(answer) {
			    	$('#page-wrapper').css('position', '');
					$('#page-wrapper').css('left', '');
			    	$('.side-nav').css('display', '');
			    	console.log(answer);
			    });
			}
			
		}).then(function(error){});
  	}
  	
  	/*****************************************************************************************\
  			* Gestion de la modale ajouter horaire type préconfiguré *                        
  	\*****************************************************************************************/
  	$scope.showAddHoraireType = function(event) {
  		vm.event = $scope.event;
  		vm.persons = $scope.persons;
  		vm.myPerson = $scope.myPerson;
		vm.persons = $scope.persons;
		vm.styleDep = $scope.styleDep;
		vm.colorDeps = $scope.colorDeps;
		vm.event = $scope.event;
		vm.departments = $scope.departments;
		vm.absences1 = $scope.absences1;
		vm.motif = $scope.motif;
		vm.personsSel = $scope.personsSel;

		for (var i = 0; i < $scope.departments.length; i++) {
			insertionHoraireTypePreConfig(i, event);
  		}
  	}
  	
  	function GestionHoraireTypeController($scope) {
  		$scope.scope = $scope;
  		$scope.nbPause = [];
  		$scope.event = vm.event;
  		
  		$scope.event.endsAt = moment($scope.event.startsAt).add(6, 'days').toDate();
  		
  		for (var nb = 0; nb <= 60; nb+=5) {$scope.nbPause.push({name: nb + ' minutes', value:nb});}
  			
  		$scope.myHoraireType = null;
  		$scope.myHoraireTypeCal = null;
  		$scope.persons = vm.persons;
		$scope.styleDep = {'background-color': 'white'};
		$scope.depSel = "";
		$scope.listePreHours = null;
		$scope.imgDep = {'background-color': 'white'};
		$scope.person = null;
		$scope.persons = angular.copy(vm.persons);
  		$scope.departments = angular.copy(vm.departments);
		$scope.colorDeps = angular.copy(vm.colorDeps);
  		$scope.prehours = State.getTabCalDefaultWithPause();
  		
  		var assignationPause = function() {
  			for (var i = 0; i < $scope.prehours.length; i++) {
				$scope.prehours[i].datapauseMatin = $scope.nbPause[0];
				$scope.prehours[i].datapauseSoir = $scope.nbPause[0];
			}
  		}
  		
  		assignationPause();
		
  		
  		
  		//console.log($scope.departments);
	    $scope.getColor = function (id) {return $scope.colorDeps[id];}
	    
		var rechercherPersonne = function (id) {
		  	for (var i = 0; i < $scope.persons.length; i++) {
				if ($scope.persons[i].id == id) {
			  		return $scope.persons[i];
				}
		  	}
		  	return null;
		}
		
		var rechercherDep = function (id) {
		  	for (var i = 0; i < $scope.departments.length; i++) {
				if ($scope.departments[i].id == id) {
			  		return $scope.departments[i];
				}
		  	}
		  	return null;
		}
		
		var getPauseByValue = function(value) {
			for (var i = 0; i < $scope.nbPause.length; i++) {
				if ($scope.nbPause[i].value == value) {
					return $scope.nbPause[i];
				}
			}
			return $scope.nbPause[0];
		}
		
		var insertionHorairePreConfigSemaine = function(jour) {
			for (var i = 0; i < $scope.prehours.length; i++) {
				if (jour.jour == $scope.prehours[i].id) {
					if (moment(jour.heureDebut).format('HH') != 'Invalid date') {
						$scope.prehours[i].matin.style = {"border" : "1px solid #2980b9"};
						
						var heureDebut = new Date(jour.heureDebut);
						var heureDebutFinal = moment().startOf('day').add(heureDebut.getHours(), 'hours').add(heureDebut.getMinutes(), 'minutes').toDate();
						var heureFin = new Date(jour.heureFin);
						var heureFinFinal = moment().startOf('day').add(heureFin.getHours(), 'hours').add(heureFin.getMinutes(), 'minutes').toDate();
						
						$scope.prehours[i].matin.debut = heureDebutFinal;
						$scope.prehours[i].matin.fin = heureFinFinal;
						$scope.prehours[i].datapauseMatin = getPauseByValue(jour.pause);
					}
					if (moment(jour.heureDebutS).format('HH') != 'Invalid date') {
						$scope.prehours[i].soir.style = {"border" : "1px solid #2980b9"};

						var heureDebut = new Date(jour.heureDebutS);
						var heureDebutFinal = moment().startOf('day').add(heureDebut.getHours(), 'hours').add(heureDebut.getMinutes(), 'minutes').toDate();
						var heureFin = new Date(jour.heureFinS);
						var heureFinFinal = moment().startOf('day').add(heureFin.getHours(), 'hours').add(heureFin.getMinutes(), 'minutes').toDate();
						
						$scope.prehours[i].soir.debut = heureDebutFinal;
						$scope.prehours[i].soir.fin = heureFinFinal;
						$scope.prehours[i].datapauseSoir = getPauseByValue(jour.pauseS);
					}
				}
			}
		}
		
			 /* Affiche le timePicker pour ouverture du Matin */
			$scope.showTimeMatinDebut = function(ev, index) {
				$timeout(Popover.hide, 0);
				var objHour = $scope.prehours[index];
				
				var date = objHour.matin.debut == Const.HOUR_OPEN ? moment(angular.copy($scope.matinDebut)).add(index, 'days').toDate() : objHour.matin.debut;
				
			 	$mdpTimePicker(date, {
			 		targetEvent: ev,
			 		parent: angular.element(document.body.parentElement)
			 	}).then(function(selectedDate) {
			 		if (selectedDate == Const.ANNULER) { // (Cliquer sur Supprimer == Annuller)
						objHour.matin.debut = Const.HOUR_OPEN;
						objHour.matin.fin = Const.HOUR_END;
						objHour.soir.debut = Const.HOUR_OPEN;
						objHour.soir.fin = Const.HOUR_END;
					} else {
						if (DateFactory.isHourStartValid(selectedDate, index, $scope.prehours)) {
							selectedDate = moment(DateFactory.getToday()).add(index, 'days').add(selectedDate.getHours(), 'hours').add(selectedDate.getMinutes(), 'minutes').toDate();
							objHour.matin.debut = selectedDate; // Changement de l'heure à jour
						}  else {
							var dayPrec = DateFactory.getDayPrec(index, $scope.prehours);
							NotifService.error('Horaire invalide', "L'heure d'ouverture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(selectedDate) + "</span> choisi pour " + objHour.day + " doit être supérieur à l'heure de fermeture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(dayPrec.soir.fin) + "</span> du soir de " + dayPrec.day); 
						}
					}

			 	});
			};

			/* Affiche le timePicker pour fermeture du Matin (Affiché seulement si existe une coupure = pause) */
			$scope.showTimeMatinFin = function(ev, index) {
				$timeout(Popover.hide, 0);
				var objHour = $scope.prehours[index];
				
				var date = objHour.matin.fin == Const.HOUR_END ? moment(angular.copy($scope.matinFin)).add(index, 'days').toDate() : objHour.matin.fin;
				console.log(date);
				
				if (objHour.matin.debut == Const.HOUR_OPEN) {
					console.log(objHour);
					NotifService.error("Heure d'ouverture non configuré", "L'heure d'ouverture doit être indiqué avant !");
					return;
				}// Rediriger sur date début

			 	$mdpTimePicker(date, {
			 		targetEvent: ev,
			 		parent: angular.element(document.body.parentElement)
			 	}).then(function(selectedDate) {

			 		if (selectedDate == Const.ANNULER) {objHour.matin.fin = Const.HOUR_END; return;} // Si il annule (Clique sur supprimer)

			 		var nbHours = DateFactory.calculateNbHours(objHour.matin.debut, selectedDate);

			 		if (nbHours >= 24) { // Si la date dépasse 24 heures
			 			var nbJours = Math.round(nbHours/24); // Virer les jours si il en a plus que ce qu'il doit
			 			selectedDate = moment(selectedDate).subtract(nbJours, 'days').toDate();
			 		}

			 		if (selectedDate.getDate() != objHour.matin.debut.getDate()) { // Si c'est le jour suivant
			 			selectedDate = selectedDate.setDate(objHour.matin.debut.getDate());
			 			selectedDate = new Date(selectedDate);		 		
			 		}

			 		/****************************************************************************\
						Contrôler si la date est supérieur à matin début ! Sinon on la rejette 
					\****************************************************************************/
			 		if (!DateFactory.validateHour(objHour.matin.debut, selectedDate)) {
			 			// Date est invalide
			 			objHour.matin.fin = Const.HOUR_END;
			 			NotifService.error("Date invalide", "L'heure de fermeture doit être après la date d'ouverture!");
			 		} else {
			 			// Date est valide
			 			objHour.matin.fin = selectedDate;
			 		}

			 			
			 	});
			};

			/* Affiche le timePicker pour la date de début du soir */
			$scope.showTimeSoirDebut = function(ev, index) {
				$timeout(Popover.hide, 0);
				var objHour = $scope.prehours[index];
				var date = objHour.soir.debut == Const.HOUR_OPEN ? moment(angular.copy(DateFactory.soirDebut)).add(index, 'days').toDate() : objHour.soir.debut;
				console.log(date);
				
				if (objHour.matin.fin == Const.HOUR_END) {
					console.log(objHour);
					NotifService.error("Heure d'ouverture non configuré", "L'heure d'ouverture doit être indiqué avant !");
					return;
				}// Rediriger sur date début
				
			 	$mdpTimePicker(date, {
			 		targetEvent: ev,
			 		parent: angular.element(document.body.parentElement)
			 	}).then(function(selectedDate) {
			 		if (selectedDate == Const.ANNULER) {
						objHour.soir.debut = Const.HOUR_OPEN;
						objHour.soir.fin = Const.HOUR_END;

					} else {
						
						if (objHour.soir.fin != Const.HOUR_END && !DateFactory.validateHour(selectedDate, objHour.soir.fin)) {
							/* Date invalide */
			 				NotifService.error("Horaire invalide", "L'heure d'ouverture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(selectedDate) + "</span> du soir doit être avant la date de fermeture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(objHour.soir.fin) + "</span> du soir !");
			 				return;
						}
						
				 		var nbHours = DateFactory.calculateNbHours(objHour.matin.fin, selectedDate);

				 		if (nbHours >= 24) { // Si la date dépasse 24 heures
				 			var nbJours = Math.round(nbHours/24); // Virer les jours si il en a plus que ce qu'il doit
				 			selectedDate = moment(selectedDate).subtract(nbJours, 'days').toDate();
				 		}

				 		if (selectedDate.getDate() != objHour.matin.debut.getDate()) { // Si c'est le jour suivant
				 			selectedDate = selectedDate.setDate(objHour.matin.debut.getDate());
				 			selectedDate = new Date(selectedDate);		 		
				 		}
				 		
				 		/* Cas spécial si je veux choisir minuit ou autre avant l'heure du matin*/
				 		if (selectedDate.getHours() >= 0 && selectedDate.getHours() < objHour.matin.debut.getHours()) {
				 			var objSuiv = DateFactory.getDaySuiv(index, $scope.prehours);
				 			
				 			if (objSuiv.matin.debut != Const.HOUR_OPEN) {
				 				if (selectedDate.getHours() >= objSuiv.matin.debut.getHours()) {
				 					if (selectedDate.getHours() == objSuiv.matin.debut.getHours()) {
				 						/* Comparaison des minutes */
				 						if (selectedDate.getMinutes() >= objSuiv.matin.debut.getMinutes()) {
				 							NotifService.error("Date invalide", "L'heure d'ouverture du soir doit être après la date de fermeture du matin !");
			 								return;
				 						}
				 					}
				 				}
				 			}
				 			selectedDate = moment(selectedDate).add(1, 'days').toDate();
			 				selectedDate = new Date(selectedDate);	
				 		}
				 		
						/****************************************************************************\
							Contrôler si la date est supérieur à matin fin ! Sinon on la rejette 
						\****************************************************************************/
						if (!DateFactory.validateHour(objHour.matin.fin, selectedDate)) {
							/* Date invalide */
							objHour.soir.debut = Const.HOUR_OPEN;
			 				NotifService.error("Date invalide", "L'heure d'ouverture du soir doit être après la date de fermeture du matin !");
						} else {
							/* Date valide */ 
							objHour.soir.debut = selectedDate; // Changement de l'heure à jour
						}
					}

			 	});
			};

			/* Affiche le timePicker pour la date de fin du soir */
			$scope.showTimeSoirFin = function(ev, index) {
				$timeout(Popover.hide, 0);
				
				
				var objHour = $scope.prehours[index];
				var objSuiv = DateFactory.getDaySuiv(index, $scope.prehours);
				var date = objHour.soir.fin == Const.HOUR_END ? moment(angular.copy($scope.soirFin)).add(index, 'days').toDate() : objHour.soir.fin;
				
				if (objHour.matin.debut == Const.HOUR_OPEN) {
					NotifService.error("Heure non configuré", "L'heure d'ouverture du matin de : <strong>" + objHour.day + "</strong> doit être indiqué avant !");
					return;
				}
				
				if (objHour.matin.fin != Const.HOUR_END && objHour.soir.debut == Const.HOUR_OPEN) {
					NotifService.error("Heure non configuré", "L'heure d'ouverture du soir de : " + objHour.day + " doit être indiqué avant !");
					return;
				}


				/* Affiche le timePicker */
			 	$mdpTimePicker(date, {
			 		targetEvent: ev,
			 		parent: angular.element(document.body.parentElement)
			 	}).then(function(selectedDate) {
			 		/* Dès que la saisie est faite */
			 		
			 		if (selectedDate == Const.ANNULER) { // Si L'utilisateur supprime l'heure saisi
						objHour.soir.fin = Const.HOUR_END; // Remet l'heure de fin à son état initial.
						return;
					} else { // Si l'utilisateur valide son heure
						
						
						/* Vérification que l'heure de pause de fin est valide et peut être rentré */
						var nbHours = DateFactory.calculateNbHours(objHour.soir.debut, selectedDate);

				 		if (nbHours >= 24) { // Si la date dépasse 24 heures
				 			var nbJours = Math.round(nbHours/24); // Virer les jours si il en a plus que ce qu'il doit
				 			selectedDate = moment(selectedDate).subtract(nbJours, 'days').toDate();
				 		} else {
				 			
				 			if (selectedDate.getHours() >= 0 && selectedDate.getHours() <= objHour.matin.debut.getHours()) { // Si c'est le jour suivant
				 				if (selectedDate.getHours() == objHour.matin.debut.getHours()) { // Si même heure
				 					if (selectedDate.getMinutes() > objHour.matin.debut.getMinutes()) { // Comparer les minutes
				 						
				 						NotifService.error('Horaire invalide', "L'heure de fermeture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(selectedDate) + "</span> choisi pour " + objHour.day + " doit être supérieur à l'heure d'ouverture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(objHour.matin.debut) + "</span> du jour même !"); 
										return;		 						
				 					}
				 				}
				 				selectedDate = selectedDate.setDate(objHour.matin.debut.getDate() + 1); // Je rajoute un jour
								selectedDate = new Date(selectedDate); 
			 				} else if (selectedDate.getHours() < 12) { // Si je suis dans le matin et que l'heure que j'ai séléctionné et plus grande que celle du demain
			 					if (objSuiv.matin.debut != Const.HOUR_OPEN) {
				 					if (selectedDate.getHours() == objSuiv.matin.debut.getHours()) { // Si même heure
					 					if (selectedDate.getMinutes() > objSuiv.matin.debut.getMinutes()) { // Comparer les minutes
					 						NotifService.error('Horaire invalide', "L'heure de fermeture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(selectedDate) + "</span> choisi pour " + objHour.day + " doit être supérieur à l'heure d'ouverture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(objSuiv.matin.debut) + "</span> de " + objSuiv.day + " !"); 

											
											return;	
					 					}
					 				} else {
					 					
					 					
					 					NotifService.error('Horaire invalide', "L'heure de fermeture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(selectedDate) + "</span> choisi pour " + objHour.day + " doit être supérieur à l'heure d'ouverture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(objSuiv.matin.debut) + "</span> de " + objSuiv.day + " !"); 

										return;			
					 				}
				 					selectedDate = selectedDate.setDate(objSuiv.matin.debut.getDate()); // Je rajoute un jour
									selectedDate = new Date(selectedDate); 
			 					}
			 				} else {
			 					selectedDate = selectedDate.setDate(objHour.matin.debut.getDate()); // Je rajoute un jour
								selectedDate = new Date(selectedDate); 
			 				}
				 		}
				 		
				 		
				 		
				 		if (objHour.soir.debut != Const.HOUR_OPEN && !DateFactory.validateHour(objHour.soir.debut, selectedDate)) {
				 			
				 			NotifService.error('Horaire invalide', "L'heure de fermeture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(selectedDate) + "</span> choisi pour le soir doit être supérieur à l'heure d'ouverture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(objHour.soir.debut) + "</span> du soir !"); 
			 				return;
				 		}
				 						 		
				 		/****************************************************************************\
							Contrôler si la date est supérieur à matin fin ! Sinon on la rejette 
						\****************************************************************************/
						
						if (index == 6) {
							if (selectedDate.getHours() >= 0 && selectedDate.getHours() <= objSuiv.matin.debut.getHours()) { // Si c'est le jour suivant
				 				if (selectedDate.getHours() == objSuiv.matin.debut.getHours()) { // Si même heure
				 					if (selectedDate.getMinutes() > objSuiv.matin.debut.getMinutes()) { // Comparer les minutes
				 						NotifService.error('Horaire invalide', "L'heure de fermeture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(selectedDate) + "</span> choisi pour " + objHour.day + " doit être inférieur à l'heure d'ouverture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(objSuiv.matin.debut) + "</span> de " + objSuiv.day + " !"); 

										return;		 						
				 					}
				 				}
				 			} else {
				 				if (!DateFactory.validateHour(objHour.matin.debut, selectedDate)) {
									/* Date invalide */
									objHour.soir.fin = Const.HOUR_OPEN;
					 				NotifService.error('Horaire invalide', "L'heure de fermeture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(selectedDate) + "</span> choisi pour " + objHour.day + " doit être supérieur à l'heure d'ouverture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(objHour.matin.debut) + "</span> du jour même"); 
					 				return;
								}
				 			}
						} else {
							if (objSuiv.matin.debut != Const.HOUR_OPEN) {
								if (!DateFactory.validateHour(selectedDate, objSuiv.matin.debut)) {
									/* Date invalide */
									objHour.soir.fin = Const.HOUR_OPEN;
					 				NotifService.error('Horaire invalide', "L'heure de fermeture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(selectedDate) + "</span> choisi pour " + objHour.day + " doit être supérieur à l'heure d'ouverture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(objSuiv.matin.debut) + "</span> de " + objSuiv.day + " !"); 
					 				return;
								}
							}
						}
						/* Date valide */ 
						objHour.soir.fin = selectedDate; // Changement de l'heure à jour
						/* Lancement écran qui permet à l'utilisateur de choisir les jours de la semaine qui doivent reprendre les même configurations */
			 		}

			 	});
	    	};
		
		
		$scope.majHoraireType = function () {
			$scope.prehours = State.getTabCalDefaultWithPause();
			assignationPause();
			var pos = -1;
			for (var i = 0; i < $scope.listePreHours.length; i++) {
				if ($scope.listePreHours[i].prehour.id == $scope.myHoraireType) {
					pos = i;
				}
			}
			if (pos != -1) {
				for (var i = 0; i < $scope.listePreHours[pos].liste.length; i++) {
					insertionHorairePreConfigSemaine($scope.listePreHours[pos].liste[i]);
				}
			}
		}
		
		
		$scope.majPerson = function () {
			var person = rechercherPersonne($scope.myPerson);
		  	if (person != null) {
		  		var dep = rechercherDep(person.dep.id);
				$scope.depSel = person.dep.nom;
				$scope.listePreHours = dep.prehours;
				$scope.styleDep = {'background-color' : $scope.getColor(person.dep.img).primary}
				$scope.event.title = person.nom + " " + person.prenom;
				$scope.event.color = $scope.getColor(person.dep.img);
				$scope.person = person;
				$scope.event.person = angular.copy(person);
		  	}
		}
  		
  		
  		var insertionHoraireBDD = function(pos, dateDebut) {
  			var data = {user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token'), 'per_id': $scope.myPerson, 'date': DateFactory.getDateBDD(new Date(dateDebut)), 'heureDebut': moment($scope.prehours[pos].matin.debut).format('HH:mm'), 'heureFin': moment($scope.prehours[pos].matin.fin).format('HH:mm'),'pause':$scope.prehours[pos].datapauseMatin.value, 'absid':null};
  			var $res = $http.post("assets/php/insertHoraireEmployeeAPI.php", data); // Envoie de la requête en 'POST'
			$res.then(function(value){console.log(value);}).then(function(){});
  		}
  		
  		var insertionHoraireBDDSoir = function(pos, dateDebut) {
  			var data = {user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token'), 'per_id': $scope.myPerson, 'date': DateFactory.getDateBDD(new Date(dateDebut)), 'heureDebut': moment($scope.prehours[pos].soir.debut).format('HH:mm'), 'heureFin': moment($scope.prehours[pos].soir.fin).format('HH:mm'),'pause':$scope.prehours[pos].datapauseSoir.value, 'absid':null};
  			var $res = $http.post("assets/php/insertHoraireEmployeeAPI.php", data); // Envoie de la requête en 'POST'
			$res.then(function(value){
				console.log(value);
			}).then(function(error){
				console.log(error);
			});
  		}
  		
  		
  		$scope.insertHoraireType = function() {
  			console.log($scope.event);
  			console.log($scope.prehours);
  			
  			var dateDebut = moment(angular.copy($scope.event.startsAt)).format('YYYY-MM-DD');
  			var dateFin = moment(angular.copy($scope.event.endsAt)).add(1, 'days').toDate();
  			var dateFinal = moment(dateFin).format('YYYY-MM-DD');
  			
  			while (!moment(dateDebut).isSame(dateFinal)) {
  				var pos = DateFactory.getHoraireDay($scope.prehours, new Date(dateDebut).getDay());
  				
				if ($scope.prehours[pos].matin.debut != Const.HOUR_OPEN) {
					insertionHoraireBDD(pos, dateDebut);
				}
				if ($scope.prehours[pos].soir.debut != Const.HOUR_OPEN) {
					insertionHoraireBDDSoir(pos, dateDebut);
				}
				
  				dateDebut = moment(dateDebut).add(1, 'days').format('YYYY-MM-DD'); // Atention si on enleve boucle infini
  			}
			var $res2 = $http.post("assets/php/sendPushNouveauPlanningAPI.php", {user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token'), 'per_id': $scope.person.id, type_push: 'new'});
			$res2.then(function (message) {
				console.log(message);
			});
  			
			$mdDialog.hide('');
  		}
  		
  		// Interactions avec l'utilisateur pour cacher, annuler ou renvoyer un résultat avec la modale 
  		$scope.hide = function() { $mdDialog.hide(); };
	    $scope.cancel = function() { $mdDialog.cancel(); };
	    $scope.answer = function(answer) { $scope.insertHoraireType(); };
  	}
  	
  	
  	
  	/*****************************************************************************************\
  			* Gestion de la modale ajouter horaire *                        
  	\*****************************************************************************************/
 	$scope.showAddHoraire = function (event) {
 		vm.modif = false;
		vm.styleDep = $scope.styleDep;
		vm.myPerson = $scope.myPerson;
		vm.persons = $scope.persons;
		vm.colorDeps = $scope.colorDeps;
		vm.event = $scope.event;
		vm.departments = $scope.departments;
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
	    	$scope.majEvents();
	    }, function() {});
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
		$scope.colorDeps = angular.copy(vm.colorDeps);
	    
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
	    
	    $scope.getColor = function (id) {return $scope.colorDeps[id];}
	    
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
			console.log("addHoraire");
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
						var dateDebutS1 = angular.copy(moment(dateDebut).startOf('day').toDate());
						var dateDebutS1F = moment(angular.copy(dateDebutS1)).add($scope.heureDebut1.getHours() , 'hours').add($scope.heureDebut1.getMinutes(), 'minutes').toDate();
						var dateFinS1 = moment(angular.copy(dateDebutS1)).add($scope.heureFin1.getHours() , 'hours').add($scope.heureFin1.getMinutes(), 'minutes').toDate();
						if (dateDebutS1F > dateFinS1) {
							dateFinS1 = moment(dateFinS1).add(1 , 'days').toDate();
						}
						/*$scope.event.id = message.data;
						$scope.event.startsAt = dateDebutS1F;
						$scope.event.endsAt = dateFinS1;
						$scope.event.personne = angular.copy($scope.person);
						$scope.event.pause = $scope.pauseService1.value;
						$scope.event.color = $scope.absent1 ? $scope.getColor(9) : $scope.getColor($scope.person.dep.img);
						var abs = getMotifById(parseInt($scope.motif));
						$scope.event.absence = ($scope.absent1 ? {absence: true, objet: {id: abs.id, nom: abs.name}}: {absence: false});

						if (isFiltered()) {vm.events.push($scope.event)};
						*/
						NotifService.success('Ajout Horaire', "L'horaire pour l'employé : " + $scope.event.title + " a été ajouté avec succès");
						
						//$scope.reinitEvent();
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
								/*console.log(message);
								if (message.data == false) {
									NotifService.error('Conflit Horaire', "L'horaire que vous essayé de configuré entre en conflit avec un autre horaire");
									return;
								}
								var dateDebutS2 = angular.copy(moment(dateDebut).startOf('day').toDate());
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
								
								if (isFiltered()) {vm.events.push($scope.event)};*/
								NotifService.success('Ajout Horaire', "L'horaire pour l'employé : " + $scope.event.title + " a été ajouté avec succès");
							});

						}
						var $res2 = $http.post("assets/php/sendPushNouveauPlanningAPI.php", {user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token'), 'per_id': $scope.person.id, type_push: 'new'});
						$res2.then(function (message) {
							console.log(message);
						});
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
				/*var dateDebutS1 =  moment(message.data.date).startOf('day').add($scope.heureDebut1.getHours() , 'hours').add($scope.heureDebut1.getMinutes(), 'minutes').toDate();
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
				*/
				var $res2 = $http.post("assets/php/sendPushNouveauPlanningAPI.php", {user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token'), 'per_id': $scope.person.id, type_push: 'modif'});
				$res2.then(function (msg) {
					console.log(msg);
				});
				$mdDialog.hide('');
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
	    		$scope.addHoraire();
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