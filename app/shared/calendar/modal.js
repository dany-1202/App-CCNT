angular
  .module('ctrlCCNT')
  .factory('alert', function($uibModal) {

    function show(action, event, scope, depSel) {
      return $uibModal.open({
        templateUrl: 'app/shared/calendar/modalContent.html',
        controller: function() {
          var vm = this;
<<<<<<< Updated upstream
          console.log(scope);
=======
>>>>>>> Stashed changes
          vm.persons = angular.copy(scope.persons);
          vm.action = action;
          vm.event = event;

          scope.horaireModif = null;

          vm.toggle = function($event, field, event) {
            $event.preventDefault();
            $event.stopPropagation();
            event[field] = !event[field];
          };

          var getTime = function (time) {
            var objTime = time.split(':');
            return {'heures' : objTime[0], 'minutes' : objTime[1], 'secondes' : objTime[2]};
          }

          var getTimeDate = function (date) {
            return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
          }

          var getDateFin = function (heureDebut, heureFin, date) {
            var dateFin;
            var objTimeDebut = getTime(heureDebut);
            var objTimeFin = getTime(heureFin);

            var beginningTime = moment({
              h: objTimeDebut.heures,
              m: objTimeDebut.minutes,
              s: objTimeDebut.secondes
            });
            var endTime = moment({
              h: objTimeFin.heures,
              m: objTimeFin.minutes,
              s: objTimeFin.secondes
            });

            if (beginningTime.isAfter(endTime)) {
              dateFin = moment(date).add(1, 'days').add(objTimeFin.heures, 'hours').add(objTimeFin.minutes, 'minutes').add(objTimeFin.secondes, 'seconds').toDate();
            } else {
              dateFin = moment(date).add(objTimeFin.heures, 'hours').add(objTimeFin.minutes, 'minutes').add(objTimeFin.secondes, 'seconds').toDate();
            }
            return dateFin;
          }

          var getDatePure = function (date) {
            return new Date(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());
          }

          vm.changeDate = function () {
            var date = getDatePure(event.startsAt);
            var heureDebut = getTimeDate(event.startsAt);
            var heureFin = getTimeDate(event.endsAt);
            var dateFin = getDateFin(heureDebut, heureFin, date);
            vm.event.endsAt = dateFin;
          }

          vm.modifHoraire = function () {
            scope.horaireModif = event;
            
          }
        },
        controllerAs: 'vm'
      });
    }

    return {
      show: show
    };

  });
