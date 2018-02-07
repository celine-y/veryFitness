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
    $scope.exerType = 'condition';

	if(!$scope.username){
		$location.path('/home');
	}

    var exerRef = firebase.database().ref().child('Exercises').orderByChild(workoutId).equalTo(true);
    $scope.exercises = $firebaseArray(exerRef);
    
    var workoutRef = firebase.database().ref().child('Workouts').child(workoutId);
    $scope.workout = $firebaseObject(workoutRef);

    $scope.workout.$loaded().then(function(){
        console.log($scope.workout.numWeeks);
        if(!$scope.weeks) {
            $scope.weeks = {};
            for(var i = 1; i <= $scope.workout.numWeeks; i++){
                $scope.weeks[i] = {};
            }
        }
    });

    
    console.log($scope.weeks);
    
    $scope.addExercise = function(){
        var exerciseToAdd = {};

        exerciseToAdd[workoutId] = true;
        exerciseToAdd['name'] = $scope.exerTxt;
        exerciseToAdd['link'] = $scope.linkTxt;
        exerciseToAdd['exerType'] = $scope.exerType;
        exerciseToAdd['weeks'] = calculateWeeks();

        $scope.exercises.$add(
            exerciseToAdd
        ).then(function(ref){
            $scope.success = true;
            // TODO: clear form after
            window.setTimeout(function(){
                $scope.$apply(function(){
                    $scope.success = false;
                });
            }, 2000);
        }, function(error){
            console.log(error);
        });
    };

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
        if ($scope.exerType == 'condition'){
            setExerPerWeek(5, 10);
        } else if ($scope.exerType == 'strength'){
            setExerPerWeek(5, 4);
        } else if ($scope.exerType == 'maint') {
            setExerPerWeek(3, 12);
        } else {
            console.log($scope.weeks);
        }

        return $scope.weeks;
    };

    function setExerPerWeek (sets, reps){
        for(var week in $scope.weeks){
            $scope.weeks[week] = {
                sets: sets,
                reps: reps
            };
        }
    };
}])