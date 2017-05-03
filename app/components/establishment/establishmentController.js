var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('establishmentController', function ($route, PromiseDAO, $timeout, $rootScope, $mdDialog, $scope, $http, $location, $mdpDatePicker, $mdpTimePicker, SessionService, NotifService, Const, State, Postaux, DateFactory, Popover) {
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

	$scope.getDepartments = function() {
		PromiseDAO.getDeps(data).then(function(res){
			$scope.depart = res;
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
			for (var i = 0; i < $scope.depart.length; i++) {
				var data = {'user_id': SessionService.get('user_id'), 'user_token': SessionService.get('user_token'), dep_id: $scope.depart[i].id};
				PromiseDAO.getPreHours(data).then(function(res) {
					for (var i = 0; i < res.data.length; i++) {
						var data = res.data[i];
						for (var i = 0; i < data.length; i++) {
							if (!data[i].liste) {
								var liste = getListe(data[i], res.data);
								$scope.prehours.push(
								{
									prehours: getCalPreHours(liste), 
									title: data[i].nom,
									dep:  getDepById(res.config.data.dep_id),
									liste : liste,
								}
								);
							}
						}
					}
				});
			}
		}

		$scope.selectedDates = [];
		$scope.plagesEvents = [];
		$scope.events = [];
		$scope.calEvents = [];

		$scope.modifCCNT = function(val) {
			console.log($scope.hoursCCNTChosen);
		}

		$scope.getHolidays = function() {
			PromiseDAO.getHolidays(data).then(function(res){
				for (var i = 0; i < res.length; i++) {
					var dateDebut = new Date(res[i].dateDebut);
					
					if (res[i].dateFin== 0 || res[i].dateFin== '0') {
						$scope.events.push(
						{
							date: dateDebut.getDate() + "/" + (dateDebut.getMonth() + 1) + "/" + dateDebut.getFullYear(),
							dateDebut: '',
							dateFin: '',
							title:  res[i].title,
							color: '#5D4037',
							content: '<img class="image" src="' +  Const.PHOTOFERMETURE +'">',
							class: '',
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
							date: '',
							dateDebut: dateDebut.getDate() + "/" + (dateDebut.getMonth() + 1) + "/" + dateDebut.getFullYear(),
							dateFin: dateFin.getDate() + "/" + (dateFin.getMonth() + 1) + "/" + dateFin.getFullYear(),
							title:  res[i].title,
							color: '#5D4037',
							content: '<img class="image" src="' + Const.PHOTOFERMETURE +'">',
							class: '',
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
		 	for (var i = 0; i < $scope.calEvents.length; i++) {
		 		var dataFermetureInfo = {
		 			'date': DateFactory.toDateTimeBDD(DateFactory.getDateStr($scope.calEvents[i].date)),
		 			'etaId': idEstablishment, 'user_id': SessionService.get('user_id'),
		 			'user_token': SessionService.get('user_token')
		 		};
		 		var $res = $http.post("assets/php/insertFermetureInfoAPI.php", dataFermetureInfo);
		 		$res.then(function (message) { console.log(message); });
		 	};

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
				NotifService.success("Changements mis à jour", "Les informations de l'établissement ont été mises à jour");
			} else {
				NotifService.error("Problème mise à jour", "Les informations de l'établissement n'ont pas pu être mis à jour");
			}
		});
	}

	$scope.saveDepartments = function() {
		console.log('deps');
		console.log($scope.idEsta);
		
		/*
		for (var i = 0; i < $scope.depart.length; i++) {
			var department = $scope.depart[i];
			var dataDep = { 'nom': department.name, 'img': (i + 1), 'noEta': $scope.idEsta, 'user_id': SessionService.get('user_id'), 'user_token': SessionService.get('user_token') };
			PromiseDAO.insertDepartment(dataDep).then(function(value) {
				console.log("Insertion Départements");
				console.log(value);
			}).then(function(value) {});
		}*/
	}

	$scope.savePreHours = function() {
		console.log('prehours');
	}

	$scope.saveHours = function() {
		console.log('hours');
	}

	$scope.saveHolidays = function() {
		console.log('holidays');
	}



})