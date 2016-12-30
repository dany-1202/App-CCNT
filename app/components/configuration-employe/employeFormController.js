var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('employeFormController', function($timeout, $rootScope, $scope, $http, $location, SessionService, NotifService) {

	$scope.user = {};
  $scope.idUser = -1;
	$scope.user.configuration = SessionService.get('user_configured');

  $scope.deps = [];
  $scope.horaire = [{name:"Par heure"},{name:'Mensuel'},{name:'Spécial'},{name:'Cadre'}];
  $scope.monHoraire = $scope.horaire[0];

  $scope.contrat = [{name:"Normal"},{name:'Apprentissage'},{name:'Personne externe'}];
  $scope.monContrat = $scope.contrat[0];

  var getDeps = function () {
    var data = {user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token')};
    var $promise = $http.post('assets/php/getDepartementsAPI.php', data);
    $promise.then(function (message) {
      var tab = message.data;
      for (var i = 0; i < tab.length; i++) {
        $scope.deps.push(tab[i]);
      }
    });
    $scope.monDep = $scope.deps[0];
  }

  var getHoraires = function () {

  }

  var getTypeContrat = function () {

  }

  getDeps();
  getHoraires();
  getTypeContrat();

  $scope.genres = [{name: "Masculin", checked: true}, {name:"Féminin", checked: false}];

  $scope.pourcentage = [
    {name:"20%",value:0.20},{name:"25%",value:0.25},{name:"30%",value:0.30},{name:"35%",value:0.35},{name:"40%",value:0.40},
    {name:"45%",value:0.45},{name:"50%",value:0.50},{name:"55%",value:0.55},{name:"60%",value:0.60},{name:"65%",value:0.65},
    {name:"70%",value:0.70},{name:"75%",value:0.75},{name:"80%",value:0.80},{name:"85%",value:0.85},{name:"90%",value:0.90},
    {name:"95%",value:0.95},{name:"100%",value:1.0},
  ];
  $scope.monPourc = $scope.pourcentage[0];

  
  $scope.showMen = false; // Savoir si on doit afficher champs mensuel
  $scope.showSpe = false; // Savoir si on doit afficher champs spécial

  $scope.nbHeure = 0; // nb d'heure spécifier dans le champs 

  $scope.validations = [
                    {name:"Nom",valide:true},{name:"Prenom",valide:true},{name:"Adresse",valide:true},
                    {name:"code",valide:true},{name:"localite",valide:true},{name:"mail",valide:true},
                    {name:"dep",valide:true},{name:"dateIn",valide:true},{name:"dateOut",valide:true},
                    {name:"horaire",valide:true},{name:"particularite",valide:true},{name:"contrat",valide:true},
                    {name:"dateNaissance", valide:true},{name:"telFixe", valide:true},{name:"telMobile", valide:true}
                    ];


  //verification si un utilisateur a été sélectionné pour etre modifier
  if($rootScope.myEmp == null){
    $scope.myEmp = {id:1,nom:'', prenom:'',adresse:'',code:0,localite:'',mail:'' ,dep: 'Bar',dateIn:null,dateOut:null,horaire:"Par heure",particularite:0,contrat:"Normal"};
  }else{
    $scope.myEmp = angular.copy($rootScope.myEmp);
    //met a jour le dep
    console.log($scope.myEmp);
    for (var i = $scope.deps.length - 1; i >= 0; i--) {
      
      if($scope.deps[i].name == $scope.myEmp.dep.nom){

          $scope.monDep = $scope.deps[i];
      };
    };
    //met a jour le champ de l'horaire
    for (var i = $scope.horaire.length - 1; i >= 0; i--) {
      // si on trouve le type d'horaire
      if($scope.horaire[i].name == $scope.myEmp.horaire.nom){
          $scope.monHoraire = $scope.horaire[i];
          if($scope.horaire[i].name == "Mensuel"){
            //boucle de parcours pour trouver la valeur du pourcentage de travail
            for (var k = $scope.pourcentage.length - 1; k >= 0; k--) {
              if($scope.pourcentage[k].value == $scope.myEmp.particularite){
                $scope.monPourc = $scope.pourcentage[k];
                $scope.showMen = true;
              };
            };
          }else if($scope.horaire[i].name == "Spécial"){
            $scope.nbHeure = $scope.myEmp.particularite;
            $scope.showSpe = true;
          };
      };
    };
    //met a jour le champs contrat
    for (var i = $scope.contrat.length - 1; i >= 0; i--) {
      if($scope.contrat[i].name == $scope.myEmp.contrat.nom){
        $scope.monContrat = $scope.contrat[i];
      };
    };
  };

  $scope.retour = function () {
    $location.url("/employe");
  };

  $scope.validationNom = function () {
    if ($scope.myEmp.nom.trim().length < 2) {
      $scope.validations[0].valide = false;
    } else {
      $scope.validations[0].valide = true;
    };
  }

  $scope.validationPrenom = function () {
    if ($scope.myEmp.prenom.trim().length < 2) {
      $scope.validations[1].valide = false;
    } else {
      $scope.validations[1].valide = true;
    };
  }

  $scope.validationAdresse = function () {
    if ($scope.myEmp.adresse.trim().length == 0) {
      $scope.validations[2].valide = false;
    } else {
      $scope.validations[2].valide = true;
    };
  }

  $scope.validationCodePost = function () {
    if ($scope.myEmp.code < 1000 || $scope.myEmp.code > 99999 ) {
      $scope.validations[3].valide = false;
    } else {
      $scope.validations[3].valide = true;
    };
  }

  $scope.validationLocalite = function () {
    if ($scope.myEmp.localite.trim().length == 0) {
      $scope.validations[4].valide = false;
    } else {
      $scope.validations[4].valide = true;
    };
  }

  $scope.validationEmail = function () {
    var patternEmail = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    $scope.validations[5].valide = patternEmail.test($scope.myEmp.mail);
  }

  $scope.validationTelFixe = function () {
    if (isNaN($scope.myEmp.telFixe) || $scope.myEmp.telFixe.length != 10) {
      $scope.validations[13].valide = false;
    } else {
      $scope.validations[13].valide = true;
    };
  }

  $scope.validationTelMobile = function () {
   if (isNaN($scope.myEmp.telMobile) || $scope.myEmp.telMobile.length != 10) {
      $scope.validations[14].valide = false;
    } else {
      $scope.validations[14].valide = true;
    };
  }

  $scope.validationDateNaissance = function () {
    if ($scope.myEmp.dateNaissance == null) {
      $scope.validations[12].valide = false;
    } else {
      $scope.validations[12].valide = true;
    }
  }

  $scope.validationDateEntree = function () {
    if ($scope.myEmp.dateIn == null) {
      $scope.validations[7].valide = false;
    } else {
      $scope.validations[7].valide = true;
    }
  }

  $scope.validation = function () {
    var valideForm = true;
    //attribution des valeurs
    $scope.myEmp.dep.nom = $scope.monDep.name;
    $scope.myEmp.horaire.nom = $scope.monHoraire.name;
    if($scope.monHoraire.name == "Mensuel"){
      $scope.myEmp.particularite = $scope.monPourc.value;
    }else if($scope.monHoraire.name == "Spécial"){
      $scope.myEmp.particularite = $scope.nbHeure;
    }else{
      $scope.myEmp.particularite = 0;
    };
    $scope.myEmp.contrat.nom = $scope.monContrat.name;
    //vérification de la saisie

    $scope.validationNom();
    $scope.validationPrenom();
    $scope.validationAdresse();
    $scope.validationCodePost();
    $scope.validationLocalite();
    $scope.validationEmail();
    $scope.validationDateNaissance();
    $scope.validationTelFixe();
    $scope.validationTelMobile();
    $scope.validationDateEntree();

    if($scope.myEmp.horaire.nom =="Spécial"){
      $scope.validations[10].valide = $scope.myEmp.particularite <= 0 ? false : true;
    }
    
    for (var i = 0; i < $scope.validations.length; i++) {
      //console.log($scope.validations[i].name+" "+$scope.validations[i].valide);
      if(!$scope.validations[i].valide){
        valideForm = false;
        return valideForm; // Dès qu'un champ n'est pas valide 
      };
    };
    return valideForm;
  };


  $scope.enregistrer = function () {
    /* Toutes les validations ont été faites */
    if ($scope.validation()) {
      // Lancer la modification de l'employé 
      NotifService.success('Modification employé', "L'employé n° " + $scope.myEmp.id + " , " + $scope.myEmp.nom + " a été modifié avec succès.");
      $scope.retour();
    }
  }

  // permet d'afficher les champs en plus si on choisi un certain type d'horaire pour l'employé
  $scope.changementHoraire = function(){
    if($scope.monHoraire.name == "Mensuel"){
      $scope.showMen = true; 
      $scope.showSpe = false;
    }else if($scope.monHoraire.name == "Spécial"){
      $scope.showMen = false; 
      $scope.showSpe = true;
    }else {
      $$scope.showMen = false; 
      $scope.showSpe = false;
    };
    
  };
  $scope.changementGenre = function() {
    
    console.log($scope.genres[0]);
    console.log($scope.genres[1]);
  }

});
