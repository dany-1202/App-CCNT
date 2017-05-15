var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.service('PromiseDAO', function ($http, $q, SessionService, DateFactory) {

	return {
		insertEstablishment: function(dataEtablissement) {
			var deferred = $q.defer();
			var $res = $http.post("assets/php/insertEtablissementAPI.php", dataEtablissement);
			$res.then(function (data) {
				deferred.resolve(data);
			}).then(function (error) {
				deferred.resolve(error);
			});
			return deferred.promise;
		},
		departmentsReadyToDelete : function(dataDep) {
			var deferred = $q.defer();
			var $res = $http.post("assets/php/checkDepartmentsToDelete.php", dataDep);
			$res.then(function (data) {
				deferred.resolve(data);
			}).then(function (error) {
				deferred.resolve(error);
			});
			return deferred.promise;
		},
		insertDepartment: function(dataDep) {
			var deferred = $q.defer();
			var $res = $http.post("assets/php/insertDepartementAPI.php", dataDep);
			$res.then(function (data) {
				deferred.resolve(data);
			}).then(function (error) {
				deferred.resolve(error);
			});
			return deferred.promise;
		},
		deleteDepartment : function(dataDep) {
			var deferred = $q.defer();
			var $res = $http.post("assets/php/supDepartmentAPI.php", dataDep);
			$res.then(function (data) {
				deferred.resolve(data);
			}).then(function (error) {
				deferred.resolve(error);
			});
			return deferred.promise;
		},
		updateDepartment : function(dataDep) {
			var deferred = $q.defer();
			var $res = $http.post("assets/php/updateDepartmentAPI.php", dataDep);
			$res.then(function (data) {
				deferred.resolve(data);
			}).then(function (error) {
				deferred.resolve(error);
			});
			return deferred.promise;
		},
		getHourPreConfigure: function(tabDeps) {
			var deferred = $q.defer();
			
			for (var i = 0; i < tabDeps.length; i++) {
				var data = {user_id : SessionService.get('user_id'), user_token: SessionService.get('user_token'), dep_id: tabDeps.id};
				$res = $http.post('assets/php/getHoraireTypePreConfigAPI.php', data);
				$res.then(function(message) {
					if (message.data.length == 1) {deferred.resolve(message);}
				}).then(function(error){
					deferred.resolve(error);
				});
			}

			return deferred.promise;
		},
		updateOrCreatePreHours: function(tab) {
			var deferred = $q.defer();
			if (tab.length == 0) {deferred.resolve(true);}
			for (var i = tab.length - 1; i >= 0; i--) {
				var prehour = tab[i];
				var dataPreHours = {
					'hpr_id' : prehour.hpr_id, 
					'fin' : (i == 0 ? 1: 0),
					'hpr_nom': prehour.title, 
					'hpr_dep_id': prehour.dep.id, 
					'prehours': prehour.prehours,
					'user_id': SessionService.get('user_id'), 
					'user_token': SessionService.get('user_token') 
				};
				if (prehour.state == 'new') {
					var $res = $http.post("assets/php/insertHorairePreconfigureAPI.php", dataPreHours);
					$res.then(function (message) {
						console.log(message);
						if (message.config.data.fin == 1) {
							deferred.resolve(true);
						} else if (message.data == false) {
							deferred.resolve(false);
						}
					});
				} else if (prehour.state == 'modif') {
					if (i == 0) {
						deferred.resolve(true);
					}
					/*
					var $res = $http.post("assets/php/updateHorairePreconfigureAPI.php", dataPreHours);
					$res.then(function (message) {
						if (message.config.data.fin == 1) {
							deferred.resolve(true);
						} else if (message.data == false) {
							deferred.resolve(false);
						}
					});*/
				} else {
					if (i == 0) {
						deferred.resolve(true);
					}
				}
			}
			return deferred.promise;
		},
		getAllEmployees : function(data) {
			var deferred = $q.defer();
			var emps = [];
			var $promise = $http.post('assets/php/getEmployeesAPI.php', data);
			$promise.then(function (message) {
				var tab = message.data;
				for (var i = 0; i < tab.length; i++) {
					var person = tab[i];
					emps.push({
						id:person.id,nom:person.nom,prenom:person.prenom,
						adresse:person.adresse,code:person.codePostal,
						localite:person.ville,mail:person.mail,dep:person.dep,
						dateIn:person.contrat.dateIn == null ? null: new Date (person.contrat.dateIn),
						dateOut:person.contrat.dateOut == null ? null: new Date (person.contrat.dateOut),
						horaire:person.contrat.horaire,particularite:person.contrat.particularite,contrat:person.contrat.type, 
						dateNaissance: new Date(person.dateNaissance), telFixe: person.telFixe, telMobile: person.telMobile, 
						genre: person.genre, adresseSup: person.adresseSup
					});
				}
				deferred.resolve(emps);
			}).then(function(error) {
				deferred.resolve(error);
			});
			return deferred.promise;
		},
		getDeps : function(data) {
			var deferred = $q.defer();
			var deps = [];
			var $promise = $http.post('assets/php/getDepartementsAPI.php', data);
			$promise.then(function (message) {
				var tab = message.data;
				for (var i = 0; i < tab.length; i++) {
					var dep = tab[i];
					deps.push({
						id:dep.id,
						name:dep.name,
						carre: "carre-" + dep.img,
						format: 'label-carre-100',
						error: false,
						img: dep.img,
						state: dep.state
					});
				}
				deferred.resolve(deps);
			}).then(function(error) {
				deferred.resolve(error);
			});
			return deferred.promise;
		},
		getInfosEstablishment : function(data) {
			var deferred = $q.defer();
			var $promise = $http.post('assets/php/getInfosEstablishmentAPI.php', data);
			$promise.then(function (message) {
				var info = message.data;
				deferred.resolve(info);
			}).then(function(error) {
				deferred.resolve(error);
			});
			return deferred.promise;
		},
		getHolidays : function(data) {
			var deferred = $q.defer();
			var $promise = $http.post('assets/php/getFermetureInfosAPI.php', data);
			$promise.then(function (message) {
				var info = message.data;
				deferred.resolve(info);
			}).then(function(error) {
				deferred.resolve(error);
			});
			return deferred.promise;
		},
		insertHolidays : function(tab, idEstab) {
			var deferred = $q.defer();
			if (tab.length == 0) {deferred.resolve(true);}
			for (var i = tab.length - 1; i >= 0; i--) {
				var hol = tab[i];
				var dateDebut = hol.date != '' ? hol.date : hol.dateDebut;
				var dateFin = hol.date != '' ? hol.date : hol.dateFin;
				var dataFermetureInfo = {
					'id' : hol.id,
					'nom' : hol.title,
					'dateDebut': DateFactory.toDateTimeBDD(DateFactory.getDateStr(dateDebut)),
					'dateFin': DateFactory.toDateTimeBDD(DateFactory.getDateStr(dateFin)),
					'etaId': idEstab, 
					'user_id': SessionService.get('user_id'),
					'user_token': SessionService.get('user_token'),
					'fin' : (i == 0 ? 1: 0),
				};
				if (hol.state == 'modif') {
					var $res = $http.post("assets/php/updateFermetureInfoAPI.php", dataFermetureInfo);
					$res.then(function (message) {
						if (message.config.data.fin == 1) {
							deferred.resolve(true);
						} else if (message.data == false) {
							deferred.resolve(false);
						}
					});
				} else if(hol.state == 'new') {
					var $res = $http.post("assets/php/insertFermetureInfoAPI.php", dataFermetureInfo);
					$res.then(function (message) { 
						if (message.config.data.fin == 1) {
							deferred.resolve(true);
						} else if (message.data == false) {
							deferred.resolve(false);
						}
					});
				}
			}
			return deferred.promise;
		},
		deleteHolidays : function(tab, tabBDD, idEsta) {
			var deferred = $q.defer();
			var elDelete = [];
			var isHolidayToDelete = function(id) {
				for (var i = tab.length - 1; i >= 0; i--) {
					if (tab[i].id == id) {
						return false;
					}
				}
				return true;
			};
			for (var i = tabBDD.length - 1; i >= 0; i--) {
				if (isHolidayToDelete(tabBDD[i].id)) {
					elDelete.push(tabBDD[i]);
				}
			}
			

			for (var i = elDelete.length - 1; i >= 0; i--) {
				var hol = elDelete[i];
				var dateDebut = hol.date != '' ? hol.date : hol.dateDebut;
				var dateFin = hol.date != '' ? hol.date : hol.dateFin;
				var dataFermetureInfo = {
					'id' : hol.id,
					'user_id': SessionService.get('user_id'),
					'user_token': SessionService.get('user_token'),
					'idEta' : idEsta,
					'fin' : (i == 0 ? 1: 0),
				};
				$promise = $http.post('assets/php/supFermetureInfoAPI.php', dataFermetureInfo);
				$promise.then(function(message) {
					console.log(message);
					if (message.config.data.fin == 1) {
						deferred.resolve(true);
					} else if (message.data == false) {
						deferred.resolve(false);
					}
				});
			}
			if (elDelete.length == 0) {deferred.resolve(true);}

			return deferred.promise;
		},
		getPreHours: function(data) {
			var deferred = $q.defer();
			$promise = $http.post('assets/php/getHoraireTypePreConfigAPI.php', data);
			$promise.then(function(message) {
				deferred.resolve(message);
			}).then(function(error) {
				deferred.resolve(error);
			});
			return deferred.promise;
		},
		deletePreHours : function(tab, tabBDD) {
			var deferred = $q.defer();
			var elDelete = [];

			var isPreHourToDelete = function(id) {
				for (var i = tab.length - 1; i >= 0; i--) {
					if (id == tab[i].hpr_id) {
						return false;
					}
				}
				return true;
			}

			for (var i = tabBDD.length - 1; i >= 0; i--) {
				if (isPreHourToDelete(tabBDD[i].hpr_id)) {
					elDelete.push(tabBDD[i]);
				}
			}

			console.log(elDelete);
			
			for (var i = elDelete.length - 1; i >= 0; i--) {
				var prehour = elDelete[i];
				var dataPreHours = { 
					'hpr_id': prehour.hpr_id, 
					'fin': ((i == 0) ?1 :0), 
					'user_id': SessionService.get('user_id'), 
					'user_token': SessionService.get('user_token') 
				}
				$promise = $http.post('assets/php/supHoraireTypePreConfigAPI.php', dataPreHours);
				$promise.then(function(message) {
					console.log(message);
					if (message.config.data.fin == 1) {
						deferred.resolve(true);
					} else if (message.data == false) {
						deferred.resolve(false);
					}
				});
			}
			if (elDelete.length == 0) {deferred.resolve(true);}
			return deferred.promise;
		},
		getHoursOpenning: function(data) {
			var deferred = $q.defer();
			$promise = $http.post('assets/php/getOuvertureInfosAPI.php', data);
			$promise.then(function(message) {
				deferred.resolve(message);
			}).then(function(error) {
				deferred.resolve(error);
			});
			return deferred.promise;
		},
		updateOrCreateHours : function(tab) {
			var deferred = $q.defer();
			if (tab.length == 0) {deferred.resolve(true);}
			for (var i = tab.length - 1; i >= 0; i--) {
				var hour = tab[i];
				/*
				var dataFermetureInfo = {
					'id' : hol.id,
					'nom' : hol.title,
					'dateDebut': DateFactory.toDateTimeBDD(DateFactory.getDateStr(dateDebut)),
					'dateFin': DateFactory.toDateTimeBDD(DateFactory.getDateStr(dateFin)),
					'etaId': idEstab, 
					'user_id': SessionService.get('user_id'),
					'user_token': SessionService.get('user_token'),
					'fin' : (i == 0 ? 1: 0),
				};
				if (hol.state == 'modif') {
					var $res = $http.post("assets/php/updateFermetureInfoAPI.php", dataFermetureInfo);
					$res.then(function (message) {
						if (message.config.data.fin == 1) {
							deferred.resolve(true);
						} else if (message.data == false) {
							deferred.resolve(false);
						}
					});
				} else if(hol.state == 'new') {
					var $res = $http.post("assets/php/insertFermetureInfoAPI.php", dataFermetureInfo);
					$res.then(function (message) { 
						if (message.config.data.fin == 1) {
							deferred.resolve(true);
						} else if (message.data == false) {
							deferred.resolve(false);
						}
					});
				}
				*/
			}
			return deferred.promise;
		},
		deleteHours : function(tab, tabBDD) {
			var deferred = $q.defer();
			var elDelete = [];

			var isHourToDelete = function(id) {
				for (var i = tab.length - 1; i >= 0; i--) {
					if (id == tab[i].id) {
						return false;
					}
				}
				return true;
			}

			for (var i = tabBDD.length - 1; i >= 0; i--) {
				if (isHourToDelete(tabBDD[i].hpr_id)) {
					elDelete.push(tabBDD[i]);
				}
			}

			console.log(elDelete);
			
			for (var i = elDelete.length - 1; i >= 0; i--) {
				var hour = elDelete[i];
				var dataHours = {};
				$promise = $http.post('assets/php/supHoraireTypePreConfigAPI.php', dataHours);
				$promise.then(function(message) {
					console.log(message);
					if (message.config.data.fin == 1) {
						deferred.resolve(true);
					} else if (message.data == false) {
						deferred.resolve(false);
					}
				});
			}
			if (elDelete.length == 0) {deferred.resolve(true);}
			return deferred.promise;
		},
		updateEstablishment: function(data) {
			var deferred = $q.defer();
			$promise = $http.post('assets/php/updateEstablishmentAPI.php', data);
			$promise.then(function(message) {
				console.log(message);
				deferred.resolve(message);
			}).then(function(error) {
				deferred.resolve(error);
			});
			return deferred.promise;
		}

	}
	
	
	
	
})
