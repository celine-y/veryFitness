'use strict';

angular.module('webApp.addExercises', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/addWorkout/:id/addExercises',{
		templateUrl: 'addWorkout/addExercises/addExercises.html',
		controller: 'addExerCtrl'
	});
}])

.controller('addExerCtrl', ['$scope', 'CommonProp', '$firebaseArray', '$firebaseObject', '$location', '$routeParams', function($scope, CommonProp, $firebaseArray, $firebaseObject, $location, $routeParams){
    $scope.username = CommonProp.getUser();
    var workoutId = $routeParams.id;

    // Set default values when not editing exercise
    $scope.exerEditing = {};
    $scope.exerEditing.exerType = 'condition';

	if(!$scope.username){
		$location.path('/home');
	}

    var exerRef = firebase.database().ref().child('Exercises').orderByChild(workoutId).equalTo(true);
    $scope.exercises = $firebaseArray(exerRef);
    
    var workoutRef = firebase.database().ref().child('Workouts').child(workoutId);
    $scope.workout = $firebaseObject(workoutRef);

    $scope.workout.$loaded().then(function(){
        loadWeeks();
    });

    function loadWeeks(){
        if(!$scope.exerEditing.weeks) {
            $scope.exerEditing.weeks = {};
            for(var i = 1; i <= $scope.workout.numWeeks; i++){
                $scope.exerEditing.weeks[i] = {};
            }
        }
    }
    
    $scope.addExercise = function(){
        calculateWeeks();
        var exerciseToAdd = $scope.exerEditing;
        exerciseToAdd[workoutId] = true;

        $scope.exercises.$add(
            exerciseToAdd
        ).then(function(ref){
            showSuccess();
        }, function(error){
            console.log(error);
        });
    };

    $scope.updateExercise = function(id){
        var indexEditExer = $scope.exercises.$indexFor(id);
        $scope.exercises[indexEditExer] = $scope.exerEditing;
        $scope.exercises.$save(indexEditExer).then(function(ref){
            showSuccess();
        }, function(error){
            console.log(error);
        });
    };

    $scope.editExercise = function(id){
        $scope.exerEditing = $scope.exercises[id];
    };

    function defaultForm(){
        $scope.exerEditing = {}
        $scope.exerEditing.exerType = 'condition';
        loadWeeks();
        $scope.exerciseForm.$setPristine();
        $scope.exerciseForm.$setUntouched();
    }

    function showSuccess(){
        $scope.success = true;
        defaultForm();
        window.setTimeout(function(){
            $scope.$apply(function(){
                $scope.success = false;
            });
        }, 2000);
    }

    $scope.delExercise = function(exerciseId){
        $scope.exercises.$remove(exerciseId)
        .then(function(ref){

        }, function(error){
            console.log(error);
        });
    };

    $scope.logout = function(){
		CommonProp.logoutUser();
	};

    function calculateWeeks() {
        if ($scope.exerEditing.exerType == 'condition'){
            setExerPerWeek(5, 10);
        } else if ($scope.exerEditing.exerType == 'strength'){
            setExerPerWeek(5, 4);
        } else if ($scope.exerEditing.exerType == 'maint'){
            setExerPerWeek(3, 12);
        }
    };

    function setExerPerWeek (sets, reps){
        for(var week in $scope.exerEditing.weeks){
            $scope.exerEditing.weeks[week] = {
                sets: sets,
                reps: reps
            };
        }
    };
}])