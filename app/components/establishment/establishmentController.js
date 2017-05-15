var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('establishmentController', function ($route, $q, PromiseDAO, $timeout, $rootScope, $mdDialog, $scope, $http, $location, $mdpDatePicker, $mdpTimePicker, SessionService, NotifService, Const, State, Postaux, DateFactory, Popover) {
	$scope.$route = $route;

	$scope.stateModif = $scope;

	$scope.state = true;
	$scope.nbSteps = 5; // Nombre d'étapes de la configuration initiale
	$scope.nbPercentage = 20; // Pourcentage en fonction de l'avancement de la configuration
	$scope.currentDate = new Date(); // Récupère la date d'aujourd'hui
	$scope.currentView = 1; // Vue courante (1: Informations de l'établissement)
	$scope.pourcentage = 20; // Valeur de pourcentage, avancement des étapes
	$scope.hoursCCNTChosen = 45; // Valeur heures soumis CCNT
	$scope.textStep = (window.innerWidth >= 700) ? "Étape: " : "";

	$scope.nbPause = [];
	for (var nb = 0; nb <= 60; nb+=5) {$scope.nbPause.push({name: nb + ' minutes', value:nb});}

		var data = {'user_id': SessionService.get('user_id'), 'user_token': SessionService.get('user_token')};
	/* Regarde si les nopostaux ont déjà été chargé ou pas */
	if (angular.isUndefined($scope.postaux)) {Postaux.query(function(data) {$scope.postaux = data;});}

	/* Savoir si c'est la première visite pour les afficher ou non les popovers : p
	 - Si c'est la première fois les popovers sont à true sinon il passe à false
	 */
	 $scope.tabCalendars = [];
	 $scope.tabCalendarsBDD = [];
	 $scope.idEsta = -1;
	// {id: 0, name: Const.HORAIREBASE, period: {debut: "", fin: ""}, hours: state.getTabCalDefault(), state: Const.INCOMP, errorName: false, errorPeriod:true, choix: null}


	var tabContains = function(nom, tab) {
		for (var i = 0; i < tab.length; i++) {
			if (tab[i].name === nom) {
				return true;
			}
		}
		return false;
	}

	var allDateContinue = function(dates, nom) {
		var count = 0;
		for (var i = 0; i < dates.length; i++) {
			if ((dates[i].nom == nom) && (dates[i].matinFin == null && dates[i].soirDebut == null)) {
				count++;
			}
		}
		return count == 0;
	}

	var getOuvertures = function(tableau, nom) {
		var data = State.getTabCalDefault();
		for (var i = 0; i < data.length; i++) {
			for (var cpt = 0; cpt < tableau.length; cpt++) {

				if ((tableau[cpt].nom == nom) && (tableau[cpt].jour == data[i].id)) {
					data[i].matin = {debut: tableau[cpt].matinDebut, fin: tableau[cpt].matinFin};
					data[i].soir = {debut: tableau[cpt].soirDebut, fin: tableau[cpt].soirFin};
					var choix = {};
					if (allDateContinue(tableau, nom)) {
						choix = State.changeChoix(0);
					} else {
						choix = State.changeChoix(1);
					}
					data[i].pause = {existe: (tableau[cpt].matinFin != null && tableau[cpt].soirDebut != null) };
					data[i].choix = choix;
				}
			}
		}
		return data;
	}

	$scope.getHours = function() {
		PromiseDAO.getHoursOpenning(data).then(function(res) {

			var objet = res.data;
			for (var i = 0; i < objet.length; i++) {
				if (!tabContains(objet[i].nom, $scope.tabCalendars)) {
					var liste = getOuvertures(objet, objet[i].nom);
					$scope.tabCalendars.push({id: objet[i].id, name: objet[i].nom, period: {debut: objet[i].dateDebut, fin: objet[i].dateFin}, hours: liste, state: Const.COMP, errorName: false, errorPeriod:false, choix: {id: 0, nom:Const.CONTINUE, color: Const.COLORCONTINUE}});
				}
			}
			$scope.tabCalendarsBDD = angular.copy($scope.tabCalendars);
			console.log($scope.tabCalendars);

		});
	}

	$scope.getHours();


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
	$scope.depart = [];
	$scope.departBDD = []; // Pour les suppressions des départements
	$scope.getDepartments = function() {
		PromiseDAO.getDeps(data).then(function(res){
			$scope.depart = res;
			$scope.departBDD = angular.copy($scope.depart);
			$scope.getPreHours();
		});
	}

	$scope.getDepartments();

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
	];

	$scope.ccntHeure = [
		{ id: 1, name: "42 Heures", value: Const.CCNT1},
		{ id: 2, name: "43.5 Heures", value: Const.CCNT2 },
		{ id: 3, name: "45 Heures", value: Const.CCNT3 }
	];

	$scope.getInfosEstablishment = function() {
		PromiseDAO.getInfosEstablishment(data).then(function(res) {
			$scope.infoEtablissement[0].value = res.nom;
			$scope.infoEtablissement[1].value = res.adresse;
			$scope.infoEtablissement[2].value = res.adresseInfo;
			$scope.infoEtablissement[3].value = {no: res.codePostal, nom: res.localite};
			$scope.infoEtablissement[4].value = res.telDirection;
			$scope.infoEtablissement[5].value = res.telReservation;
			$scope.infoEtablissement[6].value = res.email;
			$scope.infoEtablissement[7].value = res.siteWeb;
			$scope.idEsta = res.id;
			$scope.hoursCCNTChosen = res.nbHeure;
		});
	}

	$scope.getInfosEstablishment();
	$scope.prehours = [];
	$scope.preHoursBDD = [];

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

	var getDepById  = function(id) {
		for (var i = 0; i < $scope.depart.length; i++) {
			if ($scope.depart[i].id == id) {
				return $scope.depart[i];
			}
		}
		return null;
	}

	var getPauseByMinutes = function(min) {
		for (var i = 0; i < $scope.nbPause.length; i++) {
			if ($scope.nbPause[i].value == min) {
				return $scope.nbPause[i];
			}
		}
		return $scope.nbPause[0];
	}

	var getCalPreHours = function(liste) {
		var tab = State.getTabCalDefaultWithPause();
		for (var i = tab.length - 1; i >= 0; i--) {
			tab[i].datapauseMatin = getPauseByMinutes(0);
			tab[i].datapauseSoir = getPauseByMinutes(0);
		}
		for (var cpt = 0; cpt< liste.length; cpt++) {
			for (var i = 0; i < tab.length; i++) {
				if (liste[cpt].jour == tab[i].id) {
					tab[i].matin.debut = ((DateFactory.getTimeStr(liste[cpt].heureDebut) == 'Invalid date') ? Const.HOUR_OPEN : DateFactory.getTimeStr(liste[cpt].heureDebut));
					tab[i].matin.fin = ((DateFactory.getTimeStr(liste[cpt].heureFin) == 'Invalid date') ? Const.HOUR_END : DateFactory.getTimeStr(liste[cpt].heureFin));
					tab[i].soir.debut = ((DateFactory.getTimeStr(liste[cpt].heureDebutS) == 'Invalid date') ? Const.HOUR_OPEN : DateFactory.getTimeStr(liste[cpt].heureDebutS));
					tab[i].soir.fin = ((DateFactory.getTimeStr(liste[cpt].heureFinS) == 'Invalid date') ? Const.HOUR_END : DateFactory.getTimeStr(liste[cpt].heureFinS));
					tab[i].datapauseMatin = getPauseByMinutes(liste[cpt].pause);
					tab[i].datapauseSoir = getPauseByMinutes(liste[cpt].pauseS);
				}
			}
		}
		return tab;
	} 


	$scope.getPreHours = function() {
		$scope.prehours.splice(0, $scope.prehours.length);
		for (var i = 0; i < $scope.depart.length; i++) {
			var data = {'user_id': SessionService.get('user_id'), 'user_token': SessionService.get('user_token'), dep_id: $scope.depart[i].id};
			PromiseDAO.getPreHours(data).then(function(res) {
				console.log(res);
				for (var c = 0; c < res.data.length; c++) {
					var data = res.data[c];
					for (var t = 0; t < data.length; t++) {
						if (!data[t].liste) {
							var liste = getListe(data[t], res.data);
							$scope.prehours.push(
								{
									prehours: getCalPreHours(liste), 
									title: data[t].nom,
									dep:  getDepById(res.config.data.dep_id),
									liste : liste,
									state : 'modif',
									hpr_id : data[t].id,
								}
							);
						}
					}
				}
				$scope.preHoursBDD = angular.copy($scope.prehours);
			});
		}
	}

	$scope.selectedDates = [];
	$scope.events = [];
	$scope.plagesEvents = [];
	$scope.eventsBDD = [];
	$scope.calEvents = [];

	$scope.modifCCNT = function(val) {
		console.log($scope.hoursCCNTChosen);
	}

	$scope.getHolidays = function() {
		PromiseDAO.getHolidays(data).then(function(res){
			console.log(res);

			$scope.events.splice(0, $scope.events.length);
			$scope.plagesEvents.splice(0, $scope.plagesEvents.length);
			$scope.eventsBDD.splice(0, $scope.eventsBDD.length);

			for (var i = 0; i < res.length; i++) {
				var dateDebut = new Date(res[i].dateDebut);
				
				if (res[i].dateDebut == res[i].dateFin) {
					$scope.events.push(
						{
							id : res[i].id,
							date: dateDebut.getDate() + "/" + (dateDebut.getMonth() + 1) + "/" + dateDebut.getFullYear(),
							dateDebut: '',
							dateFin: '',
							title:  res[i].title,
							color: '#5D4037',
							content: '<img class="image" src="' +  Const.PHOTOFERMETURE +'">',
							class: '',
							state: 'modif'
						}
					);
					$scope.calEvents.push(
						{
							date: dateDebut.getDate() + "/" + (dateDebut.getMonth() + 1) + "/" + dateDebut.getFullYear(),
							title: res[i].title,
							color: '#5D4037',
							content: '<img class="image" src="' +  Const.PHOTOFERMETURE +'">',
							class: '',
						}
					);
				} else {
					var dateFin = new Date(res[i].dateFin);
					$scope.plagesEvents.push(
						{
							id : res[i].id,
							date: '',
							dateDebut: dateDebut.getDate() + "/" + (dateDebut.getMonth() + 1) + "/" + dateDebut.getFullYear(),
							dateFin: dateFin.getDate() + "/" + (dateFin.getMonth() + 1) + "/" + dateFin.getFullYear(),
							title:  res[i].title,
							color: '#5D4037',
							content: '<img class="image" src="' + Const.PHOTOFERMETURE +'">',
							class: '',
							state: 'modif'
						}
					);
					while(dateDebut <= dateFin){
						$scope.calEvents.push(
							{
								date: dateDebut.getDate() + "/" + (dateDebut.getMonth() + 1) + "/" + dateDebut.getFullYear(),
								title: res[i].title,
								color: '#5D4037',
								content: '<img class="image" src="' +  Const.PHOTOFERMETURE +'">',
								class: '',
							}
						);
						dateDebut = moment(dateDebut).add(1, 'days').toDate();
					}
				}

			}
			$scope.eventsBDD = angular.copy($scope.events.concat($scope.plagesEvents));

		});
	}

	$scope.getHolidays();

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


	var insertJourPreConfigure = function(hpr_id) {
		console.log(hpr_id);
		// Insertion table ccn_jourpreconfigure
	}
	
	var insertHorairePreconfigure = function (nom, id) {
		for (var cpt = 0; cpt < $scope.prehours.length; cpt++) {
			var objPreHour = $scope.prehours[cpt];
			if (objPreHour.dep.name == nom) {
				console.log(objPreHour.prehours);
				var data = { 'hpr_nom': objPreHour.title, 'hpr_dep_id': id, 'prehours': objPreHour.prehours,'user_id': SessionService.get('user_id'), 'user_token': SessionService.get('user_token') };
				var $res = $http.post("assets/php/insertHorairePreconfigureAPI.php", data);
				$res.then(function (msgPre) {
					console.log('Insertion jour ');
					console.log(msgPre);
				});
			}
		};
	}
	
	/*****************************************************************************************\
	* Formater date en datetime pour la base de données *                        
	\*****************************************************************************************/

	var formatDatesPreHour = function() {
		var formatJour = function(matinOuSoir) {
			if (matinOuSoir.debut != Const.HOUR_OPEN) {matinOuSoir.debut = DateFactory.toDateTimeBDD(matinOuSoir.debut);}
			if (matinOuSoir.fin != Const.HOUR_END) {matinOuSoir.fin =DateFactory.toDateTimeBDD(matinOuSoir.fin);}
		}
		for (var i = 0; i < $scope.prehours.length; i++) {
			var obj = $scope.prehours[i].prehours;
			for (var cpt = 0; cpt < obj.length; cpt++) {
				formatJour(obj[i].matin);
				formatJour(obj[i].soir);
			}
		}
	}

	this.saveConfiguration = function () {
		$timeout(Popover.hide(), 0);

		formatDatesPreHour(); // Formate dates nécessaires
		
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

		PromiseDAO.insertEstablishment(dataEtablissement).then(function(value) {
			// console.log("Insertion Etablissement");
		 	//    console.log(value);
		 	var idEstablishment = value.data;
		 	for (var i = 0; i < $scope.depart.length; i++) {
		 		var department = $scope.depart[i];
		 		var dataDep = { 'nom': department.name, 'img': (i + 1), 'noEta': idEstablishment, 'user_id': SessionService.get('user_id'), 'user_token': SessionService.get('user_token') };
		 		PromiseDAO.insertDepartment(dataDep).then(function(value) {
		 			console.log("Insertion Départements");
		 			console.log(value);
		 			insertHorairePreconfigure(value.config.data.nom, value.data);
		 		}).then(function(value) {});
		 	}

		 	var data = {
		 		'eta_id': idEstablishment,
		 		'user_id': SessionService.get('user_id'),
		 		'user_token': SessionService.get('user_token')
		 	};

		 	for (var i = 0; i < $scope.tabCalendars.length; i++) {
		 		var cal = $scope.tabCalendars[i];
		 		if (i != 0) {
		 			cal.period.debut = DateFactory.toDateTimeBDD(cal.period.debut);
		 			cal.period.fin = DateFactory.toDateTimeBDD(cal.period.fin);
		 		}
		 		for (var cpt = 0; cpt < cal.hours.length; cpt++) {
		 			var obj = cal.hours[cpt];
		 			if (obj.matin.fin == Const.END || obj.soir.debut == Const.OPEN) {
		 				obj.matin.debut = DateFactory.toDateTimeBDD(obj.matin.debut);
		 				obj.soir.fin = DateFactory.toDateTimeBDD(obj.soir.fin);
		 			} else {
		 				obj.matin.debut = DateFactory.toDateTimeBDD(obj.matin.debut);
		 				obj.matin.fin = DateFactory.toDateTimeBDD(obj.matin.fin);
		 				obj.soir.debut = DateFactory.toDateTimeBDD(obj.soir.debut);
		 				obj.soir.fin = DateFactory.toDateTimeBDD(obj.soir.fin);
		 			}
		 		}
		 	}

		 	var $res = $http.post("assets/php/updatePersonneEstablishmentAPI.php", data);
		 	$res.then(function (message) { });
		 	console.log($scope.tabCalendars);
		 	/* Insertion des horaires de l'établissement */
		 	for (var i = 0; i < $scope.tabCalendars.length; i++) {
		 		var cal = $scope.tabCalendars[i];
		 		var type = (i == 0 ? 1 : 0);
		 		var dataInsertOuvertureInfo = {
		 			'nom': cal.name,
		 			'base': type,
		 			'hours': cal.hours,
		 			'dateDebut': cal.period.debut,
		 			'dateFin': cal.period.fin,
		 			'etaId': idEstablishment,
		 			'user_id': SessionService.get('user_id'),
		 			'user_token': SessionService.get('user_token')
		 		};
		 		var $res = $http.post("assets/php/insertOuvertureInfoAPI.php", dataInsertOuvertureInfo);
		 		$res.then(function (message) {
		 			console.log(message)
		 		});
		 	}

		 	/* Insertion des jours fériés et vacances */
		 	var tab = $scope.events.concat($scope.plagesEvents);
			PromiseDAO.insertHolidays(tab, idEstablishment).then(function(message){
				console.log(message);
			});

		 }).then(function(value) {});

		if ($rootScope.user != null) { $rootScope.user.config = true; }
		SessionService.set('user_configured', true);
		$location.path('/home?state=1');
		NotifService.success(Const.CONFIGINIT, Const.CONFIGSUCCESS);
	}

	$scope.changeState = function(id, event) {
		console.log();
		$($('#item' + $scope.currentView)[0].parentElement).removeClass('tab-current');
		$scope.currentView = id;
		$($(event.target)[0].parentElement).addClass('tab-current');
	}

	$scope.saveEstablishment = function() {
		$('#saveEsta').text("");
		$('#saveEsta').addClass("loading");
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
		console.log($scope.hoursCCNTChosen);
		PromiseDAO.updateEstablishment(dataEtablissement).then(function(res){
			if (res != -1) {
				$timeout(function() {
					$('#saveEsta').append("<i class='fa fa-floppy-o' aria-hidden='true' style='margin-right: 3px'></i> Enregistrer");
					$('#saveEsta').removeClass("loading");
					NotifService.success("Changements mis à jour", "Les informations de l'établissement ont été mises à jour");
				}, 100);
			} else {
				NotifService.error("Problème mise à jour", "Les informations de l'établissement n'ont pas pu être mis à jour");
			}
		});
	}

	var isDeleted = function(id, tab) {
		for (var i = 0; i < tab.length; i++) {
			if (id == tab[i].id) {
				return false;
			}
		}
		return true;
	}



	var updateOrCreateDeps = function() {
		var deferred = $q.defer();
		if ($scope.depart.length == 0) {deferred.resolve('fin');}
		for (var i = 0; i < $scope.depart.length; i++) {
			var department = $scope.depart[i];
			var dataDep = {id: department.id, pos: i, fin: ((i == $scope.depart.length - 1) ? 1 : 0), 'nom': department.name, 'img': (i + 1), 'noEta': $scope.idEsta, 'user_id': SessionService.get('user_id'), 'user_token': SessionService.get('user_token') };
			if (department.state == 'new') {
					// Insertion du département
				PromiseDAO.insertDepartment(dataDep).then(function(value) {
					if (value.data == false) {deferred.resolve('problème');}
					
					$scope.depart[value.config.data.pos].id = value.data;
					$scope.depart[value.config.data.pos].state = 'modif';
					if (value.config.data.fin == 1) {deferred.resolve(value);}
				});

			} else if (department.state == 'modif') {
				// Modification du département
				PromiseDAO.updateDepartment(dataDep).then(function(value) {
					console.log(value);
					if (value.config.data.fin == 1) {
						deferred.resolve(value);
					}
					if (value.data == false) {deferred.resolve('problème');}
				});
			} else {
				if (i == $scope.depart.length - 1) {
					deferred.resolve("fin");
				}
			}
		}
		return deferred.promise;
	}

	var deleteDepartmentsBDD = function() {
		var deferred = $q.defer();
		for (var i = 0; i < $scope.departBDD.length; i++) {
			var dep = $scope.departBDD[i];
			if (isDeleted(dep.id, $scope.depart)) {
				PromiseDAO.deleteDepartment({ 'id': dep.id, fin: ((i == $scope.departBDD.length - 1) ? 1 : 0), 'user_id': SessionService.get('user_id'), 'user_token': SessionService.get('user_token') }).then(function(message){
					if (message.config.data.fin == 1) {
						deferred.resolve(message);
					}
				});
			} else {
				if (i == $scope.departBDD.length - 1) {
					deferred.resolve("fin");
				}
			}
		}
		
		return deferred.promise;
	}

	$scope.saveDepartments = function() {
		$('#saveDeps').text("");
		$('#saveDeps').addClass("loading");
		updateOrCreateDeps().then(function(value){
			if (value == 'problème') {
				NotifService.error('Problème mis à jour', 'Les départements de votre établissement n\'ont pas pu se mettre à jour');
				return;
			}
			deleteDepartmentsBDD().then(function(message){
				$scope.getDepartments();
				//$scope.prehours = [];
				$('#saveDeps').append("<i class='fa fa-floppy-o' aria-hidden='true' style='margin-right: 3px'></i> Enregistrer");
				$('#saveDeps').removeClass("loading");
				NotifService.success("Changements mis à jour", "Les départements de votre établissement ont été mis à jour");
			});
		});
	}

	var deletePreHoursBDD = function(tab, tabBDD) {
		var deferred = $q.defer();
		PromiseDAO.deletePreHours(tab, tabBDD).then(function(message){
			deferred.resolve(message);
		});
		return deferred.promise;
	}

	var updateOrCreatePreHours = function(tab) {
		var deferred = $q.defer();
		PromiseDAO.updateOrCreatePreHours(tab).then(function(message){
			deferred.resolve(message);
		});
		return deferred.promise;
	}

	$scope.savePreHours = function() {
		$('#savePreHours').text("");
		$('#savePreHours').addClass("loading");
		var tab = $scope.prehours;
		var tabBDD = $scope.preHoursBDD;

		updateOrCreatePreHours(tab).then(function(message) {
			if (message) {
				console.log(tab);
				console.log(tabBDD);
				deletePreHoursBDD(tab, tabBDD).then(function(value){
					// Je récupère les départements de la base !
					$scope.getPreHours();
					$('#savePreHours').append("<i class='fa fa-floppy-o' aria-hidden='true' style='margin-right: 3px'></i> Enregistrer");
					$('#savePreHours').removeClass("loading");
					NotifService.success("Changements mis à jour", "Les horaires pré-configurés ont été mis à jour");
				});
			} else {
				$scope.getPreHours();
				$('#savePreHours').append("<i class='fa fa-floppy-o' aria-hidden='true' style='margin-right: 3px'></i> Enregistrer");
				$('#savePreHours').removeClass("loading");
				NotifService.error('Problème mis à jour', 'Les horaires pré-configurés n\'ont pas pu être mis à jour');
			}
		});
	}

	var deleteHoursBDD = function(tab, tabBDD) {
		var deferred = $q.defer();
		PromiseDAO.deleteHours(tab, tabBDD).then(function(message){
			deferred.resolve(message);
		});
		return deferred.promise;
	}

	var updateOrCreateHours = function(tab) {
		var deferred = $q.defer();
		PromiseDAO.updateOrCreateHours(tab).then(function(message){
			deferred.resolve(message);
		});
		return deferred.promise;
	}

	$scope.saveHours = function() {
		$('#saveHours').text("");
		$('#saveHours').addClass("loading");
		var tab = $scope.tabCalendars;
		var tab = $scope.tabCalendarsBDD;
		updateOrCreateHours(tab).then(function(message) {
			if (message) {
				deleteHours(tab, tabBDD).then(function(messageDel) {
					$('#saveHours').append("<i class='fa fa-floppy-o' aria-hidden='true' style='margin-right: 3px'></i> Enregistrer");
					$('#saveHours').removeClass("loading");
					if (messageDel) {
						$scope.getHolidays();
						NotifService.success("Changements mis à jour", "Les fermetures de l'établissement ont été mises à jour");
					} else {
						NotifService.error('Problème mis à jour', 'Les fermetures de votre établissement n\'ont pas pu être mis à jour');
					}
				});
			} else {
				$('#saveHours').append("<i class='fa fa-floppy-o' aria-hidden='true' style='margin-right: 3px'></i> Enregistrer");
				$('#saveHours').removeClass("loading");
				NotifService.error('Problème mis à jour', 'Les fermetures de votre établissement n\'ont pas pu être mis à jour');
			}
		});
	}

	var updateOrCreateHolidays = function(tab) {
		var deferred = $q.defer();
		PromiseDAO.insertHolidays(tab, $scope.idEsta).then(function(message){
			deferred.resolve(message)
		});
		return deferred.promise;
	}

	var deleteHolidays = function(tab) {
		var deferred = $q.defer();
		PromiseDAO.deleteHolidays(tab, $scope.eventsBDD, $scope.idEsta).then(function(message){
			deferred.resolve(message)
		});
		return deferred.promise;
	}

	$scope.saveHolidays = function() {
		$('#saveHolidays').text("");
		$('#saveHolidays').addClass("loading");
		var tab = $scope.events.concat($scope.plagesEvents);
		updateOrCreateHolidays(tab).then(function(message) {
			if (message) {
				deleteHolidays(tab).then(function(messageDel) {
					$('#saveHolidays').append("<i class='fa fa-floppy-o' aria-hidden='true' style='margin-right: 3px'></i> Enregistrer");
					$('#saveHolidays').removeClass("loading");
					if (messageDel) {
						$scope.getHolidays();
						NotifService.success("Changements mis à jour", "Les fermetures de l'établissement ont été mises à jour");
					} else {
						NotifService.error('Problème mis à jour', 'Les fermetures de votre établissement n\'ont pas pu être mis à jour');
					}
				});
			} else {
				$('#saveHolidays').append("<i class='fa fa-floppy-o' aria-hidden='true' style='margin-right: 3px'></i> Enregistrer");
				$('#saveHolidays').removeClass("loading");
				NotifService.error('Problème mis à jour', 'Les fermetures de votre établissement n\'ont pas pu être mis à jour');
			}
		});
	}



})