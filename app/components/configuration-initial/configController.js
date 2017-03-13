/**
* Module qui permet de gérer la parti de la configuration initial
* Qui va permettre de configurer l'établissement, les données seront donc stockés dans la base de données
*
**/
var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('configController', function ($route, $timeout, $rootScope, $mdDialog, $scope, $http, $location, $mdpDatePicker, $mdpTimePicker, SessionService, NotifService, Const, State, Postaux, DateFactory, Popover) {
	$scope.$route = $route;
	$scope.nbSteps = 4; // Nombre d'étapes de la configuration initiale
	$scope.nbPercentage = 25; // Pourcentage en fonction de l'avancement de la configuration
	$scope.currentDate = new Date(); // Récupère la date d'aujourd'hui
	$scope.currentView = 1; // Vue courante (1: Informations de l'établissement)
	$scope.pourcentage = 25; // Valeur de pourcentage, avancement des étapes
	$scope.hoursCCNTChosen = 45; // Valeur heures soumis CCNT
	
	if (angular.isUndefined($scope.postaux)) {
		Postaux.query(function(data) {$scope.postaux = data;});
    }

	/* Savoir si c'est la première visite pour les afficher ou non les popovers : p
		 - Si c'est la première fois les popovers sont à true sinon il passe à false
	*/
	$scope.tabCalendars = State.tabCalendars;

	$scope.nbHoursChosen = null;

	/* Définition des horaires de la semaine */
	$scope.hours = [
		{ id: 1, day: 'Lundi', matin: { debut: Const.OPEN, fin: Const.END }, soir: { debut: Const.OPEN, fin: Const.END }, pause: { existe: false, debut: Const.PAUSED, fin: Const.PAUSEF }, nbHours: 0 },
		{ id: 2, day: 'Mardi', matin: { debut: Const.OPEN, fin: Const.END }, soir: { debut: Const.OPEN, fin: Const.END }, pause: { existe: false, debut: Const.PAUSED, fin: Const.PAUSEF }, nbHours: 0 },
		{ id: 3, day: 'Mercredi', matin: { debut: Const.OPEN, fin: Const.END }, soir: { debut: Const.OPEN, fin: Const.END }, pause: { existe: false, debut: Const.PAUSED, fin: Const.PAUSEF }, nbHours: 0 },
		{ id: 4, day: 'Jeudi', matin: { debut: Const.OPEN, fin: Const.END }, soir: { debut: Const.OPEN, fin: Const.END }, pause: { existe: false, debut: Const.PAUSED, fin: Const.PAUSEF }, nbHours: 0 },
		{ id: 5, day: 'Vendredi', matin: { debut: Const.OPEN, fin: Const.END }, soir: { debut: Const.OPEN, fin: Const.END }, pause: { existe: false, debut: Const.PAUSED, fin: Const.PAUSEF }, nbHours: 0 },
		{ id: 6, day: 'Samedi', matin: { debut: Const.OPEN, fin: Const.END }, soir: { debut: Const.OPEN, fin: Const.END }, pause: { existe: false, debut: Const.PAUSED, fin: Const.PAUSEF }, nbHours: 0 },
		{ id: 7, day: 'Dimanche', matin: { debut: Const.OPEN, fin: Const.END }, soir: { debut: Const.OPEN, fin: Const.END }, pause: { existe: false, debut: Const.PAUSED, fin: Const.PAUSEF }, nbHours: 0 },
	]

	/* Définition des départements de l'établissement */
	$scope.depart = [
		{ id: 1, name: 'Cuisine', carre: 'carre-1', format: 'label-carre-100', error: false },
		{ id: 2, name: 'Salle', carre: 'carre-2', format: 'label-carre-100', error: false },
		{ id: 3, name: 'Bar', carre: 'carre-3', format: 'label-carre-50', error: false }
	]; //Tableau contenant les departement

	/* Définition des informations nécessaires pour l'établissement */
	$scope.infoEtablissement = [
		{ id: 1, type: 'text', name: Const.NAME, value: "", min: 2, max: 40, error: false, message: Const.ERRORNAME, icon:Const.INAME},
		{ id: 2, type: 'text', name: Const.ADRESSE, value: "", min: 2, max: 50, error: false, message: Const.ERRORADRESS, icon: Const.IADRESSE},
		{ id: 3, type: 'text', name: Const.ADRESSEPLUS, value: "", min: 0, max: 100, error: false, message: Const.ERRORADRESS, icon: Const.IADRESSEPLUS},
		{ id: 4, type: 'text', name: Const.POST, value: {no: "", nom: ""}, min: 4, max: 4, error: false, message: Const.ERRORPOST, icon: Const.IPOST},
		//{ id: 5, type: 'text', name: Const.LOCATION, value: "", min: 2, max: 30, error: false, message: Const.LOCATION },
		{ id: 6, type: 'tel', name: Const.PHONERES, value: "", min: 10, max: 10, error: false, message: Const.ERRORPHONE, icon: Const.IPHONERES},
		{ id: 7, type: 'tel', name: Const.PHONEDIR, value: "", min: 10, max: 10, error: false, message: Const.ERRORPHONE, icon: Const.IPHONEDIR},
		{ id: 8, type: 'email', name: Const.EMAIL, value: "", min: 6, max: 30, error: false, message: Const.ERROREMAIL, icon:Const.IEMAIL },
		{ id: 9, type: 'text', name: Const.URL, value: "", min: 0, max: 30, error: false, message: Const.ERRORURL, icon:Const.IURL },
	]; // Tableau contenant les noms des champs de l'établissement

	$scope.ccntHeure = [
		{ id: 1, name: "42 Heures", value: Const.CCNT1 },
		{ id: 2, name: "43.5 Heures", value: Const.CCNT2 },
		{ id: 3, name: "45 Heures", value: Const.CCNT3 }
	];

	$scope.selectedDates = [];
	$scope.plagesEvents = [];
	$scope.events = [];
	$scope.calEvents = [];

	var self = this;
	/* Change la vue du switch et met à jour les pourcentage pour l'étape */
	this.next = function (no) {
		$scope.currentView = no;
		$scope.pourcentage += $scope.nbPercentage;
	}

	this.previous = function (no) {
		$scope.currentView = no;
		$scope.pourcentage -= $scope.nbPercentage;
	}

	this.saveConfiguration = function () {
		$timeout(Popover.hide(), 0);
		
		/* Informations de l'établissement */
		var dataEtablissement = {
			'nom': $scope.infoEtablissement[0].value,
			'adresse': $scope.infoEtablissement[1].value,
			'adresseInfo': $scope.infoEtablissement[2].value,
			'codePostal': $scope.infoEtablissement[3].value.no,
			'localite': State.capitalize($scope.infoEtablissement[3].value.nom),
			'telReservation': $scope.infoEtablissement[4].value,
			'telDirection': $scope.infoEtablissement[5].value,
			'email': $scope.infoEtablissement[6].value,
			'siteWeb': $scope.infoEtablissement[7].value,
			'nbHeure': $scope.hoursCCNTChosen,
			'user_id': SessionService.get('user_id'),
			'user_token': SessionService.get('user_token')
		};

		var $res = $http.post("assets/php/insertEtablissementAPI.php", dataEtablissement);
		$res.then(function (message) {
			console.log(message);
			/* Insertion des horaires */
			var idEstablishment = message.data;
			var data = {
				'eta_id': idEstablishment,
				'user_id': SessionService.get('user_id'),
				'user_token': SessionService.get('user_token')
			};
			var $res = $http.post("assets/php/updatePersonneEstablishmentAPI.php", data);
			$res.then(function (message) { });

			/* Insertion des horaires de l'établissement */
			for (var i = 0; i < $scope.tabCalendars.length; i++) {
				var cal = $scope.tabCalendars[i];
				for (var i = 0; i < cal.hours.length; i++) {
					var obj = cal.hours[i];
					var dataInsertOuvertureInfo = {
						'jour': obj.day,
						'matinDebut': moment(obj.matin.debut).add(1, 'h').toDate(),
						'matinFin': (obj.matin.fin != Const.END || obj.soir.debut != Const.OPEN)  ? moment(obj.matin.fin).add(1, 'h').toDate() : null,
						'soirDebut': (obj.matin.fin != Const.END || obj.soir.debut != Const.OPEN)  ? moment(obj.soir.debut).add(1, 'h').toDate() : null,
						'soirFin': moment(obj.soir.fin).add(1, 'h').toDate(),
						'etaId': idEstablishment,
						'user_id': SessionService.get('user_id'),
						'user_token': SessionService.get('user_token')
					 };
					var $res = $http.post("assets/php/insertOuvertureInfoAPI.php", dataInsertOuvertureInfo);
					$res.then(function (message) {console.log(message)});
				}
			}
			/* Insertion des départements */
			for (var i = 0; i < $scope.depart.length; i++) {
				var obj = $scope.depart[i];
				var data = { 'nom': obj.name, 'img': (i + 1), 'noEta': idEstablishment, 'user_id': SessionService.get('user_id'), 'user_token': SessionService.get('user_token') };
				var $res = $http.post("assets/php/insertDepartementAPI.php", data);
				$res.then(function (message) { console.log(message); });
			};

			/* Insertion des jours fériés et vacances */
			for (var i = 0; i < $scope.calEvents.length; i++) {
				var dataFermetureInfo = {
					'date': moment(DateFactory.getDateStr($scope.calEvents[i].date)).add(1, 'h').toDate(),
					'etaId': idEstablishment, 'user_id': SessionService.get('user_id'),
					'user_token': SessionService.get('user_token')
				};
				var $res = $http.post("assets/php/insertFermetureInfoAPI.php", dataFermetureInfo);
				$res.then(function (message) { console.log(message); });
			};
		});

		if ($rootScope.user != null) { $rootScope.user.config = true; }
		SessionService.set('user_configured', true);
		$location.path('/home?state=1');
		NotifService.success(Const.CONFIGINIT, Const.CONFIGSUCCESS);
	}

}); // Fin du controller